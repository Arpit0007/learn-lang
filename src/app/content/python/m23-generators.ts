import { Lesson } from '../../shared/content';

export const M23_GENERATORS: Lesson = {
  "slug": "m23-generators",
  "title": "M23 Iterators and generators",
  "nav": "Iterators & generators",
  "num": "M23",
  "eyebrow": "Level 4 · Week 11 · ~4 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A generator makes values one at a time, only when you ask for the next one."
        },
        {
          "kind": "text",
          "text": "That means you can work through a file of any size without filling up memory."
        },
        {
          "kind": "text",
          "text": "The catch: you can only go through a generator **once**. After that it is empty, with no warning."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 200\" role=\"img\" aria-label=\"A list builds every value in memory first, while a generator passes one value at a time through the pipeline.\">\n      <defs><marker id=\"a-m23\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><polygon points=\"0,1 9,5 0,9\" fill=\"currentColor\"></polygon></marker></defs>\n      <text x=\"0\" y=\"14\" class=\"dg-s\">LIST — BUILD EVERYTHING FIRST</text>\n      <rect x=\"4\" y=\"26\" width=\"90\" height=\"34\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"49\" y=\"48\" class=\"dg-t\" text-anchor=\"middle\">file</text>\n      <line x1=\"98\" y1=\"43\" x2=\"140\" y2=\"43\" class=\"dg-l\" marker-end=\"url(#a-m23)\"></line>\n      <rect x=\"144\" y=\"26\" width=\"250\" height=\"34\" rx=\"4\" class=\"dg-warn\"></rect>\n      <text x=\"269\" y=\"48\" class=\"dg-t\" text-anchor=\"middle\">all 40,000,000 lines in memory</text>\n      <line x1=\"398\" y1=\"43\" x2=\"440\" y2=\"43\" class=\"dg-l\" marker-end=\"url(#a-m23)\"></line>\n      <rect x=\"444\" y=\"26\" width=\"92\" height=\"34\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"490\" y=\"48\" class=\"dg-t\" text-anchor=\"middle\">result</text>\n\n      <line x1=\"0\" y1=\"92\" x2=\"540\" y2=\"92\" class=\"dg-d\"></line>\n\n      <text x=\"0\" y=\"118\" class=\"dg-s\">GENERATOR — ONE VALUE AT A TIME</text>\n      <rect x=\"4\" y=\"130\" width=\"90\" height=\"34\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"49\" y=\"152\" class=\"dg-t\" text-anchor=\"middle\">file</text>\n      <line x1=\"98\" y1=\"147\" x2=\"136\" y2=\"147\" class=\"dg-l\" marker-end=\"url(#a-m23)\"></line>\n      <rect x=\"140\" y=\"130\" width=\"110\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"195\" y=\"152\" class=\"dg-t\" text-anchor=\"middle\">strip</text>\n      <line x1=\"254\" y1=\"147\" x2=\"292\" y2=\"147\" class=\"dg-l\" marker-end=\"url(#a-m23)\"></line>\n      <rect x=\"296\" y=\"130\" width=\"110\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"351\" y=\"152\" class=\"dg-t\" text-anchor=\"middle\">filter</text>\n      <line x1=\"410\" y1=\"147\" x2=\"440\" y2=\"147\" class=\"dg-l\" marker-end=\"url(#a-m23)\"></line>\n      <rect x=\"444\" y=\"130\" width=\"92\" height=\"34\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"490\" y=\"152\" class=\"dg-t\" text-anchor=\"middle\">result</text>\n      <text x=\"270\" y=\"188\" class=\"dg-s\" text-anchor=\"middle\">one line travels the whole pipeline, then the next — memory stays flat</text>\n    </svg>",
      "caption": "Same answer, completely different memory. The list version must finish each stage before the next begins; the generator version pulls a single value through every stage, so the file size stops mattering."
    },
    {
      "kind": "text",
      "text": "An **iterable** is anything you can loop over. An **iterator** is the thing doing the walking: it has `__next__`, remembers its position, and is exhausted after one pass. `for x in things` is sugar for calling `iter(things)` then `next()` until `StopIteration`."
    },
    {
      "kind": "text",
      "text": "A **generator** is the easy way to write an iterator: any function containing `yield`. Calling it runs no code — it returns a generator object. Each `next()` runs to the next `yield`, hands back the value, and **freezes the function's entire state** until asked again. That is what makes lazy, infinite and streaming pipelines possible in constant memory."
    },
    {
      "kind": "example",
      "code": "def countdown(n):\n    print(\"  (function body starts)\")\n    while n > 0:\n        yield n                 # pause here, hand n out, remember everything\n        n -= 1\n\ngen = countdown(3)              # nothing has run yet\nprint(\"created:\", gen)\nprint(next(gen), next(gen), next(gen))\n# next(gen) now raises StopIteration\n\n# laziness: infinite sequences are fine as long as you stop consuming\ndef naturals():\n    n = 1\n    while True:\n        yield n\n        n += 1\n\nfrom itertools import islice\nprint(list(islice((n * n for n in naturals()), 5)))\n\n# a pipeline: each stage is lazy, nothing is materialised\nlines    = (l.strip() for l in [\"10\", \"\", \"20\", \"x\", \"30\"])\nnonempty = (l for l in lines if l)\nnumbers  = (int(l) for l in nonempty if l.isdigit())\nprint(sum(numbers))\n\n# yield from delegates to another iterable\ndef flatten(nested):\n    for item in nested:\n        if isinstance(item, list):\n            yield from flatten(item)\n        else:\n            yield item\n\nprint(list(flatten([1, [2, [3, [4]], 5]])))",
      "label": "generators.py",
      "output": "created: <generator object countdown at 0x...>\n  (function body starts)\n3 2 1\n[1, 4, 9, 16, 25]\n60\n[1, 2, 3, 4, 5]"
    },
    {
      "kind": "text",
      "text": "Notice the order of the first two output lines: `created:` printed *before* the function body's own print. That is the whole idea — calling a generator function executes nothing."
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Once exhausted, a generator is done — looping over it again yields nothing, silently, with no error. So `if any(g): ... for x in g:` gives you an empty loop, because `any()` consumed it. Generators also have no `len()` and no indexing. If you need to traverse the data twice, either call the generator function again to get a fresh one, or materialise it once with `list()` and accept the memory."
        }
      ],
      "title": "Trap · a generator is single-use"
    },
    {
      "kind": "quiz",
      "question": "What does a generator function return when you call it?",
      "options": [
        "A generator object; no body code has run yet",
        "The first yielded value",
        "A list of all yielded values",
        "`None` until you call `next()`"
      ],
      "answer": 0,
      "why": "**A generator object, with nothing executed.** The presence of `yield` anywhere in the body makes the function a generator factory. The body only advances on each `next()` — which is why a `print()` on the first line of a generator appears to be skipped, and why validating arguments inside a generator is a mistake: the error will not surface until someone starts iterating, possibly far away."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 23.1",
      "title": "Read a huge log lazily",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a generator that yields only the `ERROR` lines from a log file, and a second that parses each into a dict. Chain them and count errors without ever holding the file in memory."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "from pathlib import Path\n\ndef lines_of(path):\n    with open(path, encoding=\"utf-8\") as f:\n        yield from f                      # the `with` stays open across yields\n\ndef only_errors(lines):\n    for line in lines:\n        if \"ERROR\" in line:\n            yield line.rstrip()\n\ndef parsed(lines):\n    for line in lines:\n        ts, level, *msg = line.split(\" \", 2)\n        yield {\"ts\": ts, \"level\": level, \"msg\": msg[0] if msg else \"\"}\n\npath = Path(\"app.log\")\nif path.exists():\n    events = parsed(only_errors(lines_of(path)))\n    print(sum(1 for _ in events), \"errors\")",
              "label": "solution-23-1.py"
            },
            {
              "kind": "text",
              "text": "Three stages, constant memory, works on a 40 GB file. `sum(1 for _ in events)` is how you count a generator without materialising it. One caveat: because the `with` block spans the yields, the file stays open until the generator is exhausted or garbage-collected — fine here, worth knowing in long-lived code.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q23",
      "title": "Iterable vs iterator vs generator?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** An **iterable** implements `__iter__` and can produce a fresh iterator on demand — lists, dicts, strings, files. An **iterator** implements both `__iter__` (returning itself) and `__next__`, carries the traversal position, and is consumed once. A **generator** is a concrete iterator produced either by a function containing `yield` or by a generator expression."
        },
        {
          "kind": "text",
          "text": "The practical distinction: a list is iterable but not an iterator, which is why you can loop over it repeatedly — each `for` calls `iter()` and gets a new cursor. A generator *is* its own iterator, so it has exactly one pass. That single fact explains nearly every generator bug people hit."
        },
        {
          "kind": "text",
          "text": "Why it matters beyond trivia: generators give you O(1) memory over arbitrarily large or infinite sources, they let you compose pipelines without intermediate lists, and they are the mechanism `async def` is built on — Module 27."
        }
      ]
    }
  ]
};
