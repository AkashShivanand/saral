import { createElement as h } from 'react';
import { parts } from './parts.mjs';

/**
 * @typedef {{ title: string, href?: string, headingLevel?: 2 | 3 | 4, children?: import('react').ReactNode }} CardProps
 */

const part = parts('card');

/**
 * With href, the title becomes the link and its click area covers the card.
 * @param {CardProps} props
 */
export function Card({ title, href, headingLevel = 3, children }) {
  const heading = h(`h${headingLevel}`, part('title'), href ? h('a', { ...part('link'), href }, title) : title);
  return h(
    'article',
    { ...part('root'), ...(href ? { 'data-interactive': '' } : {}) },
    heading,
    children !== undefined ? h('div', part('body'), children) : null,
  );
}
