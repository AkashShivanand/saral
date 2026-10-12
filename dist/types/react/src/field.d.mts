/**
 * Markup only, so it renders on the server with no client JavaScript. Put it
 * inside <Form> to get inline errors; on its own the browser validates it.
 * @param {FieldProps} props
 */
export function Field({ label, hint, messages, multiline, id, ...input }: FieldProps): import("react").ReactElement<{
    'data-scope': string;
    'data-part': string;
}, string | import("react").JSXElementConstructor<any>>;
export type FieldMessages = import("./parts.mjs").FieldMessages;
export type FieldProps = Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "children"> & {
    label: string;
    hint?: string;
    messages?: FieldMessages;
    multiline?: boolean;
    rows?: number;
};
