import { Lesson } from '../../shared/content';

export const HOME: Lesson = {
  slug: 'home',
  title: 'HTML Home',
  nav: 'Home',
  blocks: [
    {
      kind: 'text',
      style: 'lede',
      text: "HTML is the language used to build web pages. Every page you visit, from a news site to an online shop, is made with HTML.",
    },
    {
      kind: 'text',
      text: "HTML tells the web browser what each part of a page *is*: this is a heading, this is a paragraph, this is a picture, this is a link. A **web browser** is the program you use to visit websites, such as Chrome, Firefox, Safari or Edge. You do not need any special software to learn HTML. This course runs completely in your browser.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'What you will learn',
    },
    {
      kind: 'text',
      text: "The course is made of short lessons. Each one adds a new piece, so it is best to follow them in order:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Introduction:** what a complete HTML page looks like",
        "**Elements and attributes:** the building blocks of every page",
        "**Headings, paragraphs and text formatting:** how to organise and mark up text",
        "**Entities and symbols:** how to show special characters and emojis",
        "**Links, images and file paths:** how to connect pages and show pictures",
        "**Audio, video and iframes:** how to add sound, films and other pages",
        "**Lists and tables:** how to show items and data in order",
        "**Block and inline elements, classes and IDs, and page layout:** how a page is divided into parts",
        "**Responsive images and SVG:** pictures that fit every screen, and drawings made of code",
        "**Forms, inputs and validation:** how to ask the visitor for information, and check it",
        "**Accessibility:** how to make pages that everyone can use",
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How this site works',
    },
    {
      kind: 'text',
      text: "Reading about code is good. Changing code yourself is better. Every lesson has examples that you can open and edit:",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "Click **Try it Yourself »** under an example. A full-screen editor opens with the code on one side and the result on the other.",
        "Change the code. For example, change some words or add a new line.",
        "Press **Run** to see your changes in the result.",
        "At the end of each lesson, finish the exercises. When you answer all of them correctly, the lesson gets a ✓ in the menu.",
      ],
    },
    {
      kind: 'text',
      text: "Here is a very small web page. Open it, change the words between the tags, and press **Run**:",
    },
    {
      kind: 'example',
      label: 'first-page.html',
      code: `<!DOCTYPE html>
<html>
<head>
  <title>My first page</title>
</head>
<body>
  <h1>Hello, world!</h1>
  <p>This is my first web page.</p>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'You cannot break anything',
      blocks: [
        {
          kind: 'text',
          text: "Try things, even strange ones. If the result looks wrong, close the editor and open the example again to get the original code back. Making small changes and seeing what happens is the fastest way to learn.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Check what you know',
    },
    {
      kind: 'text',
      text: "Here are your first exercises. Type your answer in each gap, or pick one option, then check it.",
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What is HTML used for?',
        options: [
          'Building the content and structure of web pages',
          'Editing photos',
          'Sending email',
          'Making a computer run faster',
        ],
        answer: 'Building the content and structure of web pages',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You changed the code in the editor. Which button do you press to see the new result?',
        options: ['Run', 'Reset', 'Back', 'Save'],
        answer: 'Run',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "The example above uses the `<p>` element for a paragraph. Fill in the tag name that starts this paragraph.",
        code: `<[___]>This is my first web page.</p>`,
        answers: ['p'],
      },
    },
  ],
};
