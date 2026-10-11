#!/usr/bin/env node
// Builds every theme in tokens/themes into dist/. Runs every check first and
// writes nothing if any check fails. With --check, writes nothing and exits 1
// when dist/ does not match the source.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadResolver, flatten, resolveAliases } from './resolve.mjs';
import { checkRoles, checkPairs, checkPolicy, checkFluid } from './checks.mjs';
import { toCss, toJs, toTailwind } from './outputs.mjs';
import { TokenError } from './errors.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

export function buildTheme(dir) {
  const resolver = join(dir, 'theme.resolver.json');
  const contexts = Object.keys(readJson(resolver).modifiers?.theme?.contexts ?? { light: [] });
  const modes = {};
  for (const ctx of contexts) modes[ctx] = resolveAliases(flatten(loadResolver(resolver, { theme: ctx })));
  return modes;
}

export function buildAll(root = ROOT) {
  const tokens = join(root, 'tokens');
  const { roles } = readJson(join(tokens, 'roles.json'));
  const { pairs } = readJson(join(tokens, 'pairs.json'));
  const files = new Map();
  const errors = [];
  let first;
  for (const name of readdirSync(join(tokens, 'themes')).sort()) {
    const dir = join(tokens, 'themes', name);
    try {
      const modes = buildTheme(dir);
      const policy = existsSync(join(dir, 'policy.json')) ? readJson(join(dir, 'policy.json')) : {};
      const found = [...checkRoles(roles, modes), ...checkPairs(pairs, modes), ...checkPolicy(policy, modes), ...checkFluid(modes)];
      if (found.length) {
        errors.push(...found.map((e) => `${name}: ${e}`));
        continue;
      }
      files.set(`dist/css/${name}.css`, toCss(name, modes));
      files.set(`dist/js/${name}.mjs`, toJs(name, modes));
      first ??= modes.light;
    } catch (e) {
      if (!(e instanceof TokenError)) throw e;
      errors.push(`${name}: ${e.message}`);
    }
  }
  if (first) files.set('dist/tailwind/saral.css', toTailwind(first));
  return { files, errors };
}

function main(argv) {
  const check = argv.includes('--check');
  const { files, errors } = buildAll();
  if (errors.length) {
    for (const e of errors) console.error(`tokens: ${e}`);
    console.error(`tokens: ${errors.length} problem(s). Nothing written.`);
    return 1;
  }
  let stale = 0;
  for (const [rel, text] of files) {
    const file = join(ROOT, rel);
    if (existsSync(file) && readFileSync(file, 'utf8') === text) continue;
    if (check) {
      console.error(`tokens: ${rel} is out of date. Run npm run build.`);
      stale += 1;
      continue;
    }
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
    console.log(`tokens: wrote ${rel}`);
  }
  if (stale) return 1;
  console.log(check ? 'tokens: dist is up to date' : 'tokens: built');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
