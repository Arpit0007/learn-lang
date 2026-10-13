import { Lesson } from '../../shared/content';

export const M4_STRINGS_NUMBERS: Lesson = {
  "slug": "m4-strings-numbers",
  "title": "M4 Strings and numbers in practice",
  "nav": "Strings & numbers",
  "num": "M4",
  "eyebrow": "Level 1 · Week 2 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "You will spend more time formatting text and rounding numbers than writing clever algorithms. This module is the toolbox."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Template literals"
    },
    {
      "kind": "text",
      "text": "Backticks instead of quotes. They interpolate values with `${...}` and span multiple lines. Use them by default — string concatenation with `+` is noisy and error-prone."
    },
    {
      "kind": "example",
      "code": "const name = \"Arpit\";\nconst items = 3;\n\n// The old way\nconsole.log(\"Hi \" + name + \", you have \" + items + \" items.\");\n\n// The modern way — a template literal\nconsole.log(`Hi ${name}, you have ${items} items.`);\n\n// Any expression works inside ${ }\nconsole.log(`Next year you'd have ${items * 2} items.`);\n\n// Multi-line, exactly as typed\nconsole.log(`Dear ${name},\n  Thanks for signing up.\n  — The team`);",
      "label": "strings.js"
    },
    {
      "kind": "example",
      "code": "const s = \"  JavaScript Ladder  \";\n\nconsole.log(s.length);              // 21 (spaces count)\nconsole.log(s.trim());              // \"JavaScript Ladder\"\nconsole.log(s.trim().toUpperCase());// \"JAVASCRIPT LADDER\"\nconsole.log(s.includes(\"Script\"));  // true\nconsole.log(s.trim().startsWith(\"Java\")); // true\nconsole.log(s.indexOf(\"Ladder\"));   // 13  (-1 would mean \"not found\")\nconsole.log(s.trim().slice(0, 4));  // \"Java\"  (start, end-exclusive)\nconsole.log(s.trim().slice(-6));    // \"Ladder\" (negative counts from the end)\nconsole.log(s.replace(\"Ladder\", \"Course\").trim());\nconsole.log(\"a,b,c\".split(\",\"));    // [\"a\",\"b\",\"c\"]\nconsole.log([\"a\",\"b\"].join(\"-\"));   // \"a-b\"\nconsole.log(\"ab\".repeat(3));        // \"ababab\"\nconsole.log(\"7\".padStart(3, \"0\"));  // \"007\"\n\n// Strings are IMMUTABLE — every method returns a NEW string:\nlet t = \"hello\";\nt.toUpperCase();\nconsole.log(t); // still \"hello\" — the result was thrown away",
      "label": "string-methods.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`myString.trim();` on its own does nothing observable. You need `myString = myString.trim();` or to use the returned value. This is true of every string method — strings cannot be modified in place, ever."
        }
      ],
      "title": "Trap · Forgetting that string methods return new values"
    },
    {
      "kind": "example",
      "code": "// Converting text to numbers\nconsole.log(Number(\"42\"));      // 42\nconsole.log(Number(\"42px\"));    // NaN\nconsole.log(parseInt(\"42px\"));  // 42   -> reads until it can't\nconsole.log(parseFloat(\"3.9kg\"));// 3.9\nconsole.log(Number(\"\"));        // 0    <- careful!\n\n// Rounding\nconsole.log(Math.round(2.5), Math.floor(2.9), Math.ceil(2.1)); // 3 2 3\nconsole.log((3.14159).toFixed(2));      // \"3.14\"  <- a STRING, not a number\nconsole.log(Number((3.14159).toFixed(2))); // 3.14\n\n// Useful Math\nconsole.log(Math.max(3, 9, 2), Math.min(3, 9, 2));\nconsole.log(Math.abs(-7));\nconsole.log(Math.floor(Math.random() * 6) + 1); // a die roll, 1-6\n\n// The floating point problem\nconsole.log(0.1 + 0.2);          // 0.30000000000000004\nconsole.log((0.1 + 0.2).toFixed(2)); // \"0.30\"\n// For money, work in the smallest unit (paise/cents) as integers.\n\n// Formatting for humans\nconsole.log(new Intl.NumberFormat(\"en-IN\", {\n  style: \"currency\", currency: \"INR\"\n}).format(1234567.891));",
      "label": "numbers.js"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 4.1",
      "title": "Format a receipt line",
      "blocks": [
        {
          "kind": "text",
          "text": "Given `const product = \" wireless mouse \"`, `const qty = 3` and `const price = 799.5`, print exactly: `WIRELESS MOUSE x3 — ₹2398.50`"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const product = \"  wireless mouse \";\nconst qty = 3;\nconst price = 799.5;\n\nconst label = product.trim().toUpperCase();\nconst total = (qty * price).toFixed(2); // \"2398.50\" — keeps the trailing zero\n\nconsole.log(`${label} x${qty} — ₹${total}`);",
              "label": "solution-4-1.js"
            },
            {
              "kind": "text",
              "text": "Note why `toFixed(2)` is right here: `2398.5` printed raw would show one decimal place. `toFixed` returns a string, which is exactly what you want for display — but never for further arithmetic.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 4.2",
      "title": "Initials",
      "blocks": [
        {
          "kind": "text",
          "text": "Write code that turns `\"ada lovelace king\"` into `\"A.L.K.\"` — split, take first letters, uppercase, join."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const full = \"ada lovelace king\";\n\nconst initials = full\n  .split(\" \")                    // [\"ada\",\"lovelace\",\"king\"]\n  .map(word => word[0])          // [\"a\",\"l\",\"k\"]  — [0] is the first character\n  .join(\".\")                     // \"a.l.k\"\n  .toUpperCase() + \".\";          // \"A.L.K.\"\n\nconsole.log(initials);",
              "label": "solution-4-2.js"
            },
            {
              "kind": "text",
              "text": "`map` arrives properly in Module 7 — this is a preview so you recognise it. Read it as \"make a new array by running this function on each item\".",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q4",
      "title": "Why is `0.1 + 0.2 !== 0.3`, and what do you do about it?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** JavaScript numbers are IEEE-754 64-bit binary floating point. `0.1` and `0.2` have no exact finite representation in base 2, just as 1⁄3 has none in base 10, so each is stored slightly off and the error accumulates to `0.30000000000000004`."
        },
        {
          "kind": "text",
          "text": "Fixes, in order of preference: (1) for money and any exact arithmetic, store integers in the smallest unit — paise, cents — and divide only when displaying; (2) compare with an epsilon, `Math.abs(a - b) < Number.EPSILON`; (3) round for display with `toFixed` or `Intl.NumberFormat`. Also worth mentioning: integers stay exact only up to `Number.MAX_SAFE_INTEGER` (253−1); beyond that use `BigInt`."
        }
      ]
    }
  ]
};
