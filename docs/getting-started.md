# Get started

Saral ships as four small packages. Install them from npm, from GitHub Packages, or load them from a CDN, then give them your brand with a few CSS variables.

The first release, 0.4.0, is planned for 15 November 2026. Until it is out, the commands below will not find the packages.

## Pick what you need

| Package | What it gives you | You need it if |
|---|---|---|
| `@saral/css` | A theme (Mor or Kosh) and the component styles | always |
| `@saral/core` | The small script that shows form errors inline and marks the submit button as pending | you use Saral forms without React |
| `@saral/react` | React 19 components that render Saral's markup; installs `@saral/core` too | you use React |
| `@saral/tokens` | Token values in JavaScript, for charts, canvas or email | you need a colour or size in code |

None of them depends on anything else. Forms work without the script: the browser validates them and the CSS shows each field's error text.

## Install from npm

```sh
npm i @saral/css @saral/core
```

Load a theme, then the components, in your CSS or your entry file:

```css
@import '@saral/css/mor.css';
@import '@saral/css/components.css';
```

Saral leaves the page itself alone. To give it the theme's background and text colour, add `body { background: var(--saral-surface-ground); color: var(--saral-text-default); }`.

To load fewer bytes, import only the components you use instead of `components.css`: `button.css`, `card.css`, `checkbox.css`, `field.css`, `link.css`, `notice.css`, `radio.css`, `select.css` and `tag.css`.

Write the markup from the component specs, then turn on inline errors:

```html
<form id="contact" method="post" action="/contact">
  <div data-scope="field" data-part="root">
    <label data-scope="field" data-part="label" for="email">Email</label>
    <input data-scope="field" data-part="input" id="email" name="email" type="email" required>
    <p data-scope="field" data-part="error" id="email-error">Enter an email address like name@example.com</p>
  </div>
  <button data-scope="button" data-part="root" data-variant="accent" type="submit">Send message</button>
</form>
```

```js
import { enhanceForm } from '@saral/core';

enhanceForm(document.getElementById('contact'));
```

With React:

```sh
npm i @saral/css @saral/react
```

```jsx
import '@saral/css/mor.css';
import '@saral/css/components.css';
import { Form, Field, Button } from '@saral/react';

export function Contact() {
  return (
    <Form method="post" action="/contact">
      <Field label="Email" name="email" type="email" required />
      <Button type="submit" variant="accent">Send message</Button>
    </Form>
  );
}
```

The components render on the server with no client JavaScript. `Form` adds inline errors once it runs in the browser.

Every package ships its own TypeScript types. They work with `moduleResolution` set to `bundler`, `node16` or `nodenext`.

## Install from GitHub Packages

The same packages are on GitHub Packages, under the scope of the GitHub account that owns the Saral repository. Below, `<owner>` stands for that account name in lowercase.

GitHub Packages asks for a token on every install, even for public packages. Create a classic personal access token with only the `read:packages` scope, and keep it out of your repo: put it in your build settings or your shell as `GITHUB_TOKEN`. In GitHub Actions, the workflow's own `GITHUB_TOKEN` works if the job has `packages: read`.

Add a `.npmrc` next to your `package.json`:

```ini
@<owner>:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install under the usual names with npm aliases, so your code is the same as with npm:

```sh
npm i @saral/css@npm:@<owner>/saral-css @saral/core@npm:@<owner>/saral-core
```

Your `package.json` then reads:

```json
{
  "dependencies": {
    "@saral/css": "npm:@<owner>/saral-css@^0.4.0",
    "@saral/core": "npm:@<owner>/saral-core@^0.4.0"
  }
}
```

Add `@saral/react@npm:@<owner>/saral-react` and `@saral/tokens@npm:@<owner>/saral-tokens` the same way. Every import in this guide works unchanged. To move to npm later, replace each `npm:@<owner>/saral-...` value with a version and delete the two lines from `.npmrc`.

Only `@<owner>` packages come from GitHub Packages. Everything else, React included, still comes from npm.

## Use from a CDN

jsDelivr and unpkg serve every npm version, with no install and no build step. Always pin the exact version, so a new release never changes your page by surprise.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@saral/css@0.4.0/dist/mor.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@saral/css@0.4.0/dist/components.css">

<script type="module">
  import { enhanceForm } from 'https://cdn.jsdelivr.net/npm/@saral/core@0.4.0/+esm';
  enhanceForm(document.getElementById('contact'));
</script>
```

