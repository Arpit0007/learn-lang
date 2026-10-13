import { Lesson } from '../../shared/content';

export const HOVER_TRANSITIONS: Lesson = {
  slug: 'hover-transitions',
  title: 'CSS Hover and Transitions',
  nav: 'Hover & transitions',
  blocks: [
    {
      kind: 'text',
      text: "Good pages react when you use them. A button changes color when the mouse is over it. A field gets a clear border when you click into it. In this lesson you will style these **states**, and make the change smooth with a **transition**.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Pseudo-classes',
    },
    {
      kind: 'text',
      text: "A **pseudo-class** is a word after a colon that you add to a selector. It selects an element only when it is in a certain state. For example, `a:hover` selects a link only while the mouse is over it. There is no space before the colon.",
    },
    {
      kind: 'table',
      head: ['Pseudo-class', 'Selects the element when...'],
      rows: [
        ['`:hover`', 'the mouse pointer is over it'],
        ['`:focus`', 'it has keyboard focus, for example after you press **Tab** or click into a field'],
        ['`:active`', 'it is being pressed (the mouse button is down)'],
        ['`:first-child`', 'it is the first child of its parent'],
      ],
    },
    {
      kind: 'example',
      label: 'pseudo-classes.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  a, button, input {
    font-size: 1rem;
  }
  a:hover {
    color: #dc2626;
  }
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background-color: #2563eb;
    color: white;
  }
  button:hover {
    background-color: #1d4ed8;
  }
  button:active {
    background-color: #1e3a8a;
  }
  a:focus, button:focus, input:focus {
    outline: 3px solid #f59e0b;
    outline-offset: 2px;
  }
  li:first-child {
    font-weight: 700;
  }
</style>
</head>
<body>
  <p><a href="#">Hover over this link</a></p>
  <p><button>Hover and press me</button></p>
  <p><input placeholder="Click here or press Tab"></p>
  <ul>
    <li>First item: bold, because of :first-child</li>
    <li>Second item</li>
    <li>Third item</li>
  </ul>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Click inside the preview, then press **Tab** a few times. The orange outline shows which element has focus.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Do not hide the focus outline',
      blocks: [
        {
          kind: 'text',
          text: "Many people use the keyboard instead of a mouse. The focus outline shows them where they are on the page. Never write `outline: none` unless you add another clear `:focus` style. A good habit: when you style `:hover`, style `:focus` too.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Transitions',
    },
    {
      kind: 'text',
      text: "Without a transition, a change happens at once. A **transition** makes the change happen slowly, over a short time. The `transition` property takes three values: **which property** to animate, **how long** it takes, and the **timing function**.",
    },
    {
      kind: 'text',
      text: "So `transition: background-color 0.3s ease;` means: when `background-color` changes, change it smoothly over `0.3s` (0.3 seconds). The **timing function** sets the speed during the change. `linear` keeps the same speed. `ease` (the default) starts slow, goes fast, and ends slow. `ease-in` starts slow. `ease-out` ends slow.",
    },
    {
      kind: 'example',
      label: 'transition.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .track {
    padding: 1rem;
    background-color: #f1f5f9;
  }
  .bar {
    width: 6rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background-color: #7c3aed;
    color: white;
    transition: width 1.5s ease, background-color 1.5s ease;
  }
  .linear   { transition-timing-function: linear; }
  .ease-in  { transition-timing-function: ease-in; }
  .ease-out { transition-timing-function: ease-out; }
  .track:hover .bar {
    width: 90%;
    background-color: #db2777;
  }
  @media (prefers-reduced-motion: reduce) {
    .bar {
      transition: none;
    }
  }
</style>
</head>
<body>
  <p>Move the mouse over the gray box.</p>
  <div class="track">
    <div class="bar">ease</div>
    <div class="bar linear">linear</div>
    <div class="bar ease-in">ease-in</div>
    <div class="bar ease-out">ease-out</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "All four bars arrive at the same time, but they move at different speeds on the way. The example sets the timing function on its own with `transition-timing-function`. Notice that `transition` is on `.bar`, not on the `:hover` rule. This way the bars also move smoothly back when the mouse leaves.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Respect reduced motion',
      blocks: [
        {
          kind: 'text',
          text: "Movement on screen can make some people feel dizzy or sick. They can turn on a \"reduce motion\" setting on their phone or computer. The media query `prefers-reduced-motion: reduce` is true when this setting is on. Use it to turn transitions off, like the example above does.",
        },
        {
          kind: 'example',
          label: 'reduced-motion.css',
          lang: 'css',
          run: 'none',
          code: `@media (prefers-reduced-motion: reduce) {
  * {
    transition: none;
  }
}`,
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the button darker while the mouse is over it. Fill in the pseudo-class name.',
        code: `.button:[___] {
  background-color: navy;
}`,
        answers: ['hover'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the background color change smoothly over half a second. Fill in the property.',
        code: `.button {
  [___]: background-color 0.5s ease;
}`,
        answers: ['transition'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A keyboard user presses **Tab** to reach a button. Which pseudo-class styles the button now?',
        options: ['`:focus`', '`:hover`', '`:active`', '`:first-child`'],
        answer: '`:focus`',
      },
    },
  ],
};
