// Optional script for the landing pages. Every page reads and works without
// it: the colour mode, theme and script switches are CSS. This adds Saral's
// core form behaviour, remembers the colour mode, and measures the page.
import { enhanceForm } from '../../../../packages/core/src/index.mjs';

const KEY = 'saral-landing-mode';
const modes = [...document.querySelectorAll('input[name="mode"]')];
const frame = /** @type {HTMLIFrameElement | null} */ (document.querySelector('.nojs-frame'));

// The scripts-off frame cannot run code, so the page sets its mode from outside.
const syncFrame = () => {
  const value = modes.find((r) => r.checked)?.value ?? 'system';
  try {
    const doc = frame?.contentDocument?.documentElement;
    if (doc) doc.style.colorScheme = value === 'system' ? '' : value;
  } catch {}
};
try {
  const saved = localStorage.getItem(KEY);
  const radio = modes.find((r) => r.value === saved);
  if (radio) radio.checked = true;
} catch {}
for (const r of modes) {
  r.addEventListener('change', () => {
    try { localStorage.setItem(KEY, r.value); } catch {}
    syncFrame();
  });
}
frame?.addEventListener('load', syncFrame);

// Real core behaviour: inline errors in the form's own language, focus to the
// first error. A valid demo form confirms in place instead of leaving the page.
for (const form of document.querySelectorAll('form[data-demo]')) {
  enhanceForm(/** @type {HTMLFormElement} */ (form));
  form.addEventListener('submit', (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    const sent = form.querySelector('.sent');
    if (sent) sent.hidden = false;
  });
}

// A field marked data-show-error starts wrong on purpose: check it as if the
// reader had just typed in it and left, so the hero shows a live error.
for (const input of document.querySelectorAll('[data-show-error]')) {
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
}

for (const code of document.querySelectorAll('[data-copy]')) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'copy';
  b.textContent = 'Copy';
  b.setAttribute('data-scope', 'button');
  b.setAttribute('data-part', 'root');
  b.setAttribute('data-variant', 'secondary');
  b.setAttribute('aria-live', 'polite');
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
      b.textContent = 'Copied';
    } catch {
      b.textContent = 'Select the line to copy it';
    }
    setTimeout(() => { b.textContent = 'Copy'; }, 2000);
  });
  code.after(b);
}

addEventListener('load', () => {
  const out = document.querySelector('[data-weight]');
  if (!out) return;
  setTimeout(() => {
    const entries = [performance.getEntriesByType('navigation')[0], ...performance.getEntriesByType('resource')];
    const total = entries.reduce((s, e) => s + (/** @type {PerformanceResourceTiming} */ (e).transferSize || /** @type {PerformanceResourceTiming} */ (e).encodedBodySize || 0), 0);
    if (total) {
      out.textContent = `This page loaded ${Math.round(total / 1024)} kB, measured by your browser.`;
      out.hidden = false;
    }
  }, 800);
});
