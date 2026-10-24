// The fifteen identity layers for build-landing.mjs. Each direction writes
// only what makes it its own: colour roles for light and dark (the rest are
// derived and every pair is checked at build), corners and fonts as Saral
// tokens, its CSS, and its signature hero built from real components.
// Colours that failed WCAG 2 AA in the brief are fixed with fix(), which
// moves the colour's lightness in its own hue and records the change.
import { esc, fit, ratio, google, MOR_VALUES, KOSH_VALUES, asDecls, FACTS, SPECS, componentsTable } from './build-landing.mjs';

const SCRIPT = '"Saral Script"';
const stack = (...f) => [...f, SCRIPT, 'ui-sans-serif', 'system-ui', 'sans-serif'].join(', ');
const mono = (f) => `${f ? `${f}, ` : ''}ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;

function def(f) {
  const changes = [];
  const fix = (what, hex, on, min) => {
    const out = fit(hex, on, min);
    if (out !== hex) changes.push(`${what}: ${hex} to ${out} (${ratio(hex, on).toFixed(2)}:1 to ${ratio(out, on).toFixed(2)}:1 on ${on})`);
    return out;
  };
  const d = f(fix);
  d.changes = [...changes, ...(d.notes ?? [])];
  return d;
}

const mode = (light, dark) => `<span class="only-light">${light}</span><span class="only-dark">${dark}</span>`;
const varsOf = (v) => [':root {', ...Object.entries(v).map(([k, val]) => `  ${k}: ${val};`), '}'].join('\n');

// ------------------------------------------------------------------ 1 Neel
const neel = def((fix) => ({
  slug: 'neel', name: 'Neel', source: 'owner’s canvas',
  idea: 'One colour dipped many times: a calm serif, indigo ink and quiet rules.',
  chips: ['#11163A', '#3B47C4', '#7C86E8', '#C9CEF7', '#F6F7FB', '#090E1F', '#93AEF8'],
  preload: ['anek-latin.woff2'],
  fontNote: 'Eczar and Anek Latin, self-hosted',
  tokens: { 'saral-radius-box': '8px', 'saral-radius-control': '6px', 'saral-font-family-sans': stack('"Anek Latin"'), 'd-display': '"Saral Eczar", Georgia, serif' },
  light: { 'surface.ground': '#F6F7FB', 'surface.raised': '#FFFFFF', 'surface.sunken': '#E9EBF5', 'text.default': '#11163A', 'text.muted': '#464C6E', 'text.quiet': '#575D7E', 'border.hairline': '#DCDFEE', 'border.strong': '#6A7090', 'action.default': '#0F172D', 'accent.default': '#3B47C4', 'accent.subtle': '#E8EAFB', 'border.focus': '#3B47C4' },
  dark: { 'surface.ground': '#090E1F', 'surface.raised': '#11172A', 'surface.sunken': '#171E33', 'text.default': '#E8EBF2', 'text.muted': '#ABB4CB', 'text.quiet': '#98A1B8', 'border.hairline': '#222A42', 'border.strong': '#7D869C', 'action.default': '#93AEF8', 'accent.default': '#A9B4F6', 'border.focus': '#93AEF8' },
  colors: { band: ['#11163A', '#141B3A'], 'band-text': ['#F6F7FB', '#E8EBF2'], 'band-tint': ['#C9CEF7', '#93AEF8'], wash: ['#E6E9FA', '#10173A'], shadow: ['rgb(17 22 58 / 0.22)', 'rgb(0 0 0 / 0.5)'] },
  extraPairs: [{ name: 'promise text on the dark band', fg: ['#F6F7FB', '#E8EBF2'], bg: ['#11163A', '#141B3A'], min: 4.5 }, { name: 'promise numbers on the band', fg: ['#C9CEF7', '#93AEF8'], bg: ['#11163A', '#141B3A'], min: 4.5 }],
  wordmark: '<span class="dot" aria-hidden="true"></span>Saral',
  headline: 'Build it plain. <span class="ink">Make it yours.</span>',
  hero: (c) => `<div class="hero-card">
    <h2>Get a reply</h2>
    <p class="card-lead">A real Saral form. The email below is wrong on purpose: fix it and the error clears.</p>
    ${c.emailForm('nh', { variant: 'primary' })}
  </div>`,
  afterHero: (c) => `<section class="band" aria-labelledby="band-h">
  <div class="wrap">
    <h2 id="band-h">Three promises, kept on every build</h2>
    <ol class="promises">
      <li><span class="n" aria-hidden="true">01</span><b>Plain HTML first</b>Real buttons, labels, inputs and selects. The browser gives keyboard use, focus and names for free.</li>
      <li><span class="n" aria-hidden="true">02</span><b>Any script</b>Latin, Devanagari, Tamil, Arabic, Thai and Japanese, with right to left, in the same parts.</li>
      <li><span class="n" aria-hidden="true">03</span><b>Before JavaScript</b>Every part works while the page loads and when scripts never arrive.</li>
    </ol>
  </div>
</section>
<section class="sec same" aria-labelledby="same-h">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow" aria-hidden="true">One button</p><h2 id="same-h">The same button, dipped four ways</h2><p class="lead">One element, four themes and modes. Nothing in its markup changes.</p></div>
    <div class="tiles">
      <div class="tile cs-light"><p>Neel, light</p>${c.button('Continue', 'accent')}${c.button('Back', 'secondary')}</div>
      <div class="tile cs-dark"><p>Neel, dark</p>${c.button('Continue', 'accent')}${c.button('Back', 'secondary')}</div>
      <div class="tile as-mor cs-light"><p>Mor</p>${c.button('Continue', 'accent')}${c.button('Back', 'secondary')}</div>
      <div class="tile as-kosh cs-light"><p>Kosh</p>${c.button('Continue', 'accent')}${c.button('Back', 'secondary')}</div>
    </div>
  </div>
</section>`,
  css: `
