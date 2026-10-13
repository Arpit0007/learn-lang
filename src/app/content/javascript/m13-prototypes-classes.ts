import { Lesson } from '../../shared/content';

export const M13_PROTOTYPES_CLASSES: Lesson = {
  "slug": "m13-prototypes-classes",
  "title": "M13 Prototypes, classes and inheritance",
  "nav": "Prototypes & classes",
  "num": "M13",
  "eyebrow": "Level 4 · Week 9 · ~4 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "JavaScript has no classes underneath — it has **prototypes**. Every object has a hidden link to another object, its prototype. Ask for a property the object doesn't have and the engine follows that link, and the next one, until it finds the property or hits `null`. That path is the **prototype chain**, and it is how `[].map` and `\"x\".toUpperCase` exist without being stored on every value."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Ask an object for something it doesn't have and it doesn't give up — it asks the object it was linked to, which asks the one *it* was linked to, until someone answers or the chain runs out. Like asking your flatmate, then the landlord, then the building manager. `[1,2].map` works because the array asks `Array.prototype`, and that's where `map` actually lives."
        }
      ],
      "title": "In plain words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 730 220\" role=\"img\" aria-label=\"Property lookup walks from an object to its prototype, then to Object.prototype, then to null\">\n  <defs><marker id=\"arP\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <rect class=\"box\" x=\"16\" y=\"70\" width=\"150\" height=\"62\" rx=\"6\"></rect>\n  <text class=\"lbl\" x=\"91\" y=\"92\" text-anchor=\"middle\">dog</text>\n  <text x=\"91\" y=\"114\" text-anchor=\"middle\">name: \"Rex\"</text>\n  <rect class=\"acc\" x=\"226\" y=\"70\" width=\"150\" height=\"62\" rx=\"6\"></rect>\n  <text class=\"lbl accT\" x=\"301\" y=\"92\" text-anchor=\"middle\">animal</text>\n  <text x=\"301\" y=\"114\" text-anchor=\"middle\">breathe()</text>\n  <rect class=\"box\" x=\"436\" y=\"70\" width=\"170\" height=\"62\" rx=\"6\"></rect>\n  <text class=\"lbl\" x=\"521\" y=\"92\" text-anchor=\"middle\">Object.prototype</text>\n  <text x=\"521\" y=\"114\" text-anchor=\"middle\">toString(), …</text>\n  <line class=\"ln\" x1=\"170\" y1=\"101\" x2=\"222\" y2=\"101\" marker-end=\"url(#arP)\"></line>\n  <line class=\"ln\" x1=\"380\" y1=\"101\" x2=\"432\" y2=\"101\" marker-end=\"url(#arP)\"></line>\n  <line class=\"ln\" x1=\"610\" y1=\"101\" x2=\"652\" y2=\"101\" marker-end=\"url(#arP)\"></line>\n  <text x=\"664\" y=\"105\">null</text>\n  <text class=\"mut\" x=\"196\" y=\"92\" text-anchor=\"middle\">[[Proto]]</text>\n  <text class=\"mut\" x=\"406\" y=\"92\" text-anchor=\"middle\">[[Proto]]</text>\n  <path class=\"lnA\" d=\"M91 66 C 91 26, 301 26, 301 62\" marker-end=\"url(#arP)\"></path>\n  <text class=\"accT\" x=\"196\" y=\"22\" text-anchor=\"middle\">dog.breathe() — not here, so follow the link</text>\n  <text class=\"mut\" x=\"16\" y=\"166\">Own property → found immediately.</text>\n  <text class=\"mut\" x=\"16\" y=\"184\">Not own → walk the chain until found, or until null → undefined.</text>\n  <text class=\"mut\" x=\"16\" y=\"202\">Object.hasOwn(dog, \"breathe\") is false, but \"breathe\" in dog is true.</text>\n  <circle class=\"mv mv-hop dotA\" cx=\"91\" cy=\"97\" r=\"5\"></circle>\n</svg>",
      "caption": "**Inheritance in JavaScript is a chain of live links, not a copy.** `dog` holds no `breathe` of its own — it delegates. Add a method to `animal` tomorrow and every dog created yesterday gets it, because nothing was ever copied.",
      "animated": true
    },
    {
      "kind": "example",
      "code": "const animal = {\n  breathe() { return `${this.name} breathes`; },\n};\n\n// Create an object whose prototype is `animal`\nconst dog = Object.create(animal);\ndog.name = \"Rex\";\n\nconsole.log(dog.breathe());              // found on the prototype\nconsole.log(Object.hasOwn(dog, \"breathe\"));  // false — it's inherited\nconsole.log(Object.getPrototypeOf(dog) === animal);  // true\n\n// The chain, made visible:\nconsole.log([].__proto__ === Array.prototype);              // true\nconsole.log(Array.prototype.__proto__ === Object.prototype); // true\nconsole.log(Object.prototype.__proto__);                     // null — the end\n\n// Shadowing: an own property wins over an inherited one\ndog.breathe = () => \"Rex pants instead\";\nconsole.log(dog.breathe());\ndelete dog.breathe;\nconsole.log(dog.breathe());   // the prototype's version is back",
      "label": "prototypes.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Classes: the syntax over the top"
    },
    {
      "kind": "text",
      "text": "`class` arrived in ES6. It is *not* a new object model — it's cleaner syntax for constructor functions and prototypes. Everything below could be written with functions and `Object.create`; nobody does any more."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A class is a cookie cutter; the objects it makes are the cookies. The cutter holds the shape and the instructions. Each cookie gets its own data — its own name, its own balance — but they all share the same instructions."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "class Account {\n  #balance = 0;                 // # = genuinely private field (ES2022)\n  static count = 0;             // belongs to the class, not to instances\n\n  constructor(owner, opening = 0) {\n    this.owner = owner;         // public instance field\n    this.#balance = opening;\n    Account.count++;\n  }\n\n  deposit(amount) {             // goes on Account.prototype — shared by all\n    if (amount <= 0) throw new RangeError(\"Deposit must be positive\");\n    this.#balance += amount;\n    return this;                // returning `this` enables chaining\n  }\n\n  get balance() { return this.#balance; }        // read like a property\n  set balance(_) { throw new Error(\"Use deposit()\"); }\n\n  static compare(a, b) { return a.balance - b.balance; }   // called on the class\n\n  toString() { return `${this.owner}: ₹${this.#balance}`; }\n}\n\nconst a = new Account(\"Arpit\", 500);\na.deposit(200).deposit(300);          // chaining works because deposit returns this\nconsole.log(String(a), a.balance);\nconsole.log(Account.count);\n// console.log(a.#balance);           // SyntaxError — truly private\nconsole.log(Object.hasOwn(a, \"deposit\"), \"deposit\" in a);  // false true",
      "label": "classes.js"
    },
    {
      "kind": "example",
      "code": "class Shape {\n  constructor(name) { this.name = name; }\n  area() { return 0; }\n  describe() { return `${this.name} with area ${this.area().toFixed(2)}`; }\n}\n\nclass Circle extends Shape {\n  constructor(radius) {\n    super(\"Circle\");            // MUST run before using `this`\n    this.radius = radius;\n  }\n  area() { return Math.PI * this.radius ** 2; }   // override\n  describe() {\n    return super.describe() + ` (r=${this.radius})`;  // extend the parent's version\n  }\n}\n\nclass Square extends Shape {\n  constructor(side) { super(\"Square\"); this.side = side; }\n  area() { return this.side ** 2; }\n}\n\nconst shapes = [new Circle(2), new Square(3)];\nfor (const s of shapes) console.log(s.describe());\n\n// Polymorphism: same call, different behaviour, chosen at runtime\nconsole.log(shapes.map(s => s.area().toFixed(1)));\n\nconsole.log(shapes[0] instanceof Circle, shapes[0] instanceof Shape);  // true true\n\n// Custom errors are the most common real-world use of extends:\nclass ValidationError extends Error {\n  constructor(field, message) {\n    super(message);\n    this.name = \"ValidationError\";\n    this.field = field;\n  }\n}\ntry {\n  throw new ValidationError(\"email\", \"Email is required\");\n} catch (err) {\n  console.log(err instanceof ValidationError, err instanceof Error);\n  console.log(`${err.name} on ${err.field}: ${err.message}`);\n}",
      "label": "inheritance.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "**1.** Using `this` before `super()` in a subclass constructor — a `ReferenceError`, because `super()` is what creates `this`. **2.** Assuming class declarations are hoisted like functions — they're in the TDZ, so `new Foo()` above the class throws. **3.** Passing a method as a callback and losing `this`; class bodies are always strict mode, so you get a `TypeError` rather than a silent global."
        }
      ],
      "title": "Trap · Three class mistakes"
    },
    {
      "kind": "quiz",
      "question": "Where does a method defined in a `class` body actually live?",
      "options": [
        "On the prototype, shared by every instance",
        "Copied onto each instance at construction",
        "On the class itself, like a static",
        "In a hidden per-instance closure"
      ],
      "answer": 0,
      "why": "**On the prototype.** That's why `Object.hasOwn(instance, \"method\")` is `false` while `\"method\" in instance` is `true`, and why a thousand instances cost one copy of each method. Class *fields* (including arrow-function fields) are the exception — those are created per instance, which is precisely why an arrow field keeps its `this`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 13.1",
      "title": "Model a library",
      "blocks": [
        {
          "kind": "text",
          "text": "Build `Book` (title, author, isbn, available) and `Library` (holds books). `Library` needs `add`, `lend(isbn)`, `return(isbn)` and a getter for available count. Lending an unavailable book should throw a custom `LendingError`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "class LendingError extends Error {\n  constructor(message, isbn) {\n    super(message);\n    this.name = \"LendingError\";\n    this.isbn = isbn;\n  }\n}\n\nclass Book {\n  constructor(title, author, isbn) {\n    this.title = title;\n    this.author = author;\n    this.isbn = isbn;\n    this.available = true;\n  }\n  toString() { return `${this.title} by ${this.author}`; }\n}\n\nclass Library {\n  #books = new Map();               // isbn -> Book, private\n\n  add(book) { this.#books.set(book.isbn, book); return this; }\n\n  #find(isbn) {\n    const book = this.#books.get(isbn);\n    if (!book) throw new LendingError(\"No such book\", isbn);\n    return book;\n  }\n\n  lend(isbn) {\n    const book = this.#find(isbn);\n    if (!book.available) throw new LendingError(`${book} is already out`, isbn);\n    book.available = false;\n    return book;\n  }\n\n  return(isbn) { this.#find(isbn).available = true; return this; }\n\n  get availableCount() {\n    return [...this.#books.values()].filter(b => b.available).length;\n  }\n}\n\nconst lib = new Library()\n  .add(new Book(\"Eloquent JavaScript\", \"Haverbeke\", \"111\"))\n  .add(new Book(\"You Don't Know JS\", \"Simpson\", \"222\"));\n\nconsole.log(lib.availableCount);           // 2\nconsole.log(String(lib.lend(\"111\")));      // lends it\nconsole.log(lib.availableCount);           // 1\n\ntry { lib.lend(\"111\"); }\ncatch (e) { console.log(`${e.name}: ${e.message}`); }\n\nlib.return(\"111\");\nconsole.log(lib.availableCount);           // 2",
              "label": "solution-13-1.js"
            },
            {
              "kind": "text",
              "text": "Note `#find` — a private *method*, not just a private field. And `Map` rather than an object for the store: keys stay exactly the strings you put in, and `.size`, `.has` and iteration are all first-class.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q13",
      "title": "Explain prototypal inheritance. How does it differ from classical inheritance?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** In JavaScript, objects inherit directly from other *objects*. Every object has an internal `[[Prototype]]` link (exposed as `Object.getPrototypeOf`, historically `__proto__`). A property lookup walks that chain until it finds the key or reaches `null`. There are no classes at runtime — `class` syntax creates a constructor function whose `prototype` object holds the methods, and `new` links each instance to it."
        },
        {
          "kind": "text",
          "text": "Differences from classical inheritance: it's delegation rather than copying — instances hold a live link, so adding a method to a prototype makes it available to objects already created; the chain is mutable at runtime; and objects can be created directly from other objects with `Object.create`, no class needed. Practical consequences: methods are shared (memory efficient), `Object.hasOwn` distinguishes own from inherited properties, and deep chains cost lookup time."
        }
      ]
    }
  ]
};
