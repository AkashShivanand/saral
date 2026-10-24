#!/usr/bin/env node
// The two finalists as full Saral colour roles, checked with Saral's own build
// gates (checks.mjs): every role present, every pair in tokens/pairs.json, and
// the one-accent-hue policy. Neel comes from ../palettes.json (already checked
// there); Spec sheet is new, taken from its canvas artboard and given a dark mode.
// Run: node docs/research/website/final/palettes.mjs   (writes palettes.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { checkColors, checkRoles, checkPairs, checkPolicy } from '../../../../packages/tokens/src/checks.mjs';
import { parseColor, contrast } from '../../../../packages/tokens/src/color.mjs';

const ROOT = new URL('../../../../', import.meta.url);
const roles = JSON.parse(readFileSync(new URL('tokens/roles.json', ROOT))).roles.filter((r) => !r.startsWith('radius.') && !r.startsWith('font.'));
const { pairs } = JSON.parse(readFileSync(new URL('tokens/pairs.json', ROOT)));
const neel = JSON.parse(readFileSync(new URL('../palettes.json', import.meta.url))).neel.colours;

// Status colours shared with Mor, so only the identity differs.
const feedback = {
  light: { 'feedback.danger.text': '#b42318', 'feedback.danger.subtle': '#fdecea', 'feedback.danger.border': '#b42318', 'feedback.success.text': '#1e6b3a', 'feedback.success.subtle': '#e7f3ec', 'feedback.success.border': '#1e6b3a', 'feedback.warning.text': '#7a4b00', 'feedback.warning.subtle': '#fdf3e1', 'feedback.warning.border': '#7a4b00', 'feedback.info.text': '#0b4a50', 'feedback.info.subtle': '#e6f0ef', 'feedback.info.border': '#0b5f66' },
  dark: { 'feedback.danger.text': '#ff8f80', 'feedback.danger.subtle': '#3a1714', 'feedback.danger.border': '#ff8f80', 'feedback.success.text': '#6fcf8f', 'feedback.success.subtle': '#13291b', 'feedback.success.border': '#6fcf8f', 'feedback.warning.text': '#f2c46b', 'feedback.warning.subtle': '#2e2410', 'feedback.warning.border': '#f2c46b', 'feedback.info.text': '#8fd0d4', 'feedback.info.subtle': '#12302f', 'feedback.info.border': '#5fb8be' },
};

// Spec sheet: ink on unbleached paper, one signal orange. Action is the ink
// itself, so the orange stays rare: links, focus and the accent button.
export const SPEC = {
  light: {
    'surface.ground': '#fafaf7', 'surface.raised': '#ffffff', 'surface.sunken': '#f0f0ea', 'surface.inverse': '#1b1b19',
    'text.default': '#1b1b19', 'text.muted': '#45453f', 'text.quiet': '#55554e', 'text.inverse': '#fafaf7', 'text.on-action': '#fafaf7', 'text.on-accent': '#ffffff', 'text.disabled': '#8a8a82',
    'border.hairline': '#d9d9d2', 'border.strong': '#6e6e66', 'border.focus': '#b4460b',
    'action.default': '#1b1b19', 'action.hover': '#34342f', 'action.pressed': '#4a4a44', 'action.disabled': '#f0f0ea',
    'accent.default': '#b4460b', 'accent.hover': '#963a09', 'accent.subtle': '#fbede4',
    ...feedback.light,
  },
  dark: {
    'surface.ground': '#121211', 'surface.raised': '#1a1a18', 'surface.sunken': '#232321', 'surface.inverse': '#edede8',
    'text.default': '#edede8', 'text.muted': '#b5b5ac', 'text.quiet': '#a3a39a', 'text.inverse': '#121211', 'text.on-action': '#121211', 'text.on-accent': '#121211', 'text.disabled': '#6e6e66',
    'border.hairline': '#2e2e2b', 'border.strong': '#8a8a82', 'border.focus': '#f08a4b',
    'action.default': '#edede8', 'action.hover': '#d6d6cf', 'action.pressed': '#bebeb6', 'action.disabled': '#232321',
    'accent.default': '#f08a4b', 'accent.hover': '#f5a574', 'accent.subtle': '#3a2414',
    ...feedback.dark,
  },
};

// Recommended: Neel with one change borrowed from Spec sheet. Main actions use
// the indigo ink, so the bright indigo is left for the accent and the two
// button variants can be told apart (in Neel they were the same colour).
export const FINAL = {
  light: { ...neel.light, 'action.default': '#0f172d', 'action.hover': '#24304f', 'action.pressed': '#364266' },
  dark: { ...neel.dark, 'action.default': '#e8ebf2', 'action.hover': '#cfd6e6', 'action.pressed': '#b8c2d8' },
};

const asMaps = (modes) => Object.fromEntries(Object.entries(modes).map(([m, roleMap]) => [m, new Map(Object.entries(roleMap).map(([r, hex]) => [r, { type: 'color', value: { colorSpace: 'srgb', hex } }]))]));
const report = {};
let failed = 0;
for (const [name, modes] of Object.entries({ neel, spec: SPEC, final: FINAL })) {
  const maps = asMaps(modes);
  const errors = [...checkColors(maps), ...checkRoles(roles, maps), ...checkPairs(pairs, maps), ...checkPolicy({ accentHues: 1 }, maps)];
  failed += errors.length;
  const tight = Object.fromEntries(Object.entries(maps).map(([m, t]) => [m, pairs.map((p) => ({ pair: `${p.text} on ${p.on}`, ratio: +contrast(parseColor(t.get(p.text).value), parseColor(t.get(p.on).value)).toFixed(2), min: p.min })).sort((a, b) => a.ratio / a.min - b.ratio / b.min).slice(0, 3)]));
  report[name] = { errors, pairs: pairs.length, colours: modes, tightest: tight };
  console.log(`${name}: ${errors.length ? errors.join('\n  ') : `passes all ${pairs.length} pairs in light and dark, every role and the one-accent-hue policy`}`);
  for (const m of ['light', 'dark']) console.log(`  ${m} tightest: ${tight[m].map((x) => `${x.pair} ${x.ratio}:1 (needs ${x.min})`).join('; ')}`);
}
writeFileSync(new URL('palettes.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
process.exitCode = failed ? 1 : 0;
