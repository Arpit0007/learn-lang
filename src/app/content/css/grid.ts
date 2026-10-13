import { Lesson } from '../../shared/content';

export const GRID: Lesson = {
  slug: 'grid',
  title: 'CSS Grid',
  nav: 'Grid',
  blocks: [
    {
      kind: 'text',
      text: "**CSS Grid** places elements in **rows and columns** at the same time, like the cells of a table. Use it for photo galleries, card lists and whole page layouts.",
    },
    {
      kind: 'text',
      text: "Like Flexbox, Grid has two parts. The **grid container** is the parent. You give it `display: grid`. The **grid items** are its direct children. Then you tell the container how many columns it has with `grid-template-columns`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Columns, fr and repeat()',
    },
    {
      kind: 'text',
      text: "`grid-template-columns` takes one size for each column. `grid-template-columns: 200px 200px` makes two columns, each `200px` wide. The items fill the columns from left to right. When a row is full, the next item starts a new row.",
    },
    {
      kind: 'text',
      text: "The `fr` unit means a **fraction** (a share) of the free space. `1fr 1fr 1fr` makes three equal columns. `2fr 1fr` makes the first column twice as wide as the second. Writing the same size many times is boring, so `repeat()` does it for you: `repeat(3, 1fr)` is the same as `1fr 1fr 1fr`.",
    },
    {
      kind: 'text',
      text: "`gap` sets the space between rows and columns, just like in Flexbox.",
    },
    {
      kind: 'example',
      label: 'grid-cards.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .item {
    padding: 1.5rem;
    border-radius: 8px;
    background-color: #7c3aed;
    color: white;
    text-align: center;
  }
</style>
</head>
<body>
  <div class="grid">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Try changing `repeat(3, 1fr)` to `repeat(2, 1fr)` or to `2fr 1fr 1fr`, and press **Run**.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Placing items',
    },
    {
      kind: 'text',
      text: "Between and around the columns are **grid lines**. They are numbered from 1, starting at the left edge. A grid with 3 columns has 4 lines. `grid-column: 1 / 3` means: start at line 1 and end at line 3. So the item covers 2 columns. `grid-row` does the same for rows. You can also write `grid-column: span 2`, which means \"cover 2 columns\".",
    },
    {
      kind: 'example',
      label: 'grid-layout.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .page {
    display: grid;
    grid-template-columns: 10rem 1fr;
    gap: 0.5rem;
  }
  .cell {
    padding: 1rem;
    color: white;
  }
  .top    { grid-column: 1 / 3; background-color: #1e293b; }
  .menu   { grid-row: 2 / 4;    background-color: #0369a1; }
  .main   { background-color: #16a34a; }
  .extra  { background-color: #ca8a04; }
  .bottom { grid-column: 1 / 3; background-color: #1e293b; }
</style>
</head>
<body>
  <div class="page">
    <div class="cell top">Header: covers both columns</div>
    <div class="cell menu">Menu: covers 2 rows</div>
    <div class="cell main">Main content</div>
    <div class="cell extra">More content</div>
    <div class="cell bottom">Footer: covers both columns</div>
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
          text: "The numbers in `grid-column` are **lines**, not columns. To cover all 3 columns of a 3-column grid, write `grid-column: 1 / 4`, not `1 / 3`. If counting lines is hard, use `span`: `grid-column: span 3`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Grid or Flexbox?',
    },
    {
      kind: 'text',
      text: "Flexbox is **one-dimensional**: it lines items up in one direction, a row **or** a column. Grid is **two-dimensional**: it controls rows **and** columns together. Both are useful, and many pages use both.",
    },
    {
      kind: 'table',
      head: ['Use', 'When'],
      rows: [
        ['Flexbox', 'Items in one line: a menu, a toolbar, buttons side by side, centering one thing'],
        ['Grid', 'Items in rows and columns: a gallery, a card grid, the layout of a whole page'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "One direction? Use Flexbox. Rows and columns that must line up? Use Grid.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make `.gallery` a grid with 4 equal columns. Fill in the display value and the function name.',
        code: `.gallery {
  display: [___];
  grid-template-columns: [___](4, 1fr);
}`,
        answers: ['grid', 'repeat'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A grid has `grid-template-columns: 1fr 1fr 1fr`. An item has `grid-column: 1 / 4`. How many columns does it cover?',
        options: ['3', '4', '1', '2'],
        answer: '3',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You want a photo gallery where the photos line up in both rows and columns. Which is the best fit?',
        options: ['Grid', 'Flexbox', '`position: absolute`', '`display: inline`'],
        answer: 'Grid',
      },
    },
  ],
};
