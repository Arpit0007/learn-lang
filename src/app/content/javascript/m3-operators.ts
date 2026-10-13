import { Lesson } from '../../shared/content';

export const M3_OPERATORS: Lesson = {
  "slug": "m3-operators",
  "title": "M3 Operators, comparison and coercion",
  "nav": "Operators & coercion",
  "num": "M3",
  "eyebrow": "Level 1 · Week 1 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Operators combine values. Most are unsurprising; the interesting part of this module is what happens when you combine values of *different* types, because JavaScript will quietly convert one for you. That conversion is called **coercion**, and it is the source of the language's most famous weirdness."
    },
    {
      "kind": "example",
      "code": "// Arithmetic\nconsole.log(7 + 3, 7 - 3, 7 * 3, 7 / 3);\nconsole.log(7 % 3);   // remainder (\"modulo\") -> 1\nconsole.log(2 ** 10); // exponent -> 1024\n\n// Shorthand assignment\nlet n = 10;\nn += 5;  // n = n + 5\nn *= 2;  // n = n * 2\nconsole.log(n); // 30\n\n// Increment: ++n returns the NEW value, n++ returns the OLD one\nlet i = 5;\nconsole.log(i++); // 5  (then i becomes 6)\nconsole.log(++i); // 7",
      "label": "operators.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Coercion: the `+` problem"
    },
    {
      "kind": "text",
      "text": "`+` does double duty — numeric addition and string concatenation. If *either* side is a string, JavaScript turns the other side into a string and joins them. Every other arithmetic operator goes the opposite way and converts to numbers."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "JavaScript tries to be helpful. Mix a word and a number and it quietly turns one into the other so the line still runs. `\"5\" + 3` gives `\"53\"` because `+` also glues text together. `\"5\" - 3` gives `2` because minus only makes sense for numbers. That guessing is exactly why we use `===` — it never guesses."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "console.log(\"5\" + 3);   // \"53\"  -> + saw a string, so it concatenated\nconsole.log(\"5\" - 3);   // 2     -> - has no string meaning, so it converted\nconsole.log(\"5\" * \"2\"); // 10\nconsole.log(1 + 2 + \"3\"); // \"33\" -> left to right: 1+2=3, then 3+\"3\"=\"33\"\nconsole.log(\"1\" + 2 + 3); // \"123\" -> left to right: \"1\"+2=\"12\", then \"123\"\n\nconsole.log(true + 1);  // 2      -> true becomes 1\nconsole.log([] + {});   // \"[object Object]\"\nconsole.log(null + 1);  // 1      -> null becomes 0\nconsole.log(undefined + 1); // NaN -> undefined becomes NaN",
      "label": "coercion.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Always use `===`"
    },
    {
      "kind": "text",
      "text": "`==` compares after coercing the two sides to a common type. `===` compares type *and* value, with no conversion. Loose equality produces results nobody can reliably predict, so professional codebases ban it."
    },
    {
      "kind": "example",
      "code": "console.log(5 == \"5\");    // true   -> \"5\" coerced to 5\nconsole.log(5 === \"5\");   // false  -> different types, done.\n\nconsole.log(0 == false);       // true\nconsole.log(\"\" == false);      // true\nconsole.log(null == undefined);// true\nconsole.log(null === undefined);// false\nconsole.log(NaN == NaN);       // false! NaN is equal to nothing, including itself\n\n// The one legitimate use of ==, if you like it:\n//   value == null  is true for BOTH null and undefined.\nconst v = undefined;\nconsole.log(v == null);  // true  — a compact \"is it nothing?\" check\n\n// Detecting NaN properly:\nconsole.log(Number.isNaN(NaN));  // true",
      "label": "equality.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Truthy and falsy"
    },
    {
      "kind": "text",
      "text": "Every value becomes `true` or `false` when used in a condition. Memorise the falsy list — it is short, and everything not on it is truthy."
    },
    {
      "kind": "text",
      "text": "**The eight falsy values:** `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`. That's it. `\"0\"`, `\"false\"`, `[]` and `{}` are all **truthy**."
    },
    {
      "kind": "example",
      "code": "if ([]) console.log(\"an empty array is truthy\");\nif ({}) console.log(\"an empty object is truthy\");\nif (\"0\") console.log(\"the string '0' is truthy\");\nif (!0) console.log(\"the number 0 is falsy\");\n\n// Logical operators return VALUES, not just true/false:\nconsole.log(\"a\" || \"b\");   // \"a\"  -> || returns the first truthy value\nconsole.log(null || \"b\");  // \"b\"\nconsole.log(\"a\" && \"b\");   // \"b\"  -> && returns the last value if all truthy\nconsole.log(0 && \"b\");     // 0    -> short-circuits on the first falsy\n\n// ?? (nullish coalescing) only falls back for null/undefined:\nconst count = 0;\nconsole.log(count || 10);  // 10  <- WRONG: 0 is falsy, so it fell back\nconsole.log(count ?? 10);  // 0   <- RIGHT: 0 is a real value",
      "label": "truthiness.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`const pageSize = input || 20;` looks fine until someone passes `0`, or `\"\"`, or `false` — all legitimate values that get silently replaced by the default. Use `??` whenever the fallback should only apply to `null` and `undefined`. This exact bug ships to production constantly."
        }
      ],
      "title": "Trap · `||` for default values"
    },
    {
      "kind": "quiz",
      "question": "What does `[] == false` evaluate to?",
      "options": [
        "false — an array is an object, objects are truthy",
        "true",
        "It throws",
        "undefined"
      ],
      "answer": 1,
      "why": "**true.** `==` coerces: `false` becomes `0`, and `[]` becomes the primitive `\"\"`, which becomes `0`. So `0 == 0`. Meanwhile `if ([])` is *truthy*, because that path uses `ToBoolean`, not `==`. Two different conversion rules — which is precisely why you use `===`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 3.1",
      "title": "Predict the output",
      "blocks": [
        {
          "kind": "text",
          "text": "Write your predictions down first. All eight lines."
        },
        {
          "kind": "example",
          "code": "console.log(\"10\" - \"4\" - \"3\" - 2 + \"5\");\nconsole.log(typeof (1 + \"1\"));\nconsole.log(3 > 2 > 1);\nconsole.log(0.1 + 0.2 === 0.3);\nconsole.log([] + []);\nconsole.log(!!\"false\");\nconsole.log(null >= 0);\nconsole.log(null > 0);",
          "label": "predict-3-1.js"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": true,
              "items": [
                "`\"15\"` — subtraction converts to numbers: 10−4−3−2 = 1, then `+ \"5\"` concatenates.",
                "`\"string\"` — `1 + \"1\"` is `\"11\"`.",
                "`false` — evaluates left to right: `3 > 2` is `true`, then `true > 1` becomes `1 > 1`, false.",
                "`false` — binary floating point. `0.1 + 0.2` is `0.30000000000000004`. Compare with a tolerance instead.",
                "`\"\"` — both arrays become empty strings, joined.",
                "`true` — a non-empty string is truthy; `!!` just converts to boolean.",
                "`true` — `>=` is a relational operator, so `null` converts to `0`.",
                "`false` — `0 > 0` is false. Lines 7 and 8 together are the classic \"JavaScript is weird\" demo: `null` is `>= 0` but not `> 0` and not `== 0`."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q3",
      "title": "Explain `==` vs `===`, and when `==` is acceptable",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `===` is strict equality: if the types differ the answer is `false`, otherwise values are compared directly. `==` applies the abstract equality algorithm first, coercing operands toward a common type — number-vs-string converts the string to a number, boolean converts to number, and object-vs-primitive calls `valueOf`/`toString` on the object. The results are hard to predict (`\"\" == 0`, `[] == 0`, `\"0\" == false` are all true), so the default is `===`."
        },
        {
          "kind": "text",
          "text": "The one idiom worth keeping is `x == null`, which is true for exactly `null` and `undefined` and nothing else — a concise nullish check. Note also that both operators say `NaN` is not equal to `NaN`, and both compare objects by reference, not by contents."
        }
      ]
    }
  ]
};
