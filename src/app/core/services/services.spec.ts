import { TestBed } from '@angular/core/testing';
import { Course, Lesson } from '../../shared/content';
import { CourseService, findLesson, lessonsOf, locate, neighbours, tryItExamples } from './course.service';
import { ProgressService } from './progress.service';
import { ThemeService } from './theme.service';

const lesson = (slug: string): Lesson => ({ slug, title: slug.toUpperCase(), blocks: [] });
const course: Course = {
  slug: 'demo', menuLabel: 'Demo', title: 'Demo', description: '', exampleLang: 'javascript', exampleRun: 'inline',
  groups: [
    { title: 'One', lessons: [lesson('a'), lesson('b')] },
    { title: 'Two', lessons: [lesson('c')] },
  ],
};

describe('course helpers', () => {
  it('flattens groups in order', () => {
    expect(lessonsOf(course).map((l) => l.slug)).toEqual(['a', 'b', 'c']);
  });

  it('finds lessons and returns undefined for unknown slugs', () => {
    expect(findLesson(course, 'b')?.title).toBe('B');
    expect(findLesson(course, 'zzz')).toBeUndefined();
  });

  it('gives neighbours across group boundaries and none past the ends', () => {
    expect(neighbours(course, 'a')).toEqual({ prev: undefined, next: course.groups[0].lessons[1] });
    expect(neighbours(course, 'b').next?.slug).toBe('c');
    expect(neighbours(course, 'c').next).toBeUndefined();
    expect(neighbours(course, 'zzz')).toEqual({});
  });

  it('locates a lesson within the course', () => {
    expect(locate(course, 'c')).toEqual({ index: 2, total: 3, group: course.groups[1] });
  });

  it('numbers Try-it examples in reading order, including inside callouts', () => {
    const web: Course = { ...course, exampleRun: 'tryit' };
    const one = { kind: 'example' as const, code: '1' };
    const snippet = { kind: 'example' as const, code: 's', run: 'none' as const };
    const two = { kind: 'example' as const, code: '2' };
    const l: Lesson = { slug: 'x', title: 'X', blocks: [one, snippet, { kind: 'callout', tone: 'key', blocks: [two] }] };
    expect(tryItExamples(web, l)).toEqual([one, two]);
  });
});

describe('CourseService', () => {
  it('resolves an unknown course to undefined', async () => {
    await expect(TestBed.inject(CourseService).load('nope')).resolves.toBeUndefined();
  });

  it('loads JavaScript once and caches it', async () => {
    const service = TestBed.inject(CourseService);
    const first = await service.load('javascript');
    expect(first?.slug).toBe('javascript');
    expect(await service.load('javascript')).toBe(first);
  });
});

describe('ProgressService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => jest.restoreAllMocks());

  it('remembers finished lessons across instances', () => {
    TestBed.inject(ProgressService).markDone('javascript', 'm1');
    TestBed.resetTestingModule();
    const again = TestBed.inject(ProgressService);
    expect(again.isDone('javascript', 'm1')).toBe(true);
    expect(again.isDone('javascript', 'm2')).toBe(false);
    expect(again.doneCount('javascript')).toBe(1);
  });

  it('keeps working when storage throws', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const service = TestBed.inject(ProgressService);
    expect(() => service.markDone('javascript', 'm1')).not.toThrow();
    expect(service.isDone('javascript', 'm1')).toBe(true);
  });
});

describe('ThemeService', () => {
  const setSystemDark = (dark: boolean) => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: dark, addEventListener: jest.fn() }) as never;
  };
  beforeEach(() => { localStorage.clear(); delete document.documentElement.dataset['theme']; });

  it('follows the system setting when nothing is saved', () => {
    setSystemDark(true);
    const theme = TestBed.inject(ThemeService);
    expect(theme.isDark()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBeUndefined();
  });

  it('a saved choice wins over the system', () => {
    setSystemDark(true);
    localStorage.setItem('ll_theme', 'light');
    expect(TestBed.inject(ThemeService).isDark()).toBe(false);
  });

  it('toggle sets data-theme and saves it', () => {
    setSystemDark(false);
    const theme = TestBed.inject(ThemeService);
    theme.toggle();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('ll_theme')).toBe('dark');
  });
});
