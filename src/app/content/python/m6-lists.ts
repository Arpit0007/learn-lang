import { Lesson } from '../../shared/content';

export const M6_LISTS: Lesson = {
  "slug": "m6-lists",
  "title": "M6 Lists",
  "nav": "Lists",
  "num": "M6",
  "eyebrow": "Level 1 · Week 2 · ~3 sessions · PCC ch.3",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A list holds many things, in order. You can add, change and remove things in it."
        },
        {
          "kind": "text",
          "text": "Counting starts at **0**, not 1. The last item is `-1`."
        },
        {
          "kind": "text",
          "text": "Careful: `list.sort()` changes the list and gives back nothing. `sorted(list)` gives back a new list."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 150\" role=\"img\" aria-label=\"A list of five letters showing positive indices zero to four above and negative indices minus five to minus one below.\">\n      <text x=\"0\" y=\"14\" class=\"dg-s\">INDEX FROM THE START</text>\n      <text x=\"32\" y=\"40\" class=\"dg-t\" text-anchor=\"middle\">0</text><text x=\"132\" y=\"40\" class=\"dg-t\" text-anchor=\"middle\">1</text><text x=\"232\" y=\"40\" class=\"dg-t\" text-anchor=\"middle\">2</text><text x=\"332\" y=\"40\" class=\"dg-t\" text-anchor=\"middle\">3</text><text x=\"432\" y=\"40\" class=\"dg-t\" text-anchor=\"middle\">4</text>\n      <rect x=\"2\" y=\"50\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-fill\"></rect><text x=\"32\" y=\"76\" class=\"dg-t\" text-anchor=\"middle\">\"a\"</text><rect x=\"102\" y=\"50\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-fill\"></rect><text x=\"132\" y=\"76\" class=\"dg-t\" text-anchor=\"middle\">\"b\"</text><rect x=\"202\" y=\"50\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-fill\"></rect><text x=\"232\" y=\"76\" class=\"dg-t\" text-anchor=\"middle\">\"c\"</text><rect x=\"302\" y=\"50\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-fill\"></rect><text x=\"332\" y=\"76\" class=\"dg-t\" text-anchor=\"middle\">\"d\"</text><rect x=\"402\" y=\"50\" width=\"60\" height=\"40\" rx=\"4\" class=\"dg-fill\"></rect><text x=\"432\" y=\"76\" class=\"dg-t\" text-anchor=\"middle\">\"e\"</text>\n      <text x=\"32\" y=\"110\" class=\"dg-t\" text-anchor=\"middle\">-5</text><text x=\"132\" y=\"110\" class=\"dg-t\" text-anchor=\"middle\">-4</text><text x=\"232\" y=\"110\" class=\"dg-t\" text-anchor=\"middle\">-3</text><text x=\"332\" y=\"110\" class=\"dg-t\" text-anchor=\"middle\">-2</text><text x=\"432\" y=\"110\" class=\"dg-t\" text-anchor=\"middle\">-1</text>\n      <text x=\"0\" y=\"134\" class=\"dg-s\">INDEX FROM THE END</text>\n    </svg>",
      "caption": "Counting starts at 0, so the fifth item is at index 4. Negative numbers count back from the end, which is why `items[-1]` is the last item and you never need `items[len(items) - 1]`."
    },
    {
      "kind": "text",
      "text": "A list is an **ordered, mutable** sequence. Ordered means positions are stable and meaningful. Mutable means you can change it in place — which is why Module 2's labels lesson matters here more than anywhere."
    },
    {
      "kind": "text",
      "text": "Indexing starts at **0**. Negative indices count from the end, so `-1` is the last element and you never need `len(x) - 1`."
    },
    {
      "kind": "example",
      "code": "langs = [\"python\", \"rust\", \"go\"]\n\nprint(langs[0], langs[-1])\n\nlangs.append(\"zig\")            # add to the end\nlangs.insert(1, \"c\")           # insert at a position, shifting the rest\nprint(langs)\n\npopped = langs.pop()           # remove AND return the last item\nremoved = langs.pop(0)         # ...or a specific index\nlangs.remove(\"c\")              # remove by VALUE, first match only\nprint(popped, removed, langs)\n\nnums = [3, 1, 2]\nnums.sort()                    # sorts IN PLACE, returns None\nprint(nums)\nprint(sorted([3, 1, 2], reverse=True))   # returns a NEW list, original intact\n\nprint(len(nums), 2 in nums, nums.count(2))",
      "label": "lists.py",
      "output": "python go\n['python', 'c', 'rust', 'go', 'zig']\nzig python ['rust', 'go']\n[1, 2, 3]\n[3, 2, 1]\n3 True 1"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "In-place methods return `None`. So `nums = nums.sort()` silently replaces your list with `None`, and the failure surfaces later as `TypeError: 'NoneType' object is not iterable` somewhere unrelated. The rule Python follows consistently: methods that mutate return `None` (`sort`, `append`, `reverse`), functions that compute return a new object (`sorted`, `reversed`). When you want both the sort and the original, use `sorted()`."
        }
      ],
      "title": "Trap · `x = my_list.sort()`"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Removing items from a list inside a `for` over that same list skips elements, because the loop advances an index while the list shrinks underneath it. Build a new list instead — `keep = [x for x in items if not junk(x)]` — or iterate over a copy with `for x in items[:]`. This one produces bugs that look random and are not."
        }
      ],
      "title": "Trap · mutating a list while looping over it"
    },
    {
      "kind": "quiz",
      "question": "What does `[1, 2, 3][5]` raise, and what does `[1, 2, 3][1:5]` do?",
      "options": [
        "Both raise IndexError",
        "Neither raises; both give `[]`",
        "Indexing raises IndexError; slicing returns `[2, 3]`",
        "Indexing returns None; slicing raises ValueError"
      ],
      "answer": 2,
      "why": "**Indexing raises, slicing clamps.** An out-of-range *index* is an error because you asked for one specific element that does not exist. An out-of-range *slice* silently trims to what is available, because you asked for a range and Python gives you the overlap. That asymmetry is deliberate and is exactly why an accidental slice can hide a bug that an index would have caught loudly."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 6.1",
      "title": "Guest list",
      "blocks": [
        {
          "kind": "text",
          "text": "Start with three guests. Print an invitation for each. Then: one cannot come — replace them; the venue got bigger — add one at the front, one in the middle and one at the end; then the venue shrank to two — pop guests one at a time, printing an apology for each, until two remain. Finally confirm the list has exactly two names."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "guests = [\"ada\", \"grace\", \"linus\"]\n\nfor guest in guests:\n    print(f\"{guest.title()}, please join me for dinner.\")\n\nprint(f\"\\n{guests[1].title()} can't make it.\")\nguests[1] = \"alan\"\n\nguests.insert(0, \"barbara\")\nguests.insert(len(guests) // 2, \"donald\")\nguests.append(\"margaret\")\nprint(f\"Bigger table: {guests}\\n\")\n\nwhile len(guests) > 2:\n    cut = guests.pop()\n    print(f\"Sorry {cut.title()}, no room after all.\")\n\nprint(f\"\\nStill coming: {guests}\")\nassert len(guests) == 2",
              "label": "solution-6-1.py"
            },
            {
              "kind": "text",
              "text": "Two things to notice: `while len(guests) > 2` rather than a `for`, because the list is shrinking as we go — the trap above; and `assert` as a cheap self-check, which is the seed of Module 29.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q6",
      "title": "List vs tuple — when do you use which?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** The textbook distinction is mutability: lists can change, tuples cannot. The distinction that actually drives the choice is *semantic*."
        },
        {
          "kind": "text",
          "text": "A list is a **homogeneous collection of unknown length** — many things of the same kind, where position carries no meaning beyond order. A tuple is a **heterogeneous record of fixed shape** — a coordinate `(x, y)`, a database row — where position *is* the meaning. So \"how many?\" suggests a list, \"what are its fields?\" suggests a tuple."
        },
        {
          "kind": "text",
          "text": "Immutability then buys two concrete things: tuples are hashable, so they can be dict keys and set members where lists cannot; and a tuple in an API signals \"this is not yours to modify\". For a fixed-shape record with more than two or three fields, though, both lose to a `NamedTuple` or `dataclass` — Module 17 — because `row.email` beats `row[3]` in every code review."
        }
      ]
    }
  ]
};
