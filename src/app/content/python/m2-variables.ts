import { Lesson } from '../../shared/content';

export const M2_VARIABLES: Lesson = {
  "slug": "m2-variables",
  "title": "M2 Variables, and what a name really is",
  "nav": "Variables & names",
  "num": "M2",
  "eyebrow": "Level 1 · Week 1 · ~2 sessions · PCC ch.2",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A variable is a name tag you stick on a thing. `x = 5` means “call this 5 by the name x”."
        },
        {
          "kind": "text",
          "text": "When you write `y = x`, you put a *second name tag on the same thing*. You did not make a copy."
        },
        {
          "kind": "text",
          "text": "This one idea explains most confusing Python bugs later on."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 250\" role=\"img\" aria-label=\"Two names pointing at one string object; after reassigning one name, it points at a new object while the other still points at the original.\">\n      <defs><marker id=\"a-m2\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><polygon points=\"0,1 9,5 0,9\" fill=\"currentColor\"></polygon></marker></defs>\n      <text x=\"0\" y=\"12\" class=\"dg-s\">BEFORE</text>\n      <rect x=\"4\" y=\"24\" width=\"120\" height=\"30\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"64\" y=\"44\" class=\"dg-t\" text-anchor=\"middle\">message</text>\n      <rect x=\"4\" y=\"72\" width=\"120\" height=\"30\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"64\" y=\"92\" class=\"dg-t\" text-anchor=\"middle\">greeting</text>\n      <rect x=\"350\" y=\"46\" width=\"150\" height=\"36\" rx=\"4\" class=\"dg-fill\"></rect>\n      <text x=\"425\" y=\"69\" class=\"dg-t\" text-anchor=\"middle\">\"Hello\"</text>\n      <line x1=\"128\" y1=\"39\" x2=\"345\" y2=\"60\" class=\"dg-l\" marker-end=\"url(#a-m2)\"></line>\n      <line x1=\"128\" y1=\"87\" x2=\"345\" y2=\"70\" class=\"dg-l\" marker-end=\"url(#a-m2)\"></line>\n      <text x=\"225\" y=\"36\" class=\"dg-s\" text-anchor=\"middle\">points at</text>\n\n      <line x1=\"0\" y1=\"128\" x2=\"540\" y2=\"128\" class=\"dg-d\"></line>\n      <text x=\"0\" y=\"152\" class=\"dg-s\">AFTER  message = \"Goodbye\"</text>\n      <rect x=\"4\" y=\"164\" width=\"120\" height=\"30\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"64\" y=\"184\" class=\"dg-t\" text-anchor=\"middle\">message</text>\n      <rect x=\"4\" y=\"208\" width=\"120\" height=\"30\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"64\" y=\"228\" class=\"dg-t\" text-anchor=\"middle\">greeting</text>\n      <rect x=\"350\" y=\"160\" width=\"150\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"425\" y=\"182\" class=\"dg-t\" text-anchor=\"middle\">\"Goodbye\"</text>\n      <rect x=\"350\" y=\"206\" width=\"150\" height=\"34\" rx=\"4\" class=\"dg-fill\"></rect>\n      <text x=\"425\" y=\"228\" class=\"dg-t\" text-anchor=\"middle\">\"Hello\"</text>\n      <line x1=\"128\" y1=\"179\" x2=\"345\" y2=\"177\" class=\"dg-l\" marker-end=\"url(#a-m2)\"></line>\n      <line x1=\"128\" y1=\"223\" x2=\"345\" y2=\"223\" class=\"dg-l\" marker-end=\"url(#a-m2)\"></line>\n    </svg>",
      "caption": "A name is a label, not a box. Both names pointed at one object. Giving `message` a new value moved only that label — the object `greeting` holds was never touched."
    },
    {
      "kind": "text",
      "text": "In many languages a variable is a box that holds a value. In Python it is a **label tied to an object**. Assignment never copies the object; it points a name at one. Matthes calls this \"variables are labels\", and it is the most load-bearing sentence in the whole book — nearly every confusing Python bug in Level 4 comes from forgetting it."
    },
    {
      "kind": "text",
      "text": "Naming rules: letters, digits and underscores; cannot start with a digit; no spaces; not a keyword. Convention, which matters more than the rules: `lower_snake_case` for variables and functions, `UPPER_SNAKE_CASE` for constants, `CapWords` for classes."
    },
    {
      "kind": "example",
      "code": "message = \"Hello\"\ngreeting = message          # both names now point at the SAME string object\n\nprint(id(message) == id(greeting))   # same object?\nmessage = \"Goodbye\"                  # rebinds `message`; `greeting` is untouched\nprint(message, greeting)\n\n# Constants are a convention, not a rule - Python will not stop you\nMAX_RETRIES = 3\nMAX_RETRIES = 4              # legal, but you have just lied to every reader\n\n# Multiple assignment\nx, y, z = 0, 0, 0\na = b = c = 1\nprint(x, y, z, a, b, c)",
      "label": "names.py",
      "output": "True\nGoodbye Hello\n0 0 0 1 1 1"
    },
    {
      "kind": "text",
      "text": "Rebinding a name is not mutating an object. `message = \"Goodbye\"` did not change the string `\"Hello\"` — strings cannot be changed at all — it pointed `message` somewhere new. `greeting` still holds the original. Module 22 shows what happens when the object *can* be changed, which is where this stops being trivia."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Python is case-sensitive and has no variable declarations, so `usre_name = \"x\"` followed by `print(user_name)` is two different names and a `NameError`, while `user_name = \"x\"` followed by `usre_name = \"y\"` silently creates a second variable and no error at all. There is no compiler to catch it. Pylance in VS Code flags unused names, and Module 26's type checker catches more — turn both on early."
        }
      ],
      "title": "Trap · `NameError` from a typo you cannot see"
    },
    {
      "kind": "quiz",
      "question": "After `a = [1, 2]` and `b = a` and `b.append(3)`, what is `a`?",
      "options": [
        "`[1, 2]`",
        "`[1, 2, 3]` only if you also reassign",
        "`[1, 2, 3]`",
        "It raises a TypeError"
      ],
      "answer": 2,
      "why": "**`[1, 2, 3]`.** `b = a` made a second label for one list, and `append` mutates that list in place. Both names see the change because there is only one object. This is the single most common source of \"my function corrupted my data\" bugs, and Module 22 covers the fix."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 2.1",
      "title": "Labels, not boxes",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a script that proves rebinding and mutating are different: use `id()` to show that rebinding a name changes which object it points to, while mutating a list keeps the same `id`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "nums = [1, 2]\nprint(\"before  \", id(nums))\n\nnums.append(3)          # mutation: same object, new contents\nprint(\"mutated \", id(nums), nums)\n\nnums = [9, 9]           # rebinding: brand new object\nprint(\"rebound \", id(nums), nums)",
              "label": "solution-2-1.py"
            },
            {
              "kind": "text",
              "text": "The first two ids match; the third does not. `id()` is a debugging tool, not something to put in real code.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q2",
      "title": "Does Python pass by value or by reference?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Neither, precisely. Python passes *object references by value* — often called \"pass by assignment\". The function's parameter becomes a new name bound to the same object the caller passed."
        },
        {
          "kind": "text",
          "text": "The practical consequence: if you *mutate* the object inside the function (`lst.append(x)`, `d[\"k\"] = v`), the caller sees it, because there is one object. If you *rebind* the parameter (`lst = []`), the caller sees nothing, because you only moved the local name. So \"can this function change my data?\" depends entirely on whether the object is mutable and whether the function mutates or rebinds — not on any calling convention."
        }
      ]
    }
  ]
};
