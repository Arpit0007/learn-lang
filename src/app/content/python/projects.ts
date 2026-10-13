import { Lesson } from '../../shared/content';

export const PROJECTS: Lesson = {
  "slug": "projects",
  "title": "Nine projects",
  "eyebrow": "Build",
  "blocks": [
    {
      "kind": "text",
      "text": "Exercises prove you understood a module. Projects prove you can hold several modules in your head at once, which is the actual skill. Each names the modules it exercises."
    },
    {
      "kind": "cards",
      "cards": [
        {
          "title": "1 · CLI task tracker",
          "tags": "M10 M13 M17 M18 M19 M20",
          "text": "Add, list, complete and delete tasks, persisted to JSON between runs. Then add due dates and filtering."
        },
        {
          "title": "2 · CSV report generator",
          "tags": "M10 M11 M18 M20 M26",
          "text": "Read a messy CSV, clean and validate every column, aggregate by category, write a summary CSV and a text report."
        },
        {
          "title": "3 · Log analyser",
          "tags": "M18 M23 M28",
          "text": "Stream a multi-gigabyte log with generators. Count errors by hour, find the slowest requests, never load the file."
        },
        {
          "title": "4 · Weather CLI",
          "tags": "M19 M20 M21 M24",
          "text": "Hit a public API, handle timeouts and bad responses, cache results to disk, format a readable forecast. Read a real API's docs."
        },
        {
          "title": "5 · Alien Invasion (Pygame)",
          "tags": "M15 M16 M17 · PCC 12–14",
          "text": "The book's Part II project, chapters 12–14. A real class hierarchy, a game loop, collision detection, scoring and state."
        },
        {
          "title": "6 · Data visualiser",
          "tags": "M20 M21 · PCC 15–16",
          "text": "Chapters 15–16: Matplotlib and Plotly over real weather and earthquake datasets. Random walks, then live GeoJSON."
        },
        {
          "title": "7 · Async link checker",
          "tags": "M23 M27 M28",
          "text": "Crawl a site map and check hundreds of URLs concurrently. Compare against a sequential version and measure the difference."
        },
        {
          "title": "8 · Learning Log (Django)",
          "tags": "M15 M21 M26 · PCC 18–20",
          "text": "Chapters 18–20: models, views, templates, user accounts, ownership rules, styling and deployment. Your first web app."
        },
        {
          "title": "9 · Publish a package",
          "tags": "M21 M26 M29",
          "text": "Take the best of the above, add tests and type hints, write a `pyproject.toml`, and publish to TestPyPI. Then install it in a fresh environment."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "Write the smallest thing that runs end to end, then grow it. A task tracker that only adds and lists is a finished project; a half-built one with six planned features is not. Commit to git after every working change — Appendix D of the book, and a habit that turns \"I broke it\" into `git diff`."
        }
      ],
      "title": "How to finish a project rather than abandon it"
    }
  ]
};
