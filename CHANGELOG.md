# Saral changelog

Project log, dated, newest first. Package release notes will be generated separately by changesets.

## 2026-10-11: phase 0 done

- Confidentiality guard: blocks private names in staged files, file paths, binary files and commit messages, through git hooks and a CI workflow. It holds no terms and never prints one.
- README with the field example and the three themes, MIT licence, version rules, and a guide for AI agents.
- Exit check passed: the hook blocked a test commit and a test commit message.

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
