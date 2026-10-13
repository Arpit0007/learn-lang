import { Lesson } from '../../shared/content';

export const OVERFLOW_IMAGES: Lesson = {
  slug: 'overflow-images',
  title: 'CSS Overflow, Opacity and Images',
  nav: 'Overflow & images',
  blocks: [
    {
      kind: 'text',
      text: "Sometimes content does not fit in its box. The text is too long, or a picture has the wrong shape. In this lesson you will decide what happens then. You will also make elements see-through, and change how images look with filters.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Overflow',
    },
    {
      kind: 'text',
      text: "When the content is bigger than its box, it **overflows**. This happens when a box has a fixed `height` and too much content. By default, the extra content spills out of the box and can cover the elements below it. The `overflow` property decides what happens instead.",
    },
    {
      kind: 'table',
      head: ['Value', 'What it does'],
      rows: [
        ['`visible`', 'The default. The content spills out of the box'],
        ['`hidden`', 'The content outside the box is cut off, and nobody can see it'],
        ['`scroll`', 'The box always has scroll bars, even when the content fits'],
        ['`auto`', 'The box gets scroll bars only when the content does not fit'],
      ],
    },
    {
      kind: 'text',
      text: "A **scroll bar** is the bar at the side of a box that moves the content up and down, so you can read all of it.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Cutting text with an ellipsis',
    },
    {
      kind: 'text',
      text: "An **ellipsis** is three dots (…) that show that some text is missing. It is useful for long titles in a small space. `text-overflow: ellipsis` adds the dots. But it only works together with two other properties. `white-space: nowrap` keeps the text on one line, and `overflow: hidden` hides the part that does not fit.",
    },
    {
      kind: 'example',
      label: 'overflow.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .box {
    width: 15rem;
    height: 3rem;
    padding: 0.5rem;
    border: 2px solid #0369a1;
    background-color: #e0f2fe;
  }
  .visible { overflow: visible; margin-bottom: 5rem; }
  .hidden  { overflow: hidden; }
  .scroll  { overflow: scroll; }
  .auto    { overflow: auto; }
  .title {
    width: 15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }
</style>
</head>
<body>
  <p>overflow: visible (the default)</p>
  <div class="box visible">This text is too long for its box. It spills out at the bottom of the box, and it can cover what comes next. That is usually not what you want.</div>

  <p>overflow: hidden</p>
  <div class="box hidden">This text is too long for its box. The part that does not fit is cut off. Nobody can read this last sentence.</div>

  <p>overflow: scroll</p>
  <div class="box scroll">Short text, but scroll bars anyway.</div>

  <p>overflow: auto</p>
  <div class="box auto">This text is too long for its box. A scroll bar appears, so you can scroll down and read the rest. Here is the end of the text.</div>

  <p>text-overflow: ellipsis</p>
  <p class="title">A very long title that does not fit on one line</p>
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
          text: "`text-overflow: ellipsis` alone does nothing. The same element also needs `white-space: nowrap` and `overflow: hidden`. Without them, no dots appear.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Images: object-fit',
    },
    {
      kind: 'text',
      text: "Sometimes an image must fill a box of a fixed size, such as a square frame. If the picture has a different shape, the browser **stretches** or **squashes** it to fill the box, and it looks wrong. The `object-fit` property fixes this.",
    },
    {
      kind: 'table',
      head: ['Value', 'What it does'],
      rows: [
        ['`fill`', 'The default. The image is stretched to fill the box, so its shape changes'],
        ['`contain`', 'The whole image fits inside the box and keeps its shape. Some space may stay empty'],
        ['`cover`', 'The image covers the whole box and keeps its shape. Some edges are cut off'],
      ],
    },
    {
      kind: 'text',
      text: "These values work like `background-size: contain` and `cover` from the Backgrounds lesson, but for `<img>` elements.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Shapes with aspect-ratio',
    },
    {
      kind: 'text',
      text: "The **aspect ratio** of a box is its shape: its width compared to its height. `aspect-ratio: 16 / 9` makes a wide box, like a video. `aspect-ratio: 1 / 1` makes a square. You set the width, and the browser works out the height.",
    },
    {
      kind: 'text',
      text: "Together with `object-fit: cover`, `aspect-ratio` turns pictures of any shape into pictures of the same shape. This is perfect for a gallery.",
    },
    {
      kind: 'example',
      label: 'object-fit.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  figure {
    display: inline-block;
    margin: 0 1rem 1rem 0;
  }
  .frame {
    width: 9rem;
    height: 9rem;
    border: 2px solid #334155;
    background-color: #e2e8f0;
  }
  .fill    { object-fit: fill; }
  .contain { object-fit: contain; }
  .cover   { object-fit: cover; }
  .gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    max-width: 30rem;
  }
  .gallery img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 8px;
  }
