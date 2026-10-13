import { Lesson } from '../../shared/content';

export const ALTER_TABLE: Lesson = {
  slug: 'alter-table',
  title: 'ALTER TABLE and DROP',
  nav: 'ALTER & DROP',
  blocks: [
    {
      kind: 'text',
      text: "Tables change as an app grows. You may need a new column, a better name or a stricter rule. `ALTER TABLE` changes a table that already exists, and keeps its rows. `DROP TABLE` deletes a whole table.",
    },
    {
      kind: 'text',
      text: "On a real database, these changes affect every app that uses the table. So the end of this lesson shows how teams change tables safely.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Adding, renaming and removing columns',
    },
    {
      kind: 'text',
      text: "`ADD COLUMN` adds a column at the end of the table. The rows that are already there get the column's `DEFAULT`, or `NULL` if it has no default.",
    },
    {
      kind: 'example',
      label: 'add-column.sql',
      code: `ALTER TABLE customers
ADD COLUMN phone text;

ALTER TABLE customers
ADD COLUMN is_vip boolean NOT NULL DEFAULT false;

SELECT id, first_name, phone, is_vip
FROM customers
WHERE id <= 3
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Every customer now has a `phone` of `NULL` and an `is_vip` of `f`. A new `NOT NULL` column needs a `DEFAULT` when the table already has rows. Without one, `ADD COLUMN nickname text NOT NULL` fails with `column \"nickname\" of relation \"customers\" contains null values`, because the old rows would have no value.",
    },
    {
      kind: 'text',
      text: "`RENAME COLUMN … TO …` gives a column a new name, and `RENAME TO` gives the whole table a new name. `DROP COLUMN` removes a column and **all the data in it**.",
    },
    {
      kind: 'example',
      label: 'rename-drop.sql',
      code: `ALTER TABLE employees
RENAME COLUMN hired_on TO start_date;

ALTER TABLE employees
DROP COLUMN salary;

ALTER TABLE employees
RENAME TO staff;

SELECT *
FROM staff
WHERE department = 'Sales'
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The table is now called `staff`, `hired_on` is now `start_date`, and the salaries are gone for good. Renaming is fast and keeps the data, but it breaks every query that still uses the old name. After this example, `SELECT * FROM employees` fails with `relation \"employees\" does not exist`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Changing types and rules',
    },
    {
      kind: 'text',
      text: "`ALTER COLUMN … TYPE` changes the type of a column, and PostgreSQL converts every value that is already there. Some changes happen automatically: changing `integer` to `numeric(10, 2)` turns `150000` into `150000.00`. For others you must say how to convert each value, with `USING`. A common case is data imported from a spreadsheet, with the numbers saved as text:",
    },
    {
      kind: 'example',
      label: 'change-type.sql',
      code: `CREATE TABLE imports (
  product  text,
  quantity text
);

INSERT INTO imports (product, quantity)
VALUES ('Coffee Mug', '12'), ('Desk Lamp', '3');

ALTER TABLE imports
ALTER COLUMN quantity TYPE integer
USING quantity::integer;

SELECT product, quantity * 2 AS doubled
FROM imports;`,
    },
    {
      kind: 'text',
      text: "`quantity::integer` means \"turn this value into an `integer`\". It is PostgreSQL's short way to write `CAST(quantity AS integer)`. Now `quantity` is a number column, so you can do maths with it. Delete the `USING` line and run again: PostgreSQL stops with `column \"quantity\" cannot be cast automatically to type integer`, and the `HINT` line tells you what to add. If one value could not be converted, like `'ten'`, the whole change would fail and the table would stay as it was.",
    },
    {
      kind: 'text',
      text: "You can also add rules to a table that already exists, or remove them:",
    },
    {
      kind: 'table',
      head: ['After ALTER TABLE customers …', 'What it does'],
      rows: [
        ['`ALTER COLUMN city SET NOT NULL`', 'Makes the column required'],
        ['`ALTER COLUMN city DROP NOT NULL`', 'Makes it optional again'],
        ['`ADD CONSTRAINT name CHECK (…)`', 'Adds a rule. `UNIQUE (…)` and `FOREIGN KEY (…) REFERENCES …` work the same way.'],
        ['`DROP CONSTRAINT name`', 'Removes a rule by its name'],
      ],
    },
    {
      kind: 'text',
      text: "PostgreSQL checks a new rule against the rows that are already there. Customers 6 and 9 have no city, so `ALTER COLUMN city SET NOT NULL` on its own fails with `column \"city\" of relation \"customers\" contains null values`. Fix the data first, then add the rule:",
    },
    {
      kind: 'example',
      label: 'add-rules.sql',
      code: `UPDATE customers
SET city = 'Unknown'
WHERE city IS NULL;

ALTER TABLE customers
ALTER COLUMN city SET NOT NULL;

ALTER TABLE products
ADD CONSTRAINT stock_below_1000 CHECK (stock < 1000);

SELECT id, first_name, city
FROM customers
WHERE id IN (6, 9);`,
    },
    {
      kind: 'text',
      text: "Both rules are now in place, and they check every future `INSERT` and `UPDATE`. The new `CHECK` was accepted because no product has 1000 or more in stock (the Gift Card has the most, 999). But `ADD CONSTRAINT stock_positive CHECK (stock > 0)` would fail with `check constraint \"stock_positive\" of relation \"products\" is violated by some row`, because the Bluetooth Speaker has a stock of 0.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'DROP TABLE, IF EXISTS and CASCADE',
    },
    {
      kind: 'text',
      text: "`DROP TABLE` deletes a table: its rows, its columns and its rules, all at once. With `IF EXISTS`, it skips quietly when the table is not there. That is handy in scripts that may run twice. A table that other tables point to cannot be dropped:",
    },
    {
      kind: 'example',
      label: 'drop-table.sql',
      expectError: true,
      code: `DROP TABLE IF EXISTS suppliers;

DROP TABLE customers;`,
    },
    {
      kind: 'text',
      text: "There is no `suppliers` table, so the first line only shows a `NOTICE`, a message that is not an error: `table \"suppliers\" does not exist, skipping`. The second line fails with `cannot drop table customers because other objects depend on it`. The `DETAIL` line names the foreign key from `orders`, and the `HINT` line suggests `DROP ... CASCADE`.",
    },
    {
      kind: 'text',
      text: "`CASCADE` drops the table **and everything that depends on it**. Read the `NOTICE` carefully:",
    },
    {
      kind: 'example',
      label: 'drop-cascade.sql',
      code: `DROP TABLE customers CASCADE;

INSERT INTO orders (customer_id, ordered_on, status)
VALUES (999, '2025-10-01', 'pending');

SELECT id, customer_id, status
FROM orders
WHERE id >= 15;`,
    },
    {
      kind: 'text',
      text: "The `NOTICE` says `drop cascades to constraint orders_customer_id_fkey on table orders`. The `orders` table is still there, but its foreign key rule is gone. So an order for customer 999, who never existed, is now accepted without a complaint. In fact, all 17 orders now point to customers who are gone.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Why CASCADE is dangerous',
      blocks: [
        {
          kind: 'text',
          text: "`CASCADE` does not ask, and it does not tell you what it will drop until it has dropped it. It removes the foreign keys and the views (saved queries, see the Views lesson) that use the table. Never use it on a real database unless you know exactly what depends on the table.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Changing tables safely',
    },
    {
      kind: 'text',
      text: "On your own computer, a mistake costs nothing. On a live database that real customers use, a careless `ALTER TABLE` can break the app or lose data. Teams follow a few simple rules:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Test on a copy first.** Try every change on a copy of the database before you run it on the real one.",
        "**Use a transaction.** In PostgreSQL, even `ALTER TABLE` and `DROP TABLE` can be undone with `ROLLBACK`, as long as you have not typed `COMMIT`. Many other databases cannot do this.",
        "**Have a backup**, and check that you can restore it, before you drop anything.",
        "**Add first, remove later.** To rename a column that apps use, add the new column, update the apps, and only then drop the old column. That way the app never breaks.",
        "**Expect big tables to be slow.** Adding a column with a simple `DEFAULT` is fast. But changing a column's type often rewrites every row, and other users must wait until it is done. On a big table, do it when few people use the app.",
        "**Save every change in a script**, often called a **migration**, and keep the scripts with your app's code. Then every copy of the database gets the same changes in the same order.",
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Add a `weight_kg` column to `products`, then rename `added_on` to `created_on`. Fill in the two missing keywords.",
        code: `ALTER TABLE products
[___] COLUMN weight_kg numeric(6, 2);

ALTER TABLE products
[___] COLUMN added_on TO created_on;`,
        answers: [['ADD', 'add'], ['RENAME', 'rename']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: '`orders` has a foreign key that points to `customers`. What does `DROP TABLE customers CASCADE;` do to `orders`?',
        options: [
          'It removes the foreign key rule, but keeps the orders',
          'It deletes the `orders` table too',
          'It deletes only the orders of the deleted customers',
          'Nothing, `orders` is not touched',
        ],
        answer: 'It removes the foreign key rule, but keeps the orders',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Undo a DROP COLUMN',
      blocks: [
        {
          kind: 'text',
          text: "Start a transaction, drop the `price` column from `products`, and look at product 1. Then undo everything with `ROLLBACK`, and look at product 1 again.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'undo-drop.sql',
              code: `BEGIN;

ALTER TABLE products
DROP COLUMN price;

SELECT *
FROM products
WHERE id = 1;

ROLLBACK;

SELECT *
FROM products
WHERE id = 1;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "Inside the transaction, product 1 has no `price` column. After `ROLLBACK`, the column and all 14 prices are back, as if nothing had happened.",
            },
          ],
        },
      ],
    },
  ],
};
