// Takes validation over from the browser so errors show inline, in the page's
// own words, and focus moves to the first one. Submitting stays a normal form
// post. If this script never runs, the browser's own validation still works.
import { enhanceField, FIELD } from './field.mjs';
import { setPending } from './pending.mjs';

const SUBMIT = 'button[type="submit"], button:not([type]), input[type="submit"]';

/** @typedef {{ destroy(): void, reset(): void }} FormHandle */

/**
 * @param {HTMLFormElement} form
 * @returns {FormHandle}
 */
export function enhanceForm(form) {
  /** @type {Map<Element, import('./field.mjs').FieldHandle>} */
  const fields = new Map();
  // Fields added after this call (a React field that mounts later) are picked
  // up here, at the latest when the form is submitted.
  const refresh = () => {
    for (const root of form.querySelectorAll(FIELD)) {
      if (!fields.has(root)) fields.set(root, enhanceField(/** @type {HTMLElement} */ (root)));
    }
  };
  refresh();
  const hadNoValidate = form.noValidate;
  form.noValidate = true;
  let submitting = false;
  /** @type {HTMLElement | null} */
  let pending = null;

  const reset = () => {
    submitting = false;
    if (pending) setPending(pending, false);
    pending = null;
  };

  /** @param {SubmitEvent} e */
  const onSubmit = (e) => {
    if (submitting) {
      e.preventDefault();
      return;
    }
    refresh();
    if (!form.checkValidity()) {
      e.preventDefault();
      const first = /** @type {HTMLInputElement | undefined} */ (
        [...form.elements].find((el) => /** @type {HTMLInputElement} */ (el).willValidate && !(/** @type {HTMLInputElement} */ (el).validity.valid))
      );
      if (first) {
        first.focus();
        // A control Saral does not manage gets the browser's own message, so
        // a submit is never blocked without saying why.
        const root = first.closest(FIELD);
        if (!root || !fields.has(root)) first.reportValidity();
      }
      return;
    }
    submitting = true;
    const submitter = /** @type {HTMLElement | null} */ (
      e.submitter ?? [...form.elements].find((el) => el.matches(SUBMIT)) ?? null
    );
    // Decide after every other submit handler has run. A site that cancels
    // the submit (to send it by fetch) or posts into another tab keeps a live
    // form; only a real same-tab post marks the button pending.
    setTimeout(() => {
      const target = (e.submitter?.getAttribute('formtarget') ?? form.getAttribute('target') ?? '').toLowerCase();
      if (e.defaultPrevented || (target !== '' && target !== '_self')) {
        submitting = false;
        return;
      }
      pending = submitter;
      if (pending) setPending(pending, true);
    }, 0);
  };
  /** @param {PageTransitionEvent} e */
  const onShow = (e) => {
    if (e.persisted) reset();
  };
  form.addEventListener('submit', onSubmit);
  window.addEventListener('pageshow', onShow);
  return {
    reset,
    destroy() {
      form.removeEventListener('submit', onSubmit);
      window.removeEventListener('pageshow', onShow);
      form.noValidate = hadNoValidate;
      for (const f of fields.values()) f.destroy();
    },
  };
}
