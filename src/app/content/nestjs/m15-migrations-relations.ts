import { Lesson } from '../../shared/content';

export const M15_MIGRATIONS_RELATIONS: Lesson = {
  "slug": "m15-migrations-relations",
  "title": "M15 Migrations and relations",
  "nav": "Migrations & relations",
  "num": "M15",
  "eyebrow": "Level 5 · Week 8 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "In Module 14, `synchronize` changed your tables for you at every start. That was fine on your laptop. A real database holds real customers' data, so every change to its structure must be written down, reviewed, and run in the same order everywhere. A **migration** is that written-down change: a small TypeScript file with an `up` method that applies the change and a `down` method that undoes it."
    },
    {
      "kind": "text",
      "text": "The second half of the module is **relations**: a product belongs to a category, and an order has many items. You will declare relations on entities, load them on purpose, and avoid the N+1 problem, the performance bug that ORMs make far too easy."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "A migration is one saved step in your database's history."
        },
        {
          "kind": "text",
          "text": "Your teammates, your test database and your servers all replay the same steps in the same order."
        },
        {
          "kind": "text",
          "text": "A relation is a link between two tables. Load linked rows together, in one go, not one at a time in a loop."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A data source file for the CLI"
    },
    {
      "kind": "text",
      "text": "Migrations are made and run by the TypeORM **CLI**, a command-line tool. The CLI runs outside Nest, so it cannot see your `AppModule` or `ConfigService`. It needs its own small file that says how to connect, and it reads the same `.env` file:"
    },
    {
      "kind": "example",
      "code": "import 'dotenv/config';                       // the CLI runs outside Nest, so load .env yourself\nimport { DataSource } from 'typeorm';\n\nexport default new DataSource({\n  type: 'postgres',\n  host: process.env.DB_HOST,\n  port: Number(process.env.DB_PORT ?? 5432),\n  username: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n  entities: [__dirname + '/../**/*.entity{.ts,.js}'],\n  migrations: [__dirname + '/migrations/*{.ts,.js}'],\n  synchronize: false,                         // migrations own the schema from now on\n});",
      "label": "src/database/data-source.ts"
    },
    {
      "kind": "text",
      "text": "Now set `DB_SYNC=false`, so the app stops changing tables on its own, and add four scripts. `typeorm-ts-node-commonjs` is a version of the CLI that ships with TypeORM and reads `.ts` files directly, through the `ts-node` package that a new Nest project already has."
    },
    {
      "kind": "example",
      "code": "# 1. package.json → \"scripts\"\n\"typeorm\": \"typeorm-ts-node-commonjs -d src/database/data-source.ts\",\n\"migration:generate\": \"npm run typeorm -- migration:generate\",\n\"migration:run\": \"npm run typeorm -- migration:run\",\n\"migration:revert\": \"npm run typeorm -- migration:revert\"\n\n# 2. terminal\nnpm i dotenv\nnpm run migration:generate -- src/database/migrations/CreateProducts\nnpm run migration:run                 # runs every migration that has not run yet, oldest first\nnpm run typeorm -- migration:show     # lists them all:\n#   [X] 1 CreateProducts1791291605738   ← already run\n#   [ ] AddCategories1791291640559      ← waiting\nnpm run migration:revert              # undoes the LAST one only, by calling its down()",
      "lang": "text",
      "label": "package.json and terminal"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Generating and running a migration"
    },
    {
      "kind": "text",
      "text": "`migration:generate` compares your entities with the real database and writes the SQL that would make them match. Module 14's `synchronize` has already created your tables, so start from an empty database first (`docker compose down -v`, then `docker compose up -d`); then the first migration describes everything. For Module 14's `Product` entity, it wrote this:"
    },
    {
      "kind": "example",
      "code": "import { MigrationInterface, QueryRunner } from \"typeorm\";\n\nexport class CreateProducts1791291605738 implements MigrationInterface {\n    name = 'CreateProducts1791291605738'\n\n    public async up(queryRunner: QueryRunner): Promise<void> {\n        await queryRunner.query(`CREATE TYPE \"public\".\"products_status_enum\" AS ENUM('draft', 'live')`);\n        await queryRunner.query(`CREATE TABLE \"products\" (\"id\" SERIAL NOT NULL,\n            \"sku\" character varying(40) NOT NULL, \"name\" character varying(120) NOT NULL,\n            \"price\" numeric(10,2) NOT NULL, \"stock\" integer NOT NULL DEFAULT '0',\n            \"status\" \"public\".\"products_status_enum\" NOT NULL DEFAULT 'draft', \"createdBy\" uuid NOT NULL,\n            \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n            \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n            CONSTRAINT \"UQ_c44ac33a05b144dd0d9ddcf9327\" UNIQUE (\"sku\"),\n            CONSTRAINT \"PK_0806c755e0aca124e67c0cf6d7d\" PRIMARY KEY (\"id\"))`);\n    }\n\n    public async down(queryRunner: QueryRunner): Promise<void> {\n        await queryRunner.query(`DROP TABLE \"products\"`);\n        await queryRunner.query(`DROP TYPE \"public\".\"products_status_enum\"`);\n    }\n\n}",
      "label": "src/database/migrations/1791291605738-CreateProducts.ts (generated, long lines wrapped)"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "The number in the name is a timestamp. Migrations always run in timestamp order.",
        "The CLI creates a table called `migrations` in your database. `migration:run` adds one row there for each migration it runs, and skips every migration that already has a row.",
        "By default, `migration:run` wraps all the waiting migrations in one *transaction* (Module 16): if one of them fails, none of them is applied.",
        "`down` is the exact reverse of `up`. `migration:revert` runs it for the most recent migration only; run it again to go back one more step."
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · read every generated migration",
      "blocks": [
        {
          "kind": "text",
          "text": "A generated migration is a first draft. TypeORM compares shapes, not intentions. Two real examples from this course's own entities: making `name` longer (`length: 120` to `200`) was generated as `DROP COLUMN \"name\"` followed by `ADD \"name\" character varying(200) NOT NULL`. On a `NOT NULL` column that migration fails; on a nullable column it succeeds, and every value is gone."
        },
        {
          "kind": "text",
          "text": "The fix is one line by hand: `ALTER TABLE \"products\" ALTER COLUMN \"name\" TYPE character varying(200)`, which keeps the data. The second example, adding a `NOT NULL` column to a table that already has rows, is Exercise 15.1."
        }
      ]
    },
    {
      "kind": "text",
      "text": "A few rules keep migrations safe:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Commit the migration in the same pull request as the entity change, and review its SQL like any other code.",
        "Never edit a migration that has already run on a shared database. That database will not run it again, so your edit never reaches it. Write a new migration instead.",
        "Run migrations as a deploy step, before the new code starts. TypeORM's `migrationsRun: true` option runs them when the app starts instead; that is simpler, but then every copy of the app tries to run them as it boots.",
        "One change per migration, with a name that says what it does: `AddCategories`, not `Update2`."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Relations: how tables point at each other"
    },
    {
      "kind": "text",
      "text": "A **foreign key** is a column that holds the primary key of a row in another table, such as `products.categoryId`. The database checks it for you: a product cannot point at a category that does not exist. TypeORM describes these links with relation decorators:"
    },
    {
      "kind": "table",
      "head": [
        "Decorator",
        "Read it as",
        "Where the link is stored"
      ],
      "rows": [
        [
          "`@ManyToOne`",
          "many products belong to one category",
          "in this table: a `categoryId` column"
        ],
        [
          "`@OneToMany`",
          "one category has many products",
          "nowhere new: it is the other side of a `@ManyToOne`, and needs one"
        ],
        [
          "`@ManyToMany` + `@JoinTable`",
          "a product has many tags, and a tag has many products",
          "in a third table, one row per link"
        ],
        [
          "`@OneToOne` + `@JoinColumn`",
          "one user has one profile",
          "in the table that has `@JoinColumn`"
        ]
      ]
    },
    {
      "kind": "example",
      "code": "// categories/category.entity.ts\n@Entity('categories')\nexport class Category {\n  @PrimaryGeneratedColumn('uuid')\n  id: string;\n\n  @Column({ length: 80, unique: true })\n  name: string;\n\n  @OneToMany(() => Product, (product) => product.category)   // no column here: the key lives on products\n  products: Product[];\n}\n\n// products/entities/product.entity.ts: the Module 14 columns, plus two relations\n@Entity('products')\nexport class Product {\n  // ...id, sku, name, price, stock, status, createdBy, createdAt, updatedAt...\n\n  @ManyToOne(() => Category, (category) => category.products, {\n    nullable: false,                   // every product has a category\n    onDelete: 'RESTRICT',              // refuse to delete a category that still has products\n  })\n  category: Category;\n\n  @Column('uuid')\n  categoryId: string;                  // the foreign key column itself: readable without a join\n\n  @ManyToMany(() => Tag, (tag) => tag.products)\n  @JoinTable({ name: 'product_tags' }) // only ONE side has @JoinTable: it owns the link table\n  tags: Tag[];\n}\n\n// tags/tag.entity.ts\n@Entity('tags')\nexport class Tag {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column({ length: 40, unique: true })\n  name: string;\n\n  @ManyToMany(() => Product, (product) => product.tags)      // the other side: no @JoinTable\n  products: Product[];\n}",
      "label": "catalog entities: category, product, tag (imports from typeorm left out)"
    },
    {
      "kind": "text",
      "text": "For the tags, the generated migration creates a `product_tags` table with two columns, `productsId` and `tagsId`, and an index on each. That is enough when a link is only a link. When the link has data of its own, such as a quantity and a price, do not use `@ManyToMany`. Make the link a real entity with two `@ManyToOne` relations. That is what `OrderItem` is:"
    },
    {
      "kind": "example",
      "code": "// users/entities/user.entity.ts: small for now. Module 17 adds the password and roles.\n@Entity('users')\nexport class User {\n  @PrimaryGeneratedColumn('uuid') id: string;\n  @Column({ length: 254, unique: true }) email: string;\n  @OneToMany(() => Order, (order) => order.user) orders: Order[];\n  @CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;\n}\n\n// orders/entities/order.entity.ts\nexport enum OrderStatus { Placed = 'placed', Paid = 'paid', Shipped = 'shipped', Cancelled = 'cancelled' }\n\n@Entity('orders')\nexport class Order {\n  @PrimaryGeneratedColumn('uuid')\n  id: string;\n\n  @ManyToOne(() => User, (user) => user.orders, { nullable: false, onDelete: 'RESTRICT' })\n  user: User;                          // deleting a user must not quietly delete their orders\n\n  @Column('uuid')\n  userId: string;\n\n  @OneToMany(() => OrderItem, (item) => item.order, { cascade: ['insert'] })\n  items: OrderItem[];                  // save(order) also INSERTs new items, and nothing more\n\n  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Placed })\n  status: OrderStatus;\n\n  @CreateDateColumn({ type: 'timestamptz' })\n  createdAt: Date;\n}\n\n// orders/entities/order-item.entity.ts: a link with data of its own\n@Entity('order_items')\nexport class OrderItem {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @ManyToOne(() => Order, (order) => order.items, { nullable: false, onDelete: 'CASCADE' })\n  order: Order;                        // an item cannot exist without its order\n\n  @Column('uuid')\n  orderId: string;\n\n  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })\n  product: Product;                    // a product with order history cannot be deleted\n\n  @Column()\n  productId: number;\n\n  @Column('int')\n  quantity: number;\n\n  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: decimal })\n  unitPrice: number;                   // a copy of the price on the day of the order\n}",
      "label": "order entities: user, order, order item"
    },
    {
      "kind": "text",
      "text": "Why keep `categoryId` and `orderId` as plain columns next to the relations? Because you can then read or set the key without loading the other row: `create({ categoryId })` instead of first fetching the whole category.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `Entity metadata for Product#category was not found`",
      "blocks": [
        {
          "kind": "text",
          "text": "With `autoLoadEntities`, an entity is loaded only when a module passes it to `forFeature()`. An entity that is only reached through a relation, like `Category` from `Product`, is not loaded, and the app fails at startup with this error. Nest logs it as `Unable to connect to the database. Retrying (1)...` and keeps retrying for about half a minute, so you go looking at the wrong thing. The real reason is in the stack trace printed under that line."
        },
        {
          "kind": "text",
          "text": "The fix: give every entity a home in some `forFeature()` call, for example `TypeOrmModule.forFeature([Product, Category, Tag])` in `ProductsModule`, or a small module of its own."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "`onDelete` and `cascade` are two different things"
    },
    {
      "kind": "table",
      "head": [
        "Option",
        "Lives in",
        "What it does"
      ],
      "rows": [
        [
          "`onDelete: 'RESTRICT'`",
          "the foreign key, inside the database",
          "refuses to delete a row that other rows still point at"
        ],
        [
          "`onDelete: 'CASCADE'`",
          "the foreign key, inside the database",
          "deleting the parent also deletes the rows that point at it, even when the delete is plain SQL"
        ],
        [
          "`onDelete: 'SET NULL'`",
          "the foreign key, inside the database",
          "keeps the child row and clears its link; the column must be nullable"
        ],
        [
          "`cascade: ['insert']`",
          "TypeORM, inside your app",
          "`save(order)` also inserts the new objects in `order.items`"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Key idea · one question picks `onDelete`",
      "blocks": [
        {
          "kind": "text",
          "text": "Ask: *can the child exist without the parent?* An order item cannot exist without its order, so `CASCADE`. An order must not disappear because someone deleted a user or a product, so `RESTRICT`. Rows like that are usually archived with a `status` column, not deleted."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Foreign keys bring new database errors, and until you translate them, the client gets a `500`, just like the `23505` before Module 14 caught it. Inserting a row that points at nothing, such as a `categoryId` with no category, fails with `23503`, a *foreign key violation*. That is the client's mistake: a `400`, as Module 8 said. Deleting a row that others still point at fails with `23001`, a *restrict violation*, under `RESTRICT` (under `NO ACTION` it is `23503` again). That is a `409`, with a code such as `PRODUCT_IN_USE`. So in `create()`, map `23503` to `400`; in `remove()`, wrap the `delete` in a `try`/`catch` and map `23001` and `23503` to `409`."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `cascade: true` on the wrong side",
      "blocks": [
        {
          "kind": "text",
          "text": "`cascade: true` means insert, update, remove, soft-remove and recover, all of them. On `Order.items` it lets `save(order)` change items you never meant to touch. On a `@ManyToOne` such as `OrderItem.product` it is worse: saving an item can write an old copy of the product, with yesterday's price and stock, over today's row."
        },
        {
          "kind": "text",
          "text": "Use the smallest list that works, such as `cascade: ['insert']`, and only from a parent to the children it owns. Never cascade towards shared rows like products, users or categories."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Loading relations, and the N+1 problem"
    },
    {
      "kind": "text",
      "text": "TypeORM does not load relations unless you ask. The tempting way to ask is a loop:"
    },
    {
      "kind": "example",
      "code": "// \"My orders\" page: 20 orders, each with its items and their products\nasync findMine(userId: string): Promise<Order[]> {\n  const orders = await this.orders.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 20 });\n  for (const order of orders) {\n    order.items = await this.items.find({ where: { orderId: order.id } });         // +1 query per order\n    for (const item of order.items) {\n      item.product = await this.products.findOneByOrFail({ id: item.productId });  // +1 query per item\n    }\n  }\n  return orders;            // 20 orders × 3 items: 1 + 20 + 60 = 81 queries\n}",
      "label": "orders/orders.service.ts",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "This is the **N+1 problem**: 1 query for the list, then 1 more query for each of the N rows (and here, 1 more for each item as well). With 20 orders of 3 items each, it sends 81 queries. Each query is a round trip to the database, so the page gets slower as the data grows, even though it felt instant on your laptop with 2 orders. Ask for the relations up front instead:"
    },
    {
      "kind": "example",
      "code": "// The same page, asking for the relations up front\nfindMine(userId: string): Promise<Order[]> {\n  return this.orders.find({\n    where: { userId },\n    relations: { items: { product: true } },     // the object form: works in TypeORM 0.3 and 1.x\n    order: { createdAt: 'DESC' },\n    take: 20,\n  });\n}\n\n// The same again with the query builder, for when you need more control\nfindMineQb(userId: string): Promise<Order[]> {\n  return this.orders\n    .createQueryBuilder('order')                 // 'order' is an alias for the orders table\n    .leftJoinAndSelect('order.items', 'item')    // LEFT JOIN, and put the rows in order.items\n    .leftJoinAndSelect('item.product', 'product')\n    .where('order.userId = :userId', { userId }) // :userId is a parameter, never string-glued\n    .orderBy('order.createdAt', 'DESC')\n    .take(20)                                    // with joins, use take/skip, not limit/offset\n    .getMany();\n}",
      "label": "orders/orders.service.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Both versions send **2 queries**, however many orders there are. Why 2 and not 1? With joins, a plain `LIMIT 20` would count joined rows (pairs of order and item), not orders. So TypeORM first selects the ids of 20 orders, then loads those orders with their items and products. Without `take`, it is a single query."
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Turn on query logging in development (`DB_LOGGING=true`) and watch the terminal while you click through a page. A wall of identical queries is N+1.",
        "Use the object form of `relations`, as above. TypeORM 0.3 also accepts strings (`['items', 'items.product']`), but TypeORM 1.0 removed them.",
        "Avoid `eager: true` and lazy relations (properties typed `Promise<...>`). Both load data without a visible line of code, which is exactly how N+1 sneaks in.",
        "When you really need a loop, batch it: collect the ids first, then make one `findBy({ id: In(ids) })` call."
      ]
    },
    {
      "kind": "quiz",
      "question": "`Order.items` is declared with `cascade: true`. What does that option do?",
      "options": [
        "Deleting an order row in the database also deletes its items",
        "`save(order)` also inserts or updates the items in `order.items`",
        "Every `find()` on orders loads the items automatically",
        "It adds `ON DELETE CASCADE` to the `orderId` foreign key"
      ],
      "answer": 1,
      "why": "**`save(order)` also inserts or updates the items.** `cascade` is a TypeORM feature that runs when you save the parent. The database rule that deletes children is a different option, `onDelete: 'CASCADE'`, and loading items automatically is a third one, `eager: true`. People mix these three up all the time, and the cost of mixing them up is either data you did not mean to write or data you did not mean to delete."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 15.1",
      "title": "Add categories to a table that already has products",
      "blocks": [
        {
          "kind": "text",
          "text": "Start from an empty database (`docker compose down -v`, then `up -d`) and turn `synchronize` off. Generate and run the first migration (`CreateProducts`), then insert two products. Now add the `Category` entity and the `category` relation on `Product`, and generate `AddCategories`. Run it. It fails with: `column \"categoryId\" of relation \"products\" contains null values`, and nothing is applied. Postgres cannot add a `NOT NULL` column to rows that have no value for it."
        },
        {
          "kind": "text",
          "text": "Fix the migration by hand so that it works on a table with data, and so that the next `migration:generate` reports *No changes in database schema were found*."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { MigrationInterface, QueryRunner } from 'typeorm';\n\nexport class AddCategories1791291640559 implements MigrationInterface {\n  name = 'AddCategories1791291640559';\n\n  public async up(queryRunner: QueryRunner): Promise<void> {\n    await queryRunner.query(`CREATE TABLE \"categories\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(),\n      \"name\" character varying(80) NOT NULL, CONSTRAINT \"UQ_8b0be371d28245da6e4f4b61878\" UNIQUE (\"name\"),\n      CONSTRAINT \"PK_24dbc6126a28ff948da33e97d3b\" PRIMARY KEY (\"id\"))`);\n\n    // 1. Add the column WITHOUT \"NOT NULL\", so the rows that already exist are allowed.\n    await queryRunner.query(`ALTER TABLE \"products\" ADD \"categoryId\" uuid`);\n\n    // 2. Backfill: give every existing product a category.\n    await queryRunner.query(`INSERT INTO \"categories\" (\"name\") VALUES ('Uncategorised')`);\n    await queryRunner.query(`UPDATE \"products\" SET \"categoryId\" =\n      (SELECT \"id\" FROM \"categories\" WHERE \"name\" = 'Uncategorised')`);\n\n    // 3. Every row has a value now, so the rule can be switched on.\n    await queryRunner.query(`ALTER TABLE \"products\" ALTER COLUMN \"categoryId\" SET NOT NULL`);\n    await queryRunner.query(`ALTER TABLE \"products\" ADD CONSTRAINT \"FK_ff56834e735fa78a15d0cf21926\"\n      FOREIGN KEY (\"categoryId\") REFERENCES \"categories\"(\"id\") ON DELETE RESTRICT ON UPDATE NO ACTION`);\n  }\n\n  public async down(queryRunner: QueryRunner): Promise<void> {\n    await queryRunner.query(`ALTER TABLE \"products\" DROP CONSTRAINT \"FK_ff56834e735fa78a15d0cf21926\"`);\n    await queryRunner.query(`ALTER TABLE \"products\" DROP COLUMN \"categoryId\"`);\n    await queryRunner.query(`DROP TABLE \"categories\"`);\n  }\n}",
              "label": "src/database/migrations/1791291640559-AddCategories.ts (fixed by hand)"
            },
            {
              "kind": "text",
              "text": "This is the most common shape of a hand-written migration: add the column as nullable, fill it in, then switch the rule on. It is often called *expand, backfill, contract*. On a big table, the backfill `UPDATE` can be slow and hold locks, so production teams run it in batches, but the three steps stay the same. Run `migration:generate` once more afterwards: *No changes* proves the hand-written SQL matches the entities exactly.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 15.2",
      "title": "Count the queries",
      "blocks": [
        {
          "kind": "text",
          "text": "Seed one user with 20 orders of 3 items each. Write both versions of `findMine` and turn on `DB_LOGGING=true`. Count the queries each one sends. Then remove `take: 20` from the good version and count again."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "The loop: **81** queries (1 for the orders, 20 for the items, 60 for the products).",
                "`relations` with `take`, or the query builder with `take`: **2**. The first is a `SELECT DISTINCT` of order ids with the limit; the second loads those orders with everything joined.",
                "`relations` without `take`: **1** query."
              ]
            },
            {
              "kind": "text",
              "text": "The number that matters is not 81. It is that the loop grows with the data and the good version does not. Write that down as a habit: before you ship a list endpoint, look at the log once and count.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q25",
      "title": "What are migrations, and how do you run them safely in production?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A migration is a versioned, ordered change to the database schema, with an `up` that applies it and a `down` that reverts it. With TypeORM I generate it from the entity diff with the CLI, against a data source file that lives outside Nest, and then I read and edit it. Generated SQL can drop and re-add a column for a type change, or add a `NOT NULL` column that fails on existing rows. Those I rewrite as `ALTER COLUMN ... TYPE`, or as add-nullable, backfill, then `SET NOT NULL`."
        },
        {
          "kind": "text",
          "text": "Migrations are committed with the code, reviewed in the pull request, and run as a separate deploy step before the new version takes traffic. TypeORM records each applied migration in a `migrations` table, so each one runs once per database. I never edit a migration that has already run on a shared database; I add a new one. And because old and new code overlap during a deploy, I keep changes backward-compatible: add a column first, ship the code that uses it, and drop the old column in a later release."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q26",
      "title": "What is the N+1 problem, and how do you fix it in TypeORM?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It is one query to load a list, followed by one more query per item to load a related row, usually inside a loop or hidden behind lazy loading. Each query is cheap on its own, but the number of round trips grows with the data, so an endpoint that is fast in development becomes slow in production. With 20 orders and 3 items each, the loop version sends 81 queries."
        },
        {
          "kind": "text",
          "text": "The fix is to load relations in the same query or in a small, fixed number of queries: `find` with `relations: { items: { product: true } }`, or a query builder with `leftJoinAndSelect`. With pagination over joins I use `take` and `skip`, so TypeORM limits the parent rows and not the joined rows. When I need data from somewhere else, I batch it: collect the ids, then one `In(ids)` query. And to catch it early, I keep query logging on in development and count the queries for each list endpoint."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 16: placing an order writes to three tables at once. Transactions make that all-or-nothing, locks stop two orders from selling the same last item, and indexes make the reads fast."
    }
  ]
};
