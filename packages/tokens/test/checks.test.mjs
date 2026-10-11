import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkRoles, checkPairs, checkPolicy, checkFluid, checkColors, EXT } from '../src/checks.mjs';

const color = (hex) => ({ type: 'color', value: { colorSpace: 'srgb', hex }, extensions: {} });
const modes = (light, dark = light) => ({ light: new Map(Object.entries(light)), dark: new Map(Object.entries(dark)) });

test('checkRoles names the mode a role is missing from', () => {
  assert.deepEqual(checkRoles(['a'], modes({ a: color('#000000') }, {})), ['dark: missing role a']);
});

test('checkPairs passes high contrast and reports low contrast with the numbers', () => {
  const pairs = [{ text: 't', on: 'g', min: 4.5 }];
  assert.deepEqual(checkPairs(pairs, modes({ t: color('#121314'), g: color('#f3f3f0') })), []);
  const errs = checkPairs(pairs, modes({ t: color('#8b8e95'), g: color('#f3f3f0') }));
  assert.equal(errs.length, 2);
  assert.match(errs[0], /^light: t on g is 2\.95:1, needs 4\.5:1$/);
});

test('checkPolicy allows one accent hue in several shades', () => {
  const m = modes({ 'accent.default': color('#b3491b'), 'accent.hover': color('#8f3813'), 'border.focus': color('#b3491b') });
  assert.deepEqual(checkPolicy({ accentHues: 1 }, m), []);
});

test('checkPolicy reports a second accent hue', () => {
  const m = modes({ 'accent.default': color('#0b5f66'), 'border.focus': color('#b3491b') });
  assert.match(checkPolicy({ accentHues: 1 }, m)[0], /^light: 2 accent hues/);
});

test('checkPolicy ignores greys and feedback colours', () => {
  const m = modes({ 'accent.default': color('#0b5f66'), 'text.default': color('#5e6168'), 'feedback.danger.text': color('#b42318') });
  assert.deepEqual(checkPolicy({ accentHues: 1 }, m), []);
});

test('checkFluid requires a rem term in fluid sizes, once per token', () => {
  const fluid = (preferred) => ({
    type: 'dimension',
    value: { value: 32, unit: 'px' },
    extensions: { [EXT]: { fluid: { min: { value: 32, unit: 'px' }, max: { value: 56, unit: 'px' }, preferred } } },
  });
  assert.deepEqual(checkFluid(modes({ h1: fluid('1.5rem + 2.5vw') })), []);
  assert.deepEqual(checkFluid(modes({ h1: fluid('5vw') })), ['h1: fluid size "5vw" has no rem term, so it ignores the reader\'s text size setting']);
});

test('checkColors reports every broken colour with its mode and path', () => {
  const bad = { type: 'color', value: { colorSpace: 'srgb', components: [0, 0, 0], hex: '#ffffff' }, extensions: {} };
  const errs = checkColors(modes({ a: bad, b: color('#12131'), ok: color('#ffffff') }, { ok: color('#ffffff') }));
  assert.equal(errs.length, 2);
  assert.match(errs[0], /^light: a: hex #ffffff does not match components/);
  assert.match(errs[1], /^light: b: hex #12131 is not a 6-digit hex colour/);
});
