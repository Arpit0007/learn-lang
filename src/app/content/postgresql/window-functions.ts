import { Lesson } from '../../shared/content';

/** First step of the running-total and lag/lead examples: the total of each delivered order. */
const DELIVERED_TOTALS = `WITH order_totals AS (
  SELECT o.id,
         o.ordered_on,
         sum(i.quantity * i.unit_price) AS total
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.id
  WHERE o.status = 'delivered'
  GROUP BY o.id, o.ordered_on
)`;

export const WINDOW_FUNCTIONS: Lesson = {
  slug: 'window-functions',
  title: 'Window Functions',
  nav: 'Window functions',
  blocks: [
    {
      kind: 'text',
      text: "`GROUP BY` squeezes each group of rows into a single row. That is great for totals, but the separate rows are gone. A **window function** also does a calculation over a group of rows, but it **keeps every row**. It writes its answer next to each row.",
    },
    {
      kind: 'text',
      text: "You can spot a window function by the word `OVER`. The brackets after `OVER` say which rows to look at. This set of rows is called the **window**.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'OVER: keep every row',
    },
    {
      kind: 'text',
      text: "`OVER ()` with empty brackets means: the window is **all the rows**. Below, `avg(salary) OVER ()` works out the average salary of everyone and shows it next to each employee. The last column takes it away from each salary, so you can see who earns more or less than the average.",
    },
    {
      kind: 'example',
      label: 'over-all-rows.sql',
      code: `SELECT name,
       salary,
       round(avg(salary) OVER ()) AS company_avg,
       salary - round(avg(salary) OVER ()) AS difference
FROM employees
ORDER BY salary DESC;`,
    },
    {
      kind: 'text',
      text: "All 9 employees are still there, and each row shows the average, 83000. A plain `SELECT avg(salary) FROM employees` gives the same 83000, but as one row, with no names next to it.",
    },
    {
      kind: 'text',
      text: "`PARTITION BY` splits the rows into groups, a bit like `GROUP BY`. Each row then sees only the rows of its own group. Here, each employee is compared with their own department.",
    },
    {
      kind: 'example',
      label: 'partition-by.sql',
      code: `SELECT name,
       department,
       salary,
       round(avg(salary) OVER (PARTITION BY department)) AS dept_avg
FROM employees
ORDER BY department, salary DESC;`,
    },
    {
      kind: 'text',
      text: "The average is 87750 in Engineering and 67000 in Sales. A `GROUP BY department` query would give only 4 rows, one per department. The window function keeps all 9.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Numbering and ranking rows',
    },
    {
      kind: 'text',
      text: "`ORDER BY` inside `OVER` puts the rows of the window in order. Then these three functions can number them. They differ only when there is a **tie**, which means two rows with the same value:",
    },
    {
      kind: 'table',
      head: ['Function', 'Numbers', 'With a tie for 2nd place'],
      rows: [
        ['`row_number()`', 'Counts the rows: 1, 2, 3, 4', 'Never repeats a number'],
        ['`rank()`', 'Places, like in a race', '1, 2, 2, 4: the same place, then it **skips**'],
        ['`dense_rank()`', 'Places without gaps', '1, 2, 2, 3: the same place, no gap'],
      ],
    },
    {
      kind: 'text',
      text: "The first step below counts the orders of each customer. Then the three functions number the customers, most orders first. Look at the customers who tie with 2 orders.",
    },
    {
      kind: 'example',
      label: 'ranking.sql',
      code: `WITH order_counts AS (
  SELECT customer_id,
         count(*) AS orders
  FROM orders
  GROUP BY customer_id
)
SELECT c.first_name,
       oc.orders,
       row_number() OVER (ORDER BY oc.orders DESC, c.first_name) AS row_number,
       rank()       OVER (ORDER BY oc.orders DESC) AS rank,
       dense_rank() OVER (ORDER BY oc.orders DESC) AS dense_rank
FROM order_counts AS oc
JOIN customers AS c ON c.id = oc.customer_id
ORDER BY oc.orders DESC, c.first_name;`,
    },
    {
      kind: 'text',
      text: "Ben, Carlos, Emeka and Hana all have 2 orders. `rank()` gives all four of them place 2, and the next customer, Dana, gets place 6, because 5 customers are ahead of her. `dense_rank()` gives Dana place 3. `row_number()` never repeats a number, so we added `c.first_name` to its `ORDER BY`. That decides the order inside a tie, so the numbers are the same every time you run it.",
    },
    {
      kind: 'text',
      text: "A very common question is the **top N per group**, for example the 2 best-paid people in each department. Number the rows inside each department with `row_number()`, then keep the numbers 1 and 2. Do the numbering in a CTE, and the filtering in the main query.",
    },
    {
      kind: 'example',
      label: 'top-2-per-department.sql',
      code: `WITH ranked AS (
  SELECT name,
         department,
         salary,
         row_number() OVER (
           PARTITION BY department
           ORDER BY salary DESC
         ) AS place
  FROM employees
)
SELECT department, place, name, salary
FROM ranked
WHERE place <= 2
ORDER BY department, place;`,
    },
    {
      kind: 'text',
      text: "The numbers start again at 1 in each department. Management and Support have only one person each, so they show one row each.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Why the CTE? If you write `WHERE row_number() OVER (...) <= 2`, PostgreSQL stops with the error \"window functions are not allowed in WHERE\". It filters the rows with `WHERE` **before** it runs any window function. So number the rows in a CTE first, and filter them in the next step.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Running totals and frames',
    },
    {
      kind: 'text',
      text: "When `OVER` has an `ORDER BY`, the window **grows** as you go down the rows: it holds every row from the first one up to the current row. So `sum(total) OVER (ORDER BY ordered_on)` adds up all the orders so far. This is called a **running total**. In the example, the CTE first works out the total of each delivered order.",
    },
    {
      kind: 'example',
      label: 'running-total.sql',
      code: `${DELIVERED_TOTALS}
SELECT id,
       ordered_on,
       total,
       sum(total) OVER (ORDER BY ordered_on) AS running_total,
       round(avg(total) OVER (
         ORDER BY ordered_on
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ), 2) AS avg_last_3
FROM order_totals
ORDER BY ordered_on;`,
    },
    {
      kind: 'text',
      text: "The running total grows from 43.99 to 703.15. The last column uses a **frame**, which picks the exact rows of the window. `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` means \"this row and the 2 rows before it\". So `avg_last_3` is the average of the last 3 orders. This is called a **moving average**. The first two rows don't have 2 rows before them, so they average only 1 and 2 orders.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The row before and the row after',
    },
    {
      kind: 'text',
      text: "`lag(total)` gives the value of `total` from the **previous** row of the window. `lead(total)` gives it from the **next** row. With them, you can compare each order with the one before it.",
    },
    {
      kind: 'example',
      label: 'lag-lead.sql',
      code: `${DELIVERED_TOTALS}
SELECT id,
       ordered_on,
       total,
       lag(total) OVER (ORDER BY ordered_on) AS previous_total,
       total - lag(total) OVER (ORDER BY ordered_on) AS change,
       lead(total) OVER (ORDER BY ordered_on) AS next_total
FROM order_totals
ORDER BY ordered_on;`,
    },
    {
      kind: 'text',
      text: "Order 3 cost 80.01 more than order 2, and order 4 cost 45.50 less than order 3. The first order has no order before it, so its `previous_total` and `change` are NULL. The last order has no order after it, so its `next_total` is NULL.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Rank the employees by salary, starting again at 1 in each department. Fill in the two missing keywords.',
        code: `SELECT name,
       department,
       salary,
       rank() [___] ([___] department ORDER BY salary DESC) AS pay_rank
FROM employees;`,
        answers: [
          ['OVER', 'over'],
          ['PARTITION BY', 'partition by'],
        ],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Three customers share 2nd place. Which function gives the customer after them place 3?',
        options: ['`dense_rank()`', '`rank()`', '`row_number()`', '`count()`'],
        answer: '`dense_rank()`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Days since the last order',
      blocks: [
        {
          kind: 'text',
          text: "For customers 1, 2 and 3, list each order with a `days_since_last` column: the number of days since **the same customer's** previous order. Taking one date from another gives the number of days between them.",
        },
        {
          kind: 'text',
          text: "Hint: use `lag(ordered_on)` with `PARTITION BY customer_id`, so each customer is looked at on their own.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'days-since-last.sql',
              code: `SELECT customer_id,
       id AS order_id,
       ordered_on,
       ordered_on - lag(ordered_on) OVER (
         PARTITION BY customer_id
         ORDER BY ordered_on
       ) AS days_since_last
FROM orders
WHERE customer_id IN (1, 2, 3)
ORDER BY customer_id, ordered_on;`,
            },
            {
              kind: 'text',
              text: "Each customer's first order shows NULL. Customer 1 waited 37 days between the first two orders, and then 116 days.",
            },
          ],
        },
      ],
    },
  ],
};
