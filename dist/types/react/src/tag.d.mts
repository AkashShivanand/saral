/**
 * Renders on the server. To make it removable, give removeHref (a link, which
 * works with no script) or onRemove (a button; a function prop needs a client
 * component parent in React Server Components).
 * @param {TagProps} props
 */
export function Tag({ children, removeHref, onRemove, removeLabel }: TagProps): import("react").ReactElement<{
    'data-scope': string;
    'data-part': string;
}, string | import("react").JSXElementConstructor<any>>;
export type TagProps = {
    children: string;
    removeHref?: string;
    onRemove?: () => void;
    removeLabel?: string;
};
