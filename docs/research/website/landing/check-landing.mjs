#!/usr/bin/env node
// Checks every landing page in Chromium and records the results the picker
// and README show: first-load weight, axe (WCAG 2.0 to 2.2, A and AA) in
// light and dark at 1280 and 375 pixels and with forced colours, sideways
// scroll at 375, the page with JavaScript off (theme, script and mode switches
// still work, the scripts-off form refuses an empty post and sends a full
// one), and no running animation when the reader asks for reduced motion.
// Writes results.json and shots/<slug>.jpg, then rebuilds the picker and README.
// Run: node docs/research/website/landing/check-landing.mjs [slug ...]
// If Playwright's own browser is missing, run `npx playwright install chromium`,
// or set PLAYWRIGHT_MODULE (and CHROMIUM_PATH) to a Playwright that has one.
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import AxeModule from '@axe-core/playwright';
import { build } from './build-landing.mjs';

const AxeBuilder = AxeModule.default ?? AxeModule;
// PLAYWRIGHT_MODULE points at another Playwright when the installed browser
// belongs to a different version than the repo's.
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const chromium = pw.chromium ?? pw.default.chromium;
const here = (f) => new URL(f, import.meta.url);
const PORT = Number(process.env.PORT ?? 4333);
const BASE = `http://127.0.0.1:${PORT}/docs/research/website/landing/`;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const TEXT = /^(text\/|application\/(javascript|json)|image\/svg)/;

const server = spawn(process.execPath, [fileURLToPath(new URL('../../../../tools/serve.mjs', import.meta.url))], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
for (let i = 0; i < 50; i++) {
  try { if ((await fetch(BASE + 'index.html')).ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 100));
}

const dirs = await build({ quiet: true });
const only = process.argv.slice(2);
const todo = dirs.filter((d) => !only.length || only.includes(d.slug));
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } : undefined;
const browser = await chromium.launch({ proxy, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const resultsFile = here('results.json');
const results = existsSync(resultsFile) ? JSON.parse(readFileSync(resultsFile, 'utf8')) : {};
mkdirSync(here('shots'), { recursive: true });

const axe = async (page, off = []) => {
  // Legacy mode: the default mode waits forever on the sandboxed, script-free
  // frame. That frame's page is checked on its own below.
  const r = await new AxeBuilder({ page }).withTags(TAGS).disableRules(off).setLegacyMode(true).analyze();
  return { violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) })) };
};
// Waits for every finite animation, such as a line drawing itself, to end.
const settle = (page) => page.evaluate(() => Promise.race([
  Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))),
  new Promise((r) => setTimeout(r, 8000)),
]));
const context = (o = {}) => browser.newContext({ viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: true, ...o });

const log = (...a) => { if (process.env.VERBOSE) console.log(new Date().toISOString().slice(11, 19), ...a); };

