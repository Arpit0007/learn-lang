import { Lesson } from '../../shared/content';

export const FROM_CODE: Lesson = {
  slug: 'from-code',
  title: 'Using PostgreSQL from Code',
  nav: 'PostgreSQL from code',
  blocks: [
    {
      kind: 'text',
      text: "So far you have typed SQL yourself. Real apps send SQL from code: a website in Node.js, a script in Python, the server behind a phone app. The app is a **client**. It connects to the PostgreSQL server over the network, sends SQL as text, and gets rows back.",
    },
    {
      kind: 'text',
      text: "Each language has a library for this, called a **driver**. This lesson uses `pg` for Node.js and `psycopg` for Python. App code needs a real server, so those examples are copy-only. The SQL that the apps send runs in your browser as usual. You will also learn the most important security rule for database code: how to stop **SQL injection**.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Connection strings',
    },
    {
      kind: 'text',
      text: "To connect, an app needs five things: the address of the server (the **host**), the **port**, the name of the database, a user name and a password. A **connection string** puts them all in one line:",
    },
    {
      kind: 'example',
      label: 'connection string',
      lang: 'text',
      run: 'none',
      code: `postgresql://shop_app:change-me@localhost:5432/shop`,
    },
    {
      kind: 'table',
      head: ['Part', 'Here', 'What it is'],
      rows: [
        ['User', '`shop_app`', 'The role to log in as'],
        ['Password', '`change-me`', 'The password of that role'],
        ['Host', '`localhost`', 'The computer that runs PostgreSQL. `localhost` means this computer'],
        ['Port', '`5432`', 'The network port. 5432 is the default for PostgreSQL'],
        ['Database', '`shop`', 'The database to use'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Keep passwords out of your code',
      blocks: [
        {
          kind: 'text',
          text: "Never write a real password in your code, and never save it in Git. Put the connection string in an **environment variable**, usually called `DATABASE_URL`, and read it when the app starts. Servers in the cloud often need `?sslmode=require` at the end of the string, so that the connection is encrypted.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Queries from Node.js and Python',
    },
    {
      kind: 'text',
      text: "**Node.js.** Install the driver with `npm install pg`. Then create one **pool** for the whole app. A pool keeps a few connections open and reuses them, because opening a new connection for every query is slow. `pool.query` borrows a connection, runs one statement, and gives the connection back.",
    },
    {
      kind: 'example',
      label: 'products.js',
      lang: 'javascript',
      run: 'none',
      code: `import pg from 'pg';

// One pool for the whole app, made from the DATABASE_URL environment variable
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// $1 is a placeholder. Its value comes separately, in the array.
const maxPrice = 20;
const { rows } = await pool.query(
  'SELECT name, price FROM products WHERE price < $1 ORDER BY price',
  [maxPrice]
);

for (const product of rows) {
  console.log(product.name, product.price);
}

await pool.end(); // close the pool when the program ends`,
      output: `Yo-yo 4.99
Coffee Mug 9.50
Puzzle 1000 Pieces 15.75
The Little Cookbook 18.50
Wireless Mouse 19.99`,
    },
    {
      kind: 'text',
      text: "`$1` is a **placeholder**: a numbered gap in the SQL. The values come in a separate array. `$1` gets the first value, `$2` the second, and so on. The driver sends the SQL and the values to PostgreSQL separately. This is called a **parameterised query**, and you will see below why it matters so much. (`pg` returns `numeric` values as strings, like `'4.99'`, so that no cents are lost.)",
    },
    {
      kind: 'text',
      text: "A transaction needs all of its statements on the **same** connection. So for a transaction, you borrow a client from the pool with `pool.connect()`, and you give it back with `client.release()` when you are done, even if something failed. This code places an order: it takes the items out of stock, creates the order and adds the order item.",
    },
    {
      kind: 'example',
      label: 'place-order.js',
      lang: 'javascript',
      run: 'none',
      code: `async function placeOrder(customerId, productId, quantity) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [quantity, productId]
    );
    const { rows } = await client.query(
      "INSERT INTO orders (customer_id, ordered_on, status) VALUES ($1, current_date, 'pending') RETURNING id",
      [customerId]
    );
    await client.query(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) SELECT $1, id, $2, price FROM products WHERE id = $3',
      [rows[0].id, quantity, productId]
    );
    await client.query('COMMIT');
    return rows[0].id;
  } catch (err) {
    await client.query('ROLLBACK'); // undo everything
    throw err;
  } finally {
    client.release(); // always give the client back
  }
}`,
    },
    {
      kind: 'text',
      text: "Here is the SQL that `placeOrder(11, 4, 2)` sends: Kofi (customer 11) buys 2 wireless mice (product 4). Run it to see the new order.",
    },
    {
      kind: 'example',
      label: 'place-order.sql',
      code: `BEGIN;
UPDATE products SET stock = stock - 2 WHERE id = 4;
INSERT INTO orders (customer_id, ordered_on, status)
VALUES (11, current_date, 'pending')
RETURNING id;
-- 17 is the id that RETURNING gave back
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT 17, id, 2, price FROM products WHERE id = 4;
COMMIT;

SELECT o.id AS order_id, o.status, i.quantity, i.unit_price, p.stock
FROM orders AS o
JOIN order_items AS i ON i.order_id = o.id
JOIN products AS p ON p.id = i.product_id
WHERE o.id = 17;`,
    },
    {
      kind: 'text',
      text: "The new order 17 is pending, with 2 mice at 19.99 each, and the stock of mice went down from 80 to 78. If any statement had failed, the `ROLLBACK` in the JavaScript would have undone all of it.",
    },
    {
      kind: 'text',
      text: "**Python.** In Python, the most popular driver is **psycopg** (version 3). Install it with `pip install \"psycopg[binary]\"`. The placeholder in psycopg is `%s`, for every type of value, and the values come in a tuple.",
    },
    {
      kind: 'example',
      label: 'customers.py',
      lang: 'python',
      run: 'none',
      code: `import os
import psycopg

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        # %s is the placeholder. The values come in a tuple.
        cur.execute(
            "SELECT first_name, city FROM customers WHERE country = %s ORDER BY first_name",
            ("UK",),
        )
        for first_name, city in cur.fetchall():
            print(first_name, city)`,
      output: `Ben London
George London`,
    },
    {
      kind: 'text',
      text: "Note the comma in `(\"UK\",)`: it makes a tuple with one item. Do not mix up this `%s` with Python's own `%` formatting for strings. You pass the values to `execute`, and you never build the SQL string yourself. When the `with psycopg.connect(...)` block ends, psycopg commits the transaction, or rolls it back if there was an error.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'SQL injection',
    },
    {
      kind: 'text',
      text: "**SQL injection** is one of the most common and most dangerous security holes in apps. It happens when an app builds SQL by gluing a user's text into the SQL string. Then a user can type SQL instead of data, and the database runs it. Here is a login-style search that glues the email into the SQL:",
    },
    {
      kind: 'example',
      label: 'find-customer.js',
      lang: 'javascript',
      run: 'none',
      verdict: 'bad',
      code: `// DANGER: the user's text becomes part of the SQL
const email = request.query.email;
const sql = "SELECT id, first_name, email FROM customers WHERE email = '" + email + "'";
const { rows } = await pool.query(sql);`,
    },
    {
      kind: 'text',
      text: "With a normal email, this works. Now someone types this into the email box: `' OR '1' = '1`. The first quote closes the string in the SQL, and the rest becomes SQL. This is the query the app builds:",
    },
    {
      kind: 'example',
      label: 'injected.sql',
      code: `-- The input was:  ' OR '1' = '1
SELECT id, first_name, email FROM customers WHERE email = '' OR '1' = '1';`,
    },
    {
      kind: 'text',
      text: "`'1' = '1'` is always true, so the query returns all 12 customers with their email addresses. A worse input ends the query and starts a new one. Here `;` ends the first statement, `DROP TABLE` runs, and `--` turns the rest of the line into a comment:",
    },
    {
      kind: 'example',
      label: 'injected-drop.sql',
      expectError: true,
      code: `-- The input was:  '; DROP TABLE order_items; --
SELECT id, first_name FROM customers WHERE email = ''; DROP TABLE order_items; --';

-- Is the table still there?
SELECT count(*) FROM order_items;`,
    },
    {
      kind: 'text',
      text: "The last query fails with `relation \"order_items\" does not exist`. The attacker deleted the table, and every order lost its items. The fix is simple: use a placeholder, and pass the email as a value.",
    },
    {
      kind: 'example',
      label: 'find-customer.js',
      lang: 'javascript',
      run: 'none',
      verdict: 'good',
      code: `// SAFE: the SQL and the value travel separately
const email = request.query.email;
const { rows } = await pool.query(
  'SELECT id, first_name, email FROM customers WHERE email = $1',
  [email]
);`,
    },
    {
      kind: 'text',
      text: "With a placeholder, PostgreSQL reads the SQL with its gap first, and only then gets the value. Whatever the user types can only ever be a value, never SQL. You can see this in SQL itself: `PREPARE` makes a statement with placeholders, and `EXECUTE` runs it with values.",
    },
    {
      kind: 'example',
      label: 'placeholders.sql',
      code: `PREPARE find_customer (text) AS
  SELECT id, first_name, email FROM customers WHERE email = $1;

EXECUTE find_customer('ben.carter@example.com');

-- The attack is now just a strange email address
EXECUTE find_customer(''' OR ''1'' = ''1');`,
    },
    {
      kind: 'text',
      text: "Inside an SQL string, two single quotes `''` stand for one quote, so the second `EXECUTE` looks for a customer whose email is `' OR '1' = '1`. There is no such customer, so it returns no rows. The attack does nothing.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Always use placeholders',
      blocks: [
        {
          kind: 'text',
          text: "Never build SQL from user input with `+`, template strings or f-strings. Use a placeholder for every value: `$1` in `pg`, `%s` in psycopg. Placeholders work for values only, not for the names of tables or columns. If a name must change, pick it from a fixed list in your code. Also connect with a role that has only the privileges it needs, so a mistake cannot drop a table.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Pools, migrations and ORMs',
    },
    {
      kind: 'text',
      text: "**Pools.** Open one pool when the app starts, and use it for every request. Do not open a new connection per request. In `pg`, `new pg.Pool({ max: 10 })` keeps at most 10 connections. In Python, the package `psycopg_pool` gives you a pool for psycopg.",
    },
    {
      kind: 'text',
      text: "**Migrations.** Your tables change as the app grows: a new table, a new column, a new index. A **migration** is a file with the SQL for one change. The files are numbered and kept in version control (Git) together with the app's code. A migration tool runs the new files in order on every database: your laptop, the test server and the live server. It remembers which files have already run, in a table of its own. Two popular tools are **node-pg-migrate** for Node.js and **Flyway**, which runs plain SQL files and works with any language.",
    },
    {
      kind: 'example',
      label: 'migrations folder',
      lang: 'text',
      run: 'none',
      code: `migrations/
  V1__create_shop_tables.sql
  V2__add_reviews.sql
  V3__index_orders_customer_id.sql`,
    },
    {
      kind: 'text',
      text: "This is the second file, the one that adds product reviews. It is plain SQL, so you can run it here:",
    },
    {
      kind: 'example',
      label: 'V2__add_reviews.sql',
      code: `CREATE TABLE reviews (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products (id),
  stars      integer NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment    text,
  created_on date NOT NULL DEFAULT current_date
);

CREATE INDEX reviews_product_id_idx ON reviews (product_id);`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Never edit a migration that has run',
      blocks: [
        {
          kind: 'text',
          text: "When a migration has run on the live server, do not change its file. The tool will not run it again, so the live database and your laptop would no longer match. Write a new migration for every new change.",
        },
      ],
    },
    {
      kind: 'text',
      text: "**ORMs.** An ORM (object-relational mapper) lets you work with tables as classes and objects in your language, and it writes the SQL for you. Examples are Prisma, TypeORM, Sequelize and Drizzle for Node.js, and SQLAlchemy and the Django ORM for Python. ORMs save typing, and they use placeholders for you. But they can hide slow queries, such as the N+1 problem. So it still pays to know SQL: turn on the ORM's query log and read the SQL it sends.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the products of one category with `pg`. Fill in the placeholder.',
        code: `const { rows } = await pool.query(
  'SELECT name, price FROM products WHERE category_id = [___]',
  [categoryId]
);`,
        answers: [['$1']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the orders of one customer with psycopg. Fill in the placeholder.',
        code: `cur.execute(
    "SELECT id, status FROM orders WHERE customer_id = [___]",
    (customer_id,),
)`,
        answers: [['%s']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which line is safe from SQL injection?',
        options: [
          "`pool.query('SELECT * FROM customers WHERE email = $1', [email])`",
          "`pool.query(\"SELECT * FROM customers WHERE email = '\" + email + \"'\")`",
          "`pool.query(\"SELECT * FROM customers WHERE email = '\" + email.trim() + \"'\")`",
          "`pool.query('SELECT * FROM customers WHERE email = ' + email)`",
        ],
        answer: "`pool.query('SELECT * FROM customers WHERE email = $1', [email])`",
      },
    },
  ],
};
