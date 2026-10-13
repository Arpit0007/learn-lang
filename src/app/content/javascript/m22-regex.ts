import { Lesson } from '../../shared/content';

export const M22_REGEX: Lesson = {
  "slug": "m22-regex",
  "title": "M22 Regular expressions",
  "nav": "Regular expressions",
  "num": "M22",
  "eyebrow": "Level 7 · read after Module 4 (Week 5) · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "A regex is a pattern for matching text. They look like line noise, and you only need about eight pieces of syntax to handle 90% of real work — validation, extraction, search-and-replace, splitting on messy delimiters."
    },
    {
      "kind": "table",
      "head": [
        "Piece",
        "Means",
        "Piece",
        "Means"
      ],
      "rows": [
        [
          "`\\\\d \\\\w \\\\s`",
          "digit · word char · whitespace",
          "`+ * ?`",
          "1+ · 0+ · 0 or 1"
        ],
        [
          "`\\\\D \\\\W \\\\S`",
          "the negation of each",
          "`{2,4}`",
          "between 2 and 4 times"
        ],
        [
          "`[abc]` `[^abc]`",
          "any of · none of",
          "`^ $`",
          "start · end of string"
        ],
        [
          "`.`",
          "any character except newline",
          "`( )`",
          "capture group"
        ],
        [
          "`a|b`",
          "a or b",
          "`\\\\b`",
          "word boundary"
        ],
        [
          "`g i m`",
          "flags: all matches · ignore case · multiline",
          "`\\\\.`",
          "a literal dot (escaped)"
        ]
      ]
    },
    {
      "kind": "example",
      "code": "// Two ways to make one. Use a literal unless the pattern is built at runtime.\nconst literal = /\\d+/g;\nconst dynamic = new RegExp(\"\\\\d+\", \"g\");   // note the doubled backslashes\n\nconst text = \"Order 1234 shipped on 2026-03-14, order 5678 is pending.\";\n\n// test -> boolean\nconsole.log(/^Order/.test(text));\n\n// match with /g -> all matches as strings\nconsole.log(text.match(/\\d+/g));\n\n// matchAll -> full match objects, including capture groups and index\nfor (const m of text.matchAll(/(\\d{4})-(\\d{2})-(\\d{2})/g)) {\n  console.log(\"full:\", m[0], \"year:\", m[1], \"at index\", m.index);\n}\n\n// Named groups make the result readable — always worth it\nconst dateRe = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\nconst { groups } = text.match(dateRe);\nconsole.log(groups.day + \"/\" + groups.month + \"/\" + groups.year);\n\n// replace with a capture reference, then with a function\nconsole.log(\"2026-03-14\".replace(dateRe, \"$<day>-$<month>-$<year>\"));\nconsole.log(text.replace(/\\d+/g, digits => `#${digits}`));\n\n// split on messy separators\nconsole.log(\"a, b;c |  d\".split(/\\s*[,;|]\\s*/));",
      "label": "regex-basics.js"
    },
    {
      "kind": "example",
      "code": "// A slug maker — the one you'll actually reuse\nconst slugify = s => s\n  .toLowerCase()\n  .trim()\n  .replace(/[^\\w\\s-]/g, \"\")     // drop punctuation\n  .replace(/[\\s_-]+/g, \"-\")     // runs of space/underscore/dash -> one dash\n  .replace(/^-+|-+$/g, \"\");     // trim dashes from both ends\nconsole.log(slugify(\"  Hello, JavaScript World! (v2) \"));\n\n// Pull structured data out of free text\nconst log = \"GET /api/users 200 34ms\\nPOST /api/login 401 12ms\";\nconst lineRe = /^(?<method>GET|POST)\\s(?<path>\\S+)\\s(?<status>\\d{3})\\s(?<ms>\\d+)ms$/gm;\nconsole.log([...log.matchAll(lineRe)].map(m => m.groups));\n\n// Basic validation. Note: \"good enough\", not \"provably correct\"\nconst looksLikeEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;\nconsole.log(looksLikeEmail.test(\"arpit@example.com\"), looksLikeEmail.test(\"nope@\"));\n\nconst indianMobile = /^(?:\\+91[-\\s]?)?[6-9]\\d{9}$/;\nconsole.log(indianMobile.test(\"+91 9876543210\"), indianMobile.test(\"12345\"));\n\n// Greedy vs lazy — the single most common regex bug\nconst html = \"<b>bold</b> and <i>italic</i>\";\nconsole.log(html.match(/<.+>/)[0]);    // greedy: swallows everything\nconsole.log(html.match(/<.+?>/)[0]);   // lazy: stops at the first >",
      "label": "regex-practical.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "**1.** A `/g` regex kept in a variable has a `lastIndex` that persists between `test` calls, so alternating calls return alternating answers — create it fresh, or don't use `/g` with `test`. **2.** Forgetting to escape `.`, `?`, `+`, `(` when you mean them literally. **3.** Nested quantifiers like `(a+)+` can backtrack catastrophically and hang the page on hostile input. **4.** Parsing HTML or JSON with regex — use `DOMParser` and `JSON.parse`. And validate emails by sending one, not by writing a 400-character pattern."
        }
      ],
      "title": "Trap · Four regex mistakes"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 22.1",
      "title": "Three small patterns",
      "blocks": [
        {
          "kind": "text",
          "text": "Write regexes that: (a) find every hashtag in a tweet, (b) mask all but the last four digits of any card-like number, (c) collapse repeated whitespace and trim."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const tweet = \"Shipping #javascript and #webdev today — card 4111 1111 1111 1234   ok\";\n\n// (a) hashtags: # then one or more word characters\nconsole.log(tweet.match(/#\\w+/g));\n\n// (b) mask all but the last 4 digits of a 13-16 digit group (spaces allowed)\nconst masked = tweet.replace(/\\b(?:\\d[ -]?){9,12}(\\d{4})\\b/g, \"**** **** **** $1\");\nconsole.log(masked);\n\n// (c) collapse whitespace\nconsole.log(tweet.replace(/\\s+/g, \" \").trim());",
              "label": "solution-22-1.js"
            },
            {
              "kind": "text",
              "text": "Test regexes on real, messy input — regex101.com shows exactly what each token matched and is the fastest way to learn.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q49",
      "title": "What's the difference between `match`, `matchAll`, `exec` and `test`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `test` returns a boolean. `String.prototype.match` without `/g` returns one match object with capture groups and `index`; *with* `/g` it returns a plain array of matched strings and discards the groups — which is why `matchAll` exists: it yields every full match object as an iterator. `RegExp.prototype.exec` returns one match at a time and, with `/g`, advances `lastIndex` so it can be called in a loop."
        },
        {
          "kind": "text",
          "text": "The gotcha to mention: `lastIndex` is state on the regex object, so a `/g` regex stored in a module-level constant gives alternating results across `test` calls. Also worth naming: catastrophic backtracking as a denial-of-service risk on user-supplied patterns."
        }
      ]
    }
  ]
};