async function check(d) {
  const r = { axe: {} };
  const url = `${BASE}${d.slug}.html`;

  // First load, light, 1280: weight, axe, screenshot.
  {
    const ctx = await context({ colorScheme: 'light' });
    const page = await ctx.newPage();
    const bodies = [];
    page.on('response', async (res) => {
      try {
        const body = await res.body();
        const type = res.headers()['content-type'] ?? '';
        bodies.push({ url: res.url(), bytes: body.length, gzip: TEXT.test(type) ? gzipSync(body).length : body.length });
      } catch {}
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const sum = (k) => bodies.reduce((s, b) => s + b[k], 0);
    log(d.slug, 'weight');
    r.weight = { kb: Math.round(sum('bytes') / 1024), gzipKb: Math.round(sum('gzip') / 1024), files: bodies.length, fonts: bodies.filter((b) => /woff2|gstatic/.test(b.url)).map((b) => `${b.url.split('/').pop().slice(0, 40)} ${Math.round(b.bytes / 1024)} kB`) };
    log(d.slug, 'axe 1280 light');
    r.axe['1280 light'] = await axe(page);
    log(d.slug, 'settled');
    await settle(page);
    await page.screenshot({ path: fileURLToPath(here(`shots/${d.slug}.jpg`)), type: 'jpeg', quality: 72 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(400);
    r.axe['1280 dark'] = await axe(page);
    await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' });
    await page.waitForTimeout(400);
    // In forced colours the system palette sets contrast, and axe reads the
    // page's own text colour against the forced background, so its contrast
    // rule is off for this pass; the screenshots are checked by eye.
    r.axe['forced colours'] = await axe(page, ['color-contrast']);
    log(d.slug, 'forced');
    r.forced = { ok: r.axe['forced colours'].violations.length === 0 };
    if (process.env.SHOTS_DIR) await page.screenshot({ path: `${process.env.SHOTS_DIR}/${d.slug}-forced.jpg`, type: 'jpeg', quality: 60 });
    await page.emulateMedia({ colorScheme: 'light', forcedColors: 'none' });
    await page.goto(`${BASE}nojs/${d.slug}.html`, { waitUntil: 'networkidle' });
    r.axe['scripts-off frame'] = await axe(page);
    await ctx.close();
  }

  // Phone width, light and dark: axe and sideways scroll.
  {
    const ctx = await context({ viewport: { width: 375, height: 812 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const over = async () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const px = [await over()];
    r.axe['375 light'] = await axe(page);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(300);
    px.push(await over());
    r.axe['375 dark'] = await axe(page);
    if (process.env.SHOTS_DIR) await page.screenshot({ path: `${process.env.SHOTS_DIR}/${d.slug}-375.jpg`, type: 'jpeg', quality: 60, fullPage: true });
    log(d.slug, '375');
    r.overflow = { ok: Math.max(...px) <= 0, px: Math.max(...px) };
    await ctx.close();
  }

  // JavaScript off: the page reads in full and the CSS switches still work.
  {
    const ctx = await context({ javaScriptEnabled: false, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const notes = [];
    for (const id of ['hero-h', 'themes', 'scripts', 'nojs', 'components', 'platforms', 'trust']) {
      if (!(await page.locator(`#${id}`).isVisible())) notes.push(`#${id} not visible`);
    }
    const stageVar = () => page.locator('.stage').evaluate((el) => getComputedStyle(el).getPropertyValue('--saral-radius-control').trim());
    await page.locator('label[for="th-kosh"]').click();
    if ((await stageVar()) !== '9999px') notes.push('theme switch did not apply Kosh');
    await page.locator('label[for="sc-ar"]').click();
    if (!(await page.locator('[data-lang="ar"] form[dir="rtl"]').isVisible())) notes.push('Arabic form not shown');
    if (await page.locator('[data-lang="en"] form').isVisible()) notes.push('English form still shown');
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const light = await bg();
    await page.locator('label[for="mode-dark"]').click();
    await page.waitForTimeout(800);
    if ((await bg()) === light) notes.push('mode switch did not change the page');
    await page.locator('label[for="mode-light"]').click();
    log(d.slug, 'nojs switches');
    // The scripts-off frame: an empty send is refused, a full one posts.
    await page.locator('.nojs-pane > summary').click();
    await page.locator('.nojs-frame').scrollIntoViewIfNeeded();
    const frame = page.frameLocator('.nojs-frame');
    await frame.locator('button[type="submit"]').click();
    await page.waitForTimeout(300);
    if (!(await frame.locator('[data-scope="field"] [data-part="error"]').isVisible())) notes.push('empty send showed no error');
    await frame.locator('input[name="name"]').fill('Asha Rao');
    await frame.locator('select[name="contact"]').selectOption('email');
    await frame.locator('button[type="submit"]').click();
    await page.waitForTimeout(600);
    if (!(await frame.locator('text=Sent, with no JavaScript at all').isVisible())) notes.push('full send did not post');
    log(d.slug, 'nojs frame');
    r.nojs = { ok: notes.length === 0, notes };
    await ctx.close();
    // Axe cannot run where JavaScript is disabled, so its no-script pass
    // blocks every script the page asks for instead: as if none arrived.
    const ctx2 = await context({ colorScheme: 'light' });
    await ctx2.route(/\.m?js(\?|$)/, (route) => route.abort());
    const page2 = await ctx2.newPage();
    await page2.goto(url, { waitUntil: 'networkidle' });
    r.axe['scripts blocked'] = await axe(page2);
    await ctx2.close();
  }

  // Reduced motion: nothing keeps moving.
  {
    const ctx = await context({ reducedMotion: 'reduce', colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && Number(a.effect?.getComputedTiming().activeDuration) > 1).length);
    log(d.slug, 'motion');
    r.motion = { ok: running === 0, running };
    await ctx.close();
  }
  return r;
}

const queue = [...todo];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const d = queue.shift();
    try {
      results[d.slug] = await check(d);
      const v = Object.entries(results[d.slug].axe).filter(([, x]) => x.violations.length).map(([k, x]) => `${k}: ${x.violations.map((y) => `${y.id} (${y.nodes})`).join(', ')}`);
      const x = results[d.slug];
      console.log(`${d.slug}: ${x.weight.kb} kB (${x.weight.gzipKb} kB gzipped); axe ${v.length ? v.join('; ') : 'clean'}; no JS ${x.nojs.ok ? 'ok' : x.nojs.notes.join(', ')}; 375 ${x.overflow.ok ? 'ok' : `${x.overflow.px}px over`}; motion ${x.motion.ok ? 'ok' : `${x.motion.running} running`}`);
    } catch (e) {
      console.error(`${d.slug}: ${e.message}`);
      process.exitCode = 1;
    }
  }
}));

await browser.close();
server.kill();
writeFileSync(resultsFile, `${JSON.stringify(results, null, 2)}\n`);
await build({ quiet: true });
console.log('wrote results.json, shots/, index.html and README.md');
