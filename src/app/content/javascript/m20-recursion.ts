import { Lesson } from '../../shared/content';

export const M20_RECURSION: Lesson = {
  "slug": "m20-recursion",
  "title": "M20 Recursion",
  "nav": "Recursion",
  "num": "M20",
  "eyebrow": "Level 7 · read after Module 6 (Week 4) · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A recursive function calls itself on a smaller piece of the problem. Two parts, always: a **base case** that returns without recursing, and a **recursive case** that moves measurably toward it. Miss either and you get `Maximum call stack size exceeded`."
    },
    {
      "kind": "text",
      "text": "Recursion isn't a clever alternative to loops. It's the natural tool for data with *unknown depth* — trees, nested objects, folder structures, the DOM, JSON from anywhere."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Imagine standing in a queue and wanting to know your position. You tap the person in front and ask \"what number are you?\". They ask the person in front of them. Eventually the first person says \"1\" — that's the base case — and the answer travels back down the line, each person adding one."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "function countdown(n) {\n  if (n <= 0) {                 // BASE CASE — stop\n    console.log(\"liftoff\");\n    return;\n  }\n  console.log(n);\n  countdown(n - 1);             // RECURSIVE CASE — smaller problem\n}\ncountdown(3);\n\n// Every call waits on the stack until the one below it returns:\nfunction factorial(n) {\n  if (n <= 1) return 1;                 // base\n  return n * factorial(n - 1);          // 5 * (4 * (3 * (2 * 1)))\n}\nconsole.log(factorial(5));   // 120\n\n// Trace it to see the stack build up and unwind:\nfunction traced(n, depth = 0) {\n  const pad = \"  \".repeat(depth);\n  console.log(`${pad}-> factorial(${n})`);\n  if (n <= 1) { console.log(`${pad}<- 1`); return 1; }\n  const result = n * traced(n - 1, depth + 1);\n  console.log(`${pad}<- ${result}`);\n  return result;\n}\ntraced(4);",
      "label": "recursion-basics.js"
    },
    {
      "kind": "example",
      "code": "// Where recursion earns its place: data of unknown depth.\nconst fileTree = {\n  name: \"project\", type: \"folder\", children: [\n    { name: \"index.html\", type: \"file\", size: 2 },\n    { name: \"src\", type: \"folder\", children: [\n      { name: \"app.js\", type: \"file\", size: 12 },\n      { name: \"lib\", type: \"folder\", children: [\n        { name: \"utils.js\", type: \"file\", size: 4 },\n      ]},\n    ]},\n  ],\n};\n\n// 1. Total size — a loop cannot do this without knowing the depth in advance\nfunction totalSize(node) {\n  if (node.type === \"file\") return node.size;          // base\n  return node.children.reduce((sum, child) => sum + totalSize(child), 0);\n}\nconsole.log(\"total:\", totalSize(fileTree), \"KB\");\n\n// 2. Print the tree\nfunction print(node, depth = 0) {\n  console.log(\"  \".repeat(depth) + (node.type === \"folder\" ? \"📁 \" : \"📄 \") + node.name);\n  (node.children ?? []).forEach(child => print(child, depth + 1));\n}\nprint(fileTree);\n\n// 3. Find one node anywhere in the tree\nfunction findByName(node, name) {\n  if (node.name === name) return node;\n  for (const child of node.children ?? []) {\n    const hit = findByName(child, name);\n    if (hit) return hit;                                // stop as soon as found\n  }\n  return null;\n}\nconsole.log(findByName(fileTree, \"utils.js\"));\n\n// 4. Deep-count every key in nested API data\nfunction countKeys(value) {\n  if (value === null || typeof value !== \"object\") return 0;\n  return Object.values(value).reduce((n, v) => n + countKeys(v), Object.keys(value).length);\n}\nconsole.log(\"keys:\", countKeys(fileTree));",
      "label": "recursion-trees.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "The call stack holds roughly 10,000 frames. A base case that's never reached, or recursion over a 100,000-item list, will blow it. Two fixes: rewrite with an explicit stack and a `while` loop (as in the iterative `flatten` in the interview bank), or memoize so the same sub-problem isn't recomputed. JavaScript engines do *not* reliably optimise tail calls, so don't count on that escape hatch."
        }
      ],
      "title": "Trap · Stack overflow, and the cost of naive recursion"
    },
    {
      "kind": "example",
      "code": "// Naive fibonacci recomputes the same values exponentially often:\nlet naiveCalls = 0;\nfunction fib(n) {\n  naiveCalls++;\n  return n < 2 ? n : fib(n - 1) + fib(n - 2);\n}\nconsole.log(\"fib(25) =\", fib(25), \"in\", naiveCalls, \"calls\");\n\n// Memoized: each n is computed once. Linear instead of exponential.\nlet memoCalls = 0;\nfunction fibFast(n, cache = new Map()) {\n  memoCalls++;\n  if (n < 2) return n;\n  if (cache.has(n)) return cache.get(n);\n  const value = fibFast(n - 1, cache) + fibFast(n - 2, cache);\n  cache.set(n, value);\n  return value;\n}\nconsole.log(\"fib(25) =\", fibFast(25), \"in\", memoCalls, \"calls\");\n\n// And iteratively — no stack at all, safe for huge n:\nfunction fibLoop(n) {\n  let a = 0, b = 1;\n  for (let i = 0; i < n; i++) [a, b] = [b, a + b];\n  return a;\n}\nconsole.log(\"fib(90) =\", fibLoop(90));",
      "label": "fib-memo.js"
    },
    {
      "kind": "reveal",
      "tag": "Challenge 20.1",
      "title": "Flatten a nested object into dotted paths",
      "blocks": [
        {
          "kind": "text",
          "text": "Turn `{a: {b: {c: 1}}, d: 2}` into `{\"a.b.c\": 1, \"d\": 2}`, to any depth. This exact task appears in take-homes constantly — config files, form state and analytics payloads all need it."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function flattenObject(obj, prefix = \"\", out = {}) {\n  for (const [key, value] of Object.entries(obj)) {\n    const path = prefix ? `${prefix}.${key}` : key;\n\n    // Recurse only into plain objects — arrays, dates and null are leaves here\n    if (value !== null && typeof value === \"object\" && !Array.isArray(value)\n        && !(value instanceof Date)) {\n      flattenObject(value, path, out);\n    } else {\n      out[path] = value;\n    }\n  }\n  return out;\n}\n\nconst config = {\n  app: { name: \"ladder\", theme: { mode: \"dark\", accent: \"gold\" } },\n  version: 2,\n  tags: [\"js\", \"course\"],\n};\nconsole.log(flattenObject(config));\n\n// The inverse, for completeness:\nfunction unflatten(flat) {\n  const out = {};\n  for (const [path, value] of Object.entries(flat)) {\n    const keys = path.split(\".\");\n    let node = out;\n    keys.forEach((key, i) => {\n      if (i === keys.length - 1) node[key] = value;\n      else node = node[key] ??= {};\n    });\n  }\n  return out;\n}\nconsole.log(unflatten(flattenObject(config)));",
              "label": "solution-20-1.js"
            },
            {
              "kind": "text",
              "text": "The judgement call worth explaining out loud: deciding what counts as a leaf. Recursing into arrays and `Date` objects is the mistake that turns a clean helper into a bug factory.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q47",
      "title": "When would you choose recursion over iteration?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** When the data is recursive: trees and graphs, nested JSON of unknown depth, directory walks, the DOM, parsers and backtracking problems. There, recursion mirrors the shape of the data and the code is far shorter and clearer than a hand-managed stack."
        },
        {
          "kind": "text",
          "text": "Choose iteration when depth can be large or unbounded — JavaScript's stack is around 10,000 frames and there's no reliable tail-call optimisation — or when the loop version is equally readable, which it usually is for flat sequences. Any recursion can be converted to iteration with an explicit stack, and any exponential recursion (naive Fibonacci) should be memoized or reformulated as a bottom-up loop."
        }
      ]
    }
  ]
};
