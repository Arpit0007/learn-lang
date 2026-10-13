import { Lesson } from '../../shared/content';

export const BLOCK_INLINE: Lesson = {
  slug: 'block-inline',
  title: 'HTML Block and Inline Elements',
  nav: 'Block & inline',
  blocks: [
    {
      kind: 'text',
      text: "Every HTML element is shown in one of two main ways. A **block** element is like a brick in a wall: it sits on its own line. An **inline** element is like a word in a sentence: it sits inside a line of text, next to other words.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Block elements',
    },
    {
      kind: 'text',
      text: "A block element always starts on a new line. It also stretches as wide as it can, from the left side of the page to the right. Headings, paragraphs and lists are all block elements.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Inline elements',
    },
    {
      kind: 'text',
      text: "An inline element does **not** start a new line. It is only as wide as its content. Links, bold text and images are all inline elements.",
    },
    {
      kind: 'text',
      text: "In this example, the block elements have a teal border and the inline elements have a yellow background. Open it and look at how wide each box is:",
    },
    {
      kind: 'example',
      label: 'block-inline.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Block and inline</title>
</head>
<body>
  <h1 style="border: 2px solid teal;">A heading is a block</h1>
  <p style="border: 2px solid teal;">This paragraph is a block. Inside it, the words
    <strong style="background-color: yellow;">strong</strong> and
    <a href="https://example.com" style="background-color: yellow;">this link</a>
    are inline. They stay in the line of text.</p>
  <p style="border: 2px solid teal;">Each paragraph starts on a new line.</p>
</body>
</html>`,
    },
    {
      kind: 'table',
      head: ['Block elements', 'Inline elements'],
      rows: [
        ['`<h1>` to `<h6>`', '`<a>`'],
        ['`<p>`', '`<strong>` and `<em>`'],
        ['`<ul>`, `<ol>` and `<li>`', '`<img>`'],
        ['`<table>`', '`<br>`'],
        ['`<form>`', '`<input>` and `<label>`'],
        ['`<div>`', '`<span>`'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The div element',
    },
    {
      kind: 'text',
      text: "The `<div>` element is a block. *div* is short for *division*, which means a part. A `<div>` is an empty box: it has no meaning and no look of its own. You use it to **group** other elements together, so you can give the whole group a style.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The span element',
    },
    {
      kind: 'text',
      text: "The `<span>` element is the inline version of `<div>`. It wraps a few words inside a line of text, so you can give just those words a style or an attribute. On its own, it changes nothing.",
    },
    {
      kind: 'example',
      label: 'div-span.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Div and span</title>
</head>
<body>
  <div style="border: 2px solid purple; padding: 8px;">
    <h2>Monday</h2>
    <p>Swimming lesson at <span style="color: red;">2 pm</span>.</p>
  </div>
  <div style="border: 2px solid purple; padding: 8px;">
    <h2>Tuesday</h2>
    <p>Piano lesson at <span style="color: red;">4 pm</span>.</p>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Each `<div>` groups one day: a heading and a paragraph. Each `<span>` picks out the time inside a sentence, without starting a new line.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'When to use them',
    },
    {
      kind: 'text',
      text: "First, look for an element that *means* what you want. A paragraph should be a `<p>`. Important words should be in `<strong>`. Use `<div>` or `<span>` only when no other element fits, most often because you want to add a style. In the next lesson you will meet elements such as `<header>` and `<nav>`, which are often better than a plain `<div>`.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not put a block element inside a `<p>`. If you write `<p>Hello <div>there</div></p>`, the browser ends the paragraph early, just before the `<div>`, and your page does not look the way you planned. Inline elements such as `<span>` are fine inside a paragraph.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make the word *red* red, without starting a new line. Fill in the inline element name in the start tag and the end tag.",
        code: `<p>I like the <[___] style="color: red;">red</[___]> apple.</p>`,
        answers: ['span', 'span'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Group the heading and the paragraph in one box. Fill in the block element name in the start tag and the end tag.",
        code: `<[___] style="border: 1px solid gray;">
  <h2>Contact</h2>
  <p>Call us any day.</p>
</[___]>`,
        answers: ['div', 'div'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which of these is an inline element?',
        options: ['`<a>`', '`<p>`', '`<h2>`', '`<div>`'],
        answer: '`<a>`',
      },
    },
  ],
};
