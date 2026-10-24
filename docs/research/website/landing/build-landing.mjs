#!/usr/bin/env node
// Builds fifteen landing pages for Saral, one per visual direction collected
// on 2026-10-24, plus a picker. Every page shares the same markup and copy;
// each direction adds one identity layer (directions.mjs): its colour roles in
// light and dark, its fonts and corners, its CSS and its signature hero. Every
// component is Saral's own CSS from dist/ and its optional core script.
// Run: node docs/research/website/landing/build-landing.mjs
// Check: node docs/research/website/landing/check-landing.mjs (writes results.json, then rebuilds the picker and README)
// View through `npm run serve`: http://127.0.0.1:4321/docs/research/website/landing/
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { contrast, parseColor, srgbToOklch, oklchToSrgb, toHex } from '../../../../packages/tokens/src/color.mjs';

const here = (f) => new URL(f, import.meta.url);
const root = (f) => new URL(`../../../../${f}`, import.meta.url);
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const read = (f) => readFileSync(root(f), 'utf8');
const dist = (f) => read(`dist/css/${f}`).replace(/^\/\*.*?\*\/\n/, '');
export const REPO = 'https://github.com/AkashShivanand/saral';
const VERSION = JSON.parse(read('package.json')).version;

// ---------------------------------------------------------------- colour

const rgb = (hex) => parseColor({ colorSpace: 'srgb', hex });
export const ratio = (a, b) => contrast(rgb(a), rgb(b));
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// Moves a colour's OKLCH lightness, keeping its hue.
export function shade(hex, dL) {
  const [L, C, H] = srgbToOklch(rgb(hex));
  return toHex(oklchToSrgb([Math.min(1, Math.max(0, L + dL)), C, H]));
}
export function mix(a, b, t) {
  const [x, y] = [rgb(a), rgb(b)];
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
}
// Darkens (on a light ground) or lightens (on a dark one) a colour in its own
// hue until it reaches the ratio, with a small margin for rounding.
export function fit(hex, on, min) {
  if (ratio(hex, on) >= min) return hex;
  const step = lum(on) > 0.18 ? -0.004 : 0.004;
  let c = hex;
  for (let i = 0; i < 250 && ratio(c, on) < min + 0.08; i++) c = shade(c, step);
  return c;
}

// Base roles per mode (Mor's values), so a direction only writes what makes it its own.
const MOR = {
  light: { 'feedback.danger.text': '#b42318', 'feedback.danger.subtle': '#fdecea', 'feedback.success.text': '#1e6b3a', 'feedback.success.subtle': '#e7f3ec', 'feedback.warning.text': '#7a4b00', 'feedback.warning.subtle': '#fdf3e1', 'feedback.info.text': '#0b4a50', 'feedback.info.subtle': '#e6f0ef' },
  dark: { 'feedback.danger.text': '#ff8f80', 'feedback.danger.subtle': '#3a1714', 'feedback.success.text': '#6fcf8f', 'feedback.success.subtle': '#13291b', 'feedback.warning.text': '#f2c46b', 'feedback.warning.subtle': '#2e2410', 'feedback.info.text': '#8fd0d4', 'feedback.info.subtle': '#12302f' },
};

// Fills every colour role from a short list. Hover and pressed come from the
// action colour by lightness; feedback borders follow their text.
export function complete(p, mode) {
  const dir = mode === 'light' ? -1 : 1;
  const r = { ...MOR[mode], ...p };
  r['surface.raised'] ??= r['surface.ground'];
  r['surface.sunken'] ??= mix(r['surface.ground'], r['text.default'], 0.06);
  r['surface.inverse'] ??= r['text.default'];
  r['text.muted'] ??= mix(r['text.default'], r['surface.ground'], 0.3);
  r['text.quiet'] ??= r['text.muted'];
  r['text.inverse'] ??= r['surface.ground'];
  r['text.on-action'] ??= mode === 'light' ? '#ffffff' : r['surface.ground'];
  r['accent.default'] ??= r['action.default'];
  r['text.on-accent'] ??= r['text.on-action'];
  r['text.disabled'] ??= mix(r['text.default'], r['surface.ground'], 0.55);
  r['border.hairline'] ??= mix(r['surface.ground'], r['text.default'], 0.14);
  r['border.strong'] ??= r['text.muted'];
  r['border.focus'] ??= r['accent.default'];
  r['action.hover'] ??= shade(r['action.default'], 0.06 * dir);
  r['action.pressed'] ??= shade(r['action.default'], 0.12 * dir);
  r['action.disabled'] ??= r['surface.sunken'];
  r['accent.hover'] ??= shade(r['accent.default'], 0.06 * dir);
  r['accent.subtle'] ??= mix(r['surface.ground'], r['accent.default'], mode === 'light' ? 0.1 : 0.16);
  for (const t of ['danger', 'success', 'warning', 'info']) {
    r[`feedback.${t}.border`] ??= r[`feedback.${t}.text`];
  }
  return r;
}

const PAIRS = [
  ...JSON.parse(read('tokens/pairs.json')).pairs,
  // Pairs these pages add: inputs and cards sit on the raised surface.
  { text: 'border.strong', on: 'surface.raised', min: 3 },
  { text: 'action.default', on: 'surface.raised', min: 3 },
  { text: 'text.on-accent', on: 'accent.hover', min: 4.5 },
  { text: 'feedback.danger.text', on: 'surface.raised', min: 4.5 },
  { text: 'feedback.danger.border', on: 'surface.raised', min: 3 },
];
export const PAIR_COUNT = PAIRS.length;

export function checkTheme(name, light, dark) {
  const rows = [];
  for (const [mode, t] of [['light', light], ['dark', dark]]) {
    for (const { text, on, min } of PAIRS) {
      const r = ratio(t[text], t[on]);
      rows.push({ theme: name, mode, text, on, min, ratio: r, ok: r >= min });
    }
  }
  return rows;
}

const cssName = (role) => `--saral-${role.replaceAll('.', '-')}`;
// Colour roles as light-dark() pairs, so color-scheme alone picks the mode.
export function roleVars(light, dark, only) {
  return Object.keys(light)
    .filter((r) => !only || only.includes(r))
    .map((r) => `${cssName(r)}: ${light[r] === dark[r] ? light[r] : `light-dark(${light[r]}, ${dark[r]})`};`)
    .join(' ');
}

// ---------------------------------------------------------------- data

// The same strings as build-claim.mjs and translations.md: the trimmed
// script fonts hold only these letters. Drafts until a native reader checks them.
export const LANGS = [
  { code: 'en', dir: 'ltr', name: 'English', t: { name: 'Full name', hint: 'As it appears on your ID', nameErr: 'Enter your full name', contact: 'Contact by', choose: 'Choose one', email: 'Email', phone: 'Phone', contactErr: 'Choose how we should contact you', updates: 'Send me updates', go: 'Continue', sent: 'Sent. Check your inbox.' } },
  { code: 'hi', dir: 'ltr', name: 'Hindi', t: { name: 'पूरा नाम', hint: 'जैसा आपके पहचान पत्र पर लिखा है', nameErr: 'अपना पूरा नाम लिखें', contact: 'संपर्क का तरीका', choose: 'एक चुनें', email: 'ईमेल', phone: 'फ़ोन', contactErr: 'चुनें कि हम आपसे कैसे संपर्क करें', updates: 'मुझे अपडेट भेजें', go: 'आगे बढ़ें', sent: 'भेज दिया गया। अपना इनबॉक्स देखें।' } },
  { code: 'ta', dir: 'ltr', name: 'Tamil', t: { name: 'முழுப் பெயர்', hint: 'உங்கள் அடையாள அட்டையில் உள்ளபடி', nameErr: 'உங்கள் முழுப் பெயரை உள்ளிடவும்', contact: 'தொடர்பு முறை', choose: 'ஒன்றைத் தேர்வு செய்யவும்', email: 'மின்னஞ்சல்', phone: 'தொலைபேசி', contactErr: 'உங்களை எப்படித் தொடர்பு கொள்வது எனத் தேர்வு செய்யவும்', updates: 'எனக்குப் புதுப்பிப்புகளை அனுப்பவும்', go: 'தொடரவும்', sent: 'அனுப்பப்பட்டது. உங்கள் இன்பாக்ஸைப் பார்க்கவும்.' } },
  { code: 'ar', dir: 'rtl', name: 'Arabic', t: { name: 'الاسم الكامل', hint: 'كما يظهر في بطاقة هويتك', nameErr: 'أدخل اسمك الكامل', contact: 'طريقة التواصل', choose: 'اختر واحدة', email: 'البريد الإلكتروني', phone: 'الهاتف', contactErr: 'اختر طريقة التواصل معك', updates: 'أرسل لي التحديثات', go: 'متابعة', sent: 'تم الإرسال. تحقق من بريدك الوارد.' } },
  { code: 'th', dir: 'ltr', name: 'Thai', t: { name: 'ชื่อ-นามสกุล', hint: 'ตามที่ปรากฏบนบัตรประจำตัว', nameErr: 'กรอกชื่อ-นามสกุลของคุณ', contact: 'ช่องทางติดต่อ', choose: 'เลือกหนึ่งรายการ', email: 'อีเมล', phone: 'โทรศัพท์', contactErr: 'เลือกช่องทางที่ให้เราติดต่อคุณ', updates: 'ส่งข่าวสารให้ฉัน', go: 'ดำเนินการต่อ', sent: 'ส่งแล้ว โปรดตรวจสอบกล่องจดหมายของคุณ' } },
  { code: 'ja', dir: 'ltr', name: 'Japanese', t: { name: '氏名', hint: '身分証明書の記載どおりに', nameErr: '氏名を入力してください', contact: '連絡方法', choose: '選択してください', email: 'メール', phone: '電話', contactErr: '連絡方法を選択してください', updates: '最新情報を受け取る', go: '次へ', sent: '送信しました。受信トレイを確認してください。' } },
];
export const EN = LANGS[0];

