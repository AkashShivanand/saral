import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['mor', 'kosh']) {
  for (const mode of ['light', 'dark']) {
    test(`contact page passes axe with errors showing: ${theme}, ${mode}`, async ({ page }) => {
      await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
      await page.goto(`/fixtures/contact.html?theme=${theme}&mode=${mode}`);
      await page.getByRole('button', { name: 'Send message' }).click();
      await expect(page.locator('#name-error')).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}
