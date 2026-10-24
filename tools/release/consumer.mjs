// A clean project that installs Saral the way a site would, then uses every
// entry point: CSS, tokens, core and React, from Node and from TypeScript.
// Used by check.mjs (packed tarballs) and rehearse.mjs (a local registry).
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, PACKAGES } from './stage.mjs';

const rootPkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
// The consumer gets the same React the repo tests with.
export const REACT = {
  react: rootPkg.devDependencies.react,
  'react-dom': rootPkg.devDependencies['react-dom'],
  '@types/react': rootPkg.devDependencies['@types/react'],
};

// Everything a consumer's install may contain. Anything else means Saral
// pulled in a runtime dependency (AGENTS.md rule 10).
const ALLOWED = new Set(['react', 'react-dom', 'scheduler', '@types/react', 'csstype']);

export function npm(args, cwd, env = {}) {
  return execFileSync('npm', args, { cwd, encoding: 'utf8', env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
}

// Packs each staged package and checks what went into the tarball.
export function pack(staged, dest) {
  mkdirSync(dest, { recursive: true });
  const tarballs = {};
  for (const p of staged.packages) {
    const [info] = JSON.parse(npm(['pack', '--json', '--pack-destination', dest], p.dir));
    const files = info.files.map((f) => f.path);
    for (const f of files) {
      assert.ok(!/(^|\/)(test|tests|fixtures)\//.test(f) && !/\.test\./.test(f), `${p.name} must not ship ${f}`);
    }
    for (const f of ['package.json', 'LICENSE', 'README.md']) assert.ok(files.includes(f), `${p.name} is missing ${f}`);
    // A package may only import its own files, React, or another Saral package.
    for (const f of files.filter((x) => x.endsWith('.mjs'))) {
      const source = readFileSync(join(p.dir, f), 'utf8');
      for (const [, spec] of source.matchAll(/\bfrom\s+'([^']+)'/g)) {
        const ok = spec.startsWith('./') || spec === 'react' || spec.startsWith('react-dom') || /^@saral\/[a-z]+$/.test(spec);
        assert.ok(ok, `${p.name} ${f} imports '${spec}', which a consumer cannot resolve`);
      }
    }
    tarballs[p.key] = join(dest, info.filename);
  }
  return tarballs;
}

// Creates the project and installs. deps maps a dependency name to its spec.
export function install(dir, deps, npmrc = '') {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'saral-consumer', private: true, type: 'module', dependencies: { ...deps, ...REACT } }, null, 2));
  writeFileSync(join(dir, '.npmrc'), npmrc);
  npm(['install', '--no-audit', '--no-fund', '--ignore-scripts'], dir);
}

const SMOKE = `
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import mor from '@saral/tokens/mor.mjs';
import kosh from '@saral/tokens/kosh.mjs';
import { enhanceForm, enhanceField, setPending } from '@saral/core';
import { Form, Field, Checkbox, RadioGroup, Select, Button, Link, Notice, Tag, Card } from '@saral/react';

const css = (path) => readFileSync(fileURLToPath(import.meta.resolve(path)), 'utf8');
assert.match(css('@saral/css/mor.css'), /--saral-surface-ground:/);
assert.match(css('@saral/css/kosh.css'), /data-saral-theme="kosh"/);
assert.match(css('@saral/css/components.css'), /data-scope="button"/);
for (const c of ['button', 'card', 'checkbox', 'field', 'link', 'notice', 'radio', 'select', 'tag']) {
  assert.match(css('@saral/css/' + c + '.css'), new RegExp('data-scope="' + c + '"'), c + '.css');
}

for (const theme of [mor, kosh]) {
  for (const mode of ['light', 'dark']) assert.equal(typeof theme[mode]['surface.ground'], 'string');
}

for (const fn of [enhanceForm, enhanceField, setPending]) assert.equal(typeof fn, 'function');

const html = renderToStaticMarkup(
  h(Form, { method: 'post', action: '/contact' },
    h(Field, { label: 'Email', name: 'email', type: 'email', required: true }),
    h(Button, { type: 'submit' }, 'Send')),
);
assert.match(html, /^<form [^>]*action="\\/contact"/);
assert.match(html, /<input[^>]*data-scope="field" data-part="input"/);
assert.match(html, /<button type="submit" data-scope="button" data-part="root"/);
for (const C of [Checkbox, RadioGroup, Select, Link, Notice, Tag, Card]) assert.equal(typeof C, 'function');

// Only the public entry points resolve.
assert.throws(() => import.meta.resolve('@saral/core/src/form.mjs'), /ERR_PACKAGE_PATH_NOT_EXPORTED|not exported/);

// React uses the core the site installed, not a second copy.
assert.equal(existsSync('node_modules/@saral/react/node_modules'), false, 'React brought its own copy of core');
console.log('ok');
`;

const TYPES = [
  "import '@saral/css/mor.css';",
  "import '@saral/css/components.css';",
  "import '@saral/css/button.css';",
  "import mor from '@saral/tokens/mor.mjs';",
  "import { enhanceForm, setPending } from '@saral/core';",
  "import { Button, Field, Form, Link, Notice } from '@saral/react';",
  "const ground: string = mor.light['surface.ground'];",
  "const handle = enhanceForm(document.createElement('form'));",
  'handle.destroy();',
  'export { ground, setPending, Button, Field, Form, Link, Notice };',
].join('\n');

// Runs the smoke test in Node, then type-checks the same imports with the
// repo's TypeScript under both module resolutions a site may use.
export function smoke(dir) {
  const lock = JSON.parse(readFileSync(join(dir, 'package-lock.json'), 'utf8'));
  const installed = Object.keys(lock.packages)
    .filter((k) => k.startsWith('node_modules/'))
    .map((k) => k.replace(/^.*node_modules\//, ''));
  const saral = new Set(PACKAGES.map((p) => `@saral/${p}`));
  const extra = installed.filter((n) => !ALLOWED.has(n) && !saral.has(n));
  assert.deepEqual(extra, [], `the install pulled in packages Saral must not depend on: ${extra.join(', ')}`);

  writeFileSync(join(dir, 'smoke.mjs'), SMOKE);
  const run = spawnSync(process.execPath, ['smoke.mjs'], { cwd: dir, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stdout + run.stderr);

  writeFileSync(join(dir, 'index.mts'), TYPES);
  const tsc = join(ROOT, 'node_modules', '.bin', 'tsc');
  assert.ok(existsSync(tsc), 'run npm ci first: TypeScript is missing');
  for (const [module, moduleResolution] of [['ESNext', 'bundler'], ['NodeNext', 'NodeNext']]) {
    const config = `tsconfig.${moduleResolution}.json`;
    writeFileSync(join(dir, config), JSON.stringify({
      compilerOptions: { strict: true, noEmit: true, module, moduleResolution, target: 'ES2022', lib: ['ES2022', 'DOM'], skipLibCheck: true, noUncheckedSideEffectImports: true },
      include: ['index.mts'],
    }));
    const r = spawnSync(tsc, ['-p', config], { cwd: dir, encoding: 'utf8' });
    assert.equal(r.status, 0, `TypeScript (${moduleResolution}): ${r.stdout}${r.stderr}`);
  }
}
