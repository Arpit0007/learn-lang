import { Lesson } from '../../shared/content';

/** The same 20,000-order table as the indexes lesson. Fewer than 30,000 rows keeps ANALYZE exact, so estimates never change. */
const BIG_ORDERS_TABLE = `CREATE TABLE big_orders (
  id          integer PRIMARY KEY,
  customer_id integer NOT NULL,
  ordered_on  date NOT NULL,
  status      text NOT NULL,
  total       numeric(10, 2) NOT NULL
);
INSERT INTO big_orders (id, customer_id, ordered_on, status, total)
SELECT g,
       1 + g % 2000,
       DATE '2024-01-01' + g % 601,
       CASE WHEN g % 50 = 0 THEN 'pending' ELSE 'delivered' END,
       5 + (g * 7919) % 25000 / 100.0
FROM generate_series(1, 20000) AS g;`;

const BIG_ORDERS_SETUP = `${BIG_ORDERS_TABLE}
ANALYZE big_orders;`;

export const PERFORMANCE: Lesson = {
  slug: 'performance',
  title: 'Making Queries Fast',
  nav: 'Query performance',
  blocks: [
    {
      kind: 'text',
      text: "A query that takes 5 milliseconds on 1,000 rows can take 5 seconds on 10 million rows. In this lesson you learn how to find out **why** a query is slow, and the most common ways to fix it. You also meet the cleaning work that keeps a database fast: `VACUUM` and `ANALYZE`.",
    },
    {
      kind: 'text',
      text: "The first rule is: measure before you change anything. Guessing wastes time, because the slow part is often not where you expect it. The main tool for measuring is `EXPLAIN ANALYZE`. The examples use the table `big_orders` from the last lesson: 20,000 orders, made by the hidden setup.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'EXPLAIN ANALYZE',
    },
    {
      kind: 'text',
      text: "`EXPLAIN` shows the plan that PostgreSQL **expects** to use. `EXPLAIN ANALYZE` really runs the query, and then shows what **actually** happened: the real time and the real number of rows for each step of the plan. This query counts the orders of one day, grouped by status.",
    },
    {
      kind: 'example',
      label: 'explain-analyze.sql',
      setup: BIG_ORDERS_SETUP,
      code: `EXPLAIN ANALYZE
SELECT status, count(*)
FROM big_orders
WHERE ordered_on = '2025-03-01'
GROUP BY status;`,
    },
    {
      kind: 'text',
      text: "A plan is a tree of steps. Each line that starts with `->` is a step, and it passes its rows up to the step above it. Read from the most indented step upward:",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "`Seq Scan on big_orders` reads all 20,000 rows and keeps the 33 from 1 March 2025. `Rows Removed by Filter: 19967` shows how much work was wasted.",
        "`Sort` puts those 33 rows in order of `status`.",
        "`GroupAggregate` counts the rows in each status, which gives the 2 result rows.",
      ],
    },
    {
      kind: 'table',
      head: ['Part', 'What it means'],
      rows: [
        ['`actual time=0.186..1.752`', 'The real time in milliseconds: until the first row, then until the last row of this step'],
        ['`rows=33.00`', 'The real number of rows this step returned. PostgreSQL 18 shows two decimals'],
        ['`loops=1`', 'How many times this step ran'],
        ['`Rows Removed by Filter`', 'Rows that were read and then thrown away'],
        ['`Buffers: shared hit=148`', 'How many 8 kB pages were read. `hit` means from memory, `read` means from disk'],
        ['`Execution Time`', 'The time to run the whole query'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Timings change on every run',
      blocks: [
        {
          kind: 'text',
          text: "Your times will not match the ones in this lesson, and they change each time you press **Run**, because the computer is busy with other work too. Look at big differences, like 3 ms against 0.3 ms, and run a query a few times before you decide. Row counts such as `Rows Removed by Filter` do not change, so they are easier to compare.",
        },
      ],
    },
    {
      kind: 'text',
      text: "`EXPLAIN ANALYZE` really runs the statement. For an `UPDATE` or `DELETE`, that means the rows really change. To measure one without keeping the change, run it inside a transaction: `BEGIN;`, then `EXPLAIN ANALYZE UPDATE ...;`, then `ROLLBACK;`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Finding and fixing the slow part',
    },
    {
      kind: 'text',
      text: "In the plan above, the slow part is clear: the `Seq Scan` read 20,000 rows to find 33. A big number in `Rows Removed by Filter` usually means a missing index. Add an index on the column in the `WHERE` clause, and measure again:",
    },
    {
      kind: 'example',
      label: 'after-the-index.sql',
      setup: BIG_ORDERS_SETUP,
      code: `CREATE INDEX big_orders_ordered_on_idx ON big_orders (ordered_on);

EXPLAIN ANALYZE
SELECT status, count(*)
FROM big_orders
WHERE ordered_on = '2025-03-01'
GROUP BY status;`,
    },
    {
      kind: 'text',
      text: "Now a Bitmap Index Scan finds the 33 rows through the index, and no rows are removed by a filter. On our computer, the execution time fell from 2 or 3 ms to well under 1 ms, about ten times faster. The planner also chose another way to group: `HashAggregate` puts the rows into groups with a hash table, so it does not need to sort them first.",
    },
    {
      kind: 'text',
      text: "Here are the problems you will meet most often, and what to do about each one.",
    },
    {
      kind: 'text',
      text: "**1. A function on an indexed column.** When you wrap a column in a function, like `to_char(ordered_on, 'YYYY-MM')`, the index on `ordered_on` cannot help. The index holds dates, not the text that `to_char` makes. Compare the column itself with a range instead. (Or make an expression index for that exact function.)",
    },
    {
      kind: 'example',
      label: 'function-on-column.sql',
      setup: `${BIG_ORDERS_SETUP}
CREATE INDEX big_orders_ordered_on_idx ON big_orders (ordered_on);`,
      code: `-- Slow: the function hides the column from the index
EXPLAIN ANALYZE
SELECT count(*) FROM big_orders
WHERE to_char(ordered_on, 'YYYY-MM') = '2025-03';

-- Fast: the column itself, compared with a range
EXPLAIN ANALYZE
SELECT count(*) FROM big_orders
WHERE ordered_on >= '2025-03-01' AND ordered_on < '2025-04-01';`,
    },
    {
      kind: 'text',
      text: "Both queries find the same 1,023 orders from March 2025. The first one does a `Seq Scan` and runs `to_char` on all 20,000 rows. The second one uses the index on `ordered_on`.",
    },
    {
      kind: 'text',
      text: "**2. `SELECT *` everywhere.** Ask only for the columns you need. `SELECT *` sends every column to the app, including long text and big `jsonb` values that the page never shows. It also blocks a useful trick: when all the columns a query needs are inside an index, PostgreSQL can answer from the index alone, without reading the table. The plan then says `Index Only Scan`.",
    },
    {
      kind: 'text',
      text: "**3. N+1 queries.** This problem lives in the app code, not in SQL. The app runs one query to get a list, then one more query for every item in the list. For 100 orders, that is 101 trips to the database. Each trip is quick, but together they are slow. Get everything in one query instead, with a `JOIN`. (`pool.query` sends one SQL statement from Node.js. The lesson about using PostgreSQL from code explains it.)",
    },
    {
      kind: 'example',
      label: 'n-plus-one.js',
      lang: 'javascript',
      run: 'none',
      verdict: 'bad',
      code: `// 1 query for the list of orders...
const { rows: orders } = await pool.query(
  "SELECT id, customer_id FROM orders WHERE status = 'pending'"
);

// ...then 1 more query for EACH order: N+1 queries in total
for (const order of orders) {
  const { rows } = await pool.query(
    'SELECT first_name FROM customers WHERE id = $1',
    [order.customer_id]
  );
  console.log(order.id, rows[0].first_name);
}`,
    },
    {
      kind: 'example',
      label: 'one-query.js',
      lang: 'javascript',
      run: 'none',
      verdict: 'good',
      code: `// One query does the whole job
const { rows } = await pool.query(\`
  SELECT o.id, c.first_name
  FROM orders AS o
  JOIN customers AS c ON c.id = o.customer_id
  WHERE o.status = 'pending'\`);

for (const row of rows) {
  console.log(row.id, row.first_name);
}`,
    },
    {
      kind: 'text',
      text: "**4. Deep pages with `OFFSET`.** Lists with pages, like page 1,501 of all orders, are often written with `OFFSET`: skip 15,000 rows, then take 10. But PostgreSQL cannot jump over rows. It must read all 15,010 rows and throw the first 15,000 away, so the deeper the page, the slower the query. **Keyset pagination** remembers where the last page ended (here, the last `id` shown) and starts right after it.",
    },
    {
      kind: 'example',
      label: 'pagination.sql',
      setup: BIG_ORDERS_SETUP,
      code: `-- OFFSET: skip 15,000 rows, then take 10
EXPLAIN ANALYZE
SELECT * FROM big_orders ORDER BY id LIMIT 10 OFFSET 15000;

-- Keyset: start after the last id of the previous page
EXPLAIN ANALYZE
SELECT * FROM big_orders WHERE id > 15000 ORDER BY id LIMIT 10;`,
    },
    {
      kind: 'text',
      text: "Look at `rows=` on the `Index Scan` line of each plan: 15,010 rows for `OFFSET`, but only 10 for the keyset query. Both return the same 10 orders, 15001 to 15010. Keyset pagination needs a unique column with an index to sort by, like `id`. In return, it is just as fast on page 1,501 as on page 1.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'VACUUM, ANALYZE and statistics',
    },
    {
      kind: 'text',
      text: "When you `UPDATE` a row, PostgreSQL does not change it in place. It writes a new version of the row and marks the old version as **dead**. (That is how other transactions can still read the old version while you change it.) A `DELETE` also leaves dead rows behind. Dead rows take up space until `VACUUM` cleans them up. `VACUUM` marks their space as free, so that new rows can use it. It usually does not make the table file smaller.",
    },
    {
      kind: 'example',
      label: 'vacuum.sql',
      setup: BIG_ORDERS_SETUP,
      code: `SELECT pg_size_pretty(pg_table_size('big_orders')) AS size;

-- Change half of the rows: 10,000 new versions, 10,000 dead ones
UPDATE big_orders SET total = total + 1 WHERE id <= 10000;
SELECT pg_size_pretty(pg_table_size('big_orders')) AS size;

VACUUM big_orders;

-- Change them again: the new versions reuse the free space
UPDATE big_orders SET total = total + 1 WHERE id <= 10000;
SELECT pg_size_pretty(pg_table_size('big_orders')) AS size;`,
    },
    {
      kind: 'text',
      text: "The table grew from 1216 kB to 1800 kB with the first `UPDATE`. After `VACUUM`, the second `UPDATE` reused the free space, so the table stayed at about 1800 kB. Now delete the `VACUUM` line and run again: without it, the table grows to 2392 kB.",
    },
    {
      kind: 'text',
      text: "You rarely need to run `VACUUM` yourself. **Autovacuum** is a helper inside PostgreSQL, and it is on by default. It watches every table and runs `VACUUM` and `ANALYZE` when enough rows have changed. Do not turn it off. If a very busy table makes dead rows faster than autovacuum can clean them, the table becomes big and slow; this is called **bloat**. On a real server, the view `pg_stat_user_tables` shows `n_dead_tup` (the number of dead rows) and `last_autovacuum` for each table. `VACUUM FULL` rewrites a table to give the space back to the disk, but it locks the table while it works.",
    },
    {
      kind: 'text',
      text: "The planner chooses a plan from **statistics**: facts about each column, like its most common values and how many different values it has. `ANALYZE` collects them by reading a sample of the table. Autovacuum runs it for you, but after you load a lot of data at once, run `ANALYZE` yourself. In this example, the hidden setup fills `big_orders` but does not analyze it.",
    },
    {
      kind: 'example',
      label: 'statistics.sql',
      setup: BIG_ORDERS_TABLE,
      code: `-- The table is full, but nobody has run ANALYZE yet
EXPLAIN SELECT * FROM big_orders WHERE status = 'pending';

ANALYZE big_orders;
EXPLAIN SELECT * FROM big_orders WHERE status = 'pending';

-- What ANALYZE learned about the status column
SELECT n_distinct, most_common_vals, most_common_freqs
FROM pg_stats
WHERE tablename = 'big_orders' AND attname = 'status';`,
    },
    {
      kind: 'text',
      text: "Before `ANALYZE`, PostgreSQL guessed that 68 rows are pending. After it, the estimate is 400, which is exactly right. `pg_stats` shows what PostgreSQL learned: the column has 2 different values, `delivered` in 98% of the rows and `pending` in 2%. With bad estimates, the planner can choose a slow plan. So when `EXPLAIN ANALYZE` shows estimated rows that are far from the actual rows, run `ANALYZE` and look again.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Connection pooling',
    },
    {
      kind: 'text',
      text: "Every connection to PostgreSQL is a separate process on the server. It uses memory, and opening a new one takes time. A server also allows only a limited number of connections: the default `max_connections` is 100. A website with 1,000 visitors at the same moment cannot give each visitor a connection of their own.",
    },
    {
      kind: 'text',
      text: "A **connection pool** solves this. It keeps a few connections open and lends them out, like a library lends books. A web request borrows a connection, runs its queries, and gives it back for the next request. Most database libraries have a pool built in, and you will use one in the lesson about code. For many app servers, a tool such as **PgBouncer** sits between the apps and PostgreSQL and shares a small number of real connections.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'A checklist for a slow query',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            "Run `EXPLAIN ANALYZE` on the slow query, a few times.",
            "Find the step with the most time, or a big `Rows Removed by Filter`.",
            "Compare estimated rows with actual rows. If they are far apart, run `ANALYZE`.",
            "Add or change an index, or rewrite the condition so it can use one.",
            "Measure again. Keep the change only if it helped.",
          ],
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show the real time and the real row counts of this query.',
        code: `EXPLAIN [___]
SELECT * FROM big_orders WHERE customer_id = 7;`,
        answers: [['ANALYZE', 'analyze']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'The last page ended with the order whose `id` is 120. Get the next 10 orders with keyset pagination.',
        code: `SELECT * FROM big_orders
WHERE id [___] 120
ORDER BY id
[___] 10;`,
        answers: [['>'], ['LIMIT', 'limit']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'There is an index on `ordered_on`. Which condition can use it?',
        options: [
          "`ordered_on >= '2025-03-01' AND ordered_on < '2025-04-01'`",
          "`to_char(ordered_on, 'YYYY-MM') = '2025-03'`",
          "`extract(month FROM ordered_on) = 3`",
          "`ordered_on::text LIKE '2025-03%'`",
        ],
        answer: "`ordered_on >= '2025-03-01' AND ordered_on < '2025-04-01'`",
      },
    },
  ],
};
