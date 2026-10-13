import { Lesson } from '../../shared/content';

export const UNITS: Lesson = {
  slug: 'units',
  title: 'CSS Units',
  nav: 'Units',
  blocks: [
    {
      kind: 'text',
      text: "Many CSS properties take a **length**, such as `width`, `padding` or `font-size`. A length is a number followed by a **unit**, like `20px` or `1.5rem`. The unit tells the browser what the number means. Do not put a space between the number and the unit.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Absolute and relative units',
    },
    {
      kind: 'text',
      text: "An **absolute** unit is always the same size. The main one is `px` (pixels). `10px` is always `10px`, wherever you use it.",
    },
    {
      kind: 'text',
      text: "A **relative** unit depends on something else: the size of the parent, the size of the font, or the size of the browser window. Relative units help a page fit many different screens.",
    },
    {
      kind: 'table',
      head: ['Unit', 'Type', 'What it is relative to'],
      rows: [
        ['`px`', 'Absolute', 'Nothing. A fixed size on screen'],
        ['`%`', 'Relative', 'The parent element. `width: 50%` is half the width of the parent'],
        ['`em`', 'Relative', 'The font size of the element. `2em` is twice that size'],
        ['`rem`', 'Relative', 'The font size of the whole page (the root), usually `16px`'],
        ['`vw`', 'Relative', 'The width of the viewport. `1vw` is 1% of it'],
        ['`vh`', 'Relative', 'The height of the viewport. `1vh` is 1% of it'],
      ],
    },
    {
      kind: 'text',
      text: "The **viewport** is the part of the browser window that shows the page. In the Try-it editor, it is the preview area.",
    },
    {
      kind: 'example',
      label: 'units.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .bar {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background-color: #0369a1;
    color: white;
  }
  .px  { width: 200px; }
  .pct { width: 50%; }
  .vw  { width: 30vw; }
  .rem { width: 15rem; }
</style>
</head>
<body>
  <div class="bar px">200px: always the same</div>
  <div class="bar pct">50%: half of the parent</div>
  <div class="bar vw">30vw: 30% of the viewport</div>
  <div class="bar rem">15rem: 15 times the page font size</div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Make the browser window narrower and wider, and watch the bars. The `px` and `rem` bars keep their size. The `%` and `vw` bars change with the window.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'em and rem',
    },
    {
      kind: 'text',
      text: "`em` and `rem` are both based on font size. `rem` always uses the font size of the page, so `1rem` is the same everywhere. `em` uses the font size of the element itself. For the `font-size` property, `em` uses the font size of the **parent**.",
    },
    {
      kind: 'example',
      label: 'em-rem.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .em  { font-size: 1.2em; }
  .rem { font-size: 1.2rem; }
  div {
    margin-left: 1rem;
  }
</style>
</head>
<body>
  <div class="em">1.2em
    <div class="em">1.2em inside 1.2em
      <div class="em">1.2em inside 1.2em inside 1.2em</div>
    </div>
  </div>
  <hr>
  <div class="rem">1.2rem
    <div class="rem">1.2rem inside 1.2rem
      <div class="rem">1.2rem inside 1.2rem inside 1.2rem</div>
    </div>
  </div>
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
          text: "`em` adds up when elements are inside each other. In the example, each `1.2em` box is 1.2 times bigger than its parent, so the text keeps growing. `rem` does not add up, because it always looks at the page font size. This is why `rem` is safer for text.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Which unit should I use?',
    },
    {
      kind: 'table',
      head: ['For', 'Good choice', 'Why'],
      rows: [
        ['Font sizes', '`rem`', 'Grows when people choose a bigger font in their browser'],
        ['Widths of boxes', '`%` or `vw`', 'Fits the screen or the parent'],
        ['Spacing (padding, margin, gap)', '`rem` or `em`', 'Stays in proportion to the text'],
        ['Thin borders', '`px`', 'A `1px` line should stay thin'],
        ['A full-screen section', '`100vh`', 'Exactly as tall as the viewport'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "A simple rule: `rem` for text, `%` or `vw` for widths, and `px` for borders. When the value is `0`, you do not need a unit. `margin: 0;` is fine.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the heading 2 times the font size of the page. Fill in the unit.',
        code: `h1 {
  font-size: 2[___];
}`,
        answers: ['rem'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A parent box is `400px` wide. Its child has `width: 50%`. How wide is the child?',
        options: ['`200px`', '`50px`', '`400px`', '`450px`'],
        answer: '`200px`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which unit is **absolute**?',
        options: ['`px`', '`%`', '`rem`', '`vw`'],
        answer: '`px`',
      },
    },
  ],
};
