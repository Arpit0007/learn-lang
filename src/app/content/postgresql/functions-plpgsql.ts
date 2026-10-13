import { Lesson } from '../../shared/content';

export const FUNCTIONS_PLPGSQL: Lesson = {
  slug: 'functions-plpgsql',
  title: 'Writing Functions',
  nav: 'Writing functions',
  blocks: [
    {
      kind: 'text',
      text: "When you write the same query again and again, you can save it as a **function**. A function has a name, takes input values called **parameters**, and **returns** a result. You use it like the built-in functions, such as `upper()` or `round()`.",
    },
    {
      kind: 'text',
      text: "You can write a function in plain SQL. When you need variables, `IF` or loops, you write it in **PL/pgSQL**, the programming language that comes with PostgreSQL. This lesson shows both, and **procedures** too.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'A function in plain SQL',
    },
    {
      kind: 'text',
      text: "The function below works out the total cost of one order. Read it from the top:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`order_total(p_order_id integer)` is the name, with one parameter of type `integer`. We start parameter names with `p_`, so they don't get mixed up with column names.",
        "`RETURNS numeric` is the type of the answer.",
        "`LANGUAGE sql` says that the body is plain SQL.",
        "`AS $$ ... $$` is the body. The two `$$` work like quotes around it, so the body can contain `'` quotes without any trouble.",
      ],
    },
    {
      kind: 'example',
      label: 'order-total.sql',
      code: `CREATE FUNCTION order_total(p_order_id integer)
RETURNS numeric
LANGUAGE sql
AS $$
  SELECT sum(quantity * unit_price)
  FROM order_items
  WHERE order_id = p_order_id;
$$;

SELECT id,
       ordered_on,
       order_total(id) AS total
FROM orders
WHERE customer_id = 1
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "`CREATE FUNCTION` saves the function in the database. After that, `order_total(id)` works like any other function. Aisha's three orders cost 43.99, 129.00 and 63.50.",
    },
    {
      kind: 'text',
      text: "A function can also return **many rows**. Write `RETURNS TABLE (...)` with the name and type of each column. Then use the function in `FROM`, just like a table.",
    },
    {
      kind: 'example',
      label: 'returns-table.sql',
      code: `CREATE FUNCTION products_in(p_category text)
RETURNS TABLE (product text, price numeric)
LANGUAGE sql
AS $$
  SELECT p.name, p.price
  FROM products AS p
  JOIN categories AS c ON c.id = p.category_id
  WHERE c.name = p_category;
$$;

SELECT *
FROM products_in('Toys')
ORDER BY price;`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Changing a function',
      blocks: [
        {
          kind: 'text',
          text: "If you run the same `CREATE FUNCTION` twice, the second time fails: \"function already exists with same argument types\". To change a function that already exists, write `CREATE OR REPLACE FUNCTION`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'PL/pgSQL: variables, IF and loops',
    },
    {
      kind: 'text',
      text: "A PL/pgSQL body has two parts. After `DECLARE` come the **variables**: named boxes that hold a value while the code runs. Between `BEGIN` and `END` come the steps. `SELECT ... INTO` puts the result of a query into a variable. `IF ... THEN ... ELSIF ... ELSE ... END IF` chooses what to do.",
    },
    {
      kind: 'example',
      label: 'stock-label.sql',
      code: `CREATE FUNCTION stock_label(p_product_id integer)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_stock integer;
BEGIN
  SELECT stock INTO v_stock
  FROM products
  WHERE id = p_product_id;

  IF v_stock = 0 THEN
    RETURN 'sold out';
  ELSIF v_stock < 20 THEN
    RETURN 'only a few left';
  ELSE
    RETURN 'in stock';
  END IF;
END;
$$;

SELECT name,
       stock,
       stock_label(id) AS label
FROM products
WHERE category_id = 2
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The Bluetooth Speaker has 0 in stock, so it is \"sold out\". The headphones have 15, which is fewer than 20, so they get \"only a few left\". The `v_` at the start of `v_stock` shows that it is a variable.",
    },
    {
      kind: 'text',
      text: "A `DO` block runs PL/pgSQL code **once**, without saving a function. `FOR r IN (a query) LOOP ... END LOOP` runs the steps once for each row of the query, with the row in the variable `r`. `RAISE NOTICE` prints a message, and each `%` in it is replaced by the next value.",
    },
    {
      kind: 'example',
      label: 'loop.sql',
      code: `DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT name, stock
    FROM products
    WHERE stock < 20
    ORDER BY stock
  LOOP
    RAISE NOTICE '% has only % left', r.name, r.stock;
  END LOOP;
END;
$$;`,
    },
    {
      kind: 'text',
      text: "Four products have fewer than 20 in stock, so you see four messages. The type `record` means \"a row of any shape\". `RAISE NOTICE` is also a handy way to see what your code is doing, step by step.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Procedures and CALL',
    },
    {
      kind: 'text',
      text: "A **procedure** is like a function that **does a job** instead of working out an answer. You create it with `CREATE PROCEDURE`, and you run it on its own with `CALL`, not inside a `SELECT`.",
    },
    {
      kind: 'example',
      label: 'procedure.sql',
      code: `CREATE PROCEDURE restock(p_product_id integer, p_amount integer)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products
  SET stock = stock + p_amount
  WHERE id = p_product_id;

  RAISE NOTICE 'Added % to product %', p_amount, p_product_id;
END;
$$;

CALL restock(6, 25);

SELECT id, name, stock
FROM products
WHERE id = 6;`,
    },
    {
      kind: 'text',
      text: "The Bluetooth Speaker had 0 in stock and now has 25. If you write `SELECT restock(6, 25)`, PostgreSQL stops with an error and the hint \"To call a procedure, use CALL\".",
    },
    {
      kind: 'table',
      head: ['', 'Function', 'Procedure'],
      rows: [
        ['Main job', 'Work out a value and return it', 'Do a job, such as changing rows'],
        ['How you run it', 'Inside a query: `SELECT order_total(1);`', 'On its own: `CALL restock(6, 25);`'],
        ['`COMMIT` or `ROLLBACK` in its body', 'Not allowed', 'Allowed'],
      ],
    },
    {
      kind: 'text',
      text: "You can also tell PostgreSQL how a function behaves, so it can plan queries better. Write one of these three words after `LANGUAGE`:",
    },
    {
      kind: 'table',
      head: ['Word', 'Meaning', 'Built-in examples'],
      rows: [
        ['`IMMUTABLE`', 'The same inputs always give the same result. It never reads a table.', '`upper()`, `round()`'],
        ['`STABLE`', 'The result can change between queries, but not during one query. It may read tables, but never changes them.', '`now()`'],
        ['`VOLATILE`', 'It may change data, or give a new result every time. This is the default.', '`random()`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Start simple',
      blocks: [
        {
          kind: 'text',
          text: "Use `LANGUAGE sql` when one query does the job. Switch to PL/pgSQL only when you need variables, `IF` or loops. If you are not sure whether a function is `IMMUTABLE` or `STABLE`, leave the default: a wrong label can give wrong results.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Write a function that doubles a number. Fill in the keyword before the return type, and the name of the language.',
        code: `CREATE FUNCTION double_it(p_n integer)
[___] integer
LANGUAGE [___]
AS $$
  SELECT p_n * 2;
$$;`,
        answers: [
          ['RETURNS', 'returns'],
          ['sql', 'SQL'],
        ],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'How do you run a procedure called `restock`?',
        options: [
          '`CALL restock(6, 25);`',
          '`SELECT restock(6, 25);`',
          '`RUN restock(6, 25);`',
          '`DO restock(6, 25);`',
        ],
        answer: '`CALL restock(6, 25);`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'A price with tax',
      blocks: [
        {
          kind: 'text',
          text: "Write a function `with_tax(p_price numeric)` that returns the price plus 20% tax, rounded to 2 decimal places. It never reads a table, so mark it `IMMUTABLE`. Then use it to show the books with and without tax.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'with-tax.sql',
              code: `CREATE FUNCTION with_tax(p_price numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT round(p_price * 1.20, 2);
$$;

SELECT name,
       price,
       with_tax(price) AS price_with_tax
FROM products
WHERE category_id = 1
ORDER BY id;`,
            },
            {
              kind: 'text',
              text: "*Learn SQL in 10 Days* costs 24.99, or 29.99 with tax. Multiplying by 1.20 adds 20%.",
            },
          ],
        },
      ],
    },
  ],
};
