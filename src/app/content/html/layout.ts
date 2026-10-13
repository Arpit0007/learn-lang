import { Lesson } from '../../shared/content';

export const LAYOUT: Lesson = {
  slug: 'layout',
  title: 'HTML Page Layout',
  nav: 'Page layout',
  blocks: [
    {
      kind: 'text',
      text: "Most websites are built from the same main parts: a top area with the site name, a menu, the main content, sometimes a side box, and a bottom area. HTML has a special element for each of these parts. Together they describe the **layout** of the page: how the page is divided up.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Layout elements',
    },
    {
      kind: 'text',
      text: "These elements are called **semantic** elements. *Semantic* means *about meaning*: the name of each element says what its part of the page is for.",
    },
    {
      kind: 'table',
      head: ['Element', 'What it holds'],
      rows: [
        ['`<header>`', 'The top of the page: usually the logo or site name'],
        ['`<nav>`', 'The main menu: links to the other pages of the site (*nav* is short for *navigation*)'],
        ['`<main>`', 'The main content of the page. Use it only once on each page.'],
        ['`<section>`', 'One part of the content, with its own heading'],
        ['`<article>`', 'A piece that makes sense on its own, such as a news story or a blog post'],
        ['`<aside>`', 'Extra information next to the main content, such as tips or related links'],
        ['`<footer>`', 'The bottom of the page: contact details, copyright and similar'],
      ],
    },
    {
      kind: 'text',
      text: "Here is a small café website that uses all of them. The `<style>` block only draws a dashed line around each part, so you can see where it is:",
    },
    {
      kind: 'example',
      label: 'layout.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Green Bean Café</title>
  <style>
    header, nav, main, section, article, aside, footer {
      border: 1px dashed #999; margin: 6px; padding: 6px;
    }
  </style>
</head>
<body>
  <header>
    <h1>Green Bean Café</h1>
  </header>
  <nav>
    <a href="#menu">Menu</a> | <a href="#news">News</a>
  </nav>
  <main>
    <section id="menu">
      <h2>Menu</h2>
      <p>Coffee, tea and fresh cakes every day.</p>
    </section>
    <section id="news">
      <h2>News</h2>
      <article>
        <h3>New lemon cake</h3>
        <p>Try our new lemon cake, baked every morning.</p>
      </article>
      <article>
        <h3>Longer opening hours</h3>
        <p>From June we are open until 8 pm.</p>
      </article>
    </section>
  </main>
  <aside>
    <p>Tip: Tuesday is the quietest day.</p>
  </aside>
  <footer>
    <p>Green Bean Café, 12 River Road</p>
  </footer>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The two news stories are each an `<article>`, because each one makes sense on its own. The \"Menu\" and \"News\" parts are each a `<section>`, because they are parts of the page with their own heading.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'They do not change the look',
      blocks: [
        {
          kind: 'text',
          text: "Like `<div>`, these elements are block elements with no special look of their own. A `<nav>` does not make a menu bar, and an `<aside>` does not move to the side. You add the look later with CSS. Their job is to say what each part *is*.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Why not use div for everything?',
    },
    {
      kind: 'text',
      text: "You could build the same page with only `<div>` elements, and it would look exactly the same. So why use the semantic elements? Compare these two:",
    },
    {
      kind: 'example',
      label: 'div-or-nav.html',
      run: 'none',
      code: `<!-- Only divs: what is this box for? -->
<div>
  <a href="#menu">Menu</a> | <a href="#news">News</a>
</div>

<!-- Semantic: this is clearly the menu -->
<nav>
  <a href="#menu">Menu</a> | <a href="#news">News</a>
</nav>`,
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Screen readers** can jump straight to the `<nav>` or the `<main>` content, so people who cannot see the page find what they need faster.",
        "**Search engines**, such as Google, understand which part of the page is the real content.",
        "**You and other people** can read the code more easily. `<footer>` is clearer than a tenth `<div>`.",
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Meaning first',
      blocks: [
        {
          kind: 'text',
          text: "If one of the semantic elements fits a part of your page, use it. Keep `<div>` for boxes that have no special meaning, for example a box you only need for styling.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The head of the page',
    },
    {
      kind: 'text',
      text: "The layout elements all go in the `<body>`. The `<head>` holds information *about* the page. Every page should have at least these three lines in its head:",
    },
    {
      kind: 'example',
      label: 'head.html',
      run: 'none',
      code: `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Green Bean Café</title>
</head>`,
    },
    {
      kind: 'table',
      head: ['Line', 'What it does'],
      rows: [
        ['`<meta charset="utf-8">`', "Lets the page show letters from every language, plus symbols such as é and €."],
        ['`<meta name="viewport" ...>`', "Makes the page fit the width of the screen. The **viewport** is the part of the screen that shows the page. Without this line, phones show a tiny zoomed-out page."],
        ['`<title>`', "The page name shown in the browser tab and in search results."],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not use `<main>` more than once on a page. There is only one main content. If you have several parts, put several `<section>` or `<article>` elements *inside* one `<main>`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Mark these links as the main menu of the site. Fill in the element name in the start tag and the end tag.",
        code: `<[___]>
  <a href="#home">Home</a> | <a href="#shop">Shop</a>
</[___]>`,
        answers: ['nav', 'nav'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Complete the head. The first line lets the page show every language. The second makes the page fit phone screens. Fill in the attribute name and the value.",
        code: `<meta [___]="utf-8">
<meta name="[___]" content="width=device-width, initial-scale=1">`,
        answers: ['charset', 'viewport'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which element holds the main content of the page, and should be used only once?',
        options: ['`<main>`', '`<section>`', '`<article>`', '`<div>`'],
        answer: '`<main>`',
      },
    },
  ],
};
