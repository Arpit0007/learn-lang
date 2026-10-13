import { Injectable, computed, signal } from '@angular/core';
import { Block, Course, Lesson } from '../shared/content';
import { tryItExamples } from '../core/services/course.service';

/** The lesson being shown; lets blocks build links such as /html/links/try/2. Provided by the lesson page. */
@Injectable()
export class LessonContext {
  readonly course = signal<Course | undefined>(undefined);
  readonly lesson = signal<Lesson | undefined>(undefined);

  private readonly tryIt = computed(() => {
    const c = this.course(), l = this.lesson();
    return c && l ? tryItExamples(c, l) : [];
  });

  /** Router link to an example's Try-it page, or null if it has none. */
  tryItLink(block: Block): string[] | null {
    const c = this.course(), l = this.lesson();
    const n = this.tryIt().indexOf(block as never) + 1;
    return c && l && n > 0 ? ['/', c.slug, l.slug, 'try', String(n)] : null;
  }
}
