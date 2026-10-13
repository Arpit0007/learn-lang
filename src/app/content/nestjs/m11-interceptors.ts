import { Lesson } from '../../shared/content';

export const M11_INTERCEPTORS: Lesson = {
  "slug": "m11-interceptors",
  "title": "M11 Interceptors",
  "nav": "Interceptors",
  "num": "M11",
  "eyebrow": "Level 4 · Week 6 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "An **interceptor** wraps your handler. It can run code *before* the handler, and it receives the handler's result *after*, so it can change that result. Guards say yes or no. Pipes fix one input. Interceptors are the only block that touches a successful response on its way out."
    },
    {
      "kind": "text",
      "text": "Nest hands an interceptor the result as an RxJS **Observable**: a stream that will deliver the handler's value, or its error, a moment later. You know RxJS from Angular. Here you use four of its **operators**, the functions you put inside `.pipe()`. `map` changes the value. `tap` looks at it without changing it. `timeout` gives up after a while. `catchError` deals with an error."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "An interceptor is like gift wrap around your handler. It sees the request going in and the answer coming out. It can measure how long the trip took, put the answer in a nicer box, or swap it for a better one."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The shape: `intercept()`, `next.handle()` and a stream"
    },
    {
      "kind": "text",
      "text": "An interceptor implements `NestInterceptor`, which has one method: `intercept(context, next)`. The `context` is the same `ExecutionContext` that guards get. `next` is a `CallHandler`, and `next.handle()` runs *the rest of the chain*: any inner interceptors, the pipes and your handler. It returns the result as an Observable."
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Code **before** `next.handle()` runs on the way in.",
        "Operators **inside** `.pipe()` run on the way out, when the result arrives.",
        "If you never call `next.handle()`, the handler never runs. That is how a cache can answer from memory (Exercise 11.1)."
      ]
    },
    {
      "kind": "text",
      "text": "A logging interceptor uses all three parts:"
    },
    {
      "kind": "example",
      "code": "import {\n  CallHandler,\n  ExecutionContext,\n  HttpException,\n  Injectable,\n  Logger,\n  NestInterceptor,\n} from '@nestjs/common';\nimport type { Request, Response } from 'express';\nimport { Observable, tap } from 'rxjs';\n\n@Injectable()\nexport class LoggingInterceptor implements NestInterceptor {\n  private readonly logger = new Logger('HTTP');\n\n  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {\n    // BEFORE: this part runs on the way in (after the guards).\n    const http = context.switchToHttp();\n    const req = http.getRequest<Request>();\n    const started = Date.now();\n\n    return next.handle().pipe(\n      // AFTER: this part runs when the handler's result (or error) comes back.\n      tap({\n        next: () => this.log(req, http.getResponse<Response>().statusCode, started),\n        error: (err: unknown) =>\n          this.log(req, err instanceof HttpException ? err.getStatus() : 500, started),\n      }),\n    );\n  }\n\n  private log(req: Request, status: number, started: number) {\n    const id = (req.headers['x-correlation-id'] as string | undefined) ?? 'n/a';\n    this.logger.log(`${req.method} ${req.originalUrl} ${status} ${Date.now() - started}ms [${id}]`);\n  }\n}",
      "label": "common/interceptors/logging.interceptor.ts"
    },
    {
      "kind": "text",
      "text": "`tap({ next, error })` takes two callbacks, so failures are logged too. A plain `tap(() => ...)` fires only on success. That is the broken-metrics lesson from M9."
    },
    {
      "kind": "text",
      "text": "One blind spot: this interceptor never logs a 401 or a 403. Guards run *before* interceptors, so a request that a guard rejects never reaches this code. If you need one log line for every request, rejected ones included, use middleware and log on the response's `finish` event. Also note the imports: since RxJS 7.2, operators like `tap` and `map` come straight from `'rxjs'`. Older code and some docs still import them from `'rxjs/operators'`, and both work.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "One envelope for every success"
    },
    {
      "kind": "text",
      "text": "In M8 you gave every *error* one shape. Many teams also wrap every *success* the same way, so a client always finds the payload in the same place: `{ \"data\": ... }`. An interceptor can do this once, for every route. Here is the tempting version, which tries to wrap errors too:"
    },
    {
      "kind": "example",
      "code": "import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';\nimport { Observable, catchError, map, of } from 'rxjs';\n\n@Injectable()\nexport class EnvelopeInterceptor implements NestInterceptor {\n  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {\n    return next.handle().pipe(\n      map((data: unknown) => ({ success: true, data })),\n      // \"Let's wrap errors too!\" This line swallows every error.\n      catchError((err: Error) => of({ success: false, error: err.message })),\n    );\n  }\n}",
      "label": "common/interceptors/envelope.interceptor.ts — wraps errors too",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "`catchError` catches the error and returns a normal value with `of()`. To Nest, that means *success*. A 404 becomes a 200, a crash becomes a 200, and your M8 filter never sees either of them. The good version only maps successes:"
    },
    {
      "kind": "example",
      "code": "import {\n  CallHandler,\n  ExecutionContext,\n  Injectable,\n  NestInterceptor,\n  StreamableFile,\n} from '@nestjs/common';\nimport { Observable, map } from 'rxjs';\n\nexport interface Envelope<T> {\n  data: T;\n}\n\n@Injectable()\nexport class EnvelopeInterceptor<T> implements NestInterceptor<T, Envelope<T> | StreamableFile> {\n  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Envelope<T> | StreamableFile> {\n    return next.handle().pipe(\n      // Files go out untouched. Every other success gets the same wrapper.\n      map((data) => (data instanceof StreamableFile ? data : { data })),\n    );\n    // No catchError here. Errors flow on to the M8 exception filter.\n  }\n}",
      "label": "common/interceptors/envelope.interceptor.ts",
      "verdict": "good"
    },
    {
      "kind": "table",
      "head": [
        "Outcome",
        "Status",
        "Body",
        "Made by"
      ],
      "rows": [
        [
          "Success",
          "`2xx`",
          "`{ \"data\": ... }`",
          "`EnvelopeInterceptor`"
        ],
        [
          "Error, thrown anywhere",
          "`4xx` or `5xx`",
          "`{ statusCode, code, message, path, timestamp, correlationId }`",
          "M8's `AllExceptionsFilter`"
        ],
        [
          "File download",
          "`200`",
          "The file itself",
          "A `StreamableFile`, passed through untouched"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "So a client follows one simple rule: check the status first. On a 2xx, read `data`. Otherwise, read `code`.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`catchError((err) => of(...))` turns every error into a success. With the bad envelope above, `GET /products/999` answers **200** with `\"success\": false`. A crash also answers 200, with the raw error message: exactly the leak M8's filter exists to stop. The 500 never reaches your error log either. Errors thrown by guards still arrive in the M8 shape, because guards run before interceptors, so clients now meet two different error formats. Inside an interceptor, `catchError` may only **throw again**: `throwError(() => betterError)`."
        }
      ],
      "title": "Trap · `catchError` that returns a value"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Give up after five seconds: `timeout`"
    },
    {
      "kind": "text",
      "text": "A request that hangs ties up the client and a server connection. The `timeout` operator raises a `TimeoutError` when no value arrives in time. Here `catchError` is used correctly: it swaps the error for a better one, and throws that."
    },
    {
      "kind": "example",
      "code": "import {\n  CallHandler,\n  ExecutionContext,\n  GatewayTimeoutException,\n  Injectable,\n  NestInterceptor,\n} from '@nestjs/common';\nimport { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs';\n\n@Injectable()\nexport class TimeoutInterceptor implements NestInterceptor {\n  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {\n    return next.handle().pipe(\n      timeout(5_000), // no answer within 5 seconds → TimeoutError\n      catchError((err: unknown) =>\n        // Swap the error for a better one, then THROW it again.\n        throwError(() =>\n          err instanceof TimeoutError\n            ? new GatewayTimeoutException({ code: 'TIMEOUT', message: 'The server took too long' })\n            : err,\n        ),\n      ),\n    );\n  }\n}",
      "label": "common/interceptors/timeout.interceptor.ts"
    },
    {
      "kind": "text",
      "text": "Why `GatewayTimeoutException` (504)? The Nest docs use `RequestTimeoutException` (408), but 408 means the *client* was too slow to send its request. When your server is the slow one, 504 (or 503) is the honest answer. Your M8 filter treats it like any 5xx: the client sees code `TIMEOUT` and the generic message, and the real message goes to your logs."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`timeout` stops *waiting*. It doesn't stop the handler. The client gets its 504 after five seconds, but the database query or HTTP call keeps running. If the request was `POST /orders`, the order may still be created. The client retries, and now there are two orders. Use timeouts as a safety net for reads, give slow writes a longer limit, and make writes safe to repeat (idempotency keys, M23). Truly stopping the work needs an `AbortSignal` passed all the way down, and many libraries don't support one."
        }
      ],
      "title": "Trap · a timeout doesn't stop the work"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Keep secrets out of the JSON: `ClassSerializerInterceptor`"
    },
    {
      "kind": "text",
      "text": "**Serialization** means turning your objects into the JSON text that goes over the wire. Nest's built-in `ClassSerializerInterceptor` converts each response with class-transformer, the library from M7. That makes two decorators work: `@Exclude()` drops a field, and `@Expose()` adds one."
    },
    {
      "kind": "example",
      "code": "import { Exclude, Expose } from 'class-transformer';\n\nexport class UserEntity {\n  id: string;\n  email: string;\n  firstName: string;\n  lastName: string;\n\n  @Exclude() // never leaves the server\n  passwordHash: string;\n\n  @Expose() // a computed field that IS sent\n  get fullName(): string {\n    return `${this.firstName} ${this.lastName}`;\n  }\n\n  constructor(partial: Partial<UserEntity>) {\n    Object.assign(this, partial);\n  }\n}",
      "label": "users/user.entity.ts"
    },
    {
      "kind": "text",
      "text": "Return an **instance** from your handler, `return new UserEntity(row)`, and `passwordHash` disappears from the response while `fullName` appears."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "The rules live on the *class*. A plain object has no class, so nothing is excluded. All of these leak `passwordHash`: returning the database row directly, `return { ...user, lastSeen }` (spreading copies the field and loses the class), and anything built with `JSON.parse()`. There are two fixes. Always return instances, or put `@SerializeOptions({ type: UserEntity })` on the controller or method, which tells the interceptor to turn plain objects into `UserEntity` first. And for defence in depth, don't even load the hash unless you need it; you will choose columns when you meet the database in M14."
        }
      ],
      "title": "Trap · `@Exclude()` only works on class instances"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Global interceptors, and their order"
    },
    {
      "kind": "text",
      "text": "Register them with `APP_INTERCEPTOR`, as you did with guards and filters, so they get DI and also run in e2e tests. The order of the list matters, because each interceptor wraps the next one, like the layers of an onion:"
    },
    {
      "kind": "example",
      "code": "import { ClassSerializerInterceptor, Module } from '@nestjs/common';\nimport { APP_INTERCEPTOR } from '@nestjs/core';\nimport { EnvelopeInterceptor } from './common/interceptors/envelope.interceptor';\nimport { LoggingInterceptor } from './common/interceptors/logging.interceptor';\nimport { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';\n\n@Module({\n  // imports, and the APP_FILTER from M8, stay as they were.\n  providers: [\n    // Listed from the outside in. Responses travel back out in reverse order.\n    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },         // 1. outermost: times everything\n    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },         // 2. turns \"too slow\" into a 504\n    { provide: APP_INTERCEPTOR, useClass: EnvelopeInterceptor },        // 3. wraps success in { data }\n    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }, // 4. innermost: drops @Exclude() fields first\n  ],\n})\nexport class AppModule {}",
      "label": "app.module.ts (excerpt)"
    },
    {
      "kind": "text",
      "text": "On the way **in**, they run top to bottom: logging, timeout, envelope, serializer, and then the pipes and your handler. On the way **out**, the result passes back up in reverse. The serializer drops `passwordHash`, the envelope wraps the clean object in `{ data }`, and logging measures the whole trip. Challenge 11.2 shows what breaks when the serializer sits anywhere else."
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "For each route, Nest builds a list: the global interceptors, then `@UseInterceptors()` on the controller, then `@UseInterceptors()` on the method.",
            "It calls the first interceptor's `intercept()`. Its `next.handle()` calls the second one, and so on. The last `next.handle()` runs the pipes and then your handler.",
            "Each `next.handle()` returns a fresh Observable, and nothing runs until something subscribes. Nest subscribes to the outermost one and sends the last value it emits.",
            "An error travels back out through the same layers, as an Observable error, until it reaches the exception filters."
          ]
        },
        {
          "kind": "text",
          "text": "Two things follow from step 2. Pipes run *inside* the interceptors, so an interceptor's *before* code sees the raw body, not your validated DTO. And an interceptor that skips `next.handle()` skips the pipes too."
        }
      ],
      "title": "Under the hood · how Nest chains interceptors"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "You have written this shape before. An Angular `HttpInterceptor` also calls `next.handle(req)` and returns an Observable that you `pipe()`, and a functional `HttpInterceptorFn` calls `next(req)`. The operators transfer one to one. Two habits don't. Angular interceptors wrap *outgoing* calls from the browser, while Nest's wrap *incoming* requests on the server. And in Angular it is normal to `catchError` and return a fallback value, or redirect to the login page on a 401. In Nest, swallowing an error breaks the error contract, so always throw it again."
        }
      ],
      "title": "Because you come from Angular"
    },
    {
      "kind": "quiz",
      "question": "`AppModule` registers four global interceptors in this order: logging, timeout, envelope, `ClassSerializerInterceptor`. A handler returns a `UserEntity`. In what order do their *after* parts, the code inside `.pipe()`, run?",
      "options": [
        "Logging, timeout, envelope, serializer: the same order as the list",
        "Serializer, envelope, timeout, logging",
        "All four at once, in parallel",
        "Envelope first, because it wraps the response"
      ],
      "answer": 1,
      "why": "**Serializer, envelope, timeout, logging.** Each interceptor wraps the next one, so the last one in the list sits closest to the handler. The result leaves the handler and passes back out through the layers from the inside. The serializer strips `@Exclude()` fields first, the envelope wraps the clean object, and logging, the outermost layer, sees the end of the whole trip. The *before* parts run in list order; the *after* parts run in reverse."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 11.1",
      "title": "A tiny cache",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a `SimpleCacheInterceptor`. For a `GET`, it keeps each response in memory for 10 seconds, keyed by URL, and while an entry is fresh it answers without calling the handler. Put it on the public `GET /products` route with `@UseInterceptors()`, add a `console.log` to the handler, and prove that the second call within 10 seconds doesn't log."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import {\n  CallHandler,\n  ExecutionContext,\n  Injectable,\n  NestInterceptor,\n} from '@nestjs/common';\nimport type { Request } from 'express';\nimport { Observable, of, tap } from 'rxjs';\n\n@Injectable()\nexport class SimpleCacheInterceptor implements NestInterceptor {\n  private readonly cache = new Map<string, { value: unknown; expiresAt: number }>();\n  private readonly ttlMs = 10_000;\n\n  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {\n    const req = context.switchToHttp().getRequest<Request>();\n    if (req.method !== 'GET') return next.handle(); // only cache reads\n\n    const key = req.originalUrl; // includes the query string\n    const hit = this.cache.get(key);\n    if (hit && hit.expiresAt > Date.now()) {\n      return of(hit.value); // answer from memory: the handler is NOT called\n    }\n\n    return next.handle().pipe(\n      tap((value) => this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs })),\n    );\n  }\n}\n\n// products.controller.ts\n//   @Public()\n//   @UseInterceptors(SimpleCacheInterceptor)\n//   @Get()\n//   findAll() {}",
              "label": "common/interceptors/simple-cache.interceptor.ts"
            },
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "`of(hit.value)` makes an Observable from a stored value. `next.handle()` is never called, so the pipes and the handler never run. The fastest request is the one you skip.",
                "It sits on a `@Public()` route for a reason. A cache keyed only by URL gives the *first* caller's answer to everyone. On a route like `GET /notes/mine`, one user would see another user's notes. Put the user's id in the key for per-user data, or don't cache it.",
                "It is still a toy: the map grows forever, and each server instance has its own copy. M22 replaces it with Redis and `@nestjs/cache-manager`."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Challenge 11.2",
      "title": "Why does the password leak?",
      "blocks": [
        {
          "kind": "text",
          "text": "A teammate moved `ClassSerializerInterceptor` up the list, above `EnvelopeInterceptor`. They also put `@SerializeOptions({ type: UserEntity })` on `UsersController`, whose `findOne()` returns a plain database row. Now `GET /users/:id` for Ana answers `{ \"data\": { \"id\": \"a3f1c2d4-...\", ..., \"passwordHash\": \"$2b$10$...\" }, \"fullName\": \"undefined undefined\" }`."
        },
        {
          "kind": "text",
          "text": "Explain both strange fields. Then fix the order, and write an e2e test that would have caught the bug."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { INestApplication } from '@nestjs/common';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport { App } from 'supertest/types';\nimport { AppModule } from '../src/app.module';\n\nconst ANA_ID = 'a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f601'; // user ids are UUID strings\n\ndescribe('GET /users/:id (e2e)', () => {\n  let app: INestApplication<App>;\n\n  beforeAll(async () => {\n    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = moduleRef.createNestApplication(); // main.ts does not run here…\n    await app.init(); // …but APP_INTERCEPTOR providers do\n  });\n\n  afterAll(async () => {\n    await app.close();\n  });\n\n  it('sends the user, and never the password hash', async () => {\n    const res = await request(app.getHttpServer())\n      .get(`/users/${ANA_ID}`)\n      .set('Authorization', 'Bearer user-token')\n      .expect(200);\n\n    expect(res.body).toEqual({\n      data: {\n        id: ANA_ID,\n        email: 'ana@example.com',\n        firstName: 'Ana',\n        lastName: 'Silva',\n        fullName: 'Ana Silva',\n      },\n    });\n  });\n});",
              "label": "test/users.e2e-spec.ts"
            },
            {
              "kind": "text",
              "text": "Responses travel back out from the inside. With the serializer above the envelope, the envelope runs first and wraps the plain row in `{ data }`. Then the serializer, which was told the response *is* a `UserEntity`, turns the whole envelope into one. The envelope has no `firstName` or `lastName`, so the `fullName` getter returns `\"undefined undefined\"`. And `@Exclude()` removes `passwordHash` from the envelope itself, where there is none, while the plain `data` object is copied as it is, hash included."
            },
            {
              "kind": "text",
              "text": "The fix is the order in the `AppModule` above: `ClassSerializerInterceptor` last, so it is the first to see the handler's result. The test locks that in. It boots the real `AppModule`, so it gets every `APP_INTERCEPTOR`. And it compares the whole body, so a leaked field and a broken getter both make it fail."
            },
            {
              "kind": "text",
              "text": "There is nothing to install: `@nestjs/testing`, Jest and `supertest` come with every `nest new` project. And this is the best everyday argument for `APP_*` providers over `app.useGlobal...()` in `main.ts`: `main.ts` doesn't run in tests, so anything set up there is missing from them.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q17",
      "title": "What is an interceptor, and what can it do that no other building block can?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** An interceptor wraps the route handler. Its `intercept()` method can run code before it calls `next.handle()`, which runs the rest of the chain, the pipes and the handler, and returns the result as an RxJS Observable. That gives it two powers nothing else in the pipeline has. It can change the *response*: wrap it in an envelope, serialize it, strip fields. And it can control *whether and how* the handler runs: skip it and answer from a cache, put a time limit on it, or retry it."
        },
        {
          "kind": "text",
          "text": "Things worth adding: interceptors run after guards and before pipes, so they never see requests a guard rejected, and their *before* code sees the raw body. They nest like an onion, so the *after* logic runs in reverse registration order, which matters when a serializer and an envelope are both global. And `catchError` in an interceptor should only throw again; returning a value turns an error into a 200 and skips the exception filter."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q18",
      "title": "How do you make sure a field like a password hash never reaches the client?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** In layers. First, don't load it: select only the columns a response needs, so the hash isn't even in memory for an ordinary read. Second, serialize through a class: mark the field `@Exclude()` on the entity or a response DTO, register `ClassSerializerInterceptor` globally, and return class instances, or use `@SerializeOptions({ type })` where a handler returns plain objects. The rules live on the class, so a plain object or a spread has none. Third, test it: an e2e test that checks the exact response body catches both leaks and interceptor-order mistakes."
        },
        {
          "kind": "text",
          "text": "**Why they ask:** leaked hashes are a classic real-world incident. Knowing that `@Exclude()` silently does nothing on plain objects separates people who have shipped Nest from people who have read about it.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, in M12, you go back to the inputs: pipes in depth. You'll meet the rest of the built-in pipes, write your own, and validate nested objects and arrays properly."
    }
  ]
};
