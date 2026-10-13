import { Lesson } from '../../shared/content';

export const M18_FILES_PATHS: Lesson = {
  "slug": "m18-files-paths",
  "title": "M18 Files and paths",
  "nav": "Files & paths",
  "num": "M18",
  "eyebrow": "Level 3 · Week 9 · ~3 sessions · PCC ch.10 + pathlib",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Always open files using `with`. It closes the file for you, even if your code crashes."
        },
        {
          "kind": "text",
          "text": "Use `pathlib` for paths. Joining with `/` works the same on Windows, Mac and Linux."
        },
        {
          "kind": "text",
          "text": "Relative paths depend on where you *ran* the program from, not where the file lives."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Always open files with `with`. The `with` block guarantees the file is closed even if an exception is raised inside it — Module 25 explains the mechanism. A file opened without `with` and not closed can leave data unflushed on disk."
    },
    {
      "kind": "text",
      "text": "The book uses `open()` with string paths. Modern Python uses **`pathlib`**: paths become objects, joining uses `/`, and the same code works on Windows and Unix without thinking about separators."
    },
    {
      "kind": "example",
      "code": "from pathlib import Path\n\ndata_dir = Path(\"data\")\ndata_dir.mkdir(exist_ok=True)          # no error if it already exists\ntarget = data_dir / \"notes.txt\"        # `/` joins paths, cross-platform\n\n# writing: \"w\" truncates, \"a\" appends\nwith open(target, \"w\", encoding=\"utf-8\") as f:\n    f.write(\"first line\\n\")\n    f.writelines([f\"line {n}\\n\" for n in range(2, 4)])\n\nwith open(target, \"a\", encoding=\"utf-8\") as f:\n    f.write(\"appended\\n\")\n\n# reading, three ways\nwith open(target, encoding=\"utf-8\") as f:\n    whole = f.read()                   # one string - fine for small files\nprint(repr(whole))\n\nwith open(target, encoding=\"utf-8\") as f:\n    for line in f:                     # LAZY: one line at a time, any file size\n        print(\"  \", line.rstrip())\n\n# pathlib shortcuts for small files\nprint(target.read_text(encoding=\"utf-8\").splitlines()[:2])\nprint(target.name, target.suffix, target.stem, target.exists())\nprint(sorted(p.name for p in data_dir.iterdir()))",
      "label": "files.py",
      "output": "'first line\\nline 2\\nline 3\\nappended\\n'\n   first line\n   line 2\n   line 3\n   appended\n['first line', 'line 2']\nnotes.txt .txt notes True\n['notes.txt']"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`open(\"data/notes.txt\")` resolves against the **current working directory** — the folder your terminal was in when you ran the command — not the folder containing the script. Run the same script from one directory up and it fails with `FileNotFoundError`. For files that ship alongside your code, anchor to the script: `Path(__file__).parent / \"data\" / \"notes.txt\"`. Also always pass `encoding=\"utf-8\"` — the default is platform-dependent, which is how a file that reads fine on Linux raises `UnicodeDecodeError` on a colleague's Windows machine."
        }
      ],
      "title": "Trap · relative paths depend on where you launched, not where the file lives"
    },
    {
      "kind": "quiz",
      "question": "Why iterate `for line in f` rather than `f.read().splitlines()`?",
      "options": [
        "It strips newlines automatically",
        "It reads lazily, so memory stays constant regardless of file size",
        "It is the only way to get line numbers",
        "There is no difference"
      ],
      "answer": 1,
      "why": "**Laziness.** A file object is an iterator over lines: it buffers a chunk at a time, so a 40 GB log uses the same memory as a 4 KB one. `f.read()` pulls the entire file into a single string first. It does *not* strip newlines — you still need `.rstrip()` — and `enumerate(f)` gives you line numbers either way."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 18.1",
      "title": "Is your birthday in pi?",
      "blocks": [
        {
          "kind": "text",
          "text": "Read a file of pi's digits, strip the newlines into one string, and check whether a birthday in `ddmmyy` form appears in the first million digits."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "from pathlib import Path\n\npi_file = Path(__file__).parent / \"pi_million_digits.txt\"\n\ntry:\n    lines = pi_file.read_text(encoding=\"utf-8\").splitlines()\nexcept FileNotFoundError:\n    print(f\"missing: {pi_file.name}\")\nelse:\n    digits = \"\".join(line.strip() for line in lines)\n    print(f\"{len(digits)} digits loaded\")\n\n    birthday = input(\"Your birthday as ddmmyy: \").strip()\n    if birthday in digits:\n        print(\"It's in the first million digits of pi.\")\n    else:\n        print(\"Not in the first million digits.\")",
              "label": "solution-18-1.py"
            },
            {
              "kind": "text",
              "text": "`try/except/else` is the right shape here: the `else` block runs only when no exception was raised, which keeps the risky line isolated to the `try`. Module 19 covers why that matters.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q18",
      "title": "What does `with open(...)` actually do?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `with` uses the context-manager protocol. `open()` returns a file object implementing `__enter__` and `__exit__`; `with` calls `__enter__` to get the value bound by `as`, and guarantees `__exit__` runs on the way out — normal exit, `return`, `break`, or exception. For files, `__exit__` flushes and closes."
        },
        {
          "kind": "text",
          "text": "Why it matters: an unclosed file may hold buffered writes that never reach disk, and open handles are a finite OS resource, so leaking them in a loop eventually raises `OSError: too many open files`. Relying on garbage collection is not a fix — CPython's reference counting happens to close it soon, but that is an implementation detail and other implementations do not promise it. `with` also composes: `with open(a) as f, open(b) as g:` closes both correctly even if the second `open` raises."
        }
      ]
    }
  ]
};
