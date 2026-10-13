# Learn Language

Free programming tutorials in the style of W3Schools: HTML, CSS, JavaScript,
Python, PostgreSQL and NestJS. There is no login and no backend. The site is a
folder of static files, and each visitor's progress is saved in their own
browser.

| Course | Pages | How the examples work |
|---|---|---|
| HTML | 22 | **Try it Yourself »** opens a full-screen editor with a live preview |
| CSS | 26 | The same as HTML |
| JavaScript | 36 | **Run** executes the code in a sandbox, right under the example |
| Python | 36 | **Show output**: predict the result, then reveal it |
| PostgreSQL | 39 | **Run** executes real PostgreSQL in the browser, on a fresh copy of a sample shop database |
| NestJS | 35 | Backend code to read and copy, with ✓ and ✗ badges on comparisons |

Lessons end with exercises that are checked automatically. When all of them
are right, the lesson gets a ✓ in the sidebar.

## Run it

You need Node.js 20 or newer (CI uses 22).

```bash
npm install
npm start          # http://localhost:4200
```

| Command | What it does |
|---|---|
| `npm start` | Dev server with live reload |
| `npm test` | Unit and content tests. This includes running every PostgreSQL example, which takes about two minutes |
| `npm run lint` | ESLint for every project |
| `npm run build` | Production build, into `dist/learn-language/browser` |
| `npm run check:content` | Checks the HTML, CSS and PostgreSQL lessons against the content rules |

CI (`.github/workflows/ci.yml`) runs `npm run lint`, `npm test` and `npm run build`.

## Where things are

```
src/app/
  content/           every course as typed data: a folder per course, a file per lesson
    courses.ts       the list of courses, in menu order
  blocks/            draws lesson blocks: text, code, exercises, quizzes, figures
    sql/             the PostgreSQL runner (a Web Worker with PGlite)
  features/          pages: home, course (sidebar + lesson), Try-it editor, not found
  core/services/     course loading, progress, light and dark theme
  shared/            the content model (Course, Lesson, Block, Exercise) and answer checking
tools/check-lessons.mjs   the content checker
```

More detail is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Add a lesson

1. Create a file in the course folder, for example
   `src/app/content/html/details.ts`:

   ```ts
   import { Lesson } from '../../shared/content';

   export const DETAILS: Lesson = {
     slug: 'details',              // the URL becomes /html/details
     title: 'HTML Details',
     nav: 'Details',               // a shorter label for the sidebar
     blocks: [
       { kind: 'text', style: 'lede', text: 'The `<details>` element hides extra text until the reader clicks it.' },
       {
         kind: 'example',
         label: 'details.html',
         code: `<!DOCTYPE html>
   <html>
   <body>
     <details>
       <summary>What is HTML?</summary>
       <p>HTML is the language used to build web pages.</p>
     </details>
   </body>
   </html>`,
       },
       { kind: 'heading', level: 3, text: 'Check what you know' },
       {
         kind: 'exercise',
         exercise: {
           type: 'fill_code',
           prompt: 'Fill in the element that holds the text the reader clicks.',
           code: '<details>\n  <[___]>Show more</summary>\n</details>',
           answers: ['summary'],
         },
       },
       {
         kind: 'exercise',
         exercise: {
           type: 'multiple_choice',
           prompt: 'What does the reader see before clicking?',
           options: ['Only the summary', 'All the text', 'Nothing'],
           answer: 'Only the summary',
         },
       },
     ],
   };
   ```

2. Import it in the course's `index.ts` and add it to a group. The order of
   the groups and lessons is the order of the course.
3. Check it, then run the tests:

   ```bash
   node tools/check-lessons.mjs --web src/app/content/html/details.ts
   npm test
   ```

   Use `--web` for HTML and CSS lessons, `--sql` for PostgreSQL lessons (it
   runs every SQL example), and no flag for the other courses.

Text fields are rich text: `**bold**`, `*italic*`, `` `code` `` and
`[links](https://…)`. A `fill_code` exercise has one `[___]` per gap, and
`answers[i]` holds the accepted answer for gap *i*: a string, or a list of
strings where the first one is the main answer.

Rules the tests check for HTML and CSS lessons: Try-it examples are complete
pages that start with `<!DOCTYPE html>`, use no `<script>`, link only to
`https://example.com`, and use images that exist in `src/assets/img`.
Every lesson has at least two exercises.

## Add a course

1. Create `src/app/content/<slug>/index.ts` that exports a `Course`
   with its `slug`, `menuLabel`, `title`, `description`, default `exampleLang`
   and `exampleRun` (`'tryit'`, `'inline'` or `'none'`), and its `groups` of
   lessons.
2. Add an entry to `COURSES` in `src/app/content/courses.ts` with the
   same `description`. The home page shows it before the course has loaded,
   and a test checks that the two match.
3. Run `npm test`. The content tests check every course: unique lesson slugs,
   well-formed blocks, and exercises that accept their own answers.

## Credits

The JavaScript and Python courses are "The JavaScript Ladder" and "The Python
Ladder", and NestJS Modules 1–9 are "The NestJS Ladder", kept in their original
words. NestJS Modules 10–30 and its reference pages were written to continue
that Ladder. The HTML, CSS and PostgreSQL courses were written for this site.

## License

MIT
