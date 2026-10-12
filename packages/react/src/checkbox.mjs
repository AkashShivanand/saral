import { createElement as h, useId } from 'react';
import { parts, messageData, defaultMessage, safeId } from './parts.mjs';

/**
 * @typedef {Omit<import('react').InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> & {
 *   label: string, hint?: string, messages?: import('./parts.mjs').FieldMessages,
 * }} CheckboxProps
 */

const part = parts('checkbox');

/** @param {CheckboxProps} props */
export function Checkbox({ label, hint, messages = {}, id, ...input }) {
  const auto = safeId(useId());
  const inputId = id ?? auto;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return h(
    'div',
    part('root'),
    h('input', { ...input, type: 'checkbox', ...part('input'), id: inputId, 'aria-describedby': hintId }),
    h('label', { ...part('label'), htmlFor: inputId }, label),
    hint ? h('p', { ...part('hint'), id: hintId }, hint) : null,
    h('p', { ...part('error'), id: `${inputId}-error`, ...messageData(messages) }, defaultMessage(messages)),
  );
}
