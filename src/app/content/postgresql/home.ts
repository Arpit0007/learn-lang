import { Lesson } from '../../shared/content';
import { SEED_TABLES } from './seed';

export const HOME: Lesson = {
  slug: 'home',
  title: 'PostgreSQL Home',
  nav: 'Home',
  blocks: [
    {
      kind: 'text',
      style: 'lede',
      text: "PostgreSQL is a free and powerful **database system**. Shops, banks, apps and games all over the world use it to store their data. Most people call it **Postgres** for short.",
    },
    {
      kind: 'text',
      text: "A **database** is an organised store of data. PostgreSQL keeps its data in **tables**. A table looks like a spreadsheet. Each **column** holds one kind of information, such as a name or a price. Each **row** holds one thing, such as one customer or one product.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'What is SQL?',
    },
    {
      kind: 'text',
      text: "**SQL** (Structured Query Language) is the language you use to talk to a database. Some people say the letters, S-Q-L, and some people say \"sequel\". A question you ask in SQL is called a **query**. So PostgreSQL is the program that keeps the data, and SQL is the language you use to ask it for that data.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Other databases',
      blocks: [
        {
          kind: 'text',
          text: "MySQL, SQLite, SQL Server and Oracle are other database systems that also understand SQL. The basics you learn here work in all of them, with small differences. This course teaches the PostgreSQL way.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How this course works',
    },
    {
      kind: 'text',
      text: "Each lesson is short. It explains one topic, shows examples, and ends with a few exercises.",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "Read the explanation and the SQL example.",
        "Press **Run** under the example. The result appears below it as a table.",
        "Press **Edit**, change the SQL, and press **Run** again to see what is different. **Reset** brings back the original SQL.",
        "Every run starts with a fresh copy of the sample database, so you cannot break anything.",
        "Finish the exercises at the end of the lesson. When all of them are correct, the lesson gets a ✓ in the menu.",
      ],
    },
    {
      kind: 'text',
      text: "The examples run on a real PostgreSQL database (version 18) inside your browser, so you do not need to install anything. The first run can take a few seconds, because your browser downloads PostgreSQL first. After that, runs are fast.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The sample shop database',
    },
    {
      kind: 'text',
      text: "All the examples in this course use the same small database for an online shop. It has 6 tables:",
    },
    {
      kind: 'table',
      head: ['Table', 'What it holds'],
      rows: SEED_TABLES.map(([table, about]) => [`\`${table}\``, about]),
    },
    {
      kind: 'text',
      text: "Like real data, it is not perfect. Some customers have no city. Some customers never ordered anything, and some products were never sold. These gaps are there on purpose, so you can practise finding them.",
    },
    {
      kind: 'text',
      text: "Here is your first query. Press **Run** under it.",
    },
    {
      kind: 'example',
      label: 'first-query.sql',
      code: `SELECT first_name, city, country
FROM customers
ORDER BY first_name;`,
    },
    {
      kind: 'text',
      text: "You can read it almost like English: *select* three columns *from* the `customers` table, and *order* the rows *by* first name. The result is a table with 12 rows, one for each customer. Two customers, Fatima and Ivan, show `NULL` as their city. `NULL` means that the value is missing. You will learn about it in the NULL values lesson.",
    },
    {
      kind: 'example',
      label: 'products.sql',
      code: `SELECT name, price, stock
FROM products
ORDER BY price;`,
    },
    {
      kind: 'text',
      text: "This shows all 14 products, from the cheapest (the Yo-yo, for 4.99) to the most expensive (the headphones, for 129.00). Now press **Edit**, change `price` in the last line to `stock`, and press **Run**. The Bluetooth Speaker comes first, because none are left in stock.",
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'You cannot break anything',
      blocks: [
        {
          kind: 'text',
          text: "Because every run starts with a fresh copy of the database, you can change data, or even delete it, and the next run starts clean again. Try it with the example below. It does something you should never do to a real shop: it deletes data.",
        },
      ],
    },
    {
      kind: 'example',
      label: 'delete-everything.sql',
      code: `DELETE FROM order_items;

SELECT order_id, product_id
FROM order_items;`,
    },
    {
      kind: 'text',
      text: "This example has two **statements**. Each statement ends with a semicolon (`;`) and shows its own result. The first one deletes all 26 rows of the `order_items` table. The second one shows that the table is now empty. Press **Run** again: once more, 26 rows are deleted. The rows were back, because the run started from a fresh copy.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In a database table, what is a **row**?',
        options: [
          'One item, such as one customer or one product',
          'One kind of information, such as all the prices',
          'The name of the table',
          'A command written in SQL',
        ],
        answer: 'One item, such as one customer or one product',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Complete the query so that it reads the `products` table.',
        code: `SELECT name, price
[___] products;`,
        answers: [['FROM', 'from']],
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Your first query',
      blocks: [
        {
          kind: 'text',
          text: "Write a query that shows the `name` and `job_title` of every employee, sorted by `name`. Use the first query on this page as a model. Press **Edit** on any example, replace its SQL with yours, and press **Run**.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'employees.sql',
              code: `SELECT name, job_title
FROM employees
ORDER BY name;`,
            },
            {
              kind: 'text',
              text: "The result has 9 rows, one for each employee, from Amara Okafor to Wei Zhang.",
            },
          ],
        },
      ],
    },
  ],
};
