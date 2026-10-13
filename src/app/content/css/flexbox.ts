import { Lesson } from '../../shared/content';

export const FLEXBOX: Lesson = {
  slug: 'flexbox',
  title: 'CSS Flexbox',
  nav: 'Flexbox',
  blocks: [
    {
      kind: 'text',
      text: "**Flexbox** is the easiest way to place elements in a row or in a column. Use it for menus, toolbars, card lists and centering.",
    },
    {
      kind: 'text',
      text: "Flexbox always has two parts. The **flex container** is the parent element. You give it `display: flex`. The **flex items** are its direct children. They are placed automatically, side by side.",
    },
    {
      kind: 'example',
      label: 'flex-row.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  .row {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: #e0f2fe;
  }
  .item {
    padding: 1rem;
    background-color: #0369a1;
    color: white;
  }
</style>
</head>
<body>
  <div class="row">
    <div class="item">One</div>
    <div class="item">Two</div>
    <div class="item">Three</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The three `<div>` elements are blocks, so normally each would start on a new line. Inside a flex container they sit in a row. `gap` puts space between the items, but not around the outside.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Put `display: flex` on the **parent**, not on the items you want to line up. Also, only the direct children become flex items. Grandchildren are not affected.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Direction and the two axes',
    },
    {
      kind: 'text',
      text: "`flex-direction` sets the direction of the items. `row` (the default) places them from left to right. `column` places them from top to bottom. The direction the items flow in is the **main axis**. The other direction is the **cross axis**. So in a row, the main axis is horizontal and the cross axis is vertical.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Lining items up',
    },
    {
      kind: 'text',
      text: "`justify-content` places items along the main axis. `align-items` places them along the cross axis. In a row, that means `justify-content` is left and right, and `align-items` is up and down.",
    },
    {
      kind: 'table',
      head: ['Property (on the container)', 'Common values'],
      rows: [
        ['`flex-direction`', '`row`, `column`'],
        ['`justify-content`', '`flex-start`, `center`, `flex-end`, `space-between`'],
        ['`align-items`', '`stretch` (default), `flex-start`, `center`, `flex-end`'],
        ['`gap`', '`1rem`, `10px`'],
        ['`flex-wrap`', '`nowrap` (default), `wrap`'],
      ],
    },
    {
      kind: 'example',
      label: 'flex-align.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #1e293b;
    color: white;
  }
  nav { display: flex; gap: 1rem; }
  nav a { color: #93c5fd; }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10rem;
    background-color: #f1f5f9;
  }
</style>
</head>
<body>
  <header>
    <strong>CafeLog</strong>
    <nav><a href="#">Menu</a> <a href="#">Hours</a> <a href="#">Contact</a></nav>
  </header>
  <div class="center">
    <p>I am in the middle.</p>
  </div>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Centering made easy',
      blocks: [
        {
          kind: 'text',
          text: "To put something in the exact middle of a box, give the box `display: flex`, `justify-content: center` and `align-items: center`. These three lines are worth remembering.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Growing and wrapping',
    },
    {
      kind: 'text',
      text: "By default, flex items stay on one line, even when they run out of room. `flex-wrap: wrap` lets them move to a new line instead. On an item, the `flex` property controls its size. `flex: 1 1 10rem` means: start at `10rem` wide, **grow** to share any extra space, and **shrink** if needed. Try making the preview narrower and wider.",
    },
    {
      kind: 'example',
      label: 'flex-cards.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * {
    box-sizing: border-box;
  }
  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .card {
    flex: 1 1 10rem;
    padding: 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background-color: #f8fafc;
  }
</style>
</head>
<body>
  <div class="cards">
    <div class="card">Soup</div>
    <div class="card">Salad</div>
    <div class="card">Pasta</div>
    <div class="card">Cake</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Turn `.toolbar` into a flex container, and push its first item to the left edge and its last item to the right edge. Fill in the two properties.',
        code: `.toolbar {
  [___]: flex;
  [___]: space-between;
}`,
        answers: ['display', 'justify-content'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Stack the items from top to bottom instead of left to right.',
        code: `.stack {
  display: flex;
  flex-direction: [___];
}`,
        answers: ['column'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In a flex container with `flex-direction: row`, which property centers the items **vertically**?',
        options: ['`align-items`', '`justify-content`', '`flex-wrap`', '`gap`'],
        answer: '`align-items`',
      },
    },
  ],
};
