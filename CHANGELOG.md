# Saral changelog

Project log, dated, newest first. Package release notes will be generated separately by changesets.

## 2026-10-23: new home page, roadmap and accessibility pages

- The site's home page now sells the design system, not a form builder. Headline "Build it plain. Make it yours.", the same markup in every theme and mode, three cards on how Saral is made, one button in six languages, and where Saral is going. It has a top navigation and no side navigation. No new JavaScript.
- New site pages: Roadmap (`docs/roadmap.md`, with target dates) and Accessibility (`docs/trust/accessibility.md`, marked as a draft). Both are in the side navigation.
- A site test fails any page that shows business content.
- Owner decisions, recorded in the website plan: the form-led pitch is set aside for the design-system pitch; the Neel look is for the website only and Mor stays the default theme; the roadmap shows dates as targets. The homepage mock uses the new copy.

## 2026-10-23: lighter mock fonts, and drafts for review

- The homepage mock's fonts are now WOFF2, cut by a new script (`docs/research/website/subset-fonts.py`) that keeps only the glyphs HarfBuzz uses to shape the page's text, then checks the cut font shapes it the same. All seven files come to about 105 kB, down from 310 kB; Devanagari went from 170 kB to 13 kB. First load stays at 113 kB, and axe still passes in light and dark.
- `docs/research/website/translations.md` lists every string of the six-script form, so native readers can correct the drafts.
- Draft of a roadmap for the docs site, `docs/roadmap.md`: milestones and target dates from the master plan, with nothing about business.
- Draft of the accessibility statement, `docs/trust/accessibility.md`: the standard Saral aims for, how it is tested, and the known gaps.

## 2026-10-23: proposed pitch

- Proposed homepage headline "Forms everyone can finish." and a one-sentence pitch for the README, talks and the npm page, with the reasoning and the lines set aside, in `docs/spec/2026-10-13-website-plan.md`. The claim-led mock uses them, marked as proposed until the owner signs them off.

## 2026-10-14: Select and Tag work right to left

- In a right-to-left page (Arabic, Urdu), the select arrow and its extra padding stayed on the right, which is the start side. The arrow now sits on the end side, and the select and removable tag use logical padding (`padding-inline`) instead of left and right. Left-to-right pages look exactly as before.
- A new lint rule fails any component CSS that uses a physical left or right side, or a left or right background position without a right-to-left rule. A browser test checks the select and tag in a right-to-left page.
- Found by the website research, while building a homepage form in six scripts.

## 2026-10-14: website direction chosen

- The docs site leads with its claim and uses the Neel look without story sections. The homepage hero is a real Saral form working live in six scripts, shown beside its JavaScript-off version.
- A live contrast view moves forward to the docs site beta in February. The full theme builder stays in May.
- From January, form patterns are tested for rendering in every script the homepage shows.

## 2026-10-13: master plan revised after a pressure test

- Five independent reviews of the master plan found that it measured only output, published surfaces before anyone asked for them, and held more work than the hours allow. The revision fixes this.
- Every phase now has a usage gate as well as a build gate, and a stop or pivot rule applies on 31 March 2027.
- Saral is still built for every platform, but publishes a surface only when a user asks for it. npm, the CDN and Figma come first; other registries, the Vue, Svelte and Angular adapters, and native components are on request. `@saral/elements` covers every framework in the meantime.
- The first npm release moves to 15 November 2026, with `llms.txt` and the spec schema. Form patterns (error summary, multi-step flows, validation messages in Hindi and English) arrive by 10 January 2027.
- 1.0 is 22 components plus form patterns, aimed at forms and services that must work for everyone, with a trust pack (security, support, accessibility statement, continuity) and testing with screen-reader users before launch.
- A two-week trial in sprint 7 decides whether framework adapters can be generated. Decision record 0005 is amended to match.

## 2026-10-13: website research

