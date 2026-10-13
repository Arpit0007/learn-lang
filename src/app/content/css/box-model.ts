import { Lesson } from '../../shared/content';

export const BOX_MODEL: Lesson = {
  slug: 'box-model',
  title: 'CSS Box Model',
  nav: 'Box model',
  blocks: [
    {
      kind: 'text',
      text: "To the browser, every element is a rectangle, a **box**. Even a single word in a `<span>` is a box. The **box model** describes the four layers of that box, from the inside out.",
    },
    {
      kind: 'table',
      head: ['Layer', 'Property', 'What it is'],
      rows: [
        ['Content', '`width`, `height`', 'The text or image itself'],
        ['Padding', '`padding`', 'Space **inside** the box, between the content and the border'],
        ['Border', '`border`', 'A line around the padding'],
        ['Margin', '`margin`', 'Space **outside** the box, between it and other elements'],
      ],
    },
    {
      kind: 'example',
      label: 'box.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  .box {
    width: 200px;
    padding: 20px;
    border: 5px solid #1a5fb4;
    margin: 30px;
    background-color: #dbeafe;
  }
</style>
</head>
<body>
  <div class="box">The light blue area is the content plus the padding.</div>
  <div class="box">The margin keeps the two boxes apart.</div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The background color fills the content **and** the padding. The margin is always transparent.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Padding, border and margin',
    },
    {
      kind: 'text',
      text: "`padding` and `margin` can take one to four values. The four-value order goes clockwise, starting at the top: top, right, bottom, left. You can also set one side only, with properties such as `padding-top` or `margin-left`.",
    },
    {
      kind: 'table',
      head: ['You write', 'What it means'],
      rows: [
        ['`padding: 10px;`', 'All four sides get 10px'],
        ['`padding: 10px 20px;`', 'Top and bottom 10px, left and right 20px'],
        ['`padding: 10px 20px 30px 40px;`', 'Top 10px, right 20px, bottom 30px, left 40px'],
      ],
    },
    {
      kind: 'text',
      text: "`border` takes three values in one line: the width, the style and the color, for example `border: 2px solid gray;`. Common styles are `solid`, `dashed` and `dotted`. Add `border-radius` to round the corners.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How wide is a box? box-sizing',
    },
    {
      kind: 'text',
      text: "Here is a surprise. By default, `width` sets the width of the **content only**. The padding and the border are added on top. So a box with `width: 200px`, `padding: 20px` and a `5px` border is really 200 + 20 + 20 + 5 + 5 = **250px** wide on screen. This default is called `box-sizing: content-box`.",
    },
    {
      kind: 'text',
      text: "With `box-sizing: border-box`, `width` sets the width of the whole box, including padding and border. The box is exactly as wide as you said, and the content area gets smaller to make room. This is much easier to work with.",
    },
    {
      kind: 'example',
      label: 'box-sizing.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  div {
    width: 200px;
    padding: 20px;
    border: 5px solid #333333;
    margin-bottom: 1rem;
    background-color: #fde68a;
  }
  .content-box {
    box-sizing: content-box;
  }
  .border-box {
    box-sizing: border-box;
  }
</style>
</head>
<body>
  <div class="content-box">content-box: 200 + 40 + 10 = 250px wide</div>
  <div class="border-box">border-box: exactly 200px wide</div>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "Start every style sheet with this rule. It uses the universal selector `*`, so every element on the page uses `border-box`. Most modern websites do this.",
        },
        {
          kind: 'example',
          label: 'reset.css',
          lang: 'css',
          run: 'none',
          code: `* {
  box-sizing: border-box;
}`,
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "When one box sits above another, their top and bottom margins do not add up. They overlap, and only the larger margin is used. A box with `margin-bottom: 30px` above a box with `margin-top: 20px` gives a gap of 30px, not 50px. This is called **margin collapsing**.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make every element include its padding and border in its width.',
        code: `* {
  [___]: border-box;
}`,
        answers: ['box-sizing'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'With the default `box-sizing: content-box`, a box has `width: 100px`, `padding: 10px` and `border: 2px solid black`. How wide is it on screen?',
        options: ['`124px`', '`100px`', '`112px`', '`120px`'],
        answer: '`124px`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which layer is the space **outside** the border?',
        options: ['Margin', 'Padding', 'Content', 'Outline'],
        answer: 'Margin',
      },
    },
  ],
};
