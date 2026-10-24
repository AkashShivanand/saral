import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const pkg = read('package.json');
const PACKAGES = ['tokens', 'css', 'core', 'react'];

test('Saral has no runtime dependencies: it never depends on another framework', () => {
  assert.equal(pkg.dependencies, undefined);
});

test('React is only an optional peer, for the optional React adapter', () => {
  assert.deepEqual(Object.keys(pkg.peerDependencies ?? {}), ['react']);
  assert.equal(pkg.peerDependenciesMeta?.react?.optional, true);
});

test('published packages depend only on each other, and only React has a peer', () => {
  for (const p of PACKAGES) {
    const m = read(`packages/${p}/package.json`);
    for (const dep of Object.keys(m.dependencies ?? {})) assert.match(dep, /^@saral\//, `packages/${p} depends on ${dep}`);
    assert.deepEqual(Object.keys(m.peerDependencies ?? {}), p === 'react' ? ['react'] : [], `packages/${p}`);
    assert.equal(m.devDependencies, undefined, `packages/${p}: dev tools belong in the root package.json`);
  }
});

test('the private root shares the packages version, which the portal shows', () => {
  for (const p of PACKAGES) assert.equal(read(`packages/${p}/package.json`).version, pkg.version, `packages/${p}`);
});
