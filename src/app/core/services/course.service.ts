import { Injectable } from '@angular/core';
import { Block, Course, Lesson, LessonGroup } from '../../shared/content';
import { COURSES, CourseEntry } from '../../content/courses';

/** All lessons of a course in reading order, across groups. */
export function lessonsOf(course: Course): Lesson[] {
  return course.groups.flatMap((g) => g.lessons);
}

export function findLesson(course: Course, slug: string): Lesson | undefined {
  return lessonsOf(course).find((l) => l.slug === slug);
}

export function neighbours(course: Course, slug: string): { prev?: Lesson; next?: Lesson } {
  const all = lessonsOf(course);
  const i = all.findIndex((l) => l.slug === slug);
  if (i < 0) return {};
  return { prev: all[i - 1], next: all[i + 1] };
}

type Example = Extract<Block, { kind: 'example' }>;

/** A lesson's Try-it examples in reading order (also inside callouts and reveals); /try/:n is 1-based into this. */
export function tryItExamples(course: Course, lesson: Lesson): Example[] {
  const out: Example[] = [];
  const walk = (blocks: Block[]) => blocks.forEach((b) => {
    if (b.kind === 'example' && (b.run ?? course.exampleRun) === 'tryit') out.push(b);
    if (b.kind === 'callout' || b.kind === 'reveal') walk(b.blocks);
  });
  walk(lesson.blocks);
  return out;
}

/** Where a lesson sits: its 0-based position, the course size, and its sidebar group. */
export function locate(course: Course, slug: string): { index: number; total: number; group?: LessonGroup } {
  const all = lessonsOf(course);
  return {
    index: all.findIndex((l) => l.slug === slug),
    total: all.length,
    group: course.groups.find((g) => g.lessons.some((l) => l.slug === slug)),
  };
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  readonly entries: readonly CourseEntry[] = COURSES;
  private readonly cache = new Map<string, Promise<Course>>();
  private readonly loaded = new Map<string, Course>();

  /** The course if it has already loaded; lets pages render synchronously (e.g. on Back, so scroll can be restored). */
  peek(slug: string): Course | undefined {
    return this.loaded.get(slug);
  }

  entry(slug: string): CourseEntry | undefined {
    return this.entries.find((c) => c.slug === slug);
  }

  /** Resolves to undefined for an unknown course; rejects if the content chunk fails to load. */
  load(slug: string): Promise<Course | undefined> {
    const entry = this.entry(slug);
    if (!entry) return Promise.resolve(undefined);
    let pending = this.cache.get(slug);
    if (!pending) {
      pending = entry.load().then((c) => { this.loaded.set(slug, c); return c; });
      this.cache.set(slug, pending);
      pending.catch(() => this.cache.delete(slug)); // allow a retry after a network failure
    }
    return pending;
  }
}
