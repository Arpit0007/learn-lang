import { Lesson } from '../../shared/content';

export const M30_STDLIB: Lesson = {
  "slug": "m30-stdlib",
  "title": "M30 The standard library, and what 3.14 changed",
  "nav": "Standard library & 3.14",
  "num": "M30",
  "eyebrow": "Level 6 · Week 16 · ~2 sessions · beyond PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Python comes with a huge set of ready-made tools, free and already installed."
        },
        {
          "kind": "text",
          "text": "Most beginner code rewrites something that already exists. Just knowing a tool exists is most of the value."
        },
        {
          "kind": "text",
          "text": "Python 3.14 also brought better error messages and a nicer interactive prompt."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Python's pitch is \"batteries included\". Most beginner code reinvents something that already ships with the interpreter. This is the tour worth having in your head — knowing a module *exists* is 90% of the value."
    },
    {
      "kind": "table",
      "head": [
        "Module",
        "Reach for it when"
      ],
      "rows": [
        [
          "`pathlib`",
          "Any filesystem path. Replaces `os.path` string juggling."
        ],
        [
          "`collections`",
          "`Counter`, `defaultdict`, `deque`, `namedtuple`. Removes a lot of hand-rolled code."
        ],
        [
          "`itertools`",
          "Lazy combinatorics: `chain`, `groupby`, `batched`, `product`, `combinations`."
        ],
        [
          "`functools`",
          "`cache`, `lru_cache`, `partial`, `wraps`, `reduce`."
        ],
        [
          "`datetime` + `zoneinfo`",
          "Dates and real time zones. Always store UTC; convert only for display."
        ],
        [
          "`dataclasses`, `enum`",
          "Records and named constants — Module 17."
        ],
        [
          "`json`, `csv`, `sqlite3`",
          "Persistence without a dependency. SQLite is a real database in the stdlib."
        ],
        [
          "`argparse`",
          "Command-line interfaces with help text and validation for free."
        ],
        [
          "`logging`",
          "Anything longer-lived than a script. Levels and destinations beat `print`."
        ],
        [
          "`re`",
          "Pattern matching in text. Use raw strings, and prefer `str` methods when they suffice."
        ],
        [
          "`subprocess`",
          "Running other programs. Pass a list, never `shell=True` with user input."
        ],
        [
          "`secrets`, `hashlib`",
          "Tokens and hashes. Never `random` for anything security-related."
        ],
        [
          "`unittest.mock`",
          "Faking collaborators in tests — works fine with pytest."
        ],
        [
          "`concurrent.futures`, `asyncio`",
          "Concurrency — Module 27."
        ]
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What 3.14 brought"
    },
    {
      "kind": "table",
      "head": [
        "Change",
        "What it means for you"
      ],
      "rows": [
        [
          "Syntax-highlighted REPL",
          "On by default, with tab-completion on `import`. Makes the REPL genuinely pleasant."
        ],
        [
          "Suggesting error messages",
          "`whille` → \"Did you mean 'while'?\" Typo diagnosis is built in now."
        ],
        [
          "PEP 758 · bracketless `except`",
          "`except TimeoutError, ConnectionError:` is legal — parentheses are still needed with `as`."
        ],
        [
          "PEP 649 · lazy annotations",
          "Forward references need no quotes — Module 26."
        ],
        [
          "PEP 750 · t-strings",
          "`t\"...\"` keeps static and interpolated parts separate: the safe way to build SQL and HTML."
        ],
        [
          "PEP 765 warning",
          "Warns when `return`/`break`/`continue` escapes a `finally` — a real bug class."
        ],
        [
          "PEP 703 · free threading",
          "GIL-free builds officially supported; ~5–10% single-thread cost — Module 27."
        ],
        [
          "PEP 734 · subinterpreters",
          "`concurrent.interpreters`: isolation of processes, cost closer to threads."
        ],
        [
          "PEP 768 · remote debugging",
          "Attach a debugger to a running process without restarting it."
        ],
        [
          "`compression.zstd`",
          "Zstandard compression in the standard library."
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "**3.14** is the latest stable (released Oct 2025, supported to Oct 2030) — install this. **3.13** is a fine fallback. **3.12 and 3.11** are security-fixes-only. **3.10** loses support next month. **3.9 and below** are end-of-life — which means the floor *Python Crash Course* sets is now unsupported. **3.15** arrives in October 2026; do not learn on a prerelease."
        }
      ],
      "title": "Version support, as of September 2026"
    },
    {
      "kind": "example",
      "code": "from collections import Counter, defaultdict, deque\nfrom itertools import batched, groupby\nfrom functools import partial\nfrom datetime import datetime, timezone\nfrom zoneinfo import ZoneInfo\nimport argparse, logging, secrets\n\nwords = \"py go py rust py go\".split()\n\nprint(Counter(words).most_common(2))        # instead of a count dict + loop\n\nby_initial = defaultdict(list)              # instead of `if k not in d: d[k] = []`\nfor w in words:\n    by_initial[w[0]].append(w)\nprint(dict(by_initial))\n\nprint([list(b) for b in batched(range(7), 3)])   # chunk an iterable (3.12+)\n\nrecent = deque(maxlen=3)                    # a self-trimming buffer\nfor n in range(6):\n    recent.append(n)\nprint(list(recent))\n\nnow = datetime.now(timezone.utc)            # ALWAYS store UTC\nprint(now.astimezone(ZoneInfo(\"Asia/Kolkata\")).strftime(\"%H:%M %Z\"))\n\nprint(len(secrets.token_urlsafe(16)))       # never `random` for tokens\n\nlogging.basicConfig(level=logging.INFO, format=\"%(levelname)s %(message)s\")\nlogging.info(\"this is what replaces print() in real programs\")",
      "label": "stdlib_tour.py",
      "output": "[('py', 3), ('go', 2)]\n{'p': ['py', 'py', 'py'], 'g': ['go', 'go'], 'r': ['rust']}\n[[0, 1, 2], [3, 4, 5], [6]]\n[3, 4, 5]\n17:42 IST\n22\nINFO this is what replaces print() in real programs"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Two stdlib mistakes that reach production constantly. `datetime.now()` without a timezone returns a **naive** datetime that silently means \"whatever this machine's clock says\" — comparing one to an aware datetime raises `TypeError`, and storing them mixes time zones in your database. Always `datetime.now(timezone.utc)`, convert only for display. Separately, `random` is a deterministic pseudo-random generator seeded predictably: fine for dice and sampling, *unsafe* for tokens, passwords, or session IDs. Use `secrets` for anything an attacker would want to guess."
        }
      ],
      "title": "Trap · naive datetimes and `random` for secrets"
    },
    {
      "kind": "quiz",
      "question": "Which of these should you *not* reach for the standard library for?",
      "options": [
        "Counting word frequencies",
        "Storing structured data locally with queries",
        "Making HTTP requests in application code",
        "Parsing command-line arguments"
      ],
      "answer": 2,
      "why": "**HTTP requests.** `urllib.request` exists, but it is painful enough that essentially every real project uses `requests` or `httpx` — this is the one famous gap in \"batteries included\". The other three are solved and solved well: `collections.Counter`, `sqlite3` (a real database, no server, in the stdlib), and `argparse`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 30.1",
      "title": "Delete your own code",
      "blocks": [
        {
          "kind": "text",
          "text": "Rewrite each of these hand-rolled blocks as a single standard-library call. All four appear constantly in beginner code."
        },
        {
          "kind": "example",
          "code": "# 1 - count occurrences\ncounts = {}\nfor w in words:\n    if w in counts: counts[w] += 1\n    else: counts[w] = 1\n\n# 2 - group by a key\ngroups = {}\nfor u in users:\n    groups.setdefault(u[\"city\"], []).append(u)\n\n# 3 - chunk into fives\nchunks, chunk = [], []\nfor item in items:\n    chunk.append(item)\n    if len(chunk) == 5:\n        chunks.append(chunk); chunk = []\nif chunk: chunks.append(chunk)\n\n# 4 - build a path\npath = base_dir + \"/\" + sub + \"/\" + name + \".txt\"",
          "label": "before.py"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "from collections import Counter, defaultdict\nfrom itertools import batched\nfrom pathlib import Path\n\ncounts = Counter(words)\n\ngroups = defaultdict(list)\nfor u in users:\n    groups[u[\"city\"]].append(u)\n\nchunks = [list(c) for c in batched(items, 5)]\n\npath = Path(base_dir) / sub / f\"{name}.txt\"",
              "label": "after.py"
            },
            {
              "kind": "text",
              "text": "Thirteen lines become four. The path one matters most: string concatenation breaks on Windows separators and on a `base_dir` with a trailing slash, while `Path` handles both. If `batched` is unavailable you are on Python 3.11 or earlier — another reason to be on 3.14.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q30",
      "title": "Name three standard-library modules you reach for often and why.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** This question is really \"have you written real Python?\", so answer with specifics rather than a list."
        },
        {
          "kind": "text",
          "text": "**`pathlib`** — every filesystem path. `Path(__file__).parent / \"data\"` is cross-platform, and path objects carry `.stem`, `.suffix` and `.exists()` instead of me slicing strings."
        },
        {
          "kind": "text",
          "text": "**`collections`** — `Counter` for frequency counts and `defaultdict(list)` for grouping replace the two loops people write most often, and `deque` is the fix whenever something is being inserted at the front of a list."
        },
        {
          "kind": "text",
          "text": "**`itertools`** — `chain` to flatten, `groupby` on sorted data, `batched` for chunking API requests. All lazy, so they work on streams that do not fit in memory."
        },
        {
          "kind": "text",
          "text": "If they want a fourth: `logging`, because the moment code runs anywhere other than my terminal, `print` stops being enough."
        }
      ]
    }
  ]
};
