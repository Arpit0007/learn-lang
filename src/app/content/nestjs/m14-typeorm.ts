import { Lesson } from '../../shared/content';

export const M14_TYPEORM: Lesson = {
  "slug": "m14-typeorm",
  "title": "M14 PostgreSQL with TypeORM",
  "nav": "PostgreSQL & TypeORM",
  "num": "M14",
  "eyebrow": "Level 5 · Week 8 · ~3 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 5 · Weeks 8–10 · Data and identity",
      "blocks": [
        {
          "kind": "text",
          "text": "A real database first: PostgreSQL, entities, migrations, relations and transactions. Then a complete login system built on it: hashed passwords, JWTs, refresh tokens and roles."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Until now your products lived in an array in memory. Restart the server and they were gone. In Level 5 they move into **PostgreSQL** (usually called *Postgres*), a database server that keeps data safely on disk. Modules 14 to 16 are about storing data. Modules 17 and 18 are about who may touch it."
    },
    {
      "kind": "text",
      "text": "You will not write SQL by hand for every query. **TypeORM** is an *ORM*, short for object-relational mapper: a library that maps TypeScript classes to database tables. You describe a table as a class, called an **entity**, and TypeORM writes the SQL for you. The `@nestjs/typeorm` package plugs TypeORM into Nest's dependency injection, so a service can simply ask for what it needs."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "A database keeps your data when the server stops."
        },
        {
          "kind": "text",
          "text": "An entity is a class that describes one table. Each object of that class is one row."
        },
        {
          "kind": "text",
          "text": "A repository is the object you ask to read and write the rows of one table."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "Angular never touched a database. The browser called an API, and the API stored the data. Now you are that API, so this is new ground. The good news is that the Nest side stays familiar: you still write a module and a service, and you still use constructor injection. Only the thing you inject is new."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Step 1 · Run Postgres in Docker"
    },
    {
      "kind": "text",
      "text": "**Docker** runs a program inside a *container*: a small, isolated box with everything that program needs. An *image* is the recipe for the box, and `postgres:18` is the official Postgres 18 image. **Docker Compose** reads one YAML file that describes your containers and starts them with one command. Nobody on the team installs Postgres by hand, and everyone runs the same version."
    },
    {
      "kind": "example",
      "code": "# Postgres for local development. Not a production setup.\nservices:\n  db:\n    image: postgres:18                    # pin the major version\n    restart: unless-stopped\n    environment:                          # Compose fills ${...} in from .env\n      POSTGRES_USER: ${DB_USER}\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n      POSTGRES_DB: ${DB_NAME}\n    ports:\n      - '5432:5432'                       # your machine's port : the container's port\n    volumes:\n      - pgdata:/var/lib/postgresql        # the data lives here, outside the container\n    healthcheck:\n      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER} -d ${DB_NAME}']\n      interval: 5s\n      timeout: 3s\n      retries: 10\n\nvolumes:\n  pgdata:",
      "lang": "text",
      "label": "docker-compose.yml"
    },
    {
      "kind": "text",
      "text": "A *volume* is storage that lives outside the container, so removing the container does not remove your data. Version note: Postgres 18 and newer images keep their data under `/var/lib/postgresql`, as above. For the 17 image and older, mount `/var/lib/postgresql/data` instead.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "The `${DB_USER}` values come from a `.env` file next to the compose file. Nest will read the same file, so the connection details live in one place:"
    },
    {
      "kind": "example",
      "code": "# Local development values only. Put .env in .gitignore.\nDB_HOST=localhost\nDB_PORT=5432\nDB_USER=shop\nDB_PASSWORD=local-dev-only-password\nDB_NAME=shop\nDB_SYNC=true\nDB_LOGGING=true",
      "lang": "text",
      "label": ".env"
    },
    {
      "kind": "example",
      "code": "docker compose up -d          # start Postgres in the background\ndocker compose ps             # wait until STATUS says \"(healthy)\"\n\nnpm i @nestjs/typeorm@11 typeorm pg @nestjs/config@4\n\n# later:\ndocker compose down           # stop it; the data stays in the pgdata volume\ndocker compose down -v        # stop it AND delete the data: a clean start",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "The `@11` and `@4` pick the releases made for Nest 11. npm's newest releases of the Nest packages are built for Nest 12, and some of them refuse to install into a Nest 11 project. Keep `.env` out of git, and commit a `.env.example` with the same names and fake values, so a new teammate knows what to set. `pg` is the Postgres *driver*: the low-level library that actually talks to the database. TypeORM uses it for you.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Step 2 · Connect Nest to Postgres"
    },
    {
      "kind": "text",
      "text": "First, the version you will find in many tutorials:"
    },
    {
      "kind": "example",
      "code": "@Module({\n  imports: [\n    TypeOrmModule.forRoot({\n      type: 'postgres',\n      host: 'localhost',\n      port: 5432,\n      username: 'shop',\n      password: 'local-dev-only-password',   // a password in the code: in git history forever\n      database: 'shop',\n      entities: [Product],                  // every new entity must be added here by hand\n      synchronize: true,                    // ...and this is on in production too\n    }),\n    ProductsModule,\n  ],\n})\nexport class AppModule {}",
      "label": "app.module.ts",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "It works, and it has three problems. The password is in the code, so it is in your git history forever. Every entity must be listed by hand. And `synchronize: true` also runs in production (see the trap below). The fix is to read every setting from configuration, with `forRootAsync`:"
    },
    {
      "kind": "example",
      "code": "import { Module } from '@nestjs/common';\nimport { ConfigModule, ConfigService } from '@nestjs/config';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { ProductsModule } from './products/products.module';\n\n@Module({\n  imports: [\n    ConfigModule.forRoot({ isGlobal: true }),          // reads .env; ConfigService everywhere\n    TypeOrmModule.forRootAsync({\n      inject: [ConfigService],                          // Module 6: an async factory provider\n      useFactory: (config: ConfigService) => ({\n        type: 'postgres',\n        host: config.getOrThrow<string>('DB_HOST'),\n        port: Number(config.getOrThrow<string>('DB_PORT')),   // env values are always strings\n        username: config.getOrThrow<string>('DB_USER'),\n        password: config.getOrThrow<string>('DB_PASSWORD'),\n        database: config.getOrThrow<string>('DB_NAME'),\n        autoLoadEntities: true,                         // every entity given to forFeature()\n        synchronize: config.get('DB_SYNC') === 'true',  // \"true\" only in your local .env\n        logging: config.get('DB_LOGGING') === 'true',   // print each SQL query\n        invalidWhereValuesBehavior: { null: 'throw', undefined: 'throw' },   // TypeORM 0.3.27+\n      }),\n    }),\n    ProductsModule,\n  ],\n})\nexport class AppModule {}",
      "label": "app.module.ts",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`ConfigModule.forRoot({ isGlobal: true })` reads `.env` into `ConfigService` and lets any provider inject it.",
        "`forRootAsync` with `inject` and `useFactory` is Module 6's async factory provider. Nest runs the factory at startup, once `ConfigService` exists.",
        "`getOrThrow` stops the app at startup when a value is missing. That is much better than a confusing error on the first request.",
        "`autoLoadEntities: true` registers every entity that a feature module passes to `forFeature()`, so the root module does not need a list of every table.",
        "`invalidWhereValuesBehavior` turns a dangerous default into an error (see the last trap in this module). It exists from TypeORM 0.3.27, and TypeORM 1.0 throws by default."
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `synchronize: true` outside your laptop",
      "blocks": [
        {
          "kind": "text",
          "text": "With `synchronize`, TypeORM compares your entities with the real tables at every start, and changes the tables to match. There is no review and no undo. Some changes are made by dropping a column and adding it again. For example, making a nullable column longer (`length: 100` to `200`) runs `ALTER TABLE ... DROP COLUMN` and then `ADD`. Every value in that column is gone, and nothing reports an error."
        },
        {
          "kind": "text",
          "text": "Turn it on only in your local `.env`, where the data does not matter. Everywhere else, the schema changes through migrations, which are Module 15."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Step 3 · Describe a table with an entity"
    },
    {
      "kind": "text",
      "text": "An entity is a class with decorators. Each decorated property becomes a **column**. The **primary key** is the column that identifies one row; here Postgres fills it in for you."
    },
    {
      "kind": "example",
      "code": "import {\n  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ValueTransformer,\n} from 'typeorm';\nimport { ProductStatus } from '../dto/create-product.dto';     // Module 7's enum: one definition\n\n// Postgres sends `numeric` values as strings (\"89.99\"), so no digits are lost on the way.\n// This turns them back into numbers for the app.\nexport const decimal: ValueTransformer = {\n  to: (value?: number | null) => value,\n  from: (value: string | null) => (value === null ? null : Number(value)),\n};\n\n@Entity('products')                          // the table's name\nexport class Product {\n  @PrimaryGeneratedColumn()                  // an integer Postgres fills in: 1, 2, 3...\n  id: number;\n\n  @Column({ length: 40, unique: true })      // unique: no two products can share a SKU\n  sku: string;\n\n  @Column({ length: 120 })                   // varchar(120)\n  name: string;\n\n  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: decimal })\n  price: number;                             // exact decimals, up to 99,999,999.99\n\n  @Column({ type: 'int', default: 0 })\n  stock: number;\n\n  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.Draft })\n  status: ProductStatus;\n\n  @Column('uuid')                            // who created it: Module 13's @CurrentUser('id')\n  createdBy: string;                         // a plain column, not a relation: no users table yet\n\n  @CreateDateColumn({ type: 'timestamptz' }) // filled in when the row is inserted\n  createdAt: Date;\n\n  @UpdateDateColumn({ type: 'timestamptz' }) // refreshed by every TypeORM update\n  updatedAt: Date;\n}",
      "label": "products/entities/product.entity.ts"
    },
    {
      "kind": "table",
      "head": [
        "Decorator",
        "Postgres column",
        "Notes"
      ],
      "rows": [
        [
          "`@PrimaryGeneratedColumn()`",
          "`serial`, the primary key",
          "1, 2, 3... Use `('uuid')` when ids must be hard to guess"
        ],
        [
          "`@Column({ length: 120 })`",
          "`varchar(120)`",
          "TypeORM reads the TypeScript type `string` to choose `varchar`"
        ],
        [
          "`@Column({ type: 'numeric', precision: 10, scale: 2 })`",
          "`numeric(10,2)`",
          "Exact decimals. Never use `float` for money"
        ],
        [
          "`@Column({ type: 'enum', enum: ProductStatus })`",
          "a Postgres enum type",
          "The database refuses any other value"
        ],
        [
          "`@Column('uuid')`",
          "`uuid`",
          "`createdBy`: the id of the user who created the product, from Module 13's `@CurrentUser('id')`. A plain column, not a relation: there is no `users` table yet, and Module 10's demo users are not rows anywhere"
        ],
        [
          "`@CreateDateColumn({ type: 'timestamptz' })`",
          "`timestamp with time zone`",
          "Postgres sets it when the row is inserted"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · decimals come back as strings",
      "blocks": [
        {
          "kind": "text",
          "text": "Postgres sends `numeric` values to Node as strings, such as `\"89.99\"`, so that no digits are lost. Without a transformer, `product.price + 1` is `\"89.991\"`, not `90.99`, and your JSON says `\"price\": \"89.99\"`. The `decimal` transformer above turns the value back into a number when a row is read."
        },
        {
          "kind": "text",
          "text": "For real money arithmetic, such as totals and discounts, many teams go one step further and store whole cents in an `int` column: `8999` instead of `89.99`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Step 4 · Use the repository in a service"
    },
    {
      "kind": "text",
      "text": "Register the entity in its feature module with `TypeOrmModule.forFeature([Product])`, the line you met in Module 4. That creates a **repository** for `Product`: an object with methods such as `find`, `findOneBy`, `save` and `delete`. You inject it with `@InjectRepository(Product)`."
    },
    {
      "kind": "example",
      "code": "import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { QueryFailedError, Repository } from 'typeorm';\nimport { CreateProductDto } from './dto/create-product.dto';\nimport { UpdateProductDto } from './dto/update-product.dto';\nimport { Product } from './entities/product.entity';\n\nconst PG_UNIQUE_VIOLATION = '23505';                     // Postgres's code for \"duplicate value\"\n\n@Injectable()\nexport class ProductsService {\n  constructor(\n    @InjectRepository(Product)                           // \"give me the repository for Product\"\n    private readonly products: Repository<Product>,\n  ) {}\n\n  findAll(): Promise<Product[]> {\n    return this.products.find({ order: { id: 'DESC' }, take: 50 });   // always cap a list\n  }\n\n  findByOwner(createdBy: string): Promise<Product[]> {               // Module 13's GET /api/products/mine\n    return this.products.find({ where: { createdBy }, order: { id: 'DESC' }, take: 50 });\n  }\n\n  async findOne(id: number): Promise<Product> {\n    const product = await this.products.findOneBy({ id });          // null when no row matches\n    if (!product) throw this.notFound(id);\n    return product;\n  }\n\n  async create(dto: CreateProductDto, createdBy: string): Promise<Product> {\n    try {\n      return await this.products.save(this.products.create({ ...dto, createdBy }));   // INSERT ... RETURNING\n    } catch (err) {\n      throw this.translate(err, dto.sku);\n    }\n  }\n\n  async update(id: number, dto: UpdateProductDto): Promise<Product> {\n    const product = await this.findOne(id);                         // 404 if it is missing\n    this.products.merge(product, dto);                              // copy the DTO's fields onto it\n    try {\n      return await this.products.save(product);                     // UPDATE only what changed\n    } catch (err) {\n      throw this.translate(err, product.sku);\n    }\n  }\n\n  async remove(id: number): Promise<void> {\n    const result = await this.products.delete({ id });              // DELETE ... WHERE id = $1\n    if (result.affected === 0) throw this.notFound(id);\n  }\n\n  private notFound(id: number) {\n    return new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: `Product ${id} not found` });\n  }\n\n  // Module 8: a raw database error never reaches the client. Translate the ones you expect.\n  private translate(err: unknown, sku: string) {\n    const code = err instanceof QueryFailedError ? (err.driverError as { code?: string }).code : undefined;\n    if (code === PG_UNIQUE_VIOLATION) {\n      return new ConflictException({ code: 'SKU_TAKEN', message: `SKU ${sku} already exists` });\n    }\n    return err;                                       // anything else: the filter makes it a 500\n  }\n}",
      "label": "products/products.service.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Two details matter. First, `findOneBy` returns `null` when no row matches, and the service turns that into Module 8's `NotFoundException`, with a `code` that the global filter puts into the error envelope. Second, the database's own errors are translated close to where they happen. `23505` is Postgres's code for a *unique violation*, and here it becomes a clean `409`. And Module 13's controller does not change at all: `findAll()`, `findByOwner(user.id)`, `create(dto, userId)` and `remove(id)` are exactly the calls it already makes."
    },
    {
      "kind": "text",
      "text": "Notice `return await` inside each `try`. Without the `await`, the promise is returned before it fails, and the `catch` never sees the error.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Under the hood · where the repository comes from",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "At startup, Nest runs the `forRootAsync` factory and creates a TypeORM `DataSource`: the object that holds the *connection pool*, a few open database connections that all queries share. If Postgres is not ready yet, it tries again: by default 9 attempts, 3 seconds apart (`retryAttempts`, `retryDelay`).",
            "`forFeature([Product])` registers one provider per entity. Its token is the string `\"ProductRepository\"`, the value that `getRepositoryToken(Product)` returns.",
            "`@InjectRepository(Product)` is shorthand for `@Inject(getRepositoryToken(Product))`. It is ordinary injection by token, exactly as in Module 6.",
            "Forget `forFeature` and the app stops at startup with Module 6's error: `Nest can't resolve dependencies of the ProductsService (?). Please make sure that the argument \"ProductRepository\" at index [0] is available in the ProductsModule module.`"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `undefined` in a `where` matches every row",
      "blocks": [
        {
          "kind": "text",
          "text": "By default, TypeORM 0.3 *skips* a `where` property whose value is `undefined` or `null`. So `findOneBy({ email: dto.email })` with a missing `email` runs `SELECT ... LIMIT 1` with no `WHERE` at all, and returns the first user in the table. On a login or password-reset endpoint, that is someone else's account. The same goes for `findByOwner`: with a missing id, *my products* quietly becomes *everyone's products*."
        },
        {
          "kind": "text",
          "text": "Validate every input with a DTO (Module 7). On TypeORM 0.3.27 and later, also set `invalidWhereValuesBehavior` to `throw`, as in `app.module.ts` above; TypeORM 1.0 throws by default. When you really mean \"this column is empty\", say so with the `IsNull()` operator."
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "`ProductsService` injects `@InjectRepository(Product)`, but `ProductsModule` does not import `TypeOrmModule.forFeature([Product])`. `autoLoadEntities` is on. What happens?",
      "options": [
        "TypeORM creates the repository the first time the service uses it",
        "It works, because `autoLoadEntities` finds the entity by itself",
        "The app stops at startup: Nest cannot resolve `ProductRepository` in `ProductsModule`",
        "The app starts, but every query fails because the table is missing"
      ],
      "answer": 2,
      "why": "**The app stops at startup.** `@InjectRepository(Product)` is just `@Inject(\"ProductRepository\")`, and that token exists only in a module that called `forFeature([Product])`. It is the same rule as for any provider in Module 6. `autoLoadEntities` works the other way round: it collects entities *from* the `forFeature()` calls, so it cannot help an entity that no module registered."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 14.1",
      "title": "Put the products API on Postgres",
      "blocks": [
        {
          "kind": "text",
          "text": "Move Part 1's products API from an in-memory array into Postgres:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "Start Postgres with the compose file, and connect with `forRootAsync` and `ConfigService`.",
            "Write the `Product` entity, with a unique `sku`.",
            "Rewrite `ProductsService` with the repository, including `findByOwner` and the owner in `create`. Keep Module 13's controller exactly as it is.",
            "Give the DTO a `sku` field (`@IsString() @MaxLength(40)`) and an optional `stock` (`@IsInt() @Min(0)`). The `categoryId` field returns in Module 15."
          ]
        },
        {
          "kind": "text",
          "text": "Then check four things: the products survive a server restart, and `GET /api/products/mine` shows only the caller's own; `DELETE /api/products/999` as an admin returns your `404` envelope; posting the same `sku` twice returns `409` with no table or constraint names in it; and `price` is a number in the JSON, not a string."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "# Module 10's demo tokens still work until Module 17: user-token is Ana, admin-token is Raj.\n$ curl -s -X POST localhost:3000/api/products -H 'content-type: application/json' \\\n    -H 'authorization: Bearer user-token' \\\n    -d '{\"sku\":\"DRL-001\",\"name\":\"Cordless drill\",\"price\":89.99,\"stock\":5,\"status\":\"live\"}'\n{\"id\":1,\"sku\":\"DRL-001\",\"name\":\"Cordless drill\",\"price\":89.99,\"stock\":5,\"status\":\"live\",\n \"createdBy\":\"a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f601\",...}\n\n# stop the server, start it again, then read the rows back from Postgres:\n$ curl -s localhost:3000/api/products/mine -H 'authorization: Bearer user-token'\n[{\"id\":1,\"sku\":\"DRL-001\",\"name\":\"Cordless drill\",\"price\":89.99,\"stock\":5,\"status\":\"live\",\n  \"createdBy\":\"a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f601\",\n  \"createdAt\":\"2026-10-06T14:45:31.071Z\",\"updatedAt\":\"2026-10-06T14:45:31.071Z\"}]\n                                  ↑ a number. Without the transformer it would be \"89.99\"\n$ curl -s localhost:3000/api/products/mine -H 'authorization: Bearer admin-token'\n[]                                ← Raj has not created anything\n\n$ curl -s -X POST localhost:3000/api/products -H 'content-type: application/json' \\\n    -H 'authorization: Bearer user-token' \\\n    -d '{\"sku\":\"DRL-001\",\"name\":\"Drill again\",\"price\":10}'\n{\"statusCode\":409,\"code\":\"SKU_TAKEN\",\"message\":\"SKU DRL-001 already exists\",\n \"path\":\"/api/products\",\"timestamp\":\"2026-10-06T14:46:21.769Z\",\"correlationId\":\"n/a\"}\n\n$ curl -s -X DELETE localhost:3000/api/products/999 -H 'authorization: Bearer admin-token'\n{\"statusCode\":404,\"code\":\"PRODUCT_NOT_FOUND\",\"message\":\"Product 999 not found\",\n \"path\":\"/api/products/999\",\"timestamp\":\"2026-10-06T14:46:22.180Z\",\"correlationId\":\"n/a\"}\n\n# correlationId is \"n/a\" because nothing set the header. With Module 9's middleware it is a UUID.\n# Success bodies are shown without Module 11's envelope; in your app they arrive as {\"data\": ...}.\n# Error bodies are never wrapped: they come from Module 8's filter.",
              "lang": "text",
              "label": "terminal · what you should see"
            },
            {
              "kind": "text",
              "text": "Module 13's controller did not change, and that is Module 5's rule paying off: HTTP in the controller, logic in the service. Also look at what the `409` does *not* say. Postgres's own error was `Key (sku)=(DRL-001) already exists.`, raised by a constraint named like `UQ_c44ac33a05b144dd0d9ddcf9327`. The client never sees either, because the service translated the error first.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q23",
      "title": "How do you connect a NestJS app to PostgreSQL with TypeORM, and why `forRootAsync`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** In the root module I import `TypeOrmModule.forRootAsync` with a `useFactory` that injects `ConfigService`, so the host, credentials and options come from the environment, not from the code. It is an async factory provider: Nest runs it at startup, builds the TypeORM `DataSource` with its connection pool, and retries if the database is not ready yet. Each feature module then calls `TypeOrmModule.forFeature([Entity])`, which registers a repository provider under the token from `getRepositoryToken(Entity)`, and services receive it with `@InjectRepository(Entity)`. With `autoLoadEntities: true`, the root module needs no central list of entities, which keeps module boundaries clean."
        },
        {
          "kind": "text",
          "text": "Two things I would add without being asked. `synchronize` stays off outside local development, because migrations own the schema. And database errors are translated in the service or repository layer, so a unique violation becomes a `409` with a domain code, and driver details never reach the client."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q24",
      "title": "Why is `synchronize: true` dangerous in production, and what do you use instead?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `synchronize` makes TypeORM compare the entities with the live schema at every startup and apply the differences at once. There is no review, no history and no rollback. Some changes are applied as drop-and-recreate: in Postgres, a column type or length change becomes `DROP COLUMN` plus `ADD COLUMN`, so the data in that column is lost. It also runs on every instance as it boots, so several copies of the app can try to change the same tables at the same time."
        },
        {
          "kind": "text",
          "text": "Instead I use migrations. They are versioned files, generated from the entity changes and then read and fixed by a person. They are committed with the code, reviewed in the pull request, and run as a deploy step before the new code takes traffic. The database records which migrations have run, so every environment gets the same changes in the same order."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 15 switches `synchronize` off for good. You will write migrations, link tables with relations, and meet the most common performance bug in ORM code: the N+1 query."
    }
  ]
};
