# Saral website plan: structure, identity and the Sprint 8 build

Status: direction chosen 2026-10-14 (recorded in the master plan, a0f1ecf): claim first, Neel's look without story sections, the hero a real form in six scripts beside its JavaScript-off version. The owner answered yes to the two master-plan moves and asked for the direction to be picked as a design director. Builds on the benchmark in `docs/research/2026-10-website-benchmark.md` and the master plan in `docs/spec/2026-10-12-saral-master-plan.md` (phase 4, sprint S8, milestone M3 on 7 February 2027).

What is in this folder for the owner to look at:

- `docs/research/website/compare.html`: the three identity directions side by side, light and dark. Open it through `npm run serve`.
- `docs/research/website/neel.html`, `kolam.html`, `jamun.html`: one homepage mock per direction.
- `docs/research/website/templates.html`: wireframes for the six page templates.
- `docs/research/website/council-2026-10-13.md`: the pressure test of the identity and of Saral's standing.
- `docs/research/website/palettes.mjs`: the three palettes as full Saral colour roles, checked with Saral's own `checks.mjs`. `palettes.json` holds the result.

## What the site must be

Six rules, each taken from a finding in the benchmark.

1. **It proves the system.** Styled only by Saral tokens and components. If the site needs something Saral does not have, that is a gap in Saral, fixed in Saral.
2. **It reads with JavaScript off.** Search, the playground and remembered choices are the only parts that need it. Material 3, Apple HIG and Stripe show 1 to 15% of their text without JavaScript; Saral shows all of it.
3. **It is light.** 150 kB first load, fonts included, and under 15 kB of JavaScript outside the playground. Only GOV.UK (196 kB) and Saral's current portal (112 kB) are near this today.
4. **One page per component, generated from its spec.** No tabs, no second site, no link out for behaviour. What the spec says is what the page says.
5. **Every page has a Markdown twin**, listed in `llms.txt`, generated at build time.
6. **No promotion and no business content.** Nothing about open core, paid work, pricing or trademarks. No logo wall and no names of who uses Saral (AGENTS.md rule 9).

## The chosen direction, as a mock

`docs/research/website/claim.html` (view through `npm run serve`; built by `build-claim.mjs`):

- **Real components only.** The hero form is Saral's own Field, Select, Checkbox, Radio group, Button and Notice, styled by `dist/css` and enhanced by `packages/core`. The six forms differ only in `lang`, `dir` and their words.
- **An honest JavaScript-off side.** The right pane is a sandboxed frame without `allow-scripts`, loading a page that has no script at all. It validates with the browser's own checks and Saral's `:user-invalid` styles, and submits as a plain form.
- **Live contrast slot.** The section under the hero checks the accent's pairs live with `packages/tokens/src/color.mjs`. In S8 it becomes the full live contrast view on `checks.mjs`, rebuilding every role.
- **Weight.** Fonts are self-hosted and trimmed, one file per script, loaded by `unicode-range`, Latin preloaded, `font-display: swap` (`fonts/README.md`). First load, fonts included, is 127 kB with 12 kB of JavaScript, measured in the browser on 2026-10-23: lighter than any site in the benchmark except the current portal. Each other script's font loads only when it is chosen: Tamil 28 kB, Arabic 16 kB, Thai 9 kB, Japanese 23 kB, Devanagari 166 kB.
- **Checks.** axe clean on the page and every scripts-off page in light and dark; nothing moves on its own; no sideways scroll at 375 pixels.
- **Copy.** Every headline and lead is a placeholder, marked with a dashed line, until the owner writes the pitch sentence.

**What the mock found.**

- **Select was not right-to-left ready.** `packages/css/src/select.css` used physical `right` for the arrow and its padding, so in Arabic the arrow sat on the start side; `tag.css` had the same pattern. Reported to the build workstream, which fixed both with logical properties and a lint rule (changelog, 2026-10-14). That fix was still uncommitted on 2026-10-23; the mock's `claim.css` was generated from the working tree and already includes it.
- **The scripts-off frame follows the system colour mode,** not the page's mode switch, because nothing inside it may run a script.
- **The translations are drafts.** Each needs a native reader before the beta (the script test matrix at M2).
- **The Devanagari font is heavy** (166 kB) because correct shaping keeps every conjunct the letters can form. S8 should subset per page with a shaper-aware tool and ship WOFF2.