export const SPECS = readdirSync(root('specs')).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(read(`specs/${f}`)));
const ORDER = ['Field', 'Checkbox', 'Radio group', 'Select', 'Button', 'Link', 'Notice', 'Tag', 'Card'];
SPECS.sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));

const coreFiles = readdirSync(root('packages/core/src')).filter((f) => f.endsWith('.mjs') && !f.includes('.test.'));
const coreBytes = coreFiles.reduce((s, f) => s + read(`packages/core/src/${f}`).length, 0);
const coreGzip = gzipSync(coreFiles.map((f) => read(`packages/core/src/${f}`)).join('\n')).length;
const runtimeDeps = ['tokens', 'css', 'core'].reduce((s, p) => s + Object.keys(JSON.parse(read(`packages/${p}/package.json`)).dependencies ?? {}).filter((d) => !d.startsWith('@saral/')).length, 0);
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
// Real numbers from the repo, for the pages that show figures.
export const FACTS = {
  components: SPECS.length,
  pairs: JSON.parse(read('tokens/pairs.json')).pairs.length,
  deps: runtimeDeps,
  core: kb(coreBytes),
  coreGzip: kb(coreGzip),
  css: kb(read('dist/css/components.css').length),
  scripts: LANGS.length,
  version: VERSION,
};
const jsWeight = (s) => {
  const core = s.states.filter((x) => x.setBy === 'core').map((x) => x.state);
  if (core.includes('pending')) return kb(read('packages/core/src/pending.mjs').length);
  if (core.length) return kb(read('packages/core/src/field.mjs').length);
  return '0 kB';
};
const scriptAdds = (s) => {
  const core = s.states.filter((x) => x.setBy === 'core').map((x) => x.state);
  if (core.includes('pending')) return 'A busy state while the form posts';
  if (core.length) return 'Errors in your words, focus to the first';
  return 'Nothing: ships no script';
};
const rootElement = (s) => s.anatomy.find((a) => a.part === 'root')?.element ?? '';

// ---------------------------------------------------------------- markup

// One form, real Saral markup, as the specs write it. Without a script it
// posts to sent.html; with core it shows errors inline and confirms in place.
export function form(l, prefix, o = {}) {
  const { t, code, dir } = l;
  const id = (s) => `${prefix}-${code}-${s}`;
  const variant = o.variant ?? 'accent';
  return `<form class="demo-form" lang="${code}" dir="${dir}" action="${o.action ?? 'sent.html'}" method="get"${o.demo === false ? '' : ' data-demo'}>
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
  <div class="form-actions"><button data-scope="button" data-part="root"${variant === 'primary' ? '' : ` data-variant="${variant}"`} type="submit">${esc(t.go)}</button></div>
  <p data-scope="notice" data-part="root" data-tone="success" role="status" class="sent" hidden>${esc(t.sent)}</p>
</form>`;
}

// A short email form whose field starts wrong, so the hero can show a real,
// live error: core checks it on load as if the reader had just left it.
export function emailForm(prefix, o = {}) {
  const id = (s) => `${prefix}-${s}`;
  return `<form class="demo-form" action="sent.html" method="get" data-demo>
  <div data-scope="field" data-part="root">
    <label data-scope="field" data-part="label" for="${id('email')}">${esc(o.label ?? 'Email address')}</label>
    <input data-scope="field" data-part="input" id="${id('email')}" name="email" type="email" autocomplete="email" required value="${esc(o.value ?? 'asha.example.com')}" aria-describedby="${id('email-hint')}" data-show-error>
    <p data-scope="field" data-part="hint" id="${id('email-hint')}">${esc(o.hint ?? 'We only use it to reply to you')}</p>
    <p data-scope="field" data-part="error" id="${id('email-error')}" data-message-value-missing="Enter your email address" data-message-type-mismatch="Enter an email address like name@example.com">Enter an email address like name@example.com</p>
  </div>
  <fieldset data-scope="radio" data-part="root">
    <legend data-scope="radio" data-part="label">${esc(o.radioLabel ?? 'Reply by')}</legend>
    <div data-scope="radio" data-part="item"><input data-scope="radio" data-part="input" type="radio" id="${id('w1')}" name="reply" value="email" checked><label data-scope="radio" data-part="item-label" for="${id('w1')}">Email</label></div>
    <div data-scope="radio" data-part="item"><input data-scope="radio" data-part="input" type="radio" id="${id('w2')}" name="reply" value="phone"><label data-scope="radio" data-part="item-label" for="${id('w2')}">Phone call</label></div>
  </fieldset>
  <div class="form-actions"><button data-scope="button" data-part="root" data-variant="${o.variant ?? 'accent'}" type="submit">${esc(o.go ?? 'Send')}</button></div>
  <p data-scope="notice" data-part="root" data-tone="success" role="status" class="sent" hidden>Sent. We will reply within two working days.</p>
</form>`;
}

// A radio group drawn as a row of chips: the switch every page uses. Native
// radios, so it works with no script, with the keyboard and in forced colours.
export function seg(name, legend, items, o = {}) {
  return `<fieldset data-scope="radio" data-part="root" class="seg${o.cls ? ` ${o.cls}` : ''}">
  <legend data-scope="radio" data-part="label"${o.hideLegend ? ' class="vh"' : ''}>${esc(legend)}</legend>
  ${items.map(([value, label, extra = ''], i) => `<div data-scope="radio" data-part="item"><input data-scope="radio" data-part="input" type="radio" id="${name}-${value}" name="${name}" value="${value}"${(o.checked ?? 0) === i ? ' checked' : ''}><label data-scope="radio" data-part="item-label" for="${name}-${value}"${extra}>${label}</label></div>`).join('\n  ')}
</fieldset>`;
}

