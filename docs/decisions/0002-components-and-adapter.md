# 0002: Components, core and the React adapter

Status: adopted, 2026-10-12

## Decision

- A component is markup plus CSS. The markup is native elements with `data-scope` and `data-part`. The CSS uses tokens only and lives in `@layer saral.components`.
- Interaction states come from CSS. Script sets only `data-invalid` and `data-pending`.
- Core is optional. A form built with Saral posts, validates and shows invalid fields with JavaScript off. Core adds inline errors in the page's own words, focus on the first error, and a pending submit button.
- Core and the React adapter are JavaScript with JSDoc types, checked by TypeScript, with `.d.ts` files generated into `dist/types`. The code runs with no build step, so a site can install Saral from a git tag today and from npm later.
- In React, only `Form` is a client component. `Field`, `Button`, `Link` and `Notice` render on the server and ship no JavaScript.
- Errors are linked with `aria-describedby` and read when the field is focused, not announced through a live region, so each is heard once.
- Saral has no runtime dependencies. It studies other design systems and frameworks and learns from their gaps, but never depends on them. React is an optional peer, used only by the React adapter. A test fails if a runtime dependency is added.

## Why

A contact form should work on a dead script bundle, an old browser or a cheap phone. Saral's first components had to keep that true, and a system that depends on the frameworks it means to improve on has no reason to exist.
