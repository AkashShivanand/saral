/**
 * A placeholder option has an empty value, so a required select stays
 * invalid until a real choice is made.
 * @param {SelectProps} props
 */
export function Select({ label, options, placeholder, hint, messages, id, ...select }: SelectProps): import("react").ReactElement<{
    'data-scope': string;
    'data-part': string;
}, string | import("react").JSXElementConstructor<any>>;
export type SelectProps = Omit<import("react").SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
    label: string;
    options: Array<{
        value: string;
        label: string;
    }>;
    placeholder?: string;
    hint?: string;
    messages?: import("./parts.mjs").FieldMessages;
};
