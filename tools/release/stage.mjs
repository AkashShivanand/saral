#!/usr/bin/env node
// Assembles each published package in its own folder, ready for npm pack or
// npm publish. The repo keeps one copy of everything: built files stay in
// dist/, sources in packages/*/src, and only the manifests and READMEs live in
// packages/*. Nothing here writes into the repo.
//
//   node tools/release/stage.mjs --registry npm --out <dir>
//   node tools/release/stage.mjs --registry github --scope <owner> --repo <owner>/saral --out <dir>
//
// npm gets the @saral names. GitHub Packages only takes names under the repo
// owner's scope, so there each package is renamed to @<owner>/saral-<name>, and
// React's dependency on core points at the renamed core through an npm alias.
// Code keeps importing '@saral/core', whichever registry it came from.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Publish order: a package comes after the packages it depends on.
export const PACKAGES = ['tokens', 'css', 'core', 'react'];

// What goes into each package, as [from, to]: from is relative to the repo,
// to is relative to the package folder.
export const LAYOUT = {
  tokens: [['dist/js', 'dist'], ['types/tokens.d.mts', 'types/tokens.d.mts']],
  css: [['dist/css', 'dist'], ['types/css.d.mts', 'types/css.d.mts']],
  core: [['packages/core/src', 'src'], ['dist/types/core/src', 'types']],
  react: [['packages/react/src', 'src'], ['dist/types/react/src', 'types']],
};

export const GITHUB_REGISTRY = 'https://npm.pkg.github.com';

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

export function manifests(root = ROOT) {
  return Object.fromEntries(PACKAGES.map((p) => [p, readJson(join(root, 'packages', p, 'package.json'))]));
}

// The name a package has on a registry.
export function publishedName(name, registry, scope) {
  if (registry === 'npm') return name;
  return `@${scope}/saral-${name.replace(/^@saral\//, '')}`;
}

// Checks the manifests agree before anything is copied, so a mistake fails
// here and not in a consumer's install.
export function checkManifests(all) {
  const errors = [];
  const versions = new Set(Object.values(all).map((m) => m.version));
  if (versions.size !== 1) errors.push(`every package must have the same version, found ${[...versions].join(', ')}`);
  const [version] = versions;
  for (const [p, m] of Object.entries(all)) {
    if (m.name !== `@saral/${p}`) errors.push(`packages/${p}: name must be @saral/${p}`);
    if (m.private) errors.push(`packages/${p}: must not be private`);
    for (const [dep, spec] of Object.entries(m.dependencies ?? {})) {
      if (!dep.startsWith('@saral/')) errors.push(`packages/${p}: runtime dependency ${dep} is not allowed (AGENTS.md rule 10)`);
      else if (spec !== version) errors.push(`packages/${p}: ${dep} must be pinned to ${version}, found ${spec}`);
    }
    for (const dep of Object.keys(m.peerDependencies ?? {})) {
      if (dep !== 'react' || p !== 'react') errors.push(`packages/${p}: peer dependency ${dep} is not allowed`);
    }
  }
  return errors;
}

// Every file an export points at must be in the package.
function checkExports(dir, m) {
  const errors = [];
  const targets = [];
  const walk = (v) => {
    if (typeof v === 'string') targets.push(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(m.exports);
  for (const t of targets) {
    if (t.includes('*')) {
      const folder = join(dir, dirname(t));
      const suffix = t.slice(t.indexOf('*') + 1);
      const found = existsSync(folder) && readdirSync(folder).some((f) => f.endsWith(suffix));
      if (!found) errors.push(`${m.name}: export ${t} matches no file`);
    } else if (!existsSync(join(dir, t))) {
      errors.push(`${m.name}: export ${t} is missing`);
    }
  }
  return errors;
}

/**
 * @param {{ registry?: 'npm' | 'github', scope?: string, repo?: string, out?: string, root?: string, rehearsal?: string }} options
 * @returns {{ out: string, version: string, packages: { key: string, name: string, dir: string }[] }}
 */
export function stage({ registry = 'npm', scope, repo, out, root = ROOT, rehearsal } = {}) {
  if (registry !== 'npm' && registry !== 'github') throw new Error(`unknown registry ${registry}`);
  if (registry === 'github' && !scope) throw new Error('GitHub Packages needs --scope, the repo owner');
  if (scope && !/^[a-z0-9][a-z0-9-]*$/.test(scope)) throw new Error('scope must be the lowercase owner name, without @');

  const all = manifests(root);
  const errors = checkManifests(all);
  if (errors.length) throw new Error(errors.join('\n'));
  const { version } = all.core;

  out = resolve(out ?? mkdtempSync(join(tmpdir(), 'saral-stage-')));
  const staged = [];
  for (const key of PACKAGES) {
    const m = structuredClone(all[key]);
    const dir = join(out, key);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });

    for (const [from, to] of LAYOUT[key]) {
      const source = join(root, from);
      if (!existsSync(source)) throw new Error(`${from} is missing: run npm run build and npm run types first`);
      cpSync(source, join(dir, to), { recursive: statSync(source).isDirectory() });
    }
    cpSync(join(root, 'LICENSE'), join(dir, 'LICENSE'));
    const readme = join(root, 'packages', key, 'README.md');
    if (existsSync(readme)) cpSync(readme, join(dir, 'README.md'));

    if (repo) m.repository = { type: 'git', url: `git+https://github.com/${repo}.git`, directory: `packages/${key}` };
    if (registry === 'github') {
      m.name = publishedName(m.name, registry, scope);
      for (const dep of Object.keys(m.dependencies ?? {})) {
        m.dependencies[dep] = `npm:${publishedName(dep, registry, scope)}@${version}`;
      }
      // GitHub Packages has no provenance; npm keeps it.
      m.publishConfig = { registry: GITHUB_REGISTRY };
    }
    // A rehearsal publishes to a local registry, where provenance cannot work.
    if (rehearsal) m.publishConfig = { access: 'public', registry: rehearsal };
    writeFileSync(join(dir, 'package.json'), JSON.stringify(m, null, 2) + '\n');

    const exportErrors = checkExports(dir, m);
    if (exportErrors.length) throw new Error(exportErrors.join('\n'));
    staged.push({ key, name: m.name, dir });
  }
  return { out, version, packages: staged };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const m = argv[i].match(/^--(registry|scope|repo|out)$/);
    if (!m) throw new Error(`unknown argument ${argv[i]}`);
    args[m[1]] = argv[(i += 1)];
  }
  return args;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { out, version, packages } = stage(parseArgs(process.argv.slice(2)));
    console.log(`Staged ${version} in ${out}`);
    for (const p of packages) console.log(`  ${p.name}  ${p.dir}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
