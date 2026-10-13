import { Lesson } from '../../shared/content';

export const ORDER_LIMIT: Lesson = {
  slug: 'order-limit',
  title: 'ORDER BY, LIMIT and DISTINCT',
  nav: 'ORDER BY & LIMIT',
  blocks: [
    {
      kind: 'text',
      text: "The rows in a table have no fixed order. If you do not ask for an order, PostgreSQL returns the rows in whatever order is quickest for it, and that order can change. `ORDER BY` sorts the result the way you want.",
    },
    {
      kind: 'text',
      text: "In this lesson you will also learn `LIMIT`, which keeps only the first rows of the result, and `DISTINCT`, which removes repeated rows.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Sorting with ORDER BY',
    },
    {
      kind: 'text',
      text: "`ORDER BY` comes near the end of the query, after `WHERE`. Add `ASC` for **ascending** order (small to large, A to Z, old to new) or `DESC` for **descending** order (large to small, Z to A, new to old). `ASC` is the default, so you can leave it out.",
    },
    {
      kind: 'example',
      label: 'most-expensive-first.sql',
      code: `SELECT name, price
FROM products
ORDER BY price DESC;`,
    },
    {
      kind: 'text',
      text: "The headphones (129.00) come first and the Yo-yo (4.99) comes last. Remove `DESC` and run it again to turn the list around.",
    },
    {
      kind: 'text',
      text: "You can sort by more than one column. PostgreSQL sorts by the first column. Only when two rows have the same value there does it look at the second column, and so on.",
    },
    {
      kind: 'example',
      label: 'by-department.sql',
      code: `SELECT name, department, salary
FROM employees
ORDER BY department, salary DESC;`,
    },
    {
      kind: 'text',
      text: "The departments are in A to Z order, from Engineering to Support. Inside each department, the highest salary comes first: in Engineering, Priya Nair (110000) is before Nina Kowalski (62000). Each column has its own direction, so here `DESC` is only for `salary`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Where do NULLs go?',
    },
    {
      kind: 'text',
      text: "In PostgreSQL, a missing value (`NULL`) is sorted as if it were larger than any other value. So with `ASC` the `NULL` rows come last, and with `DESC` they come first. To choose yourself, add `NULLS FIRST` or `NULLS LAST`.",
    },
    {
      kind: 'example',
      label: 'nulls-first.sql',
      code: `SELECT first_name, city
FROM customers
ORDER BY city NULLS FIRST, first_name;`,
    },
    {
      kind: 'text',
      text: "Fatima and Ivan have no city, so they come first. Ben and George both live in London, and the second sort column, `first_name`, decides their order. Remove `NULLS FIRST` and run it again: the two `NULL` rows move to the end.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'LIMIT and OFFSET',
    },
    {
      kind: 'text',
      text: "`LIMIT` keeps only the first rows of the result. Together with `ORDER BY`, it answers \"top 3\" questions, like \"Which 3 products cost the most?\":",
    },
    {
      kind: 'example',
      label: 'top-3.sql',
      code: `SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;`,
    },
    {
      kind: 'text',
      text: "`OFFSET` skips rows before `LIMIT` starts counting. Websites use it to show results page by page. Change the last line to `LIMIT 3 OFFSET 3;` and press **Run**: now you get the next 3 products, from the Desk Lamp to the USB-C Charger.",
    },
    {
      kind: 'text',
      text: "You may also see `FETCH FIRST 3 ROWS ONLY`. It means the same as `LIMIT 3`. It is the official SQL standard way to write it, so it works in other databases too.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'LIMIT without ORDER BY',
      blocks: [
        {
          kind: 'text',
          text: "Without `ORDER BY`, \"the first 3 rows\" can be any 3 rows. Often you get the rows in the order they were added, but not always, as the next example shows. So always use `ORDER BY` together with `LIMIT`.",
        },
      ],
    },
    {
      kind: 'example',
      label: 'no-order.sql',
      code: `UPDATE products
SET stock = stock
WHERE id = 1;

SELECT name
FROM products
LIMIT 3;`,
    },
    {
      kind: 'text',
      text: "The `UPDATE` statement changes the data in a table. Here it sets the stock of product 1 to the same number it already had, so nothing you can see has changed. But PostgreSQL saves a changed row as a new copy, at the end of the table. So \"Learn SQL in 10 Days\" (product 1) is no longer in the first 3 rows: you get The Little Cookbook, Space Atlas and Wireless Mouse.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Removing repeats with DISTINCT',
    },
    {
      kind: 'text',
      text: "`SELECT DISTINCT` removes repeated rows from the result. Two customers live in the UK, but this list shows `UK` only once:",
    },
    {
      kind: 'example',
      label: 'countries.sql',
      code: `SELECT DISTINCT country
FROM customers
ORDER BY country;`,
    },
    {
      kind: 'text',
      text: "The shop has 12 customers from 11 countries. With more than one column, `DISTINCT` removes a row only when **all** its columns are the same as in another row. So `SELECT DISTINCT city, country` would still show London, UK only once.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show the 5 customers who joined most recently, the newest first. Fill in the two keywords.',
        code: `SELECT first_name, joined_on
FROM customers
ORDER BY joined_on [___]
[___] 5;`,
        answers: [['DESC', 'desc'], ['LIMIT', 'limit']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You sort the customers with `ORDER BY city`. Where do the customers whose city is `NULL` appear?',
        options: ['At the end', 'At the start', 'They are left out', 'In a random place'],
        answer: 'At the end',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Every job title once',
      blocks: [
        {
          kind: 'text',
          text: "Write a query that lists the job titles of the employees in A to Z order, with no title shown twice.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'job-titles.sql',
              code: `SELECT DISTINCT job_title
FROM employees
ORDER BY job_title;`,
            },
            {
              kind: 'text',
              text: "There are 9 employees but only 7 different job titles, from CEO to Support Agent. Sales Rep and Software Engineer each belong to two people.",
            },
          ],
        },
      ],
    },
  ],
};
