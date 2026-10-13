import { Lesson } from '../../shared/content';

export const BACKGROUNDS: Lesson = {
  slug: 'backgrounds',
  title: 'CSS Backgrounds',
  nav: 'Backgrounds',
  blocks: [
    {
      kind: 'text',
      text: "Every element has a background. It sits behind the text and fills the whole box of the element. You already know `background-color`. In this lesson you will also paint backgrounds with **gradients**, and control how a background repeats, how big it is and where it sits.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Gradients',
    },
    {
      kind: 'text',
      text: "A **gradient** is a smooth change from one color to another. CSS draws it for you, so you need no image file. `linear-gradient()` changes color along a straight line. You can give it a direction, such as `to right` or `to bottom`. `radial-gradient()` changes color outward from the center, like a circle of light.",
    },
    {
      kind: 'text',
      text: "To CSS, a gradient is an **image**, not a color. So you set it with the `background-image` property.",
    },
    {
      kind: 'example',
      label: 'gradients.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .box {
    height: 5rem;
    margin-bottom: 1rem;
    color: white;
    font-size: 1.25rem;
  }
  .sunset { background-image: linear-gradient(to right, #ff7e5f, #feb47b); }
  .sky    { background-image: linear-gradient(to bottom, #2b5876, #4e4376); }
  .glow   { background-image: radial-gradient(circle, #ffd86f, #fc6262); }
</style>
</head>
<body>
  <div class="box sunset">linear, to right</div>
  <div class="box sky">linear, to bottom</div>
  <div class="box glow">radial</div>
</body>
</html>`,
    },
    {
      kind: 'text',
      style: 'small',
      text: "Notice `class=\"box sunset\"`. An element can have more than one class. Separate the names with a space, and the element gets the styles of both classes.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "`background-color: linear-gradient(...)` does nothing, because a gradient is not a color. Use `background-image`, or the short `background` property, which accepts colors and images.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Size, repeat and position',
    },
    {
      kind: 'text',
      text: "By default, a gradient fills the whole element. If you make it smaller with `background-size`, the browser **repeats** it like tiles on a floor until the element is full. `background-repeat: no-repeat` shows it only once. `background-position` decides where it sits, for example `center` or `top right`.",
    },
    {
      kind: 'example',
      label: 'pattern.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  .dots {
    height: 10rem;
    background-color: #fdf6e3;
    background-image: radial-gradient(circle, #d33682 25%, transparent 26%);
    background-size: 2rem 2rem;
  }
  .one-dot {
    height: 10rem;
    margin-top: 1rem;
    background-color: #e8f4fd;
    background-image: radial-gradient(circle, #268bd2 25%, transparent 26%);
    background-size: 6rem 6rem;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
</head>
<body>
  <div class="dots"></div>
  <div class="one-dot"></div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The first box uses a small tile of 2rem by 2rem, so the dot repeats across the whole box. The second box uses a bigger tile, shows it once and puts it in the center. Try changing `center` to `top left`.",
    },
    {
      kind: 'table',
      head: ['Property', 'What it does', 'Example values'],
      rows: [
        ['`background-color`', 'The color behind the element', '`#fdf6e3`, `white`'],
        ['`background-image`', 'An image or gradient on top of the color', '`linear-gradient(...)`'],
        ['`background-size`', 'How big the image is', '`cover`, `contain`, `2rem 2rem`'],
        ['`background-repeat`', 'Whether the image repeats', '`repeat`, `no-repeat`, `repeat-x`'],
        ['`background-position`', 'Where the image sits', '`center`, `top right`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "The image is painted **on top of** the background color. When you use a photo as a background on a real site, also set a `background-color` that is close to it. Then the text stays readable while the photo loads, or if it fails to load.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Give the `.hero` element a gradient from gold to orange. Fill in the property.',
        code: `.hero {
  [___]: linear-gradient(to right, gold, orange);
}`,
        answers: [['background-image', 'background']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'The dot should appear only once, not as a repeating pattern. Fill in the value.',
        code: `.tile {
  background-image: radial-gradient(circle, red 25%, transparent 26%);
  background-size: 3rem 3rem;
  background-repeat: [___];
}`,
        answers: ['no-repeat'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which value of `background-size` makes the image cover the whole element, even if some edges are cut off?',
        options: ['`cover`', '`contain`', '`no-repeat`', '`center`'],
        answer: '`cover`',
      },
    },
  ],
};
