import { Lesson } from '../../shared/content';

export const M2_VALUES_VARIABLES_TYPES: Lesson = {
  "slug": "m2-values-variables-types",
  "title": "M2 Values, variables and types",
  "nav": "Values & types",
  "num": "M2",
  "eyebrow": "Level 1 · Week 1 · ~3 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 1 · Weeks 1–3 · Fundamentals",
      "blocks": [
        {
          "kind": "text",
          "text": "Values, types, operators, control flow and functions. Five modules that everything else in the course is built out of. Go slowly here; it pays back with interest in Level 4."
        }
      ]
    },
    {
      "kind": "text",
      "text": "A **value** is a piece of data: the number `42`, the text `\"hello\"`, the truth-value `true`. A **variable** is a name you attach to a value so you can refer to it later. Declaring one has two parts — the keyword, then the name."
    },
    {
      "kind": "example",
      "code": "let score = 10;        // a value that will change later\nconst name = \"Arpit\";  // a name bound to a value that will not be re-bound\nscore = score + 5;     // fine: `let` allows re-assignment\nconsole.log(name, score);\n\n// const does NOT mean \"frozen\". It means \"cannot be re-assigned\".\nconst user = { plan: \"free\" };\nuser.plan = \"pro\";     // allowed — we changed what's INSIDE the object\nconsole.log(user);\n\n// user = {} would throw: TypeError: Assignment to constant variable.",
      "label": "variables.js"
    },
    {
      "kind": "text",
      "text": "**The rule to adopt now:** use `const` by default. Switch to `let` only when you know the variable must be re-assigned. Never use `var` — Module 11 explains exactly why, but the short version is that `var` ignores block boundaries and leaks in ways that cause real bugs."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The eight types"
    },
    {
      "kind": "text",
      "text": "JavaScript has seven **primitive** types plus objects. Primitives are simple, immutable values; objects are collections."
    },
    {
      "kind": "table",
      "head": [
        "Type",
        "Example",
        "What it's for"
      ],
      "rows": [
        [
          "`string`",
          "`\"hi\"`, `'hi'`, `\\`hi\\``",
          "Text of any length."
        ],
        [
          "`number`",
          "`42`, `3.14`, `-0.5`",
          "All numbers — there is no separate integer type."
        ],
        [
          "`boolean`",
          "`true`, `false`",
          "Yes/no, on/off, the result of every comparison."
        ],
        [
          "`undefined`",
          "`let x;`",
          "\"No value has been assigned yet.\" JavaScript's default."
        ],
        [
          "`null`",
          "`let x = null;`",
          "\"Deliberately empty.\" *You* set this, not the engine."
        ],
        [
          "`bigint`",
          "`9007199254740993n`",
          "Integers too large for `number`. Rare."
        ],
        [
          "`symbol`",
          "`Symbol(\"id\")`",
          "Guaranteed-unique keys. Rare in application code."
        ],
        [
          "`object`",
          "`{}`, `[]`, functions",
          "Everything with structure. Arrays and functions are objects."
        ]
      ]
    },
    {
      "kind": "example",
      "code": "console.log(typeof \"hi\");        // \"string\"\nconsole.log(typeof 42);          // \"number\"\nconsole.log(typeof true);        // \"boolean\"\nconsole.log(typeof undefined);   // \"undefined\"\nconsole.log(typeof {a: 1});      // \"object\"\nconsole.log(typeof [1, 2]);      // \"object\"  <- arrays are objects\nconsole.log(typeof function(){});// \"function\" <- special-cased\n\nconsole.log(typeof null);        // \"object\"  <- a famous 1995 bug, never fixed\n\n// How to actually detect an array:\nconsole.log(Array.isArray([1, 2]));  // true",
      "label": "typeof.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "They both mean \"nothing\", but they arrive differently. `undefined` is what JavaScript gives you: an unassigned variable, a missing object property, a function with no `return`. `null` is what *you* assign to say \"this is intentionally empty\". When you see `undefined` in a bug, ask \"what did I forget to set?\". When you see `null`, ask \"who set this to empty, and why?\"."
        }
      ],
      "title": "Trap · `undefined` vs `null`"
    },
    {
      "kind": "quiz",
      "question": "What does `typeof null` return?",
      "options": [
        "\"null\"",
        "\"undefined\"",
        "\"object\"",
        "It throws a TypeError"
      ],
      "answer": 2,
      "why": "**\"object\"** — a bug from the first version of JavaScript, where values were tagged by a type bit and `null` shared the object tag. Fixing it would break too much existing code on the web, so it stays. Interviewers love it as a five-second filter."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 2.1",
      "title": "Declare and inspect",
      "blocks": [
        {
          "kind": "text",
          "text": "Create a `const` for your city, a `let` for a temperature that you then change, and a variable that is deliberately `null`. Log each one along with its `typeof`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const city = \"Bengaluru\";\nlet tempC = 24;\nconst nextMeeting = null; // deliberately empty for now\n\ntempC = 27; // re-assignment: allowed because it's `let`\n\nconsole.log(city, typeof city);               // Bengaluru string\nconsole.log(tempC, typeof tempC);             // 27 number\nconsole.log(nextMeeting, typeof nextMeeting); // null object (the famous bug)",
              "label": "solution-2-1.js"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 2.2",
      "title": "Predict, then run",
      "blocks": [
        {
          "kind": "text",
          "text": "Write down what you think each line prints *before* running it. Then press Run."
        },
        {
          "kind": "example",
          "code": "let a;\nconsole.log(a);\n\nconst list = [1, 2, 3];\nlist.push(4);\nconsole.log(list);\n\nconsole.log(typeof typeof 42);",
          "label": "predict.js"
        },
        {
          "kind": "reveal",
          "tag": "Explanation",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "`undefined` — declared but never assigned. Then `[1, 2, 3, 4]` — `const` stops re-assignment of the *binding*, not mutation of the array. Then `\"string\"` — `typeof 42` produces the string `\"number\"`, and `typeof` of any string is `\"string\"`."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q2",
      "title": "`var` vs `let` vs `const`",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Three axes:"
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**Scope.** `var` is function-scoped — it escapes `if` and `for` blocks. `let` and `const` are block-scoped: they exist only between the nearest `{ }`.",
            "**Hoisting.** All three are hoisted, but `var` is initialised to `undefined`, so reading it early is silently allowed. `let`/`const` sit in the *temporal dead zone* until their declaration line, so reading them early throws a `ReferenceError` — a loud failure instead of a silent one.",
            "**Re-assignment and re-declaration.** `var` allows both. `let` allows re-assignment only. `const` allows neither — though the value it points at can still be mutated if it's an object or array."
          ]
        },
        {
          "kind": "text",
          "text": "In practice: `const` by default, `let` when you must re-assign, `var` never in new code."
        }
      ]
    }
  ]
};
