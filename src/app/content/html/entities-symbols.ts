import { Lesson } from '../../shared/content';

export const ENTITIES_SYMBOLS: Lesson = {
  slug: 'entities-symbols',
  title: 'HTML Entities, Symbols and Emojis',
  nav: 'Entities & symbols',
  blocks: [
    {
      kind: 'text',
      text: "Some characters have a special job in HTML. The `<` sign, for example, starts a tag. So how do you show a real `<` sign on your page? You write a short code called an **entity** instead. In this lesson you will also learn how to add symbols and emojis, and a little more about comments.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Writing an entity',
    },
    {
      kind: 'text',
      text: "When the browser sees `<`, it thinks a tag is starting. So if you write `<p>` in your text to talk about the paragraph tag, the browser makes a real paragraph, and the visitor never sees the letters. Write `&lt;` instead of `<`, and `&gt;` instead of `>`. *lt* means *less than*, and *gt* means *greater than*.",
    },
    {
      kind: 'text',
      text: "Every entity starts with `&` (the **ampersand** sign) and ends with `;` (a semicolon). The part in between is a short name. Here are the entities you will use most:",
    },
    {
      kind: 'table',
      head: ['Entity', 'Shows', 'Name'],
      rows: [
        ['`&lt;`', '`<`', 'Less than'],
        ['`&gt;`', '`>`', 'Greater than'],
        ['`&amp;`', '`&`', 'Ampersand'],
        ['`&nbsp;`', 'A space that never breaks the line', 'Non-breaking space'],
        ['`&copy;`', '©', 'Copyright'],
      ],
    },
    {
      kind: 'example',
      label: 'entities.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Entities</title>
</head>
<body>
  <h1>HTML notes</h1>
  <p>A paragraph starts with &lt;p&gt; and ends with &lt;/p&gt;.</p>
  <p>Use <code>&lt;br&gt;</code> to start a new line.</p>
  <p>Fish &amp; chips</p>
  <p>The race is 10&nbsp;km long.</p>
  <p>&copy; 2026 Green Bean Café</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Open the example, change the first `&lt;p&gt;` to `<p>` and press **Run**. The `<p>` disappears, and the sentence breaks in two: the browser now reads it as a real tag and starts a new paragraph.",
    },
    {
      kind: 'text',
      text: "Because every entity starts with `&`, write a real `&` sign as `&amp;`, as in *Fish & chips* above. Then the browser never mistakes it for the start of an entity.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not forget the semicolon at the end of an entity. Without it, some entities still work and others do not. Always write the full code, like `&amp;`, not `&amp`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The non-breaking space',
    },
    {
      kind: 'text',
      text: "`&nbsp;` looks like a normal space, but the browser never starts a new line there. Use it to keep together words that belong together, such as `10&nbsp;km` or `9&nbsp;am`. The number and the word then always stay on the same line. Do not type many `&nbsp;` in a row to move text across the page: spacing is a job for CSS.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Numbers instead of names',
    },
    {
      kind: 'text',
      text: "Every character in the world has a number. You can write any character with its number: `&#`, then the number, then `;`. For example, `&#169;` shows ©, just like `&copy;`. The number can also be written in **hexadecimal**, a way of counting that uses 0 to 9 and then A to F. Then you start with `&#x`: `&#xA9;` is also ©.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Symbols and emojis',
    },
    {
      kind: 'text',
      text: "Remember the line `<meta charset=\"utf-8\">` in the head? **UTF-8** is a way of storing text that covers the letters of every language, plus thousands of symbols and emojis. With this line, you can type characters such as é, ñ, €, ✓ or 😀 straight into your HTML. Save your files as UTF-8 too: most code editors do this for you. You only need entities for the characters that have a special job in HTML.",
    },
    {
      kind: 'example',
      label: 'symbols.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Symbols and emojis</title>
</head>
<body>
  <h1>Hello, world! 🌍</h1>
  <p>¡Hola! · Bonjour · Olá · Merhaba · Γεια σου · Привет · こんにちは · 你好</p>
  <p>Typed straight in: € ✓ ♥ 😀</p>
  <p>Written as numbers: &#8364; &#10003; &#9829; &#128512;</p>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Emojis are characters',
      blocks: [
        {
          kind: 'text',
          text: "An emoji is a character, just like a letter. That is why it can look a little different on each phone or computer: every system draws its own emojis. Screen readers read each emoji aloud by its name, such as *grinning face*, so do not use too many in a row.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Comments, a second look',
    },
    {
      kind: 'text',
      text: "You met comments in the Introduction: notes in your code that start with `<!--` and end with `-->`. The browser does not show them on the page. A comment can cover many lines, which is handy for hiding part of a page for a while without deleting it:",
    },
    {
      kind: 'example',
      label: 'comments.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Comments</title>
</head>
<body>
  <h1>Today's menu</h1>
  <!-- Add the prices next week. -->
  <p>Tomato soup</p>
  <!--
  <p>Fish curry</p>
  <p>Hidden until the new cook starts.</p>
  -->
  <p>Apple pie</p>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Comments are not secret',
      blocks: [
        {
          kind: 'text',
          text: "Comments are hidden on the page, but anyone can read them. Every browser has a *View page source* tool that shows all the code of a page, comments included. Never put passwords or private notes in a comment.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Show the letters `<h1>` on the page, instead of making a heading. Fill in the entity for the `<` sign and the entity for the `>` sign.",
        code: `<p>The main heading uses the [___]h1[___] tag.</p>`,
        answers: [
          ['&lt;', '&#60;', '&#x3C;', '&#x3c;'],
          ['&gt;', '&#62;', '&#x3E;', '&#x3e;'],
        ],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Turn this note into a comment, so that it does not appear on the page. Fill in the start and the end of the comment.",
        code: `[___] Add the prices next week. [___]`,
        answers: ['<!--', '-->'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which line in the head lets you type emojis and the letters of every language straight into your page?',
        options: [
          '`<meta charset="utf-8">`',
          '`<html lang="en">`',
          '`<title>`',
          '`<body>`',
        ],
        answer: '`<meta charset="utf-8">`',
      },
    },
  ],
};
