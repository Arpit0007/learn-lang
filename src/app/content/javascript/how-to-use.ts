import { Lesson } from '../../shared/content';

export const HOW_TO_USE: Lesson = {
  "slug": "how-to-use",
  "title": "How to use this course",
  "eyebrow": "A 14-week course · zero experience assumed",
  "blocks": [
    {
      "kind": "text",
      "text": "Thirty modules from `console.log(\"hi\")` to the event loop, closures, testing and the questions interviewers actually ask. Every example in this course runs — press **Run**, change the code, run it again.",
      "style": "lede"
    },
    {
      "kind": "table",
      "head": [
        "Pace",
        "Length",
        "Modules",
        "Ends with"
      ],
      "rows": [
        [
          "1–2 hours a day",
          "14 weeks · 98 days",
          "30 across 7 levels",
          "9 portfolio projects"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "This is a course, not a reference. Work down it in order. Each module follows the same shape, so you always know where you are:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**The idea** — plain-language explanation, no jargon until the jargon is earned.",
        "**Runnable code** — press *Run* to see the output. Press *Edit*, break it deliberately, run it again. Breaking things on purpose is the fastest way to learn what a rule actually means.",
        "**Traps** — the specific mistakes beginners make here, and the fix.",
        "**Exercises** — try before opening the solution. Opening it early feels productive and teaches nothing.",
        "**Interview** — the question a real interviewer asks about this topic, with a model answer."
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Type the examples out yourself in your own editor. Reading code creates recognition; typing code creates recall. Interviews test recall."
        }
      ],
      "title": "The one rule"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Your setup, in five minutes"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "Install **Google Chrome** (or Edge/Firefox) and **VS Code** — both free.",
        "In Chrome, press `F12` (or `Cmd+Option+J` on Mac) to open the **Console**. You can type JavaScript straight into it.",
        "Make a folder `js-course`. Inside it create two files: `index.html` and `app.js`.",
        "Put this in `index.html`, then open the file in your browser and check the Console.",
        "In VS Code, install the **Live Server** extension so the page reloads when you save."
      ]
    },
    {
      "kind": "example",
      "code": "<!doctype html>\n<html>\n  <head><meta charset=\"utf-8\"><title>JS Course</title></head>\n  <body>\n    <h1>Hello</h1>\n    <!-- defer = run after the HTML is parsed. Always use it. -->\n    <script src=\"app.js\" defer></script>\n  </body>\n</html>",
      "lang": "html",
      "label": "index.html",
      "run": "none"
    },
    {
      "kind": "text",
      "text": "In `app.js`, write `console.log(\"it works\");` and reload. If you see it in the Console, your whole toolchain is working. That is genuinely all the setup this course needs for the first nine modules.",
      "style": "small"
    }
  ]
};
