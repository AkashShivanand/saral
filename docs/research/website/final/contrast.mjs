#!/usr/bin/env node
// Checks the real colour pairs of all fifteen website directions against
// WCAG 2 AA with Saral's own contrast maths: 4.5 for text, 3 for large text
// and for controls and focus rings. Hex values are the ones each direction
// states (its canvas artboard, or the AI answer in ../external/). A direction
// with no dark palette is checked in dark mode as its plain inverse, and says so.
// Run: node docs/research/website/final/contrast.mjs   (writes contrast.json)
import { writeFileSync } from 'node:fs';
import { parseColor, contrast } from '../../../../packages/tokens/src/color.mjs';

const T = 4.5; const UI = 3;
// [what, foreground, background, minimum]
export const DIRECTIONS = {
  'Neel': { source: 'canvas', light: [['text', '#11163A', '#F6F7FB', T], ['muted text', '#3D4152', '#F6F7FB', T], ['button label', '#FFFFFF', '#3B47C4', T], ['link', '#2F3AB0', '#F6F7FB', T], ['error', '#B42318', '#FFFFFF', T], ['input border', '#8A90B8', '#FFFFFF', UI]], dark: [['text', '#E8EAF8', '#11163A', T], ['button label', '#0B0E26', '#9DA5F2', T], ['muted text', '#B8BDE6', '#0B0E26', T]] },
  'Two brands': { source: 'canvas', light: [['frame text', '#111111', '#FFFFFF', T], ['frame muted', '#444444', '#FFFFFF', T], ['A button', '#FFFFFF', '#9A3F1C', T], ['A text', '#3A1A0C', '#F3E7DA', T], ['B text', '#F2F2F2', '#111111', T], ['B button', '#111111', '#D7FF3A', T], ['B input border', '#5C5C5C', '#111111', UI]], dark: [['frame text', '#FFFFFF', '#111111', T], ['frame muted', '#BBBBBB', '#111111', T], ['A button', '#FFFFFF', '#9A3F1C', T], ['B button', '#111111', '#D7FF3A', T]], darkDerived: true },
  'Spec sheet': { source: 'canvas', light: [['text', '#1B1B19', '#FAFAF7', T], ['muted', '#45453F', '#FAFAF7', T], ['quiet', '#55554E', '#FAFAF7', T], ['orange button', '#FFFFFF', '#B4460B', T], ['stable label', '#1F6B2E', '#FFFFFF', T], ['preview label', '#9A4A00', '#FFFFFF', T], ['input border', '#8A8A82', '#FFFFFF', UI]], dark: [['text', '#FAFAF7', '#1B1B19', T], ['orange on ink', '#B4460B', '#1B1B19', T]], darkDerived: true },
  'Plain sheet': { source: 'canvas', light: [['text', '#0B0C0C', '#FFFFFF', T], ['link', '#1D4ED8', '#FFFFFF', T], ['green button', '#FFFFFF', '#00703C', T], ['focus text on yellow', '#0B0C0C', '#FFDD00', T], ['error', '#D4351C', '#FFFFFF', T], ['input border', '#0B0C0C', '#FFFFFF', UI]], dark: [['text', '#FFFFFF', '#0B0C0C', T], ['link inverted', '#1D4ED8', '#0B0C0C', T], ['green button', '#FFFFFF', '#00703C', T]], darkDerived: true },
  'Kolam': { source: 'canvas', light: [['text', '#1E1B16', '#F6F1E7', T], ['muted', '#3D3529', '#F6F1E7', T], ['vermilion outline label', '#B83A12', '#F6F1E7', T], ['ink button', '#F6F1E7', '#1E1B16', T], ['quiet', '#8C7E66', '#F6F1E7', T]], dark: [['text', '#F6F1E7', '#1E1B16', T], ['vermilion on ink', '#B83A12', '#1E1B16', T]], darkDerived: true },

  'ChatGPT 1, Living Material': { source: 'chatgpt', light: [['ink text', '#1F2937', '#F8F5EF', T], ['forest button', '#FFFFFF', '#155E45', T], ['clay button', '#FFFFFF', '#B85C38', T], ['clay text', '#B85C38', '#F8F5EF', T], ['ink on limestone', '#1F2937', '#E6D9C6', T]], dark: [['ivory on ink', '#F8F5EF', '#1F2937', T], ['forest on ink', '#155E45', '#1F2937', UI], ['clay on ink', '#B85C38', '#1F2937', T]], darkDerived: true },
  'ChatGPT 2, Modular Architecture': { source: 'chatgpt', light: [['navy text', '#111827', '#F8FAFC', T], ['cobalt button', '#FFFFFF', '#2563EB', T], ['emerald button', '#FFFFFF', '#10B981', T], ['emerald text', '#10B981', '#F8FAFC', T], ['grey line as control edge', '#DDE3EA', '#F8FAFC', UI]], dark: [['white on navy', '#F8FAFC', '#111827', T], ['cobalt on navy', '#2563EB', '#111827', T], ['emerald on navy', '#10B981', '#111827', T]], darkDerived: true },
  'ChatGPT 3, Adaptive Prism': { source: 'chatgpt', light: [['text', '#111827', '#F8FAFC', T], ['blue button', '#FFFFFF', '#2563EB', T], ['violet button', '#FFFFFF', '#7C3AED', T], ['aqua button', '#FFFFFF', '#06B6D4', T], ['aqua text', '#06B6D4', '#F8FAFC', T]], dark: [['text', '#F8FAFC', '#111827', T], ['violet on midnight', '#7C3AED', '#111827', T], ['aqua on midnight', '#06B6D4', '#111827', T]], darkDerived: true },
  'ChatGPT 4, Editorial Signal': { source: 'chatgpt', light: [['text', '#171717', '#FAFAF7', T], ['graphite', '#52525B', '#FAFAF7', T], ['orange button', '#FFFFFF', '#F97316', T], ['orange text', '#F97316', '#FAFAF7', T], ['pale grey edge', '#E5E7EB', '#FAFAF7', UI]], dark: [['text', '#FAFAF7', '#171717', T], ['orange on black', '#F97316', '#171717', T], ['black on orange', '#171717', '#F97316', T]], darkDerived: true },
  'ChatGPT 5, Script and Signal': { source: 'chatgpt', light: [['ink text', '#0B0F14', '#F5F5F0', T], ['magenta button', '#FFFFFF', '#EC4899', T], ['violet text', '#8B5CF6', '#F5F5F0', T], ['cyan text', '#06B6D4', '#F5F5F0', T]], dark: [['chalk on ink', '#F5F5F0', '#0B0F14', T], ['cyan on ink', '#06B6D4', '#0B0F14', T], ['magenta on ink', '#EC4899', '#0B0F14', T], ['violet on ink', '#8B5CF6', '#0B0F14', T]] },

  'Gemini 1, The Translator': { source: 'gemini', dark: [['chalk on black', '#F7F7F7', '#000000', T], ['green on black', '#00FF00', '#000000', T]], light: [['black on chalk', '#000000', '#F7F7F7', T], ['green focus on chalk', '#00FF00', '#F7F7F7', UI], ['green text on chalk', '#00FF00', '#F7F7F7', T]], lightDerived: true },
  'Gemini 2, Bare Bones': { source: 'gemini', light: [['link blue', '#0000EE', '#EFEFEF', T], ['visited purple', '#551A8B', '#EFEFEF', T], ['error red', '#FF0000', '#EFEFEF', T], ['white on red button', '#FFFFFF', '#FF0000', T]], dark: [['link blue on dark', '#0000EE', '#121212', T], ['red on dark', '#FF0000', '#121212', T]], darkDerived: true },
  'Gemini 3, The Chameleon': { source: 'gemini', light: [['charcoal on paper', '#111111', '#FAFAFA', T]], dark: [['paper on charcoal', '#FAFAFA', '#111111', T]] },
  'Gemini 4, Architectural Blueprint': { source: 'gemini', light: [['slate on draft', '#2F4F4F', '#FDFCF0', T], ['graphite on draft', '#333333', '#FDFCF0', T], ['blue text on draft', '#1E90FF', '#FDFCF0', T], ['white on blue button', '#FFFFFF', '#1E90FF', T]], dark: [['draft on slate', '#FDFCF0', '#2F4F4F', T], ['blue on slate', '#1E90FF', '#2F4F4F', T]], darkDerived: true },
  'Gemini 5, Soft Contrast': { source: 'gemini', light: [['forest on sand', '#1B3B36', '#F4EDE4', T], ['terracotta text on sand', '#D97A6B', '#F4EDE4', T], ['white on terracotta button', '#FFFFFF', '#D97A6B', T], ['forest on terracotta', '#1B3B36', '#D97A6B', T]], dark: [['sand on forest', '#F4EDE4', '#1B3B36', T], ['terracotta on forest', '#D97A6B', '#1B3B36', T]], darkDerived: true },
};

const rgb = (hex) => parseColor({ colorSpace: 'srgb', hex });
const ratio = (a, b) => Math.round(contrast(rgb(a), rgb(b)) * 100) / 100;
const out = {};
for (const [name, d] of Object.entries(DIRECTIONS)) {
  const rows = [];
  for (const mode of ['light', 'dark']) for (const [what, fg, bg, min] of d[mode]) {
    const r = ratio(fg, bg); rows.push({ mode, what, fg, bg, ratio: r, min, pass: r >= min });
  }
  const fails = rows.filter((r) => !r.pass);
  out[name] = { source: d.source, derived: d.darkDerived ? 'dark' : d.lightDerived ? 'light' : null, checked: rows.length, failed: fails.length, rows };
  console.log(`${name.padEnd(36)} ${String(rows.length - fails.length).padStart(2)}/${rows.length} pass${fails.length ? '  fails: ' + fails.map((f) => `${f.mode} ${f.what} ${f.ratio}`).join('; ') : ''}`);
}
writeFileSync(new URL('contrast.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