## Information architecture

Seven top sections and a quiet project area in the footer, matched to the revised master plan (60b3c5d): Saral's job is forms and services that work for everyone, so form patterns and a trust section for regulated teams are top level. Every page names where its content comes from, so nothing is written twice.

```
Home                                  hand-written, live components from dist/
Get started
  Overview: pick a path               hand-written
  Plain HTML and CDN                  hand-written, one complete file to copy
  npm and bundlers                    hand-written
  React                               hand-written, adapter notes from specs
  Elements                            @saral/elements, the light-DOM layer
  Vue, Svelte, Angular and others     a "use Elements" guide; no adapter tabs before 1.0
  Tokens only                         generated list of token outputs (CSS, JS, DTCG JSON)
  Figma                               variables from M2, made from the same source
  Using Saral with AI tools           llms.txt, Markdown twins, spec schema
Foundations
  The contract                        parts, states, tokens: from the v1 spec
  Tokens                              generated from tokens/ and roles.json
  Colour                              roles, jobs, every contrast pair (generated)
  Type                                scale and specimens, every supported script
  Space and size                      generated scale
  Corners and lines                   generated
  Motion                              durations, easings, reduced-motion rule
  Accessibility                       Saral's promise, testing method, WCAG map
  Writing                             the docs copy rules, for product text
Components
  Overview                            generated grid with status and filter
  <one page per spec>                 generated from specs/*.json and CHANGELOG.md
Patterns                              form patterns first (M2: v1, M4: 8 patterns)
  Error summary
  Check your answers
  Multi-step with progress
  Validation messages                 wording in every supported language
  Pending and loading                 data-pending
  (more as patterns arrive)
Themes
  Overview                            Mor, Kosh, and the new theme if chosen
  <one page per theme>                generated preview and contrast table
  The theme contract                  roles a theme must fill, rules it must pass
  Make a theme                        written guide now, builder at S14 (M5)
Trust                                 the trust pack, public before 1.0
  Accessibility statement             docs/trust/accessibility.md: standards met, how tested, known gaps
  Security policy                     SECURITY.md (repo root): how to report, what is supported, response times
  Support policy                      SUPPORT.md (repo root): versions supported, how issues are handled
  Continuity and governance           GOVERNANCE.md (repo root): who maintains Saral, how decisions are made, what happens if work stops
Playground                            S13 (M5); before that, "Open in playground" is hidden

Footer: Project
  Changes                             CHANGELOG.md
  Roadmap                             docs/roadmap.md, a site-safe summary (new)
  Decisions                           docs/decisions, minus any "Site: no"
  Incidents                           docs/incidents
  Versioning                          docs/versioning.md
  Contributing                        CONTRIBUTING.md
  Licence                             MIT
```

Framework tabs on every example are **HTML, Elements and React**, in that order, remembered as `?use=html|elements|react`. Before 1.0 the only published surfaces are npm, the CDN and Figma; other registries and platforms get a page only when a team asks for one. The Trust pages carry no business content: support means how issues are handled, never paid help.

**Kept off the site, on purpose.**

| Source | Why it stays off | How it is kept off |
|---|---|---|
| `docs/decisions/0004-open-core.md` | Business model | Already marked `Site: no` |
| `TRADEMARK.md` | Business and name policy | Never rendered; a GitHub link only if the owner asks |
| `README.md`, licence paragraph | Mentions open core | The site never renders the README |
| `docs/spec/2026-10-12-saral-master-plan.md` | Mentions paid templates | The Roadmap page renders a new `docs/roadmap.md` instead; the changelog's link to the plan points at GitHub, not a site page |
| `docs/spec/2026-10-11-saral-v1-design.md`, decision table | Rows about open core | Not rendered; "The contract" page is written from its contract sections |
| `docs/research/` | Working evidence | Not rendered |

A new site test fails the build if any page contains "open core", "open-core", "paid template", "pricing" or "trademark", so a later edit cannot leak it.

## Identity and story: three directions

