import { Lesson } from '../../shared/content';

export const GLOSSARY: Lesson = {
  "slug": "glossary",
  "title": "Glossary",
  "eyebrow": "Reference",
  "blocks": [
    {
      "kind": "table",
      "head": [
        "Term",
        "Meaning"
      ],
      "rows": [
        [
          "argument / parameter",
          "A parameter is the name in the definition; an argument is the value passed at the call."
        ],
        [
          "callable",
          "Anything you can invoke with `()` — functions, classes, and objects defining `__call__`."
        ],
        [
          "closure",
          "A nested function that keeps access to names from the scope where it was defined."
        ],
        [
          "comprehension",
          "`[f(x) for x in xs if p(x)]` — turning one sequence into another in a single expression."
        ],
        [
          "context manager",
          "An object usable with `with`, guaranteeing teardown via `__exit__`."
        ],
        [
          "decorator",
          "A callable that takes a function and returns a replacement. `@d` means `f = d(f)`."
        ],
        [
          "duck typing",
          "Caring what an object can *do*, not what class it is. \"If it quacks, it's a duck.\""
        ],
        [
          "dunder",
          "A `__double_underscore__` name. Hooks the language calls on your behalf."
        ],
        [
          "EAFP",
          "Easier to ask forgiveness than permission — try it, handle the exception. Python's default style."
        ],
        [
          "f-string",
          "`f\"{expr}\"` — inline expression interpolation, with format specs after `:`."
        ],
        [
          "GIL",
          "The lock permitting one thread of Python bytecode at a time in standard CPython builds."
        ],
        [
          "generator",
          "An iterator written as a function containing `yield`. Lazy, single-use, constant memory."
        ],
        [
          "hashable",
          "Has a stable `__hash__`, so it can be a dict key or set member. Requires immutability."
        ],
        [
          "immutable",
          "Cannot be changed after creation: `int`, `str`, `tuple`, `frozenset`."
        ],
        [
          "iterable / iterator",
          "An iterable can produce an iterator; an iterator holds the position and is consumed once."
        ],
        [
          "module / package",
          "A module is a `.py` file; a package is a folder of modules."
        ],
        [
          "mutate vs rebind",
          "Mutating changes the object, so every name sees it. Rebinding points one name elsewhere."
        ],
        [
          "PEP",
          "Python Enhancement Proposal — the numbered documents through which the language changes."
        ],
        [
          "REPL",
          "The interactive prompt: read, eval, print, loop. The `>>>` prompt."
        ],
        [
          "shadowing",
          "A local name hiding an outer one — or your `random.py` hiding the standard library's."
        ],
        [
          "traceback",
          "The error report. Read bottom-up: last line is the exception, above it is the call stack."
        ],
        [
          "truthiness",
          "How an object behaves in a boolean test. Empty containers, zero and `None` are falsy."
        ],
        [
          "virtual environment",
          "A per-project folder with its own interpreter and packages. One per project, always."
        ]
      ]
    },
    {
      "kind": "text",
      "text": "**The Python Ladder** — 30 modules, Python 3.14, September 2026. Built on Eric Matthes, *Python Crash Course*, 3rd edition (No Starch Press, 2023), and extended past chapter 11 where that book stops. Version and feature data from the Python developer's guide and the 3.14 release notes.",
      "style": "small"
    },
    {
      "kind": "text",
      "text": "Code blocks show expected output rather than running live: predict first, then reveal. Type the examples into your own interpreter; that is the point anyway.",
      "style": "small"
    }
  ]
};
