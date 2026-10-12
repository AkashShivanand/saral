// Field behaviour HTML does not give: when the error shows, what it says, and
// wiring it to the input for screen readers. Without this script the field
// still works: the browser validates on submit and :user-invalid marks the
// border. Timing: check when the person leaves a field they typed in; once
// an error shows, re-check as they type; never interrupt mid-typing.

/** @typedef {{ validate(): boolean, destroy(): void }} FieldHandle */

/** @type {ReadonlyArray<[keyof ValidityState, string]>} */
const MESSAGES = [
  ['valueMissing', 'messageValueMissing'],
  ['typeMismatch', 'messageTypeMismatch'],
  ['patternMismatch', 'messagePatternMismatch'],
  ['tooLong', 'messageTooLong'],
  ['tooShort', 'messageTooShort'],
];

let count = 0;

/**
 * @param {HTMLInputElement | HTMLTextAreaElement} input
 * @param {HTMLElement} error
 */
function messageFor(input, error) {
  for (const [state, key] of MESSAGES) {
    if (input.validity[state]) return error.dataset[key] ?? input.validationMessage;
  }
  return input.validationMessage;
}

/**
 * @param {HTMLElement} root the element with data-scope="field" data-part="root"
 * @returns {FieldHandle}
 */
export function enhanceField(root) {
  const input = /** @type {HTMLInputElement | HTMLTextAreaElement | null} */ (root.querySelector('[data-part="input"]'));
  if (!input) throw new Error('saral: a field needs a [data-part="input"]');
  let error = /** @type {HTMLElement | null} */ (root.querySelector('[data-part="error"]'));
  // A field written without an error element gets one, so it can still say
  // what is wrong.
  if (!error) {
    error = document.createElement('p');
    error.setAttribute('data-scope', 'field');
    error.setAttribute('data-part', 'error');
    root.append(error);
  }
  const message = error;
  if (!message.id) message.id = `${input.id || `saral-field-${++count}`}-error`;
  let edited = false;
  let shown = false;

  /** @param {boolean} add */
  const describe = (add) => {
    const ids = new Set((input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
    if (add) ids.add(message.id);
    else ids.delete(message.id);
    if (ids.size) input.setAttribute('aria-describedby', [...ids].join(' '));
    else input.removeAttribute('aria-describedby');
  };
  const show = () => {
    message.textContent = messageFor(input, message);
    input.setAttribute('aria-invalid', 'true');
    root.setAttribute('data-invalid', '');
    describe(true);
    shown = true;
  };
  const hide = () => {
    input.removeAttribute('aria-invalid');
    root.removeAttribute('data-invalid');
    describe(false);
    shown = false;
  };
  const validate = () => {
    if (input.validity.valid) {
      hide();
      return true;
    }
    show();
    return false;
  };
  const onInput = () => {
    edited = true;
    if (shown) validate();
  };
  const onBlur = () => {
    if (edited) validate();
  };
  /** @param {Event} e */
  const onInvalid = (e) => {
    e.preventDefault();
    show();
  };
  input.addEventListener('input', onInput);
  input.addEventListener('blur', onBlur);
  input.addEventListener('invalid', onInvalid);
  return {
    validate,
    destroy() {
      input.removeEventListener('input', onInput);
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('invalid', onInvalid);
    },
  };
}
