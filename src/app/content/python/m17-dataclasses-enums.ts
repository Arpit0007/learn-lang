import { Lesson } from '../../shared/content';

export const M17_DATACLASSES_ENUMS: Lesson = {
  "slug": "m17-dataclasses-enums",
  "title": "M17 Dataclasses, enums, and named tuples",
  "nav": "Dataclasses & enums",
  "num": "M17",
  "eyebrow": "Level 2 · Week 8 · ~2 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Most classes exist only to hold a few fields. Writing all that code by hand is a waste."
        },
        {
          "kind": "text",
          "text": "`@dataclass` writes it for you from the field names."
        },
        {
          "kind": "text",
          "text": "`Enum` gives you a fixed list of allowed values, so a typo fails loudly instead of quietly doing nothing."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "Most classes exist only to hold a few fields. Writing `__init__`, `__repr__` and `__eq__` by hand for those is boilerplate, and the book's chapter 9 never mentions the tools that remove it. `@dataclass` generates them from type-annotated fields."
    },
    {
      "kind": "example",
      "code": "from dataclasses import dataclass, field\nfrom enum import Enum\nfrom typing import NamedTuple\n\n\nclass Status(Enum):\n    \"\"\"Named constants with a type - beats passing bare strings around.\"\"\"\n    TODO = \"todo\"\n    DOING = \"doing\"\n    DONE = \"done\"\n\n\n@dataclass\nclass Task:\n    title: str\n    status: Status = Status.TODO\n    tags: list[str] = field(default_factory=list)   # NOT tags: list = []\n\n    def is_open(self) -> bool:\n        return self.status is not Status.DONE\n\n\nclass Point(NamedTuple):\n    \"\"\"Immutable, hashable, unpackable, and indexable like a tuple.\"\"\"\n    x: float\n    y: float\n\n\nt = Task(\"write module 17\", tags=[\"docs\"])\nprint(t)                                  # __repr__ for free\nprint(t == Task(\"write module 17\", tags=[\"docs\"]))   # __eq__ for free\nprint(t.is_open(), Status.DOING.value)\n\np = Point(1.5, 2.5)\nprint(p, p.x, tuple(p), {p: \"origin-ish\"}[Point(1.5, 2.5)])",
      "label": "records.py",
      "output": "Task(title='write module 17', status=<Status.TODO: 'todo'>, tags=['docs'])\nTrue\nTrue doing\nPoint(x=1.5, y=2.5) 1.5 (1.5, 2.5) origin-ish"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`tags: list[str] = []` raises `ValueError: mutable default` at class-creation time — the dataclass machinery detects Module 13's shared-default bug and refuses. Use `field(default_factory=list)`, which calls the factory once per instance. This is one of the rare cases where Python protects you from the gotcha instead of letting it bite."
        }
      ],
      "title": "Trap · a mutable dataclass default"
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "**`@dataclass`** for mutable records with behaviour — the default choice. **`@dataclass(frozen=True)`** when it should be immutable and hashable, which also generates `__hash__`. **`NamedTuple`** when it must behave like a tuple — unpackable, indexable, backwards-compatible with code expecting tuples. **`Enum`** for a fixed set of named options, so a typo becomes an `AttributeError` instead of a silently wrong string. **`TypedDict`** for annotating JSON-shaped dicts you did not create. Plain `dict` only for genuinely dynamic keys."
        }
      ],
      "title": "Which record type to reach for"
    },
    {
      "kind": "quiz",
      "question": "Why prefer `Status.DONE` over the string `\"done\"`?",
      "options": [
        "A typo becomes an immediate AttributeError instead of a silent mismatch",
        "Enums are faster to compare",
        "Strings cannot be compared with `is`",
        "Enums use less memory"
      ],
      "answer": 0,
      "why": "**Typos fail loudly.** `Status.DONE` misspelled as `Status.DONW` raises `AttributeError` the moment it runs; `\"donw\"` just quietly fails to match and your task never completes. Enums also give you a single place to see every valid value, they are self-documenting in signatures and type checkers, and iteration over the members is free. The performance angle is irrelevant."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 17.1",
      "title": "Promote a dict to a real record",
      "blocks": [
        {
          "kind": "text",
          "text": "Start from `{\"title\": \"...\", \"status\": \"doing\", \"priority\": 2}` passed around as a dict. Convert it to a dataclass with an `Enum` status and an `IntEnum` priority, then demonstrate two bugs the dict version allowed and the dataclass version catches."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "from dataclasses import dataclass, field\nfrom enum import Enum, IntEnum\n\nclass Status(Enum):\n    TODO = \"todo\"\n    DOING = \"doing\"\n    DONE = \"done\"\n\nclass Priority(IntEnum):     # IntEnum so it still sorts like a number\n    LOW = 1\n    NORMAL = 2\n    HIGH = 3\n\n@dataclass\nclass Task:\n    title: str\n    status: Status = Status.TODO\n    priority: Priority = Priority.NORMAL\n    tags: list[str] = field(default_factory=list)\n\ntasks = [\n    Task(\"ship module 17\", Status.DOING, Priority.HIGH),\n    Task(\"water the plants\", priority=Priority.LOW),\n]\nfor t in sorted(tasks, key=lambda t: -t.priority):\n    print(f\"{t.priority.name:>6}  {t.status.value:<5}  {t.title}\")\n\n# Bug 1: the typo. Dict: silent. Dataclass + Enum: loud.\ntry:\n    Status(\"dong\")\nexcept ValueError as err:\n    print(\"caught:\", err)\n\n# Bug 2: the misspelled field. Dict: creates a new key, data lost.\nd = {\"title\": \"x\", \"status\": \"todo\"}\nd[\"titel\"] = \"y\"                 # no error, now two keys\nprint(d)",
              "label": "solution-17-1.py",
              "output": "  HIGH  doing  ship module 17\n   LOW  todo   water the plants\ncaught: 'dong' is not a valid Status\n{'title': 'x', 'status': 'todo', 'titel': 'y'}"
            },
            {
              "kind": "text",
              "text": "`t.titel = \"y\"` on the dataclass would also be allowed at runtime — Python permits new attributes — but a type checker flags it immediately, and `@dataclass(slots=True)` makes it an `AttributeError` outright. That is the upgrade path when you want it enforced.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q17",
      "title": "When would you use a dataclass over a plain class or a dict?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A dataclass when the object is primarily *data with a fixed shape* and I want the generated `__init__`, `__repr__` and `__eq__` — which is most domain models, config objects and API payloads. The generated `__repr__` alone pays for itself in debugging."
        },
        {
          "kind": "text",
          "text": "A plain class when the object is primarily *behaviour*, when construction is non-trivial, or when I need control over the initialiser that `__post_init__` cannot give cleanly."
        },
        {
          "kind": "text",
          "text": "A dict when keys are genuinely dynamic and unknown at write time. If the keys are known and fixed, a dict is the worse choice: no attribute completion, no type checking, typos silently create new keys instead of raising, and `row[\"emial\"]` is a `KeyError` discovered in production rather than an editor squiggle. \"It came from JSON\" is not a reason to keep it a dict — parse it into a dataclass at the boundary."
        }
      ]
    }
  ]
};
