import { Lesson } from '../../shared/content';

export const M10_GUARDS: Lesson = {
  "slug": "m10-guards",
  "title": "M10 Guards and role-based access",
  "nav": "Guards & roles",
  "num": "M10",
  "eyebrow": "Level 4 · Week 6 · ~2 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 4 · Weeks 6–7 · The request pipeline",
      "blocks": [
        {
          "kind": "text",
          "text": "Guards, interceptors, pipes and custom decorators: everything that wraps your handler. They keep a growing API from turning into hundreds of copy-pasted login checks, and they are about half of every NestJS interview."
        }
      ]
    },
    {
      "kind": "text",
      "text": "A **guard** is a class that answers one question before your handler runs: *may this request go on?* It returns `true` to let the request through. It returns `false`, or throws an exception, to stop it. That is its whole job."
    },
    {
      "kind": "text",
      "text": "Guards are where two security checks live. **Authentication** asks *who are you?* **Authorization** asks *what are you allowed to do?* M9 showed where guards sit: after middleware, before interceptors and pipes. In this module you build both checks for the Products API. Then you make them global, so no route is ever open by accident."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Think of a guard as a door check in front of a route. It looks at each request and says yes or no. If it says no, the code behind the door never runs."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The shape of a guard"
    },
    {
      "kind": "text",
      "text": "A guard implements `CanActivate`, an interface with one method: `canActivate(context)`. The method can return a `boolean`, a `Promise` of one, or an RxJS `Observable` of one. So a guard may do async work, such as a database lookup."
    },
    {
      "kind": "text",
      "text": "The `context` is an `ExecutionContext`: an object that describes the current request. It gives a guard more than middleware ever gets:"
    },
    {
      "kind": "table",
      "head": [
        "Method",
        "What it gives you"
      ],
      "rows": [
        [
          "`context.switchToHttp().getRequest()`",
          "The Express request: headers, params, body"
        ],
        [
          "`context.getHandler()`",
          "The route method that is about to run, e.g. `ProductsController.remove`"
        ],
        [
          "`context.getClass()`",
          "The controller class, e.g. `ProductsController`"
        ],
        [
          "`context.getType()`",
          "`'http'`, `'ws'` or `'rpc'`, so one guard can also protect WebSockets (M24)"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "`getHandler()` and `getClass()` are the important ones. They let a guard read the **labels** you put on a route, like `@Roles('admin')`. Middleware runs before Nest knows the route, so it can never do this."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Guard one: who are you?"
    },
    {
      "kind": "text",
      "text": "Many APIs use a **bearer token**. The client logs in once, gets a token back, and sends it in a header on every request: `Authorization: Bearer <token>`. Usually the token is a **JWT** (JSON Web Token), a signed string that says who the user is. Checking a JWT properly needs a secret key and a library; that is M17. Today you stub the check, so you can build and test the guard now."
    },
    {
      "kind": "text",
      "text": "First, the version most people write on day one:"
    },
    {
      "kind": "example",
      "code": "import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\nimport type { Request } from 'express';\n\n@Injectable()\nexport class AuthGuard implements CanActivate {\n  canActivate(context: ExecutionContext): boolean {\n    const request = context.switchToHttp().getRequest<Request>();\n\n    // Problem 1: ANY value passes. \"Authorization: hello\" counts as logged in.\n    // Problem 2: no header → false → Nest answers 403. It should be 401.\n    return Boolean(request.headers.authorization);\n  }\n}",
      "label": "auth/auth.guard.ts — the first try",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "It has two problems. Any value passes, so `Authorization: hello` counts as logged in. And when the header is missing, the guard returns `false`, which Nest turns into **403 Forbidden**. The right answer is **401 Unauthorized**. The difference is explained below."
    },
    {
      "kind": "text",
      "text": "The fix needs two small files. The first holds the types every auth file shares: the roles, the user, and the request once a user is on it. They get a file of their own because M17 deletes the stub below, and these types have to survive that:"
    },
    {
      "kind": "example",
      "code": "// The auth types every other file shares. They live apart from the\n// TokenService stub because M17 deletes the stub and keeps these.\nimport type { Request } from 'express';\n\nexport type Role = 'user' | 'admin';\n\n/** Who is calling. JwtAuthGuard puts this on request.user. */\nexport interface AuthUser {\n  id: string; // a UUID string, like the users table you build later\n  email: string;\n  roles: Role[];\n}\n\n/** An Express request after JwtAuthGuard has run. */\nexport interface AuthRequest extends Request {\n  user?: AuthUser;\n}",
      "label": "auth/auth-user.ts"
    },
    {
      "kind": "text",
      "text": "User ids are UUID strings, like the ids in the users table you build later; product and note ids stay numbers. Other files import these types with `import type`, because they are only types. M13 shows when that becomes required.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "The second file is a service that checks tokens. Today it is a stub with two fake tokens. It has the same shape as `JwtService.verifyAsync()` from `@nestjs/jwt`, which M17 uses for the real check: a token goes in, and the user comes out, or it throws."
    },
    {
      "kind": "example",
      "code": "import { Injectable } from '@nestjs/common';\nimport type { AuthUser } from './auth-user';\n\n// Two fake tokens, so you can test today. M17 deletes this whole file.\nconst DEMO_TOKENS = new Map<string, AuthUser>([\n  ['user-token', {\n    id: 'a3f1c2d4-5b6e-4f70-8a91-b2c3d4e5f601',\n    email: 'ana@example.com',\n    roles: ['user'],\n  }],\n  ['admin-token', {\n    id: 'b7e2d9f0-1c3a-4e5b-9d6c-7a8b9c0d1e22',\n    email: 'raj@example.com',\n    roles: ['user', 'admin'],\n  }],\n]);\n\n/**\n * STUB until M17. It has the same shape as JwtService.verifyAsync():\n * a token goes in, and the user comes out, or it throws.\n */\n@Injectable()\nexport class TokenService {\n  verify(token: string): Promise<AuthUser> {\n    const user = DEMO_TOKENS.get(token);\n    return user\n      ? Promise.resolve(user)\n      : Promise.reject(new Error('Invalid or expired token'));\n  }\n}",
      "label": "auth/token.service.ts — a stub until M17"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Labels on routes: `@Public()` and `@Roles()`"
    },
    {
      "kind": "text",
      "text": "Some routes must stay open: login, a health check, the public product list. Others are for admins only. You mark them with **metadata**: a small label stored on a class or a method, which other code can read later. `SetMetadata(key, value)` from `@nestjs/common` attaches the label. M13 shows how it works under the hood. For now, read each line as *stick this label on the route*."
    },
    {
      "kind": "example",
      "code": "import { SetMetadata } from '@nestjs/common';\nimport type { Role } from './auth-user';\n\n// Label 1: anyone may call this route. No token needed.\nexport const IS_PUBLIC_KEY = 'isPublic';\nexport const Public = () => SetMetadata(IS_PUBLIC_KEY, true);\n\n// Label 2: only callers with one of these roles may call this route.\nexport const ROLES_KEY = 'roles';\nexport const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);",
      "label": "auth/auth.decorators.ts"
    },
    {
      "kind": "text",
      "text": "Notice the two exported keys, `IS_PUBLIC_KEY` and `ROLES_KEY`. The decorator writes with a key, and the guard reads with the same key, so both sides import one constant. M13 shows what happens when they don't."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The auth guard, done properly"
    },
    {
      "kind": "text",
      "text": "To read a label, a guard injects **`Reflector`**, a helper class from `@nestjs/core` that reads metadata. `getAllAndOverride(key, [handler, class])` looks at the method first, then at the class, and returns the first value it finds."
    },
    {
      "kind": "example",
      "code": "import {\n  CanActivate,\n  ExecutionContext,\n  Injectable,\n  UnauthorizedException,\n} from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport type { AuthRequest } from './auth-user';\nimport { IS_PUBLIC_KEY } from './auth.decorators';\nimport { TokenService } from './token.service';\n\n@Injectable()\nexport class JwtAuthGuard implements CanActivate {\n  constructor(\n    private readonly reflector: Reflector,\n    private readonly tokens: TokenService,\n  ) {}\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    // 1. Does the route have the @Public() label? Check the method, then the class.\n    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(\n      IS_PUBLIC_KEY,\n      [context.getHandler(), context.getClass()],\n    );\n    if (isPublic) return true;\n\n    // 2. Read the header \"Authorization: Bearer <token>\".\n    const request = context.switchToHttp().getRequest<AuthRequest>();\n    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];\n    if (scheme !== 'Bearer' || !token) {\n      throw new UnauthorizedException({\n        code: 'TOKEN_MISSING',\n        message: 'Send a Bearer token in the Authorization header',\n      });\n    }\n\n    // 3. Check the token. A stub today; a real JWT check in M17.\n    try {\n      request.user = await this.tokens.verify(token);\n    } catch {\n      throw new UnauthorizedException({\n        code: 'TOKEN_INVALID',\n        message: 'Your token is invalid or has expired',\n      });\n    }\n    return true;\n  }\n}",
      "label": "auth/jwt-auth.guard.ts",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Step 1** returns early for `@Public()` routes, before it looks for a token.",
        "**Step 2** throws `UnauthorizedException` with a `code`. The exception goes through your M8 exception filter, so the client gets the usual error shape, with code `TOKEN_MISSING`.",
        "**Step 3** saves the user on `request.user`. Everything that runs later can now see who is calling: the roles guard, interceptors and your handler.",
        "A failed check **throws**; it never returns `false`. Throwing lets you choose the status and the message."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Guard two: what may you do?"
    },
    {
      "kind": "text",
      "text": "The second guard reads `@Roles()` and compares it with the user's roles. It runs after the auth guard, so `request.user` is already set."
    },
    {
      "kind": "example",
      "code": "import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport type { AuthRequest, Role } from './auth-user';\nimport { IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorators';\n\n@Injectable()\nexport class RolesGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n\n  canActivate(context: ExecutionContext): boolean {\n    const targets = [context.getHandler(), context.getClass()];\n\n    // @Public() wins here too, or a class-level @Roles() would still block it.\n    if (this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, targets)) {\n      return true;\n    }\n\n    // Which roles does this route need? A label on the method beats one on the class.\n    const required = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, targets);\n    if (!required || required.length === 0) return true; // no @Roles() → any logged-in user\n\n    const { user } = context.switchToHttp().getRequest<AuthRequest>();\n    // One matching role is enough. false → Nest throws ForbiddenException → 403.\n    return required.some((role) => user?.roles.includes(role));\n  }\n}",
      "label": "auth/roles.guard.ts"
    },
    {
      "kind": "text",
      "text": "One matching role is enough: `@Roles('admin', 'editor')` means *admin or editor*. When the guard returns `false`, Nest throws `ForbiddenException('Forbidden resource')` for you, and the client gets a 403. The `@Public()` check at the top looks odd in a roles guard; the second trap below shows why it is there."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Make them global, in the right order"
    },
    {
      "kind": "text",
      "text": "You could add `@UseGuards(JwtAuthGuard, RolesGuard)` to every controller. Then one forgotten line leaves a whole controller open. It is safer to flip the default: protect **every** route, and open a few on purpose with `@Public()`. To do that, register each guard as a provider with the `APP_GUARD` token from `@nestjs/core`:"
    },
    {
      "kind": "example",
      "code": "import { Module } from '@nestjs/common';\nimport { APP_GUARD } from '@nestjs/core';\nimport { JwtAuthGuard } from './jwt-auth.guard';\nimport { RolesGuard } from './roles.guard';\nimport { TokenService } from './token.service';\n\n@Module({\n  providers: [\n    TokenService,\n    // Global guards run in the order they are listed here.\n    { provide: APP_GUARD, useClass: JwtAuthGuard }, // 1st: who are you?     → 401\n    { provide: APP_GUARD, useClass: RolesGuard },   // 2nd: may you do this? → 403\n  ],\n  exports: [TokenService],\n})\nexport class AuthModule {}",
      "label": "auth/auth.module.ts"
    },
    {
      "kind": "text",
      "text": "Import `AuthModule` into `AppModule`, and you are done. A provider with the `APP_GUARD` token is global, even though it lives in `AuthModule`. And because Nest creates it, it gets DI. Writing `app.useGlobalGuards(new JwtAuthGuard(...))` in `main.ts` would leave you to pass `Reflector` and `TokenService` in by hand: the same problem M8 showed for filters."
    },
    {
      "kind": "table",
      "head": [
        "Labels on the route",
        "Who gets in"
      ],
      "rows": [
        [
          "`@Public()`",
          "Everyone. No token needed"
        ],
        [
          "*(no label)*",
          "Any logged-in user"
        ],
        [
          "`@Roles('admin')`",
          "Only users with the `admin` role"
        ],
        [
          "`@Roles('admin')` on the class, `@Roles('user')` on one method",
          "That method: anyone with the `user` role. The rest: admins only"
        ],
        [
          "`@Roles('admin')` on the class, `@Public()` on one method",
          "That method: everyone. The rest: admins only"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "With global guards, a new controller is locked until someone *chooses* to open it. Forgetting a decorator now fails safe. The worst case is a 401 that a teammate notices in five minutes, not an open admin route that nobody notices for months."
        }
      ],
      "title": "Secure by default"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "At startup, Nest collects the guards for each route: global guards first, then `@UseGuards()` on the controller, then `@UseGuards()` on the method.",
            "On each request, it builds one `ExecutionContext` and calls each guard's `canActivate()` in that order. It waits for a `Promise`, and takes the last value of an `Observable`.",
            "It stops at the first guard that says no. If that guard returned `false`, Nest throws `ForbiddenException('Forbidden resource')`. If the guard threw, Nest uses that exception as it is.",
            "Either way, the exception goes to your exception filters. Interceptors, pipes and the handler never run."
          ]
        },
        {
          "kind": "text",
          "text": "Step 3 is why a guard should **throw** when it wants any status other than 403. A `false` can only ever become a 403."
        }
      ],
      "title": "Under the hood · what Nest does with your guards"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "401 or 403?"
    },
    {
      "kind": "table",
      "head": [
        "Status",
        "It means",
        "Typical cause",
        "What the client should do"
      ],
      "rows": [
        [
          "`401 Unauthorized`",
          "\"I don't know who you are.\"",
          "No token, a bad token, an expired token",
          "Log in, or refresh the token, and try again"
        ],
        [
          "`403 Forbidden`",
          "\"I know who you are, and the answer is no.\"",
          "Logged in, but missing a role",
          "Nothing. Logging in again will not help"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "The name *Unauthorized* is misleading: 401 really means *not authenticated*. Frontends depend on the difference. A 401 usually sends the user to the login page, while a 403 shows a \"you don't have access\" message.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Global guards run in the order you register them. List `RolesGuard` first and it runs before anyone has set `request.user`, so it sees no user and returns `false`. Every route with `@Roles()` now answers 403, even to a real admin. Keep all global guards in one module, list the auth guard first, and leave a comment that says why."
        }
      ],
      "title": "Trap · guards in the wrong order"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`@Public()` makes `JwtAuthGuard` skip its check, but `RolesGuard` is a separate guard with its own rules. Put `@Roles('admin')` on a controller and `@Public()` on one of its methods. Without an extra check, that method still answers 403: there is no user, and the class label still asks for an admin. That is why `RolesGuard` reads `IS_PUBLIC_KEY` too. Without it, `@Public()` silently does nothing inside an admin-only controller."
        }
      ],
      "title": "Trap · `@Public()` only opens the first door"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`this.reflector.get(ROLES_KEY, context.getHandler())` reads the labels on the method and nothing else. Then a teammate puts `@Roles('admin')` on a **class**, to protect a whole admin controller. The guard finds nothing on the method, decides no role is needed, and lets every logged-in user in. Read both places with `getAllAndOverride(key, [context.getHandler(), context.getClass()])`. The method's label wins, and the class label is the fallback."
        }
      ],
      "title": "Trap · reading only the method's labels"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Angular has guards too: `canActivate` on a route, today usually a `CanActivateFn` function. They decide whether the *browser* may show a page, and they can redirect with a `UrlTree`. That is a convenience, not security: anyone can call your API with `curl` and skip the Angular app completely. Nest guards are the real lock. Two habits to drop. A Nest guard never redirects: it only allows or throws. And it is still a class, because it needs DI for `Reflector` and your services."
        }
      ],
      "title": "Because you come from Angular"
    },
    {
      "kind": "quiz",
      "question": "Three requests hit `DELETE /products/7`, which has `@Roles('admin')`. Request A sends no token. Request B sends an expired token. Request C sends a valid token for a user whose only role is `user`. What status does each one get?",
      "options": [
        "A: 403 · B: 401 · C: 403",
        "A: 401 · B: 403 · C: 403",
        "A: 401 · B: 401 · C: 403",
        "A: 400 · B: 401 · C: 401"
      ],
      "answer": 2,
      "why": "**A: 401, B: 401, C: 403.** A and B fail the same question, *who are you?*, so `JwtAuthGuard` throws `UnauthorizedException` for both. A missing token and an expired one are both *not authenticated*, and the client should log in again. C passes the first guard, so the server knows who it is, and fails the second. That is a 403, and logging in again will not help. If you picked 403 for A, look at the first try above. Returning `false` for a missing token is exactly how an API ends up sending 403 instead of 401."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 10.1",
      "title": "Lock down the Notes API",
      "blocks": [
        {
          "kind": "text",
          "text": "Take the Notes API from Exercises 7.1 and 8.1 and add `AuthModule` with both global guards. Then label the routes: anyone may list and read notes, any logged-in user may create and edit them, and only admins may delete."
        },
        {
          "kind": "text",
          "text": "Prove it with `curl` or your HTTP client, and write down the status and `code` for each request:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "`POST /notes` with no token, then with `Bearer nope`",
            "`DELETE /notes/1` with `user-token`, then with `admin-token`",
            "`GET /notes` with no token"
          ]
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import {\n  Body,\n  Controller,\n  Delete,\n  Get,\n  HttpCode,\n  Param,\n  ParseIntPipe,\n  Patch,\n  Post,\n  Query,\n} from '@nestjs/common';\nimport { Public, Roles } from '../auth/auth.decorators';\nimport { CreateNoteDto } from './dto/create-note.dto';\nimport { ListNotesDto } from './dto/list-notes.dto';\nimport { UpdateNoteDto } from './dto/update-note.dto';\nimport { NotesService } from './notes.service';\n\n@Controller('notes')\nexport class NotesController {\n  constructor(private readonly notes: NotesService) {}\n\n  @Public() // anyone can read\n  @Get()\n  findAll(@Query() query: ListNotesDto) {\n    return this.notes.findAll(query);\n  }\n\n  @Public()\n  @Get(':id')\n  findOne(@Param('id', ParseIntPipe) id: number) {\n    return this.notes.findOne(id);\n  }\n\n  @Post() // no label → any logged-in user\n  create(@Body() dto: CreateNoteDto) {\n    return this.notes.create(dto);\n  }\n\n  @Patch(':id')\n  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoteDto) {\n    return this.notes.update(id, dto);\n  }\n\n  @Roles('admin') // admins only\n  @Delete(':id')\n  @HttpCode(204)\n  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {\n    await this.notes.remove(id);\n  }\n}",
              "label": "notes/notes.controller.ts"
            },
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "`POST /notes` with no token → **401**, code `TOKEN_MISSING`.",
                "`POST /notes` with `Bearer nope` → **401**, code `TOKEN_INVALID`.",
                "`DELETE /notes/1` with `user-token` → **403**, code `FORBIDDEN`, message `Forbidden resource`.",
                "`DELETE /notes/1` with `admin-token` → **204**, no body.",
                "`GET /notes` with no token → **200**."
              ]
            },
            {
              "kind": "text",
              "text": "Every error has your M8 shape, because guard exceptions go through the same exception filter. Notice what you did *not* write: no `@UseGuards()` anywhere. The controller only says who may do what.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Challenge 10.2",
      "title": "Only the owner may edit a note",
      "blocks": [
        {
          "kind": "text",
          "text": "Give each note an `ownerId`, the UUID string from `request.user.id`, when the note is created. For now, read it with `@Req() req: AuthRequest`, with `AuthRequest` imported from `auth/auth-user.ts` using `import type`; M13 explains why `type` matters there, and gives you something cleaner. Then write a `NoteOwnerGuard`, so that `PATCH /notes/:id` works only for the note's owner or an admin. Finally, decide: should this check live in a guard at all?"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import {\n  CanActivate,\n  ExecutionContext,\n  ForbiddenException,\n  Injectable,\n} from '@nestjs/common';\nimport type { AuthRequest } from '../auth/auth-user';\nimport { NotesService } from './notes.service';\n\n@Injectable()\nexport class NoteOwnerGuard implements CanActivate {\n  constructor(private readonly notes: NotesService) {}\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    const req = context.switchToHttp().getRequest<AuthRequest>();\n    const user = req.user;\n    if (!user) return false; // JwtAuthGuard did not run → 403\n    if (user.roles.includes('admin')) return true;\n\n    // Guards run BEFORE pipes: ParseIntPipe has not run yet, so this is the raw string.\n    const note = await this.notes.findOne(Number(req.params.id)); // throws 404 if missing\n    if (note.ownerId !== user.id) {\n      throw new ForbiddenException({\n        code: 'NOT_OWNER',\n        message: 'You can only change your own notes',\n      });\n    }\n    return true;\n  }\n}\n\n// notes.controller.ts\n//   @UseGuards(NoteOwnerGuard) // runs after the two global guards\n//   @Patch(':id')\n//   update(...) {}",
              "label": "notes/note-owner.guard.ts"
            },
            {
              "kind": "list",
              "ordered": false,
              "items": [
                "It works. Owners and admins get through, everyone else gets a 403 with code `NOT_OWNER`, and a note that doesn't exist is still a 404.",
                "**Guards run before pipes.** `ParseIntPipe` hasn't run yet, so the guard reads the raw string from `req.params` and converts it itself.",
                "**It loads the note twice**, once here and again in the handler. And *only owners may edit* is a business rule, which belongs in the service (M5)."
              ]
            },
            {
              "kind": "text",
              "text": "That is why many teams keep ownership checks in the service: `notes.update(user, id, dto)` loads the note once, and throws `ForbiddenException` if the user is not the owner. A good rule of thumb: a guard decides from **the request and the route's labels**, meaning who is calling and which roles they have. As soon as you need to load the record itself, move the check into the service."
            },
            {
              "kind": "text",
              "text": "Some APIs answer 404 instead of 403 here, so a stranger can't even learn that the note exists. Both are fine; pick one and use it everywhere.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q15",
      "title": "How would you implement role-based access control in NestJS?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With two global guards and two metadata decorators. A `@Roles()` decorator stores the required roles on a route with `SetMetadata`, and `@Public()` marks routes that need no login. The first guard, registered with the `APP_GUARD` token, authenticates: it skips public routes, reads the bearer token, verifies it and puts the user on `request.user`, or throws `UnauthorizedException` for a 401. The second guard authorizes. It reads the roles with `Reflector.getAllAndOverride`, from the method first and then the class. If the user has none of them, it returns `false`, which Nest turns into a 403."
        },
        {
          "kind": "text",
          "text": "Three details show real experience. The order of the guards matters, because the roles guard needs the user that the first guard sets. Metadata must be read from both the handler and the class, or a class-level `@Roles()` is silently ignored. And resource ownership, *may this user edit this note?*, belongs in the service layer, because it needs the record itself. Guards are for decisions that need only the request and the route's metadata."
        },
        {
          "kind": "text",
          "text": "**Why they ask:** almost every real API has roles. The answer shows whether you know Nest's building blocks, or would copy the same `if` check into 300 handlers.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q16",
      "title": "Why register the auth guard globally, and how do you make some routes public?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Because the safe default is *locked*. With `@UseGuards()` on each controller, every new controller is open until someone remembers the decorator, and one forgotten line is a data leak. With a global guard, a forgotten decorator fails safe: the route returns 401 and somebody notices. Public routes opt out with a `@Public()` metadata decorator, which the guard reads through `Reflector` before it looks for a token."
        },
        {
          "kind": "text",
          "text": "I'd register it as a provider with the `APP_GUARD` token, not with `app.useGlobalGuards()` in `main.ts`, for two reasons. A provider gets dependency injection, so the guard can inject `Reflector` and a token service. And it lives in a module, so an e2e test that boots `AppModule` gets exactly the same guards as production, while `main.ts` never runs in tests."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, in M11, you meet the only building block that sees the response on its way out: interceptors. You will use them to time requests, wrap every success in one envelope, and keep password hashes out of your JSON."
    }
  ]
};
