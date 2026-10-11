# Saral

Saral means simple. It is a design system where the look is a theme you can swap, and every part is plain, accessible HTML.

**Status: tokens ready (v0.1).** Design tokens for two themes, Mor and ember, build to CSS, JavaScript and Tailwind. Components come next. Progress is logged in the [changelog](CHANGELOG.md).

## What using it will look like

```html
<link rel="stylesheet" href="saral/themes/mor.css">

<div data-scope="field" data-part="root">
  <label data-part="label" for="email">Email</label>
  <input data-part="input" id="email" name="email" type="email" required>
  <p data-part="error" id="email-error" hidden>Enter an email address like name@example.com</p>
</div>
```

Swap the theme file and the same markup takes another look:

- **Mor**, Saral's default: peacock teal, square corners.
- **Ember**: the theme [akashshivanand.com](https://akashshivanand.com) uses.
- **Kosh**: a made-up savings app. Dark, turmeric yellow, round corners.

Remove the theme and the field still works, unstyled.

## Using the tokens today

```html
<link rel="stylesheet" href="dist/css/mor.css">
<style>
  body { background: var(--saral-surface-ground); color: var(--saral-text-default); }
</style>
```

The theme follows the system's light or dark setting. Add `data-saral-mode="dark"` or `"light"` to any element to force that mode for everything inside it. To show several themes on one page, put `data-saral-theme="mor"` or `"ember"` on any element; if you load two theme files, the last one styles the page itself. `fixtures/themes.html` shows both themes in both modes (`npm run serve`, then open `/fixtures/themes.html`).

## How it is built

- Design tokens in the W3C design token format, compiled to CSS, JavaScript and Tailwind, and later to Figma, Swift and Compose.
- Components on native HTML elements. Hover, focus and pressed states come from CSS, so simple components ship no JavaScript.
- Behaviour HTML does not give, like when a field shows its error, lives in a small TypeScript core with no styles.
- Every rule a machine can check is checked in CI.

## Read more

- [Spec](docs/spec/2026-10-11-saral-v1-design.md)
- [Research](docs/research/headless-design-system-benchmark.md)
- [Versions](docs/versioning.md)
- [Guide for AI agents](AGENTS.md)

## Support

Saral is made by Akash Kumar, alone, in his spare time. Issues are welcome and read, with no promised response time. Until 1.0, versions are 0.x and may break between releases.

## Licence

[MIT](LICENSE)
