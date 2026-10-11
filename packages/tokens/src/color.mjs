// Colour maths for the token compiler: DTCG colour objects to sRGB, OKLCH in
// both directions, and the WCAG 2 contrast ratio. Everything is converted in
// this one place, so every output agrees.
import { TokenError } from './errors.mjs';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function linearToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

// Out-of-gamut colours keep their lightness and hue; chroma is lowered by
// binary search until the colour fits sRGB.
export function oklchToSrgb([L, C, H]) {
  const h = (H * Math.PI) / 180;
  const at = (c) => oklabToLinear([L, c * Math.cos(h), c * Math.sin(h)]).map(toGamma);
  const fits = (rgb) => rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);
  let rgb = at(C);
  if (!fits(rgb)) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(at(mid))) lo = mid;
      else hi = mid;
    }
    rgb = at(lo);
  }
  return rgb.map(clamp01);
}

export function srgbToOklch(rgb) {
  const [L, a, b] = linearToOklab(rgb.map(toLinear));
  const H = (Math.atan2(b, a) * 180) / Math.PI;
  return [L, Math.hypot(a, b), H < 0 ? H + 360 : H];
}

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

export const toHex = (rgb) =>
  '#' + rgb.map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0')).join('');

export function parseColor(value) {
  if (value === null || typeof value !== 'object') {
    throw new TokenError(`a colour must be a DTCG colour object, got ${JSON.stringify(value)}`);
  }
  const { colorSpace, components, hex, alpha } = value;
  if (alpha !== undefined && alpha !== 1) throw new TokenError('alpha is not supported yet');
  if (colorSpace === 'srgb') {
    if (hex) {
      const rgb = hexToRgb(hex.toLowerCase());
      if (components && components.some((c, i) => Math.abs(c * 255 - rgb[i] * 255) > 1)) {
        throw new TokenError(`hex ${hex.toLowerCase()} does not match components [${components.join(', ')}]`);
      }
      return rgb;
    }
    return components.map(clamp01);
  }
  if (colorSpace === 'oklch') return oklchToSrgb(components);
  throw new TokenError(`colour space ${colorSpace} is not supported`);
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
