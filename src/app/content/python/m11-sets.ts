import { Lesson } from '../../shared/content';

export const M11_SETS: Lesson = {
  "slug": "m11-sets",
  "title": "M11 Sets — the type the book skips",
  "nav": "Sets",
  "num": "M11",
  "eyebrow": "Level 1 · Week 5 · ~2 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A set holds only unique things, with no order."
        },
        {
          "kind": "text",
          "text": "It is the right tool for two jobs: removing duplicates, and checking “is this thing in here?” very fast."
        },
        {
          "kind": "text",
          "text": "Writing `{}` gives you an empty *dictionary*. An empty set is `set()`."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 170\" role=\"img\" aria-label=\"Three Venn diagrams showing union, intersection and difference of two sets.\">\n      <g>\n        <text x=\"85\" y=\"16\" class=\"dg-s\" text-anchor=\"middle\">a | b   UNION</text>\n        <circle cx=\"62\" cy=\"80\" r=\"42\" class=\"dg-ok\"></circle><circle cx=\"108\" cy=\"80\" r=\"42\" class=\"dg-ok\"></circle>\n        <text x=\"85\" y=\"150\" class=\"dg-t\" text-anchor=\"middle\">everything</text>\n      </g>\n      <g>\n        <text x=\"270\" y=\"16\" class=\"dg-s\" text-anchor=\"middle\">a &amp; b   INTERSECTION</text>\n        <circle cx=\"247\" cy=\"80\" r=\"42\" class=\"dg-box\"></circle><circle cx=\"293\" cy=\"80\" r=\"42\" class=\"dg-box\"></circle>\n        <path d=\"M270 42 A42 42 0 0 1 270 118 A42 42 0 0 1 270 42 Z\" class=\"dg-ok\"></path>\n        <text x=\"270\" y=\"150\" class=\"dg-t\" text-anchor=\"middle\">only the middle</text>\n      </g>\n      <g>\n        <text x=\"455\" y=\"16\" class=\"dg-s\" text-anchor=\"middle\">a - b   DIFFERENCE</text>\n        <circle cx=\"432\" cy=\"80\" r=\"42\" class=\"dg-ok\"></circle><circle cx=\"478\" cy=\"80\" r=\"42\" class=\"dg-box\"></circle>\n        <path d=\"M455 42 A42 42 0 0 1 455 118 A42 42 0 0 1 455 42 Z\" class=\"dg-box\"></path>\n        <text x=\"455\" y=\"150\" class=\"dg-t\" text-anchor=\"middle\">in a, not in b</text>\n      </g>\n    </svg>",
      "caption": "Three questions people usually answer with nested loops — what is in both, what is in either, what is only in the first — are single operators on sets, and each runs in one pass instead of one pass per item."
    },
    {
      "kind": "text",
      "text": "*Python Crash Course* barely mentions sets, which is a real gap: a set is an **unordered collection of unique, hashable items** with O(1) membership testing. Any time you write \"distinct\", \"already seen\", \"in both\", or \"in one but not the other\", the answer is a set, and using a list instead turns an O(n) job into O(n²)."
    },
    {
      "kind": "example",
      "code": "seen = {\"py\", \"go\", \"py\"}         # duplicates collapse\nprint(seen, len(seen))\n\nseen.add(\"rust\")\nseen.discard(\"nope\")              # no error if absent; .remove() would raise\nprint(\"py\" in seen)               # O(1), regardless of size\n\na = {1, 2, 3, 4}\nb = {3, 4, 5}\nprint(a | b)        # union\nprint(a & b)        # intersection\nprint(a - b)        # difference: in a, not in b\nprint(a ^ b)        # symmetric difference: in exactly one\nprint({1, 2} <= a)  # subset\n\nprint(sorted(set([3, 1, 3, 2])))  # dedupe, then order\n\nempty = set()                     # {} is an empty DICT, not a set\nprint(type(empty).__name__, type({}).__name__)",
      "label": "sets.py",
      "output": "{'py', 'go'} 2\nTrue\n{1, 2, 3, 4, 5}\n{3, 4}\n{1, 2}\n{1, 2, 5}\nTrue\n[1, 2, 3]\nset dict"
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "Checking membership in a list of 100,000 items scans it — roughly 100,000 comparisons in the worst case, every time. The same check on a set is one hash. Turning `if x in big_list` into `if x in big_set` is the single most common one-line performance fix in real Python code, and Module 28 measures it."
        }
      ],
      "title": "Why this matters more than it looks"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Two things bite. First, sets are unordered — printing one may show any arrangement, and it can differ between runs for strings because hashing is randomised per process. Never rely on set order; call `sorted()` when you need a stable sequence. Second, `{}` creates an empty *dict*; the empty set is `set()`. There is no literal for it, because dicts claimed the braces first."
        }
      ],
      "title": "Trap · sets have no order, and `{}` is not empty-set"
    },
    {
      "kind": "quiz",
      "question": "You need to preserve first-seen order while removing duplicates from a list. What is the idiomatic one-liner?",
      "options": [
        "`list(dict.fromkeys(items))`",
        "`list(set(items))`",
        "`sorted(set(items))`",
        "`items.unique()`"
      ],
      "answer": 0,
      "why": "**`list(dict.fromkeys(items))`.** Dicts are insertion-ordered and keys are unique, so this dedupes *and* keeps the original order. `list(set(items))` dedupes but scrambles order; `sorted(set(items))` dedupes and sorts, which is a different requirement. And `items.unique()` does not exist — that is pandas, not the standard library."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 11.1",
      "title": "Two guest lists",
      "blocks": [
        {
          "kind": "text",
          "text": "Given last year's and this year's attendee lists, report: who came both years, who is new, who dropped out, and the total distinct people ever."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "last = {\"ada\", \"grace\", \"linus\", \"alan\"}\nthis = {\"grace\", \"alan\", \"margaret\"}\n\nprint(\"returning:\", sorted(last & this))\nprint(\"new:      \", sorted(this - last))\nprint(\"dropped:  \", sorted(last - this))\nprint(\"ever:     \", len(last | this))",
              "label": "solution-11-1.py",
              "output": "returning: ['alan', 'grace']\nnew:       ['margaret']\ndropped:   ['ada', 'linus']\never:      5"
            },
            {
              "kind": "text",
              "text": "Four lines, no loops. The same job with lists needs nested iteration and a membership test per item — it works, but it is longer, slower, and easier to get wrong.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q11",
      "title": "Set vs list vs dict — how do you choose?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** By the question the data has to answer. **List** when order matters or duplicates are meaningful, and you mostly iterate or index — membership is O(n). **Set** when you need uniqueness or fast membership and order is irrelevant — add and `in` are O(1), items must be hashable. **Dict** when each item has an associated value you look up by key — same O(1) hashing, plus insertion order preserved."
        },
        {
          "kind": "text",
          "text": "The tell in a code review is a list being used for membership testing inside a loop. That is an accidental O(n²), and converting the inner collection to a set once before the loop usually fixes it outright."
        }
      ]
    }
  ]
};
