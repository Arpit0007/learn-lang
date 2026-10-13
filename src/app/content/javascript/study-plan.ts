import { Lesson } from '../../shared/content';

export const STUDY_PLAN: Lesson = {
  "slug": "study-plan",
  "title": "The 14-week study plan",
  "nav": "14-week study plan",
  "eyebrow": "Schedule",
  "blocks": [
    {
      "kind": "text",
      "text": "Six study days a week, one rest day. Day 7 of each week is deliberately a *revision* day, not a new-material day — spaced repetition is why this plan is 14 weeks and not 6. A session is 60–120 minutes: roughly 40% reading, 60% typing code. Level 7 modules appear in the week where they're most useful, not in numerical order."
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
          "Setup + values",
          "D1 M1 & setup · D2–3 M2 (variables, types) · D4–5 M3 (operators, coercion) · D6 exercises for M2–3 · **D7 revision**"
        ],
        [
          "2",
          "Strings, numbers, flow",
          "D1–2 M4 · D3–5 M5 (control flow) · D6 Mini-project: FizzBuzz + number guessing game · **D7 revision + interview Q1–10**"
        ],
        [
          "3",
          "Functions + debugging",
          "D1–4 M6, split over declarations, arrows, parameters, return values · D5–6 **M19 debugging** — DevTools, breakpoints, the error decoder · **D7 revision**"
        ],
        [
          "4",
          "Arrays + recursion",
          "D1–2 M7 basics · D3 map/filter/reduce · D4 sort & chaining · D5–6 **M20 recursion** · **D7 revision**"
        ],
        [
          "5",
          "Objects + collections",
          "D1–3 M8 (destructuring, spread, JSON) · D4–5 **M24 Map, Set, WeakMap, Symbol** · D6 **Project 1: quiz engine** · **D7 revision + interview Q11–20**"
        ],
        [
          "6",
          "Text & time",
          "D1–3 **M22 regular expressions** · D4–5 **M23 dates, Intl formatting** · D6 add search and timestamps to Project 1 · **D7 revision**"
        ],
        [
          "7",
          "DOM",
          "D1–2 M9 selecting & changing · D3–4 creating & removing nodes · D5–6 **Project 2: to-do list UI** · **D7 revision**"
        ],
        [
          "8",
          "Events + storage",
          "D1–2 M10 · D3 delegation & forms · D4 **M26 storage, URL, observers** · D5–6 **Project 3: expense tracker** · **D7 revision**"
        ],
        [
          "9",
          "Scope & closures",
          "D1–2 M11 scope/hoisting · D3–5 closures (slowly — this is the hardest week) · D6 debounce, throttle and memoize from scratch · **D7 revision + interview Q21–30**"
        ],
        [
          "10",
          "`this`, prototypes, classes",
          "D1–2 M12 · D3–5 M13 · D6 rewrite Project 3 with classes; start **Project 4: Pomodoro** · **D7 revision**"
        ],
        [
          "11",
          "Async",
          "D1 callbacks · D2–3 promises · D4 async/await · D5–6 M14 event loop + ordering puzzles · **D7 revision**"
        ],
        [
          "12",
          "APIs, modules, generators",
          "D1–2 M15 fetch & error handling · D3 M16 modules · D4 **M25 iterators & generators** · D5–6 **Project 6: API dashboard** · **D7 revision + interview Q31–45**"
        ],
        [
          "13",
          "Craft, testing, Big-O",
          "D1 M17 functional patterns · D2 M18 memory & performance · D3–5 **M27 testing** — write real tests for Projects 1 and 3 · D6 **M21 Big-O & algorithm patterns** · **D7 revision**"
        ],
        [
          "14",
          "Node & interview",
          "D1–2 **M28 Node & npm** (build the CLI tool) · D3 back end for **Project 9** · D4 **M29 modern JS** + **M30 metaprogramming** · D5 full interview-bank pass and the five coding problems from a blank file · D6 finish Project 9 · **D7 mock interview, out loud**"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Falling behind by two days, feeling guilty, and skipping the revision day to catch up. Do the opposite: skip the *new* material and keep the revision. A half-remembered week 8 makes weeks 9–12 impossible; a delayed week 9 costs you nothing."
        }
      ],
      "title": "The most common way to fail this plan"
    }
  ]
};
