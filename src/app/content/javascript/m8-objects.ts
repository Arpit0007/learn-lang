import { Lesson } from '../../shared/content';

export const M8_OBJECTS: Lesson = {
  "slug": "m8-objects",
  "title": "M8 Objects, destructuring and JSON",
  "nav": "Objects & JSON",
  "num": "M8",
  "eyebrow": "Level 2 · Week 5 · ~4 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "An object is a collection of **key: value** pairs — a record. Where an array answers \"how many and in what order\", an object answers \"what are the parts of this thing\"."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "An array is a queue — things standing in a line, counted 0, 1, 2. An object is a form — labelled boxes you fill in: name, age, city. Use an array when \"how many, and in what order\" matters. Use an object when \"what are the parts of this one thing\" matters."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "const user = {\n  name: \"Arpit\",\n  age: 29,\n  isActive: true,\n  address: { city: \"Bengaluru\", pin: \"560001\" },   // objects nest\n  hobbies: [\"chess\", \"cycling\"],                    // and hold arrays\n  greet() {                                         // a method (shorthand syntax)\n    return `Hi, I'm ${this.name}`;\n  },\n};\n\nconsole.log(user.name);              // dot notation — use this by default\nconsole.log(user[\"age\"]);            // bracket notation — for dynamic keys\nconst key = \"isActive\";\nconsole.log(user[key]);              // only brackets can do this\nconsole.log(user.address.city);      // nested access\nconsole.log(user.hobbies[1]);\nconsole.log(user.greet());\n\nuser.age = 30;                       // update\nuser.country = \"India\";              // add\ndelete user.isActive;                // remove\nconsole.log(Object.keys(user));",
      "label": "objects.js"
    },
    {
      "kind": "example",
      "code": "const scores = { math: 90, physics: 78, chem: 84 };\n\nconsole.log(Object.keys(scores));    // [\"math\",\"physics\",\"chem\"]\nconsole.log(Object.values(scores));  // [90, 78, 84]\nconsole.log(Object.entries(scores)); // [[\"math\",90], [\"physics\",78], ...]\n\n// entries + array methods is the standard way to work with objects:\nconst total = Object.values(scores).reduce((a, b) => a + b, 0);\nconsole.log(\"average:\", (total / 3).toFixed(1));\n\nconst passed = Object.entries(scores)\n  .filter(([subject, mark]) => mark >= 80)   // destructuring in the parameter\n  .map(([subject]) => subject);\nconsole.log(passed);\n\n// Build an object back from entries:\nconst doubled = Object.fromEntries(\n  Object.entries(scores).map(([k, v]) => [k, v * 2])\n);\nconsole.log(doubled);\n\nconsole.log(\"math\" in scores);                          // true\nconsole.log(Object.hasOwn(scores, \"toString\"));         // false — inherited, not own",
      "label": "object-tools.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Destructuring and spread"
    },
    {
      "kind": "text",
      "text": "Two ES6 features you'll see in every modern codebase. Destructuring pulls values *out* of an object or array into variables; spread copies values *into* a new one."
    },
    {
      "kind": "example",
      "code": "const user = { name: \"Arpit\", age: 29, city: \"Bengaluru\", role: \"dev\" };\n\n// Object destructuring — names must match the keys\nconst { name, age } = user;\nconsole.log(name, age);\n\n// Rename, and provide a default for a missing key\nconst { role: jobTitle, country = \"India\" } = user;\nconsole.log(jobTitle, country);\n\n// Rest: \"everything else\"\nconst { name: n, ...others } = user;\nconsole.log(others);\n\n// Array destructuring — position matters, names are yours to choose\nconst [gold, silver, ...rest] = [\"Ravi\", \"Nina\", \"Omar\", \"Lila\"];\nconsole.log(gold, silver, rest);\n\n// Swap two variables with no temp variable:\nlet a = 1, b = 2;\n[a, b] = [b, a];\nconsole.log(a, b);\n\n// Destructuring in function parameters — extremely common in React and Node:\nfunction describe({ name, city = \"unknown\" }) {\n  return `${name} from ${city}`;\n}\nconsole.log(describe(user));",
      "label": "destructuring.js"
    },
    {
      "kind": "example",
      "code": "const base = { theme: \"dark\", fontSize: 14 };\n\n// Copy and extend. Later keys WIN, so overrides go last.\nconst settings = { ...base, fontSize: 16, lang: \"en\" };\nconsole.log(settings);\nconsole.log(base);   // untouched\n\n// Merge arrays\nconst a = [1, 2], b = [3, 4];\nconsole.log([...a, ...b, 5]);\n\n// Spread as arguments\nconsole.log(Math.max(...[3, 91, 22]));\n\n// SHALLOW copy warning:\nconst original = { name: \"x\", tags: [\"a\", \"b\"] };\nconst shallow = { ...original };\nshallow.tags.push(\"c\");            // both see it — tags is the SAME array\nconsole.log(original.tags);        // [\"a\",\"b\",\"c\"]\n\n// A real deep copy:\nconst deep = structuredClone(original);\ndeep.tags.push(\"d\");\nconsole.log(original.tags, deep.tags);",
      "label": "spread.js"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 680 230\" role=\"img\" aria-label=\"Primitives are copied by value; objects are shared by reference, so two names point at one object\">\n  <defs><marker id=\"arF2\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <text class=\"lbl\" x=\"10\" y=\"20\">Primitives — copied by value</text>\n  <rect class=\"box\" x=\"10\" y=\"42\" width=\"64\" height=\"30\" rx=\"4\"></rect><text x=\"42\" y=\"62\" text-anchor=\"middle\">a</text>\n  <rect class=\"box\" x=\"120\" y=\"42\" width=\"54\" height=\"30\" rx=\"4\"></rect><text x=\"147\" y=\"62\" text-anchor=\"middle\">5</text>\n  <line class=\"ln\" x1=\"76\" y1=\"57\" x2=\"116\" y2=\"57\" marker-end=\"url(#arF2)\"></line>\n  <rect class=\"box\" x=\"10\" y=\"102\" width=\"64\" height=\"30\" rx=\"4\"></rect><text x=\"42\" y=\"122\" text-anchor=\"middle\">b</text>\n  <rect class=\"box\" x=\"120\" y=\"102\" width=\"54\" height=\"30\" rx=\"4\"></rect><text x=\"147\" y=\"122\" text-anchor=\"middle\">5</text>\n  <line class=\"ln\" x1=\"76\" y1=\"117\" x2=\"116\" y2=\"117\" marker-end=\"url(#arF2)\"></line>\n  <line class=\"faint dash\" x1=\"147\" y1=\"76\" x2=\"147\" y2=\"98\"></line>\n  <text class=\"mut\" x=\"190\" y=\"92\">a second, separate 5</text>\n  <text class=\"mut\" x=\"10\" y=\"160\">b = a  →  b gets its own copy.</text>\n  <text class=\"mut\" x=\"10\" y=\"178\">b = 9 leaves a at 5.</text>\n  <line class=\"faint\" x1=\"340\" y1=\"8\" x2=\"340\" y2=\"200\"></line>\n  <text class=\"lbl\" x=\"368\" y=\"20\">Objects — shared by reference</text>\n  <rect class=\"box\" x=\"368\" y=\"42\" width=\"64\" height=\"30\" rx=\"4\"></rect><text x=\"400\" y=\"62\" text-anchor=\"middle\">a</text>\n  <rect class=\"box\" x=\"368\" y=\"102\" width=\"64\" height=\"30\" rx=\"4\"></rect><text x=\"400\" y=\"122\" text-anchor=\"middle\">b</text>\n  <rect class=\"acc\" x=\"540\" y=\"57\" width=\"120\" height=\"60\" rx=\"6\"></rect>\n  <text x=\"600\" y=\"84\" text-anchor=\"middle\">{ x: 1 }</text>\n  <text class=\"mut\" x=\"600\" y=\"103\" text-anchor=\"middle\">one object</text>\n  <path class=\"lnA\" d=\"M434 57 C 480 57, 500 80, 536 84\" marker-end=\"url(#arF2)\"></path>\n  <path class=\"lnA\" d=\"M434 117 C 480 117, 500 94, 536 88\" marker-end=\"url(#arF2)\"></path>\n  <text class=\"mut\" x=\"368\" y=\"160\">b = a  →  b copies only the address.</text>\n  <text class=\"mut\" x=\"368\" y=\"178\">b.x = 9  →  a.x is 9 too.</text>\n</svg>",
      "caption": "**This one picture explains most \"but I didn't change it!\" bugs.** `const` protects the arrow, not the box at the end of it — which is why `const user = {}` still lets you write `user.name = \"…\"`."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`{a:1} === {a:1}` is `false` — two different objects in memory. And `const b = a` doesn't copy the object, it copies the *address*: change `b.x` and `a.x` changes too. Use `{...a}` for a shallow copy, `structuredClone(a)` for a deep one, and compare contents by comparing the fields you care about (or `JSON.stringify` for a quick-and-dirty check)."
        }
      ],
      "title": "Trap · Objects are compared and copied by reference"
    },
    {
      "kind": "example",
      "code": "const response = { data: { user: { name: \"Arpit\" } } };\nconst empty = { data: null };\n\n// Without protection this throws:\n//   TypeError: Cannot read properties of null (reading 'user')\n// console.log(empty.data.user.name);\n\n// Optional chaining: stop and return undefined the moment something is nullish\nconsole.log(response.data?.user?.name);  // \"Arpit\"\nconsole.log(empty.data?.user?.name);     // undefined — no crash\n\n// Combine with ?? for a fallback:\nconsole.log(empty.data?.user?.name ?? \"Guest\");   // \"Guest\"\n\n// Works for methods and array indexes too:\nconsole.log(empty.data?.getName?.());\nconsole.log(empty.list?.[0]);",
      "label": "optional-chaining.js"
    },
    {
      "kind": "example",
      "code": "const order = { id: 42, items: [\"pen\", \"pad\"], paid: true, when: new Date(0) };\n\n// Object -> string, for sending over the network or storing\nconst text = JSON.stringify(order);\nconsole.log(text);\nconsole.log(JSON.stringify(order, null, 2)); // pretty-printed with 2 spaces\n\n// string -> object, for anything you receive\nconst back = JSON.parse(text);\nconsole.log(back.items[1], typeof back.when);  // \"pad\" \"string\" <- Date became text!\n\n// JSON has no undefined, no functions, no Dates:\nconsole.log(JSON.stringify({ a: undefined, b: () => 1, c: NaN }));  // {\"c\":null}\n\n// Always guard parsing of untrusted text:\ntry {\n  JSON.parse(\"{not json}\");\n} catch (err) {\n  console.log(\"bad JSON:\", err.name);\n}",
      "label": "json.js"
    },
    {
      "kind": "quiz",
      "question": "What does this log? `const a = {x: 1}; const b = a; b.x = 9; console.log(a.x);`",
      "options": [
        "1 — b is a copy",
        "undefined",
        "9",
        "TypeError, a is const"
      ],
      "answer": 2,
      "why": "**9.** `a` and `b` are two names for the same object. `const` prevents re-assigning the *binding* (`a = {}` would throw), not mutating the object it points to. This single fact explains most \"but I didn't change it!\" bugs in JavaScript."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 8.1",
      "title": "Reshape an API response",
      "blocks": [
        {
          "kind": "text",
          "text": "You get the array below from a server. Produce a single object mapping each id to a display string, e.g. `{ 1: \"Ravi (eng)\", 2: \"Nina (design)\" }`. Then produce a list of names of users with no `dept`, defaulting the department to `\"unassigned\"`."
        },
        {
          "kind": "example",
          "code": "const users = [\n  { id: 1, name: \"Ravi\", profile: { dept: \"eng\" } },\n  { id: 2, name: \"Nina\", profile: { dept: \"design\" } },\n  { id: 3, name: \"Omar\", profile: null },\n];\n// your code here",
          "label": "exercise-8-1.js"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const users = [\n  { id: 1, name: \"Ravi\", profile: { dept: \"eng\" } },\n  { id: 2, name: \"Nina\", profile: { dept: \"design\" } },\n  { id: 3, name: \"Omar\", profile: null },\n];\n\n// Option A: reduce into an object\nconst byId = users.reduce((acc, u) => {\n  const dept = u.profile?.dept ?? \"unassigned\";\n  acc[u.id] = `${u.name} (${dept})`;\n  return acc;\n}, {});\nconsole.log(byId);\n\n// Option B: the same thing, arguably cleaner\nconst byId2 = Object.fromEntries(\n  users.map(u => [u.id, `${u.name} (${u.profile?.dept ?? \"unassigned\"})`])\n);\nconsole.log(byId2);\n\n// Users with no department\nconst unassigned = users.filter(u => !u.profile?.dept).map(u => u.name);\nconsole.log(unassigned);   // [\"Omar\"]",
              "label": "solution-8-1.js"
            },
            {
              "kind": "text",
              "text": "The `?.` plus `??` pair is the workhorse of real API code — data from a server is never as clean as the documentation promises.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q8",
      "title": "Shallow copy vs deep copy — how do you do each?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A shallow copy duplicates the top level only; nested objects are still shared references. `{...obj}`, `Object.assign({}, obj)` and `arr.slice()` are all shallow."
        },
        {
          "kind": "text",
          "text": "A deep copy duplicates the whole tree. `structuredClone(obj)` is the built-in answer — it handles Dates, Maps, Sets, typed arrays and circular references, but not functions, DOM nodes or class prototypes. `JSON.parse(JSON.stringify(obj))` is the old trick and it is lossy: it drops `undefined`, functions and symbols, converts `Date` objects to strings, turns `NaN`/`Infinity` into `null`, and throws on circular references. Libraries like lodash's `cloneDeep` exist for the awkward cases."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "**Console quiz engine.** Model 10 questions as an array of objects (`{ question, options, answerIndex, difficulty }`). Write functions to: filter by difficulty, score an array of submitted answers, produce a per-question breakdown, and print a formatted report. No DOM yet — pure data. When you can do this comfortably, you have the skills that most \"junior JavaScript\" job descriptions are actually asking for."
        }
      ],
      "title": "Project 1 · End of Level 2"
    }
  ]
};
