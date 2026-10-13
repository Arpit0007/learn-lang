import { Lesson } from '../../shared/content';

export const INTERVIEW: Lesson = {
  "slug": "interview",
  "title": "The interview bank",
  "nav": "Interview bank",
  "eyebrow": "Bank",
  "blocks": [
    {
      "kind": "text",
      "text": "Every module's interview question, in one list, so you can drill them without scrolling. Answer out loud before opening the module — recall under mild pressure is the thing being trained."
    },
    {
      "kind": "table",
      "head": [
        "#",
        "Question",
        "Module"
      ],
      "rows": [
        [
          "1",
          "Is Python compiled or interpreted?",
          "M1"
        ],
        [
          "2",
          "Does Python pass by value or by reference?",
          "M2"
        ],
        [
          "3",
          "Why are strings immutable?",
          "M3"
        ],
        [
          "4",
          "Why is `0.1 + 0.2 != 0.3`?",
          "M4"
        ],
        [
          "5",
          "What is PEP 8 and do you follow it strictly?",
          "M5"
        ],
        [
          "6",
          "List vs tuple?",
          "M6"
        ],
        [
          "7",
          "When should you not use a comprehension?",
          "M7"
        ],
        [
          "8",
          "Explain `a[::-1]`. Best way to reverse?",
          "M8"
        ],
        [
          "9",
          "`is` vs `==`?",
          "M9"
        ],
        [
          "10",
          "How does a dict work internally?",
          "M10"
        ],
        [
          "11",
          "Set vs list vs dict?",
          "M11"
        ],
        [
          "12",
          "When `while` over `for`?",
          "M12"
        ],
        [
          "13",
          "Explain `*args` and `**kwargs`.",
          "M13"
        ],
        [
          "14",
          "Why avoid `from module import *`?",
          "M14"
        ],
        [
          "15",
          "Class vs instance attribute?",
          "M15"
        ],
        [
          "16",
          "Inheritance or composition?",
          "M16"
        ],
        [
          "17",
          "Dataclass vs plain class vs dict?",
          "M17"
        ],
        [
          "18",
          "What does `with open(...)` do?",
          "M18"
        ],
        [
          "19",
          "EAFP vs LBYL?",
          "M19"
        ],
        [
          "20",
          "Would you use `pickle`?",
          "M20"
        ],
        [
          "21",
          "Why isn't `requirements.txt` reproducible?",
          "M21"
        ],
        [
          "22",
          "Why can't a list be a dict key?",
          "M22"
        ],
        [
          "23",
          "Iterable vs iterator vs generator?",
          "M23"
        ],
        [
          "24",
          "What is a closure vs a class?",
          "M24"
        ],
        [
          "25",
          "Write a timing context manager. Why not a decorator?",
          "M25"
        ],
        [
          "26",
          "If Python ignores type hints, why bother?",
          "M26"
        ],
        [
          "27",
          "What is the GIL? Is it going away?",
          "M27"
        ],
        [
          "28",
          "How do you find why a script is slow?",
          "M28"
        ],
        [
          "29",
          "What do you test, and what don't you?",
          "M29"
        ],
        [
          "30",
          "Three stdlib modules you reach for, and why?",
          "M30"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "Q2 (references and mutability), Q9 (`is` vs `==`), Q10 (dict internals), Q23 (generators) and Q27 (the GIL). If you can answer those five cold, with an example each, you will handle most Python screens. Note that four of the five are Level 4 material — which is why that level exists rather than stopping at classes."
        }
      ],
      "title": "The five they ask most"
    }
  ]
};
