import { Lesson } from '../../shared/content';

export const USERS_PERMISSIONS: Lesson = {
  slug: 'users-permissions',
  title: 'Users, Roles and Permissions',
  nav: 'Users & permissions',
  blocks: [
    {
      kind: 'text',
      text: "Many people and programs use the same database: the shop's website, a reporting tool, the support team and you. They should not all be able to do everything. PostgreSQL controls who can do what with **roles** and **privileges**. A role is an account, like a user name. A privilege is one right, such as the right to read a table or to add rows to it.",
    },
    {
      kind: 'text',
      text: "In this course you run every example as the role `postgres`. It is a **superuser**: a role that skips every permission check. To see what another role is allowed to do, you can act as that role for a while with `SET ROLE`. This works in your browser, so you can test every rule on this page.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Roles and users',
    },
    {
      kind: 'text',
      text: "In PostgreSQL, users and groups are both roles. A role with the `LOGIN` option can connect to the database, so we call it a **user**. A role without `LOGIN` is used as a **group**: you give privileges to the group, then you add users to it. `CREATE USER name` is a short way to write `CREATE ROLE name LOGIN`.",
    },
    {
      kind: 'example',
      label: 'create-roles.sql',
      code: `-- A user for the shop's website: it can log in
CREATE ROLE shop_app LOGIN PASSWORD 'change-me';

-- A group for people who build reports: it cannot log in
CREATE ROLE reporting;

SELECT rolname, rolcanlogin, rolsuper
FROM pg_roles
WHERE rolname IN ('postgres', 'shop_app', 'reporting')
ORDER BY rolname;`,
    },
    {
      kind: 'text',
      text: "`pg_roles` is a built-in view that lists every role. `rolcanlogin` is `t` (true) for the roles that can log in, and `rolsuper` is `t` only for `postgres`. The database in your browser cannot accept real logins, so the password is saved but never used here. On a real server, the website would connect as `shop_app` with that password.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'GRANT and REVOKE',
    },
    {
      kind: 'text',
      text: "A new role can do almost nothing. It cannot even read a table until you give it a privilege with `GRANT`. You take a privilege away with `REVOKE`. These are the privileges you will use most:",
    },
    {
      kind: 'table',
      head: ['Privilege', 'What it allows'],
      rows: [
        ['`SELECT`', 'Read rows'],
        ['`INSERT`', 'Add new rows'],
        ['`UPDATE`', 'Change rows'],
        ['`DELETE`', 'Remove rows'],
        ['`TRUNCATE`', 'Empty the whole table at once'],
        ['`USAGE` on a schema', 'Use the objects inside the schema'],
        ['`CREATE` on a schema', 'Make new tables and other objects in the schema'],
      ],
    },
    {
      kind: 'text',
      text: "To test a role, run `SET ROLE` with its name. From then on, PostgreSQL checks every statement as if that role ran it, and `current_user` shows the role's name. `RESET ROLE` takes you back to `postgres`. In the next example, `shop_app` may read `products`, but nobody gave it `customers`.",
    },
    {
      kind: 'example',
      label: 'grant-select.sql',
      expectError: true,
      code: `CREATE ROLE shop_app LOGIN;
GRANT SELECT ON products TO shop_app;

SET ROLE shop_app;
SELECT current_user;
SELECT name, price FROM products WHERE id <= 3;
SELECT * FROM customers;`,
    },
    {
      kind: 'text',
      text: "The last query fails with `permission denied for table customers`. The run stops at the error, and that is fine: every Run starts again with a fresh database, as `postgres`.",
    },
    {
      kind: 'text',
      text: "You can also grant a privilege on some **columns** only. Here the support team may read the customers' names and cities, but not their email addresses. A `SELECT *` would fail too, because `*` includes `email`.",
    },
    {
      kind: 'example',
      label: 'column-privileges.sql',
      expectError: true,
      code: `CREATE ROLE support;
GRANT SELECT (id, first_name, city, country) ON customers TO support;

SET ROLE support;
SELECT id, first_name, city FROM customers WHERE id <= 3;
SELECT first_name, email FROM customers;`,
    },
    {
      kind: 'text',
      text: "`REVOKE` is written like `GRANT`, with `FROM` instead of `TO`. For example, `REVOKE DELETE ON orders FROM shop_app;` takes away the right to delete orders. You will use it in the section about least privilege.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Schemas and least privilege',
    },
    {
      kind: 'text',
      text: "A **schema** is like a folder inside a database. It holds tables, views and functions. All the shop's tables live in the schema called `public`. You can make more schemas to keep things apart, for example a `reports` schema for the reporting team. To use anything inside a schema, a role needs the `USAGE` privilege on the schema itself, and also privileges on the objects inside it.",
    },
    {
      kind: 'text',
      text: "This example also shows a group at work. `GRANT analysts TO lena` makes the user `lena` a member of the group `analysts`, so she gets every privilege that the group has.",
    },
    {
      kind: 'example',
      label: 'schema-usage.sql',
      expectError: true,
      code: `CREATE SCHEMA reports;
CREATE VIEW reports.monthly_orders AS
  SELECT to_char(ordered_on, 'YYYY-MM') AS month, count(*) AS orders
  FROM orders
  GROUP BY 1;

-- A group that may read everything in the reports schema
CREATE ROLE analysts;
GRANT USAGE ON SCHEMA reports TO analysts;
GRANT SELECT ON ALL TABLES IN SCHEMA reports TO analysts;

-- A user in that group
CREATE ROLE lena LOGIN;
GRANT analysts TO lena;

SET ROLE lena;
SELECT * FROM reports.monthly_orders ORDER BY month;
SELECT count(*) FROM orders;`,
    },
    {
      kind: 'text',
      text: "Lena can read the view, but not the `orders` table behind it, so the last query fails. A view is a safe window: it shows only the data you chose. (`ALL TABLES` includes views.) Now delete the `GRANT USAGE` line and run again. This time even the first query fails, with `permission denied for schema reports`.",
    },
    {
      kind: 'text',
      text: "Schemas, views and groups all serve one big rule. The **principle of least privilege** says: give each role only the privileges it needs to do its job, and nothing more. The website needs to read products and customers, and to create and update orders. It never needs to drop a table. If an attacker steals the website's password, they can only do what the website can do.",
    },
    {
      kind: 'example',
      label: 'app-role.sql',
      expectError: true,
      code: `CREATE ROLE shop_app LOGIN;
GRANT SELECT ON products, customers TO shop_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO shop_app;

-- Orders are cancelled, never deleted, so take DELETE back
REVOKE DELETE ON orders FROM shop_app;

SELECT has_table_privilege('shop_app', 'orders', 'UPDATE') AS can_update,
       has_table_privilege('shop_app', 'orders', 'DELETE') AS can_delete;

SET ROLE shop_app;
UPDATE orders SET status = 'cancelled' WHERE id = 15;
DROP TABLE orders;`,
    },
    {
      kind: 'text',
      text: "`has_table_privilege` answers yes (`t`) or no (`f`) without running anything. The app can cancel order 15, but `DROP TABLE` fails with `must be owner of table orders`. Only the owner of a table (the role that created it) or a superuser can drop it or change its columns.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Good habits on a real server',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            "Never let your app connect as `postgres` or as the owner of the tables. Make a separate role for it, with only the privileges it needs.",
            "Give privileges to group roles, then add users to the groups. When someone leaves the team, you remove one membership.",
            "`GRANT SELECT ON ALL TABLES IN SCHEMA public TO reporting` covers the tables that exist now. For tables that are created later, use `ALTER DEFAULT PRIVILEGES`.",
          ],
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Row-level security',
    },
    {
      kind: 'text',
      text: "Privileges work on whole tables or columns. But sometimes you need to limit the **rows** a role can see. A customer who logs in to the shop should see their own orders, not everyone's. **Row-level security** (RLS) does this. You turn it on for a table, then you add a **policy**: a rule with a condition. PostgreSQL adds the condition to every query on that table, like a hidden `WHERE`.",
    },
    {
      kind: 'example',
      label: 'row-level-security.sql',
      code: `CREATE ROLE web_customer;
GRANT SELECT ON orders TO web_customer;

-- 1. Turn on row-level security for the table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. The policy: a row is visible if it belongs to the logged-in customer
CREATE POLICY own_orders ON orders
  FOR SELECT
  TO web_customer
  USING (customer_id = current_setting('app.customer_id')::integer);

-- 3. The app says who is logged in, then acts as web_customer
SET app.customer_id = '1';
SET ROLE web_customer;
SELECT * FROM orders;
RESET ROLE;`,
    },
    {
      kind: 'text',
      text: "The query has no `WHERE`, but it returns only orders 1, 3 and 11, which belong to Aisha (customer 1). `current_setting('app.customer_id')` reads a setting that the app sets with `SET` for each visitor. Change `'1'` to `'8'` and run again to see Hana's two orders. To learn more, read [Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) in the PostgreSQL manual.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Owners and superusers skip the policies',
      blocks: [
        {
          kind: 'text',
          text: "Row-level security does not apply to superusers or to the owner of the table. That is why the example switches to `web_customer` before it reads. If your app connects as the owner, the policies do nothing. Also, when RLS is on and no policy matches a role, that role sees **no rows** at all, and gets no error.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Let the `reporting` role read the `orders` table.',
        code: `[___] SELECT ON orders [___] reporting;`,
        answers: [['GRANT', 'grant'], ['TO', 'to']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Test what `shop_app` can see, then go back to your own role.',
        code: `[___] ROLE shop_app;
SELECT count(*) FROM products;
[___] ROLE;`,
        answers: [['SET', 'set'], ['RESET', 'reset']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A role has `SELECT` on the view `reports.sales`, but it gets `permission denied for schema reports`. What is missing?',
        options: [
          '`USAGE` on the schema `reports`',
          'A second `GRANT SELECT` on the view',
          'The `LOGIN` option on the role',
          'Row-level security on the view',
        ],
        answer: '`USAGE` on the schema `reports`',
      },
    },
  ],
};
