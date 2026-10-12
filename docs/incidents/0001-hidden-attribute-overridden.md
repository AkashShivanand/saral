# 0001: Field errors hidden with the hidden attribute

Status: closed, 2026-10-12

## What happened

The first site to adopt Saral (v0.2.0) uses a CSS reset that sets `[hidden] { display: none !important; }`. Saral hid each field's error with the `hidden` attribute. With that reset in place, an error could never be shown without script, and a script that removes `hidden` would be fighting the reset. The site worked around it with its own CSS rule.

## Impact

No visible fault reached people: the site found it while adopting and wrote a workaround. Without the workaround, people using the form with script off would have seen a red border and no words.

## Cause

Saral depended on the `hidden` attribute, a global HTML feature that any stylesheet on the page can override with `!important`. The component's visibility was not under the component's own CSS.

## Fix

The error part never uses `hidden`. Its CSS hides it by default and shows it when the field is `:user-invalid` (no script) or when core sets `data-invalid` on the field (with script). With no script, the error's own text is shown, so it should be the most useful general message.

## Guards that now prevent it

- `packages/css/test/lint.test.mjs`: no component CSS may rely on `[hidden]`.
- `tests/browser/contact.spec.mjs`: "next to a CSS reset that forces [hidden] to display:none !important", with script on and off.
- `tests/browser/contact.spec.mjs`: "an invalid field shows its error inline from CSS alone".

## Follow-up

On 2026-10-12 the site that found this moved to v0.2.1 and deleted its own workaround. Its pages were unchanged, at 0.0% pixel difference in light and dark, on desktop and phone.
