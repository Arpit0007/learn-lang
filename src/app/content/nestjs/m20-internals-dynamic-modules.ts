import { Lesson } from '../../shared/content';

export const M20_INTERNALS_DYNAMIC_MODULES: Lesson = {
  "slug": "m20-internals-dynamic-modules",
  "title": "M20 Nest internals and dynamic modules",
  "nav": "Internals & dynamic modules",
  "num": "M20",
  "eyebrow": "Level 6 · Week 11 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "For nineteen modules, Nest's container has built your app for you. Now we open it up. Once you know how it works, the strange errors start to make sense: the `?` in `Nest can't resolve dependencies`, the endpoint that got slow after a small refactor, the circular dependency warning."
    },
    {
      "kind": "text",
      "text": "You'll also build your own **dynamic module**: a module that takes settings, like `ConfigModule.forRoot()` or `TypeOrmModule.forRootAsync()`. It's how you package code so that other modules, or other apps, can reuse it."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "At startup, Nest reads your modules, lists every class it must create, and creates each one after the things it needs. Most objects are made once and shared by everyone. A dynamic module is a module with settings: you call `forRoot()`, and it gives back a module built from those settings."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "How the container builds your app"
    },
    {
      "kind": "text",
      "text": "The **container** is the part of Nest that creates your classes and hands them to each other. Module 3 gave you the outline. Here are the moving parts, with the names you will see in stack traces:"
    },
    {
      "kind": "table",
      "head": [
        "Part",
        "What it is"
      ],
      "rows": [
        [
          "`NestContainer`",
          "The whole registry: every module in the app, stored by ID."
        ],
        [
          "`Module`",
          "One per module. It holds maps of its providers, controllers and exports, and links to the modules it imports."
        ],
        [
          "`InstanceWrapper`",
          "One per provider. It knows the class or factory, its dependencies, its scope, and the instances made so far."
        ],
        [
          "`Injector`",
          "The worker. It reads a class's constructor tokens, finds each one, and calls `new`."
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Under the hood · from AppModule to a running app",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "**Scan.** Start at `AppModule` and follow every `imports` entry. Each module gets an ID and a `Module` record with its providers, controllers and exports.",
            "**Link.** Global modules are linked to every other module, so their exports are visible everywhere.",
            "**Create.** For each provider, the injector reads the constructor parameter types (the `design:paramtypes` metadata from Module 3) and looks up each token: first in the same module, then in the exports of the modules it imports. A dependency is always created before the class that needs it. Each instance is stored in its `InstanceWrapper`.",
            "**Initialise.** Nest runs the `onModuleInit()` and `onApplicationBootstrap()` hooks, and then the server starts listening."
          ]
        },
        {
          "kind": "text",
          "text": "All of this happens once, at startup. That's why a missing provider fails before the first request, and why a singleton costs nothing per request."
        }
      ]
    },
    {
      "kind": "text",
      "text": "One Nest 11 detail: the container tells dynamic modules apart by object reference. Two separate `FeatureFlagsModule.forRoot({ ... })` calls make two modules with two separate instances, even if the options are identical. Nest 10 merged them by comparing the options. If two modules must share one instance, create the dynamic module once, store it in a constant, and import the constant in both places."
    },
    {
      "kind": "text",
      "text": "Upgrading from Nest 10 and relying on the old merge? `NestFactory.create(AppModule, { moduleIdGeneratorAlgorithm: 'deep-hash' })` brings it back.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Tokens: what the container looks things up by"
    },
    {
      "kind": "text",
      "text": "Every provider is stored under a **token**. Module 3 showed why an interface can't be one: interfaces disappear when TypeScript compiles. That leaves three good kinds:"
    },
    {
      "kind": "table",
      "head": [
        "Token",
        "Example",
        "Use it when"
      ],
      "rows": [
        [
          "A class",
          "`ProductsService`",
          "The normal case. The class is both the token and the implementation."
        ],
        [
          "An abstract class",
          "`FileStorage` (Module 21)",
          "Several implementations sit behind one name, and you want type-safe injection without `@Inject()`."
        ],
        [
          "A `Symbol` or string",
          "`FEATURE_FLAGS_OPTIONS`",
          "Values that aren't classes: options, config, a client object from a library. Prefer a `Symbol`, which can never clash with another library's string by accident."
        ]
      ]
    },
    {
      "kind": "text",
      "text": "`ConfigurableModuleBuilder`, later in this module, generates a unique token for your module's options, so you rarely need to write one yourself."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Injection scopes and what they cost"
    },
    {
      "kind": "text",
      "text": "Module 6 introduced the three scopes. Here is what each one costs inside the container:"
    },
    {
      "kind": "table",
      "head": [
        "Scope",
        "Instances",
        "Cost",
        "Lifecycle hooks"
      ],
      "rows": [
        [
          "`DEFAULT`",
          "One, made at startup",
          "Nothing after startup",
          "Yes"
        ],
        [
          "`REQUEST`",
          "One per request, for it and for everything that depends on it",
          "A new set of objects on every request, and more garbage to collect",
          "Never called"
        ],
        [
          "`TRANSIENT`",
          "One for each class that injects it",
          "Small, but multiplied by the number of consumers",
          "Yes, for instances made at startup"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "The danger is the one from Module 6: request scope spreads *upward*. Make `AuditLogger` request-scoped, and `OrdersService`, which injects it, becomes request-scoped too, and so does `OrdersController`. Nest now builds all three on every request. Usually you only wanted one thing, the current request's ID, and Node has a built-in tool for exactly that. Module 6 promised it to you."
    },
    {
      "kind": "text",
      "text": "**`AsyncLocalStorage`** (from `node:async_hooks`) keeps a value for the length of one piece of async work. Set it once at the start of a request, and any code that runs because of that request can read it, even many `await`s later. There is no scope and no injected request."
    },
    {
      "kind": "example",
      "code": "import { AsyncLocalStorage } from 'node:async_hooks';\nimport { randomUUID } from 'node:crypto';\nimport { Injectable, Logger, NestMiddleware } from '@nestjs/common';\nimport type { NextFunction, Request, Response } from 'express';\n\nexport interface RequestContext {\n  requestId: string;\n  userId?: string; // filled in later by your auth guard, once the token is checked\n}\n\n// One store for the whole app. Each request gets its own value inside it.\nconst storage = new AsyncLocalStorage<RequestContext>();\n\nexport const currentRequest = (): RequestContext | undefined => storage.getStore();\n\n@Injectable()\nexport class RequestContextMiddleware implements NestMiddleware {\n  use(req: Request, _res: Response, next: NextFunction): void {\n    const requestId = req.header('x-correlation-id') ?? randomUUID();\n    // Everything this request causes, even after many awaits, sees this object.\n    storage.run({ requestId }, () => next());\n  }\n}\n\n// A plain singleton: no Scope.REQUEST, so nothing that injects it becomes request-scoped.\n@Injectable()\nexport class AuditLogger {\n  private readonly logger = new Logger('Audit');\n\n  record(action: string, details: Record<string, unknown> = {}): void {\n    const ctx = currentRequest();\n    this.logger.log(JSON.stringify({ action, ...details, requestId: ctx?.requestId, userId: ctx?.userId }));\n  }\n}",
      "label": "src/common/request-context.ts — request data without request scope",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Register the middleware for every route with `consumer.apply(RequestContextMiddleware).forRoutes('*')`, and let your JWT guard set `currentRequest().userId` once it has checked the token. Everything stays a singleton. The `nestjs-cls` library packages the same idea with extras."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Lifecycle hooks"
    },
    {
      "kind": "text",
      "text": "A **lifecycle hook** is a method that Nest calls on your provider at a fixed moment. Use hooks for work that doesn't belong in a constructor. A constructor can't be `async`, and Nest doesn't wait for it."
    },
    {
      "kind": "table",
      "head": [
        "Hook",
        "When it runs",
        "Typical use"
      ],
      "rows": [
        [
          "`onModuleInit()`",
          "Once the module's providers exist. The deepest modules go first.",
          "Load data, open a connection, warm a cache"
        ],
        [
          "`onApplicationBootstrap()`",
          "After every module has finished `onModuleInit()`",
          "Start background work that needs the whole app"
        ],
        [
          "`onModuleDestroy()`",
          "On `app.close()` or a shutdown signal. The root module goes first.",
          "Stop taking new work"
        ],
        [
          "`beforeApplicationShutdown(signal)`",
          "Next, before the HTTP server closes its connections",
          "Let in-flight jobs finish"
        ],
        [
          "`onApplicationShutdown(signal)`",
          "Last, after the connections are closed",
          "Close pools and clients"
        ]
      ]
    },
    {
      "kind": "example",
      "code": "import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';\nimport { PricingRulesRepository } from './pricing-rules.repository';\n\n@Injectable()\nexport class PricingRulesService implements OnModuleInit, OnApplicationShutdown {\n  private readonly logger = new Logger(PricingRulesService.name);\n  private discounts = new Map<number, number>(); // productId → percent off\n  private timer?: NodeJS.Timeout;\n\n  // Keep constructors cheap and synchronous: Nest does not await them.\n  constructor(private readonly repo: PricingRulesRepository) {}\n\n  // Nest awaits this before the app starts listening, so the first request already has the rules.\n  async onModuleInit(): Promise<void> {\n    await this.reload();\n    this.timer = setInterval(() => {\n      this.reload().catch((err: unknown) => this.logger.error(`reload failed: ${String(err)}`));\n    }, 60_000);\n  }\n\n  // Runs on app.close(), or on SIGTERM when main.ts calls app.enableShutdownHooks().\n  onApplicationShutdown(signal?: string): void {\n    clearInterval(this.timer);\n    this.logger.log(`stopped (${signal ?? 'app.close()'})`);\n  }\n\n  discountFor(productId: number): number {\n    return this.discounts.get(productId) ?? 0;\n  }\n\n  private async reload(): Promise<void> {\n    this.discounts = await this.repo.loadDiscounts();\n  }\n}",
      "label": "src/catalog/pricing-rules.service.ts"
    },
    {
      "kind": "text",
      "text": "Nest awaits every hook, so an `async onModuleInit()` delays startup until it finishes. That is what you want for data the first request needs. Shutdown hooks only run on SIGTERM if `main.ts` calls `app.enableShutdownHooks()` (Module 3).",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · async work in a constructor",
      "blocks": [
        {
          "kind": "text",
          "text": "`constructor() { this.load(); }` starts a promise that nobody awaits. The app starts listening before the data is there. If `load()` fails, you get an unhandled promise rejection, which crashes Node, instead of a clean failed startup. Move the work into `async onModuleInit()`. Nest waits for it, and an error there stops the app with a clear stack trace."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "ModuleRef: asking the container yourself"
    },
    {
      "kind": "text",
      "text": "Normally the container pushes dependencies into your constructor. `ModuleRef` lets you pull one out at runtime. It has three main methods:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`get(Token)` returns an existing singleton. It throws for request-scoped and transient providers.",
        "`resolve(Token)` builds a request-scoped or transient provider, with all its dependencies. You get a new instance on every call.",
        "`create(Class)` builds a class that isn't registered as a provider at all."
      ]
    },
    {
      "kind": "example",
      "code": "// ── products/import/product-import.session.ts ──\nimport { ConflictException, Injectable, Scope } from '@nestjs/common';\nimport { CreateProductDto } from '../dto/create-product.dto';\nimport { ProductsService } from '../products.service';\n\n// Counts one import run, so two runs must never share an instance.\n@Injectable({ scope: Scope.TRANSIENT })\nexport class ProductImportSession {\n  private created = 0;\n  private skipped = 0;\n\n  constructor(private readonly products: ProductsService) {}\n\n  async importRow(row: CreateProductDto, createdBy: string): Promise<void> {\n    try {\n      await this.products.create(row, createdBy); // Module 14's create()\n      this.created++;\n    } catch (err) {\n      if (!(err instanceof ConflictException)) throw err;\n      this.skipped++; // SKU_TAKEN: this product is already in the shop\n    }\n  }\n\n  summary(): { created: number; skipped: number } {\n    return { created: this.created, skipped: this.skipped };\n  }\n}\n\n// ── products/import/product-import.service.ts ──\nimport { Injectable } from '@nestjs/common';\nimport { ModuleRef } from '@nestjs/core';\nimport { CreateProductDto } from '../dto/create-product.dto';\nimport { ProductImportSession } from './product-import.session';\n\n@Injectable()\nexport class ProductImportService {\n  constructor(private readonly moduleRef: ModuleRef) {}\n\n  /** rows: one CreateProductDto per CSV line, already validated (Module 7). */\n  async run(rows: CreateProductDto[], createdBy: string): Promise<{ created: number; skipped: number }> {\n    // resolve() builds a NEW session, with its dependencies injected, on every call.\n    // get() would throw here: it only hands out singletons.\n    const session = await this.moduleRef.resolve(ProductImportSession);\n    for (const row of rows) await session.importRow(row, createdBy);\n    return session.summary();\n  }\n}",
      "label": "a fresh helper for every import run"
    },
    {
      "kind": "text",
      "text": "Use it sparingly. A constructor shows a class's dependencies at a glance, and `ModuleRef` hides them. Good uses are the ones above: a fresh stateful helper per job, or a provider picked by name at runtime. Avoid `get(Token, { strict: false })`: it reaches into any module and ignores `exports`, which breaks the borders from Module 19."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Circular dependencies"
    },
    {
      "kind": "text",
      "text": "A **circular dependency** is a loop: `OrdersService` needs `PaymentsService`, and `PaymentsService` needs `OrdersService`. Neither can be created first. Because the two files also import each other, one class is still `undefined` when the decorators run. Nest stops with `Nest can't resolve dependencies of the PaymentsService (?)`, where the `?` marks the missing one. For two modules that import each other, the message is `The module at index [0] of the PaymentsModule \"imports\" array is undefined`."
    },
    {
      "kind": "text",
      "text": "Nest 11 adds a hint to the first message suggesting you replace `import type` with `import`. With a loop, that hint is a red herring: the real cause is the cycle.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "Module 4 showed the escape hatch, `forwardRef()`, on both sides:"
    },
    {
      "kind": "example",
      "code": "// ── orders/orders.service.ts ──\nimport { forwardRef, Inject, Injectable } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { Repository } from 'typeorm';\nimport { PaymentsService } from '../payments/payments.service';\nimport { Order, OrderStatus } from './entities/order.entity';\nimport { orderTotalCents } from './order-total';\n\n@Injectable()\nexport class OrdersService {\n  constructor(\n    @InjectRepository(Order) private readonly orders: Repository<Order>,\n    @Inject(forwardRef(() => PaymentsService)) private readonly payments: PaymentsService,\n  ) {}\n\n  async checkout(orderId: string): Promise<void> {\n    const order = await this.orders.findOneOrFail({ where: { id: orderId }, relations: { items: true } });\n    await this.payments.charge(order.id, orderTotalCents(order)); // orders → payments\n  }\n\n  async markPaid(orderId: string): Promise<void> {\n    await this.orders.update({ id: orderId, status: OrderStatus.Placed }, { status: OrderStatus.Paid });\n  }\n}\n\n// ── payments/payments.service.ts ──\nimport { forwardRef, Inject, Injectable } from '@nestjs/common';\nimport { OrdersService } from '../orders/orders.service';\nimport { PaymentsClient } from './payments.client';\n\n@Injectable()\nexport class PaymentsService {\n  constructor(\n    private readonly client: PaymentsClient,\n    @Inject(forwardRef(() => OrdersService)) private readonly orders: OrdersService,\n  ) {}\n\n  async charge(orderId: string, amountCents: number): Promise<void> {\n    await this.client.charge(orderId, amountCents);\n  }\n\n  async handleSucceeded(orderId: string): Promise<void> {\n    await this.orders.markPaid(orderId);                         // payments → orders: a cycle\n  }\n}\n// Both modules need it too: imports: [forwardRef(() => OrdersModule)] and the mirror image.",
      "label": "orders ⇄ payments, held together by forwardRef",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "It boots. Here is what `forwardRef()` actually does: Nest creates an empty placeholder object for one side and passes it to the other side's constructor. After the real constructor runs, Nest copies its fields onto the placeholder. So during construction, one of the two services holds an object whose own dependencies are still `undefined`."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · using a `forwardRef` dependency in the constructor",
      "blocks": [
        {
          "kind": "text",
          "text": "Call `this.payments.charge()` inside `OrdersService`'s constructor, and one side fails with `Cannot read properties of undefined`. Which side fails depends on the order Nest creates them, so a harmless-looking reorder of `providers` can move the crash. Calls in normal methods, after startup, work fine. But if you have to remember a rule like this, the design is telling you something."
        }
      ]
    },
    {
      "kind": "text",
      "text": "The real fix is a redesign. A loop means a third idea is hiding between the two classes. Here that idea is checkout: it uses orders *and* payments, and neither of them needs the other."
    },
    {
      "kind": "example",
      "code": "// ── checkout/checkout.service.ts ──\nimport { Injectable } from '@nestjs/common';\nimport { orderTotalCents } from '../orders/order-total';\nimport { OrdersService } from '../orders/orders.service';\nimport { PaymentsService } from '../payments/payments.service';\n\n// Before: OrdersModule ⇄ PaymentsModule\n// After:  CheckoutModule → OrdersModule\n//         CheckoutModule → PaymentsModule   (orders and payments no longer know each other)\n@Injectable()\nexport class CheckoutService {\n  constructor(\n    private readonly orders: OrdersService,\n    private readonly payments: PaymentsService,\n  ) {}\n\n  async checkout(orderId: string): Promise<void> {\n    const order = await this.orders.findPlaced(orderId);\n    await this.payments.charge(order.id, orderTotalCents(order));\n  }\n\n  async paymentSucceeded(orderId: string): Promise<void> {\n    await this.orders.markPaid(orderId);\n  }\n}\n\n// ── checkout/checkout.module.ts ──\nimport { Module } from '@nestjs/common';\nimport { OrdersModule } from '../orders/orders.module';\nimport { PaymentsModule } from '../payments/payments.module';\nimport { CheckoutService } from './checkout.service';\n\n@Module({\n  imports: [OrdersModule, PaymentsModule], // one direction only: no forwardRef anywhere\n  providers: [CheckoutService],\n})\nexport class CheckoutModule {}",
      "label": "a third module breaks the loop",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Two other fixes work well. Move the method to the side that owns the data. Or turn one direction into an event: payments announces \"payment succeeded\", and orders listens. Module 23 does that with a queue."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Dynamic modules"
    },
    {
      "kind": "text",
      "text": "A static module, like `@Module({ providers: [ProductsService] })`, is the same every time you import it. A **dynamic module** is built by a static method, usually `forRoot()`, from the options you pass in. The method returns a `DynamicModule`: an object with the same fields as `@Module()` (`providers`, `exports`, `imports`), plus `module`, the class itself, and an optional `global` flag."
    },
    {
      "kind": "text",
      "text": "The names follow a convention. `forRoot()` is configured once, in `AppModule`. `register()` is configured for each import. `forFeature()` adds something to a module that is already configured, as in `TypeOrmModule.forFeature([Product])`. Each one has an `Async` twin that takes a factory, for options that come from other providers, such as config."
    },
    {
      "kind": "text",
      "text": "You could write these methods by hand, and Exercise 20.1 does. In practice, `ConfigurableModuleBuilder` writes `forRoot()` and `forRootAsync()` for you, including `useFactory`, `useClass`, `useExisting`, `inject` and `imports`."
    },
    {
      "kind": "example",
      "code": "// ── payments/payments.module-definition.ts ──\nimport { ConfigurableModuleBuilder } from '@nestjs/common';\n\nexport interface PaymentsModuleOptions {\n  apiKey: string;\n  webhookSecret: string;\n  timeoutMs?: number;\n}\n\nexport const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =\n  new ConfigurableModuleBuilder<PaymentsModuleOptions>()\n    .setClassMethodName('forRoot') // generates forRoot() and forRootAsync()\n    .setExtras(\n      { isGlobal: false }, // an extra option that is not part of PaymentsModuleOptions\n      (definition, extras) => ({ ...definition, global: extras.isGlobal }),\n    )\n    .build();\n\n// ── payments/payments.client.ts ──\nimport { BadGatewayException, Inject, Injectable } from '@nestjs/common';\nimport { MODULE_OPTIONS_TOKEN, type PaymentsModuleOptions } from './payments.module-definition';\n\n@Injectable()\nexport class PaymentsClient {\n  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: PaymentsModuleOptions) {}\n\n  async charge(orderId: string, amountCents: number): Promise<{ paymentId: string }> {\n    const res = await fetch('https://api.payments.example/v1/charges', {\n      method: 'POST',\n      headers: {\n        Authorization: `Bearer ${this.options.apiKey}`,\n        'Content-Type': 'application/json',\n        'Idempotency-Key': `charge-${orderId}`, // the provider ignores a repeat of this exact charge\n      },\n      body: JSON.stringify({ amount: amountCents, currency: 'eur', reference: orderId }),\n      signal: AbortSignal.timeout(this.options.timeoutMs ?? 5000),\n    });\n    if (!res.ok) throw new BadGatewayException('Payment provider error');\n    return (await res.json()) as { paymentId: string };\n  }\n}\n\n// ── payments/payments.module.ts ──\nimport { Module } from '@nestjs/common';\nimport { PaymentsClient } from './payments.client';\nimport { ConfigurableModuleClass } from './payments.module-definition';\n\n@Module({\n  providers: [PaymentsClient],\n  exports: [PaymentsClient],\n})\nexport class PaymentsModule extends ConfigurableModuleClass {}",
      "label": "a reusable PaymentsModule"
    },
    {
      "kind": "example",
      "code": "import { Module } from '@nestjs/common';\nimport { ConfigModule, type ConfigType } from '@nestjs/config';\nimport { paymentsConfig } from './config/payments.config';\nimport { validateEnv } from './config/env.validation';\nimport { PaymentsModule } from './payments/payments.module';\n\n@Module({\n  imports: [\n    ConfigModule.forRoot({ isGlobal: true, load: [paymentsConfig], validate: validateEnv }),\n\n    PaymentsModule.forRootAsync({\n      isGlobal: true,                 // the extra from setExtras()\n      inject: [paymentsConfig.KEY],   // the namespace from Exercise 19.1\n      useFactory: (payments: ConfigType<typeof paymentsConfig>) => ({\n        apiKey: payments.apiKey,\n        webhookSecret: payments.webhookSecret,\n        timeoutMs: payments.timeoutMs,\n      }),\n    }),\n  ],\n})\nexport class AppModule {}\n\n// In a test, the plain version is enough:\n//   PaymentsModule.forRoot({ apiKey: 'sk_test_123', webhookSecret: 'test-secret-1234' })",
      "label": "src/app.module.ts — configured from the namespace in Exercise 19.1"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`MODULE_OPTIONS_TOKEN` is a unique token for the options. `forRoot()` registers your object under it with `useValue`, and `forRootAsync()` registers your factory with `useFactory`.",
        "`PaymentsModule extends ConfigurableModuleClass` inherits those static methods. The `@Module()` part adds the providers that read the options.",
        "`setExtras()` adds an option for the module itself, here `isGlobal`. Its second argument edits the returned `DynamicModule`, so `PaymentsClient` can be injected anywhere without importing the module.",
        "`PaymentsModuleOptions` is imported with `type`, for the TS1272 reason from Module 19."
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "You have used this pattern from the other side. `RouterModule.forRoot(routes)` returns `ModuleWithProviders<RouterModule>`, which is `{ ngModule, providers }`. Nest's `forRoot()` returns a `DynamicModule`, which is `{ module, providers, exports, imports, global }`. It's the same idea: a module plus its settings."
        },
        {
          "kind": "text",
          "text": "There are two differences. Nest has `forRootAsync()`, with a factory and `inject`, because backend settings usually come from other providers, such as config or a secret store, and may need an `await`. And Nest has no `inject()` function: dependencies arrive through the constructor, or through `ModuleRef`."
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "`OrdersController` injects `OrdersService`, which injects `AuditLogger`, marked `Scope.REQUEST`. The app serves 1,000 requests to that controller. How many `OrdersController` instances does Nest create?",
      "options": [
        "1, because controllers are always singletons",
        "2: one at startup and one shared by all requests",
        "1,000: one per request, because request scope spreads upward",
        "None, because Nest calls the handler without an instance"
      ],
      "answer": 2,
      "why": "**1,000.** A class that depends on a request-scoped provider can't be a singleton, or it would keep the first request's logger forever. So Nest makes `OrdersService` request-scoped, then `OrdersController`, and builds all three for every request. In fact it creates none at startup. That is why the `AsyncLocalStorage` version of `AuditLogger` above is better: it stays a singleton, so nothing above it changes."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 20.1",
      "title": "Write forRoot() by hand",
      "blocks": [
        {
          "kind": "text",
          "text": "Build a `FeatureFlagsModule` without `ConfigurableModuleBuilder`. Calling `FeatureFlagsModule.forRoot({ flags: { newCheckout: true } })` should make a `FeatureFlags` service injectable, with an `isOn(name)` method. Then add `forRootAsync({ inject, useFactory })`, so the flags can come from `ConfigService`. Finally, compare your code with what the builder gives you."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { DynamicModule, FactoryProvider, Inject, Injectable, Module, ModuleMetadata } from '@nestjs/common';\n\nexport interface FeatureFlagsOptions {\n  flags: Record<string, boolean>;\n}\n\n// A Symbol token: unique, and it can't clash with another library's string.\nexport const FEATURE_FLAGS_OPTIONS = Symbol('FEATURE_FLAGS_OPTIONS');\n\n@Injectable()\nexport class FeatureFlags {\n  constructor(@Inject(FEATURE_FLAGS_OPTIONS) private readonly options: FeatureFlagsOptions) {}\n\n  isOn(name: string): boolean {\n    return this.options.flags[name] ?? false;\n  }\n}\n\n@Module({})\nexport class FeatureFlagsModule {\n  static forRoot(options: FeatureFlagsOptions): DynamicModule {\n    return {\n      module: FeatureFlagsModule,\n      providers: [{ provide: FEATURE_FLAGS_OPTIONS, useValue: options }, FeatureFlags],\n      exports: [FeatureFlags],\n    };\n  }\n\n  static forRootAsync(options: {\n    imports?: ModuleMetadata['imports'];\n    inject?: FactoryProvider['inject'];\n    useFactory: (...args: any[]) => FeatureFlagsOptions | Promise<FeatureFlagsOptions>;\n  }): DynamicModule {\n    return {\n      module: FeatureFlagsModule,\n      imports: options.imports ?? [],\n      providers: [\n        { provide: FEATURE_FLAGS_OPTIONS, useFactory: options.useFactory, inject: options.inject ?? [] },\n        FeatureFlags,\n      ],\n      exports: [FeatureFlags],\n    };\n  }\n}",
              "label": "src/feature-flags/feature-flags.module.ts"
            },
            {
              "kind": "text",
              "text": "The whole trick is one provider under a token you own. `forRoot()` registers the options with `useValue`. `forRootAsync()` registers the factory with `useFactory`, passes `inject` through, and Nest awaits it like any async provider (Module 6)."
            },
            {
              "kind": "text",
              "text": "What the builder adds on top: `useClass` and `useExisting` variants, extras such as `isGlobal`, a generated token, and the `OPTIONS_TYPE` and `ASYNC_OPTIONS_TYPE` helper types. That's a lot of careful code you no longer have to write or test.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q35",
      "title": "What is a dynamic module, and how would you build one with forRootAsync()?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A dynamic module is created by a static method from runtime options, instead of a fixed `@Module()` declaration. The method returns a `DynamicModule`: the usual metadata, such as providers, exports and imports, plus the module class and an optional `global` flag. The key piece is an options provider. The method registers the options under a token, and the module's own providers inject that token."
        },
        {
          "kind": "text",
          "text": "`forRootAsync()` does the same with a factory provider: `useFactory`, `inject`, and `imports` for the modules those tokens come from. Nest awaits the factory during bootstrap, which is how options can come from `ConfigService` or a secret store. In practice I use `ConfigurableModuleBuilder`. It generates `forRoot()` and `forRootAsync()` with factory, class and existing variants, and `setExtras()` adds module-level options like `isGlobal`."
        },
        {
          "kind": "text",
          "text": "A Nest 11 detail worth adding: dynamic modules are identified by reference now, so two separate `forRoot()` calls create two instances, even with identical options. To share one, create it once and import the same constant."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q36",
      "title": "How do you deal with circular dependencies in NestJS?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** First, I treat one as a design signal, not a syntax problem. There are two kinds. A file import cycle leaves one class `undefined` when the decorators run, so Nest reports an unresolved dependency, or an undefined entry in a module's `imports`. A constructor cycle means neither class can be created first. `forwardRef()` on both sides works around both: Nest gives one side a placeholder and fills it in after construction. The cost is that you can't use that dependency in the constructor, and the code gets harder to test and to reason about."
        },
        {
          "kind": "text",
          "text": "So I redesign. Usually a third concept sits between the two classes. I extract it into its own service or module that depends on both, like a `CheckoutService` over orders and payments. Or I move the method to the side that owns the data, or turn one direction into an event or a queue job so the dependency points one way. If I must ship a `forwardRef()`, it's a short-term patch with a ticket to remove it."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 21 takes the app outside its own walls: file uploads, email, and calls to other companies' APIs. You'll use the abstract-class tokens from this module to keep every outside service swappable."
    }
  ]
};
