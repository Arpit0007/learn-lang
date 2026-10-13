import { Lesson } from '../../shared/content';

/** Hidden setup: a tags column, with tags on 12 of the 14 products. */
const TAGS_SETUP = `ALTER TABLE products ADD COLUMN tags text[] NOT NULL DEFAULT '{}';
UPDATE products SET tags = '{bestseller}' WHERE id = 1;
UPDATE products SET tags = '{gift}' WHERE id IN (2, 14);
UPDATE products SET tags = '{gift,kids}' WHERE id IN (3, 11);
UPDATE products SET tags = '{sale}' WHERE id = 4;
UPDATE products SET tags = '{gift,sale}' WHERE id IN (6, 8);
UPDATE products SET tags = '{bestseller,gift}' WHERE id = 7;
UPDATE products SET tags = '{eco}' WHERE id = 10;
UPDATE products SET tags = '{bestseller,kids}' WHERE id = 12;
UPDATE products SET tags = '{kids,sale}' WHERE id = 13;`;

/** The enum example, shown once, then used as hidden setup. */
const TICKETS = `CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high');

CREATE TABLE tickets (
  id       integer PRIMARY KEY,
  subject  text NOT NULL,
  priority ticket_priority NOT NULL
);

INSERT INTO tickets (id, subject, priority) VALUES
  (1, 'Where is my order?', 'normal'),
  (2, 'Refund for a cancelled order', 'high'),
  (3, 'Change my email address', 'low'),
  (4, 'Wrong item in the box', 'high');`;

