import { Lesson } from '../../shared/content';

export const M9_DOM: Lesson = {
  "slug": "m9-dom",
  "title": "M9 The DOM: reading and changing the page",
  "nav": "The DOM",
  "num": "M9",
  "eyebrow": "Level 3 · Week 6 · ~4 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 3 · Weeks 6–7 · The browser",
      "blocks": [
        {
          "kind": "text",
          "text": "Where JavaScript becomes visible. Two modules: changing the page, and reacting to the user. Everything here is arrays, objects and callbacks applied to a document — which is why it comes after Level 2 and not before."
        },
        {
          "kind": "callout",
          "tone": "key",
          "blocks": [
            {
              "kind": "text",
              "text": "The examples below run against a small sandbox rather than this whole page, so a variable named `root` stands in for `document`. Everything you learn transfers exactly: in your own project, write `document.querySelector(...)` wherever these write `root.querySelector(...)`."
            }
          ],
          "title": "About the demos in this level"
        }
      ]
    },
    {
      "kind": "text",
      "text": "When a browser loads HTML it builds an in-memory tree of objects called the **DOM** (Document Object Model). Each tag becomes a node you can inspect and change from JavaScript, and any change is reflected on screen immediately. The DOM is not part of the JavaScript language — it's an API the browser hands you."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Selecting elements"
    },
    {
      "kind": "text",
      "text": "Two methods cover 95% of real work. Both take a CSS selector, so everything you know from CSS applies."
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 720 290\" role=\"img\" aria-label=\"The browser turns HTML into a tree of nodes: document, html, head and body, and their children\">\n  <line class=\"ln\" x1=\"310\" y1=\"44\" x2=\"310\" y2=\"74\"></line>\n  <path class=\"ln\" d=\"M310 102 L310 117 M190 117 L430 117 M190 117 L190 132 M430 117 L430 132\"></path>\n  <path class=\"ln\" d=\"M190 160 L190 190 M430 160 L430 175 M350 175 L480 175 M350 175 L350 190 M480 175 L480 190\"></path>\n  <path class=\"ln\" d=\"M480 218 L480 231 M440 231 L530 231 M440 231 L440 246 M530 231 L530 246\"></path>\n  <rect class=\"box\" x=\"255\" y=\"16\" width=\"110\" height=\"28\" rx=\"4\"></rect><text x=\"310\" y=\"35\" text-anchor=\"middle\">document</text>\n  <rect class=\"box\" x=\"268\" y=\"74\" width=\"84\" height=\"28\" rx=\"4\"></rect><text x=\"310\" y=\"93\" text-anchor=\"middle\">html</text>\n  <rect class=\"box\" x=\"148\" y=\"132\" width=\"84\" height=\"28\" rx=\"4\"></rect><text x=\"190\" y=\"151\" text-anchor=\"middle\">head</text>\n  <rect class=\"box\" x=\"388\" y=\"132\" width=\"84\" height=\"28\" rx=\"4\"></rect><text x=\"430\" y=\"151\" text-anchor=\"middle\">body</text>\n  <rect class=\"box\" x=\"148\" y=\"190\" width=\"84\" height=\"28\" rx=\"4\"></rect><text x=\"190\" y=\"209\" text-anchor=\"middle\">title</text>\n  <rect class=\"box\" x=\"308\" y=\"190\" width=\"84\" height=\"28\" rx=\"4\"></rect><text x=\"350\" y=\"209\" text-anchor=\"middle\">h1</text>\n  <rect class=\"acc\" x=\"438\" y=\"190\" width=\"84\" height=\"28\" rx=\"4\"></rect><text x=\"480\" y=\"209\" text-anchor=\"middle\">ul</text>\n  <rect class=\"box\" x=\"402\" y=\"246\" width=\"76\" height=\"28\" rx=\"4\"></rect><text x=\"440\" y=\"265\" text-anchor=\"middle\">li</text>\n  <rect class=\"box\" x=\"492\" y=\"246\" width=\"76\" height=\"28\" rx=\"4\"></rect><text x=\"530\" y=\"265\" text-anchor=\"middle\">li</text>\n  <text class=\"mut\" x=\"10\" y=\"35\">every tag</text>\n  <text class=\"mut\" x=\"10\" y=\"52\">becomes</text>\n  <text class=\"mut\" x=\"10\" y=\"69\">one node</text>\n  <text class=\"accT\" x=\"552\" y=\"209\">querySelector(\"ul\")</text>\n  <text class=\"mut\" x=\"552\" y=\"226\">finds this node</text>\n</svg>",
      "caption": "**The DOM is a tree, not text.** The browser parses your HTML once into these objects; from then on, JavaScript changes the *objects* and the screen follows. Parents contain children, which is what makes `closest()` and event bubbling work."
    },
    {
      "kind": "example",
      "code": "// querySelector -> the FIRST match, or null\nconst title = root.querySelector(\"#title\");\nconsole.log(title.textContent);\n\n// querySelectorAll -> a NodeList of ALL matches (array-like, not an array)\nconst notes = root.querySelectorAll(\".note\");\nconsole.log(notes.length);\nnotes.forEach(n => console.log(n.textContent));\n\n// To use map/filter/reduce, convert it to a real array first:\nconst texts = [...notes].map(n => n.textContent.toUpperCase());\nconsole.log(texts);\n\n// Selectors are full CSS:\nconsole.log(root.querySelector(\"div.card > p.note:last-of-type\").textContent);\n\n// A missing element returns null — always the cause of\n// \"Cannot read properties of null\"\nconsole.log(root.querySelector(\"#nope\"));",
      "label": "select.js",
      "demoHtml": "<div class=\"card\" data-id=\"7\">\n  <h4 id=\"title\">Original title</h4>\n  <p class=\"note\">First note</p>\n  <p class=\"note\">Second note</p>\n  <button class=\"go\">Click me</button>\n</div>"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Your HTML file is just text sitting on disk. When the browser opens it, it builds a living copy in memory shaped like a family tree — page, then body, then the lists and buttons inside. JavaScript never edits your file; it edits that living tree, and the screen redraws itself."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "const title = root.querySelector(\"#title\");\n\n// Text content — safe, and what you want almost always\ntitle.textContent = \"Changed from JavaScript\";\n\n// innerHTML parses HTML. Powerful, and a security risk with user input.\nroot.querySelector(\"#out\").innerHTML = \"with <strong>markup</strong>\";\n\n// Attributes\nconst link = root.querySelector(\"#link\");\nlink.setAttribute(\"href\", \"https://developer.mozilla.org\");\nlink.textContent = \"MDN\";\nconsole.log(link.getAttribute(\"href\"));\n\n// Classes — the right way to change appearance\ntitle.classList.add(\"highlight\");\ntitle.classList.toggle(\"compact\");        // add if absent, remove if present\nconsole.log(title.classList.contains(\"highlight\"));\n\n// Inline styles — use sparingly; prefer classes\ntitle.style.color = \"crimson\";\ntitle.style.fontStyle = \"italic\";         // CSS font-style -> camelCase\n\n// data-* attributes, for stashing values on an element\ntitle.dataset.userId = \"42\";\nconsole.log(title.dataset.userId);",
      "label": "change.js",
      "demoHtml": "<div class=\"card\">\n  <h4 id=\"title\">Original title</h4>\n  <p id=\"out\">…</p>\n  <a id=\"link\" href=\"#\">a link</a>\n</div>"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Assigning user input to `innerHTML` lets an attacker inject `<img src=x onerror=\"...\">` and run their code in your page — a cross-site scripting (XSS) hole. Rule: **use `textContent` for text**, and build elements with `createElement` when you need structure. Only use `innerHTML` with markup you wrote yourself."
        }
      ],
      "title": "Trap · `innerHTML` with anything a user typed"
    },
    {
      "kind": "example",
      "code": "const list = root.querySelector(\"#list\");\n\n// The four steps: create, fill, configure, attach\nconst li = document.createElement(\"li\");\nli.textContent = \"Added from JS\";\nli.classList.add(\"new\");\nlist.append(li);                      // append at the end\nlist.prepend(Object.assign(document.createElement(\"li\"),\n                           { textContent: \"Added at the top\" }));\n\n// Building many nodes: assemble in a fragment, attach ONCE.\n// Each attach can trigger layout work, so one attach beats twenty.\nconst fragment = document.createDocumentFragment();\nfor (const name of [\"Ravi\", \"Nina\", \"Omar\"]) {\n  const item = document.createElement(\"li\");\n  item.textContent = name;\n  fragment.append(item);\n}\nlist.append(fragment);\n\n// Reading the tree\nconsole.log(list.firstElementChild.textContent);\nconsole.log(list.lastElementChild.textContent);\nconsole.log(li.parentElement.tagName);   // \"UL\"\n\n// Removing — after this, li.parentElement is null\nlist.querySelector(\".new\").remove();\nconsole.log(list.children.length, \"items now\");",
      "label": "create.js",
      "demoHtml": "<ul id=\"list\"><li>Existing item</li></ul>"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 9.1",
      "title": "Render a list from data",
      "blocks": [
        {
          "kind": "text",
          "text": "Given `const tasks = [{text:\"Buy milk\", done:true}, {text:\"Write code\", done:false}]`, render one `<li>` per task into `#list`. Completed tasks get the class `done`. Use `createElement`, not `innerHTML`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const tasks = [\n  { text: \"Buy milk\", done: true },\n  { text: \"Write code\", done: false },\n  { text: \"Ship it\", done: false },\n];\n\nconst list = root.querySelector(\"#list\");\nlist.replaceChildren();                 // clear whatever was there\n\nconst frag = document.createDocumentFragment();\nfor (const task of tasks) {\n  const li = document.createElement(\"li\");\n  li.textContent = task.text;           // textContent: safe with any text\n  if (task.done) li.classList.add(\"done\");\n  li.dataset.done = task.done;          // handy for later filtering\n  frag.append(li);\n}\nlist.append(frag);\n\nconsole.log(list.querySelectorAll(\"li.done\").length, \"done\");\nconsole.log(list.innerHTML);",
              "label": "solution-9-1.js",
              "demoHtml": "<ul id=\"list\"></ul>"
            },
            {
              "kind": "text",
              "text": "`replaceChildren()` with no arguments is the modern one-liner for \"empty this element\" — clearer and safer than `el.innerHTML = \"\"`.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q9",
      "title": "`innerHTML` vs `textContent` vs `innerText`",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `textContent` gets or sets the raw text of a node and all descendants, ignoring CSS; setting it escapes everything, so it's XSS-safe and fast. `innerText` is layout-aware — it reflects what's visually rendered, skips `display:none` content and normalises whitespace, which means reading it forces a reflow and is slower. `innerHTML` serialises or parses HTML: assigning to it destroys and rebuilds the subtree (losing event listeners attached to the old nodes) and executes any markup you hand it, so it must never receive untrusted input."
        },
        {
          "kind": "text",
          "text": "Default to `textContent`; reach for `innerText` only when you specifically need the visible text; use `innerHTML` only for markup you authored."
        }
      ]
    }
  ]
};
