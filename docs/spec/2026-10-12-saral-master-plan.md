# Saral master plan: from v0.3 to 1.0

Status: adopted 2026-10-13, revised the same day after a pressure test (five independent reviews, cross-reviewed). Owner: Akash. This plan extends the v1 contract in `2026-10-11-saral-v1-design.md`; where they differ, this plan and decision record 0005 win.

## What changed in the revision

The first version measured only what gets built. The pressure test found five problems, and this version fixes them:

1. **No demand signal.** Every milestone was a release or a count. Now each phase has a usage gate as well as a build gate.
2. **Surfaces before users.** Tokens on seven registries and three framework adapters were planned before anyone asked. Now Saral is built ready for every surface, but publishes a surface only when a user asks for it (see "Surfaces on request").
3. **More work than hours.** About 600 hours could not hold 33 components, 4 adapters, 7 registries, a site and a playground. 1.0 is now about 20 components plus form patterns.
4. **No clear who and why.** Saral now has a job: forms and services that must work for everyone.
5. **No trust for the people it serves best.** Banks and public services check who maintains a project and how. A trust pack ships before 1.0.

## Who Saral is for, and why they choose it

**Working line:** forms and services that work for everyone.

**The owner's own sentence goes here** (to write in Phase 0). It should name the person and the job, for example: "Teams building public services and financial products use Saral to ship accessible, compliant forms in any stack, even with JavaScript off."

**The job:** ship an accessible, compliant, form-heavy service quickly, in any stack, with or without JavaScript.

**Why Saral over the rest:**
- **Native first, works with JavaScript off.** Plain HTML and CSS run in any backend: Rails, Django, Laravel, Go, .NET, htmx, Phoenix.
- **Accessibility you can check.** Every component has a machine-readable spec (anatomy, states, keyboard, ARIA) and passes automated checks with JavaScript on and off. From 1.0 it is also tested by screen-reader users.
- **Made for public services and fintech.** It comes from that work: error summaries, multi-step flows, validation messages in Hindi and English, and Devanagari-ready type.
- **AI tools get it right.** `llms.txt` and the spec schema let coding assistants generate Saral markup and check it against the rules.

**The nearest alternative is Web Awesome (formerly Shoelace):** web components rendered in shadow DOM, which need JavaScript before anything shows. Saral uses light-DOM enhancement of native elements, so the page works and can be styled before any script runs.

## Key dates

| Milestone | What it means | Build gate | Usage gate | Date |
|---|---|---|---|---|
| M0 Kickoff | Plan revised, pitch written, research running | Phase 0 docs | Owner's pitch sentence written | 18 Oct 2026 |
| M1 **First npm release (0.4)** | `npm i @saral/css @saral/core @saral/react`, CDN, `llms.txt`, spec schema | Clean install works, provenance on npmjs.com | Owner uses Saral in one real piece of their own work | **15 Nov 2026** |
| M2 **First users and form patterns (0.5)** | Form patterns v1, Figma variables, theme generator core | Patterns pass axe, JS on and off, and render correctly in every script the homepage shows | **5 outside teams have tried it, 1 uses it in real work** | 10 Jan 2027 |
| M3 **New docs site (beta)** | Chosen identity, new templates, search, live contrast view | axe clean in every theme and mode | 10 issues or discussions from outside the owner | 7 Feb 2027 |
| M4 **1.0 release candidate (0.9)** | About 20 components, 8 form patterns, Web Components for all | All gates green on three browser engines | 3 teams using it in real work | 4 Apr 2027 |
| M5 **Playground and theme builder** | Try in the browser; one brand colour in, a checked theme out | Share links round-trip, theme passes `checks.mjs` | Screen-reader users have tested the form patterns | 2 May 2027 |
| M6 **1.0 launch** | Stable on npm and on every registry users asked for; trust pack public | Every 1.0 exit criterion met | 1 public service or fintech product live on Saral | 13 Jun 2027 |

**Stop or pivot rule:** if no outside team uses Saral in real work by 31 March 2027, narrow it to form patterns only, and write the case study about that. The v1 rule also stays: two weeks with no Saral work means the README says "paused".

## Architecture: built for everywhere, published on request

