import { Lesson } from '../../shared/content';

export const M26_TYPE_HINTS: Lesson = {
  "slug": "m26-type-hints",
  "title": "M26 Type hints and static checking",
  "nav": "Type hints",
  "num": "M26",
  "eyebrow": "Level 4 · Week 13 · ~3 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Type hints are notes saying what kind of value goes in and comes out."
        },
        {
          "kind": "text",
          "text": "Python itself ignores them completely — nothing is checked when you run."
        },
        {
          "kind": "text",
          "text": "But a tool like mypy reads them and finds bugs *before* you run. The biggest win is marking things that might be `None`."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Python is dynamically typed and stays that way — annotations are **not enforced at runtime**. Their value is that a checker such as **mypy** or **pyright** (which powers Pylance in VS Code) reads them and finds a whole class of bug before you run anything, while your editor uses them for completion and refactoring."
    },
    {
      "kind": "text",
      "text": "Modern syntax is much lighter than the old `typing` imports: use built-in generics `list[str]`, `dict[str, int]`, and `X | None` instead of `Optional[X]`."
    },
    {
      "kind": "example",
      "code": "from dataclasses import dataclass\nfrom typing import Protocol, TypedDict\n\ndef greet(name: str, times: int = 1) -> str:\n    return f\"hi {name} \" * times\n\ndef find(names: list[str], q: str) -> str | None:     # may return nothing\n    for n in names:\n        if q in n:\n            return n\n    return None\n\n# annotations are ignored at runtime - this \"works\"\nprint(greet(42, 1))          # mypy: error, Python: runs anyway\n\nmatch = find([\"ada\", \"grace\"], \"ra\")\nprint(match.upper() if match else \"not found\")   # checker FORCES the None test\n\nclass Named(Protocol):\n    \"\"\"Structural typing: anything with a `name` attribute satisfies this.\n    No inheritance required - this is duck typing the checker understands.\"\"\"\n    name: str\n\n@dataclass\nclass User:\n    name: str\n\ndef label(thing: Named) -> str:\n    return thing.name.title()\n\nprint(label(User(\"arpit\")))\n\nclass Row(TypedDict):        # for JSON-shaped dicts you didn't design\n    id: int\n    email: str\n\nrow: Row = {\"id\": 1, \"email\": \"a@b.com\"}\nprint(row[\"email\"])",
      "label": "typing_basics.py",
      "output": "hi 42 \nGRACE\nArpit\na@b.com"
    },
    {
      "kind": "example",
      "code": "pip install mypy\nmypy typing_basics.py\n# typing_basics.py:13: error: Argument 1 to \"greet\" has\n#   incompatible type \"int\"; expected \"str\"  [arg-type]",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Most production Python bugs are an unexpected `None`. Annotating a return as `str | None` makes the checker refuse to let you call `.upper()` on it until you have handled the `None` branch — the error moves from a 3am `AttributeError` to a squiggle in your editor. If you adopt one typing habit, make it annotating anything that can return nothing."
        }
      ],
      "title": "The real payoff is `| None`"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Under PEP 649, annotations are evaluated *lazily* rather than at definition time. Practically: forward references no longer need quotes, so a method can annotate its own class (`def clone(self) -> Self`, or `-> Node` inside `class Node`) without the old `from __future__ import annotations` dance. Advice written before 2025 about quoting forward references is now out of date."
        }
      ],
      "title": "3.14 changed how annotations are evaluated"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Annotating something `Any` — or leaving a function entirely unannotated, which mypy treats the same way by default — does not mean \"could be anything, check carefully\". It means \"stop checking here\", and the hole propagates: every value derived from an `Any` is also unchecked, so one `Any` in a hot path can disable checking across a whole call chain while the annotations around it still look reassuring. Use `object` when you genuinely accept anything (the checker then forces you to narrow it), and turn on `disallow_untyped_defs` once a codebase is mostly annotated."
        }
      ],
      "title": "Trap · `Any` silently switches the checker off"
    },
    {
      "kind": "quiz",
      "question": "What happens at runtime if you pass an `int` where `str` is annotated?",
      "options": [
        "TypeError immediately",
        "A warning is printed",
        "Nothing — annotations are not enforced",
        "The value is coerced to `str`"
      ],
      "answer": 2,
      "why": "**Nothing.** CPython stores annotations as metadata and never checks them. The function runs and fails only if the body does something the value cannot support — which may be much later, or never. That is precisely why a static checker in CI is the point: without one, annotations are documentation that can quietly become wrong. Libraries such as Pydantic add runtime validation on top, but that is their feature, not the language's."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 26.1",
      "title": "Let the checker find the bug",
      "blocks": [
        {
          "kind": "text",
          "text": "Annotate this function, run `mypy`, and watch it flag a bug that Python itself would only hit at runtime — and only for some inputs."
        },
        {
          "kind": "example",
          "code": "def first_admin(users):\n    for u in users:\n        if u.get(\"admin\"):\n            return u[\"name\"]\n    # falls off the end -> returns None\n\nprint(first_admin([{\"name\": \"ada\"}]).upper())",
          "label": "before.py"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "from typing import TypedDict\n\nclass User(TypedDict):\n    name: str\n    admin: bool\n\ndef first_admin(users: list[User]) -> str | None:\n    for u in users:\n        if u[\"admin\"]:\n            return u[\"name\"]\n    return None                     # explicit, not implicit\n\nfound = first_admin([{\"name\": \"ada\", \"admin\": False}])\nprint(found.upper() if found else \"no admin\")   # the check mypy forced",
              "label": "after.py",
              "output": "$ mypy before.py\nbefore.py:7: error: Item \"None\" of \"str | None\" has no attribute \"upper\"  [union-attr]\nFound 1 error in 1 file (checked 1 source file)\n\n$ python after.py\nno admin"
            },
            {
              "kind": "text",
              "text": "The original crashes with `AttributeError: 'NoneType' object has no attribute 'upper'` — but only when the list happens to contain no admin, which is exactly the case your manual testing skips. Annotating the return as `str | None` is what turns a production incident into an editor squiggle.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q26",
      "title": "If Python ignores type hints, why bother?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Because the value is realised before runtime, by tools. A checker in CI catches wrong argument types, missing `None` handling, unreachable branches and incompatible refactors across a codebase no one person has read. Editors turn annotations into accurate completion, go-to-definition and safe renames. And they are documentation that cannot drift, because the checker fails when it stops matching the code."
        },
        {
          "kind": "text",
          "text": "The honest limits are worth stating too: they add no runtime safety, they can be wrong if nothing checks them, and over-precise generics in application code cost more in readability than they return. My rule is annotate public function signatures and dataclass fields, stay light inside function bodies, and run the checker in CI so the annotations are load-bearing rather than decorative. For data arriving from outside — request payloads, config files — I use Pydantic, because that is where runtime validation genuinely is needed."
        }
      ]
    }
  ]
};
