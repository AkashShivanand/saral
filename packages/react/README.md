# @saral/react

Saral's components for React 19. They render the same plain HTML as the rest of Saral, so they work on the server with no client JavaScript, and `Form` adds inline errors once it runs in the browser.

```sh
npm i @saral/react @saral/css react react-dom
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

Components: `Form`, `Field`, `Checkbox`, `RadioGroup`, `Select`, `Button`, `Link`, `Notice`, `Tag` and `Card`. `@saral/core` is installed with it.

MIT licence.
