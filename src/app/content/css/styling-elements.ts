import { Lesson } from '../../shared/content';

export const STYLING_ELEMENTS: Lesson = {
  slug: 'styling-elements',
  title: 'CSS Styling Links, Lists and Tables',
  nav: 'Links, lists & tables',
  blocks: [
    {
      kind: 'text',
      text: "Links, lists and tables are on almost every web page. Each of them has a few CSS tools of its own. In this lesson you will style links in all their states, turn a list into a menu, and make a table easy to read.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Link states',
    },
    {
      kind: 'text',
      text: "A link can be in different **states**. Has the user opened it before? Is the mouse over it? Is it being clicked? CSS has a pseudo-class for each state. A **pseudo-class** is a word after a colon, like `:hover`, that selects an element only when it is in that state.",
    },
    {
      kind: 'table',
      head: ['Pseudo-class', 'Selects a link that...'],
      rows: [
        ['`:link`', 'has not been visited yet'],
        ['`:visited`', 'goes to a page that the user has already opened'],
        ['`:hover`', 'has the mouse pointer over it'],
        ['`:active`', 'is being clicked (the mouse button is down)'],
      ],
    },
    {
      kind: 'text',
      text: "Write these rules in this order: `:link`, `:visited`, `:hover`, `:active`. An easy way to remember the order is **LoVe HAte**: L, V, H, A.",
    },
    {
      kind: 'text',
      text: "Why does the order matter? All four selectors have the same score, 0-1-1, so when two of them match the same link, the later rule wins. A visited link under the mouse matches both `:visited` and `:hover`. If the `:visited` rule came last, the hover style would never show on visited links.",
    },
    {
      kind: 'example',
      label: 'links.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
    font-size: 1.1rem;
  }
  a:link {
    color: #1d4ed8;
  }
  a:visited {
    color: #7c3aed;
  }
  a:hover {
    color: #b91c1c;
    background-color: #fee2e2;
  }
  a:active {
    color: white;
    background-color: #b91c1c;
  }
  .quiet {
    text-decoration: none;
  }
  .quiet:hover {
    text-decoration: underline;
  }
</style>
</head>
<body>
  <p>Move the mouse over <a href="#">this link</a>. Then press and hold the mouse button on it.</p>
  <p>This <a class="quiet" href="#">link has no underline</a> until you point at it.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "You only see the `:visited` color on links to pages that you have opened before.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "To protect your privacy, a `:visited` rule can only change colors, such as `color` and `background-color`. Other properties, such as `font-size`, are ignored. Otherwise, a web page could find out which other websites you have visited.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'List markers',
    },
    {
      kind: 'text',
      text: "Every item in a list has a **marker** in front of it: a bullet in a `<ul>`, and a number in an `<ol>`. The `list-style-type` property chooses the marker.",
    },
    {
      kind: 'table',
      head: ['Value', 'Marker'],
      rows: [
        ['`disc`', '● a filled circle (the default for `<ul>`)'],
        ['`circle`', '○ an empty circle'],
        ['`square`', '■ a filled square'],
        ['`decimal`', '1, 2, 3 (the default for `<ol>`)'],
        ['`lower-alpha`', 'a, b, c'],
        ['`upper-roman`', 'I, II, III'],
        ['`none`', 'No marker'],
      ],
    },
    {
      kind: 'text',
      text: "`list-style` is the shorthand for the list properties. You will often see `list-style: none;`, which removes the markers.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'A menu from a list',
    },
    {
      kind: 'text',
      text: "A menu is really a list of links. So the HTML of a menu is often a `<ul>`, with one link in each `<li>`. To turn the list into a **horizontal** menu, a menu that goes from left to right:",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "Remove the markers with `list-style: none`.",
        "Remove the space around the list with `margin: 0` and `padding: 0`.",
        "Put the items in a row with `display: flex`.",
        "Give the links `display: block` and some `padding`. Now the whole area around each word can be clicked, not only the word.",
      ],
    },
    {
      kind: 'example',
      label: 'lists-and-menu.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .menu {
    display: flex;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: #1e293b;
  }
  .menu a {
    display: block;
    padding: 0.75rem 1rem;
    color: white;
    text-decoration: none;
  }
  .menu a:hover {
    background-color: #475569;
  }
  .square {
    list-style-type: square;
  }
  .roman {
    list-style-type: upper-roman;
  }
