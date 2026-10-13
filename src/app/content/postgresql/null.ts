import { Lesson } from '../../shared/content';

export const NULL: Lesson = {
  slug: 'null',
  title: 'NULL Values',
  nav: 'NULL values',
  blocks: [
    {
      kind: 'text',
      text: "Sometimes a value is unknown or missing. A customer did not tell the shop their city. A product has no category yet. SQL marks a missing value with `NULL`.",
    },
    {
      kind: 'text',
      text: "`NULL` is not zero, and it is not empty text (`''`). It means \"there is no value here\". `NULL` follows its own rules, and this lesson shows them. In the sample database, two customers (Fatima and Ivan) have no city, and one product (the Gift Card) has no category.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'IS NULL and IS NOT NULL',
    },
    {
      kind: 'text',
      text: "To find the customers with no city, you might try `city = NULL`. It does not work:",
    },
    {
      kind: 'example',
      label: 'equals-null.sql',
      verdict: 'bad',
      code: `SELECT first_name, city
FROM customers
WHERE city = NULL;`,
    },
    {
      kind: 'text',
      text: "The result is empty, even though two customers have no city. A comparison with `NULL` is never true. Use `IS NULL` instead:",
    },
    {
      kind: 'example',
      label: 'is-null.sql',
      verdict: 'good',
      code: `SELECT first_name, city
FROM customers
WHERE city IS NULL
ORDER BY first_name;`,
    },
    {
      kind: 'text',
      text: "Now you get Fatima and Ivan. `IS NOT NULL` does the opposite: change the condition to `city IS NOT NULL` to get the other 10 customers.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: '`= NULL` never works',
      blocks: [
        {
          kind: 'text',
          text: "`city = NULL` asks \"is the city equal to an unknown value?\". The answer is always unknown, never true, so no row matches. PostgreSQL does not show an error, so this mistake is easy to miss. Always write `IS NULL` or `IS NOT NULL`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'NULL in calculations',
    },
    {
      kind: 'text',
      text: "Any calculation with `NULL` gives `NULL`. If one part is unknown, the answer is unknown too. This is also true for comparisons and for joining text:",
    },
    {
      kind: 'example',
      label: 'null-math.sql',
      code: `SELECT NULL + 5 AS add_null,
       NULL = NULL AS null_equals_null,
       NULL > 3 AS compare_null,
       'Hi ' || NULL AS join_null;`,
    },
    {
      kind: 'text',
      text: "All four columns are `NULL`. Even `NULL = NULL` is `NULL`, not true: two unknown values are not known to be equal.",
    },
    {
      kind: 'text',
      text: "So a condition can have three results: true, false or `NULL` (unknown). `WHERE` keeps a row only when its condition is **true**. Rows where the condition is `NULL` are left out, just like rows where it is false. The last part of this lesson shows how this can hide rows by surprise.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'COALESCE and NULLIF',
    },
    {
      kind: 'text',
      text: "`COALESCE` takes a list of values and returns the first one that is not `NULL`. Use it to show something better than `NULL`:",
    },
    {
      kind: 'example',
      label: 'coalesce.sql',
      code: `SELECT first_name,
       COALESCE(city, 'Unknown') AS city
FROM customers
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Fatima and Ivan now show `Unknown`. For every other customer, the city is not `NULL`, so `COALESCE` returns the city. The table itself does not change, only the result. You can give `COALESCE` more than two values: `COALESCE(a, b, 'none')` tries `a`, then `b`, then uses `'none'`.",
    },
    {
      kind: 'text',
      text: "`NULLIF(a, b)` does the opposite job. It returns `NULL` when `a` equals `b`, and otherwise it returns `a`. It is often used to avoid an error when you divide by zero:",
    },
    {
      kind: 'example',
      label: 'nullif.sql',
      code: `SELECT NULLIF(5, 5) AS same_values,
       NULLIF(5, 3) AS different_values,
       10 / NULLIF(0, 0) AS safe_division;`,
    },
    {
      kind: 'text',
      text: "`10 / 0` stops with the error `division by zero`. But `NULLIF(0, 0)` turns the zero into `NULL`, and dividing by `NULL` gives `NULL` instead of an error. With columns, you would write something like `price / NULLIF(stock, 0)`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'IS DISTINCT FROM',
    },
    {
      kind: 'text',
      text: "Here is a common surprise. You want all the customers who do **not** live in London, so you write `city <> 'London'`. But Fatima and Ivan are missing from the result! For them, `NULL <> 'London'` is `NULL`, not true. `IS DISTINCT FROM` works like `<>`, but it treats `NULL` like a normal value. Run both and compare:",
    },
    {
      kind: 'example',
      label: 'distinct-from.sql',
      code: `SELECT first_name, city
FROM customers
WHERE city <> 'London'
ORDER BY first_name;

SELECT first_name, city
FROM customers
WHERE city IS DISTINCT FROM 'London'
ORDER BY first_name;`,
    },
    {
      kind: 'text',
      text: "The first result has 8 rows. The second has 10, because it also has Fatima and Ivan. `IS NOT DISTINCT FROM` is the opposite: it works like `=`, and `NULL IS NOT DISTINCT FROM NULL` is true.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'The rules of NULL',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            "`NULL` means unknown or missing. It is not 0 and not `''`.",
            "Find it with `IS NULL` or `IS NOT NULL`, never with `= NULL`.",
            "A calculation or comparison with `NULL` gives `NULL`.",
            "`WHERE` keeps only the rows where the condition is true, so it leaves out rows where the condition is `NULL`.",
            "`COALESCE` replaces `NULL` with a value you choose.",
          ],
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the products that have no category. Fill in the two keywords.',
        code: `SELECT name
FROM products
WHERE category_id [___] [___];`,
        answers: [['IS', 'is'], ['NULL', 'null']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What does `SELECT 10 + NULL;` return?',
        options: ['`NULL`', '`10`', '`0`', 'An error'],
        answer: '`NULL`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'No manager',
      blocks: [
        {
          kind: 'text',
          text: "In the `employees` table, `manager_id` is the `id` of each person's manager. Show each employee's `name` and `manager_id`, but show `0` instead of `NULL` when someone has no manager. Sort the rows by `id`.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'no-manager.sql',
              code: `SELECT name,
       COALESCE(manager_id, 0) AS manager_id
FROM employees
ORDER BY id;`,
            },
            {
              kind: 'text',
              text: "Only Maria Silva, the CEO, has no manager, so she is the only one with `0`.",
            },
          ],
        },
      ],
    },
  ],
};
