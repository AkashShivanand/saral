import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
});

const pressSend = (page) => page.getByRole('button', { name: 'Send' }).click();

test.describe('with JavaScript on', () => {
  test('an empty submit shows every error and focuses the first control', async ({ page }) => {
    await page.goto('/fixtures/kit.html?theme=mor');
    await pressSend(page);
    for (const [id, text] of [['reply', 'Choose how we should reply'], ['topic', 'Choose a topic'], ['consent', 'Tick this so we can reply']]) {
      await expect(page.locator(`#${id}-error`)).toBeVisible();
      await expect(page.locator(`#${id}-error`)).toHaveText(text);
    }
    await expect(page.locator('#reply-email')).toBeFocused();
  });

  test('every radio in a group carries the error, and choosing one clears it', async ({ page }) => {
    await page.goto('/fixtures/kit.html?theme=mor');
    await pressSend(page);
    for (const id of ['reply-email', 'reply-phone']) {
      await expect(page.locator(`#${id}`)).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`#${id}`)).toHaveAttribute('aria-describedby', 'reply-error');
    }
    await page.getByLabel('Phone').check();
    await expect(page.locator('#reply-error')).toBeHidden();
    await expect(page.locator('#reply-email')).not.toHaveAttribute('aria-invalid', /.*/);
  });

  test('moving between radios in a group does not check it until focus leaves the group', async ({ page }) => {
    await page.goto('/fixtures/kit.html?theme=mor');
    await page.getByLabel('Email', { exact: true }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#reply-error')).toBeHidden();
    await expect(page.getByLabel('Phone')).toBeChecked();
  });

  test('ticking a required checkbox clears its error at once', async ({ page }) => {
    await page.goto('/fixtures/kit.html?theme=mor');
    await pressSend(page);
    await page.getByLabel('You may keep my email to reply').check();
    await expect(page.locator('#consent-error')).toBeHidden();
  });

  test('a select left on its placeholder is invalid, and a real choice clears it', async ({ page }) => {
    await page.goto('/fixtures/kit.html?theme=mor');
    await pressSend(page);
    await expect(page.locator('#topic-error')).toBeVisible();
    await expect(page.locator('#topic')).toHaveAttribute('aria-describedby', 'topic-hint topic-error');
    await page.getByLabel('Topic', { exact: true }).selectOption('work');
    await expect(page.locator('#topic-error')).toBeHidden();
    await expect(page.locator('#topic')).toHaveAttribute('aria-describedby', 'topic-hint');
  });
});

test.describe('with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });

  test('the browser blocks an empty submit', async ({ page }) => {
    await page.goto('/fixtures/kit.html');
    await pressSend(page);
    await expect(page).toHaveURL(/kit\.html$/);
  });

  test('a select changed back to its placeholder shows its error from CSS alone', async ({ page }) => {
    await page.goto('/fixtures/kit.html');
    await page.getByLabel('Topic', { exact: true }).selectOption('work');
    await page.getByLabel('Topic', { exact: true }).selectOption('');
    await page.getByLabel('Topic', { exact: true }).press('Tab');
    await expect(page.locator('#topic-error')).toBeVisible();
  });
});

for (const theme of ['mor', 'kosh']) {
  for (const mode of ['light', 'dark']) {
    test(`the kit passes axe with errors showing: ${theme}, ${mode}`, async ({ page }) => {
      await page.goto(`/fixtures/kit.html?theme=${theme}&mode=${mode}`);
      await pressSend(page);
      await expect(page.locator('#reply-error')).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}
