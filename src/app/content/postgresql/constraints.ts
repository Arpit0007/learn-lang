import { Lesson } from '../../shared/content';

export const CONSTRAINTS: Lesson = {
  slug: 'constraints',
  title: 'Constraints and Keys',
  nav: 'Constraints & keys',
  blocks: [
    {
      kind: 'text',
      text: "A **constraint** is a rule that a table checks on every row, every time data is added or changed. If a change breaks a rule, PostgreSQL rejects the whole statement with an error, and nothing changes.",
    },
    {
      kind: 'text',
      text: "Your app may check the data too, but the database is the last line of defense. A rule in the table protects the data from every app, script and person that uses it. In this lesson most examples break a rule on purpose, so you can learn to read the error.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Primary keys',
    },
    {
      kind: 'text',
      text: "A **primary key** is the column, or group of columns, that identifies each row. It must be unique, and it can never be `NULL`. A table has only one primary key, and other tables use it to point to a row.",
    },
    {
      kind: 'text',
      text: "There are two kinds of key. A **natural key** is a real-world value that is already unique, like a country code (`'IN'`) or the ISBN printed on a book. A **surrogate key** is a made-up number with no meaning, like an `id` of 1, 2, 3. Most tables use a surrogate key, because real-world values can change. People change their email address, and even country codes change. A surrogate `id` never needs to.",
    },
    {
      kind: 'text',
      text: "A key can also be made of two or more columns. This is a **composite key**. In `order_items` the key is `PRIMARY KEY (order_id, product_id)`. An order can have many products, and a product can be in many orders, but each pair of order and product can appear only once.",
    },
    {
      kind: 'example',
      label: 'composite-key.sql',
      expectError: true,
      code: `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 4, 1, 19.99);

SELECT order_id, product_id, quantity
FROM order_items
WHERE order_id = 1
ORDER BY product_id;

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 4, 1, 19.99);`,
    },
    {
      kind: 'text',
      text: "Adding a Wireless Mouse (product 4) to order 1 works the first time, and the order now has three items. The second time, the pair `(1, 4)` is already there, so PostgreSQL stops with `duplicate key value violates unique constraint \"order_items_pkey\"`. To sell more mice in the same order, you would change the `quantity` of the row that is already there.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Give every table a primary key',
      blocks: [
        {
          kind: 'text',
          text: "Without a primary key, two rows can be exactly the same, and then you cannot safely point to, change or delete just one of them.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'NOT NULL, UNIQUE, CHECK and DEFAULT',
    },
    {
      kind: 'text',
      text: "These are written next to a column in `CREATE TABLE`:",
    },
    {
      kind: 'table',
      head: ['Write', 'Meaning', 'In the shop'],
      rows: [
        ['`NOT NULL`', 'The column must always have a value.', '`customers.country`'],
        ['`UNIQUE`', 'No two rows may have the same value.', '`customers.email`'],
        ['`CHECK (test)`', 'Every row must pass the test.', '`products.price`: `CHECK (price >= 0)`'],
        ['`DEFAULT value`', 'Not a rule, but the value used when none is given.', '`products.stock`: `DEFAULT 0`'],
      ],
    },
    {
      kind: 'text',
      text: "`NOT NULL` stops missing values. Here a new customer has no country:",
    },
    {
      kind: 'example',
      label: 'not-null.sql',
      expectError: true,
      code: `INSERT INTO customers (first_name, last_name, email, joined_on)
VALUES ('Omar', 'Farouk', 'omar.farouk@example.com', '2025-10-01');`,
    },
    {
      kind: 'text',
      text: "The message names the column: `null value in column \"country\" of relation \"customers\" violates not-null constraint`. The `DETAIL` line shows the row that failed. Its `city` is null too, and that is fine, because `city` has no `NOT NULL` rule.",
    },
    {
      kind: 'text',
      text: "`UNIQUE` stops duplicates. Two customers cannot share an email address:",
    },
    {
      kind: 'example',
      label: 'unique.sql',
      expectError: true,
      code: `INSERT INTO customers (first_name, last_name, email, country, joined_on)
VALUES ('Hana', 'Suzuki', 'hana.sato@example.com', 'Japan', '2025-10-01');`,
    },
    {
      kind: 'text',
      text: "The `DETAIL` line says `Key (email)=(hana.sato@example.com) already exists`. Watch out: a `UNIQUE` column still allows `NULL` in many rows. `NULL` means \"unknown\", and two unknown values are not counted as equal. If every row must have a value, add `NOT NULL` too, as the shop's `email` column does.",
    },
    {
      kind: 'text',
      text: "`CHECK` runs a test on every new or changed row. The `orders` table allows only four statuses: `CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled'))`. Rules are checked on `UPDATE` too, not only on `INSERT`:",
    },
    {
      kind: 'example',
      label: 'check.sql',
      expectError: true,
      code: `UPDATE orders
SET status = 'lost'
WHERE id = 9;`,
    },
    {
      kind: 'text',
      text: "`'lost'` is not on the list, so the row fails the test: `new row for relation \"orders\" violates check constraint \"orders_status_check\"`. Note that a `CHECK` rejects a row only when its test is false. If the value is `NULL`, the test cannot say yes or no, and the row is allowed. So when a value is required, use `NOT NULL` together with `CHECK`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Foreign keys',
    },
    {
      kind: 'text',
      text: "A **foreign key** links two tables. In the shop, `orders.customer_id` is declared as `integer REFERENCES customers (id)`. This means: every value in `orders.customer_id` must be an `id` that exists in `customers`. The table with the foreign key (`orders`) is the *child*. The table it points to (`customers`) is the *parent*. A foreign key stops two kinds of mistakes. The first is a child row that points to nothing:",
    },
    {
      kind: 'example',
      label: 'foreign-key.sql',
      expectError: true,
      code: `INSERT INTO orders (customer_id, ordered_on, status)
VALUES (99, '2025-10-01', 'pending');`,
    },
    {
      kind: 'text',
      text: "There is no customer 99, so the `DETAIL` line says `Key (customer_id)=(99) is not present in table \"customers\"`. The second mistake is deleting a parent that still has children. The UPDATE and DELETE lesson shows this: PostgreSQL refuses to delete customer 1, because she has orders. Refusing is the default, but you can choose what happens with `ON DELETE`:",
    },
    {
      kind: 'table',
      head: ['You write', 'When the parent row is deleted'],
      rows: [
        ['Nothing, `ON DELETE NO ACTION` or `ON DELETE RESTRICT`', 'The delete fails with an error. This is the default, and the safest choice.'],
        ['`ON DELETE CASCADE`', 'The child rows are deleted too.'],
        ['`ON DELETE SET NULL`', 'The child rows stay, but their foreign key column becomes `NULL`.'],
      ],
    },
    {
      kind: 'text',
      text: "This example makes a `reviews` table with one of each. A review makes no sense without its product, so it uses `CASCADE`. A review is still useful when its writer leaves the shop, so it uses `SET NULL`:",
    },
    {
      kind: 'example',
      label: 'on-delete.sql',
      code: `CREATE TABLE reviews (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  integer NOT NULL
              REFERENCES products (id) ON DELETE CASCADE,
  customer_id integer
              REFERENCES customers (id) ON DELETE SET NULL,
  stars       integer NOT NULL
              CONSTRAINT stars_from_1_to_5 CHECK (stars BETWEEN 1 AND 5)
);

INSERT INTO reviews (product_id, customer_id, stars)
VALUES (13, 11, 5), (13, 12, 4), (14, 12, 3);

DELETE FROM products
WHERE id = 13;

DELETE FROM customers
WHERE id = 12;

SELECT *
FROM reviews;`,
    },
    {
      kind: 'text',
      text: "Deleting product 13 (the Yo-yo) also deletes its two reviews, because of `CASCADE`. Deleting customer 12 (Lena) keeps her review of product 14, but its `customer_id` becomes `NULL`, because of `SET NULL`. Only review 3 is left. Each `DELETE` says `1 row deleted`: the count includes only the rows you asked for, not the rows the foreign keys changed.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Use CASCADE with care',
      blocks: [
        {
          kind: 'text',
          text: "With `ON DELETE CASCADE`, one small `DELETE` can remove many rows in other tables, with no warning. Use it only for rows that mean nothing alone, like the reviews of a product. Never use it where the child rows are valuable, like orders: a customer who has orders should stay in the database.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Naming constraints',
    },
    {
      kind: 'text',
      text: "Every constraint has a name. If you do not choose one, PostgreSQL makes one from the table, the column and the kind of rule. You have already seen these names in error messages:",
    },
    {
      kind: 'table',
      head: ['Name', 'The rule'],
      rows: [
        ['`order_items_pkey`', 'The primary key of `order_items`'],
        ['`customers_email_key`', 'The `UNIQUE` rule on `customers.email`'],
        ['`orders_status_check`', 'The `CHECK` on `orders.status`'],
        ['`orders_customer_id_fkey`', 'The foreign key on `orders.customer_id`'],
      ],
    },
    {
      kind: 'text',
      text: "To choose a name yourself, write `CONSTRAINT` and the name before the rule, like `stars_from_1_to_5` in the reviews example. A clear name makes the error message clear, so whoever reads it knows which rule was broken. You also need the name to remove a rule later, with `ALTER TABLE reviews DROP CONSTRAINT stars_from_1_to_5`. A rule about two or more columns goes on its own line after the columns, like `CONSTRAINT due_after_start CHECK (due_on > borrowed_on)`.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Each student can join each course only once. Fill in the keyword that links `student_id` to `students`, and the first word of the composite key.",
        code: `CREATE TABLE enrollments (
  student_id integer NOT NULL [___] students (id),
  course_id  integer NOT NULL REFERENCES courses (id),
  [___] KEY (student_id, course_id)
);`,
        answers: [['REFERENCES', 'references'], ['PRIMARY', 'primary']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A `reviews` table has `product_id integer REFERENCES products (id) ON DELETE CASCADE`. What happens to the reviews of a product when the product is deleted?',
        options: [
          'They are deleted too',
          'Their `product_id` becomes `NULL`',
          'The delete fails with an error',
          'Nothing, they keep the old `product_id`',
        ],
        answer: 'They are deleted too',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'A rule with your own name',
      blocks: [
        {
          kind: 'text',
          text: "Create a table `coupons` with a `code` (text, the primary key) and a `discount` (a whole number that is required). Add a `CHECK` rule named `discount_in_range` that allows only discounts from 1 to 90. Insert the coupon `'WELCOME10'` with a discount of 10, and select all coupons. Then try to insert `'FREE'` with a discount of 100. That last insert should fail, and the error should name your rule.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'coupons.sql',
              expectError: true,
              code: `CREATE TABLE coupons (
  code     text PRIMARY KEY,
  discount integer NOT NULL,
  CONSTRAINT discount_in_range CHECK (discount BETWEEN 1 AND 90)
);

INSERT INTO coupons (code, discount)
VALUES ('WELCOME10', 10);

SELECT *
FROM coupons;

INSERT INTO coupons (code, discount)
VALUES ('FREE', 100);`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "`WELCOME10` is saved. `FREE` fails with `violates check constraint \"discount_in_range\"`, and the name tells you at once which rule was broken.",
            },
          ],
        },
      ],
    },
  ],
};
