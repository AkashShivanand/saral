# Saral: guide for agents

Short on purpose. Read it before changing anything.

## State

v0.3. Tokens and nine components exist: Field, Checkbox, Radio group, Select, Button, Link, Notice, Tag, Card. Each has a spec in `specs/`; do not use or invent any component without one.

Token roles are listed in `tokens/roles.json`. Use them as `var(--saral-<path with dashes>)`, for example `var(--saral-surface-ground)`. Change tokens only in `tokens/`, then run `npm run build`. Never edit `dist/`.

## Rules

1. Never write a private name into this repo: not in a file, a path or a commit message. The guard (`tools/guard/`) blocks it. Never bypass it with `--no-verify`, and never print the term list.
2. Components use semantic tokens only. No raw colours, sizes or durations.
3. Native elements first. Interaction states come from CSS: `:hover` inside `@media (hover: hover)`, `:active`, `:focus-visible`, `:disabled`, `:checked`, `:user-invalid`. Only two state attributes are set by code: `data-invalid` and `data-pending`.
4. Every part carries `data-scope` and `data-part`.
5. Button, Link, Card, Tag and Notice ship no client JavaScript.
6. Docs copy: plain words, sentence case, no em dashes, no hype.
7. Log every change in `CHANGELOG.md`, dated, newest first. Write a decision record in `docs/decisions/` when a decision is first used.
8. Versions follow `docs/versioning.md`.
9. Never name a site, product or company that uses Saral, in any file or commit message. Which users Saral shows is decided later, by its owner.
10. No runtime dependencies. Saral learns from other design systems and frameworks but never depends on them. React is an optional peer for the React adapter only. `tools/package.test.mjs` enforces this.

## Wrong and right

```html
<!-- wrong: a div pretending to be a button -->
<div class="btn" onclick="send()">Send</div>
<!-- right -->
<button data-scope="button" data-part="root" type="submit">Send</button>
```

```css
/* wrong: hover set by JavaScript, or sticky on touch screens */
[data-scope="button"].is-hovered { }
/* right */
@media (hover: hover) { [data-scope="button"]:hover { } }
```

## Map

- `docs/spec/`: the v1 contract
- `docs/research/`: the evidence behind it
- `docs/versioning.md`: what counts as a breaking change
- `tools/guard/`: the confidentiality guard

## Commands

- `npm run setup`: once per clone, turns on the git hooks
- `npm test`: all tests
- `npm run build`: rebuild `dist/` from `tokens/`
- `npm run serve`: serve the repo on port 4321 to look at `fixtures/`
- `npm run test:browser`: browser tests, with JavaScript on and off, and axe in every theme and mode
- `npm run typecheck`: TypeScript checks the JSDoc types in core and React
- `npm run site`: build the documentation portal into `site/dist` (open `site/dist/index.html` through `npm run serve`)
- `npm run guard`: scan every file and every commit message
