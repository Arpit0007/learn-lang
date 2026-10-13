import { Lesson } from '../../shared/content';

export const UPDATE_DELETE: Lesson = {
  slug: 'update-delete',
  title: 'UPDATE and DELETE',
  nav: 'UPDATE & DELETE',
  blocks: [
    {
      kind: 'text',
      text: "`UPDATE` changes values in rows that are already in a table. `DELETE` removes rows. Both use a `WHERE` clause, just like `SELECT`, to choose the rows they work on.",
    },
    {
      kind: 'text',
      text: "On a real database these commands change data for good, and there is no undo button. So this lesson also shows two habits that keep you safe.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Changing rows with UPDATE',
    },
    {
      kind: 'text',
      text: "Write `UPDATE` and the table, then `SET column = new value`, then a `WHERE` that chooses the rows. To change several columns, separate them with commas. A new value can use the old one: `stock = stock + 10` adds 10 to whatever is there now.",
    },
    {
      kind: 'example',
      label: 'update.sql',
      code: `UPDATE products
SET price = 22.99,
    stock = stock + 10
WHERE id = 1;

SELECT id, name, price, stock
FROM products
WHERE id = 1;`,
    },
    {
      kind: 'text',
      text: "`UPDATE · 1 row changed` tells you how many rows matched the `WHERE`. The book now costs `22.99`, and its stock went from 40 to `50`. The table's rules still apply. An `UPDATE` that would make a stock negative fails with `violates check constraint \"products_stock_check\"`, and nothing changes.",
    },
    {
      kind: 'text',
      text: "Sometimes the rows to change depend on another table. Say every product in the Toys category gets 20% off, but you only know the category's **name**. `UPDATE … FROM` lets you use another table. The condition that links the two tables goes in the `WHERE`. `RETURNING` at the end shows the changed rows right away:",
    },
    {
      kind: 'example',
      label: 'update-from.sql',
      code: `UPDATE products
SET price = price * 0.80
FROM categories
WHERE products.category_id = categories.id
  AND categories.name = 'Toys'
RETURNING products.id, products.name, products.price;`,
    },
    {
      kind: 'text',
      text: "Three toys are cheaper now. `39.99 * 0.80` is `31.992`, but `price` is `numeric(10, 2)`, so PostgreSQL rounds it to `31.99`. Both tables have columns called `id` and `name`, so we write `products.id` and `products.name` to say which table we mean.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Removing rows with DELETE',
    },
    {
      kind: 'text',
      text: "`DELETE FROM table WHERE …` removes the rows that match. `RETURNING` works here too, and shows the rows that were removed. Lena (customer 12) never placed an order, so she can be deleted:",
    },
    {
      kind: 'example',
      label: 'delete.sql',
      code: `DELETE FROM customers
WHERE id = 12
RETURNING id, first_name, email;

SELECT count(*) AS customers_left
FROM customers;`,
    },
    {
      kind: 'text',
      text: "Lena is gone, and 11 customers are left. Aisha (customer 1) is different, because she has orders. The `orders` table has a **foreign key**: a rule that every `orders.customer_id` must point to a real customer. Deleting Aisha would break that rule, so PostgreSQL refuses:",
    },
    {
      kind: 'example',
      label: 'delete-blocked.sql',
      expectError: true,
      code: `DELETE FROM customers
WHERE id = 1;`,
    },
    {
      kind: 'text',
      text: "The error says the delete `violates foreign key constraint \"orders_customer_id_fkey\" on table \"orders\"`. The `DETAIL` line explains why: `Key (id)=(1) is still referenced from table \"orders\"`. Nothing was deleted. This is the database protecting you. Without the rule, three orders would point to a customer who does not exist. To delete a row like this, first delete or change the rows that point to it. The Constraints lesson shows how `ON DELETE CASCADE` can do that for you.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The forgotten WHERE',
    },
    {
      kind: 'text',
      text: "The `WHERE` clause is optional. Without it, `UPDATE` and `DELETE` work on **every row** in the table. `UPDATE products SET price = 0` makes all 14 products free. It is an easy mistake to make: the `WHERE` line gets lost when you copy a query, or you run the query before you finish typing it.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'No WHERE means every row',
      blocks: [
        {
          kind: 'text',
          text: "`DELETE FROM order_items;` deletes every item of every order, and PostgreSQL does not ask \"Are you sure?\". Make these two habits automatic:",
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            "**Run the `SELECT` first.** Write the `WHERE`, and run it with `SELECT *`. The rows you see are exactly the rows that an `UPDATE` or `DELETE` with the same `WHERE` will change.",
            "**Use a transaction for risky changes.** `BEGIN` starts a **transaction**, a group of changes that are not final yet. Check the result line. If the number of rows is right, type `COMMIT` to keep the changes. If not, type `ROLLBACK` and everything since `BEGIN` is undone.",
          ],
        },
      ],
    },
    {
      kind: 'example',
      label: 'safe-delete.sql',
      code: `BEGIN;

DELETE FROM order_items;

SELECT count(*) AS items_left
FROM order_items;

ROLLBACK;

SELECT count(*) AS items_left
FROM order_items;`,
    },
    {
      kind: 'text',
      text: "Oops: this `DELETE` has no `WHERE`, and the result line says `DELETE · 26 rows deleted`. Inside the transaction, 0 items are left. But `ROLLBACK` throws the change away, and the last `SELECT` finds all 26 items again. If the change had been right, `COMMIT` would have made it final.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Emptying a table with TRUNCATE',
    },
    {
      kind: 'text',
      text: "To remove **all** rows from a table on purpose, use `TRUNCATE`. It does not remove the rows one by one, so on a big table it is much faster than `DELETE`. It has no `WHERE`, so it always empties the whole table.",
    },
    {
      kind: 'example',
      label: 'truncate.sql',
      code: `TRUNCATE order_items;

SELECT count(*) AS items_left
FROM order_items;`,
    },
    {
      kind: 'text',
      text: "Foreign keys can block `TRUNCATE` too. `TRUNCATE orders` fails with `cannot truncate a table referenced in a foreign key constraint`, because `order_items` points to `orders`. The `HINT` line suggests emptying both tables together: `TRUNCATE orders, order_items`. Use `TRUNCATE` for test data and temporary work tables, and be very careful with it anywhere else.",
    },
    {
      kind: 'table',
      head: ['Command', 'What it removes', 'Can it use WHERE?'],
      rows: [
        ['`DELETE FROM t WHERE …`', 'Only the rows that match', 'Yes'],
        ['`DELETE FROM t`', 'Every row, one by one', 'It has none, so all rows go'],
        ['`TRUNCATE t`', 'Every row at once, fast', 'No'],
        ['`DROP TABLE t`', 'The whole table: its rows **and** its columns', 'No'],
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Fatima (customer 6) has moved to Casablanca. Fill in the two missing keywords.",
        code: `UPDATE customers
[___] city = 'Casablanca'
[___] id = 6;`,
        answers: [['SET', 'set'], ['WHERE', 'where']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What does `DELETE FROM order_items;` do?',
        options: [
          'It deletes every row in `order_items`',
          'It deletes the `order_items` table itself',
          'Nothing, because there is no `WHERE`',
          'It asks which rows to delete',
        ],
        answer: 'It deletes every row in `order_items`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Remove a cancelled order',
      blocks: [
        {
          kind: 'text',
          text: "Order 6 was cancelled. Delete it completely. Its item in `order_items` points to it, so the order cannot go first. Delete the items of order 6, then the order itself, and then count the orders that are left.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'delete-order.sql',
              code: `DELETE FROM order_items
WHERE order_id = 6;

DELETE FROM orders
WHERE id = 6
RETURNING id, customer_id, status;

SELECT count(*) AS orders_left
FROM orders;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "Order 6 had one item, so the first `DELETE` removes 1 row. Then nothing points to the order any more, so it can go too, and 15 orders are left. If you swap the two `DELETE`s, the first one fails with a foreign key error.",
            },
          ],
        },
      ],
    },
  ],
};
