import { createElement as h } from 'react';
import { parts } from './parts.mjs';

/**
 * @typedef {{ children: string, onRemove?: () => void, removeLabel?: string }} TagProps
 */

const part = parts('tag');

/**
 * Renders on the server. With onRemove it adds a remove button; the page that
 * passes onRemove decides what removing does.
 * @param {TagProps} props
 */
export function Tag({ children, onRemove, removeLabel }) {
  return h(
    'span',
    part('root'),
    h('span', part('label'), children),
    onRemove ? h('button', { ...part('remove'), type: 'button', 'aria-label': removeLabel ?? `Remove ${children}`, onClick: onRemove }, '×') : null,
  );
}
