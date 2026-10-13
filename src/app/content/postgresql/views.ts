import { Lesson } from '../../shared/content';

/** The view built in the first example, recreated as hidden setup for the later ones. */
const ORDER_TOTALS = `CREATE VIEW order_totals AS
SELECT o.id AS order_id,
       c.first_name,
       o.status,
       sum(oi.quantity * oi.unit_price) AS total
FROM orders AS o
JOIN customers AS c ON c.id = o.customer_id
JOIN order_items AS oi ON oi.order_id = o.id
GROUP BY o.id, c.first_name, o.status;`;

export const VIEWS: Lesson = {
  slug: 'views',
  title: 'Views and Materialized Views',
  nav: 'Views',
  blocks: [
    {
      kind: 'text',
      text: "A **view** is a saved query with a name. You use it like a table, but it stores no rows of its own. Each time you read from a view, PostgreSQL runs the query inside it. A **materialized view** is different: it runs the query once and saves the result, like a photo of the data.",
    },
    {
      kind: 'text',
      text: "With views you write a long query once, give it a clear name, and then reuse it everywhere.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Saving a query with CREATE VIEW',
    },
    {
      kind: 'text',
      text: "Write `CREATE VIEW name AS`, followed by any `SELECT`. This view adds up the items of each order to get the order's total:",
    },
    {
      kind: 'example',
      label: 'create-view.sql',
      code: `${ORDER_TOTALS}

SELECT *
FROM order_totals
ORDER BY total DESC
LIMIT 5;`,
    },
    {
      kind: 'text',
      text: "`CREATE VIEW` only saves the query. The `SELECT` then reads from `order_totals` as if it were a table, and finds that Ivan's pending order 12 is the biggest, at `158.00`. You can use `WHERE`, `ORDER BY`, `GROUP BY` and joins with a view, just as with a table. The view's column names come from its query, so give every calculated column a name with `AS`.",
    },
    {
      kind: 'text',
      text: "A view stores the query, not the rows, so it always shows the data as it is right now. In the next examples, the `order_totals` view is created for you behind the scenes. Watch order 15 before and after a new item is added:",
    },
    {
      kind: 'example',
      label: 'always-fresh.sql',
      setup: ORDER_TOTALS,
      code: `SELECT order_id, first_name, total
FROM order_totals
WHERE order_id = 15;

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (15, 7, 1, 129.00);

SELECT order_id, first_name, total
FROM order_totals
WHERE order_id = 15;`,
    },
    {
      kind: 'text',
      text: "Emeka's order grows from `24.99` to `153.99` as soon as the headphones are added. Nobody had to update the view.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Changing and updating views',
    },
    {
      kind: 'text',
      text: "To change a view, use `CREATE OR REPLACE VIEW` with the new query. There is one rule: the new query must keep all the old columns, with the same names, in the same order. You may only add new columns at the end. Here we add the number of different products in each order:",
    },
    {
      kind: 'example',
      label: 'replace-view.sql',
      setup: ORDER_TOTALS,
      code: `CREATE OR REPLACE VIEW order_totals AS
SELECT o.id AS order_id,
       c.first_name,
       o.status,
       sum(oi.quantity * oi.unit_price) AS total,
       count(*) AS product_count
FROM orders AS o
JOIN customers AS c ON c.id = o.customer_id
JOIN order_items AS oi ON oi.order_id = o.id
GROUP BY o.id, c.first_name, o.status;

SELECT *
FROM order_totals
WHERE order_id IN (4, 7)
ORDER BY order_id;`,
    },
    {
      kind: 'text',
      text: "Order 4 has three different products and order 7 has two. If you try to rename or remove a column this way, PostgreSQL refuses, for example with `cannot change name of view column \"first_name\" to \"customer\"`. Then run `DROP VIEW order_totals` and create the view again. A view also protects the tables it uses: while `order_totals` exists, `DROP TABLE order_items` fails with `view order_totals depends on table order_items`.",
    },
    {
      kind: 'text',
      text: "Can you change data **through** a view? Yes, if the view is simple: it reads from one table, with no joins, no `GROUP BY`, no `DISTINCT` and no aggregates like `sum()`. PostgreSQL then passes your `UPDATE`, `INSERT` or `DELETE` on to the table underneath. This view shows only the UK customers:",
    },
    {
      kind: 'example',
      label: 'updatable-view.sql',
      code: `CREATE VIEW uk_customers AS
SELECT id, first_name, last_name, city
FROM customers
WHERE country = 'UK';

UPDATE uk_customers
SET city = 'Leeds'
WHERE id = 7;

SELECT id, first_name, city, country
FROM customers
WHERE id = 7;`,
    },
    {
      kind: 'text',
      text: "The `UPDATE` went through the view and changed the real `customers` table: George now lives in Leeds. A view like `order_totals` is different. Each of its rows is built from several rows of `order_items`, so PostgreSQL cannot know which real rows to change:",
    },
    {
      kind: 'example',
      label: 'not-updatable.sql',
      setup: ORDER_TOTALS,
      expectError: true,
      code: `UPDATE order_totals
SET status = 'shipped'
WHERE order_id = 15;`,
    },
    {
      kind: 'text',
      text: "The error is `cannot update view \"order_totals\"`, and the `DETAIL` line gives the reason: `Views containing GROUP BY are not automatically updatable`. To change the status, update the `orders` table directly.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Materialized views',
    },
    {
      kind: 'text',
      text: "A normal view runs its query every time you read it. For a big report that takes many seconds, that can be too slow. A **materialized view** runs the query once and stores the rows, like a table. Reading it is fast. But its rows do not change when the tables underneath change. They change only when you run `REFRESH MATERIALIZED VIEW`:",
    },
    {
      kind: 'example',
      label: 'materialized.sql',
      code: `CREATE MATERIALIZED VIEW product_sales AS
SELECT p.name,
       sum(oi.quantity) AS units_sold
FROM products AS p
JOIN order_items AS oi ON oi.product_id = p.id
GROUP BY p.name;

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (15, 8, 5, 9.50);

SELECT *
FROM product_sales
WHERE name = 'Coffee Mug';

REFRESH MATERIALIZED VIEW product_sales;

SELECT *
FROM product_sales
WHERE name = 'Coffee Mug';`,
    },
    {
      kind: 'text',
      text: "The shop had sold 7 Coffee Mugs. After 5 more are added to order 15, the materialized view still says `7`, because it is a saved copy. `REFRESH MATERIALIZED VIEW` runs the query again, and now it says `12`. You cannot change its rows yourself: an `UPDATE` fails with `cannot change materialized view \"product_sales\"`. A refresh is the only way.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'View or materialized view?',
    },
    {
      kind: 'table',
      head: ['Question', 'View', 'Materialized view'],
      rows: [
        ['Does it store rows?', 'No, it runs its query each time', 'Yes, a saved copy of the result'],
        ['Is it always up to date?', 'Yes', 'No, only after `REFRESH MATERIALIZED VIEW`'],
        ['How fast is reading it?', 'As fast as running the query', 'Fast, like reading a table'],
        ['What is it good for?', 'Giving a long query a short name, or showing only some rows and columns', 'Slow reports and dashboards, where data that is a few hours old is fine'],
      ],
    },
    {
      kind: 'text',
      text: "Start with a normal view. Switch to a materialized view only when the query is too slow **and** it is fine for the result to be a little old. Then refresh it on a schedule, for example every night. A refresh of a big materialized view can take a while; the [REFRESH MATERIALIZED VIEW](https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html) page explains how to refresh it without making readers wait.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'A view holds no data',
      blocks: [
        {
          kind: 'text',
          text: "A view is only a saved query, so `DROP VIEW order_totals` never deletes any orders. It removes the query, and the tables stay as they were. Dropping a materialized view deletes only its saved copy of the result.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Save a report as a snapshot, then bring the snapshot up to date. Fill in the two missing keywords.",
        code: `CREATE [___] VIEW stock_by_category AS
SELECT category_id, sum(stock) AS items_in_stock
FROM products
GROUP BY category_id;

[___] MATERIALIZED VIEW stock_by_category;`,
        answers: [['MATERIALIZED', 'materialized'], ['REFRESH', 'refresh']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: '`order_totals` is a normal view. You add an item to order 15, then run `SELECT * FROM order_totals WHERE order_id = 15`. What do you see?',
        options: [
          'The new total, with the new item included',
          'The old total, until you refresh the view',
          'An error, because the view must be created again',
          'Nothing, because you cannot use `WHERE` with a view',
        ],
        answer: 'The new total, with the new item included',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Find customers without orders',
      blocks: [
        {
          kind: 'text',
          text: "Create a view `customer_order_counts` with each customer's `id`, `first_name` and number of orders, named `order_count`. Customers with no orders must appear too, with a count of 0. Then use the view to find the customers who have never ordered.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'order-counts.sql',
              code: `CREATE VIEW customer_order_counts AS
SELECT c.id,
       c.first_name,
       count(o.id) AS order_count
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id, c.first_name;

SELECT first_name, order_count
FROM customer_order_counts
WHERE order_count = 0
ORDER BY first_name;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "`LEFT JOIN` keeps the customers who have no orders, and `count(o.id)` counts only real orders, so it gives 0 for them. Kofi and Lena have never ordered.",
            },
          ],
        },
      ],
    },
  ],
};
