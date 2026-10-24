#!/usr/bin/env node
// Checks the two finalist Button pages the way the site's exit gate will:
// axe (WCAG 2.2 AA tags) in light and dark at 1280 and 375 pixels, no sideways
// scroll on a phone, text with JavaScript off, a forced-colours render, and
// first-load weight with fonts. Writes checks.json and screenshots in shots/.
// Run: node docs/research/website/final/build-button.mjs && node docs/research/website/final/check.mjs
// Set SARAL_CHROME=1 to use the installed Chrome when Playwright's own browser is missing.
import { writeFileSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PORT = 4329;
const BASE = `http://127.0.0.1:${PORT}/docs/research/website/final`;
const PAGES = ['neel', 'spec', 'final'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const shots = new URL('shots/', import.meta.url);
mkdirSync(shots, { recursive: true });

const server = spawn(process.execPath, ['tools/serve.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const browser = await chromium.launch(process.env.SARAL_CHROME ? { channel: 'chrome' } : {});
const results = {};

try {
  for (const name of PAGES) {
    const url = `${BASE}/${name}-button.html`;
    const r = (results[name] = { axe: {}, overflow375: null, textWithoutJs: null, weight: null });

    for (const width of [1280, 375]) {
      for (const colorScheme of ['light', 'dark']) {
        const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
        const page = await ctx.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        r.axe[`${width} ${colorScheme}`] = violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
        if (width === 375 && colorScheme === 'light') r.overflow375 = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        if (colorScheme === 'light' || width === 1280) await page.screenshot({ path: new URL(`${name}-${width}-${colorScheme}.png`, shots).pathname, fullPage: true });
        await ctx.close();
      }
    }

    // Six scripts open: the fonts load, and axe runs again on the open panel.
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.locator('details.scripts summary').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400);
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      r.axe['1280 light, scripts open'] = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      await page.locator('#example').screenshot({ path: new URL(`${name}-scripts.png`, shots).pathname });
      await ctx.close();
    }

    // JavaScript off: the same text must be there.
    {
      const on = await browser.newContext(); const off = await browser.newContext({ javaScriptEnabled: false });
      const a = await on.newPage(); const b = await off.newPage();
      await a.goto(url); await b.goto(url);
      const [ta, tb] = await Promise.all([a.evaluate(() => document.body.innerText.length), b.evaluate(() => document.body.innerText.length)]);
      r.textWithoutJs = `${Math.round((tb / ta) * 100)}%`;
      await on.close(); await off.close();
    }

    // Forced colours (Windows High Contrast).
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, forcedColors: 'active', colorScheme: 'dark' });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: new URL(`${name}-forced.png`, shots).pathname, clip: { x: 0, y: 0, width: 1280, height: 900 } });
      r.forcedButtonsVisible = await page.evaluate(() => [...document.querySelectorAll('.stage [data-scope="button"]')].every((b) => getComputedStyle(b).borderStyle !== 'none' && b.offsetWidth > 0));
      await ctx.close();
    }

    // First-load weight, cold cache: bytes on the wire for every request.
    for (const open of [false, true]) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      const reqs = [];
      page.on('requestfinished', async (req) => { const s = await req.sizes(); reqs.push({ url: req.url().split('/').pop(), type: req.resourceType(), bytes: s.responseBodySize + s.responseHeadersSize }); });
      await page.goto(url, { waitUntil: 'networkidle' });
      if (open) { await page.locator('details.scripts summary').click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(400); }
      const total = reqs.reduce((s, x) => s + x.bytes, 0);
      const fonts = reqs.filter((x) => x.type === 'font').reduce((s, x) => s + x.bytes, 0);
      const script = reqs.filter((x) => x.type === 'script').reduce((s, x) => s + x.bytes, 0);
      const out = { requests: reqs.length, totalKB: +(total / 1024).toFixed(1), fontsKB: +(fonts / 1024).toFixed(1), scriptKB: +(script / 1024).toFixed(1), files: reqs.map((x) => `${x.url} ${(x.bytes / 1024).toFixed(1)} kB`) };
      if (open) r.weightScriptsOpen = out; else r.weight = out;
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}

writeFileSync(new URL('checks.json', import.meta.url), JSON.stringify(results, null, 2) + '\n');
for (const [name, r] of Object.entries(results)) {
  const axe = Object.entries(r.axe).map(([k, v]) => `${k}: ${v.length ? v.join('; ') : 'clean'}`).join('\n    ');
  console.log(`${name}\n  axe\n    ${axe}\n  sideways scroll at 375: ${r.overflow375}px\n  text without JavaScript: ${r.textWithoutJs}\n  forced colours, buttons keep a border: ${r.forcedButtonsVisible}\n  first load: ${r.weight.totalKB} kB in ${r.weight.requests} requests (fonts ${r.weight.fontsKB} kB, script ${r.weight.scriptKB} kB)\n  with six scripts open: ${r.weightScriptsOpen.totalKB} kB`);
}
