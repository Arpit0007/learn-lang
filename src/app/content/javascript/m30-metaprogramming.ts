import { Lesson } from '../../shared/content';

export const M30_METAPROGRAMMING: Lesson = {
  "slug": "m30-metaprogramming",
  "title": "M30 Metaprogramming and the corners of the language",
  "nav": "Metaprogramming",
  "num": "M30",
  "eyebrow": "Level 7 · read in Week 14 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Everything left. Some of it you'll use monthly, some once a year, and some never — but all of it turns up in senior interviews, and knowing it is the difference between \"I use JavaScript\" and \"I understand JavaScript\". **Metaprogramming** means code that inspects or changes how other code behaves: intercepting property access, redefining what a property *is*, hooking into the operators the language runs for you."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Property descriptors: what a property really is"
    },
    {
      "kind": "text",
      "text": "A property isn't just a key and a value. Every one has three hidden switches, and `obj.x = 1` just sets them all to `true` for you."
    },
    {
      "kind": "example",
      "code": "const config = {};\n\nObject.defineProperty(config, \"apiUrl\", {\n  value: \"https://api.example.com\",\n  writable: false,      // can't be reassigned\n  enumerable: true,     // shows up in Object.keys / for...in / JSON\n  configurable: false,  // can't be deleted or redefined\n});\n\nconfig.apiUrl = \"https://evil.example.com\";   // silently ignored (throws in strict mode)\nconsole.log(config.apiUrl);\nconsole.log(Object.getOwnPropertyDescriptor(config, \"apiUrl\"));\n\n// A hidden property — present, usable, but invisible to iteration and JSON\nconst user = { name: \"Arpit\" };\nObject.defineProperty(user, \"_internalId\", { value: 42, enumerable: false });\nconsole.log(Object.keys(user), JSON.stringify(user), user._internalId);\n\n// Accessor properties: a getter/setter pair instead of a value.\n// The same thing class `get`/`set` creates (M13) — and available in literals:\nconst temperature = {\n  celsius: 25,\n  get fahrenheit() { return this.celsius * 9 / 5 + 32; },\n  set fahrenheit(f) { this.celsius = (f - 32) * 5 / 9; },\n};\nconsole.log(temperature.fahrenheit);   // reads like a property, runs like a function\ntemperature.fahrenheit = 212;\nconsole.log(temperature.celsius);\n\n// The three levels of locking down an object:\nconst frozen = Object.freeze({ a: 1, nested: { b: 2 } });\nfrozen.a = 99;  frozen.nested.b = 99;      // freeze is SHALLOW\nconsole.log(frozen.a, frozen.nested.b, Object.isFrozen(frozen));\n// seal: can change existing values, can't add or delete keys\n// preventExtensions: can't add keys, but can change and delete\nconsole.log(Object.isSealed(Object.seal({ x: 1 })));",
      "label": "descriptors.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "`Proxy` and `Reflect`"
    },
    {
      "kind": "text",
      "text": "A `Proxy` wraps an object and lets you intercept the fundamental operations on it — reading a property, writing one, checking `in`, deleting, calling, constructing. `Reflect` is the matching toolbox that performs the *default* behaviour, so your trap can add something and then get out of the way."
    },
    {
      "kind": "text",
      "text": "This is how Vue 3's reactivity, most mocking libraries, and ORM lazy-loading work. It is also the answer to \"how would you log every access to an object without changing it?\"."
    },
    {
      "kind": "example",
      "code": "const target = { name: \"Arpit\", role: \"dev\" };\n\n// 1. Logging every read and write, without touching the original object\nconst logged = new Proxy(target, {\n  get(obj, key, receiver) {\n    console.log(`  read  ${String(key)}`);\n    return Reflect.get(obj, key, receiver);      // do the normal thing\n  },\n  set(obj, key, value, receiver) {\n    console.log(`  write ${String(key)} = ${value}`);\n    return Reflect.set(obj, key, value, receiver); // must return true on success\n  },\n});\nlogged.name;\nlogged.role = \"lead\";\nconsole.log(target.role, \"— the original was updated through the proxy\");\n\n// 2. Validation at the boundary — reject bad data at assignment time\nconst validated = new Proxy({}, {\n  set(obj, key, value) {\n    if (key === \"age\" && (!Number.isInteger(value) || value < 0)) {\n      throw new TypeError(\"age must be a non-negative integer\");\n    }\n    return Reflect.set(obj, key, value);\n  },\n});\nvalidated.age = 29;\nconsole.log(\"age set to\", validated.age);\ntry { validated.age = -5; } catch (e) { console.log(\"rejected:\", e.message); }\n\n// 3. Defaults for missing keys — no more `?? 0` at every call site\nconst counts = new Proxy({}, { get: (o, k) => (k in o ? o[k] : 0) });\ncounts.js += 1;\ncounts.js += 1;\nconsole.log(\"counts.js =\", counts.js, \"| counts.rust =\", counts.rust);\n\n// 4. Negative array indices, Python-style\nfunction negatives(array) {\n  return new Proxy(array, {\n    get(arr, key) {\n      const i = Number(key);\n      return Number.isInteger(i) && i < 0 ? arr[arr.length + i] : Reflect.get(arr, key);\n    },\n  });\n}\nconst list = negatives([\"a\", \"b\", \"c\"]);\nconsole.log(list[-1], list[0], list.length);\n\n// 5. A revocable proxy — hand out access, then take it away\nconst { proxy, revoke } = Proxy.revocable({ secret: 1 }, {});\nconsole.log(proxy.secret);\nrevoke();\ntry { proxy.secret; } catch (e) { console.log(\"after revoke:\", e.name); }",
      "label": "proxy.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Property access through a proxy is several times slower than a plain object, so it's wrong in a hot loop. Traps must respect the object's invariants — returning a different value for a non-configurable, non-writable property throws a `TypeError`. And magic hurts: a proxy that invents properties makes debugging confusing for the next person, because the object in the console doesn't behave like the object in the code. Use one for a framework-level concern — reactivity, mocking, access control — not to save three lines in application code."
        }
      ],
      "title": "Trap · When *not* to reach for a Proxy"
    },
    {
      "kind": "example",
      "code": "// Well-known symbols are the hooks the language itself calls on your objects.\nclass Money {\n  constructor(amount, currency = \"INR\") { this.amount = amount; this.currency = currency; }\n\n  // Called when the object is coerced — by +, by `${}`, by ==\n  [Symbol.toPrimitive](hint) {\n    if (hint === \"number\") return this.amount;\n    if (hint === \"string\") return `${this.currency} ${this.amount.toFixed(2)}`;\n    return `${this.currency} ${this.amount}`;      // hint === \"default\"\n  }\n\n  // Changes Object.prototype.toString.call(obj)\n  get [Symbol.toStringTag]() { return \"Money\"; }\n}\n\nconst price = new Money(499.5);\nconsole.log(+price);            // 499.5   — number hint\nconsole.log(`${price}`);        // \"INR 499.50\" — string hint\nconsole.log(price + 100);       // default hint\nconsole.log(Object.prototype.toString.call(price));\n\n// Symbol.hasInstance customises `instanceof`\nclass Iterable {\n  static [Symbol.hasInstance](value) { return value?.[Symbol.iterator] !== undefined; }\n}\nconsole.log([] instanceof Iterable, \"abc\" instanceof Iterable, 42 instanceof Iterable);\n\n// Symbol.iterator (M25) and Symbol.asyncIterator complete the set\nconst range = {\n  from: 1, to: 3,\n  *[Symbol.iterator]() { for (let i = this.from; i <= this.to; i++) yield i; },\n  async *[Symbol.asyncIterator]() { for (let i = this.from; i <= this.to; i++) yield i * 10; },\n};\nconsole.log([...range]);\nfor await (const v of range) console.log(\"async:\", v);",
      "label": "well-known-symbols.js"
    },
    {
      "kind": "example",
      "code": "// A tagged template is a function call in disguise. The tag receives the\n// literal string pieces as an array, then each interpolated value.\nfunction tag(strings, ...values) {\n  console.log(\"strings:\", strings);   // [\"Hello \", \", you are \", \" today\"]\n  console.log(\"values: \", values);    // [\"Arpit\", 29]\n  return \"built by the tag\";\n}\nconst name = \"Arpit\", age = 29;\nconsole.log(tag`Hello ${name}, you are ${age} today`);\n\n// The practical use: escaping interpolated values automatically.\n// This is how a safe HTML builder avoids the XSS trap from Module 9.\nconst escapeHtml = s => String(s)\n  .replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\")\n  .replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\");\n\nfunction safeHtml(strings, ...values) {\n  return strings.reduce((out, str, i) =>\n    out + str + (i < values.length ? escapeHtml(values[i]) : \"\"), \"\");\n}\nconst userInput = '<img src=x onerror=\"steal()\">';\nconsole.log(safeHtml`<p>Comment: ${userInput}</p>`);\n// The literal markup stays live; only the INTERPOLATED value is escaped.\n\n// String.raw — the built-in tag that ignores escape sequences\nconsole.log(String.raw`C:\\new\\table`);      // backslashes survive\nconsole.log(`C:\\new\\table`.length < String.raw`C:\\new\\table`.length);\n\n// This mechanism is what styled-components, graphql`…` and sql`…` are built on:\n// the tag decides what the template MEANS.",
      "label": "tagged-templates.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Bitwise operators"
    },
    {
      "kind": "text",
      "text": "These work on the 32-bit binary representation of a number. You will rarely need them for business logic, and you will regularly meet them in interview puzzles, permission systems, and any code touching pixels, files or protocols."
    },
    {
      "kind": "example",
      "code": "const show = n => (n >>> 0).toString(2).padStart(8, \"0\");\n\nconsole.log(\"5      =\", show(5), \"  3      =\", show(3));\nconsole.log(\"5 & 3  =\", show(5 & 3),  \"AND — 1 where BOTH bits are 1  ->\", 5 & 3);\nconsole.log(\"5 | 3  =\", show(5 | 3),  \"OR  — 1 where EITHER is 1      ->\", 5 | 3);\nconsole.log(\"5 ^ 3  =\", show(5 ^ 3),  \"XOR — 1 where they DIFFER      ->\", 5 ^ 3);\nconsole.log(\"~5     =\", show(~5),     \"NOT — flips every bit          ->\", ~5);\nconsole.log(\"5 << 1 =\", show(5 << 1), \"left shift  = multiply by 2    ->\", 5 << 1);\nconsole.log(\"5 >> 1 =\", show(5 >> 1), \"right shift = divide by 2      ->\", 5 >> 1);\n\n// The real-world use: bit FLAGS. Eight booleans in one number.\nconst PERM = { READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 };   // powers of two\n\nlet permissions = PERM.READ | PERM.WRITE;                   // grant two\nconsole.log(\"has WRITE?\", (permissions & PERM.WRITE) !== 0);\nconsole.log(\"has ADMIN?\", (permissions & PERM.ADMIN) !== 0);\n\npermissions |= PERM.ADMIN;                                  // grant\npermissions &= ~PERM.WRITE;                                 // revoke\npermissions ^= PERM.DELETE;                                 // toggle\nconsole.log(\"final:\", show(permissions), \"READ+ADMIN+DELETE =\", permissions);\n\n// Interview favourites\nconsole.log(\"odd?\", (7 & 1) === 1);                          // last bit\nconsole.log(\"swap without a temp:\");\nlet a = 3, b = 9;\na ^= b; b ^= a; a ^= b;\nconsole.log(a, b);\n\n// TRAP: bitwise operators coerce to 32-bit SIGNED integers.\nconsole.log(2 ** 31 | 0);          // -2147483648 — overflowed\nconsole.log(2 ** 32 | 0);          // 0\nconsole.log(9.9 | 0, ~~9.9);       // truncation tricks — use Math.trunc instead\nconsole.log(\"Use BigInt for bitwise work beyond 32 bits.\");",
      "label": "bitwise.js"
    },
    {
      "kind": "example",
      "code": "// ArrayBuffer = a fixed block of raw bytes. Typed arrays are VIEWS onto it.\nconst buffer = new ArrayBuffer(8);          // 8 bytes\nconst bytes = new Uint8Array(buffer);       // view: 8 unsigned 8-bit ints\nconst words = new Uint32Array(buffer);      // view: 2 unsigned 32-bit ints\n\nbytes[0] = 255;\nbytes[1] = 1;\nconsole.log(\"bytes:\", [...bytes]);\nconsole.log(\"same memory, read as 32-bit:\", words[0]);\n\n// Typed arrays are fixed-length, single-type and dense — no holes, no push()\nconst pixels = new Uint8ClampedArray([300, -20, 128]);  // clamps to 0..255\nconsole.log(\"clamped:\", [...pixels]);\nconsole.log(new Int8Array([200])[0], \"— Int8 wraps instead of clamping\");\n\n// Float64Array is what a Float64 number really is:\nconsole.log(\"floats:\", [...new Float64Array([0.1, 1 / 3])]);\n\n// DataView — mixed types and explicit endianness, for file and network formats\nconst view = new DataView(new ArrayBuffer(4));\nview.setUint16(0, 513, false);              // false = big-endian (network order)\nconsole.log(\"big-endian bytes:\", view.getUint8(0), view.getUint8(1));\nview.setUint16(0, 513, true);               // true = little-endian\nconsole.log(\"little-endian bytes:\", view.getUint8(0), view.getUint8(1));\n\n// Where you actually meet these: canvas ImageData, File/Blob reads,\n// fetch(...).arrayBuffer(), WebGL, WebAudio, crypto, WebSocket binary frames.\nconsole.log(\"bytes per element — Uint8:\", Uint8Array.BYTES_PER_ELEMENT,\n            \"Float64:\", Float64Array.BYTES_PER_ELEMENT);",
      "label": "binary-data.js"
    },
    {
      "kind": "example",
      "code": "// globalThis — the one name for the global object everywhere\n// (window in browsers, global in Node, self in workers)\nconsole.log(typeof globalThis, typeof globalThis.Math.max);\n\n// Labelled break/continue — escape nested loops without a flag variable\nouter:\nfor (const row of [[1, 2], [3, 4], [5, 6]]) {\n  for (const value of row) {\n    if (value === 4) { console.log(\"found 4 — leaving BOTH loops\"); break outer; }\n    console.log(\"checking\", value);\n  }\n}\n\n// do...while — the body runs at least once, THEN the condition is tested.\n// Right for \"keep asking until the input is valid\".\nlet attempts = 0;\ndo { attempts++; } while (attempts < 3);\nconsole.log(\"attempts:\", attempts);\n\n// WeakRef — hold a reference that does NOT prevent garbage collection.\nconst cache = new WeakRef({ heavy: \"data\" });\nconsole.log(\"deref while alive:\", cache.deref()?.heavy);\n// After the object is collected, deref() returns undefined — non-deterministically.\n\n// FinalizationRegistry — a callback after an object is collected.\nconst registry = new FinalizationRegistry(key => console.log(\"collected:\", key));\nregistry.register({ temp: true }, \"temp-object\");\nconsole.log(\"registered — the callback may fire later, or never\");\n\n// Both exist for caches and interop with external resources. The advice from\n// the specification authors themselves: avoid them. Collection timing is not\n// guaranteed, so any logic depending on it is a bug waiting to happen.\n// Use WeakMap/WeakSet (M24) for the ordinary version of this problem.",
      "label": "corners.js"
    },
    {
      "kind": "reveal",
      "tag": "Challenge 30.1",
      "title": "A read-only observable object",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `observable(target, onChange)` that returns a proxy: reads pass through, writes call `onChange(key, oldValue, newValue)` before applying, deletes are blocked, and nested objects are observed too. This is a miniature of Vue's reactivity system, and an excellent thing to be able to explain."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function observable(target, onChange, path = \"\") {\n  return new Proxy(target, {\n    get(obj, key, receiver) {\n      const value = Reflect.get(obj, key, receiver);\n      // Wrap nested objects lazily, so deep changes are seen too\n      if (value !== null && typeof value === \"object\" && !(value instanceof Date)) {\n        return observable(value, onChange, path ? `${path}.${String(key)}` : String(key));\n      }\n      return value;\n    },\n\n    set(obj, key, value, receiver) {\n      const full = path ? `${path}.${String(key)}` : String(key);\n      const old = obj[key];\n      if (!Object.is(old, value)) onChange(full, old, value);\n      return Reflect.set(obj, key, value, receiver);\n    },\n\n    deleteProperty() {\n      throw new TypeError(\"This object is delete-protected\");\n    },\n  });\n}\n\nconst state = observable(\n  { user: { name: \"Arpit\", plan: \"free\" }, items: [] },\n  (key, oldValue, newValue) => console.log(`CHANGED ${key}: ${oldValue} -> ${newValue}`)\n);\n\nstate.user.plan = \"pro\";          // nested write is caught\nstate.items.push(\"pen\");          // array mutation triggers length + index writes\nconsole.log(state.user.plan, state.items.length);\n\ntry { delete state.user; } catch (e) { console.log(\"blocked:\", e.message); }",
              "label": "solution-30-1.js"
            },
            {
              "kind": "text",
              "text": "Two things to point out when explaining it: the nested wrapping is *lazy* — objects are proxied on access, not upfront, which is exactly the trick that makes Vue 3 faster than Vue 2's `defineProperty` walk. And pushing to an array fires two `set` traps (the index, then `length`), which is why real implementations de-duplicate notifications.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 30.2",
      "title": "A permission system in one number",
      "blocks": [
        {
          "kind": "text",
          "text": "Using bit flags, write `grant`, `revoke`, `has` and `describe` for the permissions `READ`, `WRITE`, `DELETE`, `ADMIN`. `describe` should return an array of the granted permission names."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const PERM = Object.freeze({ READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 });\n\nconst grant   = (bits, ...flags) => flags.reduce((b, f) => b | f, bits);\nconst revoke  = (bits, ...flags) => flags.reduce((b, f) => b & ~f, bits);\nconst has     = (bits, flag) => (bits & flag) === flag;   // === flag handles combos\nconst describe = bits => Object.keys(PERM).filter(name => has(bits, PERM[name]));\n\nlet user = grant(0, PERM.READ, PERM.WRITE);\nconsole.log(describe(user));                       // [\"READ\", \"WRITE\"]\nconsole.log(has(user, PERM.READ | PERM.WRITE));    // true — both at once\nconsole.log(has(user, PERM.ADMIN));                // false\n\nuser = grant(user, PERM.ADMIN);\nuser = revoke(user, PERM.WRITE);\nconsole.log(describe(user), \"stored as the single number\", user);",
              "label": "solution-30-2.js"
            },
            {
              "kind": "text",
              "text": "Why anyone bothers: one integer column in a database instead of a join table, and membership checks that are a single CPU instruction. The limit is 31 flags before you hit the signed 32-bit boundary — past that, use `BigInt` or a different design.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q57",
      "title": "What is a `Proxy`, and how does it differ from `Object.defineProperty`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A `Proxy` wraps an object and intercepts fundamental operations through traps — `get`, `set`, `has`, `deleteProperty`, `ownKeys`, `apply`, `construct` and others. `Reflect` provides the default implementation of each, so a trap can add behaviour and then delegate."
        },
        {
          "kind": "text",
          "text": "The difference from `Object.defineProperty` is coverage. `defineProperty` installs a getter/setter on *one known key*, so it can't see properties added later, doesn't intercept `delete` or `in`, and needs a recursive walk of the object upfront. A proxy intercepts *any* key, including ones that don't exist yet, and does so lazily. That's precisely why Vue 2 used `defineProperty` and had documented caveats about added properties and array index assignment, while Vue 3 switched to `Proxy` and dropped them."
        },
        {
          "kind": "text",
          "text": "Trade-offs worth stating: proxies are meaningfully slower per access, can't be polyfilled, must honour the target's invariants or they throw, and add indirection that confuses debugging — so they belong in framework-level code, not everyday application logic."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q58",
      "title": "When would you use typed arrays or bitwise operations?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Typed arrays and `ArrayBuffer` whenever you're handling raw binary: `fetch(...).arrayBuffer()`, file and `Blob` reads, canvas `ImageData`, WebAudio, WebGL vertex data, WebSocket binary frames, and Web Crypto. They're fixed-length, single-type and contiguous, so they're far more memory-efficient than a regular array of numbers and can be transferred to a worker with zero copying. `DataView` is the variant to use when a format mixes types or specifies endianness."
        },
        {
          "kind": "text",
          "text": "Bitwise operations for packing many booleans into one integer — permission and feature flags — and for low-level work like hashing, parity checks and colour channel extraction. The caveats to name: operands are coerced to 32-bit signed integers, so anything above 2³¹−1 breaks and needs `BigInt`; and tricks like `n | 0` or `~~n` for truncation are less readable than `Math.trunc` and fail on large numbers, so they're not worth the cleverness in application code."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "From `console.log(\"hi\")` in Module 1 to intercepting property access in Module 30. There is more JavaScript to meet — but from here it's libraries, frameworks and platforms, not the language itself. What's left is practice: build the projects, read other people's code, and explain what you've learned to someone else, which is the fastest way to find the parts you only think you know."
        }
      ],
      "title": "That's the language"
    }
  ]
};
