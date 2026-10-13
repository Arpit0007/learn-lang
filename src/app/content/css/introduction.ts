import { Lesson } from '../../shared/content';

export const INTRODUCTION: Lesson = {
  slug: 'introduction',
  title: 'CSS Introduction: adding CSS to a page',
  nav: 'Introduction',
  blocks: [
    {
      kind: 'text',
      text: "Before CSS can style a page, the browser must find it. There are three places where you can put CSS: in an HTML attribute, in a `<style>` element, or in a separate file.",
    },
    {
      kind: 'text',
      text: "A piece of CSS that styles something is called a **rule**. For example, the rule `p { color: green; }` makes all paragraphs green. You will learn how rules are written in the next lesson.",
    },
    {
      kind: 'heading',
      level: 3,
      text: '1. Inline styles',
    },
    {
      kind: 'text',
      text: "An **inline style** sits inside one HTML tag, in the `style` attribute. It changes only that one element. It is quick for testing, but it is hard to manage on a big page.",
    },
    {
      kind: 'heading',
      level: 3,
      text: '2. Internal style sheet',
    },
    {
      kind: 'text',
      text: "An **internal style sheet** is a `<style>` element inside the `<head>` of the page. Its rules apply to the whole page. The examples in this course use this method, because everything fits in one file.",
    },
    {
      kind: 'example',
      label: 'inline-and-internal.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  p {
    color: darkgreen;
  }
</style>
</head>
<body>
  <p>This paragraph is green. The rule in the style element sets it.</p>
  <p>This one is green too. One rule styles every paragraph.</p>
  <p style="color: crimson;">This one is red, because its inline style wins.</p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: '3. External style sheet',
    },
    {
      kind: 'text',
      text: "An **external style sheet** is a separate file that ends in `.css`. Each HTML page links to it with a `<link>` element in the `<head>`. Many pages can share one file, so you change the look of a whole website in one place. Real websites usually work this way.",
    },
    {
      kind: 'example',
      label: 'index.html',
      lang: 'html',
      run: 'none',
      code: `<head>
  <title>My site</title>
  <link rel="stylesheet" href="styles.css">
</head>`,
    },
    {
      kind: 'example',
      label: 'styles.css',
      lang: 'css',
      run: 'none',
      code: `body {
  font-family: system-ui, sans-serif;
}

h1 {
  color: navy;
}`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not forget `rel=\"stylesheet\"` in the `<link>` tag. Without it, the browser does not know the file is CSS, and it ignores it. Also check that the `href` matches the file name exactly.",
        },
      ],
    },
    {
      kind: 'table',
      head: ['Method', 'Where the CSS goes', 'Good for'],
      rows: [
        ['Inline', 'The `style` attribute of one tag', 'A quick test on one element'],
        ['Internal', 'A `<style>` element in the `<head>`', 'One single page'],
        ['External', 'A `.css` file, linked with `<link>`', 'A website with many pages'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Which rule wins?',
      blocks: [
        {
          kind: 'text',
          text: "Sometimes two rules give the same element different styles. An inline style wins over a style sheet. If two rules in style sheets use the same selector, the one written **later** wins. This order of winning is the *cascade* in Cascading Style Sheets.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Complete the tag so the browser loads `styles.css` as a style sheet.',
        code: `<link [___]="stylesheet" href="styles.css">`,
        answers: ['rel'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Where does the `<style>` element belong?',
        options: [
          'Inside the `<head>`',
          'Inside a `<p>` element',
          'After the closing `</html>` tag',
          'Inside the `<title>`',
        ],
        answer: 'Inside the `<head>`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You build a website with 20 pages that should all look the same. Which method is best?',
        options: [
          'An external style sheet',
          'Inline styles on every tag',
          'A `<style>` element copied into every page',
        ],
        answer: 'An external style sheet',
      },
    },
  ],
};
