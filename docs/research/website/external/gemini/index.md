# Gemini references: AI-generated, not to be shipped

**Everything in this folder was made by Gemini on 2026-10-24. It is reference material for choosing Saral's website direction. Do not ship any of it:** not on the website, not in the docs, not in Figma, not in a package. The images are not Saral's work, they show invented interfaces, and their text and colours were never checked. Nothing here may be copied into `site/`, `dist/`, `packages/` or `tokens/`.

How it was made: the brief in `answer.md` was sent word for word in the Gemini web app (Pro mode). It answered with five directions and ten images in one go, so no follow-up was needed. Images were saved from the page at the size shown (1024 by 572) and stored here as JPEG at quality 88; nothing else was changed.

| File | What it is |
|---|---|
| `answer.md` | The full text answer, word for word |
| `1-translator-moodboard.jpg`, `1-translator-home.jpg` | Direction 1, The Translator |
| `2-bare-bones-moodboard.jpg`, `2-bare-bones-home.jpg` | Direction 2, Bare Bones |
| `3-chameleon-moodboard.jpg`, `3-chameleon-home.jpg` | Direction 3, The Chameleon |
| `4-blueprint-moodboard.jpg`, `4-blueprint-home.jpg` | Direction 4, Architectural Blueprint |
| `5-soft-contrast-moodboard.jpg`, `5-soft-contrast-home.jpg` | Direction 5, Soft Contrast |

What to watch for when reading these:

- The "home page" images are wireframes, not high-fidelity pages: grey bars stand in for text, and none shows the headline.
- The Translator moodboard mixes Devanagari and Arabic letters drawn by the image model; several are not real words.
- Several stated colours fail WCAG AA in use (neon green on white, pure red on grey, terracotta with white text); see `../final/contrast.json`.
