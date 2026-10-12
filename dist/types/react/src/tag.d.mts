/**
 * Renders on the server. With onRemove it adds a remove button; the page that
 * passes onRemove decides what removing does.
 * @param {TagProps} props
 */
export function Tag({ children, onRemove, removeLabel }: TagProps): import("react").ReactElement<{
    'data-scope': string;
    'data-part': string;
}, string | import("react").JSXElementConstructor<any>>;
export type TagProps = {
    children: string;
    onRemove?: () => void;
    removeLabel?: string;
};
