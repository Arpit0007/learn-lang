import { Lesson } from '../../shared/content';

export const ANIMATIONS: Lesson = {
  slug: 'animations',
  title: 'CSS Animations',
  nav: 'Animations',
  blocks: [
    {
      kind: 'text',
      text: "A transition changes a style once, when something happens, such as the mouse moving over a button. An **animation** can do more. It starts by itself, it can pass through many steps, and it can repeat as often as you want. A loading spinner is a typical animation.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Keyframes',
    },
    {
      kind: 'text',
      text: "First, describe the animation with `@keyframes`, followed by a name that you choose. Inside, list the **keyframes**: the styles at certain moments of the animation. `from` is the start and `to` is the end. The browser draws all the steps in between.",
    },
    {
      kind: 'example',
      label: 'fade-in.css',
      lang: 'css',
      run: 'none',
      code: `@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`,
    },
    {
      kind: 'text',
      text: "`opacity` sets how see-through an element is: `0` is invisible and `1` is fully visible. For more steps, use percentages of the time instead: `0%` is the start, `50%` is halfway and `100%` is the end. `from` is the same as `0%`, and `to` is the same as `100%`.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Playing an animation',
    },
    {
      kind: 'text',
      text: "`@keyframes` alone does nothing. You must attach it to an element with the `animation` properties. You need at least two of them: `animation-name`, the name of the keyframes, and `animation-duration`, how long one round takes.",
    },
    {
      kind: 'table',
      head: ['Property', 'What it sets', 'Example values'],
      rows: [
        ['`animation-name`', 'The name of the `@keyframes` to play', '`fade-in`'],
        ['`animation-duration`', 'How long one round takes', '`2s`, `0.5s`'],
        ['`animation-timing-function`', 'The speed during a round, as in transitions', '`ease`, `linear`, `ease-in-out`'],
        ['`animation-delay`', 'How long to wait before the first round', '`1s`'],
        ['`animation-iteration-count`', 'How many rounds to play', '`3`, `infinite`'],
        ['`animation-direction`', 'Which way each round plays', '`normal`, `reverse`, `alternate`'],
      ],
    },
    {
      kind: 'text',
      text: "`ease-in-out` starts slowly and ends slowly. `infinite` means: repeat forever. `alternate` plays one round forward and the next round backward. So the movement goes smoothly back and forth, instead of jumping back to the start.",
    },
    {
      kind: 'example',
      label: 'keyframes.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  @keyframes slide {
    from { transform: translate(0, 0); }
    to   { transform: translate(14rem, 0); }
  }
  @keyframes colors {
    0%   { background-color: #2563eb; }
    33%  { background-color: #db2777; }
    66%  { background-color: #ea580c; }
    100% { background-color: #2563eb; }
  }
  .ball {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #db2777;
    animation-name: slide;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  .bar {
    margin-top: 2rem;
    padding: 1rem;
    color: white;
    animation-name: colors;
    animation-duration: 6s;
    animation-iteration-count: infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .ball, .bar {
      animation: none;
    }
  }
</style>
</head>
<body>
  <div class="ball"></div>
  <div class="bar">My color changes: blue, pink, orange, and back to blue.</div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "Change `alternate` to `normal` and press **Run**. Now the ball jumps back to the left after each round. The bar uses percentages, so it can pass through four colors in one round.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'The animation shorthand',
    },
    {
      kind: 'text',
      text: "Writing many properties is long. The `animation` **shorthand** (short form) puts them in one line, for example `animation: spin 1s linear infinite;`. You can write the values in any order, with one rule: the first time is the duration, and the second time is the delay.",
    },
    {
      kind: 'text',
      text: "If `@keyframes` has no `from`, the animation starts from the normal style of the element. The `spin` animation below only needs `to`.",
    },
    {
      kind: 'example',
      label: 'shorthand.html',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: system-ui, sans-serif;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes jump {
    from { transform: translate(0, 0); }
    to   { transform: translate(0, -1rem); }
  }
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 6px solid #e2e8f0;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  .dots {
    padding-top: 1rem;
  }
  .dot {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #7c3aed;
    animation: jump 0.5s ease-in-out infinite alternate;
  }
  .second { animation-delay: 0.15s; }
  .third  { animation-delay: 0.3s; }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation-duration: 4s;
    }
    .dot {
      animation: none;
    }
  }
</style>
</head>
<body>
  <p>Loading:</p>
  <div class="spinner"></div>
  <p>Someone is typing:</p>
  <div class="dots">
    <span class="dot"></span>
    <span class="dot second"></span>
    <span class="dot third"></span>
  </div>
</body>
</html>`,
    },
    {
      kind: 'text',
      text: "The spinner is a circle with a light gray border. `border-top-color` makes only the top part of the border blue, so you can see it turn. The three dots use the same animation, but `animation-delay` makes each dot start a little later.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Nothing moves?',
      blocks: [
        {
          kind: 'text',
          text: "Check two things. First, the name in `animation` must match the name after `@keyframes` exactly, with the same capital and small letters. Second, the animation needs a duration. Without one, it lasts `0s`, so you see nothing.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Transition or animation?',
    },
    {
      kind: 'table',
      head: ['Question', 'Transition', 'Animation'],
      rows: [
        ['How does it start?', 'When a value changes, for example on `:hover`', 'By itself, as soon as its rule applies'],
        ['How many steps?', 'Two: the old value and the new value', 'As many as you want, with `@keyframes`'],
        ['Can it repeat?', 'No', 'Yes, even forever with `infinite`'],
        ['Good for', 'Small reactions, like a button that changes color', 'Things that move on their own, like a spinner'],
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Respect reduced motion',
    },
    {
      kind: 'text',
      text: "Movement on screen can make some people feel dizzy or sick. As with transitions, use the `prefers-reduced-motion` media query. Turn off animations that are only decoration. Make the ones that help people, like a loading spinner, slower and calmer. Both examples above do this. If the examples in this lesson do not move for you, this setting is probably on.",
    },
    {
      kind: 'example',
      label: 'reduced-motion.css',
      lang: 'css',
      run: 'none',
      code: `@media (prefers-reduced-motion: reduce) {
  .dot {
    animation: none;
  }
  .spinner {
    animation-duration: 4s;
  }
}`,
    },
    {
      kind: 'callout',
      tone: 'win',
      title: 'How to test it',
      blocks: [
        {
          kind: 'text',
          text: "Turn the setting on, on your own computer or phone, then press **Run** again. Look in the accessibility settings for a name like **Reduce motion**, **Remove animations** or **Animation effects**.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Create an animation called `grow`. Fill in the missing word after the `@` sign.',
        code: `@[___] grow {
  from { transform: scale(1); }
  to   { transform: scale(1.5); }
}`,
        answers: ['keyframes'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Make the spinner turn forever, but stop it for people who ask for less motion. Fill in the two missing words.',
        code: `.spinner {
  animation: spin 1s linear [___];
}
@media ([___]: reduce) {
  .spinner {
    animation: none;
  }
}`,
        answers: ['infinite', 'prefers-reduced-motion'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A loading spinner must turn again and again, even when nobody touches the page. What should you use?',
        options: ['An animation with `@keyframes`', 'A transition', 'A `:hover` rule', 'A media query'],
        answer: 'An animation with `@keyframes`',
      },
    },
  ],
};
