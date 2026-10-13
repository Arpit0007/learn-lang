import { Lesson } from '../../shared/content';

export const M3_STRINGS: Lesson = {
  "slug": "m3-strings",
  "title": "M3 Strings",
  "nav": "Strings",
  "num": "M3",
  "eyebrow": "Level 1 · Week 1 · ~2 sessions · PCC ch.2",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A string is text. Once made, text cannot be changed."
        },
        {
          "kind": "text",
          "text": "So `name.upper()` does **not** change `name`. It hands you back new text. You must save it: `name = name.upper()`."
        },
        {
          "kind": "text",
          "text": "An f-string, `f\"hi {name}\"`, is the easy way to put values inside text."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "A string is an **immutable** sequence of characters. Immutable means every \"modifying\" method returns a *new* string and leaves the original alone — a fact that trips up everyone at least once. Single, double and triple quotes all work; pick one style and be consistent, using the other to avoid escaping."
    },
    {
      "kind": "text",
      "text": "**f-strings** are how you build strings in modern Python. Anything in braces is an expression, evaluated and inserted."
    },
    {
      "kind": "example",
      "code": "name = \"arpit jain\"\n\nprint(name.title())        # methods RETURN a new string\nprint(name.upper())\nprint(name)                # ...the original is untouched\n\nfirst, last = name.split()\nprint(f\"{last.title()}, {first.title()}\")\n\n# f-strings take any expression, plus format specs\nprice = 1234.5678\nprint(f\"{price:.2f}\")          # 2 decimal places\nprint(f\"{price:>12,.2f}\")      # width 12, right-aligned, thousands separator\nprint(f\"{name=}\")              # self-documenting: prints the expression too\n\n# whitespace and affixes\nmessy = \"  data.csv  \"\nprint(repr(messy.strip()))\nprint(\"data.csv\".removesuffix(\".csv\"))",
      "label": "strings.py",
      "output": "Arpit Jain\nARPIT JAIN\narpit jain\nJain, Arpit\n1234.57\n    1,234.57\nname='arpit jain'\n'data.csv'\ndata"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`name.title()` does not change `name`. It hands you a new string that you must assign: `name = name.title()`. Because strings are immutable, there is no in-place version and no error to warn you — the statement is legal and simply does nothing. When a string operation \"has no effect\", this is why in nine cases out of ten."
        }
      ],
      "title": "Trap · calling a method and throwing the result away"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "`\"banana\".strip(\"ba\")` gives `\"nan\"`, not `\"nana\"` — `strip` takes a *set of characters* to shave off both ends, not a prefix. That is exactly why `removeprefix()` and `removesuffix()` were added; use those when you mean a literal affix."
        }
      ],
      "title": "Also worth knowing · `strip()` is not a substring remover"
    },
    {
      "kind": "quiz",
      "question": "What does `\"3\" * 3` produce?",
      "options": [
        "`9`",
        "`\"9\"`",
        "A TypeError",
        "`\"333\"`"
      ],
      "answer": 3,
      "why": "**`\"333\"`.** `*` on a string and an int means repetition, not multiplication. Meanwhile `\"3\" + 3` *does* raise a `TypeError`, because Python refuses to guess whether you meant concatenation or arithmetic. That asymmetry — repetition allowed, addition refused — is a favourite interview probe."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 3.1",
      "title": "Name formatter",
      "blocks": [
        {
          "kind": "text",
          "text": "Given `full = \" eric MATTHES \"`, produce `\"Matthes, E.\"` using only string methods and an f-string. No slicing beyond one character."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "full = \"  eric MATTHES  \"\nfirst, last = full.strip().lower().split()\nprint(f\"{last.title()}, {first[0].upper()}.\")",
              "label": "solution-3-1.py"
            },
            {
              "kind": "text",
              "text": "Chaining reads left to right as a pipeline: trim, normalise case, split. Normalising *before* splitting means you never have to think about the original's casing again.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 3.2",
      "title": "Predict, then reveal",
      "blocks": [
        {
          "kind": "text",
          "text": "Write down every line's output before pressing Show output."
        },
        {
          "kind": "example",
          "code": "s = \"Python\"\nprint(s[0], s[-1])\nprint(s[1:4])\nprint(s * 2)\nprint(\"y\" in s, \"Y\" in s)\nprint(s.replace(\"P\", \"J\"), s)\nprint(len(s), s.index(\"t\"))",
          "label": "predict-3-2.py",
          "output": "P n\nyth\nPythonPython\nTrue False\nJython Python\n6 2"
        },
        {
          "kind": "text",
          "text": "Note line 5: `replace` returned a new string and `s` is unchanged — the trap above, seen in the wild.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q3",
      "title": "Why are Python strings immutable?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Three reasons, and naming more than one signals depth."
        },
        {
          "kind": "list",
          "ordered": false,
          "items": [
            "**Hashability.** Immutable objects can have a stable hash, so strings can be dictionary keys and set members. If a key could mutate, it would land in the wrong bucket and become unfindable.",
            "**Safety.** Strings are passed around constantly. Immutability means no function can alter a string you still hold a reference to, which removes an entire category of aliasing bug.",
            "**Optimisation.** CPython can intern and share short strings, and can cache their hashes, because they never change."
          ]
        },
        {
          "kind": "text",
          "text": "The cost is that building a string in a loop with `+=` is quadratic — each step allocates a new string. The idiom is to collect pieces in a list and `\"\".join(pieces)` once."
        }
      ]
    }
  ]
};
