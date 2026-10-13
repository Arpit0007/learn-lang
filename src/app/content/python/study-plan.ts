import { Lesson } from '../../shared/content';

export const STUDY_PLAN: Lesson = {
  "slug": "study-plan",
  "title": "The 16-week study plan",
  "nav": "16-week study plan",
  "eyebrow": "Schedule",
  "blocks": [
    {
      "kind": "text",
      "text": "Six study days a week, one revision day. Day 7 is deliberately *revision*, not new material — spaced repetition is why this plan is 16 weeks and not 6. A session is 60–120 minutes: roughly 40% reading, 60% typing code."
    },
    {
      "kind": "table",
      "head": [
        "Week",
        "Focus",
        "Day-by-day"
      ],
      "rows": [
        [
          "1",
          "Setup, names, strings",
          "D1 M1 + setup · D2–3 M2 (variables) · D4–5 M3 (strings) · D6 exercises M2–3 · **D7 revision**"
        ],
        [
          "2",
          "Numbers, style, lists",
          "D1 M4 (numbers) · D2 M5 (style + Zen) · D3–5 M6 (lists) · D6 mini-project: shopping-list tool · **D7 revision + interview Q1–6**"
        ],
        [
          "3",
          "Loops and slicing",
          "D1–3 M7 (loops, range, comprehensions) · D4–5 M8 (slicing, copying, tuples) · D6 mini-project: FizzBuzz + temperature table · **D7 revision**"
        ],
        [
          "4",
          "Conditionals and dicts",
          "D1–2 M9 (if, truthiness) · D3–5 M10 (dictionaries) · D6 mini-project: word-frequency counter · **D7 revision + interview Q7–12**"
        ],
        [
          "5",
          "Sets, input, while",
          "D1–2 M11 (sets) · D3–5 M12 (input, while) · D6 mini-project: number-guessing game · **D7 revision**"
        ],
        [
          "6",
          "Functions",
          "D1–4 M13 (functions, args, returns) · D5 M14 (modules, imports) · D6 refactor every earlier mini-project into functions · **D7 revision**"
        ],
        [
          "7",
          "Classes",
          "D1–4 M15 (classes) · D5–6 M16 (inheritance, dunders) · **D7 revision + interview Q13–18**"
        ],
        [
          "8",
          "Modern records + project 1",
          "D1–2 M17 (dataclasses, enums) · D3–6 **Project 1: CLI task tracker** · **D7 revision**"
        ],
        [
          "9",
          "Files and exceptions",
          "D1–3 M18 (pathlib, files) · D4–6 M19 (exceptions) · **D7 revision**"
        ],
        [
          "10",
          "Data formats + tooling",
          "D1–3 M20 (JSON, CSV) · D4–6 M21 (venv, pip, uv, packaging) · **D7 revision + interview Q19–24**"
        ],
        [
          "11",
          "References and iteration",
          "D1–2 M22 (references, mutability) · D3–6 M23 (iterators, generators) · **D7 revision**"
        ],
        [
          "12",
          "Decorators and context",
          "D1–4 M24 (closures, decorators) · D5–6 M25 (context managers) · **D7 revision**"
        ],
        [
          "13",
          "Types + project 2",
          "D1–3 M26 (type hints, mypy) · D4–6 **Project 2: CSV report generator** · **D7 revision + interview Q25–30**"
        ],
        [
          "14",
          "Concurrency",
          "D1–2 threads/processes · D3–5 asyncio · D6 M28 (complexity, profiling) · **D7 revision**"
        ],
        [
          "15",
          "Testing",
          "D1–4 M29 (pytest, fixtures, parametrize) · D5–6 write tests for Projects 1–2 · **D7 revision**"
        ],
        [
          "16",
          "Library tour + capstone",
          "D1–2 M30 (stdlib, 3.14) · D3–6 **Project 3: pick one from the nine** · **D7 full interview run-through**"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Modules 1–20 map onto *Python Crash Course* chapters 1–11; each module names its chapter in the meta line. Modules 11, 17, 21, 22, 24, 25, 26, 27, 28 and 30 cover material the book does not, and Part II of the book (chapters 12–20: Pygame, Matplotlib, APIs, Django) becomes the project work in weeks 8–16."
        }
      ],
      "title": "If you are following the book alongside this"
    }
  ]
};
