import { Lesson } from '../../shared/content';

export const DATES: Lesson = {
  slug: 'dates',
  title: 'Dates and Times',
  nav: 'Dates & times',
  blocks: [
    {
      kind: 'text',
      text: "A shop needs dates everywhere: when a customer joined, when an order was placed, when a delivery is due. PostgreSQL has special types for dates and times. With them you can add days to a date, count the days between two dates, or find the month of a date.",
    },
    {
      kind: 'text',
      text: "Write a date as text in the form `'YYYY-MM-DD'`: the year first, then the month, then the day. So `'2025-02-01'` is the 1st of February 2025.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Date and time types',
    },
    {
      kind: 'table',
      head: ['Type', 'What it holds', 'Example'],
      rows: [
        ['`date`', 'a day', '`2025-02-01`'],
        ['`timestamp`', 'a day and a time', '`2025-02-01 14:30:00`'],
        ['`timestamptz`', 'an exact moment, shown in a time zone', '`2025-02-01 14:30:00+00`'],
        ['`interval`', 'a length of time', '`7 days`, `1 month`, `2 hours`'],
      ],
    },
    {
      kind: 'example',
      label: 'date-types.sql',
      code: `SELECT DATE '2025-02-01' AS a_date,
       TIMESTAMP '2025-02-01 14:30:00' AS a_timestamp,
       INTERVAL '2 days 3 hours' AS an_interval;`,
    },
    {
      kind: 'text',
      text: "The type name in front of the text, like `DATE '2025-02-01'`, tells PostgreSQL which type you mean. A cast does the same: `'2025-02-01'::date`. The interval is shown as `2 days 03:00:00`, which means 2 days, 3 hours, 0 minutes and 0 seconds. All the date columns in the sample database, such as `ordered_on` and `joined_on`, have the type `date`.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Write dates year first',
      blocks: [
        {
          kind: 'text',
          text: "A date like `'01/02/2025'` means the 1st of February in some countries, and January the 2nd in others. Always write `'2025-02-01'`. Then everyone, PostgreSQL included, reads it the same way.",
        },
      ],
    },
    {
      kind: 'text',
      text: "`current_date` gives today's date. `now()` gives the current moment, with the date and the time, as a `timestamptz`. A `timestamptz` is always shown in the **time zone** of your session. **UTC** is the world's standard time, which other time zones count from. `SET timezone` changes the time zone:",
    },
    {
      kind: 'example',
      label: 'now.sql',
      code: `SET timezone TO 'UTC';

SELECT current_date AS today,
       now() AS right_now;

SET timezone TO 'Asia/Tokyo';

SELECT current_date AS today,
       now() AS right_now;`,
    },
    {
      kind: 'text',
      text: "Your result depends on when you run it. Both results show the same moment. The clock in Tokyo is 9 hours ahead of UTC, so the time there is 9 hours later, and it ends in `+09` instead of `+00`. From 15:00 UTC until midnight, even the dates are different, because in Tokyo it is already the next day.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Adding and subtracting time',
    },
    {
      kind: 'text',
      text: "Add an `interval` to a date to move it forward in time. Subtract one to move back. This shows when the two pending orders will be one week and one month old:",
    },
    {
      kind: 'example',
      label: 'add-time.sql',
      code: `SELECT id,
       ordered_on,
       ordered_on + INTERVAL '7 days' AS one_week_later,
       ordered_on + INTERVAL '1 month' AS one_month_later
FROM orders
WHERE status = 'pending'
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Order 12 was placed on 2025-07-22, so one week later is 2025-07-29, and one month later is 2025-08-22. A date plus an interval gives a `timestamp`, so the results also show a time: `00:00:00`, midnight. For whole days there is a shortcut: a date plus a number, like `ordered_on + 7`, gives a plain date without the time.",
    },
    {
      kind: 'text',
      text: "Subtracting one date from another gives the number of days between them. `age(later, earlier)` gives the difference in years, months and days instead:",
    },
    {
      kind: 'example',
      label: 'time-at-company.sql',
      code: `SELECT name,
       hired_on,
       DATE '2026-01-01' - hired_on AS days_worked,
       age(DATE '2026-01-01', hired_on) AS time_worked
FROM employees
ORDER BY hired_on;`,
    },
    {
      kind: 'text',
      text: "On the 1st of January 2026, Maria Silva had worked at the shop for 2187 days, or 5 years, 11 months and 26 days. PostgreSQL writes `mons` for months. With only one date, `age(hired_on)` counts up to today, so its result changes every day.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'What you get back',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            "date `-` date gives a number of days, like `9`.",
            "date `+` number gives a date.",
            "date `+` interval gives a timestamp.",
            "`age(date, date)` gives an interval, like `1 year 2 mons`.",
          ],
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Parts of a date',
    },
    {
      kind: 'text',
      text: "`extract(part FROM date)` takes one part out of a date, such as the `year`, the `month` or the `day`. `date_trunc('month', date)` cuts a date back to the first day of its month. You can also use `'year'` or `'week'`. This is useful when you want to count things per month.",
    },
    {
      kind: 'example',
      label: 'date-parts.sql',
      code: `SELECT id,
       ordered_on,
       extract(year FROM ordered_on) AS order_year,
       extract(month FROM ordered_on) AS order_month,
       extract(dow FROM ordered_on) AS weekday_number,
       date_trunc('month', ordered_on)::date AS month_start
FROM orders
WHERE id <= 5
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "`dow` means \"day of the week\", from 0 for Sunday to 6 for Saturday. So order 1 was placed on a Saturday, and order 3 on a Monday. `date_trunc` gives back a `timestamptz`, with a time and a time zone, so `::date` turns it back into a plain date.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Formatting dates with to_char',
    },
    {
      kind: 'text',
      text: "`to_char(date, pattern)` turns a date into text, in the format you choose. The pattern is made of codes like these:",
    },
    {
      kind: 'table',
      head: ['Code', 'Meaning', 'For 2025-02-01'],
      rows: [
        ['`YYYY`', 'year', '`2025`'],
        ['`MM`', 'month number', '`02`'],
        ['`DD`', 'day of the month', '`01`'],
        ['`Mon`', 'short month name', '`Feb`'],
        ['`FMMonth`', 'full month name', '`February`'],
        ['`FMDay`', 'name of the weekday', '`Saturday`'],
      ],
    },
    {
      kind: 'example',
      label: 'to-char.sql',
      code: `SELECT ordered_on,
       to_char(ordered_on, 'DD/MM/YYYY') AS day_first,
       to_char(ordered_on, 'Mon DD, YYYY') AS month_first,
       to_char(ordered_on, 'FMDay') AS weekday
FROM orders
WHERE id <= 4
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Every other character in the pattern, like `/`, `,` or a space, is copied as it is. `FM` means \"fill mode off\". Without it, PostgreSQL adds spaces after short names like \"Monday\", so that every weekday name is 9 characters wide.",
    },
    {
      kind: 'text',
      text: "To learn more, see [Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html) and [Formatting Functions](https://www.postgresql.org/docs/current/functions-formatting.html) in the PostgreSQL documentation.",
      style: 'small',
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show the date 30 days after each order, and the month number of each order. Fill in the keyword and the function name.',
        code: `SELECT id,
       ordered_on + [___] '30 days' AS pay_by,
       [___](month FROM ordered_on) AS order_month
FROM orders;`,
        answers: [['INTERVAL', 'interval'], ['extract', 'EXTRACT']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: "What does `SELECT DATE '2025-03-10' - DATE '2025-03-01';` return?",
        options: ['`9`', '`10`', '`9 days 00:00:00`', 'An error'],
        answer: '`9`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'The month they joined',
      blocks: [
        {
          kind: 'text',
          text: "Show each customer's `first_name` and the full name of the month they joined, like `January`. Call the column `joined_month` and sort the rows by `id`.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'joined-month.sql',
              code: `SELECT first_name,
       to_char(joined_on, 'FMMonth') AS joined_month
FROM customers
ORDER BY id;`,
            },
            {
              kind: 'text',
              text: "Aisha and Ben joined in January, and Lena, the newest customer, joined in September. Without `FM`, the shorter month names would end with extra spaces.",
            },
          ],
        },
      ],
    },
  ],
};
