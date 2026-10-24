#!/usr/bin/env node
// The consumer check: packs every package with npm pack, installs the
// tarballs into a clean project, and uses every entry point. It runs for the
// npm names and for the GitHub Packages names, so a broken package fails here
// and not after it is published.
//
//   npm run check:packages
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stage, PACKAGES } from './stage.mjs';
import { pack, install, smoke } from './consumer.mjs';

// Any lowercase name works: the check never talks to GitHub.
const SCOPE = 'saral-check';

const work = mkdtempSync(join(tmpdir(), 'saral-check-'));
const keep = process.argv.includes('--keep');
let failed = false;

for (const registry of ['npm', 'github']) {
  const label = registry === 'npm' ? 'npm names (@saral/*)' : `GitHub Packages names (@${SCOPE}/saral-*)`;
  try {
    const staged = stage({ registry, scope: SCOPE, out: join(work, registry, 'stage') });
    const tarballs = pack(staged, join(work, registry, 'tarballs'));
    // Installed under @saral/* either way: from GitHub Packages a site uses
    // npm aliases, so its imports stay the same.
    const deps = Object.fromEntries(PACKAGES.map((p) => [`@saral/${p}`, `file:${tarballs[p]}`]));
    const app = join(work, registry, 'app');
    install(app, deps);
    smoke(app);
    console.log(`ok   ${label} ${staged.version}`);
  } catch (e) {
    failed = true;
    console.error(`fail ${label}\n${e.stderr ?? ''}${e.message}`);
  }
}

if (keep) console.log(`Kept ${work}`);
else rmSync(work, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
