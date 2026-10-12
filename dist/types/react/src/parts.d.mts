export function parts(scope: string): (name: string) => {
    "data-scope": string;
    "data-part": string;
};
export function messageData(messages: FieldMessages): {
    [k: string]: string;
};
export function defaultMessage(messages: FieldMessages): string;
export function safeId(raw: string): string;
export type FieldMessages = {
    valueMissing?: string;
    typeMismatch?: string;
    tooLong?: string;
    tooShort?: string;
    patternMismatch?: string;
};
