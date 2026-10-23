#!/usr/bin/env node
// The three identity directions as full Saral colour roles, written in OKLCH
// and checked with Saral's own build gates (checks.mjs): every role present,
// every contrast pair in tokens/pairs.json, and the one-accent-hue policy.
// Run: node docs/research/website/palettes.mjs   (writes palettes.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { checkColors, checkRoles, checkPairs, checkPolicy } from '../../../packages/tokens/src/checks.mjs';
import { oklchToSrgb, toHex, parseColor, contrast } from '../../../packages/tokens/src/color.mjs';

const ROOT = new URL('../../../', import.meta.url);
const roles = JSON.parse(readFileSync(new URL('tokens/roles.json', ROOT))).roles.filter((r) => !r.startsWith('radius.') && !r.startsWith('font.'));
const { pairs } = JSON.parse(readFileSync(new URL('tokens/pairs.json', ROOT)));

// Shared status colours, tuned per mode. Feedback is outside the hue policy.
const feedback = {
  light: {
    'feedback.danger.text': [0.5, 0.17, 27], 'feedback.danger.subtle': [0.96, 0.025, 27], 'feedback.danger.border': [0.5, 0.17, 27],
    'feedback.success.text': [0.47, 0.1, 150], 'feedback.success.subtle': [0.96, 0.03, 150], 'feedback.success.border': [0.47, 0.1, 150],
    'feedback.warning.text': [0.48, 0.1, 65], 'feedback.warning.subtle': [0.96, 0.04, 80], 'feedback.warning.border': [0.48, 0.1, 65],
    'feedback.info.text': [0.45, 0.1, 245], 'feedback.info.subtle': [0.96, 0.02, 245], 'feedback.info.border': [0.45, 0.1, 245],
  },
  dark: {
    'feedback.danger.text': [0.76, 0.13, 27], 'feedback.danger.subtle': [0.26, 0.06, 27], 'feedback.danger.border': [0.76, 0.13, 27],
    'feedback.success.text': [0.8, 0.13, 150], 'feedback.success.subtle': [0.26, 0.05, 150], 'feedback.success.border': [0.8, 0.13, 150],
    'feedback.warning.text': [0.84, 0.12, 80], 'feedback.warning.subtle': [0.27, 0.04, 80], 'feedback.warning.border': [0.84, 0.12, 80],
    'feedback.info.text': [0.82, 0.08, 245], 'feedback.info.subtle': [0.26, 0.04, 245], 'feedback.info.border': [0.82, 0.08, 245],
  },
};

// Builds one direction from a hue, a neutral hue and a few lightness choices.
function direction({ h, n, nc = 0.012, ac, light, dark }) {
  return {
    light: {
      'surface.ground': [light.ground, nc, n], 'surface.raised': [light.raised, nc * 0.5, n], 'surface.sunken': [light.ground - 0.035, nc * 1.4, n], 'surface.inverse': [0.21, light.ink, h],
      'text.default': [0.21, light.ink, h], 'text.muted': [0.43, light.ink * 0.7, h], 'text.quiet': [0.49, light.ink * 0.6, h], 'text.inverse': [light.ground, nc, n],
      'text.on-action': [0.99, 0.004, n], 'text.on-accent': [0.99, 0.004, n], 'text.disabled': [0.66, nc, n],
      'border.hairline': [light.ground - 0.07, nc * 1.4, n], 'border.strong': [0.55, light.ink * 0.6, h], 'border.focus': [light.action, ac, h],
      'action.default': [light.action, ac, h], 'action.hover': [light.action - 0.05, ac * 0.95, h], 'action.pressed': [light.action - 0.1, ac * 0.85, h], 'action.disabled': [light.ground - 0.035, nc * 1.4, n],
      'accent.default': [light.action, ac, h], 'accent.hover': [light.action - 0.05, ac * 0.95, h], 'accent.subtle': [0.95, Math.min(ac * 0.2, 0.03), h],
      ...feedback.light,
    },
    dark: {
      'surface.ground': [dark.ground, dark.tint, h], 'surface.raised': [dark.ground + 0.04, dark.tint * 1.1, h], 'surface.sunken': [dark.ground + 0.07, dark.tint * 1.2, h], 'surface.inverse': [0.94, nc, n],
      'text.default': [0.94, nc, n], 'text.muted': [0.77, Math.max(dark.tint, 0.012), h], 'text.quiet': [0.71, Math.max(dark.tint, 0.012), h], 'text.inverse': [dark.ground, dark.tint, h],
      'text.on-action': [dark.ground, dark.tint, h], 'text.on-accent': [dark.ground, dark.tint, h], 'text.disabled': [0.5, dark.tint, h],
      'border.hairline': [dark.ground + 0.1, dark.tint * 1.2, h], 'border.strong': [0.62, Math.max(dark.tint, 0.012), h], 'border.focus': [dark.action, dark.ac, h],
      'action.default': [dark.action, dark.ac, h], 'action.hover': [dark.action + 0.05, dark.ac * 0.9, h], 'action.pressed': [dark.action + 0.09, dark.ac * 0.8, h], 'action.disabled': [dark.ground + 0.07, dark.tint * 1.2, h],
      'accent.default': [dark.action, dark.ac, h], 'accent.hover': [dark.action + 0.05, dark.ac * 0.9, h], 'accent.subtle': [dark.ground + 0.08, Math.min(dark.ac * 0.4, 0.06), h],
      ...feedback.dark,
    },
  };
}

