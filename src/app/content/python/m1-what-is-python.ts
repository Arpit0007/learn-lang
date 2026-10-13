import { Lesson } from '../../shared/content';

export const M1_WHAT_IS_PYTHON: Lesson = {
  "slug": "m1-what-is-python",
  "title": "M1 What Python is, and your first output",
  "nav": "What Python is",
  "num": "M1",
  "eyebrow": "Level 0 · Week 1 · ~1 session · PCC ch.1",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Python is a program on your computer that reads your code and does what it says."
        },
        {
          "kind": "text",
          "text": "You write code in a text file ending in `.py`, then tell Python to run that file."
        },
        {
          "kind": "text",
          "text": "When you make a mistake, Python prints an error report called a traceback. **Read the last line first** — that line says what went wrong."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Python is an **interpreted** language: there is a program on your machine called `python` that reads your source file line by line and executes it. Nothing compiles to an `.exe` first. That single fact explains most of Python's character — errors surface when the line runs rather than before, and you can poke at a live program from a prompt."
    },
    {
      "kind": "text",
      "text": "Three things live on your machine and beginners conflate them constantly. The **interpreter** executes code. The **editor** (VS Code) only writes text. The **editor's Python extension** is the bridge that lets the editor find and drive the interpreter. When \"Run\" does nothing, it is almost always the third one."
    },
    {
      "kind": "text",
      "text": "You drive the interpreter two ways. The **REPL** — read, eval, print, loop — is a live session where `>>>` is the prompt and you type one statement at a time. Or you hand it a **file**. Snippets in this course starting with `>>>` are REPL sessions; everything else goes in a `.py` file."
    },
    {
      "kind": "example",
      "code": "print(\"Hello Python world!\")\n\n# print() takes as many arguments as you like and separates them with a space\nname = \"Arpit\"\nprint(\"Hello,\", name, \"- you have\", 3, \"modules done\")\n\n# sep and end change that behaviour\nprint(\"2026\", \"09\", \"09\", sep=\"-\")\nprint(\"no newline here...\", end=\"\")\nprint(\"continued on the same line\")",
      "label": "hello_world.py",
      "output": "Hello Python world!\nHello, Arpit - you have 3 modules done\n2026-09-09\nno newline here...continued on the same line"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Reading a traceback"
    },
    {
      "kind": "text",
      "text": "When Python hits an error it prints a **traceback**. Read it *bottom-up*: the last line names the exception type and message — the *what*. The lines above it are the call stack — the *where*. Beginners read top-down, drown in the noise, and give up before reaching the one line that matters."
    },
    {
      "kind": "example",
      "code": "Traceback (most recent call last):\n  File \"/home/arpit/python_work/m1/hello.py\", line 4, in <module>\n    print(greeting)\n          ^^^^^^^^\nNameError: name 'greeting' is not defined. Did you mean: 'greetings'?",
      "lang": "text",
      "label": "traceback"
    },
    {
      "kind": "text",
      "text": "Last line first: a `NameError`, and 3.14 even guesses the typo. Second-to-last: the exact line and a caret under the offending expression. `<module>` means top level, not inside any function."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "They are caught at different times. A `SyntaxError` is grammar — Python cannot even parse the file, so *nothing runs at all*, including the correct lines above the mistake. A `NameError` is meaning — the file parsed fine and failed while running, so everything before it did execute. If your program printed nothing at all, suspect syntax; if it printed some things then died, suspect a name or a value."
        }
      ],
      "title": "Trap · `SyntaxError` vs `NameError`"
    },
    {
      "kind": "quiz",
      "question": "A file has a valid `print()` on line 1 and a missing closing quote on line 5. What happens when you run it?",
      "options": [
        "Line 1 prints, then a SyntaxError on line 5",
        "Nothing prints; a SyntaxError before execution",
        "Line 1 prints and line 5 is skipped",
        "A NameError on line 5"
      ],
      "answer": 1,
      "why": "**Nothing prints.** Python parses the whole file into bytecode before executing a single statement, so a syntax error anywhere stops everything. This is exactly why \"it printed nothing\" is diagnostic information, not just frustration."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 1.1",
      "title": "Break it three ways",
      "blocks": [
        {
          "kind": "text",
          "text": "Start from `print(\"Hello Python world!\")`. Produce (a) a `SyntaxError`, (b) a `NameError`, and (c) a typo that changes the output but raises nothing. Write down which category each belongs to before you run it."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "# (a) SyntaxError - unterminated string, nothing runs\nprint(\"Hello Python world!)\n\n# (b) NameError - parses fine, fails at run time\nprint(Hello)\n\n# (c) Silent - a perfectly valid program that just says the wrong thing\nprint(\"Helo Python world!\")",
              "label": "solution-1-1.py"
            },
            {
              "kind": "text",
              "text": "(c) is the dangerous category. Python has no idea what you meant, so nothing warns you. This is why tests exist — Module 29.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Exercise 1.2",
      "title": "Run it from a terminal",
      "blocks": [
        {
          "kind": "text",
          "text": "Run the same file three ways: from the editor's Run command, from a terminal in the same folder, and from a terminal one folder above using a relative path. Confirm all three produce identical output."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "cd python_work/m1\npython3 hello_world.py        # from the file's own folder\n\ncd ..\npython3 m1/hello_world.py     # from the parent, via a relative path",
              "lang": "text",
              "label": "terminal"
            },
            {
              "kind": "text",
              "text": "The interpreter takes a *path*, not a filename. That distinction becomes important in Module 18, where the folder you launch from decides what relative paths mean.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q1",
      "title": "Is Python compiled or interpreted?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Both, and the honest answer earns you credit. CPython compiles your source to *bytecode* — the `.pyc` files cached in `__pycache__` — and then a virtual machine interprets that bytecode. So there is a compile step, but it targets a VM rather than your CPU, and it happens automatically on import rather than as a separate build."
        },
        {
          "kind": "text",
          "text": "Two consequences worth naming: the compile step catches `SyntaxError` before anything executes, which is why a syntax error in an unused branch still stops the program; and everything else — wrong types, missing names, bad attributes — is only discovered when that line actually runs, which is the case for tests and type checkers."
        }
      ]
    }
  ]
};
