# @saral/tokens

Saral's design tokens as JavaScript, for code that needs a token's value rather than the CSS variable: charts, canvas, email templates, native bridges. Each theme maps a token path to its CSS value, in light and dark.

```sh
npm i @saral/tokens
```

```js
import mor from '@saral/tokens/mor.mjs';

mor.light['surface.ground']; // the page background in light mode
mor.dark['text.default'];
```

Themes: `mor.mjs` (default) and `kosh.mjs`. For styling a page, use `@saral/css` instead, which sets the same values as `--saral-*` custom properties.

MIT licence.
