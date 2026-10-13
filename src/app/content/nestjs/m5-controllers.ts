import { Lesson } from '../../shared/content';

export const M5_CONTROLLERS: Lesson = {
  "slug": "m5-controllers",
  "title": "M5 Controllers and routing",
  "nav": "Controllers & routing",
  "num": "M5",
  "eyebrow": "Level 2 · Week 2 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A controller translates HTTP into a method call and back. That's all. The route comes from combining the class prefix with the method decorator; the arguments come from parameter decorators; the status code and response shape come from conventions you can override."
    },
    {
      "kind": "text",
      "text": "**The discipline that matters:** a controller contains no business logic. No calculations, no branching on domain rules, no database access. If you can't test a controller by mocking exactly one service, it's doing too much."
    },
    {
      "kind": "example",
      "code": "import {\n  Controller, Get, Post, Patch, Delete,\n  Param, Query, Body, Headers, HttpCode, ParseIntPipe,\n} from '@nestjs/common';\n\n@Controller('products')                       // route prefix → /products\nexport class ProductsController {\n  constructor(private readonly products: ProductsService) {}\n\n  // GET /products?page=2&limit=20&search=drill\n  @Get()\n  findAll(@Query() query: ListProductsDto) {\n    return this.products.findAll(query);\n  }\n\n  // GET /products/42\n  @Get(':id')\n  findOne(@Param('id', ParseIntPipe) id: number) {\n    return this.products.findOne(id);\n  }\n\n  // POST /products  → 201 by default\n  @Post()\n  create(@Body() dto: CreateProductDto) {\n    return this.products.create(dto);\n  }\n\n  // PATCH /products/42\n  @Patch(':id')\n  update(\n    @Param('id', ParseIntPipe) id: number,\n    @Body() dto: UpdateProductDto,\n  ) {\n    return this.products.update(id, dto);\n  }\n\n  // DELETE /products/42 → 204, no body\n  @Delete(':id')\n  @HttpCode(204)\n  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {\n    await this.products.remove(id);\n  }\n\n  // Reading a header, when you genuinely need one\n  @Get('export')\n  export(@Headers('accept') accept: string) {\n    return this.products.export(accept);\n  }\n}",
      "label": "products.controller.ts — the full surface"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The rules Nest applies for you"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Status codes.** `200` for everything except `@Post()`, which is `201`. Override with `@HttpCode(n)`.",
        "**Serialization.** Return an object or array and Nest serialises it to JSON. Return a primitive and it's sent as-is.",
        "**Promises and Observables.** Return either and Nest awaits or subscribes. You never touch `res`.",
        "**Route matching order.** Routes are matched in declaration order, and that has teeth — see the trap below."
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Declare `@Get(':id')` above `@Get('export')` and `GET /products/export` will match the *parameterised* route with `id = \"export\"`. With `ParseIntPipe` on it you get a confusing `400`; without one you get a database lookup for id `NaN`. **Static routes always go above parameterised ones.** This costs people an hour at least once."
        }
      ],
      "title": "Trap · route order, and the bug it causes"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Injecting `@Res() res: Response` and calling `res.json(...)` puts you in \"library-specific mode\": Nest hands over responsibility for the response, so interceptors, serialization and the `@HttpCode` decorator stop applying to it. If you only need to set a cookie or a header, use `@Res({ passthrough: true })` and still `return` your value."
        }
      ],
      "title": "Trap · `@Res()` silently disables the framework"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Bad vs good: the same endpoint"
    },
    {
      "kind": "example",
      "code": "@Controller('orders')\nexport class OrdersController {\n  @Post()\n  async create(@Body() body: any, @Req() req) {\n    if (!body.items || body.items.length === 0) {          // validation here\n      throw new HttpException('no items', 400);\n    }\n    if (!req.headers.authorization) {                       // auth here\n      throw new HttpException('unauthorized', 401);\n    }\n    const db = new DatabaseConnection();                    // dependency by hand\n    const total = body.items.reduce(                        // domain logic here\n      (sum, i) => sum + i.price * i.qty, 0,\n    );\n    const order = await db.insert('orders', { total });\n    await new MailService().send(body.email, 'Order placed');// side effect here\n    return { ok: true, order };                             // ad-hoc response shape\n  }\n}",
      "label": "orders.controller.ts — logic in the controller",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "@Controller('orders')\n@UseGuards(JwtAuthGuard)                                  // auth: declarative\nexport class OrdersController {\n  constructor(private readonly orders: OrdersService) {}  // dependency: injected\n\n  @Post()\n  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {\n    return this.orders.create(user.id, dto);              // validation: DTO + global pipe\n  }\n}\n\n@Injectable()\nexport class OrdersService {\n  constructor(\n    private readonly repo: OrdersRepository,\n    private readonly mail: MailService,\n  ) {}\n\n  async create(userId: string, dto: CreateOrderDto) {\n    const total = calculateTotal(dto.items);   // pure, unit-testable, reusable\n    const order = await this.repo.create({ userId, total });\n    await this.mail.sendOrderPlaced(order);    // Module 23: this belongs on a queue\n    return order;\n  }\n}",
      "label": "orders.controller.ts — each concern in its place",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "The good version is shorter *and* every piece is independently testable. That's not a coincidence — it's what DI is for. Note too that `OrdersService.create` knows nothing about HTTP, so a queue worker or a CLI command can call it unchanged.",
      "style": "small"
    },
    {
      "kind": "quiz",
      "question": "Which HTTP status does `@Post()` return by default in Nest?",
      "options": [
        "201 Created",
        "200 OK",
        "204 No Content",
        "It depends on whether you return a value"
      ],
      "answer": 0,
      "why": "**201.** Every other verb defaults to `200`. Override with `@HttpCode(200)` — worth doing for a POST that isn't a creation, such as `/auth/login` or `/orders/:id/recalculate`, since a client reading status codes shouldn't be told a resource was created when none was."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 5.1",
      "title": "Hello NestJS API, by hand",
      "blocks": [
        {
          "kind": "text",
          "text": "No `nest g resource` for this one — wire it yourself so you feel the mechanics."
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "A `GreetingModule` with a `GreetingController` and a `GreetingService`.",
            "`GET /greeting?name=Arpit` → `{ \"message\": \"Hello, Arpit\" }`; with no `name`, default to `\"world\"`.",
            "`GET /greeting/count` → the number of greetings served since startup.",
            "The counter lives in the **service**, not the controller. The controller does no string building and no counting.",
            "`GreetingModule` is imported by `AppModule`."
          ]
        },
        {
          "kind": "text",
          "text": "Then hit `/greeting` three times and `/greeting/count` once, and answer: *why does the count survive between requests?* Give the mechanism, not \"because it's a class property\"."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class GreetingService {\n  private count = 0;\n\n  greet(name = 'world') {\n    this.count++;\n    return `Hello, ${name}`;\n  }\n\n  getCount() {\n    return this.count;\n  }\n}",
              "label": "greeting.service.ts"
            },
            {
              "kind": "example",
              "code": "import { Controller, Get, Query } from '@nestjs/common';\nimport { GreetingService } from './greeting.service';\n\n@Controller('greeting')\nexport class GreetingController {\n  constructor(private readonly greeting: GreetingService) {}\n\n  @Get('count')                       // static route FIRST\n  count() {\n    return { count: this.greeting.getCount() };\n  }\n\n  @Get()\n  greet(@Query('name') name?: string) {\n    return { message: this.greeting.greet(name) };\n  }\n}",
              "label": "greeting.controller.ts"
            },
            {
              "kind": "example",
              "code": "import { Module } from '@nestjs/common';\nimport { GreetingController } from './greeting.controller';\nimport { GreetingService } from './greeting.service';\n\n@Module({\n  controllers: [GreetingController],\n  providers: [GreetingService],\n})\nexport class GreetingModule {}",
              "label": "greeting.module.ts"
            },
            {
              "kind": "text",
              "text": "**Why the count survives:** because providers are singletons in the DI container. `GreetingService` is instantiated once during `NestFactory.create()` and cached in `GreetingModule`'s injector; the same instance is handed to the controller for every request, so the field persists for the lifetime of the process. It is *not* \"global state\" — it's one cached instance with a defined scope. Two consequences worth knowing now: this state is lost on restart, and it is **not shared across instances**, so the moment you run two pods behind a load balancer the counts diverge. That's why real counters live in Redis (Module 22)."
            },
            {
              "kind": "text",
              "text": "Note the ordering: `@Get('count')` is declared before `@Get()`. Here it happens not to matter, but put a `@Get(':id')` in the same controller and it would.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 5.2",
      "title": "Debug this — three bugs",
      "blocks": [
        {
          "kind": "text",
          "text": "Three distinct bugs. For each: the symptom, whether it fails at boot or at runtime, and the fix."
        },
        {
          "kind": "example",
          "code": "// greeting.service.ts\nexport class GreetingService {\n  private count = 0;\n  greet(name: string) { this.count++; return `Hello, ${name}`; }\n  getCount() { return this.count; }\n}\n\n// greeting.controller.ts\n@Controller('greeting')\nexport class GreetingController {\n  private service = new GreetingService();\n\n  @Get(':name')\n  greet(@Param('name') name: string) {\n    return { message: this.service.greet(name) };\n  }\n\n  @Get('count')\n  count() { return { count: this.service.getCount() }; }\n}\n\n// greeting.module.ts\n@Module({\n  controllers: [GreetingController],\n  providers: [],\n})\nexport class GreetingModule {}",
          "label": "broken-greeting.ts",
          "verdict": "bad"
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
                "**Missing `@Injectable()` and an empty `providers` array.** Right now it doesn't crash — because of bug 2 — but the service is outside the container entirely. Symptom once you fix bug 2: `Nest can't resolve dependencies of the GreetingController (?)` at *boot*. Fix: add `@Injectable()` and `providers: [GreetingService]`.",
                "**`new GreetingService()` in the controller.** Compiles and runs, and throws away DI: no injected dependencies, no config, no lifecycle hooks, and untestable — you can't substitute a fake. Worse, a new controller instance would mean a new service. Fix: inject it via the constructor.",
                "**Route order.** `@Get(':name')` is declared above `@Get('count')`, so `GET /greeting/count` matches the parameterised route at *runtime* and cheerfully returns `{ \"message\": \"Hello, count\" }`. No error, just wrong — the nastiest kind. Fix: move the static route above the parameterised one."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q7",
      "title": "What belongs in a controller, and what doesn't?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A controller belongs to the transport layer. Its job is to accept an HTTP request, extract and validate its inputs through parameter decorators and pipes, call exactly one service method, and return a value that Nest serialises. Status codes and route shape are its business."
        },
        {
          "kind": "text",
          "text": "What doesn't belong: domain calculations, branching on business rules, database or ORM access, orchestration of multiple services, and side effects like sending mail. Those go in services, because the moment a second entry point appears — a queue consumer, a scheduled job, a CLI command, a gRPC handler — anything living in the controller has to be duplicated or refactored under pressure. The practical test: if a controller method needs more than one mock to unit test, it's doing too much."
        }
      ]
    }
  ]
};
