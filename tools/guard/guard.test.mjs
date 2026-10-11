import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTerms, loadTerms, compile, scanText, scanBuffer, mask } from './guard.mjs';

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

// Final review fixes

test('code-style spellings match: camelCase, PascalCase, joined, dotted, slashed', () => {
  for (const s of ['zebracorpPortal', 'getZebracorpData', 'ZebraCorpAPI', 'v2Zebracorp', 'BlueHeron', 'blueheron', 'blue.heron', 'blue/heron']) {
    assert.equal(hitsIn(s).length, 1, s);
  }
});

test('an all-caps longer word still does not match', () => {
  assert.equal(hitsIn('ZEBRACORPX').length, 0);
});

test('list entries written with - or _ match every spelling', () => {
  const p = compile(['blue-heron', 'zebra_corp']);
  for (const s of ['blue heron', 'blue_heron', 'zebra corp', 'zebra-corp']) {
    assert.equal(scanText(s, p, 'f').length, 1, s);
  }
});

test('binary: a PNG text chunk is caught even when its CRC bytes are letters', () => {
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 20]),
    Buffer.from('tEXtAuthor\0for zebracorp'),
    Buffer.from('AbCd'),
  ]);
  assert.ok(scanBuffer(png, patterns, 'img.png').length >= 1);
});

test('binary: UTF-16 text is caught in both byte orders and at odd offsets', () => {
  const be = Buffer.from('\0zebracorp', 'utf16le').swap16();
  const pdf = Buffer.concat([Buffer.from('%PDF-1.7\n/Author ('), Buffer.from([0xfe, 0xff]), be, Buffer.from(')')]);
  assert.ok(scanBuffer(pdf, patterns, 'a.pdf').length >= 1);
  const le = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from('notes on blue heron\n', 'utf16le')]);
  assert.ok(scanBuffer(le, patterns, 'a.txt').length >= 1);
});

test('text files keep word edges', () => {
  assert.equal(scanBuffer(Buffer.from('zebracorpx\n'), patterns, 'a.md').length, 0);
});

test('an all-caps name running into a capitalised word matches', () => {
  for (const s of ['ZEBRACORPPortal', 'APIZebracorp', 'BLUEHERONApp']) {
    assert.equal(hitsIn(s).length, 1, s);
  }
});
