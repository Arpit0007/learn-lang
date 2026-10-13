import type { StatementResult } from './run-sql';

/** Page → SQL worker. */
export interface SqlRunRequest { type: 'run'; runId: string; seed: string; setup?: string; code: string }

/** SQL worker → page. */
export type SqlWorkerMessage =
  | { type: 'loading'; runId: string }
  | { type: 'result'; runId: string; results: StatementResult[] }
  | { type: 'fatal'; runId: string; message: string };
