import { Lesson } from '../../shared/content';

export const M6_FUNCTIONS: Lesson = {
  "slug": "m6-functions",
  "title": "M6 Functions",
  "nav": "Functions",
  "num": "M6",
  "eyebrow": "Level 1 · Week 3 · ~4 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A function is a named, reusable block of code that takes **inputs** (parameters) and produces an **output** (a return value). Functions are the single most important construct in JavaScript, because in this language functions are also *values* — you can store them in variables, pass them to other functions, and return them from functions. Everything from array methods to promises to closures is built on that fact."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A function is a recipe with a name. You hand it ingredients (the things in brackets) and it hands something back (the `return` value). Writing the recipe cooks nothing — you have to *call* it, with brackets, to make it run."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "// 1. Function declaration — hoisted, so it can be called before it's defined\nfunction add(a, b) {\n  return a + b;\n}\n\n// 2. Function expression — stored in a variable, NOT hoisted\nconst subtract = function (a, b) {\n  return a - b;\n};\n\n// 3. Arrow function — the modern short form\nconst multiply = (a, b) => a * b;\n//  no braces = the expression IS the return value (\"implicit return\")\n\nconst square = n => n * n;        // one parameter: parentheses optional\nconst greet = () => \"hi\";          // no parameters: parentheses required\n\n// With a body, you must write `return` explicitly:\nconst divide = (a, b) => {\n  if (b === 0) return null;\n  return a / b;\n};\n\nconsole.log(add(2, 3), subtract(9, 4), multiply(3, 4), square(5), divide(10, 0));",
      "label": "functions.js"
    },
    {
      "kind": "example",
      "code": "// Default parameters\nfunction greet(name = \"there\", greeting = \"Hello\") {\n  return `${greeting}, ${name}!`;\n}\nconsole.log(greet());              // \"Hello, there!\"\nconsole.log(greet(\"Arpit\"));       // \"Hello, Arpit!\"\nconsole.log(greet(\"Arpit\", \"Hi\")); // \"Hi, Arpit!\"\n\n// Rest parameters: collect any number of arguments into an array\nfunction sum(...numbers) {\n  let total = 0;\n  for (const n of numbers) total += n;\n  return total;\n}\nconsole.log(sum(1, 2), sum(1, 2, 3, 4, 5), sum());\n\n// A function with no return statement returns undefined\nfunction shout(text) {\n  console.log(text.toUpperCase());\n}\nconst result = shout(\"quiet\");\nconsole.log(result); // undefined — it printed, it didn't return",
      "label": "params.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Functions as values"
    },
    {
      "kind": "text",
      "text": "This is the idea that unlocks the rest of the course. A function can be handed to another function, exactly like a number can."
    },
    {
      "kind": "example",
      "code": "function applyTwice(fn, value) {\n  return fn(fn(value));       // call the function we were given, twice\n}\n\nconst double = n => n * 2;\nconsole.log(applyTwice(double, 5));    // 20\n\n// Same idea, with the function written inline at the call site:\nconsole.log(applyTwice(n => n + 3, 10)); // 16\n\n// A function that RETURNS a function:\nfunction makeMultiplier(factor) {\n  return n => n * factor;\n}\nconst triple = makeMultiplier(3);\nconsole.log(triple(7)); // 21\n// `triple` remembers factor = 3. That memory is a CLOSURE — Module 11.",
      "label": "first-class.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`setTimeout(sayHi, 1000)` passes the function so it can be called later. `setTimeout(sayHi(), 1000)` calls it *immediately* and passes the result — usually `undefined`. The parentheses mean \"run it now\". Getting this wrong is the number-one source of \"why did my callback fire instantly?\"."
        }
      ],
      "title": "Trap · Calling versus referencing"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Arrows are shorter and, crucially, do not have their own `this` — they inherit it from where they were written. That makes them right for callbacks and wrong for object methods and constructors. Module 12 covers exactly why; for now, use arrows for short callbacks and `function` for object methods."
        }
      ],
      "title": "Arrow vs regular — the short version"
    },
    {
      "kind": "quiz",
      "question": "What does this print? `const f = () => { name: \"Arpit\" }; console.log(f());`",
      "options": [
        "{ name: \"Arpit\" }",
        "undefined",
        "\"Arpit\"",
        "A SyntaxError"
      ],
      "answer": 1,
      "why": "**undefined.** The braces are read as a function *body*, not an object literal — inside it, `name:` is a label and `\"Arpit\"` is a discarded expression. There's no `return`, so you get `undefined`. To return an object literal from a concise arrow, wrap it in parentheses: `() => ({ name: \"Arpit\" })`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 6.1",
      "title": "Build a small toolkit",
      "blocks": [
        {
          "kind": "text",
          "text": "Write four functions: `isEven(n)`, `celsiusToF(c)`, `initials(fullName)`, and `clamp(value, min, max)` which returns the value pinned inside the range. Give `clamp` sensible defaults of 0 and 100."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const isEven = n => n % 2 === 0;\n\nconst celsiusToF = c => c * 9 / 5 + 32;\n\nconst initials = fullName =>\n  fullName.trim().split(/\\s+/).map(w => w[0].toUpperCase()).join(\"\");\n\n// Math.min/Math.max is the idiomatic clamp — no ifs needed\nconst clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);\n\nconsole.log(isEven(4), isEven(7));\nconsole.log(celsiusToF(100));\nconsole.log(initials(\"  ada  lovelace king \"));\nconsole.log(clamp(150), clamp(-20), clamp(5, 1, 10));",
              "label": "solution-6-1.js"
            },
            {
              "kind": "text",
              "text": "`/\\\\s+/` is a regular expression meaning \"one or more whitespace characters\" — it makes `split` survive double spaces. Reading `clamp`: `Math.max(value, min)` raises anything below the floor, then `Math.min(..., max)` lowers anything above the ceiling.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Challenge 6.2",
      "title": "A function factory",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `makeCounter()` that returns a function. Each call to that returned function should return the next number, starting at 1. Two counters made separately must not interfere with each other."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function makeCounter() {\n  let count = 0;                 // private to this call of makeCounter\n  return function () {\n    count += 1;\n    return count;\n  };\n}\n\nconst a = makeCounter();\nconst b = makeCounter();\n\nconsole.log(a(), a(), a()); // 1 2 3\nconsole.log(b());           // 1  — b has its OWN count\nconsole.log(a());           // 4",
              "label": "solution-6-2.js"
            },
            {
              "kind": "text",
              "text": "Each call to `makeCounter` creates a fresh `count` and a fresh inner function that closes over it. That's a closure, and you just wrote one before the chapter on closures — which is the right order. Module 11 will explain the machinery.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q6",
      "title": "Function declaration vs function expression vs arrow function",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A *declaration* (`function f(){}`) is hoisted whole, so it can be called above its definition, and it creates a binding with the function's name. An *expression* (`const f = function(){}`) is assigned at runtime — the variable is hoisted but in the temporal dead zone, so calling it early throws a `ReferenceError`."
        },
        {
          "kind": "text",
          "text": "An *arrow function* is an expression with three further differences that matter: it has no own `this` (it uses the enclosing lexical `this`), no `arguments` object, and cannot be used with `new` — it has no `[[Construct]]` internal method. It also can't be a generator. Those properties make arrows ideal as callbacks (no more `const self = this`) and unsuitable as object methods, prototype methods, or constructors."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "**Number guessing game (console only).** Generate a secret number 1–100. In a loop, \"guess\" the midpoint of the remaining range, log whether it's too high or too low, and narrow the range until it's found. Print the number of guesses. Requirements: at least three functions, no `var`, and a `const` for anything that doesn't change. This exercises every idea in Level 1 — and the binary-search logic is itself a common interview warm-up."
        }
      ],
      "title": "Mini-project · End of Level 1"
    }
  ]
};
