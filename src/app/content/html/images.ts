import { Lesson } from '../../shared/content';

export const IMAGES: Lesson = {
  slug: 'images',
  title: 'HTML Images',
  nav: 'Images',
  blocks: [
    {
      kind: 'text',
      text: "Pictures make a page friendly and easy to understand. In HTML you add a picture with the `<img>` element. *img* is short for *image*.",
    },
    {
      kind: 'text',
      text: "`<img>` is an **empty element**: it has no content and no end tag. Everything it needs goes into its attributes.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Adding an image',
    },
    {
      kind: 'example',
      label: 'image.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Images</title>
</head>
<body>
  <h1>Meet Biscuit</h1>
  <img src="/assets/img/html-cat.svg" alt="A smiling orange cat" width="120" height="120">
  <p>Biscuit likes naps and warm windows.</p>
</body>
</html>`,
    },
    {
      kind: 'table',
      head: ['Attribute', 'What it does'],
      rows: [
        ['`src`', "The **source**: the address of the image file."],
        ['`alt`', "**Alternative text**: words that describe the image for people who cannot see it."],
        ['`width`', "The width of the image, in pixels (the tiny dots on a screen)."],
        ['`height`', "The height of the image, in pixels."],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Always write alt text',
      blocks: [
        {
          kind: 'text',
          text: "Screen readers read the `alt` text aloud to people who cannot see the picture. The browser also shows it if the image fails to load. Describe what the picture shows in a few words, like `alt=\"A smiling orange cat\"`.",
        },
      ],
    },
    {
      kind: 'text',
      text: "Setting `width` and `height` is a good habit too. The browser can then save the right amount of space before the image arrives, so the text on the page does not jump around while it loads.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "If the `src` address has a small typing error, the image will not appear. The browser shows a broken-image icon or just the `alt` text. Open the first example, change `html-cat.svg` to `html-dog.svg`, and press **Run** to see this happen.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Images with captions',
    },
    {
      kind: 'text',
      text: "To add a caption (a short text that explains a picture), put the image inside a `<figure>` element, together with a `<figcaption>` element:",
    },
    {
      kind: 'example',
      label: 'figure.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Figure</title>
</head>
<body>
  <h1>My Garden</h1>
  <figure>
    <img src="/assets/img/html-flower.svg" alt="A pink flower with a yellow centre" width="120" height="160">
    <figcaption>The first flower of spring.</figcaption>
  </figure>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Images as links',
    },
    {
      kind: 'text',
      text: "You can put an `<img>` inside an `<a>` element. Then the whole picture works as a link. Many websites do this with their logo. When an image is a link, its `alt` text should say where the link goes:",
    },
    {
      kind: 'example',
      label: 'image-link.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Image link</title>
</head>
<body>
  <a href="https://example.com">
    <img src="/assets/img/html-logo.svg" alt="My Site home page" width="160" height="60">
  </a>
  <p>Click the logo to visit the home page.</p>
</body>
</html>`,
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Show the cat picture with a description. Fill in the attribute for the image file and the attribute for the description.",
        code: `<img [___]="/assets/img/html-cat.svg" [___]="A smiling cat" width="120" height="120">`,
        answers: ['src', 'alt'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What is the `alt` attribute for?',
        options: [
          'It describes the image for people who cannot see it',
          'It sets the size of the image',
          'It makes the image into a link',
          'It adds a frame around the image',
        ],
        answer: 'It describes the image for people who cannot see it',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Does the `<img>` element need an end tag?',
        options: [
          'No, it is an empty element',
          'Yes, you must write `</img>`',
          'Only when the image has `alt` text',
        ],
        answer: 'No, it is an empty element',
      },
    },
  ],
};
