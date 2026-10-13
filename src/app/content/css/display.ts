import { Lesson } from '../../shared/content';

export const DISPLAY: Lesson = {
  slug: 'display',
  title: 'CSS Display',
  nav: 'Display',
  blocks: [
    {
      kind: 'text',
      text: "The `display` property decides how a box behaves on the page: does it start a new line, or does it sit next to other things? Every element has a default `display` value, and you can change it with CSS.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Block and inline',
    },
    {
      kind: 'text',
      text: "A **block** element always starts on a new line and stretches across the full width that is free. `<div>`, `<p>`, `<h1>` and `<ul>` are block elements.",
    },
    {
      kind: 'text',
      text: "An **inline** element sits inside a line of text, next to other content. It is only as wide as its content. `<span>`, `<a>`, `<strong>` and `<em>` are inline elements. The browser ignores `width` and `height` on inline elements.",
    },
    {
      kind: 'text',
      text: "`inline-block` is a mix of both. The element sits in the line like inline, but it accepts `width` and `height` like a block. It is useful for buttons and small badges.",
    },
    {
      kind: 'example',
      label: 'display.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  div, span {
    background-color: #fde68a;
    border: 1px solid #b45309;
  }
  .as-block {
    display: block;
  }
  .as-inline-block {
    display: inline-block;
    width: 8rem;
    padding: 0.5rem;
  }
</style>
</head>
<body>
  <div>A div is block: it fills the whole line.</div>
  <p>Two <span>span</span> and <span>span</span> elements stay inside the line.</p>
  <p><span class="as-block">This span has display: block.</span></p>
  <p>
    <span class="as-inline-block">inline-block</span>
    <span class="as-inline-block">inline-block</span>
  </p>
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
          text: "You give a link `width: 10rem`, and nothing changes. This is because `<a>` is inline, and inline elements ignore `width` and `height`. Add `display: inline-block` (or `block`), and the width works.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Hiding elements',
    },
    {
      kind: 'text',
      text: "`display: none` hides an element completely. The page acts as if the element is not there, and other elements move up to fill the space. `visibility: hidden` also hides the element, but keeps its space empty on the page.",
    },
    {
      kind: 'example',
      label: 'hide.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  .box {
    display: inline-block;
    width: 5rem;
    padding: 1rem;
    background-color: #bfdbfe;
    text-align: center;
  }
  .gone {
    display: none;
  }
  .invisible {
    visibility: hidden;
  }
</style>
</head>
<body>
  <p>visibility: hidden keeps the space:</p>
  <div class="box">A</div>
  <div class="box invisible">B</div>
  <div class="box">C</div>

  <p>display: none removes the space:</p>
  <div class="box">A</div>
  <div class="box gone">B</div>
  <div class="box">C</div>
</body>
</html>`,
    },
    {
      kind: 'table',
      head: ['Value', 'New line?', 'Accepts width and height?'],
      rows: [
        ['`block`', 'Yes', 'Yes'],
        ['`inline`', 'No', 'No'],
        ['`inline-block`', 'No', 'Yes'],
        ['`none`', 'The element is removed from the layout', '-'],
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'More values',
      blocks: [
        {
          kind: 'text',
          text: "`display` has more values. The most useful one is `flex`, which places child elements in a row or a column. It has its own lesson, Flexbox, a little later in this course.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'The menu links should stay side by side on one line, but also accept a width and padding. Fill in the display value.',
        code: `.menu a {
  display: [___];
  width: 8rem;
  padding: 0.5rem;
}`,
        answers: ['inline-block'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which declaration hides an element **and** removes the space it took up?',
        options: ['`display: none;`', '`visibility: hidden;`', '`display: inline;`', '`color: transparent;`'],
        answer: '`display: none;`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which element is a block element by default?',
        options: ['`<p>`', '`<span>`', '`<a>`', '`<strong>`'],
        answer: '`<p>`',
      },
    },
  ],
};
