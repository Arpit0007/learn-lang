import { Lesson } from '../../shared/content';

/** 20,000 members, so the planner has a reason to use an index. Fewer than 30,000 rows keeps ANALYZE exact, so the plans never change. */
const MEMBERS_SETUP = `CREATE TABLE members (
  id        integer PRIMARY KEY,
  email     text NOT NULL,
  country   text NOT NULL,
  joined_on date NOT NULL
);
INSERT INTO members (id, email, country, joined_on)
SELECT g,
       'user' || g || '@example.com',
       (ARRAY['India', 'UK', 'Spain', 'Japan', 'Nigeria'])[1 + g % 5],
       DATE '2020-01-01' + g % 2000
FROM generate_series(1, 20000) AS g;
ANALYZE members;`;

/** 20,000 orders from 2,000 customers; 2% of them are pending. */
const BIG_ORDERS_SETUP = `CREATE TABLE big_orders (
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
FROM generate_series(1, 20000) AS g;
ANALYZE big_orders;`;

const EVENTS_SETUP = `CREATE TABLE events (
  id   integer PRIMARY KEY,
  data jsonb NOT NULL
);
INSERT INTO events (id, data)
SELECT g, jsonb_build_object('type', (ARRAY['view', 'click', 'buy'])[1 + g % 3], 'user_id', 1 + g % 500)
FROM generate_series(1, 20000) AS g;
ANALYZE events;`;

