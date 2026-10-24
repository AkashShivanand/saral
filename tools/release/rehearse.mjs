#!/usr/bin/env node
// The release rehearsal: starts a throwaway local registry (Verdaccio), runs
// the real publish script against it twice, once with the npm names and once
// with the GitHub Packages names, then installs from it the way each consumer
// would and uses every entry point. This is the closest check to a release
// that needs no credentials.
//
//   npm run check:registry
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stage, PACKAGES } from './stage.mjs';
import { publish } from './publish.mjs';
import { install, smoke } from './consumer.mjs';

const VERDACCIO = 'verdaccio@6.10.4';
const SCOPE = 'rehearsal';
const PORT = 4800 + Math.floor(Math.random() * 100);
const REGISTRY = `http://127.0.0.1:${PORT}/`;
const PUBLIC = 'https://registry.npmjs.org/';

const work = mkdtempSync(join(tmpdir(), 'saral-rehearsal-'));
writeFileSync(join(work, 'config.yaml'), `
storage: ${join(work, 'storage')}
auth:
  htpasswd:
    file: ${join(work, 'htpasswd')}
    max_users: 10
uplinks:
  npmjs:
    url: ${PUBLIC}
packages:
  '@saral/*':
    access: $all
    publish: $authenticated
  '@${SCOPE}/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    proxy: npmjs
log: { type: stdout, format: pretty, level: error }
`);

const server = spawn('npx', ['-y', VERDACCIO, '--config', join(work, 'config.yaml'), '--listen', `127.0.0.1:${PORT}`], {
  stdio: ['ignore', 'inherit', 'inherit'],
  // Its own process group, so stopping it also stops the server npx started.
  detached: true,
});

async function waitForServer() {
  for (let i = 0; i < 120; i += 1) {
    try {
      if ((await fetch(`${REGISTRY}-/ping`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('the local registry did not start');
}

// A user on the local registry, so npm publish has a token to send.
async function token() {
  const res = await fetch(`${REGISTRY}-/user/org.couchdb.user:rehearsal`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'rehearsal', password: `pw-${process.pid}-${Date.now()}` }),
  });
  if (!res.ok) throw new Error(`could not create a user on the local registry: ${res.status}`);
  return (await res.json()).token;
}

let failed = false;
try {
  await waitForServer();
  const auth = `//127.0.0.1:${PORT}/:_authToken=${await token()}\n`;
  const userconfig = join(work, 'publish.npmrc');
  writeFileSync(userconfig, auth);
  process.env.NPM_CONFIG_USERCONFIG = userconfig;

  const npmNames = stage({ registry: 'npm', out: join(work, 'npm'), rehearsal: REGISTRY });
  const ghNames = stage({ registry: 'github', scope: SCOPE, out: join(work, 'github'), rehearsal: REGISTRY });
  for (const s of [npmNames, ghNames]) {
    publish(s.out, { log: (l) => console.log(`  ${l}`) });
    // A second run must skip, so a half-finished release can be run again.
    publish(s.out, { log: () => {} });
  }
  const { version } = npmNames;

  // Consumer A installs from npm: plain names, the default registry.
  const a = join(work, 'consumer-a');
  install(a, Object.fromEntries(PACKAGES.map((p) => [`@saral/${p}`, version])), `registry=${REGISTRY}\n`);
  smoke(a);
  console.log(`ok   install from npm-style registry: @saral/* ${version}`);

  // Consumer B installs from GitHub Packages: the owner's scope points at that
  // registry, everything else (React) comes from npm, and aliases keep the
  // @saral/* import names.
  const b = join(work, 'consumer-b');
  const aliased = Object.fromEntries(PACKAGES.map((p) => [`@saral/${p}`, `npm:@${SCOPE}/saral-${p}@${version}`]));
  install(b, aliased, `@${SCOPE}:registry=${REGISTRY}\nregistry=${PUBLIC}\n`);
  smoke(b);
  console.log(`ok   install from GitHub Packages-style scope: @${SCOPE}/saral-* ${version}, aliased to @saral/*`);
} catch (e) {
  failed = true;
  console.error(`fail ${e.stderr ?? ''}${e.message}`);
} finally {
  try {
    process.kill(-server.pid);
  } catch {}
  rmSync(work, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
