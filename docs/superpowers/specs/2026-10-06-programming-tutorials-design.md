# LinguaLeap → W3Schools-style programming tutorials — design

**Date:** 2026-10-06
**Status:** Draft, awaiting review
**Replaces:** `2026-10-06-english-learning-site-design.md` (the English-course direction was dropped)

## 1. Goal

Turn LinguaLeap into a simple, free, W3Schools-style site for learning
programming. There is no sign-up or login. Learners pick a language from the
top menu, read lessons, run and edit examples, and check themselves with small
exercises.

**Success:** a learner can open the site and choose one of:

- **HTML, CSS or Python:** 10 beginner lessons each, with full-screen
  **Try it Yourself** editors and auto-checked exercises.
- **JavaScript:** the full **JavaScript Ladder** course, with 30 modules in 7
  levels, a study plan, glossary, projects and interview bank. Its examples
  run inline under the code.

Every example runs in the browser, and Previous/Next moves through each
course.

### Decisions

| Decision | Choice |
|---|---|
| Login / accounts | None |
| Backend | None. A static site; content lives in files in the web app |
| Site language | English only |
| Courses (v1) | HTML, CSS, Python with 10 beginner lessons each; JavaScript = the JavaScript Ladder (36 pages) |
| JavaScript content source | The author's "The JavaScript Ladder" artifact (https://claude.ai/artifact/8ewxp5mDt7zMYWk2BNyyLh), imported in English with its Hindi text dropped |
| Look | The JavaScript Ladder's visual style, site-wide, applied to Angular Material (Material is kept) |
| Running code | Browser only. HTML/CSS in a sandboxed iframe on a full-screen Try-it page; JavaScript inline in a sandboxed iframe; Python via Pyodide in a Web Worker on a Try-it page |
| Code editor | CodeMirror 6 |
| Practice | HTML/CSS/Python: 2–3 auto-checked exercises per lesson. JavaScript: the Ladder's quizzes (checked) plus reveal-the-solution exercises, challenges and interview Q&A |
| Progress | ✓ per finished page, saved in the browser only |
| Offline / PWA | None |

### Out of scope (v1)

