# 0004: Open core

Status: adopted, 2026-10-12
Site: no

## Decision

- Saral is open source under the MIT licence, and stays that way: tokens, CSS, core, the React adapter, specs, tests and the documentation portal. Everything in this repo.
- The free system is complete on its own. No component, theme or fix is held back to be sold.
- Paid work, if there is any, sits on top of Saral and outside this repo: page templates and blocks built with Saral, a Figma kit, and help for teams setting it up. It depends on Saral; Saral never depends on it.
- The name is not covered by the licence. Anyone can use, change and ship the code; only the owner's releases are called Saral. `TRADEMARK.md` says what is allowed.
- Contributions follow `CONTRIBUTING.md`: issues and small fixes are welcome; a new component or an API change starts as an issue, because every component needs a spec first.

## Why

The repo has been public under MIT since v0.1, so the code is already out and the licence cannot be taken back for what is published. Tokens and CSS also reach every browser that loads them, so closing the source would protect very little.

A design system is chosen for years. Teams adopt one they can read, check for accessibility and fork if it is abandoned. Source-available or non-commercial licences remove that trust and slow adoption more than they protect income.

The model is the one Tailwind uses: a free framework that is complete on its own, with paid templates and components built on top of it. This is about the business model only. Saral still ships its own CSS and no Tailwind output.

## Not chosen

- A private repo with only the built files public. Hides little, costs trust, and the published history stays public.
- A source-available licence (business source or non-commercial). Kills adoption for a design system.
- A switch to Apache 2.0. It adds a patent grant and states that trademarks are not licensed, but MIT plus `TRADEMARK.md` covers the name, and changing the licence after release adds confusion for little gain.
