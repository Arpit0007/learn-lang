import { Course } from '../shared/content';

export interface CourseEntry {
  slug: string;
  menuLabel: string;
  description: string;
  /** Loads the course content (its own lazy chunk). */
  load: () => Promise<Course>;
}

/** Every course, in menu order. The menu and home page read only this list. */
export const COURSES: CourseEntry[] = [
  {
    slug: 'html',
    menuLabel: 'HTML',
    description: 'Learn to build web pages from the very first tag to links, images, video, lists, tables, page layout and forms, with examples you can edit and run.',
    load: () => import('./html').then((m) => m.HTML),
  },
  {
    slug: 'css',
    menuLabel: 'CSS',
    description: 'Learn to style web pages with CSS, from your first rule to colors, fonts, the box model, Flexbox, Grid and responsive layouts.',
    load: () => import('./css').then((m) => m.CSS),
  },
  {
    slug: 'javascript',
    menuLabel: 'JavaScript',
    description:
      'The JavaScript Ladder: thirty modules from your first console.log to closures, async, testing and interview prep. Every example runs.',
    load: () => import('./javascript').then((m) => m.JAVASCRIPT),
  },
  {
    slug: 'python',
    menuLabel: 'Python',
    description:
      'The Python Ladder: thirty modules from print("hi") to generators, decorators, asyncio, type hints and interview prep. Predict each output, then reveal it.',
    load: () => import('./python').then((m) => m.PYTHON),
  },
  {
    slug: 'postgresql',
    menuLabel: 'PostgreSQL',
    description: 'Learn SQL and PostgreSQL from your first SELECT to joins, transactions, indexes and production. Every example runs real PostgreSQL in your browser.',
    load: () => import('./postgresql').then((m) => m.POSTGRESQL),
  },
  {
    slug: 'nestjs',
    menuLabel: 'NestJS',
    description:
      'The NestJS Ladder: backend Node.js for TypeScript and Angular developers. From your first project to databases, login, queues, testing, Docker and microservices.',
    load: () => import('./nestjs').then((m) => m.NESTJS),
  },
];
