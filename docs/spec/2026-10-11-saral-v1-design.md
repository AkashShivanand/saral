# Saral v1: design spec

Status: draft v2 for review by Akash Kumar, 2026-10-11. v2 applies the nine changes from a five-advisor pressure test, which Akash accepted the same day.
Evidence base: `docs/research/headless-design-system-benchmark.md` (sourced, dated, October 2026).

Saral means "simple". This file is the contract for v1. Decisions are copied into decision records (ADRs) as each one is first used, and this spec is retired when v1.0 ships.

---

## 1. What Saral is, in one picture

Saral is a design system in which the look is a swappable theme and the parts are plain, accessible HTML.

```html
<link rel="stylesheet" href="saral/themes/mor.css">

<div data-scope="field" data-part="root">
  <label data-part="label" for="email">Email</label>
  <input data-part="input" id="email" name="email" type="email" required>
  <p data-part="error" id="email-error" hidden>Enter an email address like name@example.com</p>
</div>
```

Swap `mor.css` for another theme (`kosh.css`, or your own) and the same markup takes another brand's look. Remove the theme and it still works, unstyled.

**What "headless" means in Saral.** Two things together:

1. **Looks are themes.** Components use colour, type and space roles, never brand values. A theme fills the roles. v1 ships three, each different in colour, shape and density, not colour alone:
   - **Mor** (peacock teal), Saral's own default theme.
   - **Kosh**, a fictional client (a savings app, dark first, turmeric yellow), which shows a client's brand on the system.
