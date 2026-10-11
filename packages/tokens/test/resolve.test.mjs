import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { flatten, resolveAliases, loadResolver } from '../src/resolve.mjs';

test('flatten inherits $type from the nearest group', () => {
  const t = flatten({
    color: { $type: 'color', text: { default: { $value: 'x' } } },
    space: { 1: { $type: 'dimension', $value: { value: 4, unit: 'px' } } },
  });
  assert.equal(t.get('color.text.default').type, 'color');
  assert.equal(t.get('space.1').type, 'dimension');
});

test('aliases resolve through a chain and keep the type', () => {
  const t = resolveAliases(flatten({ a: { $type: 'number', $value: 1 }, b: { $value: '{a}' }, c: { $value: '{b}' } }));
  assert.equal(t.get('c').value, 1);
  assert.equal(t.get('c').type, 'number');
});

test('an alias cycle is an error that names the chain', () => {
  assert.throws(() => resolveAliases(flatten({ a: { $value: '{b}' }, b: { $value: '{a}' } })), /alias cycle: a -> b -> a/);
});

test('an alias to a missing token is an error that names both', () => {
  assert.throws(() => resolveAliases(flatten({ a: { $value: '{nope.x}' } })), /a points to \{nope\.x\}, which does not exist/);
});

function resolverFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'saral-res-'));
  const w = (f, o) => writeFileSync(join(dir, f), JSON.stringify(o));
  w('base.json', { n: { $type: 'number', $value: 1 }, c: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 1, 1], hex: '#ffffff' } } });
  w('light.json', {});
  w('dark.json', { n: { $value: 2 }, c: { $value: { colorSpace: 'srgb', components: [0, 0, 0] } } });
  w('t.resolver.json', {
    version: '2025.10',
    sets: [{ name: 'base', sources: [{ $ref: 'base.json' }] }],
    modifiers: { theme: { default: 'light', contexts: { light: [{ $ref: 'light.json' }], dark: [{ $ref: 'dark.json' }] } } },
  });
  return join(dir, 't.resolver.json');
}

test('the resolver applies sets, then the chosen context; later sources win and keep $type', () => {
  const file = resolverFixture();
  const dark = flatten(loadResolver(file, { theme: 'dark' }));
  assert.equal(dark.get('n').value, 2);
  assert.equal(dark.get('n').type, 'number');
  assert.equal(flatten(loadResolver(file)).get('n').value, 1);
});

test('a $value is replaced whole, never merged key by key', () => {
  const dark = flatten(loadResolver(resolverFixture(), { theme: 'dark' }));
  assert.deepEqual(dark.get('c').value, { colorSpace: 'srgb', components: [0, 0, 0] });
});

test('an unknown context is an error', () => {
  assert.throws(() => loadResolver(resolverFixture(), { theme: 'dim' }), /modifier "theme" has no context "dim"/);
});
