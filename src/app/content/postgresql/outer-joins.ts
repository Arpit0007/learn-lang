import { Lesson } from '../../shared/content';

export const OUTER_JOINS: Lesson = {
  slug: 'outer-joins',
  title: 'LEFT, RIGHT and FULL JOIN',
  nav: 'Outer joins',
  blocks: [
    {
      kind: 'text',
      text: "An inner join drops the rows that have no match. Often that is fine. But sometimes the missing rows are exactly what you want to see: customers who never ordered, products nobody bought, or a category with no products. An **outer join** keeps the rows without a match. Where a match is missing, PostgreSQL fills the other table's columns with NULL.",
    },
    {
      kind: 'text',
      text: "In a join, the **left** table is the one written before the word `JOIN`, and the **right** table is the one after it. Imagine a left table with the ids 1, 2 and 3, and a right table with the ids 2, 3 and 4. Only 2 and 3 have a match. This is what each join returns:",
    },
    {
      kind: 'table',
      head: ['Join', 'Keeps', 'Pairs (left–right)'],
      rows: [
        ['`JOIN`', 'Only the rows that match', '2–2, 3–3'],
        ['`LEFT JOIN`', 'Every row of the left table', '1–NULL, 2–2, 3–3'],
        ['`RIGHT JOIN`', 'Every row of the right table', '2–2, 3–3, NULL–4'],
        ['`FULL JOIN`', 'Every row of both tables', '1–NULL, 2–2, 3–3, NULL–4'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'LEFT JOIN',
    },
    {
      kind: 'text',
      text: "`LEFT JOIN` keeps **every** row of the left table. If a row has no match in the right table, the right table's columns are NULL. To keep the result short, this query looks only at the five newest customers (ids 8 to 12):",
    },
    {
      kind: 'example',
      label: 'left-join.sql',
      code: `SELECT c.id,
       c.first_name,
       o.id AS order_id,
       o.status
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE c.id >= 8
ORDER BY c.id, o.id;`,
    },
    {
      kind: 'text',
      text: "Kofi and Lena have never ordered. An inner join would drop them, but `LEFT JOIN` keeps them, with NULL in `order_id` and `status`. Hana has two orders, so she appears twice.",
    },
    {
      kind: 'text',
      text: "You may also see `LEFT OUTER JOIN`. The word `OUTER` is optional, so it means exactly the same.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Finding rows with no match',
    },
    {
      kind: 'text',
      text: "After a `LEFT JOIN`, a customer with no orders has NULL in every column of `orders`. So `WHERE o.id IS NULL` keeps **only** the rows without a match. This is a very common way to find what is missing.",
    },
    {
      kind: 'example',
      label: 'never-ordered.sql',
      code: `SELECT c.id,
       c.first_name,
       c.last_name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.id;`,
    },
    {
      kind: 'text',
      text: "Test a column that is never NULL in a real order, such as the key `o.id`. Then a NULL can only mean one thing: there was no match.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'RIGHT JOIN and FULL JOIN',
    },
    {
      kind: 'text',
      text: "`RIGHT JOIN` is a mirror of `LEFT JOIN`: it keeps every row of the **right** table. So `orders RIGHT JOIN customers` gives the same rows as `customers LEFT JOIN orders`. This query returns the same six rows as the first example:",
    },
    {
      kind: 'example',
      label: 'right-join.sql',
      code: `SELECT c.id,
       c.first_name,
       o.id AS order_id,
       o.status
FROM orders o
RIGHT JOIN customers c ON c.id = o.customer_id
WHERE c.id >= 8
ORDER BY c.id, o.id;`,
    },
    {
      kind: 'text',
      text: "Most people swap the tables and use `LEFT JOIN` instead, because a query is easier to read when the main table comes first.",
    },
    {
      kind: 'text',
      text: "`FULL JOIN` keeps every row of **both** tables. Rows that match are joined. Rows without a match get NULLs on the other side.",
    },
    {
      kind: 'example',
      label: 'full-join.sql',
      code: `SELECT p.name AS product,
       c.name AS category
FROM products p
FULL JOIN categories c ON c.id = p.category_id
ORDER BY c.id, p.id;`,
    },
    {
      kind: 'text',
      text: "Look at the last two rows. Garden is a category with no products, so its `product` is NULL. The Gift Card is a product with no category, so its `category` is NULL. A `LEFT JOIN` would keep only the Gift Card, and a `RIGHT JOIN` only Garden.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Conditions in ON or in WHERE',
    },
    {
      kind: 'text',
      text: "Say you want the number of **delivered** orders for every customer, including the customers who have none. It is tempting to put `o.status = 'delivered'` in `WHERE`:",
    },
    {
      kind: 'example',
      label: 'where-trap.sql',
      verdict: 'bad',
      code: `SELECT c.first_name,
       count(o.id) AS delivered_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'delivered'
GROUP BY c.id, c.first_name
ORDER BY c.id;`,
    },
    {
      kind: 'text',
      text: "Only 6 of the 12 customers are left. `WHERE` runs **after** the join. For Kofi and Lena, `o.status` is NULL. For customers like Emeka, it is never `'delivered'`. So `WHERE` removes all their rows, and the `LEFT JOIN` ends up working like an inner join.",
    },
    {
      kind: 'text',
      text: "Put the condition in `ON` instead. There, it only decides which orders count as a match, and every customer stays:",
    },
    {
      kind: 'example',
      label: 'on-condition.sql',
      verdict: 'good',
      code: `SELECT c.first_name,
       count(o.id) AS delivered_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
                  AND o.status = 'delivered'
GROUP BY c.id, c.first_name
ORDER BY c.id;`,
    },
    {
      kind: 'text',
      text: "Now all 12 customers are there, and the ones without a delivered order show 0. The query counts `o.id`, not `*`: even Kofi has one row (full of NULLs), so `count(*)` would give him 1, but `count(o.id)` skips the NULL and gives 0. It also groups by `c.id`, because two customers could have the same first name.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "After a `LEFT JOIN`, a condition on the **right** table in `WHERE` removes the rows without a match. Put it in `ON` instead. A condition on the **left** table, like `WHERE c.id >= 8`, is fine in `WHERE`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the products that were never sold. Fill in the join type and the missing keyword.',
        code: `SELECT p.name
FROM products p
[___] JOIN order_items oi ON oi.product_id = p.id
WHERE oi.product_id IS [___];`,
        answers: [['LEFT', 'left', 'LEFT OUTER', 'left outer'], ['NULL', 'null']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: "You write `customers c LEFT JOIN orders o ON o.customer_id = c.id`, then `WHERE o.status = 'shipped'`. What happens to the customers with no orders?",
        options: [
          'They are removed from the result',
          'They stay, with NULL in the order columns',
          'Their status becomes shipped',
          'PostgreSQL shows an error',
        ],
        answer: 'They are removed from the result',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Empty categories',
      blocks: [
        {
          kind: 'text',
          text: "Write a query that finds the categories with **no** products. Start from `categories` and use a `LEFT JOIN` to `products`.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'empty-categories.sql',
              code: `SELECT c.name
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE p.id IS NULL
ORDER BY c.name;`,
            },
            {
              kind: 'text',
              text: "Garden is the only category with no products.",
            },
          ],
        },
      ],
    },
  ],
};
