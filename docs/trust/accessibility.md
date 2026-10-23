# Accessibility statement

Draft, 23 October 2026. This statement covers Saral 0.3. It will be checked and published on the docs site before 1.0.

## The standard

Saral aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. Saral is a set of parts, not a finished service, so it can help a service meet the standard but cannot make it meet it alone. A service built with Saral still needs its own testing.

## What Saral does

- Uses native HTML elements first: real buttons, links, labels, inputs, selects and checkboxes, so keyboard use, focus and screen-reader names come from the browser.
- Works with JavaScript off. Forms show their errors and can be sent without scripts.
- Ties every error message to its field, and moves focus to the first field with an error when a form is sent.
- Shows a visible focus ring on every control.
- Makes every target at least 24 by 24 CSS pixels.
- Follows the reader's text size setting.
- Keeps working in Windows High Contrast and other forced-colour modes.
- Turns off motion when the reader asks for less motion.
- Works right to left, and in Devanagari, Tamil, Arabic, Thai and Japanese text.

## How it is tested

On every change, before it can be merged:

- every pair of text and background colours in every theme, light and dark, is checked against the WCAG 2 AA contrast ratio;
- axe checks the example pages for WCAG 2.2 A and AA problems, in every theme and mode, with errors showing;
- browser tests run every form with JavaScript on and with JavaScript off;
- each component is checked against its spec in `specs/`, which lists its parts, states, keyboard keys and ARIA.

## Known gaps

- **No testing with disabled people yet.** Screen-reader users will test the form patterns before 1.0.
- **No manual screen-reader pass yet.** VoiceOver on macOS and iOS, and NVDA, are planned before a component leaves preview.
- **One browser engine in tests.** Tests run in Chromium. Firefox and WebKit are added before the 1.0 release candidate.
- **Zoom.** Sizes follow the reader's text setting, but a full check at 200 and 400 percent zoom is not automated yet.
- **Contrast method.** Contrast is checked with the WCAG 2 ratio only. APCA is not computed yet.

## Tell us about a problem

If something in Saral is hard or impossible to use, [open an issue](https://github.com/AkashShivanand/saral/issues) and say what you tried, what happened, and which browser and assistive technology you use.
