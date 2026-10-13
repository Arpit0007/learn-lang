import { Lesson } from '../../shared/content';

export const M8_SLICING_TUPLES: Lesson = {
  "slug": "m8-slicing-tuples",
  "title": "M8 Slicing, copying, and tuples",
  "nav": "Slicing & tuples",
  "num": "M8",
  "eyebrow": "Level 1 · Week 3 · ~2 sessions · PCC ch.4",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Slicing takes a piece out, like cutting a slice of cake. `items[1:3]` means “from 1, up to but not including 3”."
        },
        {
          "kind": "text",
          "text": "`items[:]` makes a copy — but only a shallow one. Lists inside are still shared."
        },
        {
          "kind": "text",
          "text": "A tuple is like a list you are not allowed to change."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 170\" role=\"img\" aria-label=\"Slice boundaries sit between items, so a slice from one to three takes the two items between those cut points.\">\n      <defs><marker id=\"a-m8\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><polygon points=\"0,1 9,5 0,9\" fill=\"currentColor\"></polygon></marker></defs>\n      <text x=\"0\" y=\"14\" class=\"dg-s\">CUTS GO BETWEEN ITEMS, NOT THROUGH THEM</text>\n      <rect x=\"20\" y=\"56\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-box\"></rect><text x=\"50\" y=\"82\" class=\"dg-t\" text-anchor=\"middle\">\"a\"</text><rect x=\"120\" y=\"56\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-ok\"></rect><text x=\"150\" y=\"82\" class=\"dg-t\" text-anchor=\"middle\">\"b\"</text><rect x=\"220\" y=\"56\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-ok\"></rect><text x=\"250\" y=\"82\" class=\"dg-t\" text-anchor=\"middle\">\"c\"</text><rect x=\"320\" y=\"56\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-box\"></rect><text x=\"350\" y=\"82\" class=\"dg-t\" text-anchor=\"middle\">\"d\"</text><rect x=\"420\" y=\"56\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-box\"></rect><text x=\"450\" y=\"82\" class=\"dg-t\" text-anchor=\"middle\">\"e\"</text>\n      <line x1=\"10\" y1=\"46\" x2=\"10\" y2=\"106\" class=\"dg-d\"></line><text x=\"10\" y=\"38\" class=\"dg-s\" text-anchor=\"middle\">0</text><line x1=\"110\" y1=\"46\" x2=\"110\" y2=\"106\" class=\"dg-d\"></line><text x=\"110\" y=\"38\" class=\"dg-s\" text-anchor=\"middle\">1</text><line x1=\"210\" y1=\"46\" x2=\"210\" y2=\"106\" class=\"dg-d\"></line><text x=\"210\" y=\"38\" class=\"dg-s\" text-anchor=\"middle\">2</text><line x1=\"310\" y1=\"46\" x2=\"310\" y2=\"106\" class=\"dg-d\"></line><text x=\"310\" y=\"38\" class=\"dg-s\" text-anchor=\"middle\">3</text><line x1=\"410\" y1=\"46\" x2=\"410\" y2=\"106\" class=\"dg-d\"></line><text x=\"410\" y=\"38\" class=\"dg-s\" text-anchor=\"middle\">4</text><line x1=\"510\" y1=\"46\" x2=\"510\" y2=\"106\" class=\"dg-d\"></line><text x=\"510\" y=\"38\" class=\"dg-s\" text-anchor=\"middle\">5</text>\n      <line x1=\"112\" y1=\"126\" x2=\"308\" y2=\"126\" class=\"dg-l\" marker-end=\"url(#a-m8)\" marker-start=\"url(#a-m8)\"></line>\n      <text x=\"210\" y=\"148\" class=\"dg-t\" text-anchor=\"middle\">items[1:3] → [\"b\", \"c\"]</text>\n    </svg>",
      "caption": "Think of the numbers as cut points between items rather than as the items themselves. Start at cut 1, stop at cut 3, take what is in between — which is why the stop number is never included."
    },
    {
      "kind": "text",
      "text": "Slicing takes `[start:stop:step]`. `start` is inclusive, `stop` is exclusive, all three are optional, and negative values count from the end. Slicing a list always returns a **new list** — which is what makes `[:]` the classic shallow copy."
    },
    {
      "kind": "example",
      "code": "letters = [\"a\", \"b\", \"c\", \"d\", \"e\"]\n\nprint(letters[1:3])     # b, c\nprint(letters[:3])      # from the start\nprint(letters[2:])      # to the end\nprint(letters[-2:])     # last two\nprint(letters[::2])     # every second\nprint(letters[::-1])    # reversed - a new list, original untouched\n\noriginal = [\"x\", \"y\"]\nalias = original            # SAME list\ncopy   = original[:]        # NEW list\nalias.append(\"z\")\nprint(original, copy)",
      "label": "slicing.py",
      "output": "['b', 'c']\n['a', 'b', 'c']\n['c', 'd', 'e']\n['d', 'e']\n['a', 'c', 'e']\n['e', 'd', 'c', 'b', 'a']\n['x', 'y', 'z'] ['x', 'y']"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Tuples"
    },
    {
      "kind": "text",
      "text": "A tuple is an immutable sequence, written with commas — the parentheses are usually optional and it is the comma that makes the tuple. Immutable means you cannot reassign an element; you can only rebind the whole name."
    },
    {
      "kind": "example",
      "code": "dims = (1920, 1080)\nprint(dims[0], len(dims))\n\n# dims[0] = 1280        -> TypeError: 'tuple' object does not support item assignment\ndims = (1280, 720)      # rebinding the whole tuple is fine\n\nwidth, height = dims    # unpacking\nprint(f\"{width}x{height}\")\n\nsingle = (42,)          # the comma is what makes it a tuple\nnot_a_tuple = (42)      # ...this is just an int in parentheses\nprint(type(single).__name__, type(not_a_tuple).__name__)\n\nfirst, *rest = [1, 2, 3, 4]     # starred unpacking works on any sequence\nprint(first, rest)",
      "label": "tuples.py",
      "output": "1920 2\n1280x720\ntuple int\n1 [2, 3, 4]"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`copy = original[:]` makes a new outer list whose elements are the *same objects*. So for a list of lists, mutating `copy[0]` still changes `original[0]` — you duplicated the container, not the contents. When the nested items are mutable and you need real independence, use `copy.deepcopy()`. This is the second half of the labels lesson and a reliable interview question."
        }
      ],
      "title": "Trap · `[:]` is a *shallow* copy"
    },
    {
      "kind": "quiz",
      "question": "A tuple is immutable. So is `t = ([1], 2)` hashable?",
      "options": [
        "Yes — tuples are always hashable",
        "No — it contains a list, so hashing raises TypeError",
        "Yes, but only until the list is mutated",
        "No — tuples are never hashable"
      ],
      "answer": 1,
      "why": "**No.** A tuple's hash is computed from its elements' hashes, so a tuple is hashable only if *everything inside it* is. `hash(([1], 2))` raises `TypeError: unhashable type: 'list'`. The lesson: immutability in Python is shallow too. A tuple guarantees its own slots will not be reassigned, not that the objects in those slots cannot change."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 8.1",
      "title": "Prove shallow is shallow",
      "blocks": [
        {
          "kind": "text",
          "text": "Build `grid = [[0, 0], [0, 0]]`. Make a slice copy and a deep copy. Mutate the inner list of the original and print all three. Then explain the output to yourself out loud."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import copy\n\ngrid    = [[0, 0], [0, 0]]\nshallow = grid[:]\ndeep    = copy.deepcopy(grid)\n\ngrid[0][0] = 9          # mutate the INNER list\n\nprint(\"grid   \", grid)\nprint(\"shallow\", shallow)   # sees the change - same inner lists\nprint(\"deep   \", deep)      # independent",
              "label": "solution-8-1.py",
              "output": "grid    [[9, 0], [0, 0]]\nshallow [[9, 0], [0, 0]]\ndeep    [[0, 0], [0, 0]]"
            },
            {
              "kind": "text",
              "text": "Also worth knowing: `[[0] * 2] * 2` is worse still — it repeats one inner list twice, so all rows are the same object. Build nested structures with a comprehension: `[[0] * 2 for _ in range(2)]`.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q8",
      "title": "Explain `a[::-1]` and whether it is the best way to reverse.",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It slices the whole sequence with step `-1`, producing a new reversed sequence. It works on anything sliceable, so it reverses strings and tuples too, which `list.reverse()` cannot."
        },
        {
          "kind": "text",
          "text": "Best depends on what you need. `a[::-1]` allocates a full copy. `a.reverse()` reverses in place with no extra memory but only works on lists and returns `None`. `reversed(a)` returns a lazy iterator and is the right answer when you only want to *loop* backwards, since it allocates nothing. For a string, `s[::-1]` is the idiomatic choice and readable enough that `\"\".join(reversed(s))` is not an improvement."
        }
      ]
    }
  ]
};
