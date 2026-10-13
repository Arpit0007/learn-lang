import { Lesson } from '../../shared/content';

export const GROUP_BY: Lesson = {
  slug: 'group-by',
  title: 'GROUP BY and HAVING',
  nav: 'GROUP BY & HAVING',
  blocks: [
    {
      kind: 'text',
      text: "An aggregate function like `count(*)` normally returns **one row** for the whole table. But often you want one answer **for each group** of rows: the number of orders for each status, or the total of each order.",
    },
    {
      kind: 'text',
      text: "`GROUP BY` does this. It puts the rows that have the same value into one **group**. Then each aggregate function runs once for each group, and you get one result row per group.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Grouping rows',
    },
    {
      kind: 'text',
      text: "`GROUP BY status` makes one group for each different status. Then `count(*)` counts the rows in each group.",
    },
    {
      kind: 'example',
      label: 'orders-per-status.sql',
      code: `SELECT status,
       count(*) AS orders
FROM orders
GROUP BY status
ORDER BY status;`,
    },
    {
      kind: 'text',
      text: "The 16 orders went into 4 groups, one for each status. Together, the counts add up to 16.",
    },
    {
      kind: 'text',
      text: "Each group can use any aggregate. In `order_items`, an order has one row for each product in it. The value of one row is `quantity * unit_price`. Add up these values for each `order_id`, and you get the total of each order. This query shows the five biggest orders:",
    },
    {
      kind: 'example',
      label: 'order-totals.sql',
      code: `SELECT order_id,
       sum(quantity * unit_price) AS order_total
FROM order_items
GROUP BY order_id
ORDER BY order_total DESC
LIMIT 5;`,
    },
    {
      kind: 'text',
      text: "Order 12 is the biggest: headphones for 129.00 and a charger for 29.00 make 158.00. Notice that `ORDER BY` can use the new column name, `order_total`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Every column must be grouped or aggregated',
    },
    {
      kind: 'text',
      text: "After grouping, each group becomes **one row**. So each column in `SELECT` must be one of two things: a column listed in `GROUP BY`, or something inside an aggregate function. Look what happens when `name` is neither:",
    },
    {
      kind: 'example',
      label: 'group-error.sql',
      expectError: true,
      code: `SELECT category_id,
       name,
       count(*) AS products
FROM products
GROUP BY category_id;`,
    },
    {
      kind: 'text',
      text: "Category 1 has three products, so its group has three names. But the result has only one row for category 1. Which name should go in it? PostgreSQL cannot choose, so it stops with an error. To fix it, put `name` inside an aggregate, such as `string_agg(name, ', ')`, or add `name` to `GROUP BY`.",
    },
    {
      kind: 'text',
      text: "You can group by **several columns**. Then each group is one **combination** of values. This query counts the employees for each department and job title:",
    },
    {
      kind: 'example',
      label: 'group-by-two-columns.sql',
      code: `SELECT department,
       job_title,
       count(*) AS employees
FROM employees
GROUP BY department, job_title
ORDER BY department, job_title;`,
    },
    {
      kind: 'text',
      text: "Engineering has three different job titles, so it makes three groups. Two of its employees are Software Engineers, so that group has a count of 2.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Filtering groups with HAVING',
    },
    {
      kind: 'text',
      text: "`WHERE` filters **rows**, before they go into groups. `HAVING` filters **groups**, after they are made. So `HAVING` can use aggregates like `count(*)`, but `WHERE` cannot. This query keeps only the customers with more than one order:",
    },
    {
      kind: 'example',
      label: 'having.sql',
      code: `SELECT customer_id,
       count(*) AS orders
FROM orders
GROUP BY customer_id
HAVING count(*) > 1
ORDER BY customer_id;`,
    },
    {
      kind: 'text',
      text: "You can use both in one query. Here, `WHERE` first removes the cancelled orders (`<>` means \"is not equal to\"). Then the groups are made. Then `HAVING` keeps the customers who still have more than one order:",
    },
    {
      kind: 'example',
      label: 'where-and-having.sql',
      code: `SELECT customer_id,
       count(*) AS orders
FROM orders
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING count(*) > 1
ORDER BY customer_id;`,
    },
    {
      kind: 'text',
      text: "Customers 5 and 8 are gone. Each of them had one cancelled order, so only one order was left to count.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not put an aggregate in `WHERE`. `WHERE count(*) > 1` stops with the error *aggregate functions are not allowed in WHERE*. `WHERE` looks at one row at a time, and one row has no count. Conditions on aggregates go in `HAVING`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The order of the clauses',
    },
    {
      kind: 'text',
      text: "You write the clauses in this order: `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`. But PostgreSQL does not run them in that order. It works through them like this:",
    },
    {
      kind: 'table',
      head: ['Step', 'Clause', 'What happens'],
      rows: [
        ['1', '`FROM`', 'Takes the rows of the table'],
        ['2', '`WHERE`', 'Removes the rows that do not match'],
        ['3', '`GROUP BY`', 'Puts the rows that are left into groups'],
        ['4', '`HAVING`', 'Removes the groups that do not match'],
        ['5', '`SELECT`', 'Works out the columns, including the aggregates'],
        ['6', '`ORDER BY`', 'Sorts the result. Then `LIMIT` cuts it'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "This order explains the rules. `WHERE` runs before the groups exist, so it cannot use aggregates. `ORDER BY` runs after `SELECT`, so it can use new column names like `order_total`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show each country that has more than one customer. Fill in the two missing keywords.',
        code: `SELECT country,
       count(*) AS customers
FROM customers
[___] BY country
[___] count(*) > 1;`,
        answers: [['GROUP', 'group'], ['HAVING', 'having']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You want only the orders whose total, `sum(quantity * unit_price)`, is more than 100. Where does this condition go?',
        options: ['In `HAVING`', 'In `WHERE`', 'In `GROUP BY`', 'In `ORDER BY`'],
        answer: 'In `HAVING`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Departments and salaries',
      blocks: [
        {
          kind: 'text',
          text: "Show each department with its number of employees and its average salary, rounded to a whole number. Keep only the departments with more than one employee. Tip: `round(value)` with no second number rounds to a whole number.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'departments.sql',
              code: `SELECT department,
       count(*) AS employees,
       round(avg(salary)) AS average_salary
FROM employees
GROUP BY department
HAVING count(*) > 1
ORDER BY department;`,
            },
            {
              kind: 'text',
              text: "Only Engineering (4 employees) and Sales (3 employees) have more than one person.",
            },
          ],
        },
      ],
    },
  ],
};