- Accounts and cloud sync.
- Hindi or any other site language.
- Languages that need a server to run (Java, C, C++, C#, SQL…).
- Python `input()`.
- Protection against infinite loops in learner-edited JavaScript. Shipped
  examples contain none.
- Real persistent `localStorage` inside JavaScript examples (an in-memory
  stand-in is provided).
- Certificates, site search, and server-side rendering/SEO prerendering.
- Offline support.

## 2. Starting point

The clean-up is already done (2026-10-06). A backup of the previous state is
at `../lingualeap-backup-2026-10-06.zip`.

- **Removed:**
  - the NestJS API, Postgres, migrations and seeds
  - login and auth, NgRx, dashboard, courses, leaderboard, AI tutor, profile
    and admin
  - the PWA/service worker and environment files
  - `libs/shared-ui`, the unused shared models and utilities, and 32 npm
    packages
  - `docs/API.md` and `docs/DATABASE.md`
- **What remains:**
  - `apps/web`: Angular 18 + Material, a toolbar with the theme toggle, a
    placeholder home page, and `ThemeService`, plus the old
    `exercise.component.ts` and `SpeechService`
  - `libs/shared-models`: the old `IExercise` and `ExerciseType`
  - `libs/shared-utils`: `checkAnswer` with 2 tests
- **Status:** the build passes. `web:test` fails because the app has no tests
  yet, and `lint` fails because the root ESLint config ignores every file.

**Removed as part of this design** (they belonged to the language-learning
exercises): `features/lesson/exercise.component.ts`,
`core/services/speech.service.ts`, `libs/shared-models/src/lib/exercise.ts`
and the old `ExerciseType`-based `checkAnswer`.

## 3. Look and feel

The whole site uses the visual language of the JavaScript Ladder.

- **Tokens:** `apps/web/src/styles/tokens.scss` defines the Ladder's CSS
  custom properties, with the same names and values:
  - backgrounds and inks: `--bg`, `--surface`, `--surface-2`, `--ink`,
    `--ink-soft`, `--ink-faint`, `--line`, `--line-soft`
  - code: `--code-bg`, `--code-ink`
  - accents: `--gold`, `--gold-ink`, `--gold-wash`, `--warn`, `--warn-wash`,
    `--ok`, `--ok-wash`
  - `--shadow`, and the font stacks `--display`, `--body`, `--mono`
  - a light set and a dark set
- **Fonts:** Bricolage Grotesque (headings, UI), Newsreader (body text) and
  IBM Plex Mono (code, labels), loaded from Google Fonts in `index.html`.
  Roboto is removed and Material Icons is kept.
- **Theme switching:**
  - by default the site follows the system light/dark setting
  - the toolbar toggle sets `data-theme="light"` or `data-theme="dark"` on
    `<html>`, remembered under the `localStorage` key `ll_theme`
  - dark tokens apply under
    `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
    and under `:root[data-theme="dark"]`
  - `ThemeService` is changed from toggling a `dark-theme` body class to this
    model and exposes an `isDark` signal; it is the only code that touches the
    attribute
- **Angular Material is kept and restyled:**
  - a Material 3 theme whose primary palette is generated from the Ladder gold
    `#F2C31B` with Angular Material's `theme-color` schematic
  - typography uses `brand-family: Bricolage Grotesque` and
    `plain-family: Newsreader`
  - component surfaces, outlines and text map to the Ladder tokens
  - light and dark Material colours switch under the same selectors as the
    tokens
- **Lesson typography and blocks** reuse the Ladder's styles, moved into
  `styles/content.scss`:
  - headings
  - `.lede`, `.eyebrow`, `.meta`
  - inline `code`
  - code blocks with a header bar, label and Run/Edit/Reset buttons
  - output panes (`.line.warn` / `.line.err` / `.line.muted`)
  - callouts (`key` / `trap` / `win` / `plain`)
  - `details` reveal boxes with tags
  - quizzes (`.right` / `.wrong`)
  - tables, project cards
  - figures, including their `mv-*` keyframes and `prefers-reduced-motion`
    handling
- **Code highlighting:** CodeMirror uses a custom highlight style built from
  the Ladder's colours: keywords `#E8A0C8`, strings `#9EDA8F`, numbers
  `#F0C177`, comments `#67757F` in italics, functions `#7FC7F0` and tags
  `#E8A0C8`. It sits on `--code-bg` in both themes.

## 4. Pages, navigation, layout

### Routes

| URL | Page |
|---|---|
| `/` | Home: a short intro plus one card per course |
| `/:course` | The course's first page (HTML/CSS/Python: "Home"; JavaScript: "How to use this course") |
| `/:course/:lesson` | Lesson page |
| `/:course/:lesson/try/:n` | Full-screen Try-it editor for the lesson's *n*-th example with `run: 'tryit'` (counting from 1). Not used by the JavaScript course |
| anything else, including an unknown course, lesson or *n* | "Page not found" with a link home |

- **Router settings:** the router uses `scrollPositionRestoration: 'enabled'`.
- **Lazy loading:** each course's content is its own lazy chunk.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ 🦜 LinguaLeap   HTML  CSS  JAVASCRIPT  PYTHON                ☾   │
├──────────────────────┬──────────────────────────────────────────┤
│ START HERE           │ M6 · Functions                            │
│  How to use…       ✓ │ [‹ Previous]                    [Next ›]  │
│ LEVEL 1 · FUNDAMENT… │ text · runnable examples · traps ·        │
│ ▸M6 Functions        │ quiz · exercises · interview Q            │
│ REFERENCE            │ [‹ Previous]                    [Next ›]  │
└──────────────────────┴──────────────────────────────────────────┘
```

- **Top bar:**
  - the logo links home
  - a language menu with one link per registered course, the current course
    highlighted
  - the theme toggle
- **Sidebar:**
  - group headings in the Ladder's rail style (uppercase mono labels)
  - lesson links listed under each group
  - the current page has a gold left border, and finished pages show a ✓
  - HTML, CSS and Python have a single group
- **Below 1000px** (the Ladder's breakpoint):
  - the sidebar becomes a Material side-nav drawer opened by **☰ Menu**, which
    closes when a page is picked
  - the language menu scrolls sideways
- **Previous/Next:**
  - shown at the top and bottom of each page, following the course order
    across groups
  - Previous is hidden on the first page and Next on the last
- **Tab titles:**
  - lessons: `<Lesson title> – LinguaLeap`
  - the Try-it page: `Try it: <Lesson title> – LinguaLeap`

### Try-it page (HTML, CSS, Python)

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Back to "HTML Links"            [▶ Run] [↺ Reset] [■ Stop*]    │
├────────────────────────────────┬─────────────────────────────────┤
│ code (CodeMirror, editable)    │ result: page preview / Python   │
│                                │ text output                     │
└────────────────────────────────┴─────────────────────────────────┘
* Stop appears only for Python.  Below 1000px the panes stack.
```

- **On open:** the example runs once automatically.
- **Reset:** restores the original code and runs it.
- **Edits:** they live only for that page visit and are not saved.

## 5. Content model

The content types live in `libs/shared-models/src/lib/content.ts`, which
replaces `exercise.ts`.

```ts
export type CodeLang = 'html' | 'css' | 'javascript' | 'python';
export type RunMode = 'tryit' | 'inline' | 'none';

export interface Course {
  slug: string;            // 'javascript' — URL segment
  menuLabel: string;       // 'JavaScript'
  title: string;           // 'The JavaScript Ladder' / 'HTML Tutorial'
  description: string;     // home-page card text
  tryItRunner?: 'web' | 'python';  // runner for run: 'tryit' examples
  exampleLang: CodeLang;   // default highlighting for examples
  exampleRun: RunMode;     // default run mode: HTML/CSS/Python 'tryit', JavaScript 'inline'
  groups: { title: string; lessons: Lesson[] }[];  // sidebar order = course order
}

export interface Lesson {
  slug: string;            // unique within the course
  title: string;           // sidebar + page heading
  eyebrow?: string;        // small label above the heading, e.g. 'Level 1 · ~2 sessions'
  blocks: Block[];
}

export type Block =
  | { kind: 'heading'; level: 2 | 3 | 4; text: string }
  | { kind: 'text'; text: string; style?: 'lede' | 'small' }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'callout'; tone: 'key' | 'trap' | 'win' | 'plain'; title?: string; blocks: Block[] }
  | { kind: 'example'; code: string; lang?: CodeLang; label?: string; run?: RunMode; demoHtml?: string }
  | { kind: 'exercise'; exercise: Exercise }     // auto-checked
  | { kind: 'quiz'; question: string; options: string[]; answer: number; why: string }  // checked
  | { kind: 'reveal'; tag: string; title: string; blocks: Block[] }   // Exercise 6.1 / Solution / Interview Q12…
  | { kind: 'figure'; svg: string; caption: string; animated?: boolean }
  | { kind: 'cards'; cards: { title: string; tags: string; text: string }[] };

export type Exercise =
  | { type: 'fill_code'; prompt: string; code: string; answers: (string | string[])[] }
    // `code` has one `[___]` per gap; answers[i] = accepted value(s) for gap i, first = canonical
  | { type: 'multiple_choice'; prompt: string; options: string[]; answer: string };
```

### Text format

All strings shown as text, including table cells, list items, quiz text and
card text, support:

- `**bold**`, `*italic*` and `` `inline code` ``
- `[link text](https://…)`, which opens in a new tab with
  `rel="noopener"`

`RichTextComponent` splits text into segments and renders them as `<strong>`,
`<em>`, `<code>` and `<a>`. It never uses `innerHTML`.

### Figures

- `figure.svg` is first-party SVG markup (the Ladder's diagrams). It is
  rendered with `DomSanitizer.bypassSecurityTrustHtml`, the only bypass in the
  app.
- `content.spec.ts` asserts that no figure contains `<script`, `on…=` event
  attributes or `javascript:` URLs.
- Animated figures start paused and show a **▶ Play / ❚❚ Pause** button that
  toggles `data-motion`, as in the Ladder.

### Authoring rules (HTML, CSS, Python lessons)

- **Web examples** are complete HTML documents. A CSS example is a page with a
  `<style>` block. Snippets that can't run alone set `run: 'none'`.
- **Python examples** print their results with `print()` and never call
  `input()`.
- **Forms:** examples never submit to an external URL.
- **Images:** examples use small bundled images from `assets/img/`.
- **Infinite loops:** no example contains one.

### Files

- **One folder per course:** `apps/web/src/app/content/<course>/` holds one
  file per lesson and an `index.ts` that exports the `Course`.
- **Course registry:** `apps/web/src/app/content/courses.ts` holds an ordered
  list of `{ slug, menuLabel, description, load }`. The menu and home page
  read only this list.
- **Adding a language** means adding a folder and one registry entry. A
  language that needs a new runner is a code change.

## 6. Running code

### Inline JavaScript runner (JavaScript course)

- **The code block** looks like the Ladder's: a header bar with the label
  (e.g. `first.js`) and **Run**, **Edit** and **Reset** buttons.
  - **Edit** switches the read-only CodeMirror view to editable.
  - **Reset** restores the original code and clears the output.
  - Blocks with `run: 'none'` show the label only.
- **Each Run:**
  - creates a fresh `<iframe sandbox="allow-scripts allow-modals">` with no
    `allow-same-origin`
  - its `srcdoc` comes from the pure function
    `buildJsSrcdoc(code, runId, demoHtml?)`
- **The generated document contains:**
  - **a bridge script**
    - wraps `console.log`, `info`, `warn` and `error`
    - catches `error` and `unhandledrejection`
    - sends `{ source: 'll-run', runId, level, text }` messages to the parent
  - **in-memory `localStorage` and `sessionStorage` objects** implementing
    the `Storage` interface; they replace the inaccessible real ones, using
    `Object.defineProperty` on `window`
  - **`<div id="root">`** containing `demoHtml`, if given
  - **the learner's code**, wrapped as
    `(async (root) => { <code> })(document.getElementById('root'))`, followed
    by a `done` message
  - values are formatted like the Ladder's console: strings raw, everything
    else with `JSON.stringify`, falling back to `String()`
- **The output pane** shows lines as they arrive: warnings in amber, errors in
  red, and "(no output)" in muted grey if nothing was logged. Messages are
  accepted only from the current iframe's window with the current `runId`.
- **Frame visibility:**
  - blocks with `demoHtml` (the 8 DOM demos) show the iframe under the code as
    the "sandbox" area, auto-sized by a `resize` message from the bridge
  - other blocks keep the iframe visually hidden; it still runs
- **Storage note:** the Storage lesson (M26) gets a callout saying that the
  stand-in storage is cleared on every run.

### Web Try-it runner (HTML, CSS)

- **`buildSrcdoc(code, runId)`** inserts the same bridge (console capture
  only, no `root`) as the first child of `<head>`, or at the start of the
  document when there is no `<head>`.
- **The frame:**
  `<iframe sandbox="allow-scripts allow-modals allow-forms">`, shown as a live
  preview.
- **No console panel:** the HTML and CSS courses don't show one, because their
  examples don't log.

### Python runner

- **Worker:** `PythonRunnerService` owns a module Web Worker,
  `python.worker.ts`, created the first time it's needed.
- **Loading Pyodide:** the worker loads Pyodide at runtime from jsDelivr,
  pinned to one exact version kept in the constant `PYODIDE_VERSION`. The URL
  goes through a variable in `import()`, so it isn't bundled.
- **Messages:**
  - from the page to the worker: `{ type: 'run', runId, code }`
  - from the worker to the page: `{ type: 'loading' | 'ready' | 'stdout' |
    'stderr' | 'done' | 'error', runId, text? }`
- **Output:** stdout and stderr stream into the output pane. A Python
  traceback is shown in red.
- **`input()`** raises
  `RuntimeError("input() isn't supported in this editor yet")`.
- **Loading message:** the first run shows "Loading Python… (one-time
  download, ~10 MB)".
- **Stop:** calls `worker.terminate()` and adds "■ Stopped"; the next run
  creates a new worker.
- **If the load fails:** "Couldn't load Python. Check your connection." with
  **Retry**.

### Code editor

- **`CodeEditorComponent`** wraps CodeMirror 6 and takes these inputs:
  `code`, `lang`, `readonly`. It emits `codeChange`.
- **Packages:** `codemirror`, `@codemirror/lang-html`, `@codemirror/lang-css`,
  `@codemirror/lang-javascript` and `@codemirror/lang-python`, with the Ladder
  highlight style from section 3.
- **Bundling:** CodeMirror is lazy-loaded with the lesson and Try-it pages.
- **Accessibility:** Tab indents. Esc followed by Tab leaves the editor, and a
  hint under editable editors says so.

## 7. Components and services

| Unit | Purpose | Depends on |
|---|---|---|
| `ToolbarComponent` (existing) | Logo, language menu, theme toggle | course registry, `ThemeService` |
| `HomeComponent` (existing placeholder) | Course cards | course registry |
| `CourseLayoutComponent` | Loads `:course`; grouped sidebar / Material drawer + outlet | `CourseService`, `ProgressService` |
| `LessonPageComponent` | Eyebrow, title, blocks, Previous/Next, tab title; tracks completion | `CourseService`, `ProgressService` |
| `BlockComponent` | Renders one `Block` by `kind` (recursive for `callout` and `reveal`) | the block components below |
| `RichTextComponent` | Safe inline formatting | — |
| `CodeBlockComponent` | Code block with header bar; inline Run/Edit/Reset or Try-it link | `CodeEditorComponent`, `JsRunnerComponent` |
| `JsRunnerComponent` | Fresh sandboxed iframe per run, output pane, demo area | `buildJsSrcdoc` |
| `CodeEditorComponent` | CodeMirror wrapper | `ThemeService` |
| `CalloutComponent`, `RevealComponent`, `TableComponent`, `ListComponent`, `CardsComponent` | Ladder-styled static blocks | `RichTextComponent` |
| `QuizComponent` | Options; marks right and wrong; shows `why` after the first answer; reports correctness | `RichTextComponent` |
| `FigureComponent` | Trusted SVG, caption, Play/Pause for animated figures | `DomSanitizer` |
| `ExerciseComponent` (new) | Fill-in-the-code gaps or multiple choice; Check, feedback, Show answer | `checkAnswer` |
| `TryItPageComponent` | Full-screen editor, Run/Reset/Stop, result pane | `CourseService`, `WebPreviewComponent`, `PythonRunnerService` |
| `WebPreviewComponent` | Sandboxed preview iframe | `buildSrcdoc` |
| `NotFoundComponent` | "Page not found" | — |
| `CourseService` | `load(slug)`, `lessons(course)` flattened in order, `findLesson`, `neighbours`, `tryItExamples(lesson)` | course registry |
| `ProgressService` | `isDone`, `markDone`; signal-backed; key `ll_progress_v1` = `{ [course]: lessonSlug[] }`; all access in `try/catch` | `localStorage` |
| `PythonRunnerService` | Worker lifecycle and message protocol | `python.worker.ts` |
| `ThemeService` (changed) | `data-theme` model with the system default; `isDark` signal | `localStorage`, `matchMedia` |

### Exercise and quiz behaviour

- **`exercise` (fill in the code / multiple choice):**
  - **Check** is enabled once every gap is filled or an option is chosen.
  - **Correct:** "✓ Correct!" appears and the exercise locks.
  - **Wrong:** "Not quite — try again." appears, the gaps that are wrong are
    outlined in `--warn`, and **Show answer** is offered.
  - **`checkAnswer`:** multiple choice needs an exact match. Fill in the code
    needs the same number of gaps, and each trimmed response must exactly
    equal one of that gap's accepted values (case-sensitive).
- **`quiz` (the Ladder's quick checks):**
  - clicking an option marks it `.right` or `.wrong`, and the correct option
    is always highlighted once anything is picked
  - `why` is revealed and the quiz locks after the first pick, as in the Ladder
  - the quiz counts as correct only if the first pick was right
  - **Try again** resets it
- **`reveal`:** a collapsible box, closed by default. It is not counted
  towards completion.
- **When a page is finished:** every `exercise` and `quiz` on it has been
  answered correctly. A page with neither is finished when it is opened.

## 8. Course content (v1)

### HTML, CSS, Python: 10 beginner lessons each (written fresh)

Every lesson has a short explanation in simple English, 1–3 examples, a
`trap` or `key` callout where beginners commonly slip, and 2–3 `exercise`
blocks. All content is original.

| # | HTML (`html`) | CSS (`css`) | Python (`python`) |
|---|---|---|---|
| 1 | HTML Home (`home`) | CSS Home (`home`) | Python Home (`home`) |
| 2 | Introduction & page structure (`introduction`) | Introduction: adding CSS (`introduction`) | Syntax & print() (`syntax`) |
| 3 | Elements (`elements`) | Syntax (`syntax`) | Comments & variables (`variables`) |
| 4 | Attributes (`attributes`) | Selectors (`selectors`) | Data types (`data-types`) |
| 5 | Headings & paragraphs (`headings-paragraphs`) | Colors (`colors`) | Strings (`strings`) |
| 6 | Links (`links`) | Backgrounds (`backgrounds`) | Operators (`operators`) |
| 7 | Images (`images`) | Text & fonts (`text-fonts`) | If…Else (`if-else`) |
| 8 | Lists (`lists`) | Box model (`box-model`) | Loops (`loops`) |
| 9 | Tables (`tables`) | Display (`display`) | Lists (`lists`) |
| 10 | Forms (`forms`) | Flexbox (`flexbox`) | Functions (`functions`) |

### JavaScript: "The JavaScript Ladder" (imported)

**Settings:**

| Field | Value |
|---|---|
| Course slug | `javascript` |
| Menu label | "JavaScript" |
| Title | "The JavaScript Ladder" |
| `exampleRun` | `'inline'` |
| `exampleLang` | `'javascript'` |

**Sidebar groups and page slugs.** Titles are the Ladder's English titles.

| Group | Pages (`slug`) |
|---|---|
| Start here | How to use this course (`how-to-use`, including the hero intro and facts) · The roadmap (`roadmap`) · The 14-week study plan (`study-plan`) |
| Level 0 · Ground | M1 What JavaScript is, and your first output (`m1-what-is-javascript`) |
| Level 1 · Fundamentals | M2 Values, variables and types (`m2-values-variables-types`) · M3 Operators, comparison and coercion (`m3-operators`) · M4 Strings and numbers in practice (`m4-strings-numbers`) · M5 Control flow: decisions and loops (`m5-control-flow`) · M6 Functions (`m6-functions`) |
| Level 2 · Data shapes | M7 Arrays and the methods that matter (`m7-arrays`) · M8 Objects, destructuring and JSON (`m8-objects`) |
| Level 3 · The browser | M9 The DOM: reading and changing the page (`m9-dom`) · M10 Events (`m10-events`) |
| Level 4 · How JavaScript really works | M11 Scope, hoisting and closures (`m11-scope-closures`) · M12 `this`, call, apply and bind (`m12-this`) · M13 Prototypes, classes and inheritance (`m13-prototypes-classes`) |
| Level 5 · Async and modern JavaScript | M14 Asynchronous JavaScript and the event loop (`m14-async`) · M15 APIs, fetch and error handling (`m15-fetch`) · M16 Modules and modern tooling (`m16-modules`) |
| Level 6 · Craft | M17 Higher-order functions and functional patterns (`m17-functional`) · M18 Memory, performance and patterns (`m18-performance`) |
| Level 7 · The working toolkit | M19 Debugging and reading error messages (`m19-debugging`) · M20 Recursion (`m20-recursion`) · M21 Big-O and the patterns interviews test (`m21-big-o`) · M22 Regular expressions (`m22-regex`) · M23 Dates, times and formatting (`m23-dates`) · M24 Map, Set, WeakMap and Symbol (`m24-collections`) · M25 Iterators, generators and async iteration (`m25-generators`) · M26 Storage and the rest of the browser toolbox (`m26-storage`) · M27 Testing your code (`m27-testing`) · M28 JavaScript outside the browser: Node.js and npm (`m28-node`) · M29 Modern JavaScript: ES2015 → ES2026, and what's next (`m29-modern-js`) · M30 Metaprogramming and the corners of the language (`m30-metaprogramming`) |
| Reference | Glossary (`glossary`) · Nine projects (`projects`) · The interview bank (`interview`) |

**Group introductions:** each level's introduction text (the Ladder's level
heading and sub-text) becomes the opening `text` block of that level's first
module.

**Import process (one-off, during implementation):**

1. **Run the converter.** A throwaway Node script (kept out of the repo)
   parses the saved artifact HTML and writes
   `content/javascript/<slug>.ts`, one file per page. It:
   - drops every `.t-hi` element and keeps `.t-en`
   - maps elements to blocks: `h2`/`h3`/`h4` → `heading`; `p` → `text`
     (`.lede`/`.small` → `style`); `ul`/`ol` → `list`; `.tw table` → `table`;
     `.callout.*` → `callout`; `.code` → `example` (label from `data-label`;
     `data-norun` → `run: 'none'`; `data-demo` → `demoHtml` taken from the
     block's demo template; `language-xml` → `html`); `.quiz` → `quiz`
     (`answer` from `data-answer`); `details` → `reveal` (`tag` from
     `.tag`); `figure.fig` → `figure` (`animated` from `data-anim`);
     `.projgrid .proj` → `cards`; the roadmap `.ladder` → `heading`/`text`
     pairs; the hero `.facts` → a two-column `table`
   - converts inline HTML to the text format (`strong`, `em`, `code`, `a`) and
     unescapes entities
2. **Review by hand.** Read every generated file, fix any mapping errors, and
   remove text that only made sense on the single page, such as "this page" or
   "scroll down" (rewritten as "this course" or with a link to the right
   page).
3. **Run the import checks** in section 10.

## 9. Errors and edge cases

| Situation | Behaviour |
|---|---|
| Unknown course, lesson or Try-it number | "Page not found" |
| Course chunk fails to load | "Couldn't load this course. Check your connection and reload." + **Reload** |
| Pyodide fails to load | "Couldn't load Python. Check your connection." + **Retry** |
| Learner's JavaScript throws | Red error line in the output pane; site unaffected |
| Learner's Python raises | Traceback in red in the output pane |
| Python infinite loop | **Stop** terminates the worker |
| JavaScript infinite loop in an edited example | The tab may freeze (known v1 limitation) |
| `localStorage` blocked or throws (site's own progress/theme) | ✓ marks / theme choice not saved; no error shown |

## 10. Testing and verification

**Automated (Jest; `npm test`)**

- **`content.spec.ts`**, run over every registered course:
  - lesson slugs are unique within each course, and each course has at least
    one lesson
  - each `fill_code` exercise has one answer per `[___]` and at least one gap
  - multiple-choice options include the answer
  - `checkAnswer(exercise, canonical answer)` returns true for every exercise
  - every `quiz.answer` is a valid option index, and `why` is non-empty
  - every `reveal` and `callout` has at least one block
  - every `figure` has an SVG and a caption, and contains no `<script`,
    `on…=` attributes or `javascript:` URLs
  - every `example` has non-empty code
  - no Python example contains `input(`
- **`answer.util.spec.ts`** (rewritten), covering both exercise types: case
  sensitivity, spaces at either end ignored, alternative answers, and the
  wrong number of gaps.
- **`build-js-srcdoc.spec.ts`:**
  - the code is wrapped with `root`, and `demoHtml` is placed inside
    `#root`
  - `runId` is embedded
  - the storage stand-in implements `getItem`, `setItem`, `removeItem`,
    `clear`, `key` and `length`
- **`build-srcdoc.spec.ts`:** the bridge is placed correctly with and without
  a `<head>`, and the code is otherwise unchanged.
- **`js-runner.component.spec.ts`:**
  - messages with a stale `runId` or from another window are ignored
  - warn and error lines get their styles
  - "(no output)" is shown when nothing is logged
- **`python-runner.service.spec.ts`** (with a fake `Worker`):
  - messages arrive in order
  - stale `runId`s are ignored
  - `stop()` terminates the worker and the next run creates a new one
  - a load failure produces the Retry state
- **`course.service.spec.ts`:**
  - `lessons()` flattens the groups in order
  - `neighbours` works across group boundaries and at both ends
  - unknown slugs return `undefined`
  - `tryItExamples` picks only `run: 'tryit'`
- **`progress.service.spec.ts`:** progress persists across instances, and a
  throwing `localStorage` doesn't break the service.
- **`theme.service.spec.ts`:** follows the system default with no stored
  choice, a stored choice wins, and the toggle sets `data-theme` and stores
  it.
- **`rich-text.component.spec.ts`:** bold, italic, code and links; HTML in
  text is shown as text, not markup.
- **`quiz.component.spec.ts`:** a wrong pick then the correct one is
  highlighted, `why` is shown, it counts as correct only on a right first
  pick, and Try again resets it.
- **`lesson-page.component.spec.ts`:** renders one of each block kind,
  Previous/Next point to the right URLs, and Try-it links point to
  `try/<n>`.

**Lint and CI:**

- Each project (`apps/web`, `libs/shared-utils`, `libs/shared-models`) gets a
  `.eslintrc.json` extending the root with `plugin:@nx/typescript`.
- `libs/shared-models` gets a `project.json` tagged `type:lib`/`scope:shared`.
- `npx nx run-many -t lint test build` passes, which is what
  `.github/workflows/ci.yml` runs.

**Import checks for the JavaScript Ladder (once, during implementation):**

- **Counts:** a script compares counts in the generated content against the
  source artifact, and they must match exactly:
  - 30 module pages and 6 other pages
  - 133 code blocks, of which 11 are `run: 'none'` and 8 have `demoHtml`
  - 25 `trap`, 16 `key` and 4 `win` callouts
  - 131 `reveal` boxes, 9 quizzes, 11 figures and 9 project cards
  - interview questions Q1–Q58
- **Output parity:** a Playwright script runs every runnable example on the
  original artifact page (its Run buttons) and on the new site, then compares
  the output lines. Differences that are expected (random values, current
  dates and times, timings) are reviewed by hand; any other difference is
  fixed.

**Content accuracy for the new lessons (once):** every Python example runs
under local CPython 3 and its output must match the lesson text. Every HTML
and CSS example opens in the Try-it page with no unexpected console errors.

**Manual check before calling it done (real browser):**

- **For each course:** open it from the home card and the language menu,
  open several pages, and use Previous/Next at both ends and (JavaScript)
  across groups.
- **JavaScript:**
  - run an example, edit and re-run it, and use Reset
  - run a DOM demo (M9 or M10) and a storage example (M26)
  - answer a quiz wrongly, then correctly via Try again
  - play and pause an animated figure
  - open an exercise, its solution, and an interview question
- **HTML/CSS/Python:** run, edit, Reset and Back on a Try-it page; Stop a
  Python `while True:` loop; answer exercises wrongly and then correctly, and
  use Show answer.
- **Everywhere:**
  - reload and confirm the ✓ marks persist
  - visit an unknown URL
  - check light and dark mode (system default and toggle) and 375px width with
    the drawer
  - confirm there are no site console errors

## 11. Docs

- **`README.md`:** what the site is, `npm install` / `npm start` /
  `npm test` / `npm run build`, how to add a lesson (with an example file),
  and how to add a language.
- **`docs/ARCHITECTURE.md`:** the content model, block kinds, runners,
  components and routes in short form.
- **`docs/DEPLOYMENT.md`:** static hosting with the SPA fallback, the
  Docker/nginx option, and a note that Python needs access to
  `cdn.jsdelivr.net` and the fonts need `fonts.googleapis.com`.
- **Credits:** the README notes that the JavaScript course comes from "The
  JavaScript Ladder".

## 12. Implementation status (2026-10-06)

### Built: six courses

| Course | Source | Pages | Examples |
|---|---|---|---|
| HTML | Written fresh, simple English | 22 | Full-screen Try-it with live preview, plus auto-checked exercises |
| CSS | Written fresh, simple English | 26 | Full-screen Try-it with live preview, plus auto-checked exercises |
| JavaScript | "The JavaScript Ladder", English, text kept as written | 36 | Inline Run in a sandbox; all 122 runnable examples match the source output |
| Python | "The Python Ladder", English, text kept as written | 36 | **Show output** (predict, then reveal the stored output), as in the source. No Pyodide |
| PostgreSQL | Written fresh, simple English | 39 | Inline **Run** on real PostgreSQL in the browser (PGlite), on a fresh copy of a sample shop database |
| NestJS | "The NestJS Ladder": Modules 1–9 kept as written; Modules 10–30 and the reference pages written fresh in the same shape | 35 | Copy-only (backend code); ✓ good / ✗ avoid badges on comparisons |

**Decisions made during the build:**

- **Python examples** use Show output instead of running, which replaces the
  Pyodide runner in section 6; Pyodide is not built.
- **One gold accent** is used for every course.
- **The Ladders keep their original wording.** HTML and CSS were already at
  about reading grade 5. The JavaScript and Python Ladders read at grade 8–9
  and were kept as written, at the author's choice.
- **The HTML and CSS courses gained eight topic lessons:**
  - HTML: media, block and inline, page layout
  - CSS: units, position, grid, responsive design, hover and transitions
- **A second pass filled the remaining beginner topics** (9 HTML, 11 CSS):
  - HTML: text formatting, entities and symbols, file paths, classes and IDs,
    responsive images, SVG, form inputs, form validation, accessibility
  - CSS: cascade and specificity, borders and shadows, centering, math
    functions, overflow and images, styling elements, pseudo-elements,
    transforms, animations, variables, modern CSS
- **Model additions:**
  - `CodeLang` gains `typescript`, `text` and `sql`
  - `example` gains `output` (Show output), `verdict` (good/bad), `setup`
    (hidden SQL that runs first) and `expectError` (an example meant to fail)
  - `Course` gains `setup`, the seed SQL that every example starts from
- **"Simple words" boxes:** Python's "Reading in Hindi" box was dropped with
  the Hindi edition.
- **NestJS targets version 11.** NestJS 12 shipped on 2026-08-27 and is now
  npm's `latest`. Its CLI scaffolds an ES-module project with Vitest and
  oxlint, which no longer matches the lessons. So the setup page installs
  `@nestjs/cli@11`, and every install line pins the Nest 11 release of its
  package (for example `@nestjs/swagger@11` or `@nestjs/config@4`), because
  several 12.x packages fail with a peer-dependency error in a Nest 11
  project. Version notes in the later modules say what changes in 12.
- **Corrections to the NestJS Part 1 text** (facts only; the wording is
  otherwise the author's): the roadmap's level and week ranges, the Node
  version (NestJS 11 needs Node 20; use 22 or 24), `import type { Request }`
  in Module 6, and `eslint.config.mjs` in Module 2's file tree.

### PostgreSQL runner

- **Engine:** PGlite 0.5.8 (PostgreSQL 18.3 compiled to WebAssembly), in a
  module Web Worker (`blocks/sql/sql.worker.ts`), so a slow query never
  freezes the page.
- **Files:** the build copies `pglite.wasm`, `pglite.data` and `initdb.wasm`
  from `node_modules` to `/pglite/`, so no CDN is needed. The host should gzip
  them, cache them for days, and answer 404 for a missing file under `/pglite/`
  or `/assets/` instead of falling back to `index.html`.
- **Fresh data every run:** the worker loads the seed (`postgresql/seed.ts`:
  customers, categories, products, orders, order items, employees) once,
  saves a snapshot with `dumpDataDir`, and starts every run from a new
  instance made from that snapshot. A spare instance is prepared in the
  background, so later runs start at once. An example can drop a table
  without breaking the next one.
- **Running a script:** `split-sql.ts` splits the script the way psql does
  (quotes, dollar quotes, comments). Statements run one at a time in
  autocommit and stop at the first error. Each run starts with
  `SET TimeZone TO 'UTC'`.
- **Output:** psql style. A query shows a table (gold headers, NULL in
  italics, "(n rows)", at most 200 rows), any other statement a command tag
  ("INSERT · 3 rows added"), then NOTICE lines, and ERROR with DETAIL and
  HINT. Values arrive as PostgreSQL's own text, so dates, JSON and arrays
  look the same as in psql.
- **Limits:** 15 s per run. Stop ends the worker, and the next run starts a
  new one.
- **Speed:** the first run downloads about 4 MB and takes about 4–5 s
  ("Starting PostgreSQL…"); later runs take 0.2–1 s.
- **Checks:** `tools/check-lessons.mjs --sql` runs every example in the
  course on PGlite, and `sql-examples.spec.ts` runs it in CI.

**CI:** `nx run-many -t lint test build` passes (88 tests), with content tests
for every course: exact block counts for each imported Ladder, every
PostgreSQL example run in PGlite, and NestJS checks for level banners,
interview numbering Q1–Q86 and pinned installs.

### Not built yet

- `lesson-page.component.spec.ts`.

At the owner's request the Nx monorepo became a plain Angular CLI project:
`src/` at the root, `angular.json`, one Jest config, and the two libraries
folded into `src/app/shared/`. Paths elsewhere in this spec that start with
`apps/web/` now start at the root, and `libs/` paths live in `src/app/shared/`.

The Docker setup (`Dockerfile`, `docker-compose.yml`, `.dockerignore` and the
`docker:*` scripts) was removed at the owner's request, and later the unused
`nginx.conf` and an empty `favicon.ico`; `docs/DEPLOYMENT.md` lists the hosting
rules nginx used to apply. The docs in section 11 are written. `DEPLOYMENT.md` has no `cdn.jsdelivr.net`
note, because Pyodide was not built; the only outside host is Google Fonts.

### Changes from this spec, and why

- **Drawer:** the narrow-screen drawer is plain CSS, not Material side-nav.
  Material side-nav scrolls inside its own container, which breaks
  `scrollPositionRestoration` and the sticky sidebar.
- **Material typography:** `plain-family` is Bricolage Grotesque, so
  Material's buttons and menus use a UI face. Lesson body text is still
  Newsreader.
- **Material palette:** it uses `mat.$yellow-palette` with
  `use-system-variables`, and the `--sys-*` variables are mapped to the Ladder
  tokens instead of to a generated palette. Material therefore follows
  light/dark through the tokens.
- **Animated figures** play by default unless the reader prefers reduced
  motion, which is the Ladder's behaviour.
- **`Lesson`** gains an optional `num` ('M6') and `nav` (a short sidebar
  label), as in the Ladder's sidebar.
- **Level introductions** become a `plain` callout titled with the level, at
  the top of each level's first module. The closing "Where to go after week
  14" note is appended to the interview-bank page.
- **UI additions** (approved during the build):
  - the sidebar is drawn as a ladder: one rung per lesson, the rail gold up to
    the furthest finished lesson, and a progress meter
  - the lesson header shows the group and "Lesson *n* of 36"
  - an "On this page" panel with scroll-spy appears at 1280px and wider
  - Previous/Next cards sit at the bottom of each lesson
  - the home hero has a runnable snippet, and a Continue link appears once
    progress exists
- **Try-it preview widths:** Phone (375px), Tablet (600px) and Full buttons,
  so the responsive lessons can be tested without resizing the window.
- **Jump links in previews:** a small script added to every Try-it preview
  makes `#id` links scroll inside the preview. Without it, such a link loaded
  the whole site inside the preview.
- **Multiple-choice options** are shuffled with a seed taken from the
  exercise, so the answer is not always first, and the order stays the same
  on every visit.
- **Back from Try-it** returns to the same place in the lesson.
