/** @param {CheckboxProps} props */
export function Checkbox({ label, hint, messages, id, ...input }: CheckboxProps): import("react").ReactElement<{
    'data-scope': string;
    'data-part': string;
}, string | import("react").JSXElementConstructor<any>>;
export type CheckboxProps = Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "children" | "type"> & {
    label: string;
    hint?: string;
    messages?: import("./parts.mjs").FieldMessages;
};
