import { Lesson } from '../../shared/content';

export const SVG: Lesson = {
  slug: 'svg',
  title: 'HTML SVG Graphics',
  nav: 'SVG graphics',
  blocks: [
    {
      kind: 'text',
      text: "**SVG** is a way to draw pictures with code. *SVG* stands for *Scalable Vector Graphics*. A photo stores millions of tiny coloured dots. An SVG stores shapes instead: *a circle here, a line there*. You can write SVG straight into your HTML page.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Your first drawing',
    },
    {
      kind: 'text',
      text: "The `<svg>` element is the drawing area, and the shapes go inside it. You place each shape with numbers called **coordinates**. `x` counts from the left edge to the right, and `y` counts from the **top** edge down. So the point where `x` is 0 and `y` is 0 is the top-left corner.",
    },
    {
      kind: 'text',
      text: "The `viewBox` attribute sets up the grid that you draw on. `viewBox=\"0 0 300 120\"` means: the grid starts at 0, 0 and is 300 units wide and 120 units high. The `width` and `height` attributes set how big the drawing appears on the page. If they are bigger than the grid, the whole drawing grows to fit.",
    },
    {
      kind: 'example',
      label: 'shapes.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SVG shapes</title>
</head>
<body>
  <h1>Three shapes and some text</h1>
  <svg viewBox="0 0 300 120" width="300" height="120">
    <rect x="10" y="10" width="80" height="60" fill="gold" />
    <circle cx="150" cy="40" r="30" fill="tomato" stroke="black" stroke-width="3" />
    <line x1="210" y1="10" x2="290" y2="70" stroke="teal" stroke-width="5" />
    <text x="10" y="105" font-size="16" fill="navy">A rectangle, a circle and a line</text>
  </svg>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Open the example, change `width=\"300\" height=\"120\"` to `width=\"600\" height=\"240\"`, and press **Run**. Everything doubles in size, and the edges stay sharp.",
    },
    {
      kind: 'table',
      head: ['Element', 'Main attributes'],
      rows: [
        ['`<rect>`', '`x` and `y` for the top-left corner, then `width` and `height`'],
        ['`<circle>`', '`cx` and `cy` for the centre, and `r` for the **radius**: the distance from the centre to the edge'],
        ['`<line>`', '`x1` and `y1` for the start, `x2` and `y2` for the end'],
        ['`<text>`', '`x` and `y` for where the text starts. `y` is the bottom of the letters.'],
      ],
    },
    {
      kind: 'text',
      text: "SVG shapes have no content, so each one ends with `/>`, like `<circle ... />`. This closes the shape straight away.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Fill and stroke',
    },
    {
      kind: 'text',
      text: "`fill` sets the colour inside a shape. `stroke` sets the colour of its outline, and `stroke-width` sets how thick the outline is. You can use colour names, such as `tomato`, or hex codes (a `#` and six numbers and letters), such as `#ff6347`. `fill=\"none\"` leaves the inside empty.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "A `<line>` with no `stroke` is invisible. A line has no inside to fill, and it has no outline until you give it one. Always give a line a `stroke`, such as `stroke=\"black\"`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'SVG or a normal image?',
    },
    {
      kind: 'text',
      text: "Photos are made of **pixels**: tiny coloured squares. When a photo is shown much bigger than it really is, every pixel gets bigger too, and the picture looks blurry. An SVG stores shapes, so the browser can draw them again, sharp, at any size. That is what *scalable* means.",
    },
    {
      kind: 'table',
      head: ['', 'SVG', 'JPG, PNG and WebP'],
      rows: [
        ['Made of', 'Shapes, written as code', 'Pixels'],
        ['Shown bigger', 'Stays sharp', 'Gets blurry'],
        ['Best for', 'Icons, logos, charts and simple drawings', 'Photos and detailed pictures'],
        ['File size', 'Small for simple drawings', 'Often large'],
      ],
    },
    {
      kind: 'text',
      text: "An SVG can also live in its own file, with a name that ends in `.svg`. Then you show it with `<img>`, like any other picture, with `alt` text too.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Why icons are often SVG',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Sharp everywhere.** The same small file looks crisp on a cheap phone and on a large, sharp screen.",
        "**Small files.** A simple icon is only a few lines of code, so it loads fast.",
        "**Easy to colour.** An icon written into the page can take the colour of the text around it.",
      ],
    },
    {
      kind: 'example',
      label: 'icons.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Icons</title>
</head>
<body>
  <h1>One star file, three sizes</h1>
  <img src="/assets/img/html-star.svg" alt="A small yellow star" width="24" height="24">
  <img src="/assets/img/html-star.svg" alt="A medium yellow star" width="64" height="64">
  <img src="/assets/img/html-star.svg" alt="A big yellow star" width="160" height="160">

  <h2>An icon in the colour of the text</h2>
  <p style="color: crimson;">
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
      <line x1="12" y1="6" x2="12" y2="14" stroke="currentColor" stroke-width="2" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
    Your train leaves in 5 minutes.
  </p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "`currentColor` means *the colour of the text around it*. Change `crimson` to `blue` and press **Run**: the icon changes colour together with the text.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Give drawings a name',
      blocks: [
        {
          kind: 'text',
          text: "An `<svg>` has no `alt` attribute. If your drawing shows information, add `role=\"img\"` and an `aria-label` with a short description, just like alt text: `<svg role=\"img\" aria-label=\"A red circle\">`. If it is only decoration next to words that say the same thing, like the icon above, add `aria-hidden=\"true\"`. Screen readers then skip it.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Draw a circle in the middle of the drawing area. Fill in the element name.",
        code: `<svg viewBox="0 0 100 100" width="100" height="100">
  <[___] cx="50" cy="50" r="40" fill="orange" />
</svg>`,
        answers: ['circle'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Give the rectangle a blue inside and a black outline. Fill in the two attribute names.",
        code: `<rect x="10" y="10" width="80" height="50" [___]="blue" [___]="black" />`,
        answers: ['fill', 'stroke'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Why are icons often made with SVG?',
        options: [
          'They stay sharp at every size, and the files are small',
          'SVG files can play sound',
          'Only SVG pictures can be used as links',
          'SVG pictures work without a browser',
        ],
        answer: 'They stay sharp at every size, and the files are small',
      },
    },
  ],
};
