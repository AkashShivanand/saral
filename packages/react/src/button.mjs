import { createElement } from 'react';

/**
 * @typedef {'primary' | 'accent' | 'secondary'} ButtonVariant
 * @typedef {import('react').ButtonHTMLAttributes<HTMLButtonElement> & {
 *   variant?: ButtonVariant,
 *   pending?: boolean,
 *   render?: (props: Record<string, unknown>) => import('react').ReactElement,
 * }} ButtonProps
 */

/** @param {ButtonProps} props */
export function Button({ variant = 'primary', pending = false, render, type = 'button', children, ...rest }) {
  const props = {
    ...(render ? {} : { type }),
    'data-scope': 'button',
    'data-part': 'root',
    'data-variant': variant,
    ...(pending ? { 'data-pending': '', 'aria-disabled': 'true' } : {}),
    ...rest,
    children,
  };
  return render ? render(props) : createElement('button', props);
}
