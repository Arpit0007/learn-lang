import { Lesson } from '../../shared/content';

export const FORM_VALIDATION: Lesson = {
  slug: 'form-validation',
  title: 'HTML Form Validation',
  nav: 'Form validation',
  blocks: [
    {
      kind: 'text',
      text: "People make mistakes when they fill in forms. They forget a box, or they type a phone number where the email should go. **Validation** means checking the answers before the form is sent. HTML can do many of these checks for you, without any programming: you only add attributes.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'How the browser checks a form',
    },
    {
      kind: 'text',
      text: "When the visitor presses the submit button, the browser first checks every field. If a field breaks one of its rules, the browser does not send the form. Instead, it shows a short message next to the first wrong field. The browser writes this message itself, so it looks a little different in each browser.",
    },
    {
      kind: 'table',
      head: ['Attribute', 'Used on', 'What it checks'],
      rows: [
        ['`required`', 'Any field', 'The field must not be empty'],
        ['`minlength`', 'Text boxes and `<textarea>`', 'The fewest characters allowed'],
        ['`maxlength`', 'Text boxes and `<textarea>`', 'The most characters allowed. The browser simply stops you typing more.'],
        ['`min`', '`number`, `range` and `date`', 'The smallest value allowed'],
        ['`max`', '`number`, `range` and `date`', 'The biggest value allowed'],
        ['`step`', '`number`, `range` and `date`', 'The size of each jump. With `min="0"`, `step="5"` allows 0, 5, 10, 15 and so on.'],
        ['`pattern`', 'Text boxes', 'The text must match a pattern'],
      ],
    },
    {
      kind: 'text',
      text: "Like `checked`, the `required` attribute needs no value: writing the word is enough. `minlength` and `maxlength` count **characters**: letters, numbers, spaces and signs.",
    },
    {
      kind: 'example',
      label: 'sign-up.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Validation</title>
</head>
<body>
  <h1>Join the running club</h1>
  <form onsubmit="event.preventDefault()">
    <p>
      <label for="name">Name (2 to 30 characters)</label><br>
      <input type="text" id="name" name="name" required minlength="2" maxlength="30">
    </p>
    <p>
      <label for="email">Email</label><br>
      <input type="email" id="email" name="email" required>
    </p>
    <p>
      <label for="age">Age (12 to 99)</label><br>
      <input type="number" id="age" name="age" min="12" max="99">
    </p>
    <p>
      <label for="km">Kilometres a week (in steps of 5)</label><br>
      <input type="number" id="km" name="km" min="0" max="100" step="5">
    </p>
    <p>
      <label for="site">Your website (you can leave this empty)</label><br>
      <input type="url" id="site" name="site" placeholder="https://example.com">
    </p>
    <button type="submit">Join</button>
  </form>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Try to break the rules: press **Join** with empty boxes, type only one letter as the name, type `abc` as the email, or type `7` as the kilometres. Each time, the browser stops the form and tells you what is wrong.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Nothing is sent',
      blocks: [
        {
          kind: 'text',
          text: "When every answer is right, a real form is sent to a server (a computer that stores or uses the data). These examples send nothing anywhere, so when all your answers are right, nothing seems to happen. The `onsubmit=\"event.preventDefault()\"` part stops the sending. On a real website, you leave it out.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Checks that come with the type',
    },
    {
      kind: 'text',
      text: "Some input types check the answer by themselves. An `email` field needs an `@` sign with text before and after it, like `ana@example.com`. A `url` field needs a full web address, like `https://example.com`. A `number` field accepts only numbers. These checks only happen when the box is not empty.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Your own rules with pattern',
    },
    {
      kind: 'text',
      text: "The `pattern` attribute holds a rule that the **whole** text must match. The rule is written in a small language called a **regular expression**. Here are a few simple ones. `[0-9]` means *one digit from 0 to 9*, `{5}` means *exactly 5 times*, and `+` means *one or more times*:",
    },
    {
      kind: 'table',
      head: ['Pattern', 'What it allows'],
      rows: [
        ['`[0-9]{5}`', 'Exactly 5 digits, such as `12345`'],
        ['`[a-z]+`', 'One or more small letters, with no spaces or numbers'],
        ['`[A-Z]{2}[0-9]{4}`', 'Two capital letters and then four digits, such as `AB1234`'],
      ],
    },
    {
      kind: 'text',
      text: "Always add a `title` that explains the rule in plain words. Many browsers show the `title` text in their message, so the visitor knows how to fix the answer.",
    },
    {
      kind: 'example',
      label: 'pattern.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pattern</title>
</head>
<body>
  <h1>Find your parcel</h1>
  <form onsubmit="event.preventDefault()">
    <p>
      <label for="code">Parcel code</label><br>
      <input type="text" id="code" name="code" required
             pattern="[A-Z]{2}[0-9]{4}"
             title="Two capital letters and four numbers, for example AB1234">
    </p>
    <button type="submit">Find</button>
  </form>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Type `ab1234` and press **Find**: small letters do not match `[A-Z]`. Then try `AB1234`.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "The browser does not check `pattern`, `minlength` or the type of an **empty** box. An empty box is always allowed, unless it has `required`. So if a field must be filled in, add `required` as well.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Switching the checks off',
    },
    {
      kind: 'text',
      text: "Sometimes you do not want the browser's checks, for example when you check the form in your own way with JavaScript, the programming language of web pages. Add `novalidate` to the `<form>` element, and the browser skips all its checks for that form. In this example, press **Send** with the box empty: no message appears.",
    },
    {
      kind: 'example',
      label: 'novalidate.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>No validation</title>
</head>
<body>
  <h1>Newsletter</h1>
  <form novalidate onsubmit="event.preventDefault()">
    <p>
      <label for="email">Email</label><br>
      <input type="email" id="email" name="email" required>
    </p>
    <button type="submit">Send</button>
  </form>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'The server must check again',
      blocks: [
        {
          kind: 'text',
          text: "Browser checks help honest visitors fix their mistakes, but they are not a lock. Anyone can switch them off, as `novalidate` just did, or send data to the server without using your form at all. So the server must always check every answer again.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "The password must be filled in and have at least 8 characters. Fill in the two attribute names.",
        code: `<input type="password" id="pw" name="pw" [___] [___]="8">`,
        answers: ['required', 'minlength'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Accept only ages from 18 to 65. Fill in the two attribute names.",
        code: `<input type="number" id="age" name="age" [___]="18" [___]="65">`,
        answers: ['min', 'max'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'The browser has already checked the form. Does the server still need to check the data?',
        options: [
          'Yes, always: browser checks can be switched off or skipped',
          'No, the browser checks are enough',
          'Only for email addresses',
          'Only when the form uses `pattern`',
        ],
        answer: 'Yes, always: browser checks can be switched off or skipped',
      },
    },
  ],
};
