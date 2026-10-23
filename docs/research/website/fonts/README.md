# Fonts for the claim-led mock

Trimmed copies of free fonts, used only by `claim.html` and its scripts-off pages. Each file loads only when a page shows that script (`unicode-range` in `claim.css`).

| File | Font | Source | Licence |
|---|---|---|---|
| `eczar-latin.woff2` | Eczar, weight 700 | [google/fonts, ofl/eczar](https://github.com/google/fonts/tree/main/ofl/eczar) | `OFL-eczar.txt` |
| `anek-latin.woff2` | Anek Latin, width 100, weights 400 to 700 | [ofl/aneklatin](https://github.com/google/fonts/tree/main/ofl/aneklatin) | `OFL-aneklatin.txt` |
| `anek-devanagari.woff2` | Anek Devanagari, width 100, weights 400 to 700 | [ofl/anekdevanagari](https://github.com/google/fonts/tree/main/ofl/anekdevanagari) | `OFL-anekdevanagari.txt` |
| `anek-tamil.woff2` | Anek Tamil, width 100, weights 400 to 700 | [ofl/anektamil](https://github.com/google/fonts/tree/main/ofl/anektamil) | `OFL-anektamil.txt` |
| `noto-arabic.woff2` | Noto Sans Arabic, width 100, weights 400 to 700 | [ofl/notosansarabic](https://github.com/google/fonts/tree/main/ofl/notosansarabic) | `OFL-notosansarabic.txt` |
| `noto-thai.woff2` | Noto Sans Thai, width 100, weights 400 to 700 | [ofl/notosansthai](https://github.com/google/fonts/tree/main/ofl/notosansthai) | `OFL-notosansthai.txt` |
| `noto-jp.woff2` | Noto Sans JP, weights 400 to 700 | [ofl/notosansjp](https://github.com/google/fonts/tree/main/ofl/notosansjp) | `OFL-notosansjp.txt` |

## How they are made

`../subset-fonts.py` makes them. It shapes every run of text on the generated pages with HarfBuzz, at weights 400, 500, 600 and 700, and keeps only the glyphs the shaper uses, including the ones it passes through on the way. It then shapes the same text with the cut font and stops if any glyph differs. The Latin files keep all of printable Latin, because the page writes numbers into itself.

To rebuild, download the seven `.ttf` files from the source folders above into a folder outside the repo, then:

```sh
pip install fonttools brotli uharfbuzz
node docs/research/website/build-claim.mjs
python3 docs/research/website/subset-fonts.py <that folder>
```

Rebuild the fonts whenever the mock's text changes.

## Sizes

All seven files come to about 105 kB, against 310 kB for the WOFF files they replace. The Devanagari file went from 170 kB to 13 kB: the old cut kept every conjunct the kept letters can form, this one keeps only what the page shows. First load, with Latin only, is 113 kB.

## Known limit

A file holds only the letters the mock shows. Text a visitor types in Hindi, Tamil, Arabic, Thai or Japanese falls back to a system font for letters the file lacks. The real site should keep full letter sets for scripts people type in, and cut per page only the display text.
