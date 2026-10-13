import { Lesson } from '../../shared/content';

export const M21_FILES_EMAIL_APIS: Lesson = {
  "slug": "m21-files-email-apis",
  "title": "M21 Files, email and external APIs",
  "nav": "Files, email & APIs",
  "num": "M21",
  "eyebrow": "Level 6 · Week 12 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A real shop talks to the outside world. Admins upload product photos. The app sends emails. It calls other companies' APIs, like a shipping service, and those companies call you back with **webhooks**: HTTP requests they send to your server when something happens, such as a payment going through."
    },
    {
      "kind": "text",
      "text": "Each of these crosses a border you don't control. Files can be huge, or not what they claim to be. Email servers go down. Other APIs are slow, or broken for an hour. Webhooks can be forged, or arrive twice. This module gives you a safe pattern for each one."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "title": "In simple words",
      "blocks": [
        {
          "kind": "text",
          "text": "Check every file before you keep it, and save it through an interface so you can move it to the cloud later. Put a time limit on every call to another service, and decide what happens when it fails. Check that every webhook really came from the sender, and make handling it twice harmless."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "File uploads"
    },
    {
      "kind": "text",
      "text": "Browsers upload files as `multipart/form-data`, a request format that carries files and normal form fields together. Nest reads it with **multer**, a library that comes with `@nestjs/platform-express`. Add its types with `npm i -D @types/multer`. That gives you the `Express.Multer.File` type."
    },
    {
      "kind": "example",
      "code": "import {\n  Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post,\n  UploadedFile, UseInterceptors,\n} from '@nestjs/common';\nimport { FileInterceptor } from '@nestjs/platform-express';\nimport { Roles } from '../auth/auth.decorators';\nimport { ProductImagesService } from './product-images.service';\n\nconst MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB\n\n@Controller('products/:id/images')\nexport class ProductImagesController {\n  constructor(private readonly images: ProductImagesService) {}\n\n  @Roles('admin') // Module 10. Guards run before interceptors, so multer never reads a non-admin's file.\n  @Post()\n  @UseInterceptors(\n    // Reads the \"image\" field of a multipart/form-data request into memory (file.buffer).\n    // multer stops reading past the limit, and Nest answers 413 Payload Too Large.\n    FileInterceptor('image', { limits: { fileSize: MAX_IMAGE_BYTES, files: 1 } }),\n  )\n  upload(\n    @Param('id', ParseIntPipe) productId: number,\n    @UploadedFile(\n      new ParseFilePipe({\n        validators: [\n          new MaxFileSizeValidator({ maxSize: MAX_IMAGE_BYTES }),\n          new FileTypeValidator({\n            fileType: /^image\\/(png|jpeg|webp)$/,\n            overrideMimeType: true, // Nest 11.2+: replace the client's claim with the detected type\n          }),\n        ],\n      }),\n    )\n    file: Express.Multer.File,\n  ) {\n    return this.images.add(productId, file);\n  }\n}",
      "label": "src/products/product-images.controller.ts",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`FileInterceptor('image')` reads one file from the form field named `image`. With no storage option, multer keeps it in memory as `file.buffer`.",
        "`limits.fileSize` is your real protection. Multer stops reading at 5 MB and Nest answers `413 Payload Too Large`, so a 2 GB upload never fills your memory. `MaxFileSizeValidator` only runs after the whole file has been read. With the same number it mostly documents the rule, so keep the multer limit even if you drop the validator.",
        "`FileTypeValidator` reads the file's first bytes, its **magic number**. Every PNG starts with the same 8 bytes, and every JPEG with the same 3. Since Nest 11.1, it checks these bytes instead of trusting the type the browser claims. A text file renamed `photo.png` now fails with `400`.",
        "`overrideMimeType: true` (Nest 11.2 and later) then replaces `file.mimetype` with the detected type. Without it, `file.mimetype` is still whatever the client said.",
        "`@Roles('admin')` (Module 10) keeps uploads for admins. Guards run before interceptors (Module 9), so a non-admin gets `403` before multer reads a single byte of the file, even a 2 GB one.",
        "`ParseIntPipe` turns the `:id` in the URL into a number, because product IDs are integers."
      ]
    },
    {
      "kind": "text",
      "text": "The magic-number check needs `file.buffer`, so it only works with memory storage. For very large files, such as videos, skip your server: give the browser a **presigned URL**, a short-lived signed link, and let it upload straight to object storage.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · trusting the file name and type",
      "blocks": [
        {
          "kind": "text",
          "text": "`file.originalname` and the client's `file.mimetype` are user input. Write a file named `../../src/main.ts` with `join('uploads', file.originalname)`, and it lands outside your folder. That is a **path traversal** attack. And a file that claims `text/html`, served from your own domain, can run scripts in your users' browsers. Generate your own key, take the type from the detected bytes, and treat the original name as a label at most."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Storing files behind an interface"
    },
    {
      "kind": "text",
      "text": "Where should the bytes go? On your laptop, a folder is fine. In production, a folder on one server is a problem: a second instance can't see it, and a redeploy may wipe it. So production files go to **object storage**, a service that stores files by key, such as AWS S3. Many others speak the same S3 API, including Cloudflare R2, MinIO and DigitalOcean Spaces. Hide the choice behind an abstract class (Module 20), and the rest of the app never knows. Install the client with `npm i @aws-sdk/client-s3`."
    },
    {
      "kind": "example",
      "code": "import { mkdir, rm, writeFile } from 'node:fs/promises';\nimport { dirname, join, resolve } from 'node:path';\nimport { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';\n\n/** All the rest of the app knows about storage. An abstract class, so it can be a token. */\nexport abstract class FileStorage {\n  abstract put(key: string, body: Buffer, contentType: string): Promise<void>;\n  abstract delete(key: string): Promise<void>;\n  abstract publicUrl(key: string): string;\n}\n\n/** Development: files go into ./uploads on this machine. */\nexport class LocalDiskStorage extends FileStorage {\n  private readonly root = resolve('uploads');\n\n  async put(key: string, body: Buffer): Promise<void> {\n    const path = join(this.root, key);\n    await mkdir(dirname(path), { recursive: true });\n    await writeFile(path, body);\n  }\n\n  async delete(key: string): Promise<void> {\n    await rm(join(this.root, key), { force: true });\n  }\n\n  publicUrl(key: string): string {\n    return `/uploads/${key}`;\n  }\n}\n\nexport interface S3StorageOptions {\n  bucket: string;\n  region: string;\n  endpoint?: string; // set it for S3-compatible services such as Cloudflare R2 or MinIO\n  publicBaseUrl: string;\n}\n\n/** Production: AWS S3 or any S3-compatible service. Credentials come from the environment. */\nexport class S3Storage extends FileStorage {\n  private readonly s3: S3Client;\n\n  constructor(private readonly options: S3StorageOptions) {\n    super();\n    this.s3 = new S3Client({ region: options.region, endpoint: options.endpoint });\n  }\n\n  async put(key: string, body: Buffer, contentType: string): Promise<void> {\n    await this.s3.send(\n      new PutObjectCommand({ Bucket: this.options.bucket, Key: key, Body: body, ContentType: contentType }),\n    );\n  }\n\n  async delete(key: string): Promise<void> {\n    await this.s3.send(new DeleteObjectCommand({ Bucket: this.options.bucket, Key: key }));\n  }\n\n  publicUrl(key: string): string {\n    return `${this.options.publicBaseUrl}/${key}`;\n  }\n}",
      "label": "src/storage/file-storage.ts"
    },
    {
      "kind": "example",
      "code": "// ── config/storage.config.ts ──\nimport { registerAs } from '@nestjs/config';\n\n// Module 19's pattern. Add STORAGE_DRIVER and the S3_* variables to the env schema too.\nexport const storageConfig = registerAs('storage', () => ({\n  driver: (process.env.STORAGE_DRIVER ?? 'local') as 'local' | 's3',\n  bucket: process.env.S3_BUCKET ?? '',\n  region: process.env.S3_REGION ?? 'eu-west-1',\n  endpoint: process.env.S3_ENDPOINT || undefined, // only for R2, MinIO and friends\n  publicBaseUrl: process.env.FILES_PUBLIC_URL ?? '',\n}));\n\n// ── storage/storage.module.ts ──\nimport { Module } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport { storageConfig } from '../config/storage.config';\nimport { FileStorage, LocalDiskStorage, S3Storage } from './file-storage';\n\n@Module({\n  providers: [\n    {\n      provide: FileStorage, // the abstract class is the token (Module 20)\n      inject: [storageConfig.KEY],\n      useFactory: (config: ConfigType<typeof storageConfig>) =>\n        config.driver === 's3'\n          ? new S3Storage({\n              bucket: config.bucket,\n              region: config.region,\n              endpoint: config.endpoint,\n              publicBaseUrl: config.publicBaseUrl,\n            })\n          : new LocalDiskStorage(),\n    },\n  ],\n  exports: [FileStorage],\n})\nexport class StorageModule {}\n\n// ── products/product-images.service.ts ──\nimport { randomUUID } from 'node:crypto';\nimport { Injectable } from '@nestjs/common';\nimport { FileStorage } from '../storage/file-storage';\n\nconst EXTENSIONS: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };\n\n@Injectable()\nexport class ProductImagesService {\n  constructor(private readonly storage: FileStorage) {} // the abstract class, never a concrete one\n\n  async add(productId: number, file: Express.Multer.File): Promise<{ key: string; url: string }> {\n    // Your own name. file.originalname is user input: it can be \"../../app.module.ts\".\n    const key = `products/${productId}/${randomUUID()}.${EXTENSIONS[file.mimetype]}`;\n    await this.storage.put(key, file.buffer, file.mimetype);\n    // Save the key on the product, not the URL: the URL depends on where the file lives.\n    return { key, url: this.storage.publicUrl(key) };\n  }\n}",
      "label": "choosing a driver, and using it"
    },
    {
      "kind": "text",
      "text": "`storageConfig` is a namespace in Module 19's style, and so are `mailConfig` and `shippingConfig` below. Add their variables to the env schema too, as `.optional()` where the namespace has a default.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "This is the factory provider from Module 6, made real. Set `STORAGE_DRIVER=s3` and the app uses S3, with no other change. `S3Client` finds its credentials in the environment, such as `AWS_ACCESS_KEY_ID` or the server's IAM role, so they never appear in your code. In tests, provide a fake `FileStorage` that keeps files in a `Map`."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Sending email"
    },
    {
      "kind": "text",
      "text": "Email follows the same pattern: an abstract `MailSender`, a real implementation, and a fake one for development. The real one uses **nodemailer** (`npm i nodemailer` and `npm i -D @types/nodemailer`) over **SMTP**, the standard protocol for sending mail. Almost every email service accepts SMTP, so you can change services by changing settings, not code."
    },
    {
      "kind": "example",
      "code": "// ── config/mail.config.ts ──\nimport { registerAs } from '@nestjs/config';\n\nexport const mailConfig = registerAs('mail', () => ({\n  driver: (process.env.MAIL_DRIVER ?? 'console') as 'console' | 'smtp',\n  smtp: {\n    host: process.env.SMTP_HOST ?? '',\n    port: Number(process.env.SMTP_PORT ?? 587),\n    user: process.env.SMTP_USER ?? '',\n    password: process.env.SMTP_PASSWORD ?? '',\n    from: process.env.MAIL_FROM ?? 'Shop <orders@shop.example>',\n  },\n}));\n\n// ── mail/mail-sender.ts ──\nimport { Logger } from '@nestjs/common';\nimport { createTransport, type Transporter } from 'nodemailer';\n\nexport interface MailMessage {\n  to: string;\n  subject: string;\n  text: string;\n  html?: string;\n}\n\n/** The token the rest of the app injects. */\nexport abstract class MailSender {\n  abstract send(message: MailMessage): Promise<void>;\n}\n\nexport interface SmtpOptions {\n  host: string;\n  port: number;\n  user: string;\n  password: string;\n  from: string;\n}\n\n/** Real email through any SMTP service. SES, Postmark, Mailgun and SendGrid all offer SMTP. */\nexport class SmtpMailSender extends MailSender {\n  private readonly transporter: Transporter;\n\n  constructor(private readonly options: SmtpOptions) {\n    super();\n    this.transporter = createTransport({\n      host: options.host,\n      port: options.port,\n      secure: options.port === 465, // 465: TLS from the start. 587: upgrades with STARTTLS.\n      auth: { user: options.user, pass: options.password },\n      connectionTimeout: 10_000, // ms\n    });\n  }\n\n  async send(message: MailMessage): Promise<void> {\n    await this.transporter.sendMail({ from: this.options.from, ...message });\n  }\n}\n\n/** Development and tests: write a log line instead of sending. */\nexport class ConsoleMailSender extends MailSender {\n  private readonly logger = new Logger('Mail');\n\n  async send(message: MailMessage): Promise<void> {\n    this.logger.log(`to=${message.to} subject=\"${message.subject}\"`);\n  }\n}\n\n// ── mail/mail.module.ts ──\nimport { Module } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport { mailConfig } from '../config/mail.config';\nimport { ConsoleMailSender, MailSender, SmtpMailSender } from './mail-sender';\n\n@Module({\n  providers: [\n    {\n      provide: MailSender,\n      inject: [mailConfig.KEY],\n      useFactory: (config: ConfigType<typeof mailConfig>) =>\n        config.driver === 'smtp' ? new SmtpMailSender(config.smtp) : new ConsoleMailSender(),\n    },\n  ],\n  exports: [MailSender],\n})\nexport class MailModule {}",
      "label": "src/mail/ — one interface, two senders"
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Don't send email inside the request",
      "blocks": [
        {
          "kind": "text",
          "text": "An SMTP call takes about a second on a good day, and sometimes it fails. If the order request waits for it, the customer waits too. If it throws, their order fails because of an email. Send it from a background job instead. Module 23 moves this exact call into a queue, with retries."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Calling external APIs"
    },
    {
      "kind": "text",
      "text": "`@nestjs/axios` wraps **axios**, the popular HTTP client, in a Nest module. Install it with `npm i @nestjs/axios@4 axios`; version 4 is the release made for Nest 11. Its `HttpService` returns RxJS Observables, so timeouts, retries and error mapping are a few operators."
    },
    {
      "kind": "example",
      "code": "// ── config/shipping.config.ts ──\nimport { registerAs } from '@nestjs/config';\n\nexport const shippingConfig = registerAs('shipping', () => ({\n  baseUrl: process.env.SHIPPING_API_URL as string,\n  apiKey: process.env.SHIPPING_API_KEY as string,\n}));\n\n// ── shipping/shipping.module.ts ──\nimport { HttpModule } from '@nestjs/axios';\nimport { Module } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport { shippingConfig } from '../config/shipping.config';\nimport { ShippingClient } from './shipping.client';\n\n@Module({\n  imports: [\n    HttpModule.registerAsync({\n      inject: [shippingConfig.KEY],\n      useFactory: (config: ConfigType<typeof shippingConfig>) => ({\n        baseURL: config.baseUrl,\n        timeout: 3000, // ms: give up on any single attempt after 3 seconds\n        headers: { Authorization: `Bearer ${config.apiKey}` },\n      }),\n    }),\n  ],\n  providers: [ShippingClient],\n  exports: [ShippingClient],\n})\nexport class ShippingModule {}\n\n// ── shipping/shipping.client.ts ──\nimport { HttpService } from '@nestjs/axios';\nimport { BadGatewayException, GatewayTimeoutException, HttpException, Injectable, Logger } from '@nestjs/common';\nimport { isAxiosError } from 'axios';\nimport { catchError, firstValueFrom, map, retry, throwError, timer } from 'rxjs';\n\nexport interface ShippingQuote {\n  carrier: string;\n  price: number; // in the shop's currency\n  days: number;\n}\n\n@Injectable()\nexport class ShippingClient {\n  private readonly logger = new Logger(ShippingClient.name);\n\n  constructor(private readonly http: HttpService) {}\n\n  quote(postcode: string, weightGrams: number): Promise<ShippingQuote[]> {\n    const request$ = this.http\n      .get<ShippingQuote[]>('/v1/rates', { params: { postcode, weight: weightGrams } })\n      .pipe(\n        // A GET is safe to repeat. Two retries, after 500 ms and 1 s, and only for errors that may pass.\n        retry({\n          count: 2,\n          delay: (error: unknown, attempt: number) =>\n            isRetryable(error) ? timer(250 * 2 ** attempt) : throwError(() => error),\n        }),\n        map((response) => response.data),\n        catchError((error: unknown) => {\n          this.logger.warn(`shipping API failed: ${describe(error)}`);\n          return throwError(() => toHttpError(error));\n        }),\n      );\n    return firstValueFrom(request$); // nothing is sent until this subscribes\n  }\n}\n\nfunction isRetryable(error: unknown): boolean {\n  if (!isAxiosError(error)) return false;\n  if (!error.response) return true; // timeout or network error\n  return [429, 502, 503, 504].includes(error.response.status); // \"try again later\"\n}\n\nfunction toHttpError(error: unknown): HttpException {\n  if (isAxiosError(error) && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')) {\n    return new GatewayTimeoutException('Shipping service timed out'); // 504\n  }\n  return new BadGatewayException('Shipping service unavailable'); // 502: their fault, not the client's\n}\n\nfunction describe(error: unknown): string {\n  return isAxiosError(error) ? `${error.code ?? ''} ${error.response?.status ?? ''}`.trim() : String(error);\n}",
      "label": "src/shipping/ — a careful API client"
    },
    {
      "kind": "text",
      "text": "Three decisions in it are worth copying:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**A timeout on every request.** Without one, axios waits forever. A hung partner then holds your connections until your own API falls over too.",
        "**Retry only what might succeed.** Network errors, timeouts, `429`, `502`, `503` and `504` may pass on a second try. A `400` never will. Wait longer each time, 500 ms and then 1 s. This is called **exponential backoff**, and it stops you hammering a service that is already struggling.",
        "**Map their errors to yours.** Their outage is not your client's mistake. Answer `502 Bad Gateway` or `504 Gateway Timeout`, never their raw error, and log the details for yourself."
      ]
    },
    {
      "kind": "text",
      "text": "Work out the worst case: three attempts of 3 s each, plus 1.5 s of waiting, is about 10.5 s. Keep that below the timeout of whoever calls you. For a non-critical call like a shipping quote, a fallback, such as a flat rate, is often better than an error.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "title": "Trap · retrying a POST",
      "blocks": [
        {
          "kind": "text",
          "text": "A `GET` is safe to repeat. A `POST` that charges a card is not. If the first attempt reached the provider and only the response got lost, a retry charges the customer twice. Retry a `POST` only when the API supports an **idempotency key**: a unique value you send with the request, so the provider can spot a repeat and return the first result. Payment APIs usually do. That is why `PaymentsClient` in Module 20 sends `Idempotency-Key: charge-<orderId>`."
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
          "text": "`HttpService` will feel familiar. Like Angular's `HttpClient`, it returns a cold Observable: nothing is sent until something subscribes. That is why `retry()` works. Each retry subscribes again, which sends a new request. The operators are the ones you already use in Angular interceptors: `retry`, `timeout`, `catchError` and `map`."
        },
        {
          "kind": "text",
          "text": "One difference: Nest service code is mostly `async`/`await`, so you end the pipe with `firstValueFrom()` and return a Promise."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Receiving webhooks safely"
    },
    {
      "kind": "text",
      "text": "A webhook is a request to your server from another company's server. But anyone on the internet can send a request to that URL, so you need three checks:"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**It's genuine.** The sender signs each request with a secret you share. The signature is an **HMAC**: a hash made from the secret and the exact bytes of the body. You compute the same hash and compare.",
        "**It's fresh.** A timestamp inside the signed data lets you refuse old messages, so a captured request can't be replayed later.",
        "**It's harmless twice.** Providers retry when you are slow or return an error, and sometimes even when you weren't. Your handler must give the same result the second time."
      ]
    },
    {
      "kind": "example",
      "code": "import { createHmac } from 'node:crypto';\nimport { Body, Controller, Headers, Inject, Post, UnauthorizedException } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport { Public } from '../auth/auth.decorators';\nimport { paymentsConfig } from '../config/payments.config';\nimport { NotificationsService } from '../notifications/notifications.service';\nimport { OrdersService } from '../orders/orders.service';\nimport type { PaymentEvent } from './payment-event';\n\n@Controller('webhooks')\nexport class PaymentWebhooksController {\n  constructor(\n    @Inject(paymentsConfig.KEY) private readonly config: ConfigType<typeof paymentsConfig>,\n    private readonly orders: OrdersService,\n    private readonly notifications: NotificationsService,\n  ) {}\n\n  @Public()\n  @Post('payments')\n  async payments(@Body() event: PaymentEvent, @Headers('x-webhook-signature') signature: string) {\n    const expected = createHmac('sha256', this.config.webhookSecret)\n      .update(JSON.stringify(event)) // ❌ not the bytes the provider signed\n      .digest('hex');\n    if (expected !== signature) throw new UnauthorizedException(); // ❌ timing leak, and no replay check\n\n    await this.orders.markPaid(event.data.orderId); // ❌ ignores whether anything changed…\n    await this.notifications.orderPaid(event.data.orderId, event.data.email); // ❌ …so every retry emails again\n    return { received: true };\n  }\n}",
      "label": "payments/payment-webhooks.controller.ts",
      "verdict": "bad"
    },
    {
      "kind": "text",
      "text": "`JSON.stringify(event)` rebuilds the body from the parsed object, but the provider signed the original bytes, with its own spacing and key order. The two almost never match, so real webhooks get `401`, and the usual \"fix\" is to delete the check. On top of that, `!==` can leak through timing how many characters matched. There is no timestamp check. And every retry sends another email."
    },
    {
      "kind": "example",
      "code": "// ── payments/payment-event.ts ──\n// An interface, not a DTO class: the provider sends many fields we don't list, and a\n// ValidationPipe with forbidNonWhitelisted (Module 7) would reject them with a 400.\nexport interface PaymentEvent {\n  id: string; // the provider's event ID\n  type: 'payment.succeeded' | 'payment.failed';\n  data: { orderId: string; email: string }; // email: the customer, as the provider knows them\n}\n\n// ── payments/payment-signature.guard.ts ──\nimport { createHmac, timingSafeEqual } from 'node:crypto';\nimport { CanActivate, ExecutionContext, Inject, Injectable, RawBodyRequest, UnauthorizedException } from '@nestjs/common';\nimport { type ConfigType } from '@nestjs/config';\nimport type { Request } from 'express';\nimport { paymentsConfig } from '../config/payments.config';\n\nconst MAX_AGE_SECONDS = 5 * 60;\n\n@Injectable()\nexport class PaymentSignatureGuard implements CanActivate {\n  constructor(@Inject(paymentsConfig.KEY) private readonly config: ConfigType<typeof paymentsConfig>) {}\n\n  canActivate(context: ExecutionContext): boolean {\n    const req = context.switchToHttp().getRequest<RawBodyRequest<Request>>();\n    const timestamp = req.header('x-webhook-timestamp') ?? '';\n    const signature = req.header('x-webhook-signature') ?? '';\n\n    // 1. Refuse old messages, so a captured request can't be replayed next week.\n    const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));\n    if (!req.rawBody || !Number.isFinite(ageSeconds) || ageSeconds > MAX_AGE_SECONDS) {\n      throw new UnauthorizedException('Invalid webhook');\n    }\n\n    // 2. Sign exactly the bytes that arrived, the same way the provider did.\n    const expected = createHmac('sha256', this.config.webhookSecret)\n      .update(`${timestamp}.`)\n      .update(req.rawBody)\n      .digest('hex');\n\n    // 3. Compare in constant time. timingSafeEqual throws if the lengths differ, so check those first.\n    const a = Buffer.from(expected);\n    const b = Buffer.from(signature);\n    if (a.length !== b.length || !timingSafeEqual(a, b)) {\n      throw new UnauthorizedException('Invalid webhook signature');\n    }\n    return true;\n  }\n}\n\n// ── payments/payment-webhooks.controller.ts ──\nimport { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';\nimport { Public } from '../auth/auth.decorators';\nimport { NotificationsService } from '../notifications/notifications.service';\nimport { OrdersService } from '../orders/orders.service';\nimport type { PaymentEvent } from './payment-event';\nimport { PaymentSignatureGuard } from './payment-signature.guard';\n\n// main.ts must keep the raw bytes next to the parsed body:\n//   const app = await NestFactory.create(AppModule, { rawBody: true });\n\n@Controller('webhooks')\nexport class PaymentWebhooksController {\n  constructor(\n    private readonly orders: OrdersService,\n    private readonly notifications: NotificationsService,\n  ) {}\n\n  @Public() // skip the global JWT guard: the provider has no token, the signature is its proof\n  @Post('payments')\n  @HttpCode(200)\n  @UseGuards(PaymentSignatureGuard) // guards run before pipes and the handler (Module 9)\n  async payments(@Body() event: PaymentEvent): Promise<{ received: true }> {\n    if (event.type === 'payment.succeeded') {\n      const order = await this.orders.markPaid(event.data.orderId);\n      if (order) await this.notifications.orderPaid(order.id, order.user.email); // once, even if delivered twice\n    }\n    return { received: true }; // answer fast; slow work belongs in a queue (Module 23)\n  }\n}\n\n// ── orders/orders.service.ts (excerpt) ──\nimport { Injectable } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { Repository } from 'typeorm';\nimport { Order, OrderStatus } from './entities/order.entity';\n\n@Injectable()\nexport class OrdersService {\n  constructor(@InjectRepository(Order) private readonly ordersRepo: Repository<Order>) {}\n\n  /** Safe to call twice: only a placed (unpaid) order can become paid. Returns it only if it changed. */\n  async markPaid(orderId: string): Promise<Order | null> {\n    const result = await this.ordersRepo.update(\n      { id: orderId, status: OrderStatus.Placed }, // UPDATE … WHERE id = $1 AND status = 'placed'\n      { status: OrderStatus.Paid },\n    );\n    if (result.affected !== 1) return null; // already paid, or not an order we know\n    return this.ordersRepo.findOne({ where: { id: orderId }, relations: { user: true } }); // for the email\n  }\n}",
      "label": "raw bytes, a guard, and an idempotent update",
      "verdict": "good"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "`rawBody: true` in `main.ts` keeps the exact bytes in `req.rawBody`. Nest still parses the JSON into `@Body()` as usual.",
        "The check is a **guard**, so it runs before pipes and the handler. A forged request never reaches your code.",
        "`markPaid()` changes only a placed (unpaid) order, and returns it, with its user, only when it changed something. So the email goes out once, to the address in your own database, however many times the event arrives. `orderPaid()` only queues it (Module 23). When an effect isn't naturally safe to repeat, store the provider's event ID in a table with a unique key, and skip IDs you have already seen.",
        "`@Public()`, from `auth/auth.decorators.ts`, lets the request past the global `JwtAuthGuard`. The provider has no token; the signature is its proof."
      ]
    },
    {
      "kind": "text",
      "text": "Using Stripe or a similar provider? Its SDK checks signatures for you, for example `stripe.webhooks.constructEvent(rawBody, signature, secret)`. You still need `rawBody: true`, and you still need idempotency.",
      "style": "small"
    },
    {
      "kind": "quiz",
      "question": "A payment provider retries a webhook because your server answered slowly. Your handler marks the order paid and emails the customer. What makes the second delivery harmless?",
      "options": [
        "Checking the signature again",
        "Answering `200` faster next time",
        "Updating only a placed (unpaid) order, and sending the email only if that update changed something",
        "Keeping `rawBody: true` in `main.ts`"
      ],
      "answer": 2,
      "why": "**A conditional update.** The retry has a valid signature, because it is the same genuine message, so checking it again changes nothing. Answering faster makes retries rarer, but providers still retry after timeouts and network errors. What makes the handler safe is that the second run does nothing: `UPDATE … WHERE status = 'placed'` affects zero rows, so no second email goes out. That property is called **idempotency**, and every webhook handler needs it."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 21.1",
      "title": "Attack your own webhook",
      "blocks": [
        {
          "kind": "text",
          "text": "Add the guard and controller above to your shop. Then write a small script that plays the payment provider. It signs a `payment.succeeded` event with your webhook secret and sends it four times: correctly, then the same request again, then with the body changed after signing, then with a timestamp from an hour ago. Predict each status code, and the number of emails, before you run it."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// Run against your dev server: npx ts-node scripts/send-test-webhook.ts <orderId>\nimport { createHmac } from 'node:crypto';\n\nconst secret = process.env.PAYMENTS_WEBHOOK_SECRET ?? '';\nconst url = 'http://localhost:3000/api/webhooks/payments';\nconst body = JSON.stringify({ id: 'evt_1', type: 'payment.succeeded', data: { orderId: process.argv[2] } });\n\nfunction sign(timestamp: string, payload: string): string {\n  return createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');\n}\n\nasync function send(label: string, payload: string, signature: string, timestamp: string): Promise<void> {\n  const res = await fetch(url, {\n    method: 'POST',\n    headers: { 'content-type': 'application/json', 'x-webhook-timestamp': timestamp, 'x-webhook-signature': signature },\n    body: payload,\n  });\n  console.log(label.padEnd(18), res.status, await res.text());\n}\n\nasync function main(): Promise<void> {\n  const now = Math.floor(Date.now() / 1000).toString();\n  const old = (Math.floor(Date.now() / 1000) - 3600).toString();\n\n  await send('first delivery', body, sign(now, body), now);\n  await send('same again', body, sign(now, body), now); // a provider retry\n  await send('tampered body', body.replace('succeeded', 'failed'), sign(now, body), now);\n  await send('an hour old', body, sign(old, body), old); // a replayed capture\n}\nvoid main();",
              "label": "scripts/send-test-webhook.ts"
            },
            {
              "kind": "table",
              "head": [
                "Request",
                "Status",
                "Emails sent"
              ],
              "rows": [
                [
                  "first delivery",
                  "`200 {\"received\":true}`",
                  "1"
                ],
                [
                  "same again",
                  "`200 {\"received\":true}`",
                  "still 1"
                ],
                [
                  "tampered body",
                  "`401 Invalid webhook signature`",
                  "still 1"
                ],
                [
                  "an hour old",
                  "`401 Invalid webhook`",
                  "still 1"
                ]
              ]
            },
            {
              "kind": "text",
              "text": "The repeat gets `200` on purpose: any other status would make the provider retry yet again. The tampered body fails the signature. The old one fails the age check before the signature is even computed. Keep the script; it is the start of an end-to-end test (Module 25).",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q37",
      "title": "How do you handle file uploads safely in a NestJS API?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I use `FileInterceptor` with multer's `limits.fileSize`. That limit is the real defence against memory exhaustion: multer stops reading and Nest returns `413`. Then `ParseFilePipe` with a `FileTypeValidator`. Since Nest 11.1 it checks the file's magic number instead of trusting the client's MIME type, and on 11.2+ I set `overrideMimeType` so the stored type is the detected one. I never use the original filename as a path. I generate a key like `products/<id>/<uuid>.png` to rule out path traversal, and keep the original name only as metadata."
        },
        {
          "kind": "text",
          "text": "Storage sits behind an abstract `FileStorage` class, with a local-disk implementation for development and an S3-compatible one for production, picked by a factory provider from config. That keeps instances stateless and makes tests trivial. For large files I skip the server and hand out presigned URLs, so clients upload straight to object storage. And I serve user files from a separate domain, or with a safe `Content-Type` and `Content-Disposition`, so they can't run as HTML on the main site."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q38",
      "title": "How do you receive webhooks safely?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I check four things. Authenticity: the provider signs each request with an HMAC of the raw body and a shared secret. So I enable `rawBody: true`, recompute the HMAC over `req.rawBody`, never over re-serialised JSON, and compare with `timingSafeEqual`. I do it in a guard, so forged requests never reach the handler. Freshness: a signed timestamp, with a tolerance of a few minutes, blocks replays."
        },
        {
          "kind": "text",
          "text": "Idempotency: providers deliver at least once, so the handler must be safe to run twice. I use a conditional update, like \"only a placed order becomes paid\", or a table of processed event IDs with a unique constraint. Speed: return `2xx` quickly and push slow work to a queue, because timeouts cause more retries. I also answer `2xx` to duplicates, since any error makes the provider retry, and I alert on repeated signature failures, which mean a wrong secret or an attack."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, Module 22 adds Redis caching, so you can stop asking the database, and the shipping API, the same question over and over."
    }
  ]
};
