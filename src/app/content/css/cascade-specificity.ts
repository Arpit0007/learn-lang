import { Lesson } from '../../shared/content';

export const CASCADE_SPECIFICITY: Lesson = {
  slug: 'cascade-specificity',
  title: 'CSS Cascade, Specificity and Inheritance',
  nav: 'Cascade & specificity',
  blocks: [
    {
      kind: 'text',
      text: "Often, two rules give the same element different values for the same property. One rule says the text is blue, and another says it is green. Only one value can win. The way the browser chooses the winner is called the **cascade**. It is the \"C\" in CSS.",
    },
    {
      kind: 'text',
      text: "In this lesson you will learn the rules of the cascade, one at a time. You will also learn about **inheritance**: how some styles pass down from an element to the elements inside it.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Order: the later rule wins',
    },
    {
      kind: 'text',
      text: "When two rules use the same selector, the rule that comes **later** in the CSS wins. This is also true across files. If a page links two style sheets, a rule in the second file wins over the same rule in the first file.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Specificity: the more exact selector wins',
    },
    {
      kind: 'text',
      text: "When the selectors are different, the browser gives each selector a score. This score is called **specificity**. A more exact selector gets a higher score. The rule with the higher score wins, even if it comes earlier in the CSS.",
    },
    {
      kind: 'text',
      text: "To find the score, count three kinds of parts in the selector:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Ids**, such as `#intro`.",
        "**Classes**, such as `.note`. Pseudo-classes, such as `:hover`, count as classes too.",
        "**Elements**, such as `p` or `h1`.",
      ],
    },
    {
      kind: 'text',
      text: "Write the three numbers in this order: ids, classes, elements. So `#intro` scores 1-0-0, and `p` scores 0-0-1. To compare two scores, read them from left to right. The first number that is different decides.",
    },
    {
      kind: 'table',
      head: ['Selector', 'Ids', 'Classes', 'Elements', 'Score'],
      rows: [
        ['`p`', '0', '0', '1', '0-0-1'],
        ['`nav a`', '0', '0', '2', '0-0-2'],
        ['`.note`', '0', '1', '0', '0-1-0'],
        ['`.menu a`', '0', '1', '1', '0-1-1'],
        ['`#intro`', '1', '0', '0', '1-0-0'],
      ],
    },
    {
      kind: 'example',
      label: 'specificity.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }

  /* The same selector twice: the later rule wins */
  h1 { color: orange; }
  h1 { color: teal; }

  /* Different selectors: the higher score wins, whatever the order */
  #special { color: crimson; }
  .note    { color: green; }
  p        { color: blue; }
</style>
</head>
<body>
  <h1>Teal: the second h1 rule comes later</h1>
  <p>Blue: only the p rule matches this paragraph.</p>
  <p class="note">Green: .note (0-1-0) beats p (0-0-1).</p>
  <p class="note" id="special">Crimson: #special (1-0-0) beats .note and p.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The `p` rule comes last, but it loses to `.note` and `#special`, because their scores are higher. Order only decides when the scores are equal, like the two `h1` rules.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "One id beats any number of classes. One class beats any number of elements. The universal selector `*` scores 0-0-0. An inline style, written in the `style` attribute, beats every selector.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: '!important, and why to avoid it',
    },
    {
      kind: 'text',
      text: "You can add `!important` after a value, before the semicolon. That declaration then wins over all normal declarations for the same property, whatever their selectors are.",
    },
    {
      kind: 'example',
      label: 'important.css',
      lang: 'css',
      run: 'none',
      code: `#title {
  color: blue;
}
h1 {
  color: red !important; /* wins, even against the id */
}`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "When a rule does not work, it is tempting to add `!important`. Try not to. It hides the real problem, and the only way to beat an `!important` is another `!important`. Soon, nothing in your CSS is easy to change. Instead, find the rule that wins, then use a selector with a higher score or change the order of the rules.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Inheritance',
    },
    {
      kind: 'text',
      text: "Some properties pass down from an element to the elements inside it, its **children**. This is called **inheritance**. If you set `color` on `<body>`, every paragraph, heading and list on the page gets that color, without a rule of its own.",
    },
    {
      kind: 'text',
      text: "Mostly, **text** properties are inherited. Properties for the **box** itself, such as borders and spacing, are not. If borders were inherited, every paragraph inside a box with a border would get a border too. That would look strange.",
    },
    {
      kind: 'table',
      head: ['Inherited', 'Not inherited'],
      rows: [
        ['`color`', '`border`'],
        ['`font-family`, `font-size`, `font-weight`', '`padding`, `margin`'],
        ['`line-height`, `text-align`', '`width`, `height`'],
        ['`list-style`', '`background-color`'],
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "`background-color` is not inherited. But the background of a child is transparent by default, so you see the background of the parent through it. That is why it can look inherited.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'inherit and initial',
    },
    {
      kind: 'text',
      text: "Two special values work with every property. `inherit` takes the value from the parent, even for a property that is not normally inherited. `initial` sets a property back to its **initial value**: the default value that CSS gives it. For `color`, that is usually black.",
    },
    {
      kind: 'text',
      text: "A common use of `inherit`: links have their own blue color. With `a { color: inherit; }`, links take the color of the text around them.",
    },
    {
      kind: 'example',
      label: 'inheritance.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  .card {
    padding: 1rem;
    border: 3px solid #166534;
    color: #166534;
    font-family: system-ui, sans-serif;
  }
  .card a {
    color: inherit;
  }
  .boxed {
    padding: 0.5rem;
    border: inherit;
  }
  .reset {
    color: initial;
  }
</style>
</head>
<body>
  <p>Outside the card: the default color and the default font.</p>
  <div class="card">
    <p>I get the green color and the font from the card, but not its border.</p>
    <p>This <a href="#">link</a> is green too, because of color: inherit.</p>
    <p class="boxed">border: inherit copies the border of the card to me.</p>
    <p class="reset">color: initial makes me black again. I keep the font of the card.</p>
  </div>
</body>
</html>`,
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'The CSS has `#title { color: red; }` first, and `h1 { color: blue; }` after it. What color is `<h1 id="title">`?',
        options: [
          'Red: the id selector has the higher score',
          'Blue: the h1 rule comes later',
          'Purple: the two colors mix',
          'Black: the two rules cancel each other out',
        ],
        answer: 'Red: the id selector has the higher score',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You set one of these properties on a `<div>`. Which one do the paragraphs inside the `<div>` also get, by inheritance?',
        options: ['`color`', '`border`', '`padding`', '`margin`'],
        answer: '`color`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the links inside `.footer` take the color of the text around them.',
        code: `.footer a {
  color: [___];
}`,
        answers: [['inherit', 'currentcolor', 'currentColor']],
      },
    },
  ],
};
