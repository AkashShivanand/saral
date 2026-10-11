import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const GUARD = join(dirname(fileURLToPath(import.meta.url)), 'guard.mjs');

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'saral-guard-'));
  const git = (...args) =>
    execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { cwd: dir });
  git('init', '-q');
  const terms = join(dir, '..', `${dir.split('/').pop()}-terms.txt`);
  writeFileSync(terms, '# test list\nzebracorp\nblue heron\n');
  const guard = (args, env = {}) => {
    const r = spawnSync('node', [GUARD, ...args], {
      cwd: dir,
      encoding: 'utf8',
      env: { PATH: process.env.PATH, HOME: dir, SARAL_GUARD_TERMS_FILE: terms, ...env },
    });
    return { code: r.status, out: r.stdout + r.stderr };
  };
  const write = (path, content) => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  };
  return { dir, git, guard, write, terms };
}

const leaks = (out) => /zebracorp|blue[\s_-]*heron/i.test(out);

test('staged clean file passes', () => {
  const r = repo();
  r.write('a.md', 'nothing private here\n');
  r.git('add', 'a.md');
  assert.deepEqual(r.guard(['--staged']).code, 0);
});

test('staged file containing a term fails without printing the term', () => {
  const r = repo();
  r.write('a.md', 'line one\nshipped for ZebraCorp\n');
  r.git('add', 'a.md');
  const res = r.guard(['--staged']);
  assert.equal(res.code, 1);
  assert.match(res.out, /guard: a\.md:2 matches private term #1/);
  assert.equal(leaks(res.out), false);
});

test('a term in a file path fails and the path is printed masked', () => {
  const r = repo();
  r.write('docs/zebracorp-notes.md', 'clean\n');
  r.git('add', '.');
  const res = r.guard(['--staged']);
  assert.equal(res.code, 1);
  assert.match(res.out, /docs\/\*\*\*-notes\.md/);
  assert.equal(leaks(res.out), false);
});

test('a term inside a binary file is caught', () => {
  const r = repo();
  r.write('img.png', Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]), Buffer.from('Author: zebracorp'), Buffer.from([0x00])]));
  r.git('add', 'img.png');
  assert.equal(r.guard(['--staged']).code, 1);
});

test('no term file fails with exit 2', () => {
  const r = repo();
  assert.equal(r.guard(['--staged'], { SARAL_GUARD_TERMS_FILE: join(r.dir, 'missing.txt') }).code, 2);
});

test('a term file with only comments fails with exit 2', () => {
  const r = repo();
  r.write('only-comments.txt', '# nothing\n\n');
  assert.equal(r.guard(['--staged'], { SARAL_GUARD_TERMS_FILE: join(r.dir, 'only-comments.txt') }).code, 2);
});

test('the CI secret variable is used when set', () => {
  const r = repo();
  r.write('a.md', 'kestrel\n');
  r.git('add', 'a.md');
  assert.equal(r.guard(['--staged'], { SARAL_GUARD_TERMS: 'kestrel' }).code, 1);
});

test('commit message with a term fails; git comment lines are ignored', () => {
  const r = repo();
  r.write('msg-bad.txt', 'docs: notes\n\nWritten for Blue\nHeron.\n');
  r.write('msg-ok.txt', 'docs: notes\n# zebracorp appears only in a git comment line\n');
  const bad = r.guard(['--message', join(r.dir, 'msg-bad.txt')]);
  assert.equal(bad.code, 1);
  assert.equal(leaks(bad.out), false);
  assert.equal(r.guard(['--message', join(r.dir, 'msg-ok.txt')]).code, 0);
});

test('--log finds a term in any commit message in history', () => {
  const r = repo();
  r.write('a.md', 'clean\n');
  r.git('add', 'a.md');
  r.git('commit', '-q', '-m', 'first');
  r.git('commit', '-q', '--allow-empty', '-m', 'second, for zebracorp');
  r.git('commit', '-q', '--allow-empty', '-m', 'third');
  const res = r.guard(['--log', 'HEAD']);
  assert.equal(res.code, 1);
  assert.match(res.out, /commit [0-9a-f]{7} message/);
  assert.equal(leaks(res.out), false);
});

