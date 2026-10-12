import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../tokens/src/build.mjs';

const dir = join(ROOT, 'specs');
const specs = existsSync(dir)
  ? readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => ({ f, s: JSON.parse(readFileSync(join(dir, f), 'utf8')) }))
  : [];
const REQUIRED = ['name', 'status', 'since', 'purpose', 'whenToUse', 'whenNotToUse', 'anatomy', 'states', 'props', 'keyboard', 'accessibility', 'tokens', 'content', 'examples', 'screenReaderLog'];

test('there is a spec for every component', () => {
  assert.deepEqual(specs.map((x) => x.f).sort(), ['button.json', 'card.json', 'checkbox.json', 'field.json', 'link.json', 'notice.json', 'radio.json', 'select.json', 'tag.json']);
});

test('every spec has every required field, and says when not to use it', () => {
  for (const { f, s } of specs) {
    for (const k of REQUIRED) assert.ok(k in s, `${f}: ${k}`);
    assert.ok(Array.isArray(s.whenNotToUse) && s.whenNotToUse.length > 0, `${f}: whenNotToUse is empty`);
    for (const w of s.whenNotToUse) assert.ok(w.instead, `${f}: a whenNotToUse entry has no alternative`);
  }
});

test('a stable component has a dated screen-reader pass', () => {
  for (const { f, s } of specs) if (s.status === 'stable') assert.ok(s.screenReaderLog.length > 0, f);
});

test('every part in a spec is styled by its component CSS, and every token it lists is used there', () => {
  for (const { f, s } of specs) {
    const css = readFileSync(join(ROOT, 'packages/css/src', f.replace('.json', '.css')), 'utf8');
    for (const p of s.anatomy) assert.ok(css.includes(`[data-part="${p.part}"]`), `${f}: part ${p.part}`);
    for (const t of s.tokens) assert.ok(css.includes(`--saral-${t.replaceAll('.', '-')}`), `${f}: token ${t}`);
  }
});

test('every example a spec points to exists', () => {
  for (const { f, s } of specs) for (const e of s.examples) assert.ok(existsSync(join(ROOT, e)), `${f}: ${e}`);
});
