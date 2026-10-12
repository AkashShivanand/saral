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

export const FIELD = ['field', 'checkbox', 'radio', 'select'].map((s) => `[data-scope="${s}"][data-part="root"]`).join(', ');

let count = 0;

/**
 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
 * @param {HTMLElement} error
 */
function messageFor(input, error) {
  for (const [state, key] of MESSAGES) {
    if (input.validity[state]) return error.dataset[key] ?? input.validationMessage;
  }
  return input.validationMessage;
}

/**
 * @param {HTMLElement} root a field-like root (see FIELD)
 * @returns {FieldHandle}
 */
export function enhanceField(root) {
  const inputs = /** @type {Array<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} */ ([
    ...root.querySelectorAll('[data-part="input"]'),
  ]);
  const input = inputs[0];
  if (!input) throw new Error('saral: a field needs a [data-part="input"]');
  let error = /** @type {HTMLElement | null} */ (root.querySelector('[data-part="error"]'));
  // A field written without an error element gets one, so it can still say
  // what is wrong.
  if (!error) {
    error = document.createElement('p');
    error.setAttribute('data-scope', root.getAttribute('data-scope') ?? 'field');
    error.setAttribute('data-part', 'error');
    root.append(error);
  }
  const message = error;
  if (!message.id) message.id = `${input.id || `saral-field-${++count}`}-error`;
  let edited = false;
  let shown = false;

  /** @param {boolean} add */
  const describe = (add) => {
    for (const el of inputs) {
      const ids = new Set((el.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
      if (add) ids.add(message.id);
      else ids.delete(message.id);
      if (ids.size) el.setAttribute('aria-describedby', [...ids].join(' '));
      else el.removeAttribute('aria-describedby');
    }
  };
  const show = () => {
    message.textContent = messageFor(input, message);
    for (const el of inputs) el.setAttribute('aria-invalid', 'true');
    root.setAttribute('data-invalid', '');
    describe(true);
    shown = true;
  };
  const hide = () => {
    for (const el of inputs) el.removeAttribute('aria-invalid');
    root.removeAttribute('data-invalid');
    describe(false);
    shown = false;
  };
  // A radio group is valid or invalid as a whole, so its first input speaks
  // for all of them.
  const validate = () => {
    if (input.validity.valid) {
      hide();
      return true;
    }
    show();
    return false;
  };
  // Ticking a box or choosing an option is a finished choice, not typing in
  // progress, so it is checked at once and screen readers hear it.
  /** @param {Event} e */
  const onChange = (e) => {
    edited = true;
    const t = /** @type {HTMLInputElement | HTMLSelectElement} */ (e.target);
    const settled = e.type === 'change' && (t.type === 'checkbox' || t.tagName === 'SELECT');
    if (shown || settled) validate();
  };
  // Check when focus leaves the whole field, so moving between the radios of
  // one group does not check it half way.
  /** @param {FocusEvent} e */
  const onFocusOut = (e) => {
    if (edited && !(e.relatedTarget instanceof Node && root.contains(e.relatedTarget))) validate();
  };
  /** @param {Event} e */
  const onInvalid = (e) => {
    e.preventDefault();
    show();
  };
  root.addEventListener('input', onChange);
  root.addEventListener('change', onChange);
  root.addEventListener('focusout', onFocusOut);
  root.addEventListener('invalid', onInvalid, true);
  return {
    validate,
    destroy() {
      root.removeEventListener('input', onChange);
      root.removeEventListener('change', onChange);
      root.removeEventListener('focusout', onFocusOut);
      root.removeEventListener('invalid', onInvalid, true);
    },
  };
}
