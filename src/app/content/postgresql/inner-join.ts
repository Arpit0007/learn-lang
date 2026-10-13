import { Lesson } from '../../shared/content';

export const INNER_JOIN: Lesson = {
  slug: 'inner-join',
  title: 'INNER JOIN',
  nav: 'INNER JOIN',
  blocks: [
    {
      kind: 'text',
      text: "Look at the `orders` table. An order does not store the name of the customer. It stores only `customer_id`, a number. The name is in the `customers` table, in the row with that `id`.",
    },
    {
      kind: 'text',
      text: "This is on purpose. Each fact is stored in **one place** only. If a customer changes their email, you change one row in `customers`, and all their orders still point to the right person. When you read the data, a **join** puts the pieces back together.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Joining two tables',
    },
    {
      kind: 'text',
      text: "The column that identifies each row, like `customers.id`, is the **primary key**. A column that holds the id of a row in another table, like `orders.customer_id`, is a **foreign key**. These are the links in the shop database:",
    },
    {
      kind: 'table',
      head: ['Foreign key', 'Points to'],
      rows: [
        ['`orders.customer_id`', '`customers.id`'],
        ['`order_items.order_id`', '`orders.id`'],
        ['`order_items.product_id`', '`products.id`'],
        ['`products.category_id`', '`categories.id`'],
        ['`employees.manager_id`', '`employees.id`'],
      ],
    },
    {
      kind: 'text',
      text: "To join two tables, write the first table after `FROM`. Then write `INNER JOIN` and the second table. After `ON`, write the rule that links the rows. Here, an order belongs to the customer whose `id` is equal to the order's `customer_id`.",
    },
    {
      kind: 'example',
      label: 'inner-join.sql',
      code: `SELECT orders.id,
       orders.ordered_on,
       customers.first_name,
       customers.last_name
FROM orders
INNER JOIN customers ON customers.id = orders.customer_id
WHERE orders.status = 'delivered'
ORDER BY orders.id;`,
    },
    {
      kind: 'text',
      text: "For each delivered order, PostgreSQL found the matching customer and put the two rows side by side. Aisha Khan appears three times, because she has three delivered orders.",
    },
    {
      kind: 'text',
      text: "The word `INNER` is optional: `JOIN` alone means the same thing. Most people write just `JOIN`, and so does the rest of this lesson.",
    },
    {
      kind: 'text',
      text: "Notice the table name in front of each column, like `orders.id`. Both tables have a column called `id`, so PostgreSQL needs to know which one you mean.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "If you write just `id` in this query, PostgreSQL stops with the error *column reference \"id\" is ambiguous*. **Ambiguous** means that it could mean more than one thing. Put the table name in front: `orders.id`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Table aliases and USING',
    },
    {
      kind: 'text',
      text: "Writing `orders.` and `customers.` again and again is long. A **table alias** is a short name for a table. You write it right after the table name: `FROM orders o`. Now `o.id` means `orders.id`. This query uses aliases to show who is still waiting for an order:",
    },
    {
      kind: 'example',
      label: 'aliases.sql',
      code: `SELECT o.id,
       o.status,
       c.first_name,
       c.city
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status IN ('pending', 'shipped')
ORDER BY o.id;`,
    },
    {
      kind: 'text',
      text: "You can also write `FROM orders AS o`. It means the same. Once a table has an alias, use the alias everywhere in that query.",
    },
    {
      kind: 'text',
      text: "When the linking columns have the **same name** in both tables, `USING` is a shorter way to write the join. For this example, the shop has one more small table, `returns`. It lists the products that customers sent back. Like `order_items`, it has the columns `order_id` and `product_id`.",
    },
    {
      kind: 'example',
      label: 'using.sql',
      setup: `CREATE TABLE returns (order_id integer, product_id integer, reason text);
INSERT INTO returns VALUES
  (2, 4, 'Stopped working'),
  (10, 3, 'Arrived damaged'),
  (11, 8, 'Wrong colour');`,
      code: `SELECT order_id,
       product_id,
       quantity,
       reason
FROM order_items
JOIN returns USING (order_id, product_id)
ORDER BY order_id;`,
    },
    {
      kind: 'text',
      text: "`USING (order_id, product_id)` joins the rows where both columns are equal. Each shared column appears only once in the result, so you can write `order_id` without a table name. Most links in the shop have different names on each side, like `customers.id` and `orders.customer_id`, so they need `ON`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Joining three or four tables',
    },
    {
      kind: 'text',
      text: "A query can have many joins. Each `JOIN` adds one more table and links it to a table that is already in the query. To see what Aisha (customer 1) bought, follow the links: `orders` → `order_items` → `products` → `categories`.",
    },
    {
      kind: 'example',
      label: 'four-tables.sql',
      code: `SELECT o.id AS order_id,
       p.name AS product,
       c.name AS category,
       oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
JOIN categories c ON c.id = p.category_id
WHERE o.customer_id = 1
ORDER BY o.id, p.name;`,
    },
    {
      kind: 'text',
      text: "Aisha has three orders with five items in them. `products` and `categories` both have a column called `name`. Without new names, the result would have two columns called `name`, which is confusing. So the query renames them with `AS product` and `AS category`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Rows without a match',
    },
    {
      kind: 'text',
      text: "An inner join keeps a row only when it finds a match in the other table. Rows without a match are **dropped**. Count the rows in this result:",
    },
    {
      kind: 'example',
      label: 'no-match.sql',
      code: `SELECT p.name AS product,
       c.name AS category
FROM products p
JOIN categories c ON c.id = p.category_id
ORDER BY p.id;`,
    },
    {
      kind: 'text',
      text: "There are 14 products, but only 13 rows. The Gift Card has no category (its `category_id` is NULL), so it has no match, and the join dropped it. The Garden category is missing too, because no product points to it.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "An inner join returns only the rows that match on **both** sides. To keep the rows without a match, use an outer join, such as `LEFT JOIN`. You will learn about them in the lesson on outer joins.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show each product with the name of its category. Fill in the two missing keywords.',
        code: `SELECT p.name AS product,
       c.name AS category
FROM products p
[___] categories c [___] c.id = p.category_id;`,
        answers: [['JOIN', 'join', 'INNER JOIN', 'inner join'], ['ON', 'on']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'An inner join drops a row when…',
        options: [
          'it has no matching row in the other table',
          'it has a NULL in any of its columns',
          'it matches more than one row',
          'its table has an alias',
        ],
        answer: 'it has no matching row in the other table',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Revenue for each category',
      blocks: [
        {
          kind: 'text',
          text: "Show each category name with its revenue: the sum of `quantity * unit_price` for all its sold items. Start from `order_items`, join `products` and `categories`, then group by the category name. Put the biggest revenue first.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'category-revenue.sql',
              code: `SELECT c.name AS category,
       sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN categories c ON c.id = p.category_id
GROUP BY c.name
ORDER BY revenue DESC;`,
            },
            {
              kind: 'text',
              text: "Electronics brings in the most. Garden is not in the list: it has no products, so the inner join dropped it.",
            },
          ],
        },
      ],
    },
  ],
};
