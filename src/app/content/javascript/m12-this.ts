import { Lesson } from '../../shared/content';

export const M12_THIS: Lesson = {
  "slug": "m12-this",
  "title": "M12 `this`, call, apply and bind",
  "nav": "this, call, bind",
  "num": "M12",
  "eyebrow": "Level 4 · Week 9 · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "`this` is decided by **how a function is called**, not where it's written. That one sentence resolves almost every `this` confusion. Work down these rules in order — the first that applies wins."
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**`new`** — `this` is the brand-new object being constructed.",
        "**Explicit** — `fn.call(obj)`, `fn.apply(obj)`, `fn.bind(obj)`: `this` is `obj`.",
        "**Method call** — `obj.fn()`: `this` is whatever is left of the dot.",
        "**Plain call** — `fn()`: `this` is `undefined` in strict mode / modules, or the global object otherwise.",
        "**Arrow functions** — no own `this` at all; they use the `this` of the surrounding code, decided when the arrow was *written*."
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "`this` is not \"the object the function belongs to\" — functions don't belong to anything. It's \"who was holding the function at the moment it was called\". Look immediately to the left of the dot at the *call site*: `user.greet()` has `user` on the left, so `this` is `user`. Pull the same function out into a variable and call it alone, and there's nothing to the left any more."
        }
      ],
      "title": "In plain words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 640 380\" role=\"img\" aria-label=\"Decision flow for what this refers to: arrow function, new, call apply bind, method call, or plain call\">\n  <defs><marker id=\"arT\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <rect class=\"box\" x=\"20\" y=\"16\" width=\"250\" height=\"42\" rx=\"6\"></rect><text x=\"145\" y=\"42\" text-anchor=\"middle\">Is it an arrow function?</text>\n  <rect class=\"acc\" x=\"340\" y=\"16\" width=\"280\" height=\"42\" rx=\"6\"></rect><text class=\"accT\" x=\"480\" y=\"42\" text-anchor=\"middle\">this from the surrounding code</text>\n  <line class=\"ln\" x1=\"274\" y1=\"37\" x2=\"336\" y2=\"37\" marker-end=\"url(#arT)\"></line>\n  <rect class=\"box\" x=\"20\" y=\"86\" width=\"250\" height=\"42\" rx=\"6\"></rect><text x=\"145\" y=\"112\" text-anchor=\"middle\">Called with new?</text>\n  <rect class=\"acc\" x=\"340\" y=\"86\" width=\"280\" height=\"42\" rx=\"6\"></rect><text class=\"accT\" x=\"480\" y=\"112\" text-anchor=\"middle\">this = the brand-new object</text>\n  <line class=\"ln\" x1=\"274\" y1=\"107\" x2=\"336\" y2=\"107\" marker-end=\"url(#arT)\"></line>\n  <rect class=\"box\" x=\"20\" y=\"156\" width=\"250\" height=\"42\" rx=\"6\"></rect><text x=\"145\" y=\"182\" text-anchor=\"middle\">call / apply / bind?</text>\n  <rect class=\"acc\" x=\"340\" y=\"156\" width=\"280\" height=\"42\" rx=\"6\"></rect><text class=\"accT\" x=\"480\" y=\"182\" text-anchor=\"middle\">this = the object you passed</text>\n  <line class=\"ln\" x1=\"274\" y1=\"177\" x2=\"336\" y2=\"177\" marker-end=\"url(#arT)\"></line>\n  <rect class=\"box\" x=\"20\" y=\"226\" width=\"250\" height=\"42\" rx=\"6\"></rect><text x=\"145\" y=\"252\" text-anchor=\"middle\">Called as obj.method()?</text>\n  <rect class=\"acc\" x=\"340\" y=\"226\" width=\"280\" height=\"42\" rx=\"6\"></rect><text class=\"accT\" x=\"480\" y=\"252\" text-anchor=\"middle\">this = obj — left of the dot</text>\n  <line class=\"ln\" x1=\"274\" y1=\"247\" x2=\"336\" y2=\"247\" marker-end=\"url(#arT)\"></line>\n  <rect class=\"bad\" x=\"20\" y=\"300\" width=\"250\" height=\"52\" rx=\"6\"></rect>\n  <text x=\"145\" y=\"322\" text-anchor=\"middle\">Plain call: fn()</text>\n  <text class=\"mut\" x=\"145\" y=\"340\" text-anchor=\"middle\">undefined (strict) or globalThis</text>\n  <line class=\"ln\" x1=\"145\" y1=\"62\" x2=\"145\" y2=\"82\" marker-end=\"url(#arT)\"></line>\n  <line class=\"ln\" x1=\"145\" y1=\"132\" x2=\"145\" y2=\"152\" marker-end=\"url(#arT)\"></line>\n  <line class=\"ln\" x1=\"145\" y1=\"202\" x2=\"145\" y2=\"222\" marker-end=\"url(#arT)\"></line>\n  <line class=\"ln\" x1=\"145\" y1=\"272\" x2=\"145\" y2=\"296\" marker-end=\"url(#arT)\"></line>\n  <text class=\"mut\" x=\"152\" y=\"76\">no</text>\n  <text class=\"mut\" x=\"152\" y=\"146\">no</text>\n  <text class=\"mut\" x=\"152\" y=\"216\">no</text>\n  <text class=\"mut\" x=\"152\" y=\"288\">no</text>\n  <text class=\"mut\" x=\"286\" y=\"30\">yes</text>\n  <text class=\"mut\" x=\"286\" y=\"100\">yes</text>\n  <text class=\"mut\" x=\"286\" y=\"170\">yes</text>\n  <text class=\"mut\" x=\"286\" y=\"240\">yes</text>\n  <text class=\"mut\" x=\"340\" y=\"322\">This is the case that breaks detached</text>\n  <text class=\"mut\" x=\"340\" y=\"340\">methods passed as callbacks.</text>\n</svg>",
      "caption": "**Read the call, not the definition.** Work down the list and stop at the first \"yes\" — that is the whole rule for `this`. Nothing about where the function was written matters, except for arrow functions, which is exactly why they behave differently."
    },
    {
      "kind": "example",
      "code": "const user = {\n  name: \"Arpit\",\n  greet() { return `Hi, ${this.name}`; },       // rule 3: `this` is `user`\n};\nconsole.log(user.greet());\n\n// Rule 4 — the classic bug. Detach the method and `this` is lost:\nconst detached = user.greet;\nconsole.log(detached());          // \"Hi, undefined\" (non-strict) or a TypeError\n\n// Rule 2 — repair it explicitly:\nconsole.log(detached.call(user));            // borrow `this`\nconsole.log(detached.apply(user));           // same, args as an array\nconst bound = detached.bind(user);           // returns a NEW permanently-bound fn\nconsole.log(bound());\n\n// call vs apply — only the argument style differs:\nfunction intro(greeting, mark) { return `${greeting}, ${this.name}${mark}`; }\nconsole.log(intro.call(user, \"Hello\", \"!\"));\nconsole.log(intro.apply(user, [\"Hello\", \"?\"]));\n\n// Rule 5 — an arrow as a method looks right and is wrong:\nconst broken = {\n  name: \"Nina\",\n  greet: () => `Hi, ${this?.name}`,   // `this` came from OUTSIDE the object\n};\nconsole.log(broken.greet());          // \"Hi, undefined\"",
      "label": "this-rules.js"
    },
    {
      "kind": "example",
      "code": "const timer = {\n  label: \"build\",\n  seconds: 0,\n\n  // BROKEN: a regular function callback gets its own `this`\n  startBroken() {\n    setTimeout(function () {\n      console.log(\"broken:\", this?.label);   // undefined\n    }, 0);\n  },\n\n  // FIXED: an arrow inherits `this` from startFixed\n  startFixed() {\n    setTimeout(() => {\n      console.log(\"fixed:\", this.label);     // \"build\"\n    }, 0);\n  },\n};\n\ntimer.startBroken();\ntimer.startFixed();\n\n// The same issue with array methods — every one takes an optional thisArg:\nconst counter = {\n  total: 0,\n  addAll(nums) {\n    nums.forEach(function (n) { this.total += n; }, this); // <- thisArg\n    return this.total;\n  },\n};\nconsole.log(counter.addAll([1, 2, 3]));   // 6",
      "label": "this-callbacks.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`button.addEventListener(\"click\", obj.handleClick)` loses `this`, because the method is called as a plain function by the browser. Fix it with `obj.handleClick.bind(obj)`, or wrap it: `() => obj.handleClick()`. In classes, binding in the constructor or using a class field arrow (`handleClick = () => {}`) solves it permanently."
        }
      ],
      "title": "Trap · Passing a method as a callback"
    },
    {
      "kind": "quiz",
      "question": "Inside a DOM event listener written as a regular `function`, what is `this`?",
      "options": [
        "The window object",
        "The element the listener is attached to",
        "The element that was clicked",
        "undefined"
      ],
      "answer": 1,
      "why": "**The element the listener is attached to** — same as `event.currentTarget`, not `event.target`. Note that an *arrow* listener does not get this behaviour: it keeps the surrounding `this`, which is one reason to prefer `event.currentTarget` over `this` in handlers."
    },
    {
      "kind": "reveal",
      "tag": "Challenge 12.1",
      "title": "Implement `bind` yourself",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `Function.prototype.myBind`. It should return a new function that calls the original with a fixed `this`, supports arguments given at bind time and at call time, and works with `new`. A genuine senior-level question."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "Function.prototype.myBind = function (context, ...boundArgs) {\n  const targetFn = this;                       // the function myBind was called on\n  if (typeof targetFn !== \"function\") {\n    throw new TypeError(\"myBind must be called on a function\");\n  }\n\n  function bound(...callArgs) {\n    // If called with `new`, ignore `context` and use the fresh object:\n    const isNew = this instanceof bound;\n    return targetFn.apply(isNew ? this : context, [...boundArgs, ...callArgs]);\n  }\n\n  bound.prototype = Object.create(targetFn.prototype || null); // keep instanceof working\n  return bound;\n};\n\nfunction greet(greeting, mark) { return `${greeting}, ${this.name}${mark}`; }\nconst user = { name: \"Arpit\" };\n\nconst hi = greet.myBind(user, \"Hi\");   // partial application\nconsole.log(hi(\"!\"));                  // \"Hi, Arpit!\"\n\nfunction Point(x, y) { this.x = x; this.y = y; }\nconst OriginPoint = Point.myBind(null, 0);\nconst p = new OriginPoint(5);\nconsole.log(p.x, p.y, p instanceof Point);   // 0 5 true",
              "label": "solution-12-1.js"
            },
            {
              "kind": "text",
              "text": "Two things separate a good answer from a great one: handling *partial application* (arguments split across bind time and call time) and handling `new` correctly, where the bound `this` must be ignored.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q12",
      "title": "Difference between `call`, `apply` and `bind`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** All three set `this` for a function. `call(thisArg, a, b)` invokes immediately with individual arguments; `apply(thisArg, [a, b])` invokes immediately with an array; `bind(thisArg, a)` invokes nothing — it returns a new function permanently bound to that `this`, with any supplied arguments pre-filled (partial application). A bound function's `this` cannot be re-bound afterwards, though `new` overrides it."
        },
        {
          "kind": "text",
          "text": "Since ES6, spread has made `apply` largely redundant — `fn(...args)` — so `apply`'s remaining niche is array-borrowing tricks like `Math.max.apply(null, arr)`. Arrow functions ignore all three for `this` purposes, because they have no own binding to set."
        }
      ]
    }
  ]
};