- `docs/research/2026-10-website-benchmark.md`: 19 docs sites scored on ten criteria, with one page per site measured for weight, speed and text without JavaScript. The current portal is the lightest of all (112 kB) but paints late because it waits on Google Fonts.
- `docs/spec/2026-10-13-website-plan.md`: the site's information architecture, page templates, three identity directions (Neel, Kolam, Jamun) and the Sprint 8 build plan.
- `docs/research/website/`: the homepage mock for each direction, a comparison page, wireframes, and the palettes, which pass every role, pair and hue check in Saral's own `checks.mjs`.
- The same day, a pressure test (five reviews, cross-reviewed, transcript in `docs/research/website/council-2026-10-13.md`) withdrew the Kolam recommendation: all three mocks announced India through ornament. The revised recommendation leads with a claim (forms that work in every script, on every device, with JavaScript on or off), uses Neel's look without its story, and makes a live multi-script form the hero. The "Why" sections are gone from the mocks; the stories stay on the comparison page only. The plan now scores Saral against the benchmarks: 2.4 today, 19th of 20.
- 2026-10-14 to 2026-10-23: the claim-led homepage mock for the chosen direction (`docs/research/website/claim.html`): a real Saral form in six scripts beside the same form in a frame that runs no script, a live contrast check for the accent, and self-hosted fonts trimmed per script. First load is 127 kB with fonts; axe clean in light and dark. It found that Select was not right-to-left ready.

## 2026-10-13: the master plan to 1.0

- A master plan takes Saral from v0.3 to 1.0 on every platform, in six phases of two-week sprints: the first npm release by 29 November 2026, tokens on every registry by 10 January 2027, a new docs site in February, the full component set as a 1.0 candidate in April, the playground and theme builder in May, and 1.0 on every registry by 13 June 2027. See `docs/spec/2026-10-12-saral-master-plan.md`.
- Decision record 0005: contract first, everywhere. Tokens go to every registry; Web Components are the universal layer; React, Vue, Svelte and Angular adapters are generated from the specs and proven to render the same markup.
- The portal leaves out any record marked `Site: no`; decision 0004 is one of them and stays in the repo.
- Research for the new docs site and its identity has started in its own session.

## 2026-10-12: CI runs again

- The CI file had a YAML error since the portal deploy was added (a `: ` inside an unquoted line), so GitHub rejected it and no checks ran on main for seven commits. The pull request comment step now uses a block and passes the preview link through an environment variable.

## 2026-10-12: name policy and contributing guide

- `TRADEMARK.md`: anyone can use and fork the code, but only the owner's releases are called Saral.
- `CONTRIBUTING.md`: bug reports and small fixes are welcome; a new component or an API change starts as an issue, because it needs a spec first.
- Decision record 0004, kept in the repo.

## 2026-10-12: v0.3.1, one CSS file per component

- Every component now also ships as its own file in `dist/css/` (`button.css`, `field.css`, `checkbox.css`, `radio.css`, `select.css`, `link.css`, `notice.css`, `tag.css`, `card.css`), so a site loads only the parts it uses. `components.css` still holds them all.
- Each file needs only a theme's tokens; none depends on another. Each declares Saral's layer order first, so loading order cannot change the cascade.
- Button and Field together come to 1.24 kB gzipped, lighter than the 1.52 kB all-in-one file of v0.2.1.
- The build refuses a theme that shares a name with a component, since their files would collide.
- Asked for by the first site to adopt Saral, which measures its own page weight.

## 2026-10-12: v0.3.0, the v1 kit

