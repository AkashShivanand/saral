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

  test('after a submit attempt, every invalid control shows its error from CSS alone', async ({ page }) => {
    await page.goto('/fixtures/kit.html');
    await pressSend(page);
    for (const id of ['reply', 'topic', 'consent']) await expect(page.locator(`#${id}-error`)).toBeVisible();
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

test('errors stay hidden until there is something wrong', async ({ page }) => {
  await page.goto('/fixtures/kit.html?theme=mor');
  for (const id of ['reply', 'topic', 'consent']) await expect(page.locator(`#${id}-error`)).toBeHidden();
});

test('a whole card opens its link, and a link inside it still goes its own way', async ({ page }) => {
  await page.goto('/fixtures/kit.html?theme=mor');
  const card = page.locator('[data-interactive]');
  const box = await card.boundingBox();
  await page.mouse.click(box.x + box.width - 8, box.y + 8);
  await expect(page).toHaveURL(/thanks\.html/);
  await page.goBack();
  await page.getByRole('link', { name: 'The contact form' }).click();
  await expect(page).toHaveURL(/contact\.html/);
});

test('form controls meet the 24 by 24 pixel minimum target', async ({ page }) => {
  await page.goto('/fixtures/kit.html?theme=mor');
  for (const sel of ['#consent', '#reply-email', '[data-part="remove"]']) {
    const box = await page.locator(sel).boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(24);
    expect(box.height).toBeGreaterThanOrEqual(24);
  }
});

// Final review fixes

test('a radio group is checked only when focus leaves the whole group', async ({ page }) => {
  await page.goto('/fixtures/kit.html?theme=mor');
  const state = () => page.evaluate(() => document.getElementById('reply-email').getAttribute('aria-invalid'));
  await page.evaluate(() => {
    const a = document.getElementById('reply-email');
    a.dispatchEvent(new Event('change', { bubbles: true }));
    a.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.getElementById('reply-phone') }));
  });
  expect(await state()).toBe(null);
  await page.evaluate(() => {
    document.getElementById('reply-phone').dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.getElementById('topic') }));
  });
  expect(await state()).toBe('true');
});

test('unticking a required checkbox tells screen readers at once, while focus stays on it', async ({ page }) => {
  await page.goto('/fixtures/kit.html?theme=mor');
  const box = page.getByLabel('You may keep my email to reply');
  await box.check();
  await box.uncheck();
  await expect(box).toBeFocused();
  await expect(box).toHaveAttribute('aria-invalid', 'true');
  await expect(box).toHaveAttribute('aria-describedby', 'consent-error');
});

test('in forced colours (Windows High Contrast) the select keeps the browser arrow', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/fixtures/kit.html?theme=mor');
  expect(await page.locator('#topic').evaluate((el) => getComputedStyle(el).appearance)).not.toBe('none');
});

test('every interactive thing inside a whole-card link stays clickable', async ({ page }) => {
  await page.goto('/fixtures/kit.html?theme=mor');
  await page.evaluate(() => {
    document.querySelector('[data-interactive] [data-part="body"]').insertAdjacentHTML('beforeend', ' <a id="plain" href="#plain">A plain link</a> <button id="btn" type="button">A button</button>');
  });
  for (const id of ['plain', 'btn']) {
    const hit = await page.locator(`#${id}`).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === el;
    });
    expect(hit, id).toBe(true);
  }
});

test('a disabled select looks disabled', async ({ page }) => {
  await page.goto('/fixtures/kit.html?theme=mor');
  await page.locator('#topic').evaluate((el) => (el.disabled = true));
  await expect(page.locator('#topic')).toHaveCSS('color', 'rgb(138, 151, 153)');
});

test.describe('removing a tag with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });
  test('the remove part is a link that works without script', async ({ page }) => {
    await page.goto('/fixtures/kit.html');
    const remove = page.getByRole('link', { name: 'Remove Accessibility' });
    await expect(remove).toHaveAttribute('href', /.+/);
  });
});

test.describe('right to left', () => {
  test('the select arrow and the removable tag sit on the end side', async ({ page }) => {
    await page.goto('/fixtures/kit.html?theme=mor');
    await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
    const select = await page.locator('#topic').evaluate((e) => {
      const s = getComputedStyle(e);
      return { position: s.backgroundPosition, left: parseFloat(s.paddingLeft), right: parseFloat(s.paddingRight) };
    });
    expect(select.position).not.toContain('100%');
    expect(select.left).toBeGreaterThan(select.right);
    const tag = await page.locator('[data-scope="tag"][data-part="root"]').nth(1).evaluate((e) => {
      const s = getComputedStyle(e);
      return { left: parseFloat(s.paddingLeft), right: parseFloat(s.paddingRight) };
    });
    expect(tag.left).toBeLessThan(tag.right);
  });
});