All three share the same page structure and the same real form, so the comparison is about identity only. Every palette fills all 33 colour roles in light and dark, passes all 26 contrast pairs in `tokens/pairs.json` and the one-accent-hue policy, checked with Saral's own `checks.mjs` (run `node docs/research/website/palettes.mjs`). Every typeface is free (SIL Open Font Licence) on Google Fonts and covers Latin and Devanagari.

| | Neel | Kolam | Jamun |
|---|---|---|---|
| Meaning | Indigo, the dye | The threshold drawing | The black plum, and Jambudvipa, an old name for India |
| Story in one line | One colour, many dips: a deeper blue comes from repeating a simple step, not a stronger vat | A grid of dots and one rule: tokens are the dots, the parts contract is the rule, your theme is the festival colour | One source, every platform: the tree that grows in any soil and feeds whoever passes |
| Fits Saral's | Theme builder: a full scale from one colour | Architecture: tokens, contract, themes | Reach: contract first, everywhere (decision 0005) |
| Colour | Indigo `#263d97` on cool cotton `#f4f7fe`; dark `#93aef8` on `#090e1f` | Ink `#1b2025` on limewash `#f3f5f8`; dark rice white `#e2e9f0` on granite `#0b0d10`. No hue of its own | Jamun violet `#712087` on `#f9f4fa`; dark `#d093e3` on `#130916` |
| Type | Eczar (headings), Mukta (text), JetBrains Mono | Gotu (headings), Kripa (text), Martian Mono | Akshar (headings), Noto Sans and Noto Sans Devanagari (text), Noto Sans Mono |
| Shape | Soft: 8px controls, 10px boxes | Round: pill controls, 16px boxes | Square: no radius, 2px strokes |
| Mood | Calm, crafted, editorial | Precise, geometric, quietly playful | Bold, contemporary, poster-like |
| The memorable thing | Eight swatches of the same blue, dipped one to eight times | A real kolam: one line, drawn once, around a five by three grid | A full-colour field with सरल Saral set huge |
| Risk | Blue is common in software; the story carries it | No colour of its own; the owner asked for a fresh colour, and here colour comes from themes | Purple can read as playful; Akshar is condensed, so it is for headings only |

The kolam in the mock is not an illustration. It is drawn by the rule itself: a line at 45 degrees between the dots that turns back at each edge, which closes as one loop on any grid whose sides share no common factor. The mock computes it in `build-mocks.mjs`.

Facts behind the stories were checked: indigo's name comes from the Greek for "from India", the vat is yellow-green and deeper shades come from repeated dips ([Botanical Colors](https://botanicalcolors.com/faq/indigo-faq), [DGNHAS](https://dgnhas.org.uk/node/3498)); kolams are drawn on a grid of dots called pulli, in rice flour, daily ones in white ([Wikipedia](https://en.wikipedia.org/wiki/Kolam)); Jambudvipa means the land of the jambu tree, the jamun, and Ashoka used it for his realm ([Wikipedia](https://en.wikipedia.org/wiki/Jambudv%C4%ABpa); the tree is one of several explanations of the name, and the page says "one of the oldest names", not "the meaning").

The stories are for the owner only. On 2026-10-13 the owner ruled that the site never explains them: Saral is used globally, its Indian roots are felt in its richness and diversity, never announced. The "Why" section was removed from all three mocks; the stories now appear only on the comparison page.

**First recommendation (withdrawn).** Kolam for the website, with Neel second. The pressure test below withdrew it.

## Pressure test: is this a global premium system?

Run on 2026-10-13 as a council of five advisors with anonymous peer review. The full transcript is in `docs/research/website/council-2026-10-13.md`.

**What the council agreed.**

- All three mocks announce India through ornament: Gotu's Devanagari-flavoured headings, a drawn kolam (a named ritual that reads as Indian to those who know it and as an unexplained pattern to those who do not), and Jamun's huge सरल. Removing the "Why" text is not enough if the costume stays.
- Neel is the only direction whose idea reads with no backstory: "Dye them any colour" says that one colour becomes a whole theme.
- Identity is not why Saral is behind. The gaps are mechanical: not on npm, no search, no playground.
- Saral gets ahead of the benchmarks only where they cannot follow quickly: every contrast pair checked live, accessibility tables on every component, pages under 150 kB that read without JavaScript, and Markdown and llms.txt for every page.
- India's diversity is best felt as a capability: components proven in many scripts, on cheap phones and slow networks. No benchmark shows this, and it helps every global team.

