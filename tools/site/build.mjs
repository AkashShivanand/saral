#!/usr/bin/env node
// Builds the documentation portal into site/dist: an overview, the changelog,
// the tokens with every contrast pair, one page per component from its spec,
// and the decision and incident records. Every page is styled by Saral
// itself, with a switch for theme and mode. No dependencies.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve, posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderMarkdown, esc } from './markdown.mjs';
import { demos } from './demos.mjs';
import { buildTheme } from '../../packages/tokens/src/build.mjs';
import { cssValue } from '../../packages/tokens/src/outputs.mjs';
import { contrast, parseColor } from '../../packages/tokens/src/color.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPO = 'https://github.com/AkashShivanand/saral';
const THEMES = ['mor', 'kosh'];
const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const listMd = (dir) => (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.md')).sort() : []);
const titleOf = (md) => (md.match(/^#\s+(.*)$/m)?.[1] ?? '').trim();

function table(head, rows) {
  const th = head.map((h) => `<th>${h}</th>`).join('');
  const tb = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`;
}

export function buildSite({ out = join(ROOT, 'site/dist') } = {}) {
  const { version } = readJson('package.json');
  const specs = readdirSync(join(ROOT, 'specs'))
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ id: f.replace('.json', ''), ...readJson(`specs/${f}`) }));
  const decisions = listMd('docs/decisions').map((f) => ({ dir: 'decisions', f }));
  const incidents = listMd('docs/incidents').map((f) => ({ dir: 'incidents', f }));
  const pages = [];

  rmSync(out, { recursive: true, force: true });
  const write = (rel, text) => {
    mkdirSync(dirname(join(out, rel)), { recursive: true });
    writeFileSync(join(out, rel), text);
  };
  const copy = (from, to) => {
    mkdirSync(dirname(join(out, to)), { recursive: true });
    copyFileSync(join(ROOT, from), join(out, to));
  };
  for (const t of THEMES) copy(`dist/css/${t}.css`, `assets/saral/${t}.css`);
  copy('dist/css/components.css', 'assets/saral/components.css');
  copy('site/src/site.css', 'assets/site.css');
  copy('site/src/theme.js', 'assets/theme.js');
  for (const f of readdirSync(join(ROOT, 'packages/core/src'))) copy(`packages/core/src/${f}`, `assets/core/${f}`);

  // A link inside a Markdown document: a rendered document becomes its page,
  // anything else in the repo goes to GitHub.
  const rendered = new Map([
    ['CHANGELOG.md', 'changes.html'],
    ...decisions.map(({ f }) => [`docs/decisions/${f}`, `decisions/${f.replace('.md', '.html')}`]),
    ...incidents.map(({ f }) => [`docs/incidents/${f}`, `incidents/${f.replace('.md', '.html')}`]),
  ]);
  const linker = (source, page) => (url) => {
    if (/^(https?:|mailto:|#)/.test(url)) return url;
    const target = posix.normalize(posix.join(posix.dirname(source), url));
    const html = rendered.get(target);
    if (html) return posix.relative(posix.dirname(page), html) || html;
    return `${REPO}/blob/main/${target}`;
  };

  const nav = (page) => {
    const pre = page.includes('/') ? '../' : '';
    const item = (href, label) => `<li><a data-scope="link" data-part="root" href="${pre}${href}"${href === page ? ' aria-current="page"' : ''}>${label}</a></li>`;
    return `<nav class="side" aria-label="Sections">
<ul>${item('index.html', 'Overview')}${item('changes.html', 'Changes')}${item('tokens.html', 'Tokens')}${item('decisions.html', 'Decisions and incidents')}</ul>
<h2>Components</h2>
<ul>${specs.map((s) => item(`components/${s.id}.html`, esc(s.name))).join('')}</ul>
</nav>`;
  };

  const page = (path, title, body, extraScript = '') => {
    const pre = path.includes('/') ? '../' : '';
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Saral</title>
<script src="${pre}assets/theme.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anek+Latin:wdth,wght@75..125,100..800&display=swap">
<link rel="stylesheet" href="${pre}assets/saral/kosh.css">
<link rel="stylesheet" href="${pre}assets/saral/mor.css">
<link rel="stylesheet" href="${pre}assets/saral/components.css">
<link rel="stylesheet" href="${pre}assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="brand" href="${pre}index.html">Saral</a>
  <span class="version">v${version}</span>
  <div class="controls">
    <label for="theme">Theme</label>
    <select id="theme"><option value="mor">Mor</option><option value="kosh">Kosh</option><option value="none">No theme</option></select>
    <label for="mode">Mode</label>
    <select id="mode"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select>
  </div>
</header>
<div class="layout">
${nav(path)}
<main id="main">
${body}
</main>
</div>
<footer>Saral v${version}. <a data-scope="link" data-part="root" href="${REPO}">Source on GitHub</a>. MIT licence.</footer>
${extraScript}
</body>
</html>
`;
    write(path, html);
    pages.push(path);
  };

  // Overview
  const sample = `<div data-scope="field" data-part="root" data-invalid>
  <label data-scope="field" data-part="label" for="ID-email">Email</label>
  <input data-scope="field" data-part="input" id="ID-email" value="asha@" aria-invalid="true" aria-describedby="ID-email-error">
  <p data-scope="field" data-part="error" id="ID-email-error">Enter an email address like name@example.com</p>
</div>
<div class="row"><button data-scope="button" data-part="root" data-variant="accent" type="button">Send</button><a data-scope="link" data-part="root" href="changes.html">See what changed</a></div>
<div data-scope="notice" data-part="root" data-tone="success" role="status">Message sent.</div>`;
  const looks = [['mor', 'light', 'Mor, light'], ['mor', 'dark', 'Mor, dark'], ['kosh', 'light', 'Kosh, light'], ['kosh', 'dark', 'Kosh, dark']]
    .map(([t, m, label]) => `<section data-saral-theme="${t}" data-saral-mode="${m}" aria-label="${label}"><h2>${label}</h2>${sample.replaceAll('ID', `${t}-${m}`)}</section>`)
    .join('\n');
  page(
    'index.html',
    'Overview',
    `<h1>Saral</h1>
<p class="lead">Saral means simple. A design system where the look is a theme you can swap, and every part is plain, accessible HTML that works without JavaScript.</p>
<p>This is version <strong>v${version}</strong>. The same markup below, in each of Saral's two themes and both modes. Use the switch at the top to restyle this whole portal.</p>
<div class="looks">${looks}</div>
<h2>What is here</h2>
<ul>
<li><a data-scope="link" data-part="root" href="changes.html">Changes</a>: every release, newest first.</li>
<li><a data-scope="link" data-part="root" href="tokens.html">Tokens</a>: the colour roles of each theme, and every contrast pair with its ratio.</li>
<li>Components: ${specs.map((s) => `<a data-scope="link" data-part="root" href="components/${s.id}.html">${esc(s.name)}</a>`).join(', ')}.</li>
<li><a data-scope="link" data-part="root" href="decisions.html">Decisions and incidents</a>: why things are the way they are, and the mistakes that became rules.</li>
</ul>`,
  );

  // Changes
  page('changes.html', 'Changes', renderMarkdown(readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8'), { link: linker('CHANGELOG.md', 'changes.html') }));

  // Tokens
  const roles = readJson('tokens/roles.json').roles;
  const { pairs } = readJson('tokens/pairs.json');
  const themeBlocks = THEMES.map((t) => {
    const modes = buildTheme(join(ROOT, 'tokens/themes', t));
    const colourRows = roles
      .filter((r) => modes.light.get(r)?.type === 'color')
      .map((r) => {
        const cell = (m) => {
          const v = cssValue(modes[m].get(r));
          return `<span class="swatch" style="background:${v}"></span><code>${v}</code>`;
        };
        return [`<code>--saral-${r.replaceAll('.', '-')}</code>`, cell('light'), cell('dark')];
      });
    const pairRows = [];
    for (const m of ['light', 'dark']) {
      for (const p of pairs) {
        const ratio = contrast(parseColor(modes[m].get(p.text).value), parseColor(modes[m].get(p.on).value));
        const ok = ratio >= p.min;
        pairRows.push([
          m,
          `<code>${p.text}</code> on <code>${p.on}</code>`,
          `<span data-pair="${esc(`${t}-${m}-${p.text}-${p.on}`)}">${ratio.toFixed(2)}:1</span>`,
          `${p.min}:1`,
          ok ? '<span class="pass">Passes</span>' : '<span class="fail">Fails</span>',
        ]);
      }
    }
    const name = t === 'mor' ? 'Mor' : 'Kosh';
    return `<h2 id="${t}">${name}</h2>
<h3>Colour roles</h3>
${table(['Role', 'Light', 'Dark'], colourRows)}
<h3>Contrast pairs</h3>
<p>Every pair is checked when Saral builds; a pair below its minimum stops the build.</p>
${table(['Mode', 'Pair', 'Ratio', 'Needs', 'Result'], pairRows)}`;
  }).join('\n');
  const sizes = ['display', 'h1', 'h2', 'h3', 'lead', 'body', 'small'];
  page(
    'tokens.html',
    'Tokens',
    `<h1>Tokens</h1>
<p class="lead">A theme fills these roles. Components use only the roles, so a new theme restyles everything.</p>
<h2>Type</h2>
<div class="scale">${sizes.map((s) => `<div style="font-size:var(--saral-font-size-${s});font-stretch:var(--saral-font-width-${s === 'display' || s === 'h1' ? 'display' : s.startsWith('h') ? 'heading' : 'body'});line-height:var(--saral-font-leading-tight)">${s} <code>--saral-font-size-${s}</code></div>`).join('')}</div>
<h2>Space</h2>
<div class="scale">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<div><code>--saral-space-${n}</code><div class="bar" style="width:var(--saral-space-${n})"></div></div>`).join('')}</div>
<h2>Corners</h2>
<p><span class="radius" style="border-radius:var(--saral-radius-box)"></span><span class="radius" style="border-radius:var(--saral-radius-control)"></span><code>--saral-radius-box</code> and <code>--saral-radius-control</code>, in the current theme.</p>
${themeBlocks}`,
  );

  // Components
  const colourRoles = new Set(roles);
  for (const s of specs) {
    const path = `components/${s.id}.html`;
    const demoHtml = (demos[s.id] ?? [])
      .map((d) => `<h3>${esc(d.title)}</h3>
<div class="demo"><div class="stage">${d.html}</div><details><summary>Markup</summary><pre><code>${esc(d.html)}</code></pre></details></div>`)
      .join('\n');
    const tokens = s.tokens
      .map((t) => `<li>${colourRoles.has(t) ? `<span class="swatch" style="background:var(--saral-${t.replaceAll('.', '-')})"></span>` : ''}<code>--saral-${t.replaceAll('.', '-')}</code></li>`)
      .join('');
    const script = ['field', 'checkbox', 'radio', 'select'].includes(s.id)
      ? `<script type="module">
import { enhanceField, FIELD } from '../assets/core/index.mjs';
for (const root of document.querySelectorAll('.demo :is(' + FIELD + '):not([data-invalid])')) enhanceField(root);
</script>`
      : '';
    page(
      path,
      s.name,
      `<h1>${esc(s.name)}</h1>
<p><span class="badge">${esc(s.status)}</span> <span class="badge">since v${esc(s.since)}</span></p>
<p class="lead">${esc(s.purpose)}</p>
<h2>Examples</h2>
${demoHtml}
<h2>When to use</h2>
<ul>${s.whenToUse.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
<h2>When not to use</h2>
<ul>${s.whenNotToUse.map((w) => `<li>${esc(w.case)}: use ${esc(w.instead)} instead.</li>`).join('')}</ul>
<h2>Anatomy</h2>
${table(['Part', 'Element', 'Role'], s.anatomy.map((a) => [`<code>data-part="${esc(a.part)}"</code>`, esc(a.element), esc(a.role)]))}
${s.states.length ? `<h2>States</h2>\n${table(['State', 'Set by', 'How'], s.states.map((x) => [esc(x.state), esc(x.setBy), esc(x.how)]))}` : ''}
<h2>Props</h2>
${table(['Name', 'Type', 'Default', 'What it does'], s.props.map((p) => [`<code>${esc(p.name)}</code>`, `<code>${esc(p.type)}</code>`, esc(p.default), esc(p.does)]))}
${s.keyboard.length ? `<h2>Keyboard</h2>\n${table(['Key', 'Action'], s.keyboard.map((k) => [esc(k.key), esc(k.action)]))}` : ''}
<h2>Accessibility</h2>
${table(['Platform', 'How'], [['Web', esc(s.accessibility.web)], ['iOS', esc(s.accessibility.ios)], ['Android', esc(s.accessibility.android)]])}
<p>${s.screenReaderLog.length ? `Screen-reader passes: ${s.screenReaderLog.length}.` : 'No manual screen-reader pass is logged yet, so this component stays in preview.'}</p>
<h2>Writing</h2>
<p>${esc(s.content)}</p>
<h2>Tokens it uses</h2>
<ul>${tokens}</ul>`,
      script,
    );
  }

  // Decisions and incidents
  const docs = [...decisions, ...incidents];
  for (const { dir, f } of docs) {
    const source = `docs/${dir}/${f}`;
    const path = `${dir}/${f.replace('.md', '.html')}`;
    const md = readFileSync(join(ROOT, source), 'utf8');
    page(path, titleOf(md), renderMarkdown(md, { link: linker(source, path) }));
  }
  const list = (items) => `<ul>${items
    .map(({ dir, f }) => `<li><a data-scope="link" data-part="root" href="${dir}/${f.replace('.md', '.html')}">${esc(titleOf(readFileSync(join(ROOT, 'docs', dir, f), 'utf8')))}</a></li>`)
    .join('')}</ul>`;
  page(
    'decisions.html',
    'Decisions and incidents',
    `<h1>Decisions and incidents</h1>
<p class="lead">Decisions record why Saral works the way it does. Incidents record a mistake and the automated check that now stops it happening again.</p>
<h2>Decisions</h2>
${list(decisions)}
<h2>Incidents</h2>
${incidents.length ? list(incidents) : '<p>None yet.</p>'}`,
  );

  return { pages };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { pages } = buildSite();
  console.log(`site: built ${pages.length} pages into ${relative(process.cwd(), resolve(ROOT, 'site/dist'))}`);
}
