import { Lesson } from '../../shared/content';

export const VARIABLES: Lesson = {
  slug: 'variables',
  title: 'CSS Variables',
  nav: 'Variables',
  blocks: [
    {
      kind: 'text',
      text: "Imagine that your website uses the same blue in 20 places. One day, you want a different blue. Without variables, you must find and change all 20. A **CSS variable** stores a value once, under a name. You use the name everywhere. Change the value in one place, and every use changes with it.",
    },
    {
      kind: 'text',
      text: "The official name for CSS variables is **custom properties**. You will see both names. They mean the same thing.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Making and using a variable',
    },
    {
      kind: 'text',
      text: "A variable is like a property that you invent yourself. Its name must start with two dashes, such as `--brand`. You give it a value like any other property: `--brand: #2563eb;`.",
    },
    {
      kind: 'text',
      text: "To use the variable, write `var(--brand)` where a value goes, for example `color: var(--brand);`. The `var()` function reads the value of the variable. The browser then uses `#2563eb`, just as if you had written it there yourself.",
    },
    {
      kind: 'text',
      text: "Most variables are defined in a rule for `:root`. This selector selects the **root** of the page: the `<html>` element, which holds every other element. Variables are inherited, like `color`. So every element on the page can use a variable that is defined on `:root`.",
    },
    {
      kind: 'example',
      label: 'variables.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  :root {
    --brand: #2563eb;
    --brand-light: #dbeafe;
    --radius: 8px;
  }
  body {
    font-family: system-ui, sans-serif;
  }
  h1 {
    color: var(--brand);
  }
  .card {
    padding: 1rem;
    border: 2px solid var(--brand);
    border-radius: var(--radius);
    background-color: var(--brand-light);
  }
  .button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    background-color: var(--brand);
    color: white;
    text-decoration: none;
  }
  .note {
    color: var(--accent, #c2410c);
  }
</style>
</head>
<body>
  <h1>Summer camp</h1>
  <div class="card">
    <p>Three variables style this whole page.</p>
    <p class="note">There is no --accent variable, so this text uses the fallback color.</p>
    <a class="button" href="#">Sign up</a>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Try it: change `--brand` to `#16a34a` and `--brand-light` to `#dcfce7`, then press **Run**. The heading, the border and the button all turn green together. Change `--radius` to `0` for square corners.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Fallback values',
    },
    {
      kind: 'text',
      text: "`var()` can take a second value, after a comma. This is the **fallback**: the value to use when the variable does not exist. In the example, `color: var(--accent, #c2410c);` uses `#c2410c` (a dark orange), because no `--accent` variable is defined. Add `--accent: purple;` to the `:root` rule, and the note turns purple.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Always put the name inside `var()`. `color: --brand;` does not work: the browser does not understand the value, so it ignores the whole line. Also, names are case-sensitive. `--brand` and `--Brand` are two different variables.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Changing a variable inside an element',
    },
    {
      kind: 'text',
      text: "You can give a variable a new value in any rule, not only in `:root`. The new value is used inside the elements that the rule selects, and inside their children. The rest of the page keeps the value from `:root`.",
    },
    {
      kind: 'text',
      text: "This makes **themes** easy. A theme is a set of colors for a page, or for a part of a page, such as a light theme and a dark theme. Write all your rules with variables. Then a theme only needs to change the variables.",
    },
    {
      kind: 'example',
      label: 'themes.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  :root {
    --page: #ffffff;
    --text: #1f2937;
    --card: #f3f4f6;
    --link: #1d4ed8;
  }
  .dark {
    --page: #111827;
    --text: #f9fafb;
    --card: #374151;
    --link: #93c5fd;
  }
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
  .theme {
    padding: 1rem;
    background-color: var(--page);
    color: var(--text);
  }
  .card {
    padding: 1rem;
    border-radius: 8px;
    background-color: var(--card);
  }
  .card a {
    color: var(--link);
  }
</style>
</head>
<body>
  <section class="theme">
    <h2>Light theme</h2>
    <div class="card">The same rules style both parts of this page. <a href="#">A link</a></div>
  </section>
  <section class="theme dark">
    <h2>Dark theme</h2>
    <div class="card">Only the values of the variables are different here. <a href="#">A link</a></div>
  </section>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Both sections use exactly the same rules. The second section also has the class `dark`, and the `.dark` rule gives the four variables new values. So everything inside that section uses the dark colors.",
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Dark mode for the whole page',
      blocks: [
        {
          kind: 'text',
          text: "Many people turn on dark mode on their phone or computer. The media query `prefers-color-scheme: dark` is true when they do. (You met media queries in the Responsive Design lesson.) Give the variables dark values inside it, and your whole page follows their choice.",
        },
        {
          kind: 'example',
          label: 'dark-mode.css',
          lang: 'css',
          run: 'none',
          code: `@media (prefers-color-scheme: dark) {
  :root {
    --page: #111827;
    --text: #f9fafb;
    --card: #374151;
    --link: #93c5fd;
  }
}`,
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Create a variable named `--green` on `:root`. Then use it as the color of the heading. Fill in the variable name and the function name.',
        code: `:root {
  [___]: #16a34a;
}
h1 {
  color: [___](--green);
}`,
        answers: ['--green', 'var'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'If the variable `--accent` does not exist, the text should be `gray`. Fill in the fallback value.',
        code: `p {
  color: var(--accent, [___]);
}`,
        answers: [['gray', 'grey']],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: '`:root` sets `--main: blue;` and `.alert` sets `--main: red;`. A paragraph inside `.alert` has `color: var(--main);`. What color is the paragraph?',
        options: ['Red', 'Blue', 'Black', 'Purple'],
        answer: 'Red',
      },
    },
  ],
};
