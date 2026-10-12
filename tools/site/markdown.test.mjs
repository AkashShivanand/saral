import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, slug } from './markdown.mjs';

test('headings get ids, paragraphs join their lines', () => {
  const html = renderMarkdown('## 2026-10-12: v0.2.1, field errors\n\nOne line\nand the next.');
  assert.match(html, /<h2 id="2026-10-12-v0-2-1-field-errors">2026-10-12: v0\.2\.1, field errors<\/h2>/);
  assert.match(html, /<p>One line and the next\.<\/p>/);
});

test('bullets, numbered lists, code, bold and links', () => {
  const html = renderMarkdown('- one `a<b>`\n- **two** and [docs](x.md)\n\n1. first\n2. second');
  assert.match(html, /<ul><li>one <code>a&lt;b&gt;<\/code><\/li><li><strong>two<\/strong> and <a [^>]*href="x\.md">docs<\/a><\/li><\/ul>/);
  assert.match(html, /<ol><li>first<\/li><li>second<\/li><\/ol>/);
});

test('a wrapped bullet continues the same item', () => {
  assert.match(renderMarkdown('- one\n  more\n- two'), /<li>one more<\/li><li>two<\/li>/);
});

test('fenced code is escaped and kept as written', () => {
  assert.match(renderMarkdown('```html\n<p hidden>x</p>\n```'), /<pre><code>&lt;p hidden&gt;x&lt;\/p&gt;<\/code><\/pre>/);
});

test('tables become table markup', () => {
  const html = renderMarkdown('| A | B |\n|---|---|\n| 1 | `2` |');
  assert.match(html, /<table><thead><tr><th>A<\/th><th>B<\/th><\/tr><\/thead><tbody><tr><td>1<\/td><td><code>2<\/code><\/td><\/tr><\/tbody><\/table>/);
});

test('raw HTML in the text is escaped, never rendered', () => {
  assert.equal(renderMarkdown('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
});

test('links can be rewritten, for example .md to .html', () => {
  assert.match(renderMarkdown('[a](docs/x.md)', { link: (u) => u.replace(/\.md$/, '.html') }), /href="docs\/x\.html"/);
});

test('slug makes a safe id', () => {
  assert.equal(slug('2026-10-12: Saral\'s own themes only'), '2026-10-12-saral-s-own-themes-only');
});
