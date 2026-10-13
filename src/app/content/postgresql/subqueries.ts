import { Lesson } from '../../shared/content';

export const SUBQUERIES: Lesson = {
  slug: 'subqueries',
  title: 'Subqueries',
  nav: 'Subqueries',
  blocks: [
    {
      kind: 'text',
      text: "A **subquery** is a query inside another query. You write it inside brackets: `(SELECT …)`. PostgreSQL runs the inner query first, and the outer query uses its result.",
    },
    {
      kind: 'text',
      text: "Subqueries let you answer a question in steps. Which products cost more than the average? First find the average price, then compare each price with it. What you can do with a subquery depends on what it returns:",
    },
    {
      kind: 'table',
      head: ['The subquery returns', 'Used like this'],
      rows: [
        ['One value (one row, one column)', '`WHERE price > (SELECT avg(price) FROM products)`'],
        ['A list (one column, many rows)', '`WHERE id IN (SELECT customer_id FROM orders)`'],
        ['Some rows, or none', '`WHERE NOT EXISTS (SELECT 1 FROM orders WHERE …)`'],
        ['A whole table', '`FROM (SELECT …) AS totals`'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'A subquery that returns one value',
    },
    {
      kind: 'text',
      text: "A subquery that returns exactly **one value** is called a **scalar subquery**. You can use it anywhere you would write a single value, for example in `WHERE`.",
    },
    {
      kind: 'example',
      label: 'above-average.sql',
      code: `SELECT name,
       price
FROM products
WHERE price > (SELECT avg(price)
               FROM products)
ORDER BY price DESC;`,
    },
    {
      kind: 'text',
      text: "The subquery returns the average price, 32.90. Then the outer query keeps the 4 products that cost more. You cannot write `WHERE price > avg(price)`, because aggregates are not allowed in `WHERE`. The subquery solves this.",
    },
    {
      kind: 'text',
      text: "A scalar subquery must not return more than one row. If it does, PostgreSQL stops with the error *more than one row returned by a subquery used as an expression*.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'IN, EXISTS and NOT EXISTS',
    },
    {
      kind: 'text',
      text: "A subquery can also return a **list**: one column with many rows. `IN (SELECT …)` checks if a value is in that list. This query finds the customers who have a pending order:",
    },
    {
      kind: 'example',
      label: 'in-subquery.sql',
      code: `SELECT first_name,
       last_name
FROM customers
WHERE id IN (SELECT customer_id
             FROM orders
             WHERE status = 'pending')
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The subquery returns the customer ids of the pending orders: 5 and 9. The outer query keeps the customers whose `id` is in that list.",
    },
    {
      kind: 'text',
      text: "`EXISTS (SELECT …)` is true when the subquery returns **at least one row**. `NOT EXISTS` is true when it returns **no rows**. This is the clearest way to find the customers who never ordered:",
    },
    {
      kind: 'example',
      label: 'not-exists.sql',
      code: `SELECT c.first_name,
       c.last_name
FROM customers c
WHERE NOT EXISTS (SELECT 1
                  FROM orders o
                  WHERE o.customer_id = c.id)
ORDER BY c.id;`,
    },
    {
      kind: 'text',
      text: "For each customer, the subquery looks for orders with that customer's id. For Kofi and Lena it finds none, so `NOT EXISTS` is true. `EXISTS` only checks **whether** rows come back, not what is in them. That is why people write `SELECT 1`: any value would do.",
    },
    {
      kind: 'text',
      text: "You might try `NOT IN` to find what is missing, too. Be careful. This query looks for the categories that no product uses. Garden should come back. Run it:",
    },
    {
      kind: 'example',
      label: 'not-in-trap.sql',
      verdict: 'bad',
      code: `SELECT name
FROM categories
WHERE id NOT IN (SELECT category_id
                 FROM products);`,
    },
    {
      kind: 'text',
      text: "No rows at all! The list from the subquery contains a NULL, because the Gift Card has no category. For Garden, `5 NOT IN (1, 2, 3, 4, NULL)` asks: is 5 different from every value in the list? It is different from 1, 2, 3 and 4. But is 5 different from NULL, an unknown value? PostgreSQL cannot know. So the whole answer is unknown, and the row is left out.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Avoid NOT IN with a subquery',
      blocks: [
        {
          kind: 'text',
          text: "If the subquery can return a NULL, `NOT IN` returns no rows. Use `NOT EXISTS` instead: it handles NULLs the way you expect. Or remove the NULLs inside the subquery with `WHERE category_id IS NOT NULL`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Correlated subqueries',
    },
    {
      kind: 'text',
      text: "Look again at the `NOT EXISTS` example. Its subquery uses `c.id`, a column from the **outer** query. A subquery like this is called a **correlated subquery**. It cannot run on its own. It runs again for each row of the outer query, with the values of that row.",
    },
    {
      kind: 'text',
      text: "This correlated subquery compares each product with the average price of **its own category**. The table is used twice, so the inner copy gets its own alias, `p2`.",
    },
    {
      kind: 'example',
      label: 'correlated.sql',
      code: `SELECT p.name,
       p.category_id,
       p.price
FROM products p
WHERE p.price > (SELECT avg(p2.price)
                 FROM products p2
                 WHERE p2.category_id = p.category_id)
ORDER BY p.category_id, p.price DESC;`,
    },
    {
      kind: 'text',
      text: "Take the Desk Lamp. For its row, the subquery works out the average price of category 3 (Home), which is about 23.83. The lamp costs 34.99, so it is kept.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'A subquery in FROM',
    },
    {
      kind: 'text',
      text: "A subquery in `FROM` works like a temporary table. It is called a **derived table**, and it must have an alias. It helps when you need two steps of aggregates, because you cannot put one aggregate inside another, as in `avg(sum(…))`. Here, the subquery makes one row per order with its total. The outer query then takes the average of those totals:",
    },
    {
      kind: 'example',
      label: 'derived-table.sql',
      code: `SELECT round(avg(order_total), 2) AS average_order
FROM (SELECT order_id,
             sum(quantity * unit_price) AS order_total
      FROM order_items
      GROUP BY order_id) AS totals;`,
    },
    {
      kind: 'text',
      text: "The derived table `totals` has 16 rows, one for each order. On average, an order is worth 68.10.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the customers who have at least one cancelled order. Fill in the keyword, and the column that links the subquery to the outer query.',
        code: `SELECT c.first_name
FROM customers c
WHERE [___] (SELECT 1
             FROM orders o
             WHERE o.customer_id = c.[___]
               AND o.status = 'cancelled');`,
        answers: [['EXISTS', 'exists'], ['id']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In `WHERE id NOT IN (SELECT …)`, the subquery returns 1, 2 and NULL. Which rows does the query return?',
        options: ['No rows at all', 'Every row except ids 1 and 2', 'Only the rows where `id` is NULL', 'An error'],
        answer: 'No rows at all',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Products nobody bought',
      blocks: [
        {
          kind: 'text',
          text: "Write a query that lists the products that were never sold. Use `NOT EXISTS` with a subquery on `order_items`.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'never-sold.sql',
              code: `SELECT p.name
FROM products p
WHERE NOT EXISTS (SELECT 1
                  FROM order_items oi
                  WHERE oi.product_id = p.id)
ORDER BY p.name;`,
            },
            {
              kind: 'text',
              text: "Nobody has bought the Gift Card or the Yo-yo yet.",
            },
          ],
        },
      ],
    },
  ],
};
