#!/usr/bin/env node
// Builds the claim-led homepage mock chosen on 2026-10-14: Neel's look with no
// story section, and a hero that is a real Saral form in six scripts, shown
// beside the same form running with scripts disabled. Every component is
// Saral's own CSS from dist/ and its own core script; nothing is drawn to
// look like a component. Copy is the proposed pitch (website plan), until the owner signs it off.
// Run: node docs/research/website/palettes.mjs && node docs/research/website/build-claim.mjs
// View through `npm run serve` (the page imports packages/core and color.mjs).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const here = (f) => new URL(f, import.meta.url);
const root = (f) => new URL(`../../../${f}`, import.meta.url);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const neel = JSON.parse(readFileSync(here('palettes.json'), 'utf8')).neel.colours;
const vars = (c) => Object.entries(c).map(([r, v]) => `--saral-${r.replaceAll('.', '-')}: ${v};`).join(' ');
const dist = (f) => readFileSync(root(`dist/css/${f}`), 'utf8').replace(/^\/\*.*?\*\/\n/, '');

// Self-hosted, subset fonts (see fonts/README.md). Each face covers one script
// through unicode-range, so a page downloads only the scripts it shows.
const FACES = [
  ['Saral Eczar', 'eczar-latin.woff2', '500 800', 'U+0000-00FF, U+2013-2014, U+2018-201D, U+2026, U+20B9'],
  ['Saral Text', 'anek-latin.woff2', '400 700', 'U+0000-00FF, U+2013-2014, U+2018-201D, U+2026, U+20B9'],
  ['Saral Text', 'anek-devanagari.woff2', '400 700', 'U+0900-097F, U+1CD0-1CFF, U+200C-200D, U+25CC, U+A8E0-A8FF'],
  ['Saral Text', 'anek-tamil.woff2', '400 700', 'U+0B80-0BFF, U+200C-200D, U+25CC'],
  ['Saral Text', 'noto-arabic.woff2', '400 700', 'U+0600-06FF, U+0750-077F, U+200C-200F, U+FB50-FDFF, U+FE70-FEFF'],
  ['Saral Text', 'noto-thai.woff2', '400 700', 'U+0E00-0E7F, U+200C-200D'],
  ['Saral Text', 'noto-jp.woff2', '400 700', 'U+3000-303F, U+3040-309F, U+30A0-30FF, U+4E00-9FFF, U+FF00-FFEF'],
];
const fontCss = FACES.map(([family, file, weight, range]) => `@font-face { font-family: "${family}"; src: url("fonts/${file}") format("woff2"); font-weight: ${weight}; font-display: swap; unicode-range: ${range}; }`).join('\n');
const latinPreload = '<link rel="preload" href="fonts/anek-latin.woff2" as="font" type="font/woff2" crossorigin>';

