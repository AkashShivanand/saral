# 0001: Token pipeline

Status: adopted, 2026-10-12

## Decision

- Token files use the DTCG 2025.10 format: groups, `$type`, curly-brace aliases, and colour objects with `components` and `hex`. Each theme has a `theme.json` that lists its sources and its light and dark files. It is modelled on the DTCG Resolver module but is not a conformant resolver document, so it is not named `*.resolver.json`.
- Saral data with no DTCG type (font width, fluid sizes, reduced motion) lives under `$extensions` key `in.akashshivanand.saral`.
- A small own compiler, not Style Dictionary or Terrazzo, because neither covered the resolver and every planned output in October 2026.
- Generated files in `dist/` are committed, because the website installs Saral from a git tag with no build step. CI fails if `dist/` is stale.
- Theme CSS applies to `:root` without a theme attribute, or to an element with `data-saral-theme`, so several themes can sit on one page. When two theme files are loaded, the last one claims `:root`.
- Light and dark: colours that differ by mode are written as `light-dark()`, which follows the inherited `color-scheme`. The page follows the system; `data-saral-mode="light"` or `"dark"` on any element forces that mode for everything inside it, themed or not. Only colours may differ between modes.
- The Tailwind map names Saral's spacing `--spacing-saral-*` (utilities like `p-saral-4`), so Tailwind's own number scale is left alone.

## Why

The research in `docs/research/` found that systems whose styling engine sat under their public interface forced migrations. Plain CSS custom properties, generated from one source, are the smallest public contract.
