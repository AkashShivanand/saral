import { createElement as h } from 'react';
import { parts } from './parts.mjs';

/**
 * @typedef {{ children: string, removeHref?: string, onRemove?: () => void, removeLabel?: string }} TagProps
 */

const part = parts('tag');

/**
 * Renders on the server. To make it removable, give removeHref (a link, which
 * works with no script) or onRemove (a button; a function prop needs a client
 * component parent in React Server Components).
 * @param {TagProps} props
 */
export function Tag({ children, removeHref, onRemove, removeLabel }) {
  const label = removeLabel ?? `Remove ${children}`;
  let remove = null;
  if (removeHref) remove = h('a', { ...part('remove'), href: removeHref, 'aria-label': label }, '×');
  else if (onRemove) remove = h('button', { ...part('remove'), type: 'button', 'aria-label': label, onClick: onRemove }, '×');
  return h('span', part('root'), h('span', part('label'), children), remove);
}