2. **Behaviour is separate from looks.** Where a component needs behaviour that HTML does not already give (the field's error messages, a pending button), that behaviour lives in a small framework-free TypeScript core with no styles. Most components need no core at all, because native elements already handle keyboard, focus and screen readers.

Terms used below: **Mor** is Saral's default theme; **Kosh** is a demo client theme. **Anek** is the typeface (by Ek Type); it has a **width axis**, so one family can be set narrower for display text and wider for reading.

## 2. Purpose and success

Three jobs:

1. Be usable on a real site, proven on a first consumer site before anyone else relies on it.
2. Be a public, working design system that a designer who builds can show, including in a Behance case study for the "Design system" service.
3. Be easy to use correctly for people (designers and developers) and AI agents, and hard to use wrongly.

v1.0 is done when:

- Mor and Kosh build in light and dark with every declared contrast pair passing.
- The contact-form slice (Field, Error, Notice, Button, Link) works with JavaScript off and on, passes the test harness, and has been tried on a real site.
- The full kit has docs pages, each with a switch between Mor, Kosh and no theme.
- The Figma library is generated from the token source.
- Every rule in this spec that a machine can check is checked in CI.

Saral's own exits never depend on another repo. A consumer site adopting Saral is never a gate.

## 3. Decisions

| Decision | Made by | Date |
|---|---|---|
| Own repo, public on GitHub | Akash | 2026-10-11 |
| Tokens plus a wider kit of components | Akash | 2026-10-11 |
| Code first; the Figma library is generated from code | Akash | 2026-10-11 |
| CSS-first: token source, plain CSS, thin React adapter | Akash | 2026-10-11 |
| Platform agnostic: one neutral source; tokens to web, iOS, Android and Figma; components for the web only in v1 | Akash | 2026-10-11 |
| Headless | Akash | 2026-10-11 |
| Colours are customisable; a brand is a theme on the system. ("colours can be customised, that's why we are calling it headless, we build a system") | Akash | 2026-10-11 |
| Adopt the research's adjustments and phased plan (native elements first, native select in v1, independent state attributes, preview label for native and Figma outputs, `render` prop) | Akash | 2026-10-11 |
| Saral gets 3 to 4 evenings a week | Akash | 2026-10-11 |
| Apply the pressure test's nine changes (section 13 lists them) | Akash | 2026-10-11 |
| MIT licence | Assistant, delegated by Akash | 2026-10-11 |
| Docs hosted on Netlify until Saral has its own domain, which Akash will buy | Akash (domain); host picked by the assistant at his request | 2026-10-11 |
| Saral has its own themes only (Mor, Kosh). A site that uses Saral brings its own theme by setting Saral's variables. Saral does not name the sites that use it; which users to show is decided later | Akash | 2026-10-12 |
| No Tailwind output: Saral ships its own CSS | Akash | 2026-10-12 |
| Open core, as Tailwind does: Saral stays MIT and complete; paid templates or help, if any, sit on top, outside the repo; the name is protected by `TRADEMARK.md` ("yes tailwind is what I like alot and I want to make it that way") | Akash | 2026-10-12 |
| Reach every platform contract first: tokens to every registry, Web Components as the universal layer, generated adapters for React, Vue, Svelte and Angular, native components only after web 1.0 (decision 0005; master plan) | Akash | 2026-10-13 |
| Capacity is now part-time days, 15 to 20 hours a week, in two-week sprints | Akash | 2026-10-13 |
| Open core stays in the repo but off the website | Akash | 2026-10-13 |
| The website's identity and story come from a research round with 2 or 3 directions; the owner picks one and decides whether it also replaces Mor | Akash | 2026-10-13 |
| Master plan revised after a pressure test: usage gates per phase, surfaces published only on request, about 20 components plus form patterns for 1.0, first npm release moved to 15 November, a trust pack before 1.0, and a stop or pivot rule on 31 March 2027 ("Apply the council's improvements to the Saral master plan") | Akash | 2026-10-13 |
| Website direction: claim first, Neel's look without story sections, homepage hero is a live form in six scripts beside its JavaScript-off version; live contrast view moves to the M3 beta; form patterns get a script-rendering test matrix at M2 (owner answered "Yes" to both moves and asked the assistant to pick the direction "as a design director") | Akash; direction picked by the assistant at his request | 2026-10-14 |
| Demo client theme: Kosh, a fictional savings app | Assistant, delegated by Akash | 2026-10-11 |
| The repo goes public at the first release, v0.1 | Akash ("yes") | 2026-10-11 |

Everything else here is a proposal from the assistant for Akash to accept or change.

## 4. What Saral will not try to do

- Breadth, hard widgets (combobox, multi-select, date picker), release count, many framework adapters, native component runtimes, paid design-platform integrations. Reasons in the research, "Saral should refuse five races".
- Process that only protects many consumers. With one consumer, a breaking change costs one pull request. Codemods, metrics pages, a CLI and the agent eval wait until there is a second consumer or a clear need (phase 5).

Where Saral aims to lead: the shortest time from a mistake to a check that prevents it; tokens, part names and accessibility roles treated as a contract; and a system that ships no JavaScript where HTML and CSS are enough.

## 5. Architecture

```
tokens/      design tokens in DTCG 2025.10 JSON: roles, plus one file per theme
specs/       one neutral spec per component (section 9)
packages/
  tokens/    the token compiler and its checks; usable on its own
  core/      framework-free TypeScript behaviour, only for components that need it
  react/     thin React bindings over core and the markup contract
  themes/    mor (default), kosh (client demo)
site/        docs site, built with Saral (from phase 3)
tools/       guard (section 12), lint rules
docs/        decisions/, incidents/, research/, spec/
```

Generated, never hand-edited: `dist/` token outputs (CSS custom properties, JS; later Figma, Swift, Compose), the docs pages, the agent files and the Figma library.

Sites install Saral as a GitHub dependency pinned to a release tag. npm publishing waits (section 14).

## 6. The contracts

### 6.1 Token contract

- Tiers: primitive (theme-private values), semantic (roles, the public API), component (only where a component must differ from a role).
- Components and theme CSS use semantic or component tokens only.
- Names: `{group}.{role}.{variant?}.{state?}`. Only the role is required; at most one variant.

### 6.2 Markup and state contract

- Every part carries `data-scope="{component}"` and `data-part="{part}"`.
- **Interaction states come from CSS first.** Themes style `:hover` (inside `@media (hover: hover)`, so touch screens never get stuck hover), `:active`, `:focus-visible`, `:disabled`, `:checked`, `:indeterminate` and `:user-invalid`. These work before any JavaScript loads, which matters on a statically exported site.
- **Core adds a state attribute only when CSS cannot express the state.** v1 has two: `data-invalid` (set when the field shows its error message, which follows the timing in section 8) and `data-pending` (a button waiting on an action).
- ARIA is the source of truth for assistive technology. Data attributes are for styling only.

### 6.3 CSS contract

- Cascade layers, declared once: `@layer saral.reset, saral.tokens, saral.components, saral.utilities;`. Consumer CSS outside the layers always wins.
- Component selectors are wrapped in `:where()` (zero specificity).
- No CSS-in-JS, no bundler plugin. Plain CSS and custom properties.

### 6.4 Versions

- **0.x until the kit is complete (phase 3).** Breaking changes are allowed in 0.x and noted in the changelog. The brand tokens were recalibrated on 2026-10-10 and may still move; freezing them now would be premature.
- **From 1.0**, this table applies:

| Change | Version bump |
|---|---|
| Add a token, part, prop, component or attribute | minor |
| Change a token value as a declared design change | minor |
| Fix a wrong token value | patch |
| Rename or remove a token, `data-scope`, `data-part` or state attribute | major |
| Change an ARIA role, or add or remove a landmark | major |
| Deprecate anything | minor, with `@deprecated` and a lint rule |
| Remove anything deprecated | major |

- Stability labels: **preview** (outside the promise), **stable**, **deprecated**. Figma, Swift and Compose outputs and the demo theme stay preview in v1.

## 7. Tokens

### 7.1 Format

- DTCG 2025.10. Light and dark through a `theme.json` per theme, modelled on the DTCG Resolver module (not a conformant resolver document).
- Colours are authored in sRGB, with `hex` and matching `components`, or in OKLCH; the compiler converts OKLCH to sRGB in one place, with gamut mapping.
- The width axis and springs live in `$extensions` under `saral` (DTCG has no type for them).
- Sizes are stored as numbers and converted per platform.

### 7.2 Semantic roles

Every theme must fill every role in every mode, or the build fails.

- `surface`: ground, raised, sunken, inverse
- `text`: default, muted, quiet, inverse, on-action, on-accent, disabled (disabled text is exempt from contrast, WCAG 1.4.3)
- `border`: hairline, strong, focus
- `action`: default, hover, pressed, disabled, with matching text roles
- `accent`: default, hover, subtle
- `feedback`: danger, success, warning, info; each with text, subtle background and border

A theme may point several roles at one value.

The authoritative list is `tokens/roles.json`, and the contrast pairs every theme must pass are in `tokens/pairs.json`.

Other groups: `font` (family, width settings for display, heading and reading, weights, size scale with line heights; fluid sizes always include a rem term so they follow the reader's text size setting (a stronger zoom check is deferred)), `space`, `radius` (`box`, `control`, `round`), `motion` (each with a reduced-motion value), `focus`, `size` (minimum target 24 by 24 CSS px).

### 7.3 Theme policy

Each theme ships `policy.json`, and the compiler enforces it. Mor and Kosh each declare one accent hue; a theme someone else writes may declare more.

### 7.4 Compiler checks (the build fails on any)

1. An alias cycle or a reference to a missing token.
2. A role missing from any theme or mode.
3. A declared text and background pair below WCAG 2 AA, on final sRGB values, per theme and mode. APCA is not computed yet.
4. A theme breaking its own `policy.json`.
5. A fluid size with no rem term.

Phase 1 outputs: CSS custom properties and JS. Figma comes in phase 3; Swift and Compose in phase 4, as preview, compile-checked, with no device testing in v1.

## 8. Components

Built on native elements. "Core" means TypeScript behaviour; most components have none.

| Component | Native base | Core | Phase |
|---|---|---|---|
| Field (text, email, textarea) | `<input>`, `<textarea>` | error lifecycle, `aria-describedby`, `aria-invalid` | 2 |
| Error (part of Field) | `<p>` linked by `aria-describedby` | shown and announced by Field's core | 2 |
| Notice | `role="status"` or `role="alert"` | none in v1 | 2 |
| Button | `<button>` | pending state only | 2 |
| Link | `<a>` | none | 2 |
| Checkbox | `<input type="checkbox">` | none | 3 |
| Radio group | `<fieldset>` + radios | group error wiring (shared with Field) | 3 |
| Select | native `<select>` | label and error wiring (shared with Field) | 3 |
| Tag | `<span>`, or `<button>` if removable | none | 3 |
| Card | `<article>` or `<section>` | none | 3 |

**The contact-form slice (phase 2) is the real test.** It is how enquiries reach Akash. It must submit with JavaScript off (the form posts natively), must never block submission because a script failed, and its errors must follow this timing: check a field when the person leaves it after typing, re-check as they type once an error is showing, and never announce an error mid-typing.

The React adapter renders the markup contract and calls core only where core exists. Button, Link, Card, Tag and Notice ship no client JavaScript. Composition uses a `render` prop, not `asChild`. Props are closed TypeScript unions.

## 9. Component spec format

One file per component in `specs/`, validated in CI. Required: `name`, `status`, `since`, `purpose`, `whenToUse`, `whenNotToUse` (with the alternative), `anatomy` (parts, element, role, `data-part`), `states` (and whether CSS or core sets each), `props`, `keyboard`, `accessibility` (web ARIA; iOS and Android mappings for later), `tokens`, `content` (label and error wording), `examples` (each also a test fixture), `screenReaderLog` (tester, reader, platform, date, result).

## 10. Docs, agents and Figma

- **README first** (phase 0): what Saral is, the honest status, one usage example, and the same field in three looks.
- **`AGENTS.md`** (phase 0): a short router listing every real component, with wrong and right pairs. Grows with the kit.
- **Docs site** (phase 3): built with Saral, generated from specs and types. Each page shows purpose, when not to use, anatomy, keyboard and accessibility, the screen-reader log, props, live examples and the theme switch.
- **Kosh, the client demo theme** (phase 3): a fictional savings app's brand on the same components. It is the proof of headless and the Behance pitch in one: a client's brand on this system.
- **Figma library** (phase 3): generated, never read back. Variables carry their Saral CSS name as code syntax. Width-axis type lives in text styles because Figma variables cannot bind it. Drift between Figma and the tokens is checked with Akash's existing design-QC tooling rather than a new tool. Designers contribute by proposing changes in an issue; the token source stays the single source.
- **`llms.txt`** with per-component slices (phase 4).

## 11. Quality checks

Docs examples are the test fixtures.

- Vitest for the compiler and core.
- Playwright on every fixture, with JavaScript on and off for the contact-form slice.
- axe-core on every fixture, theme and mode. Automation finds a minority of accessibility problems, so it never replaces the manual log.
- Screenshot tests on themes.
- Lint rules that ban raw colours, sizes and durations outside tokens (stylelint and ESLint). Agents can run them too.
- A manual screen-reader pass (VoiceOver on macOS and iOS; NVDA when available) before a component leaves preview.
- From 1.0: a snapshot of each package's public exports, and a size budget per component.

No model sits in the path that blocks a merge. LLM review is advisory.

## 12. The learning loop and safety

- **Decision records** are written when a decision is first used, not in advance. One status field.
- **Incidents:** any mistake that reaches the main branch or a consumer site gets a file in `docs/incidents/` (what happened, impact, cause, the check added). It stays open until it links to a merged automated check. Each closed incident also gets a short post draft, in Akash's voice, for LinkedIn.
- **Confidentiality guard:** the repo is public, so nothing marked private in Akash's own records may appear in it. The guard script in `tools/guard/` holds no terms. It reads a term list kept outside the repo on Akash's machine, and in CI from an encrypted repository secret. No list, hash or description of the terms is committed.

## 13. Phases, budgets and the stop rule

Budget: 3 to 4 evenings a week (Akash, 2026-10-11). Each phase has an evening budget that includes reviewing agent-written code. **When a budget runs out, the phase's "cut first" items are dropped or moved to a later phase; the budget is not extended.**

| Phase | Evenings | Work | Cut first | Exit (Saral-only) |
|---|---|---|---|---|
| 0. Start | 1 | README, change table, `AGENTS.md` stub, confidentiality guard, MIT licence | none | Guard blocks a test commit; README shows the field example |
| 1. Tokens | 5 | DTCG source for Mor and Kosh (light, dark); compiler with checks 1 to 5; CSS and JS outputs; fixture page | Kosh dark mode | Both themes build with every check passing. Tag v0.1, then the first public push (approved by Akash) |
| 2. Contact-form slice | 5 | Field with Error, Notice, Button, Link; core for Field and pending; React adapter; test harness; lint rules | lint rules, React `render` prop | All slice tests pass with JS on and off. Tag v0.2. Tried on a real site. Behance case study can start |
| 3. Kit and surfaces | 8 | Checkbox, Radio group, Select, Tag, Card; docs site on Netlify; Kosh theme; Figma library | Figma text styles, Tag | Every docs page switches themes; Figma variables generated. Tag v0.3 |
| 4. v1.0 | 4 | Swift and Compose outputs (preview); `llms.txt`; export snapshot; size budgets; screen-reader passes; freeze 1.0 | Compose output | Tag v1.0 |
| 5. Later | as needed | Codemods, CLI, MCP, agent eval, metrics, native components, overlays, hard widgets, other adapters | n/a | Starts only when a real need appears |

About 23 evenings to v1.0, roughly six to seven weeks at this pace.

**Stop rule:** if two weeks pass with no Saral evening, the project is marked paused in the README and the changelog, with the date and where it stopped. A public repo is never left looking abandoned without saying so.

What changed in v2, from the pressure test: a time budget and stop rule; interaction states in CSS, with no JavaScript in simple components; the contact-form slice first; Figma before native; 0.x until the kit is complete, with codemods and metrics deferred; a guard that keeps its terms outside the repo; the case study starting after phase 2; the README first.

## 14. Open questions and risks

Resolved 2026-10-11: licence MIT; npm deferred, the site uses a pinned GitHub tag; docs on Netlify until Saral's own domain is bought (Netlify's free plan allows commercial use, which matters because the docs support a paid service; Vercel's free plan does not); Mor as Saral's default; Kosh as the demo client; public at v0.1.

Open:

1. Saral's domain name (Akash will buy it).

Risks:

- **Anek's width axis outside the web** (no DTCG type; Android needs API 26 and a bundled font; iOS support for a custom font's width axis is unconfirmed; Figma cannot bind it). Native outputs stay preview until tested on devices, which is after v1.
- **One maintainer.** Mitigated by the budgets, the stop rule, a small surface and machine checks.
- **The site migration** belongs to another session and could lag. Saral's exits do not depend on it.
