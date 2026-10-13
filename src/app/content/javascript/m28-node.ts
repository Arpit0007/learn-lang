import { Lesson } from '../../shared/content';

export const M28_NODE: Lesson = {
  "slug": "m28-node",
  "title": "M28 JavaScript outside the browser: Node.js and npm",
  "nav": "Node & npm",
  "num": "M28",
  "eyebrow": "Level 7 · read in Week 14 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Node.js is the same JavaScript language with a different toolbox: no `window`, no DOM, but files, processes, servers and networking. Everything from Levels 1–6 transfers unchanged. Learning it lets you build back ends, CLI tools and build scripts — and it's what makes Project 9 possible."
    },
    {
      "kind": "example",
      "code": "// Install Node (nodejs.org, LTS). Then: node app.js   — or just `node` for a REPL.\n\n// package.json is the project's manifest. Create it with: npm init -y\n// Add \"type\": \"module\" so you can use import/export instead of require.\n//\n// {\n//   \"name\": \"ladder-api\",\n//   \"type\": \"module\",\n//   \"scripts\": { \"start\": \"node server.js\", \"dev\": \"node --watch server.js\" }\n// }\n// Then: npm run dev\n\nimport { readFile, writeFile, readdir } from \"node:fs/promises\";\nimport path from \"node:path\";\nimport process from \"node:process\";\n\n// Reading and writing files — all promise-based\nconst raw = await readFile(\"data.json\", \"utf8\");     // top-level await works in ESM\nconst data = JSON.parse(raw);\ndata.updatedAt = new Date().toISOString();\nawait writeFile(\"data.json\", JSON.stringify(data, null, 2));\n\n// Build paths with path.join — never string concatenation, for Windows' sake\nconst files = await readdir(path.join(process.cwd(), \"src\"));\nconsole.log(files.filter(f => f.endsWith(\".js\")));\n\n// Command-line arguments and environment variables\nconst [, , command, ...args] = process.argv;         // node cli.js add milk\nconsole.log({ command, args });\nconst port = process.env.PORT ?? 3000;               // never hardcode secrets\nif (!process.env.API_KEY) {\n  console.error(\"API_KEY is missing\");\n  process.exit(1);                                    // non-zero = failure\n}",
      "label": "node-basics.js",
      "run": "none"
    },
    {
      "kind": "example",
      "code": "// npm install express\nimport express from \"express\";\n\nconst app = express();\napp.use(express.json());                 // parse JSON request bodies\n\nlet todos = [{ id: 1, text: \"learn Node\", done: false }];\n\napp.get(\"/api/todos\", (req, res) => {\n  const { done } = req.query;            // /api/todos?done=true\n  const list = done === undefined ? todos : todos.filter(t => String(t.done) === done);\n  res.json(list);\n});\n\napp.post(\"/api/todos\", (req, res) => {\n  const text = req.body?.text?.trim();\n  // Validate at the boundary — never trust a request body\n  if (!text) return res.status(400).json({ error: \"text is required\" });\n\n  const todo = { id: crypto.randomUUID(), text, done: false };\n  todos.push(todo);\n  res.status(201).json(todo);            // 201 Created, and return the new resource\n});\n\napp.delete(\"/api/todos/:id\", (req, res) => {\n  const before = todos.length;\n  todos = todos.filter(t => String(t.id) !== req.params.id);\n  if (todos.length === before) return res.status(404).json({ error: \"not found\" });\n  res.status(204).end();                 // 204 No Content\n});\n\n// One error handler for everything the routes throw\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ error: \"Internal error\" });\n});\n\napp.listen(process.env.PORT ?? 3000, () => console.log(\"listening on 3000\"));\n\n// Now point Project 6's fetch calls at http://localhost:3000/api/todos\n// and you have a full stack you wrote end to end.",
      "label": "server.js — a real API in 30 lines",
      "run": "none"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What's different from the browser"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**No DOM, no `window`.** The global object is `globalThis`; there's `process`, `__dirname`-style path helpers, and Node's own modules under the `node:` prefix.",
        "**Two module systems.** CommonJS (`require`) is the legacy default; ES modules need `\"type\": \"module\"` or a `.mjs` extension. Mixing them is the most common Node setup error.",
        "**The event loop has phases.** Same principle as Module 14, plus `process.nextTick`, which runs before promise microtasks, and `setImmediate`.",
        "**Streams.** Large files and responses are processed in chunks rather than loaded whole — the idea behind async iteration in Module 25.",
        "**Dependencies are yours to audit.** `npm audit`, a committed lockfile, and scepticism about tiny packages with large dependency trees."
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 28.1",
      "title": "A command-line tool",
      "blocks": [
        {
          "kind": "text",
          "text": "Build `notes.js`: `node notes.js add \"buy milk\"` appends to a JSON file, `node notes.js list` prints numbered notes, `node notes.js done 2` marks one complete. Requirements: create the file if it doesn't exist, handle a corrupt file without crashing, and exit with code 1 on bad input. It's small, it's genuinely useful, and it exercises `process.argv`, file I/O, JSON and error handling together — a good README-able repo."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q55",
      "title": "How does Node differ from the browser, and what is Node good at?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Same language and engine (V8), different host. No DOM or `window`; instead file system, network, child processes and OS access, plus CommonJS alongside ES modules. Node is single-threaded for your code with a libuv-backed thread pool for I/O, so it excels at I/O-bound, high-concurrency work — APIs, proxies, real-time servers, build tooling — and is a poor fit for CPU-bound work, which blocks the loop unless you move it to worker threads or another service."
        },
        {
          "kind": "text",
          "text": "Practical differences worth naming: `process.nextTick` runs ahead of promise microtasks; streams and backpressure matter for large payloads; an uncaught exception can take the whole process down, so you need process-level handlers and a supervisor; and configuration comes from environment variables rather than a bundler's build-time constants."
        }
      ]
    }
  ]
};
