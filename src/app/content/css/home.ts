import { Lesson } from '../../shared/content';

export const HOME: Lesson = {
  slug: 'home',
  title: 'CSS Home',
  nav: 'Home',
  blocks: [
    {
      kind: 'text',
      style: 'lede',
      text: "CSS stands for **Cascading Style Sheets**. It is the language that controls how a web page *looks*: its colors, fonts, spacing and layout.",
    },
    {
      kind: 'text',
      text: "HTML gives a page its content, such as headings, paragraphs and links. CSS gives that content its style. You write HTML first, then use CSS to make it look the way you want.",
    },
    {
      kind: 'example',
      label: 'first-css.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background-color: #f0f7ff;
    font-family: system-ui, sans-serif;
  }
  h1 {
    color: #1a5fb4;
  }
  p {
    color: #333333;
    font-size: 1.25rem;
  }
</style>
</head>
<body>
  <h1>Hello, CSS!</h1>
  <p>A few lines of CSS changed the background, the colors and the text size.</p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How this course works',
    },
    {
      kind: 'text',
      text: "Each lesson is short. It explains one topic, shows examples, and ends with a few exercises.",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "Read the explanation and look at the example code.",
        "Click **Try it Yourself »** on an example. The code opens in a full-screen editor with a live preview.",
        "Change the code, then press **Run** to see the result.",
        "Finish the exercises at the end of the lesson. When all of them are correct, the lesson gets a ✓ in the menu.",
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Learn by changing things',
      blocks: [
        {
          kind: 'text',
          text: "Do not only read the examples. Change a color, a number or a word, press **Run**, and see what happens. You cannot break anything, and **Reset** brings the original code back.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'What you will learn',
    },
    {
      kind: 'table',
      head: ['Lesson', 'What it teaches'],
      rows: [
        ['Introduction', 'Three ways to add CSS to a page'],
        ['Syntax', 'How a CSS rule is written'],
        ['Selectors', 'How to choose which elements to style'],
        ['Colors', 'Named colors, hex, `rgb()` and `hsl()`'],
        ['Backgrounds', 'Background colors, gradients and patterns'],
        ['Text and fonts', 'Font families, sizes and text styling'],
        ['Cascade and specificity', 'Which rule wins, and which styles are inherited'],
        ['Units', '`px`, `%`, `em`, `rem`, `vw` and `vh`'],
        ['Box model', 'Padding, borders, margins and `box-sizing`'],
        ['Borders and shadows', 'Border styles, rounded corners and shadows'],
        ['Display', 'Block, inline and hidden elements'],
        ['Position', 'Moving, pinning and stacking elements'],
        ['Flexbox', 'Placing elements in a row or a column'],
        ['Grid', 'Placing elements in rows and columns together'],
        ['Centering', 'Centering text and boxes in both directions'],
        ['Responsive design', 'Layouts that fit phones and big screens'],
        ['Math functions', '`calc()`, `min()`, `max()` and `clamp()`'],
        ['Overflow and images', '`overflow`, `object-fit`, opacity and filters'],
        ['Hover and transitions', 'Styling states and smooth changes'],
        ['Links, lists and tables', 'Link states, menus and zebra stripes'],
        ['Pseudo-elements', '`::before`, `::after` and styling parts of text'],
        ['Transforms', 'Moving, turning, scaling and slanting elements'],
        ['Animations', 'Movement with `@keyframes`'],
        ['Variables', 'Custom properties and light and dark themes'],
        ['Modern CSS', 'Nesting, `:has()` and container queries'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'What you need',
    },
    {
      kind: 'text',
      text: "You only need to know basic HTML tags, like `<h1>`, `<p>` and `<div>`. You do not need to install anything. Everything runs here in your browser.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What does CSS control?',
        options: [
          'How a web page looks',
          'Which data a web page saves',
          'How fast the internet is',
          'The text content of a web page',
        ],
        answer: 'How a web page looks',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What does CSS stand for?',
        options: [
          'Cascading Style Sheets',
          'Computer Style System',
          'Creative Site Settings',
          'Colorful Style Syntax',
        ],
        answer: 'Cascading Style Sheets',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'In the example above, one property made the heading blue. Fill in its name.',
        code: `h1 {
  [___]: #1a5fb4;
}`,
        answers: ['color'],
      },
    },
  ],
};
