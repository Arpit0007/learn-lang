import { Lesson } from '../../shared/content';

export const M29_TESTING: Lesson = {
  "slug": "m29-testing",
  "title": "M29 Testing with pytest",
  "nav": "Testing with pytest",
  "num": "M29",
  "eyebrow": "Level 6 · Week 15 · ~4 sessions · PCC ch.11 and beyond",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A test is a small piece of code that checks your real code gives the right answer."
        },
        {
          "kind": "text",
          "text": "pytest makes this easy: name the file `test_*.py`, write `assert`, and run `pytest`."
        },
        {
          "kind": "text",
          "text": "The point is not proving you are perfect. It is being able to change your code without being scared."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "A test is a function that runs your code and asserts something about the result. **pytest** needs no boilerplate: name files `test_*.py`, name functions `test_*`, use plain `assert`, and run `pytest`."
    },
    {
      "kind": "text",
      "text": "The point is not proving correctness. It is being able to change code without fear, and being told *where* it broke rather than that it broke."
    },
    {
      "kind": "example",
      "code": "class AnonymousSurvey:\n    def __init__(self, question):\n        self.question = question\n        self.responses = []\n\n    def store_response(self, response):\n        if not response.strip():\n            raise ValueError(\"response cannot be blank\")\n        self.responses.append(response)\n\n    def summary(self):\n        return f\"{self.question} ({len(self.responses)} responses)\"",
      "label": "survey.py"
    },
    {
      "kind": "example",
      "code": "import pytest\nfrom survey import AnonymousSurvey\n\n@pytest.fixture\ndef survey():\n    \"\"\"Fresh instance per test - fixtures prevent cross-test pollution.\"\"\"\n    return AnonymousSurvey(\"Which language did you learn first?\")\n\ndef test_store_single_response(survey):\n    survey.store_response(\"python\")\n    assert \"python\" in survey.responses\n\ndef test_store_three_responses(survey):\n    for lang in [\"python\", \"rust\", \"go\"]:\n        survey.store_response(lang)\n    assert survey.responses == [\"python\", \"rust\", \"go\"]\n\ndef test_blank_response_rejected(survey):\n    with pytest.raises(ValueError, match=\"cannot be blank\"):\n        survey.store_response(\"   \")\n\n@pytest.mark.parametrize(\n    \"n,expected\",\n    [(0, \"(0 responses)\"), (1, \"(1 responses)\"), (3, \"(3 responses)\")],\n)\ndef test_summary_counts(survey, n, expected):\n    \"\"\"One test function, three cases, three separate pass/fail results.\"\"\"\n    for i in range(n):\n        survey.store_response(f\"answer {i}\")\n    assert expected in survey.summary()",
      "label": "test_survey.py"
    },
    {
      "kind": "example",
      "code": "pip install pytest\npytest -q                       # quiet\npytest -k blank                 # only tests matching \"blank\"\npytest -x                       # stop at the first failure\npytest --cov=survey             # coverage, needs pytest-cov",
      "lang": "text",
      "label": "terminal",
      "output": "......                                                       [100%]\n6 passed in 0.03s"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Build the object at module level instead of in a fixture and every test mutates the same instance. Tests then pass in one order and fail in another, and one broken test cascades into five confusing failures. A fixture runs per test by default, which is exactly what you want. Two related traps: chasing 100% coverage produces tests that assert nothing meaningful, and testing private helpers instead of public behaviour means every refactor breaks your test suite even though nothing is actually wrong."
        }
      ],
      "title": "Trap · tests that share state"
    },
    {
      "kind": "quiz",
      "question": "What does `@pytest.mark.parametrize` give you over a loop inside one test?",
      "options": [
        "It runs the cases in parallel",
        "Nothing — it is stylistic",
        "It skips cases that fail",
        "Each case is a separate test, so all failures are reported individually"
      ],
      "answer": 3,
      "why": "**Separate tests per case.** A loop inside one test stops at the first failing assertion, so you learn about one broken case and nothing about the rest. Parametrize generates independent tests, each with its own name in the output, so you see exactly which inputs fail — and you can re-run one of them with `-k`."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 29.1",
      "title": "Write the test that finds the bug",
      "blocks": [
        {
          "kind": "text",
          "text": "This function looks right and passes a casual eyeball. Write parametrized tests covering empty, one, many, and boundary inputs — one of them fails. Find out which, then fix the function."
        },
        {
          "kind": "example",
          "code": "def average(values):\n    return sum(values) / len(values)\n\ndef top_n(values, n=3):\n    return sorted(values, reverse=True)[:n]",
          "label": "stats.py"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import pytest\nfrom stats import average, top_n\n\n@pytest.mark.parametrize(\"values,expected\", [\n    ([10], 10.0),\n    ([1, 2, 3], 2.0),\n    ([-1, 1], 0.0),\n])\ndef test_average(values, expected):\n    assert average(values) == expected\n\ndef test_average_of_empty_raises_clearly():\n    \"\"\"The bug: this raises ZeroDivisionError, not something a caller can act on.\"\"\"\n    with pytest.raises(ValueError, match=\"at least one value\"):\n        average([])\n\n@pytest.mark.parametrize(\"n,expected\", [\n    (3, [9, 7, 5]), (1, [9]), (0, []), (99, [9, 7, 5, 1]),\n])\ndef test_top_n(n, expected):\n    assert top_n([5, 9, 1, 7], n) == expected",
              "label": "test_stats.py"
            },
            {
              "kind": "example",
              "code": "def average(values):\n    if not values:\n        raise ValueError(\"average() needs at least one value\")\n    return sum(values) / len(values)",
              "label": "stats.py · fixed",
              "output": "$ pytest -q\n........                                                     [100%]\n8 passed in 0.04s"
            },
            {
              "kind": "text",
              "text": "The empty case is the bug, and it is the one nobody tests by hand. Note `top_n` needed no fix — slicing clamps, so `n=0` and `n=99` both behave — but you only *know* that because you wrote the cases. That is the difference between tests and hope.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q29",
      "title": "What do you test, and what do you not test?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** I test *behaviour at the public boundary*, and I weight it toward things that are easy to get wrong: edge cases (empty, one, many), boundaries (zero, negative, maximum), error paths, and any bug that has been found before — that one becomes a regression test so it cannot come back."
        },
        {
          "kind": "text",
          "text": "I do not test the language or the libraries, private helpers, or getters and setters with no logic. Those tests cost maintenance and catch nothing, and they make refactoring expensive by coupling the suite to the implementation rather than the contract."
        },
        {
          "kind": "text",
          "text": "On the pyramid: many fast unit tests, fewer integration tests where components meet, a handful of end-to-end tests on the paths that actually earn money. And coverage is a diagnostic, not a target — 80% with meaningful assertions beats 100% of lines executed by tests that assert nothing."
        }
      ]
    }
  ]
};