The architecture stays contract first. Every surface is compiled from one contract or checked against it. The contract is:
- tokens;
- parts (`data-scope` and `data-part`);
- state (native pseudo-classes plus `data-invalid` and `data-pending`);
- ARIA.

The specs and the conformance suite are the product's core asset. Surfaces come out of them when people need them.

```
L0 Source      tokens/*.tokens.json (DTCG + resolver)   specs/*.json and patterns/*.json (schema published)
L1 Tokens      CSS · JS/TS · DTCG JSON · Figma variables      [on request: Swift · Compose · Android XML · Flutter · .NET · Python]
L2 Styles      plain CSS, @layer saral.*, :where() zero specificity, works in any backend's HTML
L3 Behaviour   @saral/core (framework-free) → @saral/elements (light-DOM custom elements that enhance native markup)
L4 Adapters    React (exists)      [on request, generated from specs: Vue · Svelte · Angular]
L5 Native      [after 1.0, on request: SwiftUI · Compose · Flutter components]
```

### Surfaces on request

A surface listed here is designed for but not published until a real user asks for it in a GitHub issue that describes their project. Generated surfaces still need the conformance suite to pass.

| Surface | Ready because | Published when |
|---|---|---|
| Swift, Compose, Android XML, Flutter, .NET, Python tokens | Token compiler output plugins (S3) | One issue from a real project asks for that ecosystem |
| JSR, SPM, Maven Central, pub.dev, NuGet, PyPI | One version for all; release job template | The matching token output is requested |
| Vue, Svelte, Angular adapters | Elements work in all three today; adapter generator proven by the S7 trial | A user asks, and the trial passed |
| Native components | Specs carry iOS and Android accessibility mappings | After 1.0, with demand |
| MCP server | Specs and `llms.txt` already machine-readable | After 1.0 |

Until an adapter exists, the docs show how to use `@saral/elements` in Vue, Svelte and Angular.

### Packages at 1.0

- npm: `@saral/tokens`, `@saral/css`, `@saral/core`, `@saral/elements`, `@saral/react`, and `saral` (CLI: `npx saral init` and `add`).
- CDN: jsDelivr and unpkg, automatically from npm.
- Figma: a Community library with variables and components.
- Other registries: only those requested (see above). Maven uses `io.github.akashshivanand` until a domain exists.

### What we take from the best, and what we refuse

| From | Take | Avoid (their shortcoming) |
|---|---|---|
| Tailwind | Speed of use, great docs, one-line install | The v3 to v4 move broke copied code: Saral ships codemods and parity tests with every major |
| Material | Token taxonomy, theme builder | Material Web never implemented its own tokens and went into maintenance mode |
| GOV.UK Frontend | Form patterns, plain HTML, testing with disabled users, trial-to-stable labels | Built for one government: Saral serves any team and any stack |
| Radix / Base UI | Accessible behaviour, parts API | Body-lock and `asChild` foot-guns: Saral uses native `<dialog>` and `popover` |
| shadcn | Own-the-code feel | Copies get no upstream fixes: `npx saral add` copies and records the version |
| Web Awesome | Framework-free web components | Shadow DOM and JavaScript before render: Saral enhances native light-DOM markup |
| Carbon | Breadth of docs | A mistakes log that decayed: every Saral incident links to an automated guard |

## Phases and sprints

Sprints are two weeks, Monday to Sunday, at 15 to 20 hours a week. Every sprint ends with:
- a release;
- a short public note on what shipped and what was learned;
- one conversation with a user.

A phase ends only when both its build gate and its usage gate pass. If the usage gate fails, the next phase starts with the work that brings users, not with more surfaces.

### Weekly rhythm

| Hours | Work |
|---|---|
| About 8 | Build with Claude |
| About 4 | Review, screen-reader checks, design |
| About 3 | Real use: the owner's own work plus one outside team |
| About 1 | Public note |

### Phase 0: kickoff (12 to 18 Oct 2026)

- **Done:** master plan, decision 0005, open core off the portal, website research started.
- **Owner:**
  - write the pitch sentence above;
  - check that the employment contract has no claim on Saral;
  - create the npm org `saral`;
  - send the pitch to the website research session.

### Phase 1: first release (S1 to S2, 19 Oct to 15 Nov)

