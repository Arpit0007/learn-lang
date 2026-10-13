import { Lesson } from '../../shared/content';

export const M24_WEBSOCKETS: Lesson = {
  "slug": "m24-websockets",
  "title": "M24 Real-time with WebSockets",
  "nav": "WebSockets",
  "num": "M24",
  "eyebrow": "Level 6 · Week 14 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "HTTP is a conversation where the client always speaks first. That's a problem when the *server* has news: \"your order has shipped\", or \"a new order just came in\" on the admin dashboard. The client would have to ask every few seconds, which is called **polling**. Polling is slow to notice changes, and wasteful when nothing has changed."
    },
    {
      "kind": "text",
      "text": "A **WebSocket** is a connection that stays open, so both sides can send messages at any time. Nest supports it with **gateways**: classes that handle socket messages the way controllers handle HTTP requests. Most Nest apps use **socket.io**, a library on top of WebSockets that adds rooms, automatic reconnection, and a fallback for networks that block WebSockets."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "A WebSocket is a phone line that stays open, so the server can call the client at any time. Check who is calling once, when the line opens, before you let them in. With several servers, use Redis so that every server can reach every client."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A gateway"
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/websockets@11 @nestjs/platform-socket.io@11",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "Pin `@11`. These two packages are part of Nest's core and must match `@nestjs/common` 11, or npm refuses to install them. The `socket.io` server itself comes with `@nestjs/platform-socket.io`."
    },
    {
      "kind": "text",
      "text": "First, a way for the rest of the app to say \"an order changed\". This is a tiny event bus built from an RxJS `Subject`: `OrdersService` calls `statusChanged()`, and anything can subscribe to `changes$`. The gateway doesn't need `OrdersService` to push updates, and `OrdersService` doesn't need the gateway, so there is no loop between them (Module 20)."
    },
    {
      "kind": "example",
      "code": "import { Injectable } from '@nestjs/common';\nimport { Observable, Subject } from 'rxjs';\nimport { OrderStatus } from './entities/order.entity';\n\nexport interface OrderStatusChanged {\n  orderId: string;\n  userId: string;\n  status: OrderStatus; // Module 15's statuses: placed, paid, shipped, cancelled\n}\n\n/** A tiny in-process event bus. OrdersService publishes; the gateway and the SSE endpoint listen. */\n@Injectable()\nexport class OrderEvents {\n  private readonly changes = new Subject<OrderStatusChanged>();\n  readonly changes$: Observable<OrderStatusChanged> = this.changes.asObservable();\n\n  statusChanged(event: OrderStatusChanged): void {\n    this.changes.next(event);\n  }\n}",
      "label": "src/orders/order-events.service.ts"
    },
    {
      "kind": "text",
      "text": "Now the gateway. It is a provider, so list it in a module's `providers`. With no port in `@WebSocketGateway()`, it shares the HTTP server's port."
    },
    {
      "kind": "example",
      "code": "// ── realtime/ws-admin.guard.ts ──\nimport { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\nimport { WsException } from '@nestjs/websockets';\nimport type { Socket } from 'socket.io';\nimport type { AuthUser } from '../auth/auth-user';\n\n@Injectable()\nexport class WsAdminGuard implements CanActivate {\n  canActivate(context: ExecutionContext): boolean {\n    const client = context.switchToWs().getClient<Socket>(); // not switchToHttp(): there is no request\n    const user = client.data.user as AuthUser | undefined;\n    if (!user?.roles.includes('admin')) throw new WsException('Forbidden'); // WsException, not ForbiddenException\n    return true;\n  }\n}\n\n// ── realtime/orders.gateway.ts ──\nimport { NotFoundException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\nimport {\n  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage,\n  WebSocketGateway, WebSocketServer, WsException,\n} from '@nestjs/websockets';\nimport { IsUUID } from 'class-validator';\nimport { Server, Socket } from 'socket.io';\nimport type { AuthUser, JwtPayload } from '../auth/auth-user';\nimport { OrderEvents } from '../orders/order-events.service';\nimport { OrdersService } from '../orders/orders.service';\nimport { WsAdminGuard } from './ws-admin.guard';\n\nexport class WatchOrderDto {\n  @IsUUID() orderId: string;\n}\n\n// Global pipes don't reach gateways, so bind one here, and make it throw WsException.\nconst wsValidation = new ValidationPipe({\n  whitelist: true,\n  exceptionFactory: (errors) =>\n    new WsException({ status: 'error', message: errors.flatMap((e) => Object.values(e.constraints ?? {})) }),\n});\n\n@WebSocketGateway({ cors: { origin: ['http://localhost:4200'] } }) // the Angular dev server\n@UsePipes(wsValidation)\nexport class OrdersGateway implements OnGatewayInit, OnGatewayConnection {\n  @WebSocketServer() private readonly server: Server;\n\n  constructor(\n    private readonly jwt: JwtService,\n    private readonly orders: OrdersService,\n    private readonly events: OrderEvents,\n  ) {}\n\n  afterInit(server: Server): void {\n    // 1. Check the token once, during the handshake. A bad token never connects: the client gets connect_error.\n    server.use((socket, next) => {\n      const token = String(socket.handshake.auth.token ?? '');\n      this.jwt\n        .verifyAsync<JwtPayload>(token)\n        .then((payload) => {\n          // The same AuthUser that M17's JwtAuthGuard puts on HTTP requests.\n          const user: AuthUser = { id: payload.sub, email: payload.email, roles: payload.roles };\n          socket.data.user = user;\n          next();\n        })\n        .catch(() => next(new Error('unauthorized')));\n    });\n\n    // 3. Push each status change to its owner's room, and to the admins.\n    this.events.changes$.subscribe((e) => {\n      this.server.to(`user:${e.userId}`).to('admins').emit('order:status', { orderId: e.orderId, status: e.status });\n    });\n  }\n\n  // 2. Runs after the middleware, so the user is known. A room per user covers their phone AND laptop.\n  async handleConnection(client: Socket): Promise<void> {\n    const user = client.data.user as AuthUser;\n    await client.join(`user:${user.id}`);\n  }\n\n  @SubscribeMessage('order:watch') // the client asks for an order's current status\n  async watch(@ConnectedSocket() client: Socket, @MessageBody() dto: WatchOrderDto) {\n    const user = client.data.user as AuthUser;\n    try {\n      const order = await this.orders.findOne(dto.orderId, user); // Module 18: owner or 'orders:read-any'\n      return { event: 'order:status', data: { orderId: order.id, status: order.status } };\n    } catch (err) {\n      // A NotFoundException would reach the client as 'Internal server error'. Translate it.\n      if (err instanceof NotFoundException) throw new WsException('Order not found');\n      throw err;\n    }\n  }\n\n  @UseGuards(WsAdminGuard)\n  @SubscribeMessage('admin:watch-all')\n  async watchAll(@ConnectedSocket() client: Socket) {\n    await client.join('admins');\n    return { event: 'admin:watching', data: { ok: true } };\n  }\n}",
      "label": "src/realtime/ — authentication, rooms and messages",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Step 1: the handshake.** `afterInit()` runs once, when the socket.io server starts. `server.use()` adds socket.io **middleware**, which runs for every new connection before it is accepted. The client sends its JWT in `auth.token` (see the client in Exercise 24.1). A good token becomes the same `AuthUser`, with `id`, `email` and `roles`, that the HTTP `JwtAuthGuard` builds in Module 17, stored on `socket.data.user`. A bad token calls `next(new Error(...))`, and the client gets a `connect_error`.",
        "**Step 2: rooms.** A **room** is a named group of sockets. Each user's sockets join `user:<id>`, so one emit reaches their phone and their laptop. Admins can join `admins`.",
        "**Step 3: pushing.** `server.to(room).emit(event, data)` sends to everyone in a room. Chain `.to()` twice to send to both rooms; a socket in both gets the message once.",
        "**Messages.** `@SubscribeMessage('order:watch')` handles a message from one client. `@MessageBody()` is its payload, and `@ConnectedSocket()` is the socket that sent it. Returning `{ event, data }` sends that event back to the same client."
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Never trust an ID from the client",
      "blocks": [
        {
          "kind": "text",
          "text": "Who the user is comes from the checked token, never from the message. And whether they may see an order is Module 18's `findOne(id, user)`: the owner, or someone with `orders:read-any`. Anyone else gets \"not found\", so asking about someone else's order looks exactly like asking about one that doesn't exist. Its `NotFoundException` is an HTTP error, so the gateway turns it into a `WsException`."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Guards, pipes and errors in a gateway"
    },
    {
      "kind": "text",
      "text": "Guards, pipes, interceptors and filters all work in gateways, with three differences:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Use the WebSocket context.** In a guard, `context.switchToWs()` gives you the client socket with `getClient()` and the message with `getData()`. There is no HTTP request.",
        "**Throw `WsException`.** The default gateway filter sends it to the client as an `exception` event. Any other error, including `NotFoundException` and the `BadRequestException` from a normal `ValidationPipe`, reaches the client as `Internal server error`. That is why the gateway's pipe has an `exceptionFactory`.",
        "**Bind them on the gateway.** Global pipes, guards, interceptors and filters, whether from `app.useGlobal…()` or from `APP_GUARD`-style providers, apply to HTTP routes only. The global `ValidationPipe` from Module 7 does nothing here."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Two authentication mistakes"
    },
    {
      "kind": "example",
      "code": "import { UseGuards } from '@nestjs/common';\nimport { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';\nimport { Server, Socket } from 'socket.io';\nimport { WsJwtGuard } from './ws-jwt.guard';\n\n@WebSocketGateway()\n@UseGuards(WsJwtGuard) // ❌ guards run for @SubscribeMessage handlers, never for the connection\nexport class OrdersGateway implements OnGatewayConnection {\n  @WebSocketServer() private readonly server: Server;\n\n  handleConnection(client: Socket): void {\n    // No guard ran before this line. A client with no token at all is now connected…\n    const userId = String(client.handshake.query.userId); // ❌ …and it says who it is\n    void client.join(`user:${userId}`); // so anyone can join anyone's room\n  }\n}",
      "label": "src/realtime/orders.gateway.ts",
      "verdict": "bad"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · guards don't run on connect",
      "blocks": [
        {
          "kind": "text",
          "text": "`@UseGuards()` on a gateway protects its `@SubscribeMessage` handlers. It never runs for the connection, or for `handleConnection()`. So a client with no token connects, and `handleConnection()` trusts a `userId` the client made up. Anyone can join anyone's room and read their order updates."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · throwing inside `handleConnection()`",
      "blocks": [
        {
          "kind": "text",
          "text": "Moving the check into `async handleConnection()`, with `await this.jwt.verifyAsync(token)`, looks like the fix. But Nest calls that method without catching its errors. A bad token rejects the promise, nothing handles the rejection, and Node's default for an unhandled rejection is to crash the whole process. One client with a garbage token takes your server down. Check tokens in `server.use()` middleware, as in the gateway above, where a failure becomes a clean `connect_error`."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the socket outlives the token",
      "blocks": [
        {
          "kind": "text",
          "text": "The JWT is checked once, at the handshake. A socket can stay open for hours, long after a 15-minute access token (Module 18) has expired, or after the user was banned. When the socket connects, start a timer from the token's `exp`, and call `socket.disconnect()` when it runs out. On the client, pass `auth` as a function, so each reconnect sends a fresh token."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Scaling across instances with Redis"
    },
    {
      "kind": "text",
      "text": "Each server only knows its own sockets. Run two instances behind a load balancer, and Alice's socket may live on instance A while her order is updated by a request on instance B. When B runs `server.to('user:alice').emit()`, it reaches nobody: no socket in that room is connected to B."
    },
    {
      "kind": "text",
      "text": "The **Redis adapter** fixes this. Every instance publishes its emits to Redis and listens for everyone else's, so `server.to(room).emit()` reaches that room's sockets on every instance."
    },
    {
      "kind": "example",
      "code": "npm i @socket.io/redis-adapter redis",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "example",
      "code": "// ── realtime/redis-io.adapter.ts ──\nimport { IoAdapter } from '@nestjs/platform-socket.io';\nimport { createAdapter } from '@socket.io/redis-adapter';\nimport { createClient } from 'redis';\nimport type { Server, ServerOptions } from 'socket.io';\n\nexport class RedisIoAdapter extends IoAdapter {\n  private adapterConstructor: ReturnType<typeof createAdapter>;\n\n  async connectToRedis(url: string): Promise<void> {\n    const pubClient = createClient({ url });\n    const subClient = pubClient.duplicate(); // a subscriber needs its own connection\n    await Promise.all([pubClient.connect(), subClient.connect()]);\n    this.adapterConstructor = createAdapter(pubClient, subClient);\n  }\n\n  createIOServer(port: number, options?: ServerOptions): Server {\n    const server = super.createIOServer(port, options) as Server;\n    server.adapter(this.adapterConstructor); // emits now go through Redis to every instance\n    return server;\n  }\n}\n\n// ── main.ts ──\nimport { ConfigService } from '@nestjs/config';\nimport { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module';\nimport { RedisIoAdapter } from './realtime/redis-io.adapter';\n\nasync function bootstrap(): Promise<void> {\n  const app = await NestFactory.create(AppModule, { rawBody: true }); // rawBody: Module 21's webhooks\n  // …setGlobalPrefix('api') (Module 3), cookieParser() (Module 18) and the rest, as before.\n  // The prefix doesn't touch socket.io: clients still connect to /socket.io/.\n\n  const redisIoAdapter = new RedisIoAdapter(app);\n  await redisIoAdapter.connectToRedis(app.get(ConfigService).getOrThrow<string>('REDIS_URL'));\n  app.useWebSocketAdapter(redisIoAdapter); // before listen()\n\n  await app.listen(3000);\n}\nvoid bootstrap();",
      "label": "the Redis adapter, wired in main.ts"
    },
    {
      "kind": "text",
      "text": "One more piece for production. socket.io starts each connection with HTTP **long-polling**, a series of normal HTTP requests, and then upgrades it to a WebSocket. Those first requests must all reach the same instance, so behind a load balancer you need **sticky sessions**, where the balancer keeps sending one client to one server. Or skip long-polling: set `transports: ['websocket']` in the client, as Exercise 24.1 does."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "When Server-Sent Events are enough"
    },
    {
      "kind": "text",
      "text": "Look at what this gateway really does: the server pushes, and the client listens. Its only client message, `order:watch`, could just as well be a normal `GET`. For one-way updates, **Server-Sent Events** (SSE) are often the simpler choice. SSE is a long-lived HTTP response that the server keeps writing events into. Browsers support it with the built-in `EventSource` API, which reconnects by itself."
    },
    {
      "kind": "example",
      "code": "import { Controller, MessageEvent, Sse } from '@nestjs/common';\nimport { filter, map, Observable } from 'rxjs';\nimport { CurrentUser } from '../auth/current-user.decorator';\nimport { OrderEvents } from './order-events.service';\n\n@Controller('orders')\nexport class OrderEventsController {\n  constructor(private readonly events: OrderEvents) {}\n\n  // GET /api/orders/events: a one-way stream over plain HTTP (Content-Type: text/event-stream).\n  // It's a normal route, so the global JwtAuthGuard protects it like any other.\n  @Sse('events')\n  stream(@CurrentUser('id') userId: string): Observable<MessageEvent> {\n    return this.events.changes$.pipe(\n      filter((e) => e.userId === userId), // only this user's orders\n      map((e) => ({ type: 'order:status', data: { orderId: e.orderId, status: e.status } })),\n    );\n    // Nest unsubscribes when the client goes away, so nothing leaks.\n  }\n}",
      "label": "src/orders/order-events.controller.ts"
    },
    {
      "kind": "text",
      "text": "Each change reaches the browser as three lines: `event: order:status`, an `id:` that Nest numbers for you, and `data:` with the JSON. The global JWT guard protects the route like any other, because it *is* a normal HTTP route."
    },
    {
      "kind": "table",
      "head": [
        "",
        "WebSockets (socket.io)",
        "Server-Sent Events"
      ],
      "rows": [
        [
          "Direction",
          "Both ways",
          "Server to client only"
        ],
        [
          "Protocol",
          "Its own, after an HTTP upgrade",
          "Plain HTTP"
        ],
        [
          "Auth and guards",
          "Handshake middleware and `WsException`",
          "Your normal HTTP guards"
        ],
        [
          "Reconnecting",
          "socket.io does it",
          "The browser's `EventSource` does it"
        ],
        [
          "Several instances",
          "The Redis adapter, plus sticky sessions or WebSocket-only",
          "Each instance needs every event: feed the stream from Redis pub/sub"
        ],
        [
          "Good for",
          "Chat, collaborative editing, games",
          "Order status, notifications, dashboards, progress bars"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Two SSE details. A browser `EventSource` can't set an `Authorization` header, so SSE usually relies on a cookie session or a fetch-based client. And with several instances, the stream above only sees events from its own instance's `Subject`, so feed it from Redis pub/sub when you scale out.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "You know most of this already. A gateway is RxJS underneath: Nest wraps each message type in `fromEvent()` and ends it with `takeUntil()` when the socket disconnects, the same pattern you use to clean up subscriptions in Angular components. A handler may even return an Observable of `{ event, data }` objects, and Nest sends each one to the client."
        },
        {
          "kind": "text",
          "text": "`@Sse()` takes an Observable directly, and Nest unsubscribes when the client goes away. On the Angular side, wrap the socket or the `EventSource` in an Observable inside a service, and your components can use the `async` pipe as usual."
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "Your app runs on two instances behind a load balancer, with no Redis adapter. Alice's socket is connected to instance A. A request on instance B ships her order, and B runs `server.to('user:alice').emit('order:status', …)`. What does Alice see?",
      "options": [
        "The update, because socket.io finds her socket on instance A",
        "Nothing: B only knows its own sockets, and none of them is in that room",
        "An `exception` event, because the room doesn't exist on B",
        "The update twice, once from each instance"
      ],
      "answer": 1,
      "why": "**Nothing.** Rooms live in each server's memory. B has no socket in `user:alice`, so its emit goes nowhere, and nothing reports an error. The Redis adapter shares every emit through Redis, so B's emit also reaches the room's sockets on A. The same goes for `server.emit()` to everyone: without the adapter, \"everyone\" means everyone on this instance."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 24.1",
      "title": "Be your own client",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a small Node script with `socket.io-client` that connects the way a browser would. Try it with no token, with a garbage token, and with a real one from your login endpoint. With the real token, send `order:watch` for one of your orders, for an invalid ID, and for another user's order. Then change the order's status through your HTTP API and watch the push arrive. Predict each result first."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// npm i -D socket.io-client\n// npx ts-node scripts/ws-client.ts <token> <orderId>\nimport { io } from 'socket.io-client';\n\nconst [token, orderId] = process.argv.slice(2);\n\nconst socket = io('http://localhost:3000', {\n  auth: { token }, // sent once, inside the handshake\n  transports: ['websocket'], // skip the HTTP long-polling start\n});\n\nsocket.on('connect', () => {\n  console.log('connected', socket.id);\n  socket.emit('order:watch', { orderId }); // the reply arrives as an 'order:status' event\n  socket.emit('order:watch', { orderId: 'not-a-uuid' }); // → an 'exception' event\n});\nsocket.on('connect_error', (err) => console.log('rejected:', err.message));\nsocket.on('order:status', (data: unknown) => console.log('order:status', data));\nsocket.on('exception', (err: unknown) => console.log('exception', JSON.stringify(err)));",
              "label": "scripts/ws-client.ts"
            },
            {
              "kind": "table",
              "head": [
                "What you do",
                "What the client sees"
              ],
              "rows": [
                [
                  "Connect with no token, or a garbage one",
                  "`rejected: unauthorized`, and the server keeps running"
                ],
                [
                  "`order:watch` for your own order",
                  "`order:status` with its current status"
                ],
                [
                  "`order:watch` with `not-a-uuid`",
                  "`exception {\"status\":\"error\",\"message\":[\"orderId must be a UUID\"]}`"
                ],
                [
                  "`order:watch` for another user's order",
                  "`exception` with `\"message\":\"Order not found\"`"
                ],
                [
                  "Ship the order over HTTP",
                  "`order:status` with `\"status\":\"shipped\"`, pushed without asking"
                ]
              ]
            },
            {
              "kind": "text",
              "text": "Look at rows three and four. The validation message is readable only because of the `exceptionFactory`. And \"not found\" for someone else's order means a curious user learns nothing about other people's orders, not even that they exist.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q43",
      "title": "How do you authenticate WebSocket connections in NestJS?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** At the handshake, once per connection. The client sends the JWT in socket.io's `auth` payload, not in the URL, where it would end up in logs. On the server, I register socket.io middleware in the gateway's `afterInit()` with `server.use()`. It verifies the token with `JwtService`, turns its claims into the same `AuthUser` the HTTP guard builds, and stores that on `socket.data.user`. Otherwise it calls `next(new Error('unauthorized'))`, and the client gets a `connect_error`. Then `handleConnection()` can trust `socket.data.user` and join the user's room."
        },
        {
          "kind": "text",
          "text": "Things I'd mention: `@UseGuards()` on a gateway only wraps message handlers, never the connection, so a guard alone authenticates nothing. An async `handleConnection()` that throws becomes an unhandled rejection and can crash the process. Per-message authorization uses guards with `switchToWs()` and `WsException`. Global guards and pipes don't apply to gateways, so I bind them on the gateway. And because a socket outlives its token, I disconnect at the token's expiry and let the client reconnect with a fresh one."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q44",
      "title": "How do you scale WebSockets across several instances, and when would you use SSE instead?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Rooms and sockets live in each process's memory, so with two instances an emit on one never reaches clients on the other. The fix is the socket.io Redis adapter: a custom `IoAdapter` that connects a pub and a sub Redis client and calls `server.adapter(createAdapter(pub, sub))`, installed with `app.useWebSocketAdapter()`. Every emit then goes through Redis to all instances. Socket.io's long-polling start also needs sticky sessions at the load balancer, unless clients use `transports: ['websocket']`."
        },
        {
          "kind": "text",
          "text": "I choose SSE when traffic is one-way, from server to client: order status, notifications, progress bars. It's plain HTTP, so my normal guards, CORS and load balancers just work, and `EventSource` reconnects on its own. In Nest it's an `@Sse()` route that returns an Observable. With several instances, each one must hear every event, so I feed the stream from Redis pub/sub. I keep WebSockets for real two-way traffic, like chat or collaborative editing."
        }
      ]
    },
    {
      "kind": "text",
      "text": "That completes Level 6. Your shop now has typed config and module borders, reusable modules, files and webhooks, a Redis cache, background jobs and live updates. Next, Module 25 starts the final level: testing everything you've built, then security, performance and shipping it to production."
    }
  ]
};
