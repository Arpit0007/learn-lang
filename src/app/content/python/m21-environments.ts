import { Lesson } from '../../shared/content';

export const M21_ENVIRONMENTS: Lesson = {
  "slug": "m21-environments",
  "title": "M21 Environments, pip, uv, and packaging",
  "nav": "Environments & packaging",
  "num": "M21",
  "eyebrow": "Level 3 · Week 10 · ~3 sessions · not in PCC until ch.18",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A virtual environment is a private box of packages belonging to one project."
        },
        {
          "kind": "text",
          "text": "Make one for every project, before you install anything. Never install packages for the whole computer, and never use `sudo pip`."
        },
        {
          "kind": "text",
          "text": "`uv` is the new fast tool that does all of this in one command."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "A **virtual environment** is a private folder holding its own interpreter and its own installed packages. One per project, always. Without it, every project shares one pile of dependencies and two projects needing different versions of the same library cannot coexist."
    },
    {
      "kind": "text",
      "text": "The book only introduces this in chapter 18, for Django. That is far too late — adopt it now."
    },
    {
      "kind": "example",
      "code": "cd my_project\npython3 -m venv .venv                  # create\nsource .venv/bin/activate              # activate (Windows: .venv\\Scripts\\activate)\npip install requests pytest\npip freeze > requirements.txt          # record exact versions\ndeactivate                             # leave\n\n# on a new machine\npython3 -m venv .venv && source .venv/bin/activate\npip install -r requirements.txt",
      "lang": "text",
      "label": "terminal · the standard library way"
    },
    {
      "kind": "example",
      "code": "uv init my_project && cd my_project    # pyproject.toml + .venv, ready\nuv python install 3.14                 # uv manages interpreters too\nuv add requests                        # installs AND records in pyproject.toml\nuv add --dev pytest\nuv run pytest                          # runs in the env - no activation needed\nuv sync                                # reproduce exactly from uv.lock",
      "lang": "text",
      "label": "terminal · the 2026 way",
      "output": "Using CPython 3.14.0\nCreating virtual environment at: .venv\nResolved 5 packages in 11ms\nInstalled 5 packages in 8ms\n + requests==2.32.3"
    },
    {
      "kind": "text",
      "text": "`uv` is one Rust binary that replaces `pip`, `pip-tools`, `virtualenv`, `pyenv`, `pipx` and `poetry`, at 10–100× the speed. Learn the `venv`/`pip` column first, because every tutorial, error message and CI config assumes it — then switch and stop thinking about it."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What the files mean"
    },
    {
      "kind": "table",
      "head": [
        "File",
        "Holds",
        "Commit it?"
      ],
      "rows": [
        [
          "`pyproject.toml`",
          "Project metadata and declared dependency *ranges*. The modern standard.",
          "Yes"
        ],
        [
          "`uv.lock` / `requirements.txt`",
          "Exact resolved versions, for reproducible installs.",
          "Yes"
        ],
        [
          "`.venv/`",
          "The environment itself — thousands of files, machine-specific.",
          "Never. Add to `.gitignore`."
        ],
        [
          "`__pycache__/`",
          "Compiled bytecode caches.",
          "Never."
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "It writes into the interpreter your operating system depends on. On macOS and Linux, package managers and system tools are written in Python, and replacing a library version underneath them can break parts of the OS in ways that are tedious to undo. It also silently defeats the whole point of environments. If `pip install` ever raises a permissions error, that is the signal you forgot to activate an environment — not an invitation to add `sudo`."
        }
      ],
      "title": "Trap · `sudo pip install`"
    },
    {
      "kind": "quiz",
      "question": "What does activating a virtual environment actually change?",
      "options": [
        "It installs a second copy of Python system-wide",
        "It puts the env's `bin` first on `PATH`, so `python` and `pip` resolve to it",
        "It sets `PYTHONPATH` to the project folder",
        "Nothing — it is cosmetic"
      ],
      "answer": 1,
      "why": "**It prepends to `PATH`.** Activation is mostly a shell trick: it puts the environment's `bin` (or `Scripts`) directory at the front of `PATH` and sets `VIRTUAL_ENV`, so the bare names `python` and `pip` now find the environment's copies. That is why you can skip activation entirely by calling `.venv/bin/python` directly — or by letting `uv run` do it for you."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 21.1",
      "title": "A project someone else can reproduce",
      "blocks": [
        {
          "kind": "text",
          "text": "Set up a project from nothing: an environment, one real dependency, a pinned lock, a `.gitignore`, and a script that runs. Then delete the environment and rebuild it from the lock to prove it reproduces."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "mkdir ladder_demo && cd ladder_demo\npython3 -m venv .venv\nsource .venv/bin/activate\n\npip install requests\npip freeze > requirements.txt\nprintf '.venv/\\n__pycache__/\\n*.pyc\\n' > .gitignore\n\ncat > check.py <<'EOF'\nimport requests\nr = requests.get(\"https://httpbin.org/status/200\", timeout=10)\nprint(\"status\", r.status_code)\nEOF\n\npython check.py\n\n# now prove it reproduces\ndeactivate && rm -rf .venv\npython3 -m venv .venv && source .venv/bin/activate\npip install -r requirements.txt\npython check.py",
              "lang": "text",
              "label": "terminal",
              "output": "status 200\nstatus 200"
            },
            {
              "kind": "text",
              "text": "The second identical output is the whole exercise: the environment is disposable, the lock is the source of truth. Note what got committed — `requirements.txt`, `.gitignore`, `check.py` — and what did not: `.venv/`, which is machine-specific and thousands of files. The `uv` equivalent is `uv init`, `uv add requests`, `rm -rf .venv`, `uv sync`.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q21",
      "title": "Why isn't `requirements.txt` enough for reproducible builds?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Because a hand-written `requirements.txt` usually pins your *direct* dependencies loosely and says nothing about transitive ones. `requests>=2.0` resolves differently next month, and even a pinned `requests==2.31.0` leaves its own dependencies free to move — so two installs from the same file can produce different trees."
        },
        {
          "kind": "text",
          "text": "A proper lock file records the full resolved graph with exact versions and hashes, so an install is byte-identical and tamper-evident. `pip freeze` approximates this by dumping whatever is currently installed, but it captures a snapshot of your machine rather than a resolution, includes things you never asked for, and cannot distinguish direct from transitive dependencies. The modern answer is declared ranges in `pyproject.toml` plus a real lock file — `uv.lock`, or `pip-compile` with hashes — and committing both."
        }
      ]
    }
  ]
};