export const INDEXES: Lesson = {
  slug: 'indexes',
  title: 'Indexes and EXPLAIN',
  nav: 'Indexes & EXPLAIN',
  blocks: [
    {
      kind: 'text',
      text: "Think of a thick book. To find every page about \"tea\", you could read the whole book, page by page. Or you could turn to the **index** at the back, find \"tea\", and go straight to the right pages. A database index works the same way. It is a separate, sorted list of the values in a column, and each value points to the rows that have it.",
    },
    {
      kind: 'text',
      text: "Without an index, PostgreSQL must read every row of the table to find the ones you want. This is a **sequential scan**. With an index, it can jump to the right rows. On a table with millions of rows, that is the difference between seconds and milliseconds. In this lesson you create indexes, and you use `EXPLAIN` to see whether PostgreSQL uses them.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Your first index and EXPLAIN',
    },
    {
      kind: 'text',
      text: "Put `EXPLAIN` in front of a query to see its **plan**: the steps PostgreSQL will take to run it. `EXPLAIN` does not run the query. It only shows the plan that the **planner** chose. The planner is the part of PostgreSQL that looks at the size of each table and picks the way it thinks is fastest.",
    },
    {
      kind: 'text',
      text: "Indexes matter on big tables, so the hidden setup of this example creates a table `members` with 20,000 rows. The query looks for one email address, first without an index and then with one.",
    },
    {
      kind: 'example',
      label: 'first-index.sql',
      setup: MEMBERS_SETUP,
      code: `-- A few rows, to see what is inside
SELECT * FROM members ORDER BY id LIMIT 3;

-- Before: there is no index on email
EXPLAIN SELECT * FROM members WHERE email = 'user4242@example.com';

CREATE INDEX members_email_idx ON members (email);

-- After: the same query
EXPLAIN SELECT * FROM members WHERE email = 'user4242@example.com';`,
    },
    {
      kind: 'text',
      text: "`CREATE INDEX` takes a name for the index, the table, and the column in brackets. A common way to name an index is `table_column_idx`. Each line of the plan means something:",
    },
    {
      kind: 'table',
      head: ['Part of the plan', 'What it means'],
      rows: [
        ['`Seq Scan on members`', 'Read every row of the table, one after another'],
        ['`Filter: (email = ...)`', 'The condition that is checked on each row'],
        ['`Index Scan using members_email_idx`', 'Use the index to jump to the matching rows'],
        ['`Index Cond: (email = ...)`', 'The condition that the index answers'],
        ['`cost=0.29..8.30`', 'The estimated work: to the first row, then to the last row. It is not seconds. Smaller is better'],
        ['`rows=1`', 'How many rows PostgreSQL expects to find'],
        ['`width=34`', 'The average size of one row, in bytes'],
      ],
    },
    {
      kind: 'text',
      text: "The cost fell from 415 to about 8. The index lets PostgreSQL skip almost all of the 20,000 rows. The numbers are estimates: `EXPLAIN` guesses, it does not measure. In the next lesson, `EXPLAIN ANALYZE` measures the real time.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Indexes PostgreSQL makes for you',
    },
    {
      kind: 'text',
      text: "The shop's tables already have some indexes. PostgreSQL makes one for every `PRIMARY KEY` and every `UNIQUE` constraint, because it needs them to find duplicates quickly. The view `pg_indexes` lists them.",
    },
    {
      kind: 'example',
      label: 'existing-indexes.sql',
      code: `SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- A tiny table: the index on email exists, but is it used?
ANALYZE customers;
EXPLAIN SELECT * FROM customers WHERE email = 'dana.lee@example.com';`,
    },
    {
      kind: 'text',
      text: "Names that end in `_pkey` come from primary keys, and names that end in `_key` come from `UNIQUE` constraints. But look at the plan: PostgreSQL does a `Seq Scan` on `customers`, even though `customers_email_key` is there. All 12 customers fit in one small page, so reading that page is quicker than using the index first. Indexes pay off on big tables. (`ANALYZE` makes PostgreSQL look at the table and count its rows, so it knows the table is tiny. The next lesson explains it.)",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Foreign keys get no index',
      blocks: [
        {
          kind: 'text',
          text: "PostgreSQL does not make an index for a `FOREIGN KEY`. In the list above, nothing covers `orders.customer_id` or `products.category_id`, but joins use those columns all the time. When those tables grow, add the indexes yourself, for example `CREATE INDEX orders_customer_id_idx ON orders (customer_id);`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'More kinds of indexes',
    },
    {
      kind: 'text',
      text: "One index can cover more than one column. A **multi-column index** on `(customer_id, ordered_on)` is sorted by customer first, and then by date inside each customer. It is like a phone book, which is sorted by last name, then by first name. The hidden setup creates a table `big_orders` with 20,000 orders from 2,000 customers.",
    },
    {
      kind: 'example',
      label: 'multi-column.sql',
      setup: BIG_ORDERS_SETUP,
      code: `CREATE INDEX big_orders_customer_date_idx
  ON big_orders (customer_id, ordered_on);

-- Filters on both columns
EXPLAIN SELECT * FROM big_orders
WHERE customer_id = 42 AND ordered_on >= '2025-01-01';

-- Filters only on the second column
EXPLAIN SELECT * FROM big_orders
WHERE ordered_on = '2025-03-01';`,
    },
    {
      kind: 'text',
      text: "The first query uses both columns, so the index finds the matching rows at once (cost about 18). This time PostgreSQL used the index in two steps. A **Bitmap Index Scan** goes through the index and marks where the matching rows are. Then a **Bitmap Heap Scan** reads those rows from the table (PostgreSQL calls the table's own data the *heap*). It is still an index search. PostgreSQL often picks it when more than a few rows match.",
    },
    {
      kind: 'text',
      text: "The second query filters only on `ordered_on`, the second column, so PostgreSQL reads the whole table instead. It is like looking for everyone called \"Ana\" in a phone book that is sorted by last name. **Put the column that your queries always filter on first.** (PostgreSQL 18 can sometimes still use such an index with a *skip scan*, but only when the first column has few different values. Here there are 2,000 customers.)",
    },
    {
      kind: 'text',
      text: "An **expression index** stores the result of a function instead of the plain column. People type emails with capital letters in different places, so apps often search with `lower(email)`. An index on `email` cannot help with `lower(email)`, but an index on `lower(email)` can. Make it a `UNIQUE` index, and it also stops two members from using the same address with different capitals. This example uses the `members` table again.",
    },
    {
      kind: 'example',
      label: 'expression-index.sql',
      setup: MEMBERS_SETUP,
      expectError: true,
      code: `CREATE UNIQUE INDEX members_email_lower_idx ON members (lower(email));

EXPLAIN SELECT * FROM members WHERE lower(email) = 'user4242@example.com';

-- The same address with capital letters
INSERT INTO members (id, email, country, joined_on)
VALUES (20001, 'USER4242@example.com', 'UK', '2025-10-01');`,
    },
    {
      kind: 'text',
      text: "The query uses the new index. The `INSERT` fails with `duplicate key value violates unique constraint`, because `USER4242@example.com` in lower case is an address that is already there. The query must use the same expression as the index: a search for `email = '...'` cannot use this index.",
    },
    {
      kind: 'text',
      text: "A **partial index** has a `WHERE` clause, so it holds only some of the rows. In `big_orders`, 98% of the orders are delivered, and the shop often looks for the few pending ones. A partial index on the pending orders only is small and fast.",
    },
    {
      kind: 'example',
      label: 'partial-index.sql',
      setup: BIG_ORDERS_SETUP,
      code: `-- A normal index and a partial index on the same column
CREATE INDEX big_orders_date_idx ON big_orders (ordered_on);
CREATE INDEX big_orders_pending_idx ON big_orders (ordered_on)
  WHERE status = 'pending';

EXPLAIN SELECT * FROM big_orders
WHERE status = 'pending' AND ordered_on < '2024-02-01';

SELECT pg_size_pretty(pg_relation_size('big_orders_date_idx')) AS full_index,
       pg_size_pretty(pg_relation_size('big_orders_pending_idx')) AS partial_index;`,
    },
    {
      kind: 'text',
      text: "The query has the same condition as the index, `status = 'pending'`, so PostgreSQL uses the partial index. It is 32 kB, while the full index on the same column is 160 kB. `pg_relation_size` gives a size in bytes, and `pg_size_pretty` makes it easy to read. A query that does not say `status = 'pending'` cannot use the partial index.",
    },
    {
      kind: 'text',
      text: "The normal kind of index is a **B-tree**, and it is right for most columns: numbers, text and dates that you compare with `=`, `<` or `>`. For values that hold many parts, such as `jsonb` documents, arrays and full text search, PostgreSQL has the **GIN** index. It works like the index of a book: for each key or word, it lists the rows that contain it. You choose the type with `USING gin`. The hidden setup creates a table `events` with 20,000 rows, and each row has a `jsonb` document in the column `data`.",
    },
    {
      kind: 'example',
      label: 'gin-index.sql',
      setup: EVENTS_SETUP,
      code: `SELECT * FROM events ORDER BY id LIMIT 3;

CREATE INDEX events_data_idx ON events USING gin (data);

EXPLAIN SELECT * FROM events WHERE data @> '{"user_id": 42}';`,
    },
    {
      kind: 'text',
      text: "The `@>` operator means \"contains\". The GIN index finds the events whose `data` contains `\"user_id\": 42` without reading the other rows. The same kind of index works for arrays, as in `tags @> ARRAY['sale']`, and for full text search on `to_tsvector(...)`. GIN indexes are always read with a Bitmap Heap Scan.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Indexes are not free',
    },
    {
      kind: 'text',
      text: "An index is a second copy of some of your data, and PostgreSQL must keep it up to date. Every `INSERT`, `UPDATE` and `DELETE` changes the table **and** every index on it. So each extra index makes writes a little slower, and it uses disk space and memory. A busy table with ten indexes can spend more time updating indexes than writing the rows themselves.",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "Add an index when a real query needs it: columns that you often use in `WHERE`, `JOIN` and `ORDER BY`.",
        "Do not index every column. An index on a column with only a few values, like `status`, rarely helps unless you search for a rare value (then use a partial index).",
        "Remove indexes that nobody uses. The view `pg_stat_user_indexes` shows how many times each index was used, in the column `idx_scan`.",
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Building an index on a live table',
      blocks: [
        {
          kind: 'text',
          text: "A normal `CREATE INDEX` stops other sessions from changing the table until it is finished. On a big table, that can take minutes, and the app cannot save orders meanwhile. On a live server, use `CREATE INDEX CONCURRENTLY`. It takes longer, but the app keeps working. See [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) in the manual.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Create an expression index, so that searches on `lower(email)` in `customers` can use it.',
        code: `CREATE [___] customers_email_lower_idx ON customers ([___](email));`,
        answers: [['INDEX', 'index'], ['lower', 'LOWER']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A plan says `Seq Scan on orders` with `Filter: (customer_id = 7)`. What does PostgreSQL do?',
        options: [
          'It reads every row of `orders` and keeps the rows where `customer_id` is 7',
          'It uses an index on `customer_id` to jump to the rows',
          'It reads only the first row of `orders`',
          'It creates an index on `customer_id` first',
        ],
        answer: 'It reads every row of `orders` and keeps the rows where `customer_id` is 7',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A table has one index on `(country, city)`. Which query can use it best?',
        options: [
          "`WHERE country = 'UK' AND city = 'London'`",
          "`WHERE city = 'London'`",
          "`WHERE lower(country) = 'uk'`",
          "`WHERE first_name = 'Ben'`",
        ],
        answer: "`WHERE country = 'UK' AND city = 'London'`",
      },
    },
  ],
};
