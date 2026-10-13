import { Lesson } from '../../shared/content';

export const M12_INPUT_WHILE: Lesson = {
  "slug": "m12-input-while",
  "title": "M12 input() and while loops",
  "nav": "input() & while",
  "num": "M12",
  "eyebrow": "Level 1 · Week 5 · ~3 sessions · PCC ch.7",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "`input()` pauses your program and waits for the person to type something."
        },
        {
          "kind": "text",
          "text": "Whatever they type always comes back as **text**, even if it looks like a number. You must convert it yourself."
        },
        {
          "kind": "text",
          "text": "A `while` loop keeps repeating until something tells it to stop."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "`input()` pauses the program, waits for a line, and returns it as a **string — always**. If you want a number you must convert, and conversion can fail, which is the first place exceptions become unavoidable."
    },
    {
      "kind": "text",
      "text": "A `for` loop runs a known number of times; a `while` loop runs until a condition goes false. Use `while` when the count is not known in advance — which is exactly the case for \"keep asking until the input is valid\"."
    },
    {
      "kind": "example",
      "code": "raw = input(\"How old are you? \")     # returns a STRING\nage = int(raw)                        # ValueError if raw isn't numeric\nprint(age >= 18)\n\n# the validation loop: repeat until the input is usable\nwhile True:\n    answer = input(\"Pick a number 1-10: \").strip()\n    if not answer.isdigit():\n        print(\"  digits only, please\")\n        continue                      # skip the rest, ask again\n    n = int(answer)\n    if 1 <= n <= 10:\n        break                         # leave the loop entirely\n    print(\"  out of range\")\nprint(f\"You picked {n}\")\n\n# a flag reads better than a compound condition once there are several exits\nactive = True\nwhile active:\n    line = input(\"> \").strip().lower()\n    if line in {\"quit\", \"q\", \"exit\"}:\n        active = False\n    else:\n        print(line[::-1])",
      "label": "input_loops.py",
      "output": "How old are you? 19\nTrue\nPick a number 1-10: eleven\n  digits only, please\nPick a number 1-10: 44\n  out of range\nPick a number 1-10: 7\nYou picked 7\n> python\nnohtyp\n> quit"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "A `while` whose condition never becomes false hangs forever — usually because the variable in the condition is never updated inside the body, or because a `continue` jumps back before the line that would have updated it. Press `Ctrl`-`C` to break out; the traceback shows `KeyboardInterrupt` and the exact line it was stuck on. Before writing a `while`, say out loud which statement in the body will eventually make the condition false. If you cannot name it, you have a bug."
        }
      ],
      "title": "Trap · the infinite loop"
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "`continue` skips to the next iteration; `break` exits the loop; `return` exits the whole function, loop and all. Python also has a rarely used `else` on loops, which runs only if the loop finished *without* hitting `break` — genuinely useful for search loops, and a favourite trivia question."
        }
      ],
      "title": "break vs continue vs return"
    },
    {
      "kind": "quiz",
      "question": "What does `int(input())` raise if the user types `hello`?",
      "options": [
        "TypeError",
        "ValueError",
        "SyntaxError",
        "Nothing — it returns 0"
      ],
      "answer": 1,
      "why": "**`ValueError`.** The *type* is right — `int()` accepts a string — but the *value* cannot be interpreted as a number. That distinction is the whole point of the two exception names: `TypeError` means \"wrong kind of thing\", `ValueError` means \"right kind, unusable content\". `int([])`, by contrast, is a `TypeError`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 12.1",
      "title": "Number-guessing game",
      "blocks": [
        {
          "kind": "text",
          "text": "Pick a secret number 1–100. Loop until the player guesses it, saying higher or lower, counting attempts, rejecting non-numeric input without crashing, and allowing `q` to give up."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import random\n\nsecret = random.randint(1, 100)\ntries = 0\n\nwhile True:\n    guess = input(\"Guess (1-100, q to quit): \").strip().lower()\n\n    if guess in {\"q\", \"quit\"}:\n        print(f\"It was {secret}.\")\n        break\n\n    if not guess.isdigit():\n        print(\"  numbers only\")\n        continue\n\n    tries += 1\n    n = int(guess)\n\n    if n < secret:\n        print(\"  higher\")\n    elif n > secret:\n        print(\"  lower\")\n    else:\n        print(f\"Got it in {tries} tries.\")\n        break",
              "label": "solution-12-1.py"
            },
            {
              "kind": "text",
              "text": "`isdigit()` guards the conversion so `int()` can never fail here — validate-then-convert. Note it rejects negatives and decimals, which is correct for this game but would be wrong elsewhere; Module 19 shows the `try/except` approach that handles any numeric input.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q12",
      "title": "When do you use `while` over `for`?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `for` when you are iterating a known collection or a known number of times — which in Python is most of the time, because `for` iterates items directly. `while` when the number of iterations depends on something discovered during the loop: reading until a sentinel, retrying until success, polling until a condition holds, or driving an interactive prompt."
        },
        {
          "kind": "text",
          "text": "The idiom worth naming is `while True` with an explicit `break`. It sounds like a code smell but is the clearest way to express \"loop until something inside tells us to stop\", and it is preferable to a flag variable plus a duplicated first read — the pattern that produces the classic \"processes the first item twice\" bug."
        }
      ]
    }
  ]
};
