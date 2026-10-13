import { Lesson } from '../../shared/content';

export const ROADMAP: Lesson = {
  "slug": "roadmap",
  "title": "The roadmap, and why this order",
  "nav": "The roadmap",
  "eyebrow": "Map",
  "blocks": [
    {
      "kind": "text",
      "text": "Most people fail at JavaScript by starting in the wrong place — frameworks before functions, or async before scope. Each rung below exists because the one above it made it possible."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 0 · Ground & setup (Module 1)"
    },
    {
      "kind": "text",
      "text": "What JavaScript is, where it runs, and how to get output on a screen. You need a feedback loop before you need anything else — without one, every later lesson is guesswork."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 1 · Fundamentals (Modules 2–6)"
    },
    {
      "kind": "text",
      "text": "Values, types, operators, control flow, functions. This is the grammar of the language. Every advanced topic — closures, promises, prototypes — is just these pieces arranged differently, so shortcuts here cost you triple later."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 2 · Data shapes (Modules 7–8)"
    },
    {
      "kind": "text",
      "text": "Arrays and objects. Real programs are lists of things and records about things. You learn these *after* functions because the array methods that matter (`map`, `filter`, `reduce`) all take functions as arguments — they'd be incomprehensible earlier."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 3 · The browser (Modules 9–10)"
    },
    {
      "kind": "text",
      "text": "DOM and events — making things appear and respond to clicks. This is where JavaScript stops being an exercise and starts being visible. It lands here because DOM code is mostly arrays, objects and callbacks applied to a page."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 4 · How JavaScript really works (Modules 11–13)"
    },
    {
      "kind": "text",
      "text": "Scope, hoisting, closures, `this`, prototypes, classes. The mechanics under the syntax. You now have enough code in your head for these to explain bugs you've actually hit, instead of being abstract trivia. This level is roughly half of every JavaScript interview."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 5 · Async & modern JS (Modules 14–16)"
    },
    {
      "kind": "text",
      "text": "Callbacks, promises, `async`/`await`, the event loop, `fetch`, error handling, modules. Async requires closures and `this` to already be solid — that's why it isn't earlier, despite every tutorial putting it in week two."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 6 · Craft (Modules 17–18)"
    },
    {
      "kind": "text",
      "text": "Higher-order and functional patterns, memory, performance, and the design patterns senior developers reach for. This is what separates \"can write JavaScript\" from \"can be trusted with a codebase\"."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 7 · The working toolkit (Modules 19–30)"
    },
    {
      "kind": "text",
      "text": "Debugging, recursion, Big-O, regular expressions, dates, `Map`/`Set`, generators, browser storage, testing, Node, a tour of everything the language added through ES2026, and the metaprogramming corners — `Proxy`, descriptors, bitwise flags and binary data. These aren't an appendix — they're the parts of the job most courses skip, and the study plan (next page) slots each one into the week where you'll need it. Debugging (Module 19) comes as early as week 3, because it changes how fast everything after it goes."
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "If you can finish Level 2 without looking anything up, you can build real things. If you can finish Level 4 without looking anything up, you can pass a JavaScript interview. Levels 5 and 6 make the job pleasant; Level 7 is what makes you employable on day one — debugging, testing and Big-O come up in interviews far more often than beginners expect."
        }
      ],
      "title": "Checkpoint"
    }
  ]
};
