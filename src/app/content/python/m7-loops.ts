import { Lesson } from '../../shared/content';

export const M7_LOOPS: Lesson = {
  "slug": "m7-loops",
  "title": "M7 Loops, range, and comprehensions",
  "nav": "Loops & comprehensions",
  "num": "M7",
  "eyebrow": "Level 1 · Week 3 · ~3 sessions · PCC ch.4",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A `for` loop does something once for each item."
        },
        {
          "kind": "text",
          "text": "In Python you loop over the *things*, not over numbers: `for name in names`."
        },
        {
          "kind": "text",
          "text": "Lines inside the loop must be indented. A comprehension is a short way to build a new list from an old one."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "A `for` loop in Python iterates over *items*, not indices. There is no counter to initialise and no bound to get wrong. If you find yourself writing `for i in range(len(things))`, you almost always wanted `for thing in things` — or `enumerate()` if you genuinely need the position too."
    },
    {
      "kind": "text",
      "text": "Indentation is what defines the loop body, so it is syntax and not decoration. Four spaces. The colon at the end of the `for` line announces that a block follows."
    },
    {
      "kind": "example",
      "code": "langs = [\"python\", \"rust\", \"go\"]\n\nfor lang in langs:                       # iterate items\n    print(f\"I like {lang.title()}.\")\n\nfor i, lang in enumerate(langs, start=1):    # ...with positions\n    print(f\"{i}. {lang}\")\n\nfor lang, year in zip(langs, [1991, 2015, 2009]):   # two sequences in step\n    print(f\"{lang} appeared in {year}\")\n\nprint(list(range(5)))          # stop only: 0..4, upper bound EXCLUSIVE\nprint(list(range(2, 11, 3)))   # start, stop, step\n\nsquares = [n ** 2 for n in range(1, 6)]              # comprehension\nevens   = [n for n in range(10) if n % 2 == 0]       # ...with a filter\nprint(squares, evens)\nprint(min(squares), max(squares), sum(squares))",
      "label": "loops.py",
      "output": "I like Python.\nI like Rust.\nI like Go.\n1. python\n2. rust\n3. go\npython appeared in 1991\nrust appeared in 2015\ngo appeared in 2009\n[0, 1, 2, 3, 4]\n[2, 5, 8]\n[1, 4, 9, 16, 25] [0, 2, 4, 6, 8] 1 25 55"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The indentation errors, all five"
    },
    {
      "kind": "table",
      "head": [
        "Mistake",
        "What Python says",
        "What actually happened"
      ],
      "rows": [
        [
          "Body not indented",
          "`IndentationError: expected an indented block`",
          "You promised a block with `:` and delivered none."
        ],
        [
          "Second line under-indented",
          "No error at all",
          "It ran *once*, after the loop. The silent one — and the worst."
        ],
        [
          "Indented for no reason",
          "`IndentationError: unexpected indent`",
          "A block with nothing to belong to."
        ],
        [
          "Code after the loop still indented",
          "No error",
          "It ran on every pass instead of once at the end."
        ],
        [
          "Forgot the colon",
          "`SyntaxError: expected ':'`",
          "Python never saw a block starting."
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`range(1, 5)` yields 1, 2, 3, 4 — not 5. This is consistent with slicing, and it makes `range(len(x))` and `range(a, b)` compose without off-by-ones, but it catches everyone once. `range` is also *lazy*: it does not build a list, which is why `range(10 ** 12)` is instant and harmless. Wrap it in `list()` only when you actually need the values materialised."
        }
      ],
      "title": "Trap · `range()` excludes its upper bound"
    },
    {
      "kind": "quiz",
      "question": "What does `[n for n in range(3)]` differ in from `(n for n in range(3))`?",
      "options": [
        "Nothing — the parentheses are cosmetic",
        "The second is a tuple",
        "The second raises a SyntaxError",
        "The second is a lazy generator, not a sequence"
      ],
      "answer": 3,
      "why": "**The second is a generator expression.** It produces values on demand and can only be consumed once — there is no length, no indexing, and after you iterate it, it is spent. Use it when feeding something that consumes lazily, such as `sum(...)` over a huge input, so you never build the intermediate list. Note that a tuple comprehension does not exist; `tuple(n for n in range(3))` is how you get one. Module 23 goes deep on this."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 7.1",
      "title": "Cubes, three ways",
      "blocks": [
        {
          "kind": "text",
          "text": "Print the cubes of 1–10 with a plain `for` loop building a list, then with a comprehension, then compute their sum without building any list at all."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "cubes = []\nfor n in range(1, 11):\n    cubes.append(n ** 3)\nprint(cubes)\n\ncubes = [n ** 3 for n in range(1, 11)]\nprint(cubes)\n\nprint(sum(n ** 3 for n in range(1, 11)))   # generator: nothing stored",
              "label": "solution-7-1.py",
              "output": "[1, 8, 27, 64, 125, 216, 343, 512, 729, 1000]\n[1, 8, 27, 64, 125, 216, 343, 512, 729, 1000]\n3025"
            },
            {
              "kind": "text",
              "text": "The third form matters at scale: swap `11` for `10_000_001` and the first two allocate a list of ten million integers while the third uses constant memory.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q7",
      "title": "When should you *not* use a list comprehension?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Three cases. When you are looping for a **side effect** rather than to build a collection — writing files, printing, calling an API — a comprehension whose result you discard is misleading, and a plain `for` says what you mean. When the logic needs **more than one condition or a nested loop**, the comprehension stops being readable faster than most people expect; two `for` clauses plus an `if` is usually the line. And when the collection is **large and consumed once**, where a generator expression is strictly better because it avoids materialising the whole thing."
        },
        {
          "kind": "text",
          "text": "The underlying principle: a comprehension is for *transforming a sequence into another sequence*. If that is not what the loop is doing, it is the wrong tool, however clever it looks."
        }
      ]
    }
  ]
};
