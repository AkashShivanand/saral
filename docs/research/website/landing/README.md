# Fifteen landing pages, one per visual direction

Research, 24 October 2026. Each page is a complete landing page for Saral in one of the fifteen visual directions collected on 24 October (five from the owner's canvas, five from ChatGPT, five from Gemini), so the owner can open them side by side and choose. Open [`index.html`](index.html) through `npm run serve`: http://127.0.0.1:4321/docs/research/website/landing/

## How they are made

- `build-landing.mjs` writes every page from one set of markup and copy: header, hero, live theming, every script, works without JavaScript, components (generated from `specs/*.json`), platforms, accessibility and trust, footer. It also writes `landing.css` (Saral's own `dist/css` plus the shared layout), the picker and this README.
- `directions.mjs` holds one identity layer per direction: colour roles in light and dark, corners, fonts, CSS and the signature hero. Each theme only overrides Saral's roles; `tokens/` and `dist/` are untouched.
- Every component is real Saral markup with `data-scope` and `data-part`. `landing.mjs` loads the optional core script from `packages/core` for inline errors, and remembers the colour mode. Everything else, including the mode switch, the theme switch and the script switch, is CSS (`:has()` on native radios) and works with JavaScript off.
- The build checks 31 contrast pairs per theme in light and dark (Saral's 26 from `tokens/pairs.json`, plus input borders and errors on raised surfaces) for every page theme and every hero variant, and stops if one fails.
- `check-landing.mjs` serves the repo, opens every page in Chromium, runs axe (`@axe-core/playwright`, WCAG 2.0, 2.1 and 2.2 A and AA tags) in light and dark at 1280 and 375 pixels and with forced colours, checks sideways scroll at 375, reloads with JavaScript off and uses the theme and script switches, checks that no animation runs with reduced motion, measures first load, and takes the screenshots in `shots/`. It writes `results.json`, then rebuilds the picker and this README.

```sh
node docs/research/website/landing/build-landing.mjs
node docs/research/website/landing/check-landing.mjs
```

If the repo's Playwright has no browser of its own, set `CHROMIUM_PATH` to a Chromium it can drive. These results were taken with the Chromium build that Playwright 1.63 uses.

## Results

Weight is first load with fonts, as served locally without compression; the gzipped figure is what a normal host would send. "No JS" means the page reads fully with scripts off and the theme and script switches still work. "375 px" is any sideways scroll at that width. Axe runs seven times per page: light and dark at 1280 and 375 pixels, with every script blocked (axe cannot run where JavaScript is disabled; the switches are tested there instead), with forced colours, and on the scripts-off form's own page. In forced colours the system palette sets contrast and axe misreads it, so that pass leaves out axe's contrast rule and every screenshot was checked by eye. The colour changes list the brief's colour, the new one in the same hue, and the ratio before and after on the surface it is used on.

| # | Direction | First load | Axe | No JS | Forced colours | 375 px | Fonts | Colours changed for WCAG AA |
|---|---|---|---|---|---|---|---|---|
| 1 | [Neel](neel.html) | 142 kB (67 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Eczar and Anek Latin, self-hosted | None |
| 2 | [Two brands](two-brands.html) | 148 kB (67 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Anek Latin and Eczar, self-hosted; Theme A uses the system serif | Dark input border, reported at 2.82:1: #5A5A5A to #676767 (2.55:1 to 3.11:1 on #191919) |
| 3 | [Spec sheet](spec-sheet.html) | 132 kB (54 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Anek Latin, self-hosted; system mono | Signal orange on ink, dark: #B4460B to #d86a3b (2.90:1 to 4.59:1 on #222220); Focus ring on ink, dark: #B4460B to #b94b16 (2.90:1 to 3.10:1 on #222220) |
| 4 | [Plain sheet](plain-sheet.html) | 119 kB (45 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Atkinson Hyperlegible Next from Google Fonts, cut to Latin | Green button in dark, with black text: #00703C to #328b57 (3.16:1 to 4.63:1 on #0B0C0C); Link blue on black, dark: #1D4ED8 to #4374fe (2.78:1 to 4.58:1 on #121313); Yellow focus #FFDD00 is 1.4:1 on white, so in light the ring is black with a yellow halo outside it; in dark the ring itself is yellow (14.8:1) |
| 5 | [Kolam](kolam.html) | 144 kB (68 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Eczar and Anek Latin, self-hosted | Quiet text, reported at 3.53:1: #8A7E6B to #776b58 (3.53:1 to 4.63:1 on #F6F1E7); Vermilion on ink, dark: #B83A12 to #e36543 (2.72:1 to 4.62:1 on #27231D); Focus ring on ink, dark: #B83A12 to #c24422 (2.72:1 to 3.08:1 on #27231D) |
| 6 | [Living Material](living-material.html) | 118 kB (41 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Source Sans 3 from Google Fonts, cut to Latin; Noto and Anek for other scripts | Burnt clay text on ivory: #B85C38 to #b15531 (4.17:1 to 4.58:1 on #F8F5EF) |
| 7 | [Modular Architecture](modular-architecture.html) | 144 kB (69 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Space Grotesk and Inter from Google Fonts, cut to Latin | Cool grey edge as an input border: #DDE3EA to #898f96 (1.24:1 to 3.12:1 on #F8FAFC); Emerald status text, on its pale tint: #10B981 to #007e46 (2.27:1 to 4.62:1 on #E3F7EF); Emerald is status only (success), so cobalt stays the one accent hue |
| 8 | [Adaptive Prism](adaptive-prism.html) | 119 kB (41 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Plus Jakarta Sans from Google Fonts, cut to Latin | Aqua with white text and on porcelain: #06B6D4 to #007d8f (2.32:1 to 4.64:1 on #F8FAFC); Violet on midnight, dark: #7C3AED to #9c6dff (2.81:1 to 4.62:1 on #182136); Violet focus on midnight, dark: #7C3AED to #8244f3 (2.81:1 to 3.11:1 on #182136) |
| 9 | [Editorial Signal](editorial-signal.html) | 138 kB (64 kB gzipped) | no issues in 7 runs | Yes | Yes | None | DM Sans and Source Serif 4 from Google Fonts, cut to Latin | Signal orange with white text and on paper: #F97316 to #bd5200 (2.68:1 to 4.59:1 on #FAFAF7) |
| 10 | [Script and Signal](script-and-signal.html) | 138 kB (59 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Manrope and IBM Plex Mono from Google Fonts, cut to Latin | Magenta with white text and on chalk: #EC4899 to #d11c7e (3.23:1 to 4.60:1 on #F5F5F0); Cyan text on chalk: #06B6D4 to #007a8c (2.22:1 to 4.61:1 on #F5F5F0) |
| 11 | [The Translator](translator.html) | 175 kB (99 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Noto Sans and IBM Plex Mono from Google Fonts, cut to Latin; hero Arabic and Devanagari cut to the line | Neon green focus #00FF00 is 1.28:1 on chalk, so it is used only on black (15.3:1); on chalk the focus ring is black |
| 12 | [Bare Bones](bare-bones.html) | 155 kB (80 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Inter and Courier Prime from Google Fonts, cut to Latin | Browser blue on dark: #0000EE to #4681ff (1.77:1 to 4.64:1 on #1E1E1E); Red error text, on the grey canvas and its pale tint: #FF0000 to #d30000 (3.30:1 to 4.60:1 on #FCE4E4); Focus blue on dark: #0000EE to #205afb (1.77:1 to 3.11:1 on #1E1E1E); Visited purple on dark: #551A8B to #9d63d3 (1.70:1 to 4.60:1 on #121212) |
| 13 | [The Chameleon](chameleon.html) | 162 kB (77 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Roboto and Lora from Google Fonts, cut to Latin | None |
| 14 | [Architectural Blueprint](blueprint.html) | 161 kB (85 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Fira Sans and Fira Code from Google Fonts, cut to Latin | Blueprint blue as text on draft paper: #1E90FF to #0074d0 (3.14:1 to 4.62:1 on #FDFCF0); Dark mode is a true blueprint: navy ground with pale lines, and an amber focus ring (#FFD166, 9.1:1) |
| 15 | [Soft Contrast](soft-contrast.html) | 130 kB (56 kB gzipped) | no issues in 7 runs | Yes | Yes | None | Mulish and Source Code Pro from Google Fonts, cut to Latin | Soft terracotta with white text and on sand: #D97A6B to #ad4e3f (2.60:1 to 4.59:1 on #F4EDE4) |

## Weight

11 of 15 pages load 150 kB or less, fonts included, before compression; The Translator (175 kB), Bare Bones (155 kB), The Chameleon (162 kB), Architectural Blueprint (161 kB) go over, each because it loads two font families, or three for The Translator. Gzipped, every page is at or under 99 kB. The fixed cost is about 40.7 kB of shared CSS (all nine components and two base themes, 7.1 kB gzipped), the core script (8.1 kB), and the page itself with nine live forms. Google fonts are cut to printable Latin with the `text=` parameter, so each family is one small file. Each non-Latin script's font loads only when that script is shown, and the scripts-off frame loads only when it is opened.

## Known limits

- Translations are the drafts from `../translations.md`; the script fonts hold only those letters, so other text in those scripts falls back to a system font.
- The script switch names languages in English, so the picker itself does not load five script fonts on first view.
- Google Fonts are acceptable for research pages only. A chosen direction would self-host its fonts like `../fonts/`.
- Platform copy says what exists: packages are built and checked, and nothing is published until 0.4.0.
- No page names a site, product or company that uses Saral, and none has logos, testimonials, pricing or invented numbers. Figures come from the repo (specs, `tokens/pairs.json`, file sizes).
