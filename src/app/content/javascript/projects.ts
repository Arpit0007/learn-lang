import { Lesson } from '../../shared/content';

export const PROJECTS: Lesson = {
  "slug": "projects",
  "title": "Nine projects",
  "eyebrow": "Portfolio",
  "blocks": [
    {
      "kind": "text",
      "text": "Projects are what get you hired — not certificates. Three rules: build them without following a tutorial, put each in its own GitHub repository with a real README, and deploy them (GitHub Pages or Netlify, both free). A deployed link in a job application is worth more than a paragraph of adjectives."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Beginner · after Level 2–3"
    },
    {
      "kind": "cards",
      "cards": [
        {
          "title": "1. Quiz engine",
          "tags": "Week 5 · data only",
          "text": "Questions as objects, scoring, per-question breakdown. Console first, then a UI. Teaches arrays of objects and pure functions."
        },
        {
          "title": "2. To-do list",
          "tags": "Week 7 · DOM",
          "text": "Add, complete, delete, filter, persist with `localStorage`. The universal first DOM project — do it properly, with delegation."
        },
        {
          "title": "3. Expense tracker",
          "tags": "Week 8 · events + forms",
          "text": "Validated form, running totals, category breakdown, a simple bar chart drawn with div widths. Teaches state and rendering."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Intermediate · after Level 4–5"
    },
    {
      "kind": "cards",
      "cards": [
        {
          "title": "4. Pomodoro timer",
          "tags": "Week 10 · classes",
          "text": "Timer states as a class, `setInterval` with correct cleanup, audio cue, session history. Teaches state machines and leaks."
        },
        {
          "title": "5. Markdown note-taking app",
          "tags": "Week 12 · async",
          "text": "Live preview, autosave with debounce, dynamic `import()` of the parser, keyboard shortcuts. Teaches performance and modules."
        },
        {
          "title": "6. API dashboard",
          "tags": "Week 12 · fetch",
          "text": "Weather or GitHub profiles: search, loading and error states, caching, request cancellation, `Promise.all` for parallel calls."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Advanced · after Level 6"
    },
    {
      "kind": "cards",
      "cards": [
        {
          "title": "7. Kanban board",
          "tags": "Week 13 · architecture",
          "text": "Drag and drop, nested state, undo/redo via immutable history, persistence. The best single demonstration of state management skill."
        },
        {
          "title": "8. A tiny reactive library",
          "tags": "Week 14 · from scratch",
          "text": "Build your own `createStore` with subscribe/notify, plus a template renderer. Proves you understand what frameworks do."
        },
        {
          "title": "9. Real-time collaborative list",
          "tags": "Week 14 · full stack",
          "text": "Node + Express + WebSockets, optimistic updates, reconnection with backoff. The project that gets follow-up questions in interviews."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Build guide",
      "title": "Project 2 — To-do list, step by step",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "**Markup.** A form with one text input, an empty `<ul id=\"list\">`, and three filter buttons (All / Active / Done). Nothing else.",
            "**State first.** Before any DOM code, define `let todos = []` where each item is `{ id, text, done }`. Use `crypto.randomUUID()` for ids.",
            "**One render function.** `render()` reads `todos` and the current filter, clears the list with `replaceChildren()`, and rebuilds it. Never update the DOM anywhere else. This single discipline is the whole lesson.",
            "**Add.** On `submit`: `preventDefault()`, reject empty input, push a new item, clear the field, call `render()`.",
            "**Toggle and delete.** One delegated `click` listener on the `<ul>`. Use `event.target.closest(\"li\")` and the item's `dataset.id` to find which todo was hit.",
            "**Filter.** A `filter` variable plus a delegated listener on the button row. The filter changes what `render()` draws, never what `todos` contains.",
            "**Persist.** `save()` writes `JSON.stringify(todos)` to `localStorage`; call it at the end of every mutation. On load, `JSON.parse` inside a `try/catch` — stored data can be corrupt.",
            "**Polish.** An empty state (\"Nothing here yet\"), a count of remaining items, `aria-label`s on icon buttons, and focus returned to the input after adding."
          ]
        },
        {
          "kind": "text",
          "text": "**Common mistakes:** mutating the DOM directly in the click handler instead of re-rendering from state; storing the id in the element's text; re-querying the DOM inside loops; forgetting that `localStorage` only stores strings.",
          "style": "small"
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Build guide",
      "title": "Project 6 — API dashboard, step by step",
      "blocks": [
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "**Pick a no-key API.** `api.github.com/users/<name>` or Open-Meteo. Read the docs and call it once in the console before writing any code.",
            "**Isolate the network layer.** One module, `api.js`, exporting `getUser(name)`. It checks `response.ok`, throws a custom `HttpError`, and returns only the fields your UI needs. Nothing else in the app should know that `fetch` exists.",
            "**Model the four states.** `idle | loading | error | success`. Render each explicitly. Skipping the error state is the most common portfolio-project failing.",
            "**Debounce the search box** at 300 ms — your own implementation from Module 11.",
            "**Cancel stale requests.** Keep an `AbortController` per search; abort the previous one when a new search starts, so a slow earlier response can't overwrite a newer one.",
            "**Parallelise.** Fetch the profile and the repo list with `Promise.all`; use `allSettled` if a partial result is still worth showing.",
            "**Cache.** A `Map` from username to the in-flight *promise* (Exercise 15.1), with a size limit.",
            "**Deploy** and put the live link at the top of the README, with a screenshot."
          ]
        },
        {
          "kind": "text",
          "text": "**Interview value:** this project lets you talk about race conditions, cancellation, caching and error taxonomy — four senior-sounding topics from one small app.",
          "style": "small"
        }
      ]
    }
  ]
};
