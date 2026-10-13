import { Lesson } from '../../shared/content';

export const HOW_TO_USE: Lesson = {
  "slug": "how-to-use",
  "title": "How to use this course",
  "eyebrow": "A 16-week course · TypeScript & Angular assumed",
  "blocks": [
    {
      "kind": "text",
      "text": "Thirty modules in seven levels, from `nest new` to a tested, dockerised, deployed backend — taught one module at a time, each with a production-shaped example, the internals underneath it, traps, exercises and the interview question you'll actually be asked.",
      "style": "lede"
    },
    {
      "kind": "table",
      "head": [
        "Pace",
        "Length",
        "Modules",
        "Ends with"
      ],
      "rows": [
        [
          "1.5–2 hours a day",
          "16 weeks",
          "30 across 7 levels",
          "16 projects"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "This is a course, not a reference. Work down it in order. Every module has the same shape, so you always know where you are:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**The idea** — plain language, and *why the thing exists* before any syntax.",
        "**Three code passes** — the naive version, the idiomatic Nest version, then the production version. The difference between passes two and three is most of what seniority is.",
        "**Under the hood** — what Nest does at bootstrap and per request. Memorised answers collapse in interviews; models don't.",
        "**Traps** — the specific mistakes that get juniors a bad PR review, and the fix.",
        "**Exercises** — attempt before opening the solution. Opening it early feels productive and teaches nothing.",
        "**Interview** — the real question on this topic, with a model answer worth speaking out loud."
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "This is backend code, so nothing here runs in your browser — copy each block into a real project and run it. Reading creates recognition; typing creates recall, and a running server creates understanding. Every code block has a **Copy** button for exactly this."
        }
      ],
      "title": "The one rule"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Your setup, in ten minutes"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Node.js 20 LTS or newer** — check with `node -v`. NestJS 11 needs Node 20 at minimum; use 22 or 24.",
        "**The Nest CLI, version 11**, installed globally. It scaffolds modules, controllers and services with correct wiring, which is worth a lot in week one.",
        "**VS Code** with the ESLint extension. A `nest new` project ships with ESLint and Prettier already configured.",
        "**Docker Desktop** — not needed until Week 8, but install it now so Postgres day isn't also Docker day.",
        "**An HTTP client**: the VS Code REST Client extension, Postman, Insomnia, or just `curl`. You'll be hitting your own API constantly."
      ]
    },
    {
      "kind": "example",
      "code": "node -v                      # v20.x or newer\nnpm i -g @nestjs/cli@11      # the generator you'll use all course\nnest --version               # 11.x\n\nnest new hello-nest          # pick npm when it asks\ncd hello-nest\nnpm run start:dev            # watch mode, restarts on save\n# → open http://localhost:3000  ·  you should see \"Hello World!\"",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "If `Hello World!` appears in the browser, your whole toolchain works. That's all the setup Modules 1 through 7 need.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "key",
      "title": "Why version 11?",
      "blocks": [
        {
          "kind": "text",
          "text": "This course teaches NestJS 11. NestJS 12 came out in August 2026, and installing the CLI without a version now gives you version 12. A version 12 project looks different from the first day: it uses ES modules, Vitest instead of Jest, and oxlint instead of ESLint. The `@11` keeps your project the same as every lesson. Nest 11 still gets updates, and version notes in the later modules show what changes in 12."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "You have a real head start: Nest borrowed Angular's architecture wholesale — `@Module`, `@Injectable`, constructor DI, guards, interceptors, pipes, RxJS. Roughly 60% of what you already know transfers. The remaining 40% is where you'll get burned, so this course flags every one of those with a purple box like this. First one: in Angular a service is usually `providedIn: 'root'` and globally available. In Nest, **every provider is private to its module** until you explicitly export it."
        }
      ],
      "title": "Because you come from Angular"
    }
  ]
};
