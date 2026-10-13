import { Lesson } from '../../shared/content';

export const M3_BOOTSTRAP: Lesson = {
  "slug": "m3-bootstrap",
  "title": "M3 `main.ts`, bootstrap, and what Nest does before your first request",
  "nav": "main.ts & bootstrap",
  "num": "M3",
  "eyebrow": "Level 1 · Week 1 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "`main.ts` is the only file in a Nest app that isn't a class. It has one job: create the application, apply everything that must be true for *every* request, and start listening. Understanding it properly is what turns Nest from magic into machinery."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Pass 1 — what the CLI gives you"
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  await app.listen(3000);\n}\nbootstrap();",
      "label": "src/main.ts — generated"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Pass 2 — production shape"
    },
    {
      "kind": "text",
      "text": "This is roughly what a real `main.ts` looks like on day one of a serious project. Every line is a policy applied to the whole application exactly once — which is the entire argument for having a framework."
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { ValidationPipe, Logger, VersioningType } from '@nestjs/common';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport helmet from 'helmet';\nimport { AppModule } from './app.module';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule, { bufferLogs: true });\n\n  app.use(helmet());                                    // secure headers\n  app.enableCors({\n    origin: process.env.CORS_ORIGINS?.split(',') ?? [], // never `origin: true` in prod\n    credentials: true,\n  });\n\n  app.setGlobalPrefix('api');                           // every route under /api\n  app.enableVersioning({ type: VersioningType.URI });   // → /api/v1/...\n\n  app.useGlobalPipes(new ValidationPipe({\n    whitelist: true,            // strip properties not declared on the DTO\n    forbidNonWhitelisted: true, // …or reject the request outright\n    transform: true,            // hand me real, typed class instances\n  }));\n\n  const config = new DocumentBuilder()\n    .setTitle('Products API')\n    .setVersion('1.0')\n    .addBearerAuth()\n    .build();\n  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));\n\n  app.enableShutdownHooks();    // SIGTERM → lifecycle hooks → close pools cleanly\n\n  const port = process.env.PORT ?? 3000;\n  await app.listen(port);\n  new Logger('Bootstrap').log(`listening on ${await app.getUrl()}`);\n}\n\nvoid bootstrap();",
      "label": "src/main.ts — production",
      "verdict": "good"
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/swagger@11 helmet class-validator class-transformer",
      "lang": "text",
      "label": "terminal — the packages this main.ts uses"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Line by line, where it's dense"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`NestFactory.create(AppModule)` — builds the whole application: reads module metadata, resolves the provider graph, instantiates everything, maps routes. Nothing is listening yet. It's `async` because provider factories may be async (a database connection, a fetched secret).",
        "`bufferLogs: true` — holds log output until your real logger is attached, so startup messages aren't lost or unformatted.",
        "`useGlobalPipes(new ValidationPipe(...))` — note `new`. This instance is created outside the DI container, so it cannot inject anything. If your pipe needs a dependency, register it as a provider with the `APP_PIPE` token instead (Module 12).",
        "`enableShutdownHooks()` — without this, a container SIGTERM kills the process with database connections and in-flight jobs mid-flight. With it, Nest runs `onModuleDestroy` and `beforeApplicationShutdown` first.",
        "`void bootstrap()` — marks the floating promise as deliberate, so ESLint stops complaining."
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "This is the mechanism behind every \"how does Nest know?\" question, and it's worth being able to recite:"
        },
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "Read `AppModule`'s decorator metadata; walk `imports` depth-first to build a **module graph**.",
            "For each module, register its `controllers` and `providers` in the **IoC container**, keyed by *token* (the class itself, by default).",
            "Topologically sort the dependency graph and instantiate: for each provider, read its constructor parameter types from metadata, resolve each token *within that module's visibility scope*, then call the constructor.",
            "Cache each instance — providers are **singletons** by default.",
            "**Map routes:** for every controller method, combine the controller's path prefix with the method's verb and path metadata, and register a real Express route whose handler is a Nest-generated wrapper.",
            "Run `onModuleInit` hooks, then `onApplicationBootstrap`, then start the HTTP server."
          ]
        },
        {
          "kind": "text",
          "text": "Everything expensive and reflective happens here — once — which is why per-request overhead is small."
        }
      ],
      "title": "Under the hood · the bootstrap sequence"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The TypeScript this rests on"
    },
    {
      "kind": "text",
      "text": "A prerequisite worth sixty seconds, because Module 6 and Module 20 both depend on it. A **decorator** is a function that runs at class-definition time and can attach metadata to a class. Nest's decorators mostly *only* store metadata — `@Controller('products')` does nothing at runtime except record \"this class is a controller with prefix products\". Two compiler flags make it work:"
    },
    {
      "kind": "example",
      "code": "{\n  \"compilerOptions\": {\n    \"experimentalDecorators\": true,\n    \"emitDecoratorMetadata\": true\n  }\n}",
      "lang": "text",
      "label": "tsconfig.json (excerpt)"
    },
    {
      "kind": "text",
      "text": "`emitDecoratorMetadata` is the important one. It makes TypeScript emit the *types* of your constructor parameters into runtime metadata under the key `design:paramtypes`, readable via `reflect-metadata`. That is how Nest knows `ProductsController` needs a `ProductsService` — it reads the compiled type list. It's also why **an interface can never be an injection token**: interfaces don't exist after compilation."
    },
    {
      "kind": "example",
      "code": "// You wrote:\n//   @Controller('products')\n//   export class ProductsController {\n//     constructor(private readonly products: ProductsService) {}\n//   }\n\n// TypeScript emitted something like:\nReflect.defineMetadata('path', 'products', ProductsController);\nReflect.defineMetadata('design:paramtypes', [ProductsService], ProductsController);\n\n// At bootstrap, Nest reads that array and resolves each entry from the container.",
      "lang": "javascript",
      "label": "what the compiler emits (simplified)"
    },
    {
      "kind": "quiz",
      "question": "Why can't you inject an interface, e.g. `constructor(private repo: IUserRepository) {}`?",
      "options": [
        "Nest forbids interfaces by design",
        "Interfaces don't exist at runtime, so there's no token in `design:paramtypes`",
        "You can — Nest matches by structural typing",
        "Only if the interface has no methods"
      ],
      "answer": 1,
      "why": "**Interfaces are erased at compile time.** DI resolution reads runtime metadata, and an interface leaves nothing behind to key on — you'd get `Object` as the \"type\". The fix is a token you control: `@Inject('USER_REPOSITORY')` with a string or `Symbol` token, or an abstract class, which *does* exist at runtime and can be used as a token while still being implemented by several classes. You'll do this properly in Module 20."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 3.1",
      "title": "Break bootstrap deliberately",
      "blocks": [
        {
          "kind": "text",
          "text": "In a scaffolded project, do each of these one at a time, run `npm run start:dev`, and write down the exact error or behaviour:"
        },
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "Set `\"emitDecoratorMetadata\": false` in `tsconfig.json`.",
            "Restore it, then remove `AppService` from `AppModule`'s `providers` array (leave it injected in the controller).",
            "Restore it, then add `app.setGlobalPrefix('api')` and hit `http://localhost:3000/`."
          ]
        },
        {
          "kind": "reveal",
          "tag": "Answer",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": true,
              "items": [
                "Nest can't read the parameter types, so it can't resolve the dependency: you get a resolution error, usually `Nest can't resolve dependencies of the AppController (?)`, with the `?` marking the parameter it couldn't identify. This is the clearest possible demonstration that DI is built on emitted type metadata.",
                "The same class of error, but for a different reason — the token exists, it simply isn't registered in this module's scope: `Nest can't resolve dependencies of the AppController (?). Please make sure that the argument AppService at index [0] is available in the AppModule context.` Read that message carefully; it tells you the class, the index and the module.",
                "`404`. The route moved to `/api`. Global prefix applies to every controller route, which is why versioning and prefixing belong in `main.ts` rather than in 40 `@Controller()` decorators."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q4",
      "title": "Walk me through what happens between `npm run start` and your first handled request.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `main.ts` runs and calls `NestFactory.create(AppModule)`. Nest reads the root module's metadata and walks `imports` to build a module graph, registering each module's controllers and providers in the IoC container keyed by token. It then instantiates the graph in dependency order: for each provider it reads the constructor parameter types emitted by `emitDecoratorMetadata`, resolves each token within that module's visibility scope — its own providers plus whatever its imported modules export — and constructs the instance, caching it as a singleton. Once providers exist, Nest maps routes by combining each controller's path prefix with its methods' verb and path metadata, registering handlers on the underlying Express instance. Then lifecycle hooks fire — `onModuleInit`, then `onApplicationBootstrap` — and finally `app.listen()` starts the server."
        },
        {
          "kind": "text",
          "text": "From that point, per request, the pipeline runs: middleware, guards, interceptors, pipes, the handler, interceptors again on the way out, and exception filters if anything throws."
        },
        {
          "kind": "text",
          "text": "**Why it's a great question:** it distinguishes \"I use Nest\" from \"I know what Nest does\", and every answer to a harder question — dynamic modules, request scope, why DI fails — is a detail of this sequence.",
          "style": "small"
        }
      ]
    }
  ]
};
