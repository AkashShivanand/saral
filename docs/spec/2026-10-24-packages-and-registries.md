# Packages and registries

Status: set up 2026-10-24, nothing published yet. Builds the package half of Phase 1 and milestone M1 in the [master plan](2026-10-12-saral-master-plan.md). The registry choice is [decision 0006](../decisions/0006-package-registries.md).

## Goal

Two real websites install Saral as a dependency instead of keeping a copy. They are called consumer A and consumer B here, and nowhere is either named. They have different stacks and completely different brands, so they test theming as well as installing. Consumer A installs from npm and consumer B from GitHub Packages, so each registry has a real user.

## Packages

All four live in `packages/*` as npm workspaces and share one version.

| Package | Contains | Entry points | Depends on |
|---|---|---|---|
| `@saral/tokens` | Each theme's token values as JavaScript, light and dark | `@saral/tokens/mor.mjs`, `@saral/tokens/kosh.mjs` | nothing |
| `@saral/css` | Theme CSS and component CSS | `@saral/css/mor.css`, `kosh.css`, `components.css`, and one file per component | nothing |
| `@saral/core` | The framework-free script for inline errors and pending buttons, with types | `@saral/core` | nothing |
| `@saral/react` | React components, with types | `@saral/react` | `@saral/core` (same version), peer `react >=19` |

The repo keeps one copy of everything. Built files stay in `dist/`, sources in `packages/*/src`, and `packages/*` hold only each package's `package.json` and `README.md`. `tools/release/stage.mjs` copies the files into a folder per package when it is time to pack or publish. Nothing a package needs lives only in that folder.

Each package lists its files in `exports`, so a site can only import the entry points above. `files` keeps tests, fixtures and the token compiler out of the tarballs. React imports core by its package name, `@saral/core`.

The token compiler (`packages/tokens/src`) stays in the repo. It becomes public with the `saral` command-line tool, later in the plan.

## Registries

| Registry | Names | Who installs from it | Sign-in to install | Provenance |
|---|---|---|---|---|
| npmjs.com | `@saral/tokens`, `@saral/css`, `@saral/core`, `@saral/react` | everyone; consumer A | none | yes, through trusted publishing |
| GitHub Packages (`npm.pkg.github.com`) | `@<owner>/saral-tokens`, `-css`, `-core`, `-react` | consumer B | a GitHub token with `read:packages`, even for public packages | no, GitHub Packages does not support it |
| jsDelivr and unpkg | the npm names | pages with no build step | none | served from npm |

`<owner>` is the GitHub account that owns the Saral repository, in lowercase. GitHub Packages only accepts names under the owner's scope, so the names differ. A site that installs from GitHub Packages uses npm aliases, so its code still imports `@saral/css` and the rest, and switching registry never touches its code. The renamed `@saral/react` depends on the renamed core through the same kind of alias.

CDNs mirror npm only. GitHub Packages is not on any CDN.

## Versioning

- One version for every package, set by [changesets](../../.changeset/README.md) with all four in one `fixed` group. The private root package mirrors it, because the portal shows it.
- Before 1.0, any release may break things ([versions](../versioning.md)). A break is a `minor` bump and is written in `CHANGELOG.md`; fixes are `patch`. Nothing is `major` before 1.0.
- A pre-release, such as `0.4.0-rc.1`, goes out under the `next` tag, so `npm i @saral/css` never picks it.
- React pins core to the exact same version, so a site always gets a matching pair.
- The first published version is 0.4.0 (M1). The changeset for it is in `.changeset/first-npm-packages.md`.

## How a release happens

1. Every pull request that changes a package adds a changeset (`npx changeset`) and a dated `CHANGELOG.md` entry, as before.
2. The owner runs `npm run version-packages` on main. It turns the changesets into the new version, writes each package's release notes, and updates the root version and the lockfile.
3. The owner checks the diff, adds the release to `CHANGELOG.md`, commits, and pushes.
4. The owner tags that commit `v<version>` (for example `v0.4.0`) and pushes the tag.
5. `.github/workflows/release.yml` runs:
   - **verify**: the tag must match the package version and be on main; then every CI check, the consumer check and the registry rehearsal;
   - **npm**: stages the packages, adds the repository field, and publishes with provenance through trusted publishing;
   - **github-packages**: stages the packages under the owner's scope and publishes with the workflow's own token;
   - **cdn**: waits until jsDelivr and unpkg serve the new files.
