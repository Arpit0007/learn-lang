import { Lesson } from '../../shared/content';

export const TABLES: Lesson = {
  slug: 'tables',
  title: 'HTML Tables',
  nav: 'Tables',
  blocks: [
    {
      kind: 'text',
      text: "A **table** shows information in rows and columns, like a timetable or a price list. A **row** goes across, from left to right. A **column** goes down, from top to bottom. One box in the table is called a **cell**.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Building a table',
    },
    {
      kind: 'text',
      text: "You build a table one row at a time:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`<table>` wraps the whole table.",
        "`<tr>` (**table row**) holds one row.",
        "`<th>` (**table header**) is a heading cell. The browser shows it in bold and centred.",
        "`<td>` (**table data**) is a normal cell.",
        "`<caption>` gives the table a title. It must come straight after the start tag `<table>`.",
      ],
    },
    {
      kind: 'example',
      label: 'table.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Table</title>
  <style>
    th, td { border: 1px solid #999; padding: 6px 12px; }
    table { border-collapse: collapse; }
  </style>
</head>
<body>
  <table>
    <caption>Fruit prices</caption>
    <tr>
      <th>Fruit</th>
      <th>Price</th>
    </tr>
    <tr>
      <td>Apple</td>
      <td>0.50</td>
    </tr>
    <tr>
      <td>Mango</td>
      <td>1.20</td>
    </tr>
  </table>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'About the style block',
      blocks: [
        {
          kind: 'text',
          text: "Without help, a table has no lines between its cells. The small `<style>` block in the head adds the lines. It is written in CSS, the language for how pages look. You will learn CSS in its own course, so you do not need to understand it yet.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Cells that cover more than one column',
    },
    {
      kind: 'text',
      text: "Sometimes one cell should stretch across several columns. Add the `colspan` attribute to the cell, with the number of columns it should cover. In the same way, `rowspan` makes a cell stretch down across several rows.",
    },
    {
      kind: 'example',
      label: 'colspan.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Colspan</title>
  <style>
    th, td { border: 1px solid #999; padding: 6px 12px; }
    table { border-collapse: collapse; }
  </style>
</head>
<body>
  <table>
    <tr>
      <th colspan="2">Weekend plan</th>
    </tr>
    <tr>
      <td>Saturday</td>
      <td>Football</td>
    </tr>
    <tr>
      <td>Sunday</td>
      <td>Visit family</td>
    </tr>
  </table>
</body>
</html>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Tables are for data',
      blocks: [
        {
          kind: 'text',
          text: "Use a table only for information that really has rows and columns. Do not use a table just to place things side by side on the page. Screen readers announce tables as data, so a layout table confuses their users. CSS is the right tool for page layout.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Complete the table. The first row needs a heading cell, and the second row needs its row element. Fill in the three tag names.",
        code: `<table>
  <tr>
    <[___]>Name</th>
    <th>Age</th>
  </tr>
  <[___]>
    <td>Ana</td>
    <td>12</td>
  </[___]>
</table>`,
        answers: ['th', 'tr', 'tr'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which attribute makes a cell stretch across two columns?',
        options: ['`colspan="2"`', '`rowspan="2"`', '`width="2"`', '`columns="2"`'],
        answer: '`colspan="2"`',
      },
    },
  ],
};
