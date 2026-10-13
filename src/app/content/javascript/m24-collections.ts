import { Lesson } from '../../shared/content';

export const M24_COLLECTIONS: Lesson = {
  "slug": "m24-collections",
  "title": "M24 Map, Set, WeakMap and Symbol",
  "nav": "Map, Set, Symbol",
  "num": "M24",
  "eyebrow": "Level 7 · read after Module 8 (Week 5) · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Objects and arrays cover most needs, but four ES6 collection types solve specific problems far better — and each is a routine interview question."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "`Set` — unique values, instant membership"
    },
    {
      "kind": "example",
      "code": "const tags = new Set([\"js\", \"css\", \"js\", \"html\"]);\nconsole.log(tags.size, [...tags]);        // 3 — duplicates dropped on insert\n\ntags.add(\"js\");                            // no effect, already present\nconsole.log(tags.has(\"css\"), tags.has(\"go\"));\ntags.delete(\"html\");\nconsole.log([...tags]);\n\n// The idiom you'll use constantly: deduplicate an array\nconst ids = [1, 2, 2, 3, 3, 3];\nconsole.log([...new Set(ids)]);\n\n// Membership is O(1) — an array's includes() is O(n)\nconst banned = new Set([\"spam\", \"bot\"]);\nconsole.log([\"real\", \"bot\", \"user\"].filter(name => !banned.has(name)));\n\n// Set operations, written by hand (and now built in as .union() etc.)\nconst a = new Set([1, 2, 3]), b = new Set([2, 3, 4]);\nconsole.log(\"intersection:\", [...a].filter(x => b.has(x)));\nconsole.log(\"difference:\", [...a].filter(x => !b.has(x)));\nconsole.log(\"union:\", [...new Set([...a, ...b])]);\n\n// CAREFUL: Sets compare by reference, so objects are never \"equal\"\nconst objects = new Set([{ id: 1 }, { id: 1 }]);\nconsole.log(objects.size);                 // 2 — two distinct objects\n// Deduplicate objects by a key instead:\nconst rows = [{ id: 1 }, { id: 2 }, { id: 1 }];\nconsole.log([...new Map(rows.map(r => [r.id, r])).values()]);",
      "label": "set.js"
    },
    {
      "kind": "example",
      "code": "const scores = new Map([[\"math\", 90], [\"physics\", 78]]);\n\nscores.set(\"chem\", 84).set(\"math\", 95);    // set returns the map, so it chains\nconsole.log(scores.get(\"math\"), scores.has(\"bio\"), scores.size);\nscores.delete(\"physics\");\n\n// Directly iterable, in insertion order\nfor (const [subject, mark] of scores) console.log(subject, mark);\nconsole.log([...scores.keys()], [...scores.values()]);\n\n// The superpower: ANY value can be a key, objects included\nconst user1 = { name: \"Arpit\" }, user2 = { name: \"Nina\" };\nconst lastSeen = new Map([[user1, \"today\"], [user2, \"last week\"]]);\nconsole.log(lastSeen.get(user1));\n\n// Object keys are always strings — this is the bug Map prevents:\nconst asObject = {};\nasObject[user1] = \"today\";\nasObject[user2] = \"last week\";\nconsole.log(Object.keys(asObject));        // [\"[object Object]\"] — collided!\n\n// Converting both ways\nconsole.log(Object.fromEntries(scores));\nconsole.log(new Map(Object.entries({ a: 1, b: 2 })));\n\n// Counting is cleaner with Map than with a plain object\nconst votes = [\"js\", \"py\", \"js\", \"go\", \"js\"];\nconst tally = new Map();\nfor (const v of votes) tally.set(v, (tally.get(v) ?? 0) + 1);\nconsole.log([...tally].sort((x, y) => y[1] - x[1]));",
      "label": "map.js"
    },
    {
      "kind": "example",
      "code": "// WeakMap: entries vanish when the key object becomes unreachable.\n// Perfect for metadata about objects you don't own — DOM nodes, class instances.\nconst clickCounts = new WeakMap();\nfunction recordClick(element) {\n  clickCounts.set(element, (clickCounts.get(element) ?? 0) + 1);\n  return clickCounts.get(element);\n}\nlet button = { tag: \"button\" };            // stands in for a DOM node\nconsole.log(recordClick(button), recordClick(button));\nbutton = null;                              // the WeakMap entry is now collectable\nconsole.log(\"no manual cleanup needed — that's the point\");\n\n// WeakMap has no size, no iteration and no clear, by design:\n// if you could list its contents, the entries couldn't be collected silently.\n\n// Symbol: a guaranteed-unique value, usually used as a non-colliding key\nconst ID = Symbol(\"id\");\nconst record = { name: \"Arpit\", [ID]: 12345 };\nconsole.log(record.name, record[ID]);\nconsole.log(Object.keys(record));           // [\"name\"] — symbols are hidden\nconsole.log(JSON.stringify(record));        // symbol key is skipped\n\nconsole.log(Symbol(\"x\") === Symbol(\"x\"));   // false — always unique\n\n// Well-known symbols let your objects plug into language features:\nclass Deck {\n  constructor(cards) { this.cards = cards; }\n  *[Symbol.iterator]() { yield* this.cards; }      // now it works with for...of\n  get [Symbol.toStringTag]() { return \"Deck\"; }\n}\nconst deck = new Deck([\"A♠\", \"K♥\", \"Q♦\"]);\nconsole.log([...deck]);\nfor (const card of deck) console.log(card);\nconsole.log(Object.prototype.toString.call(deck));",
      "label": "weak-symbol.js"
    },
    {
      "kind": "table",
      "head": [
        "Use",
        "Reach for",
        "Why"
      ],
      "rows": [
        [
          "A fixed-shape record, or anything you'll `JSON.stringify`",
          "Object",
          "Literal syntax, serialises, destructures"
        ],
        [
          "Keys added and removed constantly, or non-string keys",
          "`Map`",
          "Real key types, `.size`, ordered iteration, no prototype collisions"
        ],
        [
          "\"Have I seen this?\" / deduplication",
          "`Set`",
          "`O(1)` membership, uniqueness for free"
        ],
        [
          "Data attached to objects you don't own",
          "`WeakMap`",
          "No leaks — entries die with their keys"
        ],
        [
          "A property name that must never clash",
          "`Symbol`",
          "Unique, hidden from `Object.keys` and JSON"
        ]
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q51",
      "title": "When would you use a `Map` instead of an object, and a `WeakMap` instead of a `Map`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Use a `Map` when keys aren't strings (objects, numbers that must stay numbers), when keys are added and deleted frequently, when insertion order matters, when you need `.size` or direct iteration, or when keys come from user data and could collide with inherited names like `constructor` or `__proto__`. Use a plain object for fixed-shape records, for anything serialised to JSON, and where destructuring reads better."
        },
        {
          "kind": "text",
          "text": "Use a `WeakMap` when the keys are objects whose lifetime you don't control — DOM nodes, class instances, cache keys. Because references are weak, an entry doesn't keep its key alive, so the cache can't leak. The trade-off is that it isn't iterable and has no size: you can only ask about a key you already hold."
        }
      ]
    }
  ]
};
