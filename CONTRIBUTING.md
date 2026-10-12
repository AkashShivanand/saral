# Contributing to Saral

Saral is open source and made by one person. Contributions are welcome within the limits below, so that the system stays small and consistent.

## Welcome any time

- Bug reports, with the browser, the markup and what you expected.
- Accessibility problems. These are treated as bugs.
- Small fixes: a typo, a broken link, a failing test, a style that breaks a rule in `AGENTS.md`.

## Start with an issue

- A new component, part or token.
- A change to markup, attributes, token names or the React props.

Every component needs a spec in `specs/` before any code, and the answer may be no. Saral keeps its scope small on purpose, so open an issue first and wait for a yes before writing code.

## Before you open a pull request

1. Run `npm run setup` once, to turn on the git hooks.
2. Run `npm test` and `npm run test:browser`. Both must pass.
3. Follow `AGENTS.md`: native elements first, semantic tokens only, `data-scope` and `data-part` on every part.
4. Add a dated entry to `CHANGELOG.md`.

By sending a pull request you agree that your work is released under the MIT licence.

## The name

See `TRADEMARK.md`.
