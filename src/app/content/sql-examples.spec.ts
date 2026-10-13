/**
 * @jest-environment node
 */
// Runs every runnable SQL example of the PostgreSQL course against real PostgreSQL (PGlite),
// so a content edit that breaks a query fails CI. PGlite needs real ES-module dynamic imports,
// which Jest's VM doesn't allow, so the work happens in tools/check-lessons.mjs in a child process.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

describe('PostgreSQL course examples', () => {
  it('every runnable SQL example runs on the sample database (or fails only when meant to)', () => {
    const root = resolve(__dirname, '../../..');
    const run = spawnSync(process.execPath, ['tools/check-lessons.mjs', '--sql', 'src/app/content/postgresql/*.ts'], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    const failures = (run.stdout ?? '').split('\n').filter((l) => l.includes('✗'));
    expect({ exitCode: run.status, failures, stderr: run.status ? (run.stderr ?? '').slice(-2000) : '' })
      .toEqual({ exitCode: 0, failures: [], stderr: '' });
  }, 600_000);
});
