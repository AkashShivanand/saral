# Saral changelog

Project log, dated, newest first. Package release notes will be generated separately by changesets.

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
