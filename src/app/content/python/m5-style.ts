import { Lesson } from '../../shared/content';

export const M5_STYLE: Lesson = {
  "slug": "m5-style",
  "title": "M5 Comments, style, and the Zen",
  "nav": "Comments & style",
  "num": "M5",
  "eyebrow": "Level 1 · Week 2 · ~1 session · PCC ch.2 & ch.4",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Python cares about the spaces at the start of a line. Use 4 spaces, never tabs."
        },
        {
          "kind": "text",
          "text": "Write comments that say **why**, not **what**. The code already says what it does."
        },
        {
          "kind": "text",
          "text": "A tool called Ruff fixes your spacing and style automatically, so you never have to think about it."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Python enforces indentation as syntax, so the language already dictates part of your formatting. **PEP 8** is the style guide for the rest: 4 spaces per level, never tabs; lines under 79 characters; `lower_snake_case` for functions and variables; two blank lines between top-level definitions, one between methods; imports at the top, one per line, grouped standard-library, then third-party, then local."
    },
    {
      "kind": "text",
      "text": "Do not memorise it. Install a formatter and stop thinking about it: **Ruff** is the current standard — one Rust binary that both lints and formats, and has largely replaced Black plus Flake8 plus isort."
    },
    {
      "kind": "text",
      "text": "On comments: explain *why*, not *what*. The code already says what it does. A comment that restates the line is noise that will drift out of date; a comment that records a decision or a constraint is worth more than the line it sits above."
    },
    {
      "kind": "example",
      "code": "# Bad: restates the code\ncount = count + 1      # add one to count\n\n# Good: records why this is here\ncount += 1             # off-by-one: the API's page numbers start at 1, not 0\n\n# A docstring is not a comment - it is a string the object carries at runtime\ndef slugify(title):\n    \"\"\"Return `title` lowercased with spaces as hyphens.\n\n    Used for URLs, so the result must stay stable: changing this\n    function breaks every link already published.\n    \"\"\"\n    return title.lower().replace(\" \", \"-\")\n\nprint(slugify(\"The Python Ladder\"))\nprint(slugify.__doc__.splitlines()[0])",
      "label": "style.py",
      "output": "the-python-ladder\nReturn `title` lowercased with spaces as hyphens."
    },
    {
      "kind": "example",
      "code": "pip install ruff\nruff format .        # rewrite files to a consistent style\nruff check . --fix   # find and auto-fix lint problems",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Run `import this` in a REPL. Nineteen aphorisms by Tim Peters that explain most of Python's design arguments. The four that will actually change your code: *Explicit is better than implicit* — no magic, name what you mean. *Simple is better than complex* — reach for a loop before a clever one-liner. *Readability counts* — this is why the style guide exists at all. *There should be one obvious way to do it* — when you find three ways, one of them is the Python way, and it is usually the boring one."
        }
      ],
      "title": "The Zen of Python"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Python 3 refuses to guess: mixing tabs and spaces for indentation in the same block raises `TabError: inconsistent use of tabs and spaces in indentation`. It is maddening to debug by eye because both look identical on screen. Set your editor to insert 4 spaces for the Tab key and enable \"render whitespace\" once, and the problem disappears permanently. A formatter also normalises it on save."
        }
      ],
      "title": "Trap · tabs mixed with spaces"
    },
    {
      "kind": "quiz",
      "question": "Which is a docstring rather than a comment?",
      "options": [
        "`# Returns the user's full name`",
        "A string literal as the first statement in a function body",
        "Any triple-quoted string anywhere in a file",
        "A comment beginning `#:`"
      ],
      "answer": 1,
      "why": "**A string literal as the first statement.** Position is what makes it a docstring — it gets attached to the object as `__doc__`, which is how `help()`, IDE tooltips and doc generators read it. Triple quotes are just the convenient way to write a multi-line one; a triple-quoted string elsewhere is an ordinary, immediately discarded string."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 5.1",
      "title": "Fix the style, keep the meaning",
      "blocks": [
        {
          "kind": "text",
          "text": "Rewrite this so it passes `ruff check`, then replace the useless comment with one that records *why*."
        },
        {
          "kind": "example",
          "code": "import os,sys\ndef CalcTotal( items,TaxRate = 0.18 ):\n  total=0\n  for i in items: total=total+i   # add i to total\n  return total*(1+TaxRate)",
          "label": "before.py"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "def calculate_total(items, tax_rate=0.18):\n    \"\"\"Return the sum of `items` with GST applied.\"\"\"\n    # 18% is India's standard GST slab for this product category;\n    # change it here, not at the call sites.\n    subtotal = sum(items)\n    return subtotal * (1 + tax_rate)",
              "label": "after.py",
              "output": "$ ruff check after.py\nAll checks passed!"
            },
            {
              "kind": "text",
              "text": "Six fixes: `lower_snake_case` name and parameter, 4-space indent, no spaces inside the parentheses, no body on the same line as the `for`, unused imports deleted, and `sum()` instead of a hand-rolled accumulator. The comment now records a decision rather than narrating the line.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q5",
      "title": "What is PEP 8, and do you follow it strictly?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** PEP 8 is the official style guide for Python code — a PEP is a Python Enhancement Proposal, the numbered documents through which the language is designed. It covers naming, whitespace, imports, line length and layout."
        },
        {
          "kind": "text",
          "text": "The mature answer is that consistency inside a codebase beats compliance with the document. PEP 8 says so itself: it lists reasons to ignore it, including when following it would break consistency with surrounding code. In practice I let a formatter such as Ruff enforce it in CI so it stops being a review topic, and I keep the two conventions that carry real meaning — `CapWords` for classes and a leading underscore for internal names — because those communicate intent rather than just alignment."
        }
      ]
    }
  ]
};