unpkg works the same way, for example `https://unpkg.com/@saral/css@0.4.0/dist/mor.css`. The CDNs mirror npm only; packages on GitHub Packages are not on any CDN.

## Apply your brand

A Saral theme is a set of CSS variables, one per role: the page background, body text, the action colour and so on. Components only ever read those variables. So to give Saral your brand, keep Mor for everything you do not change and set your own values for the roles you do.

Saral puts its tokens in a CSS layer, `saral.tokens`. Any plain CSS outside a layer wins over it, so a brand file loaded after the theme needs no `!important` and no extra specificity:

```css
@import '@saral/css/mor.css';
@import '@saral/css/components.css';
@import './brand.css';
```

A `brand.css` for a warm brand with round controls:

```css
:root {
  --saral-font-family-sans: "Your Brand Sans", ui-sans-serif, system-ui, sans-serif;
  --saral-radius-box: 16px;
  --saral-radius-control: 9999px;

  /* light-dark(): the first value is for light mode, the second for dark. */
  --saral-surface-ground: light-dark(#fbf7f2, #1a1612);
  --saral-surface-raised: light-dark(#ffffff, #241e19);

  --saral-action-default: light-dark(#a3341f, #ffb59f);
  --saral-action-hover: light-dark(#86291a, #ffcdbd);
  --saral-action-pressed: light-dark(#6e2114, #ffdccf);
  --saral-text-on-action: light-dark(#ffffff, #3a0d05);

  --saral-accent-default: light-dark(#5b3fa6, #cbb8ff);
  --saral-accent-hover: light-dark(#4a3189, #ddd0ff);
  --saral-text-on-accent: light-dark(#ffffff, #21104f);
  --saral-border-focus: light-dark(#5b3fa6, #cbb8ff);
}
```

Every value above passes all of Saral's contrast pairs in both modes, with Mor's values for the roles it leaves alone.

Things to know:

- **Use `light-dark()` for colours.** Saral follows the visitor's light or dark setting. Give each colour both values, or the page will show a light colour in dark mode.
- **A light-only brand** can turn dark mode off: `:root { color-scheme: light; }`. Saral reads the colour scheme, so every role then uses its light value.
- **Check contrast.** `tokens/pairs.json` lists the pairs a theme must meet, such as body text on the page background at 4.5 to 1 and the focus ring at 3 to 1. The tokens page on the documentation site shows every pair for Mor and Kosh. Check yours with any contrast checker, in both modes, before you ship.
- **The full list of roles** is in `tokens/roles.json` and on the tokens page. Use only those names: they are the contract, and a renamed role is a breaking change in Saral's [versions](versioning.md).
- **Do not restyle components by selector.** Rules such as `[data-scope="button"] { … }` work today but depend on Saral's internal CSS, which can change in any release. Variables do not.
- **Force a mode** for part of a page with `data-saral-mode="dark"` or `"light"` on any element.

Two sites with completely different brands use the same markup and the same packages. Only their `brand.css` differs.

## When something goes wrong

- **`404` or `E404` from GitHub Packages**: the `.npmrc` scope must be the owner's name in lowercase, and the token needs `read:packages`.
- **`401` from GitHub Packages**: the token is missing in the environment that runs `npm install`, which on a hosting service is the build, not your laptop.
- **`ERR_PACKAGE_PATH_NOT_EXPORTED`**: you imported a file that is not an entry point, such as `@saral/core/src/form.mjs`. Import `@saral/core` instead.
- **Styles look unthemed**: load a theme file before `components.css`, or set every role you use in your own CSS.

Report anything else as an issue on GitHub, with the browser, the markup and what you expected.
