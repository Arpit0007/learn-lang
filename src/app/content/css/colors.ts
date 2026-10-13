import { Lesson } from '../../shared/content';

export const COLORS: Lesson = {
  slug: 'colors',
  title: 'CSS Colors',
  nav: 'Colors',
  blocks: [
    {
      kind: 'text',
      text: "Two properties use colors more than any others. `color` sets the color of the **text**. `background-color` sets the color **behind** the element.",
    },
    {
      kind: 'text',
      text: "CSS gives you several ways to write the same color. All of them work in every modern browser. Pick the one that is easiest for you.",
    },
    {
      kind: 'table',
      head: ['Format', 'Example', 'How it works'],
      rows: [
        ['Named color', '`tomato`', 'One of about 140 English color names'],
        ['Hex', '`#ff6347`', 'Red, green and blue as two-digit hex numbers'],
        ['RGB', '`rgb(255 99 71)`', 'Red, green and blue from `0` to `255`'],
        ['HSL', '`hsl(9 100% 64%)`', 'Hue, saturation and lightness'],
      ],
    },
    {
      kind: 'example',
      label: 'colors.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  p {
    color: white;
    padding: 0.5rem; /* space inside the box: see the Box Model lesson */
  }
  .named { background-color: tomato; }
  .hex   { background-color: #ff6347; }
  .rgb   { background-color: rgb(255 99 71); }
  .hsl   { background-color: hsl(9 100% 64%); }
</style>
</head>
<body>
  <p class="named">tomato</p>
  <p class="hex">#ff6347</p>
  <p class="rgb">rgb(255 99 71)</p>
  <p class="hsl">hsl(9 100% 64%)</p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Hex colors',
    },
    {
      kind: 'text',
      text: "A hex color starts with `#` and has six characters: two for red, two for green, two for blue. Each pair goes from `00` (none) to `ff` (full). So `#ff0000` is pure red, `#000000` is black, and `#ffffff` is white. If each pair has two equal characters, you can write it short: `#ff0000` becomes `#f00`.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not forget the `#`. `color: ff6347;` is not a valid value, so the browser ignores it and the text keeps its old color.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'rgb() and hsl()',
    },
    {
      kind: 'text',
      text: "`rgb()` takes three numbers from `0` to `255` for red, green and blue. `hsl()` describes a color the way people think about it. **Hue** is the position on a color wheel, from `0` to `360` (0 is red, 120 is green, 240 is blue). **Saturation** is how strong the color is, from `0%` (gray) to `100%`. **Lightness** goes from `0%` (black) to `100%` (white).",
    },
    {
      kind: 'text',
      text: "To make a color see-through, add a slash and an **alpha** value: `rgb(255 0 0 / 30%)` is red at 30% strength. `0%` is invisible and `100%` is solid. You may also see older code with commas, like `rgb(255, 99, 71)`. It works too.",
    },
    {
      kind: 'example',
      label: 'hsl-shades.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  p {
    padding: 0.5rem;
  }
  .dark   { background-color: hsl(210 80% 30%); color: white; }
  .middle { background-color: hsl(210 80% 50%); color: white; }
  .light  { background-color: hsl(210 80% 75%); }
  .pale   { background-color: hsl(210 80% 92%); }
  .glass  { background-color: rgb(255 0 0 / 30%); }
</style>
</head>
<body>
  <p class="dark">hsl(210 80% 30%)</p>
  <p class="middle">hsl(210 80% 50%)</p>
  <p class="light">hsl(210 80% 75%)</p>
  <p class="pale">hsl(210 80% 92%)</p>
  <p class="glass">rgb(255 0 0 / 30%): see-through red</p>
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
          text: "HSL makes it easy to build a set of matching shades. Keep the hue and saturation the same, and change only the lightness. That is how the four blue boxes above were made.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the heading text navy and the page background light yellow. Fill in the two property names.',
        code: `h1 {
  [___]: navy;
}
body {
  [___]: lightyellow;
}`,
        answers: ['color', ['background-color', 'background']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which value is the same color as `#ffffff`?',
        options: ['`white`', '`black`', '`rgb(0 0 0)`', '`hsl(0 0% 0%)`'],
        answer: '`white`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In `hsl(120 100% 50%)`, what does `50%` control?',
        options: [
          'The lightness',
          'The hue',
          'The saturation',
          'The transparency',
        ],
        answer: 'The lightness',
      },
    },
  ],
};
