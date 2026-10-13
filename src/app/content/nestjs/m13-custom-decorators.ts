import { Lesson } from '../../shared/content';

export const M13_CUSTOM_DECORATORS: Lesson = {
  "slug": "m13-custom-decorators",
  "title": "M13 Custom decorators and metadata",
  "nav": "Custom decorators",
  "num": "M13",
  "eyebrow": "Level 4 · Week 7 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "You have been writing custom decorators since M10: `@Public()` and `@Roles()` were one line each. This module explains that one line, then adds two more kinds. **Parameter decorators** hand your handler a value, like `@CurrentUser()`. **Composed decorators** bundle several decorators into one, like `@Auth('admin')`."
    },
    {
      "kind": "text",
      "text": "Recall from M3 that a **decorator** is a function TypeScript calls once, when the class is defined, not on every request. Most Nest decorators do just one thing: they store **metadata**, a small labelled value, on a class or a method. Later, on each request, a guard or an interceptor reads it back with `Reflector`."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A decorator is like a sticky note on your code. Nest writes the notes once, when the app starts. Then, on every request, guards and interceptors read the notes and act on them."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Under the hood: a sticky note on a function"
    },
    {
      "kind": "text",
      "text": "There is no magic in `SetMetadata`. It uses the `reflect-metadata` library, which can pin a value to any object under a key: `Reflect.defineMetadata(key, value, target)` writes it, and `Reflect.getMetadata(key, target)` reads it back. Here is roughly what `SetMetadata` does, written by hand:"
    },
    {
      "kind": "example",
      "code": "import 'reflect-metadata';\n\n// Roughly what SetMetadata('roles', roles) does inside Nest.\nfunction RolesByHand(...roles: string[]) {\n  return (target: object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {\n    if (descriptor) {\n      // On a method: pin the note to the method function itself.\n      Reflect.defineMetadata('roles', roles, descriptor.value as object);\n    } else {\n      // On a class: pin the note to the class.\n      Reflect.defineMetadata('roles', roles, target);\n    }\n  };\n}\n\n@RolesByHand('user')\nclass ProductsController {\n  @RolesByHand('admin')\n  remove() {}\n}\n\n// At request time, a guard does the reading. context.getHandler() is this\n// very function, and context.getClass() is this very class:\nconsole.log(Reflect.getMetadata('roles', ProductsController.prototype.remove)); // [ 'admin' ]\nconsole.log(Reflect.getMetadata('roles', ProductsController)); // [ 'user' ]",
      "label": "roles-by-hand.ts — roughly what SetMetadata does"
    },
    {
      "kind": "text",
      "text": "On a method, the note is pinned to the method function itself. That is why `context.getHandler()` matters: it returns *that exact function*, so `reflector.get('roles', context.getHandler())` finds the note. `context.getClass()` does the same for the class."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Reading the notes: `get`, `getAllAndOverride`, `getAllAndMerge`"
    },
    {
      "kind": "text",
      "text": "`Reflector` has three ways to read. Say the class has `@Roles('user')`, and one method has `@Roles('admin')`:"
    },
    {
      "kind": "table",
      "head": [
        "Call",
        "On the labelled method",
        "On another method",
        "Use it when"
      ],
      "rows": [
        [
          "`get(ROLES_KEY, handler)`",
          "`['admin']`",
          "`undefined`: the class is ignored",
          "You only ever label methods"
        ],
        [
          "`getAllAndOverride(ROLES_KEY, [handler, cls])`",
          "`['admin']`",
          "`['user']`",
          "The most specific label should win: roles, `@Public()`, time limits"
        ],
        [
          "`getAllAndMerge(ROLES_KEY, [handler, cls])`",
          "`['admin', 'user']`",
          "`['user']`",
          "Labels should add up, like permissions needed at both levels"
        ]
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The bug that fails open"
    },
    {
      "kind": "text",
      "text": "The decorator writes with a key, and the guard reads with a key. If the two strings drift apart, nothing crashes. The guard simply finds nothing:"
    },
    {
      "kind": "example",
      "code": "// auth/auth.decorators.ts\nexport const Roles = (...roles: Role[]) => SetMetadata('roles', roles);\n\n// auth/roles.guard.ts, written by someone else a month later\nconst required = this.reflector.getAllAndOverride<Role[]>('role', [ // ← 'role', not 'roles'\n  context.getHandler(),\n  context.getClass(),\n]);\nif (!required) return true; // undefined → \"no roles needed\" → open to everyone",
      "label": "two files, one typo",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "M10 avoided this with one exported constant, `ROLES_KEY`, used on both sides. Since Nest 10.2 there is an even safer way: `Reflector.createDecorator()` makes a decorator that carries its own hidden key *and* the type of its value."
    },
    {
      "kind": "example",
      "code": "// auth/auth.decorators.ts\nimport { Reflector } from '@nestjs/core';\nimport type { Role } from './auth-user';\n\nexport const Roles = Reflector.createDecorator<Role[]>();\n// Call it with ONE array:  @Roles(['admin'])\n\n// auth/roles.guard.ts: pass the decorator itself. No key to mistype, no <Role[]>.\nconst required = this.reflector.getAllAndOverride(Roles, targets); // typed as Role[]",
      "label": "the typed way (Nest 10.2+)",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Two things to know. `@Roles(['admin'])` takes one array, not a list, so switching styles changes every call site. And `createDecorator()` suits labels that carry a value. For an on/off label like `@Public()`, `SetMetadata(KEY, true)` stays simpler, because a created decorator called with no argument stores `{}`.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "A wrong key doesn't throw an error. The reader gets `undefined`, and most guards treat *no label* as *no restriction*. In the example above, every logged-in user can now call every admin route, and the happy-path tests still pass, because admins still get in. Share one constant, or use `Reflector.createDecorator()`. And give every guard one test that checks a *non*-admin gets a 403."
        }
      ],
      "title": "Trap · a typo in a metadata key fails open"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Parameter decorators: `@CurrentUser()`"
    },
    {
      "kind": "text",
      "text": "`createParamDecorator()` makes a decorator for handler parameters. You give it a factory function. On each request, Nest calls the factory with two arguments: the `data` you passed to the decorator, like `'id'` in `@CurrentUser('id')`, and the `ExecutionContext`. Whatever the factory returns becomes the parameter's value."
    },
    {
      "kind": "example",
      "code": "import {\n  createParamDecorator,\n  ExecutionContext,\n  InternalServerErrorException,\n} from '@nestjs/common';\nimport type { AuthRequest, AuthUser } from './auth-user';\n\nexport const CurrentUser = createParamDecorator(\n  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {\n    const { user } = ctx.switchToHttp().getRequest<AuthRequest>();\n    if (!user) {\n      // Our bug, not the client's: the route is @Public() or has no auth guard.\n      throw new InternalServerErrorException('@CurrentUser() used on a route without auth');\n    }\n    return field ? user[field] : user; // @CurrentUser('id') → just the id\n  },\n);",
      "label": "auth/current-user.decorator.ts"
    },
    {
      "kind": "text",
      "text": "Why throw a 500 and not a 401? If this code finds no user, the client did nothing wrong: the route is `@Public()`, or a guard is missing. That is our bug, so it should look like one. Your M8 filter shows the client a generic 500, and the precise message lands in your logs."
    },
    {
      "kind": "text",
      "text": "Here it is in use, together with the `@Auth()` decorator you build further down:"
    },
    {
      "kind": "example",
      "code": "import {\n  Body,\n  Controller,\n  Delete,\n  Get,\n  HttpCode,\n  Param,\n  ParseIntPipe,\n  Post,\n} from '@nestjs/common';\nimport { Auth } from '../auth/auth.decorator';\nimport { Public } from '../auth/auth.decorators';\nimport { CurrentUser } from '../auth/current-user.decorator';\nimport type { AuthUser } from '../auth/auth-user'; // `import type`: see the trap below\nimport { CreateProductDto } from './dto/create-product.dto';\nimport { ProductsService } from './products.service';\n\n@Controller('products')\nexport class ProductsController {\n  constructor(private readonly products: ProductsService) {}\n\n  @Public()\n  @Get()\n  findAll() {\n    return this.products.findAll();\n  }\n\n  @Get('mine') // any logged-in user\n  findMine(@CurrentUser() user: AuthUser) {\n    return this.products.findByOwner(user.id);\n  }\n\n  @Post()\n  create(@CurrentUser('id') userId: string, @Body() dto: CreateProductDto) {\n    return this.products.create(dto, userId);\n  }\n\n  @Auth('admin') // roles + API docs in one line\n  @Delete(':id')\n  @HttpCode(204)\n  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {\n    await this.products.remove(id);\n  }\n}",
      "label": "products/products.controller.ts"
    },
    {
      "kind": "text",
      "text": "Compare `create()` with the version you would write without it: `create(@Req() req: AuthRequest, ...)`, and then `req.user!.id`. `@CurrentUser('id')` is shorter and typed. The handler no longer knows that Express exists, so a unit test can pass in a plain id string instead of faking a whole request."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "A new Nest 11 project turns on `isolatedModules` in `tsconfig.json`, which makes TypeScript check each file on its own. With it, a *type* used in a decorated parameter must be imported with `import type`. Write `import { AuthUser } from '../auth/auth-user'`, use it in `findMine(@CurrentUser() user: AuthUser)`, and the build fails with error TS1272. The same happens to `@Req() req: Request` with `Request` from `'express'`. The fix is `import type { AuthUser } from ...` or `import { type AuthUser } from ...`. Classes, such as your DTOs, are real values and need no change."
        }
      ],
      "title": "Trap · `isolatedModules` wants `import type`"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Composed decorators: `@Auth()`"
    },
    {
      "kind": "text",
      "text": "`applyDecorators()` combines several decorators into one. Say every admin route needs the role label *and* the right Swagger notes: the lock icon, and the 401 and 403 responses. The Swagger decorators come from `@nestjs/swagger`, which M3 used for the API docs. If it isn't in your project yet, add it now, and keep the `@11`: a plain `npm i` now picks the Nest 12 build, which refuses to install next to Nest 11."
    },
    {
      "kind": "example",
      "code": "npm i @nestjs/swagger@11",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "Then, instead of four lines on every route, write one decorator:"
    },
    {
      "kind": "example",
      "code": "import { applyDecorators } from '@nestjs/common';\nimport {\n  ApiBearerAuth,\n  ApiForbiddenResponse,\n  ApiUnauthorizedResponse,\n} from '@nestjs/swagger';\nimport type { Role } from './auth-user';\nimport { Roles } from './auth.decorators';\n\n/**\n * One decorator that says: \"you must be logged in, you need one of these\n * roles, and the API docs should say so.\"\n */\nexport function Auth(...roles: Role[]) {\n  return applyDecorators(\n    Roles(...roles), // read by RolesGuard (M10)\n    ApiBearerAuth(), // Swagger: show the lock icon\n    ApiUnauthorizedResponse({ description: 'Missing or invalid token' }),\n    ApiForbiddenResponse({\n      description: roles.length ? `Needs role: ${roles.join(' or ')}` : 'Logged-in users only',\n    }),\n  );\n}",
      "label": "auth/auth.decorator.ts"
    },
    {
      "kind": "text",
      "text": "Now `@Auth('admin')` says *admins only, and document it* in one line. `@Auth()` with no roles means *any logged-in user*, because M10's `RolesGuard` treats an empty list as no restriction. If your guards were not global, this is also where `UseGuards(JwtAuthGuard, RolesGuard)` would go; the Nest docs show exactly that version."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Whatever you pass to a decorator is evaluated once, when the file loads. So `@SetMetadata('role', process.env.ADMIN_ROLE)` reads the variable before `ConfigModule.forRoot()` has loaded your `.env` file. The label quietly stores `undefined`, while the same variable reads `\"admin\"` inside a handler. Decorator arguments should be constants. Anything that depends on config belongs inside the guard or interceptor, which runs per request and can inject `AppConfigService`."
        }
      ],
      "title": "Trap · decorator arguments run once, at startup"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**Class and method decorators**, like `@Roles()`, call `Reflect.defineMetadata()` on the class or on the method function, once, when the file loads.",
            "**Parameter decorators**, like `@CurrentUser()`, store their factory and their `data` in the controller's route-argument metadata. On each request, Nest calls the factory to get the value, then runs pipes on it with `type: 'custom'`.",
            "**`applyDecorators()`** returns one decorator that calls the others in order. There is no new kind of metadata.",
            "**Nest's own decorators** work the same way. `@Get()` stores a path and an HTTP method, `@UseGuards()` stores a list of guards, and at startup Nest reads it all to build the routes."
          ]
        },
        {
          "kind": "text",
          "text": "A version note: TypeScript 5 added *standard* decorators, but they can't decorate parameters and don't emit type metadata. Nest depends on both, for `@Body()`, `@Inject()` and constructor injection, so Nest 11 and Nest 12 still use the older `experimentalDecorators` mode with `emitDecoratorMetadata`."
        }
      ],
      "title": "Under the hood · where each kind of decorator keeps its notes"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Angular decorators look the same but live a different life. With its default AOT compiler, Angular reads `@Component()` and `@Input()` at **build** time and turns them into generated code. Newer Angular also replaces many of them with functions like `input()` and `inject()`. In Nest, decorators really run when the file loads, and the metadata they store is still there at runtime for `Reflector` to read. That is what makes route labels and guards possible. One habit transfers well: keep decorators declarative. A decorator *describes*; the guard, interceptor or pipe *acts*."
        }
      ],
      "title": "Because you come from Angular"
    },
    {
      "kind": "quiz",
      "question": "The class has `@Roles('user')`, and its `remove()` method has `@Roles('admin')`. For a request to `remove()`, a guard calls `this.reflector.getAllAndMerge(ROLES_KEY, [context.getHandler(), context.getClass()])`. What does it get?",
      "options": [
        "`['admin']`",
        "`['user']`",
        "`['admin', 'user']`",
        "`undefined`, because merging only works with objects"
      ],
      "answer": 2,
      "why": "**`['admin', 'user']`.** `getAllAndMerge` reads every target in order and joins arrays together (objects are merged key by key). `getAllAndOverride` would return `['admin']`, the first value it finds, and so would `get(ROLES_KEY, handler)`, though `get` returns `undefined` on a method with no label of its own. With merge, M10's `RolesGuard` would let a plain `user` call `remove()`, because one matching role is enough. Choose the reading mode on purpose: for roles, *override* is almost always what you mean."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 13.1",
      "title": "`@RawResponse()` for the envelope",
      "blocks": [
        {
          "kind": "text",
          "text": "A load balancer checks `GET /health` and expects exactly `{ \"status\": \"ok\" }`, but your M11 envelope turns it into `{ \"data\": { \"status\": \"ok\" } }`. Write a `@RawResponse()` label, and make `EnvelopeInterceptor` skip any route that carries it."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import {\n  CallHandler,\n  ExecutionContext,\n  Injectable,\n  NestInterceptor,\n  SetMetadata,\n  StreamableFile,\n} from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { Observable, map } from 'rxjs';\n\n// The label lives next to the only code that reads it.\nexport const RAW_RESPONSE_KEY = 'rawResponse';\nexport const RawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true);\n\n@Injectable()\nexport class EnvelopeInterceptor implements NestInterceptor {\n  constructor(private readonly reflector: Reflector) {}\n\n  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {\n    const raw = this.reflector.getAllAndOverride<boolean | undefined>(RAW_RESPONSE_KEY, [\n      context.getHandler(),\n      context.getClass(),\n    ]);\n    if (raw) return next.handle(); // labelled: send exactly what the handler returned\n\n    return next.handle().pipe(\n      map((data: unknown) => (data instanceof StreamableFile ? data : { data })),\n    );\n  }\n}\n\n// health.controller.ts — a load balancer expects exactly { \"status\": \"ok\" }\n//   @Public()\n//   @RawResponse()\n//   @Get('health')\n//   health() { return { status: 'ok' }; }",
              "label": "common/interceptors/envelope.interceptor.ts"
            },
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "`getAllAndOverride` means you can also label a whole controller, for example a webhooks controller whose replies must have a fixed format.",
                "The label lives in the same file as its only reader, so nobody has to hunt for where `RAW_RESPONSE_KEY` is used.",
                "`@Public()` is still needed on `/health`. *Don't wrap the answer* and *don't check the token* are separate questions, answered by separate labels."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Challenge 13.2",
      "title": "An audit log with `@Audit()`",
      "blocks": [
        {
          "kind": "text",
          "text": "Admins want a record of who deleted what. Write `@Audit(action)`, which stores an action name like `'product.delete'`, and an `AuditInterceptor` that logs `{ action, userId, path, at }` after the handler **succeeds**. Use `Reflector.createDecorator()` this time, and register the interceptor globally."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import {\n  CallHandler,\n  ExecutionContext,\n  Injectable,\n  Logger,\n  NestInterceptor,\n} from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { Observable, tap } from 'rxjs';\nimport type { AuthRequest } from '../../auth/auth-user';\n\n/** Label a route with the action to record, e.g. @Audit('product.delete'). */\nexport const Audit = Reflector.createDecorator<string>();\n\n@Injectable()\nexport class AuditInterceptor implements NestInterceptor {\n  private readonly logger = new Logger('Audit');\n\n  constructor(private readonly reflector: Reflector) {}\n\n  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {\n    const action = this.reflector.get(Audit, context.getHandler()); // typed: string\n    if (!action) return next.handle(); // no label → nothing to record\n\n    const req = context.switchToHttp().getRequest<AuthRequest>();\n    return next.handle().pipe(\n      // Only after SUCCESS. A delete that failed did not delete anything.\n      tap(() =>\n        this.logger.log(\n          JSON.stringify({\n            action,\n            userId: req.user?.id ?? null,\n            path: req.originalUrl,\n            at: new Date().toISOString(),\n          }),\n        ),\n      ),\n    );\n  }\n}\n\n// app.module.ts:          { provide: APP_INTERCEPTOR, useClass: AuditInterceptor }\n// products.controller.ts:  @Audit('product.delete') @Roles('admin') @Delete(':id') remove() {}",
              "label": "common/audit/audit.interceptor.ts"
            },
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "`createDecorator<string>()` fits here because the label carries a value. `this.reflector.get(Audit, ...)` comes back typed as `string`, with no key and no type argument.",
                "Logging inside `tap()` records only successes: a delete that failed deleted nothing. Failed attempts, like a non-admin calling an admin route, never reach an interceptor at all, because a guard rejects them first. If you want those too, log them in the guard or the exception filter.",
                "It reads `req.user`, which the global `JwtAuthGuard` set. Interceptors run after guards, so on protected routes the user is always there.",
                "In production, write to a table or a queue instead of the console (M23). And never put request bodies in an audit log: they can contain passwords."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q21",
      "title": "How do custom decorators and metadata work in NestJS?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Most Nest decorators only store metadata. `SetMetadata(key, value)` calls `Reflect.defineMetadata` once, when the file loads, and pins the value to the class or to the method function. At request time, guards and interceptors get an `ExecutionContext` whose `getHandler()` and `getClass()` return those same objects. `Reflector` then reads the values back: `get` for one target, `getAllAndOverride` to let the method win over the class, and `getAllAndMerge` to combine them. Since Nest 10.2, `Reflector.createDecorator()` builds a typed decorator with its own key, which removes key typos."
        },
        {
          "kind": "text",
          "text": "The other two kinds: `createParamDecorator()` registers a factory that Nest calls on each request to produce a parameter's value, like `@CurrentUser()`, and pipes then run on it with type `custom`. `applyDecorators()` composes several decorators into one, like `@Auth('admin')`. All of it rests on TypeScript's `experimentalDecorators` and `emitDecoratorMetadata`, which is why Nest still uses them rather than the newer standard decorators."
        },
        {
          "kind": "text",
          "text": "**Why they ask:** it tests whether Nest is magic to you or machinery. A strong answer names when the metadata is written, at startup, and when it is read, on each request.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q22",
      "title": "Write a `@CurrentUser()` decorator. Why is it better than `@Req()`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It's a few lines with `createParamDecorator`. The factory gets the `ExecutionContext`, switches to HTTP, takes the request and returns `request.user`, which the auth guard set, or one field of it when you pass `data`, as in `@CurrentUser('id')`."
        },
        {
          "kind": "text",
          "text": "It beats `@Req()` for three reasons. Handlers stay independent of the transport: they receive a user, not an Express request, and the same factory can use `ctx.getType()` to read the user from a WebSocket or RPC context later. It's typed: `user: AuthUser`, instead of reaching into `req.user` with a non-null assertion. And it's easier to test: a unit test passes a plain object instead of faking a request. I'd also make it fail loudly with a 500 when there is no user, because that means a route is wired wrong, not that the client made a mistake."
        }
      ]
    },
    {
      "kind": "text",
      "text": "That completes Level 4: you can now protect, wrap, validate and label every route. Next, in M14, the data layer begins: PostgreSQL, entities and migrations. Everything you built in this level will sit in front of every query you write."
    }
  ]
};
