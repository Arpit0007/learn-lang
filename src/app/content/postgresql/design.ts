import { Lesson } from '../../shared/content';

/** The worked-example library schema: shown in full once, then reused as hidden setup. */
const LIBRARY = `CREATE TABLE authors (
  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE books (
  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title          text NOT NULL,
  isbn           text NOT NULL UNIQUE,
  published_year integer
);

CREATE TABLE book_authors (
  book_id   integer NOT NULL REFERENCES books (id),
  author_id integer NOT NULL REFERENCES authors (id),
  PRIMARY KEY (book_id, author_id)
);

CREATE TABLE members (
  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name      text NOT NULL,
  email     text NOT NULL UNIQUE,
  joined_on date NOT NULL DEFAULT current_date
);

CREATE TABLE loans (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  book_id     integer NOT NULL REFERENCES books (id),
  member_id   integer NOT NULL REFERENCES members (id),
  borrowed_on date NOT NULL,
  due_on      date NOT NULL,
  returned_on date,
  CONSTRAINT due_after_borrowed CHECK (due_on > borrowed_on)
);

INSERT INTO authors (name)
VALUES ('Chinua Achebe'), ('Jane Austen'), ('Terry Pratchett'), ('Neil Gaiman');

INSERT INTO books (title, isbn, published_year)
VALUES
  ('Things Fall Apart', '978-0385474542', 1958),
  ('Pride and Prejudice', '978-0141439518', 1813),
  ('Good Omens', '978-0060853983', 1990),
  ('Neverwhere', '978-0060557812', 1996);

INSERT INTO book_authors (book_id, author_id)
VALUES (1, 1), (2, 2), (3, 3), (3, 4), (4, 4);

INSERT INTO members (name, email, joined_on)
VALUES
  ('Aisha Khan', 'aisha@example.com', '2025-01-10'),
  ('Ben Carter', 'ben@example.com', '2025-02-01');

INSERT INTO loans (book_id, member_id, borrowed_on, due_on, returned_on)
VALUES
  (1, 1, '2025-03-01', '2025-03-15', '2025-03-10'),
  (3, 1, '2025-03-12', '2025-03-26', NULL),
  (2, 2, '2025-03-05', '2025-03-19', NULL);`;

