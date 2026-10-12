/** @typedef {{ destroy(): void, reset(): void }} FormHandle */
/**
 * @param {HTMLFormElement} form
 * @returns {FormHandle}
 */
export function enhanceForm(form: HTMLFormElement): FormHandle;
export type FormHandle = {
    destroy(): void;
    reset(): void;
};
