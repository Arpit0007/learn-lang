import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Block, Course, Lesson } from '../../shared/content';
import { CourseService, lessonsOf } from '../../core/services/course.service';
import { ProgressService } from '../../core/services/progress.service';
import { CodeBlockComponent } from '../../blocks/code-block.component';

type Example = Extract<Block, { kind: 'example' }>;

const TRY_ME: Example = {
  kind: 'example',
  label: 'try-me.js',
  code: `const name = "you";
const steps = ["read", "run", "change", "repeat"];

console.log(\`Hello, \${name}!\`);
console.log(steps.join(" → "));`,
};

/** Only the fields the code block reads. */
const HERO_COURSE = { exampleLang: 'javascript', exampleRun: 'inline' } as Course;

interface Resume { done: number; total: number; next?: Lesson }

/** Landing page: a runnable example up front, then one card per course. */
@Component({
  selector: 'll-home',
  standalone: true,
  imports: [RouterLink, CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected readonly courses = inject(CourseService);
  private readonly progress = inject(ProgressService);
  protected readonly tryMe = TRY_ME;
  protected readonly heroCourse = HERO_COURSE;
  /** Progress per started course; course content is only fetched once the reader has started it. */
  protected readonly resume = signal<Record<string, Resume>>({});

  /** Continue the first started, unfinished course; otherwise start the first course. */
  protected readonly cta = computed(() => {
    for (const c of this.courses.entries) {
      const next = this.resume()[c.slug]?.next;
      if (next) return { label: `Continue ${c.menuLabel}`, link: ['/', c.slug, next.slug] };
    }
    const first = this.courses.entries[0];
    return first ? { label: `Start with ${first.menuLabel}`, link: ['/', first.slug] } : null;
  });

  constructor() {
    inject(Title).setTitle('Learn Language — free coding tutorials');
    for (const entry of this.courses.entries) {
      if (this.progress.doneCount(entry.slug) === 0) continue;
      this.courses.load(entry.slug).then(
        (c) => c && this.resume.update((r) => ({ ...r, [c.slug]: this.resumeFor(c) })),
        () => undefined,
      );
    }
  }

  private resumeFor(course: Course): Resume {
    const all = lessonsOf(course);
    const done = all.filter((l) => this.progress.isDone(course.slug, l.slug)).length;
    return { done, total: all.length, next: all.find((l) => !this.progress.isDone(course.slug, l.slug)) };
  }
}
