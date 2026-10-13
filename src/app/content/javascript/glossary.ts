import { Lesson } from '../../shared/content';

export const GLOSSARY: Lesson = {
  "slug": "glossary",
  "title": "Glossary",
  "eyebrow": "Reference",
  "blocks": [
    {
      "kind": "text",
      "text": "The vocabulary you'll hear in documentation, code review and interviews. If a term here is unfamiliar, the module that teaches it is named in brackets."
    },
    {
      "kind": "table",
      "head": [
        "Term",
        "Meaning"
      ],
      "rows": [
        [
          "Argument vs parameter",
          "A parameter is the name in the definition; an argument is the value you pass in. \\[M6\\]"
        ],
        [
          "Callback",
          "A function passed to another function to be called later. \\[M6, M14\\]"
        ],
        [
          "Closure",
          "A function plus the scope it was created in, kept alive after that scope returns. \\[M11\\]"
        ],
        [
          "Coercion",
          "Automatic conversion between types, e.g. `\"5\" * 2` becoming `10`. \\[M3\\]"
        ],
        [
          "Currying",
          "Turning `f(a, b)` into `f(a)(b)`. \\[M17\\]"
        ],
        [
          "Declarative vs imperative",
          "*What* you want (`map`) versus *how* to get it (a `for` loop). \\[M7\\]"
        ],
        [
          "Destructuring",
          "Pulling values out of objects or arrays into variables in one statement. \\[M8\\]"
        ],
        [
          "Event delegation",
          "One listener on an ancestor handling events from many descendants. \\[M10\\]"
        ],
        [
          "Event loop",
          "The scheduler that runs queued callbacks when the call stack empties. \\[M14\\]"
        ],
        [
          "Falsy",
          "The eight values that behave as `false` in a condition. \\[M3\\]"
        ],
        [
          "First-class function",
          "A function that can be stored, passed and returned like any value. \\[M6\\]"
        ],
        [
          "Higher-order function",
          "A function that takes or returns a function. \\[M17\\]"
        ],
        [
          "Hoisting",
          "Declarations being registered in their scope before code runs. \\[M11\\]"
        ],
        [
          "Idempotent",
          "An operation that gives the same result however many times it's applied. \\[M14\\]"
        ],
        [
          "Immutable",
          "Never modified in place; changes produce a new value. \\[M17\\]"
        ],
        [
          "IIFE",
          "Immediately Invoked Function Expression — `(function(){ … })()`. \\[M11, M18\\]"
        ],
        [
          "Iterable",
          "Anything with a `[Symbol.iterator]`, so it works with `for...of` and spread. \\[M25\\]"
        ],
        [
          "Lexical scope",
          "Scope determined by where code is written, not where it's called. \\[M11\\]"
        ],
        [
          "Memoization",
          "Caching a function's results by its arguments. \\[M11\\]"
        ],
        [
          "Microtask",
          "A promise callback; runs before the next timer or event callback. \\[M14\\]"
        ],
        [
          "Mutation",
          "Changing an existing object or array in place. \\[M8, M17\\]"
        ],
        [
          "Bitmask",
          "Many boolean flags packed into one integer, read with `&` and `|`. \\[M30\\]"
        ],
        [
          "Descriptor",
          "The hidden `writable`/`enumerable`/`configurable` settings behind every property. \\[M30\\]"
        ],
        [
          "Metaprogramming",
          "Code that inspects or changes how other code behaves — `Proxy`, `Reflect`, descriptors. \\[M30\\]"
        ],
        [
          "Polyfill",
          "Code that implements a newer feature on older engines. \\[M16\\]"
        ],
        [
          "Proxy",
          "An object wrapper that intercepts reads, writes and other operations. \\[M30\\]"
        ],
        [
          "Prototype chain",
          "The lookup path an object follows for properties it doesn't own. \\[M13\\]"
        ],
        [
          "Pure function",
          "Same input, same output, no side effects. \\[M17\\]"
        ],
        [
          "Race condition",
          "A bug whose outcome depends on which async operation finishes first. \\[M15\\]"
        ],
        [
          "Reference vs value",
          "Objects are shared by reference; primitives are copied by value. \\[M8\\]"
        ],
        [
          "Shadowing",
          "An inner declaration hiding an outer one of the same name. \\[M11\\]"
        ],
        [
          "Side effect",
          "Anything a function does beyond returning a value. \\[M17\\]"
        ],
        [
          "Spread / rest",
          "`...` expanding a collection, or collecting arguments into an array. \\[M6, M8\\]"
        ],
        [
          "TDZ",
          "Temporal dead zone — the gap before a `let`/`const` is initialised. \\[M11\\]"
        ],
        [
          "Thenable",
          "Any object with a `.then` method; treated like a promise by `await`. \\[M14\\]"
        ],
        [
          "Transpile",
          "Convert modern syntax to an older equivalent (Babel, TypeScript). \\[M16\\]"
        ],
        [
          "Tree-shaking",
          "Dropping never-imported exports from a bundle. \\[M16\\]"
        ],
        [
          "Tagged template",
          "A template literal passed to a function that decides what it means. \\[M30\\]"
        ],
        [
          "Truthy",
          "Everything that isn't falsy. \\[M3\\]"
        ],
        [
          "XSS",
          "Cross-site scripting — injected markup executing in your page. \\[M9\\]"
        ]
      ]
    }
  ]
};