test('--all scans every tracked file', () => {
  const r = repo();
  r.write('a.md', 'clean\n');
  r.write('b.md', 'the blue-heron project\n');
  r.git('add', '.');
  r.git('commit', '-q', '-m', 'x');
  assert.equal(r.guard(['--all']).code, 1);
});

test('unknown mode exits 2', () => {
  assert.equal(repo().guard(['--nope']).code, 2);
});

// Final review fixes

test('--all catches a committed link whose target path holds a term', () => {
  const r = repo();
  symlinkSync('zebracorp/notes.md', join(r.dir, 'link'));
  r.git('add', 'link');
  r.git('commit', '-q', '-m', 'x');
  const res = r.guard(['--all']);
  assert.equal(res.code, 1);
  assert.equal(leaks(res.out), false);
});

test('--staged catches a file replaced by a link to a term', () => {
  const r = repo();
  r.write('a.md', 'clean\n');
  r.git('add', 'a.md');
  r.git('commit', '-q', '-m', 'x');
  rmSync(join(r.dir, 'a.md'));
  symlinkSync('blue-heron.md', join(r.dir, 'a.md'));
  r.git('add', 'a.md');
  assert.equal(r.guard(['--staged']).code, 1);
});

test('--history catches a term removed in a later commit', () => {
  const r = repo();
  r.write('a.md', 'for zebracorp\n');
  r.git('add', 'a.md');
  r.git('commit', '-q', '-m', 'one');
  r.write('a.md', 'clean\n');
  r.git('add', 'a.md');
  r.git('commit', '-q', '-m', 'two');
  assert.equal(r.guard(['--all']).code, 0);
  const res = r.guard(['--history', 'HEAD']);
  assert.equal(res.code, 1);
  assert.equal(leaks(res.out), false);
});

test('--message ignores the diff below the git commit -v cut line', () => {
  const r = repo();
  r.write('m.txt', 'docs: remove a name\n# ------------------------ >8 ------------------------\n# Do not modify or remove the line above.\ndiff --git a/a.md b/a.md\n-for zebracorp\n');
  assert.equal(r.guard(['--message', join(r.dir, 'm.txt')]).code, 0);
});

test('--message follows core.commentChar', () => {
  const r = repo();
  r.git('config', 'core.commentChar', ';');
  r.write('ok.txt', 'fix\n; On branch blue-heron-work\n');
  r.write('bad.txt', 'fix\n# zebracorp release\n');
  assert.equal(r.guard(['--message', join(r.dir, 'ok.txt')]).code, 0);
  assert.equal(r.guard(['--message', join(r.dir, 'bad.txt')]).code, 1);
});

test('--log catches author emails, branch names and tag messages', () => {
  const email = repo();
  email.write('a.md', 'clean\n');
  email.git('add', 'a.md');
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=dev@zebracorp.com', 'commit', '-q', '-m', 'x'], { cwd: email.dir });
  const res = email.guard(['--log', 'HEAD']);
  assert.equal(res.code, 1);
  assert.equal(leaks(res.out), false);

  const branch = repo();
  branch.git('checkout', '-q', '-b', 'blue-heron-work');
  branch.git('commit', '-q', '--allow-empty', '-m', 'x');
  const b = branch.guard(['--log', 'HEAD']);
  assert.equal(b.code, 1);
  assert.equal(leaks(b.out), false);

  const tag = repo();
  tag.git('commit', '-q', '--allow-empty', '-m', 'x');
  tag.git('tag', '-a', 'v1', '-m', 'made for zebracorp');
  assert.equal(tag.guard(['--log', 'HEAD']).code, 1);
});
