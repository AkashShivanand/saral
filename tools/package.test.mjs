import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8'));

test('Saral has no runtime dependencies: it never depends on another framework', () => {
  assert.equal(pkg.dependencies, undefined);
});

test('React is only an optional peer, for the optional React adapter', () => {
  assert.deepEqual(Object.keys(pkg.peerDependencies ?? {}), ['react']);
  assert.equal(pkg.peerDependenciesMeta?.react?.optional, true);
});
