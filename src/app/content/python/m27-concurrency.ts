import { Lesson } from '../../shared/content';

export const M27_CONCURRENCY: Lesson = {
  "slug": "m27-concurrency",
  "title": "M27 Concurrency: threads, processes, asyncio",
  "nav": "Concurrency",
  "num": "M27",
  "eyebrow": "Level 5 · Week 14 · ~5 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Ask one question first: is your program **waiting**, or **calculating**?"
        },
        {
          "kind": "text",
          "text": "Waiting on the internet or files → use async or threads. Calculating → use processes."
        },
        {
          "kind": "text",
          "text": "Threads cannot speed up calculation in Python, because of a lock called the GIL that lets only one thread run code at a time."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 230\" role=\"img\" aria-label=\"Four threads take turns through one lock and finish no faster, while four processes run at once on four cores.\">\n      <text x=\"0\" y=\"14\" class=\"dg-s\">4 THREADS — ONE LOCK, TAKING TURNS</text>\n      <rect x=\"4\" y=\"24\" width=\"60\" height=\"78\" rx=\"4\" class=\"dg-warn\"></rect>\n      <text x=\"34\" y=\"68\" class=\"dg-t\" text-anchor=\"middle\">GIL</text>\n      <rect x=\"74\" y=\"24\" width=\"110\" height=\"18\" rx=\"3\" class=\"dg-box\"></rect><text x=\"129\" y=\"37\" class=\"dg-s\" text-anchor=\"middle\">thread 1</text><rect x=\"190\" y=\"24\" width=\"110\" height=\"18\" rx=\"3\" class=\"dg-box\"></rect><text x=\"245\" y=\"37\" class=\"dg-s\" text-anchor=\"middle\">thread 2</text><rect x=\"306\" y=\"24\" width=\"110\" height=\"18\" rx=\"3\" class=\"dg-box\"></rect><text x=\"361\" y=\"37\" class=\"dg-s\" text-anchor=\"middle\">thread 3</text><rect x=\"422\" y=\"24\" width=\"110\" height=\"18\" rx=\"3\" class=\"dg-box\"></rect><text x=\"477\" y=\"37\" class=\"dg-s\" text-anchor=\"middle\">thread 4</text>\n      <rect x=\"74\" y=\"52\" width=\"104\" height=\"20\" rx=\"2\" class=\"dg-fill\"></rect><rect x=\"190\" y=\"52\" width=\"104\" height=\"20\" rx=\"2\" class=\"dg-fill\"></rect><rect x=\"306\" y=\"52\" width=\"104\" height=\"20\" rx=\"2\" class=\"dg-fill\"></rect><rect x=\"422\" y=\"52\" width=\"104\" height=\"20\" rx=\"2\" class=\"dg-fill\"></rect>\n      <text x=\"305\" y=\"92\" class=\"dg-s\" text-anchor=\"middle\">only one of these runs at any moment — total time ~ 4 × one job</text>\n      <line x1=\"0\" y1=\"116\" x2=\"540\" y2=\"116\" class=\"dg-d\"></line>\n\n      <text x=\"0\" y=\"142\" class=\"dg-s\">4 PROCESSES — FOUR CORES, FOUR LOCKS</text>\n      <rect x=\"4\" y=\"152\" width=\"126\" height=\"58\" rx=\"4\" class=\"dg-ok\"></rect><text x=\"67\" y=\"172\" class=\"dg-s\" text-anchor=\"middle\">core 1</text><text x=\"67\" y=\"194\" class=\"dg-t\" text-anchor=\"middle\">own GIL</text><rect x=\"138\" y=\"152\" width=\"126\" height=\"58\" rx=\"4\" class=\"dg-ok\"></rect><text x=\"201\" y=\"172\" class=\"dg-s\" text-anchor=\"middle\">core 2</text><text x=\"201\" y=\"194\" class=\"dg-t\" text-anchor=\"middle\">own GIL</text><rect x=\"272\" y=\"152\" width=\"126\" height=\"58\" rx=\"4\" class=\"dg-ok\"></rect><text x=\"335\" y=\"172\" class=\"dg-s\" text-anchor=\"middle\">core 3</text><text x=\"335\" y=\"194\" class=\"dg-t\" text-anchor=\"middle\">own GIL</text><rect x=\"406\" y=\"152\" width=\"126\" height=\"58\" rx=\"4\" class=\"dg-ok\"></rect><text x=\"469\" y=\"172\" class=\"dg-s\" text-anchor=\"middle\">core 4</text><text x=\"469\" y=\"194\" class=\"dg-t\" text-anchor=\"middle\">own GIL</text>\n      <text x=\"270\" y=\"226\" class=\"dg-s\" text-anchor=\"middle\">all four run at once — total time ~ one job</text>\n    </svg>",
      "caption": "This is why swapping `ThreadPoolExecutor` for `ProcessPoolExecutor` is sometimes a four-times speed-up and sometimes a slow-down. Threads share one lock and only help when they are waiting; processes each get their own and help when they are calculating."
    },
    {
      "kind": "text",
      "text": "One decision drives everything here: is your work **I/O-bound** (waiting on network, disk, database) or **CPU-bound** (computing)? Pick the wrong tool and you get no speed-up at all, or a slow-down."
    },
    {
      "kind": "text",
      "text": "The reason is the **GIL** — the Global Interpreter Lock — which allows only one thread to execute Python bytecode at a time in a standard CPython build. Threads therefore cannot speed up computation, but they help enormously with waiting, because the GIL is released during I/O."
    },
    {
      "kind": "table",
      "head": [
        "Work",
        "Tool",
        "Why"
      ],
      "rows": [
        [
          "Many network calls",
          "`asyncio`",
          "Thousands of concurrent waits in one thread; cheapest per task."
        ],
        [
          "Blocking I/O in libraries that aren't async",
          "`ThreadPoolExecutor`",
          "The GIL is released while waiting, so threads overlap."
        ],
        [
          "Heavy computation",
          "`ProcessPoolExecutor`",
          "Separate processes, separate GILs, real cores."
        ],
        [
          "Heavy computation, one process",
          "Free-threaded build, or NumPy",
          "3.14 supports GIL-free builds officially; NumPy drops the GIL in C."
        ]
      ]
    },
    {
      "kind": "example",
      "code": "import asyncio, time\nfrom concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor\n\n# ---- I/O bound: asyncio ----\nasync def fetch(name, seconds):\n    await asyncio.sleep(seconds)        # `await` = yield control while waiting\n    return f\"{name} done\"\n\nasync def main():\n    start = time.perf_counter()\n    # gather runs them CONCURRENTLY - total is the slowest, not the sum\n    results = await asyncio.gather(\n        fetch(\"a\", 0.3), fetch(\"b\", 0.3), fetch(\"c\", 0.3)\n    )\n    print(results, f\"{time.perf_counter() - start:.2f}s\")\n\nasyncio.run(main())                     # one entry point per program\n\n# ---- I/O bound, blocking library: threads ----\ndef blocking_io(n):\n    time.sleep(0.2)\n    return n * 2\n\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    print(list(pool.map(blocking_io, range(4))))\n\n# ---- CPU bound: processes ----\ndef crunch(n):\n    return sum(i * i for i in range(n))\n\nif __name__ == \"__main__\":              # REQUIRED for process pools\n    with ProcessPoolExecutor() as pool:\n        print(sum(pool.map(crunch, [200_000] * 4)))",
      "label": "concurrency.py",
      "output": "['a done', 'b done', 'c done'] 0.30s\n[0, 2, 4, 6]\n10666626673320000"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`asyncio` is **cooperative**: a single thread hands control around at every `await`. Call something blocking inside a coroutine — `time.sleep()`, `requests.get()`, a synchronous database driver, a heavy loop — and nothing else in the entire program runs until it returns. There is no pre-emption to save you. Use `asyncio.sleep` not `time.sleep`, an async HTTP client not `requests`, and push unavoidable blocking work out with `await asyncio.to_thread(func, ...)`."
        }
      ],
      "title": "Trap · one blocking call poisons the whole event loop"
    },
    {
      "kind": "quiz",
      "question": "You have a pure-Python function that takes 10 seconds of computation. You run four copies in four threads. Roughly how long?",
      "options": [
        "~10 seconds",
        "~40 seconds or a bit more",
        "~2.5 seconds",
        "It raises a RuntimeError"
      ],
      "answer": 1,
      "why": "**~40 seconds, plus overhead.** The GIL serialises Python bytecode, so the four threads take turns instead of running in parallel — and context switching makes it slightly *worse* than running them one after another. This is the canonical demonstration of why threads are for waiting, not computing. Swap `ThreadPoolExecutor` for `ProcessPoolExecutor` and you get roughly 10 seconds on four cores."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 27.1",
      "title": "Measure the GIL yourself",
      "blocks": [
        {
          "kind": "text",
          "text": "Run the same CPU-bound function four times: sequentially, in four threads, and in four processes. Time all three. Predict the ordering before you run it."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import time\nfrom concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor\n\ndef burn(n):\n    \"\"\"Pure-Python CPU work - holds the GIL the whole way.\"\"\"\n    total = 0\n    for i in range(n):\n        total += i * i\n    return total\n\nN, JOBS = 4_000_000, 4\n\ndef timed(label, fn):\n    start = time.perf_counter()\n    fn()\n    print(f\"  {label:<12} {time.perf_counter() - start:.2f}s\")\n\nif __name__ == \"__main__\":\n    timed(\"sequential\", lambda: [burn(N) for _ in range(JOBS)])\n\n    timed(\"threads\", lambda: list(\n        ThreadPoolExecutor(JOBS).map(burn, [N] * JOBS)))\n\n    timed(\"processes\", lambda: list(\n        ProcessPoolExecutor(JOBS).map(burn, [N] * JOBS)))",
              "label": "solution-27-1.py",
              "output": "  sequential   1.84s\n  threads      1.97s\n  processes    0.56s"
            },
            {
              "kind": "text",
              "text": "Threads came out *slower* than sequential — the GIL serialises the work and context switching adds overhead. Processes used four real cores. Now change `burn` to `time.sleep(0.5)` and re-run: threads win decisively, because sleeping releases the GIL. Same code, opposite conclusion — which is why \"is it I/O or CPU?\" is the first question, not an afterthought.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q27",
      "title": "What is the GIL, and is it going away?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The Global Interpreter Lock is a mutex in CPython that permits only one thread to execute Python bytecode at a time. It exists because CPython's memory management uses reference counting, which is not thread-safe; the GIL makes every refcount update atomic without per-object locking, which keeps single-threaded code fast and C extensions simple."
        },
        {
          "kind": "text",
          "text": "Consequences: threads give no parallel speed-up for CPU-bound Python, but they do help I/O-bound work because the GIL is released during blocking calls, and C extensions such as NumPy can release it around their own computation."
        },
        {
          "kind": "text",
          "text": "And it is genuinely changing. PEP 703 introduced an optional **free-threaded** build without the GIL; it was experimental in 3.13 and became **officially supported in 3.14**, with the single-threaded penalty down to roughly 5–10%. It is a separate build rather than the default, and the ecosystem is still catching up, so the working answer today is still \"choose processes for CPU-bound work\" — but \"the GIL is permanent\" is no longer true."
        }
      ]
    }
  ]
};
