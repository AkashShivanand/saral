import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// A strict TypeScript project that has installed Saral, the way a site would.
function consumer(moduleResolution) {
  const dir = mkdtempSync(join(tmpdir(), 'saral-consumer-'));
  mkdirSync(join(dir, 'node_modules', '@types'), { recursive: true });
  symlinkSync(ROOT, join(dir, 'node_modules', 'saral'));
  symlinkSync(join(ROOT, 'node_modules', 'react'), join(dir, 'node_modules', 'react'));
  symlinkSync(join(ROOT, 'node_modules', '@types', 'react'), join(dir, 'node_modules', '@types', 'react'));
  const module = moduleResolution === 'bundler' ? 'ESNext' : 'NodeNext';
  writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { strict: true, noEmit: true, module, moduleResolution, target: 'ES2022', lib: ['ES2022', 'DOM'], skipLibCheck: true, noUncheckedSideEffectImports: true },
    include: ['index.mts'],
  }));
  writeFileSync(join(dir, 'index.mts'), [
    "import 'saral/css/mor.css';",
    "import 'saral/css/components.css';",
    "import mor from 'saral/tokens/mor.mjs';",
    "import { enhanceForm } from 'saral/core';",
    "import { Button, Field, Form, Link, Notice } from 'saral/react';",
    "const ground: string = mor.light['surface.ground'];",
    "export { ground, enhanceForm, Button, Field, Form, Link, Notice };",
  ].join('\n'));
  return spawnSync(join(ROOT, 'node_modules', '.bin', 'tsc'), ['-p', dir], { encoding: 'utf8' });
}

for (const resolution of ['bundler', 'NodeNext']) {
  test(`a strict TypeScript site can import every Saral entry point (${resolution})`, () => {
    const r = consumer(resolution);
    assert.equal(r.status, 0, r.stdout + r.stderr);
  });
}
