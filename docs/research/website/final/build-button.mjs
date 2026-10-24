#!/usr/bin/env node
// Builds one real Button docs page per finalist direction, so the two can be
// judged on the page Saral will ship most: a component page. Content comes from
// specs/button.json and CHANGELOG.md; components are dist/css; colours are the
// finalists' full role sets from palettes.json (checked by palettes.mjs). The
// two pages share markup and differ only in their identity stylesheet.
// Run: node docs/research/website/final/palettes.mjs && node docs/research/website/final/build-button.mjs
// View through `npm run serve` at /docs/research/website/final/<name>-button.html
import { readFileSync, writeFileSync } from 'node:fs';

const here = (f) => new URL(f, import.meta.url);
const root = (f) => new URL(`../../../../${f}`, import.meta.url);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const code = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const spec = JSON.parse(readFileSync(root('specs/button.json'), 'utf8'));
const palettes = JSON.parse(readFileSync(here('palettes.json'), 'utf8'));
const dist = (f) => readFileSync(root(`dist/css/${f}`), 'utf8').replace(/^\/\*.*?\*\/\n/, '');
const version = JSON.parse(readFileSync(root('package.json'), 'utf8')).version;

// Changelog entries that name the Button, newest first.
const changes = readFileSync(root('CHANGELOG.md'), 'utf8').split(/^## /m).slice(1)
  .map((block) => ({ date: block.slice(0, 10), lines: block.split('\n').filter((l) => l.startsWith('- ') && /\bbutton\b/i.test(l)) }))
  .filter((c) => c.lines.length).slice(0, 3);

// The same label in six scripts, words shared with the claim mock so the
// trimmed fonts already hold every glyph.
const SCRIPTS = [['en', 'ltr', 'Continue'], ['hi', 'ltr', 'आगे बढ़ें'], ['ta', 'ltr', 'தொடரவும்'], ['ar', 'rtl', 'متابعة'], ['th', 'ltr', 'ดำเนินการต่อ'], ['ja', 'ltr', '次へ']];
const COMPONENTS = ['Button', 'Card', 'Checkbox', 'Field', 'Link', 'Notice', 'Radio group', 'Select', 'Tag'];
const TOC = [['example', 'Example'], ['when', 'When to use it'], ['anatomy', 'Anatomy'], ['states', 'States'], ['api', 'API and tokens'], ['accessibility', 'Accessibility'], ['writing', 'Writing'], ['changes', 'Recent changes']];

const FONTS = {
  eczar: ['Saral Display', 'eczar-latin.woff', '500 800', 'U+0000-00FF, U+2013-2014, U+2018-201D, U+2026'],
  anek: ['Saral Text', 'anek-latin.woff', '400 700', 'U+0000-00FF, U+2013-2014, U+2018-201D, U+2026, U+20B9'],
  scripts: [
    ['Saral Text', 'anek-devanagari.woff', '400 700', 'U+0900-097F, U+1CD0-1CFF, U+200C-200D, U+25CC, U+A8E0-A8FF'],
    ['Saral Text', 'anek-tamil.woff', '400 700', 'U+0B80-0BFF, U+200C-200D, U+25CC'],
    ['Saral Text', 'noto-arabic.woff', '400 700', 'U+0600-06FF, U+0750-077F, U+200C-200F, U+FB50-FDFF, U+FE70-FEFF'],
    ['Saral Text', 'noto-thai.woff', '400 700', 'U+0E00-0E7F, U+200C-200D'],
    ['Saral Text', 'noto-jp.woff', '400 700', 'U+3000-303F, U+3040-309F, U+30A0-30FF, U+4E00-9FFF, U+FF00-FFEF'],
  ],
};
const face = ([family, file, weight, range]) => `@font-face { font-family: "${family}"; src: url("../fonts/${file}") format("woff"); font-weight: ${weight}; font-display: swap; unicode-range: ${range}; }`;

const roles = (colours) => Object.keys(colours.light).map((r) => `--saral-${r.replaceAll('.', '-')}: light-dark(${colours.light[r]}, ${colours.dark[r]});`).join('\n  ');

// Shared layout. Every value is a Saral token or derived from one.
const BASE = `
* { box-sizing: border-box; }
html { color-scheme: light dark; }
body { margin: 0; background: var(--saral-surface-ground); color: var(--saral-text-default); font-family: var(--saral-font-family-sans); font-size: var(--saral-font-size-body); line-height: var(--saral-font-leading-body); }
a { color: var(--link); text-underline-offset: 0.18em; }
:focus-visible { outline: var(--saral-focus-width) solid var(--saral-border-focus); outline-offset: 2px; }
.skip { position: absolute; inset-inline-start: var(--saral-space-4); inset-block-start: -100px; padding: var(--saral-space-2) var(--saral-space-4); background: var(--saral-surface-raised); color: var(--saral-text-default); z-index: 2; }
.skip:focus { inset-block-start: var(--saral-space-2); }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 var(--saral-space-5); }
.bar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--saral-space-3) var(--saral-space-5); padding-block: var(--saral-space-4); }
.brand { color: inherit; text-decoration: none; }
.top nav ul { display: flex; flex-wrap: wrap; gap: var(--saral-space-1) var(--saral-space-4); list-style: none; margin: 0; padding: 0; font-size: var(--saral-font-size-small); }
.top nav a { color: var(--saral-text-muted); text-decoration: none; display: inline-block; padding-block: var(--saral-space-1); }
.top nav a[aria-current] { color: var(--saral-text-default); font-weight: var(--saral-font-weight-bold); }
@media (hover: hover) { .top nav a:hover, .side a:hover { color: var(--saral-text-default); text-decoration: underline; } }
.search { margin-inline-start: auto; font-size: var(--saral-font-size-small); }
.layout { display: grid; gap: var(--saral-space-6); grid-template-columns: minmax(0, 1fr); padding-block: var(--saral-space-6) var(--saral-space-8); }
@media (min-width: 900px) { .layout { grid-template-columns: 180px minmax(0, 1fr); } }
@media (min-width: 1180px) { .layout { grid-template-columns: 180px minmax(0, 1fr) 170px; } }
.side ul, .toc ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--saral-space-1); font-size: var(--saral-font-size-small); }
.side a, .toc a { color: var(--saral-text-muted); text-decoration: none; display: block; padding-block: var(--saral-space-1); }
.side a[aria-current] { color: var(--saral-text-default); font-weight: var(--saral-font-weight-bold); }
.side h2, .toc h2 { font-family: var(--saral-font-family-sans); font-size: var(--saral-font-size-small); font-weight: var(--saral-font-weight-bold); margin: 0 0 var(--saral-space-2); }
.side .wide { display: none; }
.side details summary { cursor: pointer; font-size: var(--saral-font-size-small); font-weight: var(--saral-font-weight-bold); min-height: var(--saral-size-control); display: flex; align-items: center; }
@media (min-width: 900px) { .side .wide { display: block; position: sticky; top: var(--saral-space-5); } .side details { display: none; } }
.toc { display: none; }
@media (min-width: 1180px) { .toc { display: block; } .toc > div { position: sticky; top: var(--saral-space-5); } }
main { min-width: 0; }
main > section { padding-block: var(--saral-space-6); }
main > header { padding-bottom: var(--saral-space-5); }
h1, h2, h3 { line-height: var(--saral-font-leading-tight); margin: 0 0 var(--saral-space-4); text-wrap: balance; }
h3 { font-size: var(--saral-font-size-h3); }
p { margin: 0 0 var(--saral-space-4); max-width: 42em; }
.lead { font-size: var(--saral-font-size-lead); color: var(--saral-text-muted); }
.meta { display: flex; flex-wrap: wrap; gap: var(--saral-space-2) var(--saral-space-6); margin: var(--saral-space-5) 0 var(--saral-space-4); padding: 0; }
.meta div { display: grid; }
.meta dt { font-size: var(--saral-font-size-small); color: var(--saral-text-muted); }
.meta dd { margin: 0; font-weight: var(--saral-font-weight-medium); }
.links { display: flex; flex-wrap: wrap; gap: var(--saral-space-2) var(--saral-space-5); font-size: var(--saral-font-size-small); list-style: none; padding: 0; margin: 0; }
.stage { display: flex; flex-wrap: wrap; gap: var(--saral-space-3); align-items: center; padding: var(--saral-space-7) var(--saral-space-5); background: var(--saral-surface-raised); border: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.scripts { border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-top: 0; background: var(--saral-surface-raised); }
.scripts summary { cursor: pointer; padding: var(--saral-space-3) var(--saral-space-5); min-height: var(--saral-size-control); display: flex; align-items: center; font-size: var(--saral-font-size-small); font-weight: var(--saral-font-weight-medium); }
.scripts summary::before { content: ""; inline-size: 0.45em; block-size: 0.45em; border-inline-end: 2px solid currentColor; border-block-end: 2px solid currentColor; transform: rotate(-45deg); margin-inline-end: var(--saral-space-3); }
.scripts summary:dir(rtl)::before { transform: rotate(135deg); }
.scripts[open] summary::before { transform: rotate(45deg); }
.scripts .row { display: flex; flex-wrap: wrap; gap: var(--saral-space-3); padding: 0 var(--saral-space-5) var(--saral-space-5); }
pre { margin: 0; padding: var(--saral-space-4) var(--saral-space-5); overflow-x: auto; background: var(--saral-surface-sunken); border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-top: 0; font-size: var(--saral-font-size-small); line-height: 1.6; }
code { font-family: var(--mono); font-size: 0.92em; }
.two { display: grid; gap: var(--saral-space-5); grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.two ul { margin: 0; padding-inline-start: var(--saral-space-5); }
.two li { margin-bottom: var(--saral-space-2); }
.scroll { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font-size: var(--saral-font-size-small); }
caption { text-align: start; color: var(--saral-text-muted); padding-bottom: var(--saral-space-2); }
th, td { text-align: start; vertical-align: top; padding: var(--saral-space-3); border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
th { font-weight: var(--saral-font-weight-bold); }
.swatch { display: inline-block; inline-size: 1em; block-size: 1em; vertical-align: -0.15em; margin-inline-end: var(--saral-space-2); border: 1px solid var(--saral-border-strong); }
.platforms { display: grid; gap: var(--saral-space-4); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin: 0; }
.platforms dt { font-weight: var(--saral-font-weight-bold); }
.platforms dd { margin: 0; color: var(--saral-text-muted); }
.say { display: grid; gap: var(--saral-space-3); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.say > div { padding: var(--saral-space-4); background: var(--saral-surface-raised); border: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.say strong { display: block; margin-bottom: var(--saral-space-2); font-size: var(--saral-font-size-small); }
.changes { list-style: none; margin: 0; padding: 0; }
.changes li { display: grid; gap: var(--saral-space-1) var(--saral-space-5); padding-block: var(--saral-space-3); border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
@media (min-width: 720px) { .changes li { grid-template-columns: 110px minmax(0, 1fr); } }
.changes time { color: var(--saral-text-muted); font-variant-numeric: tabular-nums; }
footer { border-top: var(--saral-size-stroke) solid var(--saral-border-hairline); font-size: var(--saral-font-size-small); color: var(--saral-text-muted); }
footer .bar { padding-block: var(--saral-space-5); }
a[data-scope="button"] { text-decoration: none; }
@media (forced-colors: active) { .stage, .scripts, pre, .say > div { border-color: CanvasText; } .swatch { forced-color-adjust: none; } }
`;

// Identity layers: the only part that differs between the finalists.
const DIRECTIONS = {
  neel: {
    title: 'Neel',
    fonts: [FONTS.eczar, FONTS.anek],
    preload: 'anek-latin.woff',
    vars: `--saral-font-family-sans: "Saral Text", ui-sans-serif, system-ui, sans-serif; --display: "Saral Display", Georgia, serif; --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace; --saral-radius-control: 8px; --saral-radius-box: 10px; --link: var(--saral-action-default);`,
    css: `
.top { background: var(--saral-surface-raised); border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.brand { font: 700 26px/1 var(--display); }
h1, h2 { font-family: var(--display); font-weight: 600; }
h1 { font-size: clamp(40px, 1.6rem + 3vw, 68px); margin-bottom: var(--saral-space-3); }
h2 { font-size: clamp(26px, 1.1rem + 1.2vw, 36px); }
.eyebrow { margin: 0 0 var(--saral-space-2); font-size: var(--saral-font-size-small); letter-spacing: 0.08em; text-transform: uppercase; color: var(--saral-action-default); font-weight: var(--saral-font-weight-medium); }
.stage { border-radius: var(--saral-radius-box) var(--saral-radius-box) 0 0; box-shadow: 0 24px 48px -36px color-mix(in srgb, var(--saral-surface-inverse) 45%, transparent); }
pre { border-radius: 0 0 var(--saral-radius-box) var(--saral-radius-box); }
.scripts + pre { border-radius: 0 0 var(--saral-radius-box) var(--saral-radius-box); }
.scroll { background: var(--saral-surface-raised); border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); padding: 0 var(--saral-space-3); }
.say > div { border-radius: var(--saral-radius-box); }
main > section + section { border-top: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.side a[aria-current] { color: var(--saral-action-default); }
`,
  },
  spec: {
    title: 'Spec sheet',
    fonts: [FONTS.anek],
    preload: 'anek-latin.woff',
    vars: `--saral-font-family-sans: "Saral Text", ui-sans-serif, system-ui, sans-serif; --display: var(--saral-font-family-sans); --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace; --saral-radius-control: 2px; --saral-radius-box: 0px; --link: var(--saral-text-default);`,
    css: `
.top { border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.brand { font-weight: var(--saral-font-weight-bold); font-size: 20px; letter-spacing: -0.01em; }
.ver { font-family: var(--mono); font-size: 12px; border: var(--saral-size-stroke) solid var(--saral-border-hairline); padding: 2px 6px; color: var(--saral-text-muted); }
a { text-decoration-color: var(--saral-accent-default); text-decoration-thickness: 2px; }
h1, h2 { font-weight: var(--saral-font-weight-bold); letter-spacing: -0.02em; }
h1 { font-size: clamp(40px, 1.6rem + 3vw, 64px); margin-bottom: var(--saral-space-3); }
h2 { font-size: clamp(24px, 1.05rem + 1vw, 32px); display: flex; gap: var(--saral-space-3); align-items: baseline; }
h2::before { content: counter(sec, decimal-leading-zero); font: 500 13px/1 var(--mono); color: var(--saral-accent-default); letter-spacing: 0; }
main { counter-reset: sec; }
main > section { counter-increment: sec; border-top: var(--saral-size-stroke) solid var(--saral-text-default); }
.eyebrow { margin: 0 0 var(--saral-space-2); font: 500 12px/1.4 var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--saral-text-muted); }
.meta { border-block: var(--saral-size-stroke) solid var(--saral-border-hairline); padding-block: var(--saral-space-3); }
.meta dt { font: 500 11px/1.4 var(--mono); text-transform: uppercase; letter-spacing: 0.06em; }
.meta dd { font-family: var(--mono); font-size: var(--saral-font-size-small); }
.stage { background-color: var(--saral-surface-raised); background-image: linear-gradient(var(--saral-border-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--saral-border-hairline) 1px, transparent 1px); background-size: 24px 24px; background-position: -1px -1px; }
th { font: 500 11px/1.4 var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--saral-text-muted); background: var(--saral-surface-sunken); }
td:first-child code, td code { color: var(--saral-text-default); }
.side h2, .toc h2 { font: 500 11px/1.4 var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--saral-text-muted); }
.side h2::before, .toc h2::before { content: none; }
.side a[aria-current] { box-shadow: inset 2px 0 0 var(--saral-accent-default); padding-inline-start: var(--saral-space-2); }
.side a[aria-current]:dir(rtl) { box-shadow: inset -2px 0 0 var(--saral-accent-default); }
.say > div { background: transparent; }
`,
  },
  // Recommended: Neel, with the meta row and quiet section labels borrowed from
  // Spec sheet, and links in the accent now that actions use the ink.
  final: {
    title: 'Neel, recommended',
    fonts: [FONTS.eczar, FONTS.anek],
    preload: 'anek-latin.woff',
    vars: `--saral-font-family-sans: "Saral Text", ui-sans-serif, system-ui, sans-serif; --display: "Saral Display", Georgia, serif; --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace; --saral-radius-control: 8px; --saral-radius-box: 10px; --link: var(--saral-accent-default);`,
    css: null,
  },
};

const NAV = ['Get started', 'Foundations', 'Components', 'Patterns', 'Themes', 'Trust'];
const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-');

function page(key) {
  const d = DIRECTIONS[key];
  const colours = palettes[key].colours;
  const demo = `<button data-scope="button" data-part="root" type="submit">Send message</button>
<button data-scope="button" data-part="root" data-variant="accent" type="button">Continue</button>
<button data-scope="button" data-part="root" data-variant="secondary" type="button">Save draft</button>
<button data-scope="button" data-part="root" type="button" disabled>Pay now</button>
<button data-scope="button" data-part="root" type="submit" aria-disabled="true" data-pending>Sending</button>`;
  const css = [dist('mor.css'), dist('button.css'), `:root {\n  ${roles(colours)}\n  ${d.vars}\n}`, ...d.fonts.map(face), ...FONTS.scripts.map(face), BASE, d.css].join('\n');
  const swatch = (token) => colours.light[token] ? `<span class="swatch" style="background: var(--saral-${token.replaceAll('.', '-')})"></span>` : '';
  const sideList = `<ul>${COMPONENTS.map((c) => `<li><a href="#"${c === 'Button' ? ' aria-current="page"' : ''}>${c}</a></li>`).join('')}</ul>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Button: Saral (${d.title} direction)</title>
<meta name="description" content="${esc(spec.purpose)}">
<link rel="preload" href="../fonts/${d.preload}" as="font" type="font/woff" crossorigin>
<style>
${css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap bar">
    <a class="brand" href="#">Saral</a>${key === 'spec' ? `\n    <span class="ver">v${version}</span>` : ''}
    <nav aria-label="Main"><ul>${NAV.map((n) => `<li><a href="#"${n === 'Components' ? ' aria-current="true"' : ''}>${n}</a></li>`).join('')}</ul></nav>
    <a class="search" href="#">Search</a>
  </div>
</header>
<div class="wrap layout">
  <nav class="side" aria-label="Components">
    <div class="wide"><h2>Components</h2>${sideList}</div>
    <details><summary>Components: Button</summary>${sideList}</details>
  </nav>
  <main id="main">
    <header>
      <p class="eyebrow">Component</p>
      <h1>${spec.name}</h1>
      <p class="lead">${esc(spec.purpose)}</p>
      <dl class="meta">
        <div><dt>Status</dt><dd>${spec.status === 'preview' ? 'Preview' : 'Stable'}</dd></div>
        <div><dt>Since</dt><dd>${spec.since}</dd></div>
        <div><dt>Element</dt><dd><code>&lt;${spec.anatomy[0].element}&gt;</code></dd></div>
        <div><dt>Script needed</dt><dd>None</dd></div>
      </dl>
      <ul class="links"><li><a href="#">Spec JSON</a></li><li><a href="#">Markdown</a></li><li><a href="#">Source</a></li><li><a href="#">Report a problem</a></li></ul>
    </header>

    <section id="example" aria-labelledby="h-example">
      <h2 id="h-example">Example</h2>
      <div class="stage">
${demo}
      </div>
      <details class="scripts">
        <summary>The same button in six scripts</summary>
        <div class="row">${SCRIPTS.map(([lang, dir, label]) => `<button data-scope="button" data-part="root" type="button" lang="${lang}" dir="${dir}">${label}</button>`).join('')}</div>
      </details>
      <pre tabindex="0" aria-label="HTML for the example"><code>${esc(demo)}</code></pre>
    </section>

    <section id="when" aria-labelledby="h-when">
      <h2 id="h-when">When to use it</h2>
      <div class="two">
        <div><h3>Use it for</h3><ul>${spec.whenToUse.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>
        <div><h3>Use something else for</h3><ul>${spec.whenNotToUse.map((w) => `<li>${esc(w.case)}: use ${esc(w.instead)}</li>`).join('')}</ul></div>
      </div>
    </section>

    <section id="anatomy" aria-labelledby="h-anatomy">
      <h2 id="h-anatomy">Anatomy</h2>
      <div class="scroll" tabindex="0" role="region" aria-label="Parts table"><table>
        <caption>Every part carries <code>data-scope</code> and <code>data-part</code>.</caption>
        <thead><tr><th scope="col">Part</th><th scope="col">Element</th><th scope="col">Role</th><th scope="col">Attributes</th></tr></thead>
        <tbody>${spec.anatomy.map((a) => `<tr><td><code>${a.part}</code></td><td><code>&lt;${a.element}&gt;</code></td><td>${a.role}</td><td><code>data-scope="button"</code> <code>data-part="${a.part}"</code> <code>data-variant</code></td></tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section id="states" aria-labelledby="h-states">
      <h2 id="h-states">States</h2>
      <div class="scroll" tabindex="0" role="region" aria-label="States table"><table>
        <thead><tr><th scope="col">State</th><th scope="col">Set by</th><th scope="col">How</th></tr></thead>
        <tbody>${spec.states.map((s) => `<tr><td>${s.state}</td><td>${s.setBy === 'css' ? 'CSS' : 'Core script'}</td><td>${code(s.how.replace(/(:[a-z-]+|data-[a-z]+|aria-disabled="true"|setPending|enhanceForm|@media \(hover: hover\))/g, '`$1`'))}</td></tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section id="api" aria-labelledby="h-api">
      <h2 id="h-api">API and tokens</h2>
      <div class="scroll" tabindex="0" role="region" aria-label="Props table"><table>
        <caption>React props. In HTML, use <code>data-variant</code> and <code>data-pending</code>.</caption>
        <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">What it does</th></tr></thead>
        <tbody>${spec.props.map((p) => `<tr><td><code>${p.name}</code></td><td><code>${esc(p.type)}</code></td><td><code>${esc(p.default)}</code></td><td>${esc(p.does)}</td></tr>`).join('')}</tbody>
      </table></div>
      <h3 style="margin-top: var(--saral-space-6)">Tokens it reads</h3>
      <div class="scroll" tabindex="0" role="region" aria-label="Tokens table"><table>
        <thead><tr><th scope="col">Token</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
        <tbody>${spec.tokens.map((t) => `<tr><td>${swatch(t)}<code>--saral-${t.replaceAll('.', '-')}</code></td><td><code>${colours.light[t] ?? 'theme'}</code></td><td><code>${colours.dark[t] ?? 'theme'}</code></td></tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section id="accessibility" aria-labelledby="h-accessibility">
      <h2 id="h-accessibility">Accessibility</h2>
      <p>${esc(spec.accessibility.web)}</p>
      <div class="scroll" tabindex="0" role="region" aria-label="Keyboard table"><table>
        <thead><tr><th scope="col">Key</th><th scope="col">Action</th></tr></thead>
        <tbody>${spec.keyboard.map((k) => `<tr><td>${esc(k.key)}</td><td>${esc(k.action)}</td></tr>`).join('')}</tbody>
      </table></div>
      <h3 style="margin-top: var(--saral-space-6)">On other platforms</h3>
      <dl class="platforms"><div><dt>iOS</dt><dd>${esc(spec.accessibility.ios)}</dd></div><div><dt>Android</dt><dd>${esc(spec.accessibility.android)}</dd></div></dl>
    </section>

    <section id="writing" aria-labelledby="h-writing">
      <h2 id="h-writing">Writing</h2>
      <p>${esc(spec.content)}</p>
      <div class="say"><div><strong>Write</strong>Send message, Save changes, Pay now</div><div><strong>Avoid</strong>OK, Submit, Click here</div></div>
    </section>

    <section id="changes" aria-labelledby="h-changes">
      <h2 id="h-changes">Recent changes</h2>
      <ul class="changes">${changes.map((c) => `<li><time datetime="${c.date}">${c.date}</time><span>${code(c.lines[0].slice(2))}</span></li>`).join('')}</ul>
    </section>
  </main>
  <nav class="toc" aria-label="On this page"><div><h2>On this page</h2><ul>${TOC.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul></div></nav>
</div>
<footer><div class="wrap bar"><span>Saral v${version}. MIT licence.</span><a href="#">Changes</a><a href="#">Accessibility statement</a><a href="#">GitHub</a></div></footer>
</body>
</html>
`;
}

DIRECTIONS.final.css = DIRECTIONS.neel.css + `
.meta { border-block: var(--saral-size-stroke) solid var(--saral-border-hairline); padding-block: var(--saral-space-3); }
.meta dt { font: 500 11px/1.4 var(--mono); text-transform: uppercase; letter-spacing: 0.06em; }
.meta dd { font-family: var(--mono); font-size: var(--saral-font-size-small); }
th { font: 500 11px/1.4 var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--saral-text-muted); }
.eyebrow, .side a[aria-current] { color: var(--saral-accent-default); }
`;

for (const key of Object.keys(DIRECTIONS)) {
  writeFileSync(here(`${key}-button.html`), page(key));
  console.log(`wrote ${key}-button.html`);
}
