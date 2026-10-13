import { Lesson } from '../../shared/content';

export const SELECT: Lesson = {
  slug: 'select',
  title: 'SQL SELECT',
  nav: 'SELECT',
  blocks: [
    {
      kind: 'text',
      text: "The `SELECT` statement reads data from a table. It is the SQL command you will use most. `SELECT` only reads: it never changes the data.",
    },
    {
      kind: 'text',
      text: "The answer to a `SELECT` is a new table, called the **result**. You decide which columns it has. You can even make new columns with calculations.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Choosing columns',
    },
    {
      kind: 'text',
      text: "Write `SELECT`, then the columns you want, separated by commas. Then write `FROM` and the name of the table. End the statement with a semicolon (`;`).",
    },
    {
      kind: 'example',
      label: 'product-prices.sql',
      code: `SELECT name, price
FROM products
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The last line, `ORDER BY id`, sorts the rows by their `id` number. Without it, PostgreSQL may return the rows in any order. You will learn more about it in the ORDER BY lesson.",
    },
    {
      kind: 'text',
      text: "SQL keywords such as `SELECT` and `FROM` work in any case, so `select` works too. Most people write keywords in capital letters, because it makes them easy to tell apart from the names of tables and columns. Those names are usually in small letters, with `_` between words, like `first_name`.",
    },
    {
      kind: 'text',
      text: "To get every column of a table, write a star (`*`) instead of the column names:",
    },
    {
      kind: 'example',
      label: 'all-columns.sql',
      code: `SELECT *
FROM categories
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The `categories` table has only two columns, `id` and `name`, and 5 rows.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Avoid `SELECT *` in real code',
      blocks: [
        {
          kind: 'text',
          text: "`SELECT *` is great for a quick look at a table. In an app, list the columns you need instead. A `*` can fetch much more data than you need, which is slow. And when someone adds a column to the table later, your query suddenly returns it too, which can break your app.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Calculations and new names',
    },
    {
      kind: 'text',
      text: "A column in the result does not have to be a column of the table. It can be a calculation. For numbers, use the same signs as on a calculator:",
    },
    {
      kind: 'table',
      head: ['Operator', 'Meaning', 'Example', 'Result'],
      rows: [
        ['`+`', 'add', '`5 + 2`', '`7`'],
        ['`-`', 'subtract', '`5 - 2`', '`3`'],
        ['`*`', 'multiply', '`5 * 2`', '`10`'],
        ['`/`', 'divide', '`10 / 2`', '`5`'],
        ['`||`', 'join two pieces of text', "`'ab' || 'cd'`", '`abcd`'],
      ],
    },
    {
      kind: 'text',
      text: "Give each calculated column a name with `AS`. This new name is called an **alias**. Without an alias, PostgreSQL makes up a name, and it is often not a helpful one.",
    },
    {
      kind: 'example',
      label: 'calculations.sql',
      code: `SELECT name,
       price,
       price * 2 AS price_for_two,
       price * stock AS stock_value
FROM products
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "`price_for_two` is the price times 2. `stock_value` is the price times the number in stock, so it shows how much money is sitting on the shelf. The Bluetooth Speaker has a `stock_value` of 0.00, because none are in stock. The table itself does not change: the calculations exist only in the result.",
    },
    {
      kind: 'text',
      text: "For text, `||` joins two pieces of text into one. This is called **concatenation**. Text values are written in single quotes, like `' '` for a space:",
    },
    {
      kind: 'example',
      label: 'join-text.sql',
      code: `SELECT first_name || ' ' || last_name AS full_name,
       city || ', ' || country AS lives_in
FROM customers
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Look at Fatima Zahra and Ivan Petrov: their `lives_in` is `NULL`. They have no city, and joining text to a missing value gives a missing value. The NULL values lesson shows how to fix this.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Aliases with spaces',
      blocks: [
        {
          kind: 'text',
          text: "An alias with spaces or capital letters needs double quotes, like `AS \"Full name\"`. Most people use small letters with `_` instead, like `full_name`, so they never need the quotes.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'SELECT without a table',
    },
    {
      kind: 'text',
      text: "In PostgreSQL, `FROM` is optional. Without it, `SELECT` works out the values you give it and returns one row. This is handy for testing a calculation quickly.",
    },
    {
      kind: 'example',
      label: 'no-table.sql',
      code: `SELECT 2 + 2;

SELECT 10 * 3 AS result,
       'Hello' || ', world!' AS greeting;`,
    },
    {
      kind: 'text',
      text: "The first result has one column called `?column?`. That is the name PostgreSQL uses when a column has no name. The second statement uses aliases, so its columns get proper names: `result` is 30 and `greeting` is `Hello, world!`.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show the name and price of each product, and call the price column `cost`. Fill in the two keywords.',
        code: `SELECT name, price [___] cost
[___] products;`,
        answers: [['AS', 'as'], ['FROM', 'from']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: "What does `SELECT first_name || ' ' || last_name AS full_name FROM customers;` show for the customer Aisha Khan?",
        options: ['`Aisha Khan`', '`AishaKhan`', "`Aisha || ' ' || Khan`", 'An error'],
        answer: '`Aisha Khan`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'A greeting for every customer',
      blocks: [
        {
          kind: 'text',
          text: "Write a query that shows each customer's `email`, and a second column called `greeting` that says hello, like `Hello, Aisha!`. Sort the rows by `id`.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'greeting.sql',
              code: `SELECT email,
       'Hello, ' || first_name || '!' AS greeting
FROM customers
ORDER BY id;`,
            },
            {
              kind: 'text',
              text: "The text `'Hello, '` ends with a space, so the name does not stick to the comma. The result has 12 rows, from `Hello, Aisha!` to `Hello, Lena!`.",
            },
          ],
        },
      ],
    },
  ],
};
