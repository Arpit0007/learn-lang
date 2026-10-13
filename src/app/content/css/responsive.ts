import { Lesson } from '../../shared/content';

export const RESPONSIVE: Lesson = {
  slug: 'responsive',
  title: 'CSS Responsive Design',
  nav: 'Responsive design',
  blocks: [
    {
      kind: 'text',
      text: "People visit web pages on phones, tablets, laptops and big screens. A **responsive** page changes its layout to fit the screen it is on. On a phone, the boxes may stack in one column. On a wide screen, they may sit side by side. You do this with plain CSS.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The viewport meta tag',
    },
    {
      kind: 'text',
      text: "First, add this one line inside the `<head>` of every page:",
    },
    {
      kind: 'example',
      label: 'viewport.html',
      lang: 'html',
      run: 'none',
      code: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    },
    {
      kind: 'text',
      text: "Without it, a phone pretends that its screen is about `980px` wide. It draws the page at that size and then shrinks it, so the text becomes tiny. `width=device-width` tells the phone to use its real width. `initial-scale=1` means: do not zoom in or out at the start.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Media queries',
    },
    {
      kind: 'text',
      text: "A **media query** is a block of CSS that only works when a condition is true. `@media (min-width: 30rem) { ... }` means: use the rules inside only when the viewport is **at least** `30rem` wide. The width where the layout changes is called a **breakpoint**.",
    },
    {
      kind: 'text',
      text: "Good practice is **mobile-first**. Write the normal CSS for small screens first, with no media query. Then add `min-width` media queries that change the layout as the screen gets wider. Small screens get simple CSS, and big screens get the extras.",
    },
    {
      kind: 'example',
      label: 'media-query.html',
      code: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body {
    font-family: system-ui, sans-serif;
    background-color: #fee2e2;
  }
  .cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .card {
    padding: 1.5rem;
    border-radius: 8px;
    background-color: white;
  }

  /* At least 30rem (480px) wide: two columns */
  @media (min-width: 30rem) {
    body { background-color: #fef9c3; }
    .cards { grid-template-columns: 1fr 1fr; }
  }

  /* At least 40rem (640px) wide: three columns */
  @media (min-width: 40rem) {
    body { background-color: #dcfce7; }
    .cards { grid-template-columns: 1fr 1fr 1fr; }
  }
</style>
</head>
<body>
  <div class="cards">
    <div class="card">Small screen: 1 column, red page</div>
    <div class="card">Medium screen: 2 columns, yellow page</div>
    <div class="card">Wide screen: 3 columns, green page</div>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Open this example with **Try it Yourself**. Then press the **Phone**, **Tablet** and **Full** buttons above the result. The preview changes from 1 column to 2 columns to 3 columns, and the background color changes at each breakpoint.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "A media query needs its own pair of curly braces `{ }`, and the rules inside need theirs too. So the end of a media query has two closing braces: one for the last rule and one for the `@media` block. If you forget one, the rules after it may stop working.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Flexible images',
    },
    {
      kind: 'text',
      text: "An image that is wider than the screen makes the page scroll sideways. One rule fixes this: `max-width: 100%`. It means: never be wider than the parent. Add `height: auto` so the image keeps its shape when it gets smaller.",
    },
    {
      kind: 'example',
      label: 'flexible-image.html',
      code: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .flexible {
    max-width: 100%;
    height: auto;
  }
</style>
</head>
<body>
  <p>Flexible: shrinks to fit.</p>
  <img class="flexible" src="/assets/img/css-landscape.svg" alt="Mountains and green hills under a sunny sky" width="800" height="300">

  <p>Not flexible: always 800px wide.</p>
  <img src="/assets/img/css-landscape.svg" alt="The same mountains, at a fixed size" width="800" height="300">
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Press **Phone** above the result. The first image shrinks. The second one is cut off, and you have to scroll sideways to see it.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "Three steps to a responsive page: add the viewport meta tag, write mobile-first CSS with `min-width` media queries, and give images `max-width: 100%`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Use two columns only when the screen is at least `40rem` wide. Fill in the condition.',
        code: `@media ([___]: 40rem) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}`,
        answers: ['min-width'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Stop images from being wider than their parent. Fill in the property.',
        code: `img {
  [___]: 100%;
  height: auto;
}`,
        answers: ['max-width'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What does **mobile-first** mean?',
        options: [
          'Write CSS for small screens first, then add `min-width` media queries for wider screens',
          'Build the phone app before the website',
          'Write CSS for big screens first, then hide things on phones',
          'Only support phones',
        ],
        answer: 'Write CSS for small screens first, then add `min-width` media queries for wider screens',
      },
    },
  ],
};
