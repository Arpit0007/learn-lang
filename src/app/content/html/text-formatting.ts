import { Lesson } from '../../shared/content';

export const TEXT_FORMATTING: Lesson = {
  slug: 'text-formatting',
  title: 'HTML Text Formatting and Quotes',
  nav: 'Formatting & quotes',
  blocks: [
    {
      kind: 'text',
      text: "HTML has many small elements for the words inside your sentences. They can mark words that are important, a price that has changed, a quote from a book, or a piece of computer code. Most of them change the look of the words a little, but their main job is to say what the words *are*.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Meaning or just a look?',
    },
    {
      kind: 'text',
      text: "`<strong>` and `<b>` both make text **bold**. `<em>` and `<i>` both make text *italic* (sloping). So what is the difference?",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`<strong>` means *this is important*, and `<em>` means *say this word with stress*, as you do when you speak. This meaning is part of the page, so programs that read the code, such as screen readers, can use it.",
        "`<b>` and `<i>` make words stand out without making them more important. Use `<b>` for words you want people to notice, such as product names. Use `<i>` for words in a different voice, such as a word from another language.",
      ],
    },
    {
      kind: 'example',
      label: 'formatting.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Text formatting</title>
</head>
<body>
  <h1>Corner Shop news</h1>
  <p><strong>Careful:</strong> the floor is wet.</p>
  <p>I <em>really</em> love the new bread.</p>
  <p>Try our <b>Super Crunch</b> cereal.</p>
  <p>In Spanish, <i lang="es">pan</i> means bread.</p>
  <p>Today only: <mark>free tea</mark> with every cake.</p>
  <p>Price: <del>4.00</del> <ins>3.00</ins></p>
  <p>Water is H<sub>2</sub>O, and 10<sup>2</sup> is 100.</p>
  <p><small>Prices may change.</small></p>
</body>
</html>`,
    },
    {
      kind: 'table',
      head: ['Element', 'What it means', 'Usual look'],
      rows: [
        ['`<strong>`', 'Important text', 'Bold'],
        ['`<em>`', 'Stressed text (*em* is short for *emphasis*)', 'Italic'],
        ['`<b>`', 'Text to notice, but not more important', 'Bold'],
        ['`<i>`', 'Text in a different voice, such as a foreign word', 'Italic'],
        ['`<mark>`', 'Marked text, as if with a highlighter pen', 'Yellow background'],
        ['`<small>`', 'Small print, such as side notes', 'Smaller text'],
        ['`<del>`', 'Deleted text: something that was taken out', 'A line through it'],
        ['`<ins>`', 'Inserted text: something that was added', 'Underlined'],
        ['`<sub>`', '**Subscript**: text set lower, like the 2 in H₂O', 'Small and low'],
        ['`<sup>`', '**Superscript**: text set higher, like the 2 in 10²', 'Small and high'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Choose by meaning',
      blocks: [
        {
          kind: 'text',
          text: "Pick the element that fits what the words *mean*, not the look you want. Important words get `<strong>`, even though `<b>` looks the same. If you only want a different look, with no extra meaning, CSS is the right tool.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Quotes, titles and abbreviations',
    },
    {
      kind: 'text',
      text: "A **quote** is something that another person said or wrote. For a long quote, use `<blockquote>`. It starts on its own line, and the browser moves it in a little from the left. For a short quote inside a sentence, use `<q>`. The browser adds the quote marks for you, so do not type them yourself.",
    },
    {
      kind: 'text',
      text: "`<cite>` holds the title of a work, such as a book, a film or a song. `<abbr>` marks an **abbreviation**: a short form of a longer name, like *HTML*. Put the full name in its `title` attribute. Most browsers show it when the mouse is over the word.",
    },
    {
      kind: 'example',
      label: 'quotes.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Quotes</title>
</head>
<body>
  <h1>My reading notes</h1>
  <p>This week I read <cite>Tao Te Ching</cite>, a very old book from China. My favourite line:</p>
  <blockquote>
    <p>A journey of a thousand miles begins with a single step.</p>
  </blockquote>
  <p>My grandmother always says <q>Read a little every day</q>.</p>
  <p>I am also learning <abbr title="HyperText Markup Language">HTML</abbr>.</p>
</body>
</html>`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Showing computer code',
    },
    {
      kind: 'text',
      text: "`<code>` marks a short piece of computer code, such as a file name or the name of a tag. `<kbd>` marks keys that the visitor should press (*kbd* is short for *keyboard*). Browsers show both in a **monospace** font, where every letter has the same width.",
    },
    {
      kind: 'text',
      text: "`<pre>` holds **preformatted** text. Normally the browser turns many spaces and line breaks into one space, as you saw in the Headings and paragraphs lesson. Inside `<pre>`, it keeps every space and every line break exactly as you typed them. For a longer piece of code, such as the few lines of CSS in this example, put `<code>` inside `<pre>`.",
    },
    {
      kind: 'example',
      label: 'code.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Code</title>
</head>
<body>
  <h1>Computer tips</h1>
  <p>To copy text, press <kbd>Ctrl</kbd> + <kbd>C</kbd>. On a Mac, press <kbd>Cmd</kbd> + <kbd>C</kbd>.</p>
  <p>Save your page as <code>index.html</code>, then open it in your browser.</p>
  <pre>
Name    Points
Amina   12
Kofi    9
</pre>
  <pre><code>p {
  color: teal;
}</code></pre>
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
          text: "Tags inside `<code>` or `<pre>` are still tags. If you write `<code><p></code>` to show the paragraph tag, the browser reads `<p>` as a real tag, and it does not appear as text. To show a tag as text, you need special codes such as `&lt;`. You will learn them in the lesson on entities.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "The price changed from 10 to 8. Fill in the element for the old, deleted price and the element for the new, inserted price.",
        code: `<p>Price: <[___]>10</del> <[___]>8</ins></p>`,
        answers: ['del', 'ins'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Show the full name when the mouse is over *WHO*. Fill in the element name and the attribute name.",
        code: `<p>The <[___] [___]="World Health Organization">WHO</abbr> gives advice about health.</p>`,
        answers: ['abbr', 'title'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'What is the difference between `<strong>` and `<b>`?',
        options: [
          '`<strong>` says the words are important; `<b>` only makes them stand out',
          '`<b>` makes text bolder than `<strong>`',
          'There is no difference at all',
          '`<strong>` only works inside headings',
        ],
        answer: '`<strong>` says the words are important; `<b>` only makes them stand out',
      },
    },
  ],
};
