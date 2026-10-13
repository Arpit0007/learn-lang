import { Lesson } from '../../shared/content';

export const M10_EVENTS: Lesson = {
  "slug": "m10-events",
  "title": "M10 Events",
  "nav": "Events",
  "num": "M10",
  "eyebrow": "Level 3 · Week 7 · ~4 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "An event is something that happens — a click, a keypress, a form submission, a page finishing loading. You register a function to run when it happens; the browser calls it back. This is the callback pattern you met in Module 6, now doing real work."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "You don't keep asking the browser \"has anyone clicked yet?\". You leave a note: \"when this button is clicked, run this function.\" Then you walk away. The browser taps you on the shoulder when it actually happens."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "const btn = root.querySelector(\"#btn\");\nconst out = root.querySelector(\"#count\");\nlet clicks = 0;\n\n// addEventListener(type, callback). The callback receives an event object.\nbtn.addEventListener(\"click\", (event) => {\n  clicks++;\n  out.textContent = clicks;\n  console.log(\"clicked\", clicks, \"target:\", event.target.id);\n});\n\n// Typing\nroot.querySelector(\"#field\").addEventListener(\"input\", (e) => {\n  console.log(\"value is now:\", e.target.value);\n});\n\n// Removing a listener requires the SAME function reference:\nfunction onKey(e) { console.log(\"key:\", e.key); }\nroot.querySelector(\"#field\").addEventListener(\"keydown\", onKey);\n// root.querySelector(\"#field\").removeEventListener(\"keydown\", onKey);\n\n// Press the button in the sandbox above, then type in the field.\nconsole.log(\"listeners attached — now interact with the demo above\");",
      "label": "events.js",
      "demoHtml": "<div class=\"card\">\n  <button id=\"btn\">Press me</button>\n  <span id=\"count\">0</span> clicks\n  <input id=\"field\" placeholder=\"type here\">\n</div>"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Bubbling and delegation"
    },
    {
      "kind": "text",
      "text": "When you click a button inside a list item inside a list, the event fires on the button and then travels *up* through every ancestor. That's **bubbling**. It sounds like trivia, but it enables the most useful pattern in DOM programming: attach *one* listener to the container instead of one per child."
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 720 330\" role=\"img\" aria-label=\"A click on a button travels upward through li, ul, div and document; one listener on the ul catches every click\">\n  <defs><marker id=\"arF4\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <rect class=\"box\" x=\"20\" y=\"20\" width=\"420\" height=\"270\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"32\" y=\"38\">document</text>\n  <rect class=\"box\" x=\"48\" y=\"54\" width=\"364\" height=\"206\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"60\" y=\"72\">div#app</text>\n  <rect class=\"acc\" x=\"76\" y=\"88\" width=\"308\" height=\"142\" rx=\"6\"></rect>\n  <text class=\"accT\" x=\"88\" y=\"106\">ul#list</text>\n  <rect class=\"box\" x=\"104\" y=\"122\" width=\"252\" height=\"88\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"116\" y=\"140\">li</text>\n  <rect class=\"box\" x=\"132\" y=\"152\" width=\"140\" height=\"42\" rx=\"5\"></rect>\n  <text x=\"202\" y=\"178\" text-anchor=\"middle\">button.del</text>\n  <circle class=\"accT\" cx=\"286\" cy=\"173\" r=\"5\"></circle>\n  <text class=\"accT\" x=\"298\" y=\"178\">click</text>\n  <line class=\"lnA\" x1=\"470\" y1=\"250\" x2=\"470\" y2=\"44\" marker-end=\"url(#arF4)\"></line>\n  <text class=\"accT\" x=\"482\" y=\"248\">1 · button</text>\n  <text class=\"mut\" x=\"482\" y=\"206\">2 · li</text>\n  <text class=\"accT\" x=\"482\" y=\"164\">3 · ul ← listener here</text>\n  <text class=\"mut\" x=\"482\" y=\"122\">4 · div</text>\n  <text class=\"mut\" x=\"482\" y=\"80\">5 · document</text>\n  <text class=\"mut\" x=\"482\" y=\"44\">…then window</text>\n  <text class=\"mut\" x=\"20\" y=\"308\">event.target = the button that was clicked</text>\n  <text class=\"mut\" x=\"20\" y=\"324\">event.currentTarget = the ul the listener sits on</text>\n  <circle class=\"mv mv-ring ringA\" cx=\"286\" cy=\"173\" r=\"8\"></circle>\n  <circle class=\"mv mv-rise dotA\" cx=\"470\" cy=\"250\" r=\"5\"></circle>\n</svg>",
      "caption": "**Bubbling is why delegation works.** The click starts at the deepest element and travels outward through every ancestor, so a single listener on the `ul` hears every button inside it — including buttons added after the listener was attached.",
      "animated": true
    },
    {
      "kind": "example",
      "code": "const listEl = root.querySelector(\"#todos\");\n\n// ONE listener for every current AND future button.\nlistEl.addEventListener(\"click\", (event) => {\n  // event.target is what was actually clicked.\n  // closest() walks up from it looking for a match.\n  const deleteBtn = event.target.closest(\".del\");\n  if (!deleteBtn) return;            // clicked somewhere else — ignore\n\n  const item = deleteBtn.closest(\"li\");\n  console.log(\"removing:\", item.textContent.trim());\n  item.remove();\n});\n\n// Prove it handles items added later:\nconst li = document.createElement(\"li\");\nli.innerHTML = 'Added later <button class=\"del\">×</button>';\nlistEl.append(li);\n\nconsole.log(\"click any × in the sandbox above\");",
      "label": "delegation.js",
      "demoHtml": "<ul id=\"todos\">\n  <li>Buy milk <button class=\"del\">×</button></li>\n  <li>Write code <button class=\"del\">×</button></li>\n  <li>Ship it <button class=\"del\">×</button></li>\n</ul>"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Without it, every newly created element needs its own listener, and you must remember to remove listeners when elements are deleted or you leak memory. One listener on a stable parent solves both problems and is what every framework does internally. Interviewers ask about it constantly."
        }
      ],
      "title": "Why delegation matters"
    },
    {
      "kind": "example",
      "code": "const form = root.querySelector(\"#signup\");\nconst msg = root.querySelector(\"#msg\");\n\nform.addEventListener(\"submit\", (event) => {\n  // Without this the browser reloads the page and your JS never finishes.\n  event.preventDefault();\n\n  const data = Object.fromEntries(new FormData(form));  // all fields at once\n  console.log(data);\n\n  const errors = [];\n  if (!data.email.includes(\"@\")) errors.push(\"Email looks wrong\");\n  if (Number(data.age) < 18) errors.push(\"Must be 18 or older\");\n\n  msg.textContent = errors.length ? errors.join(\" · \") : \"Welcome!\";\n  console.log(errors.length ? errors : \"valid\");\n});\n\nconsole.log(\"fill in the form above and submit\");",
      "label": "forms.js",
      "demoHtml": "<form id=\"signup\" class=\"card\">\n  <input name=\"email\" placeholder=\"you@example.com\">\n  <input name=\"age\" type=\"number\" placeholder=\"age\">\n  <button type=\"submit\">Sign up</button>\n  <p id=\"msg\"></p>\n</form>"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "**1.** Forgetting `event.preventDefault()` on a form submit — the page reloads and it looks like nothing happened. **2.** Confusing `event.target` (what was clicked) with `event.currentTarget` (what the listener is attached to). **3.** Writing `btn.addEventListener(\"click\", handleClick())` — the parentheses call it immediately and register its return value. Drop them."
        }
      ],
      "title": "Trap · Three event mistakes that cost hours"
    },
    {
      "kind": "quiz",
      "question": "You have 500 rows, each with a delete button, and rows are added dynamically. What's the right listener strategy?",
      "options": [
        "One listener on the container, using event.target.closest()",
        "500 listeners, re-attached whenever a row is added",
        "A listener on window, checking coordinates",
        "Inline onclick attributes in the HTML"
      ],
      "answer": 0,
      "why": "**Event delegation.** One listener on the stable parent handles all present and future rows, uses a fraction of the memory, and needs no cleanup when rows are removed. Inline `onclick` attributes mix markup with behaviour and only allow one handler per element."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 10.1",
      "title": "Live search filter",
      "blocks": [
        {
          "kind": "text",
          "text": "Given a search input and a list, hide list items that don't contain the typed text, case-insensitively. Show a count of visible items."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const input = root.querySelector(\"#q\");\nconst items = [...root.querySelectorAll(\"#items li\")];   // real array, once\nconst count = root.querySelector(\"#count\");\n\nfunction applyFilter() {\n  const term = input.value.trim().toLowerCase();\n  let visible = 0;\n\n  for (const li of items) {\n    const match = li.textContent.toLowerCase().includes(term);\n    li.hidden = !match;        // `hidden` is cleaner than style.display\n    if (match) visible++;\n  }\n  count.textContent = `${visible} of ${items.length} shown`;\n}\n\ninput.addEventListener(\"input\", applyFilter);\napplyFilter();                 // run once so the count is right at load\n\nconsole.log(\"type in the box above\");",
              "label": "solution-10-1.js",
              "demoHtml": "<div class=\"card\">\n  <input id=\"q\" placeholder=\"search…\">\n  <p id=\"count\"></p>\n  <ul id=\"items\">\n    <li>Bengaluru</li><li>Mumbai</li><li>Delhi</li><li>Chennai</li><li>Kolkata</li>\n  </ul>\n</div>"
            },
            {
              "kind": "text",
              "text": "Two details worth stealing: the node list is converted to an array *once*, outside the handler, instead of re-querying the DOM on every keystroke; and the filter function is called immediately so the initial state is correct rather than blank.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q10",
      "title": "Explain event bubbling, capturing and delegation",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A dispatched event travels in three phases: *capturing* from `window` down to the target, the *target* phase, then *bubbling* back up. Listeners run in the bubbling phase by default; pass `{ capture: true }` to run on the way down."
        },
        {
          "kind": "text",
          "text": "*Delegation* exploits bubbling: attach one listener to a common ancestor and identify the real source with `event.target.closest(selector)`. It handles dynamically added elements for free and cuts memory use dramatically."
        },
        {
          "kind": "text",
          "text": "Related: `stopPropagation()` halts further travel, `preventDefault()` cancels the browser's default action (they are independent), and a few events — `focus`, `blur`, `scroll` on an element — don't bubble, though `focusin`/`focusout` do."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "**To-do list** (add, complete, delete, filter, persist to `localStorage`) and **expense tracker** (form validation, running totals, category breakdown). Between them they use every idea in Levels 1–3. Build them without a tutorial; look up individual methods as needed. This is the transition from \"following along\" to \"developing\", and it's where most people's confidence actually arrives."
        }
      ],
      "title": "Projects 2 & 3 · End of Level 3"
    }
  ]
};
