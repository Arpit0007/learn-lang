import { Course } from '../../shared/content';
import { HOME } from './home';
import { INTRODUCTION } from './introduction';
import { SYNTAX } from './syntax';
import { SELECTORS } from './selectors';
import { COLORS } from './colors';
import { BACKGROUNDS } from './backgrounds';
import { TEXT_FONTS } from './text-fonts';
import { CASCADE_SPECIFICITY } from './cascade-specificity';
import { UNITS } from './units';
import { BOX_MODEL } from './box-model';
import { BORDERS_SHADOWS } from './borders-shadows';
import { DISPLAY } from './display';
import { POSITION } from './position';
import { FLEXBOX } from './flexbox';
import { GRID } from './grid';
import { CENTERING } from './centering';
import { RESPONSIVE } from './responsive';
import { MATH_FUNCTIONS } from './math-functions';
import { OVERFLOW_IMAGES } from './overflow-images';
import { HOVER_TRANSITIONS } from './hover-transitions';
import { STYLING_ELEMENTS } from './styling-elements';
import { PSEUDO_ELEMENTS } from './pseudo-elements';
import { TRANSFORMS } from './transforms';
import { ANIMATIONS } from './animations';
import { VARIABLES } from './variables';
import { MODERN_CSS } from './modern-css';

export const CSS: Course = {
  slug: 'css',
  menuLabel: 'CSS',
  title: 'CSS Tutorial',
  description: 'Learn to style web pages with CSS, from your first rule to colors, fonts, the box model, Flexbox, Grid and responsive layouts.',
  tryItRunner: 'web',
  exampleLang: 'html',
  exampleRun: 'tryit',
  // Order matters: later lessons refer back to earlier ones (e.g. Transforms uses Hover, Animations uses Transforms).
  groups: [
    {
      title: 'CSS basics',
      lessons: [HOME, INTRODUCTION, SYNTAX, SELECTORS, COLORS, BACKGROUNDS, TEXT_FONTS, CASCADE_SPECIFICITY, UNITS],
    },
    {
      title: 'Boxes and layout',
      lessons: [BOX_MODEL, BORDERS_SHADOWS, DISPLAY, POSITION, FLEXBOX, GRID, CENTERING, RESPONSIVE, MATH_FUNCTIONS, OVERFLOW_IMAGES],
    },
    {
      title: 'Effects and advanced',
      lessons: [HOVER_TRANSITIONS, STYLING_ELEMENTS, PSEUDO_ELEMENTS, TRANSFORMS, ANIMATIONS, VARIABLES, MODERN_CSS],
    },
  ],
};