export const button = (label, variant = '', type = 'button') => `<button data-scope="button" data-part="root"${variant ? ` data-variant="${variant}"` : ''} type="${type}">${esc(label)}</button>`;
export const tag = (label) => `<span data-scope="tag" data-part="root"><span data-scope="tag" data-part="label">${esc(label)}</span></span>`;
export const notice = (text, tone = '') => `<div data-scope="notice" data-part="root"${tone ? ` data-tone="${tone}"` : ''}>${esc(text)}</div>`;
export const link = (text, href) => `<a data-scope="link" data-part="root" href="${href}">${esc(text)}</a>`;
export const card = (title, body, level = 3) => `<article data-scope="card" data-part="root"><h${level} data-scope="card" data-part="title">${esc(title)}</h${level}><p data-scope="card" data-part="body">${esc(body)}</p></article>`;
export const field = (id, label, o = {}) => `<div data-scope="field" data-part="root"><label data-scope="field" data-part="label" for="${id}">${esc(label)}</label><input data-scope="field" data-part="input" id="${id}" name="${o.name ?? id}"${o.type ? ` type="${o.type}"` : ''}${o.value ? ` value="${esc(o.value)}"` : ''}${o.placeholder ? ` placeholder="${esc(o.placeholder)}"` : ''}>${o.hint ? `<p data-scope="field" data-part="hint">${esc(o.hint)}</p>` : ''}</div>`;
export const select = (id, label, options) => `<div data-scope="select" data-part="root"><label data-scope="select" data-part="label" for="${id}">${esc(label)}</label><select data-scope="select" data-part="input" id="${id}" name="${id}">${options.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>`;
export const checkbox = (id, label, checked = false) => `<div data-scope="checkbox" data-part="root"><input data-scope="checkbox" data-part="input" type="checkbox" id="${id}" name="${id}"${checked ? ' checked' : ''}><label data-scope="checkbox" data-part="label" for="${id}">${esc(label)}</label></div>`;
export const radios = (name, legend, items) => `<fieldset data-scope="radio" data-part="root"><legend data-scope="radio" data-part="label">${esc(legend)}</legend>${items.map((it, i) => `<div data-scope="radio" data-part="item"><input data-scope="radio" data-part="input" type="radio" id="${name}-${i}" name="${name}"${i ? '' : ' checked'}><label data-scope="radio" data-part="item-label" for="${name}-${i}">${esc(it)}</label></div>`).join('')}</fieldset>`;

// A live sample of each component, for the components table.
function sample(name, p) {
  switch (name) {
    case 'Field': return field(`${p}-f`, 'Town');
    case 'Checkbox': return checkbox(`${p}-c`, 'Agree');
    case 'Radio group': return radios(`${p}-r`, 'Size', ['Small', 'Large']);
    case 'Select': return select(`${p}-s`, 'Day', ['Monday', 'Tuesday']);
    case 'Button': return button('Send');
    case 'Link': return link('Read the spec', '#components');
    case 'Notice': return notice('Saved', 'success');
    case 'Tag': return tag('Forms');
    case 'Card': return card('Card title', 'One item, one box.', 3);
    default: return '';
  }
}

// ---------------------------------------------------------------- kolam

// One continuous line around an m by n grid of dots, computed, never drawn by
// hand. Dots sit on odd points of a 2m by 2n lattice; the line runs diagonally
// through points where x + y is odd, so it passes between dots, and bounces
// off the edges like a ball in a box. With gcd(m, n) = 1 the bounces close
// into a single loop. Each bounce becomes a round turn around the edge dot;
// two bounces in a row (a corner) become one wider turn around the corner dot.
export function kolam(m, n, s = 24, pad = 1.6) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  if (gcd(m, n) !== 1) throw new Error(`kolam: ${m} by ${n} does not close in one line`);
  const W = 2 * m;
  const H = 2 * n;
  let [x, y, dx, dy] = [1, 0, 1, 1];
  // Start on the bottom edge, just after a bounce, heading up and right.
  const steps = [];
  const start = `${x},${y},${dx},${dy}`;
  do {
    x += dx;
    y += dy;
    let bounce = false;
    if (x === 0 || x === W) { dx = -dx; bounce = true; }
    if (y === 0 || y === H) { dy = -dy; bounce = true; }
    steps.push({ x, y, dx, dy, bounce });
  } while (`${x},${y},${dx},${dy}` !== start && steps.length < 10000);
  const P = (px, py) => `${((px + pad) * s).toFixed(1)} ${((H - py + pad) * s).toFixed(1)}`;
  // Walk from a point that is not a bounce; at each run of bounces, curve from
  // the point before it to the point after it.
  const first = steps.findIndex((p) => !p.bounce);
  const seq = [...steps.slice(first), ...steps.slice(0, first)];
  let d = `M${P(seq[0].x, seq[0].y)}`;
  for (let i = 1; i <= seq.length; i++) {
    const p = seq[i % seq.length];
    if (!p.bounce) { d += ` L${P(p.x, p.y)}`; continue; }
    const a = seq[i - 1];
    let j = i;
    while (seq[j % seq.length].bounce) j++;
    const b = seq[j % seq.length];
    const t = j - i === 1 ? 1.25 : 1.75;
    d += ` C${P(a.x + a.dx * t, a.y + a.dy * t)} ${P(b.x - b.dx * t, b.y - b.dy * t)} ${P(b.x, b.y)}`;
    i = j;
  }
  const dots = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dots.push([(2 * i + 1 + pad) * s, (2 * j + 1 + pad) * s]);
  return { d: `${d} Z`, dots, w: (W + 2 * pad) * s, h: (H + 2 * pad) * s };
}

export function kolamSvg(m, n, o = {}) {
  const k = kolam(m, n, o.s ?? 24);
  const label = o.label ?? `One continuous line drawn around a grid of ${m} by ${n} dots`;
  return `<svg class="kolam ${o.cls ?? ''}" viewBox="0 0 ${k.w} ${k.h}" ${o.decorative ? 'aria-hidden="true"' : `role="img" aria-label="${esc(label)}"`} focusable="false">
  <g class="kolam-dots">${k.dots.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="${o.r ?? 3.4}"/>`).join('')}</g>
  <path class="kolam-line" pathLength="1" d="${k.d}"/>
</svg>`;
}

// ---------------------------------------------------------------- shared CSS

const FONT_RANGE_LATIN = 'U+0000-00FF, U+2013-2014, U+2018-201D, U+2026, U+20B9';
const FACES = [
  ['Saral Eczar', 'eczar-latin.woff2', '500 800', FONT_RANGE_LATIN],
  ['Anek Latin', 'anek-latin.woff2', '400 700', FONT_RANGE_LATIN],
  ['Anek Devanagari', 'anek-devanagari.woff2', '400 700', 'U+0900-097F, U+1CD0-1CFF, U+200C-200D, U+25CC, U+A8E0-A8FF'],
  // One family for every non-Latin script: each face loads only when a page shows its script.
  ['Saral Script', 'anek-devanagari.woff2', '400 700', 'U+0900-097F, U+1CD0-1CFF, U+200C-200D, U+25CC, U+A8E0-A8FF'],
  ['Saral Script', 'anek-tamil.woff2', '400 700', 'U+0B80-0BFF, U+200C-200D, U+25CC'],
  ['Saral Script', 'noto-arabic.woff2', '400 700', 'U+0600-06FF, U+0750-077F, U+200C-200F, U+FB50-FDFF, U+FE70-FEFF'],
  ['Saral Script', 'noto-thai.woff2', '400 700', 'U+0E00-0E7F, U+200C-200D'],
  ['Saral Script', 'noto-jp.woff2', '400 700', 'U+3000-303F, U+3040-309F, U+30A0-30FF, U+4E00-9FFF, U+FF00-FFEF'],
];
const fontCss = FACES.map(([family, file, weight, range]) => `@font-face { font-family: "${family}"; src: url("../fonts/${file}") format("woff2"); font-weight: ${weight}; font-display: swap; unicode-range: ${range}; }`).join('\n');

// Every --saral-* value of a dist theme, to apply Mor or Kosh to one element.
function themeValues(file) {
  const seen = new Map();
  for (const m of dist(file).matchAll(/(--saral-[\w-]+):\s*([^;]+);/g)) if (!seen.has(m[1])) seen.set(m[1], m[2]);
  return seen;
}
export const MOR_VALUES = themeValues('mor.css');
export const KOSH_VALUES = themeValues('kosh.css');
export const asDecls = (map) => [...map].filter(([k]) => !k.includes('motion')).map(([k, v]) => `${k}: ${v};`).join(' ');

const SHARED = `
*, *::before, *::after { box-sizing: border-box; }
:root { color-scheme: light dark; --d-sans: var(--saral-font-family-sans); --d-display: var(--d-sans); --d-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; --d-max: 1200px; --d-gutter: clamp(16px, 4vw, 40px); }
/* Colour mode: the header's radios drive color-scheme through :has(), so the
   switch works before any script; the script only remembers the choice. */
