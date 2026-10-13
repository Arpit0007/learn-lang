import { Lesson } from '../../shared/content';

export const PROJECTS: Lesson = {
  slug: 'projects',
  title: 'Practice Projects',
  nav: 'Practice projects',
  blocks: [
    {
      kind: 'text',
      text: "The best way to remember SQL is to use it on data that you care about. Each project below says what to build and which skills it practises. They go from beginner to advanced. Start with an easier one, even if you feel ready for more: a finished small project teaches you more than a big one that you never finish.",
    },
    {
      kind: 'text',
      text: "For these projects, install PostgreSQL on your own computer (see [Installation](https://www.postgresql.org/docs/current/tutorial-install.html) in the manual), or use a free cloud database. Keep your SQL in files, so you can run everything again from the start.",
    },
    {
      kind: 'cards',
      cards: [
        {
          title: '1 · Library catalogue',
          tags: 'Beginner · SELECT, WHERE, JOIN',
          text: "Create tables for books, authors and members, and fill them with 20 or 30 rows. Then write queries that answer real questions: which books came out after 2000, which author has the most books, and which books are on loan right now. You practise filtering, sorting and simple joins.",
        },
        {
          title: '2 · Personal budget tracker',
          tags: 'Beginner · INSERT, GROUP BY, dates',
          text: "Make a table of your spending with a date, an amount and a category, and add one month of real or made-up data. Write queries for the total per category, the spending per week, and your most expensive day. You practise aggregates, `GROUP BY` and date functions.",
        },
        {
          title: '3 · Recipe book',
          tags: 'Beginner · JOIN, many-to-many',
          text: "Store recipes, ingredients, and a table in between that says how much of each ingredient a recipe needs. Find the recipes you can cook with what is in your kitchen, and make a shopping list for three recipes. You practise many-to-many relationships and joins across three tables.",
        },
        {
          title: '4 · Gym class booking',
          tags: 'Intermediate · constraints, transactions',
          text: "Build tables for classes, members and bookings, and put the rules in the database: no double bookings (`UNIQUE`), no bookings for classes in the past (`CHECK`), and no more people than a class has places. Book places inside transactions, and test what happens when two people take the last place. You practise constraints, transactions and locking.",
        },
        {
          title: '5 · A small shop API',
          tags: 'Intermediate · app code, migrations',
          text: "Write a small Node.js or Python program for the shop database: list products, show one customer's orders, and place an order inside a transaction. Use a connection pool and placeholders everywhere, and keep the tables in numbered migration files. You practise using PostgreSQL from code, safely.",
        },
        {
          title: '6 · Sales reporting dashboard',
          tags: 'Advanced · window functions, views, EXPLAIN',
          text: "Generate a year of orders with `generate_series`, then write the queries behind a sales dashboard as views: running totals, growth from month to month with `lag()`, the top products of each category, and a rank for every customer. Use `EXPLAIN ANALYZE` and indexes until every query is fast. You practise window functions, CTEs and performance tuning.",
        },
        {
          title: '7 · Audit log with triggers',
          tags: 'Advanced · triggers, functions, JSONB',
          text: "Write one trigger function that records every `INSERT`, `UPDATE` and `DELETE` on your important tables in an `audit_log` table: who did it, when, on which table, and the old and new row as `jsonb`. Then write a query that shows the full history of one order. You practise PL/pgSQL, triggers and JSON.",
        },
        {
          title: '8 · Multi-tenant app with row-level security',
          tags: 'Advanced · roles, privileges, RLS',
          text: "Design tables for an app that many companies share, where every row has a `tenant_id`. Create an app role with least privilege and policies so that each company sees only its own rows, then prove it works with `SET ROLE` and a setting such as `app.tenant_id`. You practise roles, privileges and row-level security.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'You finished the course',
      blocks: [
        {
          kind: 'text',
          text: "You can now query a database, design tables, protect data with roles, make queries fast, back everything up and use PostgreSQL from code. That is what database work looks like in real teams. Pick one project, build the smallest version that works, and then make it better step by step. When it is done, share it, for example on GitHub, so that others can see what you can do.",
        },
      ],
    },
  ],
};
