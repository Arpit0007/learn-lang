import { Lesson } from '../../shared/content';

export const TRANSFORMS: Lesson = {
  slug: 'transforms',
  title: 'CSS Transforms',
  nav: 'Transforms',
  blocks: [
    {
      kind: 'text',
      text: "The `transform` property changes how an element is drawn on the screen. It can **move** an element, **turn** it, make it **bigger or smaller**, or **slant** it. Transforms are often used for hover effects and animations.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Transform functions',
    },
    {
      kind: 'text',
      text: "The value of `transform` is a **transform function**: a name with values in round brackets, such as `rotate(45deg)`. Each function makes one kind of change. Angles use the unit `deg` (degrees). A full turn is `360deg`, so `90deg` is a quarter turn.",
    },
    {
      kind: 'table',
      head: ['Function', 'What it does', 'Example'],
      rows: [
        ['`translate(x, y)`', 'Moves the element `x` to the right and `y` down. Negative values move it left or up', '`translate(20px, -10px)`'],
        ['`rotate(angle)`', 'Turns the element clockwise. A negative angle turns it the other way', '`rotate(45deg)`'],
        ['`scale(n)`', 'Makes the element bigger or smaller. `1` is the normal size, `2` is double and `0.5` is half', '`scale(1.5)`'],
        ['`skew(angle)`', 'Slants the element sideways. Positive and negative angles slant opposite ways', '`skew(20deg)`'],
      ],
    },
    {
      kind: 'example',
      label: 'transforms.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    padding: 1.5rem;
  }
  .spot {
    width: 6rem;
    height: 6rem;
    border: 2px dashed #64748b;
  }
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: rgb(37 99 235 / 80%);
    color: white;
  }
  .move  { transform: translate(20px, 10px); }
  .turn  { transform: rotate(30deg); }
  .grow  { transform: scale(1.3); }
  .slant { transform: skew(20deg); }
</style>
</head>
<body>
  <p>The dashed lines show where each box would be without its transform.</p>
  <div class="row">
    <div class="spot"><div class="box move">translate</div></div>
    <div class="spot"><div class="box turn">rotate</div></div>
    <div class="spot"><div class="box grow">scale</div></div>
    <div class="spot"><div class="box slant">skew</div></div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Try other values, such as `rotate(-45deg)`, `scale(0.5)` or `translate(0, -20px)`, and press **Run**.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Other elements do not move',
      blocks: [
        {
          kind: 'text',
          text: "A transform only changes how an element is **drawn**. In the layout, the element keeps its old place and its old size, shown by the dashed lines. So the elements around it do not move out of the way, and a moved or scaled element can cover its neighbors.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'transform-origin',
    },
    {
      kind: 'text',
      text: "Every transform happens around a point called the **origin**. By default, it is the center of the element, so `rotate()` turns the element around its middle, like a wheel. The `transform-origin` property moves this point, for example to `top left`. Then the element turns around that corner, the way the hand of a clock turns around one end.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Combining transforms',
    },
    {
      kind: 'text',
      text: "To use several functions, write them in one `transform`, separated by spaces: `transform: translate(6rem, 0) rotate(45deg);`. The browser applies them **from left to right**, and the order matters. A `rotate()` also turns the directions, so a `translate()` that comes after it moves the element in the turned direction.",
    },
    {
      kind: 'example',
      label: 'origin-and-order.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding-left: 2rem;
  }
  .demo {
    width: 13rem;
    height: 8rem;
  }
  .demo p {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
  }
  .spot {
    width: 4rem;
    height: 4rem;
    border: 2px dashed #64748b;
  }
  .box {
    height: 100%;
    background-color: rgb(13 148 136 / 80%);
  }
  .center    { transform: rotate(30deg); }
  .corner    { transform: rotate(30deg); transform-origin: top left; }
  .move-turn { transform: translate(6rem, 0) rotate(45deg); }
  .turn-move { transform: rotate(45deg) translate(6rem, 0); }
</style>
</head>
<body>
  <h3>Same rotate, different origin</h3>
  <div class="row">
    <div class="demo">
      <p>origin: center (the default)</p>
      <div class="spot"><div class="box center"></div></div>
    </div>
    <div class="demo">
      <p>origin: top left</p>
      <div class="spot"><div class="box corner"></div></div>
    </div>
  </div>
  <h3>Same functions, different order</h3>
  <div class="row">
    <div class="demo">
      <p>translate(6rem, 0) rotate(45deg)</p>
      <div class="spot"><div class="box move-turn"></div></div>
    </div>
    <div class="demo">
      <p>rotate(45deg) translate(6rem, 0)</p>
      <div class="spot"><div class="box turn-move"></div></div>
    </div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "In the second row, both boxes use the same two functions. The first box moves to the right, then turns. The second box turns first, so its move goes down at an angle.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'One transform at a time',
      blocks: [
        {
          kind: 'text',
          text: "If two rules set `transform` on the same element, the later one replaces the first one. They do not add up. So if a box has `transform: rotate(10deg)` and its `:hover` rule has `transform: scale(1.2)`, the box stops being turned when you hover over it. Write both functions in the hover rule: `transform: rotate(10deg) scale(1.2);`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'A card that lifts on hover',
    },
    {
      kind: 'text',
      text: "Transforms and **transitions** work very well together. In the next example, a card moves up `8px` when the mouse is over it, and its shadow grows. `box-shadow` draws a soft shadow under a box. The `transition` makes both changes smooth.",
    },
    {
      kind: 'example',
      label: 'lift-card.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
    background-color: #f1f5f9;
  }
  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }
  .card {
    width: 10rem;
    padding: 1rem;
    border-radius: 12px;
    background-color: white;
    color: #1e293b;
    text-decoration: none;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card:hover,
  .card:focus {
    transform: translate(0, -8px);
    box-shadow: 0 12px 24px rgb(0 0 0 / 20%);
  }
  .card h2 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
  }
  .card p {
    margin: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }
  }
</style>
</head>
<body>
  <div class="cards">
    <a class="card" href="#">
      <h2>Tea</h2>
      <p>Green, black or mint.</p>
    </a>
    <a class="card" href="#">
      <h2>Coffee</h2>
      <p>Strong and fresh.</p>
    </a>
    <a class="card" href="#">
      <h2>Juice</h2>
      <p>Orange or mango.</p>
    </a>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Move the mouse over a card, or press **Tab** to reach it with the keyboard. The card lifts, but the cards next to it stay still, because a transform does not move other elements.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'When the mouse is over the card, move it up by `8px`. Fill in the property and the function.',
        code: `.card:hover {
  [___]: [___](0, -8px);
}`,
        answers: ['transform', 'translate'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the box turn around its top-left corner instead of its center. Fill in the property.',
        code: `.box {
  transform: rotate(30deg);
  [___]: top left;
}`,
        answers: ['transform-origin'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A box gets `transform: scale(2)`. What happens to the elements around it?',
        options: [
          'They stay where they are, and the bigger box may cover them',
          'They move away to make room for the bigger box',
          'They also become twice as big',
          'They disappear',
        ],
        answer: 'They stay where they are, and the bigger box may cover them',
      },
    },
  ],
};
