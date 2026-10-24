#!/usr/bin/env node
// Turns the pending changesets into a new version, then gives the private
// root package the same version (the docs portal shows it) and refreshes the
// lockfile. The owner runs this when cutting a release.
//
//   npm run version-packages
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, manifests, checkManifests } from './stage.mjs';

const sh = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });

sh('npx', ['changeset', 'version']);
const all = manifests();
const errors = checkManifests(all);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const file = join(ROOT, 'package.json');
const root = JSON.parse(readFileSync(file, 'utf8'));
root.version = all.core.version;
writeFileSync(file, JSON.stringify(root, null, 2) + '\n');
sh('npm', ['install', '--package-lock-only', '--no-audit', '--no-fund']);
console.log(`Version ${root.version}. Next: add a dated entry to CHANGELOG.md, commit, then tag v${root.version}.`);
