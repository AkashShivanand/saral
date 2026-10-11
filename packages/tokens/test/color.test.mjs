import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseColor, toHex, oklchToSrgb, srgbToOklch, contrast } from '../src/color.mjs';

const near = (a, b) =>
  [1, 3, 5].every((i) => Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16)) <= 1);

test('an srgb colour with hex parses to that hex', () => {
  assert.equal(toHex(parseColor({ colorSpace: 'srgb', components: [0.702, 0.2863, 0.1059], hex: '#b3491b' })), '#b3491b');
});

test('hex alone is accepted', () => {
  assert.equal(toHex(parseColor({ colorSpace: 'srgb', hex: '#F3F3F0' })), '#f3f3f0');
});

test('hex and components that disagree are an error', () => {
  assert.throws(() => parseColor({ colorSpace: 'srgb', components: [0, 0, 0], hex: '#ffffff' }), /hex #ffffff does not match components/);
});

test('components alone are used when there is no hex', () => {
  assert.equal(toHex(parseColor({ colorSpace: 'srgb', components: [1, 0, 0] })), '#ff0000');
});

test('oklch converts to srgb', () => {
  assert.ok(near(toHex(parseColor({ colorSpace: 'oklch', components: [0.62796, 0.25768, 29.234] })), '#ff0000'));
  assert.equal(toHex(parseColor({ colorSpace: 'oklch', components: [1, 0, 0] })), '#ffffff');
});

test('an out-of-gamut oklch colour is pulled into gamut and keeps its hue', () => {
  const rgb = oklchToSrgb([0.7, 0.4, 145]);
  assert.ok(rgb.every((v) => v >= 0 && v <= 1));
  assert.ok(Math.abs(srgbToOklch(rgb)[2] - 145) < 5);
});

test('unsupported colour spaces and alpha are errors', () => {
  assert.throws(() => parseColor({ colorSpace: 'display-p3', components: [1, 0, 0] }), /display-p3 is not supported/);
  assert.throws(() => parseColor({ colorSpace: 'srgb', hex: '#ffffff', alpha: 0.5 }), /alpha is not supported/);
});

test('WCAG contrast matches known values', () => {
  const c = (h) => parseColor({ colorSpace: 'srgb', hex: h });
  assert.equal(Number(contrast(c('#121314'), c('#f3f3f0')).toFixed(2)), 16.73);
  assert.equal(Number(contrast(c('#8b8e95'), c('#f3f3f0')).toFixed(2)), 2.95);
  assert.equal(Number(contrast(c('#000000'), c('#ffffff')).toFixed(2)), 21);
});
