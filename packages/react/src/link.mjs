import { createElement } from 'react';

/**
 * @typedef {import('react').AnchorHTMLAttributes<HTMLAnchorElement> & {
 *   render?: (props: Record<string, unknown>) => import('react').ReactElement,
 * }} LinkProps
 */

/** @param {LinkProps} props */
export function Link({ render, children, ...rest }) {
  const props = { ...rest, 'data-scope': 'link', 'data-part': 'root', children };
  return render ? render(props) : createElement('a', props);
}
