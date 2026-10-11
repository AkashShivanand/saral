#!/usr/bin/env node
// Saral confidentiality guard.
// It holds no terms. It reads them from SARAL_GUARD_TERMS (the CI secret) or
// from a file outside the repo. It never prints a term: output names the place
// and the term's number in the private list, because CI logs are public.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';

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

// A term matches when it is not part of a longer word: a letter or digit on
// either side blocks the match; spaces, punctuation, _ and - do not. Words of
// a multi-word term may be split by whitespace (line breaks too), _ or -.
export function compile(terms) {
  return terms.map((t) => {
    const body = t.split(/\s+/).map(escape).join('[\\s_-]+');
    return new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, 'giu');
  });
}

export function scanText(text, patterns, where) {
  const hits = [];
  patterns.forEach((re, i) => {
    for (const m of text.matchAll(re)) {
      hits.push({ where, line: text.slice(0, m.index).split('\n').length, term: i + 1 });
    }
  });
  return hits;
}

export function mask(text, patterns) {
  return patterns.reduce((t, re) => t.replace(re, '***'), text);
}

const git = (args) => execFileSync('git', args, { maxBuffer: 1 << 28 });

const listZ = (args) => git(args).toString('utf8').split('\0').filter(Boolean);

// Binary files are scanned as Latin-1, not skipped: images and PDFs can carry
// plain-text metadata.
const decode = (buf) => buf.toString(buf.includes(0) ? 'latin1' : 'utf8');

function scanFile(path, buf, patterns) {
  const where = mask(path, patterns);
  return [
    ...scanText(path, patterns, `${where} (path)`).map((h) => ({ ...h, line: 0 })),
    ...scanText(decode(buf), patterns, where),
  ];
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
  const hits = [];

  if (mode === '--staged') {
    for (const path of listZ(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'])) {
      hits.push(...scanFile(path, git(['show', `:${path}`]), patterns));
    }
  } else if (mode === '--all') {
    for (const path of listZ(['ls-files', '-z'])) {
      if (existsSync(path)) hits.push(...scanFile(path, readFileSync(path), patterns));
    }
  } else if (mode === '--message' && arg) {
    const text = readFileSync(arg, 'utf8')
      .split('\n')
      .filter((l) => !l.startsWith('#'))
      .join('\n');
    hits.push(...scanText(text, patterns, 'commit message'));
  } else if (mode === '--log' && arg) {
    const out = git(['log', '--format=%H%x01%B%x00', arg]).toString('utf8');
    for (const entry of out.split('\0')) {
      const [sha, body] = entry.replace(/^\n/, '').split('\x01');
      if (sha && body !== undefined) {
        hits.push(...scanText(body, patterns, `commit ${sha.slice(0, 7)} message`));
      }
    }
  } else {
    console.error('usage: guard.mjs --staged | --all | --message <file> | --log <rev-range>');
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
