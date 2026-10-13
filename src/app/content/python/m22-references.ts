import { Lesson } from '../../shared/content';

export const M22_REFERENCES: Lesson = {
  "slug": "m22-references",
  "title": "M22 References, mutability, and identity",
  "nav": "References & mutability",
  "num": "M22",
  "eyebrow": "Level 4 · Week 11 · ~2 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Assigning never copies. It only points a name at something."
        },
        {
          "kind": "text",
          "text": "If two names point at the same list and you change that list, **both** names see the change."
        },
        {
          "kind": "text",
          "text": "Changing a thing is different from pointing a name at a new thing. That difference is the whole module."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "This module is the payoff for Module 2. Every Python variable is a **name bound to an object**. Assignment rebinds a name; it never copies. Whether a change is visible elsewhere depends on one thing: whether the object is **mutable**, and whether you mutated it or rebound the name."
    },
    {
      "kind": "text",
      "text": "Immutable: `int`, `float`, `str`, `bytes`, `bool`, `tuple`, `frozenset`. Mutable: `list`, `dict`, `set`, `bytearray`, and almost every class you write."
    },
    {
      "kind": "example",
      "code": "def mutates(items):\n    items.append(\"added\")        # changes the caller's object\n    print(\"  inside (mutated):\", items)\n\ndef rebinds(items):\n    items = [\"replaced\"]         # only moves the LOCAL name\n    print(\"  inside (rebound):\", items)\n\ndata = [\"original\"]\nmutates(data); print(\"after mutates:\", data)\n\ndata = [\"original\"]\nrebinds(data); print(\"after rebinds:\", data)\n\n# augmented assignment is mutation for lists, rebinding for tuples\na = [1]; b = a; a += [2]         # list.__iadd__ mutates in place\nprint(a, b)\n\nx = (1,); y = x; x += (2,)       # tuples can't mutate, so this rebinds x\nprint(x, y)",
      "label": "references.py",
      "output": "  inside (mutated): ['original', 'added']\nafter mutates: ['original', 'added']\n  inside (rebound): ['replaced']\nafter rebinds: ['original']\n[1, 2] [1, 2]\n(1, 2) (1,)"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Look at the last four lines again. For a list, `a += [2]` calls `__iadd__` and mutates in place, so the aliased `b` sees it. For a tuple there is no in-place version, so Python falls back to `x = x + (2,)` and rebinds — leaving `y` untouched. Identical syntax, opposite aliasing behaviour, decided by the type. This is the single most reliable way to catch someone who has memorised \"Python is pass by reference\" without understanding it."
        }
      ],
      "title": "Trap · `+=` means two different things"
    },
    {
      "kind": "quiz",
      "question": "How do you copy a list of dicts so that editing an inner dict does not affect the original?",
      "options": [
        "`new = old[:]`",
        "`new = list(old)`",
        "`new = copy.deepcopy(old)`",
        "`new = old.copy()`"
      ],
      "answer": 2,
      "why": "**`deepcopy`.** The other three are all *shallow*: they build a new outer list whose elements are the same dict objects, so `new[0][\"k\"] = 1` is visible in `old[0]`. `deepcopy` recursively copies the whole graph and handles cycles. It is also slow, so the better design is often to avoid needing it — build new objects instead of mutating shared ones, or use frozen dataclasses."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 22.1",
      "title": "Predict every line",
      "blocks": [
        {
          "kind": "text",
          "text": "Write down what each `print` produces *before* revealing. Getting all six right means Level 4 has landed."
        },
        {
          "kind": "example",
          "code": "a = [1, 2]\nb = a\nc = a[:]\na.append(3)\nprint(b, c)\n\ndef f(lst, n):\n    lst.append(n)\n    lst = [99]\n    return lst\n\nout = [1]\nprint(f(out, 2), out)\n\nd1 = {\"k\": [1]}\nd2 = dict(d1)\nd2[\"k\"].append(2)\nd2[\"new\"] = True\nprint(d1)\n\nt = (1, [2])\nt[1].append(3)\nprint(t)",
          "label": "predict-22-1.py",
          "output": "[1, 2, 3] [1, 2]\n[99] [1, 2]\n{'k': [1, 2]}\n(1, [2, 3])"
        },
        {
          "kind": "reveal",
          "tag": "Explanation",
          "title": "Show me",
          "blocks": [
            {
              "kind": "text",
              "text": "**1.** `b` aliases `a` and sees the append; `c` is a copy taken before it. **2.** The function mutated the caller's list (so `out` is `[1, 2]`) and then rebound its local name, returning a different list entirely. **3.** `dict(d1)` is shallow — the inner list is shared, so `d1` sees the append; adding a new *key* only touches `d2`. **4.** The tuple is immutable but the list inside it is not: tuples guarantee their slots, not their contents."
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q22",
      "title": "Why can't you use a list as a dict key, but a tuple works?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Dict keys must be hashable, and hashability requires that an object's hash never changes for its lifetime — otherwise the dict places it in one bucket and later looks for it in another, so the entry becomes unreachable. Lists are mutable, so they deliberately set `__hash__ = None` and raise `TypeError: unhashable type: 'list'`."
        },
        {
          "kind": "text",
          "text": "Tuples are immutable in their *own* slots, so their hash can be derived from their contents — but only if those contents are themselves hashable. `hash((1, 2))` works; `hash(([1], 2))` raises. That is the follow-up question, and it is really asking whether you understand that immutability in Python is shallow."
        }
      ]
    }
  ]
};
