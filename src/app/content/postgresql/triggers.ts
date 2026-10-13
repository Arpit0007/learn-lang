import { Lesson } from '../../shared/content';

export const TRIGGERS: Lesson = {
  slug: 'triggers',
  title: 'Triggers',
  nav: 'Triggers',
  blocks: [
    {
      kind: 'text',
      text: "A **trigger** tells PostgreSQL: \"every time this happens to this table, run this function\". For example: every time a product changes, write the time of the change into its row. Nobody has to remember to do it, because the database does it by itself.",
    },
    {
      kind: 'text',
      text: "A trigger has two parts. The **trigger function** says *what* to do. The **trigger** says *when* to do it: on which table, for which kind of change (`INSERT`, `UPDATE` or `DELETE`), and before or after the change.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Your first trigger',
    },
    {
      kind: 'text',
      text: "A trigger function is a PL/pgSQL function that `RETURNS trigger`. Inside it, two special variables hold the row that is being changed:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`OLD` is the row **before** the change. An `INSERT` has no old row.",
        "`NEW` is the row **after** the change. A `DELETE` has no new row.",
      ],
    },
    {
      kind: 'text',
      text: "This trigger prints a message every time a product row is updated. `FOR EACH ROW` means that the function runs once for every row that changes. `EXECUTE FUNCTION` names the function to run.",
    },
    {
      kind: 'example',
      label: 'first-trigger.sql',
      code: `CREATE FUNCTION report_stock_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE NOTICE '%: stock went from % to %', NEW.name, OLD.stock, NEW.stock;
  RETURN NULL;
END;
$$;

CREATE TRIGGER products_report_stock
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION report_stock_change();

UPDATE products
SET stock = stock + 10
WHERE category_id = 4;`,
    },
    {
      kind: 'text',
      text: "The `UPDATE` changed the 3 toys, so the function ran 3 times and printed 3 messages. A trigger function must end with `RETURN`. In an `AFTER` trigger the returned value is not used, so we return `NULL`. With `FOR EACH STATEMENT` instead of `FOR EACH ROW`, the function would run only once for the whole `UPDATE`, even if no row changed at all.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'BEFORE or AFTER?',
    },
    {
      kind: 'text',
      text: "A `BEFORE` trigger runs **before** the row is saved. It can still change `NEW`, and the row it returns is the row that gets saved. An `AFTER` trigger runs **after** the row is saved. It can't change that row any more, but it sees the final result, so it is the right place to change *other* tables.",
    },
    {
      kind: 'text',
      text: "**Keep `updated_at` up to date.** This `BEFORE UPDATE` trigger writes the current time into the `updated_at` column of every row that is updated. `:=` gives a new value to a variable, or here to a column of `NEW`.",
    },
    {
      kind: 'example',
      label: 'updated-at.sql',
      code: `ALTER TABLE products
ADD COLUMN updated_at timestamptz;

CREATE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

UPDATE products
SET price = 22.99
WHERE id = 1;

SELECT id, name, price, updated_at
FROM products
WHERE id IN (1, 2)
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Product 1 now shows the date and time of the update. Product 2 was not updated, so its `updated_at` is still NULL. The `UPDATE` didn't mention `updated_at` at all: the trigger added it.",
    },
    {
      kind: 'text',
      text: "**Write an audit log.** An audit log is a table that records every change, so you can look back later and see what changed. This `AFTER` trigger runs on `INSERT`, `UPDATE` and `DELETE`. `TG_OP` is another special variable: it holds the name of the operation that fired the trigger.",
    },
    {
      kind: 'example',
      label: 'audit-log.sql',
      code: `CREATE TABLE product_log (
  id         integer GENERATED ALWAYS AS IDENTITY,
  action     text NOT NULL,
  product_id integer NOT NULL,
  old_price  numeric(10, 2),
  new_price  numeric(10, 2)
);

CREATE FUNCTION log_product_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO product_log (action, product_id, old_price, new_price)
  VALUES (TG_OP, coalesce(NEW.id, OLD.id), OLD.price, NEW.price);
  RETURN NULL;
END;
$$;

CREATE TRIGGER products_log
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION log_product_change();

INSERT INTO products (name, category_id, price, added_on)
VALUES ('Kite', 4, 12.50, '2025-10-01');

UPDATE products
SET price = 21.99
WHERE id = 1;

DELETE FROM products
WHERE id = 14;

SELECT action, product_id, old_price, new_price
FROM product_log
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Each change left one row in the log. The `INSERT` has no old row, so its `old_price` is NULL, and the `DELETE` has no new row, so its `new_price` is NULL. For the same reason, `coalesce(NEW.id, OLD.id)` takes whichever of the two is not NULL.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Stop a bad change',
    },
    {
      kind: 'text',
      text: "`RAISE EXCEPTION` stops the statement with an error, and the change is cancelled. Why not use a `CHECK` constraint? A `CHECK` can only look at the new row. A trigger can compare the old row with the new one. This trigger refuses any price that is more than double the old price, which is probably a typing mistake. The last `UPDATE` fails on purpose.",
    },
    {
      kind: 'example',
      label: 'block-change.sql',
      expectError: true,
      code: `CREATE FUNCTION check_price_jump()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.price > OLD.price * 2 THEN
    RAISE EXCEPTION 'Price change too big for %: % to %',
      OLD.name, OLD.price, NEW.price;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_check_price
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION check_price_jump();

UPDATE products
SET price = 29.99
WHERE id = 1;

UPDATE products
SET price = 99.00
WHERE id = 1;`,
    },
    {
      kind: 'text',
      text: "The first `UPDATE`, from 24.99 to 29.99, is fine. The second one, from 29.99 to 99.00, more than doubles the price, so the trigger raises an error and the price stays at 29.99.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'When triggers make code hard to follow',
    },
    {
      kind: 'text',
      text: "Triggers are **invisible**. Someone reads `UPDATE products SET price = 20 WHERE id = 1` and has no idea that it also writes to a log table, changes a timestamp, and might stop with an error. Too many triggers make a database hard to understand:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "A trigger can change another table, which has its own triggers, which change more tables. Bugs like to hide in chains like this.",
        "`FOR EACH ROW` runs once per row. Changing a million rows runs the function a million times.",
        "When something goes wrong, the error comes from a function that nobody called on purpose, so it is hard to find.",
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Good uses for triggers',
      blocks: [
        {
          kind: 'text',
          text: "Keep triggers small, and give them clear names. Use them for jobs that must happen on **every** change, whoever makes it: timestamps, audit logs and safety checks. Put the main steps of your business, like \"place an order\", in your application code, or in a function that people call on purpose.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Keep an `updated_at` column up to date on `customers`. Fill in the return type, the row to return, and when the trigger runs.',
        code: `CREATE FUNCTION set_updated_at()
RETURNS [___]
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN [___];
END;
$$;

CREATE TRIGGER customers_set_updated_at
[___] UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();`,
        answers: [
          ['trigger', 'TRIGGER'],
          ['NEW', 'new'],
          ['BEFORE', 'before'],
        ],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A trigger runs on `DELETE`. Which variable holds the row that is being deleted?',
        options: ['`OLD`', '`NEW`', '`TG_OP`', '`ROW`'],
        answer: '`OLD`',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Store emails in lower case',
      blocks: [
        {
          kind: 'text',
          text: "People type their email in many ways: `Mia.Novak@Example.COM`, `mia.novak@example.com`. Write a trigger on `customers` that stores every new or changed email in lower case. Then add a customer whose email has capital letters, and look at the saved row.",
        },
        {
          kind: 'text',
          text: "Hint: it must change `NEW` before the row is saved, so it is a `BEFORE INSERT OR UPDATE` trigger. The function `lower()` makes text lower case.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'lowercase-email.sql',
              code: `CREATE FUNCTION lowercase_email()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.email := lower(NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER customers_lowercase_email
BEFORE INSERT OR UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION lowercase_email();

INSERT INTO customers (first_name, last_name, email, country, joined_on)
VALUES ('Mia', 'Novak', 'Mia.Novak@Example.COM', 'Czechia', '2025-10-01');

SELECT id, first_name, email
FROM customers
WHERE id = 13;`,
            },
            {
              kind: 'text',
              text: "The row was saved as `mia.novak@example.com`, even though the `INSERT` used capital letters.",
            },
          ],
        },
      ],
    },
  ],
};
