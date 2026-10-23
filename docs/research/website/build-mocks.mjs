#!/usr/bin/env node
// Builds the identity research pages from palettes.json: one homepage mock per
// direction, and compare.html that shows them side by side. Every page is a
// single self-contained HTML file (fonts come from Google Fonts for the mock;
// the real site would host them itself). Research only, not the site build.
// Run: node docs/research/website/palettes.mjs && node docs/research/website/build-mocks.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { oklchToSrgb, toHex } from '../../../packages/tokens/src/color.mjs';

const here = (f) => new URL(f, import.meta.url);
const palettes = JSON.parse(readFileSync(here('palettes.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const vars = (colours) => Object.entries(colours).map(([r, v]) => `--saral-${r.replaceAll('.', '-')}: ${v};`).join(' ');

// A kolam drawn the way the street version is: a grid of dots and one rule.
// The line runs at 45 degrees between the dots and turns back at each edge,
// like a ball on a billiard table. On a 5 by 3 grid it closes as one loop.
function kolamPath(m, n, unit, pad) {
  let x = 0, y = 1, dx = 1, dy = 1;
  const pts = [[x, y]];
  const W = 2 * m, H = 2 * n;
  for (let i = 0; i < 1000; i++) {
    const t = Math.min(dx > 0 ? W - x : x, dy > 0 ? H - y : y);
    x += dx * t; y += dy * t;
    if (x === 0 || x === W) dx = -dx;
    if (y === 0 || y === H) dy = -dy;
    pts.push([x, y]);
    if (x === 0 && y === 1 && dx === 1 && dy === 1) break;
  }
  const P = ([a, b]) => [pad + a * unit, pad + b * unit];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const ring = pts.slice(0, -1).map(P);
  const k = ring.length;
  const r = (q) => q.map((v) => v.toFixed(1)).join(' ');
  let d = '';
  for (let i = 0; i < k; i++) {
    const prev = ring[(i - 1 + k) % k], v = ring[i], next = ring[(i + 1) % k];
    const len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const a = lerp(v, prev, Math.min(0.5, (unit * 1.1) / len(v, prev)));
    const b = lerp(v, next, Math.min(0.5, (unit * 1.1) / len(v, next)));
    d += `${i === 0 ? 'M' : 'L'}${r(a)} Q${r(v)} ${r(b)} `;
  }
  const dots = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dots.push(P([2 * i + 1, 2 * j + 1]));
  return { d: d + 'Z', dots, w: pad * 2 + W * unit, h: pad * 2 + H * unit };
}

// Eight dips of the same indigo, from first dip to last.
const dips = Array.from({ length: 8 }, (_, i) => toHex(oklchToSrgb([0.93 - i * 0.09, 0.03 + i * 0.018, 268])));

const DIRECTIONS = [
  {
    id: 'neel',
    name: 'Neel',
    meaning: 'indigo',
    mood: 'Calm, crafted, editorial. Light first.',
    fonts: 'family=Eczar:wght@500..800&family=Mukta:wght@400;600;700&family=JetBrains+Mono:wght@400;600',
    display: "'Eczar', serif",
    text: "'Mukta', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    typeNote: 'Eczar for headings (Rosetta, Latin and Devanagari, variable weight). Mukta for text (Ek Type, Latin and Devanagari). JetBrains Mono for code.',
    radius: { box: '10px', control: '8px' },
    headline: 'Build plain, accessible interfaces. Dye them any colour.',
    sub: 'Saral is a design system of native HTML parts, semantic tokens and checked rules. The structure stays the same; the theme is the dye.',
    storyTitle: 'Why indigo',
    story: 'Indigo takes its name from the Greek indikon, from India. In the vat the dye is not blue at all; it is yellow-green. Cloth comes out green and turns blue in the air. A dyer gets a deeper blue by dipping again, not by making the vat stronger. Saral works the same way. One colour, applied by one simple process, gives a whole scale. A theme is a few repeated, patient steps, and every step is checked before the next.',
    sources: [['Botanical Colors, indigo FAQ', 'https://botanicalcolors.com/faq/indigo-faq'], ['DGNHAS, Indigo: a blue to dye for', 'https://dgnhas.org.uk/node/3498']],
  },
  {
    id: 'kolam',
    name: 'Kolam',
    meaning: 'the threshold drawing',
    mood: 'Precise, geometric, quietly playful. Ink and rice, no hue of its own.',
    fonts: 'family=Gotu&family=Kripa:wght@400..700&family=Martian+Mono:wght@400;600',
    display: "'Gotu', sans-serif",
    text: "'Kripa', system-ui, sans-serif",
    mono: "'Martian Mono', ui-monospace, monospace",
    typeNote: 'Gotu for headings (Ek Type, a single-weight line that loops like a kolam stroke). Kripa for text (Kedar Gadge, variable weight, released on Google Fonts in September 2026). Martian Mono for code.',
    radius: { box: '16px', control: '999px' },
    headline: 'A grid of dots and one rule.',
    sub: 'Saral gives you the dots, semantic tokens, and the rule, a contract every part keeps. Draw whatever your product needs; it stays accessible and consistent.',
    storyTitle: 'Why kolam',
    story: 'Every morning, across South India, a kolam is drawn at the threshold of a home. It starts as a grid of dots, the pulli. A line of rice flour then loops around the dots by a few simple rules, and the same grid gives endless designs. The daily kolam is white only; colour is saved for festivals. Saral is built like this. Tokens are the dots, the parts contract is the rule, and your theme is the festival colour. The drawing above is real: one line, one rule, a five by three grid.',
    sources: [['Kolam, Wikipedia', 'https://en.wikipedia.org/wiki/Kolam']],
  },
  {
    id: 'jamun',
    name: 'Jamun',
    meaning: 'the black plum',
    mood: 'Bold, contemporary, confident. A full-colour field and poster type.',
    fonts: 'family=Akshar:wght@500..700&family=Noto+Sans:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Mono:wght@400;600',
    display: "'Akshar', sans-serif",
    text: "'Noto Sans', 'Noto Sans Devanagari', system-ui, sans-serif",
    mono: "'Noto Sans Mono', ui-monospace, monospace",
    typeNote: 'Akshar for headings (Tall Chai, condensed, variable weight and contrast). Noto Sans with Noto Sans Devanagari for text: the one free family that covers nearly every script, so Tamil, Bengali or Urdu can follow without a new font. Noto Sans Mono for code.',
    radius: { box: '0px', control: '0px' },
    headline: 'One source. Every platform.',
    sub: 'Write the contract once: tokens, parts and states. Use it in plain HTML and React today, with Web Components and native apps to follow.',
    storyTitle: 'Why jamun',
    story: 'One of the oldest names for India is Jambudvipa, the land of the jambu tree, the jamun. Ashoka used it for his realm in the third century BCE. The jamun grows in almost any soil, belongs to nobody in particular, and feeds whoever passes under it. Its colour stays on everything it touches. That is the promise of Saral: one source that grows on every platform, free for anyone to use, and a mark that stays consistent wherever it lands.',
    sources: [['Jambudvipa, Wikipedia', 'https://en.wikipedia.org/wiki/Jambudv%C4%ABpa']],
  },
];

const kolam = kolamPath(5, 3, 44, 30);

function hero(d) {
  if (d.id === 'neel') {
    return `<section class="hero" aria-labelledby="h">
  <div class="hero-copy">
    <h1 id="h">${esc(d.headline)}</h1>
    <p class="lead">${esc(d.sub)}</p>
    ${actions()}
  </div>
  <figure class="dips" aria-labelledby="dips-cap">
    <ol>${dips.map((c, i) => `<li style="--dip:${c};--i:${i}"><span>${i + 1} ${i ? 'dips' : 'dip'}</span></li>`).join('')}</ol>
    <figcaption id="dips-cap">The same blue, dipped eight times. Saral builds a theme's scale from one colour in the same way.</figcaption>
  </figure>
</section>`;
  }
  if (d.id === 'kolam') {
    return `<section class="hero" aria-labelledby="h">
  <div class="hero-copy">
    <h1 id="h">${esc(d.headline)}</h1>
    <p class="lead">${esc(d.sub)}</p>
    ${actions()}
  </div>
  <svg class="kolam" viewBox="0 0 ${kolam.w} ${kolam.h}" role="img" aria-label="One continuous line looping around a five by three grid of dots">
    ${kolam.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join('')}
    <path pathLength="1" d="${kolam.d}"/>
  </svg>
</section>`;
  }
  return `<section class="hero" aria-labelledby="h">
  <p class="mark" aria-hidden="true"><span lang="hi">सरल</span><span>Saral</span></p>
  <div class="hero-copy">
    <h1 id="h">${esc(d.headline)}</h1>
    <p class="lead">${esc(d.sub)}</p>
    ${actions()}
  </div>
  <div class="tree" aria-label="One source compiled to every platform">
    <pre><code>tokens/*.tokens.json
specs/*.json</code></pre>
    <ul>
      <li>CSS and HTML <em>today</em></li><li>React <em>today</em></li><li>Web Components <em>next</em></li>
      <li>Figma variables <em>next</em></li><li>Swift, Kotlin, Flutter tokens <em>on request</em></li>
    </ul>
  </div>
</section>`;
}

const actions = () => `<div class="actions">
      <a class="btn" data-variant="accent" href="#start">Get started</a>
      <a class="btn" href="#components">Browse components</a>
    </div>
    <p class="install"><code>npm i @saral/css</code> <span>or one link tag from a CDN. No build step.</span></p>`;

const demoMarkup = `<form data-scope="form" data-part="root">
  <div data-scope="field" data-part="root">
    <label data-scope="field" data-part="label" for="email">Email</label>
    <p data-scope="field" data-part="hint" id="email-hint">We send one email per release.</p>
    <input data-scope="field" data-part="input" id="email" type="email"
      required aria-describedby="email-hint" placeholder="name@example.com">
  </div>
  <label data-scope="checkbox" data-part="root">
    <input data-scope="checkbox" data-part="input" type="checkbox">
    <span data-scope="checkbox" data-part="label">Tell me about breaking changes too</span>
  </label>
  <button data-scope="button" data-part="root" data-variant="accent" type="submit">Subscribe</button>
</form>`;

function page(d) {
  const p = palettes[d.id].colours;
  const css = `
:root { ${vars(p.light)} --saral-radius-box: ${d.radius.box}; --saral-radius-control: ${d.radius.control};
  --display: ${d.display}; --text: ${d.text}; --mono: ${d.mono}; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root:not([data-mode="light"]) { ${vars(p.dark)} color-scheme: dark; } }
:root[data-mode="dark"] { ${vars(p.dark)} color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--saral-surface-ground); color: var(--saral-text-default); font: 400 17px/1.6 var(--text); }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--saral-border-focus); outline-offset: 2px; }
.wrap { max-width: 1160px; margin: 0 auto; padding: 0 24px; }
header.top { display: flex; align-items: center; gap: 24px; padding: 16px 24px; max-width: 1160px; margin: 0 auto; flex-wrap: wrap; }
.brand { font: 700 24px/1 var(--display); text-decoration: none; display: flex; gap: 8px; align-items: baseline; }
.brand span[lang] { font-family: var(--text); font-weight: 600; font-size: 18px; color: var(--saral-text-muted); }
nav.main ul { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; font-size: 15px; }
nav.main a { text-decoration: none; color: var(--saral-text-muted); }
@media (hover: hover) { nav.main a:hover { color: var(--saral-text-default); text-decoration: underline; } }
.tools { margin-left: auto; display: flex; gap: 12px; align-items: center; }
.search { display: flex; align-items: center; gap: 24px; font: inherit; font-size: 15px; color: var(--saral-text-muted); background: var(--saral-surface-raised);
  border: 1px solid var(--saral-border-hairline); border-radius: var(--saral-radius-control); padding: 6px 8px 6px 14px; min-width: 210px; justify-content: space-between; cursor: pointer; }
.search kbd { font: 600 12px var(--mono); border: 1px solid var(--saral-border-hairline); border-radius: 4px; padding: 1px 6px; }
.mode { font: inherit; font-size: 15px; color: var(--saral-text-default); background: var(--saral-surface-raised); border: 1px solid var(--saral-border-hairline); border-radius: var(--saral-radius-control); padding: 6px 10px; }
h1, h2, h3 { font-family: var(--display); line-height: 1.1; margin: 0 0 16px; text-wrap: balance; }
h2 { font-size: clamp(28px, 1.2rem + 1.6vw, 40px); }
h3 { font-size: 22px; }
.lead { font-size: 20px; color: var(--saral-text-muted); max-width: 36em; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; margin: 28px 0 16px; }
.btn, [data-scope="button"][data-part="root"] { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 22px; font: 600 16px/1 var(--text);
  border-radius: var(--saral-radius-control); text-decoration: none; cursor: pointer; border: 1px solid var(--saral-border-strong); background: var(--saral-surface-raised); color: var(--saral-text-default); }
.btn[data-variant="accent"], [data-scope="button"][data-variant="accent"] { background: var(--saral-action-default); color: var(--saral-text-on-action); border-color: var(--saral-action-default); }
@media (hover: hover) { .btn[data-variant="accent"]:hover, [data-scope="button"][data-variant="accent"]:hover { background: var(--saral-action-hover); } .btn:not([data-variant]):hover { background: var(--saral-surface-sunken); } }
.btn[data-variant="accent"]:active, [data-scope="button"][data-variant="accent"]:active { background: var(--saral-action-pressed); }
.install { font-size: 15px; color: var(--saral-text-muted); display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin: 0; }
code, pre { font-family: var(--mono); font-size: 0.86em; }
.install code { background: var(--saral-surface-sunken); padding: 4px 10px; border-radius: 6px; color: var(--saral-text-default); }
section.block { padding: 72px 0; border-top: 1px solid var(--saral-border-hairline); }
.try { display: grid; gap: 32px; grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 880px) { .try { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); } }
.stage { background: var(--saral-surface-raised); border: 1px solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); padding: 28px; }
.stage form { display: grid; gap: 20px; max-width: 26rem; }
[data-scope="field"][data-part="root"] { display: grid; gap: 6px; }
[data-scope="field"][data-part="label"] { font-weight: 600; }
[data-scope="field"][data-part="hint"] { margin: 0; font-size: 15px; color: var(--saral-text-muted); }
[data-scope="field"][data-part="input"] { font: inherit; min-height: 44px; padding: 0 12px; color: var(--saral-text-default); background: var(--saral-surface-ground);
  border: 1px solid var(--saral-border-strong); border-radius: var(--saral-radius-control); }
[data-scope="field"][data-part="input"]::placeholder { color: var(--saral-text-quiet); }
[data-scope="field"][data-part="input"]:user-invalid { border-color: var(--saral-feedback-danger-border); }
[data-scope="checkbox"][data-part="root"] { display: flex; gap: 10px; align-items: center; cursor: pointer; }
[data-scope="checkbox"][data-part="input"] { width: 20px; height: 20px; margin: 0; accent-color: var(--saral-action-default); }
[data-scope="notice"][data-part="root"] { padding: 12px 16px; border-left: 4px solid var(--saral-feedback-success-border); background: var(--saral-feedback-success-subtle); color: var(--saral-feedback-success-text); border-radius: 4px; }
pre.code { margin: 0; padding: 20px; overflow: auto; background: var(--saral-surface-sunken); border-radius: var(--saral-radius-box); line-height: 1.55; font-size: 13.5px; color: var(--saral-text-default); }
.principles { display: grid; gap: 40px; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 880px) { .principles { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.principles p { color: var(--saral-text-muted); margin: 0; }
.where { display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 720px) { .where { grid-template-columns: 1fr 1fr; } }
.where ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.where li { padding: 10px 0; border-bottom: 1px solid var(--saral-border-hairline); }
.story { display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 880px) { .story { grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); } }
.story p { font-size: 19px; max-width: 38em; margin: 0 0 12px; }
.story .src { font-size: 14px; color: var(--saral-text-muted); }
footer { border-top: 1px solid var(--saral-border-hairline); padding: 32px 24px; max-width: 1160px; margin: 0 auto; font-size: 15px; color: var(--saral-text-muted); display: flex; flex-wrap: wrap; gap: 12px 28px; }
footer ul { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; }
.mock-note { background: var(--saral-surface-inverse); color: var(--saral-text-inverse); font-size: 14px; text-align: center; padding: 6px 16px; margin: 0; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
`;
  const specific = {
    neel: `
.hero { display: grid; gap: 48px; padding: 72px 0 88px; grid-template-columns: minmax(0, 1fr); align-items: center; }
@media (min-width: 920px) { .hero { grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); } }
.hero h1 { font-size: clamp(42px, 1.6rem + 3.6vw, 76px); font-weight: 700; letter-spacing: -0.01em; }
.dips { margin: 0; }
.dips ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.dips li { display: grid; grid-template-columns: minmax(0, 1fr) 4.5em; gap: 12px; align-items: center; font-size: 14px; color: var(--saral-text-muted); }
.dips li::before { content: ""; height: 44px; border-radius: 6px; background: var(--dip); animation: dip 0.6s calc(var(--i) * 90ms) both ease-out; }
.dips figcaption { font-size: 15px; color: var(--saral-text-muted); margin-top: 12px; }
@keyframes dip { from { background: ${dips[0]}; } }
.principles h3 { font-size: 26px; font-weight: 600; }
.story h2 { font-size: clamp(36px, 1.4rem + 2.4vw, 56px); }`,
    kolam: `
.hero { margin: 24px 0 0; padding: 64px 48px; display: grid; gap: 40px; grid-template-columns: minmax(0, 1fr); align-items: center;
  background: #0b0d10; color: #e9ebee; border-radius: var(--saral-radius-box); outline: 1px solid var(--saral-border-hairline); }
@media (min-width: 920px) { .hero { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); } }
@media (max-width: 600px) { .hero { padding: 40px 20px; } }
.hero h1 { font-size: clamp(40px, 1.5rem + 3.4vw, 72px); font-weight: 400; letter-spacing: -0.01em; }
.hero .lead, .hero .install { color: #afb5bc; }
.hero .install code { background: #1a1d20; color: #e9ebee; }
.hero .btn { border-color: #81878d; background: transparent; color: #e9ebee; }
.hero .btn[data-variant="accent"] { background: #e9ebee; color: #0b0d10; border-color: #e9ebee; }
@media (hover: hover) { .hero .btn[data-variant="accent"]:hover { background: #ffffff; } .hero .btn:not([data-variant]):hover { background: #1a1d20; } }
.hero :focus-visible { outline-color: #e9ebee; }
.kolam { width: 100%; height: auto; }
.kolam circle { fill: #e9ebee; }
.kolam path { fill: none; stroke: #e9ebee; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 5s 0.3s ease-in-out forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .kolam path { stroke-dashoffset: 0; } }
section.block { border-top: 0; background-image: radial-gradient(circle, var(--saral-border-strong) 1.5px, transparent 2px); background-size: 22px 22px; background-repeat: repeat-x; background-position: 0 0; }
.principles > div { padding-left: 20px; border-left: 2px dotted var(--saral-border-strong); }
.principles h3 { font-weight: 400; font-size: 26px; }`,
    jamun: `
.hero { position: relative; margin: 0 calc(50% - 50vw); padding: 56px max(24px, calc(50vw - 556px)) 72px; background: var(--saral-accent-default); color: var(--saral-text-on-accent);
  display: grid; gap: 32px 48px; grid-template-columns: minmax(0, 1fr); overflow: hidden; }
@media (min-width: 920px) { .hero { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); } .hero .mark { grid-column: 1 / -1; } }
.mark { margin: 0; font: 700 clamp(84px, 2rem + 13vw, 220px)/0.82 var(--display); letter-spacing: -0.02em; display: flex; gap: 0.25em; flex-wrap: wrap; }
.mark span[lang] { font-weight: 600; }
.hero h1 { font-size: clamp(34px, 1.3rem + 2.4vw, 56px); font-weight: 700; }
.hero .lead, .hero .install { color: inherit; opacity: 0.92; }
.hero .install code { background: var(--saral-text-on-accent); color: var(--saral-accent-default); }
.hero .btn { border: 2px solid currentColor; background: transparent; color: inherit; }
.hero .btn[data-variant="accent"] { background: var(--saral-text-on-accent); color: var(--saral-accent-default); border-color: var(--saral-text-on-accent); }
@media (hover: hover) { .hero .btn:hover { text-decoration: underline; text-underline-offset: 4px; } }
.hero :focus-visible { outline-color: var(--saral-text-on-accent); }
.tree { align-self: end; border: 2px solid currentColor; padding: 20px; }
.tree pre { margin: 0 0 16px; font-size: 15px; }
.tree ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-weight: 600; }
.tree li { display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid currentColor; padding-top: 6px; }
.tree em { font-style: normal; font-weight: 400; }
/* In dark mode a full lilac field glares, so the field turns to jamun skin and the mark keeps the colour. */
@media (prefers-color-scheme: dark) { :root:not([data-mode="light"]) .hero { background: var(--saral-surface-sunken); color: var(--saral-text-default); } :root:not([data-mode="light"]) .mark { color: var(--saral-accent-default); }
  :root:not([data-mode="light"]) .hero .btn[data-variant="accent"], :root:not([data-mode="light"]) .hero .install code { background: var(--saral-accent-default); color: var(--saral-text-on-accent); border-color: var(--saral-accent-default); } }
:root[data-mode="dark"] .hero { background: var(--saral-surface-sunken); color: var(--saral-text-default); } :root[data-mode="dark"] .mark { color: var(--saral-accent-default); }
:root[data-mode="dark"] .hero .btn[data-variant="accent"], :root[data-mode="dark"] .hero .install code { background: var(--saral-accent-default); color: var(--saral-text-on-accent); border-color: var(--saral-accent-default); }
.principles > div { border: 2px solid var(--saral-text-default); padding: 24px; }
.principles h3 { font-size: 30px; font-weight: 700; }
.stage, pre.code { border-width: 2px; border-color: var(--saral-text-default); }
.btn, [data-scope="button"][data-part="root"] { border-width: 2px; }`,
  }[d.id];

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${d.name}: Saral homepage mock</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${d.fonts}&display=swap">
<style>${css}${specific}</style>
</head>
<body>
<p class="mock-note">Research mock for direction ${d.name}. Not the real site.</p>
<header class="top">
  <a class="brand" href="#">Saral <span lang="hi">सरल</span></a>
  <nav class="main" aria-label="Main"><ul>
    <li><a href="#start">Get started</a></li><li><a href="#">Foundations</a></li><li><a href="#components">Components</a></li>
    <li><a href="#">Patterns</a></li><li><a href="#">Themes</a></li><li><a href="#">Trust</a></li>
  </ul></nav>
  <div class="tools">
    <button class="search" type="button">Search docs <kbd>/</kbd></button>
    <select id="mode" class="mode" aria-label="Colour mode"><option value="">System</option><option value="light">Light</option><option value="dark">Dark</option></select>
  </div>
</header>
<main>
<div class="wrap">
${hero(d)}
<section class="block try" id="components" aria-labelledby="try-h">
  <div>
    <h2 id="try-h">This is real HTML</h2>
    <p class="lead">A field, a checkbox and a button, styled only by this direction's tokens. Submit it with an empty or broken email to see the native invalid state. It works with JavaScript off.</p>
  </div>
  <div class="stage">
    ${demoMarkup.replace('<form', '<form id="demo"')}
    <details style="margin-top:24px"><summary>Show the markup</summary><pre class="code"><code>${esc(demoMarkup)}</code></pre></details>
  </div>
</section>
<section class="block" aria-labelledby="why-h">
  <h2 id="why-h">What Saral promises</h2>
  <div class="principles">
    <div><h3>Plain HTML first</h3><p>Every component is a native element with <code>data-scope</code> and <code>data-part</code>. It works before JavaScript loads, and without it.</p></div>
    <div><h3>Your look is a theme</h3><p>Components read only semantic tokens. Change the theme and the whole interface follows. This page is one theme.</p></div>
    <div><h3>Rules that hold</h3><p>Contrast, token use and naming are checked on every build. A text pair below 4.5:1 stops the release.</p></div>
  </div>
</section>
<section class="block" id="start" aria-labelledby="where-h">
  <h2 id="where-h">Use it where you build</h2>
  <div class="where">
    <div><h3>Today</h3><ul><li>Any HTML: Rails, Django, Laravel, Go, .NET, htmx</li><li>React</li><li>Tokens as CSS, JavaScript and JSON</li></ul></div>
    <div><h3>Planned for 1.0</h3><ul><li>Web Components that work in every framework</li><li>Figma variables made from the same source</li><li>Tokens for Swift, Kotlin, Flutter, .NET and Python when a team asks</li></ul></div>
  </div>
</section>
</div>
</main>
<footer>
  <span>Saral v0.3.1. MIT licence.</span>
  <ul aria-label="Project"><li><a href="#">Changes</a></li><li><a href="#">Decisions</a></li><li><a href="#">Incidents</a></li><li><a href="#">Source on GitHub</a></li></ul>
</footer>
<script>
const mode = document.getElementById('mode');
try { mode.value = localStorage.getItem('saral-mock-mode') || ''; } catch {}
const apply = () => { if (mode.value) document.documentElement.dataset.mode = mode.value; else delete document.documentElement.dataset.mode; };
apply();
mode.addEventListener('change', () => { apply(); try { localStorage.setItem('saral-mock-mode', mode.value); } catch {} });
const params = new URLSearchParams(location.search);
if (params.get('mode')) { mode.value = params.get('mode'); apply(); }
document.getElementById('demo').addEventListener('submit', (e) => {
  e.preventDefault();
  if (document.querySelector('#demo [data-scope="notice"]')) return;
  e.target.insertAdjacentHTML('beforeend', '<p data-scope="notice" data-part="root" role="status">Subscribed. Check your inbox to confirm.</p>');
});
</script>
</body>
</html>
`;
  writeFileSync(here(`${d.id}.html`), html);
}

function compare() {
  const swatchRoles = ['surface.ground', 'surface.raised', 'text.default', 'text.muted', 'action.default', 'accent.subtle'];
  const cols = DIRECTIONS.map((d) => {
    const p = palettes[d.id];
    const sw = (m) => swatchRoles.map((r) => `<li><span style="background:${p.colours[m][r]}"></span><code>${r}</code><code>${p.colours[m][r]}</code></li>`).join('');
    const low = (m) => p.lowest[m].map((x) => `${esc(x.pair)}: ${x.ratio}:1`).join('<br>');
    return `<article aria-labelledby="${d.id}-h">
  <h2 id="${d.id}-h">${d.name} <small>${esc(d.meaning)}</small></h2>
  <p class="mood">${esc(d.mood)}</p>
  <div class="frames">
    <div class="thumb"><iframe src="${d.id}.html?mode=light" title="${d.name} homepage, light" loading="lazy"></iframe></div>
    <div class="thumb"><iframe src="${d.id}.html?mode=dark" title="${d.name} homepage, dark" loading="lazy"></iframe></div>
  </div>
  <p><a href="${d.id}.html">Open the full mock</a></p>
  <h3>Story, for you only</h3><p>${esc(d.story)} Sources: ${d.sources.map(([t, u]) => `<a href="${u}">${esc(t)}</a>`).join(', ')}.</p>
  <h3>Type</h3><p>${esc(d.typeNote)}</p>
  <h3>Colour</h3>
  <div class="pal"><div><h4>Light</h4><ul>${sw('light')}</ul></div><div><h4>Dark</h4><ul>${sw('dark')}</ul></div></div>
  <p class="check">${p.errors.length ? `Fails: ${p.errors.map(esc).join('; ')}` : 'Passes every role, all 26 contrast pairs and the one-accent-hue policy in both modes, checked with Saral’s own build gates.'}</p>
  <p class="tight">Closest pairs, light:<br>${low('light')}</p>
  <p class="tight">Closest pairs, dark:<br>${low('dark')}</p>
</article>`;
  }).join('\n');
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Saral identity directions</title>
<style>
:root { color-scheme: light dark; --bg: #f5f5f4; --fg: #1a1a1a; --muted: #555; --line: #d4d4d2; --card: #fff; }
@media (prefers-color-scheme: dark) { :root { --bg: #161616; --fg: #ededed; --muted: #b0b0b0; --line: #333; --card: #1f1f1f; } }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.55 system-ui, sans-serif; }
header { max-width: 1500px; margin: 0 auto; padding: 32px 24px 8px; }
header p { max-width: 60em; color: var(--muted); }
main { max-width: 1500px; margin: 0 auto; padding: 16px 24px 64px; display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 1100px) { main { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
article { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 20px; }
h2 { margin: 0; font-size: 26px; } h2 small { font-size: 16px; font-weight: 400; color: var(--muted); }
h3 { font-size: 15px; margin: 20px 0 4px; } h4 { font-size: 13px; margin: 0 0 6px; color: var(--muted); font-weight: 600; }
.mood { color: var(--muted); margin-top: 4px; }
.frames { display: grid; gap: 8px; }
.thumb { aspect-ratio: 1280 / 900; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; background: #fff; position: relative; }
.thumb iframe { border: 0; width: 100%; height: 100%; }
.js .thumb iframe { position: absolute; top: 0; left: 0; width: 1280px; height: 900px; transform-origin: 0 0; transform: scale(var(--s, 1)); }
.pal { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.pal code { overflow-wrap: anywhere; }
article { min-width: 0; }
.pal ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 4px; font-size: 11.5px; }
.pal li { display: grid; grid-template-columns: 18px 1fr auto; gap: 6px; align-items: center; }
.pal span { width: 18px; height: 18px; border-radius: 4px; border: 1px solid var(--line); }
.check { font-size: 14px; padding: 8px 12px; border-radius: 6px; background: color-mix(in srgb, #1e6b3a 14%, transparent); }
.tight { font-size: 13px; color: var(--muted); }
a { color: inherit; }
</style></head>
<body>
<header>
  <h1>Saral identity directions</h1>
  <p>Three ways the website could look. The story behind each is written here for you only; the site never explains it, so the roots are felt, not announced. Each mock uses the same page structure and the same real form, so only the identity changes. The top frame is light mode and the bottom frame is dark mode. Pick one, and say whether it should also replace Mor as Saral's default theme or stay on the website only.</p>
</header>
<main>
${cols}
</main>
<script>
// Shows each mock at desktop width, scaled down to fit its frame.
document.documentElement.classList.add('js');
const fit = () => { for (const t of document.querySelectorAll('.thumb')) t.style.setProperty('--s', t.clientWidth / 1280); };
new ResizeObserver(fit).observe(document.body); fit();
</script>
</body></html>
`;
  writeFileSync(here('compare.html'), html);
}

for (const d of DIRECTIONS) page(d);
compare();
console.log('mocks: wrote neel.html, kolam.html, jamun.html and compare.html');
