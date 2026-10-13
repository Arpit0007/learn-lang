import { Lesson } from '../../shared/content';

/** The sales table from the first example, with its three rows. */
const SALES_SETUP = `CREATE TABLE sales (
  id      integer GENERATED ALWAYS AS IDENTITY,
  sold_on date NOT NULL,
  amount  numeric(10, 2) NOT NULL
) PARTITION BY RANGE (sold_on);
CREATE TABLE sales_2024 PARTITION OF sales
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE sales_2025 PARTITION OF sales
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
INSERT INTO sales (sold_on, amount) VALUES
  ('2024-03-15', 20.00),
  ('2024-11-30', 12.50),
  ('2025-07-01', 35.50);`;

/** 20,000 events in four quarterly partitions. */
const EVENTS_SETUP = `CREATE TABLE order_events (
  id          integer GENERATED ALWAYS AS IDENTITY,
  order_id    integer NOT NULL,
  happened_on date NOT NULL,
  event       text NOT NULL
) PARTITION BY RANGE (happened_on);
CREATE TABLE order_events_2025_q1 PARTITION OF order_events FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
CREATE TABLE order_events_2025_q2 PARTITION OF order_events FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');
CREATE TABLE order_events_2025_q3 PARTITION OF order_events FOR VALUES FROM ('2025-07-01') TO ('2025-10-01');
CREATE TABLE order_events_2025_q4 PARTITION OF order_events FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
INSERT INTO order_events (order_id, happened_on, event)
SELECT 1 + g % 500,
       DATE '2025-01-01' + g % 365,
       (ARRAY['created', 'paid', 'shipped', 'delivered'])[1 + g % 4]
FROM generate_series(1, 20000) AS g;
ANALYZE order_events;`;

