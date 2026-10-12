import { createElement as h, useId } from 'react';
import { parts, messageData, defaultMessage, safeId } from './parts.mjs';

/**
 * @typedef {import('./parts.mjs').FieldMessages} FieldMessages
 * @typedef {Omit<import('react').InputHTMLAttributes<HTMLInputElement>, 'children'> & {
 *   label: string,
 *   hint?: string,
 *   messages?: FieldMessages,
 *   multiline?: boolean,
 *   rows?: number,
 * }} FieldProps
 */

const part = parts('field');

/**
 * Markup only, so it renders on the server with no client JavaScript. Put it
 * inside <Form> to get inline errors; on its own the browser validates it.
 * @param {FieldProps} props
 */
export function Field({ label, hint, messages = {}, multiline = false, id, ...input }) {
  const auto = safeId(useId());
  const inputId = id ?? auto;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return h(
    'div',
    part('root'),
    h('label', { ...part('label'), htmlFor: inputId }, label),
    h(multiline ? 'textarea' : 'input', { ...input, ...part('input'), id: inputId, 'aria-describedby': hintId }),
    hint ? h('p', { ...part('hint'), id: hintId }, hint) : null,
    h('p', { ...part('error'), id: `${inputId}-error`, ...messageData(messages) }, defaultMessage(messages)),
  );
}
