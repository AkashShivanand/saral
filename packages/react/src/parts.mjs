// Shared pieces for the React components that follow the field contract.

/**
 * @typedef {{ valueMissing?: string, typeMismatch?: string, tooLong?: string, tooShort?: string, patternMismatch?: string }} FieldMessages
 */

/** @type {Record<keyof FieldMessages, string>} */
const DATA = {
  valueMissing: 'data-message-value-missing',
  typeMismatch: 'data-message-type-mismatch',
  tooLong: 'data-message-too-long',
  tooShort: 'data-message-too-short',
  patternMismatch: 'data-message-pattern-mismatch',
};

/**
 * @param {string} scope
 * @returns {(name: string) => { 'data-scope': string, 'data-part': string }}
 */
export const parts = (scope) => (name) => ({ 'data-scope': scope, 'data-part': name });

/** @param {FieldMessages} messages */
export const messageData = (messages) =>
  Object.fromEntries(Object.entries(messages).map(([k, v]) => [DATA[/** @type {keyof FieldMessages} */ (k)], v]));

/**
 * The error's own text is what people see with no script, so it is the most
 * useful general message.
 * @param {FieldMessages} messages
 */
export const defaultMessage = (messages) => messages.typeMismatch ?? messages.valueMissing ?? '';

/** @param {string} raw from useId() */
export const safeId = (raw) => `saral-${raw.replace(/[^A-Za-z0-9_-]/g, '')}`;
