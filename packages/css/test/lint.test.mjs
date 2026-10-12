import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../tokens/src/build.mjs';
import mor from '../../../dist/js/mor.mjs';

const dir = join(ROOT, 'packages/css/src');
const files = readdirSync(dir).filter((f) => f.endsWith('.css'));
const read = (f) => readFileSync(join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const known = new Set(Object.keys(mor.light).map((p) => `--saral-${p.replaceAll('.', '-')}`));

test('there is component CSS to check', () => {
  assert.deepEqual(files.sort(), ['button.css', 'field.css', 'link.css', 'notice.css']);
});

test('component CSS uses no raw colours', () => {
  const raw = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|\b(?:white|black|red|green|blue|gray|grey|orange|yellow|purple|pink)\b/i;
  for (const f of files) assert.equal(read(f).match(raw), null, f);
});

test('every --saral variable used exists in the tokens', () => {
  for (const f of files) {
    for (const [, name] of read(f).matchAll(/var\((--saral-[\w-]+)/g)) assert.ok(known.has(name), `${f}: ${name}`);
  }
});

test('every rule is in the components layer and wrapped in :where()', () => {
  for (const f of files) {
    const css = read(f);
    assert.ok(css.trimStart().startsWith('@layer saral.components {'), f);
    for (const line of css.split('\n')) {
      const t = line.trim();
      if (t.endsWith('{') && !t.startsWith('@')) assert.ok(t.startsWith(':where('), `${f}: ${t}`);
    }
  }
});
