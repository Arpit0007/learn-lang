import { Lesson } from '../../shared/content';

export const SYNTAX: Lesson = {
  slug: 'syntax',
  title: 'CSS Syntax',
  nav: 'Syntax',
  blocks: [
    {
      kind: 'text',
      text: "CSS is a list of **rules**. Each rule says two things: *which* elements to style, and *how* to style them. Here is one rule:",
    },
    {
      kind: 'example',
      label: 'one-rule.css',
      lang: 'css',
      run: 'none',
      code: `h1 {
  color: teal;
  font-size: 2rem;
}`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The parts of a rule',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Selector**: `h1`. It chooses the elements to style. Here, every `<h1>` on the page.",
        "**Declaration block**: everything between the curly braces `{` and `}`.",
        "**Declaration**: one instruction, such as `color: teal;`. A block can hold many declarations.",
        "**Property**: the thing you want to change, such as `color` or `font-size`.",
        "**Value**: the setting for that property, such as `teal` or `2rem`.",
      ],
    },
    {
      kind: 'text',
      text: "Write the property, then a colon `:`, then the value, then a semicolon `;`. The semicolon ends the declaration, so the browser knows where the next one starts.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "A missing semicolon breaks more than one line. In `color: teal font-size: 2rem;` the browser reads `teal font-size: 2rem` as the value of `color`. That value makes no sense, so the browser ignores the whole declaration, and neither the color nor the size is applied. Always end each declaration with `;`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Comments',
    },
    {
      kind: 'text',
      text: "A **comment** is a note for people. The browser skips it. In CSS, a comment starts with `/*` and ends with `*/`. It can be one line or many lines. You can also use a comment to switch off a declaration for a moment, without deleting it.",
    },
    {
      kind: 'example',
      label: 'syntax.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  /* Main heading: big and teal */
  h1 {
    color: teal;
    font-size: 2rem;
  }

  p {
    color: #444444;
    /* font-size: 2rem; */
  }

  /* A short rule can also fit on one line */
  em { color: crimson; }
</style>
</head>
<body>
  <h1>CSS syntax</h1>
  <p>This paragraph keeps its normal size, because its font-size line is a comment.</p>
  <p>Words in <em>this tag</em> are red.</p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Spaces and new lines',
    },
    {
      kind: 'text',
      text: "CSS does not care about extra spaces or line breaks between the parts of a rule. `em { color: crimson; }` on one line works the same as the long form. Most people put one declaration on each line, because it is easier to read and change.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Fill in the selector so this rule styles every paragraph on the page.',
        code: `[___] {
  color: gray;
}`,
        answers: ['p'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In the rule `h1 { color: teal; }`, what is `color`?',
        options: ['A property', 'A value', 'A selector', 'A comment'],
        answer: 'A property',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which one is a correct CSS comment?',
        options: ['`/* note */`', '`// note`', '`<!-- note -->`', '`# note`'],
        answer: '`/* note */`',
      },
    },
  ],
};
