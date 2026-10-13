import { Lesson } from '../../shared/content';

export const M29_DOCKER_CICD_DEPLOY: Lesson = {
  "slug": "m29-docker-cicd-deploy",
  "title": "M29 Docker, CI/CD and deployment",
  "nav": "Docker, CI/CD & deploy",
  "num": "M29",
  "eyebrow": "Level 7 · Week 16 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "**Docker** packs your app, its exact Node version and its dependencies into an **image**: a read-only bundle that runs the same on your laptop, in CI and in production. A **container** is a running copy of an image. **CI/CD** (continuous integration and continuous delivery) is the automation that tests every push, builds the image and ships it."
    },
    {
      "kind": "text",
      "text": "Getting a Nest app into a container takes ten minutes. Getting it there *well*, meaning small, safe, configured from outside, migrated once, and stopped without dropping requests, is what this module is about."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Docker packs your app and everything it needs into one image that runs the same everywhere. CI/CD is a robot that checks and builds every change for you. A good deploy starts the new version safely and stops the old one without dropping any requests."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A multi-stage Dockerfile"
    },
    {
      "kind": "text",
      "text": "A **multi-stage build** uses a first stage, with all the tools, to compile your TypeScript, then copies only the results into a fresh, small final stage. Compilers, dev dependencies and source code never reach production. The final stage also runs as the non-root `node` user, so a bug in your app doesn't hand an attacker root access inside the container."
    },
    {
      "kind": "example",
      "code": "# syntax=docker/dockerfile:1\n\n# ---- Stage 1: build ----\nFROM node:24-alpine AS build\nWORKDIR /app\n\n# Copy the lockfile first: this layer stays cached until the dependencies change\nCOPY package.json package-lock.json ./\nRUN npm ci\n\nCOPY . .\n# Compile to dist/, then remove the dev dependencies from node_modules\nRUN npm run build && npm prune --omit=dev\n\n# ---- Stage 2: runtime ----\nFROM node:24-alpine\nENV NODE_ENV=production\nWORKDIR /app\n\n# Only the build output and the production dependencies\nCOPY --from=build /app/package.json ./\nCOPY --from=build /app/node_modules ./node_modules\nCOPY --from=build /app/dist ./dist\n\n# The official Node images include a non-root user called \"node\"\nUSER node\nEXPOSE 3000\n\n# Start node directly, not npm, so it receives SIGTERM\nCMD [\"node\", \"dist/main.js\"]",
      "lang": "text",
      "label": "Dockerfile"
    },
    {
      "kind": "example",
      "code": "node_modules\ndist\ncoverage\n.git\n.env\n.env.*\n!.env.example\n*.log",
      "lang": "text",
      "label": ".dockerignore"
    },
    {
      "kind": "text",
      "text": "Copying `package-lock.json` and running `npm ci` *before* `COPY . .` is the caching trick: Docker reuses the dependency layer until the lockfile changes, so most rebuilds take seconds. Keep Dockerfile comments on their own lines; Docker doesn't treat a `#` at the end of an instruction as a comment. `node:24-alpine` is small. If a native package such as `bcrypt` or `sharp` gives you trouble on Alpine, whose C library is musl rather than glibc, switch both stages to `node:24-slim`. **Version note:** Node 24 is the current LTS line, and Node 26 becomes LTS on 28 October 2026.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · secrets baked into the image",
      "blocks": [
        {
          "kind": "text",
          "text": "Every `COPY` and `ENV` in a Dockerfile is stored in the image's layers, and anyone who can pull the image can read them, even if a later step deletes the file. Without a `.dockerignore`, `COPY . .` copies your `.env` straight in. Never put secrets in the Dockerfile with `ENV` or `ARG` either: build arguments show up in the image history. An image carries code; the platform injects secrets as environment variables when the container starts."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "docker-compose for the whole stack"
    },
    {
      "kind": "text",
      "text": "**Docker Compose** runs several containers together from one YAML file. For local development and small deployments, that means your API, Postgres and Redis, plus a one-off container that runs the migrations before the API starts."
    },
    {
      "kind": "example",
      "code": "services:\n  api:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      # what Module 19's validateEnv() checks at startup\n      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}\n      REDIS_URL: redis://redis:6379\n      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET:?set it in your shell or in .env}\n      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET:?set it in your shell or in .env}\n      PAYMENTS_API_KEY: ${PAYMENTS_API_KEY:?set it in your shell or in .env}             # Module 19: starts with sk_\n      PAYMENTS_WEBHOOK_SECRET: ${PAYMENTS_WEBHOOK_SECRET:?set it in your shell or in .env}   # Module 21's signatures\n    depends_on:\n      migrate:\n        condition: service_completed_successfully\n      redis:\n        condition: service_healthy\n\n  migrate:\n    build: .\n    # the DataSource file from Module 15, compiled into dist/\n    command: [\"npx\", \"typeorm\", \"migration:run\", \"-d\", \"dist/database/data-source.js\"]\n    environment:\n      # data-source.ts reads DATABASE_URL too, since Module 19\n      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}\n    depends_on:\n      db:\n        condition: service_healthy\n\n  db:\n    image: postgres:18-alpine\n    environment:                     # Module 14's settings, filled in from .env\n      POSTGRES_USER: ${DB_USER}\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n      POSTGRES_DB: ${DB_NAME}\n    volumes:\n      - pgdata:/var/lib/postgresql   # Postgres 18+ keeps its data under this folder\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U ${DB_USER} -d ${DB_NAME}\"]\n      interval: 5s\n      timeout: 3s\n      retries: 10\n\n  redis:\n    image: redis:7-alpine\n    healthcheck:\n      test: [\"CMD\", \"redis-cli\", \"ping\"]\n      interval: 5s\n      timeout: 3s\n      retries: 10\n\nvolumes:\n  pgdata:",
      "lang": "text",
      "label": "docker-compose.yml"
    },
    {
      "kind": "text",
      "text": "`depends_on` with `service_healthy` waits for a container's health check to pass. `service_completed_successfully` makes the API wait until the `migrate` container has run and exited cleanly. `${JWT_ACCESS_SECRET:?...}` stops Compose with that message if the variable is missing, so the secret is never written into the file; Module 19 then rejects a secret shorter than 32 characters. A **volume** (`pgdata`) is storage that outlives the container, so your data survives `docker compose down`. As in Module 14, Compose fills in `DB_USER`, `DB_PASSWORD` and `DB_NAME` from `.env`. They only create the Postgres container; the app and the `migrate` container see just the one `DATABASE_URL` built from them (Module 19).",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · localhost means the container",
      "blocks": [
        {
          "kind": "text",
          "text": "Inside a container, `localhost` is the container itself. An API container with `DATABASE_URL=postgres://...@localhost:5432/shop` looks for Postgres *inside the API container* and fails with `ECONNREFUSED`. In Compose, use the service name: `db:5432`. The reverse bites too: an app that listens only on `127.0.0.1` can't be reached from outside its container. Express listens on every network interface by default; Fastify doesn't, so pass `'0.0.0.0'` to `listen()` (Module 27)."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Migrations: once per deploy, not once per boot"
    },
    {
      "kind": "text",
      "text": "Module 15 taught how to write migrations. The production question is *who runs them*. The tempting answer is TypeORM's `migrationsRun: true`, which runs pending migrations every time the app starts. With one instance on your laptop, that works. In production, it doesn't:"
    },
    {
      "kind": "example",
      "code": "TypeOrmModule.forRoot({\n  type: 'postgres',\n  url: process.env.DATABASE_URL,\n  autoLoadEntities: true,\n  migrations: ['dist/database/migrations/*.js'],\n  migrationsRun: true,   // every replica, on every start, races to change the schema\n}),",
      "label": "app.module.ts",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "Four replicas start together and all try the same migration. One wins; the others fail, and a failed migration at startup means an app that won't boot, so the platform restarts it in a loop. A slow migration also delays every boot of every replica. Instead, make migrations **one step of the deploy**: run once, before the new version takes traffic. Module 15's `migration:run` script runs the TypeScript source through ts-node, which a production image doesn't have, so add a script that runs the compiled file:"
    },
    {
      "kind": "example",
      "code": "{\n  \"scripts\": {\n    \"build\": \"nest build\",\n    \"start:prod\": \"node dist/main\",\n    \"migration:run:prod\": \"typeorm migration:run -d dist/database/data-source.js\"\n  }\n}",
      "lang": "text",
      "label": "package.json (scripts) — migrations as their own step",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Compose**: the `migrate` service above.",
        "**Kubernetes**: a Job, for example a Helm pre-upgrade hook, that runs the migration command once.",
        "**Platforms** have a slot for exactly this: Fly.io's `release_command`, Render's pre-deploy command, Heroku's release phase.",
        "**Your pipeline**: a step that runs `npm run migration:run:prod` against production before the rollout starts."
      ]
    },
    {
      "kind": "text",
      "text": "During a **rolling deploy**, where new instances replace old ones a few at a time, old and new versions run side by side against the *new* schema. So every migration must be backward compatible: add a nullable column, deploy, fill it in, and only make it `NOT NULL`, or drop the old column, in a later release. This is called **expand and contract**.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A CI pipeline with GitHub Actions"
    },
    {
      "kind": "text",
      "text": "**GitHub Actions** runs a **workflow**, a YAML file in `.github/workflows/`, when something happens, such as a push or a pull request. This workflow has two **jobs**. `test` lints, tests against a real Postgres and Redis started as **service containers**, and builds. `image` then builds the Docker image and pushes it to GitHub's container registry, but only for pushes to `main`."
    },
    {
      "kind": "example",
      "code": "name: ci\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:18-alpine\n        env:\n          POSTGRES_USER: test\n          POSTGRES_PASSWORD: test\n          POSTGRES_DB: shop_test\n        ports:\n          - 5432:5432\n        options: >-\n          --health-cmd \"pg_isready -U test\"\n          --health-interval 5s\n          --health-timeout 5s\n          --health-retries 10\n      redis:\n        image: redis:7-alpine\n        ports:\n          - 6379:6379\n        options: >-\n          --health-cmd \"redis-cli ping\"\n          --health-interval 5s\n          --health-timeout 3s\n          --health-retries 10\n    env:\n      DATABASE_URL: postgres://test:test@localhost:5432/shop_test       # the app and the migration CLI (Module 19)\n      TEST_DATABASE_URL: postgres://test:test@localhost:5432/shop_test  # the integration tests\n      REDIS_URL: redis://localhost:6379\n      JWT_ACCESS_SECRET: ci-only-access-secret-at-least-32-chars        # Module 19 wants 32+\n      JWT_REFRESH_SECRET: ci-only-refresh-secret-at-least-32-chars\n      PAYMENTS_API_KEY: sk_test_ci_only_not_a_real_key                    # Module 19 wants sk_...\n      PAYMENTS_WEBHOOK_SECRET: ci-only-webhook-secret                     # ...and 16+ characters here\n    steps:\n      - uses: actions/checkout@v7\n      - uses: actions/setup-node@v7\n        with:\n          node-version: 24\n          cache: npm\n      - run: npm ci\n      - run: npx eslint \"{src,test}/**/*.ts\"      # check only, no --fix\n      - run: npm audit --omit=dev --audit-level=high\n      - run: npm test -- --ci\n      - run: npm run build\n      - run: npm run migration:run:prod           # the real schema, for the e2e suite\n      - run: npm run test:e2e -- --ci --runInBand\n      - run: npm run test:int -- --ci             # last: these drop and rebuild the schema\n\n  image:\n    needs: test\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      packages: write\n    steps:\n      - uses: actions/checkout@v7\n      - uses: docker/setup-buildx-action@v4\n      - uses: docker/login-action@v4\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n      - id: meta\n        uses: docker/metadata-action@v6\n        with:\n          images: ghcr.io/${{ github.repository }}\n          tags: |\n            type=sha\n            type=raw,value=latest\n      - uses: docker/build-push-action@v7\n        with:\n          context: .\n          push: true\n          tags: ${{ steps.meta.outputs.tags }}\n          labels: ${{ steps.meta.outputs.labels }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max",
      "lang": "text",
      "label": ".github/workflows/ci.yml"
    },
    {
      "kind": "text",
      "text": "`npm ci` installs exactly what the lockfile says, which is what CI needs. The starter's `lint` script adds `--fix`, which would quietly rewrite files in CI, so the pipeline calls ESLint directly. The image is tagged with the commit SHA, so every image traces back to the exact code inside it, and you deploy by choosing a tag instead of rebuilding. **Version note:** these are the current major versions of each action as of October 2026; they move roughly once a year, so check each action's page when you copy this.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Configuration: build once, configure at start"
    },
    {
      "kind": "text",
      "text": "The same image should run in staging and in production. Everything that differs between them, such as URLs, credentials, the log level and feature flags, comes from **environment variables** when the container starts, validated at boot as in Module 19. That is what lets you test an image in staging and then promote *that exact image* to production. Secrets come from the platform's secret store, injected as environment variables or files, never from the repository or the image."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "An Angular build bakes `environment.ts` into the JavaScript bundle at build time, so you build once per environment. A Nest image works the other way: build it once, and let it read its configuration from environment variables each time it starts. If you catch yourself building a \"staging image\" and a \"production image\", configuration has leaked into the build."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Graceful shutdown"
    },
    {
      "kind": "text",
      "text": "Every deploy stops old containers. The platform sends the process **SIGTERM**, a polite \"please stop\" signal, waits for a grace period (10 seconds for `docker stop`, 30 seconds by default in Kubernetes), then sends **SIGKILL**, which can't be caught. A **graceful shutdown** uses that window: stop taking new requests, finish the ones in flight, close connections cleanly, then exit."
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module';\nimport { configureApp } from './app.setup';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule, { rawBody: true });   // Module 21's webhooks\n  configureApp(app);\n\n  // Run the shutdown hooks when SIGTERM or SIGINT arrives. It's off by default.\n  // Without it, SIGTERM either kills the process on the spot or, when node is\n  // PID 1 in a container, is ignored until the platform sends SIGKILL.\n  app.enableShutdownHooks();\n\n  await app.listen(process.env.PORT ?? 3000);\n}\nbootstrap();",
      "label": "main.ts"
    },
    {
      "kind": "text",
      "text": "When the signal arrives, Nest calls every `onModuleDestroy()`, then every `beforeApplicationShutdown()`, then closes the HTTP server, which lets requests in flight finish, and finally calls `onApplicationShutdown()`. `@nestjs/typeorm` closes its connection pool in those hooks for you. Your own background work needs a hook of its own:"
    },
    {
      "kind": "example",
      "code": "import { BeforeApplicationShutdown, Injectable, Logger, OnModuleInit } from '@nestjs/common';\n\n@Injectable()\nexport class InventorySyncService implements OnModuleInit, BeforeApplicationShutdown {\n  private readonly logger = new Logger(InventorySyncService.name);\n  private timer?: NodeJS.Timeout;\n  private current: Promise<void> = Promise.resolve();\n\n  constructor(private readonly supplier: SupplierApi) {}\n\n  onModuleInit() {\n    // Every 30 s, pull stock levels from the supplier's API (Module 21)\n    this.timer = setInterval(() => {\n      this.current = this.supplier.syncStock().catch((err) => this.logger.error(err));\n    }, 30_000);\n  }\n\n  async beforeApplicationShutdown(signal?: string) {\n    this.logger.log(`${signal}: stopping the inventory sync`);\n    clearInterval(this.timer);     // start nothing new...\n    await this.current;            // ...and let the sync in progress finish\n  }\n}",
      "label": "inventory/inventory-sync.service.ts"
    },
    {
      "kind": "text",
      "text": "Kubernetes removes a pod from the load balancer at the same moment it sends SIGTERM, so a few new requests can still arrive in the first second or two. A short `preStop` sleep, or Terminus's `gracefulShutdownTimeoutMs` (Module 28), keeps the app serving through that gap before it closes. Lifecycle hooks don't run on request-scoped providers, so keep shutdown logic in singletons.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · npm as the container command",
      "blocks": [
        {
          "kind": "text",
          "text": "`CMD [\"npm\", \"run\", \"start:prod\"]` puts npm between the platform and your app, and npm can swallow SIGTERM instead of passing it on; the official Docker and Node.js best-practices guide warns about exactly this. Your shutdown hooks never run, and every deploy cuts requests off at SIGKILL. Start Node directly with `CMD [\"node\", \"dist/main.js\"]`, call `enableShutdownHooks()`, and test it: start a slow request, run `docker stop`, and check that the request still completes."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Where to deploy"
    },
    {
      "kind": "table",
      "head": [
        "Option",
        "Examples",
        "Good for",
        "What you manage"
      ],
      "rows": [
        [
          "**Container platforms**",
          "Google Cloud Run, AWS ECS on Fargate, Azure Container Apps, Fly.io, Render, Railway",
          "Most APIs: you hand over an image and get HTTPS, scaling and rolling deploys",
          "The image and its configuration"
        ],
        [
          "**Kubernetes**",
          "Amazon EKS, Google GKE, Azure AKS, or your own cluster",
          "Many services, with a team to run the platform",
          "A lot: manifests, ingress, upgrades"
        ],
        [
          "**A virtual machine**",
          "An EC2 instance or a small VPS running Docker Compose",
          "Small apps, tight budgets, learning",
          "Everything: OS updates, TLS, backups, restarts"
        ],
        [
          "**Serverless functions**",
          "AWS Lambda",
          "Spiky, low traffic",
          "Cold starts: Nest's bootstrap is heavy, so each cold start adds a noticeable delay"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "For a first production deploy, a container platform is the sensible default. You hand it the image from your pipeline, and it handles TLS, health checks, rolling deploys and restarts. Use a managed Postgres and a managed Redis too, rather than running databases in containers that you have to back up yourself."
    },
    {
      "kind": "quiz",
      "question": "You run 4 replicas, each configured with `migrationsRun: true`. A deploy includes a new migration. What is the most likely result?",
      "options": [
        "TypeORM picks one replica to migrate, and the others wait for it",
        "All four try the migration at once; some crash with errors, and the platform restarts them in a loop until it's done",
        "Nothing runs, because `migrationsRun` only works with a single replica",
        "Each replica migrates its own copy of the database"
      ],
      "answer": 1,
      "why": "**They race.** `migrationsRun` simply runs pending migrations while each instance starts up, and nothing coordinates the replicas. Run migrations once, as a separate release step, before the new version takes traffic, and keep each migration backward compatible so the old version still works during the rollout."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 29.1",
      "title": "Ship the Shop API in containers",
      "blocks": [
        {
          "kind": "text",
          "text": "Write the `Dockerfile`, `.dockerignore` and `docker-compose.yml` for your E-commerce backend. Then prove four things:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "`docker compose up --build` starts everything, with the migrations run once by the `migrate` container.",
            "`docker compose exec api whoami` prints `node`.",
            "`docker images` shows your image at well under half the size of the full `node:24` image.",
            "`curl localhost:3000/api/health/ready` returns `200`."
          ]
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "`docker compose ps -a` shows `migrate` as `Exited (0)`, and `docker compose logs migrate` lists the migrations it ran. Run `up` again and it finishes at once with nothing to do: TypeORM records each migration in its `migrations` table and never runs one twice.",
                "`whoami` prints `node`. If it prints `root`, the `USER node` line is missing from the final stage.",
                "If the image is close to the size of `node:24`, check that the final stage starts `FROM node:24-alpine`, copies only `package.json`, `node_modules` and `dist`, and that `npm prune --omit=dev` ran in the build stage.",
                "If the API or the `migrate` container can't reach the database, check that `DATABASE_URL` says `db`, not `localhost`, in both services."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 29.2",
      "title": "Prove graceful shutdown",
      "blocks": [
        {
          "kind": "text",
          "text": "Add a `@Public()` test route, `GET /slow`, that waits 5 seconds before answering. Start the stack with Compose, call `/api/slow`, and while it waits, run `docker compose stop api` in another terminal and time it. Do this twice: once without `app.enableShutdownHooks()`, and once with it. Then, during the second run, try to send a new request after the stop command."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "Without the hook, Node runs as PID 1 and ignores SIGTERM, so `docker compose stop` waits the full 10 seconds and then kills the process with SIGKILL. Your 5-second request finishes only by luck, and none of your shutdown hooks run. With the hook, the stop takes about 5 seconds: Nest closes the server to new connections, lets the slow request finish with its `200`, runs the hooks (your log line appears), and exits."
            },
            {
              "kind": "text",
              "text": "The new request sent during the shutdown is refused, because the server has stopped accepting connections. That's why the platform must stop routing traffic to an instance *before* it shuts down, which is the job of readiness probes and the `preStop` or `gracefulShutdownTimeoutMs` pause."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q53",
      "title": "How would you containerise a NestJS app for production?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With a multi-stage Dockerfile. The build stage starts from a pinned Node LTS image, copies `package.json` and the lockfile first and runs `npm ci` so that layer is cached, then copies the source, runs `nest build` and prunes the dev dependencies. The runtime stage starts clean from a small base, `alpine` or `slim`, copies only `dist`, the production `node_modules` and `package.json`, sets `NODE_ENV=production`, switches to the non-root `node` user, and starts with `CMD [\"node\", \"dist/main.js\"]` so that the process receives SIGTERM directly."
        },
        {
          "kind": "text",
          "text": "Around the image: a `.dockerignore` so `.env` and `.git` are never copied in; no secrets in `ENV` or `ARG`, because layers and build history are readable; all configuration from environment variables validated at boot, so one image runs in every environment; `enableShutdownHooks()` for graceful shutdown; health endpoints for the platform; and the image tagged with the commit SHA in CI, so every running container traces back to its exact code."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q54",
      "title": "How do you deploy a new version with no downtime?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With a rolling deploy, plus four things that make it safe. First, migrations run once, as a release step before the rollout, and they're backward compatible, expand then contract, because old and new versions share the schema for a while. Second, readiness probes: a new instance only gets traffic once it reports ready, meaning its database and Redis connections work. Third, graceful shutdown on the way out: the platform sends SIGTERM, the instance stops getting traffic, `enableShutdownHooks()` lets Nest finish in-flight requests and close its connections, and it exits well inside the grace period. Fourth, statelessness: no sessions, caches or files in one instance's memory or disk, so it doesn't matter which instance serves which request."
        },
        {
          "kind": "text",
          "text": "Then I want an escape hatch. Images are tagged by commit, so rolling back means redeploying the previous tag, and because the migrations were backward compatible, the old version still runs against the new schema."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, the last module: microservices, how Nest does them, and the honest case for not starting with them."
    }
  ]
};