**Where it split.** Keep Kolam with its costume fixed (Executor, Expansionist) or move to Neel (Outsider, Contrarian); the First Principles view, backed by three of five reviewers, was to choose the claim first and let the look follow. On scope, one advisor cut to 15 components on the web only, one added more, and one moved the Vue, Svelte and Angular adapters to after 1.0.

**Blind spots found in review.**

- The name. "Saral" is a Hindi word. Keep it: global software carries words from many languages (Ubuntu, Kubernetes), and this one means the product's promise, simple. The names are free on npm and the other registries (checked 2026-10-13); a worldwide trademark search has not been done.
- Fonts. Anek covers Latin and ten Indic scripts but not Arabic, Thai or CJK. An "every script" promise needs a font for each script, loaded with `unicode-range` so a page only downloads the scripts it shows, which keeps the 150 kB budget.
- People. Script rendering needs native readers to judge it. They can become credited reviewers, which also eases the one-maintainer risk.
- Evidence. None of this has been shown to developers outside India.
- The docs brand and the system's default look are two different jobs; the system's identity lives mostly in its defaults.

**Revised recommendation.**

1. **Lead with a claim, not a costume.** The revised master plan gives Saral a job: forms and services that work for everyone. The site makes that checkable: every component works in every script, on every device, with JavaScript on or off, and every build proves it.
2. **Look: Neel, without its story.** Indigo and "Dye them any colour". Indigo is a global material whose source is India; that is the felt, not stated, signal.
3. **The hero is the product:** one real form shown live in Latin, Devanagari, Tamil, Arabic (right to left), Thai and Japanese, and a colour control that redraws the theme while every contrast pair shows its ratio and passes.
4. **Kolam becomes structure, not picture:** its grid of dots and one rule stays as the idea behind spacing and a small generated mark, never a hero drawing and never explained.
5. **Type:** drop Gotu and Kripa. Eczar for headings, for freshness; Anek for text, because it is already Saral's and covers ten Indic scripts; Noto for Arabic, Thai and CJK, per script.
6. **Scope.** The revised master plan already ships Vue, Svelte and Angular adapters only on request, with Web Components for every framework, which was the council's main cut. Still open: bring the theme builder's live contrast view forward from M5 (May) to the M3 beta (February), since it is the one thing no benchmark has, and add a script test matrix to the form patterns (M2).

**Fit with the positioning (master plan, 60b3c5d).** The working line is "Forms and services that work for everyone", aimed at public services and fintech, with JavaScript on or off; the nearest alternative, Web Awesome, needs JavaScript before anything renders. Of the three original directions, Neel fits best: calm, trustworthy, editorial, and its form-first homepage already reads as a service. Kolam's pill buttons and playful line read as a consumer brand; Jamun's poster look reads as marketing, not as something a bank or a ministry would trust. The revised recommendation fits better still, because its hero is the positioning made visible: a real form, working in six scripts, shown again with JavaScript off beside it. The homepage copy should be rewritten around the owner's pitch sentence once it exists; until then the mocks keep their placeholder headlines.

**Default theme or website only.** Unchanged: website only for now, built as a real theme in `tokens/themes/<name>/` so it passes the same gates as Mor and Kosh. Decide by S12, because changing the default is cheap in 0.x and visible to every user after 1.0.

## Where Saral stands, and the target

Saral is scored like the benchmarks (1 to 5). "Today" is measured. "S8" and "1.0" are targets that hold only if the plan ships, not results. The best benchmark score is shown for comparison.

