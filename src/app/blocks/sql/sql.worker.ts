/// <reference lib="webworker" />
import { PGlite } from '@electric-sql/pglite';
import { runSql } from './run-sql';
import { splitSql } from './split-sql';
import type { SqlRunRequest, SqlWorkerMessage } from './sql-messages';

// PostgreSQL's files are served by the site (copied from @electric-sql/pglite at build time).
const FILES = '/pglite/';

interface Runtime { pgliteWasmModule: WebAssembly.Module; initdbWasmModule: WebAssembly.Module; fsBundle: Blob }
interface Course { seed: string; snapshot: Promise<Blob> }

let runtime: Promise<Runtime> | null = null;
let course: Course | null = null;
/** A fresh database prepared in the background so the next Run starts instantly. */
let spare: Promise<PGlite> | null = null;

function loadRuntime(): Promise<Runtime> {
  runtime ??= Promise.all([
    WebAssembly.compileStreaming(fetch(FILES + 'pglite.wasm')),
    WebAssembly.compileStreaming(fetch(FILES + 'initdb.wasm')),
    fetch(FILES + 'pglite.data').then((r) => {
      if (!r.ok) throw new Error(`Could not download PostgreSQL (${r.status}).`);
      return r.blob();
    }),
  ]).then(([pgliteWasmModule, initdbWasmModule, fsBundle]) => ({ pgliteWasmModule, initdbWasmModule, fsBundle }));
  runtime.catch(() => { runtime = null; }); // allow a retry after a failed download
  return runtime;
}

/**
 * Builds the course database once and keeps a snapshot of it. (PGlite's own
 * clone() re-creates the instance without the files passed in here, so in the
 * browser it would fetch them from the wrong place — we "clone" from the
 * snapshot ourselves instead.)
 */
async function snapshot(seed: string): Promise<Blob> {
  const db = await PGlite.create({ ...(await loadRuntime()) });
  try {
    await db.exec(seed);
    return await db.dumpDataDir('none');
  } finally {
    await db.close();
  }
}

async function fresh(c: Course): Promise<PGlite> {
  const [rt, loadDataDir] = await Promise.all([loadRuntime(), c.snapshot]);
  return PGlite.create({ ...rt, loadDataDir });
}

const post = (msg: SqlWorkerMessage) => postMessage(msg);

addEventListener('message', async ({ data }: MessageEvent<SqlRunRequest>) => {
  if (data?.type !== 'run') return;
  const { runId, seed, setup, code } = data;
  try {
    if (!course || course.seed !== seed) {
      post({ type: 'loading', runId });
      const c: Course = { seed, snapshot: snapshot(seed) };
      c.snapshot.catch(() => { if (course === c) course = null; });
      course = c;
      spare = null;
    }
    const c = course;
    const db = await (spare ?? fresh(c));
    spare = null;
    try {
      const script = setup ? `${setup};\n${code}` : code;
      const results = await runSql(db, script, { setupStatements: setup ? splitSql(setup).length : 0 });
      post({ type: 'result', runId, results });
    } finally {
      void db.close();
      if (course === c) { spare = fresh(c); spare.catch(() => { spare = null; }); }
    }
  } catch (e) {
    post({ type: 'fatal', runId, message: e instanceof Error ? e.message : String(e) });
  }
});
