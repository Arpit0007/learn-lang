import { Lesson } from '../../shared/content';

export const BORDERS_SHADOWS: Lesson = {
  slug: 'borders-shadows',
  title: 'CSS Borders, Shadows and Rounded Corners',
  nav: 'Borders & shadows',
  blocks: [
    {
      kind: 'text',
      text: "Borders, rounded corners and shadows give boxes their shape and depth. A **border** is a line around a box. **Rounded corners** make a box look soft and friendly. A **shadow** makes a box look as if it floats above the page.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The border shorthand',
    },
    {
      kind: 'text',
      text: "You met `border` in the Box Model lesson. It is a **shorthand**: one property that sets several properties at once. `border: 3px dashed teal;` sets the width (`border-width`), the style (`border-style`) and the color (`border-color`). You can write the three values in any order.",
    },
    {
      kind: 'table',
      head: ['Style', 'What it looks like'],
      rows: [
        ['`solid`', 'One plain line'],
        ['`dashed`', 'Short lines with gaps between them'],
        ['`dotted`', 'A row of dots'],
        ['`double`', 'Two thin lines. It needs a width of at least `3px`'],
        ['`none`', 'No border at all. This is the default'],
      ],
    },
    {
      kind: 'text',
      text: "You can also give a border to one side only, with `border-top`, `border-right`, `border-bottom` or `border-left`. They take the same three values. A thick line on the left is a popular way to mark a note. A line at the bottom can underline a heading.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Rounded corners',
    },
    {
      kind: 'text',
      text: "`border-radius` rounds the corners of a box. A small value, such as `8px`, gives soft corners. It works even when the box has no border: then the corners of the background are rounded.",
    },
    {
      kind: 'table',
      head: ['You write', 'What you get'],
      rows: [
        ['`border-radius: 8px;`', 'Softly rounded corners'],
        ['`border-radius: 999px;`', 'A **pill**: a long box with fully round ends'],
        ['`border-radius: 50%;`', 'A **circle**, if the box is a square'],
        ['`border-radius: 1rem 1rem 1rem 0;`', 'A value for each corner: top left, top right, bottom right, bottom left'],
      ],
    },
    {
      kind: 'example',
      label: 'borders.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .box {
    width: 14rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
  }
  .solid  { border: 3px solid #2563eb; }
  .dashed { border: 3px dashed #16a34a; }
  .dotted { border: 3px dotted #dc2626; }
  .double { border: 6px double #7c3aed; }
  .note {
    border-left: 6px solid #f59e0b;
    background-color: #fef3c7;
  }
  .bubble {
    border-radius: 1rem 1rem 1rem 0;
    background-color: #dbeafe;
  }
  .pill {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 999px;
    background-color: #16a34a;
    color: white;
    font-size: 1rem;
  }
  .avatar {
    width: 6rem;
    height: 6rem;
    border: 4px solid #f0a23c;
    border-radius: 50%;
  }
</style>
</head>
<body>
  <div class="box solid">solid</div>
  <div class="box dashed">dashed</div>
  <div class="box dotted">dotted</div>
  <div class="box double">double</div>
  <div class="box note">border-left only</div>
  <div class="box bubble">A speech bubble: one corner is not rounded</div>
  <p><button class="pill">A pill button</button></p>
  <img class="avatar" src="/assets/img/html-cat.svg" alt="A cartoon cat in a round frame">
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
          text: "`border: 3px red;` shows no border at all. The style is missing, and the default style is `none`. Always include a style, such as `solid`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Shadows',
    },
    {
      kind: 'text',
      text: "`box-shadow` draws a shadow behind a box. It takes up to four lengths and a color, for example `box-shadow: 4px 6px 10px 0 gray;`. The first two lengths are **offsets**: how far the shadow moves away from the box.",
    },
    {
      kind: 'table',
      head: ['Value', 'Example', 'What it does'],
      rows: [
        ['x offset', '`4px`', 'Moves the shadow to the right. A negative value moves it to the left'],
        ['y offset', '`6px`', 'Moves the shadow down. A negative value moves it up'],
        ['blur', '`10px`', 'Makes the edge of the shadow soft. `0` gives a sharp edge'],
        ['spread', '`0`', 'Makes the shadow bigger on every side. You can leave it out'],
        ['color', '`gray`', 'The color of the shadow'],
      ],
    },
    {
      kind: 'text',
      text: "Add the word `inset` at the start, and the shadow is drawn inside the box. The box then looks pressed in.",
    },
    {
      kind: 'text',
      text: "`text-shadow` gives a shadow to the letters of a text. It takes an x offset, a y offset, a blur and a color, such as `text-shadow: 2px 2px 0 orange;`. It has no spread and no `inset`.",
    },
    {
      kind: 'example',
      label: 'shadows.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    padding: 1rem;
    font-family: system-ui, sans-serif;
    background-color: #f1f5f9;
  }
  h1 {
    color: #1e293b;
    text-shadow: 2px 2px 0 #f59e0b;
  }
  .card {
    width: 14rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: white;
  }
  .soft  { box-shadow: 0 4px 12px rgb(0 0 0 / 20%); }
  .hard  { box-shadow: 6px 6px 0 #1e293b; }
  .glow  { box-shadow: 0 0 0 4px #93c5fd; }
  .inset { box-shadow: inset 0 2px 8px rgb(0 0 0 / 30%); }
</style>
</head>
<body>
  <h1>A heading with a text shadow</h1>
  <div class="card soft">0 4px 12px: a soft shadow, a little lower than the box</div>
  <div class="card hard">6px 6px 0: no blur, so the edge is sharp</div>
  <div class="card glow">0 0 0 4px: only spread, like a second border</div>
  <div class="card inset">inset: the box looks pressed in</div>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Tip',
      blocks: [
        {
          kind: 'text',
          text: "Real shadows are soft and not very dark. A see-through black, such as `rgb(0 0 0 / 20%)`, with some blur looks natural on any background color.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Outline and border',
    },
    {
      kind: 'text',
      text: "An **outline** is a line drawn just outside the border. You write it like a border: `outline: 3px solid orange;`. The big difference is that an outline **takes up no space**. It never makes the box bigger, and it never moves the elements around it. `outline-offset` adds a gap between the box and its outline.",
    },
    {
      kind: 'table',
      head: ['', '`border`', '`outline`'],
      rows: [
        ['Takes up space', 'Yes: the box gets bigger', 'No: nothing moves'],
        ['One side only', 'Yes, for example `border-left`', 'No, always all four sides'],
        ['Common use', 'Decoration', 'Showing which element has keyboard focus'],
      ],
    },
    {
      kind: 'text',
      text: "In the next example, the `:hover` rules work while the mouse pointer is over a button. You will learn more about `:hover` in the Hover and Transitions lesson.",
    },
    {
      kind: 'example',
      label: 'outline.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  button {
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    border: 2px solid #1e293b;
    background-color: white;
    font-size: 1rem;
  }
  .with-border button:hover {
    border: 8px solid #dc2626;
  }
  .with-outline button:hover {
    outline: 8px solid #dc2626;
  }
</style>
</head>
<body>
  <p>Move the mouse over the buttons in each row.</p>
  <p>Border: the button grows, and the buttons after it move.</p>
  <div class="with-border">
    <button>One</button> <button>Two</button> <button>Three</button>
  </div>
  <p>Outline: nothing moves.</p>
  <div class="with-outline">
    <button>One</button> <button>Two</button> <button>Three</button>
  </div>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Keep the focus outline',
      blocks: [
        {
          kind: 'text',
          text: "Browsers draw an outline around the element that has keyboard focus. It shows keyboard users where they are on the page. Do not remove it with `outline: none`, unless you add another clear focus style.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the square profile picture round. Fill in the property.',
        code: `.avatar {
  width: 6rem;
  height: 6rem;
  [___]: 50%;
}`,
        answers: ['border-radius'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In `box-shadow: 0 8px 16px gray;`, what does `16px` set?',
        options: ['The blur', 'How far the shadow moves to the right', 'How far the shadow moves down', 'The spread'],
        answer: 'The blur',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: '`border: 3px red;` shows no border. Why?',
        options: [
          'The style is missing, for example `solid`',
          'The width must be the last value',
          '`3px` is too thin to see',
          'Borders only work with hex colors',
        ],
        answer: 'The style is missing, for example `solid`',
      },
    },
  ],
};