// The same form in six scripts. Translations are drafts: each needs a native
// reader before it ships (the script test matrix at M2).
export const LANGS = [
  { code: 'en', dir: 'ltr', name: 'English', t: { name: 'Full name', hint: 'As it appears on your ID', nameErr: 'Enter your full name', contact: 'Contact by', choose: 'Choose one', email: 'Email', phone: 'Phone', contactErr: 'Choose how we should contact you', updates: 'Send me updates', go: 'Continue', sent: 'Sent. Check your inbox.' } },
  { code: 'hi', dir: 'ltr', name: 'हिन्दी', t: { name: 'पूरा नाम', hint: 'जैसा आपके पहचान पत्र पर लिखा है', nameErr: 'अपना पूरा नाम लिखें', contact: 'संपर्क का तरीका', choose: 'एक चुनें', email: 'ईमेल', phone: 'फ़ोन', contactErr: 'चुनें कि हम आपसे कैसे संपर्क करें', updates: 'मुझे अपडेट भेजें', go: 'आगे बढ़ें', sent: 'भेज दिया गया। अपना इनबॉक्स देखें।' } },
  { code: 'ta', dir: 'ltr', name: 'தமிழ்', t: { name: 'முழுப் பெயர்', hint: 'உங்கள் அடையாள அட்டையில் உள்ளபடி', nameErr: 'உங்கள் முழுப் பெயரை உள்ளிடவும்', contact: 'தொடர்பு முறை', choose: 'ஒன்றைத் தேர்வு செய்யவும்', email: 'மின்னஞ்சல்', phone: 'தொலைபேசி', contactErr: 'உங்களை எப்படித் தொடர்பு கொள்வது எனத் தேர்வு செய்யவும்', updates: 'எனக்குப் புதுப்பிப்புகளை அனுப்பவும்', go: 'தொடரவும்', sent: 'அனுப்பப்பட்டது. உங்கள் இன்பாக்ஸைப் பார்க்கவும்.' } },
  { code: 'ar', dir: 'rtl', name: 'العربية', t: { name: 'الاسم الكامل', hint: 'كما يظهر في بطاقة هويتك', nameErr: 'أدخل اسمك الكامل', contact: 'طريقة التواصل', choose: 'اختر واحدة', email: 'البريد الإلكتروني', phone: 'الهاتف', contactErr: 'اختر طريقة التواصل معك', updates: 'أرسل لي التحديثات', go: 'متابعة', sent: 'تم الإرسال. تحقق من بريدك الوارد.' } },
  { code: 'th', dir: 'ltr', name: 'ไทย', t: { name: 'ชื่อ-นามสกุล', hint: 'ตามที่ปรากฏบนบัตรประจำตัว', nameErr: 'กรอกชื่อ-นามสกุลของคุณ', contact: 'ช่องทางติดต่อ', choose: 'เลือกหนึ่งรายการ', email: 'อีเมล', phone: 'โทรศัพท์', contactErr: 'เลือกช่องทางที่ให้เราติดต่อคุณ', updates: 'ส่งข่าวสารให้ฉัน', go: 'ดำเนินการต่อ', sent: 'ส่งแล้ว โปรดตรวจสอบกล่องจดหมายของคุณ' } },
  { code: 'ja', dir: 'ltr', name: '日本語', t: { name: '氏名', hint: '身分証明書の記載どおりに', nameErr: '氏名を入力してください', contact: '連絡方法', choose: '選択してください', email: 'メール', phone: '電話', contactErr: '連絡方法を選択してください', updates: '最新情報を受け取る', go: '次へ', sent: '送信しました。受信トレイを確認してください。' } },
];

// One form, real Saral markup, as the specs and demos write it.
function form({ code, dir, t }, prefix, extra = '') {
  const id = (s) => `${prefix}-${code}-${s}`;
  return `<form data-scope="form" data-part="root" class="demo-form" lang="${code}" dir="${dir}" ${extra}>
  <div data-scope="field" data-part="root">
    <label data-scope="field" data-part="label" for="${id('name')}">${esc(t.name)}</label>
    <input data-scope="field" data-part="input" id="${id('name')}" name="name" autocomplete="name" required aria-describedby="${id('name-hint')}">
    <p data-scope="field" data-part="hint" id="${id('name-hint')}">${esc(t.hint)}</p>
    <p data-scope="field" data-part="error" id="${id('name-error')}" data-message-value-missing="${esc(t.nameErr)}">${esc(t.nameErr)}</p>
  </div>
  <div data-scope="select" data-part="root">
    <label data-scope="select" data-part="label" for="${id('contact')}">${esc(t.contact)}</label>
    <select data-scope="select" data-part="input" id="${id('contact')}" name="contact" required>
      <option value="">${esc(t.choose)}</option>
      <option value="email">${esc(t.email)}</option>
      <option value="phone">${esc(t.phone)}</option>
    </select>
    <p data-scope="select" data-part="error" id="${id('contact-error')}" data-message-value-missing="${esc(t.contactErr)}">${esc(t.contactErr)}</p>
  </div>
  <div data-scope="checkbox" data-part="root">
    <input data-scope="checkbox" data-part="input" type="checkbox" id="${id('updates')}" name="updates">
    <label data-scope="checkbox" data-part="label" for="${id('updates')}">${esc(t.updates)}</label>
  </div>
  <button data-scope="button" data-part="root" data-variant="accent" type="submit">${esc(t.go)}</button>
  <p data-scope="notice" data-part="root" data-tone="success" role="status" class="sent" hidden>${esc(t.sent)}</p>
</form>`;
}

