import { Lesson } from '../../shared/content';

export const M27_PERFORMANCE: Lesson = {
  "slug": "m27-performance",
  "title": "M27 Performance and the event loop",
  "nav": "Performance",
  "num": "M27",
  "eyebrow": "Level 7 · Week 15 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Node runs your JavaScript on **one main thread**. The **event loop** is the part of Node that picks the next piece of ready work, such as a new request, a finished database query or a timer, and runs it to the end before it picks the next one. Waiting is cheap: while a query runs in Postgres, the thread serves other requests. Computing is not: while your code runs a long calculation, nothing else runs at all."
    },
    {
      "kind": "text",
      "text": "That one fact explains most performance problems in a Nest app. Most of the rest are the database. This module shows how to keep the event loop free, how to measure before you change anything, and how to grow beyond one process."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Node does one piece of JavaScript at a time. If one request does heavy work, every other request waits for it. Measure first, keep heavy work off the main thread, and run more copies of the app when one is not enough."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What blocks the event loop"
    },
    {
      "kind": "text",
      "text": "A **blocking** call keeps the main thread busy until it finishes. In a request handler, every millisecond of blocking is added to *every* request that arrives while it runs. The usual suspects:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Sync APIs**: anything ending in `Sync`, such as `readFileSync`, `pbkdf2Sync`, `scryptSync` or `bcrypt.hashSync`. Fine in a startup script; wrong in a handler.",
        "**Heavy CPU work**: resizing images, building PDFs, hashing with a high cost factor, sorting or grouping hundreds of thousands of rows in JavaScript.",
        "**Huge JSON**: `JSON.parse()` and `JSON.stringify()` are synchronous. Turning 200,000 orders into one response string can block for hundreds of milliseconds, and it holds a lot of memory too.",
        "**Unsafe regular expressions**: a pattern with nested repeats, such as `(a+)+$`, can take seconds on a carefully chosen input. This attack is called **ReDoS**, regular expression denial of service."
      ]
    },
    {
      "kind": "example",
      "code": "import * as bcrypt from 'bcrypt';\n\nasync register(dto: RegisterDto) {\n  // A few hundred milliseconds of pure CPU, on the main thread.\n  // Twenty sign-ups at once freeze the server for seconds, for everyone,\n  // including people who are only browsing products.\n  const passwordHash = bcrypt.hashSync(dto.password, BCRYPT_COST);   // 12, as in Module 17\n  return this.users.save(this.users.create({ email: dto.email, passwordHash }));\n}",
      "label": "auth/auth.service.ts — register(), shortened",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "import * as bcrypt from 'bcrypt';\n\nasync register(dto: RegisterDto) {\n  // The async version hashes on libuv's thread pool, off the main thread.\n  // The event loop keeps serving other requests while it works.\n  const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);\n  return this.users.save(this.users.create({ email: dto.email, passwordHash }));\n}",
      "label": "auth/auth.service.ts — register(), shortened",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Node's async crypto, compression and file functions run on **libuv's thread pool**; libuv is the C library under Node that does the actual I/O. The pool has only 4 threads by default (set by `UV_THREADPOOL_SIZE`), so a flood of hashing still queues up. It just stops freezing everything else while it waits. Both examples are shortened: Module 17's full `register()` also turns a duplicate email into a `409` with the code `EMAIL_TAKEN`, and returns the user without the hash.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the Sync you didn't write",
      "blocks": [
        {
          "kind": "text",
          "text": "Sync calls hide in places you don't look: a config helper that calls `readFileSync` on every request, a utility that uses `crypto.pbkdf2Sync`, a library that hashes or compresses synchronously inside. Search your `src` folder for `Sync(` now and then. At startup, sync calls are fine. In anything a request can reach, use the async version or move the work somewhere else."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "In the browser, a long task freezes the page for one user; you've seen it as a janky UI. In Node, the same long task freezes the server for every user at once. The fix is the same idea as a Web Worker: move heavy work off the main thread with `worker_threads`, or out of the process entirely with a queue."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Huge responses: page them, or move them off the request"
    },
    {
      "kind": "example",
      "code": "@Get('export')\nasync exportAll() {\n  const orders = await this.orders.findAll();   // 200,000 rows into memory...\n  return orders;                                // ...then one giant JSON.stringify on the main thread\n}",
      "label": "orders/orders.controller.ts — everything, in one response",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "@Get()\nfindMine(@CurrentUser('id') userId: string) {\n  return this.orders.findMine(userId);         // Module 16: one page of 20, newest first\n}\n\n@Post('export')\n@HttpCode(202)                                  // 202 Accepted: \"started, not finished\"\nasync requestExport(@CurrentUser('id') userId: string) {\n  // BullMQ (Module 23): a worker builds the file and emails a link (Module 21)\n  const job = await this.exportsQueue.add('orders-csv', { userId });\n  return { jobId: job.id };\n}",
      "label": "orders/orders.controller.ts — pages, and a background export",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Two fixes cover almost every case. Lists get pagination with a hard ceiling, so no single response is huge. Big exports become a background job: the API answers in milliseconds, and the heavy work runs in a worker that can't slow down live traffic. For CPU work that must answer straight away, Node's `worker_threads` module runs JavaScript on another thread, and a pool library such as `piscina` manages those threads for you.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Measure before you optimise"
    },
    {
      "kind": "text",
      "text": "Guesses about performance are usually wrong. Measure first, change one thing, then measure again. Three numbers matter. **Throughput** is requests per second. **Latency percentiles** describe how long requests take: p99 is the time that 99% of requests finish within, so it shows what your slowest real users see. **Event loop delay** is how late the loop is in starting work that is ready to run; in a healthy API it stays at a few milliseconds."
    },
    {
      "kind": "example",
      "code": "import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';\nimport { monitorEventLoopDelay } from 'node:perf_hooks';\n\n@Injectable()\nexport class EventLoopMonitor implements OnModuleInit, OnModuleDestroy {\n  private readonly logger = new Logger(EventLoopMonitor.name);\n  private readonly histogram = monitorEventLoopDelay({ resolution: 20 });  // samples every 20 ms\n  private timer?: NodeJS.Timeout;\n\n  onModuleInit() {\n    this.histogram.enable();\n\n    this.timer = setInterval(() => {\n      const p99 = this.histogram.percentile(99) / 1e6;      // nanoseconds → milliseconds\n      if (p99 > 50) this.logger.warn(`event loop delay p99 = ${p99.toFixed(1)} ms`);\n      this.histogram.reset();\n    }, 10_000);\n    this.timer.unref();                                     // never keep the process alive\n  }\n\n  onModuleDestroy() {\n    clearInterval(this.timer);\n    this.histogram.disable();\n  }\n}",
      "label": "common/event-loop-monitor.ts"
    },
    {
      "kind": "example",
      "code": "# 1. Measure what production runs: a build, not `start:dev`\nnpm run build\nNODE_ENV=production node dist/main.js\n\n# 2. In a second terminal: 100 connections for 30 seconds\nnpx autocannon -c 100 -d 30 http://localhost:3000/api/products\n#    read three numbers: Req/Sec, the 99% latency, and the errors\n\n# 3. Find out where the CPU time goes\nnode --inspect dist/main.js\n#    open chrome://inspect, pick your app, and record in the Performance panel\n#    while autocannon runs\n\n#    or V8's built-in profiler, no browser needed:\nnode --prof dist/main.js            # load-test it, then stop it\nnode --prof-process isolate-*.log > profile.txt",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "**autocannon** is a load-testing tool written for Node. A **profile** shows which functions used the CPU, and for how long. Clinic.js used to be the friendly wrapper for this kind of diagnosis, but its README now says it isn't actively maintained, so start with Node's own tools.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · measuring the wrong thing",
      "blocks": [
        {
          "kind": "text",
          "text": "A benchmark of `npm run start:dev` measures the TypeScript watcher, source maps and debug logging, not your app. Measure a production build with production settings (`NODE_ENV=production`, the real log level), against a database with realistic amounts of data: a query that's instant on 50 rows can take seconds on 5 million. Run the load generator on another machine when you can, too. autocannon on the same laptop competes with your app for the CPU."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Fastify and compression"
    },
    {
      "kind": "text",
      "text": "Nest runs on Express by default. Swapping to the **Fastify** adapter cuts the framework's own overhead: Nest's docs say Fastify gets almost twice Express's results in benchmarks. In a real API, though, most of the time goes to the database, so the gain is often small. Measure your own endpoints before you switch. Express middleware doesn't run on Fastify, so you swap `helmet` for `@fastify/helmet`, `compression` for `@fastify/compress`, and so on."
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/platform-fastify@11 @fastify/helmet @fastify/compress",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "**Version note.** `@11` installs the release line made for Nest 11. Nest 12 is out, so without the pin npm now fetches the Nest 12 version of `@nestjs/platform-fastify`, whose peer dependencies don't match your Nest 11 packages, and stops with an `ERESOLVE` error.",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';\nimport compression from '@fastify/compress';\nimport helmet from '@fastify/helmet';\nimport { AppModule } from './app.module';\n\nasync function bootstrap() {\n  const app = await NestFactory.create<NestFastifyApplication>(\n    AppModule,\n    new FastifyAdapter({ trustProxy: 1 }),     // Fastify's version of Express's 'trust proxy'\n  );\n\n  await app.register(helmet);\n  await app.register(compression, { encodings: ['gzip', 'deflate'] });  // the cheaper encodings\n\n  // Fastify listens on 127.0.0.1 by default, which can't be reached from outside a container\n  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');\n}\nbootstrap();",
      "label": "main.ts — the Fastify adapter"
    },
    {
      "kind": "text",
      "text": "**Compression** shrinks responses, trading CPU for bandwidth, and that CPU work runs on the main thread too. It's worth it for large JSON over slow networks. Under heavy traffic, Nest's docs recommend compressing in a reverse proxy such as Nginx, or at a CDN, instead of in Node. On Express, the package is `compression`, used as `app.use(compression())`.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The database is usually the bottleneck"
    },
    {
      "kind": "text",
      "text": "When an endpoint is slow, look at its queries first. The usual causes are the ones from Module 16: **N+1 queries** (one query for a list, then one more query per item), missing indexes, loading whole rows and relations you don't use, and no pagination. Three settings make these problems visible and keep them in check:"
    },
    {
      "kind": "example",
      "code": "TypeOrmModule.forRootAsync({\n  inject: [ConfigService],\n  useFactory: (config: ConfigService) => ({\n    type: 'postgres',\n    url: config.getOrThrow<string>('DATABASE_URL'),\n    autoLoadEntities: true,\n    maxQueryExecutionTime: 200,          // log every query slower than 200 ms\n    poolSize: config.getOrThrow<number>('DATABASE_POOL_SIZE'),  // max connections per instance (Module 19: default 10)\n    extra: { statement_timeout: 5_000 }, // Postgres cancels any query running over 5 s\n  }),\n}),",
      "label": "app.module.ts — TypeORM options worth setting"
    },
    {
      "kind": "text",
      "text": "Watch the pool maths when you scale out: 10 replicas with a pool of 20 each is 200 connections, and Postgres allows 100 by default. Past that point, add a connection pooler such as PgBouncer instead of raising the numbers. And before you tune code, ask whether the answer can simply be cached: Module 22's Redis cache turns a slow query into a lookup of a millisecond or two for every request after the first.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Scaling out: stateless replicas"
    },
    {
      "kind": "text",
      "text": "**Scaling up** means a bigger machine; **scaling out** (also called horizontal scaling) means more copies of the app. One Node process uses one CPU core for your JavaScript, so to use more cores or more machines, you run several copies, called **replicas**, behind a load balancer. That only works if the app is **stateless**: any replica can serve any request, because nothing important lives in one process's memory or disk."
    },
    {
      "kind": "table",
      "head": [
        "State",
        "Breaks with replicas",
        "Works with replicas"
      ],
      "rows": [
        [
          "Login sessions",
          "An in-memory session store",
          "JWTs (Module 17), or sessions in Redis"
        ],
        [
          "Cache",
          "A `Map` inside a service",
          "Redis (Module 22)"
        ],
        [
          "Rate-limit counters",
          "The throttler's default in-memory storage",
          "A Redis storage for the throttler (Module 26)"
        ],
        [
          "Uploaded files",
          "The container's local disk",
          "Object storage such as S3 (Module 21)"
        ],
        [
          "WebSocket rooms",
          "One server's list of sockets",
          "The Redis adapter (Module 24)"
        ],
        [
          "Scheduled jobs",
          "A `@Cron()` that runs once in every replica",
          "One scheduler, such as BullMQ repeatable jobs (Module 23)"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Prefer one Node process per container, and let your platform add containers. Avoid Node's `cluster` module or PM2's cluster mode inside one container. The platform already knows how to restart, spread and scale processes, and each replica stays simple to reason about."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · state that lives in one process",
      "blocks": [
        {
          "kind": "text",
          "text": "Everything works on one instance. Then you scale to three, and the strange bugs start: users get logged out at random, a cache returns old data after an update, the rate limit is three times too generous, and an uploaded file returns `404` two times out of three. Each one is state living in one process's memory or disk. Go through the table above before you add the second replica, not after."
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "Each request to `/reports/summary` does 300 ms of pure CPU work. Ten requests arrive at the same moment, on one Node process. Roughly when does the tenth one get its answer?",
      "options": [
        "After about 300 ms, because Node runs them in parallel",
        "After about 3 seconds",
        "After about 30 ms, because the work is split ten ways",
        "It depends on the size of the database connection pool"
      ],
      "answer": 1,
      "why": "**After about 3 seconds.** CPU work runs on the one main thread from start to finish, so the ten requests take turns: 10 × 300 ms. Worse, every *other* request waits behind them too, including cheap ones like `GET /health`. Parallelism in Node comes from I/O (the database, the network, the thread pool) or from extra threads and processes that you add on purpose. The pool size doesn't matter here, because no query is involved."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 27.1",
      "title": "Watch one slow route slow everything down",
      "blocks": [
        {
          "kind": "text",
          "text": "Add two `@Public()` routes, so autocannon needs no token: `GET /ping`, which returns `{ ok: true }`, and `GET /reports/slow`, which computes `fib(38)` with the naive recursive function; pick the number that takes about half a second on your machine. Add the `EventLoopMonitor` above. Build the app and run it with `node dist/main.js`. In one terminal, load-test the cheap route: `npx autocannon -c 20 -d 20 http://localhost:3000/api/ping`. While that runs, call `/api/reports/slow` in a loop from a second terminal. Note the ping route's p99 latency and the event loop delay before and during. Then move `fib` to a worker thread and measure again."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "Before the fix, the ping route's p99 jumps from a few milliseconds to about the length of one `fib` call, and the monitor logs delays of hundreds of milliseconds. The ping route's code didn't change at all; it simply waited behind the slow one. After the fix, its latency barely moves, because the main thread now only waits for a message."
            },
            {
              "kind": "example",
              "code": "// reports/fib.worker.ts: runs on its own thread, with its own event loop\nimport { parentPort, workerData } from 'node:worker_threads';\n\nconst fib = (n: number): number => (n < 2 ? n : fib(n - 1) + fib(n - 2));\nparentPort?.postMessage(fib(workerData as number));\n\n// reports/reports.service.ts\nimport { Injectable } from '@nestjs/common';\nimport { Worker } from 'node:worker_threads';\nimport { join } from 'node:path';\n\n@Injectable()\nexport class ReportsService {\n  slowFib(n: number): Promise<number> {\n    return new Promise((resolve, reject) => {\n      // nest build compiles the worker to dist/reports/fib.worker.js, next to this file\n      const worker = new Worker(join(__dirname, 'fib.worker.js'), { workerData: n });\n      worker.once('message', resolve);\n      worker.once('error', reject);\n    });\n  }\n}",
              "label": "reports/fib.worker.ts + reports/reports.service.ts"
            },
            {
              "kind": "text",
              "text": "Starting a new thread for every request costs a few milliseconds and some memory, which is fine for an exercise. For real traffic, use a pool such as `piscina`, or a BullMQ worker when the caller doesn't need the answer straight away. (`__dirname` exists in CommonJS builds, the Nest 11 default; an ESM build uses `new URL('./fib.worker.js', import.meta.url)` instead.)",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q49",
      "title": "Node is single-threaded. How does a Nest app serve thousands of requests at once, and what breaks that?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Your JavaScript runs on one thread, but most of a request's time is spent waiting: for Postgres, for Redis, for another API. Node hands that waiting to the operating system or to libuv's thread pool and keeps the main thread free, and the event loop runs each callback when its I/O completes. So one process can have thousands of requests in flight, as long as each one only uses the thread in short bursts."
        },
        {
          "kind": "text",
          "text": "What breaks it is anything that holds the thread: synchronous APIs like `readFileSync` or `bcrypt.hashSync`, CPU-heavy work like image processing or big in-memory sorting, huge `JSON.stringify` calls, and catastrophic regular expressions. While one of those runs, every request on that process waits, health checks included, so latency spikes for everyone, and the platform may even restart a healthy instance. The fixes are async APIs, pagination, moving CPU work to worker threads or a queue, and scaling out with stateless replicas. I track event loop delay as a metric, because it shows the problem before users report it."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q50",
      "title": "An endpoint is slow in production. How do you find out why?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I measure before touching code. First I find *which* part is slow: request logs with durations and a request id, p95 and p99 latency per route, and ideally a trace that splits the time between the handler, each SQL query and each outgoing call. Most of the time that points at the database: an N+1 query, a missing index, an unbounded list. I'd confirm with TypeORM's slow-query logging and `EXPLAIN ANALYZE` on the real query, with real data volumes."
        },
        {
          "kind": "text",
          "text": "If the database is fine, I look at the process: event loop delay, to see whether something is blocking, then a CPU profile from `--inspect` or `--prof`, taken on a production build under realistic load from autocannon. Then I make one change at a time and measure each one: fix the query or add the index, cache what can be cached, page what's unbounded, move CPU work off the main thread. If a single process is simply at capacity, I scale out, which only works if the app keeps no state in memory."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 28: API docs, logging and health checks, the tools that let other people use your API and let you see what it's doing in production."
    }
  ]
};
