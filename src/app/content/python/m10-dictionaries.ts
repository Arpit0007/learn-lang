import { Lesson } from '../../shared/content';

export const M10_DICTIONARIES: Lesson = {
  "slug": "m10-dictionaries",
  "title": "M10 Dictionaries",
  "nav": "Dictionaries",
  "num": "M10",
  "eyebrow": "Level 1 · Week 4 · ~3 sessions · PCC ch.6",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A dictionary stores pairs: a **key** and its **value**, like a phone book."
        },
        {
          "kind": "text",
          "text": "You look things up by key instead of by position, and it stays fast even with a million entries."
        },
        {
          "kind": "text",
          "text": "Keys must be things that cannot change — text, numbers, tuples. Not lists."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 190\" role=\"img\" aria-label=\"A dictionary key is hashed into a number, which picks a slot directly, so lookup does not scan the other entries.\">\n      <defs><marker id=\"a-m10\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><polygon points=\"0,1 9,5 0,9\" fill=\"currentColor\"></polygon></marker></defs>\n      <rect x=\"4\" y=\"60\" width=\"120\" height=\"38\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"64\" y=\"84\" class=\"dg-t\" text-anchor=\"middle\">\"colour\"</text>\n      <text x=\"64\" y=\"50\" class=\"dg-s\" text-anchor=\"middle\">KEY</text>\n      <line x1=\"128\" y1=\"79\" x2=\"186\" y2=\"79\" class=\"dg-l\" marker-end=\"url(#a-m10)\"></line>\n      <rect x=\"190\" y=\"60\" width=\"104\" height=\"38\" rx=\"4\" class=\"dg-fill\"></rect>\n      <text x=\"242\" y=\"84\" class=\"dg-t\" text-anchor=\"middle\">hash()</text>\n      <line x1=\"298\" y1=\"79\" x2=\"356\" y2=\"79\" class=\"dg-l\" marker-end=\"url(#a-m10)\"></line>\n      <text x=\"327\" y=\"70\" class=\"dg-s\" text-anchor=\"middle\">slot 2</text>\n      <rect x=\"360\" y=\"18\" width=\"170\" height=\"30\" rx=\"3\" class=\"dg-box\"></rect><text x=\"370\" y=\"38\" class=\"dg-t\">slot 0  — empty</text><rect x=\"360\" y=\"52\" width=\"170\" height=\"30\" rx=\"3\" class=\"dg-box\"></rect><text x=\"370\" y=\"72\" class=\"dg-t\">slot 1  — points</text><rect x=\"360\" y=\"86\" width=\"170\" height=\"30\" rx=\"3\" class=\"dg-ok\"></rect><text x=\"370\" y=\"106\" class=\"dg-t\">slot 2  — colour</text><rect x=\"360\" y=\"120\" width=\"170\" height=\"30\" rx=\"3\" class=\"dg-box\"></rect><text x=\"370\" y=\"140\" class=\"dg-t\">slot 3  — empty</text><rect x=\"360\" y=\"154\" width=\"170\" height=\"30\" rx=\"3\" class=\"dg-box\"></rect><text x=\"370\" y=\"174\" class=\"dg-t\">slot 4  — empty</text>\n      <text x=\"242\" y=\"130\" class=\"dg-s\" text-anchor=\"middle\">one step, not a search</text>\n    </svg>",
      "caption": "The key is turned into a number that picks a slot directly, so finding a value takes the same time whether the dictionary holds ten entries or a million. This is also why keys must never change — a changed key would hash to a different slot and become unreachable."
    },
    {
      "kind": "text",
      "text": "A dict maps **keys** to **values**. Lookup is roughly O(1) regardless of size, because keys are hashed. Keys must be hashable — so strings, numbers and tuples yes; lists and dicts no. Since Python 3.7 dicts preserve **insertion order**, which is a language guarantee now, not an implementation accident."
    },
    {
      "kind": "example",
      "code": "alien = {\"colour\": \"green\", \"points\": 5}\n\nprint(alien[\"colour\"])\nalien[\"x\"] = 0                    # add by assigning to a new key\nalien[\"points\"] = 10              # ...or overwrite\ndel alien[\"x\"]\nprint(alien)\n\n# [] raises on a missing key; .get() returns a default\nprint(alien.get(\"speed\", \"unknown\"))\n# print(alien[\"speed\"])           -> KeyError: 'speed'\n\nfor key, value in alien.items():  # pairs\n    print(f\"  {key}: {value}\")\nprint(list(alien.keys()), list(alien.values()))\n\n# counting: the idiomatic patterns\nwords = [\"py\", \"go\", \"py\", \"rust\", \"py\"]\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)\n\nfrom collections import Counter\nprint(Counter(words).most_common(2))\n\n# a comprehension, and a merge\nprint({n: n ** 2 for n in range(4)})\nprint({\"a\": 1} | {\"b\": 2, \"a\": 9})   # right wins",
      "label": "dicts.py",
      "output": "green\n{'colour': 'green', 'points': 10}\nunknown\n  colour: green\n  points: 10\n['colour', 'points'] ['green', 10]\n{'py': 3, 'go': 1, 'rust': 1}\n[('py', 3), ('go', 1)]\n{0: 0, 1: 1, 2: 4, 3: 9}\n{'a': 9, 'b': 2}"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Square brackets raise `KeyError` for a missing key; `.get()` returns `None` — or a default you supply. Neither is \"safer\": use `[]` when the key *must* be there, because a loud `KeyError` at the point of the bug beats a `None` that propagates three functions away and fails somewhere confusing. Use `.get()` only when absence is genuinely expected and you have a sensible fallback. Reaching for `.get()` everywhere to avoid exceptions is how you end up debugging `NoneType` errors."
        }
      ],
      "title": "Trap · `d[k]` versus `d.get(k)`"
    },
    {
      "kind": "quiz",
      "question": "Why can a tuple be a dict key but a list cannot?",
      "options": [
        "Tuples are smaller in memory",
        "Lists are too slow to hash",
        "It is an arbitrary restriction",
        "Keys must be hashable, and hashes must not change"
      ],
      "answer": 3,
      "why": "**Hashability.** A dict places a key in a bucket chosen by its hash. If the key mutated, its hash would change and the entry would become unreachable — present in the dict but invisible to lookup. Python therefore requires immutable, hashable keys, and lists define `__hash__ = None` to refuse. A tuple qualifies only if its contents are themselves hashable, as Module 8 showed."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 10.1",
      "title": "Word frequency",
      "blocks": [
        {
          "kind": "text",
          "text": "Given a sentence, print each distinct word with its count, sorted by count descending then alphabetically. Do it once by hand with a dict and once with `Counter`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "from collections import Counter\n\ntext = \"the quick brown fox jumps over the lazy dog the fox\"\nwords = text.split()\n\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\n\n# sort by count DESC, then word ASC - the minus flips only the number\nfor word, n in sorted(counts.items(), key=lambda pair: (-pair[1], pair[0])):\n    print(f\"{n:>3}  {word}\")\n\nprint(Counter(words).most_common(3))",
              "label": "solution-10-1.py",
              "output": "  3  the\n  2  fox\n  1  brown\n  1  dog\n  1  jumps\n  1  lazy\n  1  over\n  1  quick\n[('the', 3), ('fox', 2), ('quick', 1)]"
            },
            {
              "kind": "text",
              "text": "The `key=` function returning a *tuple* is the general recipe for multi-level sorting, and negating the number is how you sort one field descending while another stays ascending.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q10",
      "title": "How does a Python dict work internally?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** It is a hash table. On insert, Python calls `hash(key)`, uses the result to pick a slot in an internal array, and stores the entry there; collisions are resolved by probing to other slots. Lookup repeats the hash and probes until it finds a matching key or an empty slot, which is why average lookup is O(1) and worst case is O(n)."
        },
        {
          "kind": "text",
          "text": "Two details worth adding. Since 3.6 CPython uses a *compact* layout: a dense array of entries in insertion order plus a sparse array of indices into it. That is why dicts became ordered and about 20–25% smaller at the same time — the ordering was a side effect that 3.7 then promised as language behaviour. And equality matters as much as hashing: two keys that are `==` must have the same hash, so if you define `__eq__` on a class you must define `__hash__` too, or your objects break as dict keys."
        }
      ]
    }
  ]
};
