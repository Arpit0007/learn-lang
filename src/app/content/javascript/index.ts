import { Course } from '../../shared/content';
import { HOW_TO_USE } from './how-to-use';
import { ROADMAP } from './roadmap';
import { STUDY_PLAN } from './study-plan';
import { M1_WHAT_IS_JAVASCRIPT } from './m1-what-is-javascript';
import { M2_VALUES_VARIABLES_TYPES } from './m2-values-variables-types';
import { M3_OPERATORS } from './m3-operators';
import { M4_STRINGS_NUMBERS } from './m4-strings-numbers';
import { M5_CONTROL_FLOW } from './m5-control-flow';
import { M6_FUNCTIONS } from './m6-functions';
import { M7_ARRAYS } from './m7-arrays';
import { M8_OBJECTS } from './m8-objects';
import { M9_DOM } from './m9-dom';
import { M10_EVENTS } from './m10-events';
import { M11_SCOPE_CLOSURES } from './m11-scope-closures';
import { M12_THIS } from './m12-this';
import { M13_PROTOTYPES_CLASSES } from './m13-prototypes-classes';
import { M14_ASYNC } from './m14-async';
import { M15_FETCH } from './m15-fetch';
import { M16_MODULES } from './m16-modules';
import { M17_FUNCTIONAL } from './m17-functional';
import { M18_PERFORMANCE } from './m18-performance';
import { M19_DEBUGGING } from './m19-debugging';
import { M20_RECURSION } from './m20-recursion';
import { M21_BIG_O } from './m21-big-o';
import { M22_REGEX } from './m22-regex';
import { M23_DATES } from './m23-dates';
import { M24_COLLECTIONS } from './m24-collections';
import { M25_GENERATORS } from './m25-generators';
import { M26_STORAGE } from './m26-storage';
import { M27_TESTING } from './m27-testing';
import { M28_NODE } from './m28-node';
import { M29_MODERN_JS } from './m29-modern-js';
import { M30_METAPROGRAMMING } from './m30-metaprogramming';
import { GLOSSARY } from './glossary';
import { PROJECTS } from './projects';
import { INTERVIEW } from './interview';

/** "The JavaScript Ladder" — imported from the author's course artifact (English edition). */
export const JAVASCRIPT: Course = {
  slug: 'javascript',
  menuLabel: 'JavaScript',
  title: 'The JavaScript Ladder',
  description: 'The JavaScript Ladder: thirty modules from your first console.log to closures, async, testing and interview prep. Every example runs.',
  exampleLang: 'javascript',
  exampleRun: 'inline',
  groups: [
    { title: "Start here", lessons: [HOW_TO_USE, ROADMAP, STUDY_PLAN] },
    { title: "Level 0 · Ground", lessons: [M1_WHAT_IS_JAVASCRIPT] },
    { title: "Level 1 · Fundamentals", lessons: [M2_VALUES_VARIABLES_TYPES, M3_OPERATORS, M4_STRINGS_NUMBERS, M5_CONTROL_FLOW, M6_FUNCTIONS] },
    { title: "Level 2 · Data shapes", lessons: [M7_ARRAYS, M8_OBJECTS] },
    { title: "Level 3 · The browser", lessons: [M9_DOM, M10_EVENTS] },
    { title: "Level 4 · How JavaScript really works", lessons: [M11_SCOPE_CLOSURES, M12_THIS, M13_PROTOTYPES_CLASSES] },
    { title: "Level 5 · Async and modern JavaScript", lessons: [M14_ASYNC, M15_FETCH, M16_MODULES] },
    { title: "Level 6 · Craft", lessons: [M17_FUNCTIONAL, M18_PERFORMANCE] },
    { title: "Level 7 · The working toolkit", lessons: [M19_DEBUGGING, M20_RECURSION, M21_BIG_O, M22_REGEX, M23_DATES, M24_COLLECTIONS, M25_GENERATORS, M26_STORAGE, M27_TESTING, M28_NODE, M29_MODERN_JS, M30_METAPROGRAMMING] },
    { title: "Reference", lessons: [GLOSSARY, PROJECTS, INTERVIEW] },
  ],
};