- Five more components: Checkbox, Radio group, Select, Tag and Card. Checkbox and radio are native inputs in the theme's action colour at the 24 by 24 pixel minimum target; Select is a native drop-down in the field's frame.
- The three form controls follow the field's parts, so the same core validates them all: a radio group is checked as a whole, only when focus leaves it, and ticking a box or choosing an option clears its error at once.
- Card can be a whole-card link: only its title is the link, and other links inside stay their own.
- React: `Checkbox`, `RadioGroup`, `Select`, `Tag`, `Card`, all rendered on the server.
- Specs and portal pages for all five. Every component passes axe in Mor and Kosh, light and dark, with errors showing.
- The spec check caught a missing style (a tag's label), and the colour check was fixed so `white-space` is not read as the colour white.
- Decision record 0003: native form controls.
- A fresh review before release found five problems, all fixed with tests (119 node, 53 browser): the select lost its arrow in Windows High Contrast; a whole-card link covered every button and plain link inside the card; unticking a required checkbox showed its error before screen readers were told; a removable tag did nothing without script (it now removes through a link, and React `Tag` takes `removeHref`); and a disabled select looked enabled.

## 2026-10-12: portal deploys after every check passes

- GitHub Actions now publishes the documentation portal to Netlify, but only after every test, accessibility scan and the confidentiality check pass. A push to main goes live; a pull request gets its own preview link, posted on the pull request.
- The deploy waits for a `NETLIFY_AUTH_TOKEN` repository secret, created by the owner, and skips itself until then.

## 2026-10-12: a flaky test fixed

- A browser test counted form posts before the post had reached the test, so it failed now and then on the GitHub runner (once, on the v0.2.1 tag). The three tests that count posts now wait for the first post, then check that no second one arrives. They passed 100 runs out of 100 locally.

## 2026-10-12: documentation portal

- A documentation portal, built by Saral itself with no dependencies (`npm run site`, output in `site/dist`). Pages: an overview with the same markup in both themes and modes, these changes, the tokens with every contrast pair and its ratio, one page per component from its spec with live examples and their markup, and the decision and incident records.
- A switch for Mor, Kosh or no theme, in system, light or dark mode, remembered from page to page. Without JavaScript the portal reads in Mor and the switch is hidden.
- Every portal page passes axe (WCAG 2.2 AA) in both themes and both modes, tested in the browser.
- Live at saral-ds.netlify.app. `netlify.toml` holds the build settings; deploys run on Netlify's build servers.

## 2026-10-12: v0.2.1, field errors shown by CSS

- Field errors no longer use the `hidden` attribute. CSS shows the error when the input is `:user-invalid` (no script) or when the field has `data-invalid` (with script). A CSS reset that forces `[hidden]` off can no longer stop an error from showing.
- With no script, the error's own text now shows inline, so the fixture and README use the most useful general message as that text. React `Field` writes the type-mismatch message there when given, otherwise the value-missing one.
- Found by the first site to adopt Saral. Recorded as incident 0001, with three tests that now guard it.

## 2026-10-12: v0.2.0 released

- Tagged v0.2.0 and pushed. Update sent to the first consumer site's own session, with how to adopt the components using its own branding.

## 2026-10-12: phase 2, first components (v0.2)

- Field (label, input or textarea, hint, error), Button (primary, accent, secondary, pending), Link and Notice (info, success, warning, danger). Plain HTML and CSS that work with JavaScript off.
- Optional core script: errors show when a person leaves a field they typed in, in the page's own words; a failed submit shows every error and focuses the first; the submit button is marked pending and cannot post twice; a page restored by the back button is not left pending.
- React components on the same markup, with generated TypeScript types. Only `Form` is a client component.
- Browser tests with JavaScript on and off. Axe finds no WCAG 2.2 AA problems on the contact form in Mor or Kosh, light or dark, with errors showing.
- Component specs in `specs/`, checked against the CSS by tests.
- No runtime dependencies, enforced by a test. Saral learns from other systems but never depends on them.
- Packaging is ready for npm: an exports map for the CSS, tokens, core and React. Publishing waits for a decision.
- Fixed: a theme set on `<html>` now follows the system's dark mode.
- A fresh review before release found six problems, all fixed with tests (95 node, 23 browser): the button was marked pending before the site's own submit code ran, so a form sent by fetch or into a new tab went dead; an invalid control Saral does not manage blocked the submit without a word; overlapping instances could switch browser validation back on; the CSS and token imports had no types for strict TypeScript sites; a field written without an error element stopped the whole form's enhancement; and the README example missed a message and could not import in a plain page.
- Decision record 0002.

## 2026-10-12: Saral's own themes only

- Removed the Tailwind output. Saral ships its own CSS.
- Removed the theme copied from the first test site, and every mention of that site. A site that uses Saral brings its own look by setting Saral's variables; which users Saral names publicly is decided later.
- Added Kosh, a demo client theme: dark first, turmeric yellow, round corners. It passed every contrast and one-accent check on its first build. Saral's themes are now Mor and Kosh.
- The `$extensions` key is now `saral`.

## 2026-10-12: public

- Saral is public at github.com/AkashShivanand/saral, with tag v0.1.0. The guard's term list is a repository secret.

## 2026-10-12: phase 1, tokens (v0.1)

- Token compiler: reads DTCG 2025.10 files, resolves aliases, and builds CSS and JavaScript. Nothing is written if any check fails: a missing role, a contrast pair below its minimum, a second accent hue, or a fluid size that would not scale with text.
- Two themes, each in light and dark. Every declared text pair passes WCAG 2 AA in both modes, on the first build.
- Generated files are committed, and CI fails if they are stale. 65 tests.
- `fixtures/themes.html` shows both themes in both modes; `npm run serve` serves it.
- Decision record 0001: the token pipeline.
- A fresh review before release found eight problems, all fixed with tests (73 in total): durations under reduced motion were written as a bare `0`, which browsers reject; a mode forced on the page did not reach themed sections inside it (now `light-dark()` with `color-scheme`); broken colours were not named by token; malformed hex codes got through; theme files claimed to be standard resolver documents; a Finder `.DS_Store` crashed the build; and the preview server listened on the whole network.

## 2026-10-11: phase 0 done

- Confidentiality guard: blocks private names in staged files, file paths, binary files and commit messages, through git hooks and a CI workflow. It holds no terms and never prints one.
- README with the field example and the three themes, MIT licence, version rules, and a guide for AI agents.
- Exit check passed: the hook blocked a test commit and a test commit message.
- A fresh review found seven ways a name could slip through. All fixed with tests (32 in total): names inside images and PDFs, code spellings like camelCase, link targets, earlier versions in history, author emails, branch names and tag messages. CI now also scans the full history.
- Incident: during the live check, a private name written in capitals and run into a capitalised word (like `XYZPortal`) got past the hook and into a local commit. The commit was removed before anything was pushed, and the gap is now closed with a test (33 in total).
- The private name list starts with the three names the hub rules forbid. Akash adds the rest himself.

## 2026-10-11: themes and open questions settled

- Akash's answers: MIT licence (delegated); Saral will get its own domain, with docs on Netlify until then; Saral gets its own default theme; the demo client theme was delegated; the repo goes public at v0.1.
- Saral's default theme is Mor (peacock teal, squarer 4px corners, its own red for errors). The demo client is Kosh, a fictional savings app (dark first, turmeric yellow, rounder 14px corners). Each theme differs in colour, shape and density, which is the visible proof that Saral is headless.
- Phase 1 grows by one evening for Mor; about 23 evenings to v1.0.

## 2026-10-11: spec v2 after a pressure test

- A five-advisor review of the spec (Contrarian, First Principles, Expansionist, Outsider, Executor, with anonymous peer review) found the plan sized for a team, not one person working evenings, plus three real flaws: hover worked out in JavaScript would be dead before scripts load on a static site; OKLCH tokens would not match the site's hex values exactly; and hashed names in the guard could be cracked.
- Akash accepted all nine changes and set the budget at 3 to 4 evenings a week. The spec now has evening budgets per phase, a stop rule, interaction states in CSS (no JavaScript in simple components), the contact-form slice first, Figma before native, 0.x until the kit is complete, a guard whose terms live outside the repo, the case study after phase 2, and the README first.
- Still nothing built.

## 2026-10-11: project started

- Research done: `docs/research/headless-design-system-benchmark.md`, a sourced benchmark of headless architecture, tokens, failures of the big systems, AI and design workflow, and governance.
- Draft spec written for Akash's review: `docs/spec/2026-10-11-saral-v1-design.md`.
- Decisions by Akash, 2026-10-11: own repo, public; tokens plus a wider kit; code first with a generated Figma library; CSS-first; platform agnostic (tokens to web, iOS, Android and Figma; web components only in v1); headless; colours customisable, with a brand as a theme; the research's adjustments and five phases adopted.
- Nothing is built yet. The repo is local only and not yet on GitHub.
