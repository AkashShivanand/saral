/**
 * @param {HTMLElement} root the element with data-scope="field" data-part="root"
 * @returns {FieldHandle}
 */
export function enhanceField(root: HTMLElement): FieldHandle;
export type FieldHandle = {
    validate(): boolean;
    destroy(): void;
};
