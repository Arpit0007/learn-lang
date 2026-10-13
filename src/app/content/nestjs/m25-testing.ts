import { Lesson } from '../../shared/content';

export const M25_TESTING: Lesson = {
  "slug": "m25-testing",
  "title": "M25 Testing your Nest app",
  "nav": "Testing",
  "num": "M25",
  "eyebrow": "Level 7 · Week 15 · ~3 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 7 · Weeks 15–16 · Craft, scale and ship",
      "blocks": [
        {
          "kind": "text",
          "text": "Testing, security, speed, API docs, logs, Docker and deployment. Microservices come last, with an honest look at when one well-organised app is the better choice."
        }
      ]
    },
    {
      "kind": "text",
      "text": "A **test** is a small program that runs your code and checks the result. A Nest app needs three kinds. **Unit tests** check one class on its own. **Integration tests** check your code against a real database. **End-to-end (e2e) tests** send real HTTP requests to the whole app."
    },
    {
      "kind": "text",
      "text": "Module 6 promised that dependency injection makes testing cheap. This is where that promise pays off. A Nest 11 project comes with **Jest**, the test runner that finds your `*.spec.ts` files, runs them and reports what failed. It also comes with **Supertest**, a library that sends HTTP requests to your app in memory. The `@nestjs/testing` package builds a small Nest module just for one test."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "A test is code that checks your code for you. Unit tests check one class, integration tests add a real database, and end-to-end tests call your API like a real client. Good tests let you change code without fear."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The test pyramid"
    },
    {
      "kind": "text",
      "text": "The **test pyramid** is a rule of thumb for how many of each test to write. Many fast unit tests sit at the bottom, fewer integration tests in the middle, and a few slow e2e tests at the top. Each layer catches bugs that the others miss."
    },
    {
      "kind": "table",
      "head": [
        "Layer",
        "What is real",
        "Speed",
        "How many",
        "Catches"
      ],
      "rows": [
        [
          "**Unit**",
          "One class. Everything it uses is a fake",
          "Milliseconds",
          "Many: every rule and edge case",
          "Wrong logic, a missed branch, bad error handling"
        ],
        [
          "**Integration**",
          "Your code plus a real Postgres in Docker",
          "Tens of milliseconds and up",
          "Some: every query and transaction that matters",
          "Wrong SQL, broken constraints, a transaction that doesn't roll back"
        ],
        [
          "**E2E**",
          "The whole app over HTTP: guards, pipes, filters, database",
          "The slowest",
          "Few: the main journeys",
          "Wiring mistakes: a missing guard, the wrong status code, a pipe that isn't applied"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "The shape matters more than the exact numbers. A suite made mostly of e2e tests is slow and **flaky**, which means its tests pass and fail at random. A suite of only unit tests can be all green while the app is broken, because nothing checked that the pieces fit together.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Unit tests: one real class, fakes for the rest"
    },
    {
      "kind": "text",
      "text": "`Test.createTestingModule()` builds a tiny Nest module that holds only the providers you list. The class under test is real. Each of its dependencies is replaced by a **mock**: a fake object whose methods are `jest.fn()`. A `jest.fn()` records every call made to it, and you can tell it what to return. Here is the code we'll test: Module 20's `CheckoutService`, with one more method that places an order (Module 16's transaction) and then takes the payment. It also calls one `OrdersService` method that no earlier module wrote: `cancel()`, which undoes `place()` in one transaction, putting the stock back and marking the order cancelled. Add it next to `place()` when you build this."
    },
    {
      "kind": "example",
      "code": "// checkout/checkout.service.ts\n@Injectable()\nexport class CheckoutService {\n  constructor(\n    private readonly orders: OrdersService,      // place() is Module 16's transaction\n    private readonly payments: PaymentsService,  // Module 20\n  ) {}\n\n  async placeAndPay(userId: string, dto: CreateOrderDto): Promise<Order> {\n    const order = await this.orders.place(userId, dto);   // 404 or 409 here, before any money moves\n\n    // The prices come from the order's items, copied from the database, never from the client.\n    const totalCents = order.items.reduce(\n      (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,\n      0,\n    );\n\n    try {\n      await this.payments.charge(order.id, totalCents);\n    } catch (err) {\n      await this.orders.cancel(order.id);                 // put the stock back\n      throw err;\n    }\n    await this.orders.markPaid(order.id);\n    return { ...order, status: OrderStatus.Paid };\n  }\n}\n\n// checkout/checkout.controller.ts\n@Controller('checkout')\nexport class CheckoutController {\n  constructor(private readonly checkout: CheckoutService) {}\n\n  @Post()   // any logged-in user: the global JwtAuthGuard (Module 17) checks the token\n  placeAndPay(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {\n    return this.checkout.placeAndPay(userId, dto);\n  }\n}",
      "label": "checkout/checkout.service.ts + checkout.controller.ts — the code under test"
    },
    {
      "kind": "example",
      "code": "import { Test } from '@nestjs/testing';\nimport { InsufficientStockException } from '../common/exceptions/insufficient-stock.exception';\nimport { CreateOrderDto } from '../orders/dto/create-order.dto';\nimport { OrdersService } from '../orders/orders.service';\nimport { PaymentsService } from '../payments/payments.service';\nimport { buildOrder, buildOrderItem } from '../../test/builders';\nimport { CheckoutService } from './checkout.service';\n\nconst USER_ID = 'a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f607';\nconst ORDER_ID = '7b4d8a52-1c3e-4f6a-9b2d-5e8f0a1c3d47';\n\ndescribe('CheckoutService.placeAndPay', () => {\n  let service: CheckoutService;\n  let orders: { place: jest.Mock; cancel: jest.Mock; markPaid: jest.Mock };\n  let payments: { charge: jest.Mock };\n  const dto: CreateOrderDto = {           // Module 12's DTO: an address and at least one item\n    shippingAddress: { line1: '1 Test Street', city: 'Berlin', postcode: '10115' },\n    items: [{ productId: 7, quantity: 3 }],\n  };\n\n  beforeEach(async () => {\n    // Fresh fakes for every test, so no test can see another test's calls.\n    orders = {\n      place: jest.fn().mockResolvedValue(\n        buildOrder({ id: ORDER_ID, items: [buildOrderItem({ productId: 7, quantity: 3, unitPrice: 25 })] }),\n      ),\n      cancel: jest.fn(),\n      markPaid: jest.fn(),\n    };\n    payments = { charge: jest.fn().mockResolvedValue(undefined) };\n\n    const moduleRef = await Test.createTestingModule({\n      providers: [\n        CheckoutService,                                   // the real class...\n        { provide: OrdersService, useValue: orders },      // ...and a fake\n        { provide: PaymentsService, useValue: payments },  //    for each dependency\n      ],\n    }).compile();\n\n    service = moduleRef.get(CheckoutService);\n  });\n\n  it('charges the total worked out from the database prices', async () => {\n    await service.placeAndPay(USER_ID, dto);\n\n    expect(payments.charge).toHaveBeenCalledWith(ORDER_ID, 7500);   // 3 × €25.00, in cents\n  });\n\n  it('cancels the order and rethrows when the payment fails', async () => {\n    payments.charge.mockRejectedValue(new Error('card declined'));\n\n    await expect(service.placeAndPay(USER_ID, dto)).rejects.toThrow('card declined');\n    expect(orders.cancel).toHaveBeenCalledWith(ORDER_ID);\n    expect(orders.markPaid).not.toHaveBeenCalled();\n  });\n\n  it('never charges when the order could not be placed', async () => {\n    orders.place.mockRejectedValue(new InsufficientStockException('7', 3, 1));\n\n    await expect(service.placeAndPay(USER_ID, dto)).rejects.toBeInstanceOf(InsufficientStockException);\n    expect(payments.charge).not.toHaveBeenCalled();\n  });\n});",
      "label": "checkout/checkout.service.spec.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Each test reads as one fact: set up the fakes, call one method, check one outcome. `mockResolvedValue` makes a fake return a promise that succeeds; `mockRejectedValue` makes it fail. The fakes are rebuilt in `beforeEach`, so a call recorded in one test can never leak into the next. The `buildOrder` and `buildOrderItem` helpers are test data builders, shown later in this module.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "`TestBed.configureTestingModule()` and `Test.createTestingModule()` are the same idea: a small module built only for the test, with real providers swapped for fakes. There are three differences. Nest's `compile()` is async, so you `await` it. You read an instance with `moduleRef.get(X)` instead of `TestBed.inject(X)`. And there is no component fixture or change detection: you call methods directly, or send real HTTP requests with Supertest. If you know `jasmine.createSpy()`, `jest.fn()` is the same tool."
        }
      ]
    },
    {
      "kind": "text",
      "text": "**Version note.** This module uses Jest, which Nest 11 projects ship with (Jest 30 in the current Nest 11 starter). Nest 12, released in August 2026, makes **Vitest** the default for new ESM projects and keeps Jest for CommonJS ones. With Vitest the code is the same, with `vi.fn()` and `vi.spyOn()` in place of `jest.fn()` and `jest.spyOn()`.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Testing guards and pipes"
    },
    {
      "kind": "text",
      "text": "A guard is a class with one method, so you can often skip the testing module and call it directly. The only awkward part is the `ExecutionContext`, the object that describes the current request. Build a fake one with just the methods your guard calls. This tests the `RolesGuard` from Modules 10 and 18:"
    },
    {
      "kind": "example",
      "code": "import { ExecutionContext } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport type { AuthUser, Role } from './auth-user';\nimport { ROLES_KEY } from './auth.decorators';\nimport { RolesGuard } from './roles.guard';\n\n// A fake ExecutionContext: only the methods RolesGuard actually calls.\nfunction contextFor(user?: AuthUser): ExecutionContext {\n  return {\n    getHandler: () => undefined,\n    getClass: () => undefined,\n    switchToHttp: () => ({ getRequest: () => ({ user }) }),\n  } as unknown as ExecutionContext;\n}\n\nconst ana: AuthUser = { id: 'a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f607', email: 'ana@example.com', roles: ['user'] };\nconst raj: AuthUser = { id: 'c9e8d7f6-1a2b-4c3d-8e4f-5a6b7c8d9e0f', email: 'raj@example.com', roles: ['user', 'admin'] };\n\ndescribe('RolesGuard', () => {\n  const reflector = new Reflector();\n  const guard = new RolesGuard(reflector);\n\n  // Fake the metadata BY KEY: the guard may ask for other keys too, such as @Public()'s.\n  const routeNeeds = (roles?: Role[]) =>\n    jest.spyOn(reflector, 'getAllAndOverride')\n      .mockImplementation((key) => (key === ROLES_KEY ? roles : undefined));\n\n  afterEach(() => jest.restoreAllMocks());\n\n  it('lets any logged-in user through a route without @Roles()', () => {\n    routeNeeds(undefined);\n    expect(guard.canActivate(contextFor(ana))).toBe(true);\n  });\n\n  it('lets an admin through an admin route', () => {\n    routeNeeds(['admin']);\n    expect(guard.canActivate(contextFor(raj))).toBe(true);\n  });\n\n  it('stops a plain user on an admin route', () => {\n    routeNeeds(['admin']);\n    expect(guard.canActivate(contextFor(ana))).toBe(false);\n  });\n});",
      "label": "auth/roles.guard.spec.ts"
    },
    {
      "kind": "text",
      "text": "`jest.spyOn` replaces one method on a real object, and `restoreAllMocks` puts it back. Answering by key matters: Module 10's guard first asks whether the route is `@Public()`, and a fake that returned `['admin']` for *every* key would make that check pass and wave everyone through. If your guard throws `ForbiddenException` instead of returning `false`, assert with `expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException)`.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "A pipe is just as direct: call `transform(value, metadata)` yourself. The most valuable pipe test is often not for a pipe you wrote but for your **DTO rules**, run through a `ValidationPipe` with the same options as `main.ts`:"
    },
    {
      "kind": "example",
      "code": "import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';\nimport { CreateProductDto } from './create-product.dto';\n\ndescribe('CreateProductDto', () => {\n  // The same options main.ts uses (Module 7).\n  const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });\n  const body: ArgumentMetadata = { type: 'body', metatype: CreateProductDto };\n  const valid = {\n    sku: 'LAMP-001',                 // the field Module 14's exercise adds to this DTO\n    name: 'Desk lamp',\n    price: 29.99,\n    categoryId: '0b0c5f0e-4d8a-4c3b-9a51-2f6d1e7c9a10',\n  };\n\n  it('accepts a valid product and returns a real CreateProductDto', async () => {\n    await expect(pipe.transform(valid, body)).resolves.toBeInstanceOf(CreateProductDto);\n  });\n\n  it.each([\n    ['a negative price', { ...valid, price: -1 }],\n    ['an empty name', { ...valid, name: '' }],\n    ['a field the DTO does not declare', { ...valid, role: 'admin' }],\n  ])('rejects %s', async (_case, input) => {\n    await expect(pipe.transform(input, body)).rejects.toBeInstanceOf(BadRequestException);\n  });\n});",
      "label": "products/dto/create-product.dto.spec.ts"
    },
    {
      "kind": "text",
      "text": "`it.each` runs one test per row, and `%s` puts the first column into the test name. The last row is a security test, not a style test: it proves mass assignment is blocked, which Module 26 explains.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Integration tests: a real database in Docker"
    },
    {
      "kind": "text",
      "text": "Some code can only be checked against a real database: a query, a unique constraint, a transaction that must roll back. Mocking TypeORM there only tests your mock, not your SQL. Instead, run a throwaway Postgres in a **Docker container**, a small isolated process started from a ready-made image (Module 29 covers Docker fully), and point the tests at it. The e2e tests later boot the whole app, which also needs Redis (Modules 22 and 23), so the file starts one of those too."
    },
    {
      "kind": "example",
      "code": "# Start both:  docker compose -f docker-compose.test.yml up -d --wait\nservices:\n  db-test:\n    image: postgres:18-alpine\n    environment:\n      POSTGRES_USER: test\n      POSTGRES_PASSWORD: test\n      POSTGRES_DB: shop_test\n    ports:\n      - \"5433:5432\"          # 5433, so it never clashes with your dev database on 5432\n    tmpfs:\n      - /var/lib/postgresql        # the data lives in memory: fast, and gone when it stops\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U test -d shop_test\"]\n      interval: 2s\n      timeout: 3s\n      retries: 15\n\n  redis-test:\n    image: redis:7-alpine\n    ports:\n      - \"6380:6379\"\n    healthcheck:\n      test: [\"CMD\", \"redis-cli\", \"ping\"]\n      interval: 2s\n      timeout: 3s\n      retries: 15",
      "lang": "text",
      "label": "docker-compose.test.yml"
    },
    {
      "kind": "text",
      "text": "`--wait` makes Compose wait until the health checks pass, so tests never start before Postgres is ready. If you'd rather not manage the containers yourself, the **Testcontainers** library (`@testcontainers/postgresql`) can start the same container from inside the test run.",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "import { Test, TestingModule } from '@nestjs/testing';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { DataSource } from 'typeorm';\nimport { Category } from '../categories/category.entity';\nimport { InsufficientStockException } from '../common/exceptions/insufficient-stock.exception';\nimport { Product } from '../products/entities/product.entity';\nimport { Tag } from '../tags/tag.entity';\nimport { User } from '../users/entities/user.entity';\nimport { OrderItem } from './entities/order-item.entity';\nimport { Order, OrderStatus } from './entities/order.entity';\nimport { OrdersService } from './orders.service';\nimport { resetDatabase, saveProduct, saveUser } from '../../test/builders';\n\nconst ADDRESS = { line1: '1 Test Street', city: 'Berlin', postcode: '10115' };   // Module 12's AddressDto\n\ndescribe('OrdersService.place (integration)', () => {\n  let moduleRef: TestingModule;\n  let orders: OrdersService;\n  let db: DataSource;\n\n  beforeAll(async () => {\n    moduleRef = await Test.createTestingModule({\n      imports: [\n        TypeOrmModule.forRoot({\n          type: 'postgres',\n          url: process.env.TEST_DATABASE_URL ?? 'postgres://test:test@localhost:5433/shop_test',\n          entities: [Category, Product, Tag, User, Order, OrderItem],\n          synchronize: true,   // fine for a throwaway test database, never in production\n          dropSchema: true,    // every run starts from an empty schema\n        }),\n      ],\n      providers: [OrdersService],   // Module 16's version needs only the DataSource\n    }).compile();\n\n    orders = moduleRef.get(OrdersService);\n    db = moduleRef.get(DataSource);\n  });\n\n  beforeEach(() => resetDatabase(db));\n  afterAll(() => moduleRef.close());\n\n  it('takes the stock and saves the order with its items, together', async () => {\n    const ana = await saveUser(db);\n    const lamp = await saveProduct(db, { stock: 5 });\n\n    const order = await orders.place(ana.id, { shippingAddress: ADDRESS, items: [{ productId: lamp.id, quantity: 2 }] });\n\n    expect(order.status).toBe(OrderStatus.Placed);\n    expect(order.items).toHaveLength(1);\n    const fresh = await db.getRepository(Product).findOneByOrFail({ id: lamp.id });\n    expect(fresh.stock).toBe(3);\n  });\n\n  it('refuses to oversell and leaves nothing behind', async () => {\n    const ana = await saveUser(db);\n    const lamp = await saveProduct(db, { stock: 1 });\n\n    await expect(orders.place(ana.id, { shippingAddress: ADDRESS, items: [{ productId: lamp.id, quantity: 2 }] }))\n      .rejects.toBeInstanceOf(InsufficientStockException);\n\n    const fresh = await db.getRepository(Product).findOneByOrFail({ id: lamp.id });\n    expect(fresh.stock).toBe(1);                              // nothing written, or all of it undone\n    expect(await db.getRepository(Order).count()).toBe(0);\n  });\n});",
      "label": "orders/orders.service.int-spec.ts"
    },
    {
      "kind": "text",
      "text": "The `.int-spec.ts` ending keeps these out of the fast unit run. Give them their own Jest config with `\"testRegex\": \".int-spec.ts$\"` and a script such as `\"test:int\": \"jest --config test/jest-int.json --runInBand\"`. List every entity a relation can reach (a product needs its category and tags), or TypeORM refuses to start. `synchronize` builds the tables from your entities, which is fine here because this database is thrown away; production always uses migrations (Module 15). If your `OrdersService` has grown more dependencies since Module 16, add a fake for each one to `providers`.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · tests that share a database",
      "blocks": [
        {
          "kind": "text",
          "text": "Jest runs test files in parallel by default, each file in its own worker process. Two integration files on one database truncate each other's rows mid-test, and you get failures that vanish when you re-run them. Run integration and e2e suites with `--runInBand` (or `-i`), so files run one at a time. Reset the tables in `beforeEach`, not `afterEach`: then a test that crashed still leaves the next one a clean start. And never point tests at a database you care about; use a separate `TEST_DATABASE_URL`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "End-to-end tests with Supertest"
    },
    {
      "kind": "text",
      "text": "An e2e test boots your whole `AppModule` and sends real HTTP requests to it with Supertest. Nothing is faked except what you choose to replace, which is usually the outside world: the payment provider, email, other companies' APIs. Two calls make the app ready. `createNestApplication()` builds it, and `app.init()` registers the routes and runs the lifecycle hooks, without calling `listen()`; Supertest handles the connection itself. Because it is the real `AppModule`, it needs the environment variables Module 19 validates, pointing at the test database and the test Redis."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the test app skips main.ts",
      "blocks": [
        {
          "kind": "text",
          "text": "Your e2e test builds the app from `AppModule`; it never runs `main.ts`. So everything `main.ts` does to the app is missing in the test: Module 3's `/api` prefix and `ValidationPipe`, Module 18's `cookieParser()`. The classic symptoms are an invalid body that gets `201` in the test and `400` in production, and a refresh endpoint that never finds its cookie. Move that setup into one exported function, `configureApp(app)`, and call it from both `main.ts` and every e2e test. One setting can't live there: `rawBody: true`, which Module 21's webhook signatures need, is an option for *creating* the app, so pass it to both `NestFactory.create()` and `createNestApplication()`. Anything registered in a module with `APP_PIPE`, `APP_GUARD`, `APP_FILTER` or `APP_INTERCEPTOR` is safe: it lives in the module graph, so the test app gets it too."
        }
      ]
    },
    {
      "kind": "example",
      "code": "import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';\nimport cookieParser from 'cookie-parser';\n\n// Everything that changes how a request is handled. main.ts and every e2e test call it.\nexport function configureApp<T extends INestApplication>(app: T): T {\n  app.setGlobalPrefix('api');                              // Module 3: every route under /api\n  app.enableVersioning({ type: VersioningType.URI });\n  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));\n  app.use(cookieParser());                                 // Module 18: the refresh-token cookie\n  return app;\n}\n\n// main.ts keeps what tests don't need (helmet, CORS, Swagger, listen) and creates the app with\n//   const app = await NestFactory.create(AppModule, { rawBody: true });   // Module 21\n//   configureApp(app);",
      "label": "src/app.setup.ts",
      "verdict": "good"
    },
    {
      "kind": "example",
      "code": "import { INestApplication } from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport { App } from 'supertest/types';\nimport { DataSource } from 'typeorm';\nimport { AppModule } from '../src/app.module';\nimport { configureApp } from '../src/app.setup';\nimport type { JwtPayload } from '../src/auth/auth-user';\nimport { CreateOrderDto } from '../src/orders/dto/create-order.dto';\nimport { PaymentsService } from '../src/payments/payments.service';\nimport { User } from '../src/users/entities/user.entity';\nimport { resetDatabase, saveProduct, saveUser } from './builders';\n\n// A valid body for Module 12's CreateOrderDto: an address, and two of one product.\nconst twoOf = (productId: number): CreateOrderDto => ({\n  shippingAddress: { line1: '1 Test Street', city: 'Berlin', postcode: '10115' },\n  items: [{ productId, quantity: 2 }],\n});\n\ndescribe('Checkout (e2e)', () => {\n  let app: INestApplication<App>;\n  let db: DataSource;\n  const payments = { charge: jest.fn().mockResolvedValue(undefined) };\n\n  // A real token for a real user, signed with the app's own key (Module 17),\n  // so the real global JwtAuthGuard and RolesGuard check every request.\n  const tokenFor = (user: User) => {\n    const payload: JwtPayload = { sub: user.id, email: user.email, roles: user.roles };\n    return app.get(JwtService).signAsync(payload);\n  };\n\n  beforeAll(async () => {\n    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })\n      .overrideProvider(PaymentsService).useValue(payments)   // never charge a real card\n      .compile();\n\n    app = configureApp(moduleRef.createNestApplication({ rawBody: true }));   // as main.ts does\n    await app.init();\n    db = app.get(DataSource);\n  });\n\n  beforeEach(async () => {\n    jest.clearAllMocks();          // forget calls from earlier tests, keep the fake's behaviour\n    await resetDatabase(db);\n  });\n\n  afterAll(() => app.close());\n\n  it('POST /api/checkout → 201, charged at the database price', async () => {\n    const ana = await saveUser(db);\n    const lamp = await saveProduct(db, { price: 25, stock: 5 });\n\n    const res = await request(app.getHttpServer())\n      .post('/api/checkout')\n      .set('Authorization', `Bearer ${await tokenFor(ana)}`)\n      .send(twoOf(lamp.id))\n      .expect(201);\n\n    // Module 11's interceptor wraps every successful body in { data }\n    expect(res.body.data).toMatchObject({ userId: ana.id, status: 'paid' });\n    expect(payments.charge).toHaveBeenCalledWith(res.body.data.id, 5000);\n  });\n\n  it('POST /api/checkout → 400 when the client sends its own total', async () => {\n    const ana = await saveUser(db);\n\n    await request(app.getHttpServer())\n      .post('/api/checkout')\n      .set('Authorization', `Bearer ${await tokenFor(ana)}`)\n      .send({ ...twoOf(1), total: 0.01 })   // valid in every other way, so `total` is the only reason\n      .expect(400);\n  });\n\n  it('POST /api/checkout → 401 without a token', () => {\n    return request(app.getHttpServer())\n      .post('/api/checkout')\n      .send(twoOf(1))\n      .expect(401);\n  });\n});",
      "label": "test/checkout.e2e-spec.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "This matches the current Nest 11 starter: `import request from 'supertest'`, and `INestApplication<App>` so `getHttpServer()` is typed. Projects generated by Nest 10 or the first Nest 11 releases have no `esModuleInterop` in `tsconfig.json` and write `import * as request from 'supertest'`; keep whichever style your project already uses. The token is signed by the app's own `JwtService` with the same key the app checks, so nothing about auth is faked: the global guards from Modules 10 and 17 run exactly as they do in production.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · overriding a global guard",
      "blocks": [
        {
          "kind": "text",
          "text": "`overrideGuard()` only replaces guards bound with `@UseGuards()`. Module 10 registers `JwtAuthGuard` and `RolesGuard` globally, as `{ provide: APP_GUARD, useClass: ... }`, so they are created behind the `APP_GUARD` token, `overrideGuard(JwtAuthGuard)` never reaches them, and your fake is silently ignored. Usually you don't need a fake at all: sign a real token, as the test above does. If you really must replace a global guard, the Nest docs give the fix: register it as `{ provide: APP_GUARD, useExisting: JwtAuthGuard }`, add `JwtAuthGuard` itself to `providers`, and override it with `overrideProvider(JwtAuthGuard).useClass(FakeAuthGuard)`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Test data builders"
    },
    {
      "kind": "text",
      "text": "Tests need objects: a product, a user, an order. Building each one by hand in every test buries the one field the test is about under ten that don't matter. A **test data builder** is a function that returns a valid object with sensible defaults. Each test overrides only the fields it cares about."
    },
    {
      "kind": "example",
      "code": "import { DataSource } from 'typeorm';\nimport { Category } from '../src/categories/category.entity';\nimport { OrderItem } from '../src/orders/entities/order-item.entity';\nimport { Order, OrderStatus } from '../src/orders/entities/order.entity';\nimport { ProductStatus } from '../src/products/dto/create-product.dto';   // Module 7's enum\nimport { Product } from '../src/products/entities/product.entity';\nimport { User } from '../src/users/entities/user.entity';\n\nlet seq = 0;\nconst next = () => ++seq;   // unique values, so a UNIQUE index never trips\n\n// A valid product. Tests override only what they are about:\n//   buildProduct({ stock: 0 })  reads as \"a product that is sold out\".\nexport function buildProduct(overrides: Partial<Product> = {}): Product {\n  return Object.assign(new Product(), {\n    sku: `SKU-${next()}`,\n    name: 'Desk lamp',\n    createdBy: 'a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f607',   // Modules 13 and 14: who created it\n    price: 29.99,\n    stock: 10,\n    status: ProductStatus.Live,\n    ...overrides,\n  });\n}\n\nexport function buildUser(overrides: Partial<User> = {}): User {\n  return Object.assign(new User(), {\n    email: `user${next()}@test.local`,\n    passwordHash: 'not-a-real-hash',\n    roles: ['user'],                      // Module 10's roles: 'user' | 'admin'\n    ...overrides,\n  });\n}\n\nexport function buildOrderItem(overrides: Partial<OrderItem> = {}): OrderItem {\n  return Object.assign(new OrderItem(), { productId: 1, quantity: 1, unitPrice: 29.99, ...overrides });\n}\n\nexport function buildOrder(overrides: Partial<Order> = {}): Order {\n  return Object.assign(new Order(), {\n    userId: 'a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f607',\n    status: OrderStatus.Placed,\n    items: [buildOrderItem()],\n    ...overrides,\n  });\n}\n\n// Saved versions, for integration and e2e tests.\nexport function saveUser(db: DataSource, overrides: Partial<User> = {}): Promise<User> {\n  return db.getRepository(User).save(buildUser(overrides));\n}\n\nexport async function saveProduct(db: DataSource, overrides: Partial<Product> = {}): Promise<Product> {\n  const category = await db.getRepository(Category).save({ name: `Category ${next()}` });\n  return db.getRepository(Product).save(buildProduct({ categoryId: category.id, ...overrides }));\n}\n\n// Empty every entity table in one statement and reset the id counters.\nexport async function resetDatabase(db: DataSource): Promise<void> {\n  const tables = db.entityMetadatas.map((m) => `\"${m.tableName}\"`).join(', ');\n  await db.query(`TRUNCATE ${tables} RESTART IDENTITY CASCADE`);\n}",
      "label": "test/builders.ts"
    },
    {
      "kind": "text",
      "text": "The `build…` functions return objects that are not saved yet, for unit tests. The `save…` functions store them, for integration and e2e tests; `saveProduct()` creates a category first, because `categoryId` is a required foreign key (Module 15). When an entity gains a required field, you fix one builder instead of forty tests.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What not to test"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**The framework.** Don't test that `@Get()` routes a request or that `@IsEmail()` rejects a bad email; Nest and class-validator have their own tests. Test *your* rules, such as which fields your DTO forbids.",
        "**Private methods.** Test them through the public method that uses them. If a private method seems to need its own tests, it probably wants to be its own class.",
        "**Implementation details.** Check results, and the calls that matter to the outside world, such as a charge or an email. Don't check the exact order of internal calls. Tests that copy the code line by line break on every refactor and catch nothing.",
        "**Code you don't own, by mocking it.** Mocking the chain `createQueryBuilder().where().andWhere().getMany()` only proves that you can mock it. Test queries with an integration test instead.",
        "**Thin controllers, one by one.** A controller that only calls a service is covered by your e2e tests. Unit-test a controller only when it contains real logic, and Module 5 says it shouldn't.",
        "**Coverage for its own sake.** Coverage is the share of your code lines that ran during the tests. 100% can still mean nothing was checked. Aim to cover every business rule and every error path, and let the number follow."
      ]
    },
    {
      "kind": "quiz",
      "question": "`OrdersService.place()` (Module 16) must take the stock and save the order in one transaction, and leave nothing behind when there isn't enough stock. Which test proves that?",
      "options": [
        "A unit test with the TypeORM repository mocked",
        "An integration test against a real Postgres",
        "Only an e2e test, because it uses the whole app",
        "None: transactions are TypeORM's job, so trust the library"
      ],
      "answer": 1,
      "why": "**An integration test against a real Postgres.** A rollback is the database's behaviour, so a mock can only repeat what you told it to say. An e2e test would touch the same code, but slowly, and only on the paths an HTTP call happens to take, so it's the wrong tool for edge cases like overselling. And \"trust the library\" misses the point: TypeORM is fine, but the question is whether *your* code started the transaction and used it for every write."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 25.1",
      "title": "An e2e suite for the Products API",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `test/products.e2e-spec.ts` for the Products API from Modules 13–15. Anyone may read products (`@Public()` on the `GET` routes), any logged-in user may create one (`create(dto, userId)`), and only an admin may delete one (`@Auth('admin')` on `DELETE`, Module 13). Cover these six cases, each in its own `it()`:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "`POST /api/products` as a plain user, with a valid body → `201`.",
            "The same request with no token → `401`.",
            "A body with a negative `price` → `400`.",
            "`DELETE /api/products/:id` as a plain user → `403`.",
            "The same `DELETE` as an admin → `204`.",
            "`GET /api/products/999999` → `404`."
          ]
        },
        {
          "kind": "text",
          "text": "Use `configureApp()`, real tokens from the app's `JwtService`, and `resetDatabase` before each test."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "describe('Products (e2e)', () => {\n  let app: INestApplication<App>;\n  let db: DataSource;\n  let adminToken: string;\n  let userToken: string;\n  let valid: { sku: string; name: string; price: number; categoryId: string };\n\n  const tokenFor = (user: User) =>\n    app.get(JwtService).signAsync({ sub: user.id, email: user.email, roles: user.roles });\n  const post = (token: string | null, body: object) => {\n    const req = request(app.getHttpServer()).post('/api/products');\n    return (token ? req.set('Authorization', `Bearer ${token}`) : req).send(body);\n  };\n  const remove = (token: string, id: number) =>\n    request(app.getHttpServer()).delete(`/api/products/${id}`).set('Authorization', `Bearer ${token}`);\n\n  beforeAll(async () => {\n    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = configureApp(moduleRef.createNestApplication({ rawBody: true }));\n    await app.init();\n    db = app.get(DataSource);\n  });\n\n  beforeEach(async () => {\n    await resetDatabase(db);\n    adminToken = await tokenFor(await saveUser(db, { roles: ['user', 'admin'] }));\n    userToken = await tokenFor(await saveUser(db));\n    const category = await db.getRepository(Category).save({ name: 'Lamps' });\n    // sku: the field Module 14's exercise adds to CreateProductDto\n    valid = { sku: 'LAMP-001', name: 'Desk lamp', price: 29.99, categoryId: category.id };\n  });\n\n  afterAll(() => app.close());\n\n  it('lets any logged-in user create a product', () => post(userToken, valid).expect(201));\n\n  it('asks for a token first', () => post(null, valid).expect(401));\n\n  it('rejects a negative price', () => post(userToken, { ...valid, price: -1 }).expect(400));\n\n  it('stops a plain user deleting one', async () => {\n    const lamp = await saveProduct(db);\n    await remove(userToken, lamp.id).expect(403);\n  });\n\n  it('lets an admin delete one', async () => {\n    const lamp = await saveProduct(db);\n    await remove(adminToken, lamp.id).expect(204);\n  });\n\n  it('returns 404 for a product that does not exist', () =>\n    request(app.getHttpServer()).get('/api/products/999999').expect(404));\n});",
              "label": "test/products.e2e-spec.ts (imports as in checkout.e2e-spec.ts, plus Category)"
            },
            {
              "kind": "text",
              "text": "Real tokens are the trick. Each test signs one for the user it needs, so every authorisation rule is checked by the real guards, with no fake to keep in sync. If the plain user's `DELETE` returns `204`, `@Auth('admin')` is missing from that route, and you've just found the kind of wiring bug e2e tests exist for. The `401` comes from the global `JwtAuthGuard`, before validation even runs.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 25.2",
      "title": "Which of these tests would you delete?",
      "blocks": [
        {
          "kind": "text",
          "text": "A teammate's pull request adds six tests. Decide which to keep and which to delete, with one reason each."
        },
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "`ProductsController.findOne` calls `productsService.findOne` with the same id.",
            "`placeAndPay` charges the total worked out from the database prices.",
            "`@IsEmail()` rejects `not-an-email`.",
            "`CreateUserDto` rejects a body that includes a `roles` field.",
            "`OrdersService` calls `manager.create()` before `manager.save()`.",
            "`GET /api/orders/:id` returns `404` when a user asks for someone else's order."
          ]
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": true,
              "items": [
                "**Delete.** It is a thin controller, and the e2e tests already cover it.",
                "**Keep.** This is a core business rule, and getting it wrong costs money.",
                "**Delete.** It tests class-validator, not your code.",
                "**Keep.** It is your rule, and a security one: it blocks mass assignment.",
                "**Delete.** It is an implementation detail. It breaks on any refactor and proves nothing a user would notice.",
                "**Keep.** It is an access-control rule, exactly the kind of bug Module 26 is about, and only a test that logs in as a second user catches it."
              ]
            },
            {
              "kind": "text",
              "text": "Three of the six were tests of code that isn't yours or of how the code is written. That ratio is common in real pull requests, and deleting such tests makes a suite faster *and* more useful.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q45",
      "title": "How would you test a NestJS application?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With a pyramid of three layers. Unit tests are the base: `Test.createTestingModule()` with the class under test real and its dependencies replaced by `useValue` mocks built from `jest.fn()`, so each business rule and error path runs in milliseconds with no I/O. Guards and pipes I usually test directly, with a fake `ExecutionContext` or by calling `transform()`. The middle layer is integration tests against a real Postgres in Docker, for anything whose correctness lives in the database: queries, constraints, transactions and rollbacks. Mocking the ORM there only tests the mock. The top is a small set of e2e tests that boot `AppModule`, apply the same global setup as `main.ts`, and drive the real HTTP stack with Supertest, which catches wiring bugs like a missing guard or a pipe that isn't applied."
        },
        {
          "kind": "text",
          "text": "Around that I'd add test data builders, so each test states only what it is about; a table reset before each database test and `--runInBand`, so suites don't share state; external services such as payments always overridden; and the whole lot running in CI on every pull request. I judge the suite by whether it catches real regressions, not by the coverage number."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q46",
      "title": "How do you replace a dependency in a Nest test, and what's the catch with global guards?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** In a unit test, I list the class under test in `providers` and give each dependency a fake under the same token, for example `{ provide: PaymentsService, useValue: { charge: jest.fn() } }`. For a TypeORM repository, the token comes from `getRepositoryToken(Order)`. `useClass` and `useFactory` work too, and `useMocker()` can create a mock for every dependency I didn't list. In an e2e test, I import the real `AppModule` and swap pieces afterwards: `overrideProvider(X).useValue(...)`, plus `overrideGuard`, `overridePipe`, `overrideInterceptor` and `overrideFilter` for enhancers bound with decorators."
        },
        {
          "kind": "text",
          "text": "The catch: a guard registered globally with `{ provide: APP_GUARD, useClass: JwtAuthGuard }` is created behind the `APP_GUARD` token, so `overrideGuard(JwtAuthGuard)` never reaches it. Often the better answer is not to fake auth at all, and to sign a real token with the app's `JwtService`. When a fake is needed, register the guard with `useExisting: JwtAuthGuard`, list `JwtAuthGuard` as a provider, and replace it with `overrideProvider(JwtAuthGuard)`. A related gotcha is that the test app never runs `main.ts`, so anything set up there with `app.useGlobal…()` has to move into a shared setup function or into `APP_*` providers."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 26 turns to security: the OWASP Top 10, and the handful of Nest settings and habits that stop most real attacks. The e2e tests you just learned are how you'll prove each fix works."
    }
  ]
};
