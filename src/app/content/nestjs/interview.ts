import { Lesson } from '../../shared/content';

export const INTERVIEW: Lesson = {
  "slug": "interview",
  "title": "The interview bank",
  "nav": "Interview bank",
  "eyebrow": "Preparation",
  "blocks": [
    {
      "kind": "text",
      "text": "This page is for practice. Fifty-six long-form questions live inside the modules, next to the lesson each one tests: **Q1–Q14** in Modules 1–9, and **Q15–Q56** in Modules 10–30. Here you get thirty rapid-fire questions, **Q57–Q86**, one for each module, and five coding problems."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Where every question lives"
    },
    {
      "kind": "table",
      "head": [
        "Level",
        "Topics",
        "Long-form, in the modules",
        "Rapid-fire and problems, on this page"
      ],
      "rows": [
        [
          "1 · Fundamentals",
          "What Nest is, the CLI, bootstrap",
          "M1–M3 · Q1–Q4",
          "Q57–Q59"
        ],
        [
          "2 · The three building blocks",
          "Modules, controllers, providers and DI",
          "M4–M6 · Q5–Q10",
          "Q60–Q62"
        ],
        [
          "3 · Contracts and the pipeline",
          "DTOs and validation, errors, the request pipeline",
          "M7–M9 · Q11–Q14",
          "Q63–Q65"
        ],
        [
          "4 · The request pipeline",
          "Guards and roles, interceptors, pipes, custom decorators",
          "M10–M13 · Q15–Q22",
          "Q66–Q69 · Problem 1"
        ],
        [
          "5 · Data and identity",
          "PostgreSQL and TypeORM, migrations, transactions, passwords, JWT, refresh tokens, RBAC",
          "M14–M18 · Q23–Q32",
          "Q70–Q74 · Problem 2"
        ],
        [
          "6 · Real systems",
          "Config and architecture, internals, files and webhooks, Redis, queues, WebSockets",
          "M19–M24 · Q33–Q44",
          "Q75–Q80 · Problems 3–4"
        ],
        [
          "7 · Craft, scale and ship",
          "Testing, security, performance, docs and health checks, Docker and CI/CD, microservices",
          "M25–M30 · Q45–Q56",
          "Q81–Q86 · Problem 5"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Each rapid-fire question matches one module: Q57 is about M1, Q58 about M2, and so on, up to Q86 for M30. So if you miss Q70, reread M14.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "How to practise out loud"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Read the question, then look away.** Answer out loud, as if an interviewer is listening. An answer you only think is not the same as one you say.",
        "**Time yourself.** Aim for about 30 seconds on a rapid-fire question and about two minutes on a long-form one.",
        "**Open the answer and compare.** Write down what you missed, and reread that part of the module.",
        "**Give long answers a shape:** what it is, why it exists, one trap, and one example from your own projects.",
        "**Record yourself once a week.** Listen for filler words, and for places where you list facts instead of explaining them."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · Level 1 · Fundamentals"
    },
    {
      "kind": "reveal",
      "tag": "Q57",
      "title": "How do you run Nest on Fastify instead of Express, and what changes?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Install `@nestjs/platform-fastify` and pass a `FastifyAdapter` to `NestFactory.create()`. Your modules, controllers and providers stay the same. What changes is anything tied to Express, such as the objects you get from `@Req()` and `@Res()`, and Express middleware, which may need a Fastify version."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q58",
      "title": "Why organise code by feature and not by type?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With folders like `controllers/` and `services/`, one change touches three distant folders, and nothing shows where a feature ends. One folder and one module per feature keeps related code together and makes the boundaries easy to see. Only truly shared pieces go in `common/`."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q59",
      "title": "What does `app.enableShutdownHooks()` do?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It makes Nest listen for signals like `SIGTERM`, which a container platform sends before it stops your app. Nest then runs `onModuleDestroy`, `beforeApplicationShutdown` and `onApplicationShutdown`, so you can close database pools and finish work. Without it, the process just dies in the middle of whatever it was doing."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · Level 2 · The three building blocks"
    },
    {
      "kind": "reveal",
      "tag": "Q60",
      "title": "What is `forwardRef()` for?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It breaks a circular dependency: two modules that import each other, or two providers that inject each other. It tells Nest to resolve that reference later, once both classes exist. Treat it as a warning sign, because a shared third module or an event usually removes the cycle."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q61",
      "title": "`@Res()` or `@Res({ passthrough: true })`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With plain `@Res()`, you must send the response yourself, and Nest stops applying interceptors and `@HttpCode()` to that route. With `passthrough: true`, you can set a header or a cookie and still `return` a value for Nest to send. Use passthrough unless you really need full control."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q62",
      "title": "What does `@Injectable()` actually do?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It marks the class as a provider that Nest's container can create and inject. Because it is a decorator, it also makes TypeScript save the constructor's parameter types, and Nest reads them to find the dependencies. It does not register the class, so you still list it in a module's `providers`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · Level 3 · Contracts and the pipeline"
    },
    {
      "kind": "reveal",
      "tag": "Q63",
      "title": "Why does `@IsNumber()` fail on `?page=2`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Query strings and route params always arrive as strings, so `page` is `'2'`, not `2`. Add `@Type(() => Number)` so class-transformer turns it into a number before validation. Also set `transform: true`, so your handler gets the number and not the original string."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q64",
      "title": "`useGlobalFilters(new MyFilter())` or the `APP_FILTER` token?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With `new`, you build the filter outside the DI container, so it can't inject anything, such as a logger or config. Registering `{ provide: APP_FILTER, useClass: MyFilter }` in a module lets Nest build it, so injection works. The same is true for `APP_GUARD`, `APP_PIPE` and `APP_INTERCEPTOR`."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q65",
      "title": "Global, controller or route: in what order do bindings run?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** For guards, interceptors and pipes, global bindings run first, then controller ones, then route ones. Exception filters go the other way: a route-level filter gets the first chance to catch, and global filters are the last resort. Inside one `@UseGuards(A, B)`, `A` runs before `B`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · Level 4 · The request pipeline"
    },
    {
      "kind": "reveal",
      "tag": "Q66",
      "title": "A guard returns `false`. What does the client get?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A 403: Nest throws a `ForbiddenException` with the message `Forbidden resource`. A 403 means \"I know who you are, and you can't do this\"; a 401 means \"I don't know who you are\". So for a missing or invalid token, throw `UnauthorizedException` in the guard instead of returning `false`."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q67",
      "title": "How does an interceptor work on both sides of the handler?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `intercept()` gets a `CallHandler`, and `next.handle()` returns an Observable of the handler's result. Code before `next.handle()` runs before the handler, and RxJS operators piped onto it, like `map()`, run after, for example to wrap every response as `{ data }`. If you return without calling `next.handle()`, the handler never runs, which is how a cache interceptor answers from the cache."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q68",
      "title": "What does a pipe receive in `transform(value, metadata)`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `value` is the incoming argument. `metadata` tells you where it came from (`type` is `body`, `query`, `param` or `custom`), its declared class (`metatype`) and the name given to the decorator (`data`, like `id` in `@Param('id')`). `ValidationPipe` uses `metatype` to know which DTO class to check."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q69",
      "title": "What are the three kinds of custom decorator?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Param decorators, made with `createParamDecorator()`, pull a value out of the request, like `@CurrentUser()`. Metadata decorators, made with `SetMetadata()` or `Reflector.createDecorator()`, label a route for a guard to read, like `@Roles('admin')`. Composed decorators, made with `applyDecorators()`, bundle several decorators into one, like `@Auth('admin')`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · Level 5 · Data and identity"
    },
    {
      "kind": "reveal",
      "tag": "Q70",
      "title": "What do `TypeOrmModule.forRoot()` and `forFeature()` each do?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `forRoot()`, or `forRootAsync()`, is called once in the root module and opens the database connection, the `DataSource`. `forFeature([Product])` is called in each feature module and registers repositories for those entities, which you inject with `@InjectRepository(Product)`. This keeps each module's data access inside its own boundary."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q71",
      "title": "What does `migration:revert` undo?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Only the last migration that ran, by calling its `down()` method; run it again to step back one more. So every migration needs a `down()` that really undoes its `up()`. And never edit a migration that has already run anywhere: the database records it as done and won't run it again. Write a new migration instead."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q72",
      "title": "Offset or keyset pagination?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Offset pagination (`skip` and `take`, so `LIMIT` and `OFFSET` in SQL) is simple and can jump to any page, but the database still reads every row it skips, so deep pages get slow, and rows can repeat or go missing when new rows arrive between requests. Keyset pagination continues after the last row the client saw, for example `WHERE (created_at, id) < (:lastCreatedAt, :lastId)` ordered the same way. With an index on those columns it stays fast at any depth and doesn't skip or repeat rows. You give up jumping straight to page 50. Use it for feeds and long lists."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q73",
      "title": "Is a JWT encrypted?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** No. A normal JWT is signed, not encrypted: the header and payload are only base64url-encoded, so anyone who has the token can read them. The signature only proves that nobody changed the token, so never put secrets in the payload."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q74",
      "title": "Access token or refresh token: what is the difference?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The access token is short-lived (minutes), goes with every request, and is checked without a database lookup. The refresh token lives longer, goes only to the refresh endpoint, and is stored hashed on the server, so it can be revoked. With rotation, every refresh returns a new refresh token, and if an old one is used again, you treat it as stolen and end the whole session."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · Level 6 · Real systems"
    },
    {
      "kind": "reveal",
      "tag": "Q75",
      "title": "How do you catch a missing environment variable early?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Validate the config when the app starts: `ConfigModule.forRoot()` accepts a `validate` function or a Joi `validationSchema`. If `DATABASE_URL` is missing, the app refuses to boot with a clear message, instead of failing at the first query an hour later."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q76",
      "title": "What is `AsyncLocalStorage` used for in a Nest app?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It holds context for one request, like a correlation ID or the current user, that any code running for that request can read. You start it in middleware with `als.run(store, () => next())`, and read it anywhere later with `als.getStore()`. It saves you from passing context through every function, and avoids the cost of request-scoped providers."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q77",
      "title": "How do you check that a webhook really came from the sender?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The sender signs the raw request body with a shared secret; you compute the same HMAC and compare the two with `crypto.timingSafeEqual()`. You need the exact raw bytes, so create the app with `rawBody: true` and read `req.rawBody`. Also reject old timestamps, and skip event IDs you have already processed."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q78",
      "title": "What is cache-aside, and what is the hard part?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Read from Redis first; on a miss, read the database and save the result in Redis with a TTL (time to live). The hard part is invalidation: when the data changes, you must delete or update the cached key. The TTL is your safety net, because it limits how long stale data can live."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q79",
      "title": "A `@Cron()` job runs in a service with three replicas. What goes wrong?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `@nestjs/schedule` runs the job inside every instance, so it runs three times. Run scheduled work in one worker process, or let BullMQ schedule it with a job scheduler (a repeatable job): Redis stores the schedule once, and each run goes to only one worker."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q80",
      "title": "How do you scale WebSockets across two servers?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Each client is connected to one server, so an event sent on server A never reaches clients on server B. The Socket.IO Redis adapter passes events between servers through Redis pub/sub. You also need sticky sessions at the load balancer, because Socket.IO's default HTTP long-polling must keep reaching the same server."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · Level 7 · Craft, scale and ship"
    },
    {
      "kind": "reveal",
      "tag": "Q81",
      "title": "Unit, integration or E2E test: what is the difference?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A unit test checks one class with fakes, built with `Test.createTestingModule()` and `useValue`. An integration test runs real pieces together, such as a service against a real Postgres in a container. An E2E (end-to-end) test boots the whole app and sends real HTTP requests with Supertest; write many unit tests, fewer integration tests, and E2E tests for the main flows."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q82",
      "title": "What is BOLA?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Broken Object Level Authorization, number one in the OWASP API Security Top 10: a user changes an ID in the URL and gets someone else's data. Role checks don't stop it, because the attacker has the right role. Check ownership on every access, for example by querying with both `id` and `ownerId`, as in Problem 5."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q83",
      "title": "Why is a CPU-heavy loop dangerous in a Nest app?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Node runs your JavaScript on one thread, the event loop. While a long loop runs, that process can't answer any other request, so every user waits. Move heavy work to a worker thread or a queue worker, and watch event-loop delay in your metrics."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q84",
      "title": "Liveness check or readiness check?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Liveness asks \"is the process alive?\"; if it fails, the platform restarts it, so keep it simple and don't check the database. Readiness asks \"can it serve traffic now?\"; it checks the database and Redis, and if it fails, traffic stops but nothing restarts. In Nest, `@nestjs/terminus` gives you the health indicators."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q85",
      "title": "Why use a multi-stage Docker build?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The first stage has the TypeScript compiler and dev dependencies, and builds `dist/`. The final stage copies only `dist/` and the production dependencies onto a slim Node image, so the image is smaller and there is less to attack. Run it as the non-root `node` user that the official image provides."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q86",
      "title": "When would you split a modular monolith into microservices?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Only for a concrete reason: one part must scale or deploy on its own, a separate team owns it, or it needs different reliability. Microservices add network failures, distributed transactions and much more to run and watch. A modular monolith with clean boundaries keeps that option open without paying the cost on day one."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Coding problems"
    },
    {
      "kind": "text",
      "text": "Give each problem 20 minutes in an editor before you open the solution. In a real interview, talk while you code: say what you are checking and why. Silence looks like being stuck."
    },
    {
      "kind": "reveal",
      "tag": "Problem 1",
      "title": "Write a guard that lets only certain roles through",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a `@Roles()` decorator and a `RolesGuard`, using the `Role` type from the course's `auth/auth-user.ts` (`'user' | 'admin'`). Assume the global `JwtAuthGuard` has already put the user on `request.user`, with a `roles` array."
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "A route with `@Roles('admin')` answers **403** to a user without that role.",
            "A route with no `@Roles()` stays open to any logged-in user.",
            "`@Roles()` on a method wins over `@Roles()` on its controller."
          ]
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { SetMetadata } from '@nestjs/common';\nimport type { Role } from './auth-user'; // 'user' | 'admin' (Module 10)\n\nexport const ROLES_KEY = 'roles';\nexport const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);",
              "label": "auth/auth.decorators.ts"
            },
            {
              "kind": "example",
              "code": "import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport type { AuthRequest, Role } from './auth-user';\nimport { ROLES_KEY } from './auth.decorators';\n\n@Injectable()\nexport class RolesGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n\n  canActivate(context: ExecutionContext): boolean {\n    // Look on the method first, then on the class. The first one found wins.\n    const required = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [\n      context.getHandler(),\n      context.getClass(),\n    ]);\n    if (!required || required.length === 0) return true; // no @Roles(): any logged-in user\n\n    const { user } = context.switchToHttp().getRequest<AuthRequest>();\n    return !!user && required.some((role) => user.roles.includes(role)); // false → 403\n  }\n}",
              "label": "auth/roles.guard.ts"
            },
            {
              "kind": "example",
              "code": "// auth/auth.module.ts: both guards global, in this order (Modules 10 and 17)\nproviders: [\n  { provide: APP_GUARD, useClass: JwtAuthGuard }, // 1st: who are you?     → 401\n  { provide: APP_GUARD, useClass: RolesGuard },   // 2nd: may you do this? → 403\n],\n\n// users/users.controller.ts: no @UseGuards() anywhere\n@Controller('users')\n@Roles('admin') // the default for every route in this class\nexport class UsersController {\n  constructor(private readonly users: UsersService) {}\n\n  @Get()\n  findAll() {\n    return this.users.findAll(); // admins only, from the class\n  }\n\n  @Get('me')\n  @Roles('user', 'admin') // the method wins: any logged-in user may read their own profile\n  findMe(@CurrentUser('id') userId: string) {\n    return this.users.findOne(userId);\n  }\n}",
              "label": "auth/auth.module.ts + users/users.controller.ts — using it"
            },
            {
              "kind": "text",
              "text": "`getAllAndOverride()` checks the method first, then the class, so the method wins. When `canActivate()` returns `false`, Nest throws `ForbiddenException`, so the client gets a normal 403 in your usual error shape. Registering both guards with `APP_GUARD`, JWT first, makes every route need a token (401) before roles are checked (403), and no controller can forget a `@UseGuards()`. Module 10's own guard also lets `@Public()` routes through. To add a support role later, add `'support'` to `Role` in `auth/auth-user.ts` and write `@Roles('admin', 'support')`; Module 18's permission map shows the same one-line change. `Reflector.createDecorator<Role[]>()` is a newer way to build the decorator and its key in one line."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 2",
      "title": "Make this money transfer safe",
      "blocks": [
        {
          "kind": "text",
          "text": "This service moves money between two accounts. It works when you try it by hand. Under real traffic, it reports transfers that never really happened, and a crash at the wrong moment makes money disappear. Find both bugs, then fix them."
        },
        {
          "kind": "example",
          "code": "@Injectable()\nexport class TransfersService {\n  constructor(\n    @InjectRepository(Account) private readonly accounts: Repository<Account>,\n  ) {}\n\n  async transfer(fromId: string, toId: string, amountCents: number): Promise<void> {\n    const from = await this.accounts.findOneByOrFail({ id: fromId });\n    const to = await this.accounts.findOneByOrFail({ id: toId });\n    if (from.balanceCents < amountCents) {\n      throw new BadRequestException('Not enough money');\n    }\n\n    from.balanceCents -= amountCents;\n    to.balanceCents += amountCents;\n    await this.accounts.save(from);\n    await this.accounts.save(to);\n  }\n}",
          "label": "transfers/transfers.service.ts — before",
          "verdict": "bad"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "**Bug 1: no transaction.** If the process dies between the two `save()` calls, money leaves one account and never reaches the other. **Bug 2: a race.** Two transfers can read the same balance at the same moment; both pass the check, and the second save overwrites the first."
            },
            {
              "kind": "example",
              "code": "import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';\nimport { DataSource } from 'typeorm';\nimport { Account } from '../accounts/account.entity';\n\n@Injectable()\nexport class TransfersService {\n  constructor(private readonly dataSource: DataSource) {}\n\n  async transfer(fromId: string, toId: string, amountCents: number): Promise<void> {\n    if (fromId === toId) throw new BadRequestException('Pick two different accounts');\n\n    // One transaction: if anything inside throws, every change rolls back.\n    await this.dataSource.transaction(async (manager) => {\n      // Lock both rows, always in the same order (sorted by id). Otherwise two\n      // transfers going opposite ways could each hold one lock and wait forever.\n      const [firstId, secondId] = [fromId, toId].sort();\n      const first = await manager.findOne(Account, {\n        where: { id: firstId },\n        lock: { mode: 'pessimistic_write' }, // SELECT ... FOR UPDATE\n      });\n      const second = await manager.findOne(Account, {\n        where: { id: secondId },\n        lock: { mode: 'pessimistic_write' },\n      });\n      if (!first || !second) throw new NotFoundException('Account not found');\n\n      const from = first.id === fromId ? first : second;\n      const to = first.id === fromId ? second : first;\n      if (from.balanceCents < amountCents) {\n        throw new BadRequestException('Not enough money');\n      }\n\n      from.balanceCents -= amountCents;\n      to.balanceCents += amountCents;\n      await manager.save([from, to]); // through `manager`, so inside the transaction\n    });\n  }\n}",
              "label": "transfers/transfers.service.ts — after",
              "verdict": "good"
            },
            {
              "kind": "text",
              "text": "The transaction makes the two updates all-or-nothing: if anything inside the callback throws, both roll back. The `pessimistic_write` lock makes a second transfer wait until the first one commits, so it reads the new balance. Run every query through `manager`, because an injected repository would run outside the transaction. A single `UPDATE` that subtracts only when the balance is high enough, and then checks that one row changed, is also a good answer."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 3",
      "title": "Write a configurable module with `forRoot()` and `forRootAsync()`",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a `MailModule` that each importer can configure."
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "`MailModule.forRoot({ apiKey, from })` takes the options directly, which is handy in tests.",
            "`MailModule.forRootAsync()` builds them with a factory that can inject `ConfigService`.",
            "In both cases, `MailService` gets the options by injection, and other modules can inject `MailService`."
          ]
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import {\n  DynamicModule, FactoryProvider, Inject, Injectable, Module, ModuleMetadata,\n} from '@nestjs/common';\n\nexport interface MailOptions {\n  apiKey: string;\n  from: string;\n}\n\nexport interface MailAsyncOptions extends Pick<ModuleMetadata, 'imports'> {\n  useFactory: (...args: any[]) => MailOptions | Promise<MailOptions>;\n  inject?: FactoryProvider['inject'];\n}\n\n// A token we own. The options are injected by this token, because an\n// interface can't be a token.\nexport const MAIL_OPTIONS = Symbol('MAIL_OPTIONS');\n\n@Injectable()\nexport class MailService {\n  constructor(@Inject(MAIL_OPTIONS) private readonly options: MailOptions) {}\n\n  async send(to: string, subject: string, text: string): Promise<void> {\n    const res = await fetch('https://api.mail.example/v1/send', {\n      method: 'POST',\n      headers: {\n        authorization: `Bearer ${this.options.apiKey}`,\n        'content-type': 'application/json',\n      },\n      body: JSON.stringify({ from: this.options.from, to, subject, text }),\n    });\n    if (!res.ok) throw new Error(`Mail provider answered ${res.status}`);\n  }\n}\n\n@Module({})\nexport class MailModule {\n  // The options are known up front: handy in tests.\n  static forRoot(options: MailOptions): DynamicModule {\n    return {\n      module: MailModule,\n      providers: [{ provide: MAIL_OPTIONS, useValue: options }, MailService],\n      exports: [MailService],\n    };\n  }\n\n  // The options are built by a factory that can inject other providers.\n  static forRootAsync(options: MailAsyncOptions): DynamicModule {\n    return {\n      module: MailModule,\n      imports: options.imports ?? [],\n      providers: [\n        { provide: MAIL_OPTIONS, useFactory: options.useFactory, inject: options.inject ?? [] },\n        MailService,\n      ],\n      exports: [MailService],\n    };\n  }\n}",
              "label": "mail/mail.module.ts"
            },
            {
              "kind": "example",
              "code": "import { Module } from '@nestjs/common';\nimport { ConfigModule, ConfigService } from '@nestjs/config';\nimport { MailModule } from './mail/mail.module';\n\n@Module({\n  imports: [\n    ConfigModule.forRoot({ isGlobal: true }), // global, so the factory can inject ConfigService\n    MailModule.forRootAsync({\n      inject: [ConfigService],\n      useFactory: (config: ConfigService) => ({\n        apiKey: config.getOrThrow<string>('MAIL_API_KEY'),\n        from: config.getOrThrow<string>('MAIL_FROM'),\n      }),\n    }),\n  ],\n})\nexport class AppModule {}\n\n// In a unit test, skip config entirely:\n//   MailModule.forRoot({ apiKey: 'test-key', from: 'test@example.com' })",
              "label": "app.module.ts — using it"
            },
            {
              "kind": "text",
              "text": "A dynamic module is a plain object that a static method returns at import time, so each importer can pass its own settings. `forRootAsync()` turns the options into a factory provider, so Nest builds them only after `ConfigService` is ready, and `getOrThrow()` stops the app at boot if a variable is missing. In real projects, `ConfigurableModuleBuilder` writes both methods for you; writing them once by hand is how you learn what it does."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 4",
      "title": "Make this payment endpoint idempotent",
      "blocks": [
        {
          "kind": "text",
          "text": "Mobile apps retry `POST /payments` when the network drops. Sometimes the first request did succeed, so the customer pays twice. *Idempotent* means that sending the same request twice has the same effect as sending it once. Make the endpoint idempotent: the client sends an `Idempotency-Key` header, and a repeat with the same key gets the first answer back without a second charge. Assume a provider with the token `REDIS` that holds an ioredis client."
        },
        {
          "kind": "example",
          "code": "@Controller('payments')\n@UseGuards(JwtAuthGuard)\nexport class PaymentsController {\n  constructor(private readonly payments: PaymentsService) {}\n\n  @Post()\n  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePaymentDto) {\n    return this.payments.charge(user.id, dto); // a retry charges the card again\n  }\n}",
          "label": "payments/payments.controller.ts — before",
          "verdict": "bad"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import {\n  BadRequestException, CallHandler, ConflictException,\n  ExecutionContext, Inject, Injectable, NestInterceptor,\n} from '@nestjs/common';\nimport { Request } from 'express';\nimport { Redis } from 'ioredis';\nimport { Observable, catchError, mergeMap, of } from 'rxjs';\nimport { REDIS } from '../redis/redis.constants';\n\nconst RUNNING_SECONDS = 60; // if the server dies mid-request, the key frees itself\nconst SAVED_SECONDS = 24 * 60 * 60; // keep the first answer for a day of retries\n\n@Injectable()\nexport class IdempotencyInterceptor implements NestInterceptor {\n  constructor(@Inject(REDIS) private readonly redis: Redis) {}\n\n  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {\n    const req = context.switchToHttp().getRequest<Request & { user: { id: string } }>();\n    const key = req.header('idempotency-key');\n    if (!key) throw new BadRequestException('The Idempotency-Key header is required');\n\n    const redisKey = `idempotency:${req.user.id}:${key}`; // keys are per user\n\n    // NX = \"only if it doesn't exist yet\". Redis does this in one atomic step,\n    // so when two copies of a request arrive together, exactly one wins.\n    const won = await this.redis.set(\n      redisKey, JSON.stringify({ done: false }), 'EX', RUNNING_SECONDS, 'NX',\n    );\n\n    if (!won) {\n      const saved = JSON.parse((await this.redis.get(redisKey)) ?? '{}');\n      if (saved.done) return of(saved.body); // a retry: send the first answer again\n      throw new ConflictException('A request with this key is still running');\n    }\n\n    return next.handle().pipe(\n      mergeMap(async (body) => {\n        await this.redis.set(redisKey, JSON.stringify({ done: true, body }), 'EX', SAVED_SECONDS);\n        return body;\n      }),\n      catchError(async (err) => {\n        await this.redis.del(redisKey); // it failed, so let the client retry\n        throw err;\n      }),\n    );\n  }\n}",
              "label": "common/idempotency.interceptor.ts",
              "verdict": "good"
            },
            {
              "kind": "example",
              "code": "@Post()\n@UseInterceptors(IdempotencyInterceptor) // guards run first, so req.user is ready\ncreate(@CurrentUser() user: AuthUser, @Body() dto: CreatePaymentDto) {\n  return this.payments.charge(user.id, dto);\n}",
              "label": "payments/payments.controller.ts — after"
            },
            {
              "kind": "text",
              "text": "`SET` with `NX` is atomic, so when two copies of a request arrive together, exactly one runs and the other gets a 409. Later retries get the saved answer, so the card is charged once, and a failed attempt deletes the key so the client can try again. In production, also store a hash of the body to reject the same key with a different body, and pass the key on to your payment provider (Stripe accepts one), so even a crash in the middle of a charge can't charge twice."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 5",
      "title": "Fix the data leak, then prove it with a test",
      "blocks": [
        {
          "kind": "text",
          "text": "Any logged-in user can read any invoice by changing the ID in the URL. Fix the leak. Then write an end-to-end test that fails before your fix and passes after it."
        },
        {
          "kind": "example",
          "code": "// invoices.controller.ts\n// The global JwtAuthGuard (Module 17) has already checked the token.\n@Controller('invoices')\nexport class InvoicesController {\n  constructor(private readonly invoices: InvoicesService) {}\n\n  @Get(':id')\n  findOne(@Param('id', ParseUUIDPipe) id: string) {\n    return this.invoices.findOne(id); // never asks who is asking\n  }\n}\n\n// invoices.service.ts\nasync findOne(id: string) {\n  const invoice = await this.repo.findOneBy({ id });\n  if (!invoice) throw new NotFoundException('Invoice not found');\n  return invoice;\n}",
          "label": "invoices — before",
          "verdict": "bad"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// invoices.controller.ts\n@Get(':id')\nfindOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {\n  return this.invoices.findOne(id, user);\n}\n\n// invoices.service.ts: the same shape as Module 18's OrdersService.findOne(id, user)\nasync findOne(id: string, user: AuthUser) {\n  // The owner is part of the WHERE clause, so someone else's invoice is \"not found\".\n  const invoice = await this.repo.findOneBy({ id, ownerId: user.id });\n  if (!invoice) throw new NotFoundException('Invoice not found');\n  return invoice;\n}",
              "label": "invoices — the fix"
            },
            {
              "kind": "example",
              "code": "import { INestApplication } from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport { App } from 'supertest/types';\nimport { DataSource } from 'typeorm';\nimport { AppModule } from '../src/app.module';\nimport { configureApp } from '../src/app.setup';\nimport type { JwtPayload } from '../src/auth/auth-user';\nimport { Invoice } from '../src/invoices/invoice.entity';\nimport { User } from '../src/users/entities/user.entity';\nimport { saveUser } from './builders'; // Module 25\n\ndescribe('GET /api/invoices/:id (e2e)', () => {\n  let app: INestApplication<App>;\n  let aliceToken: string;\n  let bobToken: string;\n  let aliceInvoiceId: string;\n\n  // Real tokens, signed with the app's own key: the global JwtAuthGuard runs for real.\n  const tokenFor = (user: User) => {\n    const payload: JwtPayload = { sub: user.id, email: user.email, roles: user.roles };\n    return app.get(JwtService).signAsync(payload);\n  };\n\n  beforeAll(async () => {\n    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = configureApp(moduleRef.createNestApplication({ rawBody: true }));\n    await app.init();\n\n    const db = app.get(DataSource);\n    const alice = await saveUser(db);\n    const bob = await saveUser(db);\n    aliceToken = await tokenFor(alice);\n    bobToken = await tokenFor(bob);\n    const invoice = await db.getRepository(Invoice).save({ ownerId: alice.id, amountCents: 5000 });\n    aliceInvoiceId = invoice.id;\n  });\n\n  afterAll(() => app.close());\n\n  it('lets the owner read the invoice', () =>\n    request(app.getHttpServer())\n      .get(`/api/invoices/${aliceInvoiceId}`)\n      .set('Authorization', `Bearer ${aliceToken}`)\n      .expect(200));\n\n  it('returns 404 to anyone else', () =>\n    request(app.getHttpServer())\n      .get(`/api/invoices/${aliceInvoiceId}`)\n      .set('Authorization', `Bearer ${bobToken}`)\n      .expect(404));\n});",
              "label": "test/invoices.e2e-spec.ts"
            },
            {
              "kind": "text",
              "text": "With `ownerId` in the query, someone else's invoice can't be found at all. Many APIs answer 404 here, not 403, so a caller can't even learn that the ID exists. The test signs real tokens for two real users, as in Module 25: the JWT guard is global (`APP_GUARD`), so `overrideGuard()` couldn't replace it anyway, and real tokens test the real guard. Run the 404 test before the fix and watch it fail: that is how you know it tests the bug. The bug has a name, BOLA (Q82)."
            }
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "title": "You are ready when you can do three things",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "Answer every rapid-fire question out loud in about 30 seconds, without opening it.",
            "Solve the five problems from an empty file.",
            "Talk for two minutes about one of your projects: the problem, one hard decision, and one thing you would change now."
          ]
        },
        {
          "kind": "text",
          "text": "Thirty modules ago, you typed `nest new`. Now you can design, test and ship a real backend, and explain every choice you made. That last part is what gets you hired."
        }
      ]
    }
  ]
};
