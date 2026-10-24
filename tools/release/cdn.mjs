#!/usr/bin/env node
// Checks that a published version is served by jsDelivr and unpkg, which
// mirror npm on their own. CDNs can take a few minutes to see a new version,
// so each file is retried for up to five minutes.
//
//   node tools/release/cdn.mjs [version]   (defaults to the version in packages/core)
import { pathToFileURL } from 'node:url';
import { manifests } from './stage.mjs';

// [package, file, text the file must contain]
export const FILES = [
  ['@saral/css', 'dist/mor.css', '--saral-surface-ground:'],
  ['@saral/css', 'dist/components.css', 'data-scope="button"'],
  ['@saral/tokens', 'dist/mor.mjs', 'surface.ground'],
  ['@saral/core', 'src/index.mjs', 'enhanceForm'],
  ['@saral/react', 'src/index.mjs', 'Button'],
];

export function urls(version) {
  return FILES.flatMap(([name, file, marker]) => [
    { url: `https://cdn.jsdelivr.net/npm/${name}@${version}/${file}`, marker },
    { url: `https://unpkg.com/${name}@${version}/${file}`, marker },
  ]).concat([
    // jsDelivr's ES module build, for a page that loads core with no bundler.
    { url: `https://cdn.jsdelivr.net/npm/@saral/core@${version}/+esm`, marker: 'enhanceForm' },
  ]);
}

async function check({ url, marker }, { tries = 30, wait = 10_000 } = {}) {
  let last = '';
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const text = await res.text();
      if (res.ok && text.includes(marker)) return { url, ok: true };
      last = `${res.status}${res.ok ? `, missing "${marker}"` : ''}`;
    } catch (e) {
      last = e.message;
    }
    if (i < tries - 1) await new Promise((r) => setTimeout(r, wait));
  }
  return { url, ok: false, last };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const version = process.argv[2] ?? manifests().core.version;
  const results = await Promise.all(urls(version).map((u) => check(u)));
  for (const r of results) console.log(`${r.ok ? 'ok  ' : 'fail'} ${r.url}${r.ok ? '' : ` (${r.last})`}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}
