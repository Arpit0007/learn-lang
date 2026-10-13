import { Course } from '../../shared/content';
import { HOME } from './home';
import { INTRODUCTION } from './introduction';
import { ELEMENTS } from './elements';
import { ATTRIBUTES } from './attributes';
import { HEADINGS_PARAGRAPHS } from './headings-paragraphs';
import { TEXT_FORMATTING } from './text-formatting';
import { ENTITIES_SYMBOLS } from './entities-symbols';
import { LINKS } from './links';
import { IMAGES } from './images';
import { FILE_PATHS } from './file-paths';
import { MEDIA } from './media';
import { LISTS } from './lists';
import { TABLES } from './tables';
import { BLOCK_INLINE } from './block-inline';
import { CLASSES_IDS } from './classes-ids';
import { LAYOUT } from './layout';
import { RESPONSIVE_IMAGES } from './responsive-images';
import { SVG } from './svg';
import { FORMS } from './forms';
import { FORM_INPUTS } from './form-inputs';
import { FORM_VALIDATION } from './form-validation';
import { ACCESSIBILITY } from './accessibility';

export const HTML: Course = {
  slug: 'html',
  menuLabel: 'HTML',
  title: 'HTML Tutorial',
  description: 'Learn to build web pages from the very first tag to links, images, video, lists, tables, page layout and forms, with examples you can edit and run.',
  tryItRunner: 'web',
  exampleLang: 'html',
  exampleRun: 'tryit',
  // Order matters: lessons refer back to earlier ones (e.g. Form validation uses Form inputs).
  groups: [
    {
      title: 'HTML basics',
      lessons: [HOME, INTRODUCTION, ELEMENTS, ATTRIBUTES, HEADINGS_PARAGRAPHS, TEXT_FORMATTING, ENTITIES_SYMBOLS],
    },
    {
      title: 'Links, images and media',
      lessons: [LINKS, IMAGES, FILE_PATHS, MEDIA],
    },
    {
      title: 'Structure and layout',
      lessons: [LISTS, TABLES, BLOCK_INLINE, CLASSES_IDS, LAYOUT, RESPONSIVE_IMAGES, SVG],
    },
    {
      title: 'Forms and accessibility',
      lessons: [FORMS, FORM_INPUTS, FORM_VALIDATION, ACCESSIBILITY],
    },
  ],
};