:root:has(#mode-light:checked) { color-scheme: light; }
:root:has(#mode-dark:checked) { color-scheme: dark; }
/* Element defaults sit in Saral's reset layer, so component styles always win over them. */
@layer saral.reset {
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
body { margin: 0; background: var(--saral-surface-ground); color: var(--saral-text-default); font-family: var(--saral-font-family-sans); font-size: var(--saral-font-size-body); line-height: var(--saral-font-leading-body); overflow-wrap: break-word; }
img, svg { max-width: 100%; }
a { color: var(--saral-accent-default); text-underline-offset: 0.18em; }
:focus-visible { outline: var(--saral-focus-width) solid var(--saral-border-focus); outline-offset: 2px; }
h1, h2, h3 { font-family: var(--d-display); line-height: var(--saral-font-leading-tight); margin: 0 0 var(--saral-space-4); text-wrap: balance; }
h1 { font-size: clamp(40px, 1.6rem + 4vw, 76px); }
h2 { font-size: clamp(28px, 1.2rem + 1.8vw, 42px); }
h3 { font-size: var(--saral-font-size-h3); }
p { margin: 0 0 var(--saral-space-4); }
code, pre, kbd { font-family: var(--d-mono); }
}
pre { margin: 0; padding: var(--saral-space-3) var(--saral-space-4); font-size: 13px; line-height: 1.55; background: var(--saral-surface-sunken); color: var(--saral-text-default); border-radius: var(--saral-radius-box); white-space: pre-wrap; overflow-wrap: anywhere; }
.vh { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.skip { position: absolute; inset-inline-start: var(--saral-space-3); top: -100px; z-index: 10; padding: var(--saral-space-2) var(--saral-space-4); background: var(--saral-surface-inverse); color: var(--saral-text-inverse); }
.skip:focus { top: var(--saral-space-3); }
.wrap { max-width: var(--d-max); margin-inline: auto; padding-inline: var(--d-gutter); }
.research-note { margin: 0; padding: var(--saral-space-2) var(--d-gutter); font-size: var(--saral-font-size-small); background: var(--saral-surface-sunken); color: var(--saral-text-muted); text-align: center; }
.research-note a { color: inherit; }
.site-head .head-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--saral-space-3) var(--saral-space-5); padding-block: var(--saral-space-4); }
.brand { color: var(--saral-text-default); text-decoration: none; font-family: var(--d-display); font-weight: 700; font-size: 26px; line-height: 1; display: inline-flex; align-items: center; gap: var(--saral-space-2); min-height: 24px; }
.main-nav ul { display: flex; flex-wrap: wrap; gap: var(--saral-space-1) var(--saral-space-4); list-style: none; margin: 0; padding: 0; font-size: var(--saral-font-size-small); }
.main-nav a { color: var(--saral-text-muted); text-decoration: none; display: inline-block; padding-block: 2px; }
@media (hover: hover) { .main-nav a:hover { color: var(--saral-text-default); text-decoration: underline; } }
.head-tools { margin-inline-start: auto; display: flex; flex-wrap: wrap; align-items: center; gap: var(--saral-space-3); font-size: var(--saral-font-size-small); }
.search-link { color: var(--saral-text-default); }
/* Chip row: a Saral radio group laid out in a line. */
.seg[data-part="root"] { display: flex; flex-wrap: wrap; gap: var(--saral-space-2); align-items: center; }
.seg > legend { float: inline-start; width: 100%; margin-bottom: var(--saral-space-2); font-size: var(--saral-font-size-small); }
.seg > legend.vh { float: none; width: 1px; }
.seg [data-part="item"] { position: relative; display: inline-grid; grid-template-columns: auto auto; column-gap: var(--saral-space-2); align-items: center; min-height: 36px; padding: 2px var(--saral-space-3) 2px var(--saral-space-2); border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-radius: var(--saral-radius-control); background: var(--saral-surface-raised); font-size: var(--saral-font-size-small); }
.seg [data-part="item"]:has(:checked) { border-color: var(--saral-action-default); background: var(--saral-accent-subtle); }
.seg [data-part="input"] { width: 18px; height: 18px; }
.seg [data-part="item-label"] { cursor: pointer; padding-block: 4px; }
.seg [data-part="item-label"]::after { content: ""; position: absolute; inset: 0; }
.mode[data-part="root"] .seg-item, .mode [data-part="item"] { min-height: 32px; }
.hero { padding-block: var(--saral-space-7) var(--saral-space-8); }
.hero-grid { display: grid; gap: var(--saral-space-7); grid-template-columns: minmax(0, 1fr); align-items: center; }
@media (min-width: 960px) { .hero-grid { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); } }
.lead { font-size: var(--saral-font-size-lead); color: var(--saral-text-muted); max-width: 38em; }
.actions { display: flex; flex-wrap: wrap; gap: var(--saral-space-3); margin: var(--saral-space-5) 0; }
a[data-scope="button"] { text-decoration: none; }
.install { display: flex; flex-wrap: wrap; align-items: center; gap: var(--saral-space-2) var(--saral-space-3); font-size: var(--saral-font-size-small); color: var(--saral-text-muted); margin: 0; }
.install code { font-size: 15px; padding: var(--saral-space-2) var(--saral-space-3); background: var(--saral-surface-sunken); color: var(--saral-text-default); border-radius: var(--saral-radius-box); }
.install .copy { min-height: 36px; padding-inline: var(--saral-space-3); font-size: var(--saral-font-size-small); }
.install-note { flex-basis: 100%; }
.demo-form { display: grid; gap: var(--saral-space-4); max-width: 32rem; }
.demo-form .form-actions { display: flex; flex-wrap: wrap; gap: var(--saral-space-3); }
[hidden] { display: none !important; }
.sec { padding-block: var(--d-sec-pad, var(--saral-space-8)); border-top: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.sec-head { margin-bottom: var(--saral-space-6); }
.eyebrow { font-family: var(--d-mono); font-size: 13px; letter-spacing: 0.04em; color: var(--saral-text-muted); margin-bottom: var(--saral-space-2); }
.note { font-size: var(--saral-font-size-small); color: var(--saral-text-muted); margin-top: var(--saral-space-4); }
summary { cursor: pointer; font-weight: var(--saral-font-weight-medium); min-height: 24px; padding-block: var(--saral-space-1); }
details > :not(summary) { margin-top: var(--saral-space-3); }
/* Live theming: the form's markup never changes; the chosen theme's values
   are set on the stage around it by CSS alone. */
.theming { display: grid; gap: var(--saral-space-5); }
.theming-grid { display: grid; gap: var(--saral-space-5); grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 900px) { .theming-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
.stage { padding: var(--saral-space-6); background: var(--saral-surface-ground); color: var(--saral-text-default); font-family: var(--saral-font-family-sans); border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); transition: background-color var(--saral-motion-duration-base) var(--saral-motion-ease-standard); }
.theming:has([id$="-mor"]:checked) .stage, .as-mor { ${asDecls(MOR_VALUES)} }
.theming:has([id$="-kosh"]:checked) .stage, .as-kosh { ${asDecls(KOSH_VALUES)} }
.cs-light { color-scheme: light; }
.cs-dark { color-scheme: dark; }
.theming-code { display: grid; gap: var(--saral-space-4); }
.code-label { font-family: var(--d-mono); font-size: 13px; color: var(--saral-text-muted); margin-bottom: var(--saral-space-2); }
.tf { display: none; }
.theming:has([id$="-own"]:checked) .tf-own, .theming:has([id$="-mor"]:checked) .tf-mor, .theming:has([id$="-kosh"]:checked) .tf-kosh { display: block; }
/* Every script: one pane shows; the others are not rendered, so their fonts never load. */
.script-pane { display: none; }
${LANGS.map((l) => `.scripts:has(#sc-${l.code}:checked) [data-lang="${l.code}"]`).join(', ')} { display: block; }
.script-stage { margin-top: var(--saral-space-5); padding: var(--saral-space-6); background: var(--saral-surface-raised); border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); }
.script-pane .demo-form { font-family: var(--saral-font-family-sans); }
.script-pane .demo-form[dir="rtl"] { margin-left: auto; }
.nojs-grid { display: grid; gap: var(--saral-space-6); grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 900px) { .nojs-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
.nojs-pane { border: var(--saral-size-stroke) solid var(--saral-border-strong); border-radius: var(--saral-radius-box); background: var(--saral-surface-raised); }
.nojs-pane > summary { padding: var(--saral-space-4) var(--saral-space-5); font-size: var(--saral-font-size-lead); }
.nojs-pane[open] > summary { border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
.nojs-pane > .nojs-frame { margin: 0; display: block; border: 0; border-radius: 0 0 var(--saral-radius-box) var(--saral-radius-box); }
.nojs-frame { width: 100%; height: 560px; border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); background: var(--saral-surface-raised); }
.steps { padding-inline-start: 1.4em; display: grid; gap: var(--saral-space-2); }
.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font-size: var(--saral-font-size-small); }
th, td { text-align: start; vertical-align: top; padding: var(--saral-space-3); border-bottom: var(--saral-size-stroke) solid var(--saral-border-hairline); }
thead th { font-weight: var(--saral-font-weight-bold); color: var(--saral-text-muted); }
td.num { font-variant-numeric: tabular-nums; white-space: nowrap; }
.comp-table td.live { min-width: 200px; }
.comp-table td.live [data-scope="card"][data-part="root"] { padding: var(--saral-space-3); }
.pass { color: var(--saral-feedback-success-text); font-weight: var(--saral-font-weight-bold); }
.fail { color: var(--saral-feedback-danger-text); font-weight: var(--saral-font-weight-bold); }
.plat-grid { display: grid; gap: var(--saral-space-5); grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
.plat-grid ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--saral-space-3); }
.plat-grid li { display: grid; gap: 2px; }
.plat-grid li span { color: var(--saral-text-muted); font-size: var(--saral-font-size-small); }
.trust-grid { display: grid; gap: var(--saral-space-6); grid-template-columns: minmax(0, 1fr); }
@media (min-width: 900px) { .trust-grid { grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); } }
.trust-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--saral-space-4); }
.trust-list strong { display: block; }
.site-foot { border-top: var(--saral-size-stroke) solid var(--saral-border-hairline); padding-block: var(--saral-space-7); font-size: var(--saral-font-size-small); color: var(--saral-text-muted); }
.foot-grid { display: grid; gap: var(--saral-space-5); grid-template-columns: minmax(0, 1fr); }
@media (min-width: 800px) { .foot-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
.site-foot ul { display: flex; flex-wrap: wrap; gap: var(--saral-space-2) var(--saral-space-4); list-style: none; padding: 0; margin: 0 0 var(--saral-space-3); }
.site-foot a { color: var(--saral-text-default); }
.search-form { display: flex; flex-wrap: wrap; gap: var(--saral-space-3); align-items: end; }
.search-form [data-scope="field"] { flex: 1 1 200px; }
/* Text that follows the colour mode, for readouts of light and dark values. */
.only-dark { display: none; }
@media (prefers-color-scheme: dark) { :root:not(:has(#mode-light:checked)) .only-dark { display: inline; } :root:not(:has(#mode-light:checked)) .only-light { display: none; } }
:root:has(#mode-dark:checked) .only-dark { display: inline; }
:root:has(#mode-dark:checked) .only-light { display: none; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
@media (forced-colors: active) { .seg [data-part="item"]:has(:checked) { outline: 2px solid Highlight; } }
`;

// ---------------------------------------------------------------- page

const NAV = [['Get started', '#start'], ['Components', '#components'], ['Patterns', '#scripts'], ['Themes', '#themes'], ['Lab', '#nojs'], ['Trust', '#trust']];
export const SUB = 'Saral is a design system of tokens and native HTML components. Change the theme, and every part takes on your brand. Every part stays accessible, works in any stack and any script, and works before JavaScript loads.';

function fontLinks(d) {
  const out = [];
  for (const f of d.preload ?? []) out.push(`<link rel="preload" href="../fonts/${f}" as="font" type="font/woff2" crossorigin>`);
  if (d.google?.length) {
    out.push('<link rel="preconnect" href="https://fonts.googleapis.com">', '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
    for (const g of d.google) out.push(`<link rel="stylesheet" href="${esc(g)}">`);
  }
  return out.join('\n');
}

// Google Fonts, cut to printable Latin by the text= parameter: one small file
// per family instead of every subset.
const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') + '’‘“”…·•×→←↑↓✓';
export const google = (families, text = ASCII) => `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap&text=${encodeURIComponent(text)}`;

function rootCss(d) {
  const extra = Object.entries(d.tokens ?? {}).map(([k, v]) => `--${k}: ${v};`).join(' ');
  const custom = Object.entries(d.colors ?? {}).map(([k, [l, dk]]) => `--d-${k}: light-dark(${l}, ${dk});`).join(' ');
  return `:root { ${roleVars(d.light, d.dark)} ${extra} ${custom} }`;
}

function header(d) {
  return `<header class="site-head" id="top">
<div class="wrap head-row">
  <a class="brand" href="#main">${d.wordmark ?? 'Saral'}</a>
  <nav class="main-nav" aria-label="Main"><ul>${NAV.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></nav>
  <div class="head-tools">
    <a class="search-link" href="#search">Search</a>
    ${seg('mode', 'Colour mode', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']], { cls: 'mode', hideLegend: true })}
  </div>
</div>
</header>`;
}

function hero(d, ctx) {
  return `<section class="hero" aria-labelledby="hero-h">
<div class="wrap hero-grid">
  <div class="hero-copy">
    ${d.kicker ? `<p class="kicker">${d.kicker}</p>` : ''}
    <h1 id="hero-h">${d.headline ?? 'Build it plain. Make it yours.'}</h1>
    <p class="lead">${SUB}</p>
    <div class="actions">
      <a data-scope="button" data-part="root" data-variant="${d.ctaVariant ?? 'accent'}" href="#start">Get started</a>
      <a data-scope="button" data-part="root" data-variant="secondary" href="#components">Browse components</a>
    </div>
    <p class="install" id="start"><code data-copy>npm i @saral/css @saral/core</code><span class="install-note">The first release, 0.4.0, is being prepared. No build step needed.</span></p>
  </div>
  <div class="hero-sig">${d.hero({ ...ctx, d })}</div>
</div>
</section>`;
}

const head = (id, eyebrow, title, lead) => `<div class="sec-head"><p class="eyebrow" aria-hidden="true">${eyebrow}</p><h2 id="${id}-h">${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;

const snippet = (light, dark, tokens) => [
  ':root {',
  ...['surface.ground', 'text.default', 'action.default', 'accent.default', 'border.focus'].map((r) => `  ${cssName(r)}: light-dark(${light[r]}, ${dark[r]});`),
  ...Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`),
  '}',
].join('\n');
const fromDist = (vals, keys) => [':root {', ...keys.map((k) => `  ${k}: ${vals.get(k)};`), '}'].join('\n');
const DIST_KEYS = ['--saral-surface-ground', '--saral-text-default', '--saral-action-default', '--saral-accent-default', '--saral-border-focus', '--saral-radius-box', '--saral-radius-control', '--saral-font-family-sans'];

function theming(d) {
  const markup = form(EN, 'th');
  const own = { 'saral-radius-box': d.tokens?.['saral-radius-box'] ?? '4px', 'saral-radius-control': d.tokens?.['saral-radius-control'] ?? '4px', 'saral-font-family-sans': d.tokens?.['saral-font-family-sans'] ?? 'Mor default' };
  return `<section id="themes" class="sec" aria-labelledby="themes-h">
<div class="wrap">
  ${head('themes', d.eyebrows?.[0] ?? 'Themes', d.titles?.themes ?? 'One form. Change the theme, not the markup.', 'Pick a theme. The form keeps the same HTML; only the theme file changes its colours, corners and type. This switch is CSS alone, so it works with JavaScript off.')}
  <div class="theming">
    ${seg('th', 'Theme', [['own', `${esc(d.name)}`], ['mor', 'Mor, Saral’s default'], ['kosh', 'Kosh']])}
    <div class="theming-grid">
      <div class="stage">${markup}</div>
      <div class="theming-code">
        <div class="tf tf-own"><p class="code-label">${esc(d.slug)}.css</p><pre><code>${esc(snippet(d.light, d.dark, own))}</code></pre></div>
        <div class="tf tf-mor"><p class="code-label">mor.css</p><pre><code>${esc(fromDist(MOR_VALUES, DIST_KEYS))}</code></pre></div>
        <div class="tf tf-kosh"><p class="code-label">kosh.css</p><pre><code>${esc(fromDist(KOSH_VALUES, DIST_KEYS))}</code></pre></div>
        <details><summary>Show the form’s markup, the same in every theme</summary><pre><code>${esc(markup)}</code></pre></details>
      </div>
    </div>
  </div>
</div>
</section>`;
}

function scripts(d) {
  return `<section id="scripts" class="sec scripts" aria-labelledby="scripts-h">
<div class="wrap">
  ${head('scripts', d.eyebrows?.[1] ?? 'Scripts', d.titles?.scripts ?? 'Every script, the same parts', 'The same form in six languages, right to left included. Each script’s font loads only when you show it.')}
  ${seg('sc', 'Show the form in', LANGS.map((l) => [l.code, l.name]))}
  <div class="script-stage">
    ${LANGS.map((l) => `<div class="script-pane" data-lang="${l.code}">${form(l, 'sc')}</div>`).join('\n    ')}
  </div>
  <p class="note">The Hindi, Tamil, Arabic, Thai and Japanese text are drafts until a native reader checks them.</p>
</div>
</section>`;
}

// The scripts-off form, a page of its own in nojs/, framed by a sandbox that
// allows no script. A real file (not srcdoc) so the frame can load lazily.
function noJsDoc(d) {
  return `<!doctype html>
<html lang="en" class="d-${d.slug}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Saral, ${esc(d.name)}: the form with scripts disabled</title>
${fontLinks({ google: d.google })}
<link rel="stylesheet" href="../landing.css">
<style>${rootCss(d)} ${d.parts ?? ''} body { background: var(--saral-surface-raised); padding: var(--saral-space-5); }</style>
</head>
<body>
<main>
${form(EN, 'nj', { demo: false, action: '../sent.html' })}
</main>
</body>
</html>
`;
}

function noJs(d) {
  return `<section id="nojs" class="sec" aria-labelledby="nojs-h">
<div class="wrap">
  ${head('nojs', d.eyebrows?.[2] ?? 'From the lab', d.titles?.nojs ?? 'Works without JavaScript', '')}
  <div class="nojs-grid">
    <div>
      <p class="lead">Open the frame: it cannot run any script, because its sandbox does not allow one. The form in it is the same Saral form. Try to send it empty, then fill it in.</p>
      <ol class="steps">
        <li>The browser stops the post and moves focus to the first field to fix.</li>
        <li>Each field you left wrong shows its error by CSS alone, with <code>:user-invalid</code>.</li>
        <li>Fill it in and it posts as a normal form, to a page that confirms it.</li>
      </ol>
      <details><summary>What the optional core script adds</summary>
        <ul>
          <li>Errors in the page’s own words, checked when you leave a field, never while you type.</li>
          <li>Focus moves to the first error when you send.</li>
          <li>The send button shows it is busy, so the form is not sent twice.</li>
          <li>${FACTS.core} of plain JavaScript (${FACTS.coreGzip} gzipped), with no dependencies.</li>
        </ul>
      </details>
    </div>
    <details class="nojs-pane">
      <summary>Open the form with scripts turned off</summary>
      <iframe class="nojs-frame" title="The form with scripts disabled" sandbox="allow-forms allow-same-origin" loading="lazy" src="nojs/${d.slug}.html"></iframe>
    </details>
  </div>
</div>
</section>`;
}

export function componentsTable(prefix = 'cp', o = {}) {
  return `<div class="table-wrap" role="region" aria-labelledby="${o.labelledby ?? 'components-h'}" tabindex="0">
<table class="comp-table">
  <thead><tr><th scope="col">Component</th><th scope="col">Element</th><th scope="col">Status</th>${o.weight ? '<th scope="col">Script</th>' : ''}<th scope="col">Works without JS</th><th scope="col">What the script adds</th><th scope="col">Live</th></tr></thead>
  <tbody>
  ${SPECS.map((s) => `<tr><th scope="row">${esc(s.name)}<br><span class="since">since ${esc(s.since)}</span></th><td><code>${esc(rootElement(s))}</code></td><td>${tag(s.status[0].toUpperCase() + s.status.slice(1))}</td>${o.weight ? `<td class="num">${jsWeight(s)}</td>` : ''}<td>Yes</td><td>${scriptAdds(s)}</td><td class="live">${sample(s.name, `${prefix}-${s.name.toLowerCase().replace(/\W+/g, '')}`)}</td></tr>`).join('\n  ')}
  </tbody>
</table>
</div>`;
}

function components(d) {
  return `<section id="components" class="sec" aria-labelledby="components-h">
<div class="wrap">
  ${head('components', d.eyebrows?.[3] ?? 'Components', d.titles?.components ?? 'Nine components, each with a spec', `Generated from the specs in <code>specs/</code>. Each one is a native element first; the core script only adds what HTML cannot do alone.`)}
  ${d.componentsBody ? d.componentsBody({ d }) : componentsTable()}
</div>
</section>`;
}

function platforms(d) {
  return `<section id="platforms" class="sec" aria-labelledby="platforms-h">
<div class="wrap">
  ${head('platforms', d.eyebrows?.[4] ?? 'Platforms', d.titles?.platforms ?? 'Use it where you build', 'One contract for every platform. A surface is published only when someone asks for it.')}
  <div class="plat-grid">
    <div class="plat"><h3>Today: the web</h3><ul>
      <li><strong>Any HTML</strong><span>Plain pages, Rails, Django, Laravel, Go, .NET, htmx: if it writes HTML, it can use Saral.</span></li>
      <li><strong>npm: <code>@saral/tokens</code>, <code>@saral/css</code>, <code>@saral/core</code></strong><span>Built and checked on every change. The first release, 0.4.0, is being prepared.</span></li>
      <li><strong>A CDN</strong><span>The same files, pinned to a version, from the first release.</span></li>
    </ul></div>
    <div class="plat"><h3>Next</h3><ul>
      <li><strong>Figma variables</strong><span>From the same token source. Target: the form patterns milestone, January 2027.</span></li>
      <li><strong>React adapter, <code>@saral/react</code></strong><span>In the repository today, published with the first release.</span></li>
      <li><strong><code>@saral/elements</code></strong><span>Light DOM custom elements, so Vue, Svelte, Angular and others can use the same parts. Planned, not built yet.</span></li>
    </ul></div>
    <div class="plat"><h3>On request</h3><ul>
      <li><strong>iOS and Android</strong><span>Native components from the same contract, built when a team asks.</span></li>
      <li><strong>Other registries and token formats</strong><span>Swift, Compose, Flutter and others, when someone asks in an issue.</span></li>
    </ul></div>
  </div>
</div>
</section>`;
}

const SHOW = [
  ['text.default', 'surface.ground', 'Body text on the page'],
  ['text.muted', 'surface.ground', 'Muted text on the page'],
  ['text.on-action', 'action.default', 'Button text on the main button'],
  ['text.on-accent', 'accent.default', 'Button text on the accent button'],
  ['accent.default', 'surface.ground', 'Links on the page'],
  ['feedback.danger.text', 'surface.raised', 'Error text in a form'],
  ['border.strong', 'surface.raised', 'Input border'],
  ['border.focus', 'surface.ground', 'Focus ring'],
];

function trust(d) {
  const rows = d.check.filter((r) => r.theme === d.name);
  const at = (text, on, mode) => rows.find((r) => r.text === text && r.on === on && r.mode === mode);
  const lowest = rows.reduce((a, b) => (b.ratio < a.ratio ? b : a));
  const passing = rows.filter((r) => r.ok).length;
  return `<section id="trust" class="sec" aria-labelledby="trust-h">
<div class="wrap">
  ${head('trust', d.eyebrows?.[5] ?? 'Trust', d.titles?.trust ?? 'Accessible by default, checked on every build', '')}
  <div class="trust-grid">
    <ul class="trust-list">
      <li><strong>Contrast</strong>Every text and control pair of this page’s theme is checked against WCAG 2 AA: ${passing} of ${rows.length} checks pass, in light and dark. The lowest is ${lowest.ratio.toFixed(2)}:1, for ${lowest.text} on ${lowest.on} in ${lowest.mode}, against a minimum of ${lowest.min}:1.</li>
      <li><strong>Keyboard</strong>Every part is a native element, so Tab, Space, Enter and the arrow keys do what the browser defines. Focus always shows as a ring.</li>
      <li><strong>Screen readers</strong>Labels, hints and errors are tied to their inputs. A manual pass with VoiceOver and NVDA is planned before a component leaves preview.</li>
      <li><strong>Forced colours and motion</strong>Pages keep working in Windows High Contrast, and motion stops when you ask for less.</li>
      <li>${link('Read the accessibility statement (draft)', '../../../trust/accessibility.md')}</li>
    </ul>
    <div class="table-wrap" role="region" aria-labelledby="pairs-cap" tabindex="0">
    <table class="pairs">
      <caption id="pairs-cap" class="vh">Contrast pairs for the ${esc(d.name)} theme</caption>
      <thead><tr><th scope="col">Pair</th><th scope="col">Light</th><th scope="col">Dark</th><th scope="col">Needs</th></tr></thead>
      <tbody>
      ${SHOW.map(([a, b, label]) => {
        const [l, k] = [at(a, b, 'light'), at(a, b, 'dark')];
        const cell = (r) => `<td class="num ${r.ok ? 'pass' : 'fail'}">${r.ratio.toFixed(2)}:1</td>`;
        return `<tr><th scope="row">${label}</th>${cell(l)}${cell(k)}<td class="num">${l.min}:1</td></tr>`;
      }).join('\n      ')}
      </tbody>
    </table>
    </div>
  </div>
</div>
</section>`;
}

function footer(d) {
  return `<footer class="site-foot">
<div class="wrap foot-grid">
  <div>
    <p class="brand foot-brand">${d.wordmark ?? 'Saral'}</p>
    <p>Saral v${VERSION}. Open source under the MIT licence.</p>
    <ul aria-label="Project">
      <li><a href="../../../../CHANGELOG.md">Changes</a></li>
      <li><a href="../../../roadmap.md">Roadmap</a></li>
      <li><a href="../../../trust/accessibility.md">Accessibility</a></li>
      <li><a href="${REPO}">GitHub</a></li>
      <li><a href="../../../../LICENSE">MIT licence</a></li>
    </ul>
    <p data-weight hidden></p>
  </div>
  <form class="search-form" id="search" role="search" action="${REPO}/search" method="get">
    <input type="hidden" name="type" value="code">
    <div data-scope="field" data-part="root"><label data-scope="field" data-part="label" for="q">Search the docs and code</label><input data-scope="field" data-part="input" id="q" name="q" type="search"></div>
    <button data-scope="button" data-part="root" data-variant="secondary" type="submit">Search</button>
  </form>
</div>
</footer>`;
}

function page(d, i, ctx) {
  return `<!doctype html>
<html lang="en" class="d-${d.slug}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Saral, ${esc(d.name)}</title>
<meta name="description" content="${esc(d.idea)}">
${fontLinks(d)}
<link rel="stylesheet" href="landing.css">
<style>
${rootCss(d)}
${d.parts ?? ''}
${d.css}
${(d.variants ?? []).map((v) => `${v.selector} { ${roleVars(v.light, v.dark)} ${Object.entries(v.tokens ?? {}).map(([k, val]) => `--${k}: ${val};`).join(' ')} }`).join('\n')}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<p class="research-note">Research page, 24 October 2026. Direction ${i + 1} of 15: ${esc(d.name)}. <a href="index.html">See all fifteen</a></p>
${header(d)}
<main id="main">
${hero(d, ctx)}
${d.afterHero ? d.afterHero({ ...ctx, d }) : ''}
${theming(d)}
${scripts(d)}
${noJs(d)}
${components(d)}
${platforms(d)}
${trust(d)}
</main>
${footer(d)}
<script type="module" src="landing.mjs"></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- picker and README

function loadResults() {
  const f = here('results.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
}

const axeLine = (r) => {
  if (!r?.axe) return 'not run yet';
  const runs = Object.values(r.axe);
  const v = runs.reduce((s, x) => s + (x.violations?.length ?? 0), 0);
  return v ? `${v} issue${v === 1 ? '' : 's'} in ${runs.filter((x) => x.violations?.length).length} of ${runs.length} runs` : `no issues in ${runs.length} runs`;
};
const weightLine = (r) => (r?.weight ? `${r.weight.kb} kB (${r.weight.gzipKb} kB gzipped)` : 'not measured yet');

function picker(dirs, results) {
  const css = `
.wrap { max-width: 1320px; }
.intro { padding-block: var(--saral-space-7) var(--saral-space-5); }
.grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--saral-space-6); grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); }
.pick { display: grid; gap: var(--saral-space-3); align-content: start; }
.thumb { width: 320px; max-width: 100%; height: 225px; overflow: hidden; border: var(--saral-size-stroke) solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); background: var(--saral-surface-raised); }
.thumb iframe { width: 1280px; height: 900px; border: 0; transform: scale(0.25); transform-origin: 0 0; pointer-events: none; }
.pick h2 { font-size: 22px; margin: 0; }
.pick h2 a { color: var(--saral-text-default); }
.pick p { margin: 0; }
.src { font-size: var(--saral-font-size-small); color: var(--saral-text-muted); }
.chips { display: flex; flex-wrap: wrap; gap: var(--saral-space-2); list-style: none; padding: 0; margin: 0; }
.chips li { display: inline-flex; align-items: center; gap: 6px; font: 12px/1 var(--d-mono); color: var(--saral-text-muted); }
.chips i { width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--saral-border-strong); display: inline-block; forced-color-adjust: none; }
dl.facts { display: grid; grid-template-columns: auto 1fr; gap: 2px var(--saral-space-3); margin: 0; font-size: var(--saral-font-size-small); }
dl.facts dt { color: var(--saral-text-muted); }
dl.facts dd { margin: 0; }
.cmp-links { display: flex; flex-wrap: wrap; gap: var(--saral-space-3); font-size: var(--saral-font-size-small); }
.compare { padding-block: var(--saral-space-8); }
.cmp { display: grid; gap: var(--saral-space-4); grid-template-columns: minmax(0, 1fr); }
@media (min-width: 1000px) { .cmp { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
.cmp iframe { width: 100%; height: 80vh; min-height: 480px; border: var(--saral-size-stroke) solid var(--saral-border-strong); border-radius: var(--saral-radius-box); background: var(--saral-surface-raised); }
`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Saral, fifteen directions</title>
<link rel="stylesheet" href="landing.css">
<style>${css}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<main id="main" class="wrap">
  <div class="intro">
    <h1>Fifteen directions, one Saral</h1>
    <p class="lead">Each page is a full landing page for Saral in one visual direction: the same sections and copy, the same real components, a different identity. Open any two side by side at the bottom of this page. Every page works with JavaScript off.</p>
    <p class="note">Weights are first load, fonts included, as served by <code>npm run serve</code>; gzipped size is what a normal host sends. Contrast counts every text and control pair of the page’s theme in light and dark. Axe runs WCAG 2.2 A and AA rules seven times per page: light and dark at 1280 and 375 pixels, with every script blocked, with forced colours, and on the scripts-off form. The README has the full table.</p>
  </div>
  <ul class="grid">
  ${dirs.map((d, i) => {
    const r = results[d.slug];
    const rows = d.check;
    const ok = rows.filter((x) => x.ok).length;
    return `<li class="pick">
    <div class="thumb" inert><iframe src="${d.slug}.html" title="${esc(d.name)} preview" loading="lazy" scrolling="no"></iframe></div>
    <h2><a href="${d.slug}.html">${i + 1}. ${esc(d.name)}</a></h2>
    <p class="src">From the ${esc(d.source)}</p>
    <p>${esc(d.idea)}</p>
    <ul class="chips" aria-label="Palette">${d.chips.map((c) => `<li><i style="background:${c}"></i>${c}</li>`).join('')}</ul>
    <dl class="facts"><dt>First load</dt><dd>${weightLine(r)}</dd><dt>Contrast</dt><dd>${ok} of ${rows.length} pairs pass</dd><dt>Axe</dt><dd>${axeLine(r)}</dd></dl>
    <p class="cmp-links"><a href="${d.slug}.html" target="left">Show on the left</a><a href="${d.slug}.html" target="right">Show on the right</a></p>
  </li>`;
  }).join('\n  ')}
  </ul>
  <section class="compare" aria-labelledby="cmp-h">
    <h2 id="cmp-h">Compare two</h2>
    <p class="lead">Use “Show on the left” and “Show on the right” under any direction. The links work with no script.</p>
    <div class="cmp">
      <iframe name="left" src="${dirs[0].slug}.html" title="Left comparison"></iframe>
      <iframe name="right" src="${dirs[1].slug}.html" title="Right comparison"></iframe>
    </div>
  </section>
</main>
</body>
</html>
`;
}

function weightSummary(dirs, results) {
  const w = dirs.map((d) => [d, results[d.slug]?.weight]).filter(([, x]) => x);
  if (!w.length) return 'Not measured yet.';
  const over = w.filter(([, x]) => x.kb > 150);
  const max = w.reduce((a, b) => (b[1].gzipKb > a[1].gzipKb ? b : a));
  return `${w.length - over.length} of ${w.length} pages load 150 kB or less, fonts included, before compression${over.length ? `; ${over.map(([d, x]) => `${d.name} (${x.kb} kB)`).join(', ')} go over, each because it loads two font families, or three for The Translator` : ''}. Gzipped, every page is at or under ${max[1].gzipKb} kB.`;
}

function readme(dirs, results) {
  const row = (d, i) => {
    const r = results[d.slug];
    const ch = d.changes.length ? d.changes.map((c) => c.replace(/\|/g, '/')).join('; ') : 'None';
    const nojs = r?.nojs ? (r.nojs.ok ? 'Yes' : `No: ${r.nojs.notes.join(', ')}`) : 'not run';
    const fc = r?.forced ? (r.forced.ok ? 'Yes' : 'Check') : 'not run';
    const w375 = r?.overflow ? (r.overflow.ok ? 'None' : `${r.overflow.px}px`) : 'not run';
    return `| ${i + 1} | [${d.name}](${d.slug}.html) | ${weightLine(r)} | ${axeLine(r)} | ${nojs} | ${fc} | ${w375} | ${d.fontNote} | ${ch} |`;
  };
  return `# Fifteen landing pages, one per visual direction

Research, 24 October 2026. Each page is a complete landing page for Saral in one of the fifteen visual directions collected on 24 October (five from the owner's canvas, five from ChatGPT, five from Gemini), so the owner can open them side by side and choose. Open [\`index.html\`](index.html) through \`npm run serve\`: http://127.0.0.1:4321/docs/research/website/landing/

## How they are made

- \`build-landing.mjs\` writes every page from one set of markup and copy: header, hero, live theming, every script, works without JavaScript, components (generated from \`specs/*.json\`), platforms, accessibility and trust, footer. It also writes \`landing.css\` (Saral's own \`dist/css\` plus the shared layout), the picker and this README.
- \`directions.mjs\` holds one identity layer per direction: colour roles in light and dark, corners, fonts, CSS and the signature hero. Each theme only overrides Saral's roles; \`tokens/\` and \`dist/\` are untouched.
- Every component is real Saral markup with \`data-scope\` and \`data-part\`. \`landing.mjs\` loads the optional core script from \`packages/core\` for inline errors, and remembers the colour mode. Everything else, including the mode switch, the theme switch and the script switch, is CSS (\`:has()\` on native radios) and works with JavaScript off.
- The build checks ${PAIR_COUNT} contrast pairs per theme in light and dark (Saral's 26 from \`tokens/pairs.json\`, plus input borders and errors on raised surfaces) for every page theme and every hero variant, and stops if one fails.
- \`check-landing.mjs\` serves the repo, opens every page in Chromium, runs axe (\`@axe-core/playwright\`, WCAG 2.0, 2.1 and 2.2 A and AA tags) in light and dark at 1280 and 375 pixels and with forced colours, checks sideways scroll at 375, reloads with JavaScript off and uses the theme and script switches, checks that no animation runs with reduced motion, measures first load, and takes the screenshots in \`shots/\`. It writes \`results.json\`, then rebuilds the picker and this README.

\`\`\`sh
node docs/research/website/landing/build-landing.mjs
node docs/research/website/landing/check-landing.mjs
\`\`\`

If the repo's Playwright has no browser of its own, set \`CHROMIUM_PATH\` to a Chromium it can drive. These results were taken with the Chromium build that Playwright 1.63 uses.

## Results

Weight is first load with fonts, as served locally without compression; the gzipped figure is what a normal host would send. "No JS" means the page reads fully with scripts off and the theme and script switches still work. "375 px" is any sideways scroll at that width. Axe runs seven times per page: light and dark at 1280 and 375 pixels, with every script blocked (axe cannot run where JavaScript is disabled; the switches are tested there instead), with forced colours, and on the scripts-off form's own page. In forced colours the system palette sets contrast and axe misreads it, so that pass leaves out axe's contrast rule and every screenshot was checked by eye. The colour changes list the brief's colour, the new one in the same hue, and the ratio before and after on the surface it is used on.

| # | Direction | First load | Axe | No JS | Forced colours | 375 px | Fonts | Colours changed for WCAG AA |
|---|---|---|---|---|---|---|---|---|
${dirs.map(row).join('\n')}

## Weight

${weightSummary(dirs, results)} The fixed cost is about ${kb(readFileSync(here('landing.css'), 'utf8').length)} of shared CSS (all nine components and two base themes, ${kb(gzipSync(readFileSync(here('landing.css'))).length)} gzipped), the core script (${FACTS.core}), and the page itself with nine live forms. Google fonts are cut to printable Latin with the \`text=\` parameter, so each family is one small file. Each non-Latin script's font loads only when that script is shown, and the scripts-off frame loads only when it is opened.

## Known limits

- Translations are the drafts from \`../translations.md\`; the script fonts hold only those letters, so other text in those scripts falls back to a system font.
- The script switch names languages in English, so the picker itself does not load five script fonts on first view.
- Google Fonts are acceptable for research pages only. A chosen direction would self-host its fonts like \`../fonts/\`.
- Platform copy says what exists: packages are built and checked, and nothing is published until 0.4.0.
- No page names a site, product or company that uses Saral, and none has logos, testimonials, pricing or invented numbers. Figures come from the repo (specs, \`tokens/pairs.json\`, file sizes).
`;
}

// ---------------------------------------------------------------- write

export async function build({ quiet = false } = {}) {
  const { DIRECTIONS } = await import('./directions.mjs');
  const results = loadResults();
  const errors = [];
  for (const d of DIRECTIONS) {
    // Keep each direction's own input, so building twice in one process gives the same pages.
    d.lightIn ??= d.light;
    d.darkIn ??= d.dark;
    d.light = complete(d.lightIn, 'light');
    d.dark = complete(d.darkIn, 'dark');
    d.check = checkTheme(d.name, d.light, d.dark);
    for (const v of d.variants ?? []) {
      v.lightIn ??= v.light;
      v.darkIn ??= v.dark;
      v.light = complete({ ...d.lightIn, ...v.lightIn }, 'light');
      v.dark = complete({ ...d.darkIn, ...v.darkIn }, 'dark');
      d.check.push(...checkTheme(`${d.name}: ${v.name}`, v.light, v.dark));
    }
    for (const r of d.check) if (!r.ok) errors.push(`${d.slug} (${r.theme}, ${r.mode}): ${r.text} on ${r.on} is ${r.ratio.toFixed(2)}:1, needs ${r.min}:1`);
    for (const x of d.extraPairs ?? []) {
      for (const mode of [0, 1]) {
        const r = ratio(x.fg[mode], x.bg[mode]);
        if (r < x.min) errors.push(`${d.slug}: ${x.name} (${mode ? 'dark' : 'light'}) is ${r.toFixed(2)}:1, needs ${x.min}:1`);
      }
    }
  }
  if (errors.length) {
    console.error(`contrast failures:\n  ${errors.join('\n  ')}`);
    process.exitCode = 1;
    return;
  }
  const ctx = { esc, form, emailForm, seg, button, tag, notice, link, card, field, select, checkbox, radios, kolamSvg, componentsTable, FACTS, SPECS, LANGS, EN };
  writeFileSync(here('landing.css'), `/* Generated by build-landing.mjs from dist/css. Do not edit. */\n${fontCss}\n${dist('mor.css')}\n${dist('components.css')}\n${SHARED}`);
  mkdirSync(here('nojs'), { recursive: true });
  DIRECTIONS.forEach((d, i) => {
    writeFileSync(here(`${d.slug}.html`), page(d, i, ctx));
    writeFileSync(here(`nojs/${d.slug}.html`), noJsDoc(d));
  });
  writeFileSync(here('sent.html'), `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>Sent</title><link rel="stylesheet" href="landing.css"><style>body { background: var(--saral-surface-raised); padding: var(--saral-space-5); }</style></head>
<body><main><p data-scope="notice" data-part="root" data-tone="success" role="status">Sent, with no JavaScript at all. A real service would now show its confirmation page.</p></main></body>
</html>
`);
  writeFileSync(here('index.html'), picker(DIRECTIONS, results));
  writeFileSync(here('README.md'), readme(DIRECTIONS, results));
  if (!quiet) console.log(`landing: wrote ${DIRECTIONS.length} pages, landing.css, sent.html, index.html and README.md`);
  return DIRECTIONS;
}

// No top-level await: directions.mjs imports this module, so it must finish
// evaluating before build() loads directions.mjs.
if (import.meta.url === `file://${process.argv[1]}`) build();
