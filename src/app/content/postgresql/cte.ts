import { Lesson } from '../../shared/content';

export const CTE: Lesson = {
  slug: 'cte',
  title: 'WITH Queries (CTEs)',
  nav: 'WITH (CTEs)',
  blocks: [
    {
      kind: 'text',
      text: "Some questions need more than one step. First you work something out, and then you use that answer to work out the next thing. A **CTE** (common table expression) lets you give each step a **name** with the `WITH` keyword. The rest of the query can then use that name, just like a table.",
    },
    {
      kind: 'text',
      text: "CTEs make long queries easier to read, because the steps come one after another, from top to bottom. A special kind, `WITH RECURSIVE`, can even follow a chain of rows, such as the chain of managers in a company.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Name a step with WITH',
    },
    {
      kind: 'text',
      text: "Write `WITH`, a name, `AS`, and then a query in brackets. After the brackets comes the main query, which reads from that name. Below, the first step adds up the cost of every order. The main query then keeps only the orders that cost more than 100.",
    },
    {
      kind: 'example',
      label: 'first-cte.sql',
      code: `WITH order_totals AS (
  SELECT order_id,
         sum(quantity * unit_price) AS total
  FROM order_items
  GROUP BY order_id
)
SELECT order_id, total
FROM order_totals
WHERE total > 100
ORDER BY total DESC;`,
    },
    {
      kind: 'text',
      text: "Three orders cost more than 100: orders 12, 3 and 14. The name `order_totals` exists only while this one query runs. It is not saved in the database.",
    },
    {
      kind: 'text',
      text: "You can write **several CTEs in a row**. Put a comma between them, and write `WITH` only once, at the start. Each step can use the steps above it. Below, `customer_totals` uses `order_totals` to add up how much each customer spent, leaving out cancelled orders. The main query then adds the customer names.",
    },
    {
      kind: 'example',
      label: 'two-ctes.sql',
      code: `WITH order_totals AS (
  SELECT order_id,
         sum(quantity * unit_price) AS total
  FROM order_items
  GROUP BY order_id
),
customer_totals AS (
  SELECT o.customer_id,
         sum(t.total) AS spent
  FROM orders AS o
  JOIN order_totals AS t ON t.order_id = o.id
  WHERE o.status <> 'cancelled'
  GROUP BY o.customer_id
)
SELECT c.first_name,
       c.last_name,
       ct.spent
FROM customer_totals AS ct
JOIN customers AS c ON c.id = ct.customer_id
ORDER BY ct.spent DESC;`,
    },
    {
      kind: 'text',
      text: "Aisha Khan spent the most, 236.49. Ten customers have orders that were not cancelled, so you get 10 rows.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'CTEs or subqueries?',
    },
    {
      kind: 'text',
      text: "You can do the same job with **subqueries**: queries in brackets, placed inside the main query. Here is the last example again, with subqueries instead of CTEs. Run it: it gives the same 10 rows.",
    },
    {
      kind: 'example',
      label: 'subqueries.sql',
      code: `SELECT c.first_name,
       c.last_name,
       ct.spent
FROM (
  SELECT o.customer_id,
         sum(t.total) AS spent
  FROM orders AS o
  JOIN (
    SELECT order_id,
           sum(quantity * unit_price) AS total
    FROM order_items
    GROUP BY order_id
  ) AS t ON t.order_id = o.id
  WHERE o.status <> 'cancelled'
  GROUP BY o.customer_id
) AS ct
JOIN customers AS c ON c.id = ct.customer_id
ORDER BY ct.spent DESC;`,
    },
    {
      kind: 'text',
      text: "To read this version, you start in the middle, at the deepest subquery, and work your way out. With CTEs, you read from top to bottom, in the same order as the steps, and each step has a name that says what it holds. PostgreSQL usually runs both versions in the same way, so choose the one that is easier to read.",
    },
    {
      kind: 'table',
      head: ['', 'Subquery', 'CTE'],
      rows: [
        ['Where the step goes', 'Inside the main query', 'Before the main query, with a name'],
        ['How you read it', 'From the inside out', 'From top to bottom'],
        ['Using a step twice', 'Write the subquery twice', 'Write its name twice'],
        ['Following a chain of rows', 'Not possible', 'Possible with `WITH RECURSIVE`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "A CTE lives for **one query** only. If you want to keep a named query and use it again tomorrow, create a **view** instead.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Recursive CTEs',
    },
    {
      kind: 'text',
      text: "A **recursive** CTE uses its own name inside itself. You write `WITH RECURSIVE`, and the CTE has two parts, joined by `UNION ALL`:",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "The **start**: a normal query that gives the first rows.",
        "The **repeat step**: a query that reads the rows from the last round and makes new rows from them.",
      ],
    },
    {
      kind: 'text',
      text: "PostgreSQL runs the start once. Then it runs the repeat step again and again, each time on the rows from the round before. It stops when the repeat step finds no new rows. Here is the smallest example: counting from 1 to 5.",
    },
    {
      kind: 'example',
      label: 'count-to-5.sql',
      code: `WITH RECURSIVE numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1
  FROM numbers
  WHERE n < 5
)
SELECT n
FROM numbers
ORDER BY n;`,
    },
    {
      kind: 'text',
      text: "The start gives the row 1. The repeat step reads 1 and makes 2, then reads 2 and makes 3, and so on. When it reads 5, the condition `n < 5` is false, so the repeat step makes no row, and the query stops.",
    },
    {
      kind: 'text',
      text: "Now something useful. In the `employees` table, `manager_id` points to each person's manager. Maria Silva, the CEO, has no manager. The start finds Maria. The repeat step then finds everyone whose manager was found in the last round: first Maria's team, then their teams, and so on. Two extra columns show how deep each person is (`depth`) and the chain of names from the top (`path`). The `||` operator joins pieces of text together.",
    },
    {
      kind: 'example',
      label: 'org-chart.sql',
      code: `WITH RECURSIVE org_chart AS (
  SELECT id,
         name,
         1 AS depth,
         name AS path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT e.id,
         e.name,
         oc.depth + 1,
         oc.path || ' > ' || e.name
  FROM employees AS e
  JOIN org_chart AS oc ON e.manager_id = oc.id
)
SELECT depth, name, path
FROM org_chart
ORDER BY path;`,
    },
    {
      kind: 'text',
      text: "Sorting by `path` puts each person right under their manager, like a family tree. Nina Kowalski is at depth 4: her manager is Wei Zhang, his manager is Priya Nair, and Priya's manager is Maria Silva. The query stops by itself after Nina, because nobody works for her, so the next round finds no new rows.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Make sure it stops',
      blocks: [
        {
          kind: 'text',
          text: "A recursive CTE stops only when the repeat step finds no new rows. Forget the `WHERE n < 5`, and the counting query never ends. Bad data can do the same thing: if someone sets Maria's manager to Nina by mistake, the chain becomes a circle, and the tree query goes round and round.",
        },
        {
          kind: 'text',
          text: "So add a **safety net** to the repeat step: a limit on the depth, such as `WHERE oc.depth < 20`. With good data it changes nothing. With a circle, it stops the query after 20 levels. (On this page, a run that takes longer than 15 seconds is stopped for you. A real database server may keep going for a very long time.)",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Changing data inside WITH',
    },
    {
      kind: 'text',
      text: "A CTE can also hold an `INSERT`, `UPDATE` or `DELETE`. Add `RETURNING` to it, and the changed rows become the rows of the CTE, so the next step can use them. A common use: add a new customer and their first order in one statement. The order needs the customer's new `id`, and `RETURNING id` hands it over.",
    },
    {
      kind: 'example',
      label: 'insert-two-tables.sql',
      code: `WITH new_customer AS (
  INSERT INTO customers (first_name, last_name, email, country, joined_on)
  VALUES ('Mia', 'Novak', 'mia.novak@example.com', 'Czechia', '2025-10-01')
  RETURNING id
)
INSERT INTO orders (customer_id, ordered_on, status)
SELECT id, '2025-10-01', 'pending'
FROM new_customer
RETURNING id, customer_id, status;`,
    },
    {
      kind: 'text',
      text: "Mia got the customer `id` 13, and her new order, number 17, points to her. Both rows are added by one statement, so they are saved together: if one `INSERT` fails, neither row is saved.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Count from 1 to 10 with a recursive CTE. Fill in the keyword that starts the query, and the words that join the start and the repeat step.',
        code: `[___] RECURSIVE numbers AS (
  SELECT 1 AS n
  [___]
  SELECT n + 1
  FROM numbers
  WHERE n < 10
)
SELECT n
FROM numbers
ORDER BY n;`,
        answers: [
          ['WITH', 'with'],
          ['UNION ALL', 'union all', 'UNION', 'union'],
        ],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'When does a recursive CTE stop?',
        options: [
          'When the repeat step finds no new rows',
          'After exactly 10 rounds',
          'When it reaches the `ORDER BY`',
          'Never: you must press Stop',
        ],
        answer: 'When the repeat step finds no new rows',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Walk up from Nina to the CEO',
      blocks: [
        {
          kind: 'text',
          text: "Write a recursive CTE that starts with Nina Kowalski and climbs **up** the chain: her manager, then her manager's manager, all the way to the CEO. Show each name with a `steps_up` column (0 for Nina). Add a safety net so it can never go more than 10 steps.",
        },
        {
          kind: 'text',
          text: "Hint: in the repeat step, join on `e.id = b.manager_id`. That finds the manager of each person from the last round.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'nina-to-ceo.sql',
              code: `WITH RECURSIVE bosses AS (
  SELECT id, name, manager_id, 0 AS steps_up
  FROM employees
  WHERE name = 'Nina Kowalski'

  UNION ALL

  SELECT e.id, e.name, e.manager_id, b.steps_up + 1
  FROM employees AS e
  JOIN bosses AS b ON e.id = b.manager_id
  WHERE b.steps_up < 10
)
SELECT steps_up, name
FROM bosses
ORDER BY steps_up;`,
            },
            {
              kind: 'text',
              text: "You get Nina (0), Wei Zhang (1), Priya Nair (2) and Maria Silva (3). Maria has no manager, so the next round finds nobody, and the query stops.",
            },
          ],
        },
      ],
    },
  ],
};
