import { createElement as h, useId } from 'react';
import { parts, messageData, defaultMessage, safeId } from './parts.mjs';

/**
 * @typedef {Omit<import('react').SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
 *   label: string, options: Array<{ value: string, label: string }>, placeholder?: string,
 *   hint?: string, messages?: import('./parts.mjs').FieldMessages,
 * }} SelectProps
 */

const part = parts('select');

/**
 * A placeholder option has an empty value, so a required select stays
 * invalid until a real choice is made.
 * @param {SelectProps} props
 */
export function Select({ label, options, placeholder, hint, messages = {}, id, ...select }) {
  const auto = safeId(useId());
  const selectId = id ?? auto;
  const hintId = hint ? `${selectId}-hint` : undefined;
  return h(
    'div',
    part('root'),
    h('label', { ...part('label'), htmlFor: selectId }, label),
    h(
      'select',
      { ...select, ...part('input'), id: selectId, 'aria-describedby': hintId },
      placeholder !== undefined ? h('option', { value: '' }, placeholder) : null,
      ...options.map((o) => h('option', { key: o.value, value: o.value }, o.label)),
    ),
    hint ? h('p', { ...part('hint'), id: hintId }, hint) : null,
    h('p', { ...part('error'), id: `${selectId}-error`, ...messageData(messages) }, defaultMessage(messages)),
  );
}
