import { Lesson } from '../../shared/content';

export const MEDIA: Lesson = {
  slug: 'media',
  title: 'HTML Audio, Video and Iframes',
  nav: 'Audio, video & iframes',
  blocks: [
    {
      kind: 'text',
      text: "A web page can do more than show text and pictures. It can play sound and video, and it can even show another web page inside it. In this lesson you will learn three elements for this: `<audio>`, `<video>` and `<iframe>`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Playing sound',
    },
    {
      kind: 'text',
      text: "The `<audio>` element adds a sound player to the page. Inside it, a `<source>` element says which sound file to play. Its `src` attribute holds the address of the file, and its `type` attribute says what kind of file it is, such as `audio/mpeg` for an MP3 file.",
    },
    {
      kind: 'example',
      label: 'audio.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Audio</title>
</head>
<body>
  <h1>Morning birds</h1>
  <audio controls>
    <source src="/assets/media/birdsong.mp3" type="audio/mpeg">
    Sorry, your browser cannot play this sound.
  </audio>
  <p>Recorded in the park at 6 am.</p>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The `controls` attribute shows the buttons: play, pause, a time bar and the volume. It has no value. You just write the word. Without `controls`, the player is hidden and the visitor has no way to start the sound.",
    },
    {
      kind: 'text',
      text: "The text inside `<audio>`, after the `<source>`, is **fallback text**. Fallback text is a backup message. The browser shows it only if it cannot play sound at all, for example in a very old browser. Modern browsers show the player instead.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Using your own files',
      blocks: [
        {
          kind: 'text',
          text: "This site has no real sound or video files, so the players in these examples appear but do not play. In your own project, put a real file next to your page and point `src` at it, like `src=\"birdsong.mp3\"`. Then the play button will work.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Playing video',
    },
    {
      kind: 'text',
      text: "The `<video>` element works the same way as `<audio>`. It also uses `controls`, `<source>` and fallback text. Like an image, a video can have a `width` and a `height` in pixels. The `poster` attribute sets a picture to show before the video starts.",
    },
    {
      kind: 'example',
      label: 'video.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Video</title>
</head>
<body>
  <h1>A walk in the hills</h1>
  <video width="320" height="180" controls poster="/assets/img/html-video-poster.svg">
    <source src="/assets/media/hills.mp4" type="video/mp4">
    Sorry, your browser cannot play this video.
  </video>
  <p>A short film from our summer trip.</p>
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
          text: "Do not forget `controls`. A `<video>` without it shows only a still picture, and the visitor cannot press play. Open the video example, remove the word `controls`, and press **Run** to see this happen.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Showing another page with an iframe',
    },
    {
      kind: 'text',
      text: "An `<iframe>` is a window on your page that shows a different page inside it. *iframe* is short for *inline frame*. People use iframes to show a map, a video from a video website, or a page from another site.",
    },
    {
      kind: 'text',
      text: "Usually the `src` attribute holds the address of the page to show. In the example below, the `srcdoc` attribute holds a tiny page written right there instead, so it works without the internet. The `width` and `height` set the size of the window.",
    },
    {
      kind: 'example',
      label: 'iframe.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Iframe</title>
</head>
<body>
  <h1>Our library</h1>
  <p>The box below is a small page inside this page:</p>
  <iframe title="Opening times" width="300" height="120"
    srcdoc="<h2>Opening times</h2><p>Monday to Friday, 9 am to 5 pm.</p>"></iframe>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "To show a real page from the web, use `src` with the full address:",
    },
    {
      kind: 'example',
      label: 'iframe-src.html',
      run: 'none',
      code: `<iframe src="https://example.com" title="The Example home page" width="400" height="300"></iframe>`,
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Always give an iframe a title',
      blocks: [
        {
          kind: 'text',
          text: "A screen reader cannot look inside the frame to guess what it is. The `title` attribute tells it, in a few words, what the frame shows, like `title=\"Opening times\"`.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Show the play and pause buttons on this video. Fill in the attribute name.",
        code: `<video width="320" height="180" [___]>
  <source src="/assets/media/hills.mp4" type="video/mp4">
  Sorry, your browser cannot play this video.
</video>`,
        answers: ['controls'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: "Tell the audio player which file to play. Fill in the element name.",
        code: `<audio controls>
  <[___] src="/assets/media/song.mp3" type="audio/mpeg">
  Sorry, your browser cannot play this sound.
</audio>`,
        answers: ['source'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Which attribute tells a screen reader what an `<iframe>` shows?',
        options: ['`title`', '`alt`', '`controls`', '`srcdoc`'],
        answer: '`title`',
      },
    },
  ],
};
