import { Lesson } from '../../shared/content';

export const M29_MODERN_JS: Lesson = {
  "slug": "m29-modern-js",
  "title": "M29 Modern JavaScript: ES2015 → ES2026, and what's next",
  "nav": "Modern JS · ES2026",
  "num": "M29",
  "eyebrow": "Level 7 · read in Week 14 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "\"Modern JavaScript\" isn't one thing you learn once. Since 2015 the language has shipped a new edition every June, and the useful skill isn't memorising the list — it's knowing which features are safe to use today, which are still landing, and how to check for yourself when this page goes stale."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "How the language actually changes"
    },
    {
      "kind": "text",
      "text": "Proposals go through **TC39**'s five stages: 0 (idea), 1 (worth exploring), 2 and 2.7 (spec text and tests), 3 (ready — engines start shipping it), 4 (done, included in the next yearly edition). Stage 3 is where you'll first meet a feature in the wild; Stage 4 means it's standard."
    },
    {
      "kind": "text",
      "text": "One naming note for interviews: people say \"ES6\" to mean \"modern JavaScript\", but ES6 (ES2015) is now a decade old, and everything in Levels 1–6 of this course is ES6 or later. The current edition is **ES2026**, approved on 30 June 2026."
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "This course teaches ES6+ throughout, not legacy JavaScript with modern bits bolted on: `let`/`const`, arrow functions, template literals, destructuring, spread and rest (M2, M6, M8) · classes with `#private` fields and static members (M13) · modules and dynamic `import()` (M16) · promises, `async`/`await`, async generators and `for await...of` (M14, M25) · `Map`, `Set`, `WeakMap`, `Symbol` (M24) · optional chaining, nullish coalescing, logical assignment (M3, M8) · `structuredClone`, error `cause`, top-level `await` (M8, M15, M16). This module fills in what's arrived recently and what's arriving next."
        }
      ],
      "title": "You already know most of modern JavaScript"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Recent and safe to use today"
    },
    {
      "kind": "text",
      "text": "These shipped between ES2020 and ES2024 and are supported everywhere that matters. If you're writing JavaScript in 2026 and not using them, you're writing more code than you need to."
    },
    {
      "kind": "example",
      "code": "const rows = [\n  { id: 1, name: \"Ravi\", dept: \"eng\", score: 72 },\n  { id: 2, name: \"Nina\", dept: \"design\", score: 91 },\n  { id: 3, name: \"Omar\", dept: \"eng\", score: 64 },\n];\n\n// at() — negative indexing, no more arr[arr.length - 1]\nconsole.log(rows.at(-1).name, \"abc\".at(-1));\n\n// findLast / findLastIndex — search from the end\nconsole.log(rows.findLast(r => r.dept === \"eng\").name);          // \"Omar\"\n\n// Object.hasOwn — replaces the clumsy hasOwnProperty.call dance\nconsole.log(Object.hasOwn(rows[0], \"score\"), Object.hasOwn(rows[0], \"toString\"));\n\n// Immutable array methods (ES2023): the same operations, without mutating\nconst scores = [72, 91, 64];\nconsole.log(scores.toSorted((a, b) => a - b), scores);   // original untouched\nconsole.log(scores.toReversed());\nconsole.log(scores.with(0, 100));                         // copy with one index changed\nconsole.log(scores.toSpliced(1, 1));                      // copy with an item removed\n// These are why `[...arr].sort()` is no longer necessary.\n\n// Object.groupBy / Map.groupBy (ES2024) — grouping without a reduce\nconsole.log(Object.groupBy(rows, r => r.dept));\nconsole.log(Map.groupBy(rows, r => (r.score >= 70 ? \"pass\" : \"fail\")));\n\n// Numeric separators, replaceAll, flat/flatMap, Object.fromEntries\nconsole.log(1_000_000, \"a-b-c\".replaceAll(\"-\", \"+\"));\nconsole.log([[1, 2], [3, [4]]].flat(2), rows.flatMap(r => [r.id, r.name]));\nconsole.log(Object.fromEntries(rows.map(r => [r.id, r.name])));",
      "label": "recent-essentials.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "ES2025 — the newest widely-shipping edition"
    },
    {
      "kind": "text",
      "text": "Two of these change how you write everyday code: **Set methods** finally make set algebra a one-liner, and **iterator helpers** bring `map`/`filter`/`take` to any iterator — so you can build lazy pipelines without the hand-rolled generators from Module 25."
    },
    {
      "kind": "example",
      "code": "const a = new Set([1, 2, 3, 4]);\nconst b = new Set([3, 4, 5]);\n\n// Set methods — union, intersection, difference, symmetricDifference,\n// isSubsetOf, isSupersetOf, isDisjointFrom\nif (a.union) {\n  console.log(\"union:\", [...a.union(b)]);\n  console.log(\"intersection:\", [...a.intersection(b)]);\n  console.log(\"difference:\", [...a.difference(b)]);\n  console.log(\"symmetricDifference:\", [...a.symmetricDifference(b)]);\n  console.log(\"isDisjointFrom:\", a.isDisjointFrom(new Set([9])));\n} else {\n  console.log(\"Set methods not supported in this browser — use the [...a].filter() forms from M24\");\n}\n\n// Iterator helpers — lazy map/filter/take/drop/flatMap/reduce/toArray\n// on ANY iterator, evaluated one item at a time.\nfunction* naturals() { let n = 1; while (true) yield n++; }\n\nif (typeof Iterator !== \"undefined\" && naturals().map) {\n  const firstFive = naturals()\n    .map(n => n * n)\n    .filter(n => n % 2 === 1)\n    .take(5)\n    .toArray();\n  console.log(\"odd squares:\", firstFive);        // an infinite source, five results\n\n  // .drop(), .flatMap(), .reduce(), .some(), .every(), .find() are all there too\n  console.log(naturals().drop(10).take(3).toArray());\n} else {\n  console.log(\"Iterator helpers not supported — use the generator versions from M25\");\n}\n\n// Promise.try — run sync OR async code and always get a promise back,\n// so a synchronous throw becomes a rejection instead of crashing the caller\nif (Promise.try) {\n  Promise.try(() => { throw new Error(\"sync failure\"); })\n    .catch(e => console.log(\"caught as a rejection:\", e.message));\n} else {\n  console.log(\"Promise.try not supported — use Promise.resolve().then(fn)\");\n}\n\n// RegExp.escape — safely put user input inside a pattern\nconst userInput = \"1+1 (test).\";\nconst safe = RegExp.escape ? RegExp.escape(userInput) : userInput.replace(/[.*+?^${}()|[\\]\\\\]/g, \"\\\\$&\");\nconsole.log(new RegExp(safe).test(\"1+1 (test).\"));",
      "label": "es2025.js"
    },
    {
      "kind": "example",
      "code": "// Some ES2025 features are SYNTAX, so they can't be feature-detected —\n// they either parse or they don't. These are read-only for that reason.\n\n// 1. Import attributes — import JSON (and other types) safely\nimport config from \"./config.json\" with { type: \"json\" };\nconst translations = await import(\"./en.json\", { with: { type: \"json\" } });\n\n// 2. Duplicate named capture groups across regex alternatives.\n//    Before ES2025 this was a SyntaxError:\nconst version = /ECMAScript (?<year>\\d{4})|ES(?<year>\\d{2})/;\nconsole.log(\"ES15\".match(version).groups.year);      // \"15\"\n\n// 3. Regex pattern modifiers — apply a flag to PART of a pattern\nconst auth = /^(?i:bearer) [A-Za-z0-9._-]+$/;        // only \"bearer\" is case-insensitive\nconsole.log(auth.test(\"Bearer abc.def\"));            // true\nconsole.log(auth.test(\"bearer ABC.DEF\"));            // true",
      "label": "es2025-syntax.js",
      "run": "none"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "ES2026 — approved 30 June 2026"
    },
    {
      "kind": "text",
      "text": "The current edition. Smaller than ES2025, and mostly about sanding off long-standing rough edges — several of which this course has already warned you about."
    },
    {
      "kind": "table",
      "head": [
        "Feature",
        "What it fixes",
        "Example"
      ],
      "rows": [
        [
          "`Array.fromAsync`",
          "Collecting an async iterator into an array — the paginated-fetch pattern from M25",
          "`await Array.fromAsync(fetchPages(3))`"
        ],
        [
          "`Error.isError`",
          "A reliable error check; `instanceof Error` fails across iframes, workers and realms",
          "`Error.isError(err)`"
        ],
        [
          "`Math.sumPrecise`",
          "The floating-point trap from M4 — sums an array without accumulating drift",
          "`Math.sumPrecise([1e20, 0.1, -1e20])` → `0.1`"
        ],
        [
          "`Map.getOrInsert`",
          "The \"read, check, then set\" dance in every counter and cache you've written",
          "`counts.getOrInsert(key, 0)`"
        ],
        [
          "`Iterator.concat`",
          "Joining iterators end to end without materialising arrays",
          "`Iterator.concat(a, [2026], b)`"
        ],
        [
          "`Uint8Array` base64/hex",
          "Encoding binary without `btoa`/`atob` string gymnastics",
          "`bytes.toBase64()`, `Uint8Array.fromBase64(s)`"
        ],
        [
          "JSON.parse source access",
          "Losing precision on huge numbers — the reviver now sees the raw source text",
          "`JSON.parse(s, (k, v, { source }) => BigInt(source))`"
        ]
      ]
    },
    {
      "kind": "example",
      "code": "// Every one of these is guarded, so this block runs whatever your browser supports.\n\n// Map.getOrInsert — compare with the M24 counter that needed ?? 0 every time\nconst counts = new Map();\nif (counts.getOrInsert) {\n  for (const word of [\"js\", \"css\", \"js\"]) {\n    counts.set(word, counts.getOrInsert(word, 0) + 1);\n  }\n  console.log(\"getOrInsert:\", [...counts]);\n} else {\n  const fallback = new Map();\n  for (const word of [\"js\", \"css\", \"js\"]) fallback.set(word, (fallback.get(word) ?? 0) + 1);\n  console.log(\"fallback counter:\", [...fallback]);\n}\n\n// Error.isError — survives realm boundaries where instanceof does not\nconst err = new TypeError(\"bad input\");\nconsole.log(\"Error.isError:\", Error.isError ? Error.isError(err) : \"(not supported) \" + (err instanceof Error));\n\n// Math.sumPrecise — the fix for the classic floating-point complaint\nconst tricky = [1e20, 0.1, -1e20];\nconsole.log(\"naive reduce:\", tricky.reduce((a, b) => a + b, 0));   // 0\nconsole.log(\"sumPrecise:  \", Math.sumPrecise ? Math.sumPrecise(tricky) : \"not supported\");\n\n// Array.fromAsync — collect an async iterator in one call\nasync function* pages() { for (let p = 1; p <= 3; p++) yield { page: p }; }\nif (Array.fromAsync) {\n  console.log(\"fromAsync:\", await Array.fromAsync(pages(), r => r.page));\n} else {\n  const out = []; for await (const r of pages()) out.push(r.page);\n  console.log(\"manual for-await:\", out);\n}\n\n// Uint8Array base64\nconst bytes = new Uint8Array([72, 105]);\nconsole.log(\"toBase64:\", bytes.toBase64 ? bytes.toBase64() : \"not supported\");",
      "label": "es2026.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Coming next — Stage 4, targeting ES2027"
    },
    {
      "kind": "text",
      "text": "These are finished proposals already shipping in some engines. Knowing them by name is a cheap interview signal."
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**`Temporal`** — the replacement for `Date`, and the fix for everything Module 23 warns you about. Separate types for an instant, a plain date, a plain time and a zoned date-time, all immutable, with real calendar arithmetic. Learn it the moment it's available to you.",
        "**Explicit resource management** — `using` and `await using` declarations that dispose of a resource automatically when the block exits, the way `finally` does but without the boilerplate. Ideal for file handles, database connections, locks and subscriptions.",
        "**`Iterator.zip`** (joint iteration) — walk several iterators in lockstep.",
        "**`Atomics.pause`** — a hint for spin-wait loops in shared-memory code. Rare in application work."
      ]
    },
    {
      "kind": "text",
      "text": "Further out and worth watching, but not yet standard: **decorators** (Stage 3, already used by Angular and MobX via transpilers), **pattern matching**, and **signals** for fine-grained reactivity."
    },
    {
      "kind": "example",
      "code": "// Temporal — targeting ES2027. Everything Date got wrong, fixed.\nconst now = Temporal.Now.zonedDateTimeISO(\"Asia/Kolkata\");\nconst birthday = Temporal.PlainDate.from(\"1996-12-25\");   // a DATE, with no timezone\nconst nextYear = birthday.add({ years: 1, months: 2 });   // real calendar arithmetic\nconst days = birthday.until(Temporal.Now.plainDateISO()).total({ unit: \"days\" });\nconsole.log(now.toString(), nextYear.toString(), Math.round(days));\n// Note: months are 1-based, objects are immutable, and instants, plain dates\n// and zoned date-times are separate types you cannot mix up by accident.\n\n// Explicit resource management — cleanup that can't be forgotten\n{\n  using file = openFile(\"./data.csv\");        // disposed when the block exits\n  await using db = await connect(url);        // async disposal, even on throw\n  process(file, db);\n}   // [Symbol.dispose] / [Symbol.asyncDispose] run here, automatically\n\n// Decorators (Stage 3) — metadata and behaviour attached declaratively\nclass Api {\n  @logged\n  @retry(3)\n  async fetchUser(id) { /* … */ }\n}",
      "label": "whats-next.js",
      "run": "none"
    },
    {
      "kind": "example",
      "code": "// Rather than trust any article's support table — including this page's —\n// ask the engine you're actually running in. Run this in your own browser too.\nconst probes = {\n  \"at()                     (ES2022)\": () => [1].at(-1) === 1,\n  \"Object.hasOwn            (ES2022)\": () => typeof Object.hasOwn === \"function\",\n  \"structuredClone           (2021)\": () => typeof structuredClone === \"function\",\n  \"findLast()               (ES2023)\": () => typeof [].findLast === \"function\",\n  \"toSorted() / with()      (ES2023)\": () => typeof [].toSorted === \"function\",\n  \"Object.groupBy           (ES2024)\": () => typeof Object.groupBy === \"function\",\n  \"Set.union et al.         (ES2025)\": () => typeof new Set().union === \"function\",\n  \"Iterator helpers         (ES2025)\": () => typeof Iterator !== \"undefined\" && typeof Iterator.prototype?.take === \"function\",\n  \"Promise.try              (ES2025)\": () => typeof Promise.try === \"function\",\n  \"RegExp.escape            (ES2025)\": () => typeof RegExp.escape === \"function\",\n  \"Array.fromAsync          (ES2026)\": () => typeof Array.fromAsync === \"function\",\n  \"Error.isError            (ES2026)\": () => typeof Error.isError === \"function\",\n  \"Math.sumPrecise          (ES2026)\": () => typeof Math.sumPrecise === \"function\",\n  \"Map.getOrInsert          (ES2026)\": () => typeof new Map().getOrInsert === \"function\",\n  \"Iterator.concat          (ES2026)\": () => typeof Iterator !== \"undefined\" && typeof Iterator.concat === \"function\",\n  \"Uint8Array.toBase64      (ES2026)\": () => typeof new Uint8Array().toBase64 === \"function\",\n  \"Temporal                 (ES2027)\": () => typeof Temporal !== \"undefined\",\n};\n\nlet supported = 0;\nfor (const [name, check] of Object.entries(probes)) {\n  let ok = false;\n  try { ok = check(); } catch { ok = false; }\n  if (ok) supported++;\n  console.log(`${ok ? \"yes\" : \" no\"}  ${name}`);\n}\nconsole.log(`\\n${supported} of ${Object.keys(probes).length} supported here.`);\nconsole.log(\"Anything missing is a polyfill or a transpiler away — see below.\");",
      "label": "feature-probe.js"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Check **MDN's Baseline** badge on the feature's page: \"widely available\" means it's been in every major browser for 30 months and needs no thought; \"newly available\" means it works everywhere current but not on older devices your users may still have. Then check your own analytics, not a general support table. If you need it before it's safe, a **polyfill** adds the runtime behaviour (`core-js`) and a **transpiler** converts new syntax to old (Babel, TypeScript, or your bundler's target setting) — but syntax like `using` needs the transpiler, while methods like `Array.fromAsync` need the polyfill. They are not interchangeable."
        }
      ],
      "title": "How to decide whether to use a new feature"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Every June brings a new list and a wave of \"you must learn this\" posts. Most of it won't touch your code for years. The features that genuinely changed daily JavaScript in the last decade fit on one hand — arrow functions, promises and `async`/`await`, destructuring and spread, modules, optional chaining. Master fundamentals and read the yearly summary in twenty minutes; don't rebuild your mental model annually. In an interview, \"I know the language evolves yearly and I check Baseline before adopting\" is a better answer than reciting ES2026's seven additions."
        }
      ],
      "title": "Trap · Chasing the changelog"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 29.1",
      "title": "Modernise old code",
      "blocks": [
        {
          "kind": "text",
          "text": "Rewrite this 2014-era function using everything you now know. Aim for no mutation, no `var`, and half the lines."
        },
        {
          "kind": "example",
          "code": "function summarise(users, minScore) {\n  if (typeof minScore === \"undefined\") { minScore = 50; }\n  var result = { passed: [], byDept: {}, top: null };\n\n  for (var i = 0; i < users.length; i++) {\n    var user = users[i];\n    var score = user.stats && user.stats.score ? user.stats.score : 0;\n\n    if (score >= minScore) { result.passed.push(user.name); }\n\n    if (!result.byDept.hasOwnProperty(user.dept)) { result.byDept[user.dept] = []; }\n    result.byDept[user.dept].push(user.name);\n\n    if (result.top === null || score > result.top.score) {\n      result.top = { name: user.name, score: score };\n    }\n  }\n  return result;\n}\n\nconsole.log(summarise([\n  { name: \"Ravi\", dept: \"eng\", stats: { score: 72 } },\n  { name: \"Nina\", dept: \"design\", stats: { score: 91 } },\n  { name: \"Omar\", dept: \"eng\", stats: null },\n]));",
          "label": "legacy.js"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const scoreOf = user => user.stats?.score ?? 0;      // optional chaining + nullish\n\nfunction summarise(users, minScore = 50) {           // default parameter\n  const scored = users.map(u => ({ ...u, score: scoreOf(u) }));\n\n  return {\n    passed: scored.filter(u => u.score >= minScore).map(u => u.name),\n\n    // Object.groupBy (ES2024), with the pre-2024 reduce as a fallback\n    byDept: Object.groupBy\n      ? Object.fromEntries(\n          Object.entries(Object.groupBy(scored, u => u.dept))\n            .map(([dept, list]) => [dept, list.map(u => u.name)])\n        )\n      : scored.reduce((acc, u) => { (acc[u.dept] ??= []).push(u.name); return acc; }, {}),\n\n    // toSorted (ES2023) — no mutation of the input\n    top: scored.toSorted((a, b) => b.score - a.score).at(0) ?? null,\n  };\n}\n\nconst users = [\n  { name: \"Ravi\", dept: \"eng\", stats: { score: 72 } },\n  { name: \"Nina\", dept: \"design\", stats: { score: 91 } },\n  { name: \"Omar\", dept: \"eng\", stats: null },\n];\nconsole.log(summarise(users));\nconsole.log(users[0].score);      // undefined — the input was never touched",
              "label": "solution-29-1.js"
            },
            {
              "kind": "text",
              "text": "Nine ideas from this course in twenty lines: default parameters, optional chaining, nullish coalescing, spread, `map`/`filter`, `Object.groupBy`, `toSorted`, `at()`, and a pure function that doesn't mutate its argument. If you can write and explain this version, you can hold your own in a modern codebase.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q56",
      "title": "How do you keep up with JavaScript, and how do you decide when to adopt a new feature?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The language ships a yearly edition through TC39's stage process, so I read the release summary each June rather than tracking proposals daily — Stage 3 is when engines start shipping, Stage 4 is standard. For adoption I check MDN's Baseline status, then our own analytics for the browsers we actually serve, then whether our build target already handles it. Methods can be polyfilled with core-js; syntax needs a transpiler, so those are different decisions."
        },
        {
          "kind": "text",
          "text": "Beyond that, I weigh it as a team choice: does the feature remove real code and risk, or is it novelty? `Object.groupBy`, `toSorted` and optional chaining pay for themselves immediately because they delete error-prone boilerplate. I'd hold off on anything Stage 3 in production code unless it's behind a transpiler we already run."
        },
        {
          "kind": "text",
          "text": "**Concretely, as of now:** ES2025 brought Set methods, iterator helpers, `Promise.try`, `RegExp.escape` and import attributes; ES2026 (approved 30 June 2026) brought `Array.fromAsync`, `Error.isError`, `Math.sumPrecise`, `Map.getOrInsert`, `Iterator.concat`, Uint8Array base64/hex and JSON source-text access; `Temporal` and `using` are Stage 4, targeting ES2027.",
          "style": "small"
        }
      ]
    }
  ]
};
