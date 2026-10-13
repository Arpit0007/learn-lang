import { Lesson } from '../../shared/content';

export const M19_DEBUGGING: Lesson = {
  "slug": "m19-debugging",
  "title": "M19 Debugging and reading error messages",
  "nav": "Debugging",
  "num": "M19",
  "eyebrow": "Level 7 · read in Week 3, use forever · ~2 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 7 · Woven through weeks 3–14 · The working toolkit",
      "blocks": [
        {
          "kind": "text",
          "text": "Ten modules that a \"JavaScript course\" usually skips and a working developer uses weekly. They're numbered after the main spine because they slot *into* it rather than after it — the 14-week plan says exactly where each one belongs. Debugging in particular should be read early and re-read often; it's the skill that determines how fast every other skill grows."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Beginners debug by rereading code and hoping. Professionals debug by **narrowing**: reproduce it reliably, cut the search space in half, verify the assumption, repeat. The single biggest speed-up available to you right now is learning to read the error message instead of pasting it into a search box."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Every stack trace, decoded"
    },
    {
      "kind": "text",
      "text": "A trace reads *bottom-up in time, top-down in cause*. The first line is what broke; the lines under it are who called whom, most recent first. Your own file names are the interesting ones — skip the framework frames."
    },
    {
      "kind": "example",
      "code": "function getPrice(product) {\n  return product.price.toFixed(2);     // <- the actual failure happens here\n}\nfunction renderRow(product) {\n  return `${product.name}: ₹${getPrice(product)}`;\n}\nfunction renderCart(items) {\n  return items.map(renderRow).join(\"\\n\");\n}\n\ntry {\n  console.log(renderCart([{ name: \"Pen\", price: 20 }, { name: \"Pad\" }]));\n} catch (err) {\n  console.log(\"MESSAGE:\", err.message);\n  console.log(\"TYPE:\", err.name);\n  // The stack tells you the path: getPrice <- renderRow <- renderCart\n  console.log(\"STACK (first 3 frames):\");\n  console.log(err.stack.split(\"\\n\").slice(0, 3).join(\"\\n\"));\n}\n\n// The fix is at the SOURCE of the bad data, not at the crash site:\nconst safePrice = product => (product.price ?? 0).toFixed(2);\nconsole.log(safePrice({ name: \"Pad\" }));",
      "label": "stack-trace.js"
    },
    {
      "kind": "text",
      "text": "**The rule that trace teaches:** the line that throws is rarely the line that's wrong. Here `getPrice` is fine — the caller passed a product with no `price`. Fix the origin, or validate at the boundary; patching the crash site just moves the bug."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The error-message decoder"
    },
    {
      "kind": "table",
      "head": [
        "Message",
        "What it actually means",
        "Usual cause"
      ],
      "rows": [
        [
          "`Cannot read properties of undefined (reading 'x')`",
          "You did `something.x` and `something` was `undefined`",
          "A typo'd key, a missing API field, an array index that doesn't exist, or async data that hasn't arrived yet"
        ],
        [
          "`x is not a function`",
          "You called something that isn't callable",
          "Misspelled method, a value that's actually `undefined`, or a lost `this`"
        ],
        [
          "`x is not defined`",
          "No such variable in any enclosing scope",
          "Typo, missing `import`, or a script that hasn't loaded yet"
        ],
        [
          "`Cannot access 'x' before initialization`",
          "Temporal dead zone",
          "Using a `let`/`const`/`class` above its declaration — see Module 11"
        ],
        [
          "`Assignment to constant variable`",
          "Re-assigning a `const`",
          "You wanted `let` — or you meant to mutate a property, not rebind"
        ],
        [
          "`Maximum call stack size exceeded`",
          "Infinite recursion",
          "A missing or unreachable base case — see Module 20"
        ],
        [
          "`Unexpected token '}'` / `Unexpected end of input`",
          "Syntax error before this point",
          "An unclosed bracket, brace or quote *earlier* in the file"
        ],
        [
          "`undefined is not iterable`",
          "Spread or `for...of` on a non-iterable",
          "Destructuring a function's return value when it returned nothing"
        ],
        [
          "`Converting circular structure to JSON`",
          "`JSON.stringify` hit a cycle",
          "An object referencing itself, or a DOM node in your data"
        ],
        [
          "Output is `[object Object]`",
          "Not an error — an object was coerced to a string",
          "Use `console.log(obj)`, not string concatenation"
        ],
        [
          "Output is `NaN`",
          "Arithmetic on something non-numeric",
          "`undefined` in the maths, or a string that `Number()` can't parse"
        ],
        [
          "Nothing happens at all",
          "Usually not an error",
          "A missing `preventDefault`, a listener attached before the element exists, or a silent unhandled rejection"
        ]
      ]
    },
    {
      "kind": "example",
      "code": "const orders = [\n  { id: 1, city: \"Pune\", total: 1200, paid: true },\n  { id: 2, city: \"Delhi\", total: 900, paid: false },\n  { id: 3, city: \"Pune\", total: 400, paid: true },\n];\n\n// console.table — instantly readable for arrays of objects\nconsole.table(orders);\n\n// group related logs so they collapse together\nconsole.group(\"order check\");\nconsole.log(\"count:\", orders.length);\nconsole.log(\"unpaid:\", orders.filter(o => !o.paid).length);\nconsole.groupEnd();\n\n// count how many times a line is reached\nfor (const o of orders) console.count(o.city);\n\n// assert only speaks up when something is wrong\nconsole.assert(orders.every(o => o.total > 0), \"a total was not positive\");\n\n// time a block\nconsole.time(\"sum\");\nconst sum = orders.reduce((a, o) => a + o.total, 0);\nconsole.timeEnd(\"sum\");\nconsole.log(\"sum:\", sum);\n\n// Label your logs — \"here\" and \"test\" tell you nothing at 2am:\nconsole.log(\"[cart] after filter:\", orders.filter(o => o.paid).map(o => o.id));",
      "label": "console-tools.js"
    },
    {
      "kind": "example",
      "code": "// `debugger` pauses execution when DevTools is open — a breakpoint in code.\nfunction applyDiscount(cart, code) {\n  debugger;              // execution stops here; inspect cart and code\n  const rate = code === \"SAVE10\" ? 0.1 : 0;\n  return cart.map(item => ({ ...item, price: item.price * (1 - rate) }));\n}\n\n// In the Sources panel you can also:\n//  • click a line number to set a breakpoint — no code change needed\n//  • right-click it for a CONDITIONAL breakpoint: pauses only when\n//    e.g. item.id === 42, which beats logging 5,000 iterations\n//  • add a LOGPOINT: prints a message without pausing and without\n//    editing the file (your logs can't get committed by accident)\n//  • use the Call Stack panel to step back through callers\n//  • use Scope to see every variable's live value at that moment\n//  • toggle \"Pause on uncaught exceptions\" to stop exactly where it breaks\n\n// Useful in the Console itself:\n//   $0             the element currently selected in the Elements panel\n//   $$(\"li.done\")  querySelectorAll, as a real array\n//   monitorEvents($0, \"click\")   log every event on an element\n//   copy(someObject)             copy a value to the clipboard",
      "label": "devtools.js",
      "run": "none"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "**1. Reproduce** — find the smallest input that fails every time. An intermittent bug you can't reproduce cannot be fixed, only guessed at. **2. Locate** — bisect: log or breakpoint halfway through; the bug is in one half. Repeat. Four bisections narrow 1,000 lines to about 60. **3. Understand** — state the wrong assumption out loud: \"I assumed `user.profile` always exists.\" **4. Fix the cause**, not the symptom. **5. Prove it** — re-run the original reproduction, and check the fix didn't break a neighbour."
        }
      ],
      "title": "The five-step method"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Changing several things at once, so you never learn which one mattered. Adding `console.log(\"here\")` instead of logging the *value* you doubt. Assuming the library is broken — it almost never is. Logging an object you then mutate, since the console shows a live reference (use `console.log(structuredClone(obj))` to freeze a snapshot). And reading code looking for the bug: read code to form a hypothesis, then *test* it."
        }
      ],
      "title": "Trap · Debugging habits that waste hours"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 19.1",
      "title": "Find three bugs",
      "blocks": [
        {
          "kind": "text",
          "text": "This function should return the average price of in-stock items. It has three separate bugs. Run it, read what happens, and fix them one at a time — predicting each result before you re-run."
        },
        {
          "kind": "example",
          "code": "const items = [\n  { name: \"Pen\", price: 20, stock: 5 },\n  { name: \"Pad\", price: 60, stock: 0 },\n  { name: \"Ink\", price: 90, stock: 2 },\n];\n\nfunction averageInStock(list) {\n  const inStock = list.filter(item => item.stock > 0);\n  let total;\n  for (let i = 0; i <= inStock.length; i++) {\n    total += inStock[i].price;\n  }\n  return total / list.length;\n}\n\nconsole.log(averageInStock(items));",
          "label": "buggy.js"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "**Bug 1:** `let total;` starts as `undefined`, so `undefined + 20` is `NaN` and everything after is `NaN`. Start accumulators at `0`. **Bug 2:** `i <= inStock.length` runs one pass too many; `inStock[2]` is `undefined`, giving \"Cannot read properties of undefined (reading 'price')\". Array loops use `<`, never `<=`. **Bug 3:** it divides by `list.length` (3) instead of `inStock.length` (2) — no error at all, just a quietly wrong number. That third kind is the dangerous one, and only a test or a sanity check catches it."
            },
            {
              "kind": "example",
              "code": "const items = [\n  { name: \"Pen\", price: 20, stock: 5 },\n  { name: \"Pad\", price: 60, stock: 0 },\n  { name: \"Ink\", price: 90, stock: 2 },\n];\n\nfunction averageInStock(list) {\n  const inStock = list.filter(item => item.stock > 0);\n  if (inStock.length === 0) return 0;          // guard the empty case too\n  const total = inStock.reduce((sum, item) => sum + item.price, 0);\n  return total / inStock.length;\n}\n\nconsole.log(averageInStock(items));            // 55\nconsole.log(averageInStock([]));               // 0, not NaN",
              "label": "fixed.js"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q46",
      "title": "Walk me through how you'd debug a bug you can't reproduce",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Start by making it reproducible, because everything else depends on that: collect the exact input, browser, and sequence from the report; check logs and error monitoring for the stack trace and frequency; look for what's different about the failing environment — timing, data shape, permissions, network speed, cached bundle. Add structured logging or a breadcrumb trail around the suspected area and ship it behind a flag if needed."
        },
        {
          "kind": "text",
          "text": "Then narrow: bisect the code path, and bisect history with `git bisect` if it's a regression. Form one hypothesis at a time and test it. Once fixed, write the regression test that would have caught it — for a race condition or an async ordering bug, that test is the only proof the fix works."
        }
      ]
    }
  ]
};
