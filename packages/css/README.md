# @saral/css

Saral's themes and component styles, as plain CSS. Every component is a native HTML element with `data-scope` and `data-part` attributes, and every colour, size and duration comes from a `--saral-*` custom property, so a theme is a set of values you can swap.

```sh
npm i @saral/css
```

```css
@import '@saral/css/mor.css';        /* a theme: Mor (default) or Kosh */
@import '@saral/css/components.css'; /* every component */
```

Or load only the components you use: `button.css`, `card.css`, `checkbox.css`, `field.css`, `link.css`, `notice.css`, `radio.css`, `select.css` and `tag.css`. Each needs only a theme's tokens.

From a CDN, with no install:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@saral/css@0.4.0/dist/mor.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@saral/css@0.4.0/dist/components.css">
```

To give Saral your own look, set its variables to your brand's values on top of a theme. The getting-started guide shows how: https://saral-ds.netlify.app

MIT licence.
