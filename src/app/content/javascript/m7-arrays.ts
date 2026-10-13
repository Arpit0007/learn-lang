import { Lesson } from '../../shared/content';

export const M7_ARRAYS: Lesson = {
  "slug": "m7-arrays",
  "title": "M7 Arrays and the methods that matter",
  "nav": "Arrays",
  "num": "M7",
  "eyebrow": "Level 2 · Week 4 · ~4 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 2 · Weeks 4–5 · Data shapes",
      "blocks": [
        {
          "kind": "text",
          "text": "Programs are lists of things and records about things. Arrays and objects are how you hold both — and the array methods you learn here are the ones you'll use every single day of your career."
        }
      ]
    },
    {
      "kind": "text",
      "text": "An array is an ordered list. Positions are numbered from **0**, which trips everyone up for about a week and then never again."
    },
    {
      "kind": "example",
      "code": "const langs = [\"JS\", \"Python\", \"Go\"];\n\nconsole.log(langs[0]);        // \"JS\"   — first item\nconsole.log(langs.length);    // 3\nconsole.log(langs[langs.length - 1]); // \"Go\" — last item, the old way\nconsole.log(langs.at(-1));    // \"Go\" — last item, the modern way\nconsole.log(langs[99]);       // undefined — no error, just nothing there\n\n// Adding and removing\nlangs.push(\"Rust\");     // add to the END      -> returns new length\nlangs.unshift(\"C\");     // add to the START\nconsole.log(langs);\n\nconst last = langs.pop();    // remove from the END, returns it\nconst first = langs.shift(); // remove from the START, returns it\nconsole.log(first, last, langs);\n\n// These four MUTATE the original array. slice does not:\nconsole.log(langs.slice(0, 2)); // a NEW array of the first two\nconsole.log(langs);             // unchanged\n\n// splice mutates: (startIndex, howManyToDelete, ...itemsToInsert)\nconst copy = [...langs];\ncopy.splice(1, 1, \"Ruby\", \"Elixir\");\nconsole.log(copy);",
      "label": "arrays-basics.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "One letter apart, opposite behaviour. `slice` *copies* a section and leaves the original alone. `splice` *surgically edits* the original in place. Mnemonic: splice has a **p** — it's **p**ermanent."
        }
      ],
      "title": "Trap · `slice` vs `splice`"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The big four: `forEach`, `map`, `filter`, `reduce`"
    },
    {
      "kind": "text",
      "text": "Each takes a *function* and runs it once per item. This is why functions came first. Learn these four properly and most loops disappear from your code."
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 680 250\" role=\"img\" aria-label=\"map keeps the array the same length, filter makes it shorter, reduce collapses it to one value\">\n  <defs><marker id=\"arF1\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <text class=\"lbl\" x=\"8\" y=\"50\">map</text>\n  <rect class=\"box\" x=\"90\" y=\"30\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"107\" y=\"50\" text-anchor=\"middle\">1</text>\n  <rect class=\"box\" x=\"130\" y=\"30\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"147\" y=\"50\" text-anchor=\"middle\">2</text>\n  <rect class=\"box\" x=\"170\" y=\"30\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"187\" y=\"50\" text-anchor=\"middle\">3</text>\n  <line class=\"ln\" x1=\"216\" y1=\"45\" x2=\"352\" y2=\"45\" marker-end=\"url(#arF1)\"></line>\n  <text class=\"accT\" x=\"284\" y=\"36\" text-anchor=\"middle\">n =&gt; n * 2</text>\n  <rect class=\"acc\" x=\"366\" y=\"30\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"383\" y=\"50\" text-anchor=\"middle\">2</text>\n  <rect class=\"acc\" x=\"406\" y=\"30\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"423\" y=\"50\" text-anchor=\"middle\">4</text>\n  <rect class=\"acc\" x=\"446\" y=\"30\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"463\" y=\"50\" text-anchor=\"middle\">6</text>\n  <text class=\"mut\" x=\"500\" y=\"50\">same length</text>\n  <text class=\"lbl\" x=\"8\" y=\"130\">filter</text>\n  <rect class=\"box\" x=\"90\" y=\"110\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"107\" y=\"130\" text-anchor=\"middle\">1</text>\n  <rect class=\"box\" x=\"130\" y=\"110\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"147\" y=\"130\" text-anchor=\"middle\">2</text>\n  <rect class=\"box\" x=\"170\" y=\"110\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"187\" y=\"130\" text-anchor=\"middle\">3</text>\n  <rect class=\"box\" x=\"210\" y=\"110\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"227\" y=\"130\" text-anchor=\"middle\">4</text>\n  <line class=\"ln\" x1=\"256\" y1=\"125\" x2=\"352\" y2=\"125\" marker-end=\"url(#arF1)\"></line>\n  <text class=\"accT\" x=\"304\" y=\"116\" text-anchor=\"middle\">n =&gt; n % 2 === 0</text>\n  <rect class=\"acc\" x=\"366\" y=\"110\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"383\" y=\"130\" text-anchor=\"middle\">2</text>\n  <rect class=\"acc\" x=\"406\" y=\"110\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"423\" y=\"130\" text-anchor=\"middle\">4</text>\n  <text class=\"mut\" x=\"500\" y=\"130\">shorter</text>\n  <text class=\"lbl\" x=\"8\" y=\"210\">reduce</text>\n  <rect class=\"box\" x=\"90\" y=\"190\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"107\" y=\"210\" text-anchor=\"middle\">1</text>\n  <rect class=\"box\" x=\"130\" y=\"190\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"147\" y=\"210\" text-anchor=\"middle\">2</text>\n  <rect class=\"box\" x=\"170\" y=\"190\" width=\"34\" height=\"30\" rx=\"4\"></rect><text x=\"187\" y=\"210\" text-anchor=\"middle\">3</text>\n  <line class=\"ln\" x1=\"216\" y1=\"205\" x2=\"352\" y2=\"205\" marker-end=\"url(#arF1)\"></line>\n  <text class=\"accT\" x=\"284\" y=\"196\" text-anchor=\"middle\">(sum, n) =&gt; sum + n</text>\n  <rect class=\"acc\" x=\"366\" y=\"190\" width=\"44\" height=\"30\" rx=\"4\"></rect><text x=\"388\" y=\"210\" text-anchor=\"middle\">6</text>\n  <text class=\"mut\" x=\"500\" y=\"210\">one value</text>\n  <circle class=\"mv mv-slide1 dotA\" cx=\"216\" cy=\"45\" r=\"4\"></circle>\n  <circle class=\"mv mv-slide2 dotA\" cx=\"256\" cy=\"125\" r=\"4\"></circle>\n  <circle class=\"mv mv-slide3 dotA\" cx=\"216\" cy=\"205\" r=\"4\"></circle>\n</svg>",
      "caption": "**Choose by the shape of what you want back.** `map` returns an array of the same length, `filter` a shorter one, `reduce` a single value of any type. That is the entire decision.",
      "animated": true
    },
    {
      "kind": "example",
      "code": "const prices = [120, 45, 300, 89, 210];\n\n// forEach — do something for each item. Returns undefined.\nprices.forEach((price, index) => {\n  console.log(`item ${index}: ₹${price}`);\n});\n\n// map — transform each item into a new one. Returns a NEW array of the SAME length.\nconst withTax = prices.map(price => Math.round(price * 1.18));\nconsole.log(withTax);\n\n// filter — keep the items whose test returns true. New array, SHORTER or equal.\nconst expensive = prices.filter(price => price > 100);\nconsole.log(expensive);\n\n// reduce — boil the whole array down to ONE value.\n// (accumulator, currentItem) => nextAccumulator , starting value\nconst total = prices.reduce((sum, price) => sum + price, 0);\nconsole.log(\"total:\", total);\n\n// find / findIndex — the FIRST match, or undefined / -1\nconsole.log(prices.find(p => p > 100));      // 120\nconsole.log(prices.findIndex(p => p > 100)); // 0\n\n// some / every — a boolean answer about the whole array\nconsole.log(prices.some(p => p > 250));   // true  — at least one\nconsole.log(prices.every(p => p > 40));   // true  — all of them\nconsole.log(prices.includes(45));          // true\n\n// They chain, because map and filter each return an array:\nconst bigWithTax = prices\n  .filter(p => p > 100)\n  .map(p => Math.round(p * 1.18))\n  .sort((a, b) => b - a);      // descending\nconsole.log(bigWithTax);",
      "label": "iteration.js"
    },
    {
      "kind": "text",
      "text": "**How to choose:** ask what you want *out*. A new array of the same length → `map`. A shorter array → `filter`. A single value → `reduce`. One item → `find`. A yes/no → `some`/`every`. Nothing (just side effects) → `forEach`, or better, a `for...of` loop."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Understanding `reduce`"
    },
    {
      "kind": "text",
      "text": "`reduce` confuses people because it does everything. Walk through it once, slowly:"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Think of counting notes in your hand. You start at zero, pick up each note, and add it to the total you are already holding. `reduce` is exactly that: the total in your hand is `acc`, the note is the current item, and whatever you return becomes what you are holding for the next one."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "const nums = [10, 20, 30];\n\nconst sum = nums.reduce((acc, current) => {\n  console.log(`acc=${acc}  current=${current}  ->  ${acc + current}`);\n  return acc + current;   // whatever you return becomes the next `acc`\n}, 0);                    // <- 0 is the STARTING acc\n\nconsole.log(\"sum:\", sum);\n\n// The accumulator doesn't have to be a number. Counting with an object:\nconst votes = [\"js\", \"py\", \"js\", \"go\", \"js\", \"py\"];\nconst tally = votes.reduce((acc, lang) => {\n  acc[lang] = (acc[lang] || 0) + 1;   // start at 0 the first time we see a lang\n  return acc;\n}, {});\nconsole.log(tally);   // { js: 3, py: 2, go: 1 }\n\n// Or an array — flattening:\nconst nested = [[1, 2], [3], [4, 5]];\nconsole.log(nested.reduce((acc, arr) => acc.concat(arr), []));\nconsole.log(nested.flat());   // the built-in way",
      "label": "reduce-explained.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "If your callback has curly braces, you must write `return`. Forget it and `map` gives you an array of `undefined`, and `reduce`'s accumulator becomes `undefined` on the second pass. Also: always pass the initial value to `reduce`. Without it, `reduce` on an empty array throws a `TypeError`."
        }
      ],
      "title": "Trap · Forgetting to `return` inside `reduce` or `map`"
    },
    {
      "kind": "example",
      "code": "// sort() with no argument converts to STRINGS and sorts alphabetically:\nconsole.log([10, 9, 100, 1].sort());   // [1, 10, 100, 9]  — almost never what you want\n\n// Always pass a comparator. Negative = a first, positive = b first.\nconsole.log([10, 9, 100, 1].sort((a, b) => a - b));  // ascending\nconsole.log([10, 9, 100, 1].sort((a, b) => b - a));  // descending\n\nconst people = [\n  { name: \"Zoe\", age: 31 },\n  { name: \"Ali\", age: 24 },\n  { name: \"Mira\", age: 45 },\n];\nconsole.log(people.sort((a, b) => a.age - b.age).map(p => p.name));\n\n// Strings:\nconsole.log([\"banana\", \"Apple\", \"cherry\"].sort((a, b) => a.localeCompare(b)));\n\n// sort MUTATES. To keep the original, copy first:\nconst original = [3, 1, 2];\nconst sorted = [...original].sort((a, b) => a - b);\nconsole.log(original, sorted);\n// (Modern engines also offer original.toSorted() — non-mutating.)",
      "label": "sorting.js"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 7.1",
      "title": "Report on a dataset",
      "blocks": [
        {
          "kind": "text",
          "text": "Given the array below, produce: the names of everyone earning over 60000, the total payroll, the average salary rounded to a whole number, and the name of the highest earner."
        },
        {
          "kind": "example",
          "code": "const staff = [\n  { name: \"Ravi\", salary: 72000, dept: \"eng\" },\n  { name: \"Nina\", salary: 58000, dept: \"design\" },\n  { name: \"Omar\", salary: 91000, dept: \"eng\" },\n  { name: \"Lila\", salary: 64000, dept: \"sales\" },\n];\n\n// your code here",
          "label": "exercise-7-1.js"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const staff = [\n  { name: \"Ravi\", salary: 72000, dept: \"eng\" },\n  { name: \"Nina\", salary: 58000, dept: \"design\" },\n  { name: \"Omar\", salary: 91000, dept: \"eng\" },\n  { name: \"Lila\", salary: 64000, dept: \"sales\" },\n];\n\nconst highEarners = staff.filter(p => p.salary > 60000).map(p => p.name);\nconsole.log(highEarners);\n\nconst payroll = staff.reduce((sum, p) => sum + p.salary, 0);\nconsole.log(\"payroll:\", payroll);\n\nconsole.log(\"average:\", Math.round(payroll / staff.length));\n\n// reduce to find a max — keep whichever person is bigger\nconst top = staff.reduce((best, p) => (p.salary > best.salary ? p : best));\nconsole.log(\"top earner:\", top.name);\n\n// Bonus: group by department\nconst byDept = staff.reduce((acc, p) => {\n  (acc[p.dept] ||= []).push(p.name);   // ||= creates the array on first use\n  return acc;\n}, {});\nconsole.log(byDept);",
              "label": "solution-7-1.js"
            },
            {
              "kind": "text",
              "text": "Note the max-finding `reduce` with no initial value: the first item becomes the starting accumulator. Safe here because the array is non-empty — with user data, pass an initial value or guard the empty case.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Challenge 7.2",
      "title": "Implement `map` yourself",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `myMap(array, callback)` using only a `for` loop. It should behave like `Array.prototype.map`, passing the item, the index and the whole array to the callback. This is a genuine interview question."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function myMap(array, callback) {\n  const out = [];\n  for (let i = 0; i < array.length; i++) {\n    out.push(callback(array[i], i, array));\n  }\n  return out;\n}\n\nconsole.log(myMap([1, 2, 3], n => n * 10));        // [10, 20, 30]\nconsole.log(myMap([\"a\", \"b\"], (v, i) => i + v));   // [\"0a\", \"1b\"]\n\n// The version an interviewer really wants — as a prototype method:\nArray.prototype.myMap = function (callback, thisArg) {\n  const out = [];\n  for (let i = 0; i < this.length; i++) {\n    if (i in this) {                                  // skip holes in sparse arrays\n      out[i] = callback.call(thisArg, this[i], i, this);\n    }\n  }\n  return out;\n};\nconsole.log([1, 2, 3].myMap(n => n + 1));",
              "label": "solution-7-2.js"
            },
            {
              "kind": "text",
              "text": "The second version shows you know three extra things: `this` inside a prototype method is the array, `call` sets the callback's `this`, and real `map` preserves holes in sparse arrays. Mention those and you're well past the expected answer.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q7",
      "title": "`map` vs `forEach` — when would you use each?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `map` returns a new array built from the callback's return values and does not modify the original; it's for transformation, and it's chainable. `forEach` returns `undefined` and exists purely for side effects — logging, pushing to an external structure, updating the DOM — so it can't be chained."
        },
        {
          "kind": "text",
          "text": "Using `map` when you ignore the result is a smell: it allocates an array you throw away and misleads the reader into expecting a transformation. Neither can be stopped early — `break` doesn't work in either — so when you need to exit mid-way, use `for...of`, or express the intent with `some`/`every`/`find`."
        }
      ]
    }
  ]
};
