import { Lesson } from '../../shared/content';

export const SELECTORS: Lesson = {
  slug: 'selectors',
  title: 'CSS Selectors',
  nav: 'Selectors',
  blocks: [
    {
      kind: 'text',
      text: "The **selector** is the first part of a CSS rule. It chooses which elements the rule styles. Good selectors let you style exactly the elements you want, and nothing else.",
    },
    {
      kind: 'table',
      head: ['Selector', 'Example', 'What it selects'],
      rows: [
        ['Element', '`p`', 'Every `<p>` element'],
        ['Class', '`.note`', 'Every element with `class="note"`'],
        ['Id', '`#intro`', 'The one element with `id="intro"`'],
        ['Group', '`h1, h2`', 'Every `<h1>` and every `<h2>`'],
        ['Universal', '`*`', 'Every element on the page'],
        ['Descendant', '`nav a`', 'Every `<a>` that is somewhere inside a `<nav>`'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Element, class and id',
    },
    {
      kind: 'text',
      text: "An **element selector** is just the tag name, like `p` or `h1`. It styles every element of that type.",
    },
    {
      kind: 'text',
      text: "A **class** is a name you give to elements with the `class` attribute. Many elements can share one class. In CSS, write a dot before the name: `.note`. An **id** is a name for *one* element only, given with the `id` attribute. In CSS, write a hash before it: `#intro`.",
    },
    {
      kind: 'example',
      label: 'selectors.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  p {
    color: #444444;
  }
  .note {
    background-color: lightyellow;
  }
  #intro {
    font-size: 1.25rem;
    font-weight: bold;
  }
</style>
</head>
<body>
  <p id="intro">Welcome to the garden club.</p>
  <p>We meet every Saturday morning.</p>
  <p class="note">Bring your own gloves.</p>
  <p class="note">Tea is free.</p>
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
          text: "The dot and the hash belong only in CSS. In HTML, write `class=\"note\"`, not `class=\".note\"`. In CSS, write `.note`, not `note`. Without the dot, the browser looks for a `<note>` tag, which does not exist.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Groups and the universal selector',
    },
    {
      kind: 'text',
      text: "To give several selectors the same style, list them with commas: `h1, h2, h3`. This is a **group**. It saves you from writing the same rule three times. The **universal selector** `*` selects every element. You will use it in the Box Model lesson.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Descendant selector',
    },
    {
      kind: 'text',
      text: "Two selectors with a space between them select elements *inside* other elements. `.menu a` means: every `<a>` that is inside an element with class `menu`. Links outside the menu are not affected.",
    },
    {
      kind: 'example',
      label: 'group-and-descendant.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  h1, h2 {
    color: darkslateblue;
  }
  .menu a {
    color: darkorange;
    font-weight: bold;
  }
</style>
</head>
<body>
  <h1>My recipes</h1>
  <div class="menu">
    <a href="#">Soups</a> | <a href="#">Salads</a>
  </div>
  <h2>Tomato soup</h2>
  <p>This <a href="#">normal link</a> is not in the menu, so it keeps its usual style.</p>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'When rules disagree',
      blocks: [
        {
          kind: 'text',
          text: "If an element rule and a class rule set the same property, the **class** wins. An **id** wins over both. A more exact selector beats a more general one. Most of the time, style with classes: they are reusable, and they are easy to override.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Write the selector that styles every element with `class="warning"`.',
        code: `[___] {
  color: red;
}`,
        answers: ['.warning'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which selector chooses the element with `id="logo"`?',
        options: ['`#logo`', '`.logo`', '`logo`', '`*logo`'],
        answer: '`#logo`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make only the links inside the `<nav>` element green. Fill in the missing part of the selector.',
        code: `[___] a {
  color: green;
}`,
        answers: ['nav'],
      },
    },
  ],
};