export const DESIGN: Lesson = {
  slug: 'design',
  title: 'Designing a Database',
  nav: 'Database design',
  blocks: [
    {
      kind: 'text',
      text: "Before you write `CREATE TABLE`, decide **which** tables you need and how they connect. This is **database design**. A good design makes queries simple, and it stores each fact only once, so two copies of a fact can never disagree.",
    },
    {
      kind: 'text',
      text: "In this lesson you will see why the shop database is built the way it is. Then you will design a small library database yourself, step by step.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Entities and relationships',
    },
    {
      kind: 'text',
      text: "Start by listing the **entities**: the kinds of things you need to store facts about. In the shop they are customers, products, categories, orders and employees. Each entity becomes a table, and each fact about it becomes a column. Then ask how the entities are connected. These connections are called **relationships**, and there are three kinds:",
    },
    {
      kind: 'table',
      head: ['Relationship', 'Example in the shop', 'How to build it'],
      rows: [
        ['One-to-many', 'One customer has many orders, and each order has one customer.', "A foreign key on the \"many\" side: `orders.customer_id`"],
        ['Many-to-many', 'An order has many products, and a product is in many orders.', 'A **junction table** in the middle, with a foreign key to each side: `order_items`'],
        ['One-to-one', 'A customer has at most one loyalty card.', 'A foreign key that is also unique, often the primary key'],
      ],
    },
    {
      kind: 'text',
      text: "One-to-many is by far the most common. Many-to-many always needs a table in the middle, because one cell should never hold a list of ids. One-to-one is the rarest. Here is how it looks:",
    },
    {
      kind: 'example',
      label: 'one-to-one.sql',
      expectError: true,
      code: `CREATE TABLE loyalty_cards (
  customer_id integer PRIMARY KEY
              REFERENCES customers (id),
  card_number text NOT NULL UNIQUE,
  points      integer NOT NULL DEFAULT 0
);

INSERT INTO loyalty_cards (customer_id, card_number)
VALUES (1, 'LC-0001'), (2, 'LC-0002');

SELECT *
FROM loyalty_cards;

INSERT INTO loyalty_cards (customer_id, card_number)
VALUES (1, 'LC-0003');`,
    },
    {
      kind: 'text',
      text: "`customer_id` is the primary key, so each customer can have only one card, and the second card for customer 1 fails with `duplicate key value violates unique constraint \"loyalty_cards_pkey\"`. Because the same column `REFERENCES customers (id)`, every card also belongs to a real customer. You could put the card's columns in `customers` instead. A separate table is better when only some rows have these facts, or when they are used by a different part of the app.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Normalization: one fact in one place',
    },
    {
      kind: 'text',
      text: "**Normalization** means arranging your tables so that each fact is stored in exactly one place. It is described in steps called **normal forms**, and the first three are enough for almost every app. Let's start from a table that is badly designed, the kind people often build in a spreadsheet:",
    },
    {
      kind: 'table',
      head: ['order_id', 'customer', 'email', 'products'],
      rows: [
        ['1', 'Aisha Khan', 'aisha.khan@example.com', 'Learn SQL in 10 Days, Coffee Mug x2'],
        ['3', 'Aisha Khan', 'aisha.khan@example.com', 'Noise-Cancelling Headphones'],
      ],
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "**First normal form (1NF): one value in each cell.** The `products` cell holds a list, so you cannot easily count the mugs, or find every order with a mug. Columns like `product1`, `product2` and `product3` are the same problem in disguise. The fix is one row for each product in each order.",
        "**Second normal form (2NF): every column depends on the whole key.** After the 1NF fix, a row is identified by two things together: the order and the product. `quantity` depends on both. But the customer depends only on the order, and a product's category depends only on the product. So order facts move to an `orders` table, and product facts to a `products` table.",
        "**Third normal form (3NF): no column depends on another column that is not the key.** In an `orders` table, a customer's email depends on the customer, not on the order. So customer facts move to `customers`, and `orders` keeps only a `customer_id`.",
      ],
    },
    {
      kind: 'text',
      text: "A short way to remember all three: every column depends on *the key, the whole key, and nothing but the key*. What goes wrong if you skip these steps? Here is a table that is in 1NF, but not in 2NF or 3NF. Aisha changes her email, and the change is saved on one of her orders:",
    },
    {
      kind: 'example',
      label: 'before.sql',
      code: `CREATE TABLE orders_flat (
  order_id       integer,
  customer_name  text,
  customer_email text,
  product_name   text,
  category_name  text,
  quantity       integer
);

INSERT INTO orders_flat (order_id, customer_name, customer_email, product_name, category_name, quantity)
VALUES
  (1, 'Aisha Khan', 'aisha.khan@example.com', 'Learn SQL in 10 Days', 'Books', 1),
  (1, 'Aisha Khan', 'aisha.khan@example.com', 'Coffee Mug', 'Home', 2),
  (3, 'Aisha Khan', 'aisha.khan@example.com', 'Noise-Cancelling Headphones', 'Electronics', 1);

UPDATE orders_flat
SET customer_email = 'aisha.k@example.com'
WHERE order_id = 3;

SELECT DISTINCT customer_name, customer_email
FROM orders_flat
ORDER BY customer_email;`,
    },
    {
      kind: 'text',
      text: "Now Aisha has two different email addresses, and the table cannot tell you which one is right. The email was stored three times, and only one copy changed. In the shop's real design, the email lives in one row of `customers`. Change it there, and every order shows the new address, because the orders only point to the customer:",
    },
    {
      kind: 'example',
      label: 'after.sql',
      code: `UPDATE customers
SET email = 'aisha.k@example.com'
WHERE id = 1;

SELECT o.id AS order_id,
       c.first_name || ' ' || c.last_name AS customer_name,
       c.email AS customer_email,
       p.name AS product_name,
       cat.name AS category_name,
       oi.quantity
FROM orders AS o
JOIN customers AS c ON c.id = o.customer_id
JOIN order_items AS oi ON oi.order_id = o.id
JOIN products AS p ON p.id = oi.product_id
JOIN categories AS cat ON cat.id = p.category_id
WHERE o.id IN (1, 3)
ORDER BY o.id, p.name;`,
    },
    {
      kind: 'text',
      text: "One `UPDATE` of one row, and all three result rows show the new email. The joins rebuild the flat table whenever you need it, so you lose nothing by splitting the data into several tables.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'When to break the rules',
    },
    {
      kind: 'text',
      text: "Sometimes a copy of a fact is the right choice. Storing a copy on purpose is called **denormalizing**. The shop already does it once: `order_items.unit_price` copies the product's price at the moment of the sale. Prices change, but an old order must remember what the customer really paid:",
    },
    {
      kind: 'example',
      label: 'price-history.sql',
      code: `UPDATE products
SET price = 27.99
WHERE id = 1;

SELECT oi.order_id,
       p.name,
       oi.unit_price AS price_paid,
       p.price AS price_now
FROM order_items AS oi
JOIN products AS p ON p.id = oi.product_id
WHERE oi.product_id = 1
ORDER BY oi.order_id;`,
    },
    {
      kind: 'text',
      text: "The book now costs `27.99`, but the three old orders still show `24.99`, the price the customers paid. Other good reasons to keep a copy are a report that has become too slow because it joins many big tables, or a total that is read thousands of times a second. A materialized view, in the Views lesson, can store such a result for you.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Normalize first',
      blocks: [
        {
          kind: 'text',
          text: "Start with a normalized design. Add a copy only when you have a real reason, like a price that must not change later or a slow query you have measured. Then decide which value is the true one, and how the copy will be kept up to date.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Worked example: a library',
    },
    {
      kind: 'text',
      text: "A small library lends books to its members. The entities are **authors**, **books**, **members** and **loans**. The relationships are:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "A book can have several authors (Good Omens has two), and an author can write several books. That is many-to-many, so it needs the junction table `book_authors`.",
        "A member can have many loans, and each loan is for one member. That is one-to-many, so `loans` has a `member_id`.",
        "A book can be lent many times, and each loan is for one book. That is one-to-many too, so `loans` has a `book_id`.",
      ],
    },
    {
      kind: 'text',
      text: "Each table also needs a primary key. These are the choices, and the reasons for them:",
    },
    {
      kind: 'table',
      head: ['Table', 'Primary key', 'Why'],
      rows: [
        ['`authors`, `members`', '`id`', 'Names are not unique, and they can change.'],
        ['`books`', '`id`', 'The ISBN is unique too, so it gets a `UNIQUE` rule. But a short `id` is easier for other tables to point to.'],
        ['`book_authors`', '`(book_id, author_id)`', 'The same author cannot be added to the same book twice.'],
        ['`loans`', '`id`', 'A member can borrow the same book again later, so `(book_id, member_id)` would not be unique.'],
      ],
    },
    {
      kind: 'text',
      text: "Here is the whole design. It creates the tables, adds some rows, and lists the books with their authors. Press **Run**:",
    },
    {
      kind: 'example',
      label: 'library.sql',
      code: `${LIBRARY}

SELECT b.title, a.name AS author
FROM books AS b
JOIN book_authors AS ba ON ba.book_id = b.id
JOIN authors AS a ON a.id = ba.author_id
ORDER BY b.title, a.name;`,
    },
    {
      kind: 'text',
      text: "Good Omens appears twice, once for each of its authors, and Neil Gaiman appears for two books. That is the many-to-many relationship at work. The `CHECK` on `loans` also guards the data: a loan that is due before it was borrowed is rejected. In the next example, the same library is built for you behind the scenes, so the code shows only the question: which books are out on loan right now, and when are they due back?",
    },
    {
      kind: 'example',
      label: 'on-loan.sql',
      setup: LIBRARY,
      code: `SELECT m.name AS member,
       b.title,
       l.due_on
FROM loans AS l
JOIN members AS m ON m.id = l.member_id
JOIN books AS b ON b.id = l.book_id
WHERE l.returned_on IS NULL
ORDER BY l.due_on;`,
    },
    {
      kind: 'text',
      text: "Two books are still out: Pride and Prejudice with Ben, and Good Omens with Aisha. Aisha's first loan has a `returned_on` date, so it is not listed. Because each fact lives in one place, the question becomes a simple join.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "A book can have many authors, and an author can write many books. Complete the junction table.",
        code: `CREATE TABLE book_authors (
  book_id   integer NOT NULL REFERENCES books (id),
  author_id integer NOT NULL [___] authors (id),
  PRIMARY KEY ([___], author_id)
);`,
        answers: [['REFERENCES', 'references'], ['book_id']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A `products` table has the columns `id`, `name`, `category_id` and `category_name`. What is wrong with it?',
        options: [
          '`category_name` depends on `category_id`, not on the product, so it breaks 3NF',
          'Nothing, this is a good design',
          'It breaks 1NF, because a cell holds a list',
          'A table may not have more than three columns',
        ],
        answer: '`category_name` depends on `category_id`, not on the product, so it breaks 3NF',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Add reservations to the library',
      blocks: [
        {
          kind: 'text',
          text: "Members can reserve a book that is out on loan. Design a `reservations` table for the library. It links a member and a book, saves the date of the reservation (today, by default), and makes sure a member cannot reserve the same book twice. Then let Ben (member 2) reserve Good Omens (book 3), and list all reservations with the member's name and the book's title.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'text',
              text: "The library tables from the worked example are created for you before this code runs.",
            },
            {
              kind: 'example',
              label: 'reservations.sql',
              setup: LIBRARY,
              code: `CREATE TABLE reservations (
  member_id   integer NOT NULL REFERENCES members (id),
  book_id     integer NOT NULL REFERENCES books (id),
  reserved_on date NOT NULL DEFAULT current_date,
  PRIMARY KEY (member_id, book_id)
);

INSERT INTO reservations (member_id, book_id)
VALUES (2, 3);

SELECT m.name, b.title, r.reserved_on
FROM reservations AS r
JOIN members AS m ON m.id = r.member_id
JOIN books AS b ON b.id = r.book_id;`,
            },
            {
              kind: 'text',
              style: 'small',
              text: "A member and a book together identify a reservation, so the composite primary key `(member_id, book_id)` stops a second reservation of the same book by the same member. You get one row: Ben Carter, Good Omens and today's date.",
            },
          ],
        },
      ],
    },
  ],
};
