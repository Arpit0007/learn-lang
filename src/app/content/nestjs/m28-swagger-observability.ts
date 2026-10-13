import { Lesson } from '../../shared/content';

export const M28_SWAGGER_OBSERVABILITY: Lesson = {
  "slug": "m28-swagger-observability",
  "title": "M28 API docs, logging and health checks",
  "nav": "Docs & observability",
  "num": "M28",
  "eyebrow": "Level 7 · Week 16 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Once an API is in production, two groups need to see into it. Other developers need to know how to *call* it: that's **documentation**. You need to know what it's *doing*: that's **observability**, the ability to answer questions about a running system from the data it gives off, mainly logs, metrics and traces."
    },
    {
      "kind": "text",
      "text": "This module covers both: OpenAPI docs generated from your code with `@nestjs/swagger`, structured JSON logs with a request id on every line, health checks with `@nestjs/terminus`, and a short look at metrics and tracing."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "API docs tell other developers how to use your API. Logs tell you what happened, and health checks tell your platform whether the app is OK. Without them, production is a black box: something is wrong, and you can't see what."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "OpenAPI docs with @nestjs/swagger"
    },
    {
      "kind": "text",
      "text": "**OpenAPI** (once called Swagger) is a standard JSON or YAML format that describes an HTTP API: its routes, parameters, request bodies, responses and auth. `@nestjs/swagger` builds that document by reading your controllers and DTOs, and serves **Swagger UI**, a web page where people can read the docs and try requests."
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/swagger@11 @nestjs/terminus@11 nestjs-pino pino-http @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http\nnpm i -D pino-pretty",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "**Version note.** That installs everything this module uses: Swagger, Terminus health checks, pino logging (with `pino-pretty` for development only) and OpenTelemetry. Keep the `@11` pins. Without one, npm fetches the Nest 12 version of `@nestjs/swagger` and stops with an `ERESOLVE` error in a Nest 11 project. For `@nestjs/terminus` it's worse: npm installs Terminus 12, which is ESM-only, without any warning.",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\n\n// inside bootstrap(), after NestFactory.create()\nconst config = new DocumentBuilder()\n  .setTitle('Shop API')\n  .setDescription('Products, orders and users')\n  .setVersion('1.0')\n  .addBearerAuth()                      // adds an \"Authorize\" button for JWTs\n  .build();\n\n// setup() accepts the document, or a function that builds it\nconst documentFactory = () => SwaggerModule.createDocument(app, config);\n\nif (process.env.NODE_ENV !== 'production') {\n  SwaggerModule.setup('api/docs', app, documentFactory);   // Module 3's path\n  // the UI at /api/docs, and the raw document at /api/docs-json and /api/docs-yaml\n}",
      "label": "main.ts (excerpt)"
    },
    {
      "kind": "text",
      "text": "Public docs in production hand an attacker a map of every route. Either switch the UI off there, as above, or put it behind authentication. The docs path ignores `setGlobalPrefix()` unless you pass `useGlobalPrefix: true` in the setup options, which is why Module 3 writes the prefix into the path itself: `api/docs`.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "Then describe what Nest can't work out alone: tags that group routes, which routes need a token, and what each route returns, including its errors."
    },
    {
      "kind": "example",
      "code": "import {\n  ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiTags,\n} from '@nestjs/swagger';\n\n// dto/product.dto.ts: the response shape, documented field by field\nexport class ProductDto {\n  @ApiProperty({ example: 42 })\n  id: number;\n\n  @ApiProperty({ example: 'Desk lamp', maxLength: 120 })\n  name: string;\n\n  @ApiProperty({ example: 29.99, description: 'Price in euros, two decimal places' })\n  price: number;\n}\n\n// products.controller.ts\n@ApiTags('products')\n@Controller('products')\nexport class ProductsController {\n  constructor(private readonly products: ProductsService) {}\n\n  @Public()                               // Module 10: anyone may read\n  @Get(':id')\n  @ApiOkResponse({ type: ProductDto })\n  @ApiNotFoundResponse({ description: 'No product with this id' })\n  findOne(@Param('id', ParseIntPipe) id: number) {\n    return this.products.findOne(id);\n  }\n\n  @Post()                                 // any logged-in user (Modules 13 and 14)\n  @ApiBearerAuth()                        // the docs show a lock: this route needs a token\n  @ApiCreatedResponse({ type: ProductDto })\n  create(@CurrentUser('id') userId: string, @Body() dto: CreateProductDto) {\n    return this.products.create(dto, userId);\n  }\n\n  @Auth('admin')                          // Module 13: @Roles('admin') plus the lock and 401/403 docs\n  @Delete(':id')\n  @HttpCode(204)\n  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {\n    await this.products.remove(id);\n  }\n}",
      "label": "products/dto/product.dto.ts + products/products.controller.ts"
    },
    {
      "kind": "text",
      "text": "Writing `@ApiProperty()` on every DTO field gets old fast. The **Swagger CLI plugin** does it for you at compile time. It reads your TypeScript types, default values and class-validator decorators (so `@MaxLength(120)` becomes `maxLength: 120` in the docs) and adds the metadata itself. Switch it on in `nest-cli.json`:"
    },
    {
      "kind": "example",
      "code": "{\n  \"$schema\": \"https://json.schemastore.org/nest-cli\",\n  \"collection\": \"@nestjs/schematics\",\n  \"sourceRoot\": \"src\",\n  \"compilerOptions\": {\n    \"deleteOutDir\": true,\n    \"plugins\": [\n      {\n        \"name\": \"@nestjs/swagger\",\n        \"options\": {\n          \"classValidatorShim\": true,\n          \"introspectComments\": true\n        }\n      }\n    ]\n  }\n}",
      "lang": "text",
      "label": "nest-cli.json"
    },
    {
      "kind": "text",
      "text": "The plugin only reads files ending in `.dto.ts` or `.entity.ts` for models, and `.controller.ts` for routes. With `introspectComments`, a doc comment above a property becomes its description. The plugin runs inside `nest build` and `nest start`; Jest and the SWC builder need extra setup, which the plugin docs describe. And import `PartialType` and its friends from `@nestjs/swagger`, not `@nestjs/mapped-types`, so they carry the docs metadata too (Module 7 already does).",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "Your OpenAPI document can write your Angular client for you. Tools such as `ng-openapi-gen`, or OpenAPI Generator's `typescript-angular` generator, read `/api/docs-json` and generate typed services and models. Rename a DTO field in Nest, regenerate, and the Angular build fails everywhere the old name was used, instead of a user finding the bug in production."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Structured logs with a request id"
    },
    {
      "kind": "text",
      "text": "A **structured log** is one JSON object per line instead of a sentence. Machines can search and filter JSON, for example every `error` on the orders route in the last hour, where plain text needs fragile text searches. The other half is a **request id** (Module 9 called it a correlation id): one id per request, on every log line that request produces, so you can pull up the whole story of one request."
    },
    {
      "kind": "text",
      "text": "Nest 11's built-in `ConsoleLogger` prints JSON with a single option:"
    },
    {
      "kind": "example",
      "code": "import { ConsoleLogger } from '@nestjs/common';\n\nconst app = await NestFactory.create(AppModule, {\n  logger: new ConsoleLogger({ json: true }),   // colours switch off automatically\n});",
      "label": "main.ts (excerpt)",
      "output": "{\"level\":\"log\",\"pid\":19096,\"timestamp\":1607370779834,\"message\":\"Starting Nest application...\",\"context\":\"NestFactory\"}"
    },
    {
      "kind": "text",
      "text": "That's enough for a small service. To get the request id on every line, use **`nestjs-pino`**. It wraps **pino**, a very fast JSON logger, and its HTTP middleware logs each request and response with its duration. Anything you log *during* a request carries that request's id automatically, without passing the id around."
    },
    {
      "kind": "example",
      "code": "import { randomUUID } from 'node:crypto';\nimport { LoggerModule } from 'nestjs-pino';\n\n@Module({\n  imports: [\n    LoggerModule.forRoot({\n      pinoHttp: {\n        level: process.env.LOG_LEVEL ?? 'info',\n        // Reuse the caller's id if it sent one (Module 9), otherwise make one, and echo it back.\n        genReqId: (req, res) => {\n          const incoming = req.headers['x-correlation-id'];\n          const id = typeof incoming === 'string' ? incoming : randomUUID();\n          res.setHeader('x-correlation-id', id);\n          return id;\n        },\n        redact: ['req.headers.authorization', 'req.headers.cookie'],   // never log credentials\n        transport: process.env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },\n      },\n    }),\n  ],\n})\nexport class AppModule {}\n\n// main.ts: this Logger is the one from 'nestjs-pino'\nconst app = await NestFactory.create(AppModule, { bufferLogs: true });\napp.useLogger(app.get(Logger));\n\n// orders.service.ts: services keep using Nest's own Logger, from '@nestjs/common'.\n// nestjs-pino receives everything it logs.\n@Injectable()\nexport class OrdersService {\n  private readonly logger = new Logger(OrdersService.name);\n\n  async markPaid(orderId: string): Promise<void> {\n    // ...\n    this.logger.log({ orderId }, 'order paid');   // fields first, then the message\n  }\n}",
      "label": "app.module.ts + main.ts"
    },
    {
      "kind": "text",
      "text": "`bufferLogs: true` holds the startup logs until pino is attached, so they come out as JSON too. In development, `pino-pretty` prints readable coloured lines; in production you want raw JSON, which your log platform (Loki, Elasticsearch, CloudWatch and others) parses. **Version note:** `nestjs-pino` v5 needs Nest 11.0.8 or newer (12.0.2 or newer on Nest 12) and Node 22.12 or newer.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · logging secrets",
      "blocks": [
        {
          "kind": "text",
          "text": "Logging the whole request is the fastest way to copy passwords, tokens and card numbers into a log system that many people can read and that keeps data for months. Redact the `Authorization` and `Cookie` headers, never log request bodies wholesale, and log ids instead of personal data: `userId`, not the email address. If a token does reach the logs, treat it as leaked and rotate it."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Health checks with @nestjs/terminus"
    },
    {
      "kind": "text",
      "text": "A **health check** is an endpoint that your platform calls every few seconds to ask \"are you OK?\". Platforms such as Kubernetes ask two different questions, called **probes**, and mixing them up causes outages:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Liveness**: is this process stuck or broken? If the check fails, the platform *restarts* the container. Keep it simple: if the app can answer at all, it's alive.",
        "**Readiness**: can this instance serve traffic right now? If the check fails, the platform stops *sending traffic* to it but leaves it running. Check the things a request needs, such as the database and Redis."
      ]
    },
    {
      "kind": "example",
      "code": "import { Controller, Get } from '@nestjs/common';\nimport { SkipThrottle } from '@nestjs/throttler';\nimport {\n  HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator,\n} from '@nestjs/terminus';\nimport { Public } from '../auth/auth.decorators';\nimport { RawResponse } from '../common/interceptors/envelope.interceptor';\nimport { RedisHealthIndicator } from './redis.health';\n\n@Public()            // the platform has no token: skip the global auth guard (Module 10)\n@SkipThrottle()      // the platform calls this constantly (Module 26)\n@RawResponse()       // Module 13: send Terminus' report as it is, not wrapped in { data }\n@Controller('health')\nexport class HealthController {\n  constructor(\n    private readonly health: HealthCheckService,\n    private readonly db: TypeOrmHealthIndicator,\n    private readonly memory: MemoryHealthIndicator,\n    private readonly redis: RedisHealthIndicator,\n  ) {}\n\n  @Get('live')\n  @HealthCheck()\n  live() {\n    // No dependencies here. Only the heap: a process that leaks memory should be restarted.\n    return this.health.check([\n      () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024),   // 1 GB\n    ]);\n  }\n\n  @Get('ready')\n  @HealthCheck()\n  ready() {\n    return this.health.check([\n      () => this.db.pingCheck('database', { timeout: 1500 }),\n      () => this.redis.isHealthy('redis'),\n    ]);\n  }\n}\n\n// health.module.ts: imports [TerminusModule], controllers [HealthController],\n// providers [RedisHealthIndicator]",
      "label": "health/health.controller.ts",
      "output": "GET /api/health/ready  →  200\n{\n  \"status\": \"ok\",\n  \"info\": { \"database\": { \"status\": \"up\" }, \"redis\": { \"status\": \"up\" } },\n  \"error\": {},\n  \"details\": { \"database\": { \"status\": \"up\" }, \"redis\": { \"status\": \"up\" } }\n}\n\nWith Postgres down  →  503, and Module 8's filter writes the body:\n{\n  \"statusCode\": 503,\n  \"code\": \"SERVICE_UNAVAILABLE\",\n  \"message\": \"Internal server error\",\n  \"path\": \"/api/health/ready\",\n  \"timestamp\": \"2026-10-06T14:02:11.000Z\",\n  \"correlationId\": \"6f1c2b9e-0d4a-4c37-9e21-8a5b7d3f4c10\"\n}"
    },
    {
      "kind": "text",
      "text": "Two pieces from earlier modules shape these bodies. A *passing* check is the handler's return value, so Module 11's envelope would wrap it in `{ data }`; `@RawResponse()` from Module 13 switches that off, and the platform gets Terminus' own shape. A *failing* check works differently: Terminus throws a `ServiceUnavailableException` that carries its report, and `@RawResponse()` only affects successful responses. Module 8's global filter catches the exception, sees a status of 500 or more, logs it, and replaces the body with its generic envelope. So the response no longer says *which* dependency failed. The platform doesn't mind, because probes only read the status code. When you want the details, add one line to the filter that logs `exception.getResponse()` for a `ServiceUnavailableException`."
    },
    {
      "kind": "text",
      "text": "Terminus ships indicators for TypeORM, memory, disk, HTTP and microservices. For anything else, write your own with `HealthIndicatorService`. This one gives the check a small Redis connection of its own, with `ioredis` from Module 23. The app's other Redis connections are built to wait and retry while Redis is down, which is right for jobs and caching, and wrong for a check that must answer within a second:"
    },
    {
      "kind": "example",
      "code": "import { Injectable, OnModuleDestroy } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport { HealthIndicatorService } from '@nestjs/terminus';\nimport Redis from 'ioredis';\n\n@Injectable()\nexport class RedisHealthIndicator implements OnModuleDestroy {\n  private readonly redis: Redis;\n\n  constructor(\n    private readonly healthIndicatorService: HealthIndicatorService,\n    config: ConfigService,\n  ) {\n    this.redis = new Redis(config.getOrThrow<string>('REDIS_URL'), {\n      enableOfflineQueue: false,   // Redis down? fail at once instead of queueing the command\n      maxRetriesPerRequest: 1,\n    });\n  }\n\n  async isHealthy(key: string) {\n    const indicator = this.healthIndicatorService.check(key);\n    try {\n      await this.redis.ping();\n      return indicator.up();\n    } catch (err) {\n      return indicator.down({ message: (err as Error).message });\n    }\n  }\n\n  onModuleDestroy() {\n    this.redis.disconnect();       // close this connection on shutdown (Module 29)\n  }\n}",
      "label": "health/redis.health.ts"
    },
    {
      "kind": "text",
      "text": "**Version note.** This is Terminus 11, the version for Nest 11, where `HealthIndicatorService` replaced the old `HealthIndicator` base class (still there, but deprecated). Terminus 12, released for Nest 12, is ESM-only, removes that old base class completely, and adds `.attempt()` and `.withTimeout()` helpers to the same API.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the database in the liveness probe",
      "blocks": [
        {
          "kind": "text",
          "text": "If liveness checks Postgres, a 30-second database blip makes every replica fail liveness at the same moment, and the platform restarts all of them. Now you have a database blip *and* a full cold restart, with every instance reconnecting at once. Liveness asks \"is this process broken?\", and a restart only fixes that. Dependencies belong in readiness, which takes an instance out of rotation without killing it."
        }
      ]
    },
    {
      "kind": "text",
      "text": "On shutdown, Terminus can also keep the app open for a moment with `TerminusModule.forRoot({ gracefulShutdownTimeoutMs: 1000 })`, which gives the load balancer time to notice before connections close. Module 29 puts shutdown together.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Metrics and tracing, briefly"
    },
    {
      "kind": "text",
      "text": "Logs describe single events. Two more signals complete the picture:"
    },
    {
      "kind": "table",
      "head": [
        "Signal",
        "Answers",
        "Typical tools"
      ],
      "rows": [
        [
          "**Logs**",
          "What happened in this request?",
          "pino, shipped to Loki, Elasticsearch or CloudWatch"
        ],
        [
          "**Metrics**",
          "How many, how fast, how often, across all requests?",
          "`prom-client` serving `/metrics` to **Prometheus**, with Grafana for graphs"
        ],
        [
          "**Traces**",
          "Where did the time go inside one request, across services?",
          "**OpenTelemetry**, sending to Jaeger, Grafana Tempo or a hosted vendor"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "**Metrics** are numbers sampled over time: requests per second per route, the error rate, p99 latency, event loop delay, open database connections. Prometheus fetches a `/metrics` endpoint every few seconds; the `prom-client` package, or a wrapper such as `@willsoto/nestjs-prometheus`, produces it. **Tracing** records each request as a tree of timed steps, called **spans**: your handler, every SQL query, every outgoing HTTP call, even across services. **OpenTelemetry** is the vendor-neutral standard for it, and its Node auto-instrumentation patches Express, `pg`, Redis clients and `http` for you:"
    },
    {
      "kind": "example",
      "code": "// Must load before anything else, so it can patch the libraries as they load:\n//   node --require ./dist/instrumentation.js dist/main.js\nimport { NodeSDK } from '@opentelemetry/sdk-node';\nimport { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';\nimport { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';\n\nconst sdk = new NodeSDK({\n  traceExporter: new OTLPTraceExporter(),        // sends to OTEL_EXPORTER_OTLP_ENDPOINT\n  instrumentations: [getNodeAutoInstrumentations()],\n});\nsdk.start();\n\n// Name the service with an environment variable: OTEL_SERVICE_NAME=shop-api",
      "label": "instrumentation.ts"
    },
    {
      "kind": "text",
      "text": "`--require` is for CommonJS builds, the Nest 11 default; an ESM build loads the file with `--import` instead. Nest 12 also introduces a first-party observability package, `@nestjs/observe`, that hooks into the request lifecycle.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · one metric label per id",
      "blocks": [
        {
          "kind": "text",
          "text": "Label metrics by the route *pattern*, `/api/orders/:id`, never by the real URL, `/api/orders/7b4d8a52-1c3e-4f6a-9b2d-5e8f0a1c3d47`. Every distinct label value becomes a separate time series in Prometheus, so one label per order id means millions of series, and your monitoring falls over before your API does. The same goes for user ids, emails and anything else without a small, fixed set of values."
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "Postgres restarts and can't be reached for 30 seconds. Your app has `/health/live` (memory only) and `/health/ready` (database and Redis). What should happen?",
      "options": [
        "Both fail, and the platform restarts every replica",
        "Readiness fails, so the instances stop getting traffic; liveness passes, so nothing restarts",
        "Liveness fails, so the platform restarts the instances until Postgres is back",
        "Nothing: health checks only run when the app starts"
      ],
      "answer": 1,
      "why": "**Readiness fails and liveness passes.** The instances are healthy; they just can't do useful work right now. So the right move is to stop routing traffic to them and wait. Restarting them fixes nothing and adds a storm of reconnections the moment Postgres returns. Platforms keep calling both probes for the container's whole life, not only at startup."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 28.1",
      "title": "Document the Orders API",
      "blocks": [
        {
          "kind": "text",
          "text": "Switch on the Swagger CLI plugin, add `@ApiTags`, `@ApiBearerAuth` and response decorators to `OrdersController`, and open `/api/docs`. Authorise with a real JWT in Swagger UI and place an order from the browser. Then download `/api/docs-json` and generate an Angular client from it."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "# the raw OpenAPI document\ncurl http://localhost:3000/api/docs-json -o openapi.json\n\n# typed Angular services and models, generated from it\nnpx ng-openapi-gen --input openapi.json --output src/app/api",
              "lang": "text",
              "label": "terminal"
            },
            {
              "kind": "text",
              "text": "Check three things in the UI. Every DTO field appears without a single `@ApiProperty()` of yours, because the plugin added them. The **Authorize** button appears, because of `addBearerAuth()`. And the `404` response is listed under `GET /orders/:id`. If a field is missing, check the file name first: the plugin only reads `.dto.ts` and `.entity.ts` files."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 28.2",
      "title": "Break the database on purpose",
      "blocks": [
        {
          "kind": "text",
          "text": "Add `/health/live` and `/health/ready` as shown above. With the app running, stop your Postgres container (`docker stop` followed by its name) and call both endpoints. Start it again with `docker start` and call them again. Write down the status code and body each time."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "With Postgres stopped, `/api/health/live` still answers `200`, and `/api/health/ready` answers `503`. The body is Module 8's envelope, with `\"code\": \"SERVICE_UNAVAILABLE\"` and the generic message, not Terminus' report; which dependency failed shows up in your logs if you added the filter line above. When Postgres is back, readiness returns to `200` on its own: TypeORM's pool reconnects, and nothing restarts. That's exactly what you want a platform to see during a database blip."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q51",
      "title": "How would you make a Nest service observable in production?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Three signals and one id. Logs: structured JSON, one object per line, through `nestjs-pino` or Nest 11's JSON `ConsoleLogger`, shipped to a central store, at `info` level in production, with secrets redacted and personal data kept out. Every line carries a request id, taken from an incoming `x-correlation-id` header or generated, echoed back to the client and passed on to downstream calls, so one id finds the whole story. Metrics: request rate, error rate and latency percentiles per route pattern, plus event loop delay, heap and database pool usage, scraped by Prometheus, with alerts on the ones that hurt users. Traces: OpenTelemetry auto-instrumentation, so one slow request breaks down into handler time, each SQL query and each outgoing call."
        },
        {
          "kind": "text",
          "text": "Around that I'd add liveness and readiness endpoints with Terminus, so the platform can route and restart correctly, and API docs from `@nestjs/swagger`, so other teams don't have to read the code. The real test is this: when a user reports \"checkout failed at 14:02\", can I find the request, see where it failed and see why, within minutes?"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q52",
      "title": "What's the difference between a liveness and a readiness probe, and what would you check in each?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** They ask different questions and lead to different actions. Liveness asks whether the process is broken beyond repair, through a deadlock or a memory leak, for example, and a failure makes the platform restart the container. Readiness asks whether this instance can serve traffic right now, and a failure only takes it out of the load balancer until it recovers."
        },
        {
          "kind": "text",
          "text": "So liveness should be nearly trivial: if the app can answer an HTTP request, and perhaps its heap is under a limit, it's alive. Readiness checks what requests need: a database ping with a short timeout, Redis, maybe a critical downstream API. The classic mistake is putting the database in liveness: a 30-second database blip then restarts every replica at once and becomes a full outage with a reconnect storm. Two more details: readiness should fail during startup until connections are ready, and during shutdown so traffic drains before the process exits; and health endpoints must skip authentication and rate limiting."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 29: Docker, CI/CD and deployment. That means packing all of this into an image, testing it on every push, and shipping it without dropping a request."
    }
  ]
};
