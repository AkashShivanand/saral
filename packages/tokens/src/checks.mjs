// The build gates. Each returns a list of problems; any problem stops the
// build before a file is written.
import { parseColor, contrast, srgbToOklch } from './color.mjs';

export const EXT = 'in.akashshivanand.saral';

// Runs first, so the other checks only ever see colours that parse. Reports
// every broken colour, not just the first.
export function checkColors(modes) {
  const errors = [];
  for (const [mode, tokens] of Object.entries(modes)) {
    for (const [path, t] of tokens) {
      if (t.type !== 'color') continue;
      try {
        parseColor(t.value);
      } catch (e) {
        errors.push(`${mode}: ${path}: ${e.message}`);
      }
    }
  }
  return errors;
}

export function checkRoles(roles, modes) {
  const errors = [];
  for (const [mode, tokens] of Object.entries(modes)) {
    for (const role of roles) if (!tokens.has(role)) errors.push(`${mode}: missing role ${role}`);
  }
  return errors;
}

// Missing roles are reported by checkRoles, so a pair with a missing side is
// skipped here rather than reported twice.
export function checkPairs(pairs, modes) {
  const errors = [];
  for (const [mode, tokens] of Object.entries(modes)) {
    for (const { text, on, min } of pairs) {
      const a = tokens.get(text);
      const b = tokens.get(on);
      if (!a || !b) continue;
      const ratio = contrast(parseColor(a.value), parseColor(b.value));
      if (!(ratio >= min)) errors.push(`${mode}: ${text} on ${on} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
    }
  }
  return errors;
}

// Counts distinct hues among chromatic colours (OKLCH chroma 0.04 or more)
// outside feedback.*, which carries status, not brand. Hues within 30
// degrees count as one.
export function checkPolicy(policy, modes) {
  const errors = [];
  if (policy.accentHues === undefined) return errors;
  for (const [mode, tokens] of Object.entries(modes)) {
    const hues = [];
    for (const [path, t] of tokens) {
      if (t.type !== 'color' || path.startsWith('feedback.')) continue;
      const [, C, H] = srgbToOklch(parseColor(t.value));
      if (C < 0.04) continue;
      const near = (h) => Math.min(Math.abs(h - H), 360 - Math.abs(h - H)) <= 30;
      if (!hues.some(near)) hues.push(H);
    }
    if (hues.length > policy.accentHues) {
      const list = hues.map((h) => `${Math.round(h)}°`).join(', ');
      errors.push(`${mode}: ${hues.length} accent hues (${list}), the theme policy allows ${policy.accentHues}`);
    }
  }
  return errors;
}

export function checkFluid(modes) {
  const errors = [];
  const seen = new Set();
  for (const tokens of Object.values(modes)) {
    for (const [path, t] of tokens) {
      const fluid = t.extensions?.[EXT]?.fluid;
      if (!fluid || seen.has(path) || /rem\b/.test(fluid.preferred)) continue;
      seen.add(path);
      errors.push(`${path}: fluid size "${fluid.preferred}" has no rem term, so it ignores the reader's text size setting`);
    }
  }
  return errors;
}
