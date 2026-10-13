import { Lesson } from '../../shared/content';

export const FUNCTIONS: Lesson = {
  slug: 'functions',
  title: 'Text and Number Functions',
  nav: 'Text & number functions',
  blocks: [
    {
      kind: 'text',
      text: "A **function** takes one or more values, does something with them, and gives back a new value. You write the function's name, then the values in brackets: `upper('hello')` gives `HELLO`. The values in the brackets are called **arguments**.",
    },
    {
      kind: 'text',
      text: "PostgreSQL has hundreds of functions. This lesson shows the ones you will use most for text and numbers. You can use them in `SELECT`, in `WHERE` and in `ORDER BY`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Text functions',
    },
    {
      kind: 'table',
      head: ['Function', 'What it does', 'Example', 'Result'],
      rows: [
        ['`upper(text)`', 'changes to capital letters', "`upper('Tea')`", '`TEA`'],
        ['`lower(text)`', 'changes to small letters', "`lower('Tea')`", '`tea`'],
        ['`length(text)`', 'counts the characters', "`length('Tea')`", '`3`'],
        ['`trim(text)`', 'removes spaces at the start and the end', "`trim('  Tea  ')`", '`Tea`'],
        ['`replace(text, old, new)`', 'replaces every `old` with `new`', "`replace('Tea', 'T', 'P')`", '`Pea`'],
        ['`concat(a, b, …)`', 'joins values, and skips `NULL`', "`concat('Tea', NULL, '!')`", '`Tea!`'],
      ],
    },
    {
      kind: 'example',
      label: 'upper-lower-length.sql',
      code: `SELECT first_name,
       upper(first_name) AS shouting,
       lower(last_name) AS quiet,
       length(first_name) AS letters
FROM customers
ORDER BY id
LIMIT 5;`,
    },
    {
      kind: 'text',
      text: "Each function works on one row at a time. \"Carlos\" has 6 letters and \"Ben\" has 3. `upper` and `lower` are useful when capital letters should not matter. For example, `WHERE lower(country) = 'uk'` finds the UK customers, however the country was typed.",
    },
    {
      kind: 'text',
      text: "`concat` joins text like `||` does, with one difference: it skips `NULL` values instead of turning the whole result into `NULL`. Compare the two for Fatima, who has no city:",
    },
    {
      kind: 'example',
      label: 'concat.sql',
      code: `SELECT first_name,
       first_name || ' from ' || city AS with_pipes,
       concat(first_name, ' from ', city) AS with_concat
FROM customers
WHERE id IN (5, 6, 7)
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "For Emeka and George, both columns are the same. For Fatima, `||` gives `NULL`, but `concat` still gives `Fatima from`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Cutting text apart',
    },
    {
      kind: 'table',
      head: ['Function', 'What it does', 'Example', 'Result'],
      rows: [
        ['`substring(text FROM start FOR count)`', 'takes `count` characters, starting at `start`', "`substring('PostgreSQL' FROM 1 FOR 4)`", '`Post`'],
        ['`position(part IN text)`', 'finds where `part` starts (0 if it is not there)', "`position('SQL' IN 'PostgreSQL')`", '`8`'],
        ['`split_part(text, separator, n)`', 'cuts the text at each `separator` and returns piece number `n`', "`split_part('a-b-c', '-', 2)`", '`b`'],
      ],
    },
    {
      kind: 'example',
      label: 'emails.sql',
      code: `SELECT email,
       split_part(email, '@', 1) AS user_name,
       split_part(email, '@', 2) AS domain,
       position('@' IN email) AS at_position
FROM customers
ORDER BY id
LIMIT 4;`,
    },
    {
      kind: 'text',
      text: "`split_part(email, '@', 1)` cuts each email at the `@` sign and returns piece 1, the user name. Piece 2 is the domain, `example.com`. `position` shows where the `@` sign is: it is the 11th character in `aisha.khan@example.com`.",
    },
    {
      kind: 'text',
      text: "You can put a function inside another one. The inner function runs first, and its result goes into the outer one:",
    },
    {
      kind: 'example',
      label: 'web-names.sql',
      code: `SELECT name,
       substring(name FROM 1 FOR 6) AS first_six,
       replace(name, ' ', '-') AS with_dashes,
       lower(replace(name, ' ', '-')) AS web_name
FROM products
WHERE category_id = 4
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "`lower(replace(name, ' ', '-'))` first replaces each space with a dash, then changes everything to small letters. So \"Puzzle 1000 Pieces\" becomes `puzzle-1000-pieces`. Many websites make page addresses this way. \"Yo-yo\" has only 5 characters, so `first_six` is the whole name.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Number functions',
    },
    {
      kind: 'table',
      head: ['Function', 'What it does', 'Example', 'Result'],
      rows: [
        ['`round(x)`', 'rounds to the nearest whole number', '`round(18.5)`', '`19`'],
        ['`round(x, n)`', 'rounds to `n` decimal places', '`round(24.987, 2)`', '`24.99`'],
        ['`ceil(x)`', 'rounds up', '`ceil(24.01)`', '`25`'],
        ['`floor(x)`', 'rounds down', '`floor(24.99)`', '`24`'],
        ['`abs(x)`', 'removes the minus sign', '`abs(-7)`', '`7`'],
        ['`mod(a, b)` or `a % b`', 'the remainder after dividing `a` by `b`', '`17 % 5`', '`2`'],
      ],
    },
    {
      kind: 'example',
      label: 'rounding.sql',
      code: `SELECT name,
       price,
       round(price) AS rounded,
       ceil(price) AS rounded_up,
       floor(price) AS rounded_down,
       abs(price - 30) AS distance_from_30
FROM products
WHERE category_id = 1
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "`ceil` always rounds up and `floor` always rounds down. `round` goes to the nearest whole number, and a price exactly in the middle, like 18.50, goes up to 19. `price - 30` is negative for the two cheaper books, and `abs` removes the minus sign. So `distance_from_30` shows how far each price is from 30.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Integer division and casting',
    },
    {
      kind: 'text',
      text: "Here is a trap that catches almost everyone. Whole numbers, like `7` and `2`, are called **integers**. When you divide an integer by an integer, PostgreSQL gives an integer, and it throws away everything after the decimal point. Run this example. The first statement divides 7 by 2, and the second works out monthly salaries:",
    },
    {
      kind: 'example',
      label: 'integer-division.sql',
      code: `SELECT 7 / 2 AS whole_numbers,
       7.0 / 2 AS with_decimal,
       7 % 2 AS remainder;

SELECT name,
       salary,
       salary / 12 AS monthly_wrong,
       round(salary::numeric / 12, 2) AS monthly_right
FROM employees
ORDER BY id
LIMIT 4;`,
    },
    {
      kind: 'text',
      text: "`7 / 2` gives `3`, not 3.5! Write one of the numbers with a decimal point, like `7.0`, and you get `3.5000000000000000`. The `%` operator gives the remainder, the part that was thrown away. The `salary` column holds integers, so `salary / 12` has the same problem: Tom Walker's monthly salary shows as 7916 instead of 7916.67.",
    },
    {
      kind: 'text',
      text: "You cannot add `.0` to a column, but you can change the type of its value. This is called **casting**. Write `::` and the new type, like `salary::numeric`. The type `numeric` holds exact decimal numbers. The SQL standard way to write the same thing is `CAST(salary AS numeric)`. Casting also turns text into other types: `'42'::integer` is the number 42, and `CAST('2025-01-15' AS date)` is a date.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: '`7 / 2` is `3`',
      blocks: [
        {
          kind: 'text',
          text: "When both sides of `/` are integers, the decimals are lost without any warning. Before you divide, make one side a decimal number, with `7.0` or with a cast like `salary::numeric`. Then use `round` to keep the number of decimals you want.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'When a cast fails',
      blocks: [
        {
          kind: 'text',
          text: "A cast stops with an error when the value does not fit the new type. For example, `'abc'::integer` gives the error `invalid input syntax for type integer: \"abc\"`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Show the domain of each customer's email: the part after the `@` sign. Fill in the function name and the piece number.",
        code: `SELECT email,
       [___](email, '@', [___]) AS domain
FROM customers;`,
        answers: [['split_part', 'SPLIT_PART'], '2'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What does `SELECT 7 / 2;` return in PostgreSQL?',
        options: ['`3`', '`3.5`', '`4`', 'An error'],
        answer: '`3`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Short names',
      blocks: [
        {
          kind: 'text',
          text: "Show a short name for each customer: the first letter of the first name, then a dot and a space, then the last name, like `A. Khan`. Call the column `short_name` and sort the rows by `id`.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'short-names.sql',
              code: `SELECT substring(first_name FROM 1 FOR 1) || '. ' || last_name AS short_name
FROM customers
ORDER BY id;`,
            },
            {
              kind: 'text',
              text: "`substring(first_name FROM 1 FOR 1)` takes 1 character, starting at character 1. The result has 12 rows, from `A. Khan` to `L. Fischer`.",
            },
          ],
        },
      ],
    },
  ],
};
