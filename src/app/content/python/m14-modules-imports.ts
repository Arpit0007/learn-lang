import { Lesson } from '../../shared/content';

export const M14_MODULES_IMPORTS: Lesson = {
  "slug": "m14-modules-imports",
  "title": "M14 Modules, imports, and `__name__`",
  "nav": "Modules & imports",
  "num": "M14",
  "eyebrow": "Level 2 · Week 6 · ~1 session · PCC ch.8 & ch.9",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Every `.py` file is a module, and you can use its code in another file with `import`."
        },
        {
          "kind": "text",
          "text": "Importing a file *runs* it. So put `if __name__ == \"__main__\":` around anything you only want to happen when that file is started directly."
        },
        {
          "kind": "text",
          "text": "Never name your file after a library, like `random.py`. It will break things."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Any `.py` file is a **module**. Importing it runs it top to bottom, once per process, and caches the result — so a second import of the same module does not re-execute it. A folder of modules is a **package**."
    },
    {
      "kind": "text",
      "text": "Because import *runs* the file, anything at top level executes on import. That is why executable code belongs behind the `__name__` guard."
    },
    {
      "kind": "example",
      "code": "\"\"\"A module: definitions at top level, execution behind the guard.\"\"\"\n\nTOPPINGS = [\"mushrooms\", \"olives\"]\n\ndef make(size, *toppings):\n    return f\"{size}cm pizza with {', '.join(toppings) or 'nothing'}\"\n\ndef _internal_helper():\n    \"\"\"Leading underscore = internal by convention. `import *` skips it.\"\"\"\n    return \"not part of the public API\"\n\nif __name__ == \"__main__\":\n    # runs ONLY when this file is executed directly,\n    # never when it is imported by another module\n    print(make(30, *TOPPINGS))",
      "label": "pizza.py"
    },
    {
      "kind": "example",
      "code": "import pizza                          # whole module: pizza.make(...)\nfrom pizza import make                # one name\nfrom pizza import make as make_pizza   # aliased\nimport pizza as pz                    # module aliased\n# from pizza import *                 # DON'T - hides where names came from\n\nprint(pizza.make(25, \"olives\"))\nprint(make_pizza(40, \"mushrooms\", \"basil\"))\nprint(pz.TOPPINGS)\nprint(pizza.__name__, __name__)",
      "label": "main.py",
      "output": "25cm pizza with olives\n40cm pizza with mushrooms, basil\n['mushrooms', 'olives']\npizza __main__"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Name a file `random.py`, `json.py`, `types.py` or `email.py` in your project folder and your own file wins the import — every library that needed the real one breaks, with errors that look nothing like the cause (`AttributeError: module 'random' has no attribute 'randint'`). Same for a stray `test.py`. Check a name is free before using it, and never name a file after the module you are importing in it."
        }
      ],
      "title": "Trap · shadowing a standard-library name"
    },
    {
      "kind": "quiz",
      "question": "What is `__name__` equal to inside a file that is being imported?",
      "options": [
        "The module's name, e.g. `\"pizza\"`",
        "`\"__main__\"`",
        "`None`",
        "The importing module's name"
      ],
      "answer": 0,
      "why": "**The module's own name.** Python sets `__name__` to `\"__main__\"` only in the file you launched directly; in every imported module it is that module's name. So `if __name__ == \"__main__\":` reads as \"only when run as a script\", which is what lets one file be both an importable library and a runnable program — and what stops a module's demo code from firing every time someone imports it."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 14.1",
      "title": "Split one script into a module and an entry point",
      "blocks": [
        {
          "kind": "text",
          "text": "Take a single file that defines two functions and then calls them at top level. Split it into `temperature.py` (definitions only) and `main.py` (the run). Prove the split worked by importing the module in a REPL and seeing nothing print."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "\"\"\"Temperature conversions. Importing this prints nothing.\"\"\"\n\nABSOLUTE_ZERO_C = -273.15\n\ndef c_to_f(celsius):\n    return celsius * 9 / 5 + 32\n\ndef f_to_c(fahrenheit):\n    return (fahrenheit - 32) * 5 / 9\n\nif __name__ == \"__main__\":\n    print(c_to_f(100))        # only when run directly",
              "label": "temperature.py"
            },
            {
              "kind": "example",
              "code": ">>> import temperature          # silence = the guard works\n>>> temperature.c_to_f(37)\n98.6\n>>> temperature.__name__\n'temperature'",
              "label": "repl",
              "output": "98.6\n'temperature'"
            },
            {
              "kind": "text",
              "text": "If importing had printed `212.0`, the guard was missing. That is the whole test — and it is why every library you will ever import can be imported safely.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q14",
      "title": "Why is `from module import *` discouraged?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Three reasons. It **hides provenance** — a reader cannot tell where a name came from, and neither can a linter or an IDE. It **silently shadows** — a later star-import can overwrite names from an earlier one, or your own, with no warning. And it **couples you to the module's internals**, since anything the module happens to define at top level, including its own imports, lands in your namespace."
        },
        {
          "kind": "text",
          "text": "The exceptions are narrow: a package's own `__init__.py` re-exporting a curated API, and interactive REPL work where convenience wins. A module can limit the damage by defining `__all__`, which is also the explicit way to declare its public surface."
        }
      ]
    }
  ]
};
