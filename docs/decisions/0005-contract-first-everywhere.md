# 0005: Contract first, everywhere

Status: adopted, 2026-10-13

## Decision

- Saral aims to be usable on every platform, framework and language, reached through one contract: tokens, parts (`data-scope` and `data-part`), state and ARIA. Every surface is compiled from that contract or checked against it.
- Tokens ship as a native package in each major ecosystem: npm, JSR, Swift Package Manager, Maven Central, pub.dev, NuGet and PyPI, plus Figma variables. All packages share one version and release together.
- Styles stay plain CSS, so any backend language that writes HTML can use Saral.
- Behaviour lives in the framework-free core. A Web Components layer (`@saral/elements`, light DOM, wrapping native elements) is the universal component layer.
- Framework adapters for React, Vue, Svelte and Angular are thin and generated from the specs. A conformance suite proves that every adapter renders the same markup as the reference HTML, passes axe, and works with JavaScript on and off.
- Native SwiftUI, Compose and Flutter components come only after web 1.0 is stable, as previews, from the same specs.
- The plan, phases and dates are in `docs/spec/2026-10-12-saral-master-plan.md`.

## Why

The owner wants Saral among the best design systems, usable everywhere. The v1 research refused the race for many framework adapters and native runtimes, because hand-written adapters multiplied the surface that broke other systems. Generating adapters from one contract and testing them against the same fixtures keeps that surface small enough for one person: an adapter cannot drift without a failing test.

Tokens are data, so shipping them to every registry is cheap and gives every platform the same colours, type and space from day one.

## What this changes

- Refused race 4 in the v1 research (multi-framework adapters and native component runtimes) is reversed for generated adapters only. Hand-written adapters and native component runtimes before web 1.0 stay refused.
- The repo becomes an npm workspaces monorepo with one package per layer.
- The other refused races (breadth for its own sake, hard widgets before 1.0, release count, MCP breadth) still hold.

## Amended 2026-10-13, after the pressure test

- Saral is built ready for every surface but publishes a surface only when a real user asks for it in an issue: other registries, the Swift, Compose, Flutter, .NET and Python token outputs, the Vue, Svelte and Angular adapters, and native components. Until then, npm, the CDN and Figma are the only published surfaces, and `@saral/elements` covers every framework.
- Generated adapters depend on a two-week trial in sprint 7 that tests normalised-HTML equality across frameworks. The result gets its own decision record.
- Each phase has a usage gate as well as a build gate, and a stop or pivot rule applies on 31 March 2027.
- 1.0 is about 20 components plus form patterns, aimed at forms and services that must work for everyone.

Why: the pressure test found that every milestone measured output and none measured demand, and that the work was larger than the hours. Building surfaces nobody uses would recreate the breadth race the v1 research refused.
