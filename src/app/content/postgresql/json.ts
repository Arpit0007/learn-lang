import { Lesson } from '../../shared/content';

/** Demo table: extra details for some products, a different shape for each. Shown once, then hidden setup. */
const SPECS_TABLE = `CREATE TABLE product_specs (
  product_id integer PRIMARY KEY REFERENCES products (id),
  specs      jsonb NOT NULL
);

INSERT INTO product_specs (product_id, specs) VALUES
  (4, '{"color": "black", "wireless": true, "battery": {"type": "AA", "hours": 300}}'),
  (5, '{"color": "white", "watts": 65, "ports": ["USB-C", "USB-A"]}'),
  (6, '{"color": "blue", "wireless": true, "battery": {"type": "built-in", "hours": 12}}'),
  (7, '{"color": "black", "wireless": true, "battery": {"type": "built-in", "hours": 30}, "ports": ["USB-C"]}'),
  (9, '{"color": "white", "watts": 8}');`;

export const JSON: Lesson = {
  slug: 'json',
  title: 'JSON and JSONB',
  nav: 'JSON & JSONB',
  blocks: [
    {
      kind: 'text',
      text: "**JSON** is a text format for data. Websites and apps use it everywhere to send data to each other. A JSON **object** is a set of keys and values inside curly brackets, like `{\"name\": \"Aisha\", \"vip\": true}`. A JSON **array** is a list inside square brackets, like `[\"USB-C\", \"USB-A\"]`.",
    },
    {
      kind: 'text',
      text: "PostgreSQL can store JSON in a column and look inside it. This is handy for data that has a different shape in each row, such as the details of very different products.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'json or jsonb?',
    },
    {
      kind: 'text',
      text: "PostgreSQL has two JSON types. `json` keeps the exact text you give it. `jsonb` (the b is for binary) turns the text into a special form that is faster to search and can use indexes. While doing that, `jsonb` removes extra spaces and duplicate keys (the last one wins), and it may change the order of the keys. Run this to see the difference. The `::` turns the text into each type.",
    },
    {
      kind: 'example',
      label: 'json-vs-jsonb.sql',
      code: `SELECT '{"b": 1, "a": 2, "a": 3}'::json  AS as_json,
       '{"b": 1, "a": 2, "a": 3}'::jsonb AS as_jsonb;`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Use jsonb',
      blocks: [
        {
          kind: 'text',
          text: "Almost always choose `jsonb`. Use `json` only when you must keep the text exactly as it came, spaces and all.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Store and read JSON',
    },
    {
      kind: 'text',
      text: "You create a `jsonb` column like any other column. Here, a new table holds extra details for some products. Each product has different details: the mouse has a battery, the charger has ports, and the lamp has neither.",
    },
    {
      kind: 'example',
      label: 'jsonb-column.sql',
      code: `${SPECS_TABLE}

SELECT product_id, specs
FROM product_specs
ORDER BY product_id;`,
    },
    {
      kind: 'text',
      text: "To read a value, write the column, an arrow and the key:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`->` gives the value **as JSON**. Text values keep their double quotes, like `\"black\"`.",
        "`->>` gives the value **as text**, like `black`. Use it to show or compare values.",
        "`#>>` follows a **path** of keys into an object inside an object, and gives text. The path `'{battery,hours}'` means: the `hours` key inside the `battery` key.",
      ],
    },
    {
      kind: 'text',
      text: "From now on, the `product_specs` table is created for you before each example.",
    },
    {
      kind: 'example',
      label: 'read-json.sql',
      setup: SPECS_TABLE,
      code: `SELECT product_id,
       specs -> 'color'            AS color_json,
       specs ->> 'color'           AS color_text,
       specs #>> '{battery,hours}' AS battery_hours
FROM product_specs
ORDER BY product_id;`,
    },
    {
      kind: 'text',
      text: "Products 5 and 9 have no battery, so their `battery_hours` is NULL. Asking for a key that is not there is not an error.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "`->>` always gives **text**, even when the value is a number. So `specs ->> 'watts' > 50` fails with \"operator does not exist: text > integer\". Change the text into a number first: `(specs ->> 'watts')::integer > 50`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Find rows by what is inside',
    },
    {
      kind: 'text',
      text: "Two operators find rows by the JSON inside them:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`@>` means **contains**. `specs @> '{\"wireless\": true}'` is true when `specs` has the key `wireless` with the value `true`.",
        "`?` asks if a **key exists**. `specs ? 'ports'` is true when `specs` has a `ports` key, whatever its value is.",
      ],
    },
    {
      kind: 'example',
      label: 'search-json.sql',
      setup: SPECS_TABLE,
      code: `SELECT p.name,
       s.specs ->> 'color' AS color
FROM product_specs AS s
JOIN products AS p ON p.id = s.product_id
WHERE s.specs @> '{"wireless": true}'
ORDER BY p.name;

SELECT p.name,
       s.specs -> 'ports' AS ports
FROM product_specs AS s
JOIN products AS p ON p.id = s.product_id
WHERE s.specs ? 'ports'
ORDER BY p.name;`,
    },
    {
      kind: 'text',
      text: "Three products are wireless, and two have a list of ports. On a big table, a **GIN index** makes `@>` and `?` fast: `CREATE INDEX ON product_specs USING GIN (specs);`",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Build and change JSON',
    },
    {
      kind: 'text',
      text: "You can also turn normal rows into JSON, for example to send them to a web app. `jsonb_build_object` makes one object from pairs of keys and values. `jsonb_agg` collects the values of many rows into one JSON array, the way `sum` collects numbers into one total.",
    },
    {
      kind: 'example',
      label: 'build-json.sql',
      code: `SELECT jsonb_build_object(
         'name', first_name || ' ' || last_name,
         'city', city
       ) AS customer
FROM customers
WHERE country = 'UK'
ORDER BY id;

SELECT c.name AS category,
       jsonb_agg(
         jsonb_build_object('name', p.name, 'price', p.price)
         ORDER BY p.price
       ) AS products
FROM categories AS c
JOIN products AS p ON p.category_id = c.id
WHERE c.name IN ('Books', 'Toys')
GROUP BY c.name
ORDER BY c.name;`,
    },
    {
      kind: 'text',
      text: "The first query makes one object for each customer in the UK. (Notice that `jsonb` put the `city` key first.) The second query makes one row per category, with an array of all its products, cheapest first.",
    },
    {
      kind: 'text',
      text: "To change one value inside a `jsonb` column, use `jsonb_set(column, path, new_value)`. The new value must be JSON too. So a text value needs double quotes inside the single quotes: `'\"red\"'`. A number does not: `'15'`.",
    },
    {
      kind: 'example',
      label: 'change-json.sql',
      setup: SPECS_TABLE,
      code: `UPDATE product_specs
SET specs = jsonb_set(specs, '{color}', '"red"')
WHERE product_id = 6;

UPDATE product_specs
SET specs = jsonb_set(specs, '{battery,hours}', '15')
WHERE product_id = 6;

SELECT specs
FROM product_specs
WHERE product_id = 6;`,
    },
    {
      kind: 'text',
      text: "The speaker is now red, and its battery lasts 15 hours. The other keys did not change.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'When to use normal columns',
      blocks: [
        {
          kind: 'text',
          text: "JSON is good for extra details that differ from row to row. But when every row has a value, or you often filter, sort, join or add up by it, give it a normal column. A normal column has a clear type, can have `NOT NULL`, `CHECK` and foreign keys, and is easier to query. That is why `price` is a `numeric` column of `products` and not a key inside `specs`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Show the color, **as text**, of every wireless product. Fill in the two operators.',
        code: `SELECT product_id,
       specs [___] 'color' AS color
FROM product_specs
WHERE specs [___] '{"wireless": true}';`,
        answers: ['->>', '@>'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Every product has a price, and you sort and filter by price all the time. Where should the price go?',
        options: [
          'In its own `numeric` column',
          'As a key inside a `jsonb` column',
          'As a key inside a `json` column',
          'In a `text` column',
        ],
        answer: 'In its own `numeric` column',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Long-lasting wireless products',
      blocks: [
        {
          kind: 'text',
          text: "Find the wireless products whose battery lasts more than 20 hours. Show the product name and the hours, longest first. Use the `product_specs` table from this lesson.",
        },
        {
          kind: 'text',
          text: "Hint: `#>>` gives the hours as text, so add `::integer` before you compare them with 20.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'long-battery.sql',
              setup: SPECS_TABLE,
              code: `SELECT p.name,
       (s.specs #>> '{battery,hours}')::integer AS battery_hours
FROM product_specs AS s
JOIN products AS p ON p.id = s.product_id
WHERE s.specs @> '{"wireless": true}'
  AND (s.specs #>> '{battery,hours}')::integer > 20
ORDER BY battery_hours DESC;`,
            },
            {
              kind: 'text',
              text: "The Wireless Mouse (300 hours) and the Noise-Cancelling Headphones (30 hours). The Bluetooth Speaker is wireless too, but its battery lasts only 12 hours.",
            },
          ],
        },
      ],
    },
  ],
};