| Criterion | Today | S8 beta, Feb 2027 | 1.0, Jun 2027 | Best benchmark | How Saral gets ahead |
|---|---|---|---|---|---|
| First working component | 2 | 5 | 5 | 5 (Tailwind, Stripe) | One HTML file, one stylesheet, no build step |
| Search | 1 | 4 | 5 | 4 | The only index that finds tokens, parts, states and props |
| Information architecture | 2 | 5 | 5 | 5 (GOV.UK, Apple) | Seven sections, one site, form patterns and trust at the top |
| Component page | 4 | 5 | 5 | 5 (Radix, Mantine, GOV.UK, Ark, Stripe) | Generated from the spec, so it cannot drift |
| Playground | 1 | 2 | 4 | 5 (Primer, Stripe) | In-page and serverless, shares by link |
| Theming tools | 2 | 4 | 5 | 5 (Radix, Material, shadcn/ui) | The only builder that proves every contrast pair |
| Accessibility guidance | 4 | 4 | 5 | 4 | Keyboard, testing table and screen-reader log on every page, in many scripts |
| Performance | 4 | 5 | 5 | 5 (GOV.UK) | Under 150 kB, readable without JavaScript |
| Feels premium | 2 | 4 | 4 | 5 (several) | Earned through restraint and the live proof hero |
| Mean | 2.4 | 4.2 | 4.8 | 3.8 (Radix) | |

Today Saral is 19th of 20, ahead only of Polaris. On the docs alone it can lead by 1.0. What no table fixes, and where the leaders keep their lead for years:

- **Breadth.** 9 components now and about 20 plus 8 form patterns at 1.0, against 45 to more than 120 for Ark, Mantine and Material. Saral answers with depth on forms, not breadth.
- **Track record.** Premium comes from years of not breaking people; Saral has none yet.
- **People.** One part-time maintainer. Script reviewers and contributors are the answer, and they must be asked.
- **Designers.** Figma variables arrive at M2; a full Figma library comes later.

## Page templates

Wireframes are in `docs/research/website/templates.html`. In short:

