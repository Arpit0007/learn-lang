import { Lesson } from '../../shared/content';

export const MODERN_CSS: Lesson = {
  slug: 'modern-css',
  title: 'Modern CSS: Nesting, :has() and Container Queries',
  nav: 'Modern CSS',
  blocks: [
    {
      kind: 'text',
      text: "CSS keeps growing. In the last few years, browsers added features that used to need extra tools or JavaScript. This lesson shows three of them: **nesting**, the `:has()` selector and **container queries**.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Browser support',
      blocks: [
        {
          kind: 'text',
          text: "These features work in the current versions of all major browsers, such as Chrome, Edge, Firefox and Safari. Very old browsers, from before 2024, may not support them. Those browsers skip the rules that they do not understand.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Nesting',
    },
    {
      kind: 'text',
      text: "With **nesting**, you write one rule inside another rule. The inner rule works only inside the outer one. So all the styles for one part of the page stay together in one place.",
    },
    {
      kind: 'example',
      label: 'nesting.css',
      lang: 'css',
      run: 'none',
      code: `.card {
  padding: 1rem;

  h2 {
    color: navy;
  }
}

/* The same CSS without nesting: */
.card {
  padding: 1rem;
}
.card h2 {
  color: navy;
}`,
    },
    {
      kind: 'text',
      text: "The nested `h2` rule means `.card h2`: every `<h2>` inside an element with class `card`. This is the descendant selector from the Selectors lesson.",
    },
    {
      kind: 'text',
      text: "Inside a nested rule, `&` stands for the outer selector. Use it when there must be **no space** between the two parts, for example with a pseudo-class. Inside `.button`, `&:hover` means `.button:hover`.",
    },
    {
      kind: 'example',
      label: 'nesting.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .card {
    max-width: 20rem;
    padding: 1rem;
    border: 2px solid #cbd5e1;
    border-radius: 8px;

    h2 {
      margin-top: 0;
      color: #1e3a8a;
    }

    a {
      color: #db2777;

      &:hover {
        color: #831843;
      }
    }

    &:hover {
      border-color: #db2777;
    }
  }
</style>
</head>
<body>
  <div class="card">
    <h2>Inside the card</h2>
    <p>This heading is dark blue, and <a href="#">this link</a> is pink.</p>
  </div>
  <h2>Outside the card</h2>
  <p>This heading and <a href="#">this link</a> keep their normal style.</p>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Do not forget the &',
      blocks: [
        {
          kind: 'text',
          text: "Without `&`, the browser puts a space in front of the nested selector. Then `:hover` inside `.button` means `.button :hover`, with a space. That selects any hovered element *inside* the button, not the button itself.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The :has() selector',
    },
    {
      kind: 'text',
      text: "`:has()` is a pseudo-class with a selector inside its brackets. It selects an element **if it contains** something that matches. `.card:has(img)` selects every `.card` that has an image inside it. For a long time, CSS could choose an element by looking at its parents, but never by looking at what is inside it. That is why people call `:has()` the **parent selector**.",
    },
    {
      kind: 'text',
      text: "Compare the two: `.card img` styles the **image** inside a card. `.card:has(img)` styles the **card** itself. In the next example, `:checked` is a pseudo-class for a checkbox that is ticked.",
    },
    {
      kind: 'example',
      label: 'has.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  .option {
    display: block;
    max-width: 16rem;
    margin-bottom: 0.5rem;
    padding: 0.75rem;
    border: 2px solid #cbd5e1;
    border-radius: 8px;
  }
  .option:has(input:checked) {
    border-color: #16a34a;
    background-color: #dcfce7;
    color: #14532d;
  }
  body:has(#dark:checked) {
    background-color: #1e293b;
    color: white;
  }
</style>
</head>
<body>
  <h2>Choose your pizza toppings</h2>
  <label class="option"><input type="checkbox"> Cheese</label>
  <label class="option"><input type="checkbox" checked> Tomato</label>
  <label class="option"><input type="checkbox"> Mushrooms</label>
  <hr>
  <label><input type="checkbox" id="dark"> Dark page</label>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Open the example with **Try it Yourself** and click the toppings. When a checkbox is ticked, the label around it turns green, because `.option:has(input:checked)` now matches the label. The last checkbox changes the whole page, with `body:has(#dark:checked)`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Container queries',
    },
    {
      kind: 'text',
      text: "A media query asks: *how wide is the screen?* A **container query** asks: *how wide is the box I am in?* So a **component** (a reusable part of a page, like a card) can change its layout to fit the space it gets. It can be narrow in a sidebar and wide in the main column, on the same screen.",
    },
    {
      kind: 'text',
      text: "There are two steps. First, make a parent element a **container** with `container-type: inline-size`. **Inline size** is the size in the direction that text runs, which is the width in most languages. Then write your rules inside `@container`, which works like `@media`. For example, `@container (min-width: 20rem) { ... }` applies its rules inside any container that is at least `20rem` wide.",
    },
    {
      kind: 'example',
      label: 'container-query.html',
      code: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * {
    box-sizing: border-box;
  }
  body {
    font-family: system-ui, sans-serif;
  }
  .layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
    max-width: 60rem;
  }
  .sidebar,
  .main {
    container-type: inline-size;
    padding: 0.5rem;
    border-radius: 8px;
    background-color: #e2e8f0;
  }
  .label {
    margin: 0 0 0.5rem;
    font-size: 0.8rem;
    color: #475569;
  }
  .card {
    display: grid;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 8px;
    background-color: white;
  }
  .card img {
    width: 100%;
    height: auto;
  }
  .card h3,
  .card p {
    margin: 0;
  }

  /* Only when the container is at least 20rem wide */
  @container (min-width: 20rem) {
    .card {
      grid-template-columns: 6rem 1fr;
      align-items: center;
    }
  }
</style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <p class="label">Sidebar</p>
      <article class="card">
        <img src="/assets/img/css-plant.svg" alt="A green plant in an orange pot" width="200" height="200">
        <div>
          <h3>Snake plant</h3>
          <p>Needs little water and little light.</p>
        </div>
      </article>
    </aside>
    <main class="main">
      <p class="label">Main column</p>
      <article class="card">
        <img src="/assets/img/css-plant.svg" alt="A green plant in an orange pot" width="200" height="200">
        <div>
          <h3>Snake plant</h3>
          <p>Needs little water and little light.</p>
        </div>
      </article>
    </main>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Open this example with **Try it Yourself**. Both cards have the same HTML and the same CSS. In the wide main column, the picture sits next to the text. In the narrow sidebar, they are stacked. Now press **Phone** above the result: the main column gets narrow too, so its card stacks. Press **Tablet** or **Full**, and the picture moves back next to the text.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Style the inside, not the container',
      blocks: [
        {
          kind: 'text',
          text: "A container query styles the elements **inside** a container, never the container itself. So put `container-type` on a parent element, like `.sidebar`, and style the `.card` inside it.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the button darker when the mouse is over it. Fill in the symbol that stands for the outer selector.',
        code: `.button {
  background-color: teal;

  [___]:hover {
    background-color: darkslategray;
  }
}`,
        answers: ['&'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make `.sidebar` a container. Then turn each card inside it into a flex row, but only when the sidebar is at least `30rem` wide. Fill in the value and the word after the `@` sign.',
        code: `.sidebar {
  container-type: [___];
}
@[___] (min-width: 30rem) {
  .card {
    display: flex;
  }
}`,
        answers: ['inline-size', 'container'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which selector styles a `.card` only when it has an `<img>` inside it?',
        options: ['`.card:has(img)`', '`.card img`', '`img:has(.card)`', '`.card, img`'],
        answer: '`.card:has(img)`',
      },
    },
  ],
};
