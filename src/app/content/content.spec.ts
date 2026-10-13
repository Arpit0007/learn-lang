import { Block, Course, Lesson } from '../shared/content';
import { checkAnswer, gapCount, acceptedValues } from '../shared/answer.util';
import { COURSES } from './courses';
import { lessonsOf } from '../core/services/course.service';

function walk(blocks: Block[], visit: (b: Block) => void): void {
  for (const b of blocks) {
    visit(b);
    if (b.kind === 'callout' || b.kind === 'reveal') walk(b.blocks, visit);
  }
}

function allBlocks(course: Course): Block[] {
  const out: Block[] = [];
  lessonsOf(course).forEach((l) => walk(l.blocks, (b) => out.push(b)));
  return out;
}

describe('course content', () => {
  let courses: Course[];

  beforeAll(async () => {
    courses = await Promise.all(COURSES.map((c) => c.load()));
  });

  it('registry entries match the loaded courses', () => {
    courses.forEach((course, i) => {
      expect(course.slug).toBe(COURSES[i].slug);
      expect(course.menuLabel).toBe(COURSES[i].menuLabel);
      // The home page shows the registry copy without loading the course, so the two must not drift.
      expect(course.description).toBe(COURSES[i].description);
    });
  });

  it('every course has lessons with unique slugs', () => {
    for (const course of courses) {
      const slugs = lessonsOf(course).map((l) => l.slug);
      expect(slugs.length).toBeGreaterThan(0);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('every block is well-formed', () => {
    for (const course of courses) {
      for (const b of allBlocks(course)) {
        const where = `${course.slug}: ${JSON.stringify(b).slice(0, 80)}`;
        switch (b.kind) {
          case 'example':
            expect({ where, ok: b.code.trim().length > 0 }).toEqual({ where, ok: true });
            break;
          case 'quiz':
            expect({ where, ok: Number.isInteger(b.answer) && b.answer >= 0 && b.answer < b.options.length && b.why.trim() !== '' })
              .toEqual({ where, ok: true });
            break;
          case 'callout':
          case 'reveal':
            expect({ where, ok: b.blocks.length > 0 }).toEqual({ where, ok: true });
            break;
          case 'figure':
            expect({ where, ok: b.svg.startsWith('<svg') && b.caption.trim() !== '' }).toEqual({ where, ok: true });
            expect({ where, unsafe: /<script|\son[a-z]+\s*=|javascript:/i.test(b.svg) }).toEqual({ where, unsafe: false });
            break;
          case 'exercise': {
            const ex = b.exercise;
            if (ex.type === 'fill_code') {
              expect(gapCount(ex.code)).toBeGreaterThan(0);
              expect(gapCount(ex.code)).toBe(ex.answers.length);
              expect(checkAnswer(ex, acceptedValues(ex.answers).map((a) => a[0]))).toBe(true);
            } else {
              expect(ex.options).toContain(ex.answer);
              expect(checkAnswer(ex, ex.answer)).toBe(true);
            }
            break;
          }
        }
      }
    }
  });

  describe('web courses (HTML, CSS)', () => {
    const web = () => courses.filter((c) => c.tryItRunner === 'web');
    const examples = (c: Course) => allBlocks(c).filter((b): b is Extract<Block, { kind: 'example' }> => b.kind === 'example');

    it('Try-it examples are complete HTML documents', () => {
      for (const c of web()) {
        for (const ex of examples(c).filter((e) => (e.run ?? c.exampleRun) === 'tryit')) {
          expect({ course: c.slug, label: ex.label, doctype: /^<!DOCTYPE html>/i.test(ex.code.trimStart()) })
            .toEqual({ course: c.slug, label: ex.label, doctype: true });
        }
      }
    });

    it('every image an example uses exists, and examples stay offline-safe', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { existsSync } = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { resolve } = require('path');
      for (const c of web()) {
        for (const ex of examples(c)) {
          for (const m of ex.code.matchAll(/\/assets\/img\/([\w.-]+)/g)) {
            expect({ image: m[1], exists: existsSync(resolve(__dirname, '../../assets/img', m[1])) }).toEqual({ image: m[1], exists: true });
          }
          const urls = [...ex.code.matchAll(/(?:href|src|action)\s*=\s*"(https?:[^"]*)"/g)].map((m) => m[1]);
          for (const u of urls) expect({ url: u, ok: /^https:\/\/example\.com(\/|$)/.test(u) }).toEqual({ url: u, ok: true });
          expect({ label: ex.label, script: /<script/i.test(ex.code) }).toEqual({ label: ex.label, script: false });
          if (/<form/i.test(ex.code)) expect({ label: ex.label, safe: /preventDefault\(\)/.test(ex.code) }).toEqual({ label: ex.label, safe: true });
        }
      }
    });

    it('every lesson ends with practice', () => {
      for (const c of web()) {
        for (const l of lessonsOf(c)) {
          const n = l.blocks.filter((b) => b.kind === 'exercise').length;
          expect({ lesson: `${c.slug}/${l.slug}`, enough: n >= 2 }).toEqual({ lesson: `${c.slug}/${l.slug}`, enough: true });
        }
      }
    });
  });

  describe('PostgreSQL course', () => {
    let pg: Course;
    beforeAll(() => { pg = courses.find((c) => c.slug === 'postgresql')!; });

    it('has 39 pages in 8 groups, built on the sample database', () => {
      expect(lessonsOf(pg)).toHaveLength(39);
      expect(pg.groups).toHaveLength(8);
      expect(pg.setup).toContain('CREATE TABLE customers');
    });

    it('every topic lesson ends with at least two auto-checked exercises', () => {
      for (const l of lessonsOf(pg).filter((x) => !['interview', 'projects'].includes(x.slug))) {
        const n = l.blocks.filter((b) => b.kind === 'exercise').length;
        expect({ lesson: l.slug, enough: n >= 2 }).toEqual({ lesson: l.slug, enough: true });
      }
    });

    it('keeps interview questions Q1–Q30', () => {
      const nums = new Set(allBlocks(pg).flatMap((b) => {
        const m = b.kind === 'reveal' ? /^Q(\d+)$/.exec(b.tag) : null;
        return m ? [Number(m[1])] : [];
      }));
      for (let q = 1; q <= 30; q++) expect({ q, present: nums.has(q) }).toEqual({ q, present: true });
    });

    it('every example is runnable SQL, or copy-only terminal/app code', () => {
      for (const b of allBlocks(pg)) {
        if (b.kind !== 'example') continue;
        const lang = b.lang ?? pg.exampleLang;
        const run = b.run ?? pg.exampleRun;
        const ok = (lang === 'sql' && run === 'inline') || run === 'none';
        expect({ label: b.label, lang, run, ok }).toEqual({ label: b.label, lang, run, ok: true });
      }
    });
  });

  describe('The NestJS Ladder', () => {
    let nest: Course;
    beforeAll(() => { nest = courses.find((c) => c.slug === 'nestjs')!; });

    const blocksOf = (lessons: Lesson[]) => {
      const out: Block[] = [];
      lessons.forEach((l) => walk(l.blocks, (b) => out.push(b)));
      return out;
    };
    const strings = (v: unknown): string[] =>
      typeof v === 'string' ? [v]
        : Array.isArray(v) ? v.flatMap(strings)
        : v && typeof v === 'object' ? Object.values(v).flatMap(strings)
        : [];

    it('has the intro pages, Modules 1–30 in 7 levels, and the reference pages', () => {
      expect(nest.groups.map((g) => g.lessons.length)).toEqual([3, 3, 3, 3, 4, 5, 6, 6, 2]);
      expect(lessonsOf(nest).flatMap((l) => (l.num ? [l.num] : []))).toEqual(Array.from({ length: 30 }, (_, i) => `M${i + 1}`));
    });

    it('opens every level with a level banner, as Part 1 does', () => {
      nest.groups.slice(1, 8).forEach((g, i) => {
        const first = g.lessons[0].blocks[0];
        const title = first.kind === 'callout' && first.tone === 'plain' ? first.title ?? '' : '';
        expect({ lesson: g.lessons[0].slug, banner: title.startsWith(`Level ${i + 1} · `) }).toEqual({ lesson: g.lessons[0].slug, banner: true });
      });
    });

    it('Part 1 (the intro pages and Modules 1–9) matches the source page block for block', () => {
      const part1 = blocksOf(nest.groups.slice(0, 4).flatMap((g) => g.lessons));
      const count = (test: (b: Block) => boolean) => part1.filter(test).length;
      // 45 in the source, plus the install line added to Module 3.
      expect(count((b) => b.kind === 'example')).toBe(46);
      expect(count((b) => b.kind === 'example' && b.verdict === 'good')).toBe(11);
      expect(count((b) => b.kind === 'example' && b.verdict === 'bad')).toBe(5);
      expect(count((b) => b.kind === 'callout' && b.tone === 'trap')).toBe(11);
      // The two "ng" notes: "Because you come from Angular" and "Angular difference · visibility is explicit".
      expect(count((b) => b.kind === 'callout' && /Angular/.test(b.title ?? ''))).toBe(2);
      expect(count((b) => b.kind === 'reveal')).toBe(34);
      expect(count((b) => b.kind === 'quiz')).toBe(8);
      expect(count((b) => b.kind === 'figure')).toBe(1);
    });

    it('every module from 10 on has a trap, a quiz and practice', () => {
      for (const l of lessonsOf(nest).filter((x) => Number(x.num?.slice(1)) >= 10)) {
        const bs = blocksOf([l]);
        const has = {
          lesson: l.slug,
          trap: bs.some((b) => b.kind === 'callout' && b.tone === 'trap'),
          quiz: bs.some((b) => b.kind === 'quiz'),
          practice: bs.some((b) => b.kind === 'reveal' && /^(?:Exercise|Challenge) \d+\.\d+$/.test(b.tag)),
        };
        expect(has).toEqual({ lesson: l.slug, trap: true, quiz: true, practice: true });
      }
    });

    it('flags Angular differences in the purple box the course promises', () => {
      // "How to use" promises a purple (plain) box for every Angular difference; not every module has one.
      const notes = allBlocks(nest).filter((b): b is Extract<Block, { kind: 'callout' }> => b.kind === 'callout' && /Angular/.test(b.title ?? ''));
      expect(notes.length).toBeGreaterThanOrEqual(20);
      expect(notes.filter((b) => b.tone !== 'plain')).toEqual([]);
    });

    it('numbers the interview questions Q1–Q86, each once', () => {
      const seen = new Map<number, number>();
      for (const b of allBlocks(nest)) {
        const m = b.kind === 'reveal' ? /^(?:Interview )?Q(\d+)$/.exec(b.tag) : null;
        if (m) seen.set(Number(m[1]), (seen.get(Number(m[1])) ?? 0) + 1);
      }
      expect([...seen.keys()].sort((a, b) => a - b)).toEqual(Array.from({ length: 86 }, (_, i) => i + 1));
      expect([...seen].filter(([, n]) => n > 1)).toEqual([]);
    });

    it('pins every Nest package it tells you to install, so npm does not pick the Nest 12 build', () => {
      const commands = strings(nest.groups).flatMap((s) => s.match(/npm (?:i|install)\b[^\n`"]*/g) ?? []);
      const unpinned = commands
        .flatMap((c) => c.replace(/#.*/, '').match(/@nestjs\/[\w.-]+(?:@\S+)?/g) ?? [])
        .filter((p) => !/^@nestjs\/[\w.-]+@\d/.test(p));
      expect(unpinned).toEqual([]);
    });

    it('nothing in it claims to run in the browser', () => {
      expect(nest.exampleRun).toBe('none');
      expect(allBlocks(nest).some((b) => b.kind === 'example' && b.run && b.run !== 'none')).toBe(false);
    });
  });

  describe('The Python Ladder import', () => {
    const count = (course: Course, test: (b: Block) => boolean) => allBlocks(course).filter(test).length;
    let py: Course;
    beforeAll(() => { py = courses.find((c) => c.slug === 'python')!; });

    it('has all 36 pages, with modules grouped by level as in the roadmap', () => {
      expect(lessonsOf(py)).toHaveLength(36);
      expect(py.groups.map((g) => g.lessons.length)).toEqual([3, 1, 11, 5, 4, 5, 2, 2, 3]);
    });

    it('matches the source page block for block', () => {
      expect(count(py, (b) => b.kind === 'example')).toBe(80);
      expect(count(py, (b) => b.kind === 'example' && !!b.output)).toBe(55);
      expect(count(py, (b) => b.kind === 'callout' && b.tone === 'trap')).toBe(32);
      expect(count(py, (b) => b.kind === 'callout' && b.tone === 'key')).toBe(5);
      expect(count(py, (b) => b.kind === 'callout' && b.tone === 'win')).toBe(5);
      // 31 "simple" boxes in the source; the "Reading in Hindi" one was dropped with the Hindi edition.
      expect(count(py, (b) => b.kind === 'callout' && b.title === 'In simple words')).toBe(30);
      expect(count(py, (b) => b.kind === 'reveal')).toBe(93);
      expect(count(py, (b) => b.kind === 'quiz')).toBe(30);
      expect(count(py, (b) => b.kind === 'figure')).toBe(10);
      expect(allBlocks(py).flatMap((b) => (b.kind === 'cards' ? b.cards : []))).toHaveLength(9);
    });

    it('keeps every interview question Q1–Q30 and the book credit', () => {
      const nums = new Set(allBlocks(py).flatMap((b) => {
        const m = b.kind === 'reveal' ? /^(?:Interview )?Q(\d+)$/.exec(b.tag) : null;
        return m ? [Number(m[1])] : [];
      }));
      for (let q = 1; q <= 30; q++) expect({ q, present: nums.has(q) }).toEqual({ q, present: true });
      expect(JSON.stringify(py)).toContain('Python Crash Course');
    });

    it('contains no Hindi text', () => {
      expect(/[ऀ-ॿ]/.test(JSON.stringify(py))).toBe(false);
    });
  });

  describe('The JavaScript Ladder import', () => {
    const count = (course: Course, test: (b: Block) => boolean) => allBlocks(course).filter(test).length;
    let js: Course;
    beforeAll(() => { js = courses.find((c) => c.slug === 'javascript')!; });

    it('has all 36 pages in 10 groups', () => {
      expect(lessonsOf(js)).toHaveLength(36);
      expect(js.groups).toHaveLength(10);
      expect(lessonsOf(js).filter((l) => /^M\d+$/.test(l.num ?? ''))).toHaveLength(30);
    });

    it('matches the source page block for block', () => {
      expect(count(js, (b) => b.kind === 'example')).toBe(133);
      expect(count(js, (b) => b.kind === 'example' && b.run === 'none')).toBe(11);
      expect(count(js, (b) => b.kind === 'example' && !!b.demoHtml)).toBe(8);
      expect(count(js, (b) => b.kind === 'callout' && b.tone === 'trap')).toBe(25);
      expect(count(js, (b) => b.kind === 'callout' && b.tone === 'key')).toBe(16);
      expect(count(js, (b) => b.kind === 'callout' && b.tone === 'win')).toBe(4);
      expect(count(js, (b) => b.kind === 'reveal')).toBe(131);
      expect(count(js, (b) => b.kind === 'quiz')).toBe(9);
      expect(count(js, (b) => b.kind === 'figure')).toBe(11);
      expect(allBlocks(js).flatMap((b) => (b.kind === 'cards' ? b.cards : []))).toHaveLength(9);
    });

    it('keeps every interview question Q1–Q58', () => {
      const nums = new Set(allBlocks(js).flatMap((b) => {
        const m = b.kind === 'reveal' ? /^(?:Interview )?Q(\d+)$/.exec(b.tag) : null;
        return m ? [Number(m[1])] : [];
      }));
      for (let q = 1; q <= 58; q++) expect({ q, present: nums.has(q) }).toEqual({ q, present: true });
    });

    it('contains no Hindi text', () => {
      expect(/[ऀ-ॿ]/.test(JSON.stringify(js))).toBe(false);
    });
  });
});
