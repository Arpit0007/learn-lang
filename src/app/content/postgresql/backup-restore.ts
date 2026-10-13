import { Lesson } from '../../shared/content';

export const BACKUP_RESTORE: Lesson = {
  slug: 'backup-restore',
  title: 'Backup and Restore',
  nav: 'Backup & restore',
  blocks: [
    {
      kind: 'text',
      text: "A **backup** is a copy of your data that you keep in a safe place. You need it when something goes wrong: someone drops the wrong table, a disk breaks, a new version of the app saves bad data, or an attacker locks your files. A **restore** is the way back: you load the copy into a database, and the shop can open again.",
    },
    {
      kind: 'text',
      text: "PostgreSQL comes with command-line tools for this: `pg_dump`, `pg_dumpall`, `pg_restore` and `psql`. You run them in a terminal, not inside SQL, so the commands on this page are copy-only. Press **Show output** to see what they print. Some SQL examples still run in your browser, as usual.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'pg_dump: back up one database',
    },
    {
      kind: 'text',
      text: "`pg_dump` connects to one database and writes everything in it to a file: tables, data, indexes, views and functions. The app can keep working while it runs. The dump shows the database exactly as it was when the dump started, even if people change data during the dump. `pg_dump` can write two main formats:",
    },
    {
      kind: 'table',
      head: ['Format', 'How to ask for it', 'What you get', 'Restore it with'],
      rows: [
        ['Plain SQL', 'The default', 'A text file full of SQL statements', '`psql`'],
        ['Custom', '`--format=custom`', "A compressed file in PostgreSQL's own format", '`pg_restore`'],
      ],
    },
    {
      kind: 'example',
      label: 'terminal',
      lang: 'text',
      run: 'none',
      code: `pg_dump --username=postgres --dbname=shop --file=shop.sql
grep "CREATE TABLE" shop.sql`,
      output: `CREATE TABLE public.categories (
CREATE TABLE public.customers (
CREATE TABLE public.employees (
CREATE TABLE public.order_items (
CREATE TABLE public.orders (
CREATE TABLE public.products (`,
    },
    {
      kind: 'text',
      text: "`pg_dump` prints nothing when it works. (If the server needs a password, it asks you for one.) The `grep` command shows the lines of `shop.sql` that contain `CREATE TABLE`: one for each table of the shop. A plain dump is just SQL, so you can open it in any text editor. Here is a small piece of a dump of one table. It was made with the `--inserts` option, which writes the data as `INSERT` statements. Press **Run** to restore it into the browser database.",
    },
    {
      kind: 'example',
      label: 'reviews-dump.sql',
      code: `--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    stars integer NOT NULL,
    comment text
);

ALTER TABLE public.reviews OWNER TO postgres;

--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews VALUES (1, 3, 5, 'Beautiful maps.');
INSERT INTO public.reviews VALUES (2, 8, 4, 'Good mug, a bit small.');
INSERT INTO public.reviews VALUES (3, 6, 2, NULL);

--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);

-- (Not part of the dump.) Check that the table is back:
SELECT * FROM reviews ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Notice the order: first the table, then the data, then the constraints. Loading the rows before the constraints and indexes exist is much faster. Without `--inserts`, `pg_dump` writes the data with `COPY` instead, which is faster again.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Restoring a dump',
    },
    {
      kind: 'text',
      text: "To restore a plain dump, make an empty database with `createdb`, then run the file with `psql`. The `--file` option tells `psql` to read SQL from a file instead of from the keyboard.",
    },
    {
      kind: 'example',
      label: 'terminal',
      lang: 'text',
      run: 'none',
      code: `createdb --username=postgres shop_restored
psql --username=postgres --dbname=shop_restored --file=shop.sql`,
      output: `...
CREATE TABLE
ALTER TABLE
...
COPY 5
COPY 12
COPY 9
COPY 26
COPY 16
COPY 14
...
ALTER TABLE`,
    },
    {
      kind: 'text',
      text: "`psql` prints one line for each statement in the file (the output is shortened here). `COPY 12` means that 12 rows went into a table, here `customers`. The tables are loaded in name order: 5 categories, 12 customers, 9 employees, 26 order items, 16 orders and 14 products.",
    },
    {
      kind: 'text',
      text: "For real backups, most people use the **custom format**. It is compressed, so the file is smaller. `pg_restore` can load it with several workers at the same time (`--jobs=4`), and it can restore only the parts you choose, such as one table. You can also look inside the file with `pg_restore --list`.",
    },
    {
      kind: 'example',
      label: 'terminal',
      lang: 'text',
      run: 'none',
      code: `pg_dump --username=postgres --dbname=shop --format=custom --file=shop.dump
createdb --username=postgres shop_test
pg_restore --username=postgres --dbname=shop_test --jobs=4 shop.dump
psql --username=postgres --dbname=shop_test --command="SELECT count(*) FROM orders;"`,
      output: ` count
-------
    16
(1 row)`,
    },
    {
      kind: 'text',
      text: "`pg_dump` and `pg_restore` are quiet when everything works. The last command runs one query with `--command`, to check that the 16 orders arrived.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'One table, and the whole server',
    },
    {
      kind: 'text',
      text: "Add `--table` to back up just one table. This is handy before a risky change to that table.",
    },
    {
      kind: 'example',
      label: 'terminal',
      lang: 'text',
      run: 'none',
      code: `pg_dump --username=postgres --dbname=shop --table=customers --file=customers.sql
grep -c "@example.com" customers.sql`,
      output: `12`,
    },
    {
      kind: 'text',
      text: "`grep -c` counts the lines that contain an email address: one line of data for each of the 12 customers.",
    },
    {
      kind: 'text',
      text: "One PostgreSQL server can hold many databases, and some things belong to the whole server, not to one database. The most important are the **roles** (users and groups). So `pg_dump` does not save roles. `pg_dumpall --globals-only` saves them. Without `--globals-only`, `pg_dumpall` saves every database on the server too, as one big SQL file.",
    },
    {
      kind: 'example',
      label: 'terminal',
      lang: 'text',
      run: 'none',
      code: `pg_dumpall --username=postgres --globals-only --file=globals.sql
grep "CREATE ROLE" globals.sql`,
      output: `CREATE ROLE analysts;
CREATE ROLE postgres;
CREATE ROLE shop_app;`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Restore the roles first',
      blocks: [
        {
          kind: 'text',
          text: "On a new server, restore `globals.sql` with `psql` **before** your database dumps. If the roles are missing, every `GRANT` in the dump fails with an error like `role \"shop_app\" does not exist`, and the app cannot log in afterwards.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Test your backups',
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'A backup that is never restored is not a backup',
      blocks: [
        {
          kind: 'text',
          text: "Many teams find out on the worst day that their backups were empty, broken or missing a table. The only proof that a backup works is a restore. Restore your backups into a separate test database on a regular day, for example every week, and check the data. Write down how long the restore took: that is how long the shop would be closed. Keep copies in a second place, away from the server, and keep several days of them.",
        },
      ],
    },
    {
      kind: 'text',
      text: "After a test restore, compare the restored database with the real one. A simple check is to count the rows in the most important tables on both, and compare the numbers. This is the check for the shop:",
    },
    {
      kind: 'example',
      label: 'check-restore.sql',
      code: `SELECT 'customers' AS table_name, count(*) AS row_count FROM customers
UNION ALL
SELECT 'orders', count(*) FROM orders
UNION ALL
SELECT 'order_items', count(*) FROM order_items
UNION ALL
SELECT 'products', count(*) FROM products;`,
    },
    {
      kind: 'text',
      text: "Before a risky change, you can also make a quick copy of one table inside the database with `CREATE TABLE ... AS TABLE ...`. In this example, someone forgets the `WHERE` in an `UPDATE`, and the copy saves the day:",
    },
    {
      kind: 'example',
      label: 'safety-copy.sql',
      code: `-- A quick copy before a risky change
CREATE TABLE orders_copy AS TABLE orders;

-- Oops: no WHERE, so every order is now cancelled
UPDATE orders SET status = 'cancelled';

-- Put the old values back from the copy
UPDATE orders AS o
SET status = c.status
FROM orders_copy AS c
WHERE c.id = o.id;

SELECT status, count(*) FROM orders GROUP BY status ORDER BY status;`,
    },
    {
      kind: 'text',
      text: "The last query shows the old statuses again: 10 delivered, 2 cancelled, 2 pending and 2 shipped. `UPDATE ... FROM` joins `orders` with the copy, so each order gets back its own status.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'A copy on the same server is not a backup',
      blocks: [
        {
          kind: 'text',
          text: "`orders_copy` lives in the same database as `orders`. If the server breaks, both are lost. It is a safety net for one change, and you should drop it afterwards. Real backups go to another machine.",
        },
      ],
    },
    {
      kind: 'text',
      text: "**Point-in-time recovery.** A dump is a picture of the database at one moment. If you make a dump every night at 02:00, and someone deletes all the orders at 14:32, the dump cannot bring back the orders from that morning. Point-in-time recovery (PITR) can. PostgreSQL writes every change to the **write-ahead log** (WAL) before it changes the data files. So keep a copy of all the data files (a **base backup**), and also keep every WAL file that is written after it. Then you can restore the base backup and replay the changes up to any moment you choose, for example 14:31, one minute before the mistake.",
    },
    {
      kind: 'example',
      label: 'terminal',
      lang: 'text',
      run: 'none',
      code: `# 1. In postgresql.conf: copy every finished WAL file to a safe place
#    archive_mode = on
#    archive_command = 'cp %p /backups/wal/%f'

# 2. Every night: a base backup of all the data files
pg_basebackup --username=postgres --pgdata=/backups/base/2026-10-06 --format=tar --gzip --progress

# 3. To restore: unpack the base backup, tell PostgreSQL where to stop,
#    and create an empty file called recovery.signal in the data folder
#    restore_command = 'cp /backups/wal/%f %p'
#    recovery_target_time = '2026-10-06 14:31:00'`,
      output: `30544/30544 kB (100%), 1/1 tablespace`,
    },
    {
      kind: 'text',
      text: "Most teams let a backup tool such as pgBackRest or Barman do these steps, or they use a cloud database where backups and PITR are built in. The idea is always the same: a base backup plus the WAL files. Read [Continuous Archiving and Point-in-Time Recovery](https://www.postgresql.org/docs/current/continuous-archiving.html) in the manual to learn more.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make a custom-format backup of the `shop` database, then restore it into the database `shop_test`.',
        code: `pg_dump --dbname=shop --format=[___] --file=shop.dump
[___] --dbname=shop_test shop.dump`,
        answers: [['custom', 'c'], ['pg_restore']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which command saves the roles (users and groups) of a server?',
        options: [
          '`pg_dumpall --globals-only`',
          '`pg_dump --dbname=shop`',
          '`pg_restore --list`',
          '`createdb shop_roles`',
        ],
        answer: '`pg_dumpall --globals-only`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You make a `pg_dump` every night at 02:00. At 14:32, someone deletes all the orders. What can bring the orders back as they were at 14:31?',
        options: [
          'Point-in-time recovery from a base backup and the saved WAL files',
          'The dump from 02:00',
          'Running `VACUUM FULL` on the orders table',
          'Running `pg_dump` again at 14:33',
        ],
        answer: 'Point-in-time recovery from a base backup and the saved WAL files',
      },
    },
  ],
};
