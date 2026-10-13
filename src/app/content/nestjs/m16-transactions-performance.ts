import { Lesson } from '../../shared/content';

export const M16_TRANSACTIONS_PERFORMANCE: Lesson = {
  "slug": "m16-transactions-performance",
  "title": "M16 Transactions and query performance",
  "nav": "Transactions & speed",
  "num": "M16",
  "eyebrow": "Level 5 · Week 9 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Placing an order is not one write. It is several: create the order, create its items, and take the bought amount off each product's stock. If something fails halfway, you can end up with an order that has no items, or with stock that was sold but never taken off. A **transaction** groups several statements so that they all happen, or none of them do."
    },
    {
      "kind": "text",
      "text": "The second half of the module is speed: paging through big tables, reading only the columns you need, adding **indexes**, and reading the database's own explanation of a slow query with `EXPLAIN`."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "A transaction is all-or-nothing: either every change in it is saved, or none is."
        },
        {
          "kind": "text",
          "text": "A lock stops two requests from changing the same row at the same moment."
        },
        {
          "kind": "text",
          "text": "An index is like the index at the back of a book. The database jumps to the right rows instead of reading every row."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Without a transaction"
    },
    {
      "kind": "text",
      "text": "Here is the order flow written the obvious way, with three separate saves:"
    },
    {
      "kind": "example",
      "code": "async place(userId: string, dto: CreateOrderDto): Promise<Order> {\n  const order = await this.orders.save(this.orders.create({ userId }));            // write 1\n  for (const line of dto.items) {\n    const product = await this.products.findOneByOrFail({ id: line.productId });\n    if (product.stock < line.quantity) {\n      // Too late: the order row is already saved, maybe with some of its items too.\n      throw new InsufficientStockException(String(product.id), line.quantity, product.stock);\n    }\n    await this.items.save({ orderId: order.id, productId: product.id,\n      quantity: line.quantity, unitPrice: product.price });                         // write 2\n    product.stock -= line.quantity;     // two requests can both read stock = 1 here...\n    await this.products.save(product);  // write 3: ...and both write stock = 0. Sold twice.\n  }\n  return order;\n}",
      "label": "orders/orders.service.ts",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "Try it with two lines, where the second product does not have enough stock. The request fails with Module 8's `409 INSUFFICIENT_STOCK`, as it should, and yet the database has gained an order, one item, and a lower stock for the first product. Nothing undid the writes that had already happened. The code has a second, quieter bug as well: two requests can read the same stock value at the same moment. The quiz below is about that one."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Two ways to run a transaction"
    },
    {
      "kind": "text",
      "text": "A transaction starts with `START TRANSACTION`. It ends with `COMMIT`, which saves every change at once, or with `ROLLBACK`, which throws every change away. TypeORM's `dataSource.transaction()` does all three for you: it commits when your callback finishes, and rolls back when your callback throws."
    },
    {
      "kind": "example",
      "code": "import { Injectable, NotFoundException } from '@nestjs/common';\nimport { DataSource, EntityManager, In } from 'typeorm';\nimport { InsufficientStockException } from '../common/exceptions/insufficient-stock.exception';\nimport { Product } from '../products/entities/product.entity';\nimport { CreateOrderDto } from './dto/create-order.dto';\nimport { OrderItem } from './entities/order-item.entity';\nimport { Order } from './entities/order.entity';\n\n@Injectable()\nexport class OrdersService {\n  constructor(private readonly dataSource: DataSource) {}   // Nest can inject the DataSource itself\n\n  place(userId: string, dto: CreateOrderDto): Promise<Order> {\n    // Everything inside the callback is ONE transaction. Throw anywhere, and all of it is undone.\n    return this.dataSource.transaction((manager) => this.placeWith(manager, userId, dto));\n  }\n\n  private async placeWith(manager: EntityManager, userId: string, dto: CreateOrderDto): Promise<Order> {\n    // Lock the product rows we are about to change. Sorted ids give every request the same\n    // lock order, so two orders can never wait for each other forever (a deadlock).\n    const ids = [...new Set(dto.items.map((line) => line.productId))].sort((a, b) => a - b);\n    const products = await manager.find(Product, {\n      where: { id: In(ids) },\n      order: { id: 'ASC' },\n      lock: { mode: 'pessimistic_write' },                   // SELECT ... FOR UPDATE\n    });\n    const byId = new Map(products.map((p) => [p.id, p]));\n\n    const items = dto.items.map((line) => {\n      const product = byId.get(line.productId);\n      if (!product) {\n        throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: `Product ${line.productId} not found` });\n      }\n      if (product.stock < line.quantity) {\n        throw new InsufficientStockException(String(product.id), line.quantity, product.stock);  // Module 8\n      }\n      product.stock -= line.quantity;\n      return manager.create(OrderItem, { productId: product.id, quantity: line.quantity, unitPrice: product.price });\n    });\n\n    await manager.save(products);                                    // the new stock levels\n    return manager.save(manager.create(Order, { userId, items }));   // the order and its items\n  }\n}",
      "label": "orders/orders.service.ts",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Inside the callback, every query must go through `manager`, the `EntityManager` that belongs to this transaction. That is why the steps live in `placeWith(manager, ...)`.",
        "`lock: { mode: 'pessimistic_write' }` adds `FOR UPDATE` to the `SELECT`. Another transaction that wants the same rows now waits until this one commits or rolls back.",
        "The stock check happens *after* the lock, so no other request can change the stock between the check and the write.",
        "Any `throw`, including the `NotFoundException` and `InsufficientStockException` above, rolls everything back: no order, no items, no stock change."
      ]
    },
    {
      "kind": "text",
      "text": "The second way is a `QueryRunner`: the same transaction, with manual control over every step. The Nest docs recommend it for exactly that control:"
    },
    {
      "kind": "example",
      "code": "async placeWithQueryRunner(userId: string, dto: CreateOrderDto): Promise<Order> {\n  const runner = this.dataSource.createQueryRunner();\n  await runner.connect();                  // take one connection from the pool\n  await runner.startTransaction();         // or startTransaction('SERIALIZABLE')\n  try {\n    const order = await this.placeWith(runner.manager, userId, dto);   // the same steps as before\n    await runner.commitTransaction();\n    return order;\n  } catch (err) {\n    await runner.rollbackTransaction();\n    throw err;\n  } finally {\n    await runner.release();                // ALWAYS give the connection back\n  }\n}",
      "label": "orders/orders.service.ts (the QueryRunner version)"
    },
    {
      "kind": "text",
      "text": "For everyday code, `dataSource.transaction()` is the safer choice, because it cannot forget the `rollback` or the `release`. A forgotten `release()` leaks a connection, and once the pool is empty, every request waits.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · a query that escapes the transaction",
      "blocks": [
        {
          "kind": "text",
          "text": "Inside the callback, `this.products.save(...)` looks harmless, but an injected repository uses its own connection from the pool. That write is *outside* your transaction: it stays even when the transaction rolls back. Worse, if your transaction has already locked that row, the outside write waits for your lock while your code waits for the write, and the request hangs."
        },
        {
          "kind": "text",
          "text": "Rule: inside a transaction, use only `manager` (`manager.find`, `manager.save`, `manager.getRepository(Product)`), and pass the manager to any helper that takes part."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Isolation, briefly"
    },
    {
      "kind": "text",
      "text": "*Isolation* decides what one transaction can see of other transactions that run at the same time. Postgres has three useful levels:"
    },
    {
      "kind": "table",
      "head": [
        "Level",
        "What the transaction sees",
        "When to use it"
      ],
      "rows": [
        [
          "`READ COMMITTED` (the default)",
          "each statement sees the data committed before that statement began",
          "almost always, with locks for read-then-write steps"
        ],
        [
          "`REPEATABLE READ`",
          "one snapshot of the data for the whole transaction; a clashing update fails with a serialization error",
          "reports and multi-step reads that must agree with each other"
        ],
        [
          "`SERIALIZABLE`",
          "the same result as if the transactions had run one after another; Postgres aborts one of two clashing transactions",
          "complex rules across rows; retry when it fails"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Choose the level with `dataSource.transaction('SERIALIZABLE', (manager) => ...)` or `runner.startTransaction('SERIALIZABLE')`. A transaction that Postgres aborts fails with error code `40001`, and the right response is to run the whole transaction again.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Locks: pessimistic and optimistic"
    },
    {
      "kind": "text",
      "text": "A **pessimistic** lock expects a clash and blocks it in advance: `FOR UPDATE` makes the others wait. An **optimistic** lock expects no clash, lets everyone work, and checks at the end. TypeORM supports optimistic locking with a version number on the row:"
    },
    {
      "kind": "example",
      "code": "// products/entities/product.entity.ts\n@VersionColumn()\nversion: number;              // TypeORM adds 1 on every save() and update()\n\n// products/dto/update-product.dto.ts\nexport class UpdateProductDto extends PartialType(CreateProductDto) {\n  @IsInt() @Min(1)\n  version: number;            // the version the client loaded, sent back with the edit\n}\n\n// products/products.service.ts\nasync update(id: number, dto: UpdateProductDto): Promise<Product> {\n  const { version, ...changes } = dto;\n  // roughly: UPDATE \"products\" SET ..., \"version\" = \"version\" + 1 WHERE \"id\" = :id AND \"version\" = :version\n  const result = await this.products.update({ id, version }, changes);\n  if (result.affected === 0) {\n    const exists = await this.products.existsBy({ id });\n    throw exists\n      ? new ConflictException({ code: 'STALE_VERSION', message: 'This product changed since you loaded it' })\n      : this.notFound(id);\n  }\n  return this.findOne(id);\n}",
      "label": "optimistic locking with @VersionColumn"
    },
    {
      "kind": "text",
      "text": "The client loads the product with `version: 3`, edits it for a minute, and sends `version: 3` back. If someone else saved in between, the row now says `4`, the `WHERE` matches nothing, `affected` is `0`, and the client gets `409 STALE_VERSION` instead of silently overwriting the other person's change."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `@VersionColumn` alone does not stop lost updates",
      "blocks": [
        {
          "kind": "text",
          "text": "TypeORM increments the version on every `save()`, but `save()` does not check it: the SQL it sends is `UPDATE ... SET ..., \"version\" = \"version\" + 1 WHERE \"id\" IN ($2)`. Two people can still overwrite each other. The protection comes only from putting the version into the `WHERE`, as `update({ id, version }, changes)` does above."
        },
        {
          "kind": "text",
          "text": "Also check the migration when you add the column: the generated `ADD \"version\" integer NOT NULL` fails on a table that has rows. Add it with `DEFAULT 1`, then drop the default, as in Exercise 15.1."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Key idea · pick the lightest tool that works",
      "blocks": [
        {
          "kind": "table",
          "head": [
            "Situation",
            "Tool"
          ],
          "rows": [
            [
              "Change one number from its current value, such as stock minus 1",
              "one conditional statement: `UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock >= 1`, then check `affected`"
            ],
            [
              "Read several rows, decide, then write them",
              "a transaction with `pessimistic_write`, as in `placeWith()`"
            ],
            [
              "A person edits a form for minutes, then saves",
              "optimistic: a `@VersionColumn` in the `WHERE`"
            ]
          ]
        },
        {
          "kind": "text",
          "text": "A single SQL statement is already atomic: Postgres runs it all or not at all, so it needs no extra transaction or lock."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · slow work inside a transaction",
      "blocks": [
        {
          "kind": "text",
          "text": "A transaction holds its locks until it ends. Call a payment API or send an email inside one, and every other order for those products waits for that network call. Each waiting request also holds a database connection, so a slow outside service can empty your pool and stall the whole app."
        },
        {
          "kind": "text",
          "text": "Keep transactions short and local: only database work inside. Call outside services after the commit, or put the job on a queue (Module 23)."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Pagination: offset or keyset"
    },
    {
      "kind": "table",
      "head": [
        "",
        "Offset (`skip` / `take`)",
        "Keyset (a cursor)"
      ],
      "rows": [
        [
          "The SQL",
          "`LIMIT 20 OFFSET 10000`",
          "`WHERE id < 5 ORDER BY id DESC LIMIT 21`"
        ],
        [
          "Page 500",
          "Postgres still reads, then throws away, the 10,000 rows before it",
          "as fast as page 1: the index jumps straight to the cursor"
        ],
        [
          "Rows added while paging",
          "everything shifts: you see some rows twice and miss others",
          "stable"
        ],
        [
          "Jump to page 37",
          "yes",
          "no, only the next page"
        ],
        [
          "Good for",
          "admin tables with page numbers, small data",
          "feeds, infinite scroll, public APIs, big tables"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "A *cursor* is a bookmark: the sort value of the last row the client saw. The next page asks for rows after it."
    },
    {
      "kind": "example",
      "code": "// products/dto/list-products.dto.ts: Module 7's DTO, plus one field\nexport class ListProductsDto {\n  // ...page, limit, search, sortBy and order, exactly as in Module 7...\n\n  @Type(() => Number) @IsInt() @Min(1) @IsOptional()\n  after?: number;                 // new: the cursor, the last id the client saw\n}\n\n// products/products.service.ts\n// GET /api/products?limit=2          → { items: [{ id: 6 }, { id: 5 }], nextCursor: 5 }\n// GET /api/products?limit=2&after=5  → { items: [{ id: 4 }, { id: 3 }], nextCursor: 3 }\nasync listLive({ limit, after, search }: ListProductsDto) {\n  const qb = this.products\n    .createQueryBuilder('p')\n    .select(['p.id', 'p.name', 'p.price'])               // only the columns the list shows\n    .where('p.status = :status', { status: ProductStatus.Live })\n    .orderBy('p.id', 'DESC')                              // newest first: ids only go up\n    .take(limit + 1);                                     // one extra row: is there a next page?\n  if (search) qb.andWhere('p.name ILIKE :search', { search: `%${search}%` });\n  if (after) qb.andWhere('p.id < :after', { after });    // continue after the cursor\n\n  const rows = await qb.getMany();\n  const items = rows.slice(0, limit);\n  return { items, nextCursor: rows.length > limit ? items[items.length - 1].id : null };\n}",
      "label": "keyset pagination"
    },
    {
      "kind": "text",
      "text": "In the controller, Module 13's public `GET /api/products` now passes the query on: `list(@Query() query: ListProductsDto) { return this.products.listLive(query); }`. Keyset paging fixes the order, newest first by `id`, so `listLive` uses `limit`, `search` and `after` and ignores `page`, `sortBy` and `order`; those stay on the DTO for an offset list with page numbers, such as an admin table. This sorts by `id`, which is unique, so the cursor is one number. To sort by a column that repeats, such as `price`, put both values in the cursor and compare them together: `(p.price, p.id) > (:price, :id)`. The `.select([...])` call is the other cheap win here: the list reads 3 columns, not every column of every row. With `find()`, the same thing is `select: { id: true, name: true, price: true }`.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Indexes"
    },
    {
      "kind": "text",
      "text": "An **index** is a sorted copy of one or more columns, with a pointer to each row. Postgres makes one for every primary key and every `unique` column. It does **not** make one for a foreign key column: `orders.userId` and `order_items.orderId` had no index at all until we asked for one. Declare indexes on the entity, and the next migration creates them:"
    },
    {
      "kind": "example",
      "code": "// orders/entities/order.entity.ts\n@Entity('orders')\n@Index(['userId', 'createdAt'])       // \"my orders, newest first\": filter by user, then sort by date\nexport class Order { /* ...as in Module 15... */ }\n\n// orders/entities/order-item.entity.ts\n@Index()                              // find an order's items without reading the whole table\n@Column('uuid')\norderId: string;\n\n// products/entities/product.entity.ts\n@Entity('products')\n@Index(['status', 'id'])              // the live list above: WHERE status = ... ORDER BY id DESC\nexport class Product { /* ... */ }\n\n// What migration:generate wrote for them:\n//   CREATE INDEX \"IDX_30e6836e8539f85bfc47198067\" ON \"orders\" (\"userId\", \"createdAt\")\n//   CREATE INDEX \"IDX_f1d359a55923bb45b057fbdab0\" ON \"order_items\" (\"orderId\")\n//   CREATE INDEX \"IDX_286376ca463c717fc8ef4569d6\" ON \"products\" (\"status\", \"id\")",
      "label": "@Index on the entities"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Column order matters. `(userId, createdAt)` is built for `WHERE userId = ... ORDER BY createdAt`, and it also serves `WHERE userId = ...` alone. A filter on `createdAt` alone mostly cannot use it: before Postgres 18 not at all, and Postgres 18's new *skip scan* helps only in some cases. If you often filter by date alone, give that its own index.",
        "Indexes are not free. Each one takes disk space and makes every insert and update a little slower. Add them for the queries you really run.",
        "On a big, busy production table, a normal `CREATE INDEX` blocks writes while it builds. Use `CREATE INDEX CONCURRENTLY` in a hand-written migration. It cannot run inside a transaction, so that migration sets `transaction = false`, which needs the data source option `migrationsTransactionMode: 'each'`."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Reading `EXPLAIN`"
    },
    {
      "kind": "text",
      "text": "`EXPLAIN` shows the *plan* that Postgres chose for a query. `EXPLAIN ANALYZE` also runs the query and adds the real times. Here is \"my orders, newest first\" on 200,000 orders, before and after the index above:"
    },
    {
      "kind": "example",
      "code": "EXPLAIN ANALYZE\nSELECT \"id\", \"status\", \"createdAt\" FROM \"orders\"\nWHERE \"userId\" = '7884ad9b-7f2f-496e-b1dd-f29d71e6c940'\nORDER BY \"createdAt\" DESC LIMIT 20;\n\n-- 1. Before: no index on \"userId\". 200,000 orders from 2,000 users.\nLimit  (cost=4372.66..4372.71 rows=20 width=28) (actual time=36.396..36.599 rows=20.00 loops=1)\n  Buffers: shared hit=1870\n  ->  Sort  (cost=4372.66..4372.91 rows=100 width=28) (actual time=36.385..36.463 rows=20.00 loops=1)\n        Sort Key: \"createdAt\" DESC\n        Sort Method: top-N heapsort  Memory: 19kB\n        Buffers: shared hit=1870\n        ->  Seq Scan on orders  (cost=0.00..4370.00 rows=100 width=28) (actual time=0.244..35.730 rows=100.00 loops=1)\n              Filter: (\"userId\" = '7884ad9b-7f2f-496e-b1dd-f29d71e6c940'::uuid)\n              Rows Removed by Filter: 199900\n              Buffers: shared hit=1870\nPlanning Time: 1.018 ms\nExecution Time: 36.858 ms\n\n-- 2. After: @Index(['userId', 'createdAt']) and its migration.\nLimit  (cost=0.42..79.97 rows=20 width=28) (actual time=0.391..0.847 rows=20.00 loops=1)\n  Buffers: shared hit=20 read=4\n  ->  Index Scan Backward using \"IDX_30e6836e8539f85bfc47198067\" on orders  (cost=0.42..398.17 rows=100 width=28) (actual time=0.382..0.707 rows=20.00 loops=1)\n        Index Cond: (\"userId\" = '7884ad9b-7f2f-496e-b1dd-f29d71e6c940'::uuid)\n        Index Searches: 1\n        Buffers: shared hit=20 read=4\nPlanning Time: 0.654 ms\nExecution Time: 0.929 ms",
      "lang": "text",
      "label": "EXPLAIN ANALYZE, Postgres 18"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Read the plan from the most indented line outwards: that line runs first.",
        "`Seq Scan on orders` means Postgres read the whole table. `Rows Removed by Filter: 199900` says it threw almost all of it away. That pair of lines is what a missing index looks like.",
        "`Index Scan Backward using ...` jumped straight to this user's rows, already sorted. (*Backward* because the index is ascending and we asked for `DESC`.)",
        "`cost` is Postgres's own estimate, in made-up units. `actual time` is in milliseconds. `Buffers` counts 8 kB pages: 1,870 before, 24 after. The time fell from 36.9 ms to 0.9 ms.",
        "`EXPLAIN ANALYZE` really runs the statement. For an `UPDATE` or `DELETE`, wrap it in `BEGIN;` ... `ROLLBACK;`.",
        "Postgres 18 prints `Buffers` by default with `ANALYZE`. On older versions, write `EXPLAIN (ANALYZE, BUFFERS)`."
      ]
    },
    {
      "kind": "text",
      "text": "To get the SQL that TypeORM sends, turn on `logging`, or call `.getSql()` on a query builder. Measure on realistic amounts of data: with 50 rows, every plan is fast.",
      "style": "small"
    },
    {
      "kind": "quiz",
      "question": "Two requests buy the last unit of a product at the same moment. Each runs in its own transaction at Postgres's default level: read the stock (1), check it, then save stock = 0. There are no locks. What happens?",
      "options": [
        "The second request fails, because transactions prevent races",
        "Both succeed: two orders for one item, and the stock says 0",
        "Postgres notices the clash and rolls one transaction back",
        "The two transactions deadlock, and Postgres cancels one"
      ],
      "answer": 1,
      "why": "**Both succeed.** A transaction makes *your* writes all-or-nothing. It does not stop another transaction from reading the same row before you change it. At `READ COMMITTED`, both read 1, both pass the check, and both write 0. This is called a *lost update*. The fixes are in this module: lock the row first (`pessimistic_write`), do the check and the change in one statement (`UPDATE ... SET stock = stock - 1 WHERE id = $1 AND stock >= 1`, then look at `affected`), or use `SERIALIZABLE` and retry the transaction that fails."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 16.1",
      "title": "Sell the last five items to twenty people",
      "blocks": [
        {
          "kind": "text",
          "text": "Create a product with `stock: 5`. Module 10's demo users have no rows in `users`, and `orders.userId` is a foreign key, so for this test only, mark the route `@Public()` and read the user id from an `x-user-id` header that holds the id of a real user. It is a stand-in until Module 17, not security: remove both afterwards. Then send 20 orders for that product at the same moment, and count the answers."
        },
        {
          "kind": "text",
          "text": "Run it against the transactional `place()`. Then switch the controller to the naive version and run it again with a fresh product. Compare the number of orders, the items sold, and the stock left."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// race.ts: 20 shoppers try to buy the same product at the same moment. Its stock is 5.\n// Run with: USER_ID=... PRODUCT_ID=... npx ts-node race.ts   (Node 18+ has fetch built in)\n// For this test only, POST /api/orders is @Public() and reads the user id from x-user-id.\nconst USER_ID = process.env.USER_ID ?? '';\nconst PRODUCT_ID = Number(process.env.PRODUCT_ID);\n\nasync function main() {\n  const body = JSON.stringify({\n    shippingAddress: { line1: '1 Test Street', city: 'Leeds', postcode: 'LS1 1AA' },   // Module 12's DTO needs it\n    items: [{ productId: PRODUCT_ID, quantity: 1 }],\n  });\n  const statuses = await Promise.all(\n    Array.from({ length: 20 }, () =>\n      fetch('http://localhost:3000/api/orders', {\n        method: 'POST',\n        headers: { 'content-type': 'application/json', 'x-user-id': USER_ID },\n        body,\n      }).then((res) => res.status),\n    ),\n  );\n  const count = (status: number) => statuses.filter((s) => s === status).length;\n  console.log({ created: count(201), outOfStock: count(409), other: statuses.length - count(201) - count(409) });\n  // With the transaction and the lock: { created: 5, outOfStock: 15, other: 0 }\n}\n\nvoid main();",
              "label": "race.ts"
            },
            {
              "kind": "text",
              "text": "With the transaction and the lock you get exactly 5 orders and 15 answers of `409`, and the stock ends at 0. The naive version usually creates more than 5 orders, and its stock no longer matches the items sold, because requests read the same stock value at the same moment. Races depend on timing, so run it a few times. A bug that shows up only 1 time in 20 is still a bug in production, where twenty people really do click at once.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 16.2",
      "title": "Make \"my orders\" fast",
      "blocks": [
        {
          "kind": "text",
          "text": "Seed 200,000 orders spread over 2,000 users; a single `INSERT ... SELECT` from `generate_series` does it in seconds. Run `EXPLAIN ANALYZE` on one user's 20 newest orders. Add `@Index(['userId', 'createdAt'])`, generate and run the migration, and compare the two plans."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "Before: a `Seq Scan` with about 199,900 rows removed by the filter. After: an `Index Scan Backward` on the new index, with the `Buffers` count falling from thousands of pages to a couple of dozen. Your milliseconds will differ from the example above; compare the shape of the plan, not the exact numbers."
            },
            {
              "kind": "text",
              "text": "Then filter by date alone: `WHERE \"createdAt\" > now() - interval '7 days'`. Postgres goes back to a `Seq Scan`, because the index is sorted by user first and cannot jump to a range of dates. (On a very narrow range, Postgres 18 may use the index anyway with its new *skip scan*, which shows as `Index Searches` above 1. Do not plan around it.)",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q27",
      "title": "When do you need a transaction, and how do you use one with TypeORM in NestJS?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Whenever several writes must succeed or fail together, such as an order, its items and the stock decrements, and whenever I read data, decide something, and write based on that decision. I use `dataSource.transaction(async (manager) => ...)`, which commits when the callback resolves and rolls back when it throws. Every query inside goes through that `manager`, because an injected repository runs on another connection, outside the transaction. When I need manual control I use a `QueryRunner`: `connect`, `startTransaction`, commit or rollback in a `try`/`catch`, and always `release` in `finally`."
        },
        {
          "kind": "text",
          "text": "A transaction alone does not stop races. At `READ COMMITTED`, two transactions can read the same stock and both write. So I add `pessimistic_write` (`SELECT ... FOR UPDATE`) on the rows I am about to change, locked in a consistent order to avoid deadlocks, or I make the change a single conditional `UPDATE` and check the affected count. For edits that a person makes over minutes, I use optimistic locking with a version column in the `WHERE`. And I keep transactions short: no HTTP calls or emails inside, because the locks are held until commit."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q28",
      "title": "A list endpoint got slow as the table grew. How do you find and fix the cause?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** First I measure, not guess. I turn on query logging or use the query builder's `getSql()` to get the exact SQL, count how many queries one request sends, and look for N+1. Then I run `EXPLAIN ANALYZE` on the slow query with realistic data. A `Seq Scan` with a large `Rows Removed by Filter`, or a big sort, usually means a missing index. Foreign key columns are the classic case, because Postgres does not index them automatically."
        },
        {
          "kind": "text",
          "text": "The fixes, in order: add the right index, composite with the filter column first, then the sort column, through a migration (with `CREATE INDEX CONCURRENTLY` on a big production table); remove N+1 with joins or batched `In()` queries; select only the columns the response needs; and replace deep `OFFSET` pagination with keyset pagination, which stays fast on page 500. Then I run `EXPLAIN ANALYZE` again to confirm the plan changed, and I keep a hard maximum on page size so one request can never ask for the whole table."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Your data is now safe, consistent and fast. Next, Module 17 asks who is calling: passwords stored as bcrypt hashes, login, and JSON Web Tokens."
    }
  ]
};
