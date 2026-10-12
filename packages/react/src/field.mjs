import { createElement as h, useId } from 'react';

/**
 * @typedef {{ valueMissing?: string, typeMismatch?: string, tooLong?: string, tooShort?: string, patternMismatch?: string }} FieldMessages
 * @typedef {Omit<import('react').InputHTMLAttributes<HTMLInputElement>, 'children'> & {
 *   label: string,
 *   hint?: string,
 *   messages?: FieldMessages,
 *   multiline?: boolean,
 *   rows?: number,
 * }} FieldProps
 */

/** @type {Record<keyof FieldMessages, string>} */
const DATA = {
  valueMissing: 'data-message-value-missing',
  typeMismatch: 'data-message-type-mismatch',
  tooLong: 'data-message-too-long',
  tooShort: 'data-message-too-short',
  patternMismatch: 'data-message-pattern-mismatch',
};

/** @param {string} name */
const part = (name) => ({ 'data-scope': 'field', 'data-part': name });

/**
 * Markup only, so it renders on the server with no client JavaScript. Put it
 * inside <Form> to get inline errors; on its own the browser validates it.
 * @param {FieldProps} props
 */
export function Field({ label, hint, messages = {}, multiline = false, id, ...input }) {
  const auto = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const inputId = id ?? `saral-${auto}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const data = Object.fromEntries(
    Object.entries(messages).map(([k, v]) => [DATA[/** @type {keyof FieldMessages} */ (k)], v]),
  );
  return h(
    'div',
    part('root'),
    h('label', { ...part('label'), htmlFor: inputId }, label),
    h(multiline ? 'textarea' : 'input', { ...input, ...part('input'), id: inputId, 'aria-describedby': hintId }),
    hint ? h('p', { ...part('hint'), id: hintId }, hint) : null,
    h('p', { ...part('error'), id: `${inputId}-error`, ...data }, messages.typeMismatch ?? messages.valueMissing ?? ''),
  );
}
