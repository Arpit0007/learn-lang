import { Lesson } from '../../shared/content';

export const M13_FUNCTIONS: Lesson = {
  "slug": "m13-functions",
  "title": "M13 Functions",
  "nav": "Functions",
  "num": "M13",
  "eyebrow": "Level 2 · Week 6 · ~4 sessions · PCC ch.8",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A function is a job you give a name, so you can do it again without rewriting it."
        },
        {
          "kind": "text",
          "text": "Values you pass in are arguments. Names in the definition are parameters."
        },
        {
          "kind": "text",
          "text": "**Never** use a list or dict as a default value. Use `None` instead, or every call will share the same one."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "A function packages a job under a name. **Parameters** are the names in the definition; **arguments** are the values you pass. Arguments can be positional (matched by order) or keyword (matched by name), and parameters can have defaults — but a parameter with a default must come after all those without."
    },
    {
      "kind": "text",
      "text": "Every function returns something. If you do not write `return`, it returns `None`."
    },
    {
      "kind": "example",
      "code": "def describe_pet(name, animal=\"dog\"):\n    \"\"\"Return a one-line description. `animal` defaults to dog.\"\"\"\n    return f\"{name.title()} the {animal}\"\n\nprint(describe_pet(\"rex\"))                        # positional\nprint(describe_pet(\"whiskers\", \"cat\"))            # positional\nprint(describe_pet(animal=\"hamster\", name=\"hu\"))  # keyword: order irrelevant\n\ndef build_profile(first, last, **extra):\n    \"\"\"**extra collects any surplus keyword arguments into a dict.\"\"\"\n    profile = {\"first\": first, \"last\": last}\n    profile.update(extra)\n    return profile\n\nprint(build_profile(\"ada\", \"lovelace\", field=\"maths\", born=1815))\n\ndef total(*numbers):\n    \"\"\"*numbers collects surplus positional arguments into a tuple.\"\"\"\n    return sum(numbers)\n\nprint(total(1, 2, 3), total())\n\ndef stats(values):\n    \"\"\"Returning a tuple lets a caller unpack multiple results.\"\"\"\n    return min(values), max(values), sum(values) / len(values)\n\nlo, hi, avg = stats([4, 8, 15, 16])\nprint(lo, hi, avg)",
      "label": "functions.py",
      "output": "Rex the dog\nWhiskers the cat\nHu the hamster\n{'first': 'ada', 'last': 'lovelace', 'field': 'maths', 'born': 1815}\n6 0\n4 16 10.75"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`def add(item, bucket=[]):` is a bug. The default is evaluated **once**, when the `def` line runs — not on each call — so every call that omits `bucket` shares one list, and it accumulates across calls. This is the most famous gotcha in the language. The fix is always the same: default to `None` and build inside."
        }
      ],
      "title": "Trap · the mutable default argument"
    },
    {
      "kind": "example",
      "code": "def broken(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nprint(broken(\"a\"))\nprint(broken(\"b\"))        # surprise: 'a' is still there\n\ndef fixed(item, bucket=None):\n    if bucket is None:\n        bucket = []       # a fresh list per call\n    bucket.append(item)\n    return bucket\n\nprint(fixed(\"a\"))\nprint(fixed(\"b\"))",
      "label": "mutable_default.py",
      "output": "['a']\n['a', 'b']\n['a']\n['b']"
    },
    {
      "kind": "quiz",
      "question": "What does a function with no `return` statement return?",
      "options": [
        "Nothing — the call is a statement, not an expression",
        "`0`",
        "`None`",
        "It raises a TypeError when assigned"
      ],
      "answer": 2,
      "why": "**`None`.** Every Python function returns a value, and the implicit one is `None`. This is why `x = my_list.sort()` gives you `None` rather than an error — `sort()` mutates and implicitly returns nothing. It is also why a forgotten `return` shows up as a downstream `NoneType` error rather than at the function itself."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 13.1",
      "title": "Non-destructive by default",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `print_models(unprinted, completed)` that moves each design from one list to the other. Then write a version that leaves the caller's list intact, and show both behaviours."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "def print_models(unprinted, completed):\n    \"\"\"Mutates the caller's lists - drains `unprinted`.\"\"\"\n    while unprinted:\n        design = unprinted.pop()\n        print(f\"printing {design}\")\n        completed.append(design)\n\ndesigns = [\"phone case\", \"robot\", \"dodecahedron\"]\ndone = []\nprint_models(designs[:], done)      # pass a COPY to protect the original\nprint(designs, done)",
              "label": "solution-13-1.py",
              "output": "printing dodecahedron\nprinting robot\nprinting phone case\n['phone case', 'robot', 'dodecahedron'] ['dodecahedron', 'robot', 'phone case']"
            },
            {
              "kind": "text",
              "text": "The general rule: a function that mutates its arguments should say so in its name and docstring. If it does not need to mutate, take a copy or return a new value — surprising mutation is the hardest class of bug to trace, and Module 22 explains exactly why.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q13",
      "title": "Explain `*args` and `**kwargs`.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** In a *definition*, `*args` collects surplus positional arguments into a tuple and `**kwargs` collects surplus keyword arguments into a dict. The names are convention only — the `*` and `**` do the work."
        },
        {
          "kind": "text",
          "text": "At a *call site* the same syntax does the reverse: it unpacks. `f(*my_list)` spreads a list into positional arguments and `f(**my_dict)` spreads a dict into keyword arguments. Recognising that unpacking and packing share the symbol is what the question is really testing."
        },
        {
          "kind": "text",
          "text": "Two extras that signal experience. Ordering in a signature is fixed: positional, `*args`, keyword-only, `**kwargs`. And a bare `*` makes everything after it **keyword-only** — `def connect(host, *, timeout=30)` forces callers to write `timeout=5`, which prevents a whole category of \"what does that third positional number mean?\" bug."
        }
      ]
    }
  ]
};