.d-neel .site-head { border-bottom: 4px solid transparent; border-image: linear-gradient(90deg, #11163A 0 20%, #3B47C4 20% 40%, #7C86E8 40% 60%, #C9CEF7 60% 80%, #E9EBF5 80%) 1; }
.d-neel .brand { font-size: 30px; }
.d-neel .brand .dot { width: 12px; height: 12px; border-radius: 50%; background: var(--saral-accent-default); }
.d-neel h1 { font-size: clamp(46px, 1.6rem + 4.6vw, 88px); font-weight: 700; letter-spacing: -0.015em; }
.d-neel h1 .ink { color: var(--saral-accent-default); display: block; }
.d-neel h2 { font-weight: 700; }
.d-neel .hero { background: radial-gradient(1100px 520px at 88% -10%, var(--d-wash), transparent 70%); }
.d-neel .hero-card { background: var(--saral-surface-raised); border: 1px solid var(--saral-border-hairline); border-radius: 12px; padding: clamp(20px, 3vw, 36px); box-shadow: 0 32px 64px -32px var(--d-shadow); }
.d-neel .hero-card h2 { font-size: 26px; margin-bottom: 8px; }
.d-neel .card-lead { color: var(--saral-text-muted); font-size: 15px; }
.d-neel .band { background: var(--d-band); color: var(--d-band-text); padding-block: 64px; }
.d-neel .band h2 { color: inherit; margin-bottom: 32px; }
.d-neel .promises { list-style: none; margin: 0; padding: 0; display: grid; gap: 32px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
.d-neel .promises li { border-top: 1px solid currentColor; padding-top: 16px; }
.d-neel .promises .n { display: block; color: var(--d-band-tint); font: 700 15px var(--d-mono); margin-bottom: 8px; }
.d-neel .promises b { display: block; font: 700 23px/1.2 var(--d-display); margin-bottom: 8px; }
.d-neel .same { border-top: 0; }
.d-neel .tiles { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); }
.d-neel .tile { background: var(--saral-surface-ground); color: var(--saral-text-default); border: 1px solid var(--saral-border-hairline); border-radius: var(--saral-radius-box); padding: 24px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.d-neel .tile p { flex-basis: 100%; margin: 0; font-size: 14px; color: var(--saral-text-muted); }
.d-neel .eyebrow { color: var(--saral-accent-default); font-family: var(--d-sans); font-weight: 600; font-size: 15px; letter-spacing: 0; }
.d-neel .stage, .d-neel .script-stage, .d-neel .nojs-pane { border-radius: 12px; }
@media (forced-colors: active) { .d-neel .site-head { border-image: none; border-bottom-color: CanvasText; } .d-neel .brand .dot { background: CanvasText; } }
`,
}));

// ------------------------------------------------------------------ 2 Two brands
const twoBrands = def((fix) => {
  const A = { 'surface.ground': '#F3E7DA', 'surface.raised': '#FBF5EE', 'surface.sunken': '#EADBCB', 'text.default': '#2A1810', 'text.muted': '#5E4536', 'text.quiet': '#6A4F3F', 'border.hairline': '#DCC7B2', 'border.strong': '#806452', 'action.default': '#9A3F1C', 'accent.default': '#9A3F1C', 'border.focus': '#9A3F1C', 'action.hover': '#7F3416', 'accent.hover': '#7F3416', 'action.pressed': '#6A2B12', 'feedback.danger.text': '#B42318', 'feedback.danger.subtle': '#FDECEA', 'feedback.success.text': '#1E6B3A', 'feedback.success.subtle': '#E7F3EC', 'feedback.warning.text': '#7A4B00', 'feedback.warning.subtle': '#FDF3E1', 'feedback.info.text': '#0B4A50', 'feedback.info.subtle': '#E6F0EF' };
  const B = { 'surface.ground': '#111111', 'surface.raised': '#1C1C1C', 'surface.sunken': '#262626', 'text.default': '#F5F5F5', 'text.muted': '#BDBDBD', 'text.quiet': '#A8A8A8', 'border.hairline': '#333333', 'border.strong': '#8C8C8C', 'action.default': '#D7FF3A', 'text.on-action': '#111111', 'accent.default': '#D7FF3A', 'text.on-accent': '#111111', 'border.focus': '#D7FF3A', 'accent.subtle': '#26300A', 'action.hover': '#E4FF73', 'accent.hover': '#E4FF73', 'action.pressed': '#EEFFA6', 'feedback.danger.text': '#FF8F80', 'feedback.danger.subtle': '#3A1714', 'feedback.success.text': '#6FCF8F', 'feedback.success.subtle': '#13291B', 'feedback.warning.text': '#F2C46B', 'feedback.warning.subtle': '#2E2410', 'feedback.info.text': '#8FD0D4', 'feedback.info.subtle': '#12302F' };
  const tA = { 'saral-radius-box': '6px', 'saral-radius-control': '2px', 'saral-font-family-sans': 'Georgia, "Times New Roman", serif' };
  const tB = { 'saral-radius-box': '20px', 'saral-radius-control': '9999px', 'saral-font-family-sans': stack('"Anek Latin"') };
  return {
    slug: 'two-brands', name: 'Two brands', source: 'owner’s canvas',
    idea: 'Same parts, two brands: one form shown twice in two unrelated themes.',
    chips: ['#FFFFFF', '#111111', '#F3E7DA', '#9A3F1C', '#D7FF3A'],
    preload: ['anek-latin.woff2'],
    fontNote: 'Anek Latin and Eczar, self-hosted; Theme A uses the system serif',
    tokens: { 'saral-radius-box': '4px', 'saral-radius-control': '4px', 'saral-font-family-sans': stack('"Anek Latin"') },
    light: { 'surface.ground': '#FFFFFF', 'surface.raised': '#FFFFFF', 'surface.sunken': '#F3F3F3', 'text.default': '#111111', 'text.muted': '#555555', 'text.quiet': '#5F5F5F', 'border.hairline': '#E3E3E3', 'border.strong': '#767676', 'action.default': '#111111', 'accent.default': '#111111', 'border.focus': '#111111', 'accent.subtle': '#F0F0F0' },
    dark: { 'surface.ground': '#111111', 'surface.raised': '#191919', 'surface.sunken': '#222222', 'text.default': '#F2F2F2', 'text.muted': '#B3B3B3', 'text.quiet': '#A3A3A3', 'border.hairline': '#2E2E2E', 'border.strong': fix('Dark input border, reported at 2.82:1', '#5A5A5A', '#191919', 3), 'action.default': '#F2F2F2', 'accent.default': '#F2F2F2', 'border.focus': '#F2F2F2', 'accent.subtle': '#262626' },
    variants: [
      { name: 'Theme A', selector: '.tb:has(#tb-brands:checked) .brand-a', light: A, dark: A, tokens: tA },
      { name: 'Theme B', selector: '.tb:has(#tb-brands:checked) .brand-b', light: B, dark: B, tokens: tB },
    ],
    wordmark: '<span class="ab" aria-hidden="true"><i></i><i></i></span>Saral',
    kicker: 'One system, any brand',
    hero: (c) => {
      const [va, vb] = c.d.variants;
      const file = (v, t) => varsOf({ ...Object.fromEntries(['surface.ground', 'text.default', 'action.default', 'text.on-action', 'border.strong'].map((r) => [`--saral-${r.replace('.', '-')}`, v.light[r]])), ...Object.fromEntries(Object.entries(t).map(([k, x]) => [`--${k}`, x])) });
      return `<div class="tb">
    <div class="tb-bar">
      <div data-scope="checkbox" data-part="root"><input data-scope="checkbox" data-part="input" type="checkbox" id="tb-brands" checked><label data-scope="checkbox" data-part="label" for="tb-brands">Show the brands (off shows the plain parts)</label></div>
    </div>
    <div class="tb-panes">
      <div class="pane brand-a cs-light"><p class="pane-name">Theme A</p>${c.form(c.EN, 'ta', { variant: 'primary' })}</div>
      <div class="pane brand-b cs-dark"><p class="pane-name">Theme B</p>${c.form(c.EN, 'tbb', { variant: 'primary' })}</div>
    </div>
    <div class="tb-more">
      <details><summary>Show the markup</summary><p>Both panes run this markup. Only the ids differ.</p><pre><code>${esc(c.form(c.EN, 'ta', { variant: 'primary' }))}</code></pre></details>
      <details><summary>Show the two theme files</summary><div class="files"><div><p class="code-label">theme-a.css</p><pre><code>${esc(file(va, tA))}</code></pre></div><div><p class="code-label">theme-b.css</p><pre><code>${esc(file(vb, tB))}</code></pre></div></div></details>
    </div>
  </div>`;
    },
    css: `
.d-two-brands .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 40px; }
.d-two-brands .hero-copy { text-align: center; display: grid; justify-items: center; }
.d-two-brands .hero-copy .lead { margin-inline: auto; }
.d-two-brands .actions, .d-two-brands .install { justify-content: center; }
.d-two-brands .kicker { font: 600 14px var(--d-mono); letter-spacing: 0.02em; margin: 0 0 16px; padding: 4px 12px; border: 1px solid var(--saral-border-strong); border-radius: 999px; }
.d-two-brands h1 { font-size: clamp(42px, 1.6rem + 4.4vw, 84px); font-weight: 700; letter-spacing: -0.02em; }
.d-two-brands .brand .ab { display: inline-flex; }
.d-two-brands .brand .ab i { width: 12px; height: 22px; display: block; background: #9A3F1C; border-radius: 2px 0 0 2px; }
.d-two-brands .brand .ab i + i { background: #D7FF3A; border-radius: 0 999px 999px 0; box-shadow: inset 0 0 0 1px #111111; }
.d-two-brands .tb { display: grid; gap: 16px; }
.d-two-brands .tb-bar { display: flex; justify-content: center; }
.d-two-brands .tb-panes { display: grid; gap: 1px; grid-template-columns: minmax(0, 1fr); background: var(--saral-border-hairline); border: 1px solid var(--saral-border-hairline); }
@media (min-width: 860px) { .d-two-brands .tb-panes { grid-template-columns: 1fr 1fr; } }
.d-two-brands .pane { background: var(--saral-surface-ground); color: var(--saral-text-default); font-family: var(--saral-font-family-sans); padding: clamp(20px, 4vw, 48px); display: grid; gap: 16px; transition: background-color var(--saral-motion-duration-base); }
.d-two-brands .pane .demo-form { max-width: none; }
.d-two-brands .pane-name { margin: 0; font: 600 13px var(--d-mono); color: var(--saral-text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.d-two-brands .tb:has(#tb-brands:checked) .brand-a .pane-name { font: 700 28px/1 "Saral Eczar", Georgia, serif; text-transform: none; letter-spacing: 0; color: var(--saral-action-default); }
.d-two-brands .tb:has(#tb-brands:checked) .brand-b .pane-name { font: 700 28px/1 "Anek Latin", sans-serif; text-transform: none; letter-spacing: -0.02em; color: var(--saral-text-default); }
.d-two-brands .tb:not(:has(#tb-brands:checked)) .pane { color-scheme: inherit; }
.d-two-brands .tb-more { display: flex; flex-wrap: wrap; gap: 8px 32px; justify-content: center; }
.d-two-brands .tb-more details { flex: 1 1 100%; max-width: 980px; }
.d-two-brands .files { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); }
.d-two-brands .sec { border-top-color: var(--saral-text-default); border-top-width: 1px; }
.d-two-brands .eyebrow { text-transform: uppercase; letter-spacing: 0.1em; }
@media (forced-colors: active) { .d-two-brands .brand .ab i { background: CanvasText; } }
`,
  };
});

// ------------------------------------------------------------------ 3 Spec sheet
const specSheet = def((fix) => {
  const btn = SPECS.find((s) => s.name === 'Button');
  const excerpt = JSON.stringify({ name: btn.name, status: btn.status, since: btn.since, anatomy: btn.anatomy, states: btn.states.map((s) => `${s.state}: ${s.how}`), props: btn.props.map(({ name, type, default: def }) => ({ name, type, default: def })) }, null, 2);
  return {
    slug: 'spec-sheet', name: 'Spec sheet', source: 'owner’s canvas',
    idea: 'Every part on the record: a datasheet where the spec is the page.',
    chips: ['#1B1B19', '#FAFAF7', '#B4460B'],
    preload: ['anek-latin.woff2'],
    fontNote: 'Anek Latin, self-hosted; system mono',
    tokens: { 'saral-radius-box': '2px', 'saral-radius-control': '0px', 'saral-font-family-sans': stack('"Anek Latin"'), 'saral-size-stroke': '1px', 'd-display': '"Anek Latin", sans-serif', 'd-sec-pad': '48px' },
    light: { 'surface.ground': '#FAFAF7', 'surface.raised': '#FFFFFF', 'surface.sunken': '#F0F0EA', 'text.default': '#1B1B19', 'text.muted': '#55554F', 'text.quiet': '#61615A', 'border.hairline': '#D9D9D0', 'border.strong': '#6E6E66', 'action.default': '#1B1B19', 'text.on-action': '#FAFAF7', 'accent.default': '#B4460B', 'border.focus': '#B4460B', 'accent.subtle': '#FBEDE3' },
    dark: { 'surface.ground': '#1B1B19', 'surface.raised': '#222220', 'surface.sunken': '#2A2A27', 'text.default': '#EDEDE6', 'text.muted': '#AEAEA5', 'text.quiet': '#9D9D94', 'border.hairline': '#34342F', 'border.strong': '#87877E', 'action.default': '#EDEDE6', 'text.on-action': '#1B1B19', 'accent.default': fix('Signal orange on ink, dark', '#B4460B', '#222220', 4.5), 'border.focus': fix('Focus ring on ink, dark', '#B4460B', '#222220', 3), 'accent.subtle': '#3A2416' },
    kicker: `Saral ${FACTS.version} · datasheet`,
    eyebrows: ['§ 01 · themes', '§ 02 · scripts', '§ 03 · no script', '§ 04 · anatomy', '§ 05 · platforms', '§ 06 · trust'],
    titles: { components: 'Anatomy: every part, its element' },
    hero: (c) => `<div class="figs">
    <ul class="numbers" aria-label="From the build">
      <li><b>${FACTS.components}</b><span>components, each with a JSON spec</span></li>
      <li><b>${FACTS.pairs}</b><span>contrast pairs checked per theme and mode</span></li>
      <li><b>${FACTS.deps}</b><span>runtime dependencies</span></li>
      <li><b>${FACTS.core}</b><span>optional core script, unminified</span></li>
    </ul>
    <div class="spec-page">
      <div><p class="code-label">specs/button.json</p><pre class="json" tabindex="0" role="region" aria-label="Button spec, as JSON"><code>${esc(excerpt)}</code></pre></div>
      <div class="spec-live"><p class="code-label">rendered from it</p>
        <dl>
          <dt>primary</dt><dd>${c.button('Send')}</dd>
          <dt>accent</dt><dd>${c.button('Send', 'accent')}</dd>
          <dt>secondary</dt><dd>${c.button('Send', 'secondary')}</dd>
          <dt>disabled</dt><dd><button data-scope="button" data-part="root" type="button" disabled>Send</button></dd>
        </dl>
        <p class="spec-note">The spec is the page: its parts, states and props are the table above and these four buttons.</p>
      </div>
    </div>
  </div>`,
    afterHero: () => `<section class="sec register" aria-labelledby="reg-h">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow" aria-hidden="true">§ 00 · register</p><h2 id="reg-h">Every component on the record</h2></div>
    ${componentsTable('rg', { weight: true, labelledby: 'reg-h' })}
  </div>
</section>`,
    componentsBody: () => `<div class="table-wrap" role="region" aria-labelledby="components-h" tabindex="0"><table class="anat">
  <thead><tr><th scope="col">Component</th><th scope="col">Parts, with <code>data-part</code> and element</th><th scope="col">Keys</th></tr></thead>
  <tbody>${SPECS.map((s) => `<tr><th scope="row">${esc(s.name)}</th><td><ul>${s.anatomy.map((a) => `<li><code>${esc(a.part)}</code> ${esc(a.element)}</li>`).join('')}</ul></td><td>${(s.keyboard ?? []).map((k) => `<kbd>${esc(k.key)}</kbd>`).join(' ')}</td></tr>`).join('')}</tbody>
</table></div>`,
    css: `
.d-spec-sheet body { font-size: 15px; }
.d-spec-sheet .site-head { border-bottom: 1px solid var(--saral-text-default); }
.d-spec-sheet .brand { font: 700 20px/1 var(--d-mono); letter-spacing: -0.02em; }
.d-spec-sheet .brand::after { content: "/ds"; color: var(--saral-accent-default); font-weight: 400; }
.d-spec-sheet .main-nav a, .d-spec-sheet .search-link { font-family: var(--d-mono); font-size: 13px; }
.d-spec-sheet .hero { padding-block: 40px 48px; background-image: linear-gradient(var(--saral-border-hairline) 1px, transparent 1px); background-size: 100% 32px; }
.d-spec-sheet .hero-grid { align-items: start; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 1040px) { .d-spec-sheet .hero-grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); } }
.d-spec-sheet .kicker { font: 500 12px var(--d-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--saral-accent-default); margin-bottom: 16px; }
.d-spec-sheet h1 { font-size: clamp(38px, 1.4rem + 3vw, 60px); font-weight: 700; letter-spacing: -0.025em; }
.d-spec-sheet h2 { font-size: clamp(24px, 1rem + 1.2vw, 32px); letter-spacing: -0.015em; }
.d-spec-sheet .install code { font-size: 16px; padding: 12px 16px; border: 1px solid var(--saral-text-default); background: var(--saral-surface-raised); }
.d-spec-sheet .install code::before { content: "$ "; color: var(--saral-accent-default); }
.d-spec-sheet .figs { display: grid; gap: 24px; }
.d-spec-sheet .numbers { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr)); border-top: 1px solid var(--saral-text-default); border-left: 1px solid var(--saral-border-hairline); }
.d-spec-sheet .numbers li { padding: 12px 14px; border-right: 1px solid var(--saral-border-hairline); border-bottom: 1px solid var(--saral-border-hairline); background: var(--saral-surface-raised); }
.d-spec-sheet .numbers b { display: block; font: 700 clamp(30px, 1rem + 2vw, 44px)/1 var(--d-display); letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.d-spec-sheet .numbers span { font: 12px/1.35 var(--d-mono); color: var(--saral-text-muted); }
.d-spec-sheet .spec-page { display: grid; gap: 1px; grid-template-columns: minmax(0, 1fr); background: var(--saral-border-hairline); border: 1px solid var(--saral-border-hairline); }
@media (min-width: 700px) { .d-spec-sheet .spec-page { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); } }
.d-spec-sheet .spec-page > div { background: var(--saral-surface-raised); padding: 14px; }
.d-spec-sheet pre.json { max-height: 340px; overflow: auto; font-size: 12px; background: var(--saral-surface-sunken); }
.d-spec-sheet .spec-live dl { display: grid; grid-template-columns: auto 1fr; gap: 10px 14px; align-items: center; margin: 0 0 12px; }
.d-spec-sheet .spec-live dt { font: 12px var(--d-mono); color: var(--saral-text-muted); }
.d-spec-sheet .spec-live dd { margin: 0; }
.d-spec-sheet .spec-note { font-size: 13px; color: var(--saral-text-muted); margin: 0; }
.d-spec-sheet .code-label { text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; }
.d-spec-sheet .sec { border-top: 1px solid var(--saral-text-default); }
.d-spec-sheet .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 12px; color: var(--saral-accent-default); }
.d-spec-sheet table { font-size: 13px; border: 1px solid var(--saral-border-hairline); }
.d-spec-sheet thead th { font: 500 11px var(--d-mono); text-transform: uppercase; letter-spacing: 0.06em; background: var(--saral-surface-sunken); color: var(--saral-text-default); }
.d-spec-sheet th, .d-spec-sheet td { padding: 8px 10px; border: 1px solid var(--saral-border-hairline); }
.d-spec-sheet .since { font: 11px var(--d-mono); color: var(--saral-text-muted); font-weight: 400; }
.d-spec-sheet [data-scope="tag"][data-part="root"] { font-family: var(--d-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; border-color: var(--saral-accent-default); color: var(--saral-accent-default); background: transparent; }
.d-spec-sheet .anat ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px 16px; }
.d-spec-sheet kbd { font-size: 12px; padding: 1px 6px; border: 1px solid var(--saral-border-strong); }
.d-spec-sheet .stage, .d-spec-sheet .script-stage { border-color: var(--saral-text-default); }
`,
  };
});

// ------------------------------------------------------------------ 4 Plain sheet
const plainSheet = def((fix) => ({
  slug: 'plain-sheet', name: 'Plain sheet', source: 'owner’s canvas',
  idea: 'Nothing to get in the way: one column, large plain type, a thick focus ring.',
  chips: ['#0B0C0C', '#FFFFFF', '#1D4ED8', '#00703C', '#FFDD00'],
  google: [google(['Atkinson+Hyperlegible+Next:wght@400..700'])],
  fontNote: 'Atkinson Hyperlegible Next from Google Fonts, cut to Latin',
  tokens: { 'saral-radius-box': '0px', 'saral-radius-control': '0px', 'saral-font-family-sans': stack('"Atkinson Hyperlegible Next"'), 'saral-size-stroke': '2px', 'saral-focus-width': '4px', 'saral-focus-offset': '2px', 'saral-font-size-body': '19px', 'saral-font-size-small': '16px', 'saral-font-size-lead': '22px', 'd-max': '880px' },
  light: { 'surface.ground': '#FFFFFF', 'surface.raised': '#FFFFFF', 'surface.sunken': '#F2F2F0', 'text.default': '#0B0C0C', 'text.muted': '#454747', 'text.quiet': '#4E5050', 'border.hairline': '#C8C9C9', 'border.strong': '#0B0C0C', 'action.default': '#00703C', 'accent.default': '#1D4ED8', 'border.focus': '#0B0C0C', 'accent.subtle': '#EEF2FC' },
  dark: { 'surface.ground': '#0B0C0C', 'surface.raised': '#121313', 'surface.sunken': '#1A1B1B', 'text.default': '#F3F3F1', 'text.muted': '#C4C6C6', 'text.quiet': '#B0B2B2', 'border.hairline': '#3A3C3C', 'border.strong': '#F3F3F1', 'action.default': fix('Green button in dark, with black text', '#00703C', '#0B0C0C', 4.5), 'text.on-action': '#0B0C0C', 'accent.default': fix('Link blue on black, dark', '#1D4ED8', '#121313', 4.5), 'border.focus': '#FFDD00', 'accent.subtle': '#14213D' },
  notes: ['Yellow focus #FFDD00 is 1.4:1 on white, so in light the ring is black with a yellow halo outside it; in dark the ring itself is yellow (14.8:1)'],
  colors: { halo: ['#FFDD00', '#0B0C0C'] },
  wordmark: 'Saral',
  hero: (c) => `<div class="sheet-q">
    <ul class="big-links">
      <li><a href="#start">Install it</a><span>Two packages, no build step.</span></li>
      <li><a href="#components">See the nine components</a><span>Each with a spec, each a native element.</span></li>
      <li><a href="../../../trust/accessibility.md">Read the accessibility statement</a><span>What Saral does, how it is tested, and its known gaps.</span></li>
    </ul>
    <form class="demo-form q" action="sent.html" method="get" data-demo>
      <div data-scope="field" data-part="root">
        <label data-scope="field" data-part="label" for="pq-name"><span class="q-label">What is your full name?</span></label>
        <p data-scope="field" data-part="hint" id="pq-hint">As it appears on your ID</p>
        <p data-scope="field" data-part="error" id="pq-error" data-message-value-missing="Enter your full name">Enter your full name</p>
        <input data-scope="field" data-part="input" id="pq-name" name="name" autocomplete="name" required aria-describedby="pq-hint">
      </div>
      <div class="form-actions">${c.button('Continue', '', 'submit')}</div>
      <p data-scope="notice" data-part="root" data-tone="success" role="status" class="sent" hidden>Sent. Check your inbox.</p>
    </form>
  </div>`,
  parts: `
.d-plain-sheet [data-part="label"] { font-weight: 700; }
.d-plain-sheet :is([data-scope="field"], [data-scope="select"])[data-part="input"] { border-width: 2px; }
.d-plain-sheet :is([data-scope="button"], [data-scope="field"], [data-scope="select"], [data-scope="checkbox"], [data-scope="radio"], [data-scope="link"]):focus-visible { outline: 4px solid var(--saral-border-focus); outline-offset: 0; box-shadow: 0 0 0 8px var(--d-halo); }
.d-plain-sheet [data-scope="button"][data-part="root"] { font-weight: 700; min-height: 48px; }
`,
  css: `
.d-plain-sheet *, .d-plain-sheet *::before, .d-plain-sheet *::after { transition: none !important; animation: none !important; }
.d-plain-sheet body { border-top: 12px solid var(--saral-text-default); }
.d-plain-sheet :focus-visible { outline: 4px solid var(--saral-border-focus); outline-offset: 0; box-shadow: 0 0 0 8px var(--d-halo); }
.d-plain-sheet a:focus-visible { background: var(--d-halo); color: var(--saral-text-default); outline-color: var(--saral-text-default); box-shadow: none; text-decoration: underline 4px; }
.d-plain-sheet .research-note { text-align: start; }
.d-plain-sheet .site-head { border-bottom: 2px solid var(--saral-text-default); }
.d-plain-sheet .brand { font-family: var(--d-sans); font-size: 30px; letter-spacing: -0.01em; }
.d-plain-sheet .brand::before { content: ""; width: 16px; height: 30px; background: var(--saral-text-default); }
.d-plain-sheet .main-nav ul { font-size: 17px; gap: 4px 20px; }
.d-plain-sheet .main-nav a { color: var(--saral-text-default); text-decoration: underline; text-decoration-thickness: 1px; }
.d-plain-sheet h1 { font-family: var(--d-sans); font-size: clamp(42px, 1.6rem + 3.6vw, 72px); font-weight: 700; letter-spacing: -0.02em; }
.d-plain-sheet h2 { font-family: var(--d-sans); font-weight: 700; font-size: clamp(30px, 1.2rem + 1.6vw, 44px); }
.d-plain-sheet .lead { color: var(--saral-text-default); }
.d-plain-sheet .hero-grid, .d-plain-sheet .theming-grid, .d-plain-sheet .nojs-grid, .d-plain-sheet .trust-grid { grid-template-columns: minmax(0, 1fr) !important; }
.d-plain-sheet .actions { display: none; }
.d-plain-sheet .install code { font-size: 18px; background: var(--saral-surface-sunken); border-left: 6px solid var(--saral-text-default); border-radius: 0; }
.d-plain-sheet .big-links { list-style: none; padding: 0; margin: 0 0 48px; display: grid; gap: 20px; }
.d-plain-sheet .big-links a { font-size: 24px; font-weight: 700; }
.d-plain-sheet .big-links span { display: block; color: var(--saral-text-muted); }
.d-plain-sheet .q { padding: 28px; border: 2px solid var(--saral-text-default); max-width: none; }
.d-plain-sheet .q-label { display: block; font-size: clamp(26px, 1rem + 1.4vw, 34px); line-height: 1.2; }
.d-plain-sheet main { counter-reset: sheet; }
.d-plain-sheet .sec { counter-increment: sheet; border-top: 2px solid var(--saral-text-default); }
.d-plain-sheet .sec-head { position: relative; }
.d-plain-sheet .sec-head .eyebrow { font-family: var(--d-sans); font-size: 16px; font-weight: 700; color: var(--saral-text-default); letter-spacing: 0; }
.d-plain-sheet .sec-head .eyebrow::before { content: counter(sheet) ". "; }
@media (min-width: 1100px) { .d-plain-sheet .sec-head::before { content: counter(sheet); position: absolute; inset-inline-end: calc(100% + 32px); top: -6px; font: 700 64px/1 var(--d-sans); color: var(--saral-text-default); } }
.d-plain-sheet .seg [data-part="item"] { border-radius: 0; border-width: 2px; min-height: 44px; }
.d-plain-sheet .seg [data-part="item"]:has(:checked) { border-color: var(--saral-text-default); background: var(--saral-surface-sunken); box-shadow: inset 0 -4px 0 var(--saral-text-default); }
.d-plain-sheet .stage, .d-plain-sheet .script-stage, .d-plain-sheet .nojs-pane { border: 2px solid var(--saral-text-default); }
.d-plain-sheet table { font-size: 17px; }
.d-plain-sheet th, .d-plain-sheet td { border-bottom: 1px solid var(--saral-text-default); }
.d-plain-sheet .site-foot { border-top: 2px solid var(--saral-text-default); font-size: 17px; }
@media (forced-colors: active) { .d-plain-sheet :focus-visible { box-shadow: none; outline-color: Highlight; } }
`,
}));

// ------------------------------------------------------------------ 5 Kolam
const kolam = def((fix) => ({
  slug: 'kolam', name: 'Kolam', source: 'owner’s canvas',
  idea: 'A grid of dots and one line around them: ink on rice white, round shapes.',
  chips: ['#1E1B16', '#F6F1E7', '#B83A12'],
  preload: ['anek-latin.woff2'],
  fontNote: 'Eczar and Anek Latin, self-hosted',
  tokens: { 'saral-radius-box': '24px', 'saral-radius-control': '9999px', 'saral-font-family-sans': stack('"Anek Latin"'), 'd-display': '"Saral Eczar", Georgia, serif' },
  light: { 'surface.ground': '#F6F1E7', 'surface.raised': '#FFFCF5', 'surface.sunken': '#EDE5D5', 'text.default': '#1E1B16', 'text.muted': '#524A3E', 'text.quiet': fix('Quiet text, reported at 3.53:1', '#8A7E6B', '#F6F1E7', 4.5), 'border.hairline': '#E0D6C3', 'border.strong': '#7A6F5E', 'action.default': '#1E1B16', 'text.on-action': '#F6F1E7', 'accent.default': '#B83A12', 'border.focus': '#B83A12', 'accent.subtle': '#F8E4D9' },
  dark: { 'surface.ground': '#1E1B16', 'surface.raised': '#27231D', 'surface.sunken': '#2F2A23', 'text.default': '#F3EDE0', 'text.muted': '#C4BAA8', 'text.quiet': '#B0A693', 'border.hairline': '#3A342B', 'border.strong': '#8F8572', 'action.default': '#F3EDE0', 'text.on-action': '#1E1B16', 'accent.default': fix('Vermilion on ink, dark', '#B83A12', '#27231D', 4.5), 'border.focus': fix('Focus ring on ink, dark', '#B83A12', '#27231D', 3), 'accent.subtle': '#3A2219' },
  colors: { line: ['#1E1B16', '#F3EDE0'], dot: ['#B83A12', '#F08A64'], grid: ['rgb(30 27 22 / 0.13)', 'rgb(243 237 224 / 0.12)'] },
  hero: (c) => `<div class="k-hero">
    ${c.kolamSvg(7, 5, { s: 26, label: 'One continuous line drawn around a grid of seven by five dots' })}
    <div class="k-row">${c.tag('Native first')}${c.tag('Any script')}${c.button('Continue', 'accent')}</div>
  </div>`,
  afterHero: (c) => `<div class="k-strip wrap" aria-hidden="true">${c.kolamSvg(13, 1, { s: 9, r: 1.8, decorative: true, cls: 'strip' })}</div>`,
  css: `
.d-kolam h1 { font-size: clamp(44px, 1.6rem + 4.2vw, 82px); font-weight: 700; letter-spacing: -0.01em; }
.d-kolam h2 { font-weight: 700; }
.d-kolam .brand { font-size: 30px; }
.d-kolam .brand::before { content: ""; width: 20px; height: 20px; border-radius: 50%; border: 2.5px solid var(--saral-text-default); box-shadow: inset 0 0 0 4px var(--saral-surface-ground), inset 0 0 0 10px var(--d-dot); }
.d-kolam .hero { background-image: radial-gradient(circle, var(--d-grid) 1.4px, transparent 1.8px); background-size: 26px 26px; background-position: center top; }
.d-kolam .k-hero { display: grid; gap: 20px; justify-items: center; background: var(--saral-surface-raised); border-radius: 24px; padding: clamp(16px, 3vw, 32px); border: 1px solid var(--saral-border-hairline); }
.d-kolam .kolam { width: 100%; height: auto; }
.d-kolam .kolam-dots circle { fill: var(--d-dot); }
.d-kolam .kolam-line { fill: none; stroke: var(--d-line); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: k-draw 6s 0.2s cubic-bezier(0.45, 0, 0.25, 1) forwards; }
.d-kolam .strip .kolam-line { stroke-width: 1.4; animation-duration: 3s; }
@keyframes k-draw { to { stroke-dashoffset: 0; } }
.d-kolam .k-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center; }
.d-kolam .k-strip { padding-block: 8px; }
.d-kolam .k-strip svg { display: block; width: min(100%, 520px); margin-inline: auto; }
.d-kolam .sec { border-top: 0; background-image: radial-gradient(circle, var(--d-dot) 1.6px, transparent 2px); background-size: 18px 18px; background-repeat: repeat-x; background-position: center top; }
.d-kolam .eyebrow { font-family: var(--d-sans); font-weight: 600; letter-spacing: 0.04em; color: var(--saral-accent-default); }
.d-kolam .seg [data-part="item"] { border-radius: 999px; }
.d-kolam .stage, .d-kolam .script-stage, .d-kolam .nojs-pane { border-radius: 24px; }
@media (prefers-reduced-motion: reduce) { .d-kolam .kolam-line { stroke-dashoffset: 0; animation: none !important; } }
@media (forced-colors: active) { .d-kolam .kolam-line { stroke: CanvasText; } .d-kolam .kolam-dots circle { fill: CanvasText; } .d-kolam .hero, .d-kolam .sec { background-image: none; } }
`,
}));

// ------------------------------------------------------------------ 6 Living Material
const livingMaterial = def((fix) => {
  const clay = fix('Burnt clay text on ivory', '#B85C38', '#F8F5EF', 4.5);
  return {
    slug: 'living-material', name: 'Living Material', source: 'ChatGPT answers',
    idea: 'A technical base that feels tangible and calm: paper surfaces, forest and clay.',
    chips: ['#F8F5EF', '#E6D9C6', '#155E45', '#B85C38', '#1F2937'],
    google: [google(['Source+Sans+3:wght@400..700'])],
    fontNote: 'Source Sans 3 from Google Fonts, cut to Latin; Noto and Anek for other scripts',
    tokens: { 'saral-radius-box': '14px', 'saral-radius-control': '10px', 'saral-font-family-sans': stack('"Source Sans 3"'), 'saral-motion-duration-base': '700ms' },
    light: { 'surface.ground': '#F8F5EF', 'surface.raised': '#FFFDF9', 'surface.sunken': '#EFE8DC', 'text.default': '#1F2937', 'text.muted': '#4B5563', 'text.quiet': '#565F6C', 'border.hairline': '#E6D9C6', 'border.strong': '#7A7468', 'action.default': '#155E45', 'accent.default': clay, 'border.focus': '#155E45', 'accent.subtle': '#F4E6DD' },
    dark: { 'surface.ground': '#131A17', 'surface.raised': '#1A231F', 'surface.sunken': '#212C27', 'text.default': '#EEE9DF', 'text.muted': '#B9B3A7', 'text.quiet': '#A59F93', 'border.hairline': '#2C3832', 'border.strong': '#87918B', 'action.default': '#7CC4A4', 'accent.default': '#E8A07F', 'border.focus': '#7CC4A4', 'accent.subtle': '#2E211B' },
    variants: [
      { name: 'Clay', selector: '.lm:has(#lm-clay:checked) .lm-front', light: { 'action.default': '#9A4A2B', 'border.focus': '#9A4A2B' }, dark: { 'action.default': '#E8A07F', 'border.focus': '#E8A07F' } },
      { name: 'Stone', selector: '.lm:has(#lm-stone:checked) .lm-front', light: { 'action.default': '#1F2937', 'surface.ground': '#EFE8DC', 'surface.raised': '#F8F5EF', 'accent.default': fit(clay, '#EFE8DC', 4.5) }, dark: { 'action.default': '#D9D3C7', 'surface.ground': '#212C27', 'surface.raised': '#26322C' } },
    ],
    colors: { limestone: ['#E6D9C6', '#2A332E'], forest: ['#155E45', '#1F4A3A'], shadow: ['rgb(60 45 25 / 0.14)', 'rgb(0 0 0 / 0.45)'] },
    hero: (c) => `<div class="lm">
    ${c.seg('lm', 'Material', [['forest', 'Forest'], ['clay', 'Clay'], ['stone', 'Stone']])}
    <div class="lm-stack">
      <div class="lm-sheet lm-back" aria-hidden="true"></div>
      <div class="lm-sheet lm-mid" aria-hidden="true"></div>
      <div class="lm-sheet lm-front">
        <p class="lm-title">Register for the clinic</p>
        ${c.emailForm('lmf', { variant: 'primary', label: 'Email', hint: 'For the reminder only', value: '', radioLabel: 'Remind me by', go: 'Register' }).replace(' data-show-error', '')}
      </div>
    </div>
  </div>`,
    css: `
.d-living-material h1 { font-size: clamp(44px, 1.6rem + 4vw, 80px); font-weight: 600; letter-spacing: -0.025em; }
.d-living-material h2 { font-weight: 600; letter-spacing: -0.015em; }
.d-living-material .brand { font-weight: 700; letter-spacing: -0.02em; }
.d-living-material .brand::before { content: ""; width: 18px; height: 18px; border-radius: 6px 12px 6px 12px; background: var(--saral-action-default); }
.d-living-material body { background: var(--saral-surface-ground); }
.d-living-material .hero { background: linear-gradient(180deg, var(--saral-surface-ground), var(--saral-surface-sunken)); }
.d-living-material .lm { display: grid; gap: 20px; }
.d-living-material .lm-stack { position: relative; display: grid; padding: 24px 24px 24px 0; }
.d-living-material .lm-sheet { grid-area: 1 / 1; border-radius: 22px; }
.d-living-material .lm-back { background: var(--d-limestone); transform: rotate(-3deg) translate(18px, 10px); animation: lm-in 1.4s ease-out both; }
.d-living-material .lm-mid { background: var(--d-forest); opacity: 0.16; transform: rotate(2deg) translate(30px, -8px); animation: lm-in 1.4s 0.2s ease-out both; }
.d-living-material .lm-front { position: relative; background: var(--saral-surface-raised); color: var(--saral-text-default); padding: clamp(20px, 3vw, 36px); box-shadow: 0 1px 0 var(--saral-border-hairline), 0 28px 50px -24px var(--d-shadow); transition: background-color 700ms ease, color 700ms ease; }
.d-living-material .lm-front [data-scope="button"] { transition: background-color 700ms ease; }
.d-living-material .lm-title { font-size: 22px; font-weight: 600; }
@keyframes lm-in { from { opacity: 0; } }
.d-living-material .sec { border-top: 0; }
.d-living-material .sec:nth-of-type(even) { background: var(--saral-surface-raised); }
.d-living-material .stage, .d-living-material .script-stage { box-shadow: 0 20px 40px -28px var(--d-shadow); border-color: var(--d-limestone); }
.d-living-material .eyebrow { font-family: var(--d-sans); font-weight: 600; color: var(--saral-accent-default); letter-spacing: 0.02em; }
.d-living-material .seg [data-part="item"] { border-radius: 999px; }
@media (forced-colors: active) { .d-living-material .lm-back, .d-living-material .lm-mid { display: none; } }
`,
  };
});

// ------------------------------------------------------------------ 7 Modular Architecture
const modular = def((fix) => {
  const grey = '#DDE3EA';
  return {
    slug: 'modular-architecture', name: 'Modular Architecture', source: 'ChatGPT answers',
    idea: 'Precise building blocks on a strict 8 pixel grid; parts snap into place.',
    chips: ['#F8FAFC', '#111827', '#2563EB', '#10B981', '#DDE3EA'],
    google: [google(['Space+Grotesk:wght@500..700', 'Inter:wght@400..700'])],
    fontNote: 'Space Grotesk and Inter from Google Fonts, cut to Latin',
    tokens: { 'saral-radius-box': '0px', 'saral-radius-control': '0px', 'saral-font-family-sans': stack('"Inter"'), 'd-display': '"Space Grotesk", "Inter", sans-serif' },
    light: { 'surface.ground': '#F8FAFC', 'surface.raised': '#FFFFFF', 'surface.sunken': '#EEF2F6', 'text.default': '#111827', 'text.muted': '#4B5563', 'text.quiet': '#55606F', 'border.hairline': grey, 'border.strong': fix('Cool grey edge as an input border', grey, '#F8FAFC', 3), 'action.default': '#2563EB', 'accent.default': '#2563EB', 'border.focus': '#2563EB', 'accent.subtle': '#E8EFFD', 'feedback.success.text': fix('Emerald status text, on its pale tint', '#10B981', '#E3F7EF', 4.5), 'feedback.success.subtle': '#E3F7EF' },
    dark: { 'surface.ground': '#0B1220', 'surface.raised': '#111A2E', 'surface.sunken': '#172238', 'text.default': '#E5EAF2', 'text.muted': '#A3AEC2', 'text.quiet': '#919DB3', 'border.hairline': '#22304A', 'border.strong': '#6F7E97', 'action.default': '#7BA2FF', 'accent.default': '#7BA2FF', 'border.focus': '#7BA2FF', 'accent.subtle': '#16244A', 'feedback.success.text': '#34D399', 'feedback.success.subtle': '#0D2A22' },
    notes: ['Emerald is status only (success), so cobalt stays the one accent hue'],
    colors: { grid: ['rgb(37 99 235 / 0.07)', 'rgb(123 162 255 / 0.08)'], major: ['rgb(37 99 235 / 0.14)', 'rgb(123 162 255 / 0.14)'] },
    hero: (c) => {
      const L = c.d.light, D = c.d.dark;
      const sw = (role, label) => `<li><i style="background: var(--saral-${role.replaceAll('.', '-')})"></i><code>${label}</code><span>${mode(L[role], D[role])}</span></li>`;
      return `<div class="mods">
    <div class="mod m-nav"><p class="tagline">01 · nav</p><nav aria-label="Sample"><ul><li><a href="#components">Parts</a></li><li><a href="#themes">Themes</a></li><li><a href="#trust">Trust</a></li></ul></nav></div>
    <div class="mod m-btn"><p class="tagline">02 · button</p><div class="row">${c.button('Save')}${c.button('Cancel', 'secondary')}</div></div>
    <div class="mod m-field"><p class="tagline">03 · field</p>${c.field('mf-town', 'Town', { hint: 'Where you live now' })}</div>
    <div class="mod m-card"><p class="tagline">04 · card</p>${c.card('Permit renewal', 'Ready in five working days.', 3)}${c.notice('Approved', 'success')}</div>
    <ul class="strip" aria-label="Tokens in use">${sw('surface.ground', 'surface.ground')}${sw('text.default', 'text.default')}${sw('action.default', 'action.default')}${sw('border.strong', 'border.strong')}${sw('feedback.success.text', 'success.text')}</ul>
    <ul class="spaces" aria-label="Space scale">${[1, 2, 3, 4, 5, 6].map((n) => `<li><i style="inline-size: var(--saral-space-${n})"></i><code>space.${n}</code></li>`).join('')}</ul>
  </div>`;
    },
    css: `
.d-modular-architecture h1 { font-size: clamp(42px, 1.5rem + 4vw, 80px); font-weight: 700; letter-spacing: -0.035em; line-height: 1; }
.d-modular-architecture h2 { font-weight: 700; letter-spacing: -0.02em; }
.d-modular-architecture .brand { font-size: 24px; letter-spacing: -0.03em; }
.d-modular-architecture .brand::before { content: ""; width: 16px; height: 16px; background: var(--saral-action-default); box-shadow: 8px 8px 0 0 var(--saral-text-default); margin-inline-end: 8px; }
.d-modular-architecture .site-head { border-bottom: 1px solid var(--saral-border-hairline); }
.d-modular-architecture .hero { background-image: linear-gradient(var(--d-major) 1px, transparent 1px), linear-gradient(90deg, var(--d-major) 1px, transparent 1px), linear-gradient(var(--d-grid) 1px, transparent 1px), linear-gradient(90deg, var(--d-grid) 1px, transparent 1px); background-size: 64px 64px, 64px 64px, 8px 8px, 8px 8px; }
.d-modular-architecture .mods { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.d-modular-architecture .mod { background: var(--saral-surface-raised); border: 1px solid var(--saral-border-strong); padding: 16px; display: grid; gap: 12px; align-content: start; animation: snap 480ms steps(4, end) both; }
.d-modular-architecture .m-nav { animation-delay: 0ms; } .d-modular-architecture .m-btn { animation-delay: 120ms; } .d-modular-architecture .m-field { animation-delay: 240ms; } .d-modular-architecture .m-card { animation-delay: 360ms; }
@keyframes snap { from { transform: translate(16px, 16px); } }
.d-modular-architecture .tagline { margin: 0; font: 600 11px var(--d-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--saral-text-muted); }
.d-modular-architecture .mod nav ul { display: flex; gap: 16px; list-style: none; margin: 0; padding: 0; }
.d-modular-architecture .mod .row { display: flex; flex-wrap: wrap; gap: 8px; }
.d-modular-architecture .m-card { grid-column: span 1; }
.d-modular-architecture .strip, .d-modular-architecture .spaces { grid-column: 1 / -1; list-style: none; margin: 0; padding: 8px; display: flex; flex-wrap: wrap; gap: 8px 16px; background: var(--saral-surface-raised); border: 1px solid var(--saral-border-hairline); }
.d-modular-architecture .strip li { display: grid; grid-template-columns: 24px auto; gap: 0 8px; font-size: 12px; align-items: center; }
.d-modular-architecture .strip i { grid-row: span 2; width: 24px; height: 24px; border: 1px solid var(--saral-border-strong); }
.d-modular-architecture .strip span { font: 11px var(--d-mono); color: var(--saral-text-muted); }
.d-modular-architecture .spaces li { display: flex; gap: 6px; align-items: center; font-size: 11px; }
.d-modular-architecture .spaces i { display: block; height: 16px; background: var(--saral-action-default); }
.d-modular-architecture .sec { border-top: 1px solid var(--saral-border-strong); }
.d-modular-architecture .eyebrow { text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; font-weight: 600; }
.d-modular-architecture .eyebrow::before { content: "■ "; color: var(--saral-action-default); }
.d-modular-architecture .seg [data-part="item"] { border-radius: 0; }
.d-modular-architecture .stage, .d-modular-architecture .script-stage { border-color: var(--saral-border-strong); }
.d-modular-architecture .plat { border: 1px solid var(--saral-border-strong); padding: 16px; background: var(--saral-surface-raised); }
@media (max-width: 520px) { .d-modular-architecture .mods { grid-template-columns: minmax(0, 1fr); } }
@media (forced-colors: active) { .d-modular-architecture .hero { background-image: none; } .d-modular-architecture .strip i, .d-modular-architecture .spaces i { forced-color-adjust: none; } }
`,
  };
});

// ------------------------------------------------------------------ 8 Adaptive Prism
const prism = def((fix) => {
  const aqua = fix('Aqua with white text and on porcelain', '#06B6D4', '#F8FAFC', 4.5);
  return {
    slug: 'adaptive-prism', name: 'Adaptive Prism', source: 'ChatGPT answers',
    idea: 'The look changes, the structure stays: translucent layers over broad colour.',
    chips: ['#F8FAFC', '#2563EB', '#7C3AED', '#06B6D4', '#111827'],
    google: [google(['Plus+Jakarta+Sans:wght@400..800'])],
    fontNote: 'Plus Jakarta Sans from Google Fonts, cut to Latin',
    tokens: { 'saral-radius-box': '20px', 'saral-radius-control': '12px', 'saral-font-family-sans': stack('"Plus Jakarta Sans"') },
    light: { 'surface.ground': '#F8FAFC', 'surface.raised': '#FFFFFF', 'surface.sunken': '#EEF1F7', 'text.default': '#111827', 'text.muted': '#4B5563', 'text.quiet': '#566070', 'border.hairline': '#E1E5EE', 'border.strong': '#6B7385', 'action.default': '#2563EB', 'accent.default': '#7C3AED', 'border.focus': '#7C3AED', 'accent.subtle': '#F1EAFE' },
    dark: { 'surface.ground': '#111827', 'surface.raised': '#182136', 'surface.sunken': '#1F2940', 'text.default': '#F1F5F9', 'text.muted': '#AEB8CA', 'text.quiet': '#9AA5B9', 'border.hairline': '#2A3550', 'border.strong': '#7C88A0', 'action.default': '#7AA2FF', 'accent.default': fix('Violet on midnight, dark', '#7C3AED', '#182136', 4.5), 'border.focus': fix('Violet focus on midnight, dark', '#7C3AED', '#182136', 3), 'accent.subtle': '#2A2050' },
    variants: [
      { name: 'Violet', selector: '.pz:has(#pz-violet:checked) .pz-panel', light: { 'action.default': '#7C3AED' }, dark: { 'action.default': '#B9A0FF' } },
      { name: 'Aqua', selector: '.pz:has(#pz-aqua:checked) .pz-panel', light: { 'action.default': aqua, 'accent.default': aqua, 'border.focus': aqua }, dark: { 'action.default': '#22D3EE', 'accent.default': '#22D3EE', 'border.focus': '#22D3EE' } },
    ],
    colors: { blue: ['#2563EB', '#2563EB'], violet: ['#7C3AED', '#7C3AED'], aqua: ['#06B6D4', '#06B6D4'], glass: ['rgb(255 255 255 / 0.78)', 'rgb(24 33 54 / 0.8)'], rim: ['rgb(255 255 255 / 0.9)', 'rgb(255 255 255 / 0.12)'] },
    hero: (c) => `<div class="pz">
    <div class="pz-bg" aria-hidden="true"></div>
    <div class="pz-panel">
      ${c.seg('pz', 'Theme for this panel', [['blue', 'Blue'], ['violet', 'Violet'], ['aqua', 'Aqua']])}
      <div class="pz-body">
        ${c.field('pz-q', 'Search services', { type: 'search', hint: 'For example, renew a permit' })}
        ${c.select('pz-area', 'Area', ['All areas', 'North', 'South'])}
        <div class="pz-tags">${c.tag('Housing')}${c.tag('Transport')}${c.tag('Health')}</div>
        <div class="pz-row">${c.button('Search')}${c.button('Clear', 'secondary')}</div>
        ${c.notice('Three services match. The structure stays; only the theme moved.')}
      </div>
    </div>
  </div>`,
    css: `
.d-adaptive-prism h1 { font-size: clamp(44px, 1.6rem + 4.2vw, 82px); font-weight: 800; letter-spacing: -0.035em; }
.d-adaptive-prism h2 { font-weight: 800; letter-spacing: -0.025em; }
.d-adaptive-prism .brand { font-weight: 800; letter-spacing: -0.03em; }
.d-adaptive-prism .brand::before { content: ""; width: 22px; height: 22px; border-radius: 7px; background: conic-gradient(from 200deg, var(--d-blue), var(--d-violet), var(--d-aqua), var(--d-blue)); }
.d-adaptive-prism .site-head { position: relative; }
.d-adaptive-prism .site-head::after { content: ""; position: absolute; inset-inline: 0; bottom: 0; height: 2px; background: linear-gradient(90deg, var(--d-blue), var(--d-violet), var(--d-aqua)); }
.d-adaptive-prism .hero { overflow: hidden; }
.d-adaptive-prism .pz { position: relative; padding: 32px 8px; }
.d-adaptive-prism .pz-bg { position: absolute; inset: -40px -80px; background: radial-gradient(40% 50% at 20% 30%, color-mix(in srgb, var(--d-blue) 40%, transparent), transparent 70%), radial-gradient(40% 50% at 80% 25%, color-mix(in srgb, var(--d-violet) 38%, transparent), transparent 70%), radial-gradient(45% 45% at 55% 85%, color-mix(in srgb, var(--d-aqua) 40%, transparent), transparent 70%); filter: blur(10px); }
.d-adaptive-prism .pz-panel { position: relative; display: grid; gap: 20px; padding: clamp(20px, 3vw, 32px); border-radius: 24px; background: var(--d-glass); backdrop-filter: blur(20px) saturate(150%); border: 1px solid var(--d-rim); box-shadow: 0 30px 60px -30px rgb(17 24 39 / 0.35); animation: pz-float 7s ease-in-out infinite alternate; }
@keyframes pz-float { to { transform: translateY(-8px); } }
.d-adaptive-prism .pz-body { display: grid; gap: 16px; }
.d-adaptive-prism .pz-tags, .d-adaptive-prism .pz-row { display: flex; flex-wrap: wrap; gap: 8px; }
.d-adaptive-prism .pz-panel [data-scope] { transition: background-color 400ms, border-color 400ms, color 400ms; }
.d-adaptive-prism .sec { border-top: 0; position: relative; }
.d-adaptive-prism .sec::before { content: ""; position: absolute; top: 0; inset-inline: var(--d-gutter); height: 1px; background: linear-gradient(90deg, transparent, var(--d-violet), var(--d-aqua), transparent); opacity: 0.6; }
.d-adaptive-prism .eyebrow { font-family: var(--d-sans); font-weight: 700; color: var(--saral-accent-default); text-transform: uppercase; letter-spacing: 0.08em; font-size: 12px; }
.d-adaptive-prism .stage, .d-adaptive-prism .script-stage { box-shadow: 0 24px 48px -32px rgb(17 24 39 / 0.3); }
.d-adaptive-prism .seg [data-part="item"] { border-radius: 999px; }
@media (forced-colors: active) { .d-adaptive-prism .pz-bg, .d-adaptive-prism .site-head::after, .d-adaptive-prism .sec::before { display: none; } .d-adaptive-prism .pz-panel { background: Canvas; backdrop-filter: none; border-color: CanvasText; } .d-adaptive-prism .brand::before { background: CanvasText; } }
`,
  };
});

// ------------------------------------------------------------------ 9 Editorial Signal
const editorial = def((fix) => {
  const orange = fix('Signal orange with white text and on paper', '#F97316', '#FAFAF7', 4.5);
  return {
    slug: 'editorial-signal', name: 'Editorial Signal', source: 'ChatGPT answers',
    idea: 'Clarity and typography as the brand: a strong scale, fine rules, strict columns.',
    chips: ['#FAFAF7', '#171717', '#52525B', '#E5E7EB', '#F97316'],
    google: [google(['DM+Sans:wght@400..700', 'Source+Serif+4:wght@600..700'])],
    fontNote: 'DM Sans and Source Serif 4 from Google Fonts, cut to Latin',
    tokens: { 'saral-radius-box': '2px', 'saral-radius-control': '2px', 'saral-font-family-sans': stack('"DM Sans"'), 'd-display': '"Source Serif 4", Georgia, serif' },
    light: { 'surface.ground': '#FAFAF7', 'surface.raised': '#FFFFFF', 'surface.sunken': '#F1F1EE', 'text.default': '#171717', 'text.muted': '#52525B', 'text.quiet': '#5D5D66', 'border.hairline': '#E5E7EB', 'border.strong': '#71717A', 'action.default': '#171717', 'accent.default': orange, 'border.focus': orange, 'accent.subtle': '#FDEEE4' },
    dark: { 'surface.ground': '#121212', 'surface.raised': '#1A1A1A', 'surface.sunken': '#222222', 'text.default': '#F4F4F2', 'text.muted': '#B4B4BB', 'text.quiet': '#A1A1A9', 'border.hairline': '#2C2C2C', 'border.strong': '#8A8A93', 'action.default': '#F4F4F2', 'text.on-action': '#121212', 'accent.default': '#F97316', 'text.on-accent': '#121212', 'border.focus': '#F97316', 'accent.subtle': '#33200F' },
    kicker: `Saral ${FACTS.version}<span aria-hidden="true"> · </span>24 October 2026`,
    hero: (c) => {
      const L = c.d.light, D = c.d.dark;
      const row = (r) => `<tr><th scope="row"><code>${r}</code></th><td class="num">${mode(L[r], D[r])}</td></tr>`;
      return `<aside class="ed-side" aria-label="Try it">
    <p class="ed-label">Try it</p>
    <form class="demo-form ed-try" action="sent.html" method="get" data-demo>
      <div data-scope="field" data-part="root"><label data-scope="field" data-part="label" for="ed-email">Email for the release note</label><input data-scope="field" data-part="input" id="ed-email" name="email" type="email" autocomplete="email" required><p data-scope="field" data-part="error" data-message-value-missing="Enter your email address" data-message-type-mismatch="Enter an email address like name@example.com">Enter an email address like name@example.com</p></div>
      <div class="form-actions">${c.button('Notify me', 'accent', 'submit')}</div>
      <p data-scope="notice" data-part="root" data-tone="success" role="status" class="sent" hidden>Noted. One email when 0.4.0 is out.</p>
    </form>
    <p class="ed-label">Token readout</p>
    <table class="readout"><caption class="vh">Tokens on this page, in the current mode</caption><tbody>${['surface.ground', 'text.default', 'action.default', 'accent.default', 'border.strong'].map(row).join('')}<tr><th scope="row"><code>radius.control</code></th><td class="num">2px</td></tr></tbody></table>
  </aside>`;
    },
    css: `
.d-editorial-signal .site-head { border-bottom: 1px solid var(--saral-text-default); }
.d-editorial-signal .brand { font: 700 30px/1 var(--d-display); letter-spacing: -0.02em; }
.d-editorial-signal .brand::after { content: "."; color: var(--saral-accent-default); }
.d-editorial-signal .hero { padding-top: 32px; }
.d-editorial-signal .hero-grid { border-top: 3px solid var(--saral-text-default); padding-top: 24px; align-items: start; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 1000px) { .d-editorial-signal .hero-grid { grid-template-columns: minmax(0, 8fr) minmax(0, 4fr); column-gap: 48px; } .d-editorial-signal .hero-sig { border-inline-start: 1px solid var(--saral-border-hairline); padding-inline-start: 32px; } }
.d-editorial-signal .kicker { font: 600 13px var(--d-sans); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px; }
.d-editorial-signal h1 { font-size: clamp(52px, 1.4rem + 6.4vw, 124px); font-weight: 700; line-height: 0.95; letter-spacing: -0.035em; }
.d-editorial-signal h2 { font-weight: 700; font-size: clamp(32px, 1.2rem + 2.4vw, 56px); letter-spacing: -0.025em; line-height: 1.02; }
.d-editorial-signal .lead { font-size: 21px; line-height: 1.45; color: var(--saral-text-default); max-width: 34em; }
.d-editorial-signal .ed-label { font: 700 12px var(--d-sans); text-transform: uppercase; letter-spacing: 0.12em; border-bottom: 1px solid var(--saral-text-default); padding-bottom: 6px; margin: 0 0 14px; }
.d-editorial-signal .ed-try { margin-bottom: 32px; }
.d-editorial-signal .readout { font-size: 13px; }
.d-editorial-signal .readout th, .d-editorial-signal .readout td { padding: 6px 0; }
.d-editorial-signal .readout td { text-align: end; font-family: var(--d-mono); }
.d-editorial-signal .sec { border-top: 1px solid var(--saral-text-default); }
.d-editorial-signal .sec-head { display: grid; gap: 0 48px; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 1000px) { .d-editorial-signal .sec-head { grid-template-columns: minmax(0, 3fr) minmax(0, 9fr); } .d-editorial-signal .sec-head .eyebrow { grid-row: span 2; } }
.d-editorial-signal .eyebrow { font: 700 13px var(--d-sans); text-transform: uppercase; letter-spacing: 0.12em; color: var(--saral-accent-default); }
.d-editorial-signal .seg [data-part="item"] { border-radius: 2px; }
.d-editorial-signal th, .d-editorial-signal td { border-bottom-color: var(--saral-border-hairline); }
`,
  };
});

// ------------------------------------------------------------------ 10 Script and Signal
const SWASH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 18'%3E%3Cpath d='M3 12 C 30 2, 52 2, 70 9 S 112 17, 157 5' fill='none' stroke='black' stroke-width='4.5' stroke-linecap='round'/%3E%3C/svg%3E";
const scriptSignal = def((fix) => {
  const magenta = fix('Magenta with white text and on chalk', '#EC4899', '#F5F5F0', 4.5);
  const cyanText = fix('Cyan text on chalk', '#06B6D4', '#F5F5F0', 4.5);
  return {
    slug: 'script-and-signal', name: 'Script and Signal', source: 'ChatGPT answers',
    idea: 'A graphic signature from the act of writing: ink strokes around clean parts.',
    chips: ['#0B0F14', '#F5F5F0', '#06B6D4', '#EC4899', '#8B5CF6'],
    google: [google(['Manrope:wght@400..800', 'IBM+Plex+Mono:wght@400;500'])],
    fontNote: 'Manrope and IBM Plex Mono from Google Fonts, cut to Latin',
    tokens: { 'saral-radius-box': '12px', 'saral-radius-control': '10px', 'saral-font-family-sans': stack('"Manrope"'), 'd-mono': mono('"IBM Plex Mono"') },
    light: { 'surface.ground': '#F5F5F0', 'surface.raised': '#FFFFFF', 'surface.sunken': '#EBEBE4', 'text.default': '#0B0F14', 'text.muted': '#4A505A', 'text.quiet': '#555B65', 'border.hairline': '#DEDED6', 'border.strong': '#6E737B', 'action.default': '#0B0F14', 'text.on-action': '#F5F5F0', 'accent.default': magenta, 'text.on-accent': '#FFFFFF', 'border.focus': '#7C4DEB', 'accent.subtle': '#FCE7F1' },
    dark: { 'surface.ground': '#0B0F14', 'surface.raised': '#121821', 'surface.sunken': '#18202B', 'text.default': '#F5F5F0', 'text.muted': '#A9B0BA', 'text.quiet': '#98A0AB', 'border.hairline': '#232C38', 'border.strong': '#7A838F', 'action.default': '#F5F5F0', 'text.on-action': '#0B0F14', 'accent.default': '#EC4899', 'text.on-accent': '#0B0F14', 'border.focus': '#A78BFA', 'accent.subtle': '#2E1324' },
    variants: [
      { name: 'Cyan', selector: '.ss:has(#ss-cyan:checked) .ss-live', light: { 'action.default': cyanText, 'accent.default': cyanText, 'border.focus': cyanText, 'text.on-action': '#FFFFFF' }, dark: { 'action.default': '#22D3EE', 'accent.default': '#22D3EE', 'border.focus': '#22D3EE' } },
      { name: 'Violet', selector: '.ss:has(#ss-violet:checked) .ss-live', light: { 'action.default': '#6D28D9', 'accent.default': '#6D28D9', 'text.on-action': '#FFFFFF', 'border.focus': '#6D28D9' }, dark: { 'action.default': '#B79CFB', 'accent.default': '#B79CFB', 'border.focus': '#B79CFB' } },
    ],
    colors: { cyan: ['#06B6D4', '#22D3EE'], magenta: ['#EC4899', '#F472B6'], violet: ['#8B5CF6', '#A78BFA'], 'cyan-text': [cyanText, '#22D3EE'] },
    extraPairs: [{ name: 'cyan labels', fg: [cyanText, '#22D3EE'], bg: ['#F5F5F0', '#0B0F14'], min: 4.5 }],
    hero: (c) => `<div class="ss">
    <svg class="ss-mark" viewBox="0 0 600 460" aria-hidden="true" focusable="false">
      <defs><linearGradient id="ss-ink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--d-cyan)"/><stop offset="0.55" stop-color="var(--d-magenta)"/><stop offset="1" stop-color="var(--d-violet)"/></linearGradient></defs>
      <path pathLength="1" d="M 70 360 C 20 250, 40 90, 190 50 C 330 12, 520 40, 560 150 C 600 260, 560 400, 400 425 C 270 445, 120 430, 80 380 C 60 350, 90 330, 130 345"/>
      <path pathLength="1" class="ss-flick" d="M 470 70 C 500 40, 540 30, 575 38"/>
    </svg>
    <div class="ss-live">
      ${c.seg('ss', 'Signal colour', [['magenta', 'Magenta'], ['cyan', 'Cyan'], ['violet', 'Violet']])}
      ${c.field('ss-sign', 'Sign here', { hint: 'Type your name as a signature', value: 'Meera Iyer' })}
      ${c.checkbox('ss-ok', 'I have read the terms', true)}
      <div class="ss-row">${c.button('Sign', 'accent')}${c.button('Clear', 'secondary')}</div>
    </div>
  </div>`,
    css: `
.d-script-and-signal h1 { font-size: clamp(44px, 1.6rem + 4.4vw, 86px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.98; }
.d-script-and-signal h2 { font-weight: 800; letter-spacing: -0.03em; }
.d-script-and-signal .brand { font-weight: 800; letter-spacing: -0.04em; font-size: 28px; }
.d-script-and-signal .brand::after { content: ""; width: 34px; height: 12px; background: linear-gradient(90deg, var(--d-cyan), var(--d-magenta), var(--d-violet)); -webkit-mask: url("${SWASH}") center / contain no-repeat; mask: url("${SWASH}") center / contain no-repeat; }
.d-script-and-signal .eyebrow { color: var(--d-cyan-text); font-weight: 500; }
.d-script-and-signal .ss { position: relative; display: grid; place-items: center; padding: clamp(36px, 7vw, 72px) clamp(20px, 6vw, 64px); }
.d-script-and-signal .ss-mark { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.d-script-and-signal .ss-mark path { fill: none; stroke: url(#ss-ink); stroke-width: 9; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: ss-write 2.4s 0.2s cubic-bezier(0.6, 0, 0.3, 1) forwards; }
.d-script-and-signal .ss-mark .ss-flick { stroke-width: 6; animation-delay: 2.4s; animation-duration: 0.5s; }
@keyframes ss-write { to { stroke-dashoffset: 0; } }
.d-script-and-signal .ss-live { position: relative; width: min(100%, 400px); display: grid; gap: 16px; background: var(--saral-surface-raised); border: 1px solid var(--saral-border-hairline); border-radius: 16px; padding: 24px; box-shadow: 0 24px 48px -28px rgb(11 15 20 / 0.4); }
.d-script-and-signal .ss-row { display: flex; gap: 8px; flex-wrap: wrap; }
.d-script-and-signal .sec-head h2::after { content: ""; display: block; width: 150px; height: 16px; margin-top: 10px; background: linear-gradient(90deg, var(--d-cyan), var(--d-magenta), var(--d-violet)); -webkit-mask: url("${SWASH}") left center / contain no-repeat; mask: url("${SWASH}") left center / contain no-repeat; }
.d-script-and-signal .sec { border-top: 0; }
.d-script-and-signal .seg [data-part="item"] { border-radius: 999px; }
@media (prefers-reduced-motion: reduce) { .d-script-and-signal .ss-mark path { stroke-dashoffset: 0; animation: none !important; } }
@media (forced-colors: active) { .d-script-and-signal .ss-mark path { stroke: CanvasText; } .d-script-and-signal .brand::after, .d-script-and-signal .sec-head h2::after { background: CanvasText; } }
`,
  };
});

// ------------------------------------------------------------------ 11 The Translator
// Draft translations of the headline, to be checked by native readers.
const TR = [
  { code: 'en', dir: 'ltr', name: 'English', script: 'Latin', text: 'Build it plain. Make it yours.' },
  { code: 'ar', dir: 'rtl', name: 'Arabic', script: 'Arabic', text: 'اصنعه بسيطًا. واجعله لك.' },
  { code: 'hi', dir: 'ltr', name: 'Hindi', script: 'Devanagari', text: 'सादा बनाइए। अपना बनाइए।' },
];
const translator = def((fix) => ({
  slug: 'translator', name: 'The Translator', source: 'Gemini answers',
  idea: 'Script fluidity at the centre: one line changes language while the layout stays still.',
  chips: ['#000000', '#F7F7F7', '#00FF00'],
  google: [google(['Noto+Sans:wght@400..700', 'IBM+Plex+Mono:wght@400;500']), google(['Noto+Sans+Arabic:wght@700', 'Noto+Sans+Devanagari:wght@700'], TR.slice(1).map((t) => t.text).join(''))],
  fontNote: 'Noto Sans and IBM Plex Mono from Google Fonts, cut to Latin; hero Arabic and Devanagari cut to the line',
  tokens: { 'saral-radius-box': '0px', 'saral-radius-control': '0px', 'saral-font-family-sans': stack('"Noto Sans"'), 'saral-motion-duration-fast': '0ms', 'saral-motion-duration-base': '0ms', 'd-mono': mono('"IBM Plex Mono"') },
  light: { 'surface.ground': '#F7F7F7', 'surface.raised': '#FFFFFF', 'surface.sunken': '#EBEBEB', 'text.default': '#000000', 'text.muted': '#474747', 'text.quiet': '#525252', 'border.hairline': '#CFCFCF', 'border.strong': '#000000', 'action.default': '#000000', 'text.on-action': '#F7F7F7', 'accent.default': '#000000', 'border.focus': '#000000', 'accent.subtle': '#E3E3E3' },
  dark: { 'surface.ground': '#000000', 'surface.raised': '#0D0D0D', 'surface.sunken': '#171717', 'text.default': '#F7F7F7', 'text.muted': '#B8B8B8', 'text.quiet': '#A6A6A6', 'border.hairline': '#2E2E2E', 'border.strong': '#F7F7F7', 'action.default': '#F7F7F7', 'text.on-action': '#000000', 'accent.default': '#F7F7F7', 'border.focus': '#00FF00', 'accent.subtle': '#1F1F1F' },
  notes: ['Neon green focus #00FF00 is 1.28:1 on chalk, so it is used only on black (15.3:1); on chalk the focus ring is black'],
  hero: (c) => `<div class="tr">
    ${c.seg('tr', 'Language of the line', [['auto', 'Cycle'], ...TR.map((t) => [t.code, t.name])])}
    <div class="tr-stage" aria-hidden="true">
      ${TR.map((t) => `<p class="tr-line tr-${t.code}" lang="${t.code}" dir="${t.dir}"><span class="tr-text">${esc(t.text)}</span><span class="tr-meta" dir="ltr">${t.code} · ${t.dir} · ${t.script}</span></p>`).join('\n      ')}
    </div>
    <ul class="vh">${TR.map((t) => `<li lang="${t.code}" dir="${t.dir}">${esc(t.text)}</li>`).join('')}</ul>
    <p class="tr-note">The box never moves: only the script, the direction and the shaping change. Arabic and Hindi are drafts for native readers to check.</p>
  </div>`,
  css: `
.d-translator *, .d-translator *::before, .d-translator *::after { transition: none !important; }
.d-translator .site-head { border-bottom: 1px solid var(--saral-text-default); }
.d-translator .brand { font: 700 22px/1 var(--d-mono); letter-spacing: -0.02em; }
.d-translator .brand::before { content: "A ع अ"; font: 700 13px/1 var(--d-mono); padding: 6px 8px; background: var(--saral-text-default); color: var(--saral-surface-ground); }
.d-translator h1 { font-size: clamp(38px, 1.4rem + 3.4vw, 68px); font-weight: 700; letter-spacing: -0.03em; }
.d-translator h2 { font-weight: 700; letter-spacing: -0.02em; }
.d-translator .hero-grid { gap: 32px; }
.d-translator .tr { display: grid; gap: 12px; }
.d-translator .tr-stage { display: grid; border: 1px solid var(--saral-text-default); background: var(--saral-surface-raised); min-height: 320px; }
.d-translator .tr-line { grid-area: 1 / 1; margin: 0; padding: clamp(20px, 3vw, 32px); display: grid; align-content: space-between; gap: 24px; visibility: hidden; }
.d-translator .tr-text { font: 700 clamp(36px, 1rem + 3.4vw, 60px)/1.2 "Noto Sans", "Noto Sans Arabic", "Noto Sans Devanagari", ${SCRIPT}, sans-serif; letter-spacing: -0.01em; }
.d-translator .tr-ar .tr-text, .d-translator .tr-hi .tr-text { letter-spacing: 0; }
.d-translator .tr-meta { font: 500 13px var(--d-mono); color: var(--saral-text-muted); border-top: 1px solid var(--saral-border-hairline); padding-top: 10px; }
.d-translator .tr:has(#tr-auto:checked) .tr-line { animation: tr-cycle 7.5s steps(1, end) infinite; }
.d-translator .tr:has(#tr-auto:checked) .tr-ar { animation-delay: 2.5s; }
.d-translator .tr:has(#tr-auto:checked) .tr-hi { animation-delay: 5s; }
@keyframes tr-cycle { 0% { visibility: visible; } 33.33% { visibility: hidden; } 100% { visibility: hidden; } }
.d-translator .tr:has(#tr-en:checked) .tr-en, .d-translator .tr:has(#tr-ar:checked) .tr-ar, .d-translator .tr:has(#tr-hi:checked) .tr-hi { visibility: visible; }
.d-translator .tr-note { font: 13px/1.5 var(--d-mono); color: var(--saral-text-muted); margin: 0; }
.d-translator .seg [data-part="item"] { border-radius: 0; border-color: var(--saral-text-default); }
.d-translator .seg [data-part="item"]:has(:checked) { background: var(--saral-text-default); }
.d-translator .seg [data-part="item"]:has(:checked) [data-part="item-label"] { color: var(--saral-surface-ground); }
.d-translator .eyebrow { text-transform: uppercase; letter-spacing: 0.1em; color: var(--saral-text-default); }
.d-translator .eyebrow::before { content: "→ "; }
.d-translator .sec { border-top: 1px solid var(--saral-text-default); }
.d-translator .stage, .d-translator .script-stage, .d-translator .nojs-pane { border-color: var(--saral-text-default); }
.d-translator th, .d-translator td { border-bottom-color: var(--saral-text-default); }
@media (prefers-reduced-motion: reduce) { .d-translator .tr:has(#tr-auto:checked) .tr-line { animation: none !important; } .d-translator .tr:has(#tr-auto:checked) .tr-en { visibility: visible; } }
@media (forced-colors: active) { .d-translator .seg [data-part="item"]:has(:checked) [data-part="item-label"] { color: HighlightText; } .d-translator .seg [data-part="item"]:has(:checked) { background: Highlight; } }
`,
}));

// ------------------------------------------------------------------ 12 Bare Bones
const bareBones = def((fix) => { const blueDark = fix('Browser blue on dark', '#0000EE', '#1E1E1E', 4.5); return {
  slug: 'bare-bones', name: 'Bare Bones', source: 'Gemini answers',
  idea: 'Native HTML before JavaScript: a raw form that gains Saral when you ask.',
  chips: ['#0000EE', '#551A8B', '#FF0000', '#EFEFEF'],
  google: [google(['Inter:wght@400..700', 'Courier+Prime:wght@400;700'])],
  fontNote: 'Inter and Courier Prime from Google Fonts, cut to Latin',
  tokens: { 'saral-radius-box': '2px', 'saral-radius-control': '3px', 'saral-font-family-sans': stack('"Inter"'), 'saral-size-control': '38px', 'saral-motion-duration-fast': '0ms', 'saral-motion-duration-base': '0ms', 'd-mono': mono('"Courier Prime"'), 'd-sec-pad': '40px', 'd-max': '1080px' },
  light: { 'surface.ground': '#EFEFEF', 'surface.raised': '#FFFFFF', 'surface.sunken': '#E2E2E2', 'text.default': '#000000', 'text.muted': '#3D3D3D', 'text.quiet': '#454545', 'border.hairline': '#C6C6C6', 'border.strong': '#767676', 'action.default': '#0000EE', 'accent.default': '#0000EE', 'border.focus': '#0000EE', 'accent.subtle': '#E3E3FB', 'feedback.danger.text': fix('Red error text, on the grey canvas and its pale tint', '#FF0000', '#FCE4E4', 4.5), 'feedback.danger.subtle': '#FCE4E4' },
  dark: { 'surface.ground': '#121212', 'surface.raised': '#1E1E1E', 'surface.sunken': '#2A2A2A', 'text.default': '#F0F0F0', 'text.muted': '#BDBDBD', 'text.quiet': '#ABABAB', 'border.hairline': '#3A3A3A', 'border.strong': '#8F8F8F', 'action.default': blueDark, 'accent.default': blueDark, 'border.focus': fix('Focus blue on dark', '#0000EE', '#1E1E1E', 3), 'feedback.danger.text': '#FF7A7A' },
  colors: { visited: [fix('Visited purple on grey', '#551A8B', '#EFEFEF', 4.5), fix('Visited purple on dark', '#551A8B', '#121212', 4.5)] },
  extraPairs: [{ name: 'visited links', fg: [fit('#551A8B', '#EFEFEF', 4.5), fit('#551A8B', '#121212', 4.5)], bg: ['#EFEFEF', '#121212'], min: 4.5 }],
  hero: (c) => `<div class="bb">
    <div class="bb-bar">
      <div data-scope="checkbox" data-part="root"><input data-scope="checkbox" data-part="input" type="checkbox" id="bb-on"><label data-scope="checkbox" data-part="label" for="bb-on">Add Saral’s CSS to this form</label></div>
      <code class="bb-tag" aria-hidden="true">&lt;form&gt;</code>
    </div>
    <div class="bb-form">${c.form(c.EN, 'bb', { variant: 'primary' })}</div>
    <p class="bb-note">Off, this is the browser’s own form: the same markup with no styles. On, the same markup in Saral. Either way it validates and posts with no script.</p>
  </div>`,
  css: `
.d-bare-bones body { font-size: 15px; }
.d-bare-bones a:visited { color: var(--d-visited); }
.d-bare-bones .site-head { border-bottom: 1px solid var(--saral-border-strong); }
.d-bare-bones .brand { font: 700 22px/1 var(--d-mono); }
.d-bare-bones .brand::before { content: "<" / ""; color: var(--saral-text-muted); }
.d-bare-bones .brand::after { content: ">" / ""; color: var(--saral-text-muted); }
.d-bare-bones .main-nav a { color: var(--saral-accent-default); text-decoration: underline; }
.d-bare-bones .main-nav a::before { content: "[" / ""; color: var(--saral-text-muted); }
.d-bare-bones .main-nav a::after { content: "]" / ""; color: var(--saral-text-muted); }
.d-bare-bones .hero { padding-block: 32px 48px; }
.d-bare-bones h1 { font-size: clamp(36px, 1.2rem + 3vw, 58px); font-weight: 700; letter-spacing: -0.02em; }
.d-bare-bones h2 { font-size: 28px; font-weight: 700; }
.d-bare-bones .bb { display: grid; gap: 12px; background: var(--saral-surface-raised); border: 1px solid var(--saral-border-strong); padding: 16px; }
.d-bare-bones .bb-bar { display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--saral-border-strong); padding-bottom: 12px; }
.d-bare-bones .bb-tag, .d-bare-bones .bb-note { font: 14px var(--d-mono); color: var(--saral-text-muted); }
.d-bare-bones .bb-note { margin: 0; }
/* Off: the browser's own styles for every Saral part in this form. */
.d-bare-bones .bb:not(:has(#bb-on:checked)) .bb-form :is(form, [data-scope]) { all: revert; }
.d-bare-bones .bb:not(:has(#bb-on:checked)) .bb-form [data-scope][data-part="error"] { display: none; }
.d-bare-bones .bb:not(:has(#bb-on:checked)) .bb-form [data-scope][data-part="root"] { display: block; margin-block: 0 12px; }
.d-bare-bones .bb:not(:has(#bb-on:checked)) .bb-form [data-scope="field"][data-part="hint"] { display: block; margin: 0; font-size: smaller; }
.d-bare-bones .bb:not(:has(#bb-on:checked)) .bb-form .sent[hidden] { display: none; }
.d-bare-bones .sec { border-top: 1px solid var(--saral-border-strong); }
.d-bare-bones .eyebrow { font: 14px var(--d-mono); color: var(--saral-text-muted); letter-spacing: 0; }
.d-bare-bones .eyebrow::before { content: "<section> " / ""; }
.d-bare-bones .seg [data-part="item"] { border-radius: 3px; min-height: 30px; }
.d-bare-bones table { font-size: 14px; border: 1px solid var(--saral-border-strong); }
.d-bare-bones th, .d-bare-bones td { border: 1px solid var(--saral-border-hairline); padding: 6px 8px; }
.d-bare-bones .stage, .d-bare-bones .script-stage { border-color: var(--saral-border-strong); }
`,
}; });

// ------------------------------------------------------------------ 13 The Chameleon
const chameleon = def((fix) => {
  const looks = [['neutral', 'Charcoal'], ['ember', 'Ember'], ['lagoon', 'Lagoon'], ['mor', 'Mor'], ['kosh', 'Kosh']];
  return {
    slug: 'chameleon', name: 'The Chameleon', source: 'Gemini answers',
    idea: 'The canvas shifts with the reader’s choice: pick a look and the whole page takes it.',
    chips: ['#111111', '#FAFAFA', '#B4361E', '#0F6E73'],
    google: [google(['Roboto:wght@400..700', 'Lora:wght@500..700'])],
    fontNote: 'Roboto and Lora from Google Fonts, cut to Latin',
    tokens: { 'saral-radius-box': '16px', 'saral-radius-control': '12px', 'saral-font-family-sans': stack('"Roboto"'), 'd-display': '"Lora", Georgia, serif' },
    light: { 'surface.ground': '#FAFAFA', 'surface.raised': '#FFFFFF', 'surface.sunken': '#EFEFEF', 'text.default': '#111111', 'text.muted': '#525252', 'text.quiet': '#5C5C5C', 'border.hairline': '#E2E2E2', 'border.strong': '#737373', 'action.default': '#111111', 'accent.default': '#111111', 'border.focus': '#111111', 'accent.subtle': '#EDEDED' },
    dark: { 'surface.ground': '#111111', 'surface.raised': '#1B1B1B', 'surface.sunken': '#242424', 'text.default': '#FAFAFA', 'text.muted': '#B5B5B5', 'text.quiet': '#A3A3A3', 'border.hairline': '#2E2E2E', 'border.strong': '#8A8A8A', 'action.default': '#FAFAFA', 'accent.default': '#FAFAFA', 'border.focus': '#FAFAFA', 'accent.subtle': '#262626' },
    variants: [
      { name: 'Ember', selector: ':root:has(#look-ember:checked)', light: { 'surface.ground': '#FFF6F1', 'surface.raised': '#FFFFFF', 'surface.sunken': '#F8E7DE', 'text.default': '#2A120A', 'text.muted': '#68412F', 'text.quiet': '#704A38', 'border.hairline': '#F0D6C8', 'border.strong': '#8D6352', 'action.default': '#B4361E', 'accent.default': '#B4361E', 'border.focus': '#B4361E', 'accent.subtle': '#FBE3D8' }, dark: { 'surface.ground': '#1A0F0B', 'surface.raised': '#241611', 'surface.sunken': '#2E1C16', 'text.default': '#FBEDE6', 'text.muted': '#D2B4A7', 'text.quiet': '#C0A194', 'border.hairline': '#3D2820', 'border.strong': '#9E7F72', 'action.default': '#FF9C7A', 'accent.default': '#FF9C7A', 'border.focus': '#FF9C7A', 'accent.subtle': '#3A1E14' } },
      { name: 'Lagoon', selector: ':root:has(#look-lagoon:checked)', light: { 'surface.ground': '#F1F8F8', 'surface.raised': '#FFFFFF', 'surface.sunken': '#DFEEEE', 'text.default': '#0A2224', 'text.muted': '#3B5759', 'text.quiet': '#45605F', 'border.hairline': '#CBE2E2', 'border.strong': '#5E7B7C', 'action.default': '#0F6E73', 'accent.default': '#0F6E73', 'border.focus': '#0F6E73', 'accent.subtle': '#D8EEEE' }, dark: { 'surface.ground': '#081517', 'surface.raised': '#0E2023', 'surface.sunken': '#14292C', 'text.default': '#E4F4F4', 'text.muted': '#A6C4C5', 'text.quiet': '#93B2B3', 'border.hairline': '#1D3A3D', 'border.strong': '#6F9294', 'action.default': '#5CC8C8', 'accent.default': '#5CC8C8', 'border.focus': '#5CC8C8', 'accent.subtle': '#123236' } },
    ],
    hero: (c) => `<div class="ch">
    <div class="ch-blob" aria-hidden="true"></div>
    ${c.seg('look', 'Look, for the whole page', looks, { cls: 'ch-look' })}
    ${c.seg('sp', 'Spacing', [['compact', 'Compact'], ['comfy', 'Comfortable'], ['roomy', 'Roomy']], { cls: 'ch-space', checked: 1 })}
    <article data-scope="card" data-part="root" class="ch-card">
      <h2 data-scope="card" data-part="title">Book a library room</h2>
      <p data-scope="card" data-part="body">Pick a look, a spacing and a typeface around this card. The page follows the look; the card follows all three.</p>
      ${c.select('ch-room', 'Room', ['Reading room', 'Group room', 'Quiet booth'])}
      ${c.field('ch-date', 'Date', { type: 'date' })}
      <div class="ch-row">${c.button('Book', 'accent')}${c.tag('Free')}</div>
    </article>
    ${c.seg('ty', 'Typeface', [['sans', 'Roboto'], ['serif', 'Lora']], { cls: 'ch-type' })}
    ${c.seg('sh', 'Shape', [['soft', 'Soft'], ['square', 'Square'], ['round', 'Round']], { cls: 'ch-shape' })}
  </div>`,
    css: `
:root:has(#look-mor:checked) { ${asDecls(MOR_VALUES)} }
:root:has(#look-kosh:checked) { ${asDecls(KOSH_VALUES)} }
.d-chameleon body, .d-chameleon .site-head, .d-chameleon .sec, .d-chameleon .ch-card, .d-chameleon .stage { transition: background-color 600ms ease, color 600ms ease, border-color 600ms ease; }
.d-chameleon h1 { font-size: clamp(44px, 1.6rem + 4.2vw, 82px); font-weight: 600; letter-spacing: -0.02em; }
.d-chameleon h2 { font-weight: 600; }
.d-chameleon .brand { font-weight: 600; }
.d-chameleon .brand::before { content: ""; width: 22px; height: 22px; border-radius: 40% 60% 55% 45% / 50% 40% 60% 50%; background: var(--saral-action-default); transition: background-color 600ms ease; }
.d-chameleon .hero-grid { grid-template-columns: minmax(0, 1fr); }
@media (min-width: 1100px) { .d-chameleon .hero-grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); } .d-chameleon h1 { font-size: clamp(44px, 1rem + 3.6vw, 72px); } }
.d-chameleon .ch { position: relative; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 760px) { .d-chameleon .ch { grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr); grid-template-areas: "look look look" "space card type" "shape shape shape"; align-items: center; } .d-chameleon .ch-look { grid-area: look; justify-content: center; } .d-chameleon .ch-space { grid-area: space; } .d-chameleon .ch-card { grid-area: card; } .d-chameleon .ch-type { grid-area: type; } .d-chameleon .ch-shape { grid-area: shape; justify-content: center; } .d-chameleon .ch-space, .d-chameleon .ch-type { flex-direction: column; align-items: stretch; } }
.d-chameleon .ch-look > legend, .d-chameleon .ch-shape > legend { text-align: center; }
.d-chameleon .ch-blob { position: absolute; inset: 10% 15%; background: var(--saral-accent-subtle); border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; animation: ch-morph 14s ease-in-out infinite alternate; transition: background-color 600ms ease; }
@keyframes ch-morph { 50% { border-radius: 63% 37% 41% 59% / 55% 62% 38% 45%; } 100% { border-radius: 38% 62% 50% 50% / 60% 35% 65% 40%; } }
.d-chameleon .ch-card { position: relative; box-shadow: 0 24px 48px -30px rgb(0 0 0 / 0.35); gap: var(--saral-space-4); }
.d-chameleon .ch-card h2 { font-size: 26px; }
.d-chameleon .ch-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.d-chameleon .ch:has(#sp-compact:checked) .ch-card { --saral-space-2: 4px; --saral-space-3: 8px; --saral-space-4: 10px; --saral-space-5: 16px; --saral-size-control: 36px; }
.d-chameleon .ch:has(#sp-roomy:checked) .ch-card { --saral-space-2: 12px; --saral-space-3: 16px; --saral-space-4: 24px; --saral-space-5: 36px; --saral-size-control: 52px; }
.d-chameleon .ch:has(#ty-serif:checked) .ch-card { --saral-font-family-sans: "Lora", Georgia, serif; font-family: "Lora", Georgia, serif; }
.d-chameleon .ch:has(#sh-square:checked) .ch-card { --saral-radius-box: 0px; --saral-radius-control: 0px; }
.d-chameleon .ch:has(#sh-round:checked) .ch-card { --saral-radius-box: 28px; --saral-radius-control: 9999px; }
.d-chameleon .ch-card [data-scope] { transition: border-radius 400ms ease, padding 400ms ease, min-height 400ms ease, background-color 600ms ease; }
.d-chameleon .eyebrow { font-family: var(--d-sans); font-weight: 500; color: var(--saral-text-muted); }
.d-chameleon .sec { border-top: 0; }
.d-chameleon .sec:nth-of-type(odd) { background: var(--saral-surface-raised); }
@media (forced-colors: active) { .d-chameleon .ch-blob { display: none; } }
`,
  };
});

// ------------------------------------------------------------------ 14 Architectural Blueprint
const blueprint = def((fix) => {
  const blue = fix('Blueprint blue as text on draft paper', '#1E90FF', '#FDFCF0', 4.5);
  return {
    slug: 'blueprint', name: 'Architectural Blueprint', source: 'Gemini answers',
    idea: 'Components as building materials: a button drawn up from its tokens, with redlines.',
    chips: ['#2F4F4F', '#1E90FF', '#FDFCF0', '#333333'],
    google: [google(['Fira+Sans:wght@400;600;700', 'Fira+Code:wght@400..600'])],
    fontNote: 'Fira Sans and Fira Code from Google Fonts, cut to Latin',
    tokens: { 'saral-radius-box': '0px', 'saral-radius-control': '0px', 'saral-font-family-sans': stack('"Fira Sans"'), 'd-mono': mono('"Fira Code"') },
    light: { 'surface.ground': '#FDFCF0', 'surface.raised': '#FFFFFF', 'surface.sunken': '#F1EFDD', 'text.default': '#333333', 'text.muted': '#4F5757', 'text.quiet': '#566060', 'border.hairline': '#D9DCCB', 'border.strong': '#6B7676', 'action.default': '#2F4F4F', 'accent.default': blue, 'border.focus': blue, 'accent.subtle': '#E7F0FB' },
    dark: { 'surface.ground': '#0D2A4A', 'surface.raised': '#12355C', 'surface.sunken': '#0A2440', 'text.default': '#EAF2FF', 'text.muted': '#B8CBE6', 'text.quiet': '#A8BEDD', 'border.hairline': '#24507F', 'border.strong': '#93B3DA', 'action.default': '#EAF2FF', 'text.on-action': '#0D2A4A', 'accent.default': '#8CC8FF', 'border.focus': '#FFD166', 'accent.subtle': '#173E68', 'feedback.danger.text': '#FFA59C', 'feedback.success.text': '#8BE3A5', 'feedback.warning.text': '#FFD27A', 'feedback.info.text': '#9FD3FF', 'feedback.danger.subtle': '#3A2232', 'feedback.success.subtle': '#123A3A', 'feedback.warning.subtle': '#33352A', 'feedback.info.subtle': '#123F69' },
    notes: ['Dark mode is a true blueprint: navy ground with pale lines, and an amber focus ring (#FFD166, 9.1:1)'],
    colors: { grid: ['rgb(30 144 255 / 0.12)', 'rgb(234 242 255 / 0.08)'], major: ['rgb(30 144 255 / 0.22)', 'rgb(234 242 255 / 0.16)'], red: ['#B42318', '#FF9C92'] },
    extraPairs: [{ name: 'redline labels', fg: ['#B42318', '#FF9C92'], bg: ['#FFFFFF', '#12355C'], min: 4.5 }],
    hero: (c) => `<figure class="bp">
    ${c.seg('bp', 'Build step', [['1', '1 Box'], ['2', '2 Padding'], ['3', '3 Type'], ['4', '4 Colour'], ['5', '5 Corners and stroke']], { checked: 4 })}
    <div class="bp-sheet">
      <div class="bp-zoom">
        <div class="bp-box">
          <span class="m m-h" aria-hidden="true"><b>44 · size.control</b></span>
          <span class="m m-pl" aria-hidden="true"><b>24 · space.5</b></span>
          <span class="m m-pr" aria-hidden="true"><b>24</b></span>
          ${c.button('Continue', '', 'button').replace('data-part="root"', 'data-part="root" class="bp-btn"')}
        </div>
      </div>
    </div>
    <figcaption>
      <table class="bp-tokens"><caption class="vh">Tokens the button is built from</caption><tbody>
        <tr><th scope="row"><code>size.control</code></th><td>44px, the minimum height</td></tr>
        <tr><th scope="row"><code>space.5</code></th><td>24px each side</td></tr>
        <tr><th scope="row"><code>font.weight.medium</code></th><td>500</td></tr>
        <tr><th scope="row"><code>action.default</code></th><td>${mode(c.d.light['action.default'], c.d.dark['action.default'])}</td></tr>
        <tr><th scope="row"><code>radius.control</code>, <code>size.stroke</code></th><td>0px, 1.5px</td></tr>
      </tbody></table>
    </figcaption>
  </figure>`,
    css: `
.d-blueprint body { background-image: linear-gradient(var(--d-major) 1px, transparent 1px), linear-gradient(90deg, var(--d-major) 1px, transparent 1px), linear-gradient(var(--d-grid) 1px, transparent 1px), linear-gradient(90deg, var(--d-grid) 1px, transparent 1px); background-size: 64px 64px, 64px 64px, 8px 8px, 8px 8px; }
.d-blueprint .site-head { background: var(--saral-surface-ground); border-bottom: 2px solid var(--saral-action-default); }
.d-blueprint .brand { font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; font-size: 22px; }
.d-blueprint .brand::before { content: ""; width: 20px; height: 20px; border: 2px solid var(--saral-accent-default); background: linear-gradient(45deg, transparent 45%, var(--saral-accent-default) 45% 55%, transparent 55%); }
.d-blueprint h1 { font-size: clamp(42px, 1.5rem + 4vw, 78px); font-weight: 700; letter-spacing: -0.02em; color: var(--saral-action-default); }
.d-blueprint h2 { font-weight: 700; }
.d-blueprint .hero-copy, .d-blueprint .bp, .d-blueprint .sec .wrap > * { background: var(--saral-surface-ground); }
.d-blueprint .bp { margin: 0; display: grid; gap: 16px; padding: 16px; border: 1px solid var(--saral-border-strong); }
.d-blueprint .bp-sheet { display: grid; place-items: center; min-height: 280px; background: var(--saral-surface-raised); border: 1px dashed var(--saral-border-strong); overflow: hidden; }
.d-blueprint .bp-zoom { zoom: 1.6; padding: 48px 40px 28px; }
@media (max-width: 480px) { .d-blueprint .bp-zoom { zoom: 1.15; } }
.d-blueprint .bp-box { position: relative; display: inline-block; }
.d-blueprint .bp-btn { position: relative; }
.d-blueprint .bp-btn::before { content: ""; position: absolute; inset: 0 var(--saral-space-5); outline: 1px dashed var(--d-red); pointer-events: none; }
.d-blueprint .m { position: absolute; font: 600 7px/1 var(--d-mono); color: var(--d-red); white-space: nowrap; }
.d-blueprint .m b { font-weight: 600; background: var(--saral-surface-raised); padding: 0 2px; }
.d-blueprint .m-h { inset-inline-end: calc(100% + 8px); top: 0; bottom: 0; border-inline-end: 1px solid var(--d-red); display: grid; align-items: center; padding-inline-end: 4px; }
.d-blueprint .m-pl, .d-blueprint .m-pr { bottom: calc(100% + 6px); width: var(--saral-space-5); border-top: 1px solid var(--d-red); display: grid; justify-items: center; padding-top: 2px; }
.d-blueprint .m-pl { inset-inline-start: 0; } .d-blueprint .m-pr { inset-inline-end: 0; }
.d-blueprint .m-pl b, .d-blueprint .m-pr b { transform: translateY(-14px); }
.d-blueprint .bp:has(#bp-1:checked) .bp-btn { background: transparent; color: var(--saral-text-default); border: 1px solid var(--d-red); padding: 0; min-height: 0; font: 400 13px var(--d-mono); }
.d-blueprint .bp:has(#bp-2:checked) .bp-btn { background: transparent; color: var(--saral-text-default); border: 1px solid var(--d-red); font: 400 13px var(--d-mono); }
.d-blueprint .bp:has(#bp-3:checked) .bp-btn { background: transparent; color: var(--saral-text-default); border: 1px solid var(--d-red); }
.d-blueprint .bp:has(#bp-4:checked) .bp-btn { border-color: transparent; }
.d-blueprint .bp:has(#bp-1:checked) .bp-btn::before { inset: 0; }
.d-blueprint .bp-tokens { font-size: 13px; }
.d-blueprint .bp-tokens th, .d-blueprint .bp-tokens td { padding: 6px 8px; border: 1px solid var(--saral-border-hairline); }
.d-blueprint .sec { border-top: 2px solid var(--saral-action-default); }
.d-blueprint .eyebrow { color: var(--saral-accent-default); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; }
.d-blueprint .eyebrow::before { content: "DWG "; }
.d-blueprint .seg [data-part="item"] { border-radius: 0; }
.d-blueprint .stage, .d-blueprint .script-stage { border: 1px solid var(--saral-border-strong); }
@media (forced-colors: active) { .d-blueprint body { background-image: none; } .d-blueprint .m { color: CanvasText; border-color: CanvasText; } .d-blueprint .bp-btn::before { outline-color: CanvasText; } }
`,
  };
});

// ------------------------------------------------------------------ 15 Soft Contrast
const softContrast = def((fix) => {
  const terra = fix('Soft terracotta with white text and on sand', '#D97A6B', '#F4EDE4', 4.5);
  return {
    slug: 'soft-contrast', name: 'Soft Contrast', source: 'Gemini answers',
    idea: 'Legibility and warmth: large targets, soft corners and gentle motion.',
    chips: ['#F4EDE4', '#1B3B36', '#D97A6B', '#FFFFFF'],
    google: [google(['Mulish:wght@400..800', 'Source+Code+Pro:wght@400..600'])],
    fontNote: 'Mulish and Source Code Pro from Google Fonts, cut to Latin',
    tokens: { 'saral-radius-box': '18px', 'saral-radius-control': '14px', 'saral-font-family-sans': stack('"Mulish"'), 'saral-size-control': '52px', 'saral-focus-width': '4px', 'saral-font-size-body': '18px', 'saral-font-size-small': '16px', 'saral-font-size-lead': '20px', 'saral-motion-duration-fast': '280ms', 'd-mono': mono('"Source Code Pro"') },
    light: { 'surface.ground': '#F4EDE4', 'surface.raised': '#FFFFFF', 'surface.sunken': '#EAE1D5', 'text.default': '#1B3B36', 'text.muted': '#4A5A55', 'text.quiet': '#52625D', 'border.hairline': '#E2D7C8', 'border.strong': '#6F7B76', 'action.default': '#1B3B36', 'accent.default': terra, 'border.focus': terra, 'accent.subtle': '#F8E3DE' },
    dark: { 'surface.ground': '#13201E', 'surface.raised': '#1A2A27', 'surface.sunken': '#213330', 'text.default': '#F4EDE4', 'text.muted': '#C3BCB1', 'text.quiet': '#B1AA9F', 'border.hairline': '#2C3F3B', 'border.strong': '#8E9A95', 'action.default': '#CFE3DA', 'accent.default': '#E59484', 'text.on-accent': '#13201E', 'border.focus': '#E59484', 'accent.subtle': '#3A2622' },
    hero: (c) => `<div class="sc">
    <div class="sc-card">
      <p class="sc-title">Ask for a callback</p>
      ${c.emailForm('scf', { variant: 'accent', label: 'Email address', value: 'asha.example.com', go: 'Ask for a callback' })}
    </div>
    <ol class="sc-notes">
      <li><b>Errors say what to do.</b> The message sits under the field, in plain words, and the border changes too, so colour is never the only sign.</li>
      <li><b>Focus you can always see.</b> Press Tab: a 4 pixel ring in terracotta, at 3:1 or more on every surface.</li>
      <li><b>Large targets.</b> Every control is 52 pixels tall.</li>
    </ol>
  </div>`,
    css: `
.d-soft-contrast h1 { font-size: clamp(44px, 1.6rem + 4vw, 80px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.04; }
.d-soft-contrast h2 { font-weight: 800; letter-spacing: -0.02em; }
.d-soft-contrast .brand { font-weight: 800; font-size: 28px; }
.d-soft-contrast .brand::before { content: ""; width: 26px; height: 26px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, var(--saral-accent-default) 0 40%, var(--saral-action-default) 41%); }
.d-soft-contrast .main-nav ul { font-size: 16px; }
.d-soft-contrast .hero { background: radial-gradient(800px 400px at 80% 20%, var(--saral-accent-subtle), transparent 70%); }
.d-soft-contrast .sc { display: grid; gap: 20px; }
.d-soft-contrast .sc-card { background: var(--saral-surface-raised); border-radius: 28px; padding: clamp(20px, 3vw, 36px); box-shadow: 0 2px 0 var(--saral-border-hairline), 0 30px 60px -36px rgb(27 59 54 / 0.4); }
.d-soft-contrast .sc-title { font-size: 24px; font-weight: 800; }
.d-soft-contrast .sc-notes { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; font-size: 16px; color: var(--saral-text-muted); }
.d-soft-contrast .sc-notes li { padding: 14px 18px; border-radius: 18px; background: var(--saral-surface-sunken); }
.d-soft-contrast .sc-notes b { color: var(--saral-text-default); }
.d-soft-contrast [data-scope] { transition-duration: 280ms; }
.d-soft-contrast .sec { border-top: 0; }
.d-soft-contrast .sec:nth-of-type(even) { background: var(--saral-surface-raised); }
.d-soft-contrast .eyebrow { font-family: var(--d-sans); font-weight: 700; color: var(--saral-accent-default); letter-spacing: 0.02em; font-size: 15px; }
.d-soft-contrast .seg [data-part="item"] { border-radius: 999px; min-height: 44px; padding-inline: 12px 16px; }
.d-soft-contrast .stage, .d-soft-contrast .script-stage { border-radius: 28px; border: 0; }
.d-soft-contrast .nojs-pane { border-radius: 28px; }
`,
  };
});

export const DIRECTIONS = [neel, twoBrands, specSheet, plainSheet, kolam, livingMaterial, modular, prism, editorial, scriptSignal, translator, bareBones, chameleon, blueprint, softContrast];
