import { Lesson } from '../../shared/content';

export const M19_EXCEPTIONS: Lesson = {
  "slug": "m19-exceptions",
  "title": "M19 Exceptions",
  "nav": "Exceptions",
  "num": "M19",
  "eyebrow": "Level 3 · Week 9 · ~3 sessions · PCC ch.10",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "When something goes wrong, Python raises an error and stops."
        },
        {
          "kind": "text",
          "text": "`try` / `except` lets you catch that error and keep going."
        },
        {
          "kind": "text",
          "text": "Catch only the error you actually know how to handle. Catching everything hides your own bugs and wastes hours."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "An exception is Python's way of saying \"I cannot continue down this path\". Handling one is `try/except`. The full shape has four clauses, and knowing what each is *for* is what separates working error handling from the `except: pass` that hides bugs."
    },
    {
      "kind": "text",
      "text": "Python's culture is **EAFP** — easier to ask forgiveness than permission. Try the operation and handle the failure, rather than checking every precondition first. The check-first style has a race condition anyway: a file can vanish between your `exists()` and your `open()`."
    },
    {
      "kind": "example",
      "code": "def parse_age(raw):\n    try:\n        age = int(raw)                     # the risky operation, alone\n    except ValueError:\n        return None                         # expected failure, handled\n    else:\n        return age                          # runs only if try succeeded\n\nprint(parse_age(\"42\"), parse_age(\"forty\"))\n\n\ndef divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError as err:\n        print(f\"  cannot divide by zero: {err}\")\n        raise                               # re-raise: log, don't swallow\n    finally:\n        print(\"  finally always runs\")      # cleanup, exception or not\n    return result\n\nprint(divide(10, 2))\ntry:\n    divide(1, 0)\nexcept ZeroDivisionError:\n    print(\"caught upstream\")\n\n# 3.14 (PEP 758): no parentheses needed - but only WITHOUT `as`\ntry:\n    raise TimeoutError(\"slow\")\nexcept TimeoutError, ConnectionError:\n    print(\"network problem\")\n\n# with `as`, parentheses are still required\ntry:\n    raise TimeoutError(\"slow\")\nexcept (TimeoutError, ConnectionError) as err:\n    print(type(err).__name__, err)\n\n\nclass ConfigError(Exception):\n    \"\"\"Your own exception type - subclass Exception, never BaseException.\"\"\"\n\ntry:\n    raise ConfigError(\"missing API key\")\nexcept ConfigError as err:\n    print(f\"{type(err).__name__}: {err}\")",
      "label": "exceptions.py",
      "output": "42 None\n  finally always runs\n5.0\n  cannot divide by zero: division by zero\n  finally always runs\ncaught upstream\nnetwork problem\nTimeoutError slow\nConfigError: missing API key"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`except:` or `except Exception:` with an empty body catches everything — including your own typos, which then vanish. A `NameError` from a misspelled variable gets silently swallowed and you debug for an hour. Worse, a bare `except:` also catches `KeyboardInterrupt` and `SystemExit`, so your program becomes un-killable with `Ctrl`-`C`. Rules: catch the *narrowest* exception you can actually handle; never write an empty `except` body; if you must catch broadly, log the exception and re-raise."
        }
      ],
      "title": "Trap · the bare `except`"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "`try` — the smallest possible risky operation. `except` — a failure you know how to handle. `else` — the follow-on work, kept out of `try` so its own errors are not caught by mistake. `finally` — cleanup that must happen either way."
        }
      ],
      "title": "The four clauses, in one line each"
    },
    {
      "kind": "quiz",
      "question": "Why put the success path in `else` rather than at the end of `try`?",
      "options": [
        "It runs faster",
        "It is required when using `finally`",
        "Only for readability",
        "So an exception raised by the success path isn't caught by the same `except`"
      ],
      "answer": 3,
      "why": "**To avoid catching the wrong thing.** If the follow-on work sits inside `try` and happens to raise the same exception type, your handler fires for a completely different cause and reports a misleading error. Keeping `try` down to the one risky line, with everything else in `else`, means your `except` only ever handles what you intended."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 19.1",
      "title": "A calculator that never crashes",
      "blocks": [
        {
          "kind": "text",
          "text": "Prompt for two numbers and divide them. Handle non-numeric input, division by zero, and `Ctrl`-`C` / `Ctrl`-`D`, each with a distinct message. Accept decimals and negatives — so `isdigit()` is not enough here, which is the point."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "def ask_number(prompt):\n    while True:\n        try:\n            return float(input(prompt))\n        except ValueError:\n            print(\"  not a number - try again\")\n        except (KeyboardInterrupt, EOFError):\n            print(\"\\n  cancelled\")\n            raise SystemExit(0)\n\nwhile True:\n    a = ask_number(\"first number:  \")\n    b = ask_number(\"second number: \")\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        print(\"  cannot divide by zero\\n\")\n    else:\n        print(f\"  {a} / {b} = {result}\\n\")",
              "label": "solution-19-1.py",
              "output": "first number:  10\nsecond number: four\n  not a number - try again\nsecond number: 0\n  cannot divide by zero\n\nfirst number:  7.5\nsecond number: -2.5\n  7.5 / -2.5 = -3.0"
            },
            {
              "kind": "text",
              "text": "Three things worth noting: `float()` accepts decimals and negatives where `isdigit()` would reject both; `KeyboardInterrupt` and `EOFError` are caught explicitly rather than by a bare `except`, so the program still exits cleanly; and the division sits alone in its `try` with the success path in `else`.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q19",
      "title": "EAFP vs LBYL, and when do you use each?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** LBYL — look before you leap — checks preconditions first: `if path.exists(): open(path)`. EAFP — easier to ask forgiveness than permission — attempts the operation and handles the exception. Python favours EAFP."
        },
        {
          "kind": "text",
          "text": "Two reasons. **Races**: between the check and the action the world can change, so the check guarantees nothing about a file, a network resource or a shared dict. **Duck typing**: checking every attribute an object might need is brittle, while trying the call and catching `AttributeError` works for anything that behaves correctly."
        },
        {
          "kind": "text",
          "text": "LBYL still wins in two cases: when the check is genuinely cheap and the failure would be expensive or irreversible, and when the failure is the *normal* path rather than the exception — validating user input in a loop, where exceptions on every keystroke would be both slower and noisier than `str.isdigit()`."
        }
      ]
    }
  ]
};
