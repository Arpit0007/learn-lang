import { Lesson } from '../../shared/content';

export const FORMS: Lesson = {
  slug: 'forms',
  title: 'HTML Forms',
  nav: 'Forms',
  blocks: [
    {
      kind: 'text',
      text: "A **form** lets visitors type or choose information and send it: a search box, a sign-up page or a contact page. The `<form>` element wraps all the parts of a form. Inside it you place **fields**, the boxes and buttons people fill in.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Text boxes and labels',
    },
    {
      kind: 'text',
      text: "The `<input>` element makes a field. It is an empty element, so it has no end tag. Its `type` attribute says what kind of field it is. The `<label>` element is the text that tells people what to type.",
    },
    {
      kind: 'example',
      label: 'form.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sign up</title>
</head>
<body>
  <h1>Join our book club</h1>
  <form onsubmit="event.preventDefault()">
    <p>
      <label for="name">Your name</label><br>
      <input type="text" id="name" name="name" placeholder="e.g. Maria" required>
    </p>
    <p>
      <label for="email">Email</label><br>
      <input type="email" id="email" name="email" required>
    </p>
    <button type="submit">Join</button>
  </form>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Try pressing **Join** with an empty box. The `required` attribute makes the browser ask you to fill it in first. The `placeholder` attribute shows a light hint inside the box until you start typing. The `name` attribute is the name the data is sent under.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Connect each label to its field',
      blocks: [
        {
          kind: 'text',
          text: "Give the field an `id`, and give the label a `for` attribute with the **same** value. Now a screen reader reads the label when the field is selected, and clicking the label puts the cursor in the box.",
        },
      ],
    },
    {
      kind: 'table',
      head: ['Field', 'What it makes'],
      rows: [
        ['`<input type="text">`', 'A one-line text box'],
        ['`<input type="email">`', 'A text box that checks for an email address'],
        ['`<input type="password">`', 'A text box that hides what you type'],
        ['`<input type="number">`', 'A box for numbers only'],
        ['`<input type="checkbox">`', 'A small box to tick on or off'],
        ['`<input type="radio">`', 'A round button to pick one choice from a group'],
        ['`<textarea>`', 'A large box for many lines of text'],
        ['`<select>`', 'A drop-down list of choices'],
        ['`<button>`', 'A button that sends the form'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Choices, menus and long answers',
    },
    {
      kind: 'text',
      text: "Radio buttons let people pick **one** choice from a group. A checkbox can be ticked on its own. A `<select>` holds `<option>` elements in a drop-down list. A `<textarea>` has an end tag, unlike `<input>`.",
    },
    {
      kind: 'example',
      label: 'choices.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Order a drink</title>
</head>
<body>
  <form onsubmit="event.preventDefault()">
    <p>Size:
      <input type="radio" id="small" name="size" value="small">
      <label for="small">Small</label>
      <input type="radio" id="large" name="size" value="large">
      <label for="large">Large</label>
    </p>
    <p>
      <label for="drink">Drink</label>
      <select id="drink" name="drink">
        <option>Tea</option>
        <option>Coffee</option>
        <option>Juice</option>
      </select>
    </p>
    <p>
      <input type="checkbox" id="sugar" name="sugar">
      <label for="sugar">Add sugar</label>
    </p>
    <p>
      <label for="note">Note</label><br>
      <textarea id="note" name="note" rows="3" cols="30"></textarea>
    </p>
    <button type="submit">Order</button>
  </form>
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
          text: "Radio buttons only work as a group when they share the **same** `name`. If each one has a different `name`, the visitor can select all of them at once.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Where does the data go?',
      blocks: [
        {
          kind: 'text',
          text: "On a real website, a form sends its data to a server (a computer that stores or uses the data). The examples on this site do not send anything anywhere, so you can type whatever you like.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Connect the label to the text box. Fill in the label attribute and the input attribute that must have the same value.",
        code: `<label [___]="city">City</label>
<input type="text" [___]="city" name="city">`,
        answers: ['for', 'id'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make a box that hides the letters as you type. Fill in the value of the `type` attribute.",
        code: `<input type="[___]" id="pw" name="pw">`,
        answers: ['password'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Three radio buttons should work as one group, so only one can be picked. What must they share?',
        options: [
          'The same `name` value',
          'The same `id` value',
          'The same label text',
          'Nothing, radio buttons always work as one group',
        ],
        answer: 'The same `name` value',
      },
    },
  ],
};
