import { Lesson } from '../../shared/content';

export const INTRODUCTION: Lesson = {
  slug: 'introduction',
  title: 'HTML Introduction',
  nav: 'Introduction',
  blocks: [
    {
      kind: 'text',
      text: "HTML stands for **HyperText Markup Language**. The name sounds difficult, but the idea is simple. *HyperText* means text with links that take you to other pages. *Markup* means you put labels around your content to say what each part is.",
    },
    {
      kind: 'text',
      text: "These labels are called **tags**. A tag is a word inside angle brackets, like `<p>`. The browser reads the tags, then shows the content in the right way. The visitor sees the result, not the tags.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'A complete HTML page',
    },
    {
      kind: 'text',
      text: "Every HTML page has the same basic shape. Look at this example, then open it and press **Run**:",
    },
    {
      kind: 'example',
      label: 'page.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Travel Notes</title>
</head>
<body>
  <h1>My Travel Notes</h1>
  <p>Last summer I visited the mountains.</p>
  <p>The air was cold and the views were beautiful.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Here is what each part does:",
    },
    {
      kind: 'table',
      head: ['Part', 'What it does'],
      rows: [
        ['`<!DOCTYPE html>`', "Tells the browser that this is a modern HTML page. It is always the first line."],
        ['`<html lang="en">`', "Wraps the whole page. The `lang` part says the page is written in English."],
        ['`<head>`', "Holds information *about* the page. Most of it is not shown on the page itself."],
        ['`<meta charset="utf-8">`', "Lets the page show letters from every language, plus symbols such as ✓ and €."],
        ['`<title>`', "The page name shown in the browser tab and in search results."],
        ['`<body>`', "Holds everything the visitor can see: text, images, links and more."],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The head and the body',
    },
    {
      kind: 'text',
      text: "Think of a page like a letter in an envelope. The `<head>` is the envelope: it has the address and other details. The `<body>` is the letter inside: it is the part people actually read.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "Anything you want visitors to see goes inside `<body>`. If you put a heading or paragraph inside `<head>`, the page will not work as you expect.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Notes for yourself: comments',
    },
    {
      kind: 'text',
      text: "A **comment** is a note in your code that the browser ignores. Start it with `<!--` and end it with `-->`. Comments are useful for explaining your code to other people, or to yourself later. In this example, the comment does not appear in the result:",
    },
    {
      kind: 'example',
      label: 'comment.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Comments</title>
</head>
<body>
  <!-- This note is only for people reading the code. -->
  <p>You can see this paragraph.</p>
  <!-- <p>This paragraph is hidden inside a comment.</p> -->
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Making your own file',
      blocks: [
        {
          kind: 'text',
          text: "Outside this site, you can write HTML in any plain text editor, such as Notepad on Windows or TextEdit on a Mac (in plain text mode). Save the file with a name that ends in `.html`, like `index.html`, then double-click it to open it in your browser.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Complete the page. Fill in the element that holds information about the page, and the element that holds the visible content.",
        code: `<!DOCTYPE html>
<html lang="en">
<[___]>
  <title>My page</title>
</head>
<[___]>
  <p>Hello!</p>
</body>
</html>`,
        answers: ['head', 'body'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which element sets the text shown in the browser tab?',
        options: ['`<title>`', '`<head>`', '`<h1>`', '`<body>`'],
        answer: '`<title>`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What does the browser do with a comment?',
        options: [
          'It ignores it and does not show it',
          'It shows it in bold',
          'It shows it in the browser tab',
          'It shows an error',
        ],
        answer: 'It ignores it and does not show it',
      },
    },
  ],
};