- **Shared shell.** Header with the seven sections, search on `/` and `Ctrl K`, and one control each for framework (HTML, Elements or React, in the URL as `?use=`), theme and mode. Left: the current section only. Right: on this page, then Copy as Markdown, Edit on GitHub, Report a problem.
- **Home.** Hero with the story image and the install line; a live form with Show the markup; three promises; where Saral works today and what is planned; the same markup in every theme; the story with sources.
- **Getting started.** Three paths (plain HTML, npm with React, tokens only), each three steps or fewer, ending with a complete file to copy.
- **Component page.** One long page: header (name, purpose, status, since, Source, Spec JSON, Markdown, Report), main live example with HTML, Elements and React code tabs, when to use and when not, examples, interactive anatomy with the parts table, states, API (HTML attributes, React props, tokens it reads), accessibility (keyboard, ARIA, iOS and Android, WCAG, testing table tied to the release), writing, decisions and research, known issues and limits, recent changes, help improve.
- **Tokens.** Filterable role table with each role's job, light and dark swatches and values, copy name; every contrast pair with its ratio; type, space and motion scales.
- **Themes.** Theme gallery with live previews; the theme contract; the builder at M5 with live `checks.mjs` results and export.
- **Playground (M5).** Editor, preview frame, theme, mode and width, checks panel (axe plus Saral's own rules), share link with the state in the URL, download as a file.

## Sprint 8 build plan (25 January to 7 February 2027)

The goal is the docs v2 shell, live as the M3 beta: new identity, information architecture, search, and the new component template for the nine existing components. The playground and theme builder stay in S13 and S14.

### Before S8 (small, in earlier sprints)

- **S2, spec schema v2:** add `limits` (what the component does not do) and `testing` (keyboard and automated results by release) to `specs/*.json`, next to the existing `content` and `screenReaderLog`.
- **S2:** add a one-line `job` for every role in `tokens/roles.json` (or a sibling `roles.md`), for the tokens page.
- **S6:** the theme-generator core already planned; the site only needs its `checks` in S14.
- **Owner, by 15 November:** pick the direction, and default theme or website only.
- **S7, one day:** build the chosen direction as `tokens/themes/<name>/` (core, light, dark, policy, theme.json) from `palettes.json`, so `npm run build` gates it like Mor and Kosh.

### Files in `tools/site/`

| File | Change |
|---|---|
| `build.mjs` | Becomes a short orchestrator: read specs, tokens, changelog and records once, call each page module, write pages, their Markdown twins and the search index. Keeps `buildSite({ out })` and the `Site: no` filter |
| `ia.mjs` (new) | The information architecture as data: sections, order, titles, source of each page. Header, section nav, footer and `llms.txt` all read it |
| `shell.mjs` (new) | The page frame: head (self-hosted fonts, one preload), header, search box, framework, theme and mode controls, section nav, on-this-page, footer. Replaces the inline `page()` and `nav()` in `build.mjs` |
| `pages/home.mjs` (new) | The home template |
| `pages/start.mjs` (new) | Getting started paths, with the copy-whole-file block generated from `dist/` |
| `pages/component.mjs` (new) | The component template, every section from the spec; recent changes filtered from `CHANGELOG.md` by component name |
| `pages/tokens.mjs` (new) | Foundations token pages; moves today's tokens code out of `build.mjs` and adds role jobs and filtering |
| `pages/themes.mjs` (new) | Theme gallery and one page per theme with its pair table |
| `pages/patterns.mjs` (new) | Form pattern pages: the pattern live, when to use it, its parts, and its validation wording in each supported language |
| `pages/trust.mjs` (new) | The four Trust pages: `SECURITY.md`, `SUPPORT.md` and `GOVERNANCE.md` rendered from the repo root, where GitHub also surfaces them, and the accessibility statement from `docs/trust/accessibility.md`. The files are written with the trust pack in the master plan; the site only renders them, and the business-terms test covers them too |
| `pages/project.mjs` (new) | Changes, roadmap, decisions, incidents, versioning, contributing; moves today's records code out of `build.mjs` |
| `search.mjs` (new) | Builds `search.json` at build time: titles, headings, parts, states, props and token names, with the page and anchor for each |
| `twins.mjs` (new) | Writes `<page>.md` for every page and `llms.txt` from `ia.mjs` |
| `markdown.mjs` | Add heading anchors and a table of contents for on-this-page |
| `demos.mjs` | Keep; add the Elements and React version of each demo for the framework tabs |
| `build.test.mjs` | Extend: every page in `ia.mjs` exists; every page has a twin; every page's text is in its HTML (readable with JavaScript off); no business terms on any page; first-load weight under budget; every internal link resolves; every spec has every template section |

### Files outside `tools/site/`

| File | Change |
|---|---|
| `site/src/site.css` | Rewritten for the new shell; tokens only, as now |
| `site/src/theme.js` | Add the framework choice (`?use=` and storage), keep it under 2 kB |
| `site/src/search.js` (new) | Opens on `/` and `Ctrl K`, loads `search.json` on first use, works as a plain link to a search page without JavaScript |
| `site/src/anatomy.js` (new) | Outlines `[data-part]` in the preview when its row in the parts table is hovered or focused |
| `site/fonts/` (new) | The chosen faces as WOFF2, subset to Latin and Devanagari, with their OFL licence files |
| `docs/roadmap.md` (new) | Site-safe roadmap: milestones and dates from the master plan, nothing about business |
| `tests/browser/portal.spec.mjs` | Extend: axe in every theme and mode on every page; search opens and finds a token; anatomy highlight works by keyboard; pages read with JavaScript off |
| `netlify.toml` | Long cache headers for `assets/` and `fonts/`; stub pages for any moved URL instead of redirects to an index |

### Exit gate (M3)

- Every page in the information architecture builds, with its Markdown twin, and `llms.txt` lists them.
- `npm test`, `npm run test:browser` (three engines), `npm run guard` green.
- axe clean on every page in every theme and mode; every page readable with JavaScript off.
- First load of a component page at or under 150 kB with fonts; JavaScript under 15 kB; LCP under 1 s on the measurement script in `docs/research/website/measure-docs.mjs`.
- No business terms on any page (site test).
- A preview link reviewed by the owner before the switch.

### Cut first if late

The anatomy highlight, and the Elements and React code tabs (HTML only for the beta). Form patterns and the Trust section are not cut: they carry the positioning.

## Open decisions for the owner

1. Accept the revised recommendation (claim first, Neel's look, product as the hero), or pick Neel, Kolam or Jamun as they stand.
2. Website only, or also the default theme instead of Mor.
3. Whether the roadmap page shows dates, or milestones only.
4. Whether to bring the theme builder's live contrast view forward to the M3 beta (a master plan change).
