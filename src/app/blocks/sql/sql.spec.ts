import { splitSql } from './split-sql';
import { SqlSession, runSql, summarize } from './run-sql';
import { formatCell } from './sql-format';

describe('splitSql', () => {
  it('splits on top-level semicolons and drops empty statements', () => {
    expect(splitSql('SELECT 1; SELECT 2;;  ;\n')).toEqual(['SELECT 1', 'SELECT 2']);
  });

  it('ignores semicolons inside strings, quoted names and E-strings', () => {
    expect(splitSql(`SELECT 'a;b', 'it''s; ok'; SELECT "odd;name" FROM t; SELECT E'x\\';y'`)).toEqual([
      `SELECT 'a;b', 'it''s; ok'`,
      'SELECT "odd;name" FROM t',
      `SELECT E'x\\';y'`,
    ]);
  });

  it('keeps dollar-quoted function bodies whole', () => {
    const fn = `CREATE FUNCTION f() RETURNS int LANGUAGE plpgsql AS $$\nBEGIN\n  RETURN 1; -- ;\nEND;\n$$`;
    const tagged = `DO $body$ BEGIN RAISE NOTICE 'a;b'; END $body$`;
    expect(splitSql(`${fn};\n${tagged};\nSELECT f();`)).toEqual([fn, tagged, 'SELECT f()']);
  });

  it('treats $1 as a parameter, not a dollar quote', () => {
    expect(splitSql('PREPARE p AS SELECT $1::int + 1; EXECUTE p(41);')).toEqual(['PREPARE p AS SELECT $1::int + 1', 'EXECUTE p(41)']);
  });

  it('skips line and nested block comments, and comment-only statements', () => {
    expect(splitSql('-- intro; still a comment\nSELECT 1; /* a /* nested ; */ comment */ SELECT 2; -- only a comment;')).toEqual([
      '-- intro; still a comment\nSELECT 1',
      '/* a /* nested ; */ comment */ SELECT 2',
    ]);
  });
});

/** A fake PGlite session: answers by statement text. */
function fakeSession(answers: Record<string, unknown>): SqlSession & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    async exec(sql, options) {
      calls.push(sql);
      const a = answers[sql];
      if (a instanceof Error) throw a;
      const { notice, ...res } = (a ?? { fields: [], rows: [], affectedRows: 0 }) as { notice?: string };
      if (notice) options?.onNotice?.({ message: notice });
      return [res as never];
    },
  };
}

describe('runSql', () => {
  it('returns rows as display text, keeps NULL, and gives command tags otherwise', async () => {
    const db = fakeSession({
      'SELECT id, city FROM customers': { fields: [{ name: 'id' }, { name: 'city' }], rows: [[6, null]], affectedRows: 0 },
      'UPDATE products SET stock = 0': { fields: [], rows: [], affectedRows: 3 },
    });
    const res = await runSql(db, 'SELECT id, city FROM customers; UPDATE products SET stock = 0;');
    expect(res[0]).toMatchObject({ index: 1, fields: ['id', 'city'], rows: [['6', null]] });
    expect(res[1]).toMatchObject({ index: 2, summary: 'UPDATE · 3 rows changed' });
  });

  it('keeps both values when two columns have the same name', async () => {
    const db = fakeSession({ 'SELECT p.name, c.name FROM p JOIN c USING (id)': { fields: [{ name: 'name' }, { name: 'name' }], rows: [['Mug', 'Home']] } });
    const [r] = await runSql(db, 'SELECT p.name, c.name FROM p JOIN c USING (id)');
    expect(r).toMatchObject({ fields: ['name', 'name'], rows: [['Mug', 'Home']] });
  });

  it('keeps earlier results and stops at the first error, like psql', async () => {
    const err = Object.assign(new Error('relation "nope" does not exist'), { code: '42P01' });
    const db = fakeSession({ 'SELECT * FROM nope': err });
    const res = await runSql(db, 'CREATE TABLE a (x int); SELECT * FROM nope; SELECT 3;');
    expect(res.map((r) => r.index)).toEqual([1, 2]);
    expect(res[0].summary).toBe('CREATE TABLE');
    expect(res[1].error).toEqual({ message: 'relation "nope" does not exist', code: '42P01', detail: undefined, hint: undefined });
    expect(db.calls).not.toContain('SELECT 3');
  });

  it('hides setup statements but numbers the rest from 1', async () => {
    const db = fakeSession({ 'SELECT 1': { fields: [{ name: 'one' }], rows: [[1]] } });
    const res = await runSql(db, 'CREATE TABLE s (x int); INSERT INTO s VALUES (1); SELECT 1;', { setupStatements: 2 });
    expect(res).toHaveLength(1);
    expect(res[0]).toMatchObject({ index: 1, rows: [['1']] });
  });

  it('reports an error in setup as statement 0', async () => {
    const db = fakeSession({ 'CREATE TABLE s (x int)': new Error('boom') });
    const res = await runSql(db, 'CREATE TABLE s (x int); SELECT 1;', { setupStatements: 1 });
    expect(res).toEqual([expect.objectContaining({ index: 0, error: expect.objectContaining({ message: 'boom' }) })]);
  });

  it('attaches notices to their statement', async () => {
    const db = fakeSession({ "DO $$ BEGIN RAISE NOTICE 'hi'; END $$": { fields: [], rows: [], notice: 'hi' } });
    const res = await runSql(db, "DO $$ BEGIN RAISE NOTICE 'hi'; END $$;");
    expect(res[0]).toMatchObject({ summary: 'DO', notices: ['hi'] });
  });
});

describe('summarize', () => {
  it.each([
    ['CREATE TABLE t (x int)', 0, 'CREATE TABLE'],
    ['create or replace function f() returns int as $$ select 1 $$ language sql', 0, 'CREATE FUNCTION'],
    ['CREATE UNIQUE INDEX i ON t (x)', 0, 'CREATE UNIQUE INDEX'],
    ['CREATE MATERIALIZED VIEW v AS SELECT 1', 0, 'CREATE MATERIALIZED VIEW'],
    ['INSERT INTO t VALUES (1), (2), (3)', 3, 'INSERT · 3 rows added'],
    ['DELETE FROM t WHERE x = 1', 1, 'DELETE · 1 row deleted'],
    ['WITH gone AS (SELECT 1) DELETE FROM t', 2, 'DELETE · 2 rows deleted'],
    ['-- comment first\nBEGIN', 0, 'BEGIN'],
    ['START TRANSACTION', 0, 'BEGIN'],
    ['GRANT SELECT ON t TO reader', 0, 'GRANT'],
  ])('%s → %s', (sql, affected, tag) => {
    expect(summarize(sql, affected as number)).toBe(tag);
  });
});

describe('formatCell', () => {
  it('formats values like psql', () => {
    expect(formatCell(null)).toBeNull();
    expect(formatCell('2025-03-09')).toBe('2025-03-09');
    expect(formatCell(42)).toBe('42');
    expect(formatCell(true)).toBe('t');
    expect(formatCell(new Uint8Array([222, 173]))).toBe('\\xdead');
    expect(formatCell({ a: 1 })).toBe('{"a":1}');
  });
});
