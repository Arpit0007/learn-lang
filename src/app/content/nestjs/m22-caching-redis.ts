import { Lesson } from '../../shared/content';

export const M22_CACHING_REDIS: Lesson = {
  "slug": "m22-caching-redis",
  "title": "M22 Caching with Redis",
  "nav": "Caching with Redis",
  "num": "M22",
  "eyebrow": "Level 6 · Week 12 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A **cache** is a fast store for answers you have already worked out. Instead of asking Postgres for the same product 500 times a minute, you ask once, keep the answer, and serve the copy. **Redis** is a good place to keep it. It is an in-memory database, so a read takes well under a millisecond, and every instance of your app can share it. Module 5 hinted at this: a counter in a service's memory isn't shared between instances, but Redis is."
    },
    {
      "kind": "text",
      "text": "Caching is easy to add and easy to get wrong. Storing data is the simple part. The hard parts are knowing when a copy is out of date, and making sure one user never sees another user's data."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Keep a copy of slow answers in Redis, so you don't work them out again. Give every copy an expiry time. When the real data changes, delete the copy."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Why, and where, to cache"
    },
    {
      "kind": "table",
      "head": [
        "Data",
        "Cache it?",
        "Why"
      ],
      "rows": [
        [
          "Product details",
          "Yes, about 5 minutes",
          "Read thousands of times, changed by an admin now and then"
        ],
        [
          "A category's product list (Module 12's route)",
          "Yes, about 30 seconds",
          "The same for every visitor, and asked for constantly"
        ],
        [
          "Shipping quotes from Module 21",
          "Yes, keyed by postcode and weight",
          "Slow, rate-limited, and maybe paid per call"
        ],
        [
          "A user's own orders",
          "Only per user, with a short TTL",
          "Private data: a shared key would leak it"
        ],
        [
          "Stock at checkout",
          "No",
          "It must be exactly right, right now"
        ],
        [
          "A query that takes 2 ms with an index",
          "No",
          "A cache adds a network hop, and bugs, for nothing"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Measure first. The best candidate is an endpoint that is slow *and* popular. A slow endpoint nobody calls doesn't matter, and a fast one doesn't need help."
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "TTL is your safety net",
      "blocks": [
        {
          "kind": "text",
          "text": "Every entry gets a **TTL**, short for time to live: how long the copy may be used before it expires. If you forget to delete a stale copy somewhere, it still fixes itself when the TTL runs out. So choose each TTL by asking: how old may this answer be before someone gets hurt?"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Setup: @nestjs/cache-manager with a Redis store"
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/cache-manager@3 cache-manager keyv @keyv/redis",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "A short history saves you an hour of confusion. Since version 6, cache-manager is built on **Keyv**: a small library that gives one `get` and `set` API over many backends, such as memory, Redis or Postgres. The Redis backend is `@keyv/redis`. Older tutorials use `cache-manager-redis-store` or `cache-manager-redis-yet` with a `store:` option. Those belong to cache-manager v5 and don't work here."
    },
    {
      "kind": "text",
      "text": "Redis is now a must, so open Module 19's `env.validation.ts` and drop the `.optional()` from `REDIS_URL`. Without it, the app refuses to start."
    },
    {
      "kind": "example",
      "code": "import { createKeyv } from '@keyv/redis';\nimport { CacheModule } from '@nestjs/cache-manager';\nimport { Module } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport type { Env } from './config/env.validation';\n\n@Module({\n  imports: [\n    // ConfigModule.forRoot({ ... }) from Module 19 goes here\n    CacheModule.registerAsync({\n      isGlobal: true, // inject CACHE_MANAGER anywhere\n      inject: [ConfigService],\n      useFactory: (config: ConfigService<Env, true>) => ({\n        // A Keyv store backed by Redis. Keys are saved as \"shop::<your key>\".\n        stores: [\n          createKeyv(config.get('REDIS_URL', { infer: true }), {\n            namespace: 'shop',\n            connectionTimeout: 500, // Redis down? Give up after 0.5 s and treat it as a miss.\n          }),\n        ],\n        ttl: 60_000, // MILLISECONDS: the default lifetime of every entry is 60 s\n      }),\n    }),\n  ],\n})\nexport class AppModule {}",
      "label": "src/app.module.ts (excerpt)"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`ttl` is in **milliseconds**. `60_000` is one minute.",
        "With no `stores`, you get an in-memory cache. That's fine for a quick test and wrong for production: each instance would keep its own copy, and none would see the others' deletes.",
        "`connectionTimeout` matters more than it looks. With the defaults, if Redis goes down, a cache call can wait until Redis comes back, and every cached endpoint hangs with it. With a timeout, a dead Redis just turns each lookup into a miss, and the app keeps working from the database, a little slower."
      ]
    },
    {
      "kind": "text",
      "text": "The versions: `@nestjs/cache-manager` 3 is the release made for Nest 11, which is why the install line pins `@3`. It works with cache-manager 6 and 7, and a plain install gets 7. One difference between them: a miss returns `null` in v6 and `undefined` in v7. The `if (cached)` check below works with both.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · seconds or milliseconds?",
      "blocks": [
        {
          "kind": "text",
          "text": "cache-manager v4 measured TTLs in seconds. v5 and later use milliseconds. Copy `CacheModule.register({ ttl: 60 })` from an old tutorial, and every entry expires after 60 *milliseconds*. Nothing errors. The cache just quietly never hits. Write TTLs as `60_000` or `5 * 60_000`, so the unit is obvious to the next reader."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Option 1 · CacheInterceptor: cache whole responses"
    },
    {
      "kind": "text",
      "text": "`CacheInterceptor` caches the full response of a `GET` handler. The key is the request URL, including the query string. It's the quickest win for public data that is the same for everyone."
    },
    {
      "kind": "example",
      "code": "import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';\nimport {\n  Controller, DefaultValuePipe, Get, Param, ParseEnumPipe, ParseIntPipe, ParseUUIDPipe, Query, UseInterceptors,\n} from '@nestjs/common';\nimport { Public } from '../auth/auth.decorators';\nimport { ProductStatus } from './dto/create-product.dto';\nimport { ProductsService } from './products.service';\n\n@Controller('products')\nexport class ProductsController {\n  constructor(private readonly products: ProductsService) {}\n\n  // Module 12's route, now cached: public, the same for every visitor, and asked for constantly.\n  @Public()\n  @Get('category/:categoryId')\n  @UseInterceptors(CacheInterceptor) // caches the whole response\n  @CacheTTL(30_000) // the key is the full URL, so ?page=2 gets its own entry\n  findByCategory(\n    @Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string,\n    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,\n    @Query('status', new ParseEnumPipe(ProductStatus, { optional: true })) status?: ProductStatus,\n  ) {\n    return this.products.findByCategory(categoryId, { page, status });\n  }\n}",
      "label": "src/products/products.controller.ts — Module 12, now cached"
    },
    {
      "kind": "text",
      "text": "With the `api` prefix from Module 3, a key looks like `/api/products/category/3f0c…?page=2`. On a hit, the handler doesn't run at all, and the response carries an `X-Cache: HIT` header (`MISS` otherwise), which you can check in the browser's network tab. Guards still run first (Module 9), so caching never skips your auth."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Option 2 · Cache-aside in a service"
    },
    {
      "kind": "text",
      "text": "**Cache-aside** means your own code manages the cache: look in the cache first, and on a miss, load from the database and save a copy. It's more code than the interceptor, but you choose the key, so you can delete exactly the right entry when the data changes."
    },
    {
      "kind": "example",
      "code": "import { CACHE_MANAGER } from '@nestjs/cache-manager';\nimport { Inject, Injectable, NotFoundException } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport type { Cache } from 'cache-manager';\nimport { Repository } from 'typeorm';\nimport { UpdateProductDto } from './dto/update-product.dto';\nimport { Product } from './entities/product.entity';\nimport { ProductStatus } from './dto/create-product.dto';\nimport { type ProductView, toProductView } from './product.view';\n\nconst PRODUCT_TTL = 5 * 60_000; // 5 minutes, in milliseconds\n\n@Injectable()\nexport class ProductsService {\n  constructor(\n    @InjectRepository(Product) private readonly repo: Repository<Product>,\n    @Inject(CACHE_MANAGER) private readonly cache: Cache,\n  ) {}\n\n  private key(id: number): string {\n    return `product:${id}`;\n  }\n\n  async findOne(id: number): Promise<ProductView> {\n    const cached = await this.cache.get<ProductView>(this.key(id));\n    if (cached) return cached; // hit: no database query at all\n\n    const product = await this.repo.findOneBy({ id }); // miss: ask the database once…\n    if (!product) throw new NotFoundException(`Product ${id} not found`);\n    const view = toProductView(product);\n    await this.cache.set(this.key(id), view, PRODUCT_TTL); // …and keep the answer\n    return view;\n  }\n\n  async update(id: number, dto: UpdateProductDto): Promise<ProductView> {\n    await this.repo.update(id, dto);\n    await this.cache.del(this.key(id)); // the copy is wrong now: delete it, don't patch it\n    return this.findOne(id); // the next read refills it from the database\n  }\n}",
      "label": "src/products/products.service.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Delete, don't update. If two writes race, updating the cache can leave the older value in it. A delete is much safer: the next read loads the truth. One rare race remains, where a slow read puts an old copy back just after the delete, and the TTL cleans that up."
    },
    {
      "kind": "text",
      "text": "`cache.wrap(key, load, ttl)` does the whole get, load and set in one line. It also merges misses that happen at the same moment in one instance: ten requests that miss together run `load()` once, not ten times. A crowd of misses hitting the database at once is called a **cache stampede**, and it often happens right after a popular entry expires."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · what comes back is JSON",
      "blocks": [
        {
          "kind": "text",
          "text": "The Redis store saves values as JSON. A `Date` comes back as a string, and a class instance comes back as a plain object without its methods. The in-memory store keeps the real objects, so your tests pass and production breaks. Cache plain data shaped for the reader, like `ProductView` above, never entities."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Caching per user, safely"
    },
    {
      "kind": "text",
      "text": "Now the dangerous case. `CacheInterceptor` keys by URL, and `/orders/mine` is the same URL for everyone:"
    },
    {
      "kind": "example",
      "code": "import { CacheInterceptor } from '@nestjs/cache-manager';\nimport { Controller, Get, UseInterceptors } from '@nestjs/common';\nimport { CurrentUser } from '../auth/current-user.decorator';\nimport { OrdersService } from './orders.service';\n\n@Controller('orders')\nexport class OrdersController {\n  constructor(private readonly orders: OrdersService) {}\n\n  @Get('mine') // the global JwtAuthGuard has already checked the token\n  @UseInterceptors(CacheInterceptor) // ❌ key = \"/api/orders/mine\": the same string for every user\n  mine(@CurrentUser('id') userId: string) {\n    return this.orders.findMine(userId);\n  }\n}",
      "label": "src/orders/orders.controller.ts",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "Alice calls it first, and her orders are cached under `/api/orders/mine`. Bob calls it next and gets a hit: *Alice's* orders, with her address. Nothing errors, and the logs look normal. This is a data leak, and caching mistakes like this one have caused real security incidents."
    },
    {
      "kind": "example",
      "code": "// ── common/user-cache.interceptor.ts ──\nimport { CacheInterceptor } from '@nestjs/cache-manager';\nimport { ExecutionContext, Injectable } from '@nestjs/common';\nimport type { AuthRequest } from '../auth/auth-user';\n\n/** Like CacheInterceptor, but every user gets their own entry. No user means no caching. */\n@Injectable()\nexport class UserCacheInterceptor extends CacheInterceptor {\n  protected async trackBy(context: ExecutionContext): Promise<string | undefined> {\n    const url = await super.trackBy(context); // undefined for anything but GET\n    const { user } = context.switchToHttp().getRequest<AuthRequest>();\n    if (!url || !user) return undefined;\n    return `user:${user.id}:${url}`; // e.g. \"user:<id>:/api/orders/mine\"\n  }\n}\n\n// ── orders/orders.controller.ts ──\nimport { CacheTTL } from '@nestjs/cache-manager';\nimport { Controller, Get, UseInterceptors } from '@nestjs/common';\nimport { CurrentUser } from '../auth/current-user.decorator';\nimport { UserCacheInterceptor } from '../common/user-cache.interceptor';\nimport { OrdersService } from './orders.service';\n\n@Controller('orders')\nexport class OrdersController {\n  constructor(private readonly orders: OrdersService) {}\n\n  @Get('mine') // global guards run before interceptors, so req.user is already set (Module 9)\n  @UseInterceptors(UserCacheInterceptor)\n  @CacheTTL(15_000) // short: a new order should show up within seconds\n  mine(@CurrentUser('id') userId: string) {\n    return this.orders.findMine(userId);\n  }\n}",
      "label": "one entry per user",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "Put the user's ID in every key for private data, like `user:<id>:…`. If there is no user, don't cache at all.",
        "Keep TTLs short for data the user changes, or delete their entry on writes. For that, a cache-aside key you control, such as `user:<id>:orders:recent`, is easier to delete than a URL.",
        "Also send `Cache-Control: private` (or `no-store`) on these responses, so proxies and CDNs never keep a shared copy."
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "In Angular you might cache an HTTP call with `shareReplay(1)` in a service. That cache lives in one browser tab, for one user, and disappears when the tab closes. A server cache is shared by every user and every instance, and it outlives deploys. That's why keys and invalidation matter so much more on the backend."
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "You copy `CacheModule.register({ ttl: 600 })` from a tutorial, meaning to cache for 10 minutes. You are on `@nestjs/cache-manager` 3. What happens?",
      "options": [
        "Entries live for 10 minutes, as intended",
        "Entries live for 600 milliseconds, so the cache almost never hits",
        "Nest throws at startup, because `ttl` must be a string like `'10m'`",
        "Entries never expire, because `ttl` is ignored when a Redis store is set"
      ],
      "answer": 1,
      "why": "**600 milliseconds.** Since cache-manager v5, TTLs are in milliseconds. In the v4 days `600` meant 10 minutes, which is why old tutorials still show it. Nothing warns you: the cache works, it just expires before anyone can use it. Write `10 * 60_000`, and check the `X-Cache` header to confirm you get hits."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 22.1",
      "title": "Cache the product list, and invalidate it",
      "blocks": [
        {
          "kind": "text",
          "text": "The product list has many keys: one for each page, limit and filter. You can't find and delete them all on every product change. Build a `ProductsListCache` that puts a **version number** in every list key, followed by every filter from Module 7's `ListProductsDto`, like `products:list:v17:{\"page\":2,\"limit\":20,…}`. On any product write, bump the version. The old keys are never read again, and they expire on their own."
        },
        {
          "kind": "text",
          "text": "Prove it: load page 1 twice (one database query), update a product, then load page 1 again (a new query)."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { CACHE_MANAGER } from '@nestjs/cache-manager';\nimport { Inject, Injectable } from '@nestjs/common';\nimport type { Cache } from 'cache-manager';\nimport { ListProductsDto } from './dto/list-products.dto';\n\nconst VERSION_KEY = 'products:list:version';\nconst LIST_TTL = 60_000; // 1 minute\nconst DAY = 24 * 60 * 60_000;\n\n@Injectable()\nexport class ProductsListCache {\n  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}\n\n  /** Returns the cached page, or calls load() once and caches what it returns. */\n  async get<T>(query: ListProductsDto, load: () => Promise<T>): Promise<T> {\n    const version = (await this.cache.get<number>(VERSION_KEY)) ?? 0;\n    // Every filter goes in the key, or two different lists would share one entry.\n    const key = `products:list:v${version}:${JSON.stringify(query)}`;\n    return this.cache.wrap(key, load, LIST_TTL);\n  }\n\n  /** Call after every product write. Old list keys become unreachable and expire on their own. */\n  async invalidate(): Promise<void> {\n    await this.cache.set(VERSION_KEY, Date.now(), DAY);\n  }\n}",
              "label": "src/products/products-list.cache.ts"
            },
            {
              "kind": "text",
              "text": "Call `listCache.invalidate()` at the end of `create()`, `update()` and `remove()` in `ProductsService`. Each list read costs one extra cache `get` for the version, which is cheap. The version key has a long TTL. If it ever expires, the version drops back to 0, but any old `v0` entries are long gone by then, because list entries only live for a minute."
            },
            {
              "kind": "text",
              "text": "The same trick works for any group of keys: per category, per user, per tenant. Redis can also delete by pattern with `SCAN`, but that walks the whole keyspace, which gets slow as the cache grows.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q39",
      "title": "How would you add caching to a NestJS API?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** First I measure, to find endpoints that are both slow and popular, and I check whether an index would fix them more simply. For the ones worth caching, I use `@nestjs/cache-manager` with a Redis store through Keyv's `@keyv/redis`, so all instances share one cache. TTLs are in milliseconds, and every entry gets one as a safety net. I also set a connection timeout on the store, so a Redis outage becomes cache misses instead of hung requests."
        },
        {
          "kind": "text",
          "text": "Then I pick a style per endpoint. `CacheInterceptor` for public `GET` responses that are the same for everyone, like a category's product list, where a short TTL is enough. Cache-aside in the service for data that changes on writes, like product details, because I control the key and can delete it after an update. I use `wrap()` so concurrent misses in one instance run the query once. And I cache plain DTO-shaped objects, not entities, because values go through JSON."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q40",
      "title": "How do you keep a cache correct: invalidation, and per-user data?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** For invalidation, on a write I delete the affected key rather than updating it, because two racing updates can leave the older value behind, and a delete makes the next read load the truth. For groups of keys, like paginated lists, I put a version number in the key and bump it on writes, so old entries become unreachable and expire. Every entry has a TTL, so any invalidation I miss heals itself within minutes. Where data must be exact, like stock at checkout, I don't cache at all."
        },
        {
          "kind": "text",
          "text": "For per-user data, the key must contain the user's ID. The classic bug is `CacheInterceptor` on `/orders/mine`: it keys by URL, so the second user gets the first user's orders. I either subclass the interceptor and add the user ID in `trackBy()`, or use cache-aside with keys like `user:<id>:orders`. I also send `Cache-Control: private`, so no proxy keeps a shared copy, and I delete a user's entries when their data is deleted."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 23 uses the same Redis for something new: queues. Slow work, like the confirmation email from Module 21, moves out of the request entirely."
    }
  ]
};
