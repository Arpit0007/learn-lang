import { Lesson } from '../../shared/content';

export const M23_QUEUES_SCHEDULING: Lesson = {
  "slug": "m23-queues-scheduling",
  "title": "M23 Queues and scheduled jobs",
  "nav": "Queues & scheduling",
  "num": "M23",
  "eyebrow": "Level 6 · Week 13 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Some work should not happen while the user waits. Sending an email takes a second and sometimes fails. Building a PDF invoice takes three. A slow partner API can take ten. Do that work inside the request, and the user waits for it. If it fails, their order fails with it, all because of an email."
    },
    {
      "kind": "text",
      "text": "A **queue** fixes this. The request adds a **job**, a small note like \"send the confirmation for order 42\", to a list in Redis, and returns at once. A separate **worker** takes jobs from the list and does them, and it tries again when one fails."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Put slow or unreliable work in a queue, and answer the user straight away. A worker does the job later, and tries again if it fails. Write every job so that running it twice does no harm."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Why background jobs"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Faster responses.** Placing an order takes 50 ms instead of 1.5 s, because the email isn't sent yet.",
        "**Retries.** A failed job is tried again later, with no retry code in your request handler.",
        "**Smoother spikes.** If 500 orders arrive in a minute but your email service accepts 10 a second, the queue holds the rest. You decide how many jobs run at once.",
        "**It survives restarts.** Jobs live in Redis, not in your process's memory, so a deploy doesn't lose them.",
        "**Looser coupling.** Orders only say \"an order was placed\". They never call the email code. This is the \"event instead of a call\" from Modules 4 and 20."
      ]
    },
    {
      "kind": "table",
      "head": [
        "Word",
        "Meaning"
      ],
      "rows": [
        [
          "Producer",
          "The code that adds a job, such as `NotificationsService`"
        ],
        [
          "Queue",
          "A named list of jobs in Redis, such as `emails`"
        ],
        [
          "Job",
          "A name, some data, and options such as how many times to retry"
        ],
        [
          "Worker (processor)",
          "The code that takes jobs and runs them, such as `EmailsProcessor`"
        ]
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Setup: @nestjs/bullmq"
    },
    {
      "kind": "text",
      "text": "**BullMQ** is the standard Node queue library on top of Redis, and `@nestjs/bullmq` plugs it into Nest. Pin `@11`, the release made for Nest 11:"
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/bullmq@11 bullmq ioredis",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "Why `ioredis`? BullMQ talks to Redis through it. BullMQ 6 made it an optional extra, so that it can also use other Redis clients, which means you now install it yourself. BullMQ 5 bundled it, so this line works for both.",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "import { BullModule } from '@nestjs/bullmq';\nimport { Module } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport type { Env } from './config/env.validation';\nimport { NotificationsModule } from './notifications/notifications.module';\n\n@Module({\n  imports: [\n    // ConfigModule.forRoot({ ... }) from Module 19 goes here\n    BullModule.forRootAsync({\n      inject: [ConfigService],\n      useFactory: (config: ConfigService<Env, true>) => ({\n        connection: { url: config.get('REDIS_URL', { infer: true }) },\n        defaultJobOptions: {\n          attempts: 5, // one try and four retries\n          backoff: { type: 'exponential', delay: 1000 }, // wait 1 s, 2 s, 4 s, 8 s\n          removeOnComplete: { age: 24 * 3600, count: 1000 }, // seconds: keep a day, at most 1,000 jobs\n          removeOnFail: { age: 7 * 24 * 3600 }, // keep failures a week, to inspect and retry\n        },\n      }),\n    }),\n    NotificationsModule,\n  ],\n})\nexport class AppModule {}",
      "label": "src/app.module.ts (excerpt)"
    },
    {
      "kind": "text",
      "text": "`defaultJobOptions` apply to every job unless the job sets its own. Watch the units: the backoff `delay` is in milliseconds, but `age` in `removeOnComplete` and `removeOnFail` is in seconds."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A producer and a worker"
    },
    {
      "kind": "text",
      "text": "Keep a queue inside the module that owns the work. Here `NotificationsModule` owns the `emails` queue and exports one small service. The orders controller calls `notifications.orderPlaced(order.id, user.email)` right after `place()` returns, so after the commit, with the email of the logged-in user from `@CurrentUser()`. Module 21's webhook calls `orderPaid()` the same way. Neither ever sees the queue: the public-API rule from Module 19."
    },
    {
      "kind": "example",
      "code": "// ── notifications/notifications.module.ts ──\nimport { BullModule } from '@nestjs/bullmq';\nimport { Module } from '@nestjs/common';\nimport { MailModule } from '../mail/mail.module';\nimport { EmailsProcessor } from './emails.processor';\nimport { EMAILS_QUEUE } from './notifications.constants';\nimport { NotificationsService } from './notifications.service';\nimport { SentEmailLog } from './sent-email-log';\n\n@Module({\n  imports: [BullModule.registerQueue({ name: EMAILS_QUEUE }), MailModule],\n  providers: [NotificationsService, EmailsProcessor, SentEmailLog],\n  exports: [NotificationsService], // the public API: \"tell me what happened\"\n})\nexport class NotificationsModule {}\n\n// ── notifications/notifications.service.ts ──\nimport { InjectQueue } from '@nestjs/bullmq';\nimport { Injectable } from '@nestjs/common';\nimport { Queue } from 'bullmq';\nimport { EMAILS_QUEUE, type OrderEmailJob } from './notifications.constants';\n\n@Injectable()\nexport class NotificationsService {\n  constructor(@InjectQueue(EMAILS_QUEUE) private readonly emails: Queue<OrderEmailJob>) {}\n\n  /** Call AFTER the order's transaction has committed. Each call returns in a millisecond or two. */\n  async orderPlaced(orderId: string, email: string): Promise<void> {\n    // The job's name tells the worker what to send. One job per order: a second add() is ignored.\n    await this.emails.add('order-confirmation', { orderId, email }, { jobId: `order-confirmation-${orderId}` });\n  }\n\n  /** Module 21's webhook calls this once markPaid() has changed the order. */\n  async orderPaid(orderId: string, email: string): Promise<void> {\n    await this.emails.add('payment-received', { orderId, email }, { jobId: `payment-received-${orderId}` });\n  }\n}",
      "label": "src/notifications/ — the producer side"
    },
    {
      "kind": "example",
      "code": "import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';\nimport { Logger } from '@nestjs/common';\nimport { Job, UnrecoverableError } from 'bullmq';\nimport { MailSender } from '../mail/mail-sender';\nimport { EMAILS_QUEUE, type OrderEmailJob } from './notifications.constants';\nimport { SentEmailLog } from './sent-email-log';\n\n@Processor(EMAILS_QUEUE, { concurrency: 5 }) // up to 5 jobs at the same time in this process\nexport class EmailsProcessor extends WorkerHost {\n  private readonly logger = new Logger(EmailsProcessor.name);\n\n  constructor(\n    private readonly mail: MailSender,\n    private readonly sentLog: SentEmailLog,\n  ) {\n    super();\n  }\n\n  async process(job: Job<OrderEmailJob>): Promise<void> {\n    switch (job.name) {\n      case 'order-confirmation':\n        return this.sendOnce(job.name, job.data, 'confirmed', \"Thanks! We're packing your order.\");\n      case 'payment-received':\n        return this.sendOnce(job.name, job.data, 'paid', 'We have your payment. Thank you!');\n      default:\n        throw new UnrecoverableError(`Unknown job name: ${job.name}`); // retrying won't fix this\n    }\n  }\n\n  private async sendOnce(kind: string, { orderId, email }: OrderEmailJob, what: string, text: string): Promise<void> {\n    const key = `${kind}:${orderId}`;\n    if (await this.sentLog.has(key)) return; // sent before: this is a retry or a duplicate\n    await this.mail.send({ to: email, subject: `Order ${orderId.slice(0, 8)} ${what}`, text });\n    await this.sentLog.record(key);\n  }\n\n  // Fires after EVERY failed attempt, including the ones that will be retried.\n  @OnWorkerEvent('failed')\n  onFailed(job: Job<OrderEmailJob> | undefined, error: Error): void {\n    if (!job) return;\n    const willRetry = job.attemptsMade < (job.opts.attempts ?? 1) && !(error instanceof UnrecoverableError);\n    if (willRetry) {\n      this.logger.warn(`job ${job.id}: attempt ${job.attemptsMade} failed, will retry (${error.message})`);\n    } else {\n      // Out of attempts. The job now waits in the \"failed\" set: make sure a person hears about it.\n      this.logger.error(`job ${job.id} failed for good after ${job.attemptsMade} attempts: ${error.message}`);\n    }\n  }\n}",
      "label": "src/notifications/emails.processor.ts — the worker side"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`@Processor('emails')` creates a BullMQ worker for that queue, and Nest calls `process()` once per job. `WorkerHost` is the base class that connects the two.",
        "The job carries everything it needs: the order ID and the email address. The worker never calls `OrdersModule`, so the two modules don't form a loop (Module 20).",
        "`concurrency: 5` lets this process run five jobs at once. Start more instances of the app, and you get more workers on the same queue."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Retries with backoff"
    },
    {
      "kind": "text",
      "text": "With `attempts: 5` and an exponential backoff of 1 s, a failing job runs up to five times, and BullMQ doubles the wait each time: 1 s, 2 s, 4 s, 8 s. Add `jitter`, a number from 0 to 1, to spread retries out, so that 1,000 jobs that failed together don't all retry in the same second."
    },
    {
      "kind": "table",
      "head": [
        "The failure",
        "Retry?",
        "How"
      ],
      "rows": [
        [
          "A timeout, a network error, a provider saying \"try later\"",
          "Yes",
          "Throw a normal `Error`. BullMQ retries it with backoff."
        ],
        [
          "Bad data: an invalid email, an unknown job name",
          "No",
          "Throw `UnrecoverableError`. The job goes straight to failed."
        ],
        [
          "A bug in your code",
          "Retrying won't help",
          "Fix it and deploy, then retry the failed jobs."
        ]
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Idempotency: a job may run twice"
    },
    {
      "kind": "text",
      "text": "BullMQ promises **at-least-once** delivery: every job runs, but some run more than once. A worker can crash after sending the email but before marking the job done. BullMQ notices that the job's lock has expired, after about 30 seconds, and runs it again. A retry after a partial success has the same effect."
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "The one rule for jobs",
      "blocks": [
        {
          "kind": "text",
          "text": "BullMQ runs every job *at least* once, not exactly once. So every job must be **idempotent**: safe to run twice, with the second run changing nothing."
        }
      ]
    },
    {
      "kind": "text",
      "text": "You have two tools for this, and you usually want both:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**A job ID** stops duplicate *adds*. `jobId: 'order-confirmation-42'` means a second `add()` for that order is ignored while the first job still exists.",
        "**A check inside the job** stops duplicate *effects*. The worker above records each sent email under a unique key and skips keys it has already seen, like the conditional update in Module 21."
      ]
    },
    {
      "kind": "text",
      "text": "A tiny window remains: a crash between `send()` and `record()` still sends twice. Exactly-once delivery isn't possible over SMTP. If your email provider accepts an idempotency key, pass the same key, and that window closes too.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · `jobId` rules",
      "blocks": [
        {
          "kind": "text",
          "text": "BullMQ rejects some custom IDs. A plain number such as `'42'` throws `Custom Id cannot be integers`, and an ID with a colon, such as `'order:42'`, throws `Custom Id cannot contain :`. Use dashes, as in `order-confirmation-42`. Also, the protection only lasts while the job is kept: once `removeOnComplete` deletes it, the same ID can be added again. For a fixed time window, BullMQ also has a `deduplication` option with its own TTL."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · adding the job inside the transaction",
      "blocks": [
        {
          "kind": "text",
          "text": "Inside `dataSource.transaction(async (tx) => { … })` (Module 16), adding the job feels natural. But the worker can start before the transaction commits and find no order. And if the transaction rolls back, the customer gets an email for an order that doesn't exist. Add the job *after* the commit."
        },
        {
          "kind": "text",
          "text": "If you can't afford to lose even one job when the app crashes between the commit and the `add()`, use the **outbox pattern**: write an `outbox` row in the same transaction, and let a small poller move outbox rows into the queue."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Dead-letter thinking"
    },
    {
      "kind": "text",
      "text": "In many queue systems, a message that fails too often moves to a **dead-letter queue**: a separate place where failed work waits for a person. BullMQ has no separate one. A job that runs out of attempts moves to the queue's **failed** set and stays there. That set is your dead-letter queue, as long as you treat it like one:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Keep failed jobs** long enough to look at them. `removeOnFail: { age: 7 * 24 * 3600 }` above keeps a week.",
        "**Alert** when a job fails for good. The `failed` event fires after every attempt, so check whether retries are left, as `onFailed()` does above.",
        "**Make retrying easy.** After you fix the cause, `job.retry()` moves a failed job back into the queue. A dashboard such as Bull Board lists failed jobs and retries them with a click.",
        "**Decide what the user sees.** If the confirmation never goes out, should the order page say so? Write that down before the first incident, not during it."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Scheduled jobs with @nestjs/schedule"
    },
    {
      "kind": "text",
      "text": "Some work runs on a clock, not on a request: cancel orders that stayed unpaid for 30 minutes, or send a daily sales report. `@nestjs/schedule` runs a method on a **cron** schedule, the classic Unix way of writing \"when\". Pin `@6`, its release for Nest 11:"
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/schedule@6",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "example",
      "code": "import { Injectable, Logger } from '@nestjs/common';\nimport { Cron, CronExpression } from '@nestjs/schedule';\nimport { OrdersService } from './orders.service';\n\n// Needs ScheduleModule.forRoot() in AppModule.\n@Injectable()\nexport class OrdersCleanupTask {\n  private readonly logger = new Logger(OrdersCleanupTask.name);\n\n  constructor(private readonly orders: OrdersService) {}\n\n  // '0 */10 * * * *': second 0 of every 10th minute. The first of the six fields is seconds.\n  @Cron(CronExpression.EVERY_10_MINUTES, {\n    name: 'cancel-unpaid-orders',\n    waitForCompletion: true, // don't start a new run while the last one is still going\n  })\n  async cancelUnpaid(): Promise<void> {\n    // A conditional UPDATE … WHERE status = 'placed' AND \"createdAt\" < now() - 30 min, so a second run changes nothing.\n    const cancelled = await this.orders.cancelUnpaidOlderThan(30 * 60_000);\n    if (cancelled > 0) this.logger.log(`cancelled ${cancelled} unpaid orders`);\n  }\n}",
      "label": "src/orders/orders-cleanup.task.ts"
    },
    {
      "kind": "text",
      "text": "A cron expression lists when to run, field by field: minute, hour, day of the month, month, day of the week. Nest's version accepts an extra first field for seconds, so `'0 */10 * * * *'` means second 0 of every 10th minute. The `CronExpression` enum names the common schedules, so you rarely write them by hand."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · cron on every instance",
      "blocks": [
        {
          "kind": "text",
          "text": "Your app runs on three instances. Each one has its own `ScheduleModule`, so at 3am the daily report runs three times, and the boss gets three emails. The cleanup above is safe, because its `UPDATE` is idempotent, but it still does the work three times. For anything with side effects, pick one of these:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**Run cron in one place.** Switch it with a setting: `ScheduleModule.forRootAsync()` with a factory that returns `{ cronJobs: config.get('RUN_CRON') === 'true' }`, and set `RUN_CRON=true` on one instance only. Simple, but if that instance is down, nothing runs.",
            "**Take a lock.** Before running, try `SET lock:daily-report <id> NX PX 60000` in Redis. Only the instance that gets the lock runs the job.",
            "**Let BullMQ schedule it.** A job scheduler keeps the schedule in Redis and creates one job per run, which exactly one worker takes. This is the best choice once you use BullMQ anyway."
          ]
        }
      ]
    },
    {
      "kind": "example",
      "code": "import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';\nimport { Injectable, OnModuleInit } from '@nestjs/common';\nimport { Job, Queue } from 'bullmq';\nimport { OrdersService } from './orders.service';\n\nexport const MAINTENANCE_QUEUE = 'orders-maintenance'; // BullModule.registerQueue({ name: MAINTENANCE_QUEUE })\n\n// Saves the schedule in Redis. \"Upsert\" means create or update, so every instance can run this safely.\n@Injectable()\nexport class OrdersMaintenanceSchedule implements OnModuleInit {\n  constructor(@InjectQueue(MAINTENANCE_QUEUE) private readonly queue: Queue) {}\n\n  async onModuleInit(): Promise<void> {\n    await this.queue.upsertJobScheduler(\n      'cancel-unpaid-orders', // the scheduler's ID\n      { every: 10 * 60_000 }, // every 10 minutes (or { pattern: '0 3 * * *', tz: 'Europe/Berlin' })\n      { name: 'cancel-unpaid-orders' }, // the job it creates each time\n    );\n  }\n}\n\n// Every instance runs this worker, but each scheduled job is taken by exactly one of them.\n@Processor(MAINTENANCE_QUEUE)\nexport class OrdersMaintenanceProcessor extends WorkerHost {\n  constructor(private readonly orders: OrdersService) {\n    super();\n  }\n\n  async process(job: Job): Promise<void> {\n    if (job.name === 'cancel-unpaid-orders') {\n      await this.orders.cancelUnpaidOlderThan(30 * 60_000);\n    }\n  }\n}",
      "label": "src/orders/orders-maintenance.ts — one schedule for all instances",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "`upsertJobScheduler()` creates the schedule, or updates it if it already exists, so every instance can call it at startup without making copies. Change `every` in the code and deploy, and the stored schedule follows. Each run is a normal job, so it also gets retries, backoff and the failed set for free."
    },
    {
      "kind": "quiz",
      "question": "A worker sends the confirmation email, then crashes before BullMQ marks the job as done. What happens next?",
      "options": [
        "Nothing: the email went out, so BullMQ treats the job as complete",
        "The job is lost, because it was already taken off the queue",
        "After the job's lock expires, BullMQ runs it again, so without a check inside the job the customer gets a second email",
        "BullMQ moves the job straight to the failed set and waits for a person"
      ],
      "answer": 2,
      "why": "**It runs again.** A worker holds a lock on each job it is running, and keeps renewing it. When the worker dies, the lock expires, after about 30 seconds by default. BullMQ's stalled-job check notices, and the job goes back into the queue. That is the at-least-once promise: no job is lost, but some run twice. Only the check inside the job, the sent-email log, stops the second email. (If one job stalls more often than `maxStalledCount` allows, 1 by default, BullMQ moves it to failed instead.)"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 23.1",
      "title": "Watch retries happen",
      "blocks": [
        {
          "kind": "text",
          "text": "Swap in a mail sender that fails twice and then works, and place an order. Before you look at the logs, write down when each attempt should happen. Next, make `sendConfirmation()` throw `UnrecoverableError` when the address has no `@`, and place an order with such an address. Finally, answer this: why must `SentEmailLog` be a database table, not a `Set` in memory?"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { Logger } from '@nestjs/common';\nimport { MailSender, type MailMessage } from './mail-sender';\n\n/** For the exercise only: fails the first two calls, then works. */\nexport class FlakyMailSender extends MailSender {\n  private readonly logger = new Logger('FlakyMail');\n  private calls = 0;\n\n  async send(message: MailMessage): Promise<void> {\n    this.calls++;\n    this.logger.log(`call ${this.calls} at ${new Date().toISOString()}`);\n    if (this.calls <= 2) throw new Error(`SMTP timeout (call ${this.calls})`);\n    this.logger.log(`sent to ${message.to}`);\n  }\n}\n\n// In MailModule, for the experiment:\n//   providers: [{ provide: MailSender, useClass: FlakyMailSender }]\n//\n// And in EmailsProcessor.sendOnce(), before sending:\n//   if (!email.includes('@')) throw new UnrecoverableError(`Invalid email: ${email}`);",
              "label": "src/mail/flaky-mail-sender.ts"
            },
            {
              "kind": "table",
              "head": [
                "Attempt",
                "Result",
                "Then"
              ],
              "rows": [
                [
                  "1, at 0 s",
                  "fails: SMTP timeout",
                  "wait 1 s"
                ],
                [
                  "2, at about 1 s",
                  "fails: SMTP timeout",
                  "wait 2 s"
                ],
                [
                  "3, at about 3 s",
                  "email sent, sent-email log written",
                  "job completed"
                ]
              ]
            },
            {
              "kind": "text",
              "text": "The invalid address throws `UnrecoverableError`, so that job fails at once, with no retries, and `onFailed()` logs `failed for good after 1 attempts`."
            },
            {
              "kind": "text",
              "text": "And the question: a crashed job runs again *after a restart*, and a `Set` in memory starts empty after a restart. It would forget every key, and the customer would get a second email. The log has to outlive the process, so it belongs in the database, with a unique key.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q41",
      "title": "Why use a queue in a NestJS app, and how do you make jobs safe to retry?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A queue moves slow or unreliable work, such as emails, PDFs and third-party calls, out of the request. The request adds a job to Redis and returns, and a worker processes it with retries. That gives faster responses, automatic retries, protection against spikes, and work that survives restarts. In Nest I use `@nestjs/bullmq`: `registerQueue()` in the module that owns the work, `@InjectQueue()` in a small producer service, and a `@Processor()` class that extends `WorkerHost`."
        },
        {
          "kind": "text",
          "text": "For safety: BullMQ is at-least-once, so a crash, or a retry after partial success, can run a job twice. I make each job idempotent with a deterministic `jobId`, which dedupes adds, plus a check inside the job, like a unique key in a sent-log table or a conditional update. I use exponential backoff with jitter for temporary errors, and `UnrecoverableError` for bad input. I add jobs only after the transaction commits, or use an outbox table when losing one is unacceptable. And I treat the failed set as a dead-letter queue: keep failed jobs, alert on final failures, and make retrying them easy."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q42",
      "title": "How do you run scheduled jobs when your app runs on several instances?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `@nestjs/schedule` runs cron inside each process, so with three instances every job runs three times. First, I make the job idempotent anyway, for example with a conditional update. Then I make sure it runs once per tick. The simplest way is a flag: enable `cronJobs` in `ScheduleModule` on one chosen instance, though that instance becomes a single point of failure. A distributed lock works too: `SET key value NX PX ttl` in Redis, and only the winner runs."
        },
        {
          "kind": "text",
          "text": "If the app already uses BullMQ, I prefer its job schedulers. `queue.upsertJobScheduler()` stores the schedule in Redis, each tick creates one job, and exactly one worker processes it, with retries, backoff and a failed set for free. I'd also use `waitForCompletion`, or keep runs short, so that a slow run doesn't overlap the next one, and give business schedules like a 3am report an explicit time zone."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 24 makes the shop real-time. When an order's status changes, the customer's screen updates in the same second, with no refresh."
    }
  ]
};
