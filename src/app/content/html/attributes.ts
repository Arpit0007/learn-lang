import { Lesson } from '../../shared/content';

export const ATTRIBUTES: Lesson = {
  slug: 'attributes',
  title: 'HTML Attributes',
  nav: 'Attributes',
  blocks: [
    {
      kind: 'text',
      text: "An **attribute** gives extra information about an element. For example, a link needs to know *where* to go, and an image needs to know *which* picture to show. Attributes carry that information.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How to write an attribute',
    },
    {
      kind: 'text',
      text: "An attribute has a **name** and a **value**, joined by an equals sign: `name=\"value\"`. You write it inside the start tag, after the tag name. If there is more than one attribute, put a space between them.",
    },
    {
      kind: 'text',
      text: "In this example, the `title` attribute adds a small tip that appears when you hold the mouse over the text. The `style` attribute changes how the text looks. Open the example, press **Run**, and move your mouse over the first paragraph:",
    },
    {
      kind: 'example',
      label: 'attributes.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Attributes</title>
</head>
<body>
  <p title="Hello from the title attribute!">Hold your mouse over me.</p>
  <p style="color: teal;">This text is teal.</p>
  <p style="color: white; background-color: purple;">White text on purple.</p>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "Always put attribute values inside double quotes, like `title=\"My tip\"`. Without quotes, a value that contains a space breaks: the browser only reads the first word.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Attributes you will use often',
    },
    {
      kind: 'table',
      head: ['Attribute', 'Used on', 'What it does'],
      rows: [
        ['`href`', '`<a>`', 'The address a link goes to'],
        ['`src`', '`<img>`', 'The file of the image to show'],
        ['`alt`', '`<img>`', 'Text that describes the image'],
        ['`lang`', 'any element, usually `<html>`', 'The language of the text'],
        ['`title`', 'any element', 'A tip shown when the mouse is over the element'],
        ['`style`', 'any element', 'Changes colours, sizes and more (CSS)'],
        ['`id`', 'any element', 'A unique name for one element on the page'],
      ],
    },
    {
      kind: 'text',
      text: "The `lang` attribute is not only for the `<html>` element. If one part of the page uses a different language, mark it. This helps screen readers (programs that read pages aloud) say the words correctly. Below, the Spanish word sits in a `<span>`, an element that wraps a few words without changing how they look:",
    },
    {
      kind: 'example',
      label: 'more-attributes.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>More attributes</title>
</head>
<body>
  <p>In Spanish, "thank you" is <span lang="es">gracias</span>.</p>
  <p>Visit <a href="https://example.com" title="Opens example.com">our partner site</a>.</p>
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
          text: "Attributes go in the **start tag** only. `<p>Hi</p title=\"tip\">` does nothing. Write `<p title=\"tip\">Hi</p>` instead.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make this link go to example.com. Fill in the attribute name that holds the address.",
        code: `<a [___]="https://example.com">Visit Example</a>`,
        answers: ['href'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Show a tip when the mouse is over this paragraph. Fill in the attribute name.",
        code: `<p [___]="Extra information">Hold your mouse over me.</p>`,
        answers: ['title'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Where do you write an attribute?',
        options: [
          'Inside the start tag',
          'Inside the end tag',
          'Between the start tag and the end tag',
          'In the `<title>` element',
        ],
        answer: 'Inside the start tag',
      },
    },
  ],
};
