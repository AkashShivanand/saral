# Versions

## Before 1.0

Saral stays on 0.x until the component kit is complete. In 0.x, any release may break things. Every break is written in the changelog.

## From 1.0

| Change | Version bump |
|---|---|
| Add a token, part, prop, component or attribute | minor |
| Change a token value as a declared design change | minor |
| Fix a wrong token value | patch |
| Rename or remove a token, `data-scope`, `data-part` or state attribute | major |
| Change an ARIA role, or add or remove a landmark | major |
| Deprecate anything | minor, with `@deprecated` and a lint rule |
| Remove anything deprecated | major |

## Stability labels

- **preview**: outside the promise above. Everything new starts here.
- **stable**: covered by the table.
- **deprecated**: still works, flagged by lint, removed only in a major.

In v1, the Figma, Swift and Compose outputs and the Kosh theme stay preview.
