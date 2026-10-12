import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
});

const pressSubmit = (page) => page.evaluate(() => document.querySelector('button[type="submit"]').click());

// Counts the submits that would really post, then cancels them, so the page
// stays put and the button can be inspected. Saral's own submit handler runs
// first, on the form; this one runs after it, on the window.
const holdPosts = (page) =>
  page.evaluate(() => {
    window.posts = 0;
    window.addEventListener('submit', (e) => {
      if (!e.defaultPrevented) window.posts += 1;
      e.preventDefault();
    });
  });

const fillValid = async (page) => {
  await page.getByLabel('Name').fill('Asha');
  await page.getByLabel('Email').fill('asha@example.com');
  await page.getByLabel('Message').fill('Hello');
};

test.describe('with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });

  test('the browser blocks an empty submit and the page stays', async ({ page }) => {
    await page.goto('/fixtures/contact.html');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/contact\.html$/);
  });

  test('a valid form submits as a normal form post', async ({ page }) => {
    await page.goto('/fixtures/contact.html');
    await fillValid(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/thanks\.html\?name=Asha/);
  });

  test('an invalid email gets the danger border from CSS alone', async ({ page }) => {
    await page.goto('/fixtures/contact.html');
    const email = page.getByLabel('Email');
    await email.fill('asha@');
    await email.press('Tab');
    await expect(email).toHaveCSS('border-top-color', 'rgb(180, 35, 24)');
  });
});

test.describe('with JavaScript on', () => {
  test('an error appears when the person leaves a field they typed in', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    const email = page.getByLabel('Email');
    const error = page.locator('#email-error');
    await email.fill('asha@');
    await expect(error).toBeHidden();
    await email.blur();
    await expect(error).toHaveText('Enter an email address like name@example.com');
    await expect(error).toBeVisible();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAttribute('aria-describedby', 'email-hint email-error');
  });

  test('once showing, the error clears as soon as the value is fixed, and the hint stays', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    const email = page.getByLabel('Email');
    await email.fill('asha@');
    await email.blur();
    await expect(page.locator('#email-error')).toBeVisible();
    await email.fill('asha@example.com');
    await expect(page.locator('#email-error')).toBeHidden();
    await expect(email).not.toHaveAttribute('aria-invalid', /.*/);
    await expect(email).toHaveAttribute('aria-describedby', 'email-hint');
  });

  test('leaving a field without typing shows nothing', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await page.getByLabel('Name').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('#name-error')).toBeHidden();
  });

  test('an empty submit shows every error in the page and focuses the first', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/contact\.html\?theme=mor$/);
    for (const [id, text] of [['name', 'Enter your name'], ['email', 'Enter your email address'], ['message', 'Write a message']]) {
      await expect(page.locator(`#${id}-error`)).toBeVisible();
      await expect(page.locator(`#${id}-error`)).toHaveText(text);
    }
    await expect(page.getByLabel('Name')).toBeFocused();
  });

  test('a valid submit posts the form', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await fillValid(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/thanks\.html\?name=Asha/);
  });

  test('a valid submit marks the button pending and a second press does not post again', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await holdPosts(page);
    await fillValid(page);
    const button = page.getByRole('button', { name: 'Send message' });
    await pressSubmit(page);
    await expect(button).toHaveAttribute('data-pending', '');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await pressSubmit(page);
    expect(await page.evaluate(() => window.posts)).toBe(1);
  });

  test('a page restored by the back button is no longer pending', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await holdPosts(page);
    await fillValid(page);
    const button = page.getByRole('button', { name: 'Send message' });
    await pressSubmit(page);
    await expect(button).toHaveAttribute('data-pending', '');
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    await expect(button).not.toHaveAttribute('data-pending', /.*/);
    await expect(button).not.toHaveAttribute('aria-disabled', /.*/);
  });
});

test('enhancing twice and destroying once leaves one working set of listeners', async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto('/fixtures/contact.html?theme=mor');
  await page.evaluate(async () => {
    const { enhanceForm } = await import('/packages/core/src/index.mjs');
    enhanceForm(document.getElementById('contact')).destroy();
  });
  const email = page.getByLabel('Email');
  await email.fill('asha@');
  await email.blur();
  await expect(page.locator('#email-error')).toBeVisible();
  await expect(email).toHaveAttribute('aria-describedby', 'email-hint email-error');
});
