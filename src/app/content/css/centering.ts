import { Lesson } from '../../shared/content';

export const CENTERING: Lesson = {
  slug: 'centering',
  title: 'CSS Centering',
  nav: 'Centering',
  blocks: [
    {
      kind: 'text',
      text: "Putting something in the middle is one of the most common jobs in CSS. But there is no single property that centers everything. The right method depends on two questions. **What** do you want to center: text, or a whole box? And in **which direction**: only **horizontally** (between left and right), or also **vertically** (between top and bottom)?",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Centering text: text-align',
    },
    {
      kind: 'text',
      text: "`text-align: center` centers the lines of text inside a block. It also centers other inline content, such as links, images and buttons. Put it on the block that holds the content, for example on an `<h1>` or a `<div>`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Centering a box: margin: 0 auto',
    },
    {
      kind: 'text',
      text: "To center a block element itself, give it a `width`, then `margin: 0 auto`. This means: no margin at the top and bottom, and `auto` margins on the left and right. The two `auto` margins share the free space equally, so the box sits in the middle. `margin: 1rem auto` works too, with `1rem` of space above and below.",
    },
    {
      kind: 'text',
      text: "The box needs a `width` (or a `max-width`) that is smaller than its parent. Without one, a block element is as wide as its parent, so there is no free space to share.",
    },
    {
      kind: 'example',
      label: 'center-horizontal.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  h1 {
    text-align: center;
  }
  .box {
    width: 16rem;
    margin: 1rem auto;
    padding: 1rem;
    border-radius: 8px;
    background-color: #dbeafe;
  }
  .both {
    text-align: center;
  }
</style>
</head>
<body>
  <h1>A centered heading</h1>
  <div class="box">margin: 1rem auto centers this box. The text inside it is still on the left.</div>
  <div class="box both">
    <p>This box also has text-align: center, so its content is centered too.</p>
    <button>A button</button>
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
          text: "`text-align: center` does not move a box. It only centers the content inside the box. And `margin: 0 auto` moves the box, but not the text inside it. To center both, use both, like the second box in the example.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Both directions with Flexbox',
    },
    {
      kind: 'text',
      text: "To center something horizontally **and** vertically, you can use Flexbox. Give the **parent** `display: flex`, `justify-content: center` and `align-items: center`. Its children then sit in the exact middle of it.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Both directions with Grid',
    },
    {
      kind: 'text',
      text: "Grid can do the same job with less code. Give the parent `display: grid` and `place-items: center`. `place-items` is a shorthand: it sets `align-items` (up and down) and `justify-items` (left and right) at the same time.",
    },
    {
      kind: 'example',
      label: 'center-both.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .flex-parent {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 9rem;
    margin-bottom: 1rem;
    background-color: #dcfce7;
  }
  .grid-parent {
    display: grid;
    place-items: center;
    height: 9rem;
    background-color: #fef3c7;
  }
  .badge {
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    background-color: #1e293b;
    color: white;
  }
</style>
</head>
<body>
  <div class="flex-parent">
    <div class="badge">Centered with Flexbox</div>
  </div>
  <div class="grid-parent">
    <div class="badge">Centered with Grid</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Vertical centering needs space',
      blocks: [
        {
          kind: 'text',
          text: "A box is normally only as tall as its content. Then there is no free space above or below the content, so there is nothing to center in. Give the parent a `height` or a `min-height`. To center something on the whole screen, use `min-height: 100vh`, as in the next example.",
        },
      ],
    },
    {
      kind: 'example',
      label: 'center-page.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    display: grid;
    place-items: center;
    min-height: 100vh;
    margin: 0;
    font-family: system-ui, sans-serif;
    background-color: #e0e7ff;
  }
  .welcome {
    width: 16rem;
    padding: 1.5rem;
    border-radius: 12px;
    background-color: white;
    text-align: center;
  }
</style>
</head>
<body>
  <div class="welcome">
    <h2>Welcome back!</h2>
    <p>This box is in the middle of the screen, in both directions.</p>
  </div>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Which method when?',
    },
    {
      kind: 'table',
      head: ['You want to center...', 'Use'],
      rows: [
        ['Text, links or images inside a block', '`text-align: center` on the block'],
        ['A box with a width, only between left and right', '`margin: 0 auto` on the box'],
        ['One or more items, in both directions', 'Flexbox on the parent: `display: flex`, `justify-content: center` and `align-items: center`'],
        ['One item, in both directions, with the least code', 'Grid on the parent: `display: grid` and `place-items: center`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "`vertical-align: middle` sounds like the answer for vertical centering, but it does not center a box inside its parent. It lines up inline content, such as an image in a line of text. It also works in table cells.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Center the `.page` box between the left and right edges of the screen. Fill in the missing value.',
        code: `.page {
  width: 40rem;
  margin: 0 [___];
}`,
        answers: ['auto'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Center the content of `.hero` in both directions with Grid. Fill in the property.',
        code: `.hero {
  display: grid;
  [___]: center;
  min-height: 20rem;
}`,
        answers: ['place-items'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A `<div>` has `margin: 0 auto`, but it is not centered. It fills the whole line. What is missing?',
        options: ['A `width`', 'A `height`', '`align-items: center`', '`text-align: center`'],
        answer: 'A `width`',
      },
    },
  ],
};