6. Both publish jobs use the `release` environment, so the owner can require an approval before anything goes out.
7. A version already on a registry is skipped, so a failed job can be re-run without touching what already went out.

Nothing is published from a laptop. The npm manifests set `provenance: true`, which only works inside GitHub Actions, so a local `npm publish` fails.

## How a site installs

The full guide, with theming, is [getting started](../getting-started.md).

From npm:

```sh
npm i @saral/css @saral/core @saral/react
```

From GitHub Packages, the site's `.npmrc`:

```ini
@<owner>:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:

```sh
npm i @saral/css@npm:@<owner>/saral-css @saral/core@npm:@<owner>/saral-core @saral/react@npm:@<owner>/saral-react
```

From a CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@saral/css@0.4.0/dist/mor.css">
```

## Checks before anything is published

| Check | What it proves | Runs |
|---|---|---|
| `tools/package.test.mjs` | No runtime dependencies except Saral's own; only React has a peer; every package and the root share one version | `npm test`, every push |
| `tools/release/stage.test.mjs` | Staging works for both registries: names, the core alias, every exported file present, provenance on npm | `npm test`, every push |
| `npm run check:packages` | Packs every package with `npm pack`, checks what is in each tarball, installs the tarballs into a clean project under both naming schemes, then uses every entry point from Node and from strict TypeScript (bundler and NodeNext resolution). It also fails if the install pulls in anything but Saral and React | every push, and before every release |
| `npm run check:registry` | Starts a throwaway local registry (Verdaccio), runs the real publish script against it twice (npm names, then GitHub Packages names), runs it again to prove it skips what is there, then installs the way consumer A and consumer B do and repeats the checks above | every push, and before every release |
| `tools/release/cdn.mjs` | jsDelivr and unpkg serve the published files, including the ES module build of core | after the npm publish |

## What the owner does once

These need the owner's accounts, so this session did not do them. Nothing is published until the owner pushes a tag.

1. **npm scope.** The `@saral` scope already exists on npmjs.com with no public packages (checked 2026-10-24). Confirm it is yours: it should be the npm organisation the master plan asked for in Phase 0. If it is not, pick another scope and tell Claude; free on 2026-10-24 were `@saral-ds`, `@saralui` and `@saral-design`. The rename touches the four `packages/*/package.json` files, the docs and the checks.
2. **First npm publish.** npm sets up a trusted publisher in a package's settings, so the package has to exist first. For 0.4.0 only:
   - create a granular access token on npmjs.com with read and write access to the `@saral` scope, expiring in 7 days;
   - add it to the repository as the Actions secret `NPM_TOKEN`;
   - after 0.4.0 is out, delete the secret and revoke the token.
   The release still has provenance, because provenance comes from the workflow's identity, not from the token.
3. **Trusted publishing.** On npmjs.com, for each of the four packages, open Settings, then Trusted publisher, choose GitHub Actions, and enter the repository owner, the repository `saral`, the workflow file `release.yml` and the environment `release`. Then, under Publishing access, choose to require two-factor authentication and disallow tokens.
4. **The `release` environment.** In the repository settings, create the environment `release`. Add yourself as a required reviewer and limit it to tags matching `v*`.
5. **GitHub Packages.** In the repository settings, under Actions, General, Workflow permissions, keep "Read repository contents and packages permissions"; the workflow asks for `packages: write` itself. After the first release, open each of the four packages on GitHub, set its visibility to public, and check it is linked to the repository.
6. **Consumer B's token.** Consumer B needs a token with `read:packages` in its build settings, as `GITHUB_TOKEN` or under the name its `.npmrc` uses. When this was written, GitHub's npm registry took only classic personal access tokens, so use a classic token with only `read:packages`, and check GitHub's docs in case fine-grained tokens work by then.
7. **Release 0.4.0.** When the S2 work is in, run the steps in "How a release happens". Claude does not tag or publish without the owner's word.

## Not in this plan

- The S2 work for M1: the JSON Schema for specs, `llms.txt`, Firefox and WebKit, and the Vite and plain-HTML smoke tests.
- `@saral/elements`, the `saral` command-line tool, and any other registry. Those follow decision 0005: built when a user asks.
