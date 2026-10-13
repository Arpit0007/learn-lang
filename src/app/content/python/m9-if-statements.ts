import { Lesson } from '../../shared/content';

export const M9_IF_STATEMENTS: Lesson = {
  "slug": "m9-if-statements",
  "title": "M9 if statements and truthiness",
  "nav": "if & truthiness",
  "num": "M9",
  "eyebrow": "Level 1 · Week 4 · ~2 sessions · PCC ch.5",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "`if` runs code only when something is true."
        },
        {
          "kind": "text",
          "text": "Empty things count as false: empty list, empty text, `0`, and `None`. So `if my_list:` means “if it has anything in it”."
        },
        {
          "kind": "text",
          "text": "Use `==` to compare values. Use `is` only with `None`."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "A conditional test is any expression Python can judge true or false. `==` compares *values*; `is` compares *identity* — whether two names point at the same object. Confusing them is a top-five Python bug."
    },
    {
      "kind": "text",
      "text": "Beyond `True` and `False`, every object has a **truthiness**. Falsy: `False`, `None`, zero of any numeric type, and every empty container — `\"\"`, `[]`, `{}`, `()`, `set()`. Everything else is truthy. This is why `if my_list:` is the idiomatic emptiness check, not `if len(my_list) > 0:`."
    },
    {
      "kind": "example",
      "code": "age = 19\n\nif age < 4:\n    price = 0\nelif age < 18:\n    price = 25\nelif age < 65:\n    price = 40\nelse:\n    price = 20\nprint(price)\n\n# chained comparisons read like maths and evaluate once\nprint(18 <= age < 65)\n\n# and / or / not - lower precedence than comparisons, so parentheses are optional\nprint(age > 18 and age < 30)\nprint(\"py\" in \"python\", \"java\" not in \"python\")\n\n# truthiness\nfor value in [0, 1, \"\", \"x\", [], [0], None, {}]:\n    print(repr(value), \"->\", bool(value))",
      "label": "conditions.py",
      "output": "40\nTrue\nTrue\nTrue True\n0 -> False\n1 -> True\n'' -> False\n'x' -> True\n[] -> False\n[0] -> True\nNone -> False\n{} -> False"
    },
    {
      "kind": "text",
      "text": "Note `[0]` is truthy: a list containing a falsy item is still a non-empty list. Emptiness, not contents."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Always write `if x is None:`, never `if x == None:` — `None` is a singleton, identity is the correct test, and a class can override `__eq__` to lie about equality. Conversely, never use truthiness when zero is a legitimate value: `if count:` treats `0` and `None` identically, so a genuine count of zero silently takes the \"missing\" branch. When zero, empty string or empty list are real values you must distinguish from absent, test `is None` explicitly."
        }
      ],
      "title": "Trap · `== None` and the falsy-zero bug"
    },
    {
      "kind": "quiz",
      "question": "`a = [1, 2]`; `b = [1, 2]`. What are `a == b` and `a is b`?",
      "options": [
        "True and True",
        "False and False",
        "True and False",
        "False and True"
      ],
      "answer": 2,
      "why": "**True, then False.** Equal contents, different objects. `is` asks \"same object in memory?\" and these are two separately built lists. Small integers and short strings can appear to break this because CPython interns them — `256 is 256` is `True` while `257 is 257` may not be — which is exactly why you must never use `is` for value comparison. Reserve it for `None`, `True`, `False` and genuine identity checks."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 9.1",
      "title": "Alien colours, and an empty list",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a scoring function for an alien colour: green scores 5, yellow 10, red 15. Then handle a list of aliens, printing a message when the list is empty — using truthiness, not `len()`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "def points_for(colour):\n    if colour == \"green\":\n        return 5\n    elif colour == \"yellow\":\n        return 10\n    elif colour == \"red\":\n        return 15\n    return 0            # unknown colour - explicit default beats falling off the end\n\naliens = [\"green\", \"red\", \"green\"]\n\nif aliens:\n    total = sum(points_for(a) for a in aliens)\n    print(f\"Shot {len(aliens)} aliens for {total} points.\")\nelse:\n    print(\"No aliens left - you cleared the level!\")",
              "label": "solution-9-1.py",
              "output": "Shot 3 aliens for 25 points."
            },
            {
              "kind": "text",
              "text": "A dict would be better than the `elif` chain here — `{\"green\": 5, ...}.get(colour, 0)` — which is Module 10's point. Recognising when a chain of equality tests *is* a lookup table is a real skill.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q9",
      "title": "Difference between `is` and `==`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `==` asks whether two objects are *equivalent* and is customisable — it calls `__eq__`, so classes define what equality means for them. `is` asks whether two names refer to the *same object*, comparing identity, and cannot be overridden."
        },
        {
          "kind": "text",
          "text": "Use `is` only for singletons — `None`, `True`, `False` — and for deliberate identity checks such as sentinel objects. Everything else uses `==`. The classic trap: CPython caches small ints and interns some strings, so `is` sometimes appears to work for values and then fails on a larger number or a runtime-built string. Code that relies on that is depending on an implementation detail, not on the language."
        }
      ]
    }
  ]
};
