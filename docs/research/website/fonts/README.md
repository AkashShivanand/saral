# Fonts for the claim-led mock

Trimmed copies of free fonts, used only by `claim.html` and its scripts-off pages. Each file holds only the characters the mock shows, and loads only when a page shows that script (`unicode-range` in `claim.css`).

| File | Font | Source | Licence |
|---|---|---|---|
| `eczar-latin.woff` | Eczar, weight 700 | [google/fonts, ofl/eczar](https://github.com/google/fonts/tree/main/ofl/eczar) | `OFL-eczar.txt` |
| `anek-latin.woff` | Anek Latin, width 100, weights 400 to 700 | [ofl/aneklatin](https://github.com/google/fonts/tree/main/ofl/aneklatin) | `OFL-aneklatin.txt` |
| `anek-devanagari.woff` | Anek Devanagari, width 100, weights 400 to 700 | [ofl/anekdevanagari](https://github.com/google/fonts/tree/main/ofl/anekdevanagari) | `OFL-anekdevanagari.txt` |
| `anek-tamil.woff` | Anek Tamil, width 100, weights 400 to 700 | [ofl/anektamil](https://github.com/google/fonts/tree/main/ofl/anektamil) | `OFL-anektamil.txt` |
| `noto-arabic.woff` | Noto Sans Arabic, width 100, weights 400 to 700 | [ofl/notosansarabic](https://github.com/google/fonts/tree/main/ofl/notosansarabic) | `OFL-notosansarabic.txt` |
| `noto-thai.woff` | Noto Sans Thai, width 100, weights 400 to 700 | [ofl/notosansthai](https://github.com/google/fonts/tree/main/ofl/notosansthai) | `OFL-notosansthai.txt` |
| `noto-jp.woff` | Noto Sans JP, weights 400 to 700 | [ofl/notosansjp](https://github.com/google/fonts/tree/main/ofl/notosansjp) | `OFL-notosansjp.txt` |

Made on 2026-10-23 with fontTools: subset to the mock's text with the default shaping features, then the width axis pinned and the weight axis limited. WOFF, not WOFF2, because the machine had no Brotli encoder; the S8 build should ship WOFF2.

Known: the Devanagari file is about 170 kB, because correct shaping keeps every conjunct the retained letters can form. It loads only when Hindi is chosen, so it is outside the first-load budget. S8 should subset per page with a shaper-aware tool.
