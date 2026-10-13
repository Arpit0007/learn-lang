import { Lesson } from '../../shared/content';

export const ROADMAP: Lesson = {
  "slug": "roadmap",
  "title": "The roadmap, and why this order",
  "nav": "The roadmap",
  "eyebrow": "Map",
  "blocks": [
    {
      "kind": "text",
      "text": "Most people stall in Python by starting in the wrong place — classes before functions, or asyncio before they understand what a reference is. Each rung exists because the one above it made it possible."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 0 · Ground & setup (Module 1)"
    },
    {
      "kind": "text",
      "text": "What Python is, where it runs, how to get output on a screen, and how to read a traceback. You need a feedback loop before anything else — without one, every later lesson is guesswork."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 1 · Fundamentals (Modules 2–12)"
    },
    {
      "kind": "text",
      "text": "Names and values, strings, numbers, style, lists, loops, slicing, conditionals, dicts, sets, input and `while`. This is the grammar. Every advanced topic — generators, decorators, async — is these pieces rearranged, so shortcuts here cost you triple later."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 2 · Structure (Modules 13–17)"
    },
    {
      "kind": "text",
      "text": "Functions, modules, classes, inheritance and the modern record types. Functions come before classes because a class is mostly a namespace full of functions; learning them the other way round produces people who write Java in Python."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 3 · The real world (Modules 18–21)"
    },
    {
      "kind": "text",
      "text": "Files and paths, exceptions, JSON and CSV, environments and packaging. This is where programs stop being exercises and start touching data that outlives them."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 4 · How Python really works (Modules 22–26)"
    },
    {
      "kind": "text",
      "text": "References and mutability, iterators and generators, closures and decorators, context managers, type hints. The mechanics under the syntax. You now have enough code in your head for these to explain bugs you have actually hit. This level is roughly half of every Python interview."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 5 · Concurrency & speed (Modules 27–28)"
    },
    {
      "kind": "text",
      "text": "Threads, processes, asyncio, the GIL and free-threaded builds; then complexity, profiling, and choosing the right data structure. Async needs generators and closures to be solid first, which is why it is not in week three despite every tutorial putting it there."
    },
    {
      "kind": "heading",
      "level": 4,
      "text": "Level 6 · Craft (Modules 29–30)"
    },
    {
      "kind": "text",
      "text": "Testing with pytest, and a tour of the standard library plus what 3.14 changed. This is what separates \"can write Python\" from \"can be trusted with a codebase\"."
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Finish Level 1 without looking things up and you can automate real work. Finish Level 4 without looking things up and you can pass a Python interview. Level 5 makes you useful on a team; Level 6 is what makes your code survive other people."
        }
      ],
      "title": "Checkpoint"
    }
  ]
};
