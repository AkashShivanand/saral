import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
});

const pressSubmit = (page) => page.evaluate(() => document.querySelector('button[type="submit"]').click());

const attr = (page, name) => page.evaluate((n) => document.querySelector('button[type="submit"]').getAttribute(n), name);

// Counts the form's real posts and answers each with 204 No Content, so the
// browser stays on the page and the button can be inspected afterwards.
const holdNavigation = async (page) => {
  let count = 0;
  await page.route(/fixtures\/thanks\.html/, (route) => {
    count += 1;
    return route.fulfill({ status: 204 });
  });
  return () => count;
};

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
    const hits = await holdNavigation(page);
    await fillValid(page);
    await pressSubmit(page);
    await expect.poll(() => attr(page, 'data-pending')).toBe('');
    expect(await attr(page, 'aria-disabled')).toBe('true');
    await pressSubmit(page);
    expect(hits()).toBe(1);
  });

  test('a page restored by the back button is no longer pending', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await holdNavigation(page);
    await fillValid(page);
    await pressSubmit(page);
    await expect.poll(() => attr(page, 'data-pending')).toBe('');
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    await expect.poll(() => attr(page, 'data-pending')).toBe(null);
    expect(await attr(page, 'aria-disabled')).toBe(null);
  });

  test('when the site cancels the submit itself (to send by fetch), the button is not left pending', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await page.evaluate(() => {
      window.sends = 0;
      document.addEventListener('submit', (e) => {
        e.preventDefault();
        window.sends += 1;
      });
    });
    await fillValid(page);
    await pressSubmit(page);
    await page.waitForTimeout(50);
    expect(await attr(page, 'data-pending')).toBe(null);
    await pressSubmit(page);
    await page.waitForTimeout(50);
    expect(await page.evaluate(() => window.sends)).toBe(2);
  });

  test('a form that opens in a new tab is not left pending', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await page.evaluate(() => (document.getElementById('contact').target = '_blank'));
    await fillValid(page);
    const popup = page.waitForEvent('popup');
    await pressSubmit(page);
    await popup;
    expect(await attr(page, 'data-pending')).toBe(null);
  });

  test('two requestSubmit calls in a row post once and mark the submit button pending', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    const hits = await holdNavigation(page);
    await fillValid(page);
    await page.evaluate(() => {
      const form = document.getElementById('contact');
      form.requestSubmit();
      form.requestSubmit();
    });
    await expect.poll(() => attr(page, 'data-pending')).toBe('');
    expect(hits()).toBe(1);
  });

  test('an invalid control Saral does not manage gets focus, so the submit is never silently blocked', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await page.evaluate(() => {
      const box = Object.assign(document.createElement('input'), { type: 'checkbox', id: 'consent', required: true });
      document.querySelector('.send').before(box);
    });
    await fillValid(page);
    await pressSubmit(page);
    await expect(page).toHaveURL(/contact\.html\?theme=mor$/);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('consent');
  });

  test('a field added after the form was enhanced still shows its error', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor');
    await page.evaluate(() => {
      document.querySelector('.send').insertAdjacentHTML('beforebegin', `
        <div data-scope="field" data-part="root">
          <label data-scope="field" data-part="label" for="phone">Phone</label>
          <input data-scope="field" data-part="input" id="phone" name="phone" required>
          <p data-scope="field" data-part="error" id="phone-error" hidden data-message-value-missing="Enter a phone number">Enter a phone number</p>
        </div>`);
    });
    await fillValid(page);
    await pressSubmit(page);
    await expect(page.locator('#phone-error')).toBeVisible();
    await expect(page.getByLabel('Phone')).toBeFocused();
  });

  test('a field written without an error element gets one, and the form still works', async ({ page }) => {
    await page.goto('/fixtures/contact.html?theme=mor&enhance=0');
    await page.evaluate(async () => {
      document.getElementById('name-error').remove();
      const { enhanceForm } = await import('/packages/core/src/index.mjs');
      enhanceForm(document.getElementById('contact'));
    });
    await pressSubmit(page);
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.getByLabel('Name')).toBeFocused();
  });
});

test.describe('React Strict Mode order: enhance, destroy, enhance', () => {
  test('after mount, cleanup and mount, a failed submit focuses the first error and a valid one posts once', async ({ page }) => {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    await page.goto('/fixtures/contact.html?theme=mor&enhance=0');
    await page.evaluate(async () => {
      const { enhanceForm } = await import('/packages/core/src/index.mjs');
      const form = document.getElementById('contact');
      enhanceForm(form).destroy();
      enhanceForm(form);
    });
    await pressSubmit(page);
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.getByLabel('Name')).toBeFocused();
    const hits = await holdNavigation(page);
    await fillValid(page);
    await pressSubmit(page);
    await pressSubmit(page);
    await expect.poll(() => attr(page, 'data-pending')).toBe('');
    expect(hits()).toBe(1);
  });

  test('a second instance destroyed while the first is live leaves validation with Saral', async ({ page }) => {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    await page.goto('/fixtures/contact.html?theme=mor');
    await page.evaluate(async () => {
      const { enhanceForm } = await import('/packages/core/src/index.mjs');
      enhanceForm(document.getElementById('contact')).destroy();
    });
    expect(await page.evaluate(() => document.getElementById('contact').noValidate)).toBe(true);
    await pressSubmit(page);
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.getByLabel('Name')).toBeFocused();
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
