import { Lesson } from '../../shared/content';

export const LISTS: Lesson = {
  slug: 'lists',
  title: 'HTML Lists',
  nav: 'Lists',
  blocks: [
    {
      kind: 'text',
      text: "Lists are everywhere: shopping lists, the steps of a recipe, the menu of a website. HTML has elements made just for lists, and they are easy to use.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Bulleted and numbered lists',
    },
    {
      kind: 'text',
      text: "Use `<ul>` (**unordered list**) when the order does not matter. The browser shows a dot, called a bullet, before each item. Use `<ol>` (**ordered list**) when the order matters, such as steps. The browser numbers each item for you. In both kinds, every item goes inside its own `<li>` (**list item**) element.",
    },
    {
      kind: 'example',
      label: 'lists.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Lists</title>
</head>
<body>
  <h2>Shopping list</h2>
  <ul>
    <li>Eggs</li>
    <li>Flour</li>
    <li>Milk</li>
  </ul>

  <h2>How to make pancakes</h2>
  <ol>
    <li>Mix the eggs, flour and milk.</li>
    <li>Heat a pan with a little oil.</li>
    <li>Cook each pancake for one minute on each side.</li>
  </ol>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "An ordered list can start from another number with the `start` attribute, for example `<ol start=\"4\">`. Add the `reversed` attribute to count down instead of up. `reversed` needs no value: writing its name is enough.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Lists inside lists',
    },
    {
      kind: 'text',
      text: "A list item can contain another whole list. This is a **nested list**. Put the inner list *inside* an `<li>`, after the item's text:",
    },
    {
      kind: 'example',
      label: 'nested-list.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nested list</title>
</head>
<body>
  <h2>Packing for a trip</h2>
  <ul>
    <li>Clothes
      <ul>
        <li>T-shirts</li>
        <li>A warm jacket</li>
      </ul>
    </li>
    <li>Passport</li>
    <li>Phone charger</li>
  </ul>
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
          text: "Only `<li>` elements may sit directly inside `<ul>` or `<ol>`. Do not put plain text, a `<p>`, or another `<ul>` straight inside a list. A nested list must go inside an `<li>`, as in the example above.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Description lists',
    },
    {
      kind: 'text',
      text: "A **description list** pairs words with their meanings, like a small dictionary. It uses three elements: `<dl>` wraps the whole list, `<dt>` holds a term, and `<dd>` holds its description.",
    },
    {
      kind: 'example',
      label: 'description-list.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Description list</title>
</head>
<body>
  <h2>Web words</h2>
  <dl>
    <dt>Browser</dt>
    <dd>A program for visiting websites.</dd>
    <dt>Tag</dt>
    <dd>A word in angle brackets that marks a part of a page.</dd>
  </dl>
</body>
</html>`,
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make this a bulleted list, where the order does not matter. Fill in the list element name in the start tag and the end tag.",
        code: `<[___]>
  <li>Apples</li>
  <li>Bananas</li>
</[___]>`,
        answers: ['ul', 'ul'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "These steps continue from step 3. Fill in the attribute that makes the numbers begin at 4.",
        code: `<ol [___]="4">
  <li>Add the sugar.</li>
  <li>Stir well.</li>
</ol>`,
        answers: ['start'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which element holds each item in a `<ul>` or an `<ol>`?',
        options: ['`<li>`', '`<item>`', '`<p>`', '`<dt>`'],
        answer: '`<li>`',
      },
    },
  ],
};
