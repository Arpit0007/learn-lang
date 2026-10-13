import { Lesson } from '../../shared/content';

export const M24_DECORATORS: Lesson = {
  "slug": "m24-decorators",
  "title": "M24 Closures and decorators",
  "nav": "Closures & decorators",
  "num": "M24",
  "eyebrow": "Level 4 · Week 12 · ~4 sessions · not in PCC",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A decorator is a wrapper around a function."
        },
        {
          "kind": "text",
          "text": "It takes your function and gives back a new one that does something extra — timing it, retrying it, caching it — without you editing the original."
        },
        {
          "kind": "text",
          "text": "`@thing` written above a function simply means `f = thing(f)`."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 180\" role=\"img\" aria-label=\"A decorator wraps the original function, running extra code before and after the real call.\">\n      <defs><marker id=\"a-m24\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><polygon points=\"0,1 9,5 0,9\" fill=\"currentColor\"></polygon></marker></defs>\n      <rect x=\"40\" y=\"30\" width=\"420\" height=\"120\" rx=\"8\" class=\"dg-fill\"></rect>\n      <text x=\"56\" y=\"52\" class=\"dg-t\">wrapper  (what the name now points at)</text>\n      <rect x=\"64\" y=\"66\" width=\"130\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"129\" y=\"88\" class=\"dg-t\" text-anchor=\"middle\">start timer</text>\n      <rect x=\"206\" y=\"66\" width=\"128\" height=\"34\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"270\" y=\"88\" class=\"dg-t\" text-anchor=\"middle\">your function</text>\n      <rect x=\"346\" y=\"66\" width=\"130\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"411\" y=\"88\" class=\"dg-t\" text-anchor=\"middle\">print, return</text>\n      <line x1=\"198\" y1=\"83\" x2=\"202\" y2=\"83\" class=\"dg-l\" marker-end=\"url(#a-m24)\"></line>\n      <line x1=\"338\" y1=\"83\" x2=\"342\" y2=\"83\" class=\"dg-l\" marker-end=\"url(#a-m24)\"></line>\n      <text x=\"270\" y=\"130\" class=\"dg-s\" text-anchor=\"middle\">your function is untouched — it just gets called from inside</text>\n      <line x1=\"4\" y1=\"83\" x2=\"36\" y2=\"83\" class=\"dg-l\" marker-end=\"url(#a-m24)\"></line>\n      <text x=\"20\" y=\"72\" class=\"dg-s\" text-anchor=\"middle\">call</text>\n      <text x=\"270\" y=\"172\" class=\"dg-t\" text-anchor=\"middle\">@timed  means  slow_sum = timed(slow_sum)</text>\n    </svg>",
      "caption": "The decorator does not edit your function. It builds a new function around it and rebinds the name, so every later call goes through the wrapper and reaches your original code in the middle."
    },
    {
      "kind": "text",
      "text": "Functions are ordinary objects: you can pass them, return them and store them. A **closure** is a function that remembers variables from the scope where it was defined, even after that scope has finished. A **decorator** is a function that takes a function and returns a replacement — `@log` above a definition is exactly `f = log(f)`."
    },
    {
      "kind": "example",
      "code": "import functools, time\n\ndef multiplier(factor):\n    def multiply(n):\n        return n * factor        # `factor` is captured - this is the closure\n    return multiply\n\ndouble = multiplier(2)\nprint(double(21), double.__closure__[0].cell_contents)\n\n\ndef timed(func):\n    @functools.wraps(func)                    # keep __name__ and __doc__\n    def wrapper(*args, **kwargs):             # accept ANY signature\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        ms = (time.perf_counter() - start) * 1000\n        print(f\"  {func.__name__} took {ms:.1f}ms\")\n        return result                          # never forget to return\n    return wrapper\n\n@timed\ndef slow_sum(n):\n    \"\"\"Adds up to n.\"\"\"\n    return sum(range(n))\n\nprint(slow_sum(1_000_00))\nprint(slow_sum.__name__, slow_sum.__doc__)\n\n\n# a decorator that takes arguments needs one more layer\ndef repeat(times):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*a, **kw):\n            for _ in range(times):\n                last = func(*a, **kw)\n            return last\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef greet(name):\n    print(f\"  hi {name}\")\n    return name\n\ngreet(\"arpit\")\n\n# the most useful built-in decorator\n@functools.cache\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint(fib(90))",
      "label": "decorators.py",
      "output": "42 2\n  slow_sum took 2.1ms\n4999950000\nslow_sum Adds up to n.\n  hi arpit\n  hi arpit\n  hi arpit\n2880067194370816120"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Without `@functools.wraps(func)`, the decorated function reports the wrapper's name and loses its docstring, which breaks `help()`, debuggers, and any framework that introspects names — including pytest and Flask route registration. Second, a wrapper that calls `func(...)` without `return`ing the result silently turns every decorated function into one that returns `None`. Both are invisible until something downstream fails oddly."
        }
      ],
      "title": "Trap · forgetting `functools.wraps` — and forgetting to return"
    },
    {
      "kind": "callout",
      "tone": "win",
      "blocks": [
        {
          "kind": "text",
          "text": "`@functools.cache` — memoise a pure function; turns exponential recursion into linear, as `fib(90)` above demonstrates. `@functools.lru_cache(maxsize=128)` — the bounded version. `@property` — expose a method as an attribute. `@staticmethod` / `@classmethod` — methods that do not need the instance. `@dataclass` — Module 17. `@pytest.fixture` — Module 29. `@contextlib.contextmanager` — Module 25."
        }
      ],
      "title": "Decorators you will actually use"
    },
    {
      "kind": "quiz",
      "question": "What is `@decorator` above `def f():` equivalent to?",
      "options": [
        "`decorator(f())`",
        "`f = f(decorator)`",
        "It registers `f` without changing it",
        "`f = decorator(f)`"
      ],
      "answer": 3,
      "why": "**`f = decorator(f)`.** The decorator runs once, at definition time, and rebinds the name to whatever it returns. Two consequences: the returned object need not even be a function — a class or any callable works; and stacked decorators apply bottom-up, so the one nearest the `def` wraps first and the top one is outermost."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 24.1",
      "title": "Write a retry decorator",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `@retry(times=3, delay=0.1, exceptions=(ConnectionError,))` that re-runs a failing function, waits between attempts, re-raises if every attempt fails, and preserves the wrapped function's name and docstring."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import functools, time\n\ndef retry(times=3, delay=0.1, exceptions=(Exception,)):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            last = None\n            for attempt in range(1, times + 1):\n                try:\n                    return func(*args, **kwargs)\n                except exceptions as err:\n                    last = err\n                    print(f\"  attempt {attempt} failed: {err}\")\n                    if attempt < times:\n                        time.sleep(delay * 2 ** (attempt - 1))   # backoff\n            raise last            # all attempts spent - don't swallow it\n        return wrapper\n    return decorator\n\ncalls = {\"n\": 0}\n\n@retry(times=3, delay=0.05, exceptions=(ConnectionError,))\ndef flaky():\n    \"\"\"Fails twice, then succeeds.\"\"\"\n    calls[\"n\"] += 1\n    if calls[\"n\"] < 3:\n        raise ConnectionError(f\"network down (call {calls['n']})\")\n    return \"ok\"\n\nprint(flaky(), \"after\", calls[\"n\"], \"calls\")\nprint(flaky.__name__, \"-\", flaky.__doc__)",
              "label": "solution-24-1.py",
              "output": "  attempt 1 failed: network down (call 1)\n  attempt 2 failed: network down (call 2)\nok after 3 calls\nflaky - Fails twice, then succeeds."
            },
            {
              "kind": "text",
              "text": "Four details that separate this from a naive version: the backoff doubles rather than sleeping a constant; it only catches the exception types you named, so a `TypeError` in your own code still surfaces immediately; it re-raises the last failure instead of returning `None`; and `functools.wraps` keeps the identity intact.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q24",
      "title": "What is a closure, and how does it differ from a class?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A closure is a nested function that captures names from its enclosing scope, keeping them alive after the outer call has returned. Python stores them in `__closure__` as cells, so the inner function carries its own private state."
        },
        {
          "kind": "text",
          "text": "Functionally a closure and a single-method class are interchangeable — both bundle behaviour with state. The differences are practical: a closure is lighter and reads better for one behaviour and a couple of captured values; a class is better once there is more than one method, the state needs to be inspected or mutated by callers, or you want `__repr__` and equality."
        },
        {
          "kind": "text",
          "text": "The gotcha worth naming: closures capture *variables, not values*. A loop that builds `lambda: i` for each `i` produces functions that all see the final `i`. The fix is a default argument, `lambda i=i: i`, which binds at definition time. And rebinding a captured name inside the inner function requires `nonlocal`, or you just create a new local instead."
        }
      ]
    }
  ]
};
