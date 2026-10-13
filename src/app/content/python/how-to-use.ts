import { Lesson } from '../../shared/content';

export const HOW_TO_USE: Lesson = {
  "slug": "how-to-use",
  "title": "How to use this course",
  "eyebrow": "A 16-week course · zero experience assumed",
  "blocks": [
    {
      "kind": "text",
      "text": "Thirty modules from `print(\"hi\")` to generators, decorators, asyncio, type checking and the questions interviewers actually ask. Built on *Python Crash Course* (3rd ed.) and carried well past where that book stops — on Python 3.14.",
      "style": "lede"
    },
    {
      "kind": "table",
      "head": [
        "Pace",
        "Length",
        "Modules",
        "Runtime",
        "Ends with"
      ],
      "rows": [
        [
          "1–2 hours a day",
          "16 weeks · 112 days",
          "30 across 7 levels",
          "Python 3.14",
          "9 portfolio projects"
        ]
      ]
    },
    {
      "kind": "text",
      "text": "This is a course, not a reference. Work down it in order. Each module has the same shape, so you always know where you are:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**The idea** — plain language, no jargon until the jargon is earned.",
        "**Code with hidden output** — read the block, *predict what it prints*, then press *Show output*. Predicting before revealing is the single highest-value habit in this course; peeking first feels efficient and teaches nothing.",
        "**Traps** — the specific mistakes people make here, and the fix.",
        "**Exercises** — attempt before opening the solution.",
        "**Interview** — the question a real interviewer asks about this topic, with a model answer."
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Type every example out in your own editor and run it for real. Reading code creates recognition; typing code creates recall. Interviews test recall. The *Copy* button is there for long blocks — use it for the setup, then type the interesting part yourself."
        }
      ],
      "title": "The one rule"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Your setup, in five minutes"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "Install **Python 3.14** from [python.org](https://python.org). On Windows, tick **Add Python to PATH**. On macOS, run *Install Certificates.command* afterwards.",
        "Install **VS Code** and its Microsoft **Python** extension (it pulls in Pylance and the debugger).",
        "Make a folder `python_work` — lowercase, underscores. Inside it, make a project folder per module.",
        "Create a virtual environment and activate it. Do this once per project, always.",
        "Check your version, then write your first file."
      ]
    },
    {
      "kind": "example",
      "code": "python3 --version          # macOS/Linux — on Windows: python --version\n# Python 3.14.0\n\nmkdir -p python_work/m1 && cd python_work/m1\npython3 -m venv .venv\nsource .venv/bin/activate  # Windows: .venv\\Scripts\\activate\n# your prompt now starts with (.venv)",
      "lang": "text",
      "label": "terminal"
    },
    {
      "kind": "text",
      "text": "If `python3` is missing but `python` works, you are on Windows — use `python` everywhere this course says `python3`. If neither works, PATH is wrong; reinstall with the PATH box ticked.",
      "style": "small"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Never run `pip install` outside an activated virtual environment, and never with `sudo`. It mixes your projects' dependencies into one shared pile, and on macOS and Linux it can break system tools that depend on the OS Python. The rule is one environment per project, created before the first install. Module 21 covers this properly, but adopt the habit now."
        }
      ],
      "title": "Trap · installing packages globally"
    }
  ]
};
