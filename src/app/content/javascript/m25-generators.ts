import { Lesson } from '../../shared/content';

export const M25_GENERATORS: Lesson = {
  "slug": "m25-generators",
  "title": "M25 Iterators, generators and async iteration",
  "nav": "Iterators & generators",
  "num": "M25",
  "eyebrow": "Level 7 · read after Module 14 (Week 10) · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "`for...of`, spread and destructuring all work through one small contract: the **iterable protocol**. An object is iterable if it has a `[Symbol.iterator]` method returning an object with a `next()` that gives `{ value, done }`. Implement it and your own types work with the whole language."
    },
    {
      "kind": "example",
      "code": "// The protocol, by hand — this is what for...of calls under the hood\nconst countdown = {\n  from: 3,\n  [Symbol.iterator]() {\n    let current = this.from;\n    return {\n      next: () => current > 0\n        ? { value: current--, done: false }\n        : { value: undefined, done: true },\n    };\n  },\n};\nconsole.log([...countdown]);\nfor (const n of countdown) console.log(n);\n\n// A generator does the same thing in a quarter of the code.\n// function* + yield: the function PAUSES at each yield and resumes on next().\nfunction* countdownGen(from) {\n  while (from > 0) yield from--;\n  return \"liftoff\";                 // the final value, with done: true\n}\nconst it = countdownGen(3);\nconsole.log(it.next(), it.next(), it.next(), it.next());\nconsole.log([...countdownGen(5)]);  // spread ignores the return value",
      "label": "iterators.js"
    },
    {
      "kind": "example",
      "code": "// Laziness is the real win: infinite sequences that compute only what you take.\nfunction* naturals() {\n  let n = 1;\n  while (true) yield n++;          // never ends — and never hangs, because it's lazy\n}\nfunction* take(iterable, count) {\n  let i = 0;\n  for (const value of iterable) {\n    if (i++ >= count) return;\n    yield value;\n  }\n}\nfunction* map(iterable, fn) { for (const v of iterable) yield fn(v); }\nfunction* filter(iterable, test) { for (const v of iterable) if (test(v)) yield v; }\n\n// A pipeline over an infinite source, evaluated one item at a time:\nconst firstFiveBigSquares = take(filter(map(naturals(), n => n * n), n => n > 50), 5);\nconsole.log([...firstFiveBigSquares]);\n\n// Unique id generator — a tiny, common use\nfunction* idMaker(prefix = \"id\") {\n  let n = 0;\n  while (true) yield `${prefix}-${++n}`;\n}\nconst nextId = idMaker(\"user\");\nconsole.log(nextId.next().value, nextId.next().value);\n\n// yield* delegates to another iterable — ideal for walking trees\nconst tree = { value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [{ value: 4, children: [] }] }] };\nfunction* walk(node) {\n  yield node.value;\n  for (const child of node.children) yield* walk(child);\n}\nconsole.log([...walk(tree)]);\n\n// Two-way: next(value) sends a value INTO the paused generator\nfunction* conversation() {\n  const name = yield \"What's your name?\";\n  const lang = yield `Hi ${name}. Favourite language?`;\n  return `${name} likes ${lang}.`;\n}\nconst chat = conversation();\nconsole.log(chat.next().value);\nconsole.log(chat.next(\"Arpit\").value);\nconsole.log(chat.next(\"JavaScript\").value);",
      "label": "generators.js"
    },
    {
      "kind": "example",
      "code": "const sleep = ms => new Promise(r => setTimeout(r, ms));\n\n// An async generator yields values that arrive over time.\n// This is exactly the shape of paginated APIs and streamed responses.\nasync function* fetchPages(totalPages) {\n  for (let page = 1; page <= totalPages; page++) {\n    await sleep(60);                                   // the \"network\"\n    yield { page, items: [`item-${page}a`, `item-${page}b`] };\n  }\n}\n\n// for await...of consumes them one at a time, in order\n(async () => {\n  const all = [];\n  for await (const { page, items } of fetchPages(3)) {\n    console.log(\"received page\", page);\n    all.push(...items);\n  }\n  console.log(\"total items:\", all.length, all);\n\n  // Why this beats collecting everything first: you can stop early,\n  // and memory stays flat no matter how many pages exist.\n  for await (const { page } of fetchPages(100)) {\n    if (page === 2) { console.log(\"found what I needed, stopping\"); break; }\n  }\n})();",
      "label": "async-iteration.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Once a generator object is exhausted it stays done — a second `[...gen]` gives `[]`. Iterate a generator *function* (calling it again) rather than a stored generator object if you need to go twice. Related: an object is only iterable if `Symbol.iterator` is on it or its prototype, which is why plain objects throw in `for...of` while arrays, strings, `Map`, `Set` and `NodeList` don't."
        }
      ],
      "title": "Trap · Generators are single-use"
    },
    {
      "kind": "reveal",
      "tag": "Interview Q52",
      "title": "What problem do generators solve that plain functions don't?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** They let a function suspend and resume, so it can produce a sequence lazily instead of returning everything at once. That makes three things possible: infinite or very large sequences evaluated one item at a time with flat memory; custom iteration over your own data structures via `[Symbol.iterator]`; and two-way communication, since `next(value)` passes a value back into the paused function — the mechanism co-routine libraries used to implement async/await before it was standardised."
        },
        {
          "kind": "text",
          "text": "In practice today: paginated API readers and streams via `async function*` with `for await...of`, tree traversal with `yield*`, id generators, and lazy pipelines. The trade-off is that they're single-use and slower per item than a plain array pass, so they earn their place on large or unbounded data, not on a ten-element list."
        }
      ]
    }
  ]
};
