import { Lesson } from '../../shared/content';

export const LINKS: Lesson = {
  slug: 'links',
  title: 'HTML Links',
  nav: 'Links',
  blocks: [
    {
      kind: 'text',
      text: "Links are what make the web a *web*. A **link** (also called a hyperlink) is text or an image that the visitor can click to go to another page, or to another place on the same page.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Making a link',
    },
    {
      kind: 'text',
      text: "A link uses the `<a>` element. The letter *a* comes from the word *anchor*. Its `href` attribute holds the address to go to. The content between the tags is the text the visitor clicks.",
    },
    {
      kind: 'example',
      label: 'links.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Links</title>
</head>
<body>
  <h1>Useful pages</h1>
  <p><a href="https://example.com">Visit Example</a></p>
  <p>Read <a href="https://example.com/about">more about us</a> on the About page.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "A full web address such as `https://example.com/about` is called a **URL**. It includes the `https://` part at the start.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not leave out `https://` when you link to another website. If you write `href=\"example.com\"`, the browser thinks `example.com` is a file on *your own* site, and the link breaks. Write `href=\"https://example.com\"` instead.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Jumping to a part of the same page',
    },
    {
      kind: 'text',
      text: "On a long page, links can jump to a section. First, give the section an `id`: a name that is used only once on the page. Then link to it with `#` before the name, like `href=\"#rules\"`. Open this example and click the links:",
    },
    {
      kind: 'example',
      label: 'jump-links.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Jump links</title>
</head>
<body>
  <h1>Football Club</h1>
  <p>Go to: <a href="#times">Training times</a> | <a href="#rules">Club rules</a></p>

  <h2 id="times">Training times</h2>
  <p style="height: 400px;">Tuesdays and Thursdays at 6 pm.</p>

  <h2 id="rules">Club rules</h2>
  <p>Be on time and bring water.</p>
  <p><a href="#">Back to the top</a></p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Opening a link in a new tab',
    },
    {
      kind: 'text',
      text: "Normally a link opens in the same tab. Add `target=\"_blank\"` to open it in a new tab instead. Use this only when you have a good reason, because many visitors prefer to choose for themselves.",
    },
    {
      kind: 'example',
      label: 'new-tab.html',
      run: 'none',
      code: `<a href="https://example.com" target="_blank">Open Example in a new tab</a>`,
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Good link text',
      blocks: [
        {
          kind: 'text',
          text: "Write link text that says where the link goes, like \"Read the club rules\". Avoid \"click here\". People who use screen readers often jump from link to link, and \"click here\" tells them nothing.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make a link to example.com. Fill in the element name in the start tag and the end tag.",
        code: `<[___] href="https://example.com">Go to Example</[___]>`,
        answers: ['a', 'a'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make this link open in a new tab. Fill in the attribute name.",
        code: `<a href="https://example.com" [___]="_blank">Example</a>`,
        answers: ['target'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A heading has `id="contact"`. Which link jumps to it?',
        options: [
          '`<a href="#contact">Contact</a>`',
          '`<a href="contact">Contact</a>`',
          '`<a id="#contact">Contact</a>`',
          '`<a href="https://contact">Contact</a>`',
        ],
        answer: '`<a href="#contact">Contact</a>`',
      },
    },
  ],
};
