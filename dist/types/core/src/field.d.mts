/**
 * @param {HTMLElement} root a field-like root (see FIELD)
 * @returns {FieldHandle}
 */
export function enhanceField(root: HTMLElement): FieldHandle;
export const FIELD: string;
export type FieldHandle = {
    validate(): boolean;
    destroy(): void;
};
