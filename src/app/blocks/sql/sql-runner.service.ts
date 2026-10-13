import { Injectable, signal } from '@angular/core';
import type { SqlRunRequest, SqlWorkerMessage } from './sql-messages';
import type { StatementResult } from './run-sql';

type SqlRunOutcome =
  | { kind: 'results'; results: StatementResult[] }
  | { kind: 'stopped'; reason: 'user' | 'timeout' }
  | { kind: 'failed'; message: string };

/** A run longer than this is stopped (e.g. an accidental huge generate_series). */
const SQL_TIMEOUT_MS = 15_000;

interface Pending { resolve: (o: SqlRunOutcome) => void; timer: ReturnType<typeof setTimeout> }

/**
 * Owns the SQL worker (one per page). Stopping a run ends the worker — that is
 * the only way to interrupt a running query — and the next run starts a new one.
 */
@Injectable({ providedIn: 'root' })
export class SqlRunnerService {
  /** True while PostgreSQL is downloading/starting for the first run. */
  readonly starting = signal(false);

  private worker?: Worker;
  private readonly pending = new Map<string, Pending>();

  run(request: Omit<SqlRunRequest, 'type' | 'runId'>): { runId: string; done: Promise<SqlRunOutcome> } {
    const runId = Math.random().toString(36).slice(2);
    const done = new Promise<SqlRunOutcome>((resolve) => {
      const timer = setTimeout(() => this.stop(runId, 'timeout'), SQL_TIMEOUT_MS);
      this.pending.set(runId, { resolve, timer });
    });
    this.ensureWorker().postMessage({ type: 'run', runId, ...request } satisfies SqlRunRequest);
    return { runId, done };
  }

  /** Ends the worker; every unfinished run resolves as stopped. */
  stop(runId: string, reason: 'user' | 'timeout' = 'user'): void {
    if (!this.pending.has(runId)) return;
    this.worker?.terminate();
    this.worker = undefined;
    this.starting.set(false);
    for (const [id, p] of this.pending) {
      clearTimeout(p.timer);
      p.resolve({ kind: 'stopped', reason: id === runId ? reason : 'user' });
    }
    this.pending.clear();
  }

  private ensureWorker(): Worker {
    if (this.worker) return this.worker;
    const worker = new Worker(new URL('./sql.worker', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }: MessageEvent<SqlWorkerMessage>) => this.onMessage(data);
    worker.onerror = (e) => this.failAll(e.message || 'PostgreSQL could not start in this browser.');
    this.worker = worker;
    return worker;
  }

  private onMessage(msg: SqlWorkerMessage): void {
    if (msg.type === 'loading') { this.starting.set(true); return; }
    const p = this.pending.get(msg.runId);
    if (!p) return;
    clearTimeout(p.timer);
    this.pending.delete(msg.runId);
    this.starting.set(false);
    p.resolve(msg.type === 'result' ? { kind: 'results', results: msg.results } : { kind: 'failed', message: msg.message });
  }

  private failAll(message: string): void {
    for (const p of this.pending.values()) { clearTimeout(p.timer); p.resolve({ kind: 'failed', message }); }
    this.pending.clear();
    this.worker?.terminate();
    this.worker = undefined;
    this.starting.set(false);
  }
}