const componentCss = ['mor.css', 'field.css', 'select.css', 'checkbox.css', 'radio.css', 'button.css', 'notice.css', 'link.css'].map(dist).join('\n');

// Colour roles from the Neel palette, unlayered so they win over the base
// theme's layered values. Light by default, dark by system or by choice.
const themeCss = `:root { ${vars(neel.light)} --saral-font-family-sans: "Saral Text", ui-sans-serif, system-ui, sans-serif; --display: "Saral Eczar", Georgia, serif; }
@media (prefers-color-scheme: dark) { :root:not([data-saral-mode="light"]) { ${vars(neel.dark)} } }
:root[data-saral-mode="dark"] { ${vars(neel.dark)} }`;

const baseCss = `
* { box-sizing: border-box; }
body { margin: 0; background: var(--saral-surface-ground); color: var(--saral-text-default); font-family: var(--saral-font-family-sans); font-size: var(--saral-font-size-body); line-height: var(--saral-font-leading-body); }
:focus-visible { outline: var(--saral-focus-width, 3px) solid var(--saral-border-focus); outline-offset: 2px; }
.demo-form { display: grid; gap: var(--saral-space-4); }
[hidden] { display: none !important; }
`;

function page() {
  const tabs = LANGS.map((l, i) => `<div data-scope="radio" data-part="item">
      <input data-scope="radio" data-part="input" type="radio" id="pick-${l.code}" name="script" value="${l.code}"${i ? '' : ' checked'}>
      <label data-scope="radio" data-part="item-label" for="pick-${l.code}" lang="${l.code}">${esc(l.name)}</label>
    </div>`).join('\n    ');
  const shown = LANGS.map((l) => `.hero:has(#pick-${l.code}:checked) .on [data-lang="${l.code}"]`).join(',\n');
  const forms = LANGS.map((l) => `<div data-lang="${l.code}">${form(l, 'on')}</div>`).join('\n');
  const css = `.wrap { max-width: 1180px; margin: 0 auto; padding: 0 var(--saral-space-5); }
.mock-note { margin: 0; padding: var(--saral-space-2) var(--saral-space-5); background: var(--saral-feedback-warning-subtle); color: var(--saral-feedback-warning-text); font-size: var(--saral-font-size-small); text-align: center; }
header.top { display: flex; flex-wrap: wrap; align-items: center; gap: var(--saral-space-5); padding: var(--saral-space-4) 0; }
.brand { font: 700 24px/1 var(--display); color: inherit; text-decoration: none; }
nav.main ul { display: flex; flex-wrap: wrap; gap: var(--saral-space-4); list-style: none; margin: 0; padding: 0; font-size: var(--saral-font-size-small); }
nav.main a { color: var(--saral-text-muted); text-decoration: none; }
@media (hover: hover) { nav.main a:hover { color: var(--saral-text-default); text-decoration: underline; } }
.tools { margin-left: auto; display: flex; gap: var(--saral-space-3); align-items: center; font-size: var(--saral-font-size-small); }
.tools select { font: inherit; color: inherit; background: var(--saral-surface-raised); border: var(--saral-size-stroke) solid var(--saral-border-strong); border-radius: var(--saral-radius-control); padding: var(--saral-space-1) var(--saral-space-2); }
h1, h2, h3 { font-family: var(--display); line-height: var(--saral-font-leading-tight); margin: 0 0 var(--saral-space-4); text-wrap: balance; }
h1 { font-size: clamp(36px, 1.4rem + 3vw, 64px); font-weight: 700; }
h2 { font-size: clamp(26px, 1.1rem + 1.4vw, 38px); font-weight: 700; }
h3 { font-size: var(--saral-font-size-h3); font-weight: 600; }
.ph { text-decoration: underline dashed var(--saral-feedback-warning-border) 2px; text-underline-offset: 0.14em; text-decoration-skip-ink: none; }
.lead { font-size: var(--saral-font-size-lead); color: var(--saral-text-muted); max-width: 36em; }
.actions { display: flex; flex-wrap: wrap; gap: var(--saral-space-3); margin: var(--saral-space-5) 0 var(--saral-space-3); }
a[data-scope="button"] { text-decoration: none; }
.install { font-size: var(--saral-font-size-small); color: var(--saral-text-muted); }
.install code { background: var(--saral-surface-sunken); color: var(--saral-text-default); padding: 2px var(--saral-space-2); border-radius: 4px; }
.hero { padding: var(--saral-space-7) 0 var(--saral-space-8); display: grid; gap: var(--saral-space-7); }
.proof { display: grid; gap: var(--saral-space-4); }
.proof > fieldset[data-scope="radio"] { border: 0; padding: 0; margin: 0; }
.proof [data-part="item-label"] { font-family: system-ui, sans-serif; } /* script names use system fonts, so a script's font loads only when it is chosen */
.proof [data-scope="radio"][data-part="root"] { display: flex; flex-wrap: wrap; gap: var(--saral-space-2) var(--saral-space-5); }
.panes { display: grid; gap: var(--saral-space-5); grid-template-columns: minmax(0, 1fr); }
@media (min-width: 860px) { .panes { grid-template-columns: 1fr 1fr; } }
.pane { background: var(--saral-surface-raised); border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); padding: var(--saral-space-5); display: grid; gap: var(--saral-space-4); align-content: start; }
.pane h3 { font-family: var(--saral-font-family-sans); font-size: var(--saral-font-size-small); font-weight: 600; color: var(--saral-text-muted); margin: 0; }
.on [data-lang] { display: none; }
${shown} { display: block; }
.off iframe { width: 100%; height: 470px; border: 0; background: var(--saral-surface-raised); }
section.block { padding: var(--saral-space-8) 0; border-top: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.checks { display: grid; gap: var(--saral-space-6); grid-template-columns: minmax(0, 1fr); }
@media (min-width: 860px) { .checks { grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); } }
.picker { display: flex; align-items: center; gap: var(--saral-space-3); }
.picker input[type="color"] { inline-size: 56px; block-size: 44px; padding: 0; border: var(--saral-size-stroke) solid var(--saral-border-strong); border-radius: var(--saral-radius-control); background: none; }
table { border-collapse: collapse; width: 100%; font-size: var(--saral-font-size-small); }
th, td { text-align: start; padding: var(--saral-space-2) var(--saral-space-3); border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
td.r { font-variant-numeric: tabular-nums; }
.pass { color: var(--saral-feedback-success-text); font-weight: 600; }
.fail { color: var(--saral-feedback-danger-text); font-weight: 600; }
.facts { display: grid; gap: var(--saral-space-5); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); list-style: none; padding: 0; margin: 0; }
.facts li { border-top: 2px solid var(--saral-action-default); padding-top: var(--saral-space-3); }
.facts strong { display: block; font: 700 28px/1.1 var(--display); }
.where { display: grid; gap: var(--saral-space-5); grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.where ul { list-style: none; padding: 0; margin: 0; }
.where li { padding: var(--saral-space-2) 0; border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
footer { border-top: var(--saral-size-stroke) solid var(--saral-border-hairline); padding: var(--saral-space-6) 0; font-size: var(--saral-font-size-small); color: var(--saral-text-muted); }
footer ul { display: flex; flex-wrap: wrap; gap: var(--saral-space-4); list-style: none; padding: 0; margin: var(--saral-space-2) 0 0; }
footer a { color: inherit; }
`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Saral: homepage mock, claim first</title>
${latinPreload}
<link rel="stylesheet" href="claim.css">
<style>${css}</style>
</head>
<body>
<p class="mock-note">Research mock, 2026-10-23. Text marked with a dashed line is proposed copy, waiting for the owner to sign it off.</p>
<div class="wrap">
<header class="top">
  <a class="brand" href="#">Saral</a>
  <nav class="main" aria-label="Main"><ul>
    <li><a href="#">Get started</a></li><li><a href="#">Foundations</a></li><li><a href="#">Components</a></li>
    <li><a href="#">Patterns</a></li><li><a href="#">Themes</a></li><li><a href="#">Trust</a></li>
  </ul></nav>
  <div class="tools">
    <select id="mode" aria-label="Colour mode"><option value="">System</option><option value="light">Light</option><option value="dark">Dark</option></select>
  </div>
</header>
<main>
<section class="hero" aria-labelledby="h">
  <div>
    <h1 id="h"><span class="ph">Forms everyone can finish.</span></h1>
    <p class="lead"><span class="ph">Saral is a design system for public services and financial products. Plain HTML and CSS that work in any stack, in any script and on any phone, even before JavaScript loads.</span></p>
    <div class="actions">
      <a data-scope="button" data-part="root" data-variant="accent" href="#">Get started</a>
      <a data-scope="button" data-part="root" data-variant="secondary" href="#">Browse components</a>
    </div>
    <p class="install"><code>npm i @saral/css</code> or one stylesheet from a CDN. No build step.</p>
  </div>
  <div class="proof">
    <fieldset data-scope="radio" data-part="root">
      <legend data-scope="radio" data-part="label">The same form, with JavaScript and without it. Show it in</legend>
      ${tabs}
    </fieldset>
    <div class="panes">
      <div class="pane on" aria-labelledby="on-h">
        <h3 id="on-h">With JavaScript</h3>
        ${forms}
      </div>
      <div class="pane off" aria-labelledby="off-h">
        <h3 id="off-h">With JavaScript off</h3>
        <iframe name="nojs" src="claim-nojs-en.html" sandbox="allow-same-origin allow-forms" title="The same form with scripts disabled"></iframe>
      </div>
    </div>
  </div>
</section>
<section class="block" aria-labelledby="c-h">
  <div class="checks">
    <div>
      <h2 id="c-h">Pick a colour. Every pair is checked.</h2>
      <p class="lead">The same contrast check that stops a Saral release runs here, in your browser. Choose an accent and see each pair that uses it measured against WCAG 2.</p>
      <p class="picker"><input type="color" id="accent" value="${neel.light['action.default']}" aria-describedby="accent-note"><label for="accent">Accent colour</label></p>
      <p id="accent-note" class="install">In the beta this view rebuilds every role from your colour. Here it checks the accent pairs.</p>
    </div>
    <table aria-labelledby="c-h">
      <thead><tr><th scope="col">Pair</th><th scope="col">Ratio</th><th scope="col">Needs</th><th scope="col">Result</th></tr></thead>
      <tbody id="pairs"></tbody>
    </table>
  </div>
</section>
<section class="block" aria-labelledby="f-h">
  <h2 id="f-h">Checked on every build</h2>
  <ul class="facts">
    <li><strong>Six scripts</strong>Latin, Devanagari, Tamil, Arabic, Thai and Japanese, in one form, with right to left</li>
    <li><strong>No script needed</strong>Every component works before JavaScript loads, and without it</li>
    <li><strong>26 pairs</strong>Contrast is measured for every theme; a pair below its minimum stops the release</li>
    <li><strong id="weight">Light</strong>This page, fonts included, measured in your browser</li>
  </ul>
</section>
<section class="block" aria-labelledby="w-h">
  <h2 id="w-h">Use it where you build</h2>
  <div class="where">
    <div><h3>Today</h3><ul><li>Any HTML: Rails, Django, Laravel, Go, .NET, htmx</li><li>React</li><li>Tokens as CSS, JavaScript and JSON</li></ul></div>
    <div><h3>Planned for 1.0</h3><ul><li>Web Components that work in every framework</li><li>Figma variables from the same source</li><li>Other platforms when a team asks</li></ul></div>
  </div>
</section>
</main>
<footer>
  Saral v0.3.1. MIT licence.
  <ul aria-label="Project and trust"><li><a href="#">Accessibility statement</a></li><li><a href="#">Security</a></li><li><a href="#">Support</a></li><li><a href="#">Governance</a></li><li><a href="#">Changes</a></li><li><a href="#">Decisions</a></li><li><a href="#">Source on GitHub</a></li></ul>
</footer>
</div>
<script type="module">
import { enhanceForm } from '../../../packages/core/src/index.mjs';
import { contrast, parseColor } from '../../../packages/tokens/src/color.mjs';

const html = document.documentElement;
const mode = document.getElementById('mode');
const applyMode = () => { if (mode.value) html.dataset.saralMode = mode.value; else delete html.dataset.saralMode; };
mode.addEventListener('change', applyMode);

// Real core behaviour on the left: inline errors in the form's own language.
for (const f of document.querySelectorAll('.on form')) {
  enhanceForm(f);
  f.addEventListener('submit', (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    f.querySelector('.sent').hidden = false;
  });
}

// The scripts-off pane follows the chosen script; the page inside it runs no script at all.
const frame = document.querySelector('iframe[name="nojs"]');
for (const r of document.querySelectorAll('input[name="script"]')) {
  r.addEventListener('change', () => { frame.src = 'claim-nojs-' + r.value + '.html'; });
}

// Live contrast, with Saral's own colour code.
const css = (name) => getComputedStyle(html).getPropertyValue('--saral-' + name).trim();
const rgb = (hex) => parseColor({ colorSpace: 'srgb', hex });
const rows = document.getElementById('pairs');
const draw = (accent) => {
  html.style.setProperty('--saral-action-default', accent);
  html.style.setProperty('--saral-accent-default', accent);
  html.style.setProperty('--saral-border-focus', accent);
  const pairs = [
    ['Button text on the accent', css('text-on-action'), accent, 4.5],
    ['Accent text on the page', accent, css('surface-ground'), 4.5],
    ['Accent text on a card', accent, css('surface-raised'), 4.5],
    ['Focus ring on the page', accent, css('surface-ground'), 3],
  ];
  rows.innerHTML = pairs.map(([label, a, b, min]) => {
    const r = contrast(rgb(a), rgb(b));
    const ok = r >= min;
    return '<tr><td>' + label + '</td><td class="r">' + r.toFixed(2) + ':1</td><td class="r">' + min + ':1</td><td class="' + (ok ? 'pass">Passes' : 'fail">Fails') + '</td></tr>';
  }).join('');
};
const accent = document.getElementById('accent');
accent.addEventListener('input', () => draw(accent.value));
accent.value = css('action-default');
draw(accent.value);
mode.addEventListener('change', () => { html.style.removeProperty('--saral-action-default'); html.style.removeProperty('--saral-accent-default'); html.style.removeProperty('--saral-border-focus'); requestAnimationFrame(() => { accent.value = css('action-default'); draw(accent.value); }); });

// Page weight, measured by the browser itself.
addEventListener('load', () => {
  const entries = [performance.getEntriesByType('navigation')[0], ...performance.getEntriesByType('resource')];
  const kb = Math.round(entries.reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0) / 1024);
  if (kb) document.getElementById('weight').textContent = kb + ' kB';
});
</script>
</body>
</html>
`;
}

// The scripts-off pages: one per script, no script of any kind, shown in a
// sandboxed frame. They share claim.css with the homepage.
const plain = (title, lang, dir, body) => `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="claim.css">
<style>body { background: var(--saral-surface-raised); padding: 2px; }</style>
</head>
<body>
${body}
</body>
</html>
`;
const noJs = (l) => plain(esc(l.t.go), l.code, l.dir, form(l, 'off', 'action="claim-nojs-sent.html" method="get"'));
const sent = () => plain('Sent', 'en', 'ltr', '<p data-scope="notice" data-part="root" data-tone="success" role="status">Sent with no JavaScript at all.</p>');

writeFileSync(here('claim.css'), `/* Generated by build-claim.mjs from dist/css and palettes.json. */\n${fontCss}\n${componentCss}\n${themeCss}\n${baseCss}`);
writeFileSync(here('claim.html'), page());
for (const l of LANGS) writeFileSync(here(`claim-nojs-${l.code}.html`), noJs(l));
writeFileSync(here('claim-nojs-sent.html'), sent());
const missing = FACES.map(([, f]) => f).filter((f) => !existsSync(here(`fonts/${f}`)));
console.log(`claim: wrote claim.css, claim.html and ${LANGS.length + 1} scripts-off pages${missing.length ? `; fonts not yet in place: ${missing.join(', ')}` : ''}`);
