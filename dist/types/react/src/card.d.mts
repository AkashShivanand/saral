/**
 * With href, the title becomes the link and its click area covers the card.
 * @param {CardProps} props
 */
export function Card({ title, href, headingLevel, children }: CardProps): import("react").ReactElement<{
    'data-interactive'?: string | undefined;
    'data-scope': string;
    'data-part': string;
}, string | import("react").JSXElementConstructor<any>>;
export type CardProps = {
    title: string;
    href?: string;
    headingLevel?: 2 | 3 | 4;
    children?: import("react").ReactNode;
};
