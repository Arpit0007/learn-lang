import { Lesson } from '../../shared/content';

export const M4_MODULES: Lesson = {
  "slug": "m4-modules",
  "title": "M4 Modules",
  "nav": "Modules",
  "num": "M4",
  "eyebrow": "Level 2 · Week 2 · ~2 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 2 · Week 2 · The three building blocks",
      "blocks": [
        {
          "kind": "text",
          "text": "Modules, controllers, providers — and the container that wires them. This is the week that decides whether Nest feels like magic or like machinery for the rest of your career."
        }
      ]
    },
    {
      "kind": "text",
      "text": "A module is a **boundary**. It declares four things: what it needs from elsewhere (`imports`), what HTTP surface it owns (`controllers`), what injectables live inside it (`providers`), and which of those injectables outsiders may use (`exports`). That's the whole concept, and it's identical in spirit to `@NgModule`."
    },
    {
      "kind": "text",
      "text": "Every Nest application has at least one — the root module — and the entire application is a tree hanging off it."
    },
    {
      "kind": "example",
      "code": "import { Module } from '@nestjs/common';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { ProductsController } from './products.controller';\nimport { ProductsService } from './products.service';\nimport { ProductsRepository } from './products.repository';\nimport { Product } from './entities/product.entity';\n\n@Module({\n  imports:     [TypeOrmModule.forFeature([Product])],  // what this module consumes\n  controllers: [ProductsController],                    // its HTTP surface\n  providers:   [ProductsService, ProductsRepository],   // its injectables — private\n  exports:     [ProductsService],                       // what others may inject\n})\nexport class ProductsModule {}",
      "label": "products/products.module.ts"
    },
    {
      "kind": "text",
      "text": "Read the four arrays as a contract: *\"I need TypeORM's Product repository. I answer HTTP on the products routes. Inside me live a service and a repository. Outsiders may use the service — and only the service.\"*"
    },
    {
      "kind": "text",
      "text": "`ProductsRepository` is not exported, so no other module can inject it. That's deliberate: it means you can change how products are stored without touching a single line outside this folder. This is what \"boundary\" buys you."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "There is no `providedIn: 'root'`. A provider listed in `providers` is visible *only* inside its own module. To use it elsewhere you must `exports` it there and `imports` the module here — two steps, both deliberate. If you find yourself re-listing the same service in a second module's `providers` to \"make it work\", stop: you've just created a second, independent instance."
        }
      ],
      "title": "Angular difference · visibility is explicit"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Sharing: the correct way and the broken way"
    },
    {
      "kind": "example",
      "code": "@Module({\n  controllers: [OrdersController],\n  providers: [OrdersService, ProductsService],   // ❌ re-declared, not imported\n})\nexport class OrdersModule {}\n\n// It compiles. It runs. And now there are TWO ProductsService instances:\n// one owned by ProductsModule, one owned by OrdersModule.\n// Any in-memory state — a cache, a counter, a connection — is silently duplicated.",
      "label": "orders.module.ts — broken sharing",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "@Module({\n  imports: [ProductsModule],          // ✅ import the module that exports it\n  controllers: [OrdersController],\n  providers: [OrdersService],\n})\nexport class OrdersModule {}\n\n// One ProductsService instance, owned by ProductsModule, shared by reference.",
      "label": "orders.module.ts — correct sharing",
      "verdict": "good"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Three module patterns you'll use constantly"
    },
    {
      "kind": "text",
      "text": "**The feature module** — the default. One per feature, owning its controller, service and data access."
    },
    {
      "kind": "text",
      "text": "**The shared module** — a module whose whole purpose is to export things: `DatabaseModule`, `MailModule`, a `CommonModule` of utility providers. A module is a singleton, so every importer shares the same instances."
    },
    {
      "kind": "text",
      "text": "**The global module** — marked `@Global()`, registered once (usually in `AppModule`), and then injectable anywhere without importing it. Convenient, and easy to overuse."
    },
    {
      "kind": "example",
      "code": "import { Global, Module } from '@nestjs/common';\nimport { AppConfigService } from './app-config.service';\n\n@Global()                     // register once; available everywhere\n@Module({\n  providers: [AppConfigService],\n  exports: [AppConfigService], // still required — @Global doesn't imply export\n})\nexport class AppConfigModule {}",
      "label": "config/config.module.ts"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Two mistakes here. First, `@Global()` without `exports` does nothing — global changes *who can see the exports*, it doesn't create them. Second, global modules destroy the very boundaries you came to Nest for: dependencies stop being visible in the module metadata, so nobody can tell what a feature actually needs. Legitimate uses are few — config, logging, database connection. If you're reaching for it a fourth time, the real problem is your module layout."
        }
      ],
      "title": "Trap · reaching for `@Global()`"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Circular imports"
    },
    {
      "kind": "text",
      "text": "Two modules that import each other, or two services that inject each other, will fail at bootstrap with an *undefined dependency* error. Nest gives you `forwardRef()` as an escape hatch:"
    },
    {
      "kind": "example",
      "code": "// Module level\n@Module({ imports: [forwardRef(() => OrdersModule)] })\nexport class ProductsModule {}\n\n// Provider level\n@Injectable()\nexport class ProductsService {\n  constructor(\n    @Inject(forwardRef(() => OrdersService))\n    private readonly orders: OrdersService,\n  ) {}\n}",
      "label": "the escape hatch — and the better answer"
    },
    {
      "kind": "text",
      "text": "Use it when you must, but treat a circular dependency as a design signal, not a syntax problem. It almost always means a third concept is hiding between the two modules — the shared piece wants to be its own module, or one direction should be an event rather than a call (Module 23).",
      "style": "small"
    },
    {
      "kind": "quiz",
      "question": "`ProductsModule` lists `ProductsService` in `providers` but not in `exports`. `OrdersModule` imports `ProductsModule` and injects `ProductsService`. What happens?",
      "options": [
        "It works — importing a module gives access to all its providers",
        "It works, but creates a second instance",
        "Bootstrap fails: Nest can't resolve the dependency in the OrdersModule context",
        "It works only if `ProductsService` has no dependencies of its own"
      ],
      "answer": 2,
      "why": "**Bootstrap fails.** Importing a module grants access only to what that module *exports*. The error names the class, the parameter index and the module context — read it and add `exports: [ProductsService]`. The \"second instance\" outcome is what happens with the *other* mistake: re-declaring the service in `OrdersModule.providers`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 4.1",
      "title": "Prove the two-instance bug",
      "blocks": [
        {
          "kind": "text",
          "text": "Build two modules, `CounterModule` (with a `CounterService` holding an in-memory `count` and an `increment()` method) and `ReportModule`. Wire it the *wrong* way — re-declare `CounterService` in `ReportModule.providers` — expose an endpoint in each module, increment via one and read via the other. Then fix it with `exports`/`imports` and observe the difference."
        },
        {
          "kind": "reveal",
          "tag": "What you should see",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "Wrong wiring: increment three times through `/counter`, then read `/report` and you get **0** — two containers, two instances, two independent counts. Correct wiring: you get **3**.",
              "style": "small"
            },
            {
              "kind": "text",
              "text": "This is not a toy bug. Replace \"count\" with \"cache\", \"database pool\" or \"queue connection\" and you have a class of production incident that is genuinely hard to diagnose from the outside — the app works, it's just quietly wrong.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q5",
      "title": "Explain modules, and the difference between `providers`, `exports` and `imports`.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A module is an organisational and encapsulation unit declared with `@Module()`. `providers` registers injectables with the container in that module's scope — they are private to it by default. `exports` is the module's public API: the subset of its providers that other modules are allowed to inject. `imports` pulls in another module so that whatever *it* exports becomes resolvable here. `controllers` registers the HTTP handlers the module owns."
        },
        {
          "kind": "text",
          "text": "The consequence engineers care about: encapsulation is real. You can refactor or replace a non-exported provider — swap a repository, change a storage strategy — with the guarantee that nothing outside the module depends on it, because nothing outside *could*."
        },
        {
          "kind": "text",
          "text": "**Common follow-up:** \"What if I need the same service in two modules?\" Export it from its owning module and import that module. Never re-declare it — that yields two instances."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q6",
      "title": "What is a global module, and when is it appropriate?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A module decorated with `@Global()` has its exported providers registered in a global scope, so any module can inject them without importing it. It must still declare `exports` — global affects visibility of the exports, not their existence — and it should be registered once, typically in the root module."
        },
        {
          "kind": "text",
          "text": "It's appropriate for genuinely ambient infrastructure: configuration, logging, the database connection. It's inappropriate as a convenience, because it removes dependencies from module metadata — you can no longer read a module and know what it needs, which is precisely the property that makes a modular codebase navigable. My rule: if I'm adding a third global module, the module layout is wrong, not the visibility."
        }
      ]
    }
  ]
};
