import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stage, checkManifests, manifests, publishedName, PACKAGES, GITHUB_REGISTRY } from './stage.mjs';

const out = () => mkdtempSync(join(tmpdir(), 'saral-stage-test-'));
const read = (dir, key) => JSON.parse(readFileSync(join(dir, key, 'package.json'), 'utf8'));

test('npm staging keeps the @saral names, with provenance and every exported file', () => {
  const s = stage({ registry: 'npm', out: out() });
  assert.deepEqual(s.packages.map((p) => p.name), PACKAGES.map((p) => `@saral/${p}`));
  for (const key of PACKAGES) {
    const m = read(s.out, key);
    assert.equal(m.publishConfig.provenance, true, key);
    assert.equal(m.publishConfig.access, 'public', key);
    assert.equal(m.repository, undefined, 'the repository is added by the release workflow');
    assert.ok(existsSync(join(s.out, key, 'LICENSE')) && existsSync(join(s.out, key, 'README.md')), key);
  }
  assert.ok(readdirSync(join(s.out, 'css', 'dist')).includes('components.css'));
  assert.ok(existsSync(join(s.out, 'core', 'types', 'index.d.mts')));
  assert.equal(read(s.out, 'react').dependencies['@saral/core'], s.version);
});

test('GitHub Packages staging renames under the owner scope and aliases core', () => {
  const s = stage({ registry: 'github', scope: 'someone', repo: 'someone/saral', out: out() });
  const react = read(s.out, 'react');
  assert.equal(react.name, '@someone/saral-react');
  assert.equal(react.dependencies['@saral/core'], `npm:@someone/saral-core@${s.version}`);
  assert.deepEqual(react.publishConfig, { registry: GITHUB_REGISTRY });
  assert.deepEqual(react.repository, { type: 'git', url: 'git+https://github.com/someone/saral.git', directory: 'packages/react' });
});

test('GitHub Packages staging needs a lowercase owner scope', () => {
  assert.throws(() => stage({ registry: 'github', out: out() }), /--scope/);
  assert.throws(() => stage({ registry: 'github', scope: '@Someone', out: out() }), /lowercase/);
  assert.equal(publishedName('@saral/css', 'github', 'someone'), '@someone/saral-css');
});

test('React imports core by package name, so it works once installed', () => {
  const source = readFileSync(join(stage({ out: out() }).out, 'react', 'src', 'form.mjs'), 'utf8');
  assert.match(source, /from '@saral\/core'/);
  assert.doesNotMatch(source, /\.\.\/\.\.\//);
});

test('manifest checks catch drifting versions, foreign dependencies and loose pins', () => {
  assert.deepEqual(checkManifests(manifests()), []);
  const bad = structuredClone(manifests());
  bad.css.version = '9.9.9';
  bad.core.dependencies = { lodash: '4.0.0' };
  bad.react.dependencies['@saral/core'] = '^0.1.0';
  bad.tokens.peerDependencies = { react: '>=19' };
  const errors = checkManifests(bad).join('\n');
  assert.match(errors, /same version/);
  assert.match(errors, /lodash is not allowed/);
  assert.match(errors, /must be pinned/);
  assert.match(errors, /packages\/tokens: peer dependency react/);
});
