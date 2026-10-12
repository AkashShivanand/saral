# Saral

Saral means simple. It is a design system where the look is a theme you can swap, and every part is plain, accessible HTML.

**Status: v0.2, first components.** Tokens for Mor and Kosh, plus Field, Button, Link and Notice: plain HTML and CSS that work with JavaScript off, a small optional script for inline errors, and React components. No runtime dependencies. Progress is logged in the [changelog](CHANGELOG.md).

## What using it will look like

```html
<link rel="stylesheet" href="saral/themes/mor.css">

<div data-scope="field" data-part="root">
  <label data-part="label" for="email">Email</label>
  <input data-part="input" id="email" name="email" type="email" required>
  <p data-part="error" id="email-error">Enter an email address like name@example.com</p>
</div>
```

Swap the theme file and the same markup takes another look:

- **Mor**, Saral's default: peacock teal, square corners.
- **Kosh**: a made-up savings app. Dark, turmeric yellow, round corners.

Remove the theme and the field still works, unstyled.

## Using the tokens today

```html
<link rel="stylesheet" href="dist/css/mor.css">
<style>
  body { background: var(--saral-surface-ground); color: var(--saral-text-default); }
</style>
```

The theme follows the system's light or dark setting. Add `data-saral-mode="dark"` or `"light"` to any element to force that mode for everything inside it. To show several themes on one page, put `data-saral-theme="mor"` or `"kosh"` on any element; if you load two theme files, the last one styles the page itself. `fixtures/themes.html` shows both themes in both modes (`npm run serve`, then open `/fixtures/themes.html`).

## Using the components

```html
<link rel="stylesheet" href="dist/css/mor.css">
<link rel="stylesheet" href="dist/css/components.css">

<form id="contact" method="post" action="/contact">
  <div data-scope="field" data-part="root">
    <label data-scope="field" data-part="label" for="email">Email</label>
    <input data-scope="field" data-part="input" id="email" name="email" type="email" required>
    <p data-scope="field" data-part="error" id="email-error" data-message-value-missing="Enter your email address" data-message-type-mismatch="Enter an email address like name@example.com">Enter an email address like name@example.com</p>
  </div>
  <button data-scope="button" data-part="root" data-variant="accent" type="submit">Send message</button>
</form>

<script type="importmap">
  { "imports": { "saral/core": "/node_modules/saral/packages/core/src/index.mjs" } }
</script>
<script type="module">
  import { enhanceForm } from 'saral/core';
  enhanceForm(document.getElementById('contact'));
</script>
```

With a bundler, drop the import map and import from `saral/core` directly. The script is optional. Without it, the browser validates the form and the CSS shows the error's own text under any invalid field, so write that text as the most useful general message. The error part never uses the `hidden` attribute, because CSS resets can force `[hidden]` off. In React: `import { Form, Field, Button, Link, Notice } from 'saral/react'`. See `fixtures/contact.html` and the specs in `specs/`.

To give Saral your own look, set its variables to your brand's values, for example `:root { --saral-accent-default: #0055ff; }`. The full list of roles is in `tokens/roles.json`, and the contrast pairs a theme should meet are in `tokens/pairs.json`.

## How it is built

- Design tokens in the W3C design token format, compiled to CSS and JavaScript, and later to Figma, Swift and Compose.
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
