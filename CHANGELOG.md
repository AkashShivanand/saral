# Saral changelog

Project log, dated, newest first. Package release notes will be generated separately by changesets.

## 2026-10-12: phase 1, tokens (v0.1)

- Token compiler: reads DTCG 2025.10 files, resolves aliases, and builds CSS, JavaScript and a Tailwind theme map. Nothing is written if any check fails: a missing role, a contrast pair below its minimum, a second accent hue, or a fluid size that would not scale with text.
- Two themes, Mor and ember, each in light and dark. Every declared text pair passes WCAG 2 AA in both modes, on the first build.
- Ember equals akashshivanand.com for every variable the site uses, checked by a test. The site's `--quiet` was left out: it is never used and measures 2.95:1 on the page background.
- Generated files are committed, and CI fails if they are stale. 65 tests.
- `fixtures/themes.html` shows both themes in both modes; `npm run serve` serves it.
- Decision record 0001: the token pipeline.
- A fresh review before release found eight problems, all fixed with tests (73 in total): durations under reduced motion were written as a bare `0`, which browsers reject; a mode forced on the page did not reach themed sections inside it (now `light-dark()` with `color-scheme`); broken colours were not named by token; malformed hex codes got through; the Tailwind map took over Tailwind's number spacing; theme files claimed to be standard resolver documents; a Finder `.DS_Store` crashed the build; and the preview server listened on the whole network.

## 2026-10-11: phase 0 done

- Confidentiality guard: blocks private names in staged files, file paths, binary files and commit messages, through git hooks and a CI workflow. It holds no terms and never prints one.
- README with the field example and the three themes, MIT licence, version rules, and a guide for AI agents.
- Exit check passed: the hook blocked a test commit and a test commit message.
- A fresh review found seven ways a name could slip through. All fixed with tests (32 in total): names inside images and PDFs, code spellings like camelCase, link targets, earlier versions in history, author emails, branch names and tag messages. CI now also scans the full history.
- Incident: during the live check, a private name written in capitals and run into a capitalised word (like `XYZPortal`) got past the hook and into a local commit. The commit was removed before anything was pushed, and the gap is now closed with a test (33 in total).
- The private name list starts with the three names the hub rules forbid. Akash adds the rest himself.

## 2026-10-11: themes and open questions settled

- Akash's answers: MIT licence (delegated); Saral will get its own domain, with docs on Netlify until then; ember stays the website's theme and Saral gets its own; the demo client theme was delegated; the repo goes public at v0.1.
- Saral's default theme is Mor (peacock teal, squarer 4px corners, its own red for errors). The demo client is Kosh, a fictional savings app (dark first, turmeric yellow, rounder 14px corners). Each theme differs in colour, shape and density, which is the visible proof that Saral is headless.
- Phase 1 grows by one evening for Mor; about 23 evenings to v1.0.

## 2026-10-11: spec v2 after a pressure test

- A five-advisor review of the spec (Contrarian, First Principles, Expansionist, Outsider, Executor, with anonymous peer review) found the plan sized for a team, not one person working evenings, plus three real flaws: hover worked out in JavaScript would be dead before scripts load on a static site; OKLCH tokens would not match the site's hex values exactly; and hashed names in the guard could be cracked.
- Akash accepted all nine changes and set the budget at 3 to 4 evenings a week. The spec now has evening budgets per phase, a stop rule, interaction states in CSS (no JavaScript in simple components), ember in the site's exact hex, the contact-form slice first, Figma before native, 0.x until the kit is complete, a guard whose terms live outside the repo, the case study after phase 2, and the README first.
- Still nothing built.

## 2026-10-11: project started

- Research done: `docs/research/headless-design-system-benchmark.md`, a sourced benchmark of headless architecture, tokens, failures of the big systems, AI and design workflow, and governance.
- Draft spec written for Akash's review: `docs/spec/2026-10-11-saral-v1-design.md`.
- Decisions by Akash, 2026-10-11: own repo, public; tokens plus a wider kit; code first with a generated Figma library; CSS-first; platform agnostic (tokens to web, iOS, Android and Figma; web components only in v1); headless; colours customisable, with a brand as a theme; the research's adjustments and five phases adopted.
- Nothing is built yet. The repo is local only and not yet on GitHub.
