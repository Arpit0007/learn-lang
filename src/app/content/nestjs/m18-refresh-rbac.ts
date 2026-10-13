import { Lesson } from '../../shared/content';

export const M18_REFRESH_RBAC: Lesson = {
  "slug": "m18-refresh-rbac",
  "title": "M18 Refresh tokens, sessions and RBAC",
  "nav": "Refresh tokens & RBAC",
  "num": "M18",
  "eyebrow": "Level 5 · Week 10 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Module 17's access token lives for 15 minutes. That is on purpose: a stolen token is useful only for a short time. But nobody wants to type a password every 15 minutes. The answer is a second token that lives longer, the **refresh token**. It has one job: at `POST /api/auth/refresh`, it buys a fresh access token."
    },
    {
      "kind": "text",
      "text": "A refresh token lives for days, so it must be possible to cancel it, and that means the server keeps a record of each one. This module builds that record, replaces the token every time it is used, catches stolen tokens being replayed, and makes logout real. Then it takes **authorization** past Module 10's roles: roles that come from the database, permissions for single actions, and checks on who owns a row."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "The access token is a short ticket for each request. The refresh token is a longer ticket that you trade in for a new pair."
        },
        {
          "kind": "text",
          "text": "Every trade gives you a new refresh token, and the old one stops working."
        },
        {
          "kind": "text",
          "text": "If an old one ever comes back, someone has stolen a copy, so the server cancels them all."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The design: rotation with reuse detection"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Login.** Issue an access token (15 minutes) and a refresh token (7 days). Save a hash of the refresh token with a new *family id*. One family means one login on one device: a *session*.",
        "**Refresh.** Find the token by its hash. If it is unused and unexpired, mark it used and issue a new pair in the same family. This is **rotation**.",
        "**Reuse.** If a token that was already used comes back, two people hold a copy, and the server cannot tell which one is honest. Revoke the whole family. This is **reuse detection**.",
        "**Logout.** Revoke the family of the token in the cookie. *Log out everywhere* revokes every family of the user."
      ]
    },
    {
      "kind": "example",
      "code": "import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';\nimport { User } from '../../users/entities/user.entity';\n\n@Entity('refresh_tokens')\nexport class RefreshToken {\n  @PrimaryGeneratedColumn('uuid')\n  id: string;\n\n  @ManyToOne(() => User, { onDelete: 'CASCADE' })        // delete a user, and their sessions go too\n  user: User;\n\n  @Index()\n  @Column('uuid')\n  userId: string;\n\n  @Index()\n  @Column('uuid')\n  familyId: string;                                       // one login on one device = one family\n\n  @Column({ type: 'char', length: 64, unique: true })\n  tokenHash: string;                                      // SHA-256 of the token, as hex. Never the token.\n\n  @Column({ type: 'timestamptz' })\n  expiresAt: Date;\n\n  @Column({ type: 'timestamptz', nullable: true })        // `type` is required for a `Date | null` property\n  revokedAt: Date | null;                                 // set when the token is used or the session ends\n\n  @CreateDateColumn({ type: 'timestamptz' })\n  createdAt: Date;\n}",
      "label": "auth/entities/refresh-token.entity.ts"
    },
    {
      "kind": "text",
      "text": "Why store a hash and not the token? If someone steals a database backup, plain tokens in it would let them act as your users until the tokens expire. Hashes are useless to them. `onDelete: 'CASCADE'` is right here (Module 15's question): a session cannot exist without its user.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Hash the token with SHA-256, not bcrypt"
    },
    {
      "kind": "text",
      "text": "Module 17 just taught you bcrypt, so the tempting move is to hash refresh tokens with it too. Run this, and see why that is a trap:"
    },
    {
      "kind": "example",
      "code": "// prove-it.ts: why bcrypt is the wrong hash for refresh tokens. Run it: npx ts-node prove-it.ts\nimport * as bcrypt from 'bcrypt';\nimport { JwtService } from '@nestjs/jwt';\nimport { randomUUID } from 'node:crypto';\n\nasync function main() {\n  const jwt = new JwtService({ secret: 'demo-only-not-a-real-secret' });\n  const userId = randomUUID();\n\n  // Two refresh tokens for the same user, each with its own family and its own jti\n  const a = jwt.sign({ sub: userId, fam: randomUUID() }, { expiresIn: '7d', jwtid: randomUUID() });\n  const b = jwt.sign({ sub: userId, fam: randomUUID() }, { expiresIn: '7d', jwtid: randomUUID() });\n\n  const storedHash = await bcrypt.hash(a, 10);         // what the bcrypt version saves for token A\n\n  console.log(a === b);                                 // false: two different tokens\n  console.log(a.slice(0, 72) === b.slice(0, 72));       // true: same header, and \"sub\" comes first\n  console.log(await bcrypt.compare(b, storedHash));     // true (!): token B passes as token A\n}\n\nvoid main();",
      "label": "prove-it.ts",
      "verdict": "bad"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · bcrypt reads only the first 72 bytes",
      "blocks": [
        {
          "kind": "text",
          "text": "bcrypt ignores everything after byte 72 of its input. A JWT starts with its header, which with `@nestjs/jwt`'s defaults is always the same 36 characters, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`, and a dot. The payload comes next, and ours starts with `{\"sub\":\"<user id>\"`. So the first 72 bytes are the header, the dot, and the start of the user id: the same for every refresh token this user will ever get. The family, the `jti` and the signature all come later, and bcrypt never sees them."
        },
        {
          "kind": "text",
          "text": "The result: `bcrypt.compare(anyTokenOfThisUser, storedHash)` is `true`. An old, stolen token passes as the newest one, and reuse detection is dead. In the test run for this course, even the user's *access* token matched. bcrypt also has a salt, so you cannot search for a row by its hash; you would load every row of the user and run a slow compare on each."
        }
      ]
    },
    {
      "kind": "text",
      "text": "SHA-256 is the right tool here. Why is a fast hash fine for tokens, when Module 17 said fast hashes are wrong for passwords? A password is short and guessable, so the attacker's guessing speed matters. A refresh token is long and random (its signature alone is 256 bits), so there is nothing to guess. And SHA-256 has no salt: the same token always gives the same 64 hex characters, so the database can find the row with one indexed lookup, `WHERE \"tokenHash\" = $1`."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rotation, reuse detection and logout"
    },
    {
      "kind": "example",
      "code": "import { Injectable, UnauthorizedException } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport { JwtService } from '@nestjs/jwt';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { createHash, randomUUID } from 'node:crypto';\nimport { DataSource, EntityManager, IsNull, MoreThan, Repository } from 'typeorm';\nimport { User } from '../users/entities/user.entity';\nimport type { AuthUser } from './auth-user';\nimport { RefreshToken } from './entities/refresh-token.entity';\n\nconst REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;          // 7 days\nconst sha256 = (token: string) => createHash('sha256').update(token).digest('hex');\n\ninterface RefreshPayload { sub: string; fam: string }\nexport interface TokenPair { accessToken: string; refreshToken: string }\n\n@Injectable()\nexport class TokensService {\n  constructor(\n    @InjectRepository(RefreshToken) private readonly tokens: Repository<RefreshToken>,\n    private readonly dataSource: DataSource,\n    private readonly jwt: JwtService,\n    private readonly config: ConfigService,\n  ) {}\n\n  /** Login: a new family (one device), and its first pair. */\n  startSession(user: AuthUser): Promise<TokenPair> {\n    return this.issue(this.tokens.manager, user, randomUUID());\n  }\n\n  /** Refresh: use up the old token and get a new pair in the same family. */\n  async refresh(refreshToken: string): Promise<TokenPair> {\n    const { sub, fam } = await this.verify(refreshToken);       // signature + expiry, or 401\n    const tokenHash = sha256(refreshToken);\n\n    const pair = await this.dataSource.transaction(async (manager) => {\n      // Claim the token in ONE statement. Only one request can flip revokedAt from NULL.\n      const claimed = await manager.update(\n        RefreshToken,\n        { tokenHash, revokedAt: IsNull(), expiresAt: MoreThan(new Date()) },\n        { revokedAt: new Date() },\n      );\n      if (claimed.affected !== 1) return null;\n      const user = await manager.findOneBy(User, { id: sub });  // fresh roles, not the ones from login\n      return user ? this.issue(manager, user, fam) : null;\n    });\n\n    if (!pair) {\n      // Outside the transaction on purpose: this write must survive the 401 below.\n      const known = await this.tokens.findOneBy({ tokenHash });\n      if (known?.revokedAt) await this.revokeFamily(known.familyId);   // reuse: someone has a copy\n      throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN', message: 'Please log in again' });\n    }\n    return pair;\n  }\n\n  /** Logout: end this device's session. */\n  async logout(refreshToken: string): Promise<void> {\n    const row = await this.tokens.findOneBy({ tokenHash: sha256(refreshToken) });\n    if (row) await this.revokeFamily(row.familyId);\n  }\n\n  /** \"Log out everywhere\": end every session of this user. */\n  async logoutEverywhere(userId: string): Promise<void> {\n    await this.tokens.update({ userId, revokedAt: IsNull() }, { revokedAt: new Date() });\n  }\n\n  private async revokeFamily(familyId: string): Promise<void> {\n    await this.tokens.update({ familyId, revokedAt: IsNull() }, { revokedAt: new Date() });\n  }\n\n  private async issue(manager: EntityManager, user: AuthUser, familyId: string): Promise<TokenPair> {\n    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, roles: user.roles });\n    const refreshToken = await this.jwt.signAsync({ sub: user.id, fam: familyId }, {\n      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),   // not the access-token secret\n      expiresIn: REFRESH_TTL_SECONDS,\n      jwtid: randomUUID(),                    // without it, two tokens made in the same second are identical\n    });\n    await manager.insert(RefreshToken, {\n      userId: user.id,\n      familyId,\n      tokenHash: sha256(refreshToken),\n      expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),\n    });\n    return { accessToken, refreshToken };\n  }\n\n  private async verify(token: string): Promise<RefreshPayload> {\n    try {\n      return await this.jwt.verifyAsync<RefreshPayload>(token, {\n        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),\n      });\n    } catch {\n      throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN', message: 'Please log in again' });\n    }\n  }\n}",
      "label": "auth/tokens.service.ts",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`verify` checks the signature, made with a separate refresh secret, and the expiry first. A forged or expired token never reaches the database.",
        "The token is *claimed* with one `UPDATE` that only matches a row that is unused and unexpired. If two requests arrive with the same token, only one gets `affected = 1`. This is the single-statement trick from Module 16.",
        "The new pair joins the same family. The user is loaded again, so a role change made since login reaches the new access token.",
        "If nothing was claimed, the code looks the token up after the transaction. A token that exists but is already revoked means a copy is in use somewhere, so the whole family is revoked.",
        "Every token gets a `jti` (JWT ID), here a random UUID. Without it, two tokens signed in the same second for the same family are identical, character for character, and the unique index on `tokenHash` rejects the second one."
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · the revocation that rolls back",
      "blocks": [
        {
          "kind": "text",
          "text": "Look at where `revokeFamily` runs: after the transaction, not inside it. If it ran inside, the `UnauthorizedException` thrown next would roll the transaction back, and the revocation with it. The request would still fail with `401`, but the family would stay alive, and a thief who refreshed first would keep their session. A write that must survive an error has to be committed before you throw."
        }
      ]
    },
    {
      "kind": "text",
      "text": "One honest weak spot: two browser tabs that refresh at the same moment with the same token look exactly like theft, and the user is logged out. Clients avoid it by sharing one refresh call between tabs; some servers allow a short grace period instead, during which a just-rotated token still gets the same new pair.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · a JWT cannot be taken back",
      "blocks": [
        {
          "kind": "text",
          "text": "Logout revokes the refresh token, but the access token already in the client's memory keeps working until it expires. In this course's test run, `GET /api/users/me` with the old access token still returned `200` after logout. That is why access tokens are short, and why `refresh()` reloads the user: a changed role reaches the user within one access-token lifetime (you will see it happen in the roles section below)."
        },
        {
          "kind": "text",
          "text": "When you need an instant cut-off, such as a banned user or a stolen laptop, give access tokens a `jti` and keep a list of revoked ids until they expire, or keep a token version per user. The guard checks it on every request, usually in Redis (Module 22)."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Where the refresh token lives: a cookie or a header"
    },
    {
      "kind": "text",
      "text": "Two words first. *XSS* (cross-site scripting) is when an attacker gets their JavaScript to run inside your page. *CSRF* (cross-site request forgery) is when another website makes your browser send a request to your API, with your cookies attached."
    },
    {
      "kind": "table",
      "head": [
        "",
        "`httpOnly` cookie",
        "`Authorization` header"
      ],
      "rows": [
        [
          "Who can read it",
          "only the browser, never the page's JavaScript",
          "the page's JavaScript, so an XSS script can too"
        ],
        [
          "How it is sent",
          "automatically, to the cookie's `path`",
          "by your code, on each request"
        ],
        [
          "Main risk",
          "CSRF, which `SameSite` blocks",
          "XSS stealing it"
        ],
        [
          "Fits",
          "browser apps",
          "mobile apps, CLIs, server-to-server"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "This course uses both, each where it fits: the refresh token goes in an `httpOnly` cookie limited to `/api/auth`, and the access token comes back in the JSON body, stays in the client's memory, and travels in the `Authorization` header. This is the first module that reads cookies, so install the parser:"
    },
    {
      "kind": "example",
      "code": "npm i cookie-parser\nnpm i -D @types/cookie-parser",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "example",
      "code": "// main.ts: let Express read cookies into req.cookies\napp.use(cookieParser());                    // import cookieParser from 'cookie-parser';\n\n// auth/auth.controller.ts\nimport { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';\nimport type { CookieOptions, Request, Response } from 'express';\nimport type { AuthUser } from './auth-user';\nimport { Public } from './auth.decorators';                    // Module 10\nimport { AuthService } from './auth.service';\nimport { CurrentUser } from './current-user.decorator';        // Module 13\nimport { LoginDto } from './dto/credentials.dto';\nimport { TokensService } from './tokens.service';\n\nconst REFRESH_COOKIE = 'refresh_token';\nconst refreshCookie: CookieOptions = {\n  httpOnly: true,                       // page JavaScript cannot read it, so XSS cannot steal it\n  secure: true,                         // only sent over HTTPS\n  sameSite: 'strict',                   // not sent when another site starts the request\n  path: '/api/auth',                        // only sent to /api/auth/..., not with every API call\n  maxAge: 7 * 24 * 60 * 60 * 1000,      // milliseconds: the same 7 days as the token\n};\n\n@Controller('auth')\nexport class AuthController {\n  constructor(\n    private readonly auth: AuthService,\n    private readonly tokens: TokensService,\n  ) {}\n\n  @Public()\n  @Post('login')\n  @HttpCode(200)\n  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {\n    const user = await this.auth.validateUser(dto);                 // Module 17's checks\n    const { accessToken, refreshToken } = await this.tokens.startSession(user);\n    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookie);\n    return { accessToken };                                         // the refresh token is not in the body\n  }\n\n  @Public()                                   // the access token has expired: that is why we are here\n  @Post('refresh')\n  @HttpCode(200)\n  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {\n    const token: string | undefined = req.cookies?.[REFRESH_COOKIE];\n    if (!token) throw new UnauthorizedException();\n    const { accessToken, refreshToken } = await this.tokens.refresh(token);\n    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookie);        // the new one replaces the old\n    return { accessToken };\n  }\n\n  @Public()\n  @Post('logout')\n  @HttpCode(204)\n  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {\n    const token: string | undefined = req.cookies?.[REFRESH_COOKIE];\n    if (token) await this.tokens.logout(token);\n    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });              // same path, or it is not cleared\n  }\n\n  @Post('logout-all')                         // needs a valid access token\n  @HttpCode(204)\n  async logoutAll(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) res: Response) {\n    await this.tokens.logoutEverywhere(user.id);\n    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });\n  }\n}",
      "label": "main.ts and auth/auth.controller.ts"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`@Res({ passthrough: true })` gives you Express's `res` to set a cookie, while Nest still sends your return value as usual. Without `passthrough`, you must send the response yourself.",
        "The login answer carries a header like `Set-Cookie: refresh_token=eyJ...; Max-Age=604800; Path=/api/auth; HttpOnly; Secure; SameSite=Strict`.",
        "The cookie's `path` includes Module 3's global prefix, `api`. A cookie for `/auth` is never sent to `/api/auth/refresh`, and every refresh answers `401`. `clearCookie` must use the same `path`, or the browser keeps the cookie.",
        "`SameSite: 'strict'` works when the app and the API are on the same site, such as `app.shop.com` and `api.shop.com`. With an API on a different domain, you need `SameSite: 'none'` together with CSRF protection.",
        "Most browsers, and curl, treat `http://localhost` as secure, so a `Secure` cookie still works in development."
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Because you come from Angular",
      "blocks": [
        {
          "kind": "text",
          "text": "In your Angular app, refreshing is an `HttpInterceptor`. On a `401`, call `POST /api/auth/refresh` once, store the new access token in a service, and retry the original request. If the API is on another origin, send that call with `withCredentials: true`, or the browser leaves the cookie out (the API also needs CORS with `credentials: true`, as in Module 3's `main.ts`). Keep the access token in memory, not in `localStorage`, where any injected script can read it."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Roles: from the database, through the token"
    },
    {
      "kind": "text",
      "text": "**Role-based access control** (RBAC) is what Module 10 built: `@Roles('admin')` on a route, and a `RolesGuard` that compares it with `request.user.roles`. Until now those roles came from the stub's two demo tokens. Now they come from the `roles` column: `validateUser()` reads them at login, they travel inside the access token, and `refresh()` reads them from the database again. `RolesGuard` itself does not change, and neither does the guard order. That is the payoff of keeping *who are you?* and *may you?* in two separate guards."
    },
    {
      "kind": "example",
      "code": "# Sam logs in. His access token, decoded:\n{\"sub\":\"147f3c62-5211-4e2c-9f02-409c2b77e3c9\",\"email\":\"sam@example.com\",\"roles\":[\"user\"],\"iat\":1791295430,\"exp\":1791296330}\n\n# DELETE /products/3 is @Auth('admin') in Module 13's controller, so Module 10's RolesGuard says no:\n$ curl -s -X DELETE localhost:3000/api/products/3 -H \"authorization: Bearer $SAM\"\n{\"statusCode\":403,\"code\":\"FORBIDDEN\",\"message\":\"Forbidden resource\",...}\n\n# An admin promotes him in the database:\nUPDATE \"users\" SET \"roles\" = '{user,admin}' WHERE \"email\" = 'sam@example.com';\n\n# The same old token still says \"user\", so the same request still gets 403.\n# His next refresh loads him from the database, and the new access token says:\n{\"sub\":\"147f3c62-5211-4e2c-9f02-409c2b77e3c9\",\"email\":\"sam@example.com\",\"roles\":[\"user\",\"admin\"],\"iat\":1791295430,\"exp\":1791296330}\n\n$ curl -s -o /dev/null -w '%{http_code}\\n' -X DELETE localhost:3000/api/products/3 -H \"authorization: Bearer $NEW\"\n204",
      "lang": "text",
      "label": "terminal · a promotion arrives with the next refresh"
    },
    {
      "kind": "text",
      "text": "A role you remove travels the same way: the old access token keeps it until it expires, and the next refresh drops it. One more reason to keep access tokens short. In development, this `UPDATE` is also the simplest way to make yourself an admin.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Permissions: finer than roles"
    },
    {
      "kind": "text",
      "text": "Two roles are easy. The day you add a third, say `support` staff who may read every order but not refund one, every `@Roles('admin')` in the codebase needs a second look. Name the *action* instead, and keep one map from roles to permissions. Adding a role then means one new line in one place:"
    },
    {
      "kind": "example",
      "code": "// auth/permissions.ts\nexport type Permission = 'products:edit-any' | 'products:delete' | 'orders:read-any' | 'orders:refund';\n\n// The one place that says what each role may do.\nconst ROLE_PERMISSIONS: Record<Role, Permission[]> = {\n  user: [],\n  admin: ['products:edit-any', 'products:delete', 'orders:read-any', 'orders:refund'],\n  // support: ['orders:read-any'],   ← a new role later: one line here, and its name in Role\n};\n\nexport function can(user: AuthUser, permission: Permission): boolean {\n  return user.roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));\n}\n\nexport const PERMISSIONS_KEY = 'permissions';\nexport const RequirePermissions = (...permissions: Permission[]) =>\n  SetMetadata(PERMISSIONS_KEY, permissions);\n\n// auth/permissions.guard.ts: like Module 10's RolesGuard, but the route names an action\n@Injectable()\nexport class PermissionsGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n\n  canActivate(context: ExecutionContext): boolean {\n    const required = this.reflector.getAllAndOverride<Permission[] | undefined>(PERMISSIONS_KEY, [\n      context.getHandler(),\n      context.getClass(),\n    ]);\n    if (!required?.length) return true;\n    const { user } = context.switchToHttp().getRequest<AuthRequest>();\n    return !!user && required.every((permission) => can(user, permission));\n  }\n}\n\n// auth/auth.module.ts: a third global guard, after Module 10's two\n{ provide: APP_GUARD, useClass: JwtAuthGuard },      // 1st: who are you?            → 401\n{ provide: APP_GUARD, useClass: RolesGuard },        // 2nd: may your role do this?  → 403\n{ provide: APP_GUARD, useClass: PermissionsGuard },  // 3rd: may you do this action? → 403\n\n// orders/orders.controller.ts\n@Get(':id')\nfindOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {   // Modules 12 and 13\n  return this.orders.findOne(id, user);\n}\n\n// orders/orders.service.ts: \"your own order, or the permission to read anyone's\"\nasync findOne(id: string, user: AuthUser): Promise<Order> {\n  const order = await this.orders.findOne({ where: { id }, relations: { items: true } });\n  if (!order || (order.userId !== user.id && !can(user, 'orders:read-any'))) {\n    // 404, not 403: a stranger cannot even learn that the order exists\n    throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: `Order ${id} not found` });\n  }\n  return order;\n}",
      "label": "permissions: the map, the guard, its place, an ownership check"
    },
    {
      "kind": "text",
      "text": "Protect a route with `@RequirePermissions('orders:refund')`, just as you would with `@Roles('admin')`. The last part is the ownership check that Module 10's Challenge 10.2 moved into the service: whether this order belongs to this user is only known after the service has loaded the order. Admins get through with the `orders:read-any` permission. Everyone else gets `404`, not `403`, so a stranger cannot even learn that the order exists. Module 14's `createdBy` column allows the same check for products: `product.createdBy !== user.id && !can(user, 'products:edit-any')`. And `ParseUUIDPipe` (Module 12) turns `/api/orders/not-a-uuid` into a `400` before any query runs."
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Key idea · three questions, three places",
      "blocks": [
        {
          "kind": "table",
          "head": [
            "Question",
            "Example",
            "Where it lives"
          ],
          "rows": [
            [
              "Which role?",
              "Is this user an admin?",
              "`@Roles()` and Module 10's `RolesGuard`"
            ],
            [
              "Which action?",
              "May this user refund an order?",
              "a role-to-permission map, `@RequirePermissions()` and `PermissionsGuard`"
            ],
            [
              "Which row?",
              "May this user read *this* order?",
              "the service, after it loads the row, or a policy library"
            ]
          ]
        }
      ]
    },
    {
      "kind": "text",
      "text": "When rules depend on the data itself, such as \"an author may edit their own post while it is still a draft\", hand-written checks multiply. A *policy library* keeps such rules in one place. The best known for TypeScript is [CASL](https://casl.js.org): you declare rules like `can('update', 'Order', { userId: user.id })` and then ask `ability.can('update', order)`. The Nest docs show how to wire it into a guard in [Integrating CASL](https://docs.nestjs.com/security/authorization#integrating-casl). Start with the map above, and reach for CASL when the rules outgrow it."
    },
    {
      "kind": "quiz",
      "question": "A refresh token that was already used once comes back to `POST /api/auth/refresh`. It has not expired. What should the server do?",
      "options": [
        "Accept it, because it has not expired yet",
        "Reject only this request with `401`, and change nothing else",
        "Revoke every token in that token's family, then answer `401`",
        "Lock the user's account until they reset their password"
      ],
      "answer": 2,
      "why": "**Revoke the family, then `401`.** A used token coming back means two parties hold a copy, and the server cannot tell which one is the real user. Revoking the whole family kills the thief's copy *and* the newest token, so both must log in again, and only the real user knows the password. Rejecting only this request would leave the thief's newer token, if they got one first, still working. Locking the account punishes the victim and lets anyone lock anyone out."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 18.1",
      "title": "Catch a stolen refresh token",
      "blocks": [
        {
          "kind": "text",
          "text": "Add `TokensService`, the cookie, and the `refresh`, `logout` and `logout-all` routes. Then act out a theft with curl. Its cookie jar (`-c` to save, `-b` to send) plays the browser. Log in, copy the jar file as the \"stolen\" cookie, refresh as the real user, and then replay the stolen copy. Predict each answer before you run it."
        },
        {
          "kind": "text",
          "text": "Then look at `refresh_tokens` in the database: how many rows does that family have, and how many are revoked?"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "# 1. Log in. The jar file keeps the refresh cookie, the way a browser would.\n$ curl -s -c jar.txt -X POST localhost:3000/api/auth/login -H 'content-type: application/json' \\\n    -d '{\"email\":\"ada@example.com\",\"password\":\"correct horse battery\"}'\n{\"accessToken\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"}\n\n# 2. An attacker copies the cookie.\n$ cp jar.txt stolen.txt\n\n# 3. The real user refreshes: a new pair, and the old refresh token is used up.\n$ curl -s -b jar.txt -c jar.txt -X POST localhost:3000/api/auth/refresh\n{\"accessToken\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"}\n\n# 4. The attacker replays the old token. Reuse detected:\n$ curl -s -b stolen.txt -X POST localhost:3000/api/auth/refresh\n{\"statusCode\":401,\"code\":\"INVALID_REFRESH_TOKEN\",\"message\":\"Please log in again\",...}\n\n# 5. ...so the whole family was revoked, and the real user's new token is dead too:\n$ curl -s -b jar.txt -X POST localhost:3000/api/auth/refresh\n{\"statusCode\":401,\"code\":\"INVALID_REFRESH_TOKEN\",\"message\":\"Please log in again\",...}\n\n# 6. Log in again (as in step 1), then log out. The server sends an expired, empty cookie:\n$ curl -s -i -b jar.txt -c jar.txt -X POST localhost:3000/api/auth/logout\nHTTP/1.1 204 No Content\nSet-Cookie: refresh_token=; Path=/api/auth; Expires=Thu, 01 Jan 1970 00:00:00 GMT\n\n# Success bodies are shown without Module 11's envelope; in your app they arrive as {\"data\": ...}.",
              "lang": "text",
              "label": "terminal · what you should see"
            },
            {
              "kind": "text",
              "text": "The family has two rows, one per token, and both are revoked: the first by rotation, the second by reuse detection. Also try `GET /api/users/me` with the access token from before the logout. It still answers `200`, which is the \"a JWT cannot be taken back\" trap, seen for yourself.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q31",
      "title": "How do refresh tokens work, and how do you detect a stolen one?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The access token is short-lived, around 15 minutes, and stateless. The refresh token lives for days and is stateful: I store a SHA-256 hash of each one with a family id, an expiry and a `revokedAt` column. At refresh, I verify the JWT signature with a separate refresh secret, then claim the row with one conditional `UPDATE` that sets `revokedAt` only where it is still null and unexpired, and issue a new pair in the same family. That is rotation, and the single statement makes concurrent refreshes safe."
        },
        {
          "kind": "text",
          "text": "Reuse detection follows from it. If a token that was already rotated comes back, someone holds a copy, so I revoke the whole family, outside the transaction so the revocation is not rolled back with the error, and return `401`. Logout revokes the family; log-out-everywhere revokes all of the user's families. I hash with SHA-256 rather than bcrypt because tokens are high-entropy, so a fast deterministic hash is safe and can be indexed, while bcrypt reads only 72 bytes, and JWTs from one user share their first 72. In the browser, the refresh token lives in an `httpOnly`, `Secure`, `SameSite` cookie scoped to `/api/auth`, and the access token stays in memory."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q32",
      "title": "How would you design authorization in NestJS: roles, permissions, or policies?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** In layers, each in the place that has the information it needs. Authentication first: a global JWT guard sets `request.user`, and `@Public()` opts routes out. Then roles: `@Roles()` metadata read by a `RolesGuard` through `Reflector`, registered after the JWT guard because global guards run in order. When roles start to multiply, I name actions instead, `@RequirePermissions('orders:refund')`, backed by one map from roles to permissions, so changing what a role may do is a single edit."
        },
        {
          "kind": "text",
          "text": "Guards only see the request, not the row, so ownership checks such as \"this order belongs to this user\" go in the service, after the row is loaded. There I return `404` rather than `403` for someone else's resource, so its existence is not leaked. When rules become attribute-based and conditional, I move them into a policy library such as CASL, so they are declared in one place and tested on their own. Throughout: `401` means \"who are you?\", `403` means \"you may not\", and the server never trusts the client's view of what is allowed."
        }
      ]
    },
    {
      "kind": "text",
      "text": "That completes Level 5. Your API now keeps its data through restarts, changes its schema through reviewed migrations, stays consistent under load, and knows who is asking and what they may do. Next, Module 19: configuration and architecture. One typed place for every setting, checked at startup, and clear borders between your modules."
    }
  ]
};
