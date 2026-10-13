import { Lesson } from '../../shared/content';

export const M6_PROVIDERS_DI: Lesson = {
  "slug": "m6-providers-di",
  "title": "M6 Providers, services and dependency injection",
  "nav": "Providers & DI",
  "num": "M6",
  "eyebrow": "Level 2 · Week 2 · ~3 sessions · the most important module in Level 2",
  "blocks": [
    {
      "kind": "text",
      "text": "A **provider** is anything the container can create and inject: a service, a repository, a factory, a plain value. `@Injectable()` marks a class as participating. The container holds them by **token** — by default the class itself."
    },
    {
      "kind": "text",
      "text": "Dependency injection is one idea: *a class declares what it needs and is handed it, instead of building it.* Everything else — testability, swappable implementations, request-scoped state, dynamic modules — is a consequence."
    },
    {
      "kind": "example",
      "code": "@Injectable()\nexport class ProductsService {\n  // `private readonly` is TypeScript shorthand: it declares the field\n  // AND assigns the parameter to it. These two are equivalent:\n  constructor(private readonly repo: ProductsRepository) {}\n}\n\n// ...is the same as:\n@Injectable()\nexport class ProductsServiceVerbose {\n  private readonly repo: ProductsRepository;\n  constructor(repo: ProductsRepository) {\n    this.repo = repo;\n  }\n}",
      "label": "the shorthand you'll type a thousand times"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The four provider kinds"
    },
    {
      "kind": "text",
      "text": "The array shorthand `providers: [ProductsService]` expands to `{ provide: ProductsService, useClass: ProductsService }`. Once you know that, the other three kinds are obvious variations — and they're a guaranteed interview topic."
    },
    {
      "kind": "example",
      "code": "@Module({\n  providers: [\n    // 1. CLASS — the default. Token: the class. Instance: created by Nest.\n    ProductsService,\n\n    // 1b. Same thing, but swap the implementation behind the token.\n    //     Every injector of `PaymentGateway` now gets the Stripe one.\n    { provide: PaymentGateway, useClass: StripePaymentGateway },\n\n    // 2. VALUE — inject a constant, a config object, or a test double.\n    { provide: 'FEATURE_FLAGS', useValue: { newCheckout: true } },\n\n    // 3. FACTORY — compute the instance. Can inject other providers.\n    {\n      provide: 'STORAGE',\n      useFactory: (config: AppConfigService) =>\n        config.get('STORAGE_DRIVER') === 's3'\n          ? new S3Storage(config.get('S3_BUCKET'))\n          : new LocalStorage(),\n      inject: [AppConfigService],       // ← declare factory dependencies here\n    },\n\n    // 3b. ASYNC FACTORY — Nest awaits it before the app finishes booting.\n    {\n      provide: 'REDIS',\n      useFactory: async (config: AppConfigService) => {\n        const client = createClient({ url: config.get('REDIS_URL') });\n        await client.connect();\n        return client;\n      },\n      inject: [AppConfigService],\n    },\n\n    // 4. ALIAS — a second token pointing at an existing instance.\n    { provide: 'LEGACY_PRODUCTS', useExisting: ProductsService },\n  ],\n})\nexport class ProductsModule {}",
      "label": "custom-providers.ts"
    },
    {
      "kind": "text",
      "text": "Non-class tokens are injected by name, since there's no type for Nest to read:"
    },
    {
      "kind": "example",
      "code": "@Injectable()\nexport class UploadsService {\n  constructor(\n    @Inject('STORAGE') private readonly storage: Storage,\n    @Inject('FEATURE_FLAGS') private readonly flags: FeatureFlags,\n  ) {}\n}",
      "label": "injecting a non-class token"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "At bootstrap, for each provider class, Nest:"
        },
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "Reads `design:paramtypes` — the constructor parameter types the TypeScript compiler emitted (Module 3). For `@Inject('TOKEN')` parameters it instead reads the explicit token from `self:paramtypes` metadata.",
            "For each token, searches the **module injector**: this module's own providers first, then the providers exported by each imported module, then the global scope.",
            "If the token isn't found, throws the resolution error — with the `?` in `Nest can't resolve dependencies of the X (?)` marking the parameter index it failed on.",
            "If found and not yet instantiated, resolves *that* provider's dependencies first (depth-first), constructs it, and caches the instance in the module's injector.",
            "Passes the resolved instances to the constructor."
          ]
        },
        {
          "kind": "text",
          "text": "Two things fall out of this. Instances are cached per module injector — that's why \"one instance per module that declares it\" is the rule, and why re-declaring a provider gives you two. And resolution is *static*: the whole graph is known before the first request, which is why a missing provider fails at boot rather than at 3am."
        }
      ],
      "title": "Under the hood · how a dependency is actually resolved"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Provider scopes"
    },
    {
      "kind": "table",
      "head": [
        "Scope",
        "Lifetime",
        "Use for",
        "Cost"
      ],
      "rows": [
        [
          "`DEFAULT`",
          "One instance for the whole app",
          "Almost everything",
          "None — it's just a cached object"
        ],
        [
          "`REQUEST`",
          "One instance per incoming request",
          "Per-request context: tenant, correlation ID, the current user, a transaction handle",
          "Real: the sub-tree is re-instantiated per request, and it bubbles up the injection chain"
        ],
        [
          "`TRANSIENT`",
          "A fresh instance per injector",
          "Providers that must not share state between consumers, e.g. a logger bound to its owner's class name",
          "Small, but multiplied by consumers"
        ]
      ]
    },
    {
      "kind": "example",
      "code": "import { Injectable, Scope, Inject } from '@nestjs/common';\nimport { REQUEST } from '@nestjs/core';\nimport type { Request } from 'express';\n\n@Injectable({ scope: Scope.REQUEST })\nexport class RequestContextService {\n  constructor(@Inject(REQUEST) private readonly req: Request) {}\n\n  get correlationId(): string {\n    return this.req.headers['x-correlation-id'] as string;\n  }\n}\n\n@Injectable({ scope: Scope.TRANSIENT })\nexport class ScopedLogger { /* one instance per consumer */ }",
      "label": "scopes.ts"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Scope is contagious *upward*. If a singleton service injects a request-scoped provider, that service becomes request-scoped too, and so does anything that injects *it* — right up to the controller. A single careless `Scope.REQUEST` can convert a chunk of your app into per-request instantiation, and you'll see it as unexplained latency. Prefer passing context as a method argument, or reach for `AsyncLocalStorage` (Module 20), and keep request scope for cases that genuinely need injection-time access to the request."
        }
      ],
      "title": "Trap · request scope bubbles"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Why this makes testing cheap"
    },
    {
      "kind": "text",
      "text": "This is the payoff, and it's the reason to care about DI beyond passing interviews:"
    },
    {
      "kind": "example",
      "code": "import { Test } from '@nestjs/testing';\nimport { NotFoundException } from '@nestjs/common';\n\ndescribe('ProductsService', () => {\n  let service: ProductsService;\n  const repo = { findById: jest.fn() };          // a fake, not a database\n\n  beforeEach(async () => {\n    const moduleRef = await Test.createTestingModule({\n      providers: [\n        ProductsService,\n        { provide: ProductsRepository, useValue: repo },  // ← swap the real one out\n      ],\n    }).compile();\n\n    service = moduleRef.get(ProductsService);\n  });\n\n  it('throws when the product is missing', async () => {\n    repo.findById.mockResolvedValue(null);\n    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);\n  });\n});",
      "label": "products.service.spec.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "No database, no network, no HTTP server — milliseconds per test. That substitution is only possible because `ProductsService` never built its own repository. Compare with the Express version in Module 1, where `db` was required at the top of the file: to test that handler you need a database, or a module mocking hack.",
      "style": "small"
    },
    {
      "kind": "quiz",
      "question": "A singleton `InvoiceService` injects a `Scope.REQUEST` provider. What happens to `InvoiceService`?",
      "options": [
        "Nothing — it stays a singleton and gets the first request's instance",
        "Bootstrap fails with a scope mismatch error",
        "It stays a singleton but the injected value is `undefined`",
        "It becomes request-scoped too, and so does anything injecting it"
      ],
      "answer": 3,
      "why": "**It becomes request-scoped, and the effect propagates up the chain.** Nest promotes the consumer's scope to match its narrowest dependency — the alternative would be handing a singleton a stale request. This is the mechanism behind most \"why did my app get slow after that small refactor?\" stories, and a strong interview answer names the propagation explicitly."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 6.1",
      "title": "Swap an implementation without touching a consumer",
      "blocks": [
        {
          "kind": "text",
          "text": "Write an abstract class `NotificationSender` with one method `send(to: string, body: string)`. Implement `ConsoleSender` (logs) and `FakeSmtpSender` (pushes to an in-memory array and exposes `sent()`). Inject `NotificationSender` into an `AlertsService`. Now, changing *only* the module's `providers` array, make the app use each implementation in turn — and then write a test that injects the fake and asserts one message was sent."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// An abstract class, not an interface — it survives compilation,\n// so it can be used as an injection token.\nexport abstract class NotificationSender {\n  abstract send(to: string, body: string): Promise<void>;\n}\n\n@Injectable()\nexport class ConsoleSender extends NotificationSender {\n  async send(to: string, body: string) {\n    console.log(`[console] ${to}: ${body}`);\n  }\n}\n\n@Injectable()\nexport class FakeSmtpSender extends NotificationSender {\n  private outbox: Array<{ to: string; body: string }> = [];\n  async send(to: string, body: string) { this.outbox.push({ to, body }); }\n  sent() { return this.outbox; }\n}",
              "label": "notification-sender.ts"
            },
            {
              "kind": "example",
              "code": "@Module({\n  providers: [\n    AlertsService,\n    { provide: NotificationSender, useClass: ConsoleSender },  // ← the only line that changes\n  ],\n})\nexport class AlertsModule {}",
              "label": "alerts.module.ts"
            },
            {
              "kind": "text",
              "text": "This is dependency inversion in five lines: `AlertsService` depends on the abstraction, and the module decides the implementation. It's also the answer to \"how would you make this testable?\" — and the reason the abstract-class trick matters is the one from Module 3: interfaces don't exist at runtime, so they can't be tokens.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q8",
      "title": "How does dependency injection work in NestJS?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Nest has an IoC container. Providers are registered per module against a token — by default the class itself, or an explicit string, symbol or abstract class. A consumer declares its dependencies as constructor parameters, and at bootstrap Nest reads those parameter types from the metadata TypeScript emits under `design:paramtypes` when `emitDecoratorMetadata` is on, or the explicit token from `@Inject()`. It resolves each token against the module's injector — own providers, then providers exported by imported modules, then the global scope — instantiating dependencies depth-first and caching each instance, since providers are singletons by default. If a token isn't visible in that scope, bootstrap fails with a resolution error naming the class and parameter index."
        },
        {
          "kind": "text",
          "text": "Two things worth adding unprompted, because they show depth: resolution is static and happens once at startup, so missing wiring fails immediately rather than in production; and interfaces can't be tokens because they're erased at compile time, which is why abstract classes or string tokens are used for dependency inversion."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q9",
      "title": "Explain the four provider types, and give a real use for each.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.**"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**`useClass`** — the token maps to a class Nest instantiates. The plain array form is shorthand for this. Real use: swapping `PaymentGateway` for `StripePaymentGateway` in production and a fake in tests, without touching a single consumer.",
            "**`useValue`** — inject an existing object or constant. Real use: a feature-flag object, a preconfigured third-party SDK client, or a test double in `Test.createTestingModule`.",
            "**`useFactory`** — compute the instance, optionally depending on other providers listed in `inject`. Real use: choose an S3 or local storage driver based on config; build a client whose options come from `ConfigService`.",
            "**`useExisting`** — an alias to an already-registered provider, so two tokens share one instance. Real use: exposing a legacy token name during a migration without duplicating the instance."
          ]
        },
        {
          "kind": "text",
          "text": "The one to mention as a bonus is the **async factory**: `useFactory` returning a promise, which Nest awaits during bootstrap. That's how a database or Redis connection is established before the app accepts traffic — and it's why `NestFactory.create()` is `async` in the first place."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q10",
      "title": "What are provider scopes, and when would you use a non-default one?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `DEFAULT` is a singleton shared across the application — correct for almost everything, because a stateless service has nothing to isolate. `REQUEST` creates an instance per incoming request and can inject the request object itself; it's for per-request context such as the current user, a tenant ID, a correlation ID, or a database transaction that must span several services. `TRANSIENT` gives each consumer its own instance, useful for something like a logger that needs to know which class it belongs to."
        },
        {
          "kind": "text",
          "text": "The caveat I'd raise unprompted: request scope propagates up the injection chain, so anything that injects a request-scoped provider becomes request-scoped as well. That can quietly convert a large part of the graph into per-request instantiation and cost you real latency. For pure context passing I prefer an argument, or `AsyncLocalStorage`, and reserve request scope for cases that genuinely need the request at construction time."
        }
      ]
    }
  ]
};
