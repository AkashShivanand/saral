# ChatGPT references: AI-generated, not to be shipped

**Everything in this folder was made by ChatGPT on 2026-10-24. It is reference material for choosing Saral's website direction. Do not ship any of it:** not on the website, not in the docs, not in Figma, not in a package. The images are not Saral's work, they show invented interfaces with invented content, and their text and colours were never checked. Nothing here may be copied into `site/`, `dist/`, `packages/` or `tokens/`.

How it was made: the brief in `answer.md` was sent word for word in the ChatGPT web app (default model). Its first reply gave five directions in text, six sheets that each show five directions at once, and web photos as moodboards. The per-direction images were then asked for one direction at a time, as the brief allows. Images were saved from the page as PNG and stored here as JPEG at quality 85 to keep the repo small; nothing else was changed.

| File | What it is |
|---|---|
| `answer.md` | The full text answer, word for word, and the follow-up messages sent |
| `1-living-material.jpg` | Direction 1, Living Material: moodboard (left) and home page (right) in one image |
| `2-modular-architecture-a.jpg`, `2-modular-architecture-b.jpg` | Direction 2, Modular Architecture: two drafts ChatGPT offered side by side |
| `3-adaptive-prism.jpg` | Direction 3, Adaptive Prism: moodboard and home page |
| `4-editorial-signal.jpg` | Direction 4, Editorial Signal: moodboard and home page |
| `5-script-and-signal.jpg` | Direction 5, Script & Signal: moodboard and home page |
| `sheet-1.jpg` to `sheet-6.jpg` | First-reply sheets, each laying out five directions at once. Their direction names (for example Earth and Craft, Clay and Light, Quiet Layers) do not match the text answer; kept only as a record |

Not saved: the "Moodboard reference" photos ChatGPT showed under each direction. They were found on other websites, so they are other people's work, not generated.

What to watch for when reading these:

- Palettes repeat Tailwind's default colours (`#2563EB`, `#10B981`, `#111827`, `#7C3AED`, `#06B6D4`, `#F97316`). Several accent colours fail WCAG AA as text or as a button with white text; see `../final/contrast.json`.
- The home pages show invented case-study cards ("A government website", "A financial platform") and invented figures. They name no real site.
- The Devanagari and Arabic shown in the images are drawn by the image model and may be wrong.
