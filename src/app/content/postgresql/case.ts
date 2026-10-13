import { Lesson } from '../../shared/content';

export const CASE: Lesson = {
  slug: 'case',
  title: 'CASE Expressions',
  nav: 'CASE',
  blocks: [
    {
      kind: 'text',
      text: "`CASE` lets SQL make a choice for each row. It works like \"if this is true, then use that value, otherwise use another value\". For example, you can label each product as cheap, medium or expensive.",
    },
    {
      kind: 'text',
      text: "`CASE` is an **expression**: it gives back a value, just like `price * 2` does. So you can use it anywhere a value can go, such as in `SELECT`, in `ORDER BY`, or inside a function.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'CASE WHEN … THEN … ELSE … END',
    },
    {
      kind: 'text',
      text: "Each `WHEN` has a condition, and each `THEN` has the value to use when that condition is true. PostgreSQL checks the `WHEN` lines from top to bottom and uses the first one that is true. If none is true, it uses the `ELSE` value. `END` closes the `CASE`, and `AS` gives the new column a name.",
    },
    {
      kind: 'example',
      label: 'price-bands.sql',
      code: `SELECT name,
       price,
       CASE
         WHEN price < 20 THEN 'cheap'
         WHEN price < 50 THEN 'medium'
         ELSE 'expensive'
       END AS price_band
FROM products
ORDER BY price;`,
    },
    {
      kind: 'text',
      text: "Five products are cheap, eight are medium, and only the headphones are expensive. The Puzzle costs 15.75. That is less than 20 and also less than 50, so both conditions are true. It gets `cheap`, because that `WHEN` comes first.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'The first true WHEN wins',
      blocks: [
        {
          kind: 'text',
          text: "The order of the `WHEN` lines matters. Put the strictest condition first. If you leave out `ELSE` and no `WHEN` is true, `CASE` gives `NULL`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The short form: CASE column WHEN value',
    },
    {
      kind: 'text',
      text: "Often every condition checks the same column with `=`. Then there is a shorter way to write it. Put the column right after `CASE`, and write only a value after each `WHEN`:",
    },
    {
      kind: 'example',
      label: 'status-labels.sql',
      code: `SELECT id,
       status,
       CASE status
         WHEN 'pending' THEN 'Not sent yet'
         WHEN 'shipped' THEN 'On the way'
         WHEN 'delivered' THEN 'Arrived'
         ELSE 'Cancelled'
       END AS status_label
FROM orders
WHERE id >= 9
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "`CASE status WHEN 'pending'` means the same as `CASE WHEN status = 'pending'`. Orders 9 to 16 have all four statuses, so you see every label. Order 16 matches no `WHEN`, so it gets the `ELSE` value, `Cancelled`.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'The short form cannot find NULL',
      blocks: [
        {
          kind: 'text',
          text: "The short form compares with `=`, and `= NULL` is never true. So `CASE city WHEN NULL THEN 'No city' END` never finds the customers without a city. Use the full form instead: `CASE WHEN city IS NULL THEN 'No city' ELSE city END`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'CASE in ORDER BY',
    },
    {
      kind: 'text',
      text: "`ORDER BY status` sorts the statuses from A to Z: cancelled, delivered, pending, shipped. That is not very useful. With `CASE`, you give each status a number, and sort by that number instead:",
    },
    {
      kind: 'example',
      label: 'status-order.sql',
      code: `SELECT id, ordered_on, status
FROM orders
WHERE ordered_on >= '2025-05-01'
ORDER BY CASE status
           WHEN 'pending' THEN 1
           WHEN 'shipped' THEN 2
           WHEN 'delivered' THEN 3
           ELSE 4
         END,
         id;`,
    },
    {
      kind: 'text',
      text: "The orders that still need work come first: the 2 pending orders, then the 2 shipped ones, then the 5 delivered ones, and the cancelled one last. The second sort column, `id`, puts orders with the same status in a fixed order.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Counting with CASE',
    },
    {
      kind: 'text',
      text: "`count` and `sum` are **aggregate functions**: they turn many rows into one value. `count(x)` counts the rows where `x` is not `NULL`, and `count(*)` counts all rows. `sum(x)` adds up all the values of `x`. With a `CASE` inside, they count only some of the rows. So you can put several counts side by side:",
    },
    {
      kind: 'example',
      label: 'order-counts.sql',
      code: `SELECT count(*) AS all_orders,
       count(CASE WHEN status = 'delivered' THEN 1 END) AS delivered,
       count(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled,
       sum(CASE WHEN status IN ('pending', 'shipped') THEN 1 ELSE 0 END) AS still_open
FROM orders;`,
    },
    {
      kind: 'text',
      text: "Of the 16 orders, 10 were delivered, 2 were cancelled, and 4 are still open. In `delivered`, the `CASE` gives `1` for a delivered order and `NULL` for every other order, because there is no `ELSE`. `count` skips the `NULL` values, so it counts only the delivered orders. In `still_open`, the `CASE` gives `1` or `0`, and `sum` adds them up. Both ways work.",
    },
    {
      kind: 'text',
      text: "`GROUP BY` puts the rows into groups, and then each group gets its own row of counts. Here is one row for each category:",
    },
    {
      kind: 'example',
      label: 'counts-per-category.sql',
      code: `SELECT category_id,
       count(*) AS products,
       count(CASE WHEN price < 20 THEN 1 END) AS cheap,
       count(CASE WHEN price >= 20 THEN 1 END) AS not_cheap,
       sum(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS sold_out
FROM products
GROUP BY category_id
ORDER BY category_id;`,
    },
    {
      kind: 'text',
      text: "Category 4 (Toys) has two cheap products and one that is not cheap. The Gift Card has no category, so it gets its own group, with `NULL` as its `category_id`. Only one product is sold out: the Bluetooth Speaker, in category 2.",
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'A shorter way in PostgreSQL',
      blocks: [
        {
          kind: 'text',
          text: "`count(*) FILTER (WHERE status = 'delivered')` gives the same result as `count(CASE WHEN status = 'delivered' THEN 1 END)`. `FILTER` is easier to read, but the `CASE` way works in every database.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Label each product as sold out or in stock. Fill in the two keywords.',
        code: `SELECT name,
       CASE
         [___] stock = 0 THEN 'sold out'
         ELSE 'in stock'
       [___] AS availability
FROM products;`,
        answers: [['WHEN', 'when'], ['END', 'end']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: "A product costs 15. Which label does it get from `CASE WHEN price < 50 THEN 'medium' WHEN price < 20 THEN 'cheap' ELSE 'expensive' END`?",
        options: ['`medium`', '`cheap`', '`expensive`', '`NULL`'],
        answer: '`medium`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Pay levels',
      blocks: [
        {
          kind: 'text',
          text: "Give each employee a pay level: `high` for a salary of 90000 or more, `mid` for 60000 or more, and `entry` for everyone else. Show `name`, `salary` and the level as `pay_level`, with the highest salary first.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'pay-levels.sql',
              code: `SELECT name,
       salary,
       CASE
         WHEN salary >= 90000 THEN 'high'
         WHEN salary >= 60000 THEN 'mid'
         ELSE 'entry'
       END AS pay_level
FROM employees
ORDER BY salary DESC;`,
            },
            {
              kind: 'text',
              text: "Four employees are `high`, two are `mid`, and three are `entry`. The `high` line comes first. If `mid` came first, everyone earning 60000 or more would get `mid`, and nobody would get `high`.",
            },
          ],
        },
      ],
    },
  ],
};
