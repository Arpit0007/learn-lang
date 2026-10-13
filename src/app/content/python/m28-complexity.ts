import { Lesson } from '../../shared/content';

export const M28_COMPLEXITY: Lesson = {
  "slug": "m28-complexity",
  "title": "M28 Complexity, profiling, and choosing structures",
  "nav": "Complexity & profiling",
  "num": "M28",
  "eyebrow": "Level 5 · Week 14 · ~2 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Big-O describes how much slower something gets as the data grows."
        },
        {
          "kind": "text",
          "text": "Checking “is this in a *list*” is slow. Checking “is this in a *set*” is fast. That one swap fixes most slow programs."
        },
        {
          "kind": "text",
          "text": "Always measure first. Guessing which part is slow is wrong more often than right."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Big-O describes how cost grows with input size, ignoring constants. It matters because the difference between O(n) and O(n²) is invisible at n=100 and fatal at n=100,000 — and because interviewers ask."
    },
    {
      "kind": "text",
      "text": "The rule that saves the most real time: **measure before optimising.** Intuition about what is slow is wrong more often than it is right."
    },
    {
      "kind": "table",
      "head": [
        "Operation",
        "list",
        "dict / set",
        "deque"
      ],
      "rows": [
        [
          "`x in c`",
          "O(n)",
          "O(1)",
          "O(n)"
        ],
        [
          "Append to end",
          "O(1)\\*",
          "O(1)",
          "O(1)"
        ],
        [
          "Insert / pop at front",
          "O(n)",
          "—",
          "O(1)"
        ],
        [
          "Index by position",
          "O(1)",
          "—",
          "O(n)"
        ],
        [
          "Lookup by key",
          "—",
          "O(1)",
          "—"
        ],
        [
          "Sort",
          "O(n log n)",
          "—",
          "—"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "\\* amortised — occasional reallocation, O(1) on average.",
      "style": "small"
    },
    {
      "kind": "example",
      "code": "import cProfile, timeit\nfrom collections import deque\n\n# the classic accidental O(n^2): membership testing against a list\nbig_list = list(range(50_000))\nbig_set  = set(big_list)\n\nprint(timeit.timeit(lambda: 49_999 in big_list, number=200))\nprint(timeit.timeit(lambda: 49_999 in big_set,  number=200))\n\n# the other classic: inserting at the front of a list\ndef with_list(n):\n    out = []\n    for i in range(n):\n        out.insert(0, i)        # O(n) each time -> O(n^2) overall\n    return out\n\ndef with_deque(n):\n    out = deque()\n    for i in range(n):\n        out.appendleft(i)       # O(1) each time -> O(n) overall\n    return out\n\nprint(timeit.timeit(lambda: with_list(5_000), number=10))\nprint(timeit.timeit(lambda: with_deque(5_000), number=10))\n\n# find the real hotspot instead of guessing\ncProfile.run(\"with_list(3000)\", sort=\"cumtime\")",
      "label": "profiling.py",
      "output": "0.0412...\n0.000021...\n0.4180...\n0.0043...\n         3004 function calls in 0.135 seconds\n   ncalls  tottime  cumtime  filename:lineno(function)\n        1    0.134    0.135  profiling.py:11(with_list)\n     3000    0.001    0.001  {method 'insert' of 'list' objects}"
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "**1.** Convert a list to a set before repeated membership tests. **2.** Replace front-insertions on a list with `collections.deque`. **3.** Stop building strings with `+=` in a loop; collect into a list and `\"\".join()` once. All three turn quadratic into linear, and all three are one-line changes. Anything beyond them, profile first: `cProfile` for where the time goes, `timeit` for comparing two candidates, `tracemalloc` for memory."
        }
      ],
      "title": "The three fixes that account for most real speed-ups"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Two failure modes, both common. Rewriting a function that turns out to be 2% of runtime — the profile would have told you in thirty seconds. And micro-benchmarking with `time.time()` around one call, which is dominated by noise, warm-up and whatever else the machine is doing; use `timeit`, which runs many iterations and reports the best. Also beware of benchmarking with tiny inputs: an O(n²) algorithm beats an O(n log n) one at n=10 and loses catastrophically at n=100,000, so test at the size you actually run at."
        }
      ],
      "title": "Trap · optimising what you did not measure"
    },
    {
      "kind": "quiz",
      "question": "Why is building a string with `s += piece` in a loop O(n²)?",
      "options": [
        "Strings are immutable, so each step allocates and copies the whole string",
        "`+=` is slower than `+`",
        "Because of the GIL",
        "It isn't — Python optimises it away"
      ],
      "answer": 0,
      "why": "**Immutability forces a copy each time.** There is no in-place append for `str`, so step k copies k characters — summing to n²/2 work. `\"\".join(pieces)` computes the final length once, allocates once, and copies each piece once. CPython does have a special-case optimisation for the specific pattern `s = s + x` when the string has a single reference, which is why this sometimes looks fast in a micro-benchmark — but it is an implementation detail you should not rely on."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 28.1",
      "title": "Find the quadratic, then kill it",
      "blocks": [
        {
          "kind": "text",
          "text": "This function is unbearably slow on 20,000 records. Profile it, identify the two quadratic lines, and fix both without changing the output."
        },
        {
          "kind": "example",
          "code": "def dedupe_and_report(records, banned):\n    out = []\n    report = \"\"\n    for r in records:\n        if r in banned:              # banned is a list\n            continue\n        if r not in out:             # scanning a growing list\n            out.append(r)\n            report += f\"{r}\\n\"      # quadratic string building\n    return out, report",
          "label": "before.py"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "def dedupe_and_report(records, banned):\n    banned_set = set(banned)         # O(1) membership instead of O(n)\n    seen = set()                     # O(1) \"have I kept this?\"\n    out, lines = [], []              # collect, join once\n    for r in records:\n        if r in banned_set or r in seen:\n            continue\n        seen.add(r)\n        out.append(r)\n        lines.append(r)\n    return out, \"\\n\".join(lines) + \"\\n\"",
              "label": "after.py",
              "output": "$ python -m timeit -s \"from before import *; d=[str(i%9000) for i in range(20000)]; b=[str(i) for i in range(500)]\" \"dedupe_and_report(d,b)\"\n1 loop, best of 5: 4.21 sec per loop\n\n$ python -m timeit -s \"from after import *;  d=[str(i%9000) for i in range(20000)]; b=[str(i) for i in range(500)]\" \"dedupe_and_report(d,b)\"\n200 loops, best of 5: 1.78 msec per loop"
            },
            {
              "kind": "text",
              "text": "Roughly 2,300× faster, and every change is one of the three standard fixes: list→set for membership (twice), and accumulate-then-`join` instead of `+=`. Note that `out` stays a list — order still matters for the output — while `seen` carries the fast lookup. Keeping both is the pattern.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q28",
      "title": "How would you find why a Python script is slow?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Measure first, at the coarsest useful level, then narrow. I would start with `cProfile` sorted by cumulative time to find which call tree dominates, then `line_profiler` on that one function to find the line. For memory, `tracemalloc` snapshots before and after."
        },
        {
          "kind": "text",
          "text": "Then I would ask what kind of slow it is. Waiting on I/O — the fix is concurrency or batching, not faster code. CPU-bound Python — look for an algorithmic problem first, because an accidental O(n²) beats any micro-optimisation; then consider processes, NumPy, or pushing the hot loop into C. Startup-dominated — check for expensive imports at module top level."
        },
        {
          "kind": "text",
          "text": "What I would not do is optimise from intuition. The specific trap is micro-benchmarking a function that turns out to be 2% of runtime, which is why the profile comes before the rewrite."
        }
      ]
    }
  ]
};
