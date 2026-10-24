#!/usr/bin/env node
// Publishes staged packages in order (a package after the ones it depends on).
// A version already on the registry is skipped, so a release that failed half
// way can run again. Only the release workflow runs this for real.
//
//   node tools/release/publish.mjs --dir <staged folder> [--dry-run]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PACKAGES } from './stage.mjs';

const run = (args, cwd) => execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

function onRegistry(name, version, registry, cwd) {
  try {
    return run(['view', `${name}@${version}`, 'version', '--registry', registry], cwd).trim() === version;
  } catch {
    return false;
  }
}

/**
 * @param {string} dir the folder stage.mjs wrote
 * @param {{ dryRun?: boolean, log?: (line: string) => void }} [options]
 */
export function publish(dir, { dryRun = false, log = console.log } = {}) {
  for (const key of PACKAGES) {
    const cwd = join(dir, key);
    const m = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
    const registry = m.publishConfig?.registry ?? 'https://registry.npmjs.org';
    if (onRegistry(m.name, m.version, registry, cwd)) {
      log(`skip ${m.name}@${m.version}: already on ${registry}`);
      continue;
    }
    // A pre-release (0.4.0-rc.1) never becomes the default install.
    const tag = m.version.includes('-') ? 'next' : 'latest';
    const args = ['publish', '--tag', tag, '--registry', registry];
    if (dryRun) args.push('--dry-run');
    run(args, cwd);
    log(`${dryRun ? 'would publish' : 'published'} ${m.name}@${m.version} to ${registry} (${tag})`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf('--dir');
  if (i === -1) {
    console.error('usage: publish.mjs --dir <staged folder> [--dry-run]');
    process.exit(1);
  }
  publish(process.argv[i + 1], { dryRun: process.argv.includes('--dry-run') });
}
