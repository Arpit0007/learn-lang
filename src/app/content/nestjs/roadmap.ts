import { Lesson } from '../../shared/content';

export const ROADMAP: Lesson = {
  "slug": "roadmap",
  "title": "The roadmap, and why this order",
  "nav": "The roadmap",
  "eyebrow": "Map",
  "blocks": [
    {
      "kind": "text",
      "text": "Most people fail at NestJS by starting in the wrong place — Postgres and JWT before dependency injection, or microservices before they can structure one module. Each rung exists because the one above it made it possible."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Levels 1–3 · Foundations Weeks 1–5 (Modules 1–9)"
    },
    {
      "kind": "text",
      "text": "What Nest is, the CLI, bootstrap, modules, controllers, providers, dependency injection, DTOs and validation. This is the grammar. Everything advanced — dynamic modules, custom decorators, microservices — is these pieces rearranged, so shortcuts here cost triple later."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 4 · The request pipeline Weeks 6–7 (Modules 10–13)"
    },
    {
      "kind": "text",
      "text": "Guards, interceptors, pipes, custom decorators — everything that wraps your handler, built on the exception filters and middleware from Level 3. This lands before the database because these are the pieces that keep a growing API from turning into 300 copy-pasted auth checks — and it is roughly half of every NestJS interview."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 5 · Data & identity Weeks 8–10 (Modules 14–18)"
    },
    {
      "kind": "text",
      "text": "PostgreSQL, entities, migrations, relations, transactions, query tuning — then a complete authentication system: bcrypt, JWT, refresh rotation, Passport, RBAC. Auth comes after the database because a real auth system *is* a database feature with a security budget."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 6 · Real systems Weeks 11–14 (Modules 19–24)"
    },
    {
      "kind": "text",
      "text": "Architecture and the modular monolith, Nest internals and dynamic modules, file uploads and external services, Redis caching, BullMQ queues, WebSockets. Architecture is deliberately here and not earlier: patterns only mean something once you have enough code for them to organise."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 7 · Craft, scale & ship Weeks 15–16 (Modules 25–30)"
    },
    {
      "kind": "text",
      "text": "Testing, security and OWASP, performance and the event loop, Docker, CI/CD, observability, Swagger, deployment — and microservices last, with an honest account of when a modular monolith is the better engineering answer."
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "If you can build a validated CRUD API from an empty folder without looking anything up, you're employable as a junior. If you can explain the request pipeline and how DI resolves a graph, you'll pass most NestJS interviews. Everything from Level 5 on is what makes you trusted with production."
        }
      ],
      "title": "Checkpoint"
    }
  ]
};
