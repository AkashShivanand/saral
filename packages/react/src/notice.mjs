import { createElement } from 'react';

/**
 * @typedef {'info' | 'success' | 'warning' | 'danger'} NoticeTone
 * @typedef {import('react').HTMLAttributes<HTMLDivElement> & { tone?: NoticeTone, urgent?: boolean }} NoticeProps
 */

/** @param {NoticeProps} props */
export function Notice({ tone = 'info', urgent = false, children, ...rest }) {
  return createElement(
    'div',
    { role: urgent ? 'alert' : 'status', 'data-scope': 'notice', 'data-part': 'root', 'data-tone': tone, ...rest },
    children,
  );
}
