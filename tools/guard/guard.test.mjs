import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTerms, loadTerms, compile, scanText, mask } from './guard.mjs';

const patterns = compile(['zebracorp', 'blue heron']);
const hitsIn = (text) => scanText(text, patterns, 'f');

test('parseTerms drops blank lines and # comments, trims spaces', () => {
  assert.deepEqual(parseTerms('# list\n\n  zebracorp \nblue heron\n'), ['zebracorp', 'blue heron']);
});

test('loadTerms prefers SARAL_GUARD_TERMS over a file', () => {
  assert.deepEqual(loadTerms({ SARAL_GUARD_TERMS: 'zebracorp\n' }), ['zebracorp']);
});

test('loadTerms returns [] when the file does not exist', () => {
  assert.deepEqual(loadTerms({ SARAL_GUARD_TERMS_FILE: '/nonexistent/saral-terms.txt' }), []);
});

test('matches in any case', () => {
  assert.equal(hitsIn('Built for ZebraCorp in 2025').length, 1);
});

test('matches next to punctuation, underscore and hyphen', () => {
  for (const s of ['(zebracorp)', 'zebracorp_portal', 'zebracorp-portal', 'zebracorp.', 'x/zebracorp/y']) {
    assert.equal(hitsIn(s).length, 1, s);
  }
});

test('does not match inside a longer word', () => {
  for (const s of ['zebracorpx', 'xzebracorp', 'zebracorp2']) {
    assert.equal(hitsIn(s).length, 0, s);
  }
});

test('multi-word terms match across space, hyphen, underscore and line breaks', () => {
  for (const s of ['blue heron', 'Blue-Heron', 'blue_heron', 'blue\nheron', 'blue   heron']) {
    assert.equal(hitsIn(s).length, 1, JSON.stringify(s));
  }
});

test('reports the 1-based line and term number', () => {
  assert.deepEqual(hitsIn('ok\nok\nsee blue heron'), [{ where: 'f', line: 3, term: 2 }]);
});

test('mask hides every match', () => {
  assert.equal(mask('docs/zebracorp-notes/ZEBRACORP.md', patterns), 'docs/***-notes/***.md');
});