- **S1:**
  - npm workspaces monorepo: `packages/{tokens,css,core,react}` each get a `package.json`, and React imports core by package name;
  - changesets;
  - `release.yml` with npm trusted publishing (OIDC, provenance);
  - fix the wrong theme path in the README.
- **S2:**
  - JSON Schema for `specs/*.json`, published with the package;
  - `llms.txt` and per-component Markdown generated from the specs;
  - Playwright on Firefox and WebKit;
  - a clean-install smoke test (Vite with React, plain HTML from the CDN);
  - **release 0.4.0 (M1)**.
- **Owner:** start using Saral in one real piece of their own work.

### Phase 2: first users and form patterns (S3 to S6, 16 Nov 2026 to 10 Jan 2027)

- **S3:**
  - token compiler output plugins (`packages/tokens/src/outputs/*`) with neutral values (fluid becomes min, max and preferred; `light-dark()` becomes two values), plus DTCG JSON output. These make every later platform cheap.
  - **Owner:** contact 5 teams in their network and offer help to try Saral.
- **S4:**
  - a pattern spec format (`patterns/*.json`);
  - patterns: error summary, check your answers, multi-step with progress.
- **S5** (holiday, lighter):
  - Figma variables output (output only, never read back);
  - theme generator core, reusing `packages/tokens/src/color.mjs` and `checks.mjs`.
- **S6:**
  - patterns: validation messages in Hindi and English, address, phone and email, ID number input, confirmation page;
  - script-rendering test matrix: every pattern is rendered and checked in each script the homepage shows (six), for clipping, line height and wrapping;
  - fixes from user feedback;
  - **release 0.5.0 (M2)**.
- **Usage gate:** 5 outside teams tried it and 1 uses it in real work. If not met, S7 starts with outreach and fixes from feedback.

### Phase 3: universal components (S7 to S12, 11 Jan to 4 Apr 2027)

- **S7:**
  - `@saral/elements` for the 9 existing components;
  - **adapter trial:** generate a Vue adapter for Field, Button and Select, and test normalised-HTML equality in the conformance suite (`tests/conformance/`). Go or no-go goes into a decision record. If no-go, adapters stay as thin hand-checked wrappers over Elements, and only on request.
- **S8:**
  - docs site v2 shell with the chosen identity (**M3**);
  - live contrast view on the site: pick colours and see every pair checked, reusing `packages/tokens/src/color.mjs` and `checks.mjs` (the full theme builder stays at M5);
  - a docs page on using Elements in Vue, Svelte and Angular.
- **S9:** Textarea, Switch, File input, Fieldset, Date input (native).
- **S10:** Dialog (native `<dialog>`), Toast, Accordion (`<details>`).
- **S11:**
  - Breadcrumb, Pagination, Skip link, Progress (native);
  - draft the trust pack.
- **S12:**
  - Table;
  - hardening;
  - **release 0.9.0, the 1.0 candidate (M4)**.
- **The 1.0 set, 22 components:** the 9 existing ones plus those above. Popover, Tooltip, Menu and Tabs come after 1.0, because Menu is a hard widget and the others need the anchor-positioning fallback.
- **Cut first if late:** Table, Pagination.
- **Rules for every component:**
  - spec first;
  - native element first;
  - semantic tokens only;
  - its docs page in the same sprint;
  - conformance green.

### Phase 4: docs site and playground (research S0 to S2; build S8, S13 and S14)

- The research session proposes identity directions built on the owner's pitch; the owner picks by 15 Nov. The site carries no open-core or business-model content.
- **Direction chosen 2026-10-14** (`docs/spec/2026-10-13-website-plan.md`):
  - lead with the claim;
  - Neel's look, without story sections;
  - the homepage hero is a real Saral form working live in six scripts, beside its JavaScript-off version.
- **S8:** site shell, information architecture, search, templates and the live contrast view, built by Saral itself with build-time tools only.
- **S9 to S12:** each component and pattern page ships with its work.
- **S13:** playground with live HTML, the Elements and React tabs, share links, a theme and mode switch, and the token explorer.
- **S14:**
  - theme builder: export to CSS, DTCG JSON and Figma, plus any requested platforms;
  - Figma library components;
  - **M5**.

### Phase 5: trust and 1.0 launch (S15 to S17, 3 May to 13 Jun 2027)

