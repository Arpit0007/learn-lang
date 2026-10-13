import { Lesson } from '../../shared/content';

export const RESPONSIVE_IMAGES: Lesson = {
  slug: 'responsive-images',
  title: 'HTML Responsive Images',
  nav: 'Responsive images',
  blocks: [
    {
      kind: 'text',
      text: "A phone screen is small, and a computer screen can be large. A picture that is big enough for a large screen wastes time and data on a phone. **Responsive images** solve this problem: you offer the browser several versions of a picture, and it chooses the best one for the screen.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Offering several sizes with srcset',
    },
    {
      kind: 'text',
      text: "The `srcset` attribute holds a list of image files, with commas between them. (*srcset* is short for *source set*.) After each file, write its real width in pixels, followed by the letter `w`. So `480w` means *this file is 480 pixels wide*. The browser reads the list and loads only **one** of the files.",
    },
    {
      kind: 'text',
      text: "The `sizes` attribute tells the browser how wide the picture will be shown on the page, so it can choose before anything has loaded. `100vw` means *the full width of the viewport*. The **viewport** is the part of the screen that shows the page, and *vw* is short for *viewport width*. Keep the normal `src` too: it is the backup for very old browsers.",
    },
    {
      kind: 'example',
      label: 'srcset.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>srcset</title>
  <style>
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>Sunset at the lake</h1>
  <img src="/assets/img/html-sunset-480.svg"
       srcset="/assets/img/html-sunset-480.svg 480w,
               /assets/img/html-sunset-960.svg 960w"
       sizes="100vw"
       alt="An orange sun going down over a calm lake"
       width="960" height="540">
  <p>The label in the corner shows which file the browser chose.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The small `<style>` block makes the picture shrink to fit narrow screens. Open the example with **Try it Yourself**. In the full-width result, the label shows `960w`, the big file. Now press **Phone** above the result, then press **Run** to load the page again at that width. On a normal screen, the browser now picks the `480w` file. On a very sharp screen, such as most phones and some laptops, it still picks `960w`: a sharp screen has more pixels to fill, so it needs the bigger file.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'The browser has the last word',
      blocks: [
        {
          kind: 'text',
          text: "With `srcset`, you only make an offer, and the browser makes the final choice. It thinks about how wide the picture will be and how sharp the screen is. If it already has the big file, it may simply keep it. Also, in real projects `srcset` is used for photos, such as JPG or WebP files. This lesson uses SVG drawings only so that each version can show its own label.",
        },
      ],
    },
    {
      kind: 'text',
      text: "If the picture does not fill the whole screen, say so in `sizes`. This one means: on screens at least 800 pixels wide, the picture is half as wide as the screen (`50vw`). On smaller screens, it is as wide as the screen (`100vw`).",
    },
    {
      kind: 'example',
      label: 'sizes.html',
      run: 'none',
      code: `<img src="/assets/img/html-sunset-480.svg"
     srcset="/assets/img/html-sunset-480.svg 480w,
             /assets/img/html-sunset-960.svg 960w"
     sizes="(min-width: 800px) 50vw, 100vw"
     alt="An orange sun going down over a calm lake"
     width="960" height="540">`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The picture element',
    },
    {
      kind: 'text',
      text: "Sometimes a smaller copy is not enough. A wide view of a lake looks tiny on a phone, so you may want a different picture there: a tall, closer view. The `<picture>` element does this. Inside it, each `<source>` offers a file for screens that match its `media` condition. At the end comes a normal `<img>`, which is used when no `<source>` matches.",
    },
    {
      kind: 'text',
      text: "`media=\"(min-width: 500px)\"` is a **media query**: a test about the screen. It means *the viewport is at least 500 pixels wide*. The `<source>` also has its own `width` and `height`, because its picture has a different shape from the one in the `<img>`.",
    },
    {
      kind: 'example',
      label: 'picture.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>picture</title>
  <style>
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>Sunset at the lake</h1>
  <picture>
    <source media="(min-width: 500px)" srcset="/assets/img/html-sunset-960.svg" width="960" height="540">
    <img src="/assets/img/html-sunset-tall.svg" alt="An orange sun going down over a calm lake" width="360" height="480">
  </picture>
  <p>Wide screens get the wide picture. Narrow screens get the tall one.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Open the example with **Try it Yourself**, then press the **Phone**, **Tablet** and **Full** buttons above the result. With **Phone**, the result is narrower than 500 pixels, so no `<source>` matches and you see the tall picture from the `<img>`. With **Tablet** and **Full**, the `<source>` matches and you see the wide picture. Unlike `srcset`, the `media` condition is a rule, not an offer: the browser must use the first `<source>` that matches.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'The alt text goes on the img',
      blocks: [
        {
          kind: 'text',
          text: "A `<picture>` must always end with an `<img>`. The `<source>` elements only offer other files. The `<img>` is the element that is really shown, and it holds the `alt` text. Whichever file the browser picks, the `alt` text stays the same, because it describes what the picture shows.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Loading pictures later',
    },
    {
      kind: 'text',
      text: "A long page may have many pictures that the visitor sees only after scrolling down. Add `loading=\"lazy\"` to these pictures. The browser then waits, and loads each one only when the visitor scrolls near it. The page opens faster, and phones use less data.",
    },
    {
      kind: 'example',
      label: 'lazy.html',
      run: 'none',
      code: `<img src="/assets/img/html-sunset-480.svg" alt="An orange sun going down over a calm lake"
     width="480" height="270" loading="lazy">`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Common mistake',
      blocks: [
        {
          kind: 'text',
          text: "Do not use `loading=\"lazy\"` on a big picture at the top of the page. Visitors see that picture straight away, so it should load straight away. Use `lazy` only for pictures further down.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Offer two sizes of the same picture. Fill in the attribute that holds the list of files, and the attribute that says how wide the picture is shown.",
        code: `<img src="/assets/img/html-sunset-480.svg"
     [___]="/assets/img/html-sunset-480.svg 480w, /assets/img/html-sunset-960.svg 960w"
     [___]="100vw"
     alt="An orange sun going down over a calm lake">`,
        answers: ['srcset', 'sizes'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Show the wide picture on screens at least 500 pixels wide, and the tall one on smaller screens. Fill in the element that wraps them, and the element that offers the wide file.",
        code: `<[___]>
  <[___] media="(min-width: 500px)" srcset="/assets/img/html-sunset-960.svg">
  <img src="/assets/img/html-sunset-tall.svg" alt="An orange sun going down over a calm lake">
</picture>`,
        answers: ['picture', 'source'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In `srcset`, what does `480w` after a file name mean?',
        options: [
          'The file is 480 pixels wide',
          'Show the picture 480 pixels wide',
          'Wait 480 milliseconds before loading the file',
          'The file is 480 kilobytes big',
        ],
        answer: 'The file is 480 pixels wide',
      },
    },
  ],
};
