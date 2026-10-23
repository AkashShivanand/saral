#!/usr/bin/env python3
# Cuts the claim mock's fonts down to the glyphs its pages actually show, and
# writes them as WOFF2. Shaper aware: every run of text is shaped with HarfBuzz
# at each weight the page uses, and only the glyphs the shaper picks are kept,
# instead of every conjunct the kept letters could form. The script then shapes
# the same text with the cut font and fails if any glyph differs.
#
# Needs: pip install fonttools brotli uharfbuzz
# Run after build-claim.mjs, with the folder holding the google/fonts sources:
#   python3 docs/research/website/subset-fonts.py <source folder>
import html
import re
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = Path(__file__).resolve().parent
OUT = HERE / 'fonts'
WEIGHTS = (400, 500, 600, 700)
LATIN = [(0x20, 0x7E), (0xA0, 0xFF), (0x2013, 0x2014), (0x2018, 0x201D), (0x2026, 0x2026), (0x20B9, 0x20B9)]

# Output file, source file, axis limits, the code points it covers (same as
# unicode-range in build-claim.mjs), and whether all of printable Latin is kept
# because the page writes numbers and words into it at run time.
FACES = [
    ('eczar-latin.woff2', 'Eczar[wght].ttf', {'wght': 700}, LATIN, True),
    ('anek-latin.woff2', 'AnekLatin[wdth,wght].ttf', {'wdth': 100, 'wght': (400, 700)}, LATIN, True),
    ('anek-devanagari.woff2', 'AnekDevanagari[wdth,wght].ttf', {'wdth': 100, 'wght': (400, 700)}, [(0x900, 0x97F), (0x1CD0, 0x1CFF), (0x200C, 0x200D), (0x25CC, 0x25CC), (0xA8E0, 0xA8FF)], False),
    ('anek-tamil.woff2', 'AnekTamil[wdth,wght].ttf', {'wdth': 100, 'wght': (400, 700)}, [(0xB80, 0xBFF), (0x200C, 0x200D), (0x25CC, 0x25CC)], False),
    ('noto-arabic.woff2', 'NotoSansArabic[wdth,wght].ttf', {'wdth': 100, 'wght': (400, 700)}, [(0x600, 0x6FF), (0x750, 0x77F), (0x200C, 0x200F), (0xFB50, 0xFDFF), (0xFE70, 0xFEFF)], False),
    ('noto-thai.woff2', 'NotoSansThai[wdth,wght].ttf', {'wdth': 100, 'wght': (400, 700)}, [(0xE00, 0xE7F), (0x200C, 0x200D)], False),
    ('noto-jp.woff2', 'NotoSansJP[wght].ttf', {'wght': (400, 700)}, [(0x3000, 0x303F), (0x3040, 0x309F), (0x30A0, 0x30FF), (0x4E00, 0x9FFF), (0xFF00, 0xFFEF)], False),
]


def page_text():
    """Text and attribute values of every generated page, scripts included."""
    out = []
    for f in sorted(HERE.glob('claim*.html')):
        src = f.read_text('utf8')
        out += [html.unescape(v) for v in re.findall(r'="([^"]*)"', src)]
        out.append(html.unescape(re.sub(r'<[^>]+>', ' ', src)))
    return '\n'.join(out)


def covered(ch, ranges):
    return any(a <= ord(ch) <= b for a, b in ranges)


def runs(text, ranges):
    """Each stretch of text in the face's ranges, spaces between words kept, and each word alone."""
    found, cur = set(), ''
    for ch in text + '\n':
        if covered(ch, ranges) and not ch.isspace() or (cur and ch in '  '):
            cur += ch
            continue
        if cur.strip():
            found.add(cur.strip())
            found.update(cur.split())
        cur = ''
    return found


def shape(path, strings, weights):
    """Glyph names the shaper ends with for each string, and every glyph it passes through on the way."""
    blob = hb.Blob.from_file_path(str(path))
    font = hb.Font(hb.Face(blob))
    names = TTFont(path).getGlyphOrder()
    result, seen = {}, set()
    for w in weights:
        font.set_variations({'wght': w})
        for s in strings:
            buf = hb.Buffer()
            buf.add_str(s)
            buf.guess_segment_properties()
            mapped = [False]

            def trace(msg):
                if msg.startswith('start table GSUB'):
                    mapped[0] = True
                if mapped[0] and msg.startswith(('start lookup', 'end lookup')):
                    seen.update(names[g.codepoint] for g in buf.glyph_infos)
                return True

            buf.set_message_func(trace)
            hb.shape(font, buf)
            result[(w, s)] = [names[g.codepoint] for g in buf.glyph_infos]
    seen.update(g for gs in result.values() for g in gs)
    return result, seen


def main(src):
    text = page_text()
    tmp = OUT / '_instance.ttf'
    for out, source, axes, ranges, all_latin in FACES:
        font = instancer.instantiateVariableFont(TTFont(Path(src) / source), axes)
        font.save(tmp)
        font = TTFont(tmp)
        weights = (axes['wght'],) if isinstance(axes['wght'], int) else WEIGHTS
        strings = runs(text, ranges)
        chars = {ch for s in strings for ch in s if covered(ch, ranges)}
        if all_latin:
            chars |= {chr(c) for a, b in LATIN for c in range(a, b + 1)}
            strings |= chars
        before, seen = shape(tmp, strings, weights)
        glyphs = {font.getGlyphOrder()[0]} | seen

        opts = subset.Options()
        opts.layout_features = ['*']
        opts.layout_closure = False
        opts.glyph_names = True
        opts.notdef_outline = True
        opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
        sub = subset.Subsetter(opts)
        sub.populate(glyphs=sorted(glyphs), unicodes=[ord(c) for c in chars])
        sub.subset(font)
        font.save(tmp)

        after, _ = shape(tmp, strings, weights)
        bad = [k for k in before if before[k] != after[k]]
        if bad:
            sys.exit(f'{out}: shaping changed for {len(bad)} strings, first {bad[0][1]!r} at {bad[0][0]}')

        font = TTFont(tmp)
        font['post'].formatType = 3.0
        font.flavor = 'woff2'
        font.save(OUT / out)
        print(f'{out}: {len(strings)} strings, {len(font.getGlyphOrder())} glyphs, {(OUT / out).stat().st_size / 1024:.1f} kB')
    tmp.unlink()


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__ or 'usage: subset-fonts.py <folder with the google/fonts .ttf files>')
    main(sys.argv[1])
