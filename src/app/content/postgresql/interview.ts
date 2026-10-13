import { Lesson } from '../../shared/content';

export const INTERVIEW: Lesson = {
  slug: 'interview',
  title: 'Interview Questions',
  nav: 'Interview questions',
  blocks: [
    {
      kind: 'text',
      text: "This page collects 30 questions that interviewers often ask about SQL and PostgreSQL, from every part of this course. Try to answer each one out loud before you open it. Explaining something in your own words is the best test that you really understand it.",
    },
    {
      kind: 'text',
      text: "After the questions come five practical problems on the shop database. Write each query yourself first, and open the solution only after you have tried.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Querying',
    },
    {
      kind: 'reveal',
      tag: 'Q1',
      title: '`INNER JOIN` or `LEFT JOIN`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** An `INNER JOIN` keeps only the rows that have a match in both tables. A `LEFT JOIN` keeps every row of the left table, and fills the columns of the right table with `NULL` when there is no match. Use it when you must not lose rows, such as customers who never ordered, like Kofi and Lena below. Count `o.id`, not `*`, so that a customer with no orders gets 0.",
        },
        {
          kind: 'example',
          label: 'left-join.sql',
          code: `SELECT c.first_name, count(o.id) AS orders
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id, c.first_name
ORDER BY orders, c.first_name
LIMIT 4;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q2',
      title: 'Why does `WHERE city = NULL` find nothing?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** `NULL` means \"unknown\", and comparing anything with an unknown value gives unknown, not true. So `city = NULL` is never true, not even for the rows where `city` is `NULL`. Use `IS NULL` and `IS NOT NULL` instead.",
        },
        {
          kind: 'example',
          label: 'null.sql',
          code: `SELECT count(*) AS with_equals FROM customers WHERE city = NULL;

SELECT first_name, city FROM customers WHERE city IS NULL;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q3',
      title: '`WHERE` or `HAVING`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** `WHERE` filters rows **before** they are grouped, so it cannot use aggregates like `count(*)`. `HAVING` filters groups **after** `GROUP BY`, so it can. Here `WHERE` drops the cancelled orders, and `HAVING` keeps the customers who have at least 2 of the rest.",
        },
        {
          kind: 'example',
          label: 'where-having.sql',
          code: `SELECT customer_id, count(*) AS orders
FROM orders
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING count(*) >= 2
ORDER BY customer_id;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q4',
      title: '`UNION` or `UNION ALL`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Both put the rows of two queries together. `UNION` then removes duplicate rows, which costs extra work. `UNION ALL` keeps every row, so it is faster: use it unless you really need to remove duplicates. Below, `UNION` returns London once, and `UNION ALL` returns it twice.",
        },
        {
          kind: 'example',
          label: 'union.sql',
          code: `SELECT city FROM customers WHERE country = 'UK'
UNION
SELECT city FROM customers WHERE country = 'Italy'
ORDER BY city;

SELECT city FROM customers WHERE country = 'UK'
UNION ALL
SELECT city FROM customers WHERE country = 'Italy'
ORDER BY city;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q5',
      title: '`count(*)`, `count(column)` or `count(DISTINCT column)`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** `count(*)` counts rows. `count(city)` counts only the rows where `city` is not `NULL`. `count(DISTINCT city)` counts the different values, also without `NULL`. Two customers have no city and two live in London, so the counts are 12, 10 and 9.",
        },
        {
          kind: 'example',
          label: 'count.sql',
          code: `SELECT count(*) AS all_rows,
       count(city) AS with_city,
       count(DISTINCT city) AS cities
FROM customers;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q6',
      title: 'How do you find duplicate values?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Group by the column, and keep the groups with more than one row: `HAVING count(*) > 1`. This query finds the cities with more than one customer. (`GROUP BY` puts all the `NULL`s in one group, so they are filtered out first.) To stop duplicates for good, add a `UNIQUE` constraint.",
        },
        {
          kind: 'example',
          label: 'duplicates.sql',
          code: `SELECT city, count(*) AS customers
FROM customers
WHERE city IS NOT NULL
GROUP BY city
HAVING count(*) > 1;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q7',
      title: 'What is a CTE, and what is a recursive CTE for?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A CTE (common table expression) is a named subquery, written with `WITH` at the start of a query. It makes long queries easier to read, one step at a time. A **recursive** CTE refers to itself, so it can walk through a tree or a chain, such as the managers in `employees`. It starts with the CEO, then keeps adding the people who report to the rows it already has.",
        },
        {
          kind: 'example',
          label: 'recursive-cte.sql',
          code: `WITH RECURSIVE chain AS (
  SELECT id, name, 1 AS level
  FROM employees
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, c.level + 1
  FROM employees AS e
  JOIN chain AS c ON e.manager_id = c.id
)
SELECT name, level FROM chain ORDER BY level, name;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q8',
      title: 'What is a window function?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A window function calculates over a group of rows, like an aggregate. But it does not merge the rows: every row stays in the result and gets its own value. You write it with `OVER (...)`, and `PARTITION BY` sets the groups. With `GROUP BY`, each department would become one row. Here, every employee keeps a row and also sees the average salary of their department.",
        },
        {
          kind: 'example',
          label: 'window.sql',
          code: `SELECT name, department, salary,
       round(avg(salary) OVER (PARTITION BY department)) AS dept_average
FROM employees
ORDER BY department, salary DESC;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q9',
      title: '`row_number()`, `rank()` or `dense_rank()`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** All three number the rows in the order you choose. `row_number()` always counts 1, 2, 3, even when values tie. `rank()` gives tied rows the same number and then skips numbers: 1, 2, 2, 2, 2, 6. `dense_rank()` gives ties the same number without gaps: 1, 2, 2, 2, 2, 3.",
        },
        {
          kind: 'example',
          label: 'ranking.sql',
          code: `SELECT customer_id, count(*) AS orders,
       row_number() OVER (ORDER BY count(*) DESC, customer_id) AS row_number,
       rank()       OVER (ORDER BY count(*) DESC) AS rank,
       dense_rank() OVER (ORDER BY count(*) DESC) AS dense_rank
FROM orders
GROUP BY customer_id
ORDER BY orders DESC, customer_id
LIMIT 6;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q10',
      title: 'How do you get the top row of each group?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Number the rows inside each group with `row_number() OVER (PARTITION BY ... ORDER BY ...)` in a CTE, then keep the rows numbered 1. This query finds the most expensive product in each category. PostgreSQL also has a shortcut for this, `SELECT DISTINCT ON (...)`.",
        },
        {
          kind: 'example',
          label: 'top-per-group.sql',
          code: `WITH ranked AS (
  SELECT c.name AS category, p.name AS product, p.price,
         row_number() OVER (PARTITION BY c.id ORDER BY p.price DESC) AS n
  FROM products AS p
  JOIN categories AS c ON c.id = p.category_id
)
SELECT category, product, price
FROM ranked
WHERE n = 1
ORDER BY category;`,
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Table design',
    },
    {
      kind: 'reveal',
      tag: 'Q11',
      title: 'Primary key, foreign key or unique constraint?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A **primary key** identifies each row: it must be unique and not `NULL`, and a table has only one. A **unique** constraint also forbids duplicates, but a table can have many, and they allow `NULL`. A **foreign key** says that a value must exist in another table. So you cannot create an order for customer 99, who does not exist.",
        },
        {
          kind: 'example',
          label: 'foreign-key.sql',
          expectError: true,
          code: `INSERT INTO orders (customer_id, ordered_on, status)
VALUES (99, '2025-10-01', 'pending');`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q12',
      title: 'What is normalization?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Normalization means designing tables so that each fact is stored in one place only. A customer's email is stored once in `customers`, not again in every order, so the copies can never disagree. The usual goal is the third normal form (3NF): every column is a fact about the key of its own table, and about nothing else. Teams sometimes **denormalize** on purpose, copying data to make reads faster, and then they must keep the copies in sync. (`order_items.unit_price` is not a copy of `products.price`: it records the price on the day of the sale, which is a different fact.)",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q13',
      title: 'View or materialized view?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A view is a saved query. It stores no data and runs its query every time you read it, so it is always up to date. A materialized view stores the result like a table: reading it is fast, but the data gets old until you run `REFRESH MATERIALIZED VIEW`. Use one for slow reports that may be a little out of date.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q14',
      title: '`char`, `varchar(n)` or `text`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** In PostgreSQL, `text` and `varchar` are stored the same way and are equally fast. `varchar(n)` adds a length limit, but a `CHECK` constraint does the same job and is easier to change later. Avoid `char(n)`, which pads short values with spaces. Most PostgreSQL developers simply use `text`.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q15',
      title: '`serial` or an identity column?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Both give new rows the next number automatically. `serial` is an old PostgreSQL shortcut that creates a sequence and a default value. `GENERATED ... AS IDENTITY` is the SQL standard way, and its sequence belongs to the column, so permissions and copies of the table behave as you expect. Use identity columns in new tables, as the shop's tables do.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q16',
      title: 'When is `jsonb` better than normal columns?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Use normal columns for data that every row has and that you filter, join or check with constraints: names, prices, dates. Use `jsonb` for data whose shape changes from row to row, such as extra product details or data from another system. Choose `jsonb` over `json`: `jsonb` is stored in a parsed form, it is faster to search, and it can use GIN indexes. `json` keeps the text exactly as it came, even duplicate keys.",
        },
        {
          kind: 'example',
          label: 'jsonb.sql',
          code: `SELECT '{"color": "red", "size": 42}'::jsonb ->> 'color' AS color,
       '{"a": 1, "a": 2}'::json  AS as_json,
       '{"a": 1, "a": 2}'::jsonb AS as_jsonb;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q17',
      title: '`DELETE`, `TRUNCATE` or `DROP TABLE`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** `DELETE` removes the rows that match a `WHERE`, one by one, and leaves dead rows for `VACUUM`. `TRUNCATE` empties the whole table at once, which is much faster on big tables, but it has no `WHERE`. `DROP TABLE` removes the table itself, structure and all. In PostgreSQL, all three can be undone with `ROLLBACK` inside a transaction.",
        },
        {
          kind: 'example',
          label: 'truncate.sql',
          code: `BEGIN;
TRUNCATE order_items;
SELECT count(*) FROM order_items;
ROLLBACK;

SELECT count(*) FROM order_items;`,
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Transactions',
    },
    {
      kind: 'reveal',
      tag: 'Q18',
      title: 'What is a transaction, and what does ACID mean?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A transaction is a group of statements that succeed or fail together, between `BEGIN` and `COMMIT`. If something goes wrong, `ROLLBACK` undoes the whole group. ACID names its four promises: **atomic** (all or nothing), **consistent** (the constraints always hold), **isolated** (transactions do not see each other's unfinished work) and **durable** (after `COMMIT`, the data survives a crash).",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q19',
      title: 'What are the isolation levels?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** `READ COMMITTED` is the default: each statement sees the data that was committed before the statement started. `REPEATABLE READ` gives the whole transaction one snapshot, so reading the same rows twice gives the same answer. `SERIALIZABLE` is the strictest: the result must be the same as if the transactions ran one after another. When that is not possible, PostgreSQL cancels one of them with a serialization error, and the app must retry it. `READ UNCOMMITTED` exists too, but PostgreSQL treats it as `READ COMMITTED`.",
        },
        {
          kind: 'example',
          label: 'isolation.sql',
          code: `BEGIN ISOLATION LEVEL REPEATABLE READ;
SHOW transaction_isolation;
COMMIT;

SHOW transaction_isolation;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q20',
      title: 'What is MVCC?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** MVCC (multi-version concurrency control) is how PostgreSQL lets many people work at the same time. An `UPDATE` writes a new version of the row instead of changing it in place, and each transaction sees the versions that fit its own snapshot. So readers never block writers, and writers never block readers. The price is dead row versions, which `VACUUM` cleans up.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q21',
      title: 'What is a deadlock?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A deadlock happens when two transactions each hold a lock that the other one needs. Transaction A locks row 1 and waits for row 2, while B locks row 2 and waits for row 1, so neither can go on. PostgreSQL finds this after about a second and cancels one of them with an error. Avoid deadlocks by locking rows in the same order everywhere (for example by `id`) and by keeping transactions short, and let the app retry the cancelled transaction.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q22',
      title: 'How do you stop two people from buying the last item?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Do the check and the change in one statement: `UPDATE ... WHERE id = ... AND stock > 0`. PostgreSQL locks the row while it updates it, so a second buyer waits, then sees the new stock and changes nothing. `RETURNING` (or the number of changed rows) tells the app whether the sale worked. Here the headphones sell, but the speaker, with 0 in stock, does not.",
        },
        {
          kind: 'example',
          label: 'last-item.sql',
          code: `-- Headphones (id 7): 15 in stock
UPDATE products SET stock = stock - 1
WHERE id = 7 AND stock > 0
RETURNING id, name, stock;

-- Bluetooth Speaker (id 6): 0 in stock
UPDATE products SET stock = stock - 1
WHERE id = 6 AND stock > 0
RETURNING id, name, stock;`,
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Performance and operations',
    },
    {
      kind: 'reveal',
      tag: 'Q23',
      title: 'What is an index, and when should you not add one?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** An index is a sorted structure that lets PostgreSQL find rows without reading the whole table, like the index at the back of a book. It speeds up `WHERE`, `JOIN` and `ORDER BY` on its columns. But every index makes `INSERT`, `UPDATE` and `DELETE` slower and uses space, so do not add indexes that no query needs. Tiny tables, and columns with only a few different values, rarely gain from one.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q24',
      title: 'Which index types does PostgreSQL have?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** **B-tree** is the default, and it fits most cases: `=`, `<`, `>`, `BETWEEN` and sorting. **GIN** is for values with many parts: `jsonb`, arrays and full text search. **GiST** is for shapes, ranges and \"nearest\" searches, such as maps with PostGIS. **BRIN** is a tiny index for huge tables whose rows are stored in order, like logs by time, and **Hash** supports only `=`.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q25',
      title: '`EXPLAIN` or `EXPLAIN ANALYZE`?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** `EXPLAIN` shows the plan that PostgreSQL would use, with estimated costs and row counts, but it does not run the query. `EXPLAIN ANALYZE` runs it and adds the real time and the real row counts of each step. Here PostgreSQL guesses 293 rows, but there are really 5, because nobody has run `ANALYZE` on this table: big differences like this point to missing or old statistics. Remember that `EXPLAIN ANALYZE` really runs an `UPDATE` or `DELETE`.",
        },
        {
          kind: 'example',
          label: 'explain.sql',
          code: `EXPLAIN SELECT * FROM products WHERE price > 30;

EXPLAIN ANALYZE SELECT * FROM products WHERE price > 30;`,
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q26',
      title: 'What do `VACUUM` and autovacuum do?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** Because of MVCC, updates and deletes leave dead row versions behind. `VACUUM` finds them and marks their space as free for new rows. `VACUUM FULL` also gives the space back to the disk, but it locks the table while it works. `VACUUM` also prevents transaction ID wraparound, a problem that old, busy databases can hit. **Autovacuum** runs `VACUUM` and `ANALYZE` for you when enough rows have changed, so leave it on.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q27',
      title: 'What is SQL injection, and how do you prevent it?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** SQL injection is an attack where text from a user is glued into an SQL string and changes what the SQL does. For example, it can read every customer or drop a table. Prevent it with parameterised queries: placeholders like `$1` or `%s`, which send the SQL and the values separately. Also connect with a role that has only the privileges it needs, so that a successful attack can do less damage.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q28',
      title: 'Functions, procedures and triggers: what are they?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A **function** returns a value and is used inside queries, like `SELECT my_function(price)`. A **procedure** is run with `CALL`, and it can `COMMIT` inside itself, so it can split a long job into several transactions. A **trigger** runs a function automatically when rows are inserted, updated or deleted. Triggers are good for audit logs and `updated_at` columns, but keep the main business rules in code that people can see, because triggers run silently and slow down big changes.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q29',
      title: 'What is least privilege, and what is row-level security?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** The principle of least privilege means that every role gets only the privileges it needs. The app's role can read and write orders, but it cannot drop tables, so a stolen password or a bug can do less damage. Row-level security goes further: it limits the **rows** a role can see, with a policy such as `customer_id = current_setting('app.customer_id')::integer`. It is common in apps where many customers or companies share the same tables.",
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Q30',
      title: 'Backups, replicas and partitions: what is each for?',
      blocks: [
        {
          kind: 'text',
          text: "**Answer.** A **backup** is a saved copy of the data, kept away from the server. With point-in-time recovery, it can bring the data back to the moment before a mistake. A **replica** is a live copy on another server: it keeps the shop open when the primary breaks and can take some of the reads, but it copies mistakes too. **Partitions** split one huge table into smaller tables on the same server, to make queries and clean-up faster. They solve different problems, so big systems often use all three.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Practical problems',
    },
    {
      kind: 'text',
      text: "Use this box to write and run your own queries: press **Edit**, change the SQL, then press **Run**. Every run starts from the fresh shop database.",
    },
    {
      kind: 'example',
      label: 'scratchpad.sql',
      code: `-- Write your query here, then press Run
SELECT * FROM orders ORDER BY id LIMIT 5;`,
    },
    {
      kind: 'reveal',
      tag: 'Problem 1',
      title: 'Spending per customer',
      blocks: [
        {
          kind: 'text',
          text: "For each customer with at least one **delivered** order, show the full name and how much they spent on delivered orders (quantity times unit price). Put the biggest spender first.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'problem-1.sql',
              code: `SELECT c.first_name || ' ' || c.last_name AS customer,
       sum(i.quantity * i.unit_price) AS spent
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id
JOIN order_items AS i ON i.order_id = o.id
WHERE o.status = 'delivered'
GROUP BY c.id
ORDER BY spent DESC;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "Join the three tables, keep only the delivered orders with `WHERE`, then group by customer. `GROUP BY c.id` is enough: `id` is the primary key, so PostgreSQL knows that each id has only one name. Aisha spent the most, 236.49.",
            },
          ],
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Problem 2',
      title: 'Products nobody ordered',
      blocks: [
        {
          kind: 'text',
          text: "List the products that do not appear in any order at all.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'problem-2.sql',
              code: `SELECT p.id, p.name
FROM products AS p
WHERE NOT EXISTS (
  SELECT 1 FROM order_items AS i WHERE i.product_id = p.id
)
ORDER BY p.id;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "`NOT EXISTS` keeps a product when the subquery finds no order item for it. A `LEFT JOIN` with `WHERE i.product_id IS NULL` gives the same answer. Be careful with `NOT IN (subquery)`: if the subquery returns a `NULL`, `NOT IN` returns no rows at all.",
            },
          ],
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Problem 3',
      title: 'Monthly revenue with a running total',
      blocks: [
        {
          kind: 'text',
          text: "Show the revenue of each month, counting all orders except the cancelled ones. Add a running total: the revenue of that month plus all the months before it.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'problem-3.sql',
              code: `WITH monthly AS (
  SELECT to_char(o.ordered_on, 'YYYY-MM') AS month,
         sum(i.quantity * i.unit_price) AS revenue
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.id
  WHERE o.status <> 'cancelled'
  GROUP BY 1
)
SELECT month, revenue,
       sum(revenue) OVER (ORDER BY month) AS running_total
FROM monthly
ORDER BY month;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "The CTE adds up the revenue of each month. Then `sum(revenue) OVER (ORDER BY month)` adds up the months from the first one to the current one. By September 2025, the running total is 999.64.",
            },
          ],
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Problem 4',
      title: 'The best seller in each category',
      blocks: [
        {
          kind: 'text',
          text: "For each category, find the product that sold the most units, not counting cancelled orders. If two products tie, show both.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'problem-4.sql',
              code: `WITH sold AS (
  SELECT c.name AS category, p.name AS product, sum(i.quantity) AS units
  FROM order_items AS i
  JOIN orders AS o ON o.id = i.order_id
  JOIN products AS p ON p.id = i.product_id
  JOIN categories AS c ON c.id = p.category_id
  WHERE o.status <> 'cancelled'
  GROUP BY c.name, p.name
),
ranked AS (
  SELECT category, product, units,
         rank() OVER (PARTITION BY category ORDER BY units DESC) AS place
  FROM sold
)
SELECT category, product, units
FROM ranked
WHERE place = 1
ORDER BY category, product;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "`rank()` gives tied products the same place, so both books with 4 units are shown. With `row_number()`, one of the two books would be left out.",
            },
          ],
        },
      ],
    },
    {
      kind: 'reveal',
      tag: 'Problem 5',
      title: 'Above the department average',
      blocks: [
        {
          kind: 'text',
          text: "Find the employees who earn more than the average salary of their own department. Show the department average next to each salary.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'problem-5.sql',
              code: `SELECT name, department, salary, dept_average
FROM (
  SELECT name, department, salary,
         round(avg(salary) OVER (PARTITION BY department)) AS dept_average
  FROM employees
) AS e
WHERE salary > dept_average
ORDER BY department, salary DESC;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "You cannot use a window function in `WHERE`, because `WHERE` runs before the window functions. So the subquery calculates the average first, and the outer query filters on it. Maria and Lucas are alone in their departments, so their salary is exactly the average, not above it.",
            },
          ],
        },
      ],
    },
  ],
};
