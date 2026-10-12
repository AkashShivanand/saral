// Takes validation over from the browser so errors show inline, in the page's
// own words, and focus moves to the first one. Submitting stays a normal form
// post. If this script never runs, the browser's own validation still works.
import { enhanceField } from './field.mjs';
import { setPending } from './pending.mjs';

/**
 * @param {HTMLFormElement} form
 * @returns {{ destroy(): void }}
 */
export function enhanceForm(form) {
  const fields = [...form.querySelectorAll('[data-scope="field"][data-part="root"]')].map((r) =>
    enhanceField(/** @type {HTMLElement} */ (r)),
  );
  form.noValidate = true;
  /** @type {HTMLElement | null} */
  let pending = null;

  /** @param {SubmitEvent} e */
  const onSubmit = (e) => {
    if (pending) {
      e.preventDefault();
      return;
    }
    if (!form.checkValidity()) {
      e.preventDefault();
      /** @type {HTMLElement | null} */ (form.querySelector('[aria-invalid="true"]'))?.focus();
      return;
    }
    pending = /** @type {HTMLElement | null} */ (e.submitter ?? form.querySelector('[type="submit"]'));
    if (pending) setPending(pending, true);
  };
  /** @param {PageTransitionEvent} e */
  const onShow = (e) => {
    if (e.persisted && pending) {
      setPending(pending, false);
      pending = null;
    }
  };
  form.addEventListener('submit', onSubmit);
  window.addEventListener('pageshow', onShow);
  return {
    destroy() {
      form.removeEventListener('submit', onSubmit);
      window.removeEventListener('pageshow', onShow);
      form.noValidate = false;
      for (const f of fields) f.destroy();
    },
  };
}
