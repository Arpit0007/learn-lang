import { Lesson } from '../../shared/content';

export const WHERE: Lesson = {
  slug: 'where',
  title: 'SQL WHERE',
  nav: 'WHERE',
  blocks: [
    {
      kind: 'text',
      text: "Most of the time you do not want every row of a table. You want only the rows that match a rule, such as \"products under 20\" or \"customers from the UK\". The `WHERE` clause does this. It keeps the rows where the condition is true, and leaves out the rest.",
    },
    {
      kind: 'text',
      text: "A **clause** is one part of a statement, like the `FROM` part or the `ORDER BY` part. `WHERE` goes after `FROM` and before `ORDER BY`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Comparing values',
    },
    {
      kind: 'table',
      head: ['Operator', 'Meaning'],
      rows: [
        ['`=`', 'equal to'],
        ['`<>` or `!=`', 'not equal to'],
        ['`<`', 'less than'],
        ['`>`', 'greater than'],
        ['`<=`', 'less than or equal to'],
        ['`>=`', 'greater than or equal to'],
      ],
    },
    {
      kind: 'example',
      label: 'cheap-products.sql',
      code: `SELECT name, price
FROM products
WHERE price < 20
ORDER BY price;`,
    },
    {
      kind: 'text',
      text: "Five products cost less than 20, from the Yo-yo to the Wireless Mouse. Change `<` to `>` and press **Run** to see the other 9 products.",
    },
    {
      kind: 'text',
      text: "To compare text, put the text in single quotes:",
    },
    {
      kind: 'example',
      label: 'uk-customers.sql',
      code: `SELECT first_name, last_name, city
FROM customers
WHERE country = 'UK'
ORDER BY first_name;`,
    },
    {
      kind: 'text',
      text: "Two customers live in the UK: Ben Carter and George Brown. Text comparison is exact, and capital letters matter. So `country = 'uk'` finds no rows at all.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Text needs single quotes',
      blocks: [
        {
          kind: 'text',
          text: "Double quotes do not mean text in SQL. They mean a **name**, such as a column name. So `country = \"UK\"` looks for a column called `UK`. Try it: change `'UK'` to `\"UK\"` in the example above and press **Run**. You get the error `column \"UK\" does not exist`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'AND, OR and NOT',
    },
    {
      kind: 'text',
      text: "You can combine conditions:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`a AND b` is true only when **both** conditions are true.",
        "`a OR b` is true when **at least one** of them is true.",
        "`NOT a` is true when `a` is false. For example, `NOT country = 'UK'` finds everyone outside the UK.",
      ],
    },
    {
      kind: 'text',
      text: "When you mix `AND` and `OR`, PostgreSQL does the `AND` first, just like `*` comes before `+` in maths. Use brackets to say what you mean. This query finds cheap products (under 20) that are books (category 1) or toys (category 4):",
    },
    {
      kind: 'example',
      label: 'cheap-books-or-toys.sql',
      code: `SELECT name, category_id, price
FROM products
WHERE (category_id = 1 OR category_id = 4)
  AND price < 20
ORDER BY price;`,
    },
    {
      kind: 'text',
      text: "It returns 3 rows. Now press **Edit**, remove the two brackets, and press **Run**. You get 5 rows, including Space Atlas for 32.00! Without brackets, the condition means \"all books, or toys under 20\".",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Mixing AND and OR? Use brackets',
      blocks: [
        {
          kind: 'text',
          text: "`AND` is always done before `OR`. When a condition has both, put brackets around the part that belongs together. The brackets make the meaning clear, both to PostgreSQL and to people who read your SQL.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'IN and BETWEEN',
    },
    {
      kind: 'text',
      text: "`IN` checks if a value is in a list. It is a short way to write many `OR`s. `status IN ('pending', 'shipped')` means the same as `status = 'pending' OR status = 'shipped'`.",
    },
    {
      kind: 'example',
      label: 'open-orders.sql',
      code: `SELECT id, customer_id, ordered_on, status
FROM orders
WHERE status IN ('pending', 'shipped')
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Four orders are not finished yet. Change `IN` to `NOT IN` to get the opposite: the 12 orders that were delivered or cancelled.",
    },
    {
      kind: 'text',
      text: "`BETWEEN` checks if a value is inside a range. Both ends are included, so `price BETWEEN 20 AND 30` means `price >= 20 AND price <= 30`.",
    },
    {
      kind: 'example',
      label: 'price-range.sql',
      code: `SELECT name, price
FROM products
WHERE price BETWEEN 20 AND 30
ORDER BY price;`,
    },
    {
      kind: 'text',
      text: "Four products cost from 20 to 30. `BETWEEN` works with dates too: `ordered_on BETWEEN '2025-06-01' AND '2025-06-30'` finds the 2 orders from June 2025.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Patterns with LIKE and ILIKE',
    },
    {
      kind: 'text',
      text: "`LIKE` compares text with a **pattern**. A pattern is text with two special signs in it. `%` means any text, of any length, even no text at all. `_` means exactly one character.",
    },
    {
      kind: 'table',
      head: ['Pattern', 'Finds text that…'],
      rows: [
        ["`'B%'`", 'starts with B'],
        ["`'%er'`", 'ends with er'],
        ["`'%book%'`", 'contains book anywhere'],
        ["`'_a%'`", 'has a as its second letter'],
        ["`'____'`", 'is exactly 4 characters long (4 underscores)'],
      ],
    },
    {
      kind: 'example',
      label: 'starts-with-b.sql',
      code: `SELECT name
FROM products
WHERE name LIKE 'B%'
ORDER BY name;`,
    },
    {
      kind: 'text',
      text: "Two products start with B: Bluetooth Speaker and Building Blocks. `LIKE` cares about capital letters, so `'b%'` finds nothing. `ILIKE` works the same way but ignores capitals, so `name ILIKE 'b%'` finds both again. Try both changes. `ILIKE` is perfect for search boxes, where people type in any case.",
    },
    {
      kind: 'text',
      text: "`NOT` works with these too: `NOT IN`, `NOT BETWEEN`, `NOT LIKE` and `NOT ILIKE` give the opposite rows.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the products that cost from 10 to 20, both included. Fill in the two keywords.',
        code: `SELECT name, price
FROM products
[___] price [___] 10 AND 20
ORDER BY price;`,
        answers: [['WHERE', 'where'], ['BETWEEN', 'between']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which condition finds the customers whose first name starts with J?',
        options: [
          "`first_name LIKE 'J%'`",
          "`first_name = 'J%'`",
          "`first_name LIKE '%J'`",
          '`first_name LIKE "J%"`',
        ],
        answer: "`first_name LIKE 'J%'`",
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Expensive and running low',
      blocks: [
        {
          kind: 'text',
          text: "The shop wants to order more of its expensive products that are running low. Find the products that cost more than 20 **and** have fewer than 30 in stock. Show `name`, `price` and `stock`, sorted by `name`.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'running-low.sql',
              code: `SELECT name, price, stock
FROM products
WHERE price > 20
  AND stock < 30
ORDER BY name;`,
            },
            {
              kind: 'text',
              text: "Four products match: Bluetooth Speaker, Building Blocks, Noise-Cancelling Headphones and Space Atlas. The Desk Lamp is not in the list: it has exactly 30 in stock, and 30 is not less than 30.",
            },
          ],
        },
      ],
    },
  ],
};