export const PARTITIONING_REPLICATION: Lesson = {
  slug: 'partitioning-replication',
  title: 'Partitioning and Replication',
  nav: 'Partitioning & replication',
  blocks: [
    {
      kind: 'text',
      text: "Some tables never stop growing: orders, page views, payments, logs. After a few years they can hold billions of rows. Queries get slower, indexes get huge, and deleting old data takes hours. And the whole shop depends on one server: if it breaks, the shop is closed. This lesson covers two answers. **Partitioning** splits one big table into smaller pieces. **Replication** keeps live copies of the whole database on other servers.",
    },
    {
      kind: 'text',
      text: "You can run all the partitioning examples. Replication needs several servers, so that part is explained in words, with one small check that runs here.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Declarative partitioning',
    },
    {
      kind: 'text',
      text: "A **partitioned table** is a parent table that holds no rows itself. Its rows live in child tables called **partitions**. Each partition holds one range of values of the **partition key**, for example one year of dates. You read from and write to the parent table as usual, and PostgreSQL sends each row to the right partition. You only say how to split the table; PostgreSQL does the rest. That is why this is called *declarative* partitioning.",
    },
    {
      kind: 'example',
      label: 'partitions.sql',
      code: `-- The parent: it says how to split the rows, but holds none itself
CREATE TABLE sales (
  id      integer GENERATED ALWAYS AS IDENTITY,
  sold_on date NOT NULL,
  amount  numeric(10, 2) NOT NULL
) PARTITION BY RANGE (sold_on);

-- One partition for each year
CREATE TABLE sales_2024 PARTITION OF sales
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE sales_2025 PARTITION OF sales
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Insert into the parent: each row goes to the right partition
INSERT INTO sales (sold_on, amount) VALUES
  ('2024-03-15', 20.00),
  ('2024-11-30', 12.50),
  ('2025-07-01', 35.50);

SELECT tableoid::regclass AS partition, id, sold_on, amount
FROM sales
ORDER BY id;

-- You can also read one partition directly
SELECT * FROM sales_2025;`,
    },
    {
      kind: 'text',
      text: "`tableoid` is a hidden column on every table. `tableoid::regclass` shows the name of the table that a row is really stored in: two rows are in `sales_2024`, and one is in `sales_2025`. In `FOR VALUES FROM ... TO ...`, the `FROM` date belongs to the partition, but the `TO` date does not. So `'2025-01-01'` goes into `sales_2025`, not into `sales_2024`.",
    },
    {
      kind: 'text',
      text: "What happens with a row that fits in no partition? The hidden setup of the next two examples creates the same `sales` table, with its three rows.",
    },
    {
      kind: 'example',
      label: 'no-partition.sql',
      setup: SALES_SETUP,
      expectError: true,
      code: `INSERT INTO sales (sold_on, amount) VALUES ('2026-02-01', 10.00);`,
    },
    {
      kind: 'text',
      text: "The insert fails with `no partition of relation \"sales\" found for row`, because there is no partition for 2026. There are two fixes. Create each partition before its data arrives; many teams run a small scheduled job that creates next month's or next year's partition. And you can add a `DEFAULT` partition, which catches every row that fits nowhere else.",
    },
    {
      kind: 'example',
      label: 'more-partitions.sql',
      setup: SALES_SETUP,
      code: `-- Next year's partition, made before the data arrives
CREATE TABLE sales_2026 PARTITION OF sales
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- A DEFAULT partition for every row that fits nowhere else
CREATE TABLE sales_other PARTITION OF sales DEFAULT;

INSERT INTO sales (sold_on, amount) VALUES
  ('2026-02-01', 10.00),
  ('2019-05-05', 7.25);

SELECT tableoid::regclass AS partition, sold_on, amount
FROM sales
ORDER BY sold_on;`,
    },
    {
      kind: 'text',
      text: "The 2026 sale went into `sales_2026`, and the sale from 2019 went into `sales_other`. Use the default partition as a safety net, not as the plan: if many rows land there, it becomes one more big table.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Keys must include the partition key',
      blocks: [
        {
          kind: 'text',
          text: "Each partition checks only its own rows for duplicates. So a `PRIMARY KEY` or `UNIQUE` constraint on a partitioned table must include the partition key. `PRIMARY KEY (id)` on `sales` fails with `unique constraint on partitioned table must include all partitioning columns`. Write `PRIMARY KEY (id, sold_on)` instead.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Partition pruning',
    },
    {
      kind: 'text',
      text: "The big win of partitions comes when the `WHERE` clause uses the partition key. Then PostgreSQL skips every partition that cannot hold matching rows. This is called **partition pruning**. The hidden setup creates a table `order_events` with 20,000 rows, in four partitions: one for each quarter (three months) of 2025.",
    },
    {
      kind: 'example',
      label: 'pruning.sql',
      setup: EVENTS_SETUP,
      code: `SELECT tableoid::regclass AS partition, count(*)
FROM order_events
GROUP BY 1
ORDER BY 1;

-- Uses the partition key: only one partition is read
EXPLAIN SELECT count(*) FROM order_events
WHERE happened_on BETWEEN '2025-05-01' AND '2025-05-31';

-- Does not use the partition key: every partition is read
EXPLAIN SELECT count(*) FROM order_events
WHERE order_id = 42;`,
    },
    {
      kind: 'text',
      text: "Each partition holds about 5,000 rows. The query for May reads only `order_events_2025_q2`: the plan does not even mention the other three partitions. The query on `order_id` must read all four, and an `Append` step joins their rows together. So choose the partition key from the column that most of your queries filter on, which is usually a date.",
    },
    {
      kind: 'text',
      text: "Partitions also make old data easy to remove. Deleting a year of rows with `DELETE` is slow, and it leaves millions of dead rows for `VACUUM`. Removing a partition is almost instant:",
    },
    {
      kind: 'example',
      label: 'drop-old-data.sql',
      setup: SALES_SETUP,
      code: `-- Take the 2024 partition out of sales: it becomes a normal table
ALTER TABLE sales DETACH PARTITION sales_2024;

-- (You could back it up with pg_dump now.) Then drop it.
DROP TABLE sales_2024;

SELECT tableoid::regclass AS partition, sold_on, amount FROM sales;`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'When to partition',
      blocks: [
        {
          kind: 'text',
          text: "Partition a table only when it is really big (many millions of rows, or tens of gigabytes) and most queries filter on the same column, usually a date. On a small table, partitions only add work: an index is the better tool. Every partition is a real table, so keep their number reasonable, for example one per month. Read [Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html) in the manual for the other kinds, `PARTITION BY LIST` and `PARTITION BY HASH`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Replication in simple words',
    },
    {
      kind: 'text',
      text: "**Replication** keeps copies of a whole database server on other servers. The main server is called the **primary**, and it is the only one that accepts writes. Every change on the primary is first written to the **WAL**, the write-ahead log that you met in the backup lesson. With **streaming replication**, the primary sends its WAL to one or more **replicas** (also called standbys) while it writes it. Each replica replays the changes, so it stays an exact copy of the primary, usually less than a second behind.",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Read replicas.** A replica accepts read-only queries. You can send reports and other heavy reads to a replica, so the primary has more time for orders. But a replica can be a little behind: an order saved a moment ago may not be on the replica yet.",
        "**Failover.** If the primary breaks, you **promote** a replica with `pg_promote()`. It becomes the new primary and starts to accept writes, and the app connects to it instead. Tools such as Patroni, and cloud database services, notice the failure and do the failover for you, often in less than a minute.",
      ],
    },
    {
      kind: 'text',
      text: "To create a replica, you copy the primary with `pg_basebackup`, as in the backup lesson. The `--write-recovery-conf` option also writes the settings that tell the new server to follow the primary. When you start PostgreSQL on it, it connects to the primary and streams the WAL.",
    },
    {
      kind: 'example',
      label: 'terminal · on the new replica',
      lang: 'text',
      run: 'none',
      code: `pg_basebackup --host=primary-db --username=replicator --pgdata=/var/lib/postgresql/18/main --write-recovery-conf --progress`,
      output: `30544/30544 kB (100%), 1/1 tablespace`,
    },
    {
      kind: 'text',
      text: "Two checks tell you where you are. The function `pg_is_in_recovery()` returns `t` on a replica and `f` on a primary. On a primary, the view `pg_stat_replication` has one row for each replica that is connected, with its state and how far behind it is. The database in your browser is a primary with no replicas:",
    },
    {
      kind: 'example',
      label: 'replication-check.sql',
      code: `-- t on a replica, f on a primary
SELECT pg_is_in_recovery();

-- On a primary: one row for each connected replica
SELECT client_addr, state, replay_lag
FROM pg_stat_replication;`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'A replica is not a backup',
      blocks: [
        {
          kind: 'text',
          text: "If someone runs `DELETE FROM orders` on the primary, the replicas delete the orders too, less than a second later. Replicas protect you from a broken server, not from mistakes. You still need backups.",
        },
      ],
    },
    {
      kind: 'text',
      text: "Backups, replicas and partitions are often confused, because they all deal with copies or pieces of data. This table shows what each one is for:",
    },
    {
      kind: 'table',
      head: ['Question', 'Backup', 'Replica', 'Partitions'],
      rows: [
        ['What is it?', 'A saved copy of the data from one moment', 'A live copy of the whole server', 'One big table split into smaller tables'],
        ['Where does it live?', 'In a safe place, away from the server', 'On another server', 'On the same server'],
        ['Brings back data after a bad `DELETE`?', 'Yes', 'No, the replica deletes it too', 'No'],
        ['Keeps the shop open if the server dies?', 'Slowly: you must restore first', 'Yes, after a failover', 'No'],
        ['Makes queries faster?', 'No', 'Yes, it can take some of the reads', 'Yes, on very big tables'],
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Create a table `logs` that is split by date, and a partition for the year 2026.',
        code: `CREATE TABLE logs (
  logged_on date NOT NULL,
  message   text NOT NULL
) PARTITION BY [___] (logged_on);

CREATE TABLE logs_2026 PARTITION [___] logs
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');`,
        answers: [['RANGE', 'range'], ['OF', 'of']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: "A partition is made with `FOR VALUES FROM ('2025-01-01') TO ('2026-01-01')`. Which date does **not** belong in it?",
        options: ["`'2026-01-01'`", "`'2025-01-01'`", "`'2025-12-31'`", "`'2025-06-15'`"],
        answer: "`'2026-01-01'`",
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Why is a replica not a backup?',
        options: [
          'A mistake, like a bad `DELETE`, is copied to the replica too',
          'A replica cannot answer queries',
          'A replica is always one day behind the primary',
          'A replica holds only some of the tables',
        ],
        answer: 'A mistake, like a bad `DELETE`, is copied to the replica too',
      },
    },
  ],
};
