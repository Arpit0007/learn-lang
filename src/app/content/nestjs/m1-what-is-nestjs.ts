import { Lesson } from '../../shared/content';

export const M1_WHAT_IS_NESTJS: Lesson = {
  "slug": "m1-what-is-nestjs",
  "title": "M1 What NestJS is, and why we use it",
  "nav": "What NestJS is",
  "num": "M1",
  "eyebrow": "Level 1 · Week 1 · ~1 session",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 1 · Week 1 · Fundamentals",
      "blocks": [
        {
          "kind": "text",
          "text": "What this framework is, what it costs, how to generate one, and what happens in the two seconds between `npm run start` and your first request."
        }
      ]
    },
    {
      "kind": "text",
      "text": "NestJS is a **framework for structuring backend Node.js applications**. It does not replace Express — by default it runs *on top of* Express. What it adds is an architecture: code organised into **modules**, HTTP handled by **controllers**, logic living in **services**, and all of it wired together by a **dependency injection container** rather than by hand."
    },
    {
      "kind": "text",
      "text": "If Express is a box of parts, Nest is the same parts plus a chassis and an assembly line."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Why it exists"
    },
    {
      "kind": "text",
      "text": "Express gives you almost nothing about organisation. That's fine for 200 lines and quietly fatal at 20,000. Real Express codebases converge on the same five problems:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**No prescribed structure.** Every team invents its own layout, so nothing transfers between projects or engineers.",
        "**Manual, implicit wiring.** `new UserService(new UserRepo(db))`, repeated, order-dependent, and painful the moment a dependency needs config.",
        "**Untestable by default.** A handler that reaches out and grabs the database itself cannot be tested without a database.",
        "**Copy-pasted cross-cutting concerns.** Auth, validation, logging and error shaping repeated per route and slightly different each time. This is where security bugs live.",
        "**Types bolted on.** `req.body` is `any`. Your compiler cannot help you."
      ]
    },
    {
      "kind": "text",
      "text": "Nest's answer is to make structure part of the framework. Modules give boundaries. DI gives swappable dependencies, which is what makes testing cheap. Guards, pipes, interceptors and filters give each cross-cutting concern exactly one home. TypeScript is first-class rather than an afterthought."
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "Nest costs you a learning curve and some indirection. For a three-endpoint webhook receiver, plain Express or Fastify is the better engineering call. Nest earns its keep when an application will be *large*, *long-lived*, or touched by *more than one person*. Saying this in an interview marks you as an engineer rather than a fan."
        }
      ],
      "title": "The honest tradeoff"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Nest vs Express, concretely"
    },
    {
      "kind": "table",
      "head": [
        "Concern",
        "Express",
        "NestJS"
      ],
      "rows": [
        [
          "Structure",
          "You invent it, per project",
          "Modules/controllers/providers, enforced"
        ],
        [
          "Wiring",
          "`new`, by hand, in the right order",
          "IoC container resolves the graph for you"
        ],
        [
          "TypeScript",
          "Optional, community typings",
          "Built in; the framework is written in it"
        ],
        [
          "Validation",
          "Bring a library, wire it per route",
          "DTO classes + one global `ValidationPipe`"
        ],
        [
          "Auth",
          "Middleware, per route, by convention",
          "Guards, declarative, composable, global-capable"
        ],
        [
          "Errors",
          "`try/catch` per handler",
          "Throw; one exception filter owns the contract"
        ],
        [
          "Testing",
          "Hard — dependencies are grabbed, not given",
          "Easy — override any provider in a test module"
        ],
        [
          "Docs",
          "Hand-written, drifts immediately",
          "Swagger generated from your DTOs and decorators"
        ],
        [
          "Learning curve",
          "An afternoon",
          "A couple of weeks"
        ],
        [
          "Runtime speed",
          "Baseline",
          "Effectively the same — it *is* Express underneath"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "That last row matters and is frequently got wrong in interviews. Nest's reflection and graph-building happen **once at bootstrap**, not per request. Your per-request overhead is a thin wrapper around the same Express handler you'd have written anyway. If you need more throughput, swap the platform: `@nestjs/platform-fastify` is a two-line change."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The same endpoint, twice"
    },
    {
      "kind": "example",
      "code": "const express = require('express');\nconst app = express();\napp.use(express.json());\nconst db = require('./db');                       // grabbed, not injected\n\napp.get('/products/:id', async (req, res) => {\n  const id = Number(req.params.id);               // manual coercion\n  if (Number.isNaN(id)) {                          // manual validation\n    return res.status(400).json({ error: 'bad id' });\n  }\n  if (!req.headers.authorization) {                // auth, inline, per route\n    return res.status(401).json({ error: 'unauthorized' });\n  }\n  try {\n    const product = await db.findProduct(id);\n    if (!product) return res.status(404).json({ error: 'not found' });\n    res.json(product);                             // response shape decided here\n  } catch (e) {\n    console.error(e);                              // error handling, per route\n    res.status(500).json({ error: 'oops' });\n  }\n});\n\napp.listen(3000);",
      "lang": "javascript",
      "label": "app.js — Express",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "It works. Now picture this handler 300 times, written by nine people over three years, and answer two questions: where does the auth rule live, and how would you change the error shape everywhere?",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';\nimport { ProductsService } from './products.service';\n\n@Controller('products')\n@UseGuards(JwtAuthGuard)                       // auth: declarative, reusable\nexport class ProductsController {\n  constructor(private readonly products: ProductsService) {}   // injected\n\n  @Get(':id')\n  findOne(@Param('id', ParseIntPipe) id: number) {             // coerced + validated\n    return this.products.findOne(id);                          // that's the whole handler\n  }\n}",
      "label": "products.controller.ts — Nest",
      "verdict": "good"
    },
    {
      "kind": "example",
      "code": "import { Injectable, NotFoundException } from '@nestjs/common';\nimport { ProductsRepository } from './products.repository';\n\n@Injectable()\nexport class ProductsService {\n  constructor(private readonly repo: ProductsRepository) {}\n\n  async findOne(id: number) {\n    const product = await this.repo.findById(id);\n    if (!product) throw new NotFoundException(`Product ${id} not found`);\n    return product;                            // no try/catch: Nest catches for you\n  }\n}",
      "label": "products.service.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Count what left the handler: coercion (a pipe), auth (a guard), the 404 (a thrown exception a filter turns into a response), the `try/catch` (Nest's exception layer), the response shape (an interceptor will own it), and `new` anywhere (the container). What remains is the only line that was ever about products."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "It wraps it. `NestFactory.create(AppModule)` creates an Express app internally, and `app.use(helmet())` is real Express middleware. The practical consequence: if you inject the raw response with `@Res()` and write to it yourself, you silently opt out of interceptors and serialization, because Nest no longer owns the response. Use `@Res({ passthrough: true })` if you only need to set a header or a cookie."
        }
      ],
      "title": "Trap · \"Nest replaces Express\""
    },
    {
      "kind": "quiz",
      "question": "Is NestJS slower than Express at runtime?",
      "options": [
        "Yes — decorators are evaluated on every request",
        "Yes — dependency injection resolves per request",
        "No meaningful difference — the reflective work happens once at bootstrap",
        "Yes — but only for POST requests"
      ],
      "answer": 2,
      "why": "**No meaningful difference.** Decorators run once at class-definition time, and the DI graph is built once during `NestFactory.create()`, with providers cached as singletons. Per request you pay a thin wrapper over the same Express handler. Startup time is where Nest costs you, and default request-scoped providers (Module 6) are the one thing that *can* move real work per request."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 1.1",
      "title": "Argue the other side",
      "blocks": [
        {
          "kind": "text",
          "text": "Write four or five sentences arguing *against* using Nest for a specific project of your choosing. Be concrete about the project — team size, endpoint count, lifespan — and name the actual cost, not \"it's heavy\"."
        },
        {
          "kind": "reveal",
          "tag": "Model answer",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "\"We need a Stripe webhook receiver: one endpoint, verify a signature, write a row, ack. One engineer, done in a day, changed maybe twice a year. Nest would add a build step, ~30 MB of dependencies, a module/controller/service split over three files for nine lines of logic, and a framework the next maintainer must learn to change a string. Fastify with a single route handler and one Zod schema is 40 lines and has no architecture to understand. The value Nest sells — boundaries, DI, uniform cross-cutting concerns — is only valuable when there's enough code and enough people for boundaries to matter. Here there isn't.\"",
              "style": "small"
            },
            {
              "kind": "text",
              "text": "Notice what makes that answer good: it names the real costs (build step, dependency weight, file spread, maintainer onboarding) and it identifies *the condition* under which the tradeoff flips.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q1",
      "title": "What is NestJS, and is it a replacement for Express?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** NestJS is an opinionated Node.js framework for building server-side applications, written in TypeScript, that provides an application architecture out of the box: modules for boundaries, controllers for the HTTP layer, providers for logic, and a dependency-injection container to wire them. It is *not* a replacement for Express — it's an abstraction over an underlying HTTP platform, and that platform is Express by default. You can swap it for Fastify with `@nestjs/platform-fastify` without touching your controllers, which is the point of the abstraction: your application code doesn't know which HTTP library is underneath."
        },
        {
          "kind": "text",
          "text": "**The follow-up you'll get:** \"So what does it actually buy you?\" — structure that survives team growth, DI that makes code testable, and one home for each cross-cutting concern instead of one per route."
        },
        {
          "kind": "text",
          "text": "**Why they ask:** it separates people who learned an architecture from people who learned a tutorial.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q2",
      "title": "Your team wants to skip Nest for a new internal service — \"six endpoints, Express is faster to write.\" How do you respond?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Start by agreeing with the part that's true: for six endpoints, Express *is* faster to write, and Nest's value is mostly in code you haven't written yet. Then make the decision on two questions rather than on taste. First, will this service grow or be integrated into the wider platform? An internal service that gains auth, background jobs and a second consumer within a year is a Nest service that started as Express. Second, who maintains it? If the rest of the platform is Nest, a lone Express service costs the team a context switch forever, and shares none of its guards, filters or config modules."
        },
        {
          "kind": "text",
          "text": "If both answers point small and standalone — a one-off internal tool, no growth path — I'd take Express and not feel bad. If either points at growth or shared ownership, the consistency is worth more than the first week of velocity."
        },
        {
          "kind": "text",
          "text": "**What they're testing:** whether you can make a tradeoff instead of defending a framework. Candidates who answer \"Nest is always better\" fail this question.",
          "style": "small"
        }
      ]
    }
  ]
};
