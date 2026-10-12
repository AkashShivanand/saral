import { createElement as h, useId } from 'react';
import { parts, messageData, defaultMessage, safeId } from './parts.mjs';

/**
 * @typedef {{
 *   legend: string, name: string, options: Array<{ value: string, label: string }>,
 *   hint?: string, messages?: import('./parts.mjs').FieldMessages, required?: boolean, defaultValue?: string,
 * }} RadioGroupProps
 */

const part = parts('radio');

/**
 * The first radio carries `required`, which makes the whole group required.
 * @param {RadioGroupProps} props
 */
export function RadioGroup({ legend, name, options, hint, messages = {}, required = false, defaultValue }) {
  const base = safeId(useId());
  const hintId = hint ? `${base}-hint` : undefined;
  return h(
    'fieldset',
    part('root'),
    h('legend', part('label'), legend),
    ...options.map((o, i) =>
      h(
        'div',
        { ...part('item'), key: o.value },
        h('input', {
          ...part('input'),
          type: 'radio',
          id: `${base}-${i}`,
          name,
          value: o.value,
          defaultChecked: o.value === defaultValue ? true : undefined,
          required: required && i === 0 ? true : undefined,
          'aria-describedby': hintId,
        }),
        h('label', { ...part('item-label'), htmlFor: `${base}-${i}` }, o.label),
      ),
    ),
    hint ? h('p', { ...part('hint'), id: hintId }, hint) : null,
    h('p', { ...part('error'), id: `${base}-error`, ...messageData(messages) }, defaultMessage(messages)),
  );
}
