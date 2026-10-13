import { Lesson } from '../../shared/content';

export const M5_CONTROL_FLOW: Lesson = {
  "slug": "m5-control-flow",
  "title": "M5 Control flow: decisions and loops",
  "nav": "Control flow",
  "num": "M5",
  "eyebrow": "Level 1 · Week 2 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "So far your programs run straight down the page. Control flow lets them branch and repeat — which is where they start to be useful."
    },
    {
      "kind": "example",
      "code": "const score = 72;\n\nif (score >= 90) {\n  console.log(\"A\");\n} else if (score >= 75) {\n  console.log(\"B\");\n} else if (score >= 60) {\n  console.log(\"C\");     // this one runs — order matters, first match wins\n} else {\n  console.log(\"F\");\n}\n\n// The ternary: a compact if/else that produces a VALUE\nconst status = score >= 60 ? \"pass\" : \"fail\";\nconsole.log(status);\n\n// switch compares with === and needs `break` on every case\nconst day = 6;\nswitch (day) {\n  case 6:\n  case 7:\n    console.log(\"weekend\");  // cases fall through until a break\n    break;\n  default:\n    console.log(\"weekday\");\n}",
      "label": "conditions.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Without `break`, a `switch` keeps executing into the following cases — occasionally useful (as above, where 6 and 7 share a body), usually a bug. And in a condition, `if (x = 5)` *assigns* 5 and is always truthy; you meant `if (x === 5)`. Both are caught instantly by a linter, which is one reason to install ESLint early."
        }
      ],
      "title": "Trap · The missing `break`, and the accidental `=`"
    },
    {
      "kind": "example",
      "code": "// The classic for loop: start; keep going while; do after each pass\nfor (let i = 1; i <= 3; i++) {\n  console.log(\"pass\", i);\n}\n\n// for...of — iterate VALUES. This is the one you'll use most.\nconst fruits = [\"apple\", \"banana\", \"cherry\"];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\n// with the index too:\nfor (const [i, fruit] of fruits.entries()) {\n  console.log(i, fruit);\n}\n\n// for...in — iterates KEYS. Use it for objects, not arrays.\nconst user = { name: \"Arpit\", role: \"dev\" };\nfor (const key in user) {\n  console.log(key, \"=\", user[key]);\n}\n\n// while — when you don't know the number of passes up front\nlet countdown = 3;\nwhile (countdown > 0) {\n  console.log(countdown);\n  countdown--;    // forget this line and the tab freezes forever\n}\n\n// break stops the loop; continue skips to the next pass\nfor (const n of [1, 2, 3, 4, 5, 6]) {\n  if (n % 2 !== 0) continue;  // skip odd numbers\n  if (n > 4) break;           // stop entirely\n  console.log(\"even:\", n);\n}",
      "label": "loops.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "It gives you index *strings* (`\"0\"`, `\"1\"`) and will also walk inherited enumerable properties. Use `for...of` for arrays, `for...in` for plain objects — or better, `Object.entries()`, which you'll meet in Module 8."
        }
      ],
      "title": "Trap · `for...in` on an array"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 5.1",
      "title": "FizzBuzz",
      "blocks": [
        {
          "kind": "text",
          "text": "The traditional first interview question. Print 1 to 20, but: multiples of 3 print `Fizz`, multiples of 5 print `Buzz`, multiples of both print `FizzBuzz`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "for (let i = 1; i <= 20; i++) {\n  // Check the MOST specific condition first — 15 is divisible by 3 and 5,\n  // so if you check `i % 3` first, 15 prints \"Fizz\" and you never reach here.\n  if (i % 15 === 0) console.log(\"FizzBuzz\");\n  else if (i % 3 === 0) console.log(\"Fizz\");\n  else if (i % 5 === 0) console.log(\"Buzz\");\n  else console.log(i);\n}",
              "label": "solution-5-1.js"
            },
            {
              "kind": "text",
              "text": "The point of FizzBuzz isn't the modulo — it's whether you order your conditions correctly. A cleaner variant builds a string: `let out = \"\"; if (i%3===0) out += \"Fizz\"; if (i%5===0) out += \"Buzz\"; console.log(out || i);` — note the `||` falling back to the number when the string is empty.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 5.2",
      "title": "Sum, count and find",
      "blocks": [
        {
          "kind": "text",
          "text": "Given `const nums = [4, 11, 7, 20, 3, 15]`: print the total, the count of numbers over 10, and the largest — using loops only, no array methods."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const nums = [4, 11, 7, 20, 3, 15];\n\nlet total = 0;\nlet over10 = 0;\nlet largest = nums[0];   // start from a real value, NOT 0 —\n                         // starting at 0 breaks for all-negative arrays\n\nfor (const n of nums) {\n  total += n;\n  if (n > 10) over10++;\n  if (n > largest) largest = n;\n}\n\nconsole.log(\"total:\", total);     // 60\nconsole.log(\"over 10:\", over10);  // 3\nconsole.log(\"largest:\", largest); // 20",
              "label": "solution-5-2.js"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q5",
      "title": "Difference between `for...of` and `for...in`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `for...in` iterates over enumerable *string keys*, including ones inherited through the prototype chain — designed for objects. `for...of` iterates over *values* of anything iterable: arrays, strings, `Map`, `Set`, `NodeList`, generators — anything implementing `Symbol.iterator`. Plain objects are not iterable, so `for...of` on one throws; use `Object.keys/values/entries` instead. On arrays, `for...in` hands you index strings rather than numbers and has no guaranteed order for non-index keys, so it's the wrong tool there."
        }
      ]
    }
  ]
};
