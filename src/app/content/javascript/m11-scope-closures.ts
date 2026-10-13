import { Lesson } from '../../shared/content';

export const M11_SCOPE_CLOSURES: Lesson = {
  "slug": "m11-scope-closures",
  "title": "M11 Scope, hoisting and closures",
  "nav": "Scope & closures",
  "num": "M11",
  "eyebrow": "Level 4 · Week 8 · ~5 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 4 · Weeks 8–9 · How JavaScript really works",
      "blocks": [
        {
          "kind": "text",
          "text": "The mechanics under the syntax: where variables live, how functions remember, what `this` points at, and how objects inherit. Roughly half of every JavaScript interview lives in these three modules. Take them slowly — week 8 is the hardest week of the course by design."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Scope: where a name is visible"
    },
    {
      "kind": "text",
      "text": "Scope answers one question: from this line, which variables can I see? JavaScript has three kinds — **global** (outside everything), **function** (inside a function), and **block** (inside any `{ }`, for `let` and `const` only)."
    },
    {
      "kind": "text",
      "text": "Lookup goes *outward*. If a name isn't in the current scope, the engine looks in the enclosing one, then the next, up to global — this chain of scopes is called the **scope chain**. It never looks inward or sideways."
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 750 260\" role=\"img\" aria-label=\"Nested scopes: a name is looked up in the current scope, then the one outside it, then the global scope\">\n  <defs><marker id=\"arS\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <rect class=\"box\" x=\"16\" y=\"26\" width=\"380\" height=\"200\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"30\" y=\"46\">Global scope</text>\n  <text x=\"30\" y=\"66\">const planet = \"Earth\"</text>\n  <rect class=\"box\" x=\"44\" y=\"80\" width=\"324\" height=\"130\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"58\" y=\"100\">function outer()</text>\n  <text x=\"58\" y=\"120\">const city = \"Bengaluru\"</text>\n  <rect class=\"acc\" x=\"72\" y=\"134\" width=\"268\" height=\"60\" rx=\"6\"></rect>\n  <text class=\"accT\" x=\"86\" y=\"154\">function inner()</text>\n  <text x=\"86\" y=\"176\">const street = \"MG Road\"</text>\n  <text class=\"lbl\" x=\"440\" y=\"24\">Looking up a name</text>\n  <rect class=\"acc\" x=\"440\" y=\"160\" width=\"180\" height=\"34\" rx=\"5\"></rect><text x=\"530\" y=\"181\" text-anchor=\"middle\">inner</text>\n  <rect class=\"box\" x=\"440\" y=\"104\" width=\"180\" height=\"34\" rx=\"5\"></rect><text x=\"530\" y=\"125\" text-anchor=\"middle\">outer</text>\n  <rect class=\"box\" x=\"440\" y=\"48\" width=\"180\" height=\"34\" rx=\"5\"></rect><text x=\"530\" y=\"69\" text-anchor=\"middle\">Global</text>\n  <line class=\"lnA\" x1=\"530\" y1=\"156\" x2=\"530\" y2=\"142\" marker-end=\"url(#arS)\"></line>\n  <line class=\"lnA\" x1=\"530\" y1=\"100\" x2=\"530\" y2=\"86\" marker-end=\"url(#arS)\"></line>\n  <text class=\"mut\" x=\"628\" y=\"152\">not</text>\n  <text class=\"mut\" x=\"628\" y=\"167\">found?</text>\n  <text class=\"mut\" x=\"628\" y=\"96\">still</text>\n  <text class=\"mut\" x=\"628\" y=\"111\">not?</text>\n  <text class=\"mut\" x=\"440\" y=\"222\">Not found anywhere on the chain →</text>\n  <text class=\"mut\" x=\"440\" y=\"238\">ReferenceError</text>\n  <circle class=\"mv mv-climb dotA\" cx=\"456\" cy=\"177\" r=\"5\"></circle>\n</svg>",
      "caption": "**Lookup only ever goes outward.** `inner` can see `street`, `city` and `planet`; `outer` cannot see `street`, and the global scope can see neither. That one-way street is the whole of scope.",
      "animated": true
    },
    {
      "kind": "example",
      "code": "const planet = \"Earth\";              // global-ish (module) scope\n\nfunction outer() {\n  const city = \"Bengaluru\";          // function scope\n\n  function inner() {\n    const street = \"MG Road\";        // inner function scope\n    console.log(street, city, planet); // sees all three, looking outward\n  }\n\n  inner();\n  // console.log(street);            // ReferenceError — can't look inward\n}\nouter();\n\n// Block scope\nif (true) {\n  let blockOnly = \"let is block-scoped\";\n  var functionOnly = \"var ignores blocks\";\n}\nconsole.log(functionOnly);           // works — var escaped the block\n// console.log(blockOnly);           // ReferenceError\n\n// Shadowing: an inner name hides an outer one of the same name\nconst size = \"large\";\nfunction describe() {\n  const size = \"small\";              // shadows the outer `size`\n  return size;\n}\nconsole.log(describe(), size);       // \"small\" \"large\"",
      "label": "scope.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Hoisting"
    },
    {
      "kind": "text",
      "text": "Before running any code, the engine scans the scope and sets aside space for every declaration it finds. That's hoisting. The *declaration* moves conceptually to the top; the *assignment* stays where you wrote it. What differs is what the variable holds in between."
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 680 230\" role=\"img\" aria-label=\"Timeline showing var readable as undefined before its line, while let throws in the temporal dead zone\">\n  <defs><marker id=\"arH\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <line class=\"faint dash\" x1=\"330\" y1=\"26\" x2=\"330\" y2=\"176\"></line>\n  <text class=\"mut\" x=\"60\" y=\"22\">scope entered</text>\n  <text class=\"accT\" x=\"338\" y=\"22\">the declaration line runs</text>\n  <text class=\"lbl\" x=\"16\" y=\"62\">var x</text>\n  <rect class=\"box\" x=\"96\" y=\"42\" width=\"234\" height=\"30\" rx=\"4\"></rect>\n  <text x=\"213\" y=\"62\" text-anchor=\"middle\">undefined</text>\n  <rect class=\"ok\" x=\"330\" y=\"42\" width=\"290\" height=\"30\" rx=\"4\"></rect>\n  <text x=\"475\" y=\"62\" text-anchor=\"middle\">the value you assigned</text>\n  <text class=\"mut\" x=\"96\" y=\"90\">readable, silently wrong — this is how var bugs hide</text>\n  <text class=\"lbl\" x=\"16\" y=\"132\">let x</text>\n  <rect class=\"bad\" x=\"96\" y=\"112\" width=\"234\" height=\"30\" rx=\"4\"></rect>\n  <text x=\"213\" y=\"132\" text-anchor=\"middle\">temporal dead zone</text>\n  <rect class=\"ok\" x=\"330\" y=\"112\" width=\"290\" height=\"30\" rx=\"4\"></rect>\n  <text x=\"475\" y=\"132\" text-anchor=\"middle\">the value you assigned</text>\n  <text class=\"mut\" x=\"96\" y=\"160\">touching it here throws ReferenceError — a loud, locatable failure</text>\n  <line class=\"ln\" x1=\"16\" y1=\"196\" x2=\"650\" y2=\"196\" marker-end=\"url(#arH)\"></line>\n  <text class=\"mut\" x=\"16\" y=\"216\">time within the scope →</text>\n  <line class=\"mv mv-sweep sweepline\" x1=\"96\" y1=\"34\" x2=\"96\" y2=\"152\"></line>\n</svg>",
      "caption": "**Both are hoisted; they differ in what they hold on the way.** The engine reserves every name before running a line of code. `var` hands you `undefined` and lets the bug travel; `let` and `const` refuse to be touched until their line, which is why they're the default.",
      "animated": true
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Before running your file, JavaScript reads it once and writes down every name you declared — like taking attendance. With `var`, the name is on the list but the seat is empty, so using it early quietly gives you \"nothing\". With `let` and `const` the name is on the list but the seat is locked, so touching it early throws an error instead."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "// Function declarations are hoisted completely — body and all:\nsayHi();                       // works\nfunction sayHi() { console.log(\"hi from a hoisted declaration\"); }\n\n// var is hoisted and initialised to undefined:\nconsole.log(varName);          // undefined — no error, which is the danger\nvar varName = \"assigned later\";\nconsole.log(varName);          // \"assigned later\"\n\n// let/const are hoisted but UNINITIALISED — the temporal dead zone (TDZ):\ntry {\n  console.log(letName);        // ReferenceError: Cannot access before initialization\n} catch (e) {\n  console.log(e.name + \":\", e.message);\n}\nlet letName = \"now it exists\";\nconsole.log(letName);\n\n// Function EXPRESSIONS follow their variable's rules:\ntry {\n  notYet();\n} catch (e) {\n  console.log(e.name + \":\", e.message);   // TypeError or ReferenceError\n}\nvar notYet = function () { console.log(\"never reached above\"); };",
      "label": "hoisting.js"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "`var` turns \"you used it too early\" into a silent `undefined` that surfaces as a mysterious bug three functions later. `let` and `const` turn the same mistake into an immediate, precisely-located error. Loud failure beats quiet wrongness — that's the whole argument for never writing `var`."
        }
      ],
      "title": "Why the TDZ is a feature"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Closures"
    },
    {
      "kind": "text",
      "text": "A **closure** is a function bundled together with the scope it was created in. When a function is defined inside another function, it keeps a live reference to the outer function's variables — even after that outer function has finished and returned."
    },
    {
      "kind": "text",
      "text": "You already built one in Module 6 (`makeCounter`). Here is what was happening."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A function remembers the room it was born in. When `makeCounter` finishes, the room would normally be cleared away — but the function it handed back still points at `count`, so the room stays standing, and only that function has the key. Call `makeCounter` twice and you get two rooms that know nothing about each other."
        }
      ],
      "title": "In plain words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 680 270\" role=\"img\" aria-label=\"Each call to makeCounter creates its own variable environment that the returned function keeps alive\">\n  <defs><marker id=\"arC\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <rect class=\"ghost\" x=\"200\" y=\"16\" width=\"280\" height=\"44\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"340\" y=\"36\" text-anchor=\"middle\">makeCounter() ran and returned.</text>\n  <text class=\"mut\" x=\"340\" y=\"52\" text-anchor=\"middle\">Its stack frame is gone.</text>\n  <text class=\"lbl\" x=\"20\" y=\"104\">const a = makeCounter()</text>\n  <rect class=\"box\" x=\"20\" y=\"118\" width=\"150\" height=\"44\" rx=\"6\"></rect>\n  <text x=\"95\" y=\"145\" text-anchor=\"middle\">function</text>\n  <rect class=\"acc\" x=\"210\" y=\"118\" width=\"150\" height=\"44\" rx=\"6\"></rect>\n  <text class=\"accT\" x=\"285\" y=\"139\" text-anchor=\"middle\">count: 3</text>\n  <text class=\"mut\" x=\"285\" y=\"155\" text-anchor=\"middle\">its own environment</text>\n  <line class=\"lnA\" x1=\"174\" y1=\"140\" x2=\"206\" y2=\"140\" marker-end=\"url(#arC)\"></line>\n  <text class=\"lbl\" x=\"20\" y=\"200\">const b = makeCounter()</text>\n  <rect class=\"box\" x=\"20\" y=\"214\" width=\"150\" height=\"44\" rx=\"6\"></rect>\n  <text x=\"95\" y=\"241\" text-anchor=\"middle\">function</text>\n  <rect class=\"acc\" x=\"210\" y=\"214\" width=\"150\" height=\"44\" rx=\"6\"></rect>\n  <text class=\"accT\" x=\"285\" y=\"235\" text-anchor=\"middle\">count: 1</text>\n  <text class=\"mut\" x=\"285\" y=\"251\" text-anchor=\"middle\">a separate one</text>\n  <line class=\"lnA\" x1=\"174\" y1=\"236\" x2=\"206\" y2=\"236\" marker-end=\"url(#arC)\"></line>\n  <text class=\"mut\" x=\"400\" y=\"128\">Each returned function keeps a live</text>\n  <text class=\"mut\" x=\"400\" y=\"146\">link to the variables it was born with.</text>\n  <text class=\"mut\" x=\"400\" y=\"164\">Nothing outside can reach them —</text>\n  <text class=\"mut\" x=\"400\" y=\"182\">a.count is undefined.</text>\n  <text class=\"mut\" x=\"400\" y=\"212\">Two calls, two environments,</text>\n  <text class=\"mut\" x=\"400\" y=\"230\">which is why the counters</text>\n  <text class=\"mut\" x=\"400\" y=\"248\">never interfere.</text>\n</svg>",
      "caption": "**A closure is a function plus the room it was born in.** The outer call has long since finished, but because the inner function still refers to `count`, that variable cannot be cleaned up — so it survives, privately, for as long as the function does."
    },
    {
      "kind": "example",
      "code": "function makeCounter(start = 0) {\n  let count = start;                     // lives in makeCounter's scope\n\n  return {                               // return several closures at once\n    increment() { count += 1; return count; },\n    decrement() { count -= 1; return count; },\n    get value() { return count; },\n  };\n}\n\nconst c1 = makeCounter();\nconst c2 = makeCounter(100);\n\nconsole.log(c1.increment(), c1.increment()); // 1 2\nconsole.log(c2.increment());                 // 101 — separate `count`\nconsole.log(c1.value, c2.value);             // 2 101\n\n// `count` is genuinely private — no way to reach it from outside:\nconsole.log(c1.count);                       // undefined\n\n// Practical closure 1: a function that can only ever run once\nfunction once(fn) {\n  let called = false, result;\n  return function (...args) {\n    if (called) return result;\n    called = true;\n    result = fn(...args);\n    return result;\n  };\n}\nconst init = once(() => { console.log(\"initialising…\"); return \"ready\"; });\nconsole.log(init(), init(), init());   // side effect happens exactly once",
      "label": "closures.js"
    },
    {
      "kind": "example",
      "code": "// The single most-asked closure question in interviews.\n\n// With var — one shared binding, so all three callbacks see the final value:\nfor (var i = 1; i <= 3; i++) {\n  setTimeout(() => console.log(\"var:\", i), 0);\n}\n// logs: var: 4, var: 4, var: 4\n\n// With let — a NEW binding per iteration, so each closure captures its own:\nfor (let j = 1; j <= 3; j++) {\n  setTimeout(() => console.log(\"let:\", j), 0);\n}\n// logs: let: 1, let: 2, let: 3\n\n// The pre-ES6 fix was an IIFE creating a fresh scope per pass:\nfor (var k = 1; k <= 3; k++) {\n  (function (captured) {\n    setTimeout(() => console.log(\"iife:\", captured), 0);\n  })(k);\n}",
      "label": "closure-loop.js"
    },
    {
      "kind": "text",
      "text": "**Why `var` prints 4 three times:** `var i` creates one binding for the whole function. The loop finishes — leaving `i` at 4 — long before any `setTimeout` callback runs, and all three closures point at that same binding. `let j` is different: the specification creates a fresh binding for each iteration and copies the value in, so each callback closes over its own `j`."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "A closure keeps its entire enclosing scope alive. If a long-lived callback closes over a huge array it doesn't need, that array can never be garbage collected. Keep closures small, and null out heavy references you're finished with. Module 18 goes deeper."
        }
      ],
      "title": "Trap · Closures and memory"
    },
    {
      "kind": "quiz",
      "question": "What does this log? `let x = 1; { console.log(x); let x = 2; }`",
      "options": [
        "1 — it finds the outer x",
        "2",
        "ReferenceError",
        "undefined"
      ],
      "answer": 2,
      "why": "**ReferenceError.** The inner `let x` is hoisted to the top of the block, so inside that block the name `x` refers to the inner binding from the first line onward — and it's in the temporal dead zone until its declaration. The outer `x` is shadowed and unreachable. This is exactly why the TDZ exists: it makes the shadowing mistake loud."
    },
    {
      "kind": "reveal",
      "tag": "Challenge 11.1",
      "title": "Write a memoizer",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `memoize(fn)` which returns a version of `fn` that caches results by argument, so repeated calls with the same input skip the work. Prove it with a deliberately slow function. A top-five interview coding task."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function memoize(fn) {\n  const cache = new Map();          // private, thanks to the closure\n\n  return function (...args) {\n    const key = JSON.stringify(args);   // fine for primitives\n    if (cache.has(key)) {\n      console.log(\"cache hit:\", key);\n      return cache.get(key);\n    }\n    const result = fn.apply(this, args); // preserve `this` for method use\n    cache.set(key, result);\n    return result;\n  };\n}\n\n// A deliberately expensive function\nfunction slowSquare(n) {\n  console.log(\"computing…\", n);\n  let x = 0;\n  for (let i = 0; i < 2_000_000; i++) x += 1;   // burn some time\n  return n * n;\n}\n\nconst fastSquare = memoize(slowSquare);\nconsole.log(fastSquare(9));   // computes\nconsole.log(fastSquare(9));   // cache hit — instant\nconsole.log(fastSquare(4));   // computes",
              "label": "solution-11-1.js"
            },
            {
              "kind": "text",
              "text": "Talking points that impress: `Map` over a plain object avoids prototype-key collisions; `JSON.stringify` as a key is fine for primitives but wrong for objects and functions (a `WeakMap` keyed on the object handles the single-object-argument case); and an unbounded cache is a memory leak, so production versions add an LRU limit.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Challenge 11.2",
      "title": "Debounce",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `debounce(fn, delay)`: the returned function postpones calling `fn` until `delay` ms have passed with no new calls. Used on every search box on the web — and asked in every front-end interview."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function debounce(fn, delay = 300) {\n  let timerId;                       // remembered across calls by the closure\n\n  return function (...args) {\n    clearTimeout(timerId);           // cancel the pending run\n    timerId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst search = debounce(term => console.log(\"SEARCHING for:\", term), 200);\n\n// Simulate fast typing — only the last one should fire\nsearch(\"j\");\nsearch(\"ja\");\nsearch(\"jav\");\nsearch(\"java\");   // 200ms after this, one search runs\n\n// Its cousin, throttle: run at most once per interval\nfunction throttle(fn, interval = 300) {\n  let last = 0;\n  return function (...args) {\n    const now = Date.now();\n    if (now - last >= interval) {\n      last = now;\n      fn.apply(this, args);\n    }\n  };\n}\nconst onScroll = throttle(() => console.log(\"scroll handled\"), 100);\nonScroll(); onScroll(); onScroll();   // only the first runs",
              "label": "solution-11-2.js"
            },
            {
              "kind": "text",
              "text": "Know the difference cold: **debounce** waits for the storm to end (search-as-you-type, auto-save, resize). **Throttle** guarantees a steady maximum rate (scroll position, mouse move, analytics pings).",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q11",
      "title": "What is a closure and where have you used one?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A closure is the combination of a function and the lexical environment it was declared in. Because the inner function holds a reference to that environment, the outer variables stay alive after the outer function returns, and each invocation of the outer function creates an independent environment."
        },
        {
          "kind": "text",
          "text": "Real uses: private state (counters, module pattern, factory functions), function factories, and every utility that needs memory between calls — `debounce`, `throttle`, `memoize`, `once`. Also every event handler that references a variable from its surrounding function is a closure, which is why the `var`-in-a-loop bug happens."
        },
        {
          "kind": "text",
          "text": "Costs worth naming: retained scope means retained memory, so a closure over a large object keeps it out of reach of the garbage collector."
        }
      ]
    }
  ]
};
