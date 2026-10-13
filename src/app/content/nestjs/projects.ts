import { Lesson } from '../../shared/content';

export const PROJECTS: Lesson = {
  "slug": "projects",
  "title": "Sixteen projects",
  "nav": "Projects",
  "eyebrow": "Portfolio",
  "blocks": [
    {
      "kind": "text",
      "text": "Projects get you hired. A certificate says you finished a course; a working API shows you can build one. Each project below uses what you learned that week, and most build on the one before."
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Build it without a tutorial.** Look things up in the course and the [NestJS docs](https://docs.nestjs.com), but write every line yourself. If you are stuck for 30 minutes, reread the module, not someone else's finished code.",
        "**One repository per project, with a README.** Say what the project does, how to run it, and which decisions you made and why.",
        "**Finish small, then grow.** Get the thinnest version working from request to response, commit it, and only then add features."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The sixteen projects"
    },
    {
      "kind": "cards",
      "cards": [
        {
          "title": "1 · Hello NestJS API",
          "tags": "Week 1 · M1–M3 · CLI, bootstrap",
          "text": "Generate a `greeting` module, controller and service with the CLI, and return JSON from `GET /api/greeting`. Give `main.ts` the production shape from Module 3: a global prefix, the port from an environment variable, CORS and shutdown hooks. It proves you can start a Nest app from nothing and explain every file in it."
        },
        {
          "title": "2 · Todo API",
          "tags": "Week 2 · M4–M6 · modules, DI",
          "text": "Build CRUD for todos in memory: the service owns the data, and the controller only calls it. Add a `StatsModule` that imports `TodosModule` to count finished todos, and unit-test `StatsService` with a fake `TodosService`. It proves you understand module boundaries and dependency injection, not just the syntax."
        },
        {
          "title": "3 · Notes API",
          "tags": "Week 3 · M7 · DTOs, validation",
          "text": "Build the Notes API from Exercise 7.1, with a DTO for every input and a global `ValidationPipe` that rejects unknown fields. Send it bad requests on purpose, and check that each one gets a clear 400. It proves your API stops bad input before it reaches your code."
        },
        {
          "title": "4 · Product CRUD API",
          "tags": "Week 4 · M7 · pagination, filtering, versioning",
          "text": "Build products with pagination, filters for category and price, sorting, and URL versioning like `/api/v1/products`. Every list returns `items`, `total`, `page` and `limit`, and `limit` has a hard maximum. It proves you can design list endpoints that a frontend team can use without asking you questions."
        },
        {
          "title": "5 · Error + logging layer",
          "tags": "Week 5 · M8–M9 · exception filters, middleware",
          "text": "Add a correlation-ID middleware to the Product CRUD API, and a global exception filter, registered with `APP_FILTER`, that gives every error the same shape. Then log one line per request with the method, path, status, time taken and correlation ID. It proves that when something breaks, you can find the exact request in your logs."
        },
        {
          "title": "6 · User Management System",
          "tags": "Week 6 · M10–M11 · guards, roles, interceptors",
          "text": "Build users with roles: admins manage everyone, and other users can only see and edit themselves (fake the login with a test header until Project 9). Put the rules in guards with `@Roles()` metadata, and add interceptors for a response envelope and timing. It proves your access rules live in one place, not in every handler."
        },
        {
          "title": "7 · Blog API",
          "tags": "Week 7 · M12–M13 · pipes, custom decorators",
          "text": "Build posts, comments and tags, where only the author can edit or delete a post. Write your own building blocks: a `@CurrentUser()` decorator, a `@Public()` decorator that skips a global guard, and a pipe that checks post slugs. It proves you can extend Nest with small, reusable pieces instead of repeating code."
        },
        {
          "title": "8 · Expense Tracker API",
          "tags": "Weeks 8–9 · M14–M16 · TypeORM, transactions",
          "text": "Move to PostgreSQL with TypeORM: users, accounts, categories and expenses, with relations and migrations, and `synchronize` turned off. Moving money between accounts runs in a transaction, and a monthly report uses `GROUP BY` with an index that fits it. It proves your data stays correct even when a request fails halfway through."
        },
        {
          "title": "9 · Authentication System",
          "tags": "Week 10 · M17–M18 · bcrypt, JWT, refresh tokens, RBAC",
          "text": "Build sign-up, login, logout and refresh: passwords hashed with bcrypt, short-lived access tokens, and refresh tokens that rotate and are stored hashed. Add role-based access control and a rate limit on login. It proves you can build login safely and explain why each piece is there."
        },
        {
          "title": "10 · E-commerce Backend",
          "tags": "Week 11 · M19–M20 · architecture, dynamic modules",
          "text": "Build catalogue, cart, orders and payments as separate modules in one app: a modular monolith. Modules talk only through exported services or events, config is typed and checked at startup, and payments sit behind a dynamic module with a fake provider. It proves you can split a big app into parts that don't reach into each other."
        },
        {
          "title": "11 · Admin Dashboard Backend",
          "tags": "Week 12 · M21–M22 · uploads, email, webhooks, Redis",
          "text": "Build the API behind an admin panel: image uploads with size and type checks, CSV export, emails on key events, and a webhook endpoint that checks signatures. Cache the slow dashboard numbers in Redis, and clear them when the data changes. It proves you can work safely with the world outside your database."
        },
        {
          "title": "12 · Notification Service",
          "tags": "Week 13 · M23 · BullMQ, retries, cron",
          "text": "Accept notification requests and send them in the background with BullMQ: email and SMS through fake providers, retries with backoff, and a nightly digest on a schedule. A job that runs twice must still send only one message. It proves slow, flaky work can't slow down or break your API."
        },
        {
          "title": "13 · Real-Time Chat Backend",
          "tags": "Week 14 · M24 · WebSockets, rooms, Redis adapter",
          "text": "Build a Socket.IO gateway with a JWT check on connect, one room per conversation, messages saved in Postgres, and typing and online indicators. Then run two instances with the Redis adapter, and show a message crossing from one to the other. It proves you understand long-lived connections and how to scale them past one server."
        },
        {
          "title": "14 · Test and harden everything",
          "tags": "Week 15 · M25–M27 · testing, security, performance",
          "text": "Go back over your projects, starting with the Authentication System and the E-commerce Backend, and add unit tests and E2E tests that run against a real database. Then harden them: rate limits, Helmet, a check against the OWASP API Security Top 10, and a load test of the slowest endpoint. It proves you can *show* that your code works and is safe, not just say so."
        },
        {
          "title": "15 · E-commerce Production Backend",
          "tags": "Week 16 · M28–M30 · Swagger, Docker, CI/CD, deploy",
          "text": "Take the E-commerce Backend to production: Swagger docs, JSON logs, health checks, a multi-stage Dockerfile, and a CI pipeline that lints, tests and builds on every push. Deploy it, then move notifications into a separate microservice that talks to the main app through a message broker. It proves you can ship a service that other people can run, call and monitor."
        },
        {
          "title": "16 · Capstone: Event Booking Platform",
          "tags": "After Week 16 · M1–M30 · your own design",
          "text": "Design a ticket booking API yourself, from a one-page design document: unpaid seat holds expire through a delayed job, and payment webhooks are idempotent. When two people try to buy the last seat at the same moment, exactly one must win. It proves you can make the design decisions yourself, not just follow a plan."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What a reviewer looks for"
    },
    {
      "kind": "text",
      "text": "A reviewer, such as a hiring manager or a senior engineer, often spends only a few minutes on a repo. This is what they look at first."
    },
    {
      "kind": "table",
      "head": [
        "Area",
        "What good looks like",
        "Red flag"
      ],
      "rows": [
        [
          "README",
          "What it does, how to run it in one or two commands, example requests, and the decisions you made",
          "The default README from `nest new`"
        ],
        [
          "Structure",
          "One folder and one module per feature, with thin controllers",
          "Business logic in controllers, or folders named `controllers/` and `services/`"
        ],
        [
          "Input",
          "A DTO for every body, query and param, and a global `ValidationPipe` with `whitelist`",
          "`@Body() body: any`"
        ],
        [
          "Errors",
          "One error shape everywhere, with no stack traces or SQL in responses",
          "A raw database error sent to the client"
        ],
        [
          "Data",
          "Migrations, indexes for the queries you run, and transactions for multi-step writes",
          "`synchronize: true` in production"
        ],
        [
          "Security",
          "Hashed passwords, short-lived tokens, ownership checks and rate limits",
          "Changing an ID in the URL shows another user's data"
        ],
        [
          "Config",
          "Settings from environment variables, checked at startup, and a committed `.env.example`",
          "A secret anywhere in the Git history"
        ],
        [
          "Tests",
          "Tests for the main flows and the edge cases that matter",
          "Only the generated `app.controller.spec.ts`"
        ],
        [
          "Git history",
          "Small commits with clear messages",
          "One giant commit called \"final\""
        ],
        [
          "Running it",
          "`docker compose up` works, and there is a health check and API docs",
          "It only works on your machine"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Add a Decisions section to every README",
      "blocks": [
        {
          "kind": "text",
          "text": "An interviewer will open one of your repos and ask *why*. Why a guard and not middleware? Why this index? Why a queue here? Before you call a project done, write down three choices you made, the option you turned down, and why. Then the interview is about the code you know best."
        }
      ]
    }
  ]
};
