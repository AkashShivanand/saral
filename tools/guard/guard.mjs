#!/usr/bin/env node
// Saral confidentiality guard.
// It holds no terms. It reads them from SARAL_GUARD_TERMS (the CI secret) or
// from a file outside the repo. It never prints a term: output names the place
// and the term's number in the private list, because CI logs are public.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const DEFAULT_TERMS_FILE = join(homedir(), '.config', 'saral', 'private-terms.txt');

export function parseTerms(raw) {
  return raw
    .split(/\r?\n/)
    .map((t) => t.trim())
    .filter((t) => t && !t.startsWith('#'));
}

export function loadTerms(env = process.env) {
  if (env.SARAL_GUARD_TERMS) return parseTerms(env.SARAL_GUARD_TERMS);
  const file = env.SARAL_GUARD_TERMS_FILE || DEFAULT_TERMS_FILE;
  return existsSync(file) ? parseTerms(readFileSync(file, 'utf8')) : [];
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Terms match in any case. The words of a term may be joined directly or split
// by whitespace (line breaks too), _, ., / or -, however the list writes them:
// "blue heron" and "blue-heron" both catch BlueHeron, blue.heron and blue_heron.
export function compile(terms) {
  return terms.map(
    (t) => new RegExp(t.split(/[\s_./-]+/).filter(Boolean).map(escape).join('[\\s_./-]*'), 'giu'),
  );
}

const isAlnum = (c) => c !== undefined && /[\p{L}\p{N}]/u.test(c);
const isUpper = (c) => c !== undefined && /\p{Lu}/u.test(c);
const isLower = (c) => c !== undefined && /\p{Ll}/u.test(c);

// In text, a match counts only at word edges, so zebracorpx and ZEBRACORPX are
// not hits. An edge is anything that is not a letter or digit, a step up into
// a capital (getZebracorpData, ZebraCorpAPI), or the start of a capitalised
// word after capitals (ZEBRACORPPortal, APIZebracorp).
function atEdges(text, start, end) {
  const prev = text[start - 1];
  const next = text[end];
  const before =
    !isAlnum(prev) || (isUpper(text[start]) && (!isUpper(prev) || isLower(text[start + 1])));
  const after = !isAlnum(next) || (isUpper(next) && (!isUpper(text[end - 1]) || isLower(text[end + 1])));
  return before && after;
}

function lineStarts(text) {
  const starts = [0];
  for (let i = text.indexOf('\n'); i !== -1; i = text.indexOf('\n', i + 1)) starts.push(i + 1);
  return starts;
}

function lineOf(starts, index) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= index) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}

export function scanText(text, patterns, where, { edges = true } = {}) {
  const hits = [];
  let starts;
  patterns.forEach((re, i) => {
    for (const m of text.matchAll(re)) {
      if (edges && !atEdges(text, m.index, m.index + m[0].length)) continue;
      starts ??= lineStarts(text);
      hits.push({ where, line: lineOf(starts, m.index), term: i + 1 });
    }
  });
  return hits;
}

export function mask(text, patterns) {
  return patterns.reduce((t, re) => t.replace(re, '***'), text);
}

// A file with no NUL byte is text and keeps word edges. Anything else is
// binary: it is read as Latin-1 (PNG text chunks, PDF strings) and as UTF-16
// in both byte orders at both alignments, and matched without word edges,
// because the bytes around a name in a binary file are arbitrary and a false
// alarm there is cheap. One hit per term, reported on line 0.
export function scanBuffer(buf, patterns, where) {
  if (!buf.includes(0)) return scanText(buf.toString('utf8'), patterns, where);
  const even = (b) => b.subarray(0, b.length - (b.length % 2));
  const views = [buf.toString('latin1')];
  for (const b of [buf, buf.subarray(1)]) {
    views.push(even(b).toString('utf16le'), Buffer.from(even(b)).swap16().toString('utf16le'));
  }
  const terms = new Set();
  for (const v of views) for (const h of scanText(v, patterns, where, { edges: false })) terms.add(h.term);
  return [...terms].map((term) => ({ where, line: 0, term }));
}

const git = (args, input) =>
  execFileSync('git', args, { input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'ignore'] });

const listZ = (args) => git(args).toString('utf8').split('\0').filter(Boolean);

function readObjects(shas, mode = '--batch') {
  const out = git(['cat-file', mode], shas.join('\n') + '\n');
  const objects = new Map();
  let pos = 0;
  while (pos < out.length) {
    const nl = out.indexOf(10, pos);
    const [sha, type, size] = out.subarray(pos, nl).toString('utf8').split(' ');
    pos = nl + 1;
    if (type === 'missing' || mode !== '--batch') {
      objects.set(sha, { type });
      continue;
    }
    objects.set(sha, { type, data: out.subarray(pos, pos + Number(size)) });
    pos += Number(size) + 1;
  }
  return objects;
}

