import { Lesson } from '../../shared/content';

export const FILE_PATHS: Lesson = {
  slug: 'file-paths',
  title: 'HTML File Paths and Favicon',
  nav: 'File paths & favicon',
  blocks: [
    {
      kind: 'text',
      text: "A **file path** tells the browser where to find a file: an image, another page, a sound or a video. You write file paths in attributes such as `src` and `href`. To write good paths, you first need to know how the files of a website are organised.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'A project folder',
    },
    {
      kind: 'text',
      text: "A website lives in a **folder**: a place on the computer that holds files, and other folders too. Here is a small website. Its home page is `index.html`, the usual name for the first page of a site. The pictures are in a folder called `images`, and the pages about the team are in a folder called `team`:",
    },
    {
      kind: 'example',
      label: 'my-site',
      lang: 'text',
      run: 'none',
      code: `my-site/
├── index.html
├── about.html
├── favicon.png
├── images/
│   └── logo.png
└── team/
    ├── ana.html
    └── ana.jpg`,
    },
    {
      kind: 'text',
      text: "The folder at the very top, `my-site`, is called the **root** of the website. Everything else is inside it.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Absolute paths',
    },
    {
      kind: 'text',
      text: "An **absolute** path is a full web address. It starts with `https://` and the name of the website, like `https://example.com/images/logo.png`. It points to the same file from any page, on any website. Use absolute paths for files on **other** websites.",
    },
    {
      kind: 'example',
      label: 'absolute.html',
      run: 'none',
      code: `<a href="https://example.com/about.html">About Example</a>
<img src="https://example.com/images/logo.png" alt="The Example logo">`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Relative paths',
    },
    {
      kind: 'text',
      text: "A **relative** path is shorter. It does not name the website. It says where the file is *compared to the page you are on*. Use relative paths for files on **your own** website.",
    },
    {
      kind: 'table',
      head: ['Path', 'What it means'],
      rows: [
        ['`about.html`', 'The file `about.html`, in the same folder as this page'],
        ['`./about.html`', 'The same thing: `./` means *this folder*'],
        ['`images/logo.png`', 'Go into the `images` folder, then find `logo.png`'],
        ['`../index.html`', 'Go up one folder, then find `index.html`'],
        ['`../../index.html`', 'Go up two folders, then find `index.html`'],
      ],
    },
    {
      kind: 'text',
      text: "Here are some links and images from two pages of the project. Look at how the path to `logo.png` changes, because the two pages are in different folders:",
    },
    {
      kind: 'example',
      label: 'index.html',
      run: 'none',
      code: `<!-- In index.html, in the root folder -->
<a href="about.html">About us</a>
<a href="team/ana.html">Meet Ana</a>
<img src="images/logo.png" alt="My Site logo">`,
    },
    {
      kind: 'example',
      label: 'team/ana.html',
      run: 'none',
      code: `<!-- In team/ana.html, one folder down -->
<a href="../index.html">Home</a>
<img src="../images/logo.png" alt="My Site logo">
<img src="ana.jpg" alt="Ana smiling at the camera">`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Remember',
      blocks: [
        {
          kind: 'text',
          text: "`./` means *this folder*. `../` means *the folder above this one*. A path that starts with a name, like `images/logo.png`, starts in the folder of the page you are on.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Root-relative paths',
    },
    {
      kind: 'text',
      text: "A path that starts with `/` is **root-relative**: it starts at the root, the top folder of the website. `/images/logo.png` means: start at the root, go into the `images` folder, then find `logo.png`. This path is the same from every page, however deep the page is in the folders.",
    },
    {
      kind: 'text',
      text: "The examples on this site are not saved as files in a folder, so a relative path in them would look in the wrong place. That is why they use root-relative paths to the pictures in this site's `assets/img` folder. In your own projects, relative paths work well. Open this example: the first path is right, but the second one names the wrong folder, so the browser cannot find the file and shows the `alt` text instead.",
    },
    {
      kind: 'example',
      label: 'paths.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>File paths</title>
</head>
<body>
  <h1>Finding the cat</h1>
  <p>Right path: start at the root, go into assets, then into img.</p>
  <img src="/assets/img/html-cat.svg" alt="A smiling orange cat" width="120" height="120">

  <p>Wrong path: there is no html-cat.svg straight inside assets.</p>
  <img src="/assets/html-cat.svg" alt="The cat is missing" width="120" height="120">

  <p>Absolute path: <a href="https://example.com/index.html">the Example home page</a></p>
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
          text: "Do not use a path to a file on your own computer, such as `C:\\\\Users\\\\Ana\\\\Desktop\\\\cat.jpg`. The page works on your computer, but on nobody else's, because they do not have that file. Put the file inside your project folder and use a relative path.",
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'Name your files safely',
      blocks: [
        {
          kind: 'text',
          text: "Use lowercase letters, numbers and hyphens in file and folder names, like `my-cat.jpg`. Avoid spaces and capital letters. Many web servers treat `Cat.jpg` and `cat.jpg` as two different files, so a path that works on your computer can break on the web.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The favicon',
    },
    {
      kind: 'text',
      text: "A **favicon** is the small icon in the browser tab, next to the page title. *Favicon* is short for *favourite icon*. You add it with a `<link>` element in the `<head>`. The `rel` attribute says how the linked file is related to the page (*rel* is short for *relationship*), and `href` holds the path to the file:",
    },
    {
      kind: 'example',
      label: 'head.html',
      run: 'none',
      code: `<head>
  <meta charset="utf-8">
  <title>My Site</title>
  <link rel="icon" href="/favicon.png" type="image/png">
</head>`,
    },
    {
      kind: 'text',
      text: "A favicon is a small, square picture, such as 32 by 32 pixels. It is usually a PNG, ICO or SVG file, and the `type` attribute says which kind, such as `image/png`. Its path follows the same rules as every other path.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Try it in your own project',
      blocks: [
        {
          kind: 'text',
          text: "The examples on this site cannot show a favicon, because their result is shown inside this page, not in a browser tab of its own. Add the `<link>` line to a page of your own website to see it.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "This link is in `team/ana.html`. Link to the home page, `index.html`, which is one folder up. Fill in the relative path.",
        code: `<a href="[___]">Home</a>`,
        answers: ['../index.html'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Add a favicon to the page. Fill in the attribute that says the linked file is the page's icon.",
        code: `<link [___]="icon" href="/favicon.png" type="image/png">`,
        answers: ['rel'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which path always starts at the root, the top folder of the website?',
        options: [
          '`/images/logo.png`',
          '`images/logo.png`',
          '`./images/logo.png`',
          '`../images/logo.png`',
        ],
        answer: '`/images/logo.png`',
      },
    },
  ],
};
