import { Lesson } from '../../shared/content';

export const STUDY_PLAN: Lesson = {
  "slug": "study-plan",
  "title": "The 16-week plan",
  "nav": "16-week plan",
  "eyebrow": "Schedule",
  "blocks": [
    {
      "kind": "text",
      "text": "Six study days plus a revision day. A session is 90–120 minutes, roughly 30% reading and 70% typing. The weekly rhythm never changes — Monday new concept, Tuesday examples, Wednesday exercises, Thursday challenge, Friday interview questions, Saturday project, Sunday revision — which is what makes the plan survivable."
    },
    {
      "kind": "table",
      "head": [
        "Week",
        "Modules",
        "Focus",
        "Saturday project"
      ],
      "rows": [
        [
          "1",
          "M1–M3",
          "What Nest is · CLI & structure · bootstrap",
          "Hello NestJS API"
        ],
        [
          "2",
          "M4–M6",
          "Modules · controllers & routing · providers and DI",
          "Todo API"
        ],
        [
          "3",
          "M7",
          "DTOs, class-validator, global ValidationPipe",
          "Notes API"
        ],
        [
          "4",
          "M7 cont.",
          "REST properly: pagination, filtering, sorting, versioning",
          "Product CRUD API"
        ],
        [
          "5",
          "M8–M9",
          "Exception filters and the error contract · middleware",
          "Error + logging layer"
        ],
        [
          "6",
          "M10–M11",
          "Guards, roles · interceptors, envelopes, timing",
          "User Management System"
        ],
        [
          "7",
          "M12–M13",
          "Pipes · custom decorators and metadata",
          "Blog API"
        ],
        [
          "8–9",
          "M14–M16",
          "Postgres, migrations, relations, transactions, tuning",
          "Expense Tracker API"
        ],
        [
          "10",
          "M17–M18",
          "bcrypt, JWT, refresh rotation, Passport, RBAC",
          "Authentication System"
        ],
        [
          "11",
          "M19–M20",
          "Clean architecture, modular monolith · Nest internals",
          "E-commerce Backend"
        ],
        [
          "12",
          "M21–M22",
          "Uploads, email, external APIs, webhooks · Redis caching",
          "Admin Dashboard Backend"
        ],
        [
          "13",
          "M23",
          "BullMQ, retries, idempotency, cron, workers",
          "Notification Service"
        ],
        [
          "14",
          "M24",
          "Gateways, socket auth, rooms, scaling with Redis",
          "Real-Time Chat Backend"
        ],
        [
          "15",
          "M25–M27",
          "Unit/integration/E2E testing · security and OWASP · performance",
          "Test + harden everything"
        ],
        [
          "16",
          "M28–M30",
          "Swagger and observability · Docker, CI/CD, deploy · microservices",
          "E-commerce Production Backend"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Falling two days behind, feeling guilty, and skipping the revision day to catch up. Do the opposite — skip the *new* material and keep the revision. A half-remembered Week 6 makes Weeks 10–14 impossible; a delayed Week 6 costs you nothing."
        }
      ],
      "title": "The most common way to fail this plan"
    }
  ]
};
