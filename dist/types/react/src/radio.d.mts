/**
 * The first radio carries `required`, which makes the whole group required.
 * @param {RadioGroupProps} props
 */
export function RadioGroup({ legend, name, options, hint, messages, required, defaultValue }: RadioGroupProps): import("react").ReactElement<{
    'data-scope': string;
    'data-part': string;
}, string | import("react").JSXElementConstructor<any>>;
export type RadioGroupProps = {
    legend: string;
    name: string;
    options: Array<{
        value: string;
        label: string;
    }>;
    hint?: string;
    messages?: import("./parts.mjs").FieldMessages;
    required?: boolean;
    defaultValue?: string;
};
