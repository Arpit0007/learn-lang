import { Lesson } from '../../shared/content';

export const M16_MODULES: Lesson = {
  "slug": "m16-modules",
  "title": "M16 Modules and modern tooling",
  "nav": "Modules",
  "num": "M16",
  "eyebrow": "Level 5 · Week 11 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "One file is fine until it's 800 lines. **ES modules** split code into files that explicitly declare what they share (`export`) and what they need (`import`). Each module has its own scope — nothing leaks to the global namespace — and each is evaluated exactly once no matter how many files import it."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A module is one file that says out loud what it is willing to share (`export`) and what it needs from elsewhere (`import`). Everything else inside the file stays private — nobody outside can even see it."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "// Named exports: as many as you like\nexport const PI = 3.14159;\n\nexport function add(a, b) { return a + b; }\n\nexport class Vector {\n  constructor(x, y) { this.x = x; this.y = y; }\n}\n\n// A default export: at most ONE per file\nexport default function multiply(a, b) { return a * b; }\n\n// You can also export at the bottom, which keeps the API visible in one place:\n// function subtract(a, b) { return a - b; }\n// export { subtract };",
      "label": "math.js — a module that exports",
      "run": "none"
    },
    {
      "kind": "example",
      "code": "// Default import: the name is yours to choose\nimport multiply from \"./math.js\";\n\n// Named imports: the names must match, but can be renamed with `as`\nimport { add, PI, Vector as Vec } from \"./math.js\";\n\n// Everything at once\nimport * as math from \"./math.js\";\n\nconsole.log(add(2, 3), multiply(2, 3), PI);\nconsole.log(new Vec(1, 2), math.PI);\n\n// Dynamic import — loads on demand, returns a promise.\n// This is how you code-split a heavy feature out of the initial download.\ndocument.querySelector(\"#chart-btn\").addEventListener(\"click\", async () => {\n  const { renderChart } = await import(\"./heavy-charting.js\");\n  renderChart();\n});\n\n// In HTML you must declare the type:\n//   <script type=\"module\" src=\"app.js\"></script>\n// Modules are deferred by default and always run in strict mode.",
      "label": "app.js — a module that imports",
      "run": "none"
    },
    {
      "kind": "table",
      "head": [
        "Aspect",
        "ES Modules (`import`)",
        "CommonJS (`require`)"
      ],
      "rows": [
        [
          "Where",
          "Browsers and modern Node",
          "Node's original system"
        ],
        [
          "Loading",
          "Static, analysed before execution",
          "Dynamic, resolved at runtime"
        ],
        [
          "Bindings",
          "Live — an exported `let` updates for importers",
          "A copy of the value at require time"
        ],
        [
          "Async",
          "Supports top-level `await`",
          "Synchronous only"
        ],
        [
          "Tree-shaking",
          "Yes — unused exports can be dropped",
          "Not reliably"
        ]
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The tooling you actually need"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**npm** — installs packages. `npm init -y`, then `npm install <package>`. `package.json` records dependencies; `package-lock.json` pins exact versions and belongs in git.",
        "**Vite** — `npm create vite@latest`. A dev server with instant reload and a production bundler. Use it for anything beyond a single file.",
        "**ESLint** — catches the mistakes this course keeps warning you about, as you type.",
        "**Prettier** — formats code so nobody argues about it in review.",
        "**Git** — not optional. Commit small, commit often; your project history is part of your portfolio."
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q17",
      "title": "ES modules vs CommonJS, and what is tree-shaking?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** ES modules use `import`/`export` with a *static* structure: the dependency graph is known before any code runs, so bundlers can analyse it. CommonJS uses `require`/`module.exports`, resolved at runtime, so `require` can appear anywhere and take a computed path."
        },
        {
          "kind": "text",
          "text": "ESM exports are live read-only bindings; CommonJS gives you a snapshot of the value. ESM is always strict mode, is deferred in browsers, and supports top-level `await`. *Tree-shaking* is dead-code elimination made possible by that static structure: a bundler can prove an export is never imported and drop it from the output — which is why importing a single named function from a large library can cost almost nothing, provided the library ships ESM and has no import side effects."
        }
      ]
    }
  ]
};
