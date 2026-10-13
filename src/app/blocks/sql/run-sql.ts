import { splitSql } from './split-sql';
import { RAW_TEXT_PARSERS, formatCell } from './sql-format';

/** The slice of the PGlite API the runner needs (also satisfied by test fakes). */
export interface SqlSession {
  exec(sql: string, options?: {
    rowMode?: 'array';
    parsers?: Record<number, (value: string) => unknown>;
    onNotice?: (notice: { message?: string }) => void;
  }): Promise<
    { fields: { name: string }[]; rows: unknown[]; affectedRows?: number }[]
  >;
}

export interface SqlError { message: string; code?: string; detail?: string; hint?: string }

export interface StatementResult {
  /** 1-based position among the learner's statements (hidden setup statements don't count). */
  index: number;
  sql: string;
  fields: string[];
  rows: (string | null)[][];
  /** For statements without rows, e.g. "INSERT · 3 rows". */
  summary: string;
  notices: string[];
  error?: SqlError;
}

/**
 * Runs a script one statement at a time, like psql in autocommit mode: earlier
 * results are kept, and the run stops at the first error. `setupStatements`
 * leading statements are hidden setup — their results are not returned, but an
 * error in them is reported (as statement 0).
 */
export async function runSql(db: SqlSession, script: string, options: { setupStatements?: number } = {}): Promise<StatementResult[]> {
  const statements = splitSql(script);
  const hidden = options.setupStatements ?? 0;
  // Same clock for every learner: fresh copies don't keep ALTER DATABASE … SET timezone,
  // and would otherwise use the machine's own time zone.
  await db.exec(`SET TimeZone TO 'UTC'`);
  const results: StatementResult[] = [];

  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i];
    const notices: string[] = [];
    const index = i - hidden + 1;
    try {
      // Array rows: two columns with the same name (p.name, c.name) must both keep their values.
      // Parsers per statement: clones don't inherit the instance's parser options.
      const res = await db.exec(sql, { rowMode: 'array', parsers: RAW_TEXT_PARSERS, onNotice: (n) => notices.push(n.message ?? '') });
      if (i < hidden) continue;
      const last = res[res.length - 1] ?? { fields: [], rows: [] };
      const fields = last.fields.map((f) => f.name);
      results.push({
        index,
        sql,
        fields,
        rows: last.rows.map((row) => fields.map((_, i) => formatCell((row as unknown[])[i]))),
        summary: fields.length ? '' : summarize(sql, last.affectedRows ?? 0),
        notices,
      });
    } catch (e) {
      const err = e as { message?: string; code?: string; detail?: string; hint?: string };
      results.push({
        index: Math.max(index, 0),
        sql,
        fields: [],
        rows: [],
        summary: '',
        notices,
        error: { message: err.message ?? String(e), code: err.code, detail: err.detail || undefined, hint: err.hint || undefined },
      });
      break;
    }
  }
  return results;
}

const COUNTED: Record<string, string> = { INSERT: 'added', UPDATE: 'changed', DELETE: 'deleted', MERGE: 'merged' };

/** A short psql-like command tag for statements that return no rows. */
export function summarize(sql: string, affected: number): string {
  const words = sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, ' ').trim().split(/\s+/).map((w) => w.toUpperCase().replace(/[^A-Z]/g, ''));
  const [a = '', b = '', c = ''] = words;
  if (a === 'WITH') {
    const verb = words.find((w) => w in COUNTED);
    return verb ? `${verb} · ${plural(affected)} ${COUNTED[verb]}` : 'WITH';
  }
  if (a in COUNTED) return `${a} · ${plural(affected)} ${COUNTED[a]}`;
  if (['CREATE', 'DROP', 'ALTER'].includes(a)) {
    const object = ['OR', 'TEMP', 'TEMPORARY', 'UNIQUE', 'MATERIALIZED', 'UNLOGGED'].includes(b)
      ? (b === 'OR' ? words.slice(3, 4) : [b, c]).join(' ')
      : b;
    return `${a} ${object}`.trim();
  }
  if (a === 'START') return 'BEGIN';
  if (a === 'REFRESH') return 'REFRESH MATERIALIZED VIEW';
  return a || 'OK';
}

const plural = (n: number) => `${n} row${n === 1 ? '' : 's'}`;
