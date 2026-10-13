import { Lesson } from '../../shared/content';

export const M4_NUMBERS: Lesson = {
  "slug": "m4-numbers",
  "title": "M4 Numbers, and the float trap",
  "nav": "Numbers & floats",
  "num": "M4",
  "eyebrow": "Level 1 · Week 2 · ~1 session · PCC ch.2",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Python has whole numbers (`int`) and decimal numbers (`float`)."
        },
        {
          "kind": "text",
          "text": "Whole numbers can be as big as you want. Decimal numbers are slightly wrong — `0.1 + 0.2` is not exactly `0.3`."
        },
        {
          "kind": "text",
          "text": "So never use `float` for money. Use `Decimal`, or count in paise."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Two numeric types matter: `int` and `float`. Python integers have **arbitrary precision** — no 32-bit or 64-bit ceiling, so `2 ** 1000` is exact. Floats are IEEE-754 doubles and are *not* exact for most decimals, because a finite binary fraction cannot represent 0.1 any more than a finite decimal can represent one third."
    },
    {
      "kind": "example",
      "code": "print(7 / 2)      # true division - ALWAYS a float\nprint(7 // 2)     # floor division - rounds toward negative infinity\nprint(-7 // 2)\nprint(7 % 2)      # modulo - the remainder\nprint(2 ** 10)    # exponent\nprint(2 ** 100)   # ints are unbounded\n\nprint(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)\nprint(round(0.1 + 0.2, 2) == 0.3)\n\nuniverse_age = 14_000_000_000   # underscores are ignored, purely for reading\nprint(universe_age)",
      "label": "numbers.py",
      "output": "3.5\n3\n-4\n1\n1024\n1267650600228229401496703205376\n0.30000000000000004\nFalse\nTrue\n14000000000"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`0.1 + 0.2 != 0.3` is not a Python bug; it is binary floating point, and every language with doubles has it. For currency use `decimal.Decimal(\"0.10\")` — note the *string* argument, since `Decimal(0.1)` just inherits the float's error. For comparing measured floats use `math.isclose(a, b)` rather than `==`. And `-7 // 2` being `-4` rather than `-3` catches people too: Python floors toward negative infinity, unlike C and Java, which truncate toward zero."
        }
      ],
      "title": "Trap · never use floats for money"
    },
    {
      "kind": "quiz",
      "question": "What is `type(6 / 3)`?",
      "options": [
        "`float`",
        "`int`",
        "`int` because it divides evenly",
        "`Decimal`"
      ],
      "answer": 0,
      "why": "**`float`.** The `/` operator always returns a float, even when the division is exact — so `6 / 3` is `2.0`. If you need an int, use `//`. This bites when a float sneaks into a list index and raises `TypeError: list indices must be integers`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 4.1",
      "title": "Money, done right",
      "blocks": [
        {
          "kind": "text",
          "text": "Add ₹19.99 and ₹0.01 three ways — with floats, with `Decimal` from strings, and by working in integer paise — and print all three."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "from decimal import Decimal\n\nprint(19.99 + 0.01)                              # float\nprint(Decimal(\"19.99\") + Decimal(\"0.01\"))        # exact decimal\nprint((1999 + 1) / 100)                          # integer paise, divided at the end",
              "label": "solution-4-1.py",
              "output": "20.0\n20.00\n20.0"
            },
            {
              "kind": "text",
              "text": "Note `Decimal` keeps the two-decimal *scale*, printing `20.00`. That matters for invoices. The integer-paise approach is what payment systems actually use.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q4",
      "title": "Why is `0.1 + 0.2 != 0.3`, and what do you do about it?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Floats are base-2. 0.1 in binary is a repeating fraction, so it is stored as the nearest representable double, which is slightly more than 0.1. Two such errors add and the sum lands a few quintillionths above 0.3, and 0.3 itself is stored as its own nearest double — the two do not coincide."
        },
        {
          "kind": "text",
          "text": "What to do depends on the domain. Money or anything audited: `decimal.Decimal` constructed from strings, or integer minor units. Measurements and scientific values: compare with `math.isclose()` and never with `==`. Exact rational arithmetic: `fractions.Fraction`. Display only: `round()` or an f-string format spec — but that fixes the printing, not the arithmetic, and confusing those two is the follow-up question."
        }
      ]
    }
  ]
};
