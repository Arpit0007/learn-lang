import { Lesson } from '../../shared/content';

export const M17_AUTH_JWT: Lesson = {
  "slug": "m17-auth-jwt",
  "title": "M17 Authentication: passwords and JWT",
  "nav": "Passwords & JWT",
  "num": "M17",
  "eyebrow": "Level 5 · Week 10 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "**Authentication** answers one question: *who is calling?* (Authorization answers the next one: *what may they do?*) An API usually answers it in two steps. At login, the user proves who they are with a password. The API then hands back a **token**: a signed string that the client sends with every later request, so the password never travels again."
    },
    {
      "kind": "text",
      "text": "Module 10 built the second half already, with a stand-in. Its `JwtAuthGuard` puts a user on `request.user`, but that user comes from a stub `TokenService` with two demo tokens. This module replaces the stub with the real thing: passwords stored safely with **bcrypt**, a login that issues **JSON Web Tokens** (JWTs) with `@nestjs/jwt`, and a guard that checks them. Then the stub and its demo tokens are deleted."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Never store a password. Store a hash of it: a scrambled version that cannot be turned back into the password."
        },
        {
          "kind": "text",
          "text": "At login, hash what the user typed the same way and compare."
        },
        {
          "kind": "text",
          "text": "A JWT is like a signed wristband at a festival: anyone can read it, but nobody can fake one without the secret."
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
          "text": "You have seen this from the other side. In Angular, an HTTP interceptor added `Authorization: Bearer ...` to every request, and you kept the token somewhere. Now you create that token and check it. Two Angular habits to drop: nothing secret goes in a token, because the browser can read it; and hiding a button in the UI is never security. The guard on the server is."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Store a hash, never the password"
    },
    {
      "kind": "text",
      "text": "A **hash function** turns any input into a fixed-length scramble, and there is no way back. bcrypt is a hash function made for passwords, and it adds two things. A **salt**: random bytes mixed in for every user, so two people with the same password get different hashes, and an attacker cannot use a ready-made table of common passwords. And a **cost factor**: bcrypt is slow on purpose, so that guessing millions of passwords against a stolen table takes years, not minutes."
    },
    {
      "kind": "example",
      "code": "npm i bcrypt @nestjs/jwt@11\nnpm i -D @types/bcrypt\n\n# only if you choose the Passport version of the guard:\nnpm i @nestjs/passport@11 passport passport-jwt\nnpm i -D @types/passport-jwt",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "table",
      "head": [
        "Part of the hash",
        "In `$2b$12$Heb8I3evESqN6ayRS5CIVeZPHIdo0Z/HwJP0KB8oYBA3SWcDj2y8K`",
        "Meaning"
      ],
      "rows": [
        [
          "version",
          "`$2b$`",
          "which variant of bcrypt made it"
        ],
        [
          "cost",
          "`12$`",
          "2 to the power 12 = 4,096 rounds of work"
        ],
        [
          "salt",
          "`Heb8I3evESqN6ayRS5CIVe`",
          "22 characters, random for every hash"
        ],
        [
          "hash",
          "`ZPHIdo0Z/HwJP0KB8oYBA3SWcDj2y8K`",
          "31 characters: the result"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "The salt and the cost are stored inside the hash, so `bcrypt.compare(typed, stored)` needs nothing else. Each +1 on the cost doubles the time: on one laptop, cost 10, 11, 12 and 13 took 47, 92, 185 and 377 ms. OWASP's current advice puts Argon2id first and accepts bcrypt with a cost of 10 or more and passwords of at most 72 bytes. bcrypt is still the most common choice in Nest code, so this course uses it; the `argon2` package works the same way, with `hash` and `verify`.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "The `User` entity from Module 15 gets two new columns:"
    },
    {
      "kind": "example",
      "code": "import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';\nimport type { Role } from '../../auth/auth-user';\nimport { Order } from '../../orders/entities/order.entity';\n\n@Entity('users')\nexport class User {\n  @PrimaryGeneratedColumn('uuid')\n  id: string;\n\n  @Column({ length: 254, unique: true })\n  email: string;                                    // stored lower-case (the DTO does that)\n\n  @Column({ select: false })                        // never loaded unless a query asks for it by name\n  passwordHash: string;\n\n  @Column({ type: 'enum', enum: ['user', 'admin'], array: true, default: ['user'] })\n  roles: Role[];                                    // M10's roles: 'user' | 'admin'\n\n  @OneToMany(() => Order, (order) => order.user)\n  orders: Order[];\n\n  @CreateDateColumn({ type: 'timestamptz' })\n  createdAt: Date;\n}",
      "label": "users/entities/user.entity.ts"
    },
    {
      "kind": "text",
      "text": "`select: false` means a normal `find()` never loads the hash; a query must ask for it by name. `roles` uses Module 10's two roles, `'user'` and `'admin'`. The `Role` type has no values at runtime, so the column lists them itself, and the migration creates a Postgres enum array with `DEFAULT '{user}'`. Also notice `ADD \"passwordHash\" character varying NOT NULL` in that migration: if your `users` table already has test rows, it fails exactly like Exercise 15.1. In development, delete the test users; with real users, add the column as nullable first.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Register and log in"
    },
    {
      "kind": "text",
      "text": "First, the version that ends up in news headlines:"
    },
    {
      "kind": "example",
      "code": "async register(email: string, password: string) {\n  return this.users.save({ email, password });               // the password itself, stored as-is\n}\n\nasync login(email: string, password: string) {\n  const user = await this.users.findOneBy({ email });\n  if (!user) throw new NotFoundException('No account with that email');   // tells an attacker who has an account\n  if (user.password !== password) throw new UnauthorizedException('Wrong password');\n  return user;                                                // the whole row, password included\n}",
      "label": "auth/auth.service.ts",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "It stores the password itself, so one database leak exposes every password, and people reuse passwords on other sites. It tells an attacker which emails have accounts. And it returns the whole row, password included. Here is the version to keep:"
    },
    {
      "kind": "example",
      "code": "import {\n  ConflictException, Injectable, OnModuleInit, UnauthorizedException,\n} from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport * as bcrypt from 'bcrypt';\nimport { QueryFailedError, Repository } from 'typeorm';\nimport { User } from '../users/entities/user.entity';\nimport type { AuthUser, JwtPayload } from './auth-user';\nimport { LoginDto, RegisterDto } from './dto/credentials.dto';\n\nconst BCRYPT_COST = 12;        // 2^12 rounds. Each +1 doubles the time. Measure on your own server.\n\n@Injectable()\nexport class AuthService implements OnModuleInit {\n  private dummyHash = '';\n\n  constructor(\n    @InjectRepository(User) private readonly users: Repository<User>,\n    private readonly jwt: JwtService,\n  ) {}\n\n  async onModuleInit() {\n    // A real hash to check against when the email is unknown, so both paths take the same time.\n    this.dummyHash = await bcrypt.hash('no-such-user-placeholder', BCRYPT_COST);\n  }\n\n  async register(dto: RegisterDto): Promise<AuthUser> {\n    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);   // a new random salt each time\n    try {\n      const user = await this.users.save(this.users.create({ email: dto.email, passwordHash }));\n      return { id: user.id, email: user.email, roles: user.roles };      // never the hash\n    } catch (err) {\n      if (err instanceof QueryFailedError && (err.driverError as { code?: string }).code === '23505') {\n        throw new ConflictException({ code: 'EMAIL_TAKEN', message: 'An account with this email already exists' });\n      }\n      throw err;\n    }\n  }\n\n  async validateUser(dto: LoginDto): Promise<AuthUser> {\n    const user = await this.users.findOne({\n      where: { email: dto.email },\n      select: { id: true, email: true, roles: true, passwordHash: true },   // ask for the hidden column\n    });\n    const ok = await bcrypt.compare(dto.password, user?.passwordHash ?? this.dummyHash);\n    if (!user || !ok) {\n      // One message for \"no such email\" and \"wrong password\": don't tell an attacker which.\n      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });\n    }\n    return { id: user.id, email: user.email, roles: user.roles };\n  }\n\n  async login(dto: LoginDto): Promise<{ accessToken: string }> {\n    const user = await this.validateUser(dto);\n    const payload: JwtPayload = { sub: user.id, email: user.email, roles: user.roles };\n    return { accessToken: await this.jwt.signAsync(payload) };     // secret and expiry: from JwtModule\n  }\n}",
      "label": "auth/auth.service.ts",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`register` hashes with a fresh random salt, saves, and returns `{ id, email, roles }`, never the entity. A duplicate email is Postgres error `23505` again, translated into Module 8's `409` with the code `EMAIL_TAKEN`.",
        "`validateUser` asks for `passwordHash` by name with `select`, because the column is hidden by default.",
        "When the email is unknown, it still runs `bcrypt.compare` against a dummy hash. Both failures then take about the same time and give the same `401`.",
        "`login` signs a token with `jwt.signAsync(payload)`. The secret and the expiry come from `JwtModule`, configured below."
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · two different answers to a wrong login",
      "blocks": [
        {
          "kind": "text",
          "text": "`404 No account with that email` and `401 Wrong password` tell an attacker which emails have accounts. That list is the first step of most attacks on a login form. Give both cases the same status and the same message."
        },
        {
          "kind": "text",
          "text": "Time leaks too. Without a user there is no hash to check, so a naive \"no account\" answer comes back hundreds of milliseconds faster than a \"wrong password\" one. That is why `validateUser` compares against a dummy hash. Add rate limiting on top, with `@nestjs/throttler` (Module 26), so nobody can try thousands of passwords a minute."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the hash leaves the building",
      "blocks": [
        {
          "kind": "text",
          "text": "Module 11 built the outer wall: `@Exclude()` on `passwordHash`, a global `ClassSerializerInterceptor`, and the warning that a plain object or a spread slips past it. `select: false` adds the inner wall: an ordinary query never loads the hash at all, so there is nothing to leak. Add a third habit: services return small objects such as `{ id, email, roles }`, never the entity."
        },
        {
          "kind": "text",
          "text": "And keep passwords out of your logs. Module 11's logging interceptor logs the method, the URL and the status, not the body; keep it that way, because every `/api/auth/*` body holds a password. A leaked bcrypt hash is slow to crack, but slow is not impossible for a weak password."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Tokens with `@nestjs/jwt`"
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Under the hood · what is inside a JWT",
      "blocks": [
        {
          "kind": "text",
          "text": "A JWT is three *base64url* strings (a URL-safe way to write bytes as text) joined by dots: `header.payload.signature`."
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**Header**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` decodes to `{\"alg\":\"HS256\",\"typ\":\"JWT\"}`. `HS256` means HMAC with SHA-256: a signature made with your secret.",
            "**Payload**: the *claims*, small facts about the user. `sub` (the subject: who the token is about), `iat` (issued at) and `exp` (expires at), both in seconds since 1970.",
            "**Signature**: made from the first two parts and the secret. Change one character of the payload, and the signature no longer matches."
          ]
        },
        {
          "kind": "text",
          "text": "`verifyAsync` recomputes the signature with the same secret, compares it, and checks `exp`. No database is involved. That is why checking a JWT is fast, and also why a JWT cannot be cancelled before it expires (Module 18 deals with that)."
        }
      ]
    },
    {
      "kind": "text",
      "text": "`JwtModule` takes the place of the stub's `TokenService` provider. Module 10's two global guards stay exactly where they were, in the same order:"
    },
    {
      "kind": "example",
      "code": "import { Module } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport { APP_GUARD } from '@nestjs/core';\nimport { JwtModule } from '@nestjs/jwt';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { User } from '../users/entities/user.entity';\nimport { UsersController } from '../users/users.controller';\nimport { AuthController } from './auth.controller';\nimport { AuthService } from './auth.service';\nimport { JwtAuthGuard } from './jwt-auth.guard';\nimport { RolesGuard } from './roles.guard';\n\n@Module({\n  imports: [\n    TypeOrmModule.forFeature([User]),\n    JwtModule.registerAsync({                              // takes the place of the TokenService stub\n      inject: [ConfigService],\n      useFactory: (config: ConfigService) => ({\n        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),   // 32+ random bytes, never in the code\n        signOptions: { expiresIn: '15m' },                         // short-lived on purpose\n      }),\n    }),\n  ],\n  controllers: [AuthController, UsersController],\n  providers: [\n    AuthService,\n    // Module 10's two global guards, in the same order: 401 before 403.\n    { provide: APP_GUARD, useClass: JwtAuthGuard },   // 1st: who are you?     → 401\n    { provide: APP_GUARD, useClass: RolesGuard },     // 2nd: may you do this? → 403\n  ],\n})\nexport class AuthModule {}",
      "label": "auth/auth.module.ts"
    },
    {
      "kind": "text",
      "text": "Make the secret with `node -e \"console.log(require('node:crypto').randomBytes(32).toString('base64url'))\"` and put it in `.env` as `JWT_ACCESS_SECRET`; production gets its own, from the deployment platform. `15m` is short on purpose: a stolen token works only until it expires. Module 18 adds a refresh token, so users do not have to log in every 15 minutes.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · a JWT is signed, not encrypted",
      "blocks": [
        {
          "kind": "text",
          "text": "Anyone who holds a token can read its payload. The signature only stops them from *changing* it. So put in only what the server needs on every request: the user id, and perhaps the email and roles. No passwords, no addresses, nothing private."
        },
        {
          "kind": "text",
          "text": "And guard the secret. Anyone who knows it can make a valid token for any user, including an admin. It belongs in the environment, at least 32 random bytes, never in the code."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The guard checks a real token now"
    },
    {
      "kind": "text",
      "text": "Module 10's `JwtAuthGuard` already does the work in three steps: skip `@Public()` routes, read the bearer token, check it. Only step 3 used the stub. Swap `TokenService` for `JwtService`, turn the token's claims into the `AuthUser` shape (`sub` becomes `id`), and delete `auth/token.service.ts` with its two demo tokens. The error codes stay the same, so clients notice nothing:"
    },
    {
      "kind": "example",
      "code": "// auth/auth-user.ts: Module 10's Role, AuthUser and AuthRequest stay. Add what is inside a token:\nexport interface JwtPayload {\n  sub: string;        // \"subject\": the user id. A standard claim name.\n  email: string;\n  roles: Role[];\n}\n\n// auth/jwt-auth.guard.ts: Module 10's guard. Steps 1 and 2 are unchanged; step 3 is real now.\nimport {\n  CanActivate,\n  ExecutionContext,\n  Injectable,\n  UnauthorizedException,\n} from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { JwtService } from '@nestjs/jwt';\nimport { IS_PUBLIC_KEY } from './auth.decorators';\nimport type { AuthRequest, JwtPayload } from './auth-user';\n\n@Injectable()\nexport class JwtAuthGuard implements CanActivate {\n  constructor(\n    private readonly reflector: Reflector,\n    private readonly jwt: JwtService,               // was: TokenService, the stub\n  ) {}\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    // 1. Does the route have the @Public() label? Check the method, then the class.\n    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(\n      IS_PUBLIC_KEY,\n      [context.getHandler(), context.getClass()],\n    );\n    if (isPublic) return true;\n\n    // 2. Read the header \"Authorization: Bearer <token>\".\n    const request = context.switchToHttp().getRequest<AuthRequest>();\n    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];\n    if (scheme !== 'Bearer' || !token) {\n      throw new UnauthorizedException({\n        code: 'TOKEN_MISSING',\n        message: 'Send a Bearer token in the Authorization header',\n      });\n    }\n\n    // 3. The real check: the signature AND the expiry. Then turn the claims into an AuthUser.\n    try {\n      const payload = await this.jwt.verifyAsync<JwtPayload>(token);\n      request.user = { id: payload.sub, email: payload.email, roles: payload.roles };\n    } catch {\n      throw new UnauthorizedException({\n        code: 'TOKEN_INVALID',\n        message: 'Your token is invalid or has expired',\n      });\n    }\n    return true;\n  }\n}",
      "label": "auth/auth-user.ts (one addition) and auth/jwt-auth.guard.ts"
    },
    {
      "kind": "text",
      "text": "Many projects use **Passport** instead, a popular Node library with one *strategy* per way of logging in. `@nestjs/passport` wraps it. You write the strategy; `AuthGuard('jwt')` runs it:"
    },
    {
      "kind": "example",
      "code": "// auth/jwt.strategy.ts\nimport { Injectable } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport { PassportStrategy } from '@nestjs/passport';\nimport { ExtractJwt, Strategy } from 'passport-jwt';\nimport type { AuthUser, JwtPayload } from './auth-user';\n\n@Injectable()\nexport class JwtStrategy extends PassportStrategy(Strategy) {      // registered under the name 'jwt'\n  constructor(config: ConfigService) {\n    super({\n      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),\n      ignoreExpiration: false,\n      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),\n    });\n  }\n\n  // Runs only after the signature and expiry were checked. Its return value becomes request.user.\n  validate(payload: JwtPayload): AuthUser {\n    return { id: payload.sub, email: payload.email, roles: payload.roles };\n  }\n}\n\n// auth/jwt-auth.guard.ts: the Passport version of Module 10's guard\nimport { ExecutionContext, Injectable } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { AuthGuard } from '@nestjs/passport';\nimport { IS_PUBLIC_KEY } from './auth.decorators';\n\n@Injectable()\nexport class JwtAuthGuard extends AuthGuard('jwt') {\n  constructor(private readonly reflector: Reflector) {\n    super();\n  }\n\n  canActivate(context: ExecutionContext) {\n    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [\n      context.getHandler(),\n      context.getClass(),\n    ]);\n    return isPublic ? true : super.canActivate(context);\n  }\n}\n\n// auth/auth.module.ts: add PassportModule to `imports` and JwtStrategy to `providers`",
      "label": "auth/jwt.strategy.ts (the Passport version)"
    },
    {
      "kind": "table",
      "head": [
        "",
        "Plain guard",
        "Passport"
      ],
      "rows": [
        [
          "Packages",
          "`@nestjs/jwt` only",
          "also `@nestjs/passport`, `passport`, `passport-jwt`"
        ],
        [
          "Who reads the header",
          "your code",
          "`ExtractJwt.fromAuthHeaderAsBearerToken()`"
        ],
        [
          "Who sets `request.user`",
          "your code",
          "Passport: whatever `validate()` returns"
        ],
        [
          "Error body",
          "Module 10's codes: `TOKEN_MISSING`, `TOKEN_INVALID`",
          "a plain `401 Unauthorized`, unless you override `handleRequest()`"
        ],
        [
          "Best when",
          "you log in one way: a JWT",
          "you have several: password, JWT, Google, API keys"
        ],
        [
          "In the Nest 11 docs",
          "the Authentication chapter",
          "the Passport recipe"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "Both reject a missing, edited or expired token with `401`, and both fill in `request.user` otherwise, so Module 10's `RolesGuard` works with either. Pick one per project. This course continues with the plain guard.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "`@CurrentUser()`, with a real user behind it"
    },
    {
      "kind": "text",
      "text": "Module 13's `@CurrentUser()` does not change. It still hands your handler `request.user`: the whole `AuthUser`, or one field with `@CurrentUser('id')`. On a route with no auth it still throws a `500`, because that is a wiring bug, not the client's mistake. What changes is who is behind it: a real user from a signed token, not one of Module 10's demo users."
    },
    {
      "kind": "example",
      "code": "// auth/dto/credentials.dto.ts\nconst normaliseEmail = ({ value }: { value: unknown }) =>\n  typeof value === 'string' ? value.trim().toLowerCase() : value;\n\nexport class RegisterDto {\n  @Transform(normaliseEmail)           // \" Ada@Example.com \" → \"ada@example.com\"\n  @IsEmail()\n  @MaxLength(254)\n  email: string;\n\n  @IsString()\n  @MinLength(8)\n  @MaxLength(72)                        // bcrypt ignores anything after 72 bytes\n  password: string;\n}\n\nexport class LoginDto {\n  @Transform(normaliseEmail)\n  @IsEmail()\n  email: string;\n\n  @IsString()\n  @MaxLength(72)\n  password: string;\n}\n\n// auth/auth.controller.ts\nimport { Public } from './auth.decorators';                    // Module 10\n\n@Controller('auth')\nexport class AuthController {\n  constructor(private readonly auth: AuthService) {}\n\n  @Public()\n  @Post('register')\n  register(@Body() dto: RegisterDto) {\n    return this.auth.register(dto);    // 201 { id, email, roles }: never the hash\n  }\n\n  @Public()\n  @Post('login')\n  @HttpCode(200)                       // logging in creates nothing, so 200, not 201\n  login(@Body() dto: LoginDto) {\n    return this.auth.login(dto);       // { accessToken }\n  }\n}\n\n// users/users.controller.ts\nimport type { AuthUser } from '../auth/auth-user';\nimport { CurrentUser } from '../auth/current-user.decorator';  // Module 13\n\n@Controller('users')\nexport class UsersController {\n  @Get('me')                           // no @Public(), so the global guard has already run\n  me(@CurrentUser() user: AuthUser) {  // the whole user...\n    return user;\n  }\n  // ...or one field of it: @CurrentUser('id') userId: string\n}",
      "label": "auth/auth.controller.ts, its DTOs, and users/users.controller.ts"
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Version notes · Nest 11",
      "blocks": [
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "Module 13's `import type` rule still applies: `AuthUser` in `@CurrentUser() user: AuthUser` must come in with `import type`, or the build fails with error TS1272.",
            "`@nestjs/jwt` 11 types `expiresIn` as a number of seconds or a duration such as `'15m'`. A plain `string` read from config does not type-check: write the value as a literal, or store seconds and pass `Number(...)`.",
            "`passport-jwt` needs `secretOrKey` to be a `string`. `config.get()` might return `undefined`, so it does not type-check; `config.getOrThrow()` does, and fails at startup when the secret is missing.",
            "Today's Nest docs describe Nest 12, including a new, early `@nestjs/authentication` package (version 0.0.x, Nest 12 only). On Nest 11, build the pieces as in this module; once you know them, any packaged version is easy to read."
          ]
        }
      ]
    },
    {
      "kind": "quiz",
      "question": "You raise bcrypt's cost factor from 10 to 12. Roughly how much longer does it take to hash one password?",
      "options": [
        "About 20% longer, because 12 is 20% more than 10",
        "About twice as long",
        "About four times as long",
        "About a hundred times as long"
      ],
      "answer": 2,
      "why": "**About four times as long.** The cost is a power of two: cost 12 means 2 to the power 12 rounds, and each +1 doubles the work. In the measurement above, cost 10 took 47 ms and cost 12 took 185 ms. That slowness is the whole point: an attacker with your stolen table pays the same price for every single guess. Pick the highest cost your login endpoint can afford, measured on your own servers, and remember that every login and every registration pays it once."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 17.1",
      "title": "Replace Module 10's stub with real logins",
      "blocks": [
        {
          "kind": "text",
          "text": "Add register and login, give `JwtAuthGuard` the real check, register `JwtModule`, and delete `auth/token.service.ts`. Then prove each of these with a request:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "Registering returns `201` with `id`, `email` and `roles`, and no hash.",
            "Registering the same email again, in a different letter case, returns `409` with the code `EMAIL_TAKEN`.",
            "A wrong password and an unknown email return the same `401`, with the same message.",
            "`GET /api/users/me` returns `401` without a token, and your user with one.",
            "Module 10's old demo token, `user-token`, is now refused.",
            "Change one character of your token: `401`. Set `expiresIn` to `'10s'`, wait, and try again: `401`."
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
                "Register: `201 {\"id\":\"ebd7e66f-...\",\"email\":\"ada@example.com\",\"roles\":[\"user\"]}`. The DTO lower-cased the email, and `roles` came from the column's default.",
                "Duplicate: `409 {\"code\":\"EMAIL_TAKEN\",\"message\":\"An account with this email already exists\",...}`. Because the DTO lower-cases emails, `Ada@Example.com` and `ada@example.com` are the same account, and the unique column enforces it.",
                "Wrong password and unknown email: both `401 {\"code\":\"INVALID_CREDENTIALS\",\"message\":\"Invalid email or password\",...}`, and both take about as long as one bcrypt hash.",
                "`GET /api/users/me` without a token: `401` with Module 10's code `TOKEN_MISSING`. With `user-token`: `401 {\"code\":\"TOKEN_INVALID\",\"message\":\"Your token is invalid or has expired\",...}`. With your real token: `200 {\"id\":\"ebd7e66f-...\",\"email\":\"ada@example.com\",\"roles\":[\"user\"]}`.",
                "An edited token and an expired one both give `401 TOKEN_INVALID`.",
                "Products you created with Module 10's demo tokens keep the demo user's id in `createdBy`. No real user has that id, so those products no longer appear in anyone's `GET /api/products/mine`."
              ]
            },
            {
              "kind": "text",
              "text": "If you kept Module 11's envelope, each success body above arrives inside `{ \"data\": ... }`. Error bodies come from Module 8's filter and are never wrapped.",
              "style": "small"
            },
            {
              "kind": "text",
              "text": "Now decode the middle part of your token: `node -e \"console.log(Buffer.from(process.argv[1].split('.')[1], 'base64url').toString())\" \"$TOKEN\"`. You get `{\"sub\":\"ebd7e66f-...\",\"email\":\"ada@example.com\",\"roles\":[\"user\"],\"iat\":1791295131,\"exp\":1791296031}`. No secret was needed to read it, and `exp` minus `iat` is 900 seconds, the 15 minutes you set.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q29",
      "title": "How do you store passwords, and why bcrypt or Argon2 rather than SHA-256?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I never store the password, only a slow, salted hash: bcrypt with a cost of 12 or so, or Argon2id, which OWASP now lists first. SHA-256 is the wrong tool because it is fast. Fast is good for checking file integrity and terrible for passwords, because an attacker with a stolen table can try billions of guesses per second on a GPU. bcrypt and Argon2 are slow on purpose and tunable, and they add a random salt per password, so identical passwords get different hashes and precomputed tables are useless."
        },
        {
          "kind": "text",
          "text": "Around that: the salt and cost live inside the hash string, so `compare` needs nothing else; I raise the cost over time as hardware gets faster; and with bcrypt I cap passwords at 72 bytes, because it ignores anything longer. The hash column is `select: false`, it is excluded from serialization, it is never logged, and login gives one answer for an unknown email and a wrong password, with a dummy compare so the timing matches, plus rate limiting on the endpoint."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q30",
      "title": "Walk me through JWT authentication in NestJS, from login to `@CurrentUser()`.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `POST /api/auth/login` validates the DTO, loads the user with the password hash selected explicitly, and checks it with `bcrypt.compare`. On success it signs a short-lived access token with `JwtService.signAsync`. The payload holds only `sub` (the user id) and what authorization needs, such as roles, and the secret and expiry come from `JwtModule.registerAsync` with `ConfigService`. The client sends the token as `Authorization: Bearer ...` on every request."
        },
        {
          "kind": "text",
          "text": "A guard registered as `APP_GUARD` runs before every handler. It reads `@Public()` metadata with `Reflector` to skip open routes, extracts the bearer token, and calls `verifyAsync`, which checks the signature and the expiry. Then it maps the claims to a user object on `request.user`, and a roles guard registered after it can read that user. A `createParamDecorator` like `@CurrentUser()` hands it to the handler. The guard can be written by hand or with `@nestjs/passport` and `passport-jwt`, where the strategy's `validate()` return value becomes `request.user`; Passport is worth it when there are several login methods. Because the token is stateless and cannot be cancelled, I keep it short-lived, around 15 minutes, and pair it with a revocable refresh token."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 18: refresh tokens that rotate and catch thieves, logout that really logs out, and authorization that goes beyond roles."
    }
  ]
};
