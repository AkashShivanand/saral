/**
 * @typedef {'primary' | 'accent' | 'secondary'} ButtonVariant
 * @typedef {import('react').ButtonHTMLAttributes<HTMLButtonElement> & {
 *   variant?: ButtonVariant,
 *   pending?: boolean,
 *   render?: (props: Record<string, unknown>) => import('react').ReactElement,
 * }} ButtonProps
 */
/** @param {ButtonProps} props */
export function Button({ variant, pending, render, type, children, ...rest }: ButtonProps): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export type ButtonVariant = "primary" | "accent" | "secondary";
export type ButtonProps = import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    pending?: boolean;
    render?: (props: Record<string, unknown>) => import("react").ReactElement;
};