- **S15:**
  - testing with screen-reader and assistive-technology users (VoiceOver, NVDA, TalkBack), logged in each `spec.screenReaderLog` (a human task; budget paid sessions);
  - size budgets in CI.
- **S16:**
  - publish the trust pack (below);
  - migration guide and codemods from 0.x;
  - 1.0 versioning rules in CI;
  - SBOM and provenance.
- **S17:** launch week.
  - **Release 1.0.0 (M6)** on npm and any requested registries.
  - Figma Community file.
  - Case study about adoption, not registry count.
  - Apply for Digital Public Good status.

### After 1.0 (Q3 2027 onward, each on request)

- Popover, Tooltip, Menu, Tabs.
- Hard widgets: combobox and date picker.
- MCP server.
- Native components.
- `saral diff`.
- Paid templates for multi-step, KYC-style and application flows, in a separate private repo and never mentioned on the site.

## Trust pack (before 1.0)

Regulated and public-service teams check these before adopting anything.

| Item | File or place |
|---|---|
| Security policy: how to report, response times | `SECURITY.md` |
| Support policy: which versions get fixes and for how long | `SUPPORT.md` |
| Accessibility statement: standards met, how tested, known gaps | docs site page |
| Continuity: what happens if the owner stops; a second maintainer sought from M4 | `GOVERNANCE.md` |
| Supply chain: provenance, SBOM, no runtime dependencies | release notes |

## Build in public

- One short note per sprint: what shipped, what was learned, one number (users, installs or issues).
- The story of one designer and AI building a system for everyone is part of the case study.
- Notes never name a site, product or company that uses Saral (AGENTS.md rule 9).

## Critical files

- **New:**
  - per-package `packages/*/package.json`
  - `.changeset/`
  - `.github/workflows/release.yml`
  - `specs/schema.json`
  - `patterns/*.json`
  - `packages/tokens/src/outputs/*`
  - `packages/elements/`
  - `tests/conformance/`
  - `SECURITY.md`, `SUPPORT.md`, `GOVERNANCE.md`
- **Changed:**
  - root `package.json` (workspaces)
  - `packages/tokens/src/{build,outputs}.mjs`
  - `tools/site/build.mjs`
  - `tools/package.test.mjs`
  - `playwright.config.mjs`
  - `.github/workflows/guard.yml`
- **Reuse:**
  - `packages/tokens/src/{color,checks,resolve}.mjs`
  - `packages/core/src/{field,form,pending}.mjs`
  - `tools/site/{build,markdown,demos}.mjs`
  - `tools/guard/`

## Risks and how we hold them

| Risk | Hold |
|---|---|
| Nobody uses it | Usage gates per phase; owner dogfoods from M1; stop or pivot rule on 31 March 2027 |
| More work than hours | About 20 components, surfaces on request, cut-first lists |
| Generated adapters cannot match markup across frameworks | Two-week trial in S7 with a written go or no-go |
| Owner becomes a full-time reviewer | Weekly rhythm caps build at about 8 hours; review time is planned, not leftover |
| Single maintainer | Trust pack; second maintainer sought from M4 |
| Accessibility claims without real users | Paid testing with screen-reader users before 1.0; claims stay "automated checks" until then |
| Registry and account friction | Only npm and Figma before users ask |

## Open decisions for the owner

- The pitch sentence (Phase 0).
- The identity direction from the research (by 15 Nov).
- Domain name (before M3).
- The adapter trial result (S7).
- Tailwind v4 theme bridge: the spec says "No Tailwind output". Revisit only if users ask.

## Verification

- **Every sprint:**
  - `npm test`, `npm run test:browser` (three engines from S2), `npm run typecheck`, `check:dist`, `check:types` and `npm run guard` green in CI;
  - a portal preview;
  - a release with a CHANGELOG entry;
  - a public note.
- **M1:** `npm i @saral/css @saral/react` in a clean Vite app renders the contact form; provenance shows on npmjs.com.
- **M2:** the usage gate is recorded with dates in the CHANGELOG (no names of teams, per rule 9).
- **M4:** the conformance suite is green for every component in Elements and React, and in any generated adapter.
- **M5:** theme builder output passes `checks.mjs`; screen-reader test notes are in the specs.
- **M6:**
  - a fresh install works;
  - every trust pack file is published;
  - every docs page is axe clean in every theme and mode.
