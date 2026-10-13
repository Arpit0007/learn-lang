import { Lesson } from '../../shared/content';

export const CREATE_TABLE: Lesson = {
  slug: 'create-table',
  title: 'CREATE TABLE and Data Types',
  nav: 'Tables & data types',
  blocks: [
    {
      kind: 'text',
      text: "So far you have read data from tables that were already there. Now you will make your own. `CREATE TABLE` makes a new, empty table. You give the table a name and a list of **columns**. Each column has a name and a **data type**: the kind of value it can hold, such as whole numbers, text or dates.",
    },
    {
      kind: 'text',
      text: "PostgreSQL checks every value against the type of its column. If you try to put the word `'hello'` into a number column, it refuses. So good types keep your data clean from the very first row.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Your first table',
    },
    {
      kind: 'text',
      text: "Write `CREATE TABLE`, then the table name, then the columns inside round brackets. Each column is a name followed by a type. Put a comma **between** the columns, but not after the last one.",
    },
    {
      kind: 'example',
      label: 'first-table.sql',
      code: `CREATE TABLE suppliers (
  id      integer,
  name    text,
  country text
);

INSERT INTO suppliers (id, name, country)
VALUES (1, 'Paper Planet', 'India');

SELECT *
FROM suppliers;`,
    },
    {
      kind: 'text',
      text: "Press **Run**. You get one result for each statement. `CREATE TABLE` makes the table. `INSERT` adds one row (the INSERT lesson explains it in detail). `SELECT` shows that row. Every Run starts from a fresh copy of the shop database, so you can run this as often as you like.",
    },
    {
      kind: 'text',
      text: "In a real database, a table stays until you remove it. A second `CREATE TABLE suppliers` would fail with `relation \"suppliers\" already exists` (PostgreSQL calls tables *relations*). Write `CREATE TABLE IF NOT EXISTS` to skip it when the table is already there: you then get a short notice instead of an error.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Choosing a data type',
    },
    {
      kind: 'text',
      text: "The type decides what a column can hold, and how values are compared and sorted. These are the types you will use most often:",
    },
    {
      kind: 'table',
      head: ['Type', 'What it holds', 'Example value'],
      rows: [
        ['`integer`', 'Whole numbers from about -2.1 billion to 2.1 billion', '`42`'],
        ['`bigint`', 'Very large whole numbers, up to about 9 billion billion', '`8000000000`'],
        ['`numeric(p, s)`', 'Exact decimal numbers: `p` digits in total, `s` of them after the point', '`19.99` in `numeric(10, 2)`'],
        ['`real`, `double precision`', 'Approximate decimal numbers (*floating point*), for measurements and science', '`0.75`'],
        ['`text`', 'Text of any length', "`'Hello'`"],
        ['`varchar(n)`', 'Text of at most `n` characters', "`'IN'` in `varchar(2)`"],
        ['`boolean`', 'Yes or no: `true` or `false`', '`true`, shown as `t`'],
        ['`date`', 'A day in the calendar', "`'2025-03-01'`"],
        ['`timestamptz`', 'An exact moment: a date, a time and a time zone', "`'2025-07-01 09:00:00+00'`"],
        ['`uuid`', 'A long random ID', '`b4657672-bba0-…`'],
      ],
    },
    {
      kind: 'text',
      text: "Use `integer` for counts, quantities and most IDs. If a number could ever pass about 2 billion, like page views on a big website, use `bigint`. Going over the limit of a type is an error: `integer out of range`.",
    },
    {
      kind: 'text',
      text: "Decimal numbers need more care. `real` and `double precision` store numbers in binary (base 2), and many decimals, like `19.99`, cannot be stored exactly in binary. So the computer keeps a number that is very close, but not equal. `numeric` stores the exact decimal digits. Watch what happens when a customer buys three Wireless Mice at 19.99 each:",
    },
    {
      kind: 'example',
      label: 'money.sql',
      code: `CREATE TABLE price_test (
  price_real    real,
  price_numeric numeric(10, 2)
);

INSERT INTO price_test (price_real, price_numeric)
VALUES (19.99, 19.99);

SELECT price_real * 3 AS real_total,
       price_numeric * 3 AS numeric_total
FROM price_test;`,
    },
    {
      kind: 'text',
      text: "The right answer is `59.97`. The `real` column gives `59.96999931335449`. Small errors like this add up in sums and reports, and a bill can be wrong by a cent. That is why the shop's `products.price` column is `numeric(10, 2)`: up to 10 digits in total, with exactly 2 after the decimal point. A value with more decimals is rounded to 2.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Money needs numeric',
      blocks: [
        {
          kind: 'text',
          text: "Store prices and other amounts of money in `numeric`, never in `real` or `double precision`. Use the floating-point types only for measurements where a tiny error does not matter, like temperatures or distances.",
        },
      ],
    },
    {
      kind: 'text',
      text: "For text, PostgreSQL has `text` and `varchar(n)`. They are stored the same way and are equally fast. Use `text` for most text. Use `varchar(n)` only when a maximum length is a real rule of your data, like a two-letter country code. A value that is too long is rejected:",
    },
    {
      kind: 'example',
      label: 'varchar-limit.sql',
      expectError: true,
      code: `CREATE TABLE countries (
  code varchar(2),
  name text
);

INSERT INTO countries (code, name)
VALUES ('IN', 'India');

INSERT INTO countries (code, name)
VALUES ('IND', 'India');`,
    },
    {
      kind: 'text',
      text: "`'IN'` fits, so the first `INSERT` works. `'IND'` has three characters, so PostgreSQL stops with `value too long for type character varying(2)`. (`character varying` is the long name of `varchar`.) The bad row is not saved.",
    },
    {
      kind: 'text',
      text: "A `boolean` column holds `true` or `false`, and results show them as `t` and `f`. Write dates as `'YYYY-MM-DD'`, like `'2025-03-01'`. Year, month, day is an order that nobody misreads, whatever country they live in. PostgreSQL also checks that the date is real, so `'2025-02-30'` is an error. For an exact moment, like the time an order was paid, use `timestamptz`, short for *timestamp with time zone*.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'IDs: identity columns, serial and uuid',
    },
    {
      kind: 'text',
      text: "Almost every table has an `id` column, so each row can be found by a simple number. Choosing those numbers yourself is slow and easy to get wrong. Let PostgreSQL do it with an **identity column**. `GENERATED ALWAYS AS IDENTITY` gives each new row the next number: 1, 2, 3 and so on.",
    },
    {
      kind: 'example',
      label: 'identity.sql',
      expectError: true,
      code: `CREATE TABLE suppliers (
  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);

INSERT INTO suppliers (name)
VALUES ('Paper Planet'), ('Toy Town'), ('Lamp World');

SELECT *
FROM suppliers;

INSERT INTO suppliers (id, name)
VALUES (10, 'Gift Shop');`,
    },
    {
      kind: 'text',
      text: "The three suppliers get the ids 1, 2 and 3, and you never typed them. `PRIMARY KEY` marks `id` as the column that identifies each row, and `NOT NULL` means every supplier must have a name. The Constraints lesson explains both.",
    },
    {
      kind: 'text',
      text: "The last `INSERT` fails on purpose. `ALWAYS` means PostgreSQL always picks the id, so it refuses yours: `cannot insert a non-DEFAULT value into column \"id\"`. This protects you from a classic bug, where an id you chose by hand later clashes with an automatic one. If you really need to choose some ids yourself, use `GENERATED BY DEFAULT AS IDENTITY`. Then PostgreSQL picks a number only when you do not give one. The shop's tables use `BY DEFAULT`, so the sample data could have fixed ids.",
    },
    {
      kind: 'table',
      head: ['Column definition', 'What it does'],
      rows: [
        ['`id integer GENERATED ALWAYS AS IDENTITY`', 'Numbers 1, 2, 3 and so on. Your own value is refused. The safest choice.'],
        ['`id integer GENERATED BY DEFAULT AS IDENTITY`', 'Numbers 1, 2, 3 and so on, but your own value is allowed.'],
        ['`id serial`', 'The older PostgreSQL way to get 1, 2, 3. It works like `BY DEFAULT`.'],
        ['`id uuid DEFAULT gen_random_uuid()`', 'A random ID that is almost impossible to guess.'],
      ],
    },
    {
      kind: 'text',
      text: "You will see `serial` in many older tutorials. It still works, but identity columns are part of the SQL standard and have fewer surprises, so use them in new tables.",
    },
    {
      kind: 'text',
      text: "A **UUID** (Universally Unique Identifier) is a random ID written as 32 letters and digits, like `b4657672-bba0-4a19-8fa8-114e6f716467`. Use one when IDs must be hard to guess, for example in a web address, or when many computers create rows at the same time. The function `gen_random_uuid()` makes a new one, and with `DEFAULT` PostgreSQL calls it for every new row.",
    },
    {
      kind: 'example',
      label: 'uuid-and-time.sql',
      code: `SET timezone TO 'UTC';

CREATE TABLE events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  starts_at  timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO events (title, starts_at)
VALUES ('Summer sale', '2025-07-01 09:00:00+00');

SELECT *
FROM events;`,
    },
    {
      kind: 'text',
      text: "The `id` and `created_at` values change every time you press **Run**. `gen_random_uuid()` makes a new random ID, and `now()` is the moment the row was added. A `timestamptz` is shown in the time zone of your *session* (your connection to the database). The first line sets that time zone to UTC, so `starts_at` shows as `2025-07-01 09:00:00+00` for everyone. The `+00` means \"zero hours from UTC\". Change `'UTC'` to `'Asia/Tokyo'` and run it again: the same moment now shows as `2025-07-01 18:00:00+09`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Defaults and names',
    },
    {
      kind: 'text',
      text: "`DEFAULT` gives a column a value to use when an `INSERT` does not mention it. A column without a default gets `NULL`. Here the `INSERT` gives only `product_id`, and the other columns fill themselves in:",
    },
    {
      kind: 'example',
      label: 'defaults.sql',
      code: `CREATE TABLE reviews (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id integer NOT NULL,
  stars      integer NOT NULL DEFAULT 5,
  approved   boolean NOT NULL DEFAULT false,
  comment    text,
  written_on date NOT NULL DEFAULT current_date
);

INSERT INTO reviews (product_id)
VALUES (8);

SELECT *
FROM reviews;`,
    },
    {
      kind: 'text',
      text: "`stars` is `5` and `approved` is `f` (false), from their defaults. `comment` has no default, so it is `NULL`. `written_on` shows today's date, because `current_date` is worked out at the moment the row is added.",
    },
    {
      kind: 'text',
      text: "Good names make every query easier to read. Follow these rules:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "Use lowercase `snake_case`: small letters, with `_` between the words, like `order_items` and `joined_on`.",
        "PostgreSQL changes names to lowercase unless they are in double quotes. `CREATE TABLE OrderItems` makes a table called `orderitems`. A name like `\"OrderItems\"` keeps its capitals, but then you must type the quotes every time. Avoid that.",
        "Plural (`customers`) or singular (`customer`) table names are both fine. Pick one style and use it for every table. The shop uses plural names.",
        "Do not use SQL keywords as names. `CREATE TABLE order (id integer)` fails with `syntax error at or near \"order\"`. That is one reason the shop's table is called `orders`.",
        "Make each name say what it holds: `price`, not `p`. A column that points to another table is named after it, like `customer_id`.",
        "Many teams end `date` columns with `_on` and `timestamptz` columns with `_at`, like `joined_on` and `created_at`.",
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "A comma after the last column, like `country text,` right before the closing bracket, is a syntax error. Commas go **between** columns only.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make a `coupons` table. Fill in the missing keyword, the kind of column that numbers itself, and an exact number type for money.",
        code: `CREATE [___] coupons (
  id       integer GENERATED ALWAYS AS [___] PRIMARY KEY,
  code     text NOT NULL,
  discount [___](5, 2) NOT NULL
);`,
        answers: [['TABLE', 'table'], ['IDENTITY', 'identity'], ['numeric', 'NUMERIC', 'decimal', 'DECIMAL']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which type is the best choice for a `price` column?',
        options: ['`numeric(10, 2)`', '`real`', '`text`', '`integer`'],
        answer: '`numeric(10, 2)`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Make a table for book loans',
      blocks: [
        {
          kind: 'text',
          text: "Create a table called `book_loans` with four columns: an `id` that PostgreSQL fills in; `member_name`, text that must always have a value; `borrowed_on`, a date that defaults to today; and `returned`, a `boolean` that defaults to `false`. Then insert one row that gives only the `member_name`, and select all rows.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'book-loans.sql',
              code: `CREATE TABLE book_loans (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_name text NOT NULL,
  borrowed_on date NOT NULL DEFAULT current_date,
  returned    boolean NOT NULL DEFAULT false
);

INSERT INTO book_loans (member_name)
VALUES ('Hana Sato');

SELECT *
FROM book_loans;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "You get one row: id `1`, `Hana Sato`, today's date and `f`. The defaults filled in everything you left out.",
            },
          ],
        },
      ],
    },
  ],
};
