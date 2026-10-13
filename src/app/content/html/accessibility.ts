import { Lesson } from '../../shared/content';

export const ACCESSIBILITY: Lesson = {
  slug: 'accessibility',
  title: 'HTML Accessibility',
  nav: 'Accessibility',
  blocks: [
    {
      kind: 'text',
      text: "**Accessibility** means making pages that everyone can use, including people with disabilities. It is often written as **a11y**: the letter *a*, then 11 more letters, then *y*. The good news is that most of accessibility is simply good HTML, and you already know most of the tools.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Who it helps',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "People who are **blind** or cannot see well. Many of them use a **screen reader**, a program that reads the page aloud.",
        "People who **cannot use a mouse**. They move around the page with the keyboard instead.",
        "People who are **deaf** or cannot hear well. They need written text for sounds and videos.",
        "People who find reading hard, and people who are reading in a second language. Clear, simple pages help them.",
        "**Everyone**, some of the time: in bright sunlight, with a broken arm, or with a baby in one arm.",
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Text for every image',
    },
    {
      kind: 'text',
      text: "Every `<img>` needs an `alt` attribute. If the picture gives information, describe it in a few words. If it is only decoration, such as a pretty line, give it an **empty** value: `alt=\"\"`. Screen readers then skip it. Never leave `alt` out completely: many screen readers then read the file name aloud instead, which helps nobody.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not start alt text with *image of* or *picture of*. Screen readers already say that it is an image. Write `alt=\"A pink flower\"`, not `alt=\"Image of a pink flower\"`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Headings, language and labels',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**One `<h1>`, then headings in order.** Screen reader users often jump from heading to heading to find their way, just as you scan a page with your eyes. Give each page one `<h1>`, use `<h2>` for its main sections and `<h3>` inside those. Do not skip levels.",
        "**`lang` on the `<html>` element.** It tells screen readers which language to speak. Without it, a Spanish page might be read aloud with English sounds, which is very hard to follow.",
        "**A label for every field.** Connect each `<label>` to its field with `for` and `id`. When the visitor reaches the field, the screen reader then says its label, such as *Email*.",
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Landmarks',
    },
    {
      kind: 'text',
      text: "The layout elements `<header>`, `<nav>`, `<main>`, `<aside>` and `<footer>` are also called **landmarks**. Screen readers can list them, so their users can jump straight to the menu or to the main content, without listening to the whole page first. This page puts all the good habits together:",
    },
    {
      kind: 'example',
      label: 'accessible-page.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sunflower Garden Club</title>
</head>
<body>
  <header>
    <h1>Sunflower Garden Club</h1>
    <img src="/assets/img/html-divider.svg" alt="" width="240" height="24">
  </header>
  <nav>
    <a href="https://example.com/">Home</a> |
    <a href="https://example.com/events">Events</a> |
    <a href="https://example.com/contact">Contact us</a>
  </nav>
  <main>
    <h2>Our plants</h2>
    <img src="/assets/img/html-flower.svg" alt="A pink flower with a yellow centre" width="120" height="160">
    <p>We grow flowers and vegetables together. <a href="https://example.com/times">See our opening times</a>.</p>

    <h2>Join the club</h2>
    <form onsubmit="event.preventDefault()">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
      <button type="submit">Join</button>
    </form>
  </main>
  <footer>
    <p>Sunflower Garden Club, 3 Park Lane</p>
  </footer>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Look for each habit in the code: `lang` on `<html>`, one `<h1>` and then `<h2>` sections, the landmarks, an empty `alt` on the decoration, a real description on the flower, a label for the email box, and link text that makes sense on its own.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Link text that makes sense alone',
    },
    {
      kind: 'text',
      text: "Screen readers can list all the links on a page. In that list, five links called *click here* tell the user nothing. Write link text that says where the link goes, even when it is read on its own:",
    },
    {
      kind: 'example',
      label: 'link-text.html',
      run: 'none',
      code: `<!-- Not good: "here" says nothing on its own -->
<p>For our opening times, click <a href="https://example.com/times">here</a>.</p>

<!-- Good: the link text says where it goes -->
<p>See our <a href="https://example.com/times">opening times</a>.</p>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Using the keyboard',
    },
    {
      kind: 'text',
      text: "Many people use the keyboard instead of a mouse. They press **Tab** to move to the next link, button or field, **Shift + Tab** to move back, and **Enter** to follow a link or press a button. The element that the keyboard is on has the **focus**, and the browser draws a ring around it. Never hide that ring with CSS, unless you give the focus another clear look.",
    },
    {
      kind: 'text',
      text: "Real links, buttons and form fields work with the keyboard by themselves. A `<span>` or `<div>` that only *looks* like a button does not. Open this example, click once on an empty part of the result, then press **Tab** a few times:",
    },
    {
      kind: 'example',
      label: 'keyboard.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Keyboard</title>
  <style>
    .fake-button {
      padding: 2px 8px;
      border: 1px solid #767676;
      border-radius: 3px;
      background-color: #efefef;
    }
  </style>
</head>
<body>
  <h1>Try the Tab key</h1>
  <p><a href="https://example.com">A real link</a></p>
  <p><button>A real button</button></p>
  <p><span class="fake-button">A span that only looks like a button</span></p>
  <p>
    <label for="name">Your name</label>
    <input type="text" id="name" name="name">
  </p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The focus moves from the link to the button, and then to the text box. It jumps over the span, so a keyboard user could never press it. That is why you should always use `<a>` for links and `<button>` for buttons.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'ARIA: only when HTML is not enough',
    },
    {
      kind: 'text',
      text: "**ARIA** is a set of extra attributes for screen readers, such as `aria-label`. (*ARIA* stands for *Accessible Rich Internet Applications*.) ARIA changes what a screen reader says, but not how the page looks or works. For example, `aria-label` gives a name to a button that shows only a symbol. Without it, a screen reader might read the symbol as *multiplication x*, or say nothing useful:",
    },
    {
      kind: 'example',
      label: 'aria-label.html',
      run: 'none',
      code: `<button aria-label="Close">✕</button>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'No ARIA is better than bad ARIA',
      blocks: [
        {
          kind: 'text',
          text: "Always try a real HTML element first. `<button>`, `<nav>`, `<label>` and the others already tell screen readers what they are. Wrong ARIA can make a page *harder* to use than no ARIA at all, so add it only when plain HTML cannot do the job.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Test it yourself',
      blocks: [
        {
          kind: 'text',
          text: "Try using your page with only the keyboard. You can also listen to it: most devices have a free screen reader built in, such as Narrator on Windows, VoiceOver on Mac and iPhone, and TalkBack on Android.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "This wavy line is only decoration. Fill in the attribute that, when it is empty, tells screen readers to skip the image.",
        code: `<img src="/assets/img/html-divider.svg" [___]="" width="240" height="24">`,
        answers: ['alt'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "This page is written in French. Fill in the attribute that tells screen readers which language to speak.",
        code: `<!DOCTYPE html>
<html [___]="fr">`,
        answers: ['lang'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which link is best for a screen reader user?',
        options: [
          '`<a href="/menu.html">See our lunch menu</a>`',
          '`<a href="/menu.html">Click here</a>`',
          '`<a href="/menu.html">Read more</a>`',
          '`<a href="/menu.html">Link</a>`',
        ],
        answer: '`<a href="/menu.html">See our lunch menu</a>`',
      },
    },
  ],
};
