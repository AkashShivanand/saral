import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { buildSite } from '../../tools/site/build.mjs';

test.beforeAll(() => {
  buildSite();
});

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
});

const PAGES = ['index.html', 'changes.html', 'tokens.html', 'decisions.html', 'components/button.html', 'components/field.html', 'components/link.html', 'components/notice.html'];

for (const theme of ['mor', 'kosh']) {
  for (const mode of ['light', 'dark']) {
    test(`every portal page passes axe: ${theme}, ${mode}`, async ({ page }) => {
      await page.addInitScript(([t, m]) => {
        localStorage.setItem('saral-theme', t);
        localStorage.setItem('saral-mode', m);
      }, [theme, mode]);
      for (const p of PAGES) {
        await page.goto(`/site/dist/${p}`);
        await expect(page.locator('html')).toHaveAttribute('data-saral-theme', theme);
        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        expect(violations.map((v) => `${p} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
      }
    });
  }
}

test('the theme switch restyles the portal and is remembered on the next page', async ({ page }) => {
  await page.goto('/site/dist/index.html');
  await page.getByLabel('Theme').selectOption('kosh');
  await page.getByLabel('Mode').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-saral-theme', 'kosh');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(14, 15, 12)');
  await page.getByRole('link', { name: 'Tokens' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-saral-theme', 'kosh');
  await expect(page.locator('html')).toHaveAttribute('data-saral-mode', 'dark');
});

test('the live field example shows its error after typing and leaving it', async ({ page }) => {
  await page.goto('/site/dist/components/field.html');
  const email = page.getByLabel('Email');
  await email.fill('asha@');
  await email.blur();
  await expect(page.locator('#demo-email-error')).toBeVisible();
  await expect(email).toHaveAttribute('aria-describedby', 'demo-email-hint demo-email-error');
});

test.describe('with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });
  test('the portal reads fine in Mor and hides the switch it cannot use', async ({ page }) => {
    await page.goto('/site/dist/index.html');
    await expect(page.getByRole('heading', { name: 'Saral', level: 1 })).toBeVisible();
    await expect(page.locator('.controls')).toBeHidden();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(244, 246, 245)');
  });
});
