import { Lesson } from '../../shared/content';

export const ELEMENTS: Lesson = {
  slug: 'elements',
  title: 'HTML Elements',
  nav: 'Elements',
  blocks: [
    {
      kind: 'text',
      text: "An HTML page is made of **elements**. An element is one piece of the page, such as a heading, a paragraph or a picture. In this lesson you will learn how an element is written, and how to put elements inside each other.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The parts of an element',
    },
    {
      kind: 'text',
      text: "Here is one paragraph element: `<p>I like green tea.</p>`. Like most elements, it has three parts:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "The **start tag** `<p>` says where the element begins.",
        "The **content** `I like green tea.` is what the visitor sees.",
        "The **end tag** `</p>` says where the element stops. It looks like the start tag, but with a slash `/` before the name.",
      ],
    },
    {
      kind: 'text',
      text: "The start tag, the content and the end tag together make one element. Always write tag names in lowercase. Browsers also accept capital letters, but lowercase is the normal style.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Elements inside elements',
    },
    {
      kind: 'text',
      text: "You can put an element inside another element. This is called **nesting**. In fact, every page is nested: `<body>` is inside `<html>`, and your paragraphs are inside `<body>`. Below, `<strong>` (important text) and `<em>` (stressed text) are nested inside paragraphs:",
    },
    {
      kind: 'example',
      label: 'nesting.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nesting</title>
</head>
<body>
  <h1>Cooking Rice</h1>
  <p>Wash the rice <strong>before</strong> you cook it.</p>
  <p>Use <em>two cups</em> of water for one cup of rice.</p>
  <p><strong>Do not lift the lid <em>while</em> it cooks.</strong></p>
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
          text: "Close elements in the opposite order to how you opened them. The element you opened last must close first, like boxes inside boxes.",
        },
        {
          kind: 'example',
          run: 'none',
          label: 'order.html',
          code: `<!-- Wrong: strong is closed before em -->
<p><strong><em>Hurry!</strong></em></p>

<!-- Right: em opened last, so it closes first -->
<p><strong><em>Hurry!</em></strong></p>`,
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Empty elements',
    },
    {
      kind: 'text',
      text: "A few elements have no content, so they have no end tag. These are called **empty elements**. Two useful ones are `<br>`, which starts a new line, and `<hr>`, which draws a line across the page to separate topics:",
    },
    {
      kind: 'example',
      label: 'empty.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Empty elements</title>
</head>
<body>
  <p>Ana Silva<br>12 Garden Street<br>Lisbon</p>
  <hr>
  <p>This paragraph comes after the line.</p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Some common elements',
    },
    {
      kind: 'table',
      head: ['Element', 'What it is for'],
      rows: [
        ['`<h1>`', 'The main heading of the page'],
        ['`<p>`', 'A paragraph of text'],
        ['`<strong>`', 'Important text, usually shown in bold'],
        ['`<em>`', 'Stressed text, usually shown in italics'],
        ['`<a>`', 'A link to another page'],
        ['`<img>`', 'An image (an empty element)'],
        ['`<br>`', 'A line break (an empty element)'],
        ['`<hr>`', 'A dividing line between topics (an empty element)'],
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Put the city on a new line. Fill in the empty element that makes a line break.",
        code: `<p>Ana Silva<[___]>Lisbon</p>`,
        answers: ['br'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Close the elements in the right order. Fill in the tag name for each end tag.",
        code: `<p>This is <strong>very <em>important</[___]></[___]>.</p>`,
        answers: ['em', 'strong'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which line is nested correctly?',
        options: [
          '`<p><em>Hello</em></p>`',
          '`<p><em>Hello</p></em>`',
          '`<em><p>Hello</em></p>`',
        ],
        answer: '`<p><em>Hello</em></p>`',
      },
    },
  ],
};
