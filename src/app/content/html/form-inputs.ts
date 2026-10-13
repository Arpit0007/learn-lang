import { Lesson } from '../../shared/content';

export const FORM_INPUTS: Lesson = {
  slug: 'form-inputs',
  title: 'HTML Form Inputs',
  nav: 'Form inputs',
  blocks: [
    {
      kind: 'text',
      text: "In the Forms lesson you met the most common fields. This lesson shows many more kinds of `<input>`, how to set up choices, and how to keep a long form tidy. Often, one small change to the `type` attribute gives you a whole new kind of field.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Input types',
    },
    {
      kind: 'table',
      head: ['Type', 'What it makes'],
      rows: [
        ['`text`', 'A one-line text box'],
        ['`email`', 'A text box for an email address. Phones show a keyboard with an @ key.'],
        ['`password`', 'A text box that hides what you type'],
        ['`number`', 'A box for numbers, with small arrows to count up and down'],
        ['`date`', 'A box for a date, with a calendar to pick from'],
        ['`checkbox`', 'A small box to tick on or off'],
        ['`radio`', 'A round button to pick one choice from a group'],
        ['`range`', 'A slider: you choose a number by moving a handle'],
        ['`color`', 'A colour picker'],
        ['`file`', 'A button to choose a file from your device'],
      ],
    },
    {
      kind: 'text',
      text: "Here are some of these types in one form. Click each field to see what it does:",
    },
    {
      kind: 'example',
      label: 'input-types.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Input types</title>
</head>
<body>
  <h1>Plan a party</h1>
  <form onsubmit="event.preventDefault()">
    <p>
      <label for="day">Party date</label><br>
      <input type="date" id="day" name="day">
    </p>
    <p>
      <label for="guests">Number of guests</label><br>
      <input type="number" id="guests" name="guests">
    </p>
    <p>
      <label for="volume">Music volume</label><br>
      <input type="range" id="volume" name="volume" min="0" max="10" value="5">
    </p>
    <p>
      <label for="theme">Party colour</label><br>
      <input type="color" id="theme" name="theme" value="#ff9900">
    </p>
    <p>
      <label for="photo">Photo for the invitation</label><br>
      <input type="file" id="photo" name="photo">
    </p>
    <button type="submit">Save the plan</button>
  </form>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "On the slider, `min` and `max` set the two ends, and `value` sets where the handle starts. On the colour picker, `value` sets the first colour. It is written as a **hex code**: a `#` and six numbers and letters, such as `#ff9900` for orange.",
    },
    {
      kind: 'text',
      text: "Every browser draws these fields in its own way. The calendar and the colour picker look different in Chrome, Firefox and Safari, and different again on phones. That is normal.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Nothing is sent',
      blocks: [
        {
          kind: 'text',
          text: "The forms in these examples do not send anything anywhere. If you choose a file, it stays on your device. You can try every field without worry.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Radio buttons, checkboxes and menus',
    },
    {
      kind: 'text',
      text: "Radio buttons work as a group when they share the same `name`. Each button in the group needs its own `value`: that is what the form sends for the chosen button. Add `checked` to choose one at the start. Checkboxes use `value` and `checked` in the same way, but each checkbox is on or off by itself.",
    },
    {
      kind: 'text',
      text: "In a `<select>` menu, each choice is an `<option>`. Its `value` is what the form sends, and the text between its tags is what the visitor sees. Add `selected` to an option to choose it at the start.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Grouping fields with fieldset',
    },
    {
      kind: 'text',
      text: "The `<fieldset>` element groups fields that belong together, and draws a box around them. The `<legend>` element comes first inside it and gives the group a title. For radio buttons, the legend is the question and each label is one answer. Screen readers read the legend too, so their users know what the buttons are for.",
    },
    {
      kind: 'example',
      label: 'pizza.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pizza order</title>
</head>
<body>
  <h1>Order a pizza</h1>
  <form onsubmit="event.preventDefault()">
    <fieldset>
      <legend>Size</legend>
      <input type="radio" id="small" name="size" value="small">
      <label for="small">Small</label>
      <input type="radio" id="medium" name="size" value="medium" checked>
      <label for="medium">Medium</label>
      <input type="radio" id="large" name="size" value="large">
      <label for="large">Large</label>
    </fieldset>

    <fieldset>
      <legend>Extras</legend>
      <input type="checkbox" id="cheese" name="extras" value="cheese" checked>
      <label for="cheese">More cheese</label>
      <input type="checkbox" id="olives" name="extras" value="olives">
      <label for="olives">Olives</label>
    </fieldset>

    <p>
      <label for="crust">Crust</label>
      <select id="crust" name="crust">
        <option value="thin">Thin</option>
        <option value="thick" selected>Thick</option>
        <option value="stuffed">Stuffed</option>
      </select>
    </p>
    <p>
      <label for="note">Note for the cook</label><br>
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
          text: "Give every radio button and checkbox a `value`. Without one, the form sends just the word `on`, and the website cannot tell which choice the visitor picked.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Click the label',
      blocks: [
        {
          kind: 'text',
          text: "In the pizza example, click the word *Olives*: the checkbox ticks. A connected label makes the area you can click bigger, which helps everyone, especially on phones. You can also put the field inside its label, like `<label><input type=\"checkbox\" name=\"news\"> Send me news</label>`. Then you do not need `for` and `id`.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Placeholder or label?',
    },
    {
      kind: 'text',
      text: "A `placeholder` is a light hint inside an empty box. It disappears as soon as the visitor starts typing. So a placeholder can **never** take the place of a label: once it is gone, people forget what the box was for. Its light grey text is also hard to read for many people. Always use a `<label>`, and use `placeholder` only for an extra example.",
    },
    {
      kind: 'example',
      label: 'placeholder.html',
      run: 'none',
      code: `<!-- Not good: the only hint disappears when you start typing -->
<input type="email" name="email" placeholder="Email">

<!-- Good: a label that stays, and an example as the hint -->
<label for="email">Email</label>
<input type="email" id="email" name="email" placeholder="e.g. ana@example.com">`,
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Make a slider that goes from 0 to 10. Fill in the value of the `type` attribute.",
        code: `<input type="[___]" id="volume" name="volume" min="0" max="10">`,
        answers: ['range'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Group the radio buttons in a box with a title. Fill in the element that groups them and the element that holds the title.",
        code: `<[___]>
  <[___]>Pick a size</legend>
  <input type="radio" id="s" name="size" value="small">
  <label for="s">Small</label>
  <input type="radio" id="l" name="size" value="large">
  <label for="l">Large</label>
</fieldset>`,
        answers: ['fieldset', 'legend'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Why should a `placeholder` never take the place of a `<label>`?',
        options: [
          'It disappears when the visitor starts typing',
          'It stops the form from being sent',
          'It only works on phones',
          'It is not allowed inside a form',
        ],
        answer: 'It disappears when the visitor starts typing',
      },
    },
  ],
};
