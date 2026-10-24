# Changesets

Each file here describes one change to the published packages and how much it bumps the version. All four packages share one version (`fixed` in `config.json`), so a bump to one bumps them all.

- Add one with `npx changeset`, in the same pull request as the change.
- Before 1.0, a change that breaks anything is a `minor`, per `docs/versioning.md`. Never use `major` before 1.0.
- `npm run version-packages` turns the files into a new version and package release notes. The owner runs it when cutting a release; see `docs/spec/2026-10-24-packages-and-registries.md`.

The project log stays in `CHANGELOG.md`, written by hand.
