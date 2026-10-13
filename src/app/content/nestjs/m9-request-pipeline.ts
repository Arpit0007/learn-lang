import { Lesson } from '../../shared/content';

export const M9_REQUEST_PIPELINE: Lesson = {
  "slug": "m9-request-pipeline",
  "title": "M9 The request pipeline: middleware vs guard vs interceptor vs pipe vs filter",
  "nav": "The request pipeline",
  "num": "M9",
  "eyebrow": "Level 3 · Week 5 · ~2 sessions · the single most-asked NestJS interview topic",
  "blocks": [
    {
      "kind": "text",
      "text": "Half of all NestJS confusion is one question: *which building block runs when, and what can it see?* Here's the order. Everything in Weeks 5 through 7 is an elaboration of this diagram."
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 920 392\" role=\"img\" aria-labelledby=\"lc-t lc-d\" data-inline-style=\"\">\n      <title id=\"lc-t\">NestJS request lifecycle</title>\n      <desc id=\"lc-d\">A request passes through middleware, guards, pre-controller interceptors and pipes, reaches the handler, then returns through post-controller interceptors to the response. A thrown exception from any stage routes to exception filters, which produce the response instead.</desc>\n      <defs>\n        <marker id=\"a1\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7.5\" refY=\"4.5\" orient=\"auto\">\n          <path d=\"M0,1 L8,4.5 L0,8 z\" fill=\"var(--line)\"></path>\n        </marker>\n        <marker id=\"a2\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7.5\" refY=\"4.5\" orient=\"auto\">\n          <path d=\"M0,1 L8,4.5 L0,8 z\" fill=\"var(--gold-ink)\"></path>\n        </marker>\n      </defs>\n      <text x=\"8\" y=\"34\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" letter-spacing=\"1.6\">INBOUND ▸</text>\n      <text x=\"8\" y=\"176\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" letter-spacing=\"1.6\">◂ OUTBOUND</text>\n      <g font-family=\"Bricolage Grotesque, sans-serif\" font-size=\"13.5\" font-weight=\"600\">\n        <rect x=\"8\" y=\"48\" width=\"96\" height=\"52\" rx=\"26\" fill=\"var(--surface)\" stroke=\"var(--line)\"></rect>\n        <text x=\"56\" y=\"79\" text-anchor=\"middle\" fill=\"var(--ink)\">Request</text>\n        <rect x=\"120\" y=\"48\" width=\"136\" height=\"52\" rx=\"4\" fill=\"var(--surface)\" stroke=\"var(--line)\"></rect>\n        <text x=\"188\" y=\"72\" text-anchor=\"middle\" fill=\"var(--ink)\">Middleware</text>\n        <text x=\"188\" y=\"88\" text-anchor=\"middle\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"9.5\" font-weight=\"400\">req · res · next</text>\n        <rect x=\"272\" y=\"48\" width=\"136\" height=\"52\" rx=\"4\" fill=\"var(--surface)\" stroke=\"var(--line)\"></rect>\n        <text x=\"340\" y=\"72\" text-anchor=\"middle\" fill=\"var(--ink)\">Guards</text>\n        <text x=\"340\" y=\"88\" text-anchor=\"middle\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"9.5\" font-weight=\"400\">may I? true / false</text>\n        <rect x=\"424\" y=\"48\" width=\"136\" height=\"52\" rx=\"4\" fill=\"var(--surface)\" stroke=\"var(--line)\"></rect>\n        <text x=\"492\" y=\"72\" text-anchor=\"middle\" fill=\"var(--ink)\">Interceptors</text>\n        <text x=\"492\" y=\"88\" text-anchor=\"middle\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"9.5\" font-weight=\"400\">before handle()</text>\n        <rect x=\"576\" y=\"48\" width=\"136\" height=\"52\" rx=\"4\" fill=\"var(--surface)\" stroke=\"var(--line)\"></rect>\n        <text x=\"644\" y=\"72\" text-anchor=\"middle\" fill=\"var(--ink)\">Pipes</text>\n        <text x=\"644\" y=\"88\" text-anchor=\"middle\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"9.5\" font-weight=\"400\">validate · transform</text>\n        <rect x=\"728\" y=\"48\" width=\"184\" height=\"52\" rx=\"4\" fill=\"var(--gold-wash)\" stroke=\"var(--gold-ink)\"></rect>\n        <text x=\"820\" y=\"72\" text-anchor=\"middle\" fill=\"var(--ink)\">Handler → Service</text>\n        <text x=\"820\" y=\"88\" text-anchor=\"middle\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"9.5\" font-weight=\"400\">your business logic</text>\n      </g>\n      <g stroke=\"var(--line)\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#a1)\">\n        <path d=\"M104,74 L116,74\"></path><path d=\"M256,74 L268,74\"></path><path d=\"M408,74 L420,74\"></path>\n        <path d=\"M560,74 L572,74\"></path><path d=\"M712,74 L724,74\"></path>\n      </g>\n      <path d=\"M820,100 L820,190 L724,190\" stroke=\"var(--line)\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#a1)\"></path>\n      <g font-family=\"Bricolage Grotesque, sans-serif\" font-size=\"13.5\" font-weight=\"600\">\n        <rect x=\"576\" y=\"164\" width=\"136\" height=\"52\" rx=\"4\" fill=\"var(--surface)\" stroke=\"var(--line)\"></rect>\n        <text x=\"644\" y=\"188\" text-anchor=\"middle\" fill=\"var(--ink)\">Interceptors</text>\n        <text x=\"644\" y=\"204\" text-anchor=\"middle\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"9.5\" font-weight=\"400\">after · RxJS pipe()</text>\n        <rect x=\"424\" y=\"164\" width=\"112\" height=\"52\" rx=\"26\" fill=\"var(--surface)\" stroke=\"var(--line)\"></rect>\n        <text x=\"480\" y=\"195\" text-anchor=\"middle\" fill=\"var(--ink)\">Response</text>\n      </g>\n      <path d=\"M572,190 L544,190\" stroke=\"var(--line)\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#a1)\"></path>\n      <g stroke=\"var(--gold-ink)\" stroke-width=\"1.3\" fill=\"none\" stroke-dasharray=\"5 4\">\n        <path d=\"M340,100 L340,272\"></path>\n        <path d=\"M644,100 L644,126 L560,126 L560,272\"></path>\n        <path d=\"M880,100 L880,272\"></path>\n        <path d=\"M340,272 L880,272\"></path>\n      </g>\n      <text x=\"352\" y=\"264\" fill=\"var(--gold-ink)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\">throw — any stage</text>\n      <g font-family=\"Bricolage Grotesque, sans-serif\" font-size=\"13.5\" font-weight=\"600\">\n        <rect x=\"480\" y=\"300\" width=\"200\" height=\"52\" rx=\"4\" fill=\"var(--surface)\" stroke=\"var(--gold-ink)\"></rect>\n        <text x=\"580\" y=\"324\" text-anchor=\"middle\" fill=\"var(--ink)\">Exception Filters</text>\n        <text x=\"580\" y=\"340\" text-anchor=\"middle\" fill=\"var(--ink-faint)\" font-family=\"IBM Plex Mono, monospace\" font-size=\"9.5\" font-weight=\"400\">shape the error response</text>\n      </g>\n      <path d=\"M580,272 L580,296\" stroke=\"var(--gold-ink)\" stroke-width=\"1.3\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#a2)\"></path>\n      <path d=\"M480,326 L444,326 L444,222\" stroke=\"var(--gold-ink)\" stroke-width=\"1.3\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#a2)\"></path>\n    </svg>",
      "caption": "Within each stage, bindings run global → controller → route. The two things people get wrong: middleware runs *before* guards, so it can't read route metadata like `@Roles()`; and interceptors wrap the handler on *both* sides of it."
    },
    {
      "kind": "table",
      "head": [
        "Block",
        "Sees",
        "Can do",
        "Reach for it when"
      ],
      "rows": [
        [
          "**Middleware**",
          "Raw `req`/`res`. No route metadata, no DTO, no `ExecutionContext`",
          "Mutate the request, short-circuit, call `next()`",
          "Cross-cutting plumbing: correlation IDs, raw-body capture, helmet, cookie parsing"
        ],
        [
          "**Guard**",
          "`ExecutionContext` + handler metadata via `Reflector`",
          "Allow or deny: return boolean, or throw",
          "Authentication and authorization. \"Is this caller allowed here?\""
        ],
        [
          "**Interceptor**",
          "The context *and* the handler's return stream (`CallHandler`)",
          "Wrap before and after, transform the response, retry, time out, cache",
          "Response envelopes, timing logs, caching, timeouts, serialization"
        ],
        [
          "**Pipe**",
          "One argument value plus its metadata",
          "Validate and transform that value, or throw",
          "DTO validation, `ParseIntPipe`, defaults, coercion"
        ],
        [
          "**Exception filter**",
          "The thrown exception + host context",
          "Own the error response shape and status",
          "One consistent error contract for the whole API"
        ]
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Middleware, since it's the one you already know"
    },
    {
      "kind": "example",
      "code": "import { Injectable, NestMiddleware } from '@nestjs/common';\nimport { randomUUID } from 'node:crypto';\nimport { Request, Response, NextFunction } from 'express';\n\n@Injectable()\nexport class CorrelationIdMiddleware implements NestMiddleware {\n  use(req: Request, res: Response, next: NextFunction) {\n    const id = (req.headers['x-correlation-id'] as string) ?? randomUUID();\n    req.headers['x-correlation-id'] = id;\n    res.setHeader('x-correlation-id', id);      // echo it back to the client\n    next();                                      // forget this and the request hangs\n  }\n}",
      "label": "common/middleware/correlation-id.middleware.ts"
    },
    {
      "kind": "example",
      "code": "import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';\n\n@Module({ /* … */ })\nexport class AppModule implements NestModule {\n  configure(consumer: MiddlewareConsumer) {\n    consumer\n      .apply(CorrelationIdMiddleware)\n      .forRoutes('*');                                  // everything\n\n    consumer\n      .apply(RawBodyMiddleware)\n      .forRoutes({ path: 'webhooks/stripe', method: RequestMethod.POST });\n  }\n}",
      "label": "app.module.ts — binding middleware"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Both can reject a request, so why is auth a guard? Three reasons, and naming all three is a strong answer. **1. Metadata.** A guard receives an `ExecutionContext` and can use `Reflector` to read decorators on the handler — `@Roles('admin')`, `@Public()`. Middleware runs before routing is resolved, so it has no idea which handler is about to run. **2. Intent and errors.** A guard returning `false` produces a `403` through the framework's exception layer, so it lands in your one error contract; middleware has to write a response itself. **3. Composition.** Guards bind at global, controller and route level with `@UseGuards()`, and stack in a defined order. Middleware binds by path pattern, which is a blunter instrument."
        },
        {
          "kind": "text",
          "text": "Put plumbing that doesn't care *who* you are in middleware. Put decisions in guards."
        }
      ],
      "title": "The distinction interviewers actually probe · middleware vs guard"
    },
    {
      "kind": "quiz",
      "question": "You need to reject requests from users without the `admin` role, where the role requirement is declared per route with `@Roles('admin')`. Which block?",
      "options": [
        "Middleware — it runs first, so it's the cheapest place to reject",
        "A pipe — it validates the incoming request",
        "An interceptor — it wraps the handler",
        "A guard — it's the only one that can read the handler's metadata"
      ],
      "answer": 3,
      "why": "**A guard.** The requirement lives in a decorator on the handler, and only a guard (or interceptor) gets an `ExecutionContext` with `getHandler()` and `getClass()` to read it via `Reflector`. Middleware runs before the route is resolved and cannot see `@Roles()` at all. An interceptor *could* technically read it, but authorization belongs in the stage designed to say yes or no — and guards run earlier, so you don't do work you're about to discard."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 9.1",
      "title": "Prove the order yourself",
      "blocks": [
        {
          "kind": "text",
          "text": "Create one of each — a middleware, a guard, an interceptor, a pipe and an exception filter — that each do nothing but `console.log` their own name (the interceptor logging twice: before `next.handle()` and inside a `tap()` after). Bind them all to a single route, hit it, and copy the output order into your notes."
        },
        {
          "kind": "text",
          "text": "Then make the handler throw, hit it again, and note which logs still appear and which don't."
        },
        {
          "kind": "reveal",
          "tag": "Expected output",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "middleware\nguard\ninterceptor: before\npipe\nhandler\ninterceptor: after",
              "lang": "text",
              "label": "console — success"
            },
            {
              "kind": "example",
              "code": "middleware\nguard\ninterceptor: before\npipe\nhandler (throws)\nfilter        ← \"interceptor: after\" never runs; the stream errored",
              "lang": "text",
              "label": "console — handler throws"
            },
            {
              "kind": "text",
              "text": "That second output is the detail worth remembering: a `tap()` in an interceptor does **not** run when the handler throws, because `tap`'s next-callback only fires on a value. If your timing log or metric must record failures too, use `tap({ next, error })` or `finalize()`. People ship broken latency metrics over exactly this.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q14",
      "title": "Explain middleware vs guards vs interceptors vs pipes vs exception filters.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** They're five stages of one request pipeline, distinguished by *when* they run and *what context* they get. Middleware runs first, on the raw request, before routing is resolved — plumbing like correlation IDs and security headers. Guards run next and are the first stage with an `ExecutionContext`, so they can read handler metadata through `Reflector`; they answer one question, may this request proceed, which makes them the home for authentication and authorization. Interceptors wrap the handler on both sides, with access to the return stream via `CallHandler`, so they own response envelopes, timing, caching, timeouts and retries. Pipes run last before the handler, on individual arguments, validating and transforming them — that's where `ValidationPipe` and `ParseIntPipe` live. Exception filters sit outside all of it, catching anything thrown at any stage and turning it into the response."
        },
        {
          "kind": "text",
          "text": "Within each stage, bindings apply global first, then controller, then route. And one practical note: an interceptor's post-handler logic doesn't run on a thrown error unless you handle the error branch, which catches people out when adding metrics."
        },
        {
          "kind": "text",
          "text": "**Why this question is everywhere:** it's the single best test of whether someone has built with Nest or just read about it. Answer it by stage and context, not by listing definitions.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "You've covered Modules 1–9: what Nest is and what it costs, the CLI and project shape, bootstrap and the DI internals, modules and encapsulation, controllers and routing, providers and dependency injection, DTOs and validation, the error contract, and the request pipeline. That's Weeks 1–5 of the plan, four of the sixteen projects, and fourteen interview questions."
        },
        {
          "kind": "text",
          "text": "**The gate before Level 4:** build the Notes API from Exercise 7.1 with the error contract from Exercise 8.1 applied, from an empty folder, without looking back at this course. If you can do that, guards, interceptors, custom decorators and Postgres are the natural next rung. If you can't yet, the module to reread is 6 — dependency injection is the one thing everything else in Nest is built on."
        },
        {
          "kind": "text",
          "text": "Level 4 · Modules 10–13 · Weeks 6–7: guards and role-based authorization, interceptors and response envelopes, pipes in depth, and custom decorators with `Reflector` and metadata. Start with M10, Guards and roles.",
          "style": "small"
        }
      ],
      "title": "Next: Level 4 · The request pipeline"
    }
  ]
};
