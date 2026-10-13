import { Lesson } from '../../shared/content';

export const M12_PIPES: Lesson = {
  "slug": "m12-pipes",
  "title": "M12 Pipes in depth",
  "nav": "Pipes in depth",
  "num": "M12",
  "eyebrow": "Level 4 · Week 7 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A **pipe** works on one argument of your handler: a route param, a query value, or the body. It runs just before the handler and does one of two jobs. It **transforms** the value, so the string `\"42\"` becomes the number `42`. Or it **validates** the value, and throws a 400 when it is wrong."
    },
    {
      "kind": "text",
      "text": "You already use the biggest pipe there is: the global `ValidationPipe` from M3 and M7. This module covers the rest of the family: the built-in pipes, your own pipes, nested objects and arrays, and global pipes that need dependency injection."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A pipe is a checkpoint for one input. It can fix the value, like turning the text \"42\" into the number 42. If the value is wrong, the pipe stops the request with a 400, and your handler never runs."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The built-in pipes"
    },
    {
      "kind": "table",
      "head": [
        "Pipe",
        "Turns",
        "Into",
        "Fails when"
      ],
      "rows": [
        [
          "`ParseIntPipe`",
          "`\"42\"`",
          "`42`",
          "It's not a whole number, or it's missing"
        ],
        [
          "`ParseFloatPipe`",
          "`\"19.5\"`",
          "`19.5`",
          "It's not a number"
        ],
        [
          "`ParseBoolPipe`",
          "`\"true\"` or `\"false\"`",
          "`true` or `false`",
          "It's anything else"
        ],
        [
          "`ParseUUIDPipe`",
          "A UUID string",
          "The same string, checked",
          "It's not a UUID (add `version: '4'` to require v4)"
        ],
        [
          "`ParseEnumPipe`",
          "`\"live\"`",
          "The same value, checked against your enum",
          "It's not one of the enum's values"
        ],
        [
          "`ParseArrayPipe`",
          "`\"1,2,3\"` or a JSON array",
          "An array; with `items: Number`, an array of numbers",
          "It's not an array, or an item fails"
        ],
        [
          "`ParseDatePipe`",
          "`\"2026-10-06\"`",
          "A `Date`",
          "It's not a date (new in Nest 11)"
        ],
        [
          "`DefaultValuePipe`",
          "`undefined`",
          "Your default value",
          "Never"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "The `Parse...` pipes share a few options. `optional: true` lets a missing value through, `errorHttpStatusCode` replaces the 400, and `exceptionFactory` builds your own error. Pass a pipe as a **class** (`ParseIntPipe`) and Nest creates it. Pass an **instance** (`new ParseUUIDPipe({ version: '4' })`) when you need options:"
    },
    {
      "kind": "example",
      "code": "import {\n  Controller,\n  DefaultValuePipe,\n  Get,\n  Param,\n  ParseEnumPipe,\n  ParseIntPipe,\n  ParseUUIDPipe,\n  Query,\n} from '@nestjs/common';\nimport { Public } from '../auth/auth.decorators';\nimport { ProductStatus } from './dto/create-product.dto';\nimport { ProductsService } from './products.service';\n\n@Controller('products')\nexport class ProductsController {\n  constructor(private readonly products: ProductsService) {}\n\n  // GET /products/category/3f0c6d1e-…?page=2&status=live\n  @Public()\n  @Get('category/:categoryId')\n  findByCategory(\n    @Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string,\n    // DefaultValuePipe goes FIRST: pipes run from left to right.\n    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,\n    @Query('status', new ParseEnumPipe(ProductStatus, { optional: true }))\n    status?: ProductStatus,\n  ) {\n    return this.products.findByCategory(categoryId, { page, status });\n  }\n\n  // GET /products/42 → id is the number 42   ·   GET /products/abc → 400\n  @Public()\n  @Get(':id')\n  findOne(@Param('id', ParseIntPipe) id: number) {\n    return this.products.findOne(id);\n  }\n}",
      "label": "products/products.controller.ts"
    },
    {
      "kind": "text",
      "text": "The pipes in one decorator run **from left to right**, and each one gets the previous one's output. That is why `DefaultValuePipe` comes first. The other way round, `ParseIntPipe` sees `undefined` and throws a 400 before the default is ever used."
    },
    {
      "kind": "text",
      "text": "When to use which? For one or two simple values, use built-in pipes right in `@Param()` and `@Query()`. For a group of query values with rules, like `page`, `limit` and `search` together, use a query DTO and `ValidationPipe`, as in M7."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "The global `ValidationPipe` runs **before** the pipes in your decorator, on every argument. With `transform: true`, it also converts simple values to their declared type, but it doesn't check them. So `@Param('id') id: number`, with no `ParseIntPipe`, turns `/products/abc` into `id = NaN`. There is no error, just a strange 404 or a database error later. Always add `ParseIntPipe` to numeric params. The same conversion explains a quiet surprise: `?page=abc` reaches `DefaultValuePipe` as `NaN`, which it treats as missing, so the client silently gets page 1."
        }
      ],
      "title": "Trap · `transform: true` turns bad numbers into `NaN`"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Write your own pipe"
    },
    {
      "kind": "text",
      "text": "A custom pipe implements `PipeTransform`, which has one method: `transform(value, metadata)`. It returns the new value, or throws. The `metadata` is an `ArgumentMetadata` object with three fields. `type` says where the value came from: `'body'`, `'query'`, `'param'` or `'custom'`. `metatype` is the type you declared, and `data` is the name you passed to the decorator, such as `'sort'`."
    },
    {
      "kind": "text",
      "text": "Sorting makes a good first pipe. `?sort=-price,name` should become a list the service can use, and only fields on an **allow-list** may get through. Without that list, a client could sort by `passwordHash`, or worse, if a field name ever reaches raw SQL."
    },
    {
      "kind": "example",
      "code": "import { BadRequestException, PipeTransform } from '@nestjs/common';\n\nexport interface SortField {\n  field: string;\n  direction: 'ASC' | 'DESC';\n}\n\n/**\n * ?sort=-price,name  →  [{ field: 'price', direction: 'DESC' },\n *                        { field: 'name',  direction: 'ASC'  }]\n * Only fields on the allow-list get through. Anything else is a 400.\n */\nexport class ParseSortPipe implements PipeTransform<unknown, SortField[]> {\n  // You create this pipe with `new`, so it needs no @Injectable().\n  constructor(private readonly allowed: readonly string[]) {}\n\n  transform(value: unknown): SortField[] {\n    if (value === undefined || value === '') return []; // no ?sort → no sorting\n\n    // The client controls the query string. ?sort=a&sort=b arrives as an array.\n    if (typeof value !== 'string') {\n      throw new BadRequestException({\n        code: 'INVALID_SORT',\n        message: 'Send sort once, for example ?sort=-price,name',\n      });\n    }\n\n    return value.split(',').map((part) => {\n      const direction = part.startsWith('-') ? 'DESC' : 'ASC';\n      const field = part.replace(/^[-+]/, '');\n      if (!this.allowed.includes(field)) {\n        throw new BadRequestException({\n          code: 'INVALID_SORT',\n          message: `You can sort by: ${this.allowed.join(', ')}`,\n        });\n      }\n      return { field, direction };\n    });\n  }\n}\n\n// products.controller.ts\n//   @Public()\n//   @Get()\n//   findAll(@Query('sort', new ParseSortPipe(['name', 'price', 'createdAt'])) sort: SortField[]) {\n//     return this.products.findAll(sort);\n//   }",
      "label": "common/pipes/parse-sort.pipe.ts"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**It transforms** a string into a `SortField[]`, so the service never parses query strings.",
        "**It validates** against the allow-list, and fails with a 400 and a `code`. It never crashes: a crash would be a 500, which blames the server for the client's mistake.",
        "**It types the input as `unknown`.** The `string` in your handler's signature is a hope, not a fact: `?sort=a&sort=b` arrives as an array, and `value.split()` would crash. Nest 12 made the same change to its own `Parse...` pipes: they all take `unknown`."
      ]
    },
    {
      "kind": "text",
      "text": "Transform or validate? One pipe can do both, like this one. Keep each pipe to one input, though, and keep business rules, like *is this coupon still valid?*, in the service.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Nested objects and arrays"
    },
    {
      "kind": "text",
      "text": "`ValidationPipe` checks the top-level DTO. To check objects *inside* it, each nested field needs two decorators. `@ValidateNested()` says *run this object's own rules*, and `@Type(() => SomeDto)` from class-transformer says *which class it is*. JSON has no classes, so without `@Type()`, the nested value stays a plain object with no rules attached."
    },
    {
      "kind": "example",
      "code": "// AddressDto and OrderItemDto: the same classes as in the full file below.\nexport class CreateOrderDto {\n  @ValidateNested()\n  shippingAddress: AddressDto; // no @Type → stays a plain object\n\n  @IsArray()\n  @ValidateNested({ each: true })\n  items: OrderItemDto[]; // no @Type → the item rules never run\n}",
      "label": "orders/dto/create-order.dto.ts — without @Type()",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "import { Type } from 'class-transformer';\nimport {\n  ArrayMaxSize,\n  ArrayMinSize,\n  IsArray,\n  IsInt,\n  IsObject,\n  IsString,\n  Length,\n  Max,\n  Min,\n  ValidateNested,\n} from 'class-validator';\n\nexport class AddressDto {\n  @IsString() @Length(1, 100) line1: string;\n  @IsString() @Length(1, 60) city: string;\n  @IsString() @Length(2, 12) postcode: string;\n}\n\nexport class OrderItemDto {\n  @IsInt() @Min(1) productId: number;\n  @IsInt() @Min(1) @Max(99) quantity: number;\n}\n\nexport class CreateOrderDto {\n  @IsObject()                    // required: @ValidateNested() alone skips a missing value\n  @ValidateNested()              // run AddressDto's own rules…\n  @Type(() => AddressDto)        // …after turning the plain object into an AddressDto\n  shippingAddress: AddressDto;\n\n  @IsArray()\n  @ArrayMinSize(1)               // an order with no items is not an order\n  @ArrayMaxSize(50)              // and 10 000 items is an attack\n  @ValidateNested({ each: true })\n  @Type(() => OrderItemDto)\n  items: OrderItemDto[];\n}",
      "label": "orders/dto/create-order.dto.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Errors from nested fields come back with a path, so the client knows exactly which field failed: `items.0.quantity must not be less than 1`. And `whitelist` now works inside the items too. A sneaky `price` in an item is rejected with `items.0.property price should not exist`."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Without `@Type()`, class-validator finds a plain object with no rules, so the nested checks never run. What you see then depends on your `whitelist` settings. With the course's settings, `whitelist` plus `forbidNonWhitelisted`, every nested field is reported as *should not exist*, even in a perfect order. With `whitelist` alone, the nested objects arrive **empty**: `items: [{}]`. With no whitelist, anything gets through, `quantity: -5` included. Note too that `@ValidateNested()` skips a missing value, which is why the good version adds `@IsObject()` to make the address required."
        }
      ],
      "title": "Trap · `@ValidateNested()` without `@Type()`"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A custom constraint that needs the database"
    },
    {
      "kind": "text",
      "text": "In M7 you wrote `@IsAfter()`, a rule that only looked at the DTO itself. Some rules need a service. A **SKU** (stock-keeping unit) is a product's short code, like `DRL-100`, and two products must never share one. A **constraint** class can inject a service to check this, as long as two things are true: Nest creates the class, and class-validator asks Nest for it."
    },
    {
      "kind": "example",
      "code": "import { Injectable } from '@nestjs/common';\nimport {\n  registerDecorator,\n  ValidationOptions,\n  ValidatorConstraint,\n  ValidatorConstraintInterface,\n} from 'class-validator';\nimport { ProductsService } from '../products.service';\n\n@ValidatorConstraint({ name: 'isSkuUnique', async: true })\n@Injectable() // so Nest can create it and inject ProductsService\nexport class IsSkuUniqueConstraint implements ValidatorConstraintInterface {\n  constructor(private readonly products: ProductsService) {}\n\n  async validate(sku: unknown): Promise<boolean> {\n    if (typeof sku !== 'string') return true; // @Matches reports bad values; this rule checks one thing\n    return !(await this.products.existsBySku(sku));\n  }\n\n  defaultMessage(): string {\n    return 'sku \"$value\" is already taken'; // class-validator fills in $value\n  }\n}\n\nexport function IsSkuUnique(options?: ValidationOptions) {\n  return (object: object, propertyName: string) =>\n    registerDecorator({\n      target: object.constructor,\n      propertyName,\n      options,\n      validator: IsSkuUniqueConstraint,\n    });\n}\n\n// Wiring it up:\n//   create-product.dto.ts   @Matches(/^[A-Z0-9-]{4,20}$/) @IsSkuUnique() sku: string;\n//   products.module.ts      providers: [ProductsService, IsSkuUniqueConstraint]\n//   main.ts                 useContainer(...), shown below",
      "label": "products/validators/is-sku-unique.validator.ts"
    },
    {
      "kind": "text",
      "text": "Then, in `main.ts`, connect class-validator to Nest's container, right after the app is created:"
    },
    {
      "kind": "example",
      "code": "import { NestFactory } from '@nestjs/core';\nimport { useContainer } from 'class-validator';\nimport { AppModule } from './app.module';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n\n  // Let class-validator ask Nest for constraint classes, so they get DI.\n  useContainer(app.select(AppModule), { fallbackOnErrors: true });\n\n  // helmet, CORS, prefix, versioning… as in M3.\n  // The useGlobalPipes(...) line is gone: the ValidationPipe now lives in AppModule.\n  await app.listen(process.env.PORT ?? 3000);\n}\nvoid bootstrap();",
      "label": "main.ts (excerpt)"
    },
    {
      "kind": "text",
      "text": "`useContainer()` tells class-validator: *when you need a constraint class, ask Nest's modules for it first*. `fallbackOnErrors: true` adds: *if Nest doesn't know the class, create it yourself*. That keeps constraints with no dependencies, like M7's `IsAfterConstraint`, working without being providers."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Forget `useContainer()`, or forget to list `IsSkuUniqueConstraint` in the module's `providers`, and class-validator creates the class itself with `new`. Nothing is injected, so the first request fails with `TypeError: Cannot read properties of undefined (reading 'existsBySku')`, and the client gets a 500. It bites in one more place: e2e tests build the app from `AppModule` and never run `main.ts`, so call `useContainer()` in your test setup too."
        }
      ],
      "title": "Trap · the constraint's service is `undefined`"
    },
    {
      "kind": "text",
      "text": "This check gives the client a friendly 400. The database's unique index (M14) is still the real guarantee. Two requests can pass the check at the same moment, and only the index stops the second insert.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Global pipes that need DI: `APP_PIPE`"
    },
    {
      "kind": "text",
      "text": "`app.useGlobalPipes(new ValidationPipe(...))` in `main.ts` has the same problem you met with filters and guards: you create the pipe yourself, outside the DI container. Register it as a provider with the `APP_PIPE` token instead, and a factory can inject whatever it needs:"
    },
    {
      "kind": "example",
      "code": "import { Module, ValidationPipe } from '@nestjs/common';\nimport { APP_PIPE } from '@nestjs/core';\nimport { AppConfigService } from './config/app-config.service';\n\n@Module({\n  // imports: [AppConfigModule, …] as before\n  providers: [\n    {\n      provide: APP_PIPE,\n      inject: [AppConfigService], // DI works here. It can't with `new` in main.ts.\n      useFactory: (config: AppConfigService) =>\n        new ValidationPipe({\n          whitelist: true,\n          forbidNonWhitelisted: true,\n          transform: true,\n          // For example, a public API that should not explain its rules to strangers:\n          disableErrorMessages: config.get('HIDE_VALIDATION_ERRORS') === 'true',\n        }),\n    },\n  ],\n})\nexport class AppModule {}",
      "label": "app.module.ts (excerpt)"
    },
    {
      "kind": "text",
      "text": "Now delete the `useGlobalPipes()` line from `main.ts`. As a bonus, your e2e tests validate exactly like production, because they boot `AppModule`."
    },
    {
      "kind": "table",
      "head": [
        "How you bind the pipe",
        "Who creates it",
        "Can it inject services?"
      ],
      "rows": [
        [
          "`@Param('id', ParseIntPipe)`, a class",
          "Nest",
          "Yes"
        ],
        [
          "`@Query('sort', new ParseSortPipe(fields))`, an instance",
          "You",
          "No, so pass what it needs to the constructor"
        ],
        [
          "`app.useGlobalPipes(new SomePipe())`",
          "You, outside DI",
          "No"
        ],
        [
          "`{ provide: APP_PIPE, useClass }` or `useFactory`",
          "Nest",
          "Yes"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "**Nest 12 note:** Nest 12 adds a `StandardSchemaValidationPipe`, which validates with a Zod, Valibot or ArkType schema passed as `@Body({ schema })`, instead of class-validator decorators. Everything in this module runs unchanged on Nest 12.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "At startup, Nest collects the pipes for each argument: global pipes, then `@UsePipes()` on the controller, then `@UsePipes()` on the method, then the pipes inside the parameter decorator.",
            "On each request, after the guards and the interceptors' *before* code, Nest takes each argument's raw value and passes it through that list, left to right. Each pipe gets the previous pipe's output and the same `ArgumentMetadata`.",
            "If any pipe throws, the handler is not called, and the exception goes to your filters.",
            "Pipes run on `@Body()`, `@Query()`, `@Param()` and your own parameter decorators (M13). They don't run on `@Req()`, `@Res()` or `@Headers()`."
          ]
        },
        {
          "kind": "text",
          "text": "Step 4 is also why the global `ValidationPipe` sees your custom decorators but leaves them alone. Their `type` is `'custom'`, and it skips those unless you set `validateCustomDecorators: true`."
        }
      ],
      "title": "Under the hood · how Nest runs pipes"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Same name, opposite job. An Angular pipe formats data for **display**, as in `{{ price | currency }}`. It runs in a template, it never blocks anything, and it should be pure. A Nest pipe guards **input** on the server: it runs before your handler, and it can stop the request with a 400. One habit transfers: in either world, a good pipe is a small, pure function that does one thing."
        }
      ],
      "title": "Because you come from Angular"
    },
    {
      "kind": "quiz",
      "question": "A handler declares `@Query('page', ParseIntPipe, new DefaultValuePipe(1)) page: number`. A client calls `GET /products` with no `page`. What happens?",
      "options": [
        "`page` is `1`",
        "`page` is `undefined`",
        "The client gets a 400 Bad Request",
        "`page` is `NaN`"
      ],
      "answer": 2,
      "why": "**A 400.** The pipes in one decorator run from left to right. `ParseIntPipe` goes first, gets `undefined`, and throws *Validation failed (numeric string is expected)*. `DefaultValuePipe` never gets its turn. Swap them, `new DefaultValuePipe(1), ParseIntPipe`, and a missing `page` becomes `1`. Or use `new ParseIntPipe({ optional: true })` if `undefined` is a fine answer."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 12.1",
      "title": "The array that validated nothing",
      "blocks": [
        {
          "kind": "text",
          "text": "A teammate added a bulk endpoint: `@Post('bulk') createMany(@Body() items: CreateProductDto[])`. Send it `[{ \"name\": 123, \"evil\": true }]`, and look at what reaches the handler. Explain why, then fix it in two different ways."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import { Type } from 'class-transformer';\nimport { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator';\nimport { CreateProductDto } from './create-product.dto';\n\n// Fix 1 (usually best): wrap the array in a DTO.\nexport class BulkCreateProductsDto {\n  @IsArray()\n  @ArrayMinSize(1)\n  @ArrayMaxSize(100)\n  @ValidateNested({ each: true })\n  @Type(() => CreateProductDto)\n  items: CreateProductDto[];\n}\n\n// products.controller.ts\n//   @Post('bulk')\n//   createMany(@Body() dto: BulkCreateProductsDto) {\n//     return this.products.createMany(dto.items);\n//   }\n//   → 400 \"message\": [\"items.3.price must not be less than 0\"]\n//\n// Fix 2: keep the bare array, and tell Nest the item type.\n//   @Post('bulk')\n//   createMany(\n//     @Body(new ParseArrayPipe({\n//       items: CreateProductDto,\n//       whitelist: true,\n//       forbidNonWhitelisted: true,\n//       stopAtFirstError: false, // report every bad item, with its index\n//     }))\n//     items: CreateProductDto[],\n//   ) {}\n//   → 400 \"message\": [\"[3] price must not be less than 0\"]",
              "label": "products/dto/bulk-create-products.dto.ts"
            },
            {
              "kind": "text",
              "text": "**Why:** TypeScript only records that the parameter is an `Array`, not an array *of what*. `ValidationPipe` skips arrays, so nothing is checked, `whitelist` included, and `evil: true` walks straight in."
            },
            {
              "kind": "text",
              "text": "**Fix 1**, a wrapper DTO, is usually the better choice. You can set a size limit, every error has a full path like `items.3.price`, and there is room to add fields later, such as a `dryRun` flag. **Fix 2**, `ParseArrayPipe`, keeps the bare array. But it has no size limit, and by default it stops at the first bad item without saying which one; `stopAtFirstError: false` adds the index."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q19",
      "title": "What are pipes for, and in what order do they run?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A pipe transforms or validates one handler argument, a param, a query value or the body, before the handler runs. The built-ins cover the common cases. `ParseIntPipe` and its friends convert and check simple values, and `DefaultValuePipe` fills in missing ones. `ValidationPipe` turns the body into a DTO instance and runs class-validator on it. If any pipe throws, the handler is never called."
        },
        {
          "kind": "text",
          "text": "Order works at two levels. For one argument, global pipes run first, then controller-level, then method-level, then the pipes in the parameter decorator, left to right. Each one receives the previous one's output, which is why `DefaultValuePipe` must come before `ParseIntPipe`. In the whole pipeline, pipes run last, after middleware, guards and the interceptors' *before* code. One practical edge: with `transform: true`, the global `ValidationPipe` converts `'abc'` to `NaN` before your own pipes see it, so numeric params still need `ParseIntPipe`."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q20",
      "title": "How do you validate nested objects and arrays in a request body?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With `@ValidateNested()` plus `@Type(() => ChildDto)` on each nested field. The first runs the child's rules; the second tells class-transformer which class to build, because JSON carries no types. Without `@Type()`, the nested value stays a plain object: its rules never run, and whitelisting either rejects every field or silently empties the object, depending on the settings. I'd add `@IsObject()` or `@IsArray()` to make the field required, because `@ValidateNested()` skips a missing value, and `@ArrayMinSize()` and `@ArrayMaxSize()` so nobody can send ten thousand items."
        },
        {
          "kind": "text",
          "text": "For a top-level array body, `@Body() items: Dto[]` validates nothing at all, because the element type is lost at runtime. I'd wrap it in a DTO with an `items` field, or use `ParseArrayPipe` with `items: Dto`."
        },
        {
          "kind": "text",
          "text": "**Why they ask:** it is the most common silent validation hole in Nest code. The usual follow-up is *why does `@Type()` matter?*, and the answer is runtime type information: decorators can only read what the compiler left behind.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "text",
      "text": "Next, in M13, you write your own decorators: a `@CurrentUser()` that hands your handler the logged-in user, and an `@Auth()` that bundles several decorators into one. You'll also see how M10's `@Roles()` label really works."
    }
  ]
};
