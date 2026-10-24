# @saral/core

The small, framework-free script behind Saral's forms. It shows each field's error inline once the person has tried to submit or left the field, and marks the submit button as pending while the form sends. It has no styles and no dependencies. Without it, forms still work: the browser validates them and the CSS shows the error text.

```sh
npm i @saral/core @saral/css
```

```js
import { enhanceForm } from '@saral/core';

const handle = enhanceForm(document.querySelector('form'));
// later, if the form leaves the page:
handle.destroy();
```

Also exported: `enhanceField` for a single field and `setPending` for a button. The markup each one expects is in Saral's component specs: https://saral-ds.netlify.app

MIT licence.
