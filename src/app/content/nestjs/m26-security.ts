import { Lesson } from '../../shared/content';

export const M26_SECURITY: Lesson = {
  "slug": "m26-security",
  "title": "M26 Security and the OWASP Top 10",
  "nav": "Security & OWASP",
  "num": "M26",
  "eyebrow": "Level 7 · Week 15 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Most real attacks on an API are not clever. Someone takes an order id from a shared receipt link, calls `GET /orders/:id` with it, and reads a stranger's order. Someone adds `\"roles\": [\"admin\"]` to a sign-up body. A script tries ten thousand passwords a minute. This module is the short list of settings and habits that stop those attacks, mapped to the **OWASP Top 10**: a list of the most common and most damaging web security risks, published by the Open Worldwide Application Security Project."
    },
    {
      "kind": "text",
      "text": "Nest gives you good tools, but almost none of them are switched on by default. Security here is a checklist you apply once, in `main.ts` and `AppModule`, plus one rule you apply in every query."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Security means people can only see and change what is theirs, and nobody can break the app for everyone else. Most attacks are simple: guessing another user's id, sending fields you didn't expect, or sending far too many requests. Nest has the tools, but you must switch them on and check ownership in every query."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Secure defaults in main.ts"
    },
    {
      "kind": "text",
      "text": "Three settings belong in every production API. **`helmet`** is a middleware, code that runs on every request before routing, that sets security-related HTTP headers: for example, telling browsers to use HTTPS only, and not to guess a response's content type. **CORS** (Cross-Origin Resource Sharing) is how your API tells browsers which *other websites* may call it from JavaScript. And the **trust proxy** setting makes `req.ip` the real client's address when a load balancer sits in front of your app."
    },
    {
      "kind": "example",
      "code": "npm i helmet @nestjs/throttler@6",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { NestExpressApplication } from '@nestjs/platform-express';\nimport helmet from 'helmet';\nimport { AppModule } from './app.module';\nimport { configureApp } from './app.setup';\n\nasync function bootstrap() {\n  // rawBody: Module 21's webhook signatures are checked against the exact bytes\n  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });\n\n  app.use(helmet());                  // first, so every route gets the headers\n\n  app.enableCors({\n    origin: ['https://shop.example.com', 'https://admin.shop.example.com'],  // a list, never `true`\n    credentials: true,                // only if the browser sends cookies\n    methods: ['GET', 'POST', 'PATCH', 'DELETE'],\n    maxAge: 600,                      // browsers may cache the preflight check for 10 minutes\n  });\n\n  app.set('trust proxy', 1);          // one load balancer in front: req.ip is the real client\n\n  configureApp(app);                  // global ValidationPipe with whitelist (Modules 7 and 25)\n  await app.listen(process.env.PORT ?? 3000);\n}\nbootstrap();",
      "label": "main.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "In production, load the CORS origins from configuration (Module 19), so staging and production can differ without a code change. Express also caps JSON bodies at 100 kB by default. If you need more, raise it on purpose with `app.useBodyParser('json', { limit: '1mb' })`; never remove the limit. On the Fastify adapter (Module 27), the packages are `@fastify/helmet` and `@fastify/cors`, or `app.enableCors()` as above.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · reflecting any origin",
      "blocks": [
        {
          "kind": "text",
          "text": "`enableCors({ origin: true, credentials: true })` looks harmless: it copies whatever `Origin` the browser sends into the response. Together with cookies, that lets *any* website make logged-in requests to your API and read the answers. Use an explicit list of origins. And remember what CORS is: a rule that *browsers* enforce. `curl`, scripts and other servers ignore it completely, so it never replaces authentication."
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
          "text": "The Angular dev server's proxy (`proxy.conf.json`) makes API calls look same-origin, so you never see a CORS error in development. Then production serves the app from `shop.example.com` and the API from `api.shop.example.com`, and the browser blocks every call. Set up the real CORS list early. If you use cookies for auth, Angular's `HttpClient` must send `withCredentials: true`, and the API must answer with `credentials: true` and an exact origin. Also, Angular's template sanitising protects the page, not the API: the API must validate everything as if the client were `curl`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rate limiting with @nestjs/throttler"
    },
    {
      "kind": "text",
      "text": "**Rate limiting** caps how many requests one client can make in a time window. It slows down password guessing, and it stops one noisy script from using up the server for everyone else. `@nestjs/throttler` does it as a guard, and by default it identifies the client by IP address. Version 6 takes times in **milliseconds**; version 4 and older used seconds, so old blog posts are off by a factor of 1,000."
    },
    {
      "kind": "example",
      "code": "import { Module } from '@nestjs/common';\nimport { APP_GUARD } from '@nestjs/core';\nimport { SkipThrottle, Throttle, ThrottlerGuard, ThrottlerModule, minutes } from '@nestjs/throttler';\n\n@Module({\n  imports: [\n    ThrottlerModule.forRoot([{ ttl: minutes(1), limit: 100 }]),  // 100 requests a minute per client\n    // ...\n  ],\n  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],  // applies to every route\n})\nexport class AppModule {}\n\n// auth/auth.controller.ts: far stricter where guessing pays off\n@Controller('auth')\nexport class AuthController {\n  @Public()                                               // no token needed to log in (Module 17)\n  @Post('login')\n  @HttpCode(200)\n  @Throttle({ default: { limit: 5, ttl: minutes(1) } })  // 5 attempts a minute\n  login(@Body() dto: LoginDto) {\n    // ...\n  }\n}\n\n// health/health.controller.ts: the load balancer calls this constantly, never block it\n@Public()\n@SkipThrottle()\n@Controller('health')\nexport class HealthController {\n  // ...\n}",
      "label": "app.module.ts + auth.controller.ts + health.controller.ts"
    },
    {
      "kind": "text",
      "text": "A blocked request gets `429 Too Many Requests` with a `Retry-After` header. `minutes()` and `seconds()` are helpers from the package that return milliseconds. With an unnamed throttler, as here, its name is `default`. You can define several named throttlers (`{ name: 'burst', ttl: seconds(1), limit: 10 }`); then `@Throttle()` and `@SkipThrottle()` take those names, and a bare `@SkipThrottle()` only skips the one called `default`.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · everyone shares one IP behind a proxy",
      "blocks": [
        {
          "kind": "text",
          "text": "Behind a load balancer, every request arrives from the balancer's IP address. All your users then share one rate-limit bucket, and one busy minute locks everybody out. Set `app.set('trust proxy', 1)`, where the number is how many proxies sit in front of you, so `req.ip` becomes the real client. Don't set it to `true`: then any client can send its own `X-Forwarded-For` header and get a fresh bucket on every request. Also, the default storage keeps counters in memory, so with three replicas a client gets three times the limit; use a Redis storage, such as `@nest-lab/throttler-storage-redis`, once you scale out."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Injection: let the driver handle values"
    },
    {
      "kind": "text",
      "text": "**SQL injection** happens when user input is pasted into the text of a SQL query, so the input can change what the query *does*. The fix is **parameterised queries**: the SQL and the values travel to Postgres separately, so a value can never become code. TypeORM's `find()` options, `findOneBy()` and query-builder parameters all do this for you. The danger is any place where you build SQL with a template string."
    },
    {
      "kind": "example",
      "code": "// GET /products?search=lamp&sortBy=price\nsearch(search: string, sortBy: string) {\n  return this.dataSource.query(\n    `SELECT * FROM products WHERE name ILIKE '%${search}%' ORDER BY ${sortBy}`,\n  );\n}\n\n// search = \"'; DROP TABLE products; --\" turns the query into:\n//   SELECT * FROM products WHERE name ILIKE '%'; DROP TABLE products; --%' ORDER BY ...\n// With no parameters, Postgres accepts several statements in one call.",
      "label": "products/products.repository.ts — SQL built from input",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "// Column names can't be parameters, so they come from a fixed list.\nconst SORT_COLUMNS = {\n  name: 'product.name',\n  price: 'product.price',\n  createdAt: 'product.createdAt',\n} as const;\n\nsearch(dto: ListProductsDto) {          // already validated by ValidationPipe (Module 7)\n  return this.repo\n    .createQueryBuilder('product')\n    .where('product.name ILIKE :search', { search: `%${dto.search ?? ''}%` })  // a parameter\n    .orderBy(SORT_COLUMNS[dto.sortBy], dto.order === 'asc' ? 'ASC' : 'DESC')\n    .take(dto.limit)\n    .skip((dto.page - 1) * dto.limit)\n    .getMany();\n}\n\n// Raw SQL is fine too, with numbered parameters:\n//   this.dataSource.query('SELECT * FROM products WHERE name ILIKE $1', [`%${search}%`]);",
      "label": "products/products.repository.ts — values as parameters",
      "verdict": "good"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · a column name can't be a parameter",
      "blocks": [
        {
          "kind": "text",
          "text": "Parameters work for *values* only. A table name, a column in `ORDER BY` or a sort direction can't be a parameter, so people paste them into the string, and `?sortBy=price;DROP TABLE products` is an injection again. Map the user's choice to a fixed list of real column names, as `SORT_COLUMNS` does, and validate the input with `@IsIn()` or `@IsEnum()` as well (Module 7's `ListProductsDto` already does). Look out for `orderBy()`, `addOrderBy()`, `groupBy()` and `select()` strings built from input."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Broken access control and IDOR"
    },
    {
      "kind": "text",
      "text": "**Broken access control** is number one on the OWASP list. Its most common form in APIs is **IDOR**, Insecure Direct Object Reference: the API takes an id from the client and loads that record without checking that it belongs to the caller. The OWASP API Security Top 10 calls the same bug **BOLA**, Broken Object Level Authorization, and ranks it first. The auth guard checked *who* you are. Nothing checked *whose order* this is."
    },
    {
      "kind": "example",
      "code": "// The global JwtAuthGuard (Module 17) has already run: logged in? yes.\n@Controller('orders')\nexport class OrdersController {\n  constructor(private readonly orders: OrdersService) {}\n\n  @Get(':id')\n  findOne(@Param('id', ParseUUIDPipe) id: string) {\n    return this.orders.findOne(id);     // whose order? nobody checked\n  }\n}\n\n// OrdersService.findOne:  return this.repo.findOneBy({ id });\n// Any logged-in user with another order's id, from a shared link, an email or a log line,\n// can read that order. Sequential ids are worse: they just count upwards.",
      "label": "orders/orders.controller.ts — logged in is not the same as allowed",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "// orders.service.ts: \"your own order, or the permission to read anyone's\" (Module 18)\nasync findOne(id: string, user: AuthUser): Promise<Order> {\n  const order = await this.orders.findOne({ where: { id }, relations: { items: true } });\n  if (!order || (order.userId !== user.id && !can(user, 'orders:read-any'))) {\n    // 404, not 403: a stranger cannot even learn that the order exists\n    throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: `Order ${id} not found` });\n  }\n  return order;\n}\n\n// orders.controller.ts\nimport type { AuthUser } from '../auth/auth-user';   // `import type`: Module 13 explains why\nimport { CurrentUser } from '../auth/current-user.decorator';\n\n@Controller('orders')\nexport class OrdersController {\n  constructor(private readonly orders: OrdersService) {}\n\n  @Get(':id')\n  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {\n    return this.orders.findOne(id, user);\n  }\n}",
      "label": "orders/orders.service.ts + orders.controller.ts — Module 18's ownership check",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "`ParseUUIDPipe` turns a malformed id into a clean `400` before any query runs. `can()` and the `orders:read-any` permission come from Module 18's permission map, so an admin (or, later, a support role) can read any order while everyone else sees only their own. `AuthUser` comes from `auth/auth-user.ts` (Modules 10 and 17), and `@CurrentUser()` from `auth/current-user.decorator.ts` (Module 13).",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "The rule: every record access checks who is asking",
      "blocks": [
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**One door per resource.** Every route that touches an order goes through `findOne(id, user)`, so the check can't be forgotten in a new route. Putting the owner in the query, `findOneBy({ id, userId: user.id })`, is an equally good way to write that door.",
            "**Lists**: Module 16's `findMine(userId)` filters by `userId` in SQL. Never load everything and filter in JavaScript.",
            "**Writes**: load through `findOne(id, user)` first, or put the owner in the `WHERE` of the `update()` and check `affected`; zero rows means `404`.",
            "**Nested routes**: for `/orders/:orderId/items/:itemId`, check that the order is the user's *and* that the item belongs to that order.",
            "**Random ids** such as UUIDs make guessing harder, but they are not access control. Ids leak through logs, emails and shared links."
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Mass assignment: whitelist is a security setting"
    },
    {
      "kind": "text",
      "text": "Module 7 switched on `whitelist: true` and `forbidNonWhitelisted: true` in the global `ValidationPipe`. That isn't just tidiness. Without it, a client can add fields your DTO never mentions, such as `role`, `isVerified` or `total`, and if your code copies the body into an entity, those fields get saved. This is called **mass assignment**. Two more habits finish the job: never `Object.assign(entity, body)` with an object you haven't validated, and never accept a value the server can work out itself, such as a price or an order total."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Secrets and dependencies"
    },
    {
      "kind": "text",
      "text": "A **secret** is anything that grants access: a database password, a JWT signing key, a payment provider's API key. These rules hold everywhere:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Secrets live in environment variables or a **secret manager** (AWS Secrets Manager, Google Secret Manager, Azure Key Vault, HashiCorp Vault), never in the repository. Commit a `.env.example` with names and fake values, and put `.env` in `.gitignore`.",
        "Validate them at startup (Module 19), so a missing key stops the boot instead of failing on the first request that needs it.",
        "Use a different secret in each environment, and rotate a secret the moment it leaks. Deleting the commit is not enough: the secret is still in the git history and in every clone.",
        "Turn on GitHub secret scanning with push protection, so a pushed key is blocked before it lands.",
        "Never log a secret. Module 28 shows how to remove the `Authorization` header from request logs."
      ]
    },
    {
      "kind": "text",
      "text": "**Dependencies** are the code you didn't write, and a Nest app pulls in hundreds of packages. In 2025, several popular npm packages were hijacked and briefly published with malware inside, and the 2025 OWASP list gave supply-chain failures a category of their own. The basics:"
    },
    {
      "kind": "example",
      "code": "npm ci                                   # install exactly what package-lock.json says\nnpm audit --omit=dev --audit-level=high  # fail on known high or critical issues in production deps\nnpm audit signatures                     # check packages were signed by the npm registry\nnpm outdated                             # what is behind, and by how much",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "example",
      "code": "version: 2\nupdates:\n  - package-ecosystem: npm\n    directory: /\n    schedule:\n      interval: weekly\n    groups:\n      nestjs:\n        patterns: [\"@nestjs/*\"]   # one pull request for all Nest packages, which move together\n  - package-ecosystem: github-actions\n    directory: /\n    schedule:\n      interval: weekly",
      "lang": "text",
      "label": ".github/dependabot.yml"
    },
    {
      "kind": "text",
      "text": "**Dependabot** is GitHub's bot that opens a pull request when a dependency has an update or a known vulnerability, and your CI (Module 29) then tests it like any other change. Renovate is a popular alternative. `npm ci` matters as much as the scanning: it installs the exact versions in the lockfile, so a hijacked new release can't slip into a build on its own.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The OWASP Top 10, mapped to Nest"
    },
    {
      "kind": "text",
      "text": "Here is the 2025 edition of the list, and where each risk lives in a Nest app. Many articles and interviewers still quote the 2021 edition, where Injection was A03 and SSRF (server-side request forgery: tricking your server into fetching a URL the attacker chose) had its own slot. In 2025, SSRF is part of A01."
    },
    {
      "kind": "table",
      "head": [
        "Risk",
        "In plain words",
        "In your Nest app"
      ],
      "rows": [
        [
          "**A01** Broken Access Control",
          "People reach data or actions that aren't theirs",
          "Guards for roles (Module 10); every query scoped by the current user; URLs from users checked against an allowlist before you fetch them (Module 21)"
        ],
        [
          "**A02** Security Misconfiguration",
          "Unsafe defaults left switched on",
          "`helmet`, a CORS allowlist, no stack traces in responses (Module 8), `synchronize: false` in production, Swagger UI not public (Module 28)"
        ],
        [
          "**A03** Software Supply Chain Failures",
          "Trusting code you didn't write or check",
          "`npm ci` with a lockfile, `npm audit` in CI, Dependabot or Renovate, third-party GitHub Actions pinned to a commit"
        ],
        [
          "**A04** Cryptographic Failures",
          "Weak or missing encryption",
          "HTTPS only (`helmet` sends the HSTS header), bcrypt or argon2 for passwords (Module 17), `crypto.randomBytes()` for tokens, never `Math.random()`"
        ],
        [
          "**A05** Injection",
          "Input changes what a query or command does",
          "Parameters, never SQL built from strings; allowlists for column names; no `exec()` with user input"
        ],
        [
          "**A06** Insecure Design",
          "The flow itself is unsafe",
          "Business limits in DTOs (`@Min(1)` on a quantity, `@Max(100)` on a page size), rate limits on sensitive flows, prices computed on the server"
        ],
        [
          "**A07** Authentication Failures",
          "Logins that can be guessed or stolen",
          "A throttled login, short-lived access tokens with refresh rotation (Module 18), the same \"wrong email or password\" error for both cases"
        ],
        [
          "**A08** Software or Data Integrity Failures",
          "Trusting data you didn't verify",
          "`whitelist: true` against mass assignment, verified webhook signatures (Module 21), no `Object.assign(entity, body)`"
        ],
        [
          "**A09** Security Logging and Alerting Failures",
          "Attacks happen and nobody notices",
          "Structured logs with request ids (Module 28) for logins, failed logins and `403`s, with alerts on spikes"
        ],
        [
          "**A10** Mishandling of Exceptional Conditions",
          "Errors leave the app unsafe, or leak details",
          "One global exception filter (Module 8), guards that deny when they hit an error, transactions that roll back (Module 16)"
        ]
      ]
    },
    {
      "kind": "quiz",
      "question": "Every route sits behind the global `JwtAuthGuard`, and the service for `GET /orders/:id` calls `repo.findOneBy({ id })`. A logged-in customer asks for another customer's order, using an id from a shared link. What happens?",
      "options": [
        "`401`: the guard rejects the request",
        "`403`: Nest checks ownership automatically when a guard is present",
        "`200`: they get the other customer's order",
        "`404`: TypeORM only returns rows the current user created"
      ],
      "answer": 2,
      "why": "**`200`, with someone else's order.** The guard checks *authentication*: is there a valid token? It knows nothing about *ownership*. Neither Nest nor TypeORM knows which rows belong to whom; only your code does. Send every read through one method that checks, like Module 18's `findOne(id, user)`, and return `404` when the order isn't the caller's."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 26.1",
      "title": "Hunt the IDOR",
      "blocks": [
        {
          "kind": "text",
          "text": "The orders API has three more routes: `GET /orders` (my orders), `PATCH /orders/:id/cancel` and `GET /orders/:id/invoice`. Assume each one was written like the bad example above. Fix all three with Module 16's `findMine()` and Module 18's `findOne(id, user)` so a customer can only touch their own orders. Then write an e2e test, with real tokens as in Module 25, proving that a second user gets a `404` for the first user's order, and that the owner still gets a `200`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// GET /orders: Module 16's findMine(userId) already filters by owner in SQL.\n\n// PATCH /orders/:id/cancel\nasync cancelForCustomer(id: string, user: AuthUser): Promise<void> {\n  const order = await this.findOne(id, user);           // 404 unless it's yours (Module 18)\n  if (order.status !== OrderStatus.Placed) {\n    throw new ConflictException('Only an order that is not paid yet can be cancelled');\n  }\n  await this.cancel(order.id);                          // Module 25's cancel(): stock back, status Cancelled\n}\n\n// GET /orders/:id/invoice\nasync invoice(id: string, user: AuthUser) {\n  const order = await this.findOne(id, user);           // the same door\n  return this.invoices.render(order);\n}\n\n// test/orders-access.e2e-spec.ts (setup and tokenFor() as in Module 25)\nit(\"hides one user's order from another\", async () => {\n  const ana = await saveUser(db);\n  const ben = await saveUser(db);\n  const lamp = await saveProduct(db);\n  const order = await db.getRepository(Order).save(\n    buildOrder({ userId: ana.id, items: [buildOrderItem({ productId: lamp.id })] }),\n  );\n\n  await request(app.getHttpServer())\n    .get(`/api/orders/${order.id}`)\n    .set('Authorization', `Bearer ${await tokenFor(ben)}`)\n    .expect(404);\n\n  await request(app.getHttpServer())\n    .get(`/api/orders/${order.id}`)\n    .set('Authorization', `Bearer ${await tokenFor(ana)}`)\n    .expect(200);                                       // and the owner still can\n});",
              "label": "orders/orders.service.ts — every route through the same door"
            },
            {
              "kind": "text",
              "text": "The pattern to remember: every route goes through the one method that checks, and \"not yours\" looks exactly like \"doesn't exist\". The second user is the test that matters. Almost every IDOR bug passes a test suite that only ever logs in as the owner.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 26.2",
      "title": "Prove the login limit",
      "blocks": [
        {
          "kind": "text",
          "text": "Write an e2e test that sends six logins with a wrong password in a row. The first five should get `401`. The sixth should get `429` with a `Retry-After` header."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "it('blocks the sixth login attempt in a minute', async () => {\n  const attempt = () =>\n    request(app.getHttpServer())\n      .post('/api/auth/login')\n      .send({ email: 'ann@example.com', password: 'wrong-password' });\n\n  for (let i = 0; i < 5; i++) {\n    await attempt().expect(401);\n  }\n\n  const blocked = await attempt().expect(429);\n  expect(blocked.headers['retry-after']).toBeDefined();\n});",
              "label": "test/auth-throttle.e2e-spec.ts"
            },
            {
              "kind": "text",
              "text": "Give this test its own file, so it gets its own app. The throttler's in-memory counters live as long as the app does, so in a shared file the earlier tests use up part of the budget, and the result depends on the order the tests run in. Every Supertest request also comes from the same local IP, which is exactly the \"one shared bucket\" problem from the proxy trap above.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q47",
      "title": "What is IDOR, and how do you prevent it in a NestJS API?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** IDOR, Insecure Direct Object Reference, is when an endpoint takes an object id from the client and acts on it without checking that the caller may access that object. It is the most common form of broken access control, which is A01 in the OWASP Top 10, and the OWASP API Security list calls it BOLA. The classic case is `GET /orders/:id` behind an auth guard: the guard proves who you are, but the service runs `findOneBy({ id })`, so any logged-in user who gets hold of another order's id can read it. With sequential ids, they just count upwards."
        },
        {
          "kind": "text",
          "text": "Prevention is structural. Every route reaches the record through one service method that checks it, such as `findOne(id, user)`, which returns 404 unless the record is yours or you hold a permission like `orders:read-any`; putting the owner in the query, `findOneBy({ id, userId: user.id })`, works too. Lists filter by owner in SQL; updates and deletes go through the same check or put the owner in the `WHERE`; nested resources check every level. I return `404` rather than `403`, so the API doesn't confirm that the record exists. Role guards decide *which actions* a role may take, but they don't replace per-record checks, and UUIDs make guessing harder without being access control. Finally, I prove it with an e2e test that logs in as a second user, because tests that only use the owner pass even when the bug is there."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q48",
      "title": "How would you secure a NestJS API before it goes to production?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I'd walk through the OWASP Top 10 and turn each item into something concrete. Access control first: an auth guard registered globally, so routes are private unless marked `@Public()`; role guards for actions; and every query scoped by the current user. Input next: a global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted`, limits on every number and string, parameterised queries everywhere, and allowlists for sort columns. Then transport and headers: HTTPS only, `helmet`, a CORS allowlist from config, and the trust proxy setting, so rate limiting sees real client IPs."
        },
        {
          "kind": "text",
          "text": "Then abuse protection: `@nestjs/throttler` globally, with a much stricter limit on login and password reset, backed by Redis once there are several replicas. Secrets come from the environment or a secret manager, validated at boot and never logged. Dependencies get `npm ci`, `npm audit` in CI and Dependabot. And failures: one global exception filter, so stack traces never leak, plus structured logs of logins, failures and `403`s with alerts on spikes, because an attack you can't see is an attack you can't stop."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 27: performance. A secure API that falls over under load is still down, and the cause is usually the event loop or the database, not Nest."
    }
  ]
};
