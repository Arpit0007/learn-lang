import { Lesson } from '../../shared/content';

export const MATH_FUNCTIONS: Lesson = {
  slug: 'math-functions',
  title: 'CSS Math Functions',
  nav: 'calc, min, max & clamp',
  blocks: [
    {
      kind: 'text',
      text: "Sometimes the size you want is not one fixed number. You may want \"the full width, minus a little space\", or \"big text on big screens, but never too small\". CSS has four **math functions** for this: `calc()`, `min()`, `max()` and `clamp()`.",
    },
    {
      kind: 'text',
      text: "A **function** in CSS is a name followed by round brackets `( )`, with values inside. You already know some, like `rgb()` and `repeat()`. You can use the math functions in any property that takes a length, such as `width`, `padding` or `font-size`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'calc(): math with different units',
    },
    {
      kind: 'text',
      text: "`calc()` does a calculation, and the result becomes the value. Its big strength is that it can **mix units**. `width: calc(100% - 4rem)` means: the full width of the parent, minus `4rem`. You cannot work this out yourself, because `100%` is different on every screen. `calc()` lets the browser do the math, on every screen.",
    },
    {
      kind: 'table',
      head: ['Sign', 'Meaning', 'Example'],
      rows: [
        ['`+`', 'Add', '`calc(2rem + 10px)`'],
        ['`-`', 'Subtract (take away)', '`calc(100% - 4rem)`'],
        ['`*`', 'Multiply', '`calc(6rem * 2)`'],
        ['`/`', 'Divide', '`calc(100% / 3)`'],
      ],
    },
    {
      kind: 'text',
      text: "To multiply or divide, use a plain number with no unit, like the `2` in `calc(6rem * 2)` or the `3` in `calc(100% / 3)`.",
    },
    {
      kind: 'example',
      label: 'calc.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * {
    box-sizing: border-box;
  }
  body {
    font-family: system-ui, sans-serif;
  }
  .parent {
    padding: 0.5rem;
    background-color: #e2e8f0;
  }
  .bar {
    margin: 0.5rem 0;
    padding: 0.5rem;
    background-color: #0369a1;
    color: white;
  }
  .minus  { width: calc(100% - 4rem); }
  .plus   { width: calc(50% + 3rem); }
  .divide { width: calc(100% / 3); }
  .times  { width: calc(6rem * 2); }
</style>
</head>
<body>
  <div class="parent">
    <div class="bar minus">100% - 4rem</div>
    <div class="bar plus">50% + 3rem</div>
    <div class="bar divide">100% / 3</div>
    <div class="bar times">6rem * 2</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The gray box is the parent. Open the example with **Try it Yourself**, then press **Phone**, **Tablet** and **Full** above the result. The first bar always stops exactly `4rem` before the right edge of the gray box. The last bar is always `12rem` wide.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Put spaces around + and -',
      blocks: [
        {
          kind: 'text',
          text: "`calc(100%-4rem)` does not work, and `calc(100% -4rem)` does not work either. The browser reads `-4rem` as a negative number, not as \"minus 4rem\". Always put a space on both sides of `+` and `-`: `calc(100% - 4rem)`. Around `*` and `/`, spaces are not needed, but they make the code easier to read.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'min() and max()',
    },
    {
      kind: 'text',
      text: "`min()` takes two or more values, separated by commas, and uses the **smallest** one. `max()` uses the **largest** one. The browser checks again every time the size of the screen changes.",
    },
    {
      kind: 'text',
      text: "So `width: min(100%, 28rem)` means: `28rem` wide, but never wider than the parent. On a phone, `100%` is the smaller value, so the box fills the screen. On a big screen, `28rem` is smaller, so the box stops growing. In the same way, `width: max(50%, 15rem)` means: half of the parent, but never narrower than `15rem`.",
    },
    {
      kind: 'example',
      label: 'min-max.html',
      code: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * {
    box-sizing: border-box;
  }
  body {
    font-family: system-ui, sans-serif;
  }
  .box {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 8px;
  }
  .with-min {
    width: min(100%, 28rem);
    background-color: #bbf7d0;
  }
  .with-max {
    width: max(50%, 15rem);
    background-color: #fef08a;
  }
</style>
</head>
<body>
  <div class="box with-min">min(100%, 28rem): never wider than 28rem</div>
  <div class="box with-max">max(50%, 15rem): never narrower than 15rem</div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Press **Phone**. The green box fills the whole width, because `100%` is now less than `28rem`. The yellow box is `15rem` wide, because half of a phone screen is less than `15rem`. Then press **Full** and compare.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "`min()` sets an upper limit: `min(100%, 28rem)` is never **more** than `28rem`. `max()` sets a lower limit: `max(50%, 15rem)` is never **less** than `15rem`. The names can feel backwards at first.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'clamp(): a size between two limits',
    },
    {
      kind: 'text',
      text: "`clamp()` takes three values, in this order: a **minimum**, a **preferred** value (the one it would like to use) and a **maximum**. The browser uses the preferred value, but keeps it between the two limits. This is perfect for **fluid** sizes: sizes that grow and shrink smoothly with the screen, without any media queries.",
    },
    {
      kind: 'example',
      label: 'clamp.html',
      code: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * {
    box-sizing: border-box;
  }
  body {
    font-family: system-ui, sans-serif;
  }
  .fluid {
    /* minimum, preferred, maximum */
    font-size: clamp(1.5rem, 6vw, 3rem);
    color: #7c3aed;
  }
  .fixed {
    font-size: 2rem;
    color: #64748b;
  }
  .box {
    width: clamp(15rem, 60%, 30rem);
    padding: 1rem;
    border-radius: 8px;
    background-color: #ede9fe;
  }
</style>
</head>
<body>
  <h1 class="fluid">Fluid heading</h1>
  <p class="fixed">Fixed text: always 2rem</p>
  <div class="box">60% wide, but never less than 15rem and never more than 30rem</div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Press **Phone**, **Tablet** and **Full**. The purple heading grows and shrinks with the preview, but it is never smaller than `1.5rem` or bigger than `3rem`. The gray text always stays the same size. The box below works the same way, with a width.",
    },
    {
      kind: 'table',
      head: ['Preview width', '`6vw` is', 'The heading gets'],
      rows: [
        ['375px (Phone)', '22.5px', '24px: the minimum, `1.5rem`'],
        ['600px (Tablet)', '36px', '36px: the preferred value'],
        ['1000px', '60px', '48px: the maximum, `3rem`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Keep text easy to zoom',
      blocks: [
        {
          kind: 'text',
          text: "A size in `vw` follows only the screen width. It does not grow when someone zooms in or chooses a bigger font in their browser. So mix in some `rem`. Inside `clamp()`, `min()` and `max()`, you can do math without writing `calc()`: `font-size: clamp(1.5rem, 1rem + 4vw, 3rem);`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the search box as wide as its parent, minus `6rem` for the button next to it. Fill in the function name.',
        code: `.search {
  width: [___](100% - 6rem);
}`,
        answers: ['calc'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'The heading should grow with the screen, but never be smaller than `2rem` or bigger than `4rem`. Fill in the function name and the minimum size.',
        code: `h1 {
  font-size: [___]([___], 5vw, 4rem);
}`,
        answers: ['clamp', '2rem'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A box has `width: min(100%, 40rem)`. Its parent is `30rem` wide. How wide is the box?',
        options: ['`30rem`', '`40rem`', '`70rem`', '`10rem`'],
        answer: '`30rem`',
      },
    },
  ],
};
