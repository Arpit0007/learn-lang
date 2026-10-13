import { Lesson } from '../../shared/content';

export const SELF_CROSS_JOIN: Lesson = {
  slug: 'self-cross-join',
  title: 'Self Join and CROSS JOIN',
  nav: 'Self & cross joins',
  blocks: [
    {
      kind: 'text',
      text: "So far, each join linked two different tables with a key. This lesson shows two special joins. A **self join** joins a table to **itself**. A **cross join** uses no key at all: it pairs every row of one table with every row of another.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Self join: a table joined to itself',
    },
    {
      kind: 'text',
      text: "In the `employees` table, `manager_id` holds the `id` of each employee's manager. A manager is an employee too, so the manager's name is in the **same** table. To show each employee next to their manager, you join `employees` to `employees`.",
    },
    {
      kind: 'text',
      text: "The trick is to use the table twice, with two different aliases. Think of them as two copies of the table: `e` for the employees and `m` for the managers. Then `ON m.id = e.manager_id` links each employee to their manager.",
    },
    {
      kind: 'example',
      label: 'self-join.sql',
      code: `SELECT e.name AS employee,
       e.job_title,
       m.name AS manager
FROM employees e
JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`,
    },
    {
      kind: 'text',
      text: "There are 9 employees, but only 8 rows. Maria Silva is the CEO. Her `manager_id` is NULL, so she has no match, and the inner join drops her. Use `LEFT JOIN` to keep her:",
    },
    {
      kind: 'example',
      label: 'self-left-join.sql',
      code: `SELECT e.name AS employee,
       e.job_title,
       m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`,
    },
    {
      kind: 'text',
      text: "You can add a third copy to go one level higher. Here `mm` is the manager's manager:",
    },
    {
      kind: 'example',
      label: 'two-levels.sql',
      code: `SELECT e.name AS employee,
       m.name AS manager,
       mm.name AS managers_manager
FROM employees e
JOIN employees m ON m.id = e.manager_id
JOIN employees mm ON mm.id = m.manager_id
ORDER BY e.id;`,
    },
    {
      kind: 'text',
      text: "Nina Kowalski reports to Wei Zhang, and Wei reports to Priya Nair. Each extra level needs one more join.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "A self join needs **two different aliases** for the same table. Without them, PostgreSQL cannot tell the two copies apart, and stops with the error *table name \"employees\" specified more than once*.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'CROSS JOIN: every combination',
    },
    {
      kind: 'text',
      text: "`CROSS JOIN` has no `ON`. It pairs **every** row of the first table with **every** row of the second. Imagine the shop starts selling T-shirts in three sizes and two colours. Which T-shirts does it need? Every size in every colour.",
    },
    {
      kind: 'text',
      text: "This example does not use the shop tables. `VALUES` makes a small table right inside the query: `(VALUES ('S'), ('M'), ('L')) AS sizes (size)` is a table called `sizes`, with one column, `size`, and three rows.",
    },
    {
      kind: 'example',
      label: 'cross-join.sql',
      code: `SELECT size,
       colour
FROM (VALUES ('S'), ('M'), ('L')) AS sizes (size)
CROSS JOIN (VALUES ('Red'), ('Blue')) AS colours (colour)
ORDER BY colour, size;`,
    },
    {
      kind: 'text',
      text: "3 sizes × 2 colours = 6 T-shirts. `ORDER BY` sorts the sizes as text, so L comes before M and S.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How row counts multiply',
    },
    {
      kind: 'text',
      text: "A cross join returns the number of rows in the first table **times** the number of rows in the second. Small tables give a small result, but big tables give a huge one. The shop has 12 customers and 14 products:",
    },
    {
      kind: 'example',
      label: 'cross-join-count.sql',
      code: `SELECT count(*) AS combinations
FROM customers
CROSS JOIN products;`,
    },
    {
      kind: 'text',
      text: "12 × 14 = 168 rows. Two tables with 10,000 rows each would give 100,000,000 rows! Use `CROSS JOIN` only when you really want every combination, and only with small tables.",
    },
    {
      kind: 'text',
      text: "Normal joins can multiply rows too. A customer with three orders appears three times after a join with `orders`, as you saw with Aisha in the lesson on inner joins. Keep this in mind when you add up values after a join.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "An old way to join is to list the tables with a comma, `FROM customers, orders`, and put the link in `WHERE`. If you forget the `WHERE`, you get a cross join by accident: 12 customers × 16 orders = 192 rows that mean nothing. Write `JOIN … ON` instead. If you forget the `ON`, PostgreSQL shows an error rather than a wrong result.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show each employee with the name of their manager. Fill in the table name and the column that links an employee to their manager.',
        code: `SELECT e.name AS employee,
       m.name AS manager
FROM employees e
JOIN [___] m ON m.id = e.[___];`,
        answers: ['employees', 'manager_id'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Table `a` has 4 rows and table `b` has 5 rows. How many rows does `a CROSS JOIN b` return?',
        options: ['20', '9', '5', '4'],
        answer: '20',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: "Count each manager's team",
      blocks: [
        {
          kind: 'text',
          text: "Write a query that shows each manager's name and how many employees report directly to them. Join `employees` to itself, then group by the manager. Put the biggest team first.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'team-size.sql',
              code: `SELECT m.name AS manager,
       count(*) AS reports
FROM employees e
JOIN employees m ON m.id = e.manager_id
GROUP BY m.id, m.name
ORDER BY reports DESC, m.name;`,
            },
            {
              kind: 'text',
              text: "Maria Silva has the biggest team: Tom Walker, Priya Nair and Lucas Martin report to her.",
            },
          ],
        },
      ],
    },
  ],
};
