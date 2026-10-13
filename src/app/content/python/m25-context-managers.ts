import { Lesson } from '../../shared/content';

export const M25_CONTEXT_MANAGERS: Lesson = {
  "slug": "m25-context-managers",
  "title": "M25 Context managers",
  "nav": "Context managers",
  "num": "M25",
  "eyebrow": "Level 4 · Week 12 · ~2 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "`with` makes sure cleanup always happens."
        },
        {
          "kind": "text",
          "text": "Open a file and it gets closed. Start something and it gets stopped. Even if your code crashes halfway through."
        },
        {
          "kind": "text",
          "text": "You can write your own with `@contextmanager`: code before `yield` is the setup, code after it is the cleanup."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 200\" role=\"img\" aria-label=\"A with block always runs its cleanup step, whether the body finishes normally or raises an error.\">\n      <defs><marker id=\"a-m25\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><polygon points=\"0,1 9,5 0,9\" fill=\"currentColor\"></polygon></marker></defs>\n      <rect x=\"150\" y=\"14\" width=\"240\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"270\" y=\"36\" class=\"dg-t\" text-anchor=\"middle\">__enter__  (open the file)</text>\n      <line x1=\"270\" y1=\"52\" x2=\"270\" y2=\"68\" class=\"dg-l\" marker-end=\"url(#a-m25)\"></line>\n      <rect x=\"150\" y=\"70\" width=\"240\" height=\"34\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"270\" y=\"92\" class=\"dg-t\" text-anchor=\"middle\">your code in the block</text>\n      <line x1=\"200\" y1=\"108\" x2=\"160\" y2=\"140\" class=\"dg-l\" marker-end=\"url(#a-m25)\"></line>\n      <text x=\"120\" y=\"128\" class=\"dg-s\" text-anchor=\"middle\">finishes</text>\n      <line x1=\"340\" y1=\"108\" x2=\"380\" y2=\"140\" class=\"dg-l\" marker-end=\"url(#a-m25)\"></line>\n      <text x=\"430\" y=\"128\" class=\"dg-s\" text-anchor=\"middle\">crashes</text>\n      <rect x=\"150\" y=\"142\" width=\"240\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"270\" y=\"164\" class=\"dg-t\" text-anchor=\"middle\">__exit__  (close the file)</text>\n      <text x=\"270\" y=\"194\" class=\"dg-s\" text-anchor=\"middle\">both paths land here — that is the whole guarantee</text>\n    </svg>",
      "caption": "Both arrows end in the same place. That is what `with` buys you: the cleanup is not something you remember to write at the end of the happy path, it is something the block cannot skip."
    },
    {
      "kind": "text",
      "text": "`with` exists to guarantee that setup is paired with teardown, no matter how the block exits. Any object with `__enter__` and `__exit__` can be used with it. The pattern is everywhere: files, locks, database transactions, temporary directories, timers, mocked settings in tests."
    },
    {
      "kind": "text",
      "text": "Writing one by hand is rarely necessary — `@contextlib.contextmanager` turns a generator into a context manager, where everything before `yield` is setup and everything after is teardown."
    },
    {
      "kind": "example",
      "code": "import contextlib, os, time\nfrom pathlib import Path\n\n@contextlib.contextmanager\ndef timer(label):\n    start = time.perf_counter()\n    try:\n        yield                                  # the body of `with` runs here\n    finally:\n        ms = (time.perf_counter() - start) * 1000\n        print(f\"  {label}: {ms:.1f}ms\")        # runs even if the body raises\n\nwith timer(\"sum\"):\n    total = sum(range(500_000))\n\n@contextlib.contextmanager\ndef working_dir(path):\n    previous = Path.cwd()\n    os.chdir(path)\n    try:\n        yield path\n    finally:\n        os.chdir(previous)                     # always restored\n\n# the class form, for when you need state\nclass Transaction:\n    def __enter__(self):\n        print(\"  BEGIN\")\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        print(\"  ROLLBACK\" if exc_type else \"  COMMIT\")\n        return False        # False = do not suppress the exception\n\nwith Transaction():\n    print(\"  ...work...\")\n\ntry:\n    with Transaction():\n        raise ValueError(\"boom\")\nexcept ValueError as err:\n    print(\"caught:\", err)\n\nwith contextlib.suppress(FileNotFoundError):   # a tidy, explicit try/except/pass\n    Path(\"does-not-exist.txt\").unlink()\nprint(\"still running\")",
      "label": "context.py",
      "output": "  sum: 12.4ms\n  BEGIN\n  ...work...\n  COMMIT\n  BEGIN\n  ROLLBACK\ncaught: boom\nstill running"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`__exit__` returning a truthy value **swallows the exception** — the `with` block appears to succeed and execution continues past it. That is occasionally what you want, and almost always a bug when it happens by accident. Return `False` or nothing at all unless suppressing is the explicit purpose. The same trap in generator form: an `except` inside your `@contextmanager` that does not re-raise silently hides errors from the block."
        }
      ],
      "title": "Trap · returning something truthy from `__exit__`"
    },
    {
      "kind": "quiz",
      "question": "In a `@contextlib.contextmanager` generator, why must the `yield` be inside `try/finally`?",
      "options": [
        "To satisfy the decorator's signature check",
        "So teardown still runs when the `with` body raises",
        "To allow multiple yields",
        "It is not required"
      ],
      "answer": 1,
      "why": "**So teardown runs on failure.** An exception in the `with` body is thrown back into the generator at the `yield`. Without `try/finally`, the generator dies there and every line after the `yield` — closing the file, releasing the lock, restoring the directory — never runs, which defeats the entire purpose. And yes, exactly one `yield`: a second one raises `RuntimeError`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 25.1",
      "title": "A context manager that cleans up a temp file",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `temp_file(text)` that creates a file, hands its path to the `with` block, and deletes it afterwards — even if the block raises. Prove the deletion happens in both cases."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import contextlib, tempfile\nfrom pathlib import Path\n\n@contextlib.contextmanager\ndef temp_file(text=\"\"):\n    path = Path(tempfile.mkdtemp()) / \"scratch.txt\"\n    path.write_text(text, encoding=\"utf-8\")\n    try:\n        yield path\n    finally:\n        path.unlink(missing_ok=True)       # always runs\n        path.parent.rmdir()\n\n# happy path\nwith temp_file(\"hello\") as f:\n    print(\"  inside:\", f.read_text(), \"| exists:\", f.exists())\nprint(\"after ok  :\", f.exists())\n\n# failure path\ntry:\n    with temp_file(\"hello\") as f:\n        raise RuntimeError(\"boom\")\nexcept RuntimeError as err:\n    print(\"caught:\", err)\nprint(\"after fail:\", f.exists())",
              "label": "solution-25-1.py",
              "output": "  inside: hello | exists: True\nafter ok  : False\ncaught: boom\nafter fail: False"
            },
            {
              "kind": "text",
              "text": "Both `False` lines are the proof. Remove the `try/finally` and the second one becomes `True` — the exception escapes before cleanup and you have leaked a file. In real code `tempfile.TemporaryDirectory()` already does this; writing it once is how you understand what it is doing for you.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q25",
      "title": "Write a context manager that times a block, and say why not a decorator.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The implementation is the `timer` above: record the start, `yield`, and report in a `finally`."
        },
        {
          "kind": "text",
          "text": "A decorator times a *whole function*; a context manager times an *arbitrary block*. So a context manager is the right tool for timing part of a function, a section of a script, or a loop body without extracting it into its own function first. It also composes at the call site — `with timer(\"db\"), transaction():` — where decorators are fixed at definition time."
        },
        {
          "kind": "text",
          "text": "Worth adding: `contextlib.ContextDecorator` lets one object be both, and `contextlib.ExitStack` handles a variable number of context managers — opening N files where N is decided at runtime, which a fixed `with` statement cannot express."
        }
      ]
    }
  ]
};
