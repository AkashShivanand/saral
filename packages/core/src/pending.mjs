// A pending button keeps its label and its place in the tab order. It is
// announced as unavailable, looks unavailable, and a second press does nothing.

/**
 * @param {HTMLElement} button
 * @param {boolean} on
 */
export function setPending(button, on) {
  if (on) {
    button.setAttribute('data-pending', '');
    button.setAttribute('aria-disabled', 'true');
  } else {
    button.removeAttribute('data-pending');
    button.removeAttribute('aria-disabled');
  }
}