export const ARRAYS_ENUMS: Lesson = {
  slug: 'arrays-enums',
  title: 'Arrays and Enums',
  nav: 'Arrays & enums',
  blocks: [
    {
      kind: 'text',
      text: "Most columns hold one value in each row. Sometimes a row needs a short **list** of values, such as the tags of a product: gift, sale, kids. PostgreSQL can keep the whole list in one column. This is called an **array**.",
    },
    {
      kind: 'text',
      text: "Other times, a column must hold one value from a **fixed list**, such as a priority that is low, normal or high. An **enum** (short for *enumerated type*) is a type you make yourself, with exactly those values.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Arrays',
    },
    {
      kind: 'text',
      text: "Add `[]` after a type to make an array type: `text[]` is a list of texts, and `integer[]` is a list of whole numbers. You can write an array value in two ways: `ARRAY['red', 'green']`, or as text inside curly brackets, `'{red,green}'`. Both give the same array.",
    },
    {
      kind: 'example',
      label: 'array-values.sql',
      code: `SELECT ARRAY['red', 'green', 'blue'] AS colors,
       '{red,green,blue}'::text[]    AS same_colors;`,
    },
    {
      kind: 'text',
      text: "Now give the products a `tags` column. `DEFAULT '{}'` means a new row starts with an **empty** array. To get one item, write its position in square brackets: `tags[1]` is the first tag. Positions **start at 1**, not at 0. `cardinality(tags)` counts the items.",
    },
    {
      kind: 'example',
      label: 'tags-column.sql',
      code: `ALTER TABLE products
ADD COLUMN tags text[] NOT NULL DEFAULT '{}';

UPDATE products
SET tags = ARRAY['gift', 'sale']
WHERE id = 8;

SELECT name,
       tags,
       tags[1] AS first_tag,
       tags[3] AS third_tag,
       cardinality(tags) AS tag_count
FROM products
WHERE id IN (8, 9)
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The Coffee Mug has two tags, so `tags[3]` is NULL. The Desk Lamp has an empty array, so even `tags[1]` is NULL. Asking for a position that does not exist is not an error.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Many programming languages count from 0, so people write `tags[0]` to get the first item. In PostgreSQL, `tags[0]` gives NULL. The first item is `tags[1]`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Search and reshape arrays',
    },
    {
      kind: 'text',
      text: "In the next examples, 12 of the 14 products already have tags: `gift`, `sale`, `kids`, `bestseller` or `eco`. There are two common ways to search an array column:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`'kids' = ANY (tags)` is true when **any one** of the items in `tags` is `'kids'`.",
        "`tags @> ARRAY['gift', 'sale']` is true when `tags` **contains** all of those items, in any order.",
      ],
    },
    {
      kind: 'example',
      label: 'search-arrays.sql',
      setup: TAGS_SETUP,
      code: `SELECT name, tags
FROM products
WHERE 'kids' = ANY (tags)
ORDER BY name;

SELECT name, tags
FROM products
WHERE tags @> ARRAY['gift', 'sale']
ORDER BY name;`,
    },
    {
      kind: 'text',
      text: "Four products are for kids. Only the Bluetooth Speaker and the Coffee Mug have both `gift` and `sale`.",
    },
    {
      kind: 'text',
      text: "Two functions move between rows and arrays. `array_agg` collects the values of many rows into one array, the way `sum` collects numbers into one total. `unnest` does the opposite: it turns one array into many rows, one for each item.",
    },
    {
      kind: 'example',
      label: 'array-agg-unnest.sql',
      setup: TAGS_SETUP,
      code: `SELECT c.name AS category,
       array_agg(p.name ORDER BY p.name) AS products
FROM categories AS c
JOIN products AS p ON p.category_id = c.id
GROUP BY c.name
ORDER BY c.name;

SELECT name,
       unnest(tags) AS tag
FROM products
WHERE id IN (3, 7)
ORDER BY name, tag;`,
    },
    {
      kind: 'text',
      text: "In the first result, values with spaces are shown in double quotes, like `\"Space Atlas\"`. In the second result, each product appears once for each of its tags.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Enums',
    },
    {
      kind: 'text',
      text: "`CREATE TYPE name AS ENUM (...)` makes a new type with a fixed list of values. A column of this type accepts only those values. The order of the list matters: PostgreSQL sorts enum values in the order you listed them, not in alphabetical order.",
    },
    {
      kind: 'example',
      label: 'enum.sql',
      code: `${TICKETS}

SELECT id, subject, priority
FROM tickets
ORDER BY priority DESC, id;`,
    },
    {
      kind: 'text',
      text: "With `DESC`, the `high` tickets come first, then `normal`, then `low`. If `priority` were plain text, the order would be alphabetical: normal, low, high.",
    },
    {
      kind: 'text',
      text: "To add a value later, use `ALTER TYPE ... ADD VALUE`. `BEFORE` or `AFTER` says where the new value goes in the order. In the next example, the `tickets` table is created for you first. Its last statement fails on purpose.",
    },
    {
      kind: 'example',
      label: 'enum-add-value.sql',
      setup: TICKETS,
      expectError: true,
      code: `ALTER TYPE ticket_priority ADD VALUE 'urgent' AFTER 'high';

INSERT INTO tickets (id, subject, priority)
VALUES (5, 'I was charged twice', 'urgent');

SELECT id, subject, priority
FROM tickets
WHERE priority >= 'high'
ORDER BY priority DESC, id;

INSERT INTO tickets (id, subject, priority)
VALUES (6, 'Do you ship to Peru?', 'medium');`,
    },
    {
      kind: 'text',
      text: "`urgent` now sorts above `high`, so `>= 'high'` finds both. But `'medium'` is not in the list, so PostgreSQL refuses the last row with \"invalid input value for enum\".",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Array, enum or lookup table?',
    },
    {
      kind: 'text',
      text: "There is a third choice. A **lookup table** is a small table of allowed values, and other tables point to it with a foreign key. The `categories` table is one: each product's `category_id` points to one of its rows.",
    },
    {
      kind: 'table',
      head: ['Choice', 'Good for'],
      rows: [
        ['Array', 'A short list that belongs to one row, and that you mostly read as a whole, like tags'],
        ['Enum', 'A small, fixed set of values that almost never changes, like low, normal and high'],
        ['Lookup table', 'Values that change often, need extra columns (like a description), or must be checked with a foreign key, like categories'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Know the limits',
      blocks: [
        {
          kind: 'text',
          text: "PostgreSQL can't check the items of an array against another table, because an array can't have a foreign key. And you can add or rename an enum value, but you can't remove one. When the list of values is still changing, a lookup table is the safer choice.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'First, find the products tagged `sale`. Then make a type for clothing sizes. Fill in the three missing keywords.',
        code: `SELECT name
FROM products
WHERE 'sale' = [___] (tags);

CREATE [___] clothing_size AS [___] ('small', 'medium', 'large');`,
        answers: [
          ['ANY', 'any'],
          ['TYPE', 'type'],
          ['ENUM', 'enum'],
        ],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Shop staff add new product categories every month, and each category has a description. What should you use for the categories?',
        options: ['A lookup table', 'An enum', 'A `text[]` array column', 'A `CHECK` constraint'],
        answer: 'A lookup table',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Count the products for each tag',
      blocks: [
        {
          kind: 'text',
          text: "Show each tag once, with the number of products that have it, the most used tag first.",
        },
        {
          kind: 'text',
          text: "Hint: first turn the tags into rows with `unnest` in a CTE. Then use `GROUP BY` and `count(*)` on those rows.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'count-tags.sql',
              setup: TAGS_SETUP,
              code: `WITH product_tags AS (
  SELECT unnest(tags) AS tag
  FROM products
)
SELECT tag,
       count(*) AS products
FROM product_tags
GROUP BY tag
ORDER BY products DESC, tag;`,
            },
            {
              kind: 'text',
              text: "`gift` is the most used tag, with 7 products. `kids` and `sale` have 4 each, `bestseller` 3, and `eco` only 1.",
            },
          ],
        },
      ],
    },
  ],
};
