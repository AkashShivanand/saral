# Saral: guide for agents

Short on purpose. Read it before changing anything.

## State

v0.1. Tokens exist; components do not. Do not import, document or invent components. A component exists only if its spec is in `specs/`.

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
- `npm run guard`: scan every file and every commit message
