# Architecture

LinguaLeap is a static Angular 18 site, set up as a standard Angular CLI project. There is no server.
Courses are TypeScript data compiled into the app, each course in its own
lazy-loaded chunk, and progress is kept in the browser's `localStorage`.

## Routes

| Path | Page |
|---|---|
| `/` | Home: a card per course, and "Continue" once there is progress |
| `/:course` | The course's first lesson |
| `/:course/:lesson` | A lesson, with the sidebar and "On this page" |
| `/:course/:lesson/try/:n` | The full-screen Try-it editor for the lesson's *n*-th Try-it example |
| `**` | Page not found |

An unknown course or lesson shows "Page not found" inside the course layout.

## Content model

The types are in `src/app/shared/content.ts`.

- **Course:** `slug`, `menuLabel`, `title`, `description`, the default
  `exampleLang` and `exampleRun`, `tryItRunner: 'web'` for HTML and CSS,
  `setup` (the seed SQL) for PostgreSQL, and ordered `groups` of lessons.
- **Lesson:** `slug`, `title`, optional `nav` (sidebar label), `num` (such as
  `M6`) and `eyebrow`, and a list of blocks.
- **Blocks:**

| Kind | What it shows |
|---|---|
| `heading` | A level 2–4 heading |
| `text` | A paragraph; `style: 'lede'` or `'small'` |
| `list`, `table` | A list or a table |
| `callout` | A box of nested blocks, in the tone `key`, `trap`, `win` or `plain` |
| `example` | Code with a header bar (see "Running code") |
| `exercise` | An auto-checked `fill_code` or `multiple_choice` exercise |
| `quiz` | A question with options, the index of the answer, and why |
| `reveal` | A box that opens on click, for solutions and interview answers |
| `figure` | An inline SVG with a caption; `animated` ones respect reduced motion |
| `cards` | A grid of small cards |

Text is rich text: `**bold**`, `*italic*`, `` `code` `` and
`[links](https://…)`.

"On this page" lists a lesson's top-level headings (levels 2 and 3), quick
checks, reveals and exercises. A lesson is finished when every quiz and
exercise on it, including ones inside callouts and reveals, has been answered
correctly.

## Running code

An example's `run`, or else the course's `exampleRun`, chooses how it runs:

- **`tryit`** (HTML, CSS): "Try it Yourself »" opens the Try-it page. The
  CodeMirror 6 editor sits next to a sandboxed `srcdoc` preview with Phone
  (375px), Tablet (600px) and Full widths, and Ctrl+Enter runs the code. A
  small script added to the preview makes `#id` links scroll inside it.
- **`inline`, JavaScript:** Run executes the code in a sandboxed `srcdoc`
  iframe without `allow-same-origin` (`blocks/build-js-srcdoc.ts`). Console
  output is posted back and shown under the code, and `localStorage` is
  replaced by an in-memory version.
- **`inline`, SQL:** Run sends the script to a Web Worker that runs PGlite
  (PostgreSQL 18 compiled to WebAssembly, `blocks/sql/`). Every run starts from
  a fresh copy of the course's `setup` database. The script is split the way
  psql splits it, statements run one at a time and stop at the first error,
  and results are shown as psql-style tables. A run may take 15 seconds;
  Stop ends the worker.
- **`none`:** the code is for reading and copying (NestJS, Python). An example
  with an `output` gets **Show output**, which reveals the stored result.

Any example can also have `verdict: 'good'` or `'bad'`, shown as a ✓ or ✗
badge.

## Files

Each component keeps its template and styles next to it, in `name.component.html`
and `name.component.css`. Components with no styles of their own are styled by
`src/styles.scss` and have no `.css` file.

| File | Job |
|---|---|
| `app.component.ts`, `layout/toolbar.component.ts` | The app shell, and the top bar: a link to each course and the theme switch |
| `features/home/home.component.ts` | The home page |
| `features/course/course-layout.component.ts` | The sidebar, drawn as a ladder with progress, and the drawer on narrow screens |
| `features/course/lesson-page.component.ts` | A lesson: header, blocks, Previous and Next, and the scroll position on Back |
| `features/course/lesson-toc.component.ts` | "On this page", with scroll-spy, at 1280px and wider |
| `features/try-it/try-it-page.component.ts` | The full-screen editor and preview |
| `blocks/block.component.ts` | Draws one block of any kind |
| `blocks/code-block.component.ts` | An example's header bar: Edit, Reset, Copy, Run, Stop, Show output, Try it |
| `blocks/exercise.component.ts` | Exercise gaps or options, Check and Show answer |
| `blocks/shuffle.ts` | Shuffles multiple-choice options in a fixed order for each exercise |
| `blocks/lesson-tracker.ts` | Collects the quiz and exercise results on the current page |
| `core/services/course.service.ts` | Loads courses when needed; finds lessons, neighbours and Try-it examples |
| `core/services/progress.service.ts` | Finished lessons, saved in `localStorage` under `ll_progress_v1` |
| `core/services/theme.service.ts` | Light and dark theme (`data-theme` on `<html>`; follows the system until changed) |
| `shared/answer.util.ts` | `checkAnswer` and the other exercise helpers |

## Look and feel

The "Ladder" design uses Bricolage Grotesque for headings and the interface,
Newsreader for lesson text, IBM Plex Mono for code, and one gold accent.
Colours are CSS custom properties with a light and a dark set. Angular
Material 18 (M3) reads the same values through its `--sys-*` variables.

## Checks

- `src/app/content/content.spec.ts`: rules for every course, and
  exact block counts for the imported Ladders.
- `tools/check-lessons.mjs`: checks lesson files one by one. `--web` applies
  the HTML and CSS rules, and `--sql` runs every SQL example on PGlite.
  `sql-examples.spec.ts` runs the SQL check as part of `npm test`.
