import { Lesson } from '../../shared/content';

export const SET_OPERATIONS: Lesson = {
  slug: 'set-operations',
  title: 'UNION, INTERSECT and EXCEPT',
  nav: 'UNION & friends',
  blocks: [
    {
      kind: 'text',
      text: "A join puts tables **side by side**: it adds columns. A **set operation** puts the results of two queries **one under the other**: it combines rows. You write two `SELECT` queries with a set operator between them.",
    },
    {
      kind: 'table',
      head: ['Operator', 'Returns'],
      rows: [
        ['`UNION`', 'The rows of the first query **or** the second, without duplicates'],
        ['`UNION ALL`', 'All the rows of both queries, duplicates included'],
        ['`INTERSECT`', 'Only the rows that are in **both** results'],
        ['`EXCEPT`', 'The rows of the first query that are **not** in the second'],
      ],
    },
    {
      kind: 'text',
      text: "Most examples here use two lists of products: the **cheap** ones (`price < 20`) and the ones with **lots of stock** (`stock >= 100`). Watch what happens to the products that are on both lists.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'UNION and UNION ALL',
    },
    {
      kind: 'text',
      text: "`UNION` returns the rows of both queries. If a row is in both results, `UNION` shows it only **once**.",
    },
    {
      kind: 'example',
      label: 'union.sql',
      code: `SELECT name
FROM products
WHERE price < 20
UNION
SELECT name
FROM products
WHERE stock >= 100
ORDER BY name;`,
    },
    {
      kind: 'text',
      text: "The first query finds 5 cheap products, and the second finds 3 products with lots of stock. That makes 8, but the result has only 6 rows. Coffee Mug and Yo-yo are on both lists, and `UNION` removed the duplicates.",
    },
    {
      kind: 'text',
      text: "`UNION ALL` keeps **every** row, duplicates too:",
    },
    {
      kind: 'example',
      label: 'union-all.sql',
      code: `SELECT name
FROM products
WHERE price < 20
UNION ALL
SELECT name
FROM products
WHERE stock >= 100
ORDER BY name;`,
    },
    {
      kind: 'text',
      text: "Now Coffee Mug and Yo-yo appear twice. `UNION ALL` is also faster, because PostgreSQL does not have to look for duplicates. Use it when you know there are none, or when you want to keep them.",
    },
    {
      kind: 'text',
      text: "On one table, you could also get these rows with `OR`. Set operations are most useful when the rows come from **different tables**, as you will see below.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'INTERSECT and EXCEPT',
    },
    {
      kind: 'text',
      text: "`INTERSECT` returns only the rows that are in **both** results:",
    },
    {
      kind: 'example',
      label: 'intersect.sql',
      code: `SELECT name
FROM products
WHERE price < 20
INTERSECT
SELECT name
FROM products
WHERE stock >= 100
ORDER BY name;`,
    },
    {
      kind: 'text',
      text: "`EXCEPT` returns the rows of the first query that are **not** in the second. It works well across tables. This query takes all the product ids, then removes every id that appears in `order_items`. What is left are the products that were never sold:",
    },
    {
      kind: 'example',
      label: 'except.sql',
      code: `SELECT id
FROM products
EXCEPT
SELECT product_id
FROM order_items
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Products 13 (Yo-yo) and 14 (Gift Card) were never sold. With `EXCEPT`, the order of the two queries matters. If you swap them, you ask for sold products that are not in `products`. There are none, so you get no rows.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Rules for combining queries',
    },
    {
      kind: 'text',
      text: "Both queries must return the **same number of columns**. The columns in the same position must also have **matching types**: text with text, numbers with numbers. This query fails, because the first part has two columns and the second part has only one:",
    },
    {
      kind: 'example',
      label: 'column-count-error.sql',
      expectError: true,
      code: `SELECT first_name,
       last_name
FROM customers
UNION
SELECT name
FROM employees;`,
    },
    {
      kind: 'text',
      text: "To fix it, make one column out of the two. `first_name || ' ' || last_name` glues the first name, a space and the last name together. Now both parts return one text column:",
    },
    {
      kind: 'example',
      label: 'union-two-tables.sql',
      code: `SELECT first_name || ' ' || last_name AS person
FROM customers
WHERE country = 'UK'
UNION
SELECT name
FROM employees
WHERE department = 'Sales'
ORDER BY person;`,
    },
    {
      kind: 'text',
      text: "This list mixes the customers from the UK with the Sales team. It also shows two more rules. The result takes its column names from the **first** query, so the column is called `person`. And `ORDER BY` is written only once, at the very **end**. It sorts the whole combined result.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "An `ORDER BY` inside the first query, before `UNION`, is a syntax error. Write it once, after the last query. It can only use the column names of the result, like `person` here.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the ids of the customers who have never ordered, sorted by id. Fill in the set operator and the keyword that sorts the result.',
        code: `SELECT id
FROM customers
[___]
SELECT customer_id
FROM orders
[___] BY id;`,
        answers: [['EXCEPT', 'except'], ['ORDER', 'order']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Query A returns 5 different names. Query B returns 3 different names. 2 names are in both. How many rows does `A UNION B` return?',
        options: ['6', '8', '2', '3'],
        answer: '6',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Delivered and cancelled',
      blocks: [
        {
          kind: 'text',
          text: "Find the ids of the customers who have at least one delivered order **and** at least one cancelled order. Write two queries on `orders`, and combine them with a set operator.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'delivered-and-cancelled.sql',
              code: `SELECT customer_id
FROM orders
WHERE status = 'delivered'
INTERSECT
SELECT customer_id
FROM orders
WHERE status = 'cancelled'
ORDER BY customer_id;`,
            },
            {
              kind: 'text',
              text: "Only customer 8, Hana, has both: her order 10 was delivered, and her order 16 was cancelled.",
            },
          ],
        },
      ],
    },
  ],
};
