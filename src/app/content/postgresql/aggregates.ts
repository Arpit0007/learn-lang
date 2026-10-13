import { Lesson } from '../../shared/content';

export const AGGREGATES: Lesson = {
  slug: 'aggregates',
  title: 'Aggregate Functions',
  nav: 'COUNT, SUM, AVG…',
  blocks: [
    {
      kind: 'text',
      text: "How many customers does the shop have? What is the cheapest product? What is the average price? Each of these questions looks at **many rows**, but the answer is **one value**.",
    },
    {
      kind: 'text',
      text: "An **aggregate function** gives you that value. (To *aggregate* means to collect things together.) It reads one column from many rows and returns a single result. These are the ones you will use most:",
    },
    {
      kind: 'table',
      head: ['Function', 'Returns'],
      rows: [
        ['`count(*)`', 'The number of rows'],
        ['`count(column)`', 'The number of values in the column that are not NULL'],
        ['`sum(column)`', 'All the values added together'],
        ['`avg(column)`', 'The average: the sum divided by the number of values'],
        ['`min(column)`', 'The smallest value'],
        ['`max(column)`', 'The largest value'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Counting rows with count',
    },
    {
      kind: 'text',
      text: "`count(*)` counts rows. The `*` means \"the whole row\", so every row is counted, whatever is in it. `count(city)` is different: it counts only the rows where `city` is **not NULL**. Two customers, Fatima and Ivan, have no city, so the two numbers are not the same.",
    },
    {
      kind: 'example',
      label: 'count.sql',
      code: `SELECT count(*) AS all_customers,
       count(city) AS with_city
FROM customers;`,
    },
    {
      kind: 'text',
      text: "Put `DISTINCT` inside the brackets to count only the **different** values. The shop has 16 orders, but some customers ordered more than once. How many different customers placed an order?",
    },
    {
      kind: 'example',
      label: 'count-distinct.sql',
      code: `SELECT count(*) AS orders,
       count(DISTINCT customer_id) AS customers
FROM orders;`,
    },
    {
      kind: 'text',
      text: "The 16 orders came from only 10 different customers.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "`count(city)` is **not** the number of customers. It is the number of customers **that have a city**. To count rows, use `count(*)`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'sum, avg, min and max',
    },
    {
      kind: 'text',
      text: "`sum` adds up the values in a column, and `avg` returns their average. These two work only with numbers. `min` and `max` return the smallest and the largest value. They also work with text, in alphabetical order, and with dates, where the earliest date is the smallest.",
    },
    {
      kind: 'example',
      label: 'sum-avg-min-max.sql',
      code: `SELECT sum(stock) AS items_in_stock,
       min(price) AS cheapest,
       max(price) AS most_expensive,
       avg(price) AS average_price,
       round(avg(price), 2) AS rounded_average
FROM products;`,
    },
    {
      kind: 'text',
      text: "Look at `average_price`: `32.9000000000000000`. PostgreSQL keeps many decimal places, so that the result stays exact. People find this hard to read. `round(value, 2)` rounds a number to 2 decimal places, so `rounded_average` shows `32.90`.",
    },
    {
      kind: 'text',
      text: "What happens when some values are NULL? For this example, the shop has a small extra table, `reviews`, with three reviews of one product. A review can give from 1 to 5 stars, but one reviewer gave no stars, so that `stars` value is NULL. The first query shows the table. The second one runs the aggregates on it.",
    },
    {
      kind: 'example',
      label: 'aggregates-and-null.sql',
      setup: `CREATE TABLE reviews (id integer, product_id integer, stars integer);
INSERT INTO reviews VALUES (1, 4, 5), (2, 4, 3), (3, 4, NULL);`,
      code: `SELECT *
FROM reviews
ORDER BY id;

SELECT count(*) AS reviews,
       count(stars) AS with_stars,
       sum(stars) AS total_stars,
       avg(stars) AS average_stars
FROM reviews;`,
    },
    {
      kind: 'text',
      text: "`count(*)` counts all 3 rows. But `count(stars)`, `sum` and `avg` **skip** the NULL. So the average is (5 + 3) / 2 = 4, not (5 + 3) / 3.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Aggregates skip NULLs',
      blocks: [
        {
          kind: 'text',
          text: "Every aggregate function skips NULL values. The only exception is `count(*)`, because it counts rows, not values. If a NULL should count as 0, turn it into 0 first with `coalesce`: `avg(coalesce(stars, 0))` gives about 2.67.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Gluing text together with string_agg',
    },
    {
      kind: 'text',
      text: "`string_agg(column, separator)` glues the text from many rows into one string. The **separator** is the text that goes between the values, such as a comma and a space. To choose the order of the values, write `ORDER BY` inside the brackets.",
    },
    {
      kind: 'example',
      label: 'string-agg.sql',
      code: `SELECT string_agg(city, ', ' ORDER BY city) AS cities
FROM customers;`,
    },
    {
      kind: 'text',
      text: "The shop has 12 customers, but the list has only 10 cities. `string_agg` skipped the two NULL cities, like every aggregate does. London is there twice, because two customers live there. To list each city only once, write `string_agg(DISTINCT city, ', ' ORDER BY city)`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Counting only some rows with FILTER',
    },
    {
      kind: 'text',
      text: "Sometimes you want several counts side by side: all orders, delivered orders and cancelled orders. `WHERE` cannot do this, because it removes rows from the **whole** query. Instead, add `FILTER (WHERE …)` after an aggregate. Then only the rows that pass the condition go into **that one** aggregate.",
    },
    {
      kind: 'example',
      label: 'filter.sql',
      code: `SELECT count(*) AS all_orders,
       count(*) FILTER (WHERE status = 'delivered') AS delivered,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders;`,
    },
    {
      kind: 'text',
      text: "Of the 16 orders, 10 were delivered and 2 were cancelled. `FILTER` works with every aggregate, not only `count`. For example, `sum(quantity) FILTER (WHERE product_id = 8)` adds up only the Coffee Mugs.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show the number of products and the highest price. Fill in the two function names.',
        code: `SELECT [___](*) AS products,
       [___](price) AS highest_price
FROM products;`,
        answers: [['count', 'COUNT'], ['max', 'MAX']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'The `customers` table has 12 rows. Two customers have no city (NULL). What does `count(city)` return?',
        options: ['10', '12', '2', 'NULL'],
        answer: '10',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Count what was sold',
      blocks: [
        {
          kind: 'text',
          text: "Write one query on `order_items` that shows two numbers: the total number of items sold (add up `quantity`), and the number of **different** products sold (`product_id`).",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'items-sold.sql',
              code: `SELECT sum(quantity) AS items_sold,
       count(DISTINCT product_id) AS different_products
FROM order_items;`,
            },
            {
              kind: 'text',
              text: "The shop sold 38 items, and they were 12 different products.",
            },
          ],
        },
      ],
    },
  ],
};
