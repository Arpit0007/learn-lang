import { Lesson } from '../../shared/content';

export const INSERT: Lesson = {
  slug: 'insert',
  title: 'INSERT and Upsert',
  nav: 'INSERT & upsert',
  blocks: [
    {
      kind: 'text',
      text: "`INSERT` adds new rows to a table. You say which table, which columns you are filling in, and the values. Every Run starts from a fresh copy of the shop database, so add whatever you like.",
    },
    {
      kind: 'text',
      text: "At the end of this lesson you will also learn the **upsert**: add a row, or update it if it is already there.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Adding rows',
    },
    {
      kind: 'text',
      text: "The basic form is `INSERT INTO table (columns) VALUES (values)`. The values go in the same order as the columns. Put text and dates in single quotes. Numbers need no quotes.",
    },
    {
      kind: 'example',
      label: 'insert-one.sql',
      code: `INSERT INTO categories (name)
VALUES ('Sports');

SELECT *
FROM categories
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The result line says `INSERT · 1 row added`, and the new category has id `6`. You did not give an id. `categories.id` is an identity column, so PostgreSQL picked the next number for you.",
    },
    {
      kind: 'text',
      text: "**Always list the columns.** You may leave the list out, but then you must give a value for every column, in the order the table has them. `INSERT INTO categories VALUES ('Garden Tools')` fails with `invalid input syntax for type integer: \"Garden Tools\"`, because the first column of `categories` is `id`. Worse, if someone adds a column to the table later, a query without a list can break or put values in the wrong columns.",
    },
    {
      kind: 'text',
      text: "To add several rows at once, write several rows in brackets after `VALUES`, with a comma between them. Columns you leave out of the list get their `DEFAULT` value, or `NULL` if they have no default. You can also write `NULL` yourself, like Tariq's unknown city here:",
    },
    {
      kind: 'example',
      label: 'insert-many.sql',
      code: `INSERT INTO customers (first_name, last_name, email, city, country, joined_on)
VALUES
  ('Mei', 'Chen', 'mei.chen@example.com', 'Singapore', 'Singapore', '2025-10-01'),
  ('Tariq', 'Aziz', 'tariq.aziz@example.com', NULL, 'Egypt', '2025-10-02');

SELECT id, first_name, last_name, city, country
FROM customers
WHERE id > 10
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Mei and Tariq become customers `13` and `14`. One `INSERT` with many rows is faster than many separate ones, and it is all or nothing: if one row breaks a rule, none of the rows are added.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'DEFAULT and RETURNING',
    },
    {
      kind: 'text',
      text: "Inside `VALUES`, the keyword `DEFAULT` means \"use this column's default value\". It is handy when a column is in your list but you want its normal value. `RETURNING` at the end sends back the rows you just added, like a `SELECT` does. Apps use it to learn the new id without running a second query.",
    },
    {
      kind: 'example',
      label: 'returning.sql',
      code: `INSERT INTO products (name, category_id, price, stock, added_on)
VALUES ('Kite', 4, 12.00, DEFAULT, current_date)
RETURNING id, name, price, stock;`,
    },
    {
      kind: 'text',
      text: "The Kite got id `15`, and `stock` got its default, `0`. Write `RETURNING *` to get every column back.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Copying rows with INSERT … SELECT',
    },
    {
      kind: 'text',
      text: "Instead of `VALUES`, you can give `INSERT` a whole `SELECT`. Every row that the `SELECT` returns is added. This is the quickest way to copy data from one table into another. Here we build a mailing list of the shop's customers in the UK:",
    },
    {
      kind: 'example',
      label: 'insert-select.sql',
      code: `CREATE TABLE uk_mailing_list (
  customer_id integer PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL
);

INSERT INTO uk_mailing_list (customer_id, full_name, email)
SELECT id, first_name || ' ' || last_name, email
FROM customers
WHERE country = 'UK';

SELECT *
FROM uk_mailing_list;`,
    },
    {
      kind: 'text',
      text: "The `SELECT` finds two UK customers, so two rows are added: Ben Carter and George Brown. The columns of the `SELECT` fill the listed columns in order: `id` goes into `customer_id`, the joined name into `full_name` (`||` joins pieces of text), and `email` into `email`. Notice that there is no `VALUES` here.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Upsert with ON CONFLICT',
    },
    {
      kind: 'text',
      text: "What if the row is already there? A **conflict** happens when a new row would break a `UNIQUE` rule or a primary key. Category names must be unique, so `INSERT INTO categories (name) VALUES ('Books')` fails with `duplicate key value violates unique constraint \"categories_name_key\"`. Add `ON CONFLICT DO NOTHING` to skip such rows quietly instead:",
    },
    {
      kind: 'example',
      label: 'do-nothing.sql',
      code: `INSERT INTO categories (name)
VALUES ('Books'), ('Sports')
ON CONFLICT DO NOTHING;

SELECT *
FROM categories
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Only `Sports` is added, and `Books` is skipped with no error. Now look at the id: `Sports` got `7`, not `6`. The skipped `Books` row had already used up number 6 before PostgreSQL found the conflict. Gaps like this are normal, so never expect identity numbers to have no gaps.",
    },
    {
      kind: 'text',
      text: "Often you want something smarter: add the row if it is new, or **update** the old row if it is not. That is an **upsert** (update + insert). Write the column that can conflict in brackets, then `DO UPDATE SET`. In the `SET`, the word `EXCLUDED` means the row you tried to insert. Here Ben signs up again with his old email and a new city:",
    },
    {
      kind: 'example',
      label: 'upsert.sql',
      code: `INSERT INTO customers (first_name, last_name, email, city, country, joined_on)
VALUES ('Ben', 'Carter', 'ben.carter@example.com', 'Manchester', 'UK', '2025-10-01')
ON CONFLICT (email)
DO UPDATE SET city = EXCLUDED.city
RETURNING id, first_name, email, city, joined_on;`,
    },
    {
      kind: 'text',
      text: "No new customer was added. Ben is still customer `2`. His city is now `Manchester`, taken from `EXCLUDED.city`. His `joined_on` is still `2025-01-20`, because the `SET` changes only the city.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'ON CONFLICT needs a unique rule',
      blocks: [
        {
          kind: 'text',
          text: "The column in `ON CONFLICT (...)` must be the primary key or have a `UNIQUE` rule. Try `ON CONFLICT (city)` and PostgreSQL stops with `there is no unique or exclusion constraint matching the ON CONFLICT specification`, because many customers can live in the same city.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Add the category `Books`, but only if it is not there yet. Fill in the two missing keywords.",
        code: `INSERT INTO categories (name)
VALUES ('Books')
ON [___] DO [___];`,
        answers: [['CONFLICT', 'conflict'], ['NOTHING', 'nothing']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In `ON CONFLICT (email) DO UPDATE SET city = EXCLUDED.city`, what is `EXCLUDED`?',
        options: [
          'The row you tried to insert',
          'The row that is already in the table',
          'The rows that were deleted',
          'A table you must create first',
        ],
        answer: 'The row you tried to insert',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Add to a shopping cart',
      blocks: [
        {
          kind: 'text',
          text: "Order 1 already has 2 Coffee Mugs (product 8) in `order_items`. The customer adds 2 more. Write one `INSERT` that adds the row `(1, 8, 2, 9.50)`, but if this order already has this product, adds the new quantity to the old one. Then select the items of order 1. Tips: the primary key of `order_items` is `(order_id, product_id)`, and `order_items.quantity` means the quantity that is already saved.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'cart-upsert.sql',
              code: `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 8, 2, 9.50)
ON CONFLICT (order_id, product_id)
DO UPDATE SET quantity = order_items.quantity + EXCLUDED.quantity;

SELECT order_id, product_id, quantity
FROM order_items
WHERE order_id = 1
ORDER BY product_id;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "The Coffee Mug row now has quantity `4`: the old 2 plus the new 2. The result line still says `INSERT · 1 row added`, because PostgreSQL counts an upsert's row the same way whether it was added or updated. Check the real effect with a `SELECT`.",
            },
          ],
        },
      ],
    },
  ],
};
