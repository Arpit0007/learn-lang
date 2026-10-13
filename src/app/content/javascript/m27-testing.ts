import { Lesson } from '../../shared/content';

export const M27_TESTING: Lesson = {
  "slug": "m27-testing",
  "title": "M27 Testing your code",
  "nav": "Testing",
  "num": "M27",
  "eyebrow": "Level 7 · read in Week 13 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Tests are what let you change code without fear. For a job hunt they matter twice over: most teams require them, and a repository with tests immediately reads as professional. The concept is simple — call your function, assert what it should return, run all of it automatically."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A test runner is not magic"
    },
    {
      "kind": "text",
      "text": "Before installing anything, build one. Twenty lines, and the mystery is gone forever."
    },
    {
      "kind": "example",
      "code": "// ---- a complete (tiny) test framework ----\nconst results = { pass: 0, fail: 0 };\n\nfunction expect(actual) {\n  return {\n    toBe(expected) {\n      if (!Object.is(actual, expected)) throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);\n    },\n    toEqual(expected) {\n      const a = JSON.stringify(actual), b = JSON.stringify(expected);\n      if (a !== b) throw new Error(`expected ${b}, got ${a}`);\n    },\n    toThrow() {\n      let threw = false;\n      try { actual(); } catch { threw = true; }\n      if (!threw) throw new Error(\"expected the function to throw\");\n    },\n  };\n}\n\nfunction it(name, fn) {\n  try { fn(); results.pass++; console.log(\"PASS  \" + name); }\n  catch (err) { results.fail++; console.log(\"FAIL  \" + name + \" — \" + err.message); }\n}\n\n// ---- the code under test ----\nfunction slugify(input) {\n  if (typeof input !== \"string\") throw new TypeError(\"slugify needs a string\");\n  return input.toLowerCase().trim().replace(/[^\\w\\s-]/g, \"\").replace(/[\\s_-]+/g, \"-\");\n}\n\n// ---- the tests ----\nit(\"lowercases and hyphenates\", () => expect(slugify(\"Hello World\")).toBe(\"hello-world\"));\nit(\"strips punctuation\", () => expect(slugify(\"Hi, there!\")).toBe(\"hi-there\"));\nit(\"collapses repeated spaces\", () => expect(slugify(\"a   b\")).toBe(\"a-b\"));\nit(\"handles an empty string\", () => expect(slugify(\"\")).toBe(\"\"));\nit(\"rejects non-strings\", () => expect(() => slugify(42)).toThrow());\nit(\"this one is meant to fail\", () => expect(slugify(\"A B\")).toBe(\"wrong\"));\n\nconsole.log(`\\n${results.pass} passed, ${results.fail} failed`);",
      "label": "tiny-test-runner.js"
    },
    {
      "kind": "text",
      "text": "Vitest and Jest are that, plus a watcher, a runner, mocking and coverage. The API you just wrote is deliberately the same one they use."
    },
    {
      "kind": "example",
      "code": "// npm install -D vitest      then      \"test\": \"vitest\" in package.json\nimport { describe, it, expect, vi, beforeEach } from \"vitest\";\nimport { addItem, cartTotal, fetchPrice } from \"./cart.js\";\n\ndescribe(\"cartTotal\", () => {\n  // Arrange / Act / Assert — the shape of every good test\n  it(\"sums line totals with quantity\", () => {\n    const cart = [{ price: 100, qty: 2 }, { price: 50, qty: 1 }];   // arrange\n    const total = cartTotal(cart);                                  // act\n    expect(total).toBe(250);                                        // assert\n  });\n\n  // The edge cases are where the value is — not the happy path\n  it(\"returns 0 for an empty cart\", () => expect(cartTotal([])).toBe(0));\n  it(\"ignores items with quantity 0\", () => expect(cartTotal([{ price: 10, qty: 0 }])).toBe(0));\n  it(\"throws on a negative price\", () => expect(() => cartTotal([{ price: -1, qty: 1 }])).toThrow());\n});\n\ndescribe(\"addItem\", () => {\n  it(\"does not mutate the original cart\", () => {\n    const original = [{ id: 1, qty: 1 }];\n    const next = addItem(original, { id: 2, qty: 1 });\n    expect(original).toHaveLength(1);        // the test that catches mutation bugs\n    expect(next).toHaveLength(2);\n  });\n});\n\ndescribe(\"fetchPrice\", () => {\n  beforeEach(() => vi.restoreAllMocks());\n\n  it(\"returns the price from the API\", async () => {\n    // Never hit the real network in a unit test — mock it\n    vi.stubGlobal(\"fetch\", vi.fn().mockResolvedValue({\n      ok: true, json: async () => ({ price: 499 }),\n    }));\n    await expect(fetchPrice(\"sku-1\")).resolves.toBe(499);\n    expect(fetch).toHaveBeenCalledWith(\"/api/price/sku-1\");\n  });\n\n  it(\"throws a useful error on a 404\", async () => {\n    vi.stubGlobal(\"fetch\", vi.fn().mockResolvedValue({ ok: false, status: 404 }));\n    await expect(fetchPrice(\"nope\")).rejects.toThrow(\"HTTP 404\");\n  });\n});",
      "label": "cart.test.js — with Vitest",
      "run": "none"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "**Test:** pure logic (pricing, validation, formatting, sorting), edge cases (empty, null, one item, huge, negative, duplicate), error paths, and every bug you fix — that test is the proof it stays fixed. **Don't test:** the framework, third-party libraries, or private implementation details; a test that breaks when you rename an internal variable is a liability. Aim your assertions at *behaviour*: \"an empty cart totals zero\", not \"reduce was called three times\". And treat coverage as a smell detector, not a score to maximise."
        }
      ],
      "title": "What to test, and what not to"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 27.1",
      "title": "Test-drive a function",
      "blocks": [
        {
          "kind": "text",
          "text": "Using the tiny runner above, write the tests *first* for `clamp(value, min, max)` — including value below min, above max, inside range, equal to a boundary, and min greater than max. Then write the implementation until they all pass."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const results = { pass: 0, fail: 0 };\nconst expect = actual => ({\n  toBe(expected) { if (!Object.is(actual, expected)) throw new Error(`expected ${expected}, got ${actual}`); },\n  toThrow() { let t = false; try { actual(); } catch { t = true; } if (!t) throw new Error(\"expected a throw\"); },\n});\nconst it = (name, fn) => {\n  try { fn(); results.pass++; console.log(\"PASS  \" + name); }\n  catch (e) { results.fail++; console.log(\"FAIL  \" + name + \" — \" + e.message); }\n};\n\n// Tests written BEFORE the implementation — they define the contract\nit(\"returns the value when inside the range\", () => expect(clamp(5, 1, 10)).toBe(5));\nit(\"raises a value below min\", () => expect(clamp(-3, 1, 10)).toBe(1));\nit(\"lowers a value above max\", () => expect(clamp(99, 1, 10)).toBe(10));\nit(\"keeps a value equal to a boundary\", () => expect(clamp(10, 1, 10)).toBe(10));\nit(\"handles negative ranges\", () => expect(clamp(-50, -10, -1)).toBe(-10));\nit(\"rejects an inverted range\", () => expect(() => clamp(5, 10, 1)).toThrow());\n\nfunction clamp(value, min, max) {\n  if (min > max) throw new RangeError(\"min cannot exceed max\");\n  return Math.min(Math.max(value, min), max);\n}\n\nconsole.log(`\\n${results.pass} passed, ${results.fail} failed`);",
              "label": "solution-27-1.js"
            },
            {
              "kind": "text",
              "text": "Writing the tests first forced a decision you'd otherwise postpone: what *should* `clamp(5, 10, 1)` do? Silently return something, or refuse? That question is the real value of TDD — it makes you specify before you implement.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q54",
      "title": "What do you test, and how do you test async code?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I test behaviour at the boundaries I control: pure logic and its edge cases, error paths, and regressions for every fixed bug. I avoid asserting on implementation details so tests survive refactoring. The pyramid still holds — many fast unit tests, fewer integration tests, a handful of end-to-end journeys."
        },
        {
          "kind": "text",
          "text": "For async: `await` the call inside the test and assert on the result, or use `expect(promise).resolves`/`.rejects` so a rejection can't pass silently. Mock the network at the boundary — stub `fetch` or use MSW — rather than calling real services. Use fake timers for anything with `setTimeout`, debounce or polling, so a 300 ms debounce doesn't cost 300 ms per test. And always assert something about the failure case; a suite that only covers the happy path gives false confidence."
        }
      ]
    }
  ]
};
