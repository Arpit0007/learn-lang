/**
 * Tutorial content model. Every course is plain data in these shapes; the web
 * app renders it. Strings marked "rich text" support **bold**, *italic*,
 * `inline code` and [links](https://…).
 */

/** 'text' = no highlighting (terminal sessions, tracebacks, plain files). */
export type CodeLang = 'html' | 'css' | 'javascript' | 'typescript' | 'python' | 'sql' | 'text';

/** How an example runs: full-screen Try-it page, inline under the code, or not at all. */
export type RunMode = 'tryit' | 'inline' | 'none';

export interface Course {
  /** URL segment, e.g. 'javascript'. */
  slug: string;
  /** Label in the language menu, e.g. 'JavaScript'. */
  menuLabel: string;
  /** Sidebar heading, e.g. 'The JavaScript Ladder'. */
  title: string;
  /** Home-page card text. */
  description: string;
  /** 'web' marks courses whose Try-it examples are full HTML pages (HTML, CSS). */
  tryItRunner?: 'web';
  /** Default highlighting for examples that don't set `lang`. */
  exampleLang: CodeLang;
  /** Default run mode for examples that don't set `run`. */
  exampleRun: RunMode;
  /** SQL courses: builds the sample database once; every run starts from a fresh copy of it. */
  setup?: string;
  /** Sidebar groups; their order is the course order. */
  groups: LessonGroup[];
}

export interface LessonGroup {
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  /** Unique within the course; used in the URL. */
  slug: string;
  /** Page heading. */
  title: string;
  /** Short sidebar label; defaults to `title`. */
  nav?: string;
  /** Number shown before the sidebar label, e.g. 'M6'. */
  num?: string;
  /** Small label above the heading, e.g. 'Level 1 · ~2 sessions'. */
  eyebrow?: string;
  blocks: Block[];
}

export type Block =
  | { kind: 'heading'; level: 2 | 3 | 4; text: string }
  | { kind: 'text'; text: string; style?: 'lede' | 'small' }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'callout'; tone: CalloutTone; title?: string; blocks: Block[] }
  /**
   * `output`: the expected result, revealed with "Show output" (predict first, then check).
   * `verdict`: marks one side of a comparison, e.g. the naive version ('bad') vs the idiomatic one ('good').
   * `setup`: SQL run (hidden) before the example, on top of the course database.
   * `expectError`: the example deliberately fails (e.g. to show a constraint at work).
   */
  | {
      kind: 'example'; code: string; lang?: CodeLang; label?: string; run?: RunMode; demoHtml?: string;
      output?: string; verdict?: 'good' | 'bad'; setup?: string; expectError?: boolean;
    }
  | { kind: 'exercise'; exercise: Exercise }
  | { kind: 'quiz'; question: string; options: string[]; answer: number; why: string }
  | { kind: 'reveal'; tag: string; title: string; blocks: Block[] }
  | { kind: 'figure'; svg: string; caption: string; animated?: boolean }
  | { kind: 'cards'; cards: { title: string; tags: string; text: string }[] };

export type CalloutTone = 'key' | 'trap' | 'win' | 'plain';

export type Exercise =
  /** `code` has one `[___]` per gap; answers[i] = accepted value(s) for gap i, the first is canonical. */
  | { type: 'fill_code'; prompt: string; code: string; answers: (string | string[])[] }
  | { type: 'multiple_choice'; prompt: string; options: string[]; answer: string };

/** The gap marker inside a `fill_code` exercise. */
export const GAP = '[___]';
