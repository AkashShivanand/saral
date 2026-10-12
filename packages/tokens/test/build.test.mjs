import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, cpSync, mkdtempSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, buildAll, buildTheme } from '../src/build.mjs';

test('the real token source builds with no problems', () => {
  const { files, errors } = buildAll();
  assert.deepEqual(errors, []);
  assert.deepEqual([...files.keys()].sort(), ['dist/css/kosh.css', 'dist/css/mor.css', 'dist/js/kosh.mjs', 'dist/js/mor.mjs']);
});

test('Saral ships its own themes, Mor and Kosh, and no consumer theme', () => {
  assert.deepEqual(readdirSync(join(ROOT, 'tokens/themes')).sort(), ['kosh', 'mor']);
  for (const theme of ['kosh', 'mor']) {
    const modes = buildTheme(join(ROOT, 'tokens/themes', theme));
    assert.deepEqual(Object.keys(modes), ['light', 'dark'], theme);
  }
});

test('a role missing from one mode stops the build and names theme and mode', () => {
  const root = mkdtempSync(join(tmpdir(), 'saral-build-'));
  cpSync(join(ROOT, 'tokens'), join(root, 'tokens'), { recursive: true });
  const file = join(root, 'tokens/themes/mor/dark.tokens.json');
  const dark = JSON.parse(readFileSync(file, 'utf8'));
  dark.text.quiet = undefined;
  writeFileSync(file, JSON.stringify(dark));
  const { files, errors } = buildAll(root);
  assert.ok(errors.includes('mor: dark: missing role text.quiet'), errors.join('\n'));
  assert.ok(!files.has('dist/css/mor.css'));
});

test('the committed dist matches the token source', () => {
  const r = spawnSync('node', [join(ROOT, 'packages/tokens/src/build.mjs'), '--check'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

function tempTokens() {
  const root = mkdtempSync(join(tmpdir(), 'saral-build-'));
  cpSync(join(ROOT, 'tokens'), join(root, 'tokens'), { recursive: true });
  return root;
}

test('a Finder .DS_Store file among the themes is ignored', () => {
  const root = tempTokens();
  writeFileSync(join(root, 'tokens/themes/.DS_Store'), 'x');
  assert.deepEqual(buildAll(root).errors, []);
});

test('a hand-edited hex that no longer matches its components is named by mode and path', () => {
  const root = tempTokens();
  const file = join(root, 'tokens/themes/mor/light.tokens.json');
  const light = JSON.parse(readFileSync(file, 'utf8'));
  light.surface.ground.$value.hex = '#000000';
  light.text.default.$value.hex = '#ffffff';
  writeFileSync(file, JSON.stringify(light));
  const { errors } = buildAll(root);
  assert.ok(errors.some((e) => e.startsWith('mor: light: surface.ground: hex #000000 does not match components')), errors.join('\n'));
  assert.ok(errors.some((e) => e.startsWith('mor: light: text.default: hex #ffffff does not match components')), errors.join('\n'));
});
