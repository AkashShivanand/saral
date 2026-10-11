import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVE = join(dirname(fileURLToPath(import.meta.url)), 'serve.mjs');

test('the dev server listens on localhost only and survives a malformed URL', async () => {
  const child = spawn('node', [SERVE], { env: { ...process.env, PORT: '0' } });
  try {
    const line = await new Promise((resolve, reject) => {
      child.stdout.once('data', (d) => resolve(String(d)));
      child.once('exit', (code) => reject(new Error(`exited ${code}`)));
    });
    const m = line.match(/serving on http:\/\/127\.0\.0\.1:(\d+)/);
    assert.ok(m, line);
    const bad = await fetch(`http://127.0.0.1:${m[1]}/%`);
    assert.equal(bad.status, 400);
    const ok = await fetch(`http://127.0.0.1:${m[1]}/README.md`);
    assert.equal(ok.status, 200);
  } finally {
    child.kill();
  }
});
