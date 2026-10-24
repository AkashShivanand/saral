# 0006: Package registries

Status: adopted, 2026-10-24

## Decision

- Saral publishes four packages, `@saral/tokens`, `@saral/css`, `@saral/core` and `@saral/react`, with one shared version.
- npm is the main registry. Every release goes there with provenance, through npm trusted publishing from `.github/workflows/release.yml`. No long-lived npm token is stored.
- Every release also goes to GitHub Packages, as `@<owner>/saral-*`, because GitHub Packages only accepts names under the repository owner's scope. Sites that install from there use npm aliases, so their imports stay `@saral/*`.
- jsDelivr and unpkg serve the npm packages. Saral runs no CDN of its own.
- A release is a version tag on main. The workflow runs every check first, including a consumer check from packed tarballs and a rehearsal against a local registry, then publishes to both registries.
- The repo keeps one copy of each file. A staging script assembles each package for each registry at release time, instead of keeping built copies in `packages/*`.

## Why

The owner asked for two registries, so that two real websites can prove the packages work wherever they are hosted. That is a user asking for a surface, which decision 0005 requires before a surface is published.

npm comes first because it is where every JavaScript tool looks, it is what the CDNs mirror, and it can show provenance: anyone can check that a version was built from this repository by this workflow. GitHub Packages adds a second, independent host with no extra account, at the cost of a token for every install and no provenance.

Changesets versions the packages, but does not publish them. Publishing the same files to two registries under different names is simpler as one small script that stages, renames and publishes, and that the rehearsal can run end to end with no credentials.

## What this changes

- The repo becomes an npm workspaces monorepo, as decision 0005 planned. React imports core by package name.
- `tools/package.test.mjs` now allows one kind of runtime dependency: a Saral package on another Saral package, pinned to the same version.
- The first npm release needs a short-lived token once, because npm sets up a trusted publisher only for a package that exists. The token is deleted after that release.
- Any further registry (JSR and the others in decision 0005) still waits for a user to ask.
