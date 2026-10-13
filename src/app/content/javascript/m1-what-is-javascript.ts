import { Lesson } from '../../shared/content';

export const M1_WHAT_IS_JAVASCRIPT: Lesson = {
  "slug": "m1-what-is-javascript",
  "title": "M1 What JavaScript is, and your first output",
  "nav": "What JavaScript is",
  "num": "M1",
  "eyebrow": "Level 0 · ~1 session",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 0 · Week 1 · Ground",
      "blocks": [
        {
          "kind": "text",
          "text": "Before syntax: what this language is, where it runs, and how to see what your code did."
        }
      ]
    },
    {
      "kind": "text",
      "text": "JavaScript is a language that runs *inside* something else. In a browser, it runs in a tab and can change the page you're looking at. On a server, it runs in **Node.js** and can read files or answer web requests. The language is the same in both places; what differs is the toolbox around it."
    },
    {
      "kind": "text",
      "text": "Three names that get confused constantly:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**JavaScript** — the language.",
        "**ECMAScript (ES)** — the official specification the language is defined by. \"ES6\" (2015) was the huge modernising release; everything since is a yearly increment. When people say \"modern JavaScript\" they mean ES6 and later.",
        "**Java** — an unrelated language. The name was 1995 marketing. Do not mention them in the same breath in an interview."
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Getting output"
    },
    {
      "kind": "text",
      "text": "You cannot learn a language you can't observe. `console.log()` is how you observe JavaScript — it prints a value to the developer console. You will type it thousands of times."
    },
    {
      "kind": "example",
      "code": "// Anything after two slashes is a comment — JavaScript ignores it.\nconsole.log(\"Hello, JavaScript\");\n\n/* A block comment\n   spans multiple lines. */\n\n// console.log takes as many values as you like, separated by commas:\nconsole.log(\"2 + 2 is\", 2 + 2);\n\n// It prints any kind of value, not just text:\nconsole.log(true, [1, 2, 3], { name: \"Arpit\" }, null);",
      "label": "first.js"
    },
    {
      "kind": "text",
      "text": "Line by line: line 2 prints a piece of text (a *string* — note the quotes). Line 8 prints a string and then the *result* of `2 + 2`, because JavaScript evaluates the expression before printing it — it prints `4`, not `\"2 + 2\"`. Line 11 shows that a log can carry values of completely different kinds."
    },
    {
      "kind": "text",
      "text": "Statements usually end with a semicolon. JavaScript will insert them for you if you forget, but that mechanism has sharp edges, so the habit worth building is: **always type the semicolon**."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "**1. Curly quotes.** If you copy code from a blog or a word processor you may get `“smart quotes”`, which are not string quotes. Retype them in your editor. **2. Case sensitivity.** `console.Log` is not `console.log`; `myName` is not `myname`. **3. Looking in the wrong place.** Output goes to the browser's *Console* tab, not onto the page."
        }
      ],
      "title": "Trap · The three things beginners get wrong on day one"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 1.1",
      "title": "Warm up",
      "blocks": [
        {
          "kind": "text",
          "text": "In your own `app.js`: print your name, then print the result of `7 * 6`, then print both on one line with the label `\"answer:\"`. Finally, write a comment above each line explaining what it does."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// Print my name as a string\nconsole.log(\"Arpit\");\n\n// Print the result of a calculation — JS evaluates it first\nconsole.log(7 * 6);\n\n// Two values in one call: a label and a computed number\nconsole.log(\"answer:\", 7 * 6);",
              "label": "solution-1-1.js"
            },
            {
              "kind": "text",
              "text": "If `console.log(7 * 6)` printed `42` and not `7 * 6`, you've understood the key idea: JavaScript evaluates expressions down to a single value before doing anything with them.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q1",
      "title": "What is the difference between JavaScript and ECMAScript?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** ECMAScript is the standardised specification, maintained by TC39, that defines how the language must behave. JavaScript is the implementation of that spec that we actually write — running in engines like V8 (Chrome, Node), SpiderMonkey (Firefox) and JavaScriptCore (Safari). New features go through a five-stage TC39 proposal process before landing in a yearly ECMAScript release. \"ES6\" or \"ES2015\" is the release that introduced `let`/`const`, arrow functions, classes, promises, template literals, destructuring and modules."
        },
        {
          "kind": "text",
          "text": "**Why they ask:** it separates people who learned the language from people who learned one tutorial.",
          "style": "small"
        }
      ]
    }
  ]
};