</style>
</head>
<body>
  <ul class="menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">Recipes</a></li>
    <li><a href="#">About</a></li>
  </ul>

  <h2>Pancakes</h2>
  <ul class="square">
    <li>Flour</li>
    <li>Milk</li>
    <li>Eggs</li>
  </ul>
  <ol class="roman">
    <li>Mix everything together.</li>
    <li>Heat a pan.</li>
    <li>Cook each pancake until it is golden.</li>
  </ol>
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
          text: "You remove the markers, but the list still has a gap on the left. Lists have padding on the left by default, to make room for the markers. `list-style: none` does not remove it. Add `padding: 0` as well.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Tables',
    },
    {
      kind: 'text',
      text: "When you give table cells a border, every cell gets its own border, so you see double lines between the cells. `border-collapse: collapse` on the `<table>` joins them into single lines. Next, give the cells (`th` and `td`) some `padding`, so the text does not touch the lines. Heading cells are centered by default. `text-align: left` lines them up with the data below them.",
    },
    {
      kind: 'text',
      text: "A long table is easier to read when the rows have two colors, one after the other. These are called **zebra stripes**. The pseudo-class `:nth-child(even)` selects every second child of a parent: the 2nd, the 4th, the 6th and so on. `:nth-child(odd)` selects the 1st, the 3rd, the 5th and so on. With a number, such as `:nth-child(3)`, it selects only the third child.",
    },
    {
      kind: 'example',
      label: 'table.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  th, td {
    border: 1px solid #94a3b8;
  }
  .nice {
    width: 100%;
    border-collapse: collapse;
  }
  .nice th, .nice td {
    padding: 0.5rem 0.75rem;
    text-align: left;
  }
  .nice th {
    background-color: #1e293b;
    color: white;
  }
  .nice tr:nth-child(even) {
    background-color: #e2e8f0;
  }
</style>
</head>
<body>
  <p>Before: double lines and no padding.</p>
  <table>
    <tr><th>Fruit</th><th>Color</th></tr>
    <tr><td>Apple</td><td>Red</td></tr>
    <tr><td>Lemon</td><td>Yellow</td></tr>
  </table>

  <p>After: border-collapse, padding and zebra stripes.</p>
  <table class="nice">
    <tr><th>Fruit</th><th>Color</th><th>Taste</th></tr>
    <tr><td>Apple</td><td>Red</td><td>Sweet</td></tr>
    <tr><td>Lemon</td><td>Yellow</td><td>Sour</td></tr>
    <tr><td>Grape</td><td>Purple</td><td>Sweet</td></tr>
    <tr><td>Lime</td><td>Green</td><td>Sour</td></tr>
    <tr><td>Mango</td><td>Orange</td><td>Sweet</td></tr>
  </table>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The heading row is the first row, so `:nth-child(even)` starts with the second row: Apple, then Grape, then Mango.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In which order should you write the four link rules?',
        options: [
          '`:link`, `:visited`, `:hover`, `:active`',
          '`:hover`, `:active`, `:link`, `:visited`',
          '`:active`, `:hover`, `:visited`, `:link`',
          'Any order works the same way',
        ],
        answer: '`:link`, `:visited`, `:hover`, `:active`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Remove the bullets from the menu list. Fill in the property.',
        code: `.menu {
  [___]: none;
  margin: 0;
  padding: 0;
}`,
        answers: [['list-style', 'list-style-type']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Join the double borders into single lines. Then give every second row (the 2nd, the 4th, and so on) a gray background.',
        code: `table {
  border-collapse: [___];
}
tr:nth-child([___]) {
  background-color: #f1f5f9;
}`,
        answers: ['collapse', ['even', '2n']],
      },
    },
  ],
};
