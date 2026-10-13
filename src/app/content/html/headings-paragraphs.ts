import { Lesson } from '../../shared/content';

export const HEADINGS_PARAGRAPHS: Lesson = {
  slug: 'headings-paragraphs',
  title: 'HTML Headings and Paragraphs',
  nav: 'Headings & paragraphs',
  blocks: [
    {
      kind: 'text',
      text: "Most of a web page is text. Headings and paragraphs give that text a clear shape, so visitors can scan the page and find what they need quickly.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Six levels of headings',
    },
    {
      kind: 'text',
      text: "HTML has six heading elements, from `<h1>` to `<h6>`. `<h1>` is the most important heading: the title of the whole page. `<h2>` is for the main sections, `<h3>` is for parts inside a section, and so on down to `<h6>`.",
    },
    {
      kind: 'example',
      label: 'headings.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Headings</title>
</head>
<body>
  <h1>Heading level 1</h1>
  <h2>Heading level 2</h2>
  <h3>Heading level 3</h3>
  <h4>Heading level 4</h4>
  <h5>Heading level 5</h5>
  <h6>Heading level 6</h6>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Use headings like the outline of a book. A page usually has one `<h1>`. Under it come `<h2>` sections, and inside those come `<h3>` parts. Try not to skip levels, for example jumping from `<h1>` straight to `<h4>`.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Headings show structure, not size',
      blocks: [
        {
          kind: 'text',
          text: "Do not choose a heading just because you like its size. Search engines and screen readers use headings to understand how your page is organised. If you only want bigger or bolder text, you will learn to do that with CSS.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Paragraphs',
    },
    {
      kind: 'text',
      text: "The `<p>` element holds a **paragraph**: a block of text about one idea. The browser adds some space above and below each paragraph, so they do not run together.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How the browser treats spaces',
    },
    {
      kind: 'text',
      text: "Here is something that surprises many beginners. The browser does not keep the spaces and line breaks you type inside your code. Open this example and compare the code with the result:",
    },
    {
      kind: 'example',
      label: 'spaces.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Spaces</title>
</head>
<body>
  <h1>A Short Poem</h1>
  <p>
    Roses are red,
    the sky is      blue,
    this text is on
    one line for you.
  </p>
  <p>Roses are red,<br>the sky is blue,<br>now each part<br>has a line too.</p>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Pressing Enter or typing many spaces in your code does not change the page. The browser turns any group of spaces and line breaks into **one** space. To start a new line inside a paragraph, use `<br>`. To start a new idea, start a new `<p>`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Give this page a main heading and a paragraph. Fill in the tag names.",
        code: `<[___]>My Blog</h1>
<[___]>Today I learned about HTML headings.</p>`,
        answers: ['h1', 'p'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'How many levels of headings does HTML have?',
        options: ['3', '4', '6', '10'],
        answer: '6',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Inside a paragraph, you type five spaces between two words. What does the browser show?',
        options: ['One space', 'Five spaces', 'A new line', 'An error message'],
        answer: 'One space',
      },
    },
  ],
};
