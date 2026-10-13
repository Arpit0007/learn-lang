import { Lesson } from '../../shared/content';

export const INTERVIEW: Lesson = {
  "slug": "interview",
  "title": "The interview bank",
  "nav": "Interview bank",
  "eyebrow": "Preparation",
  "blocks": [
    {
      "kind": "text",
      "text": "Thirty-three long-form questions sit inside the modules, where the context is — Q1–Q20 across Levels 0–6, and Q46–Q58 across the Level 7 toolkit. This section adds twenty-five rapid-fire questions and five coding problems. Practise saying the answers *out loud* — the gap between knowing something and explaining it under pressure is the whole game."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · junior"
    },
    {
      "kind": "reveal",
      "tag": "Q21",
      "title": "What are the primitive types?",
      "blocks": [
        {
          "kind": "text",
          "text": "`string`, `number`, `boolean`, `undefined`, `null`, `bigint`, `symbol`. Everything else is an object. Primitives are immutable and compared by value; objects are compared by reference."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q22",
      "title": "`null` vs `undefined`?",
      "blocks": [
        {
          "kind": "text",
          "text": "`undefined` means \"not assigned\" and is what the engine supplies — for unassigned variables, missing properties, missing arguments and functions with no return. `null` means \"intentionally empty\" and is assigned by you. `typeof undefined` is `\"undefined\"`; `typeof null` is `\"object\"` (a historical bug). `null == undefined` is true, `null === undefined` is false."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q23",
      "title": "What is hoisting?",
      "blocks": [
        {
          "kind": "text",
          "text": "Declarations are registered in their scope before execution. Function declarations are fully hoisted and callable early. `var` is hoisted and initialised to `undefined`. `let`, `const` and `class` are hoisted but uninitialised — the temporal dead zone — so accessing them before their declaration throws a `ReferenceError`."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q24",
      "title": "What is the difference between `slice` and `splice`?",
      "blocks": [
        {
          "kind": "text",
          "text": "`slice(start, end)` returns a shallow copy of a section and leaves the original untouched. `splice(start, deleteCount, ...insert)` mutates the original, removing and/or inserting items, and returns the removed elements. `slice` also works on strings; `splice` does not."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q25",
      "title": "How do you copy an array or object?",
      "blocks": [
        {
          "kind": "text",
          "text": "Shallow: `[...arr]`, `arr.slice()`, `{...obj}`, `Object.assign({}, obj)`. Deep: `structuredClone(obj)`. `JSON.parse(JSON.stringify(obj))` works but loses `undefined`, functions and symbols, stringifies Dates, and throws on circular references."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q26",
      "title": "What does `\"use strict\"` change?",
      "blocks": [
        {
          "kind": "text",
          "text": "Undeclared assignments throw instead of creating globals; duplicate parameter names and octal literals are errors; `this` is `undefined` in plain function calls rather than the global object; deleting variables throws; and some silent failures (writing to a read-only property) become errors. ES modules and class bodies are strict automatically."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q27",
      "title": "`forEach` vs `for...of`?",
      "blocks": [
        {
          "kind": "text",
          "text": "`for...of` supports `break`, `continue` and `await` inside the loop body; `forEach` supports none of these — it ignores returned promises entirely, which makes `forEach(async …)` a common bug. `forEach` skips holes in sparse arrays. Use `for...of` when the body is asynchronous or may exit early."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q28",
      "title": "What is the DOM?",
      "blocks": [
        {
          "kind": "text",
          "text": "A tree of objects the browser builds from parsed HTML, exposing an API to read and modify the document. It is provided by the browser, not by the JavaScript language — which is why it doesn't exist in Node."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · mid-level"
    },
    {
      "kind": "reveal",
      "tag": "Q29",
      "title": "Explain `this` in five sentences.",
      "blocks": [
        {
          "kind": "text",
          "text": "`this` is determined by the call site, not the definition site. With `new`, it's the newly created object. With `call`/`apply`/`bind`, it's the given object. With `obj.method()`, it's `obj`. With a plain call, it's `undefined` in strict mode or the global object otherwise — and arrow functions have no `this` of their own, inheriting the enclosing lexical one."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q30",
      "title": "What is the prototype chain?",
      "blocks": [
        {
          "kind": "text",
          "text": "Each object has an internal link to a prototype object. Property lookups walk that chain until the key is found or the chain ends at `null`. It's how inherited methods work, why `Object.hasOwn` differs from `in`, and why adding to `Array.prototype` affects every existing array."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q31",
      "title": "Difference between `Map` and a plain object?",
      "blocks": [
        {
          "kind": "text",
          "text": "`Map` accepts any value as a key (objects included), preserves insertion order, exposes `.size`, is directly iterable, and has no prototype keys to collide with. Objects only take string and symbol keys and inherit from `Object.prototype`. Use `Map` for dynamic, frequently-changing keyed collections; use objects for fixed-shape records and anything that must be JSON-serialised."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q32",
      "title": "`Set` and `WeakMap` — when?",
      "blocks": [
        {
          "kind": "text",
          "text": "`Set` stores unique values; `[...new Set(arr)]` is the idiomatic deduplicate. `WeakMap`/`WeakSet` hold keys weakly, so an entry disappears when the key is otherwise unreachable — ideal for attaching metadata to DOM nodes or caching per-object data without leaking. They're not iterable and have no `.size`, by design."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q33",
      "title": "What is currying?",
      "blocks": [
        {
          "kind": "text",
          "text": "Transforming a function of N arguments into N chained functions of one argument each, so it can be applied a piece at a time: `f(a, b, c)` becomes `f(a)(b)(c)`. Useful for creating specialised functions from general ones and for building pipelines. Related but distinct: partial application fixes some arguments and leaves the rest, which is what `bind` does."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q34",
      "title": "Debounce vs throttle?",
      "blocks": [
        {
          "kind": "text",
          "text": "Debounce delays execution until a quiet period has elapsed — the function runs once, after the activity stops (search-as-you-type, autosave, resize). Throttle guarantees at most one execution per interval during continuous activity (scroll position, mousemove, rate-limited analytics). Debounce answers \"when they're done\"; throttle answers \"no more than this often\"."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q35",
      "title": "What is event delegation and why use it?",
      "blocks": [
        {
          "kind": "text",
          "text": "Attaching a single listener to a common ancestor and using bubbling plus `event.target.closest()` to identify the source. It handles dynamically added elements without re-binding, uses far less memory than per-element listeners, and removes a whole class of cleanup bugs."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q36",
      "title": "`localStorage` vs `sessionStorage` vs cookies?",
      "blocks": [
        {
          "kind": "text",
          "text": "All are per-origin. `localStorage` persists until cleared; `sessionStorage` lasts for the tab's lifetime; cookies expire on a set date and are sent with every matching HTTP request, which makes them right for auth tokens (with `HttpOnly` and `Secure`) and wrong for bulk data. Web Storage holds strings only, is synchronous, and caps around 5–10 MB; use IndexedDB for larger or structured data."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Rapid-fire · senior"
    },
    {
      "kind": "reveal",
      "tag": "Q37",
      "title": "What happens when you call a function with `new`?",
      "blocks": [
        {
          "kind": "text",
          "text": "Four steps: a new empty object is created; its `[[Prototype]]` is set to the constructor's `prototype`; the constructor runs with `this` bound to that object; and the object is returned unless the constructor explicitly returns a different *object* (returning a primitive is ignored). Arrow functions have no `[[Construct]]`, so `new` on one throws."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q38",
      "title": "Explain the temporal dead zone.",
      "blocks": [
        {
          "kind": "text",
          "text": "The span between entering a scope and executing a `let`/`const`/`class` declaration. The binding exists but is uninitialised, so any access — including `typeof`, which is safe on truly undeclared names — throws a `ReferenceError`. It exists to make use-before-declaration a loud, immediate error instead of a silent `undefined`."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q39",
      "title": "How does garbage collection work?",
      "blocks": [
        {
          "kind": "text",
          "text": "Mark-and-sweep over reachability from roots (globals, the call stack), with generational and incremental refinements in V8 — most objects die young, so a small \"young generation\" is collected frequently and cheaply, and survivors are promoted. Reference counting is not used, because it can't collect cycles. You influence it only by dropping references."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q40",
      "title": "What is a Web Worker, and when would you use one?",
      "blocks": [
        {
          "kind": "text",
          "text": "A script running on a separate thread with its own global scope, communicating by message passing (structured-cloned data, or transferables for zero-copy). No DOM access. Use one for genuinely CPU-bound work — parsing large files, image processing, crypto, heavy data transforms — so the main thread stays free to render and respond."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q41",
      "title": "Explain CORS in one paragraph.",
      "blocks": [
        {
          "kind": "text",
          "text": "Browsers enforce the same-origin policy: a page can't read a response from a different origin unless that server opts in. Cross-Origin Resource Sharing is the opt-in — the server returns `Access-Control-Allow-Origin` and related headers, and for non-simple requests the browser first sends a preflight `OPTIONS`. It is enforced by the browser, not the server, which is why the same request succeeds from curl. Fixes belong on the server or in a proxy, never in client code."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q42",
      "title": "How do you prevent XSS?",
      "blocks": [
        {
          "kind": "text",
          "text": "Never insert untrusted data as HTML: use `textContent` or `createElement`. If you must render HTML, sanitise with a vetted library (DOMPurify). Add a Content Security Policy to block inline and third-party scripts, escape by context (HTML, attribute, URL, JS all differ), and keep session tokens in `HttpOnly` cookies so a successful injection still can't read them."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q43",
      "title": "What are generators and iterators for?",
      "blocks": [
        {
          "kind": "text",
          "text": "An iterator is any object with a `next()` returning `{value, done}`; anything with `[Symbol.iterator]` is iterable and works with `for...of` and spread. A generator (`function*`) creates one declaratively, pausing at each `yield`. Useful for lazy or infinite sequences, custom iteration over your own data structures, and streaming large datasets without materialising them."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q44",
      "title": "Explain the difference between deep equality and reference equality, and how you'd implement the former.",
      "blocks": [
        {
          "kind": "text",
          "text": "`===` on objects compares identity, not contents. A deep equality check compares types, then recurses over keys — handling arrays, `Date`, `Map`/`Set`, `NaN` (equal to itself here, unlike `===`), and cycles via a seen-set. Note that key order shouldn't matter, and `JSON.stringify` comparison is unreliable because it does."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Q45",
      "title": "What would you look for in a code review?",
      "blocks": [
        {
          "kind": "text",
          "text": "Correctness on edge cases (empty, null, one item, very large); error paths handled where they can be handled; no mutation of shared or argument state; naming that makes comments unnecessary; async correctness — unawaited promises, sequential loops that should be parallel, missing cancellation; leaks from listeners and timers; and tests for the behaviour, not the implementation. Then style, last, because a formatter should already own it."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Coding problems"
    },
    {
      "kind": "text",
      "text": "Attempt each on paper or in an editor for fifteen minutes before opening the solution. In a real interview, narrate your thinking — silence reads as being stuck."
    },
    {
      "kind": "reveal",
      "tag": "Problem 1",
      "title": "Flatten a nested array to any depth",
      "blocks": [
        {
          "kind": "example",
          "code": "// Recursive — the expected answer\nfunction flatten(arr) {\n  return arr.reduce(\n    (out, item) => out.concat(Array.isArray(item) ? flatten(item) : item),\n    []\n  );\n}\n\n// Iterative with a stack — no recursion limit on deeply nested input\nfunction flattenIterative(arr) {\n  const stack = [...arr];\n  const out = [];\n  while (stack.length) {\n    const next = stack.pop();\n    if (Array.isArray(next)) stack.push(...next);\n    else out.push(next);\n  }\n  return out.reverse();\n}\n\nconst nested = [1, [2, [3, [4, [5]]]], 6];\nconsole.log(flatten(nested));\nconsole.log(flattenIterative(nested));\nconsole.log(nested.flat(Infinity));   // the built-in — mention it, then show yours",
          "label": "flatten.js"
        },
        {
          "kind": "text",
          "text": "Say out loud that `Array.prototype.flat(Infinity)` exists — interviewers want to know you'd use the standard library at work, and can still write the algorithm.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 2",
      "title": "Deep clone with circular references",
      "blocks": [
        {
          "kind": "example",
          "code": "function deepClone(value, seen = new WeakMap()) {\n  if (value === null || typeof value !== \"object\") return value;   // primitives\n  if (seen.has(value)) return seen.get(value);                     // cycle guard\n\n  if (value instanceof Date) return new Date(value);\n  if (value instanceof RegExp) return new RegExp(value.source, value.flags);\n  if (value instanceof Map) {\n    const copy = new Map(); seen.set(value, copy);\n    for (const [k, v] of value) copy.set(deepClone(k, seen), deepClone(v, seen));\n    return copy;\n  }\n  if (value instanceof Set) {\n    const copy = new Set(); seen.set(value, copy);\n    for (const v of value) copy.add(deepClone(v, seen));\n    return copy;\n  }\n\n  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));\n  seen.set(value, copy);\n  for (const [k, v] of Object.entries(value)) copy[k] = deepClone(v, seen);\n  return copy;\n}\n\nconst original = { n: 1, when: new Date(0), tags: new Set([\"a\"]), nested: { deep: [1, 2] } };\noriginal.self = original;                     // a cycle\n\nconst clone = deepClone(original);\nclone.nested.deep.push(3);\nconsole.log(original.nested.deep, clone.nested.deep);\nconsole.log(clone.self === clone, clone.when instanceof Date);",
          "label": "deep-clone.js"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 3",
      "title": "Implement `Promise.all`",
      "blocks": [
        {
          "kind": "example",
          "code": "function promiseAll(items) {\n  return new Promise((resolve, reject) => {\n    const results = [];\n    let settled = 0;\n\n    if (items.length === 0) return resolve([]);   // the edge case they check for\n\n    items.forEach((item, index) => {\n      // Promise.resolve wraps non-promise values, as the real one does\n      Promise.resolve(item).then(\n        value => {\n          results[index] = value;      // by INDEX — order must match the input\n          settled++;\n          if (settled === items.length) resolve(results);\n        },\n        reject                          // first rejection wins; later ones are ignored\n      );\n    });\n  });\n}\n\nconst delay = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));\n\npromiseAll([delay(60, \"a\"), 42, delay(10, \"c\")]).then(v => console.log(\"ok:\", v));\npromiseAll([delay(20, \"a\"), Promise.reject(new Error(\"boom\"))])\n  .catch(e => console.log(\"rejected:\", e.message));",
          "label": "promise-all.js"
        },
        {
          "kind": "text",
          "text": "The two details that separate a pass from a fail: assigning results *by index* rather than pushing, and handling the empty-array case.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 4",
      "title": "Group an array by a key function",
      "blocks": [
        {
          "kind": "example",
          "code": "function groupBy(items, keyFn) {\n  return items.reduce((acc, item) => {\n    const key = keyFn(item);\n    (acc[key] ||= []).push(item);      // logical OR assignment creates the array once\n    return acc;\n  }, Object.create(null));             // no prototype -> a key of \"toString\" is safe\n}\n\nconst people = [\n  { name: \"Ravi\", dept: \"eng\" },\n  { name: \"Nina\", dept: \"design\" },\n  { name: \"Omar\", dept: \"eng\" },\n];\n\nconsole.log(groupBy(people, p => p.dept));\nconsole.log(groupBy([1.2, 1.8, 2.1, 2.9], n => Math.floor(n)));\nconsole.log(groupBy([\"apple\", \"avocado\", \"beet\"], w => w[0]));",
          "label": "group-by.js"
        },
        {
          "kind": "text",
          "text": "`Object.create(null)` is the detail worth mentioning: a plain `{}` inherits `toString`, `constructor` and friends, so grouping by a key with one of those names behaves strangely.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Problem 5",
      "title": "The output-prediction gauntlet",
      "blocks": [
        {
          "kind": "text",
          "text": "Six snippets that appear in interviews constantly. Predict every line, then run it."
        },
        {
          "kind": "example",
          "code": "// 1 — closures in a loop\nfor (var i = 0; i < 3; i++) setTimeout(() => console.log(\"A\", i), 0);\n\n// 2 — this in a nested regular function\nconst obj = {\n  name: \"outer\",\n  run() {\n    const inner = function () { return this?.name; };\n    return [this.name, inner()];\n  },\n};\nconsole.log(\"B\", obj.run());\n\n// 3 — hoisting\nconsole.log(\"C\", typeof declared, typeof notDeclared);\nfunction declared() {}\n\n// 4 — coercion\nconsole.log(\"D\", [] + [], [] + {}, 1 + \"2\" - 1);\n\n// 5 — microtask vs macrotask\nsetTimeout(() => console.log(\"E timeout\"), 0);\nPromise.resolve().then(() => console.log(\"E promise\"));\nconsole.log(\"E sync\");\n\n// 6 — reference vs value\nconst a = { n: 1 };\nconst b = a;\nb.n = 2;\nconst c = { ...a };\nc.n = 3;\nconsole.log(\"F\", a.n, b.n, c.n);",
          "label": "gauntlet.js"
        },
        {
          "kind": "reveal",
          "tag": "Answers",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": true,
              "items": [
                "`A 3` three times — one `var` binding, read after the loop ends.",
                "`B [\"outer\", undefined]` — the inner plain function call gets its own `this`, which is `undefined` here.",
                "`C \"function\" \"undefined\"` — the declaration is fully hoisted; `typeof` is the one operator that tolerates a completely undeclared name.",
                "`D \"\" \"[object Object]\" 11` — the last one is `\"12\" - 1`, and subtraction coerces to number.",
                "`E sync`, `E promise`, `E timeout` — microtasks drain before the next macrotask.",
                "`F 2 2 3` — `b` is the same object as `a`; `c` is a copy."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Re-read Modules 11, 12, 13, 14 and 21 — closures, `this`, prototypes and the event loop are more than half of a typical JavaScript round. Re-implement `debounce`, `memoize`, `bind`, `Promise.all` and `flatten` from a blank file until you can do each in under ten minutes. Prepare a two-minute walkthrough of one project — the problem, one hard decision you made, and one thing you'd change now. That last answer, honestly given, does more than any amount of trivia."
        }
      ],
      "title": "The week before an interview"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Where to go after week 14"
    },
    {
      "kind": "text",
      "text": "You'll be ready for a framework — React is the safest first choice, and everything in Levels 4–6 maps directly onto it: closures become hooks, immutability becomes state updates, the event loop explains every \"why did it render twice\". Add TypeScript soon after; it is now the default in most professional codebases and it will make the type rules from Modules 2 and 3 explicit. Then testing with Vitest, and Node for the back end."
    },
    {
      "kind": "text",
      "text": "Keep the habit that got you here: build something small, break it deliberately, and read the error message before you search for it."
    },
    {
      "kind": "text",
      "text": "Every code block in this course is editable and runnable — the sandbox captures `console.log`, supports `await`, and re-runs from scratch each time. Use it as a scratchpad whenever a rule seems unbelievable.",
      "style": "small"
    }
  ]
};
