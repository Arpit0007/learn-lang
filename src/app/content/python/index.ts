import { Course } from '../../shared/content';
import { HOW_TO_USE } from './how-to-use';
import { ROADMAP } from './roadmap';
import { STUDY_PLAN } from './study-plan';
import { M1_WHAT_IS_PYTHON } from './m1-what-is-python';
import { M2_VARIABLES } from './m2-variables';
import { M3_STRINGS } from './m3-strings';
import { M4_NUMBERS } from './m4-numbers';
import { M5_STYLE } from './m5-style';
import { M6_LISTS } from './m6-lists';
import { M7_LOOPS } from './m7-loops';
import { M8_SLICING_TUPLES } from './m8-slicing-tuples';
import { M9_IF_STATEMENTS } from './m9-if-statements';
import { M10_DICTIONARIES } from './m10-dictionaries';
import { M11_SETS } from './m11-sets';
import { M12_INPUT_WHILE } from './m12-input-while';
import { M13_FUNCTIONS } from './m13-functions';
import { M14_MODULES_IMPORTS } from './m14-modules-imports';
import { M15_CLASSES } from './m15-classes';
import { M16_INHERITANCE } from './m16-inheritance';
import { M17_DATACLASSES_ENUMS } from './m17-dataclasses-enums';
import { M18_FILES_PATHS } from './m18-files-paths';
import { M19_EXCEPTIONS } from './m19-exceptions';
import { M20_JSON_CSV } from './m20-json-csv';
import { M21_ENVIRONMENTS } from './m21-environments';
import { M22_REFERENCES } from './m22-references';
import { M23_GENERATORS } from './m23-generators';
import { M24_DECORATORS } from './m24-decorators';
import { M25_CONTEXT_MANAGERS } from './m25-context-managers';
import { M26_TYPE_HINTS } from './m26-type-hints';
import { M27_CONCURRENCY } from './m27-concurrency';
import { M28_COMPLEXITY } from './m28-complexity';
import { M29_TESTING } from './m29-testing';
import { M30_STDLIB } from './m30-stdlib';
import { PROJECTS } from './projects';
import { INTERVIEW } from './interview';
import { GLOSSARY } from './glossary';

/** "The Python Ladder" — imported from the author's course artifact (English edition). */
export const PYTHON: Course = {
  slug: 'python',
  menuLabel: 'Python',
  title: 'The Python Ladder',
  description: 'The Python Ladder: thirty modules from print("hi") to generators, decorators, asyncio, type hints and interview prep. Predict each output, then reveal it.',
  exampleLang: 'python',
  exampleRun: 'none',
  groups: [
    { title: "Start here", lessons: [HOW_TO_USE, ROADMAP, STUDY_PLAN] },
    { title: "Level 0 · Ground & setup", lessons: [M1_WHAT_IS_PYTHON] },
    { title: "Level 1 · Fundamentals", lessons: [M2_VARIABLES, M3_STRINGS, M4_NUMBERS, M5_STYLE, M6_LISTS, M7_LOOPS, M8_SLICING_TUPLES, M9_IF_STATEMENTS, M10_DICTIONARIES, M11_SETS, M12_INPUT_WHILE] },
    { title: "Level 2 · Structure", lessons: [M13_FUNCTIONS, M14_MODULES_IMPORTS, M15_CLASSES, M16_INHERITANCE, M17_DATACLASSES_ENUMS] },
    { title: "Level 3 · The real world", lessons: [M18_FILES_PATHS, M19_EXCEPTIONS, M20_JSON_CSV, M21_ENVIRONMENTS] },
    { title: "Level 4 · How Python really works", lessons: [M22_REFERENCES, M23_GENERATORS, M24_DECORATORS, M25_CONTEXT_MANAGERS, M26_TYPE_HINTS] },
    { title: "Level 5 · Concurrency & speed", lessons: [M27_CONCURRENCY, M28_COMPLEXITY] },
    { title: "Level 6 · Craft", lessons: [M29_TESTING, M30_STDLIB] },
    { title: "Reference", lessons: [PROJECTS, INTERVIEW, GLOSSARY] },
  ],
};
