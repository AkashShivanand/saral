/**
 * @typedef {import('react').AnchorHTMLAttributes<HTMLAnchorElement> & {
 *   render?: (props: Record<string, unknown>) => import('react').ReactElement,
 * }} LinkProps
 */
/** @param {LinkProps} props */
export function Link({ render, children, ...rest }: LinkProps): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export type LinkProps = import("react").AnchorHTMLAttributes<HTMLAnchorElement> & {
    render?: (props: Record<string, unknown>) => import("react").ReactElement;
};