</style>
</head>
<body>
  <p>One wide picture in three square frames:</p>
  <figure>
    <img class="frame fill" src="/assets/img/css-balloon.svg" alt="A hot air balloon">
    <figcaption>fill (the default)</figcaption>
  </figure>
  <figure>
    <img class="frame contain" src="/assets/img/css-balloon.svg" alt="A hot air balloon">
    <figcaption>contain</figcaption>
  </figure>
  <figure>
    <img class="frame cover" src="/assets/img/css-balloon.svg" alt="A hot air balloon">
    <figcaption>cover</figcaption>
  </figure>

  <p>Three pictures with different shapes, made into equal squares:</p>
  <div class="gallery">
    <img src="/assets/img/css-landscape.svg" alt="Mountains under a sunny sky">
    <img src="/assets/img/html-flower.svg" alt="A pink flower">
    <img src="/assets/img/css-balloon.svg" alt="A hot air balloon">
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "With `fill`, the round balloon is squashed into a tall oval. With `contain`, you see the whole picture, with empty space above and below it. With `cover`, the picture fills the frame, but the sun and the clouds at the sides are cut off.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Opacity',
    },
    {
      kind: 'text',
      text: "`opacity` makes an element see-through. It takes a number from `0` (invisible) to `1` (solid, the default). So `opacity: 0.5` means half see-through.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "`opacity` works on the **whole** element: its background, its text, its images and all its children. To make only a background see-through, use a color with alpha instead, such as `rgb(0 0 0 / 50%)`, from the Colors lesson. Also, an element with `opacity: 0` is invisible, but it still takes up space, and it can still be clicked.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Filters',
    },
    {
      kind: 'text',
      text: "The `filter` property changes how an element looks, like the filters in a photo app. Its value is one or more **filter functions**, such as `grayscale()` or `blur()`. Each one takes an amount in its parentheses.",
    },
    {
      kind: 'table',
      head: ['Filter function', 'What it does'],
      rows: [
        ['`grayscale(100%)`', 'Removes all color, so only black, white and gray are left'],
        ['`blur(3px)`', 'Makes the element blurry. A bigger value is more blurry'],
        ['`sepia(100%)`', 'Gives a warm brown look, like an old photo'],
        ['`brightness(150%)`', 'Makes it brighter. A value below `100%` makes it darker'],
      ],
    },
    {
      kind: 'text',
      text: "To use more than one filter, separate them with spaces: `filter: grayscale(100%) blur(2px);`.",
    },
    {
      kind: 'example',
      label: 'opacity-filter.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .wall {
    padding: 0.5rem;
    background-color: #fef3c7;
    background-image: radial-gradient(circle, #f59e0b 25%, transparent 26%);
    background-size: 1.5rem 1.5rem;
  }
  figure {
    display: inline-block;
    margin: 0.5rem;
  }
  img {
    display: block;
    width: 9rem;
    height: auto;
  }
  figcaption {
    padding: 0.25rem;
    background-color: white;
    text-align: center;
  }
  .half  { opacity: 0.5; }
  .gray  { filter: grayscale(100%); }
  .blur  { filter: blur(3px); }
  .sepia { filter: sepia(100%); }
</style>
</head>
<body>
  <div class="wall">
    <figure>
      <img src="/assets/img/css-balloon.svg" alt="A hot air balloon">
      <figcaption>normal</figcaption>
    </figure>
    <figure>
      <img class="half" src="/assets/img/css-balloon.svg" alt="A hot air balloon">
      <figcaption>opacity: 0.5</figcaption>
    </figure>
    <figure>
      <img class="gray" src="/assets/img/css-balloon.svg" alt="A hot air balloon">
      <figcaption>grayscale(100%)</figcaption>
    </figure>
    <figure>
      <img class="blur" src="/assets/img/css-balloon.svg" alt="A hot air balloon">
      <figcaption>blur(3px)</figcaption>
    </figure>
    <figure>
      <img class="sepia" src="/assets/img/css-balloon.svg" alt="A hot air balloon">
      <figcaption>sepia(100%)</figcaption>
    </figure>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Look at the second picture: you can see the dots of the background through it.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Keep the long title on one line, cut it at the end of the box, and show three dots. Fill in the two values.',
        code: `.title {
  white-space: nowrap;
  overflow: [___];
  text-overflow: [___];
}`,
        answers: [['hidden', 'clip'], 'ellipsis'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'The photo must fill the whole square and keep its shape, even if some edges are cut off. Fill in the value.',
        code: `img {
  width: 10rem;
  height: 10rem;
  object-fit: [___];
}`,
        answers: ['cover'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which declaration makes an image black and white?',
        options: ['`filter: grayscale(100%);`', '`filter: sepia(100%);`', '`opacity: 0.5;`', '`object-fit: contain;`'],
        answer: '`filter: grayscale(100%);`',
      },
    },
  ],
};