// Scans what git stores, not the working tree, so a link is scanned by its
// target path even when the target does not exist. Submodules (160000) are
// scanned by path only.
function scanIndex(onlyPaths, patterns) {
  const entries = listZ(['ls-files', '-s', '-z']).map((e) => {
    const tab = e.indexOf('\t');
    const [mode, sha] = e.slice(0, tab).split(' ');
    return { mode, sha, path: e.slice(tab + 1) };
  });
  const chosen = onlyPaths ? entries.filter((e) => onlyPaths.has(e.path)) : entries;
  const blobs = readObjects([...new Set(chosen.filter((e) => e.mode !== '160000').map((e) => e.sha))]);
  const hits = [];
  for (const e of chosen) {
    const where = mask(e.path, patterns);
    hits.push(...scanText(e.path, patterns, `${where} (path)`).map((h) => ({ ...h, line: 0 })));
    if (e.mode !== '160000') hits.push(...scanBuffer(blobs.get(e.sha).data, patterns, where));
  }
  return hits;
}

// Every file version and path reachable from rev, so a name removed in a
// later commit is still found. Each version is scanned once.
function scanHistory(rev, patterns) {
  const objects = git(['rev-list', '--objects', rev])
    .toString('utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => ({ sha: l.slice(0, 40), path: l.slice(41) }));
  const hits = [];
  for (const path of new Set(objects.map((o) => o.path).filter(Boolean))) {
    hits.push(...scanText(path, patterns, `history path ${mask(path, patterns)}`).map((h) => ({ ...h, line: 0 })));
  }
  const types = readObjects(objects.map((o) => o.sha), '--batch-check');
  const blobs = objects.filter((o) => types.get(o.sha)?.type === 'blob');
  const data = readObjects([...new Set(blobs.map((o) => o.sha))]);
  const seen = new Set();
  for (const o of blobs) {
    if (seen.has(o.sha)) continue;
    seen.add(o.sha);
    const where = `history ${mask(o.path, patterns)} @${o.sha.slice(0, 7)}`;
    hits.push(...scanBuffer(data.get(o.sha).data, patterns, where));
  }
  return hits;
}

function configValue(key) {
  try {
    return git(['config', '--get', key]).toString('utf8').trim();
  } catch {
    return '';
  }
}

// Drops the lines git itself strips: comment lines (by core.commentString or
// core.commentChar, "#" by default, any of git's candidates for "auto") and
// everything from the `git commit -v` cut line down.
function messageText(raw) {
  const prefix = configValue('core.commentString') || configValue('core.commentChar') || '#';
  const isComment = prefix === 'auto' ? (l) => /^[#;@!$%^&|:]/.test(l) : (l) => l.startsWith(prefix);
  let lines = raw.split('\n');
  const cut = lines.findIndex((l) => isComment(l) && / -+ >8 -+$/.test(l));
  if (cut !== -1) lines = lines.slice(0, cut);
  return lines.filter((l) => !isComment(l)).join('\n');
}

// Commit messages with author and committer names and emails, then every
// ref name and its contents (annotated tag messages included).
function scanLog(rev, patterns) {
  const hits = [];
  const out = git(['log', '--format=%H%x01%an%n%ae%n%cn%n%ce%n%B%x00', rev]).toString('utf8');
  for (const raw of out.split('\0')) {
    const entry = raw.replace(/^\n/, '');
    const at = entry.indexOf('\x01');
    if (at === -1) continue;
    hits.push(...scanText(entry.slice(at + 1), patterns, `commit ${entry.slice(0, 7)} message`));
  }
  const refs = git(['for-each-ref', '--format=%(refname)%01%(contents)%00']).toString('utf8');
  for (const raw of refs.split('\0')) {
    const entry = raw.replace(/^\n/, '');
    const at = entry.indexOf('\x01');
    if (at === -1) continue;
    const name = entry.slice(0, at);
    const where = `ref ${mask(name, patterns)}`;
    hits.push(...scanText(name, patterns, where).map((h) => ({ ...h, line: 0 })));
    hits.push(...scanText(entry.slice(at + 1), patterns, where));
  }
  return hits;
}

export function run(argv, env = process.env) {
  const terms = loadTerms(env);
  if (terms.length === 0) {
    const file = env.SARAL_GUARD_TERMS_FILE || DEFAULT_TERMS_FILE;
    console.error(`guard: no private term list. Set SARAL_GUARD_TERMS or create ${file}, one term per line.`);
    return 2;
  }
  const patterns = compile(terms);
  const [mode, arg] = argv;
  let hits;

  if (mode === '--staged') {
    hits = scanIndex(new Set(listZ(['diff', '--cached', '--name-only', '--diff-filter=d', '-z'])), patterns);
  } else if (mode === '--all') {
    hits = scanIndex(null, patterns);
  } else if (mode === '--history' && arg) {
    hits = scanHistory(arg, patterns);
  } else if (mode === '--message' && arg) {
    hits = scanText(messageText(readFileSync(arg, 'utf8')), patterns, 'commit message');
  } else if (mode === '--log' && arg) {
    hits = scanLog(arg, patterns);
  } else {
    console.error('usage: guard.mjs --staged | --all | --history <rev> | --message <file> | --log <rev-range>');
    return 2;
  }

  for (const h of hits) console.error(`guard: ${h.where}:${h.line} matches private term #${h.term}`);
  if (hits.length) {
    console.error('guard: blocked. Remove the private name and try again. Do not use --no-verify.');
    return 1;
  }
  console.log('guard: clean');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(run(process.argv.slice(2)));
}
