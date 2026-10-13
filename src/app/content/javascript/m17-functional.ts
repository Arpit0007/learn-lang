import { Lesson } from '../../shared/content';

export const M17_FUNCTIONAL: Lesson = {
  "slug": "m17-functional",
  "title": "M17 Higher-order functions and functional patterns",
  "nav": "Functional patterns",
  "num": "M17",
  "eyebrow": "Level 6 · Week 12 · ~2 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 6 · Week 12 · Craft",
      "blocks": [
        {
          "kind": "text",
          "text": "The difference between writing JavaScript that works and writing JavaScript other people can maintain. Two modules: composing functions well, and understanding what your code costs at runtime."
        }
      ]
    },
    {
      "kind": "text",
      "text": "A **higher-order function** takes a function as an argument, returns a function, or both. You've used dozens already — `map`, `filter`, `setTimeout`, `addEventListener`, `debounce`. This module names the patterns so you can reach for them deliberately."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Pure functions"
    },
    {
      "kind": "text",
      "text": "A function is **pure** if the same inputs always give the same output, and it changes nothing outside itself. Pure functions are trivially testable, safe to cache, and safe to run in any order. Impure code is unavoidable — the network, the DOM, the clock — so the goal isn't purity everywhere, it's *pushing impurity to the edges*."
    },
    {
      "kind": "example",
      "code": "// IMPURE: reads and writes something outside itself\nlet taxRate = 0.18;\nconst cart = [];\nfunction addItemImpure(price) {\n  cart.push(price * (1 + taxRate));    // mutates `cart`, depends on `taxRate`\n}\n\n// PURE: everything it needs comes in; a new value comes out\nfunction addItem(items, price, rate) {\n  return [...items, price * (1 + rate)];\n}\n\nconst c1 = [];\nconst c2 = addItem(c1, 100, 0.18);\nconst c3 = addItem(c2, 200, 0.18);\nconsole.log(c1, c2, c3);      // every stage still available — easy to test and undo\n\n// Immutable updates on objects — the pattern behind Redux, React state, etc.\nconst state = { user: { name: \"Arpit\", plan: \"free\" }, items: 3 };\n\nconst upgraded = {\n  ...state,\n  user: { ...state.user, plan: \"pro\" },   // must spread each nested level\n};\nconsole.log(state.user.plan, upgraded.user.plan);   // \"free\" \"pro\"\n\n// Non-mutating array operations:\nconst nums = [3, 1, 2];\nconsole.log([...nums].sort((a, b) => a - b), nums);\nconsole.log(nums.toSorted?.((a, b) => a - b) ?? \"toSorted not supported here\");\nconsole.log(nums.filter(n => n !== 1));      // \"remove\" without splice\nconsole.log(nums.map(n => (n === 1 ? 99 : n))); // \"replace\" without index writes",
      "label": "purity.js"
    },
    {
      "kind": "example",
      "code": "// Currying: a function of many arguments becomes a chain of one-argument functions\nconst multiply = a => b => a * b;\nconst double = multiply(2);\nconst triple = multiply(3);\nconsole.log(double(10), triple(10));\n\n// Partial application with bind:\nfunction log(level, module, message) { return `[${level}] ${module}: ${message}`; }\nconst warnAuth = log.bind(null, \"WARN\", \"auth\");\nconsole.log(warnAuth(\"token expired\"));\n\n// Composition: build a pipeline out of small functions\nconst pipe = (...fns) => input => fns.reduce((value, fn) => fn(value), input);\n\nconst trim = s => s.trim();\nconst lower = s => s.toLowerCase();\nconst spacesToDashes = s => s.replace(/\\s+/g, \"-\");\nconst stripPunctuation = s => s.replace(/[^\\w-]/g, \"\");\n\nconst slugify = pipe(trim, lower, stripPunctuation, spacesToDashes);\nconsole.log(slugify(\"  Hello, JavaScript World!  \"));\n\n// compose is the same thing right-to-left:\nconst compose = (...fns) => input => fns.reduceRight((v, fn) => fn(v), input);\nconsole.log(compose(spacesToDashes, lower, trim)(\"  Two Words \"));\n\n// A generic curry, for the interview:\nfunction curry(fn) {\n  return function curried(...args) {\n    return args.length >= fn.length\n      ? fn.apply(this, args)\n      : (...more) => curried.apply(this, [...args, ...more]);\n  };\n}\nconst volume = curry((l, w, h) => l * w * h);\nconsole.log(volume(2)(3)(4), volume(2, 3)(4), volume(2, 3, 4));",
      "label": "composition.js"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "React's `useMemo`, Redux reducers, RxJS operators, Express middleware, array pipelines in data code — all of it is composition of small functions over immutable data. You don't have to write Haskell; you do have to be comfortable passing functions around and not mutating your inputs."
        }
      ],
      "title": "Where this shows up in real work"
    },
    {
      "kind": "reveal",
      "tag": "Challenge 17.1",
      "title": "Group, sort and summarise",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a single pipeline that takes the orders below and produces, per city, the number of orders and total revenue, sorted by revenue descending — without mutating `orders`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const orders = [\n  { id: 1, city: \"Pune\",      total: 1200 },\n  { id: 2, city: \"Bengaluru\", total: 3400 },\n  { id: 3, city: \"Pune\",      total: 800  },\n  { id: 4, city: \"Delhi\",     total: 2200 },\n  { id: 5, city: \"Bengaluru\", total: 1500 },\n];\n\nconst summary = Object.entries(\n    orders.reduce((acc, { city, total }) => {\n      const row = acc[city] ?? { count: 0, revenue: 0 };\n      acc[city] = { count: row.count + 1, revenue: row.revenue + total };\n      return acc;\n    }, {})\n  )\n  .map(([city, stats]) => ({ city, ...stats }))\n  .sort((a, b) => b.revenue - a.revenue);\n\nconsole.log(summary);\nconsole.log(orders.length, \"orders untouched\");\n\n// With Object.groupBy, where available, the grouping step is one call:\nconst grouped = Object.groupBy?.(orders, o => o.city);\nconsole.log(grouped ? Object.keys(grouped) : \"Object.groupBy not supported here\");",
              "label": "solution-17-1.js"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q18",
      "title": "What is a pure function, and why do they matter?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A pure function returns the same output for the same input and has no observable side effects — no mutation of arguments or shared state, no I/O, no reading the clock or randomness. Benefits: testable without mocks, memoizable, safe to reorder or parallelise, and easy to reason about because the whole contract is in the signature."
        },
        {
          "kind": "text",
          "text": "The practical stance is *functional core, imperative shell*: keep transformation logic pure, and confine side effects — network calls, DOM writes, logging — to a thin outer layer. That's why React demands pure render functions and pure reducers while pushing effects into `useEffect`."
        }
      ]
    }
  ]
};
