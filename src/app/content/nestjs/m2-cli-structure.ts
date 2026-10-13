import { Lesson } from '../../shared/content';

export const M2_CLI_STRUCTURE: Lesson = {
  "slug": "m2-cli-structure",
  "title": "M2 The CLI and the project structure",
  "nav": "CLI & project structure",
  "num": "M2",
  "eyebrow": "Level 1 · Week 1 · ~1 session",
  "blocks": [
    {
      "kind": "text",
      "text": "Nest ships a code generator, and unlike most generators it's worth using every day — not because typing is slow, but because it **registers what it generates**. When you run `nest g service products` inside a project, the CLI creates the file *and* adds it to the nearest module's `providers` array. That one behaviour prevents the single most common beginner error, which you'll meet in Module 6."
    },
    {
      "kind": "example",
      "code": "nest new my-api            # scaffold a project\nnest g module products     # → products/products.module.ts, imported into AppModule\nnest g controller products # → registered in ProductsModule.controllers\nnest g service products    # → registered in ProductsModule.providers\nnest g resource orders     # → module + controller + service + DTOs + entity, CRUD stubs\n\nnest g --help              # every schematic: guard, pipe, filter, interceptor, decorator…\n\nnpm run start:dev          # watch mode\nnpm run build              # tsc → dist/\nnpm run start:prod         # node dist/main\nnpm run lint\nnpm test                   # unit tests\nnpm run test:e2e           # end-to-end tests",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "Two flags worth knowing now: `--dry-run` shows what a generate command would create without writing anything, and `--flat` skips the extra folder. `nest g resource` also asks whether you want REST, GraphQL, microservice or WebSocket transport — that question is answerable properly by Week 14.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What `nest new` gives you"
    },
    {
      "kind": "example",
      "code": "my-api/\n├── src/\n│   ├── main.ts                  ← entry point: bootstraps and listens\n│   ├── app.module.ts            ← the root module; everything hangs off this\n│   ├── app.controller.ts        ← delete these two once you have real features\n│   ├── app.service.ts\n│   └── app.controller.spec.ts   ← unit test, colocated with its subject\n├── test/\n│   └── app.e2e-spec.ts          ← end-to-end tests (real HTTP via Supertest)\n├── nest-cli.json                ← CLI config; where you enable plugins (e.g. Swagger)\n├── tsconfig.json                ← note: experimentalDecorators + emitDecoratorMetadata\n├── package.json\n└── eslint.config.mjs / .prettierrc ← linting and formatting, preconfigured",
      "lang": "text",
      "label": "project tree"
    },
    {
      "kind": "text",
      "text": "By Module 19 you'll restructure this into feature folders that scale. For now the rule is simple and worth adopting immediately: **one feature, one folder, one module**, with its controller, service, DTOs, entity and tests together."
    },
    {
      "kind": "example",
      "code": "src/\n├── products/\n│   ├── dto/\n│   │   ├── create-product.dto.ts\n│   │   └── update-product.dto.ts\n│   ├── entities/\n│   │   └── product.entity.ts\n│   ├── products.controller.ts\n│   ├── products.service.ts\n│   ├── products.module.ts\n│   └── products.service.spec.ts\n├── common/                       ← shared guards, filters, interceptors, decorators\n├── config/                       ← typed configuration\n├── app.module.ts\n└── main.ts",
      "lang": "text",
      "label": "src/products/ — the shape you're aiming for"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Folders called `controllers/`, `services/` and `models/` feel tidy for a week and then punish you forever: every change to one feature touches three distant folders, and nothing tells you where a feature ends. Organise by feature. The only type-based folder that earns its place is `common/`, for genuinely cross-cutting pieces."
        }
      ],
      "title": "Trap · Organising by type instead of by feature"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 2.1",
      "title": "Generate and read",
      "blocks": [
        {
          "kind": "text",
          "text": "Scaffold a project, then run `nest g module greeting`, `nest g controller greeting` and `nest g service greeting`. Now open `app.module.ts` and `greeting.module.ts` and answer without guessing: which file did each command modify, and what exactly did it add? Then run `nest g resource books --dry-run` and list what it *would* have created."
        },
        {
          "kind": "reveal",
          "tag": "Answer",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "`g module greeting` created `greeting/greeting.module.ts` and added `GreetingModule` to `AppModule`'s `imports`.",
                "`g controller greeting` created the controller and added it to `GreetingModule`'s `controllers` array — not `AppModule`'s. The CLI registers into the *nearest* module.",
                "`g service greeting` created the service and added it to `GreetingModule`'s `providers` array.",
                "`g resource books` would create the module, controller, service, `dto/create-books.dto.ts`, `dto/update-books.dto.ts`, an entity, and spec files — with full CRUD method stubs already wired."
              ]
            },
            {
              "kind": "text",
              "text": "Note what the CLI did *not* do: it never added `exports`. Sharing a provider between modules is always a deliberate act.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q3",
      "title": "What's in a NestJS project, and what does `nest g resource` generate?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The entry point is `main.ts`, which calls `NestFactory.create(AppModule)`, applies application-wide configuration — global pipes, filters, CORS, prefix, Swagger — and listens. `app.module.ts` is the root module and the top of the dependency graph; every feature module is reachable from it via `imports`. Feature code lives in feature folders, each with a module, a controller for HTTP, a service for logic, DTOs for input contracts, and colocated tests. `nest g resource` scaffolds that whole set with CRUD stubs and registers everything in the right arrays."
        },
        {
          "kind": "text",
          "text": "The detail worth adding: the CLI registers generated providers and controllers in the nearest module automatically, but never exports them — cross-module visibility stays explicit."
        }
      ]
    }
  ]
};