export const DIRECTIONS = {
  // Neel: indigo on undyed cotton, cool not cream. Light first.
  neel: direction({ h: 268, n: 268, nc: 0.01, ac: 0.15, light: { ground: 0.975, raised: 0.995, ink: 0.045, action: 0.4 }, dark: { ground: 0.17, tint: 0.035, action: 0.76, ac: 0.11 } }),
  // Kolam: rice flour on wet granite. Ink is the accent, so there is no hue at all.
  kolam: direction({ h: 250, n: 250, nc: 0.005, ac: 0.012, light: { ground: 0.97, raised: 0.995, ink: 0.01, action: 0.24 }, dark: { ground: 0.16, tint: 0.006, action: 0.93, ac: 0.012 } }),
  // Jamun: ripe jamun violet. Bold, dark ink of the fruit skin at night.
  jamun: direction({ h: 318, n: 318, nc: 0.01, ac: 0.17, light: { ground: 0.972, raised: 0.995, ink: 0.04, action: 0.42 }, dark: { ground: 0.16, tint: 0.03, action: 0.75, ac: 0.13 } }),
};

const asToken = ([L, C, H]) => {
  const hex = toHex(oklchToSrgb([L, C, H]));
  return { type: 'color', value: { colorSpace: 'srgb', hex } };
};

const report = {};
let failed = 0;
for (const [name, modes] of Object.entries(DIRECTIONS)) {
  const maps = Object.fromEntries(Object.entries(modes).map(([m, roleMap]) => [m, new Map(Object.entries(roleMap).map(([r, v]) => [r, asToken(v)]))]));
  const errors = [...checkColors(maps), ...checkRoles(roles, maps), ...checkPairs(pairs, maps), ...checkPolicy({ accentHues: 1 }, maps)];
  failed += errors.length;
  const ratios = {};
  for (const [m, tokens] of Object.entries(maps)) {
    ratios[m] = pairs.map((p) => ({ pair: `${p.text} on ${p.on}`, ratio: +contrast(parseColor(tokens.get(p.text).value), parseColor(tokens.get(p.on).value)).toFixed(2), min: p.min }));
  }
  report[name] = {
    errors,
    colours: Object.fromEntries(Object.entries(maps).map(([m, t]) => [m, Object.fromEntries([...t].map(([r, v]) => [r, v.value.hex]))])),
    lowest: Object.fromEntries(Object.entries(ratios).map(([m, list]) => [m, [...list].sort((a, b) => a.ratio / a.min - b.ratio / b.min).slice(0, 3)])),
    ratios,
  };
  console.log(`${name}: ${errors.length ? errors.join('\n  ') : 'passes every role, pair and policy check'}`);
  for (const m of ['light', 'dark']) console.log(`  ${m} tightest: ${report[name].lowest[m].map((x) => `${x.pair} ${x.ratio}:1 (needs ${x.min})`).join('; ')}`);
}
writeFileSync(new URL('palettes.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
process.exitCode = failed ? 1 : 0;
