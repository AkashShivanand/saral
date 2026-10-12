# Saral master plan: from v0.3 to 1.0 on every platform

Status: adopted, 2026-10-13. Owner: Akash. This plan extends the v1 contract in `2026-10-11-saral-v1-design.md`; where they differ, this plan and decision record 0005 win.

## Context

Saral is at v0.3.1. It has 9 web components (Field, Checkbox, Radio group, Select, Button, Link, Notice, Tag, Card), a DTCG token compiler with two themes (Mor and Kosh), a framework-free core, a React adapter and a docs portal at saral-ds.netlify.app. Nothing is published to any package manager yet: the root `package.json` is `"private": true`, the repo is a single package, and token outputs are CSS and JS only.

The owner now wants Saral to be among the best design systems in the industry. It should give more than Tailwind and Material, combine the best ideas of other systems, learn from their failures, and be usable on every platform, framework and language. It also needs a premium docs site with a fresh identity and a story.

**Decisions taken in this planning round (owner's answers):**
- **Reach: contract-first.** One source is compiled everywhere. Tokens ship to every platform and registry. Web Components are the universal component layer, with thin generated adapters for React, Vue, Svelte and Angular. Native iOS, Android and Flutter components come only after web 1.0 is stable. This partly reverses the v1 spec's refused race 4 (multi-framework adapters), so it needs decision record 0005.
- **Capacity:** solo, part-time days, 15 to 20 hours a week. Sprints are 2 weeks (about 35 hours each), and Claude does most of the build.
- **Identity:** a separate research session proposes 2 or 3 identity and story directions with evidence. The owner picks one, then decides whether it reaches the default theme or only the website.
- **Open core:** kept in the repo (`docs/decisions/0004`, `TRADEMARK.md`, `CONTRIBUTING.md`) but kept off the website.

**Names are free today** (checked 2026-10-13): `saral`, `@saral/core` and `saral-ds` on npm, and `saral` on PyPI, pub.dev, crates.io, NuGet and JSR. Reserving them is human work in Sprint 0.

## Key dates (answers to "when")

| Milestone | What people can do | Date |
|---|---|---|
| M0 Plan approved, website research running | Nothing public yet | 18 Oct 2026 |
| M1 **First npm release (preview 0.4)** | `npm i @saral/css @saral/react`, plus jsDelivr and unpkg CDN for free | 29 Nov 2026 |
| M2 **Tokens on every registry (0.5)** | Use the tokens from npm, JSR, Swift Package Manager, Maven Central, pub.dev, NuGet and PyPI, plus Figma variables | 10 Jan 2027 |
| M3 **New docs site live (beta)** | New identity, story, search, and the new page template for every component | 7 Feb 2027 |
| M4 **System feature-complete: 1.0 release candidate (0.9)** | About 33 components in HTML/CSS, Web Components, React, Vue, Svelte and Angular | 4 Apr 2027 |
| M5 **Playground and theme builder live** | Try components in the browser and build a contrast-safe theme from one brand colour | 2 May 2027 |
| M6 **1.0 launch on every registry** | Stable release, Figma Community library, launch posts | 13 Jun 2027 |
| After 1.0 | Native SwiftUI, Compose and Flutter components (preview), hard widgets, MCP server, paid templates | Q3 2027 onward |

## Architecture: five layers from one source

Saral's lead over Tailwind and Material is that the contract is the product. The contract is:
- tokens (CSS custom properties and DTCG);
- parts (`data-scope` / `data-part`);
- state (native pseudo-classes plus `data-invalid` / `data-pending`);
- ARIA.

Every layer is compiled or checked against that contract. No styling engine sits under the API. Every adapter is proven to render the same markup.

```
L0 Source      tokens/*.tokens.json (DTCG + resolver)   specs/*.json (anatomy, states, keyboard, ARIA, platform mappings)
L1 Tokens      CSS · JS/TS · JSON · Swift · Compose · Android XML · Flutter · .NET · Python · Figma variables
L2 Styles      plain CSS, @layer saral.*, :where() zero specificity. Works in any backend language's HTML
L3 Behaviour   @saral/core (framework-free) → @saral/elements (light-DOM custom elements that wrap native elements)
L4 Adapters    React · Vue · Svelte · Angular, types and props generated from specs, logic stays in core
L5 Native      SwiftUI · Compose · Flutter components from the same specs (after 1.0, preview)
```

**"Any language"** is met at two levels:
- **Tokens:** a native package in each major ecosystem.
- **Styles:** Saral is HTML plus CSS, so Rails, Django, Laravel, Phoenix, Go, .NET and htmx all work through the CDN or npm. The docs show the markup next to every framework tab.

### Packages (one version for all, released together)

| Registry | Packages |
|---|---|
| npm | `@saral/tokens`, `@saral/css`, `@saral/core`, `@saral/elements`, `@saral/react`, `@saral/vue`, `@saral/svelte`, `@saral/angular`, `saral` (CLI: `npx saral init`, `add`, `theme`) |
| JSR | `@saral/tokens`, `@saral/core` |
| Swift Package Manager | `SaralTokens`, from a generated mirror repo `saral-apple` (SPM needs `Package.swift` at the repo root) |
| Maven Central | `io.github.akashshivanand:saral-tokens-compose` and `-android` (switch to `dev.saral` style when the domain is bought) |
| pub.dev | `saral_tokens` |
| NuGet | `Saral.Tokens` (.NET MAUI resource dictionary plus C# constants) |
| PyPI | `saral-tokens` (Python constants and a JSON resource) |
| CDN | jsDelivr and unpkg, automatically from npm |

### What we take from the best, and what we refuse

| From | Take | Avoid (their shortcoming) |
|---|---|---|
| Tailwind | Speed of use, great docs, one-line install, utilities layer (`saral.utilities`) | The v3→v4 config move broke copied code: Saral ships codemods and parity tests with every major |
| Material | Full token taxonomy, theme builder, multi-platform reach | Material Web never implemented its own tokens and went into maintenance mode: Saral's theming surface is wide and tested on every platform |
| Radix / Base UI | Accessible behaviour, parts API | Body-lock and `asChild` foot-guns: Saral uses native `<dialog>`, `popover` and anchor positioning |
| shadcn | Own-the-code feel | Copies get no upstream fixes: `npx saral add` copies, and `saral diff` shows upstream changes |
| GOV.UK | Trial-to-stable labels, assistive-technology testing | (kept as is) |
| Carbon | Breadth of docs | Mistakes log that decayed into a diary: every Saral incident must link to an automated guard (already a rule) |

## Phases and sprints

Sprints run Monday to Sunday, two weeks each. Every sprint ends with a tagged release, a CHANGELOG entry and a portal preview. Each phase has an exit gate. If a sprint overruns, the "cut first" items move later, and the dates hold.

### Phase 0: kickoff (12 to 18 Oct 2026)
- Write this plan into the repo as `docs/spec/2026-10-12-saral-master-plan.md`.
- Write decision record `docs/decisions/0005-contract-first-everywhere.md`.
- Add rows to the decision table in `docs/spec/2026-10-11-saral-v1-design.md`: reach, capacity, open core off the site.
- Update the State section of `AGENTS.md`.
- Keep open core off the portal: `tools/site/build.mjs` skips decision records marked `Site: no`, and 0004 gets that line.
- Start the **website research session** (brief below).
- **Human tasks:**
  - create the npm org `saral`;
  - create accounts and reserve names on PyPI, pub.dev, NuGet and Maven Central (Sonatype, `io.github.akashshivanand` namespace);
  - decide the domain.

### Phase 1: foundation, ending in the first npm release (S1 to S3, 19 Oct to 29 Nov)
- **S1:**
  - Turn the repo into an npm workspaces monorepo: `packages/{tokens,css,core,react}` each get a `package.json`. The React adapter stops reaching into core by relative path.
  - Set up changesets.
  - Keep committed `dist/` and the `check:dist` / `check:types` gates per package.
  - Fix the wrong `saral/themes/mor.css` path in the README.
- **S2:**
  - Add JSON Schema for `specs/*.json` (spec v2 adds `platforms.ios` / `android` accessibility mappings).
  - Turn the token compiler into output plugins: `packages/tokens/src/outputs.mjs` becomes `outputs/{css,js,json,...}.mjs`. Values gain neutral forms (fluid becomes min/max/preferred, and `light-dark()` becomes two values) before platform formatting.
  - Run Playwright on Firefox and WebKit as well as Chromium.
- **S3:**
  - Publish workflow with npm trusted publishing (OIDC, provenance), signed tags and a release PR from changesets.
  - Install smoke tests in sample apps under `fixtures/apps/` (Vite and React, plain HTML from CDN).
  - **Release 0.4.0 to npm (M1).**
- **Exit gate:**
  - `npm i` works in a clean project;
  - provenance shows on npmjs.com;
  - all existing gates pass on all three browser engines.

### Phase 2: tokens everywhere (S4 to S6, 30 Nov 2026 to 10 Jan 2027)
- **S4:** Swift (SPM) and Compose / Android XML outputs, sample iOS and Android apps that build in CI, and a contrast re-check on native values.
- **S5** (holiday sprint, lighter): Flutter, .NET and Python outputs, plus DTCG JSON output for any other tool.
- **S6:**
  - Figma variables output and push (`FIGMA_ACCESS_TOKEN` is already set). Output only, never read back.
  - Publish jobs for JSR, SPM mirror, Maven Central, pub.dev, NuGet and PyPI from the same version.
  - Theme-generator core: one brand colour in, a full contrast-checked role set out, reusing `packages/tokens/src/color.mjs` and `checks.mjs`.
  - **Release 0.5.0 (M2).**
- **Exit gate:** each registry's dry run passes in CI (`swift build`, `./gradlew build`, `dart pub publish --dry-run`, `dotnet pack`, `python -m build` and `twine check`), and the sample apps render Mor and Kosh.

### Phase 3: universal components (S7 to S12, 11 Jan to 4 Apr 2027)
- **S7:**
  - `@saral/elements`: light-DOM custom elements that enhance native markup, wrapping `enhanceField` and `enhanceForm` from `packages/core/src`.
  - Adapter codegen from specs: prop types, part names and docs.
  - **Conformance suite** (`tests/conformance/`): every adapter renders every spec example, the normalised HTML must equal the reference fixture, and each passes axe, JS on/off and the keyboard script from `spec.keyboard`.
- **S8:**
  - Vue, Svelte and Angular adapters generated, and passing conformance for the 9 existing components.
  - Docs site v2 shell built from the chosen identity. **New docs site beta live (M3).**
- **S9:** form batch 2: Textarea, Switch, File input, Date and time (native), Fieldset, Number input.
- **S10:** overlays on native features: Dialog (`<dialog>`), Popover, Tooltip, Menu (`popover` plus anchor positioning, with a fallback), Toast.
- **S11:** navigation and disclosure: Tabs, Accordion (`<details>`), Breadcrumb, Pagination, Nav bar, Skip link.
- **S12:** display and layout: Table, Avatar, Badge, Progress and Meter (native), Skeleton, Spinner, Icon, Stack and Grid, Heading and Text. **Release 0.9.0 = 1.0 RC (M4).**
- **Rules for every new component:**
  - spec first;
  - native element first;
  - semantic tokens only;
  - a docs page in the same sprint;
  - conformance green in all adapters.
- **Cut first if late:** Number input, Skeleton, Angular (moves to 1.1).
- **Exit gate:** about 33 components, all green in conformance across HTML, Elements, React, Vue, Svelte and Angular, on three browser engines.

### Phase 4: docs site and playground (research from S0; build S8 and S13 to S14)
- **Research and identity** (parallel session, S0 to S2): the owner picks a direction by 15 Nov.
- **S8:** site shell, information architecture, search, and the new page templates. Built by Saral itself; build-time tools only, no runtime dependencies.
- **S9 to S12:** each component's page ships with the component.
- **S13:**
  - Playground: live HTML and framework tabs, share links, theme and mode switch.
  - Token explorer.
- **S14:**
  - Theme builder on the S6 generator core: export to CSS, every platform package format and Figma.
  - Figma library components generated.
  - **Playground live (M5).**

### Phase 5: hardening and 1.0 launch (S15 to S17, 3 May to 13 Jun 2027)
- **S15:**
  - Screen-reader passes (VoiceOver, NVDA, TalkBack) logged in each `spec.screenReaderLog`.
  - Size budgets per component (CSS and JS), checked in CI.
  - `llms.txt` and machine-readable specs on the site.
- **S16:**
  - Migration guide and codemods from 0.x.
  - Write `docs/versioning.md` 1.0 rules into CI (token, part or ARIA removal fails without a major changeset).
  - Security: SBOM and provenance on every registry.
- **S17:** launch week.
  - **Release 1.0.0 on every registry (M6).**
  - Figma Community file.
  - Launch posts and a Behance case study.
- **Exit gate:** the v1.0 done-criteria from the v1 spec plus everything above; no open accessibility bugs.

### After 1.0 (Q3 2027 onward, only when a real need appears)
- Native SwiftUI, Compose and Flutter components (preview).
- Hard widgets: combobox, multi-select, date picker.
- MCP server.
- `saral diff`.
- Paid templates in a separate private repo (open core, never mentioned on the site).

## Website research (its own session, started 2026-10-13)

Runs alongside the build, with its own brief.

**Goal:** research and plan a top-notch, premium, easy-to-use website and docs for Saral. Research only; no building until the owner picks a direction.

**Benchmark against:**
- Tailwind, Material 3;
- Radix and Base UI, shadcn;
- Vercel Geist, Linear, Stripe docs;
- GOV.UK, Carbon, Polaris, Primer, Atlassian, Fluent;
- Apple HIG, Mantine, Chakra, Ark and Park UI.

**For each, score:**
- first-run time to a working component;
- search;
- information architecture;
- page template;
- playground;
- theming tools;
- accessibility notes;
- performance;
- what feels premium;
- what annoys.

**Deliverables:**
1. `docs/research/2026-10-website-benchmark.md`: findings, with evidence and links.
2. Information architecture: only what should be there. No open-core or business-model content; decision and incident records move to a quiet "Project" area.
3. 2 or 3 **identity and story directions**, each with a story, colour palette (contrast-checked with Saral's own checks), typeface pairing (free fonts that cover Latin and Devanagari) and a homepage mock as an HTML page. Shown side by side for the owner to pick from.
4. Page templates: home, getting started, component page, tokens, themes, playground.
5. A short plan for the S8 build.

**Constraints:** follow `AGENTS.md`. That means:
- no private names;
- never name a site that uses Saral;
- plain sentence-case copy with no em dashes;
- semantic tokens;
- Saral builds its own site.

## Critical files

- **New:**
  - `docs/spec/2026-10-12-saral-master-plan.md`
  - `docs/decisions/0005-contract-first-everywhere.md`
  - per-package `packages/*/package.json`
  - `.changeset/`
  - `packages/tokens/src/outputs/*`
  - `packages/elements/`, `packages/{vue,svelte,angular}/`
  - `tests/conformance/`
  - `fixtures/apps/*`
  - `.github/workflows/release.yml`
- **Changed:**
  - root `package.json` (workspaces)
  - `packages/tokens/src/{build,outputs}.mjs`
  - `tools/site/build.mjs` (skip `Site: no` records; v2 shell in S8)
  - `tools/package.test.mjs` (per-package no-runtime-deps rule)
  - `.github/workflows/guard.yml`
  - `playwright.config.mjs` (three engines)
  - `AGENTS.md`, `docs/spec/2026-10-11-saral-v1-design.md`, `CHANGELOG.md`
- **Reuse:**
  - `packages/tokens/src/{color,checks,resolve}.mjs` for the theme generator and native contrast checks
  - `packages/core/src/{field,form,pending}.mjs` under the Web Components and every adapter
  - `tools/site/{build,markdown,demos}.mjs` for docs v2
  - `tools/guard/` unchanged

## Risks and how we hold them

| Risk | Hold |
|---|---|
| Solo scope (the research warned about breadth) | Contract-first codegen and a conformance suite mean adapters are generated and proven, not hand-maintained; cut-first lists; dates hold, scope moves |
| Adapters drift | One normalised-HTML equality test per example per adapter, in CI |
| Registry accounts and domain block releases | Human tasks in Sprint 0; a Maven namespace that needs no domain |
| Breaking users in 0.x | Changesets, plus codemods from S16; 0.x labels stay honest |
| Burnout | The spec's stop rule stays: two weeks idle means README says "paused" |

## Open decisions for the owner (asked when they come up, not now)

- Domain name (before S3, for Maven and site URLs).
- Tailwind v4 theme bridge: the spec says "No Tailwind output". Revisit at S12 as an optional `@saral/tailwind` that maps tokens into `@theme`.
- Whether the chosen identity replaces Mor as the default theme (after the research, 15 Nov).

## Verification

- **Every sprint:**
  - `npm test`, `npm run test:browser` (three engines from S2), `npm run typecheck`, `check:dist`, `check:types` and `npm run guard` green in CI;
  - a portal preview link;
  - a tagged release with a CHANGELOG entry.
- **M1:**
  - `npm i @saral/css @saral/react` in a clean Vite app renders the contact form;
  - the provenance badge shows on npmjs.com.
- **M2:** CI builds the sample iOS, Android, Flutter, .NET and Python consumers against the published previews; the Figma file shows the variables.
- **M4:** the conformance suite is green for every component in every adapter.
- **M5:** the playground share link round-trips; theme builder output passes `checks.mjs`.
- **M6:** a fresh install on each registry, axe clean on every docs page in every theme and mode, and screen-reader logs filled.
