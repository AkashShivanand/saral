#!/usr/bin/env node
// Saral confidentiality guard.
// It holds no terms. It reads them from SARAL_GUARD_TERMS (the CI secret) or
// from a file outside the repo. It never prints a term: output names the place
// and the term's number in the private list, because CI logs are public.
import { readFileSync, existsSync } from 'node:fs';
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
