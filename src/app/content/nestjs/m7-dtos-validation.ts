import { Lesson } from '../../shared/content';

export const M7_DTOS_VALIDATION: Lesson = {
  "slug": "m7-dtos-validation",
  "title": "M7 DTOs and validation",
  "nav": "DTOs & validation",
  "num": "M7",
  "eyebrow": "Level 3 · Weeks 3–4 · ~4 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 3 · Weeks 3–5 · Contracts and the pipeline",
      "blocks": [
        {
          "kind": "text",
          "text": "Inputs you can trust, errors with one shape, and the five things that can wrap a handler. After this level you can build an API someone else's client can rely on."
        }
      ]
    },
    {
      "kind": "text",
      "text": "A **DTO** — Data Transfer Object — is a class that describes the shape of data crossing your API boundary. It is not your database entity and not your domain model: it's the contract you publish to clients, and the only thing you let past the front door."
    },
    {
      "kind": "text",
      "text": "Why a *class* and not an interface? Because validation and transformation happen at runtime, and interfaces are erased at compile time — the same reason from Module 3, showing up again. A class survives, carries decorator metadata, and gives `class-validator` something to inspect."
    },
    {
      "kind": "example",
      "code": "npm i class-validator class-transformer",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "example",
      "code": "@Post()\ncreate(@Body() body: any) {          // `any` — the compiler is now useless\n  // Is body.email a string? Is body.price a number or the string \"12.99\"?\n  // Did the client also send { isAdmin: true }? You cannot know.\n  return this.products.create(body);\n}",
      "label": "without a DTO",
      "verdict": "bad"
    },
    {
      "kind": "example",
      "code": "import {\n  IsString, IsNotEmpty, MaxLength, IsNumber, Min,\n  IsOptional, IsEnum, IsArray, ValidateNested, IsUUID,\n} from 'class-validator';\nimport { Type } from 'class-transformer';\n\nexport enum ProductStatus { Draft = 'draft', Live = 'live' }\n\nexport class ProductDimensionsDto {\n  @IsNumber() @Min(0) width: number;\n  @IsNumber() @Min(0) height: number;\n}\n\nexport class CreateProductDto {\n  @IsString()\n  @IsNotEmpty({ message: 'name is required' })\n  @MaxLength(120)\n  name: string;\n\n  @IsNumber({ maxDecimalPlaces: 2 })\n  @Min(0)\n  price: number;\n\n  @IsEnum(ProductStatus)\n  @IsOptional()\n  status?: ProductStatus = ProductStatus.Draft;\n\n  @IsUUID('4')\n  categoryId: string;\n\n  @IsArray()\n  @ValidateNested({ each: true })      // validate the children too…\n  @Type(() => ProductDimensionsDto)    // …and tell class-transformer their class\n  @IsOptional()\n  dimensions?: ProductDimensionsDto[];\n}",
      "label": "dto/create-product.dto.ts",
      "verdict": "good"
    },
    {
      "kind": "text",
      "text": "Now turn it on globally, once, in `main.ts` — never per route:"
    },
    {
      "kind": "example",
      "code": "app.useGlobalPipes(new ValidationPipe({\n  whitelist: true,              // silently strip unknown properties\n  forbidNonWhitelisted: true,   // …or 400 if any are present\n  transform: true,              // return real DTO instances, not plain objects\n  transformOptions: { enableImplicitConversion: false },\n}));",
      "label": "main.ts (excerpt)",
      "verdict": "good"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "It's a pipe, so it runs after guards and before your handler, once per decorated argument:"
        },
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "Reads the argument's declared type from metadata. If it's a primitive or has no validation decorators, it passes the value straight through — which is why adding `@IsString()` to a DTO is what \"switches it on\".",
            "Calls `plainToInstance()` from class-transformer to turn the raw JSON body into an instance of your DTO class, applying `@Type()` and `@Transform()` along the way.",
            "Calls `validate()` from class-validator, which reads the decorator metadata on that class and collects every failure.",
            "If `whitelist` is on, strips any property with no validation decorator; with `forbidNonWhitelisted` it throws instead.",
            "On failure, throws `BadRequestException` with the collected messages → `400`, and your handler is never called."
          ]
        }
      ],
      "title": "Under the hood · what `ValidationPipe` does per request"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Without `whitelist: true`, extra properties survive into your service. Hand that object to `repo.save(dto)` or `Object.assign(entity, dto)` and a client can set fields you never exposed — `role`, `isVerified`, `balance`. That's mass assignment, and it is a real, common vulnerability. Turn whitelisting on in the first commit, and never spread an unvalidated object into an entity."
        }
      ],
      "title": "Trap · `whitelist: false` is a security hole"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`?page=2` arrives as `\"2\"`, not `2`, so `@IsNumber()` fails on a perfectly good request. Two fixes: `@Type(() => Number)` on the field (explicit, recommended), or `enableImplicitConversion: true` globally (convenient, and it will surprise you — `\"false\"` becomes `true`-ish, empty strings become `0`). Prefer the explicit one."
        }
      ],
      "title": "Trap · query and param values are strings"
    },
    {
      "kind": "example",
      "code": "export class ListProductsDto {\n  @Type(() => Number)              // \"2\" → 2\n  @IsInt() @Min(1) @IsOptional()\n  page = 1;\n\n  @Type(() => Number)\n  @IsInt() @Min(1) @Max(100) @IsOptional()\n  limit = 20;\n\n  @IsString() @IsOptional()\n  search?: string;\n\n  @IsEnum(['name', 'price', 'createdAt']) @IsOptional()\n  sortBy: 'name' | 'price' | 'createdAt' = 'createdAt';\n\n  @IsEnum(['asc', 'desc']) @IsOptional()\n  order: 'asc' | 'desc' = 'desc';\n}",
      "label": "dto/list-products.dto.ts — a query DTO that works"
    },
    {
      "kind": "text",
      "text": "Note `@Max(100)` on `limit`. Without it, `?limit=1000000` is a denial-of-service endpoint you shipped on purpose. Every paginated list needs a hard ceiling.",
      "style": "small"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Update DTOs and mapped types"
    },
    {
      "kind": "example",
      "code": "import { PartialType, OmitType, PickType } from '@nestjs/swagger';\n// (@nestjs/mapped-types if you're not using Swagger)\n\n// Every field of CreateProductDto, all optional, decorators preserved.\nexport class UpdateProductDto extends PartialType(CreateProductDto) {}\n\n// Also available:\nexport class PublicProductDto extends OmitType(CreateProductDto, ['categoryId'] as const) {}\nexport class RenameProductDto extends PickType(CreateProductDto, ['name'] as const) {}",
      "label": "dto/update-product.dto.ts"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A custom validator"
    },
    {
      "kind": "text",
      "text": "When a rule isn't in the library, write a constraint. This one is a decorator you can reuse across DTOs — and because it's a class, it can inject providers, which is how you write an `@IsUniqueEmail()` that queries the database."
    },
    {
      "kind": "example",
      "code": "import {\n  registerDecorator, ValidationOptions,\n  ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments,\n} from 'class-validator';\n\n@ValidatorConstraint({ name: 'isAfter', async: false })\nexport class IsAfterConstraint implements ValidatorConstraintInterface {\n  validate(value: string, args: ValidationArguments) {\n    const [otherField] = args.constraints as [string];\n    const other = (args.object as Record<string, string>)[otherField];\n    return !!value && !!other && new Date(value) > new Date(other);\n  }\n  defaultMessage(args: ValidationArguments) {\n    return `${args.property} must be after ${args.constraints[0]}`;\n  }\n}\n\nexport function IsAfter(otherField: string, options?: ValidationOptions) {\n  return function (object: object, propertyName: string) {\n    registerDecorator({\n      target: object.constructor,\n      propertyName,\n      constraints: [otherField],\n      options,\n      validator: IsAfterConstraint,\n    });\n  };\n}\n\n// Usage:\nexport class CreateCampaignDto {\n  @IsDateString() startsAt: string;\n  @IsDateString() @IsAfter('startsAt') endsAt: string;\n}",
      "label": "validators/is-after.validator.ts"
    },
    {
      "kind": "quiz",
      "question": "Your DTO declares only `name` and `price`. A client POSTs `{ name, price, role: \"admin\" }`. With `whitelist: true` and `forbidNonWhitelisted: false`, what reaches your service?",
      "options": [
        "All three properties — validation only checks, it doesn't remove",
        "`{ name, price }` — `role` is stripped silently",
        "Nothing; the request is rejected with 400",
        "All three, but `role` is set to `undefined`"
      ],
      "answer": 1,
      "why": "**`{ name, price }`.** `whitelist` strips properties that have no validation decorator; `forbidNonWhitelisted` is what turns stripping into a `400`. Both behaviours are safe — silent stripping is friendlier to clients, rejecting is stricter and better for internal APIs where an unexpected field means a bug. What is *not* safe is leaving both off."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 7.1",
      "title": "Notes API, properly validated",
      "blocks": [
        {
          "kind": "text",
          "text": "Build a `NotesModule` with full CRUD over an in-memory array, and make the validation airtight:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "`CreateNoteDto`: `title` (string, 1–120 chars), `body` (string, max 10 000), `tags` (optional array of strings, max 5 items), `pinned` (optional boolean, default false).",
            "`UpdateNoteDto` via `PartialType`.",
            "A `ListNotesDto` with `page`, `limit` (max 50) and `tag`, correctly coercing query strings to numbers.",
            "Global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted` both on."
          ]
        },
        {
          "kind": "text",
          "text": "Then prove each of these with a request: a missing `title`, a `title` of 200 characters, six tags, an unexpected `ownerId` field, and `?limit=500`. Write down the status and body you get for each."
        },
        {
          "kind": "reveal",
          "tag": "What you should see",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "All five return `400`, with `message` as an array of human-readable strings — one per failed constraint, and multiple failures reported together rather than one at a time. That last detail matters for API design: a client filling a form wants every error at once.",
              "style": "small"
            },
            {
              "kind": "text",
              "text": "Two things to notice. Defaults on a DTO field (`pinned = false`) only apply when `transform: true`, because they come from actually constructing the class. And `?limit=500` failing is your rate-of-abuse ceiling doing its job — an unbounded `limit` is the most common accidental DoS in CRUD APIs.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q11",
      "title": "What is a DTO, and why is it a class rather than an interface?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A DTO defines the shape of data crossing an API boundary — the published contract for a request body, query string or params. It's deliberately separate from the persistence entity, so that a database column rename isn't a breaking API change and an internal field isn't accidentally accepted or exposed."
        },
        {
          "kind": "text",
          "text": "It has to be a class because validation and transformation are runtime concerns. Interfaces are erased during compilation, so there'd be nothing for `class-validator` to read; a class survives, carries its decorator metadata, and lets `class-transformer` instantiate it — which is also what makes default values and `@Type()` conversions work."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q12",
      "title": "How does `ValidationPipe` work, and which options would you always set?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It's a pipe bound globally in `main.ts`, so it runs for every decorated handler argument, after guards and before the handler. For each argument it reads the declared type, uses class-transformer to instantiate the DTO from the raw payload, then class-validator to evaluate the decorator metadata on it. On failure it throws `BadRequestException` with all collected messages, so the handler never runs."
        },
        {
          "kind": "text",
          "text": "The options I always set: `whitelist: true`, to strip properties that aren't on the DTO — without it you're exposed to mass assignment, where a client sends `role` or `isVerified` and it flows into an entity; `forbidNonWhitelisted: true` on internal APIs, so an unexpected field is a loud `400` rather than a silent strip; and `transform: true`, so handlers receive real typed instances and DTO defaults apply. I avoid `enableImplicitConversion` and use explicit `@Type(() => Number)` instead, because implicit coercion has surprising edge cases with booleans and empty strings."
        },
        {
          "kind": "text",
          "text": "**Likely follow-up:** \"How do you validate against the database, e.g. unique email?\" A custom `ValidatorConstraint` class can be injected with providers, so it can query a repository — but for uniqueness I'd still rely on a database unique index as the real guarantee and treat the validator as a nicer error message, since the check-then-insert gap is a race condition."
        }
      ]
    }
  ]
};
