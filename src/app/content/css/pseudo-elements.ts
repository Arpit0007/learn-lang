import { Lesson } from '../../shared/content';

export const PSEUDO_ELEMENTS: Lesson = {
  slug: 'pseudo-elements',
  title: 'CSS Pseudo-elements',
  nav: 'Pseudo-elements',
  blocks: [
    {
      kind: 'text',
      text: "A **pseudo-element** lets you style one *part* of an element, such as its first letter. It can also add a small extra piece to an element, such as an icon. You do not need to change the HTML. The word *pseudo* means \"not real\": these parts are not in your HTML, but you can style them like real elements.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'One colon or two?',
    },
    {
      kind: 'text',
      text: "In the Hover and Transitions lesson, you used **pseudo-classes** like `:hover`. A pseudo-class has **one** colon. It selects a whole element when it is in a certain state. A pseudo-element has **two** colons, like `::first-letter`. It selects a **part** of an element, or adds a new part.",
    },
    {
      kind: 'table',
      head: ['Kind', 'Colons', 'What it selects', 'Examples'],
      rows: [
        ['Pseudo-class', 'One', 'A whole element, when it is in a certain state', '`:hover`, `:focus`, `:first-child`'],
        ['Pseudo-element', 'Two', 'A part of an element, or a new part', '`::before`, `::after`, `::first-letter`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "Old CSS used one colon for a few pseudo-elements, like `:before`. Browsers still accept one colon for `::before`, `::after`, `::first-letter` and `::first-line`, so you may see it in older code. In new code, always write two colons.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: '::before and ::after',
    },
    {
      kind: 'text',
      text: "`::before` adds a new piece at the **start** of an element, inside it. `::after` adds one at the **end**. The `content` property says what to add. Write the text in quotes, like `content: \"Note: \";`.",
    },
    {
      kind: 'example',
      label: 'before-after.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  h2::after {
    content: "";
    display: block;
    width: 4rem;
    height: 4px;
    margin-top: 0.25rem;
    background-color: #db2777;
  }
  .done::before {
    content: "✓ ";
    color: #16a34a;
    font-weight: 700;
  }
  .todo::before {
    content: "○ ";
    color: #94a3b8;
  }
  .note::before {
    content: "Note: ";
    color: #b45309;
    font-weight: 700;
  }
</style>
</head>
<body>
  <h2>My week</h2>
  <p class="done">Buy fresh bread</p>
  <p class="done">Call grandma</p>
  <p class="todo">Fix the bike</p>
  <p class="note">The market is closed on Sunday.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Look at the HTML: it has no ✓, no circle and no word \"Note\". CSS added all of them. The pink line under the heading is an `::after` with empty `content`. Like a `<span>`, `::before` and `::after` are **inline** by default. Give them `display: block` or `display: inline-block` when you need a `width` and a `height`.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Do not forget content',
      blocks: [
        {
          kind: 'text',
          text: "Without the `content` property, `::before` and `::after` do not appear at all, not even their background color. When you only want a shape, like the pink line, write empty quotes: `content: \"\";`.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'For decoration only',
      blocks: [
        {
          kind: 'text',
          text: "People cannot select or copy text that `content` adds, and screen readers may or may not read it out loud. So use it for small decorations, like icons and lines. Important words belong in the HTML.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Parts of text, lists and forms',
    },
    {
      kind: 'table',
      head: ['Pseudo-element', 'What it selects'],
      rows: [
        ['`::first-letter`', 'The first letter of a block of text, such as a paragraph'],
        ['`::first-line`', 'The first line of a block of text. Which words are on it depends on the width of the screen'],
        ['`::selection`', 'The text that the user has selected (highlighted) with the mouse or a finger'],
        ['`::marker`', 'The bullet or number of a list item. Only a few properties work here, such as `color` and `font-size`'],
        ['`::placeholder`', 'The hint text inside an empty form field'],
      ],
    },
    {
      kind: 'example',
      label: 'text-parts.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Georgia, serif;
    line-height: 1.6;
  }
  .story::first-letter {
    font-size: 3rem;
    line-height: 1;
    font-weight: 700;
    color: #b91c1c;
  }
  .story::first-line {
    color: #1d4ed8;
  }
  ::selection {
    background-color: #fde047;
    color: black;
  }
  li::marker {
    color: #db2777;
    font-size: 1.25rem;
  }
  input {
    padding: 0.5rem;
    font-size: 1rem;
  }
  input::placeholder {
    color: #7c3aed;
    font-style: italic;
  }
</style>
</head>
<body>
  <p class="story">Once upon a time, in a small town by the sea, there lived a baker. Her bread was the best in the whole country, and every morning people came from far away to buy it.</p>
  <ol>
    <li>Mix the flour and the water</li>
    <li>Let the dough rest</li>
    <li>Bake for 40 minutes</li>
  </ol>
  <label>Your name: <input placeholder="For example, Amina"></label>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Open the example with **Try it Yourself**. Select some text with the mouse to see `::selection`. Then press **Phone** above the result. The blue first line gets shorter, because fewer words fit on one line.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Add the text `"Tip: "` at the start of every element with `class="tip"`. Fill in the pseudo-element and the property.',
        code: `.tip::[___] {
  [___]: "Tip: ";
}`,
        answers: ['before', 'content'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which of these is a **pseudo-element**?',
        options: ['`::first-letter`', '`:first-child`', '`:hover`', '`:focus`'],
        answer: '`::first-letter`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'The rule `.box::after { display: block; width: 2rem; height: 2rem; background-color: red; }` shows nothing on the page. Which line is missing?',
        options: ['`content: "";`', '`color: red;`', '`position: static;`', '`font-size: 2rem;`'],
        answer: '`content: "";`',
      },
    },
  ],
};
