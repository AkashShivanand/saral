# 0001: Token pipeline

Status: adopted, 2026-10-12

## Decision

- Tokens are written in DTCG 2025.10. Each theme has a resolver file with one set (shared tokens plus the theme's core) and one `theme` modifier with light and dark contexts. Saral reads the subset it uses: `{ "$ref" }` sources and whole-value aliases.
- Saral data with no DTCG type (font width, fluid sizes, reduced motion) lives under `$extensions` key `in.akashshivanand.saral`.
- A small own compiler, not Style Dictionary or Terrazzo, because neither covered the resolver and every planned output in October 2026.
- Generated files in `dist/` are committed, because the website installs Saral from a git tag with no build step. CI fails if `dist/` is stale.
- Theme CSS applies to `:root` without a theme attribute, or to an element with `data-saral-theme`, so several themes can sit on one page. `data-saral-mode` forces light or dark.

## Why

The research in `docs/research/` found that systems whose styling engine sat under their public interface forced migrations. Plain CSS custom properties, generated from one source, are the smallest public contract.
