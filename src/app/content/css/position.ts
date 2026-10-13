import { Lesson } from '../../shared/content';

export const POSITION: Lesson = {
  slug: 'position',
  title: 'CSS Position',
  nav: 'Position',
  blocks: [
    {
      kind: 'text',
      text: "Normally, the browser places elements one after another, from top to bottom. This is called the **normal flow** of the page. The `position` property lets you move an element away from its normal place, pin it to a corner, or keep it on screen while the page scrolls.",
    },
    {
      kind: 'table',
      head: ['Value', 'What it does'],
      rows: [
        ['`static`', 'The default. The element stays in the normal flow'],
        ['`relative`', 'Moves the element from its normal place. Its old space stays empty'],
        ['`absolute`', 'Takes the element out of the flow and places it inside the nearest positioned parent'],
        ['`fixed`', 'Places the element against the viewport. It stays there when the page scrolls'],
        ['`sticky`', 'Normal at first, then sticks in place when you scroll to it'],
      ],
    },
    {
      kind: 'text',
      text: "You move a positioned element with the **offset** properties `top`, `right`, `bottom` and `left`. For example, `top: 10px` means 10px down from the top edge. These properties do nothing on a `static` element.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Relative and absolute',
    },
    {
      kind: 'text',
      text: "`position: absolute` places an element against its **nearest positioned parent**. A positioned element is any element whose `position` is not `static`. So the usual pattern is: give the parent `position: relative`, and give the child `position: absolute`. The child is now placed inside the parent.",
    },
    {
      kind: 'example',
      label: 'badge.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .card {
    position: relative;
    width: 14rem;
    padding: 2rem 1rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background-color: #f8fafc;
  }
  .badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: #dc2626;
    color: white;
    font-size: 0.8rem;
  }
  .moved {
    position: relative;
    left: 2rem;
    background-color: #fde68a;
  }
</style>
</head>
<body>
  <div class="card">
    <span class="badge">NEW</span>
    Fresh lemon cake, baked today.
  </div>
  <p>A normal paragraph.</p>
  <p class="moved">This paragraph moved 2rem to the right.</p>
  <p>A normal paragraph.</p>
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
          text: "You give the badge `position: absolute`, but it jumps to the corner of the whole page. This happens when no parent is positioned, so the browser uses the page instead. Add `position: relative` to the parent (here, `.card`), and the badge goes back inside it.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Fixed and sticky',
    },
    {
      kind: 'text',
      text: "A `fixed` element stays in the same place on the screen, even when you scroll. It is often used for chat buttons or \"back to top\" links. A `sticky` element scrolls with the page until it reaches its offset, such as `top: 0`. Then it sticks there. It is often used for headers. Scroll the preview to see both.",
    },
    {
      kind: 'example',
      label: 'sticky-fixed.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
  .intro {
    padding: 1rem;
  }
  .sticky {
    position: sticky;
    top: 0;
    padding: 1rem;
    background-color: #1e293b;
    color: white;
  }
  .long {
    height: 150vh;
    padding: 1rem;
    background-image: linear-gradient(to bottom, #e0f2fe, #0369a1);
  }
  .fixed {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    background-color: #dc2626;
    color: white;
  }
</style>
</head>
<body id="top">
  <p class="intro">Scroll down. The dark bar will stick to the top.</p>
  <div class="sticky">I am sticky</div>
  <div class="long">A long section, so the page can scroll.</div>
  <a class="fixed" href="#top">Back to top</a>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'z-index and stacking',
    },
    {
      kind: 'text',
      text: "Positioned elements can **overlap**. Then one of them must be on top. The `z-index` property decides this. It takes a whole number. The element with the higher number is drawn on top. Without `z-index`, the element that comes later in the HTML is on top.",
    },
    {
      kind: 'example',
      label: 'z-index.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  .stage {
    position: relative;
    height: 10rem;
  }
  .box {
    position: absolute;
    width: 6rem;
    height: 6rem;
    padding: 0.5rem;
    color: white;
    font-family: system-ui, sans-serif;
  }
  .red   { top: 0;    left: 0;    background-color: #dc2626; z-index: 3; }
  .green { top: 2rem; left: 2rem; background-color: #16a34a; z-index: 2; }
  .blue  { top: 4rem; left: 4rem; background-color: #2563eb; z-index: 1; }
</style>
</head>
<body>
  <div class="stage">
    <div class="box red">z-index: 3</div>
    <div class="box green">z-index: 2</div>
    <div class="box blue">z-index: 1</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "`z-index` only works on positioned elements (and on flex and grid items). If `z-index` does nothing, check that the element has a `position` other than `static`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Place the close button in the top right corner of `.popup`. Fill in the two `position` values.',
        code: `.popup {
  position: [___];
}
.popup .close {
  position: [___];
  top: 0;
  right: 0;
}`,
        answers: ['relative', 'absolute'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which value keeps an element in the same place on the screen, even when the page scrolls?',
        options: ['`fixed`', '`static`', '`relative`', '`absolute`'],
        answer: '`fixed`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Two positioned boxes overlap. Box A has `z-index: 5` and box B has `z-index: 10`. Which box is on top?',
        options: ['Box B', 'Box A', 'The one that comes first in the HTML', 'Neither, they mix together'],
        answer: 'Box B',
      },
    },
  ],
};
