import { Lesson } from '../../shared/content';

export const M19_CONFIG_ARCHITECTURE: Lesson = {
  "slug": "m19-config-architecture",
  "title": "M19 Configuration and architecture",
  "nav": "Config & architecture",
  "num": "M19",
  "eyebrow": "Level 6 · Week 11 · ~2 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 6 · Weeks 11–14 · Real systems",
      "blocks": [
        {
          "kind": "text",
          "text": "How to organise a growing app and how Nest works inside, then what real apps need: file uploads, email, outside APIs, Redis caching, background jobs, and live updates with WebSockets."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Your shop API now has users, auth, products, orders and a real database. At this size, two things start to hurt. Settings are scattered: `process.env.SOMETHING` appears in twenty files, and a missing value shows up as a crash at 3am instead of at startup. And modules start to reach into each other. The orders code changes the products table directly, so nobody can change one without breaking the other."
    },
    {
      "kind": "text",
      "text": "This module fixes both. First, **configuration**: one typed place for every setting, checked when the app starts. Then **architecture**: clear borders between modules, and simple layers inside each one. Module 2 promised you this restructure. Here it is."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Read every setting in one place, and check them all when the app starts. If one is wrong, the app refuses to start. Give each module a small front door, and keep everything else inside it private."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Configuration: values that change between environments"
    },
    {
      "kind": "text",
      "text": "**Configuration** is every value that differs between your laptop, the test server and production: the database address, secret keys, the port, feature switches. These values come from **environment variables**. An environment variable is a named piece of text that the operating system hands to your process when it starts. In Node you read them from `process.env`."
    },
    {
      "kind": "text",
      "text": "On your laptop you keep them in a `.env` file. In production, the hosting platform sets them. The code must never contain the real values: a secret in git is a secret on every laptop that clones the repo."
    },
    {
      "kind": "text",
      "text": "Commit a `.env.example` file with fake values, so a new developer knows what to set. Add `.env` itself to `.gitignore`.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "`@nestjs/config` loads the `.env` file and gives you `ConfigService`. We'll add **zod**, a validation library, to check the values. Install both with `npm i @nestjs/config@4 zod`. The `@4` matters: version 4 is the release made for Nest 11, and a plain `npm i` now pulls one built for Nest 12."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Step 1 · Check every variable at startup"
    },
    {
      "kind": "text",
      "text": "Write the rules once, as a schema. A **schema** describes what valid data looks like: which keys exist, what type each one has, and its limits. zod checks the raw strings against it. It also turns `\"3000\"` into the number `3000` and fills in defaults."
    },
    {
      "kind": "example",
      "code": "import { z } from 'zod';\n\n// Every variable the app needs, in one place. Strings go in, typed values come out.\nconst envSchema = z.object({\n  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),\n  PORT: z.coerce.number().int().positive().default(3000),\n\n  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }), // replaces DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME\n  DATABASE_POOL_SIZE: z.coerce.number().int().min(1).max(50).default(10),\n  DB_LOGGING: z.enum(['true', 'false']).default('false'), // Module 14's switch for printing SQL\n\n  JWT_ACCESS_SECRET: z.string().min(32, 'use at least 32 random characters'),\n  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900), // Module 17's '15m'\n  JWT_REFRESH_SECRET: z.string().min(32, 'use at least 32 random characters'), // Module 18\n\n  REDIS_URL: z.url({ protocol: /^rediss?$/ }).optional(), // Redis arrives in Module 22, which makes it required\n});\n\nexport type Env = z.infer<typeof envSchema>;\n\n// ConfigModule calls this once at startup, with your .env file and process.env merged.\nexport function validateEnv(raw: Record<string, unknown>): Env {\n  const result = envSchema.safeParse(raw);\n  if (!result.success) {\n    // Throwing here stops the app before it opens a single connection.\n    throw new Error(`Invalid environment variables:\\n${z.prettifyError(result.error)}`);\n  }\n  return result.data;\n}",
      "label": "src/config/env.validation.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Note the `protocol` option. A plain `z.url()` accepts `localhost:5432`, because the URL parser reads `localhost:` as a scheme. Pinning the protocol catches a very common copy-paste mistake."
    },
    {
      "kind": "text",
      "text": "Two lines are worth a second look. `JWT_REFRESH_SECRET` is Module 18's: the schema lists *every* variable, so a missing one stops the app. And `REDIS_URL` is `.optional()` for now, because nothing uses Redis yet. Module 22 removes the `.optional()` when the cache arrives.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "Joi works too: pass a Joi schema as `validationSchema` instead of `validate`. zod has one extra benefit in TypeScript: `z.infer` gives you the `Env` type for free.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Coming from Modules 14 and 15: one DATABASE_URL",
      "blocks": [
        {
          "kind": "text",
          "text": "Until now, Modules 14 and 15 connected with five variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` and `DB_NAME`. From here on, one `DATABASE_URL` replaces them, in the form `postgres://user:password@host:5432/name`. Hosting platforms usually hand you exactly this one string, and one value is one thing to check. For Module 14's local database, the `.env` line is `DATABASE_URL=postgres://shop:local-dev-only-password@localhost:5432/shop`."
        },
        {
          "kind": "text",
          "text": "Keep `DB_USER`, `DB_PASSWORD` and `DB_NAME` in `.env`, because Module 14's `docker-compose.yml` still uses them to create the database. Only the app stops reading them. Delete `DB_HOST`, `DB_PORT` and `DB_SYNC`, and keep `DB_LOGGING`. If a password contains `@`, `:` or `/`, URL-encode it (`@` becomes `%40`), or the URL breaks. Step 3 shows the two code changes."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Step 2 · Group settings into typed namespaces"
    },
    {
      "kind": "text",
      "text": "`registerAs()` creates a **namespace**: a small, named group of related settings, such as everything the database needs. Each namespace has a `KEY` you can inject. Its type comes straight from the factory function, so you never write it by hand."
    },
    {
      "kind": "example",
      "code": "// ── src/config/database.config.ts ──\nimport { registerAs } from '@nestjs/config';\n\n// A typed namespace: the database settings, registered under the key 'database'.\n// By the time this runs, validateEnv() has checked every value.\nexport const databaseConfig = registerAs('database', () => ({\n  url: process.env.DATABASE_URL as string,\n  poolSize: Number(process.env.DATABASE_POOL_SIZE), // the env value is always a string\n  logging: process.env.DB_LOGGING === 'true',\n}));\n\n// ── src/config/auth.config.ts ──\nimport { registerAs } from '@nestjs/config';\n\nexport const authConfig = registerAs('auth', () => ({\n  accessSecret: process.env.JWT_ACCESS_SECRET as string,\n  accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS),\n  refreshSecret: process.env.JWT_REFRESH_SECRET as string,\n}));\n\n// ── src/auth/auth.module.ts — Module 17, reading the namespace ──\nimport { Module } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport { JwtModule } from '@nestjs/jwt';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { authConfig } from '../config/auth.config';\nimport { User } from '../users/entities/user.entity';\nimport { RefreshToken } from './entities/refresh-token.entity';\nimport { TokensService } from './tokens.service';\n\n@Module({\n  imports: [\n    TypeOrmModule.forFeature([User, RefreshToken]),\n    JwtModule.registerAsync({\n      inject: [authConfig.KEY], // was: ConfigService and getOrThrow('JWT_ACCESS_SECRET')\n      useFactory: (auth: ConfigType<typeof authConfig>) => ({\n        secret: auth.accessSecret,\n        signOptions: { expiresIn: auth.accessTtlSeconds }, // 900 s: Module 17's '15m'\n      }),\n    }),\n  ],\n  // …controllers, AuthService and the global guards stay as in Modules 17 and 18\n})\nexport class AuthModule {}\n\n// ── src/auth/tokens.service.ts — Module 18, reading the namespace (excerpt) ──\nimport { randomUUID } from 'node:crypto';\nimport { Inject, Injectable } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport { JwtService } from '@nestjs/jwt';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { EntityManager, Repository } from 'typeorm';\nimport { authConfig } from '../config/auth.config';\nimport type { AuthUser } from './auth-user';\nimport { RefreshToken } from './entities/refresh-token.entity';\n\nconst REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;\nexport interface TokenPair { accessToken: string; refreshToken: string }\n\n@Injectable()\nexport class TokensService {\n  constructor(\n    @InjectRepository(RefreshToken) private readonly tokens: Repository<RefreshToken>,\n    private readonly jwt: JwtService,\n    @Inject(authConfig.KEY) private readonly auth: ConfigType<typeof authConfig>, // was: ConfigService\n  ) {}\n\n  // …startSession(), refresh() and logout() as in Module 18…\n\n  private async issue(manager: EntityManager, user: AuthUser, familyId: string): Promise<TokenPair> {\n    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, roles: user.roles });\n    const refreshToken = await this.jwt.signAsync(\n      { sub: user.id, fam: familyId },\n      {\n        secret: this.auth.refreshSecret, // was: this.config.getOrThrow('JWT_REFRESH_SECRET')\n        expiresIn: REFRESH_TTL_SECONDS,\n        jwtid: randomUUID(),\n      },\n    );\n    // …store the token's hash, exactly as in Module 18\n    return { accessToken, refreshToken };\n  }\n}",
      "label": "two namespaces and their consumers"
    },
    {
      "kind": "text",
      "text": "Look at the import: `import { type ConfigType }`. New Nest 11 projects turn on the `isolatedModules` compiler option. With it, a type that appears in a decorated constructor or handler, like `ConfigType` here, must be imported with the `type` keyword, or the build fails with error TS1272. The same goes for `Request` from express and `Cache` from cache-manager."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Step 3 · Wire it into the root module and the migration CLI"
    },
    {
      "kind": "example",
      "code": "// ── src/app.module.ts ──\nimport { Module } from '@nestjs/common';\nimport { ConfigModule, type ConfigType } from '@nestjs/config';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { authConfig } from './config/auth.config';\nimport { databaseConfig } from './config/database.config';\nimport { validateEnv } from './config/env.validation';\nimport { AuthModule } from './auth/auth.module';\nimport { OrdersModule } from './orders/orders.module';\nimport { ProductsModule } from './products/products.module';\n\n@Module({\n  imports: [\n    ConfigModule.forRoot({\n      isGlobal: true,                   // ConfigService and the namespaces, injectable anywhere\n      cache: true,                      // read process.env once, not on every get()\n      load: [databaseConfig, authConfig],\n      validate: validateEnv,            // bad config → the app refuses to start\n    }),\n    TypeOrmModule.forRootAsync({\n      inject: [databaseConfig.KEY],     // runs after the config is loaded and checked\n      useFactory: (db: ConfigType<typeof databaseConfig>) => ({\n        type: 'postgres',\n        url: db.url,                    // replaces Module 14's host, port, username, password, database\n        poolSize: db.poolSize,          // new: the most connections the pool may open\n        logging: db.logging,\n        autoLoadEntities: true,\n        synchronize: false,             // migrations own the schema (Module 15), so DB_SYNC can go\n        invalidWhereValuesBehavior: { null: 'throw', undefined: 'throw' }, // as in Module 14\n      }),\n    }),\n    AuthModule,\n    ProductsModule,\n    OrdersModule,\n  ],\n})\nexport class AppModule {}\n\n// ── src/database/data-source.ts (Module 15) ──\nimport 'dotenv/config'; // the CLI runs outside Nest, so it loads .env itself (Module 15)\nimport { DataSource } from 'typeorm';\n\nexport default new DataSource({\n  type: 'postgres',\n  url: process.env.DATABASE_URL, // was host, port, username, password and database\n  entities: [__dirname + '/../**/*.entity{.ts,.js}'],\n  migrations: [__dirname + '/migrations/*{.ts,.js}'],\n  synchronize: false, // migrations own the schema\n});",
      "label": "the app and the TypeORM CLI, both on DATABASE_URL"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`validate: validateEnv` runs once, inside `forRoot()`, before Nest creates any provider. If it throws, nothing starts.",
        "`load` registers your namespaces. Their factories run after validation, so they only see checked values. Defaults that zod added, like `DATABASE_POOL_SIZE=10`, are copied into `process.env` for them.",
        "`forRootAsync()` with `inject` is how every other module gets its settings. The factory runs during dependency injection, after the config is ready.",
        "This is Module 14's TypeORM setup with one swap: `url: db.url` replaces its five connection options. `poolSize` is new, and `logging` and `invalidWhereValuesBehavior` carry over unchanged.",
        "Module 15's `data-source.ts` gets the same swap: `url: process.env.DATABASE_URL`. The migration CLI runs outside Nest, so it reads `process.env` directly, as before.",
        "`cache: true` keeps the values in memory. Reading `process.env` is slower than reading a normal object."
      ]
    },
    {
      "kind": "text",
      "text": "For a one-off value you can also inject `ConfigService<Env, true>` and call `config.get('PORT', { infer: true })`. The `true` tells TypeScript the values were validated, so the result is a `number`, not `number | undefined`.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "win",
      "title": "What you just bought",
      "blocks": [
        {
          "kind": "text",
          "text": "A typo in the deploy settings now stops the app in its first second, with one message that names every bad variable. Without the schema, the same typo turns into an error at the first request that needs the value. That might be hours later, in front of a customer."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `process.env` in a module decorator",
      "blocks": [
        {
          "kind": "text",
          "text": "`@Module({ imports: [JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET })] })` looks fine. It fails in a confusing way. The object inside `@Module()` is built when the file is *imported*, and `auth.module.ts` is imported at the top of `app.module.ts`, before `ConfigModule.forRoot()` has loaded `.env`. So the secret is `undefined`, and the first login fails with `secretOrPrivateKey must have a value`."
        },
        {
          "kind": "text",
          "text": "Worse, it works in production, where the platform sets real environment variables before Node starts. Use `registerAsync()` with `inject`, the way `TypeOrmModule.forRootAsync()` does above. `process.env` should never appear inside a module decorator."
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
          "text": "In Angular, `environment.ts` is baked into the bundle when you build, so one build serves one environment. A backend reads its settings when it *starts*. The same build, even the same Docker image, runs in staging and in production with different environment variables. That is why the check runs at startup, not at build time."
        },
        {
          "kind": "text",
          "text": "If you have used Nx, you already know the next idea. A library's `index.ts` is its public API, and the `@nx/enforce-module-boundaries` lint rule stops apps from importing its private files. A modular monolith does the same with Nest modules."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Architecture: one app, many modules with borders"
    },
    {
      "kind": "text",
      "text": "A **monolith** is one app, deployed as one unit. A **modular monolith** is a monolith whose modules have strict borders. Each module owns its data and offers a small **public API**: the few services other modules may call. You get most of the design benefits of microservices (Module 30) without network calls, distributed transactions and ten separate deploys."
    },
    {
      "kind": "example",
      "code": "src/\n├── main.ts\n├── app.module.ts\n├── config/                        ← env schema and typed namespaces\n│   ├── env.validation.ts\n│   ├── database.config.ts\n│   └── auth.config.ts\n├── database/                      ← data-source.ts and the migrations (Module 15)\n├── common/                        ← filters, interceptors, pipes shared by all (no business rules)\n├── auth/                          ← the global guards, @Public(), @Roles(), @CurrentUser()\n├── users/                         ← the User entity (AuthModule owns it, Module 17)\n├── products/\n│   ├── dto/\n│   ├── entities/product.entity.ts\n│   ├── products.controller.ts     ← HTTP only\n│   ├── products.service.ts        ← business rules, exported\n│   ├── products.module.ts         ← exports: [ProductsService]\n│   └── index.ts                   ← the public API: what others may import\n└── orders/\n    └── … the same shape",
      "lang": "text",
      "label": "src/ — feature modules as borders"
    },
    {
      "kind": "text",
      "text": "Three rules keep the borders real:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Each module owns its tables.** Only `ProductsModule` reads or writes `products`. Everyone else asks it.",
        "**Export services, never repositories.** A module's `exports` array is its public API. Keep it short.",
        "**Import through the front door.** Other modules import from `products/index.ts`, never from a file deep inside the folder."
      ]
    },
    {
      "kind": "example",
      "code": "// ── orders/orders.service.ts ──\nimport { Injectable, NotFoundException } from '@nestjs/common';\nimport { DataSource, In } from 'typeorm';\nimport { InsufficientStockException } from '../common/exceptions/insufficient-stock.exception';\nimport { Product } from '../products/entities/product.entity';\nimport { CreateOrderDto } from './dto/create-order.dto';\nimport { OrderItem } from './entities/order-item.entity';\nimport { Order } from './entities/order.entity';\n\n@Injectable()\nexport class OrdersService {\n  constructor(private readonly dataSource: DataSource) {}\n\n  place(userId: string, dto: CreateOrderDto): Promise<Order> {\n    return this.dataSource.transaction(async (manager) => {\n      const ids = [...new Set(dto.items.map((line) => line.productId))].sort((a, b) => a - b);\n      const products = await manager.find(Product, { // ❌ orders reads products' table…\n        where: { id: In(ids) },\n        order: { id: 'ASC' },\n        lock: { mode: 'pessimistic_write' },\n      });\n      const byId = new Map(products.map((p) => [p.id, p]));\n      const items = dto.items.map((line) => {\n        const product = byId.get(line.productId);\n        if (!product) throw new NotFoundException(`Product ${line.productId} not found`);\n        if (product.stock < line.quantity) { // ❌ …owns a products rule…\n          throw new InsufficientStockException(String(product.id), line.quantity, product.stock);\n        }\n        product.stock -= line.quantity;\n        return manager.create(OrderItem, { productId: product.id, quantity: line.quantity, unitPrice: product.price });\n      });\n      await manager.save(products); // ❌ …and writes products' rows\n      return manager.save(manager.create(Order, { userId, items }));\n    });\n  }\n}",
      "label": "orders reaching into products: Module 16's place()",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "This is Module 16's `place()`, and it is correct: the transaction and the row lock make sure stock is never sold twice. The problem is *where* it lives. The stock rule belongs to products, but it sits in orders, which reads and writes the products table directly. So the products team can't rename a column, or change how stock works, without breaking orders. And nothing in `ProductsModule` shows that orders depends on it."
    },
    {
      "kind": "example",
      "code": "// ── products/products.service.ts ──\nimport { Injectable, NotFoundException } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { EntityManager, In, Repository } from 'typeorm';\nimport { InsufficientStockException } from '../common/exceptions/insufficient-stock.exception';\nimport { Product } from './entities/product.entity';\n\n@Injectable()\nexport class ProductsService {\n  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}\n\n  // …findAll(), findOne(), create() and the rest from Module 14…\n\n  /**\n   * Public API: take items out of stock, inside the caller's transaction (Module 16).\n   * Returns each product's current price, by product id.\n   */\n  async reserveStock(\n    manager: EntityManager,\n    lines: { productId: number; quantity: number }[],\n  ): Promise<Map<number, number>> {\n    // Module 16's lock: sorted ids, SELECT … FOR UPDATE, so stock can't be sold twice.\n    const ids = [...new Set(lines.map((line) => line.productId))].sort((a, b) => a - b);\n    const products = await manager.find(Product, {\n      where: { id: In(ids) },\n      order: { id: 'ASC' },\n      lock: { mode: 'pessimistic_write' },\n    });\n    const byId = new Map(products.map((p) => [p.id, p]));\n\n    for (const line of lines) {\n      const product = byId.get(line.productId);\n      if (!product) {\n        throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: `Product ${line.productId} not found` });\n      }\n      if (product.stock < line.quantity) {\n        throw new InsufficientStockException(String(product.id), line.quantity, product.stock);\n      }\n      product.stock -= line.quantity;\n    }\n    await manager.save(products);\n    return new Map(products.map((p) => [p.id, p.price]));\n  }\n}\n\n// ── products/products.module.ts ──\nimport { Module } from '@nestjs/common';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { Product } from './entities/product.entity';\nimport { ProductsController } from './products.controller';\nimport { ProductsService } from './products.service';\n\n@Module({\n  imports: [TypeOrmModule.forFeature([Product])], // TypeORM's Repository<Product> stays in here\n  controllers: [ProductsController],\n  providers: [ProductsService],\n  exports: [ProductsService], // the front door\n})\nexport class ProductsModule {}\n\n// ── orders/orders.service.ts ──\nimport { Injectable } from '@nestjs/common';\nimport { DataSource } from 'typeorm';\nimport { ProductsService } from '../products';\nimport { CreateOrderDto } from './dto/create-order.dto';\nimport { OrderItem } from './entities/order-item.entity';\nimport { Order } from './entities/order.entity';\n\n@Injectable()\nexport class OrdersService {\n  constructor(\n    private readonly dataSource: DataSource,\n    private readonly products: ProductsService, // ProductsModule's public API\n  ) {}\n\n  place(userId: string, dto: CreateOrderDto): Promise<Order> {\n    // Still ONE transaction (Module 16): the manager travels with the call, so both parts commit together.\n    return this.dataSource.transaction(async (manager) => {\n      const prices = await this.products.reserveStock(manager, dto.items); // the stock rule stays in products\n      const items = dto.items.map((line) =>\n        manager.create(OrderItem, {\n          productId: line.productId,\n          quantity: line.quantity,\n          unitPrice: prices.get(line.productId)!, // reserveStock() threw if a product was missing\n        }),\n      );\n      return manager.save(manager.create(Order, { userId, items }));\n    });\n  }\n}",
      "label": "orders calling the products public API",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "The same code, moved to its owner. `reserveStock()` is the products module's public API. It takes the transaction's `EntityManager` as an argument, so the stock change and the order still commit or roll back together, as in Module 16. `OrdersService` no longer knows how stock is stored, and `ProductsModule` can change that freely, as long as `reserveStock()` keeps its promise."
    },
    {
      "kind": "text",
      "text": "To make the rule automatic, add a lint check. ESLint's built-in `no-restricted-imports` can block deep paths like `**/products/entities/*` outside the products folder, and `eslint-plugin-boundaries` can describe whole layers.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `forFeature()` with another module's entity",
      "blocks": [
        {
          "kind": "text",
          "text": "TypeORM lets any module call `TypeOrmModule.forFeature([Product])` and get a full repository for someone else's table. A transaction's `manager.find(Product)` does the same, as in the example above. Nest won't stop you, and nothing in `ProductsModule` shows the new dependency. Here's a quick check: if a module names an entity it doesn't own, in `forFeature()` or through the `manager`, it is reaching in. Call the owner's service instead."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Layers inside a module"
    },
    {
      "kind": "text",
      "text": "Inside each module, keep three simple layers. Each layer calls only the one below it."
    },
    {
      "kind": "table",
      "head": [
        "Layer",
        "Its job",
        "It knows about",
        "It must not"
      ],
      "rows": [
        [
          "**Controller**",
          "HTTP: read the DTOs, call the service, return the result",
          "Routes, status codes, DTOs",
          "Hold business rules or touch the database"
        ],
        [
          "**Service**",
          "Business rules: \"stock can't go below zero\", \"only a placed order can be paid\"",
          "Its repository and other modules' public services",
          "Know about HTTP: `req`, `res`, headers"
        ],
        [
          "**Repository**",
          "Data access: TypeORM's `Repository`, injected with `@InjectRepository()` (Module 14)",
          "Its own tables",
          "Make business decisions"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Here is a test for a good split: could you call the service from a queue job or a script, with no HTTP request at all? If yes, the layers are right. Module 23 will do exactly that."
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Clean architecture lite",
      "blocks": [
        {
          "kind": "text",
          "text": "Full **clean architecture** puts interfaces between every layer, so the business code depends on nothing else. The idea is sound, but in a typical Nest app most of it is ceremony. Keep the useful part:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**Dependencies point inward**: controller → service → repository. Never backwards.",
            "**Add an interface only where you swap things**: file storage, email, payment providers, anything you fake in tests. Use an abstract class as the token (Module 6). Module 21 does this for files and email.",
            "**Skip the rest**: a repository interface for every entity, mapper classes between identical objects, and use-case classes that wrap one line of CRUD."
          ]
        },
        {
          "kind": "text",
          "text": "The rule of two: add an abstraction when you have a second implementation, or an outside system you must fake. Not before."
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "`AuthModule` has `imports: [JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET })]`. The secret is in `.env`, which `ConfigModule.forRoot()` loads in `AppModule`. On your laptop, login fails with `secretOrPrivateKey must have a value`. Why?",
      "options": [
        "`@nestjs/config` can't read `.env` files in Nest 11",
        "The `@Module()` object was built when `auth.module.ts` was imported, before `forRoot()` loaded `.env`",
        "`JwtModule` ignores environment variables and only reads `ConfigService`",
        "`AuthModule` must import `ConfigModule.forFeature()` first"
      ],
      "answer": 1,
      "why": "**The decorator ran first.** `app.module.ts` imports `auth.module.ts` at the top of the file, so the `@Module()` arguments are built before the line that calls `ConfigModule.forRoot()`. At that moment `process.env.JWT_ACCESS_SECRET` is still `undefined`. In production the platform sets the variable before Node starts, so the same code works there, which makes the bug hard to spot. The fix is `JwtModule.registerAsync()` with `inject: [authConfig.KEY]`. Its factory runs during dependency injection, after the config is loaded and checked."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 19.1",
      "title": "Add a payments namespace",
      "blocks": [
        {
          "kind": "text",
          "text": "Add three variables for a payment provider: `PAYMENTS_API_KEY` (required, must start with `sk_`), `PAYMENTS_WEBHOOK_SECRET` (required, at least 16 characters) and `PAYMENTS_TIMEOUT_MS` (optional, a whole number from 1000 to 30000, default 5000). Create a `paymentsConfig` namespace and inject it into a `PaymentsClient`. Check that `timeoutMs` is typed as a `number`."
        },
        {
          "kind": "text",
          "text": "Then break it on purpose. Set `PAYMENTS_API_KEY=pk_live_123`, remove the webhook secret, set the timeout to `50`, and start the app. Write down what you see."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// ── src/config/env.validation.ts ──\nimport { z } from 'zod';\n\nconst envSchema = z.object({\n  // …the variables you already have, then:\n  PAYMENTS_API_KEY: z.string().startsWith('sk_', 'must start with sk_'),\n  PAYMENTS_WEBHOOK_SECRET: z.string().min(16),\n  PAYMENTS_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30_000).default(5000),\n});\n\n// ── src/config/payments.config.ts ──\nimport { registerAs } from '@nestjs/config';\n\nexport const paymentsConfig = registerAs('payments', () => ({\n  apiKey: process.env.PAYMENTS_API_KEY as string,\n  webhookSecret: process.env.PAYMENTS_WEBHOOK_SECRET as string,\n  timeoutMs: Number(process.env.PAYMENTS_TIMEOUT_MS),\n}));\n\n// ── src/payments/payments.client.ts ──\nimport { Inject, Injectable } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport { paymentsConfig } from '../config/payments.config';\n\n@Injectable()\nexport class PaymentsClient {\n  constructor(\n    @Inject(paymentsConfig.KEY) private readonly config: ConfigType<typeof paymentsConfig>,\n  ) {}\n\n  describe(): string {\n    // Typed: config.timeoutMs is a number, config.apiKey a string.\n    return `payments client, timeout ${this.config.timeoutMs} ms`;\n  }\n}",
              "label": "the namespace, end to end"
            },
            {
              "kind": "text",
              "text": "Add `paymentsConfig` to the `load` array in `AppModule`. With the broken values, the app stops before it creates anything:"
            },
            {
              "kind": "example",
              "code": "$ npm run start:dev\n[Nest] 18928  - 06/10/2026, 6:39:32 pm   ERROR [ExceptionHandler] Error: Invalid environment variables:\n✖ must start with sk_\n  → at PAYMENTS_API_KEY\n✖ Invalid input: expected string, received undefined\n  → at PAYMENTS_WEBHOOK_SECRET\n✖ Too small: expected number to be >=1000\n  → at PAYMENTS_TIMEOUT_MS\n    at …",
              "lang": "text",
              "label": "terminal"
            },
            {
              "kind": "text",
              "text": "All three problems come back together, in one message. You fix the deploy once, not three times. Module 20 turns this namespace into the options of a reusable `PaymentsModule.forRootAsync()`.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 19.2",
      "title": "Draw your module map",
      "blocks": [
        {
          "kind": "text",
          "text": "List every module in the shop you've built so far. For each one, write down its `exports` (its public API), what it imports, and every entity in its `forFeature()`. Then look for three smells: an entity used by a module that doesn't own it, two modules that import each other, and a controller with business rules in it."
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
                "**An entity outside its owner.** Move the logic into the owner's service, export that service, and call it.",
                "**Two modules that import each other.** A third idea is hiding between them. Pull it into its own module, or turn one direction into an event (Module 23). Module 20 shows both fixes.",
                "**Business rules in a controller.** Move them into the service. A controller should be boring: DTO in, service call, result out."
              ]
            },
            {
              "kind": "text",
              "text": "Keep this map in your README. It's the first thing a new teammate needs, and it shows at a glance when a change crosses a border.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q33",
      "title": "How do you manage configuration in a NestJS app?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I use `@nestjs/config` in three parts. First, one schema, in zod or Joi, that lists every environment variable with its type and limits. I pass it to `ConfigModule.forRoot()` as `validate` or `validationSchema`. It runs at startup, so a missing or malformed value stops the app with a message that names every bad variable, instead of failing at the first request that needs it."
        },
        {
          "kind": "text",
          "text": "Second, typed namespaces made with `registerAs()`, one per concern: database, auth, payments. Consumers inject them with `@Inject(databaseConfig.KEY)` and type them with `ConfigType`. Third, other modules get their settings through `forRootAsync()` or `registerAsync()` with `inject`. Never through `process.env` in a decorator, because decorators run at import time, before `.env` is loaded."
        },
        {
          "kind": "text",
          "text": "I'd also mention that real secrets live in the platform's secret store, never in git, and that a `.env.example` file documents what each environment must set."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q34",
      "title": "What is a modular monolith, and how do you keep module borders in Nest?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It's one deployable app split into modules with strict borders. Each module owns its data and offers a small public API, so it can change its insides without breaking anyone. Nest maps onto this directly: a module's `exports` array is its public API. It exports services, never repositories, and other modules only call those exported services."
        },
        {
          "kind": "text",
          "text": "I keep three rules. Each module owns its tables, so no `forFeature()` on another module's entity. Imports go through the module's `index.ts`, never deep into its folder, and a lint rule enforces that. And no import cycles between modules."
        },
        {
          "kind": "text",
          "text": "Why choose it over microservices? You get most of the design benefit, like clear ownership and parallel work, without network calls, distributed transactions or many deploys. If one module later needs to become its own service, its border is already drawn."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 20 opens up the container that has been wiring all of this for you. You'll see how it builds the graph, and you'll build your own `forRoot()` module from the `paymentsConfig` you just wrote."
    }
  ]
};
