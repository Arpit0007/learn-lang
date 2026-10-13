import { Lesson } from '../../shared/content';

export const TEXT_FONTS: Lesson = {
  slug: 'text-fonts',
  title: 'CSS Text and Fonts',
  nav: 'Text & fonts',
  blocks: [
    {
      kind: 'text',
      text: "Most of a web page is text, so text style matters a lot. CSS lets you choose the **font** (the shape of the letters), its size and weight, and how lines of text are aligned and spaced.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Font family',
    },
    {
      kind: 'text',
      text: "The `font-family` property takes a list of fonts, separated by commas. This list is called a **font stack**. The browser uses the first font in the list that the computer has. If it has none of them, it moves on down the list.",
    },
    {
      kind: 'text',
      text: "Always end the list with a **generic family**. The browser always has one of these. The main ones are `serif` (letters with small \"feet\"), `sans-serif` (clean letters with no feet) and `monospace` (every letter has the same width, like code). `system-ui` uses the normal font of the computer or phone.",
    },
    {
      kind: 'example',
      label: 'fonts.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  p {
    font-size: 1.25rem;
  }
  .sans  { font-family: system-ui, "Segoe UI", Arial, sans-serif; }
  .serif { font-family: Georgia, "Times New Roman", serif; }
  .mono  { font-family: Consolas, "Courier New", monospace; }
</style>
</head>
<body>
  <p class="sans">A sans-serif font: clean and simple.</p>
  <p class="serif">A serif font: letters have small feet.</p>
  <p class="mono">A monospace font: every letter is the same width.</p>
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
          text: "Put quotes around a font name that has spaces in it, such as `\"Times New Roman\"`. Do **not** put quotes around generic families. `\"serif\"` with quotes means a font that is literally named serif, and no such font exists.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Size, weight and style',
    },
    {
      kind: 'text',
      text: "`font-size` sets how big the text is. Use `rem` for font sizes. `1rem` equals the base font size of the page, which is usually `16px`. So `2rem` is twice as big. `font-weight` sets how thick the letters are: `400` is normal and `700` is bold. You can also write `normal` and `bold`. `font-style: italic` makes letters lean to the right.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Why rem?',
      blocks: [
        {
          kind: 'text',
          text: "Some people set a bigger base font in their browser because it is easier for them to read. Sizes in `rem` grow with that setting. Sizes in `px` do not. So `rem` keeps your page readable for more people.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Text properties',
    },
    {
      kind: 'table',
      head: ['Property', 'Example', 'What it does'],
      rows: [
        ['`text-align`', '`center`', 'Lines up text: `left`, `right`, `center` or `justify`'],
        ['`line-height`', '`1.6`', 'Space between lines; `1.6` means 1.6 times the font size'],
        ['`text-decoration`', '`none`', 'Adds or removes lines, such as the underline on links'],
        ['`text-transform`', '`uppercase`', 'Changes letter case without changing the HTML'],
        ['`letter-spacing`', '`2px`', 'Extra space between letters'],
      ],
    },
    {
      kind: 'example',
      label: 'text.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
  }
  h1 {
    font-size: 2rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .lead {
    font-size: 1.25rem;
    font-weight: 700;
  }
  .quote {
    font-style: italic;
    color: #555555;
  }
  a {
    color: #1a5fb4;
    text-decoration: none;
  }
</style>
</head>
<body>
  <h1>Morning tea</h1>
  <p class="lead">Tea has been popular for thousands of years.</p>
  <p class="quote">"A warm cup of tea makes a cold morning feel shorter."</p>
  <p>This <a href="#">link</a> has no underline.</p>
</body>
</html>`,
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'End this font stack with the generic family whose letters have small "feet".',
        code: `p {
  font-family: Georgia, "Times New Roman", [___];
}`,
        answers: ['serif'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Put the heading in the middle of the line and make it bold. Fill in the two properties.',
        code: `h1 {
  [___]: center;
  [___]: bold;
}`,
        answers: ['text-align', 'font-weight'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'The base font size is `16px`. How big is `1.5rem`?',
        options: ['`24px`', '`1.5px`', '`16px`', '`32px`'],
        answer: '`24px`',
      },
    },
  ],
};
