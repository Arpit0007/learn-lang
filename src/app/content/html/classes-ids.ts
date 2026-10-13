import { Lesson } from '../../shared/content';

export const CLASSES_IDS: Lesson = {
  slug: 'classes-ids',
  title: 'HTML Classes and IDs',
  nav: 'Classes & IDs',
  blocks: [
    {
      kind: 'text',
      text: "Sometimes you want to pick out certain elements on a page, to give them a style or to link to them. HTML has two attributes for this: `class` and `id`. Both give an element a name that you choose yourself.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The class attribute',
    },
    {
      kind: 'text',
      text: "A **class** is a group name. You can give the same class to as many elements as you like, and they do not have to be the same kind of element. Then one CSS rule can style all of them at once. In CSS, you write a dot before the class name: the rule `.note` styles every element that has `class=\"note\"`.",
    },
    {
      kind: 'example',
      label: 'classes.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Classes</title>
  <style>
    .note {
      background-color: lightyellow;
      border-left: 4px solid orange;
      padding: 6px;
    }
  </style>
</head>
<body>
  <h1>School trip</h1>
  <p>We leave at 8 am from the main gate.</p>
  <p class="note">Bring a packed lunch and a water bottle.</p>
  <p>We come back at 4 pm.</p>
  <ul>
    <li>Wear good shoes.</li>
    <li class="note">Pack a raincoat, just in case.</li>
  </ul>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The `<style>` block in the head holds CSS, the language for how pages look. Its `.note` rule gives a yellow background and an orange line to the two elements with the class `note`: a `<p>` and an `<li>`. The other elements keep their normal look.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'One element, many classes',
    },
    {
      kind: 'text',
      text: "An element can have more than one class. Write all the names inside one `class` attribute, with a space between them: `class=\"box green\"`. The element then gets the styles of every class it has. This way, you can build a style from small parts, like building blocks.",
    },
    {
      kind: 'example',
      label: 'many-classes.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Many classes</title>
  <style>
    .box {
      border: 2px solid #555;
      padding: 8px;
    }
    .green {
      background-color: #d9f2d9;
    }
    .big {
      font-size: 24px;
    }
  </style>
</head>
<body>
  <p class="box">This paragraph has one class: box.</p>
  <p class="box green">This one has two classes: box and green.</p>
  <p class="box green big">This one has three: box, green and big.</p>
  <p class="big">And this one has only big.</p>
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
          text: "Do not write two `class` attributes on one element, like `<p class=\"box\" class=\"green\">`. The browser uses only the first one and ignores the second. Put all the names in one attribute instead: `<p class=\"box green\">`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The id attribute',
    },
    {
      kind: 'text',
      text: "An **id** is a name for **one** element only. No two elements on the same page may have the same `id`, just as no two people share the same passport number. In CSS, you write a hash sign `#` before the id: the rule `#today` styles the element that has `id=\"today\"`.",
    },
    {
      kind: 'example',
      label: 'id.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Id</title>
  <style>
    #today {
      color: white;
      background-color: teal;
      padding: 6px;
    }
  </style>
</head>
<body>
  <h1>Bike rides this week</h1>
  <p>Monday: along the river</p>
  <p id="today">Tuesday: to the old castle (that is today!)</p>
  <p>Wednesday: through the forest</p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Linking to an id',
    },
    {
      kind: 'text',
      text: "You met this in the Links lesson. A link with `#` and an id in its `href` jumps to the element with that id. Here, `href=\"#rules\"` points to the heading with `id=\"rules\"`:",
    },
    {
      kind: 'example',
      label: 'jump-link.html',
      run: 'none',
      code: `<p><a href="#rules">Read the safety rules</a></p>

<!-- ... a long page ... -->

<h2 id="rules">Safety rules</h2>
<p>Always wear a helmet.</p>`,
    },
    {
      kind: 'text',
      text: "When a visitor clicks the link, the page scrolls straight down to the heading. This works only with `id`, never with `class`, because a link must point to exactly one place.",
    },
    {
      kind: 'table',
      head: ['Question', '`class`', '`id`'],
      rows: [
        ['How many elements can share one name?', 'Many', 'Only one'],
        ['How many names can one element have?', 'Many, with spaces between them', 'One'],
        ['How do you write it in CSS?', '`.name`', '`#name`'],
        ['Can a link jump to it?', 'No', 'Yes, with `href="#name"`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Class or id?',
      blocks: [
        {
          kind: 'text',
          text: "Use a `class` when a name could fit more than one element. That is most of the time, and it is the usual choice for styles. Use an `id` for one special element, most often a place that links jump to.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Good names',
      blocks: [
        {
          kind: 'text',
          text: "Choose names that say what something *is*, not how it looks. `warning` is better than `red-text`: if you later make your warnings orange, the name still fits. Names cannot contain spaces, so join words with a hyphen (-), like `main-menu`. Capital letters count too: `Note` and `note` are two different names, so it is easiest to use only lowercase.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make the tip green. Fill in how CSS writes the class `tip`, and the attribute that gives the paragraph that class.",
        code: `<style>
  [___] {
    color: green;
  }
</style>
<p [___]="tip">Drink plenty of water.</p>`,
        answers: ['.tip', 'class'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make the link jump to the Prices heading. Fill in the value of `href`, and the attribute that names the heading.",
        code: `<a href="[___]">See our prices</a>

<h2 [___]="prices">Prices</h2>`,
        answers: ['#prices', 'id'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'How do you give one element the two classes `box` and `green`?',
        options: [
          '`class="box green"`',
          '`class="box, green"`',
          '`class="box" class="green"`',
          '`id="box green"`',
        ],
        answer: '`class="box green"`',
      },
    },
  ],
};
