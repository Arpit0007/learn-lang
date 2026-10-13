import { Lesson } from '../../shared/content';

export const M8_EXCEPTIONS: Lesson = {
  "slug": "m8-exceptions",
  "title": "M8 Exception handling and one error contract",
  "nav": "Exceptions & errors",
  "num": "M8",
  "eyebrow": "Level 3 · Week 5 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "In Nest you don't return errors, you **throw** them — and something downstream turns the throw into an HTTP response. That separation is what lets a service stay ignorant of HTTP while still producing a correct `404`."
    },
    {
      "kind": "example",
      "code": "import {\n  BadRequestException,      // 400\n  UnauthorizedException,    // 401  — \"I don't know who you are\"\n  ForbiddenException,       // 403  — \"I know who you are; no\"\n  NotFoundException,        // 404\n  ConflictException,        // 409  — duplicate, version clash\n  UnprocessableEntityException, // 422 — well-formed but semantically invalid\n  PayloadTooLargeException, // 413\n  InternalServerErrorException, // 500\n} from '@nestjs/common';\n\n// There is no built-in 429 — throttling raises it via @nestjs/throttler,\n// or you construct it yourself: new HttpException(body, 429).\n\nthrow new NotFoundException(`Product ${id} not found`);\nthrow new ConflictException({ code: 'EMAIL_TAKEN', email });   // objects are allowed",
      "label": "built-in exceptions"
    },
    {
      "kind": "text",
      "text": "Custom exceptions are worth it as soon as an error means something to your domain — they carry a machine-readable code, and they let you throw the same meaning from several places without repeating the message:"
    },
    {
      "kind": "example",
      "code": "import { HttpException, HttpStatus } from '@nestjs/common';\n\nexport class InsufficientStockException extends HttpException {\n  constructor(productId: string, requested: number, available: number) {\n    super(\n      {\n        code: 'INSUFFICIENT_STOCK',      // clients branch on this, not on prose\n        message: `Requested ${requested} but only ${available} available`,\n        productId,\n      },\n      HttpStatus.CONFLICT,\n    );\n  }\n}",
      "label": "common/exceptions/insufficient-stock.exception.ts",
      "verdict": "good"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The global filter: one shape for every error"
    },
    {
      "kind": "text",
      "text": "This is the piece that makes an API feel professional. Every failure — validation, domain, database, unhandled — comes back in the same envelope, with a correlation ID the client can quote in a support ticket."
    },
    {
      "kind": "example",
      "code": "import {\n  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,\n} from '@nestjs/common';\nimport { HttpAdapterHost } from '@nestjs/core';\nimport { Request } from 'express';\n\n@Catch()                                 // no argument = catch everything\nexport class AllExceptionsFilter implements ExceptionFilter {\n  private readonly logger = new Logger(AllExceptionsFilter.name);\n\n  constructor(private readonly adapterHost: HttpAdapterHost) {}\n\n  catch(exception: unknown, host: ArgumentsHost) {\n    const ctx = host.switchToHttp();\n    const req = ctx.getRequest<Request>();\n    const correlationId = (req.headers['x-correlation-id'] as string) ?? 'n/a';\n\n    const isHttp = exception instanceof HttpException;\n    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;\n    const payload = isHttp ? exception.getResponse() : null;\n\n    // Never leak internals on a 500 — log the detail, return a generic message.\n    if (status >= 500) {\n      this.logger.error(\n        `${req.method} ${req.url} — ${correlationId}`,\n        exception instanceof Error ? exception.stack : String(exception),\n      );\n    }\n\n    const body = {\n      statusCode: status,\n      code: typeof payload === 'object' && payload !== null && 'code' in payload\n        ? (payload as { code: string }).code\n        : httpCodeName(status),\n      message: status >= 500\n        ? 'Internal server error'\n        : extractMessage(payload) ?? 'Request failed',\n      path: req.url,\n      timestamp: new Date().toISOString(),\n      correlationId,\n    };\n\n    this.adapterHost.httpAdapter.reply(ctx.getResponse(), body, status);\n  }\n}\n\n// The two helpers used above.\nfunction httpCodeName(status: number): string {\n  return HttpStatus[status] ?? 'ERROR';      // 404 → 'NOT_FOUND'\n}\n\nfunction extractMessage(payload: unknown): string | string[] | undefined {\n  if (typeof payload === 'string') return payload;\n  if (typeof payload === 'object' && payload !== null && 'message' in payload) {\n    return (payload as { message: string | string[] }).message;  // a list for validation errors\n  }\n  return undefined;\n}",
      "label": "common/filters/all-exceptions.filter.ts",
      "verdict": "good"
    },
    {
      "kind": "example",
      "code": "import { APP_FILTER } from '@nestjs/core';\n\n@Module({\n  providers: [\n    { provide: APP_FILTER, useClass: AllExceptionsFilter },   // ← injectable\n  ],\n})\nexport class AppModule {}",
      "label": "app.module.ts — bind it with DI",
      "verdict": "good"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`app.useGlobalFilters(new AllExceptionsFilter())` works only for filters with no dependencies — the instance is built outside the container, so `HttpAdapterHost`, a logger or a config service can't be injected. Register with the `APP_FILTER` token instead (the same applies to `APP_GUARD`, `APP_PIPE` and `APP_INTERCEPTOR`). This is one of the most common \"why is my dependency undefined?\" questions in the Nest ecosystem."
        }
      ],
      "title": "Trap · `useGlobalFilters(new Filter())` can't inject"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Letting a raw driver error reach the client tells an attacker your table names, column names and constraint names — and often the failing SQL. Catch known driver codes and translate them into domain exceptions in your repository or service layer; let everything else become a generic `500` with the detail in your logs only. Postgres `23505` (unique violation) → `ConflictException`, `23503` (foreign key) → `BadRequestException`, and so on."
        }
      ],
      "title": "Trap · leaking database errors"
    },
    {
      "kind": "quiz",
      "question": "A service throws a plain `new Error('boom')`. With the filter above registered, what does the client get?",
      "options": [
        "500 with `\"boom\"` in the message",
        "The process crashes — Nest only handles `HttpException`",
        "500 with a generic message; the stack is logged server-side",
        "400, because Nest treats unknown errors as bad input"
      ],
      "answer": 2,
      "why": "**500 with a generic message.** `@Catch()` with no argument catches everything, and the filter deliberately replaces the message for any status ≥ 500 while logging the stack with a correlation ID. Without a filter, Nest's built-in exception layer still returns `{\"statusCode\":500,\"message\":\"Internal server error\"}` rather than crashing — but you'd lose the correlation ID, the code field, and the consistent envelope."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 8.1",
      "title": "Give your API one error contract",
      "blocks": [
        {
          "kind": "text",
          "text": "Take the Notes API from Exercise 7.1 and add the filter above. Then make each of these produce the same envelope shape, and record the `code` and status for each: a validation failure, a `GET` for a note that doesn't exist, a route that doesn't exist at all, a deliberate `throw new Error('kaboom')` inside the service, and a custom `NoteLockedException` you write yourself (409, code `NOTE_LOCKED`)."
        },
        {
          "kind": "reveal",
          "tag": "What to check",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "**Every** response has `statusCode`, `code`, `message`, `path`, `timestamp`, `correlationId` — including the 404 for an unmatched route, which Nest raises as a `NotFoundException` and your filter therefore catches.",
                "The `kaboom` case returns `\"Internal server error\"` to the client, and the real message plus stack appear in your terminal with the correlation ID.",
                "The validation failure keeps its array of messages — worth deciding deliberately whether your contract exposes them as `message: string[]` or nests them under a `details` field. Pick one and document it."
              ]
            },
            {
              "kind": "text",
              "text": "This exercise is small and has an outsized payoff: an API with one predictable error shape is dramatically cheaper for clients to integrate, and \"how would you handle global errors?\" is a guaranteed interview question you'll now answer from experience.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q13",
      "title": "How would you handle errors globally so clients get one predictable contract?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Three layers. First, throw meaningful exceptions from the domain: Nest's built-ins where they fit, and custom classes extending `HttpException` with a machine-readable `code` where the error means something specific — services never return error objects or set status codes. Second, one global exception filter registered via the `APP_FILTER` token, so it can inject the logger and adapter host. It normalises everything into a single envelope — status, code, message, path, timestamp, correlation ID — logs anything ≥ 500 with a stack, and replaces 5xx messages with a generic string so internals never leak. Third, translate infrastructure errors near their source: map driver codes like unique-violation to `ConflictException` in the repository layer, so the filter never has to know about SQL."
        },
        {
          "kind": "text",
          "text": "I'd also make the correlation ID a real feature — set it in middleware if the client didn't send one, include it in every log line and every error body, so a user's screenshot is enough to find the exact request in the logs."
        }
      ]
    }
  ]
};
