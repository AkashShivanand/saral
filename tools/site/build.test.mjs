import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { buildSite, ROOT } from './build.mjs';
import mor from '../../dist/js/mor.mjs';

const out = mkdtempSync(join(tmpdir(), 'saral-site-'));
const { pages } = buildSite({ out });
const specs = readdirSync(join(ROOT, 'specs')).map((f) => f.replace('.json', ''));
const read = (p) => readFileSync(join(out, p), 'utf8');

test('there is a page for the overview, changes, tokens, decisions, and every component', () => {
  for (const p of ['index.html', 'changes.html', 'tokens.html', 'decisions.html', ...specs.map((s) => `components/${s}.html`)]) {
    assert.ok(pages.includes(p), p);
  }
});

test('every page loads the theme, component and portal styles, and they exist', () => {
  for (const p of pages) {
    const html = read(p);
    for (const css of ['mor.css', 'kosh.css', 'components.css', 'site.css']) {
      const m = html.match(new RegExp(`href="([^"]*${css.replace('.', '\\.')})"`));
      assert.ok(m, `${p}: ${css}`);
      assert.ok(existsSync(resolve(dirname(join(out, p)), m[1])), `${p}: ${m[1]}`);
    }
  }
});

test('every internal link and script points to a file that exists', () => {
  for (const p of pages) {
    for (const [, url] of read(p).matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
      if (/^(https?:|mailto:|data:)/.test(url)) continue;
      assert.ok(existsSync(resolve(dirname(join(out, p)), url)), `${p}: ${url}`);
    }
  }
});

test('the changes page shows the current release', () => {
  const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  assert.ok(read('changes.html').includes(`v${version}`));
  assert.ok(read('index.html').includes(`v${version}`));
});

test('every component page shows live examples in Saral markup, and its spec', () => {
  for (const s of specs) {
    const html = read(`components/${s}.html`);
    assert.ok(html.includes(`data-scope="${s}"`), s);
    assert.ok(html.includes('When not to use'), s);
    assert.ok(html.includes('Accessibility'), s);
  }
});

test('the tokens page shows every contrast pair with its ratio, for every theme and mode', () => {
  const html = read('tokens.html');
  const pairs = JSON.parse(readFileSync(join(ROOT, 'tokens/pairs.json'), 'utf8')).pairs;
  assert.equal((html.match(/data-pair=/g) ?? []).length, pairs.length * 2 * 2);
  assert.ok(/\d+\.\d\d:1/.test(html));
});

test('no page uses an em dash', () => {
  for (const p of pages) assert.equal(read(p).includes('—'), false, p);
});

test('the portal stylesheet uses tokens only', () => {
  const css = readFileSync(join(ROOT, 'site/src/site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const raw = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|\b(?:white|black|red|green|blue|gray|grey|orange|yellow|purple|pink)\b/i;
  assert.equal(css.match(raw), null);
  const known = new Set(Object.keys(mor.light).map((p) => `--saral-${p.replaceAll('.', '-')}`));
  for (const [, name] of css.matchAll(/var\((--saral-[\w-]+)/g)) assert.ok(known.has(name), name);
});
