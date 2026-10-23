// Measures one representative docs page per benchmarked system with the
// repo's own Playwright: bytes transferred, JavaScript bytes, requests, LCP,
// and how much of the page text is still there with JavaScript off.
// Run: node docs/research/website/measure-docs.mjs   (writes measurements.json)
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(new URL('../../../package.json', import.meta.url));
const { chromium } = require('playwright');

const SITES = [
  ['Tailwind CSS', 'https://tailwindcss.com/docs/installation/using-vite'],
  ['Material 3', 'https://m3.material.io/components/buttons/overview'],
  ['Radix Primitives', 'https://www.radix-ui.com/primitives/docs/components/checkbox'],
  ['Base UI', 'https://base-ui.com/react/components/checkbox'],
  ['shadcn/ui', 'https://ui.shadcn.com/docs/components/button'],
  ['Vercel Geist', 'https://vercel.com/geist/button'],
  ['Linear docs', 'https://linear.app/docs'],
  ['Stripe docs', 'https://docs.stripe.com/payments/quickstart'],
  ['GOV.UK Design System', 'https://design-system.service.gov.uk/components/button/'],
  ['IBM Carbon', 'https://carbondesignsystem.com/components/button/usage/'],
  ['Shopify Polaris (web components)', 'https://shopify.dev/docs/api/app-home/polaris-web-components/actions/button'],
  ['Shopify Polaris (React, archived)', 'https://polaris-react.shopify.com/components/actions/button'],
  ['GitHub Primer', 'https://primer.style/product/components/button/'],
  ['Atlassian', 'https://atlassian.design/components/button/examples'],
  ['Microsoft Fluent 2', 'https://fluent2.microsoft.design/components/web/react/core/button/usage'],
  ['Apple HIG', 'https://developer.apple.com/design/human-interface-guidelines/buttons'],
  ['Mantine', 'https://mantine.dev/core/button/'],
  ['Chakra UI', 'https://chakra-ui.com/docs/components/button'],
  ['Ark UI', 'https://ark-ui.com/docs/components/checkbox'],
  ['Park UI', 'https://park-ui.com/docs/components/button'],
  ['Web Awesome', 'https://webawesome.com/docs/components/button'],
  ['Saral (current)', 'https://saral-ds.netlify.app/components/button.html'],
];

const browser = await chromium.launch();
const results = [];
for (const [name, url] of SITES) {
  const r = { name, url };
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    let bytes = 0, js = 0, reqs = 0;
    page.on('response', async (res) => {
      reqs++;
      try {
        const sizes = await res.request().sizes();
        const b = sizes.responseBodySize + sizes.responseHeadersSize;
        bytes += b;
        if (res.request().resourceType() === 'script') js += b;
      } catch {}
    });
    await page.addInitScript(() => {
      window.__lcp = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch {}
    r.lcpMs = Math.round(await page.evaluate(() => window.__lcp));
    r.loadMs = Date.now() - t0;
    r.textWithJs = (await page.evaluate(() => document.body.innerText.length));
    await page.waitForTimeout(500);
    r.kb = Math.round(bytes / 1024);
    r.jsKb = Math.round(js / 1024);
    r.requests = reqs;
    await ctx.close();
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const p2 = await noJs.newPage();
    await p2.goto(url, { waitUntil: 'load', timeout: 60000 });
    r.textNoJs = await p2.evaluate(() => document.body.innerText.length);
    await noJs.close();
  } catch (e) {
    r.error = String(e.message).slice(0, 160);
  }
  console.log(JSON.stringify(r));
  results.push(r);
}
await browser.close();
writeFileSync(new URL('measurements.json', import.meta.url), JSON.stringify(results, null, 2));
