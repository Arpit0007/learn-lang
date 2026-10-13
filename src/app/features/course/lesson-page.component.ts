import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink, Scroll } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Block, Course, Lesson } from '../../shared/content';
import { CourseService, findLesson, lessonsOf, locate, neighbours } from '../../core/services/course.service';
import { ProgressService } from '../../core/services/progress.service';
import { BlockComponent } from '../../blocks/block.component';
import { LessonTracker } from '../../blocks/lesson-tracker';
import { LessonContext } from '../../blocks/lesson-context';
import { NotFoundComponent } from '../not-found/not-found.component';
import { LessonTocComponent, TocEntry } from './lesson-toc.component';
import { RichTextComponent } from '../../blocks/rich-text.component';

/** Quizzes and exercises a learner must get right to finish a lesson. */
function checkables(blocks: Block[]): Block[] {
  return blocks.flatMap((b) =>
    b.kind === 'quiz' || b.kind === 'exercise' ? [b]
      : b.kind === 'callout' || b.kind === 'reveal' ? checkables(b.blocks)
      : []);
}

/** Strips the inline markers for plain-text labels. */
const plain = (s: string) => s.replace(/\\(.)/g, '$1').replace(/[*`]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

const short = (s: string) => (s.length > 60 ? s.slice(0, 60).trimEnd() + '…' : s);

/** Top-level blocks worth listing under "On this page". */
function tocEntry(b: Block, i: number): TocEntry | null {
  const id = 'sec-' + i;
  switch (b.kind) {
    case 'heading': return b.level <= 3 ? { id, label: plain(b.text) } : null;
    case 'quiz': return { id, tag: 'Quick check', label: short(plain(b.question)) };
    case 'reveal': return { id, tag: b.tag || undefined, label: plain(b.title) };
    case 'exercise': return { id, tag: 'Exercise', label: short(plain(b.exercise.prompt)) };
    default: return null;
  }
}

@Component({
  selector: 'll-lesson-page',
  standalone: true,
  imports: [RouterLink, BlockComponent, NotFoundComponent, LessonTocComponent, RichTextComponent],
  providers: [LessonTracker, LessonContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.css',
})
export class LessonPageComponent {
  /** Route params (inherited from the parent route). */
  readonly courseSlug = input.required<string>({ alias: 'course' });
  readonly lessonSlug = input<string | undefined>(undefined, { alias: 'lesson' });

  private readonly courses = inject(CourseService);
  private readonly progress = inject(ProgressService);
  private readonly tracker = inject(LessonTracker);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly context = inject(LessonContext);

  protected readonly course = signal<Course | undefined>(undefined);
  protected readonly lesson = computed<Lesson | undefined>(() => {
    const c = this.course();
    const slug = this.lessonSlug();
    return c && slug ? findLesson(c, slug) : undefined;
  });
  protected readonly missing = computed(() => !!this.course() && !!this.lessonSlug() && !this.lesson());
  protected readonly nav = computed(() => {
    const c = this.course(), l = this.lesson();
    return c && l ? neighbours(c, l.slug) : {};
  });
  protected readonly position = computed(() => {
    const c = this.course(), l = this.lesson();
    return c && l ? locate(c, l.slug) : { index: 0, total: 0 };
  });
  protected readonly toc = computed<TocEntry[]>(() =>
    (this.lesson()?.blocks ?? []).map(tocEntry).filter((e): e is TocEntry => e !== null));
  protected readonly anchors = computed(() => new Set(this.toc().map((e) => Number(e.id.slice(4)))));

  constructor() {
    effect(() => {
      const slug = this.courseSlug();
      const ready = this.courses.peek(slug);
      if (ready) { this.course.set(ready); return; }
      this.courses.load(slug).then((c) => this.course.set(c), () => this.course.set(undefined));
    }, { allowSignalWrites: true });

    // Back/Forward: the router restores the scroll position before every code editor has reached its
    // full height, so long lessons land short. Re-apply the same position once layout has settled.
    this.router.events
      .pipe(filter((e): e is Scroll => e instanceof Scroll && !!e.position), takeUntilDestroyed())
      .subscribe(({ position }) => {
        const [x, y] = position ?? [0, 0];
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(x, y)));
      });

    // /:course opens the first lesson.
    effect(() => {
      const c = this.course();
      if (c && !this.lessonSlug()) {
        const first = lessonsOf(c)[0];
        if (first) void this.router.navigate(['/', c.slug, first.slug], { replaceUrl: true });
      }
    });

    // Blocks read the current course and lesson from here (e.g. for Try-it links).
    effect(() => {
      this.context.course.set(this.course());
      this.context.lesson.set(this.lesson());
    }, { allowSignalWrites: true });

    effect(() => {
      const l = this.lesson();
      this.title.setTitle(l ? `${plain(l.title)} – Learn Language` : 'Learn Language');
    });

    // Finished = every quiz on the page answered right (or nothing to answer).
    effect(() => {
      const c = this.course(), l = this.lesson();
      if (!c || !l) return;
      const items = checkables(l.blocks);
      const correct = this.tracker.correct();
      if (items.every((b) => correct.has(b))) this.progress.markDone(c.slug, l.slug);
    }, { allowSignalWrites: true });
  }

  /** The lesson's meta line without the level, which the group label above already shows. */
  protected meta(l: Lesson): string {
    return (l.eyebrow ?? '').replace(/^Level \d+\s*·\s*/, '');
  }

  protected label(l: Lesson): string {
    return l.num ? `${l.num} ${l.nav ?? l.title}` : l.nav ?? l.title;
  }
}
