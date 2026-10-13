import { Lesson } from '../../shared/content';

export const M30_MICROSERVICES: Lesson = {
  "slug": "m30-microservices",
  "title": "M30 Microservices, and when not to use them",
  "nav": "Microservices",
  "num": "M30",
  "eyebrow": "Level 7 · Week 16 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A **microservice** is a small application that owns one part of the business, such as inventory, payments or notifications, and talks to the others over the network. `@nestjs/microservices` lets a Nest app send and receive **messages** instead of, or as well as, HTTP requests. The messages travel over a **transport**: the channel between the apps, such as TCP, Redis, NATS, RabbitMQ or Kafka."
    },
    {
      "kind": "text",
      "text": "This module shows how that works in Nest. Then it makes the honest case that most teams should start with one well-structured app, the modular monolith from Module 19, and split it only when a specific problem demands it."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "A microservice is a small, separate app that talks to other apps over the network. Splitting can help big teams work on their own, but every network call can be slow or fail. Most teams should start with one well-organised app and split only for a clear reason."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Transports"
    },
    {
      "kind": "text",
      "text": "The transport decides how messages travel, and what happens to them when something is down. Nest hides the differences behind the same decorators, so you can change the transport later, but the delivery guarantees change with it. A **broker** is a server whose only job is to receive messages and hand them on."
    },
    {
      "kind": "table",
      "head": [
        "Transport",
        "How it works",
        "Messages kept while a consumer is down?",
        "Reach for it when"
      ],
      "rows": [
        [
          "**TCP**",
          "A direct connection from one Nest app to another",
          "No",
          "Two Nest services talking, simple request and reply"
        ],
        [
          "**Redis**",
          "Redis pub/sub: whoever is subscribed right now gets the message",
          "No: with no subscriber, the message is lost",
          "You already run Redis, and losing a message is acceptable"
        ],
        [
          "**NATS**",
          "A small, very fast broker",
          "No, with plain NATS",
          "Fast request and reply, and fan-out between many services"
        ],
        [
          "**RabbitMQ**",
          "A broker with durable queues and acknowledgements",
          "Yes, with durable queues",
          "Work that must not be lost: emails, payments, order events"
        ],
        [
          "**Kafka**",
          "A replicated, append-only log that consumers read at their own pace",
          "Yes, for a configured time, and it can be replayed",
          "High-volume event streams, replay, analytics"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Nest also ships gRPC and MQTT transports. Each transport needs its client package: `amqplib` and `amqp-connection-manager` for RabbitMQ, `ioredis` for Redis, `kafkajs` for Kafka, and `nats` for NATS. **Version note:** Nest 12 replaces the `nats` package with `@nats-io/transport-node`. This module uses TCP, which needs no extra package, and RabbitMQ:",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/microservices@11 amqplib amqp-connection-manager",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "`@11` keeps `@nestjs/microservices` on its Nest 11 line. Without it, npm fetches the Nest 12 version and stops with an `ERESOLVE` error.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Request-reply and events"
    },
    {
      "kind": "text",
      "text": "Nest has two kinds of message handler. `@MessagePattern()` handles a **request**: the sender waits for a reply, like an HTTP call. `@EventPattern()` handles an **event**: a notice that something happened, with no reply, and any number of services may listen. Here is an inventory service that does both. First, its `main.ts`, which starts no HTTP server at all:"
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { MicroserviceOptions, Transport } from '@nestjs/microservices';\nimport { AppModule } from './app.module';\n\nasync function bootstrap() {\n  // No HTTP server: this app only listens for messages.\n  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {\n    transport: Transport.TCP,\n    options: { host: '0.0.0.0', port: 4001 },\n  });\n  app.enableShutdownHooks();\n  await app.listen();\n}\nbootstrap();",
      "label": "inventory/main.ts"
    },
    {
      "kind": "example",
      "code": "import { Controller } from '@nestjs/common';\nimport { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';\n\n@Controller()\nexport class InventoryController {\n  constructor(private readonly stock: StockService) {}\n\n  // Request-reply: the caller waits for this return value.\n  // cmd is { orderId: string, items: { productId: number, quantity: number }[] }\n  @MessagePattern('inventory.reserve')\n  reserve(@Payload() cmd: ReserveStockDto): Promise<{ reserved: boolean }> {\n    return this.stock.reserve(cmd.orderId, cmd.items);\n  }\n\n  // Event: nobody waits, so return nothing.\n  @EventPattern('order.cancelled')\n  async release(@Payload() event: OrderCancelledEvent): Promise<void> {\n    await this.stock.release(event.orderId);\n  }\n}",
      "label": "inventory/inventory.controller.ts"
    },
    {
      "kind": "text",
      "text": "On the other side, the orders service registers a **client** for the inventory service and injects it as a `ClientProxy`:"
    },
    {
      "kind": "example",
      "code": "// orders/orders.service.ts\nimport { ConflictException, Inject, Injectable } from '@nestjs/common';\nimport { ClientProxy } from '@nestjs/microservices';\nimport { firstValueFrom, timeout } from 'rxjs';\n\n@Injectable()\nexport class OrdersService {\n  constructor(@Inject('INVENTORY') private readonly inventory: ClientProxy) {}\n\n  async reserveStock(order: Order): Promise<void> {\n    // send(): request-reply. A cold Observable: nothing is sent until something subscribes.\n    const { reserved } = await firstValueFrom(\n      this.inventory\n        .send<{ reserved: boolean }>('inventory.reserve', {\n          orderId: order.id,\n          items: order.items.map(({ productId, quantity }) => ({ productId, quantity })),\n        })\n        .pipe(timeout(3000)),            // never wait forever on the network\n    );\n    if (!reserved) throw new ConflictException('Not enough stock');\n  }\n\n  cancel(order: Order): void {\n    // emit(): an event. Sent straight away; no reply comes back.\n    this.inventory.emit('order.cancelled', { orderId: order.id });\n  }\n}\n\n// orders/orders.module.ts\nimport { Module } from '@nestjs/common';\nimport { ClientsModule, Transport } from '@nestjs/microservices';\n\n@Module({\n  imports: [\n    ClientsModule.register([\n      {\n        name: 'INVENTORY',\n        transport: Transport.TCP,\n        options: { host: 'inventory', port: 4001 },   // the service's name in Compose\n      },\n    ]),\n  ],\n  providers: [OrdersService],\n})\nexport class OrdersModule {}",
      "label": "orders/orders.service.ts + orders/orders.module.ts"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · send() does nothing until you subscribe",
      "blocks": [
        {
          "kind": "text",
          "text": "`send()` returns a *cold* Observable: call it without `subscribe()`, `firstValueFrom()` or `lastValueFrom()` and nothing is sent at all, and nothing tells you so. `emit()` is the opposite: it returns a *hot* Observable and sends straight away. And always add `timeout()` to a `send()`. If the other service is slow, or never answers, nothing times out by default, and the HTTP request that triggered the call hangs with it."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A hybrid app: HTTP and messages in one process"
    },
    {
      "kind": "text",
      "text": "The orders service still needs its REST API. A **hybrid app** is one Nest app that serves HTTP *and* listens on a transport: you create it as usual, then call `connectMicroservice()`. Here the orders service also listens on a RabbitMQ queue called `orders`, where other services report back to it:"
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { MicroserviceOptions, Transport } from '@nestjs/microservices';\nimport { AppModule } from './app.module';\nimport { configureApp } from './app.setup';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule, { rawBody: true });   // Module 21's webhooks\n  configureApp(app);                      // global pipes and so on: BEFORE connectMicroservice()\n\n  app.connectMicroservice<MicroserviceOptions>(\n    {\n      transport: Transport.RMQ,\n      options: {\n        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],\n        queue: 'orders',\n        queueOptions: { durable: true },  // the queue survives a broker restart\n        noAck: false,                     // we acknowledge each message ourselves\n      },\n    },\n    { inheritAppConfig: true },           // use the same global pipes, guards and filters\n  );\n\n  app.enableShutdownHooks();\n  await app.startAllMicroservices();\n  await app.listen(process.env.PORT ?? 3000);\n}\nbootstrap();",
      "label": "orders/main.ts"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the hybrid app skips your global pipes",
      "blocks": [
        {
          "kind": "text",
          "text": "By default, handlers reached through `connectMicroservice()` don't inherit the HTTP app's global pipes, guards, interceptors and filters, so your carefully validated DTOs arrive unvalidated. Pass `{ inheritAppConfig: true }` as the second argument, and call the `useGlobal…()` methods *before* `connectMicroservice()`. Also, an `HttpException` means nothing to a message broker: in message handlers, throw `RpcException` from `@nestjs/microservices` instead."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Not losing messages"
    },
    {
      "kind": "text",
      "text": "With RabbitMQ and `noAck: false`, a message stays in the queue until the consumer **acknowledges** it, which means confirming it's done. If the consumer crashes first, RabbitMQ delivers the message again. That's what makes the queue safe, and it's also why the same message can arrive twice: delivery is **at least once**. So the handler must be **idempotent**: processing a message twice must do no more harm than processing it once (Module 23)."
    },
    {
      "kind": "example",
      "code": "import { Controller } from '@nestjs/common';\nimport { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';\n\n@Controller()\nexport class NotificationsController {\n  constructor(\n    private readonly emails: EmailService,\n    private readonly processed: ProcessedMessagesRepository,\n  ) {}\n\n  @EventPattern('order.placed')\n  async onOrderPlaced(@Payload() event: OrderPlacedEvent, @Ctx() ctx: RmqContext) {\n    const channel = ctx.getChannelRef();\n    const message = ctx.getMessage();\n    const key = `order-placed:${event.orderId}`;   // a stable id from the message itself\n\n    if (await this.processed.has(key)) {\n      channel.ack(message);                        // a repeat delivery: already done\n      return;\n    }\n\n    await this.emails.sendOrderConfirmation(event.orderId);\n    await this.processed.add(key);\n    channel.ack(message);                          // only now may RabbitMQ forget it\n    // If anything above throws, the message is never acked, and RabbitMQ\n    // delivers it again once this consumer's channel closes.\n  }\n}",
      "label": "notifications/notifications.controller.ts"
    },
    {
      "kind": "text",
      "text": "On the sending side, register the client with the same `queue`, the same `queueOptions` and `persistent: true`, so the messages themselves also survive a broker restart, not just the queue.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the Redis transport forgets",
      "blocks": [
        {
          "kind": "text",
          "text": "The Redis transport is Redis *pub/sub*: a message goes to whoever is subscribed at that moment, and if nobody is, it's gone. Deploy your notifications service while orders keep coming in, and every event published during the restart is silently lost. When a message must not be lost, use a broker with durable queues and acknowledgements, like RabbitMQ, or a log, like Kafka, and make the consumers idempotent, because those deliver at least once."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Sagas: transactions across services"
    },
    {
      "kind": "text",
      "text": "In one app, placing an order is one database transaction (Module 16): reserve the stock, create the order, take the payment, all or nothing. Split those steps across three services with three databases, and there's no shared transaction any more. A **saga** replaces it with a chain of local steps. Each service does its own small transaction and announces the result with an event. If a later step fails, the earlier services run a **compensating action**, an undo, such as giving the stock back."
    },
    {
      "kind": "example",
      "code": "Placing an order as a saga (each arrow is an event on the broker)\n\nOrders      saves order 7b4d8a52-… as PLACED    → order.created\nInventory   reserves 2 desk lamps               → stock.reserved\nPayments    charges the card ... declined       → payment.failed\n\nThen compensation, walking back:\nInventory   releases the 2 desk lamps           ← payment.failed\nOrders      marks order 7b4d8a52-… CANCELLED    ← payment.failed",
      "lang": "text",
      "label": "a saga, step by step"
    },
    {
      "kind": "text",
      "text": "Between those steps, the system is briefly inconsistent: the stock is reserved, but the order isn't paid yet. **Eventual consistency** means accepting that and designing for it: the order shows as placed but not paid for a second or two, and the UI says so. Two related patterns usually come along. The **outbox pattern** saves the event in an `outbox` table in the same database transaction as the change, and a background job publishes it, so you can never save the order and lose its event. And instead of services reacting to each other's events, an **orchestrator**, one service that tells each step what to do next, is often easier to follow once there are more than a few steps."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The honest case for a modular monolith"
    },
    {
      "kind": "text",
      "text": "Everything above is real work: brokers to run, message contracts to version, sagas instead of transactions, and requests that can now fail in five places instead of one. Debugging needs distributed tracing (Module 28) just to see what happened. That cost buys independent deployment and independent scaling, and most teams don't need those yet."
    },
    {
      "kind": "text",
      "text": "A **modular monolith** (Module 19) gets most of the benefit for a fraction of the cost: one deployable app, split into modules with strict boundaries. Each module owns its own tables, other modules use only what it exports, and modules can talk through **in-process events** instead of a broker."
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/event-emitter@3",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "`@nestjs/event-emitter` provides those events. Version 3 is its release line for Nest 11; without the pin, npm quietly installs version 12, which is ESM-only and made for Nest 12.",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "// orders/orders.service.ts: publish\nimport { Injectable } from '@nestjs/common';\nimport { EventEmitter2 } from '@nestjs/event-emitter';\n\nexport class OrderPaidEvent {\n  constructor(public readonly orderId: string) {}\n}\n\n@Injectable()\nexport class OrdersService {\n  constructor(private readonly events: EventEmitter2) {}\n\n  async markPaid(orderId: string): Promise<void> {\n    // ...save the order...\n    this.events.emit('order.paid', new OrderPaidEvent(orderId));\n  }\n}\n\n// notifications/order-paid.listener.ts: subscribe, in a different module\nimport { Injectable } from '@nestjs/common';\nimport { OnEvent } from '@nestjs/event-emitter';\n\n@Injectable()\nexport class OrderPaidListener {\n  constructor(private readonly emails: EmailService) {}\n\n  @OnEvent('order.paid', { async: true })\n  async handle(event: OrderPaidEvent): Promise<void> {\n    await this.emails.sendReceipt(event.orderId);\n  }\n}\n\n// app.module.ts: imports [EventEmitterModule.forRoot(), OrdersModule, NotificationsModule]",
      "label": "in-process events with @nestjs/event-emitter",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "It's the same shape as `emit()` plus `@EventPattern()`, with no network in between. If notifications ever needs to become its own service, the listener becomes an `@EventPattern()` handler and the `emit()` goes to a broker; the rest of the code stays where it is. One caution: in-process events live in memory, so a crash can lose one. When the follow-up must happen, use the outbox pattern or a BullMQ job (Module 23).",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "If your team has tried micro-frontends with Module Federation, you've already seen this trade. You got independent deploys, and paid with shared-version headaches, slower local development and harder debugging. Microservices make the same trade on the server, plus a network between every call."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Signs you really need to split"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Teams block each other.** Several teams work in one codebase, and coordinating their releases has become the bottleneck.",
        "**One part scales very differently.** Image processing needs ten times the CPU of everything else. (Check first whether a separate worker process from the same codebase, as in Module 23, is enough.)",
        "**A different security or compliance boundary.** Card payment data, for example, is far easier to audit inside a small, isolated service.",
        "**A different runtime is genuinely needed**, such as a Python machine-learning model.",
        "**Failure isolation matters.** A crash in recommendations must never take down checkout."
      ]
    },
    {
      "kind": "text",
      "text": "These are not reasons on their own: \"the codebase is big\" (modules fix that), \"it's more modern\", \"big tech companies do it\", or \"it will scale better\" (stateless replicas of a monolith scale fine, as Module 27 showed). And if your module boundaries aren't clean inside the monolith, splitting it gives you a **distributed monolith**: all the coupling you had before, with a network in the middle."
    },
    {
      "kind": "quiz",
      "question": "When a payment succeeds, Payments must tell Orders, Email and Analytics. Payments doesn't need an answer from any of them. Which fits best?",
      "options": [
        "`client.send()`, with a `@MessagePattern()` handler in each service",
        "`client.emit()`, with an `@EventPattern()` handler in each service",
        "Three HTTP calls from Payments, one per service",
        "A shared database table that the three services check every few seconds"
      ],
      "answer": 1,
      "why": "**`emit()` and `@EventPattern()`.** It's an event: something happened, and nobody needs to reply, so `emit()` sends it and moves on. `send()` would make Payments wait for three replies it doesn't need. Direct HTTP calls tie Payments to every consumer, so a fourth listener would mean changing Payments again; with a broker, adding a listener needs no change to Payments at all (on RabbitMQ, delivering one event to several queues is done with an exchange). A shared table works, but it's slow, and it ties all four services to one schema."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 30.1",
      "title": "Extract notifications into a service",
      "blocks": [
        {
          "kind": "text",
          "text": "Move the order-confirmation email out of your E-commerce backend into a separate Nest app, `notifications`, over RabbitMQ. The orders app emits `order.placed` once the payment succeeds; `notifications` consumes it with `@EventPattern()`, sends the email and acknowledges the message itself. Run RabbitMQ in Compose: the `rabbitmq:4-management` image includes a web UI on port 15672. Then test the property that matters: stop `notifications`, place three orders, start it again, and check that all three emails go out, each exactly once."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// orders/orders.module.ts: the sending side\nClientsModule.register([\n  {\n    name: 'NOTIFICATIONS',\n    transport: Transport.RMQ,\n    options: {\n      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],\n      queue: 'notifications',\n      queueOptions: { durable: true },\n      persistent: true,                    // messages survive a broker restart too\n    },\n  },\n]),\n\n// orders.service.ts, once the payment has succeeded:\nthis.notifications.emit('order.placed', { orderId: order.id, userId: order.userId });\n\n// notifications/main.ts: the receiving side\nconst app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {\n  transport: Transport.RMQ,\n  options: {\n    urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],\n    queue: 'notifications',\n    queueOptions: { durable: true },       // must match the sender, or RabbitMQ refuses\n    noAck: false,\n  },\n});\napp.enableShutdownHooks();\nawait app.listen();",
              "label": "the two ends of the notifications queue"
            },
            {
              "kind": "text",
              "text": "The consumer is the `NotificationsController` above. While it's stopped, the three messages wait in the durable `notifications` queue, and you can watch them in the management UI. When it starts again, they're delivered in order. Run the same experiment with `Transport.REDIS` and the three events are simply gone."
            },
            {
              "kind": "text",
              "text": "To check \"exactly once\", add a temporary `await new Promise((r) => setTimeout(r, 10_000))` just before `channel.ack()`, and kill the consumer during that pause, after the email has gone out. On restart, RabbitMQ delivers the unacknowledged message again, and the processed-messages check stops a second email. Without that check, the customer would get two."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 30.2",
      "title": "Split it, or not?",
      "blocks": [
        {
          "kind": "text",
          "text": "For each situation, choose: keep it in the modular monolith, move it to a worker process from the same codebase, or extract a separate service. Give one sentence of reasoning for each."
        },
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "A team of three finds the codebase hard to find their way around.",
            "PDF invoice generation uses all the CPU for seconds at a time and slows the API down.",
            "A new team of eight will own payments, and card data needs a PCI audit.",
            "The CTO has read that microservices scale better.",
            "A data-science team wants to serve recommendations from a Python model."
          ]
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": true,
              "items": [
                "**Keep it in the monolith.** That's a module-boundary problem. Fix the modules (Module 19); a network won't make the code any clearer.",
                "**A worker process.** Same codebase, separate process: a BullMQ worker (Module 23) takes the CPU work off the API, without a new service to version and deploy.",
                "**A separate service.** A separate team plus a compliance boundary is the textbook case: a smaller audit scope, independent releases and isolated secrets.",
                "**Keep it in the monolith.** Stateless replicas behind a load balancer already scale out (Module 27). Ask *which part* doesn't scale, and why.",
                "**A separate service**, because the runtime is different. Keep the contract small, such as one request-reply call or a small HTTP API, with a timeout and a fallback for when it's down."
              ]
            },
            {
              "kind": "text",
              "text": "Only two of the five are real reasons to split, and one more is solved by a process, not a service. That's roughly the ratio you'll meet in practice.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q55",
      "title": "`@MessagePattern` vs `@EventPattern`: what's the difference, and how do you choose a transport?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `@MessagePattern` handles request-reply. The client calls `send()`, which returns a cold Observable, so nothing goes out until you subscribe, typically with `firstValueFrom()` plus a `timeout()`, and the handler's return value is the reply. `@EventPattern` handles fire-and-forget events. The client calls `emit()`, which sends straight away, no reply comes back, and many services can listen to the same event. I use request-reply when the caller can't continue without the answer, and events to announce facts that others may react to, which keeps the publisher independent of its consumers."
        },
        {
          "kind": "text",
          "text": "The transport choice is mostly about delivery guarantees. TCP is a direct Nest-to-Nest connection with nothing in between. Redis and plain NATS are pub/sub: fast, but a message published while nobody is subscribed is lost. RabbitMQ gives durable queues, acknowledgements and redelivery, which suits commands and events that must not be lost. Kafka is a replicated log, with replay and consumer groups for high-volume streams. With any at-least-once transport I make consumers idempotent, and in hybrid apps I set `inheritAppConfig: true`, so validation still applies to message handlers."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q56",
      "title": "When would you choose microservices over a modular monolith?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Rarely as a starting point. A modular monolith gives you clear boundaries, with each module owning its data and exposing a small API, plus one deploy, in-process calls, real database transactions and simple debugging. Microservices add network failures, latency, versioned contracts, sagas instead of transactions, distributed tracing just to follow one request, and an operations cost multiplied by the number of services."
        },
        {
          "kind": "text",
          "text": "I'd split a piece out when there's a concrete need that the monolith can't meet: separate teams blocked on each other's releases, a component with very different scaling or resource needs, a security or compliance boundary such as payments, a different runtime, or failure isolation for something critical. And I'd split along boundaries already proven inside the monolith, extracting one module at a time behind the interface it already has. Splitting before the boundaries are clear produces a distributed monolith, with the downsides of both."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "title": "That's the ladder",
      "blocks": [
        {
          "kind": "text",
          "text": "From `nest new` to a service that is tested, secured, measured, documented, observable, containerised and deployed, and the judgement to know when *not* to split it. Whatever you build next is these same pieces, rearranged for a new problem."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Two pages remain. The **Projects** page turns these modules into builds you can show an employer, and the **Interview bank** collects every interview question from the course in one place, ready to practise out loud."
    }
  ]
};
