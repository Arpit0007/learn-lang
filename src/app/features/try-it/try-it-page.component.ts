import { ChangeDetectionStrategy, Component, HostListener, computed, effect, inject, input, signal } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Course } from '../../shared/content';
import { CourseService, findLesson, tryItExamples } from '../../core/services/course.service';
import { CodeEditorComponent } from '../../blocks/code-editor.component';
import { NotFoundComponent } from '../not-found/not-found.component';

const plain = (s: string) => s.replace(/\\(.)/g, '$1').replace(/[*`]/g, '');

/**
 * A srcdoc page takes its base address from the app (<base href="/">), so a jump link like
 * href="#rules" would load the LinguaLeap site inside the preview. Lessons' absolute paths
 * (/assets/img/…) need that base, so instead the preview handles #links itself.
 */
const IN_PAGE_LINKS = `<script>
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
  if (!a) return;
  e.preventDefault();
  var id = decodeURIComponent(a.getAttribute('href').slice(1));
  var target = id ? (document.getElementById(id) || document.getElementsByName(id)[0]) : null;
  if (target) target.scrollIntoView();
  else if (!id || id === 'top') window.scrollTo(0, 0);
});
</script>`;

/** Full-screen "Try it Yourself" editor: code on the left, live result on the right. */
@Component({
  selector: 'll-try-it-page',
  standalone: true,
  imports: [CodeEditorComponent, NotFoundComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './try-it-page.component.html',
  styleUrl: './try-it-page.component.css',
})
export class TryItPageComponent {
  /** Route params. */
  readonly courseSlug = input.required<string>({ alias: 'course' });
  readonly lessonSlug = input.required<string>({ alias: 'lesson' });
  readonly n = input.required<string>();

  private readonly courses = inject(CourseService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly title = inject(Title);

  protected readonly course = signal<Course | undefined>(undefined);
  private readonly loaded = signal(false);
  private readonly lesson = computed(() => {
    const c = this.course();
    return c ? findLesson(c, this.lessonSlug()) : undefined;
  });
  protected readonly example = computed(() => {
    const c = this.course(), l = this.lesson();
    const i = Number(this.n()) - 1;
    return c && l && Number.isInteger(i) ? tryItExamples(c, l)[i] : undefined;
  });
  protected readonly missing = computed(() => this.loaded() && !this.example());
  protected readonly lessonTitle = computed(() => plain(this.lesson()?.title ?? ''));
  protected readonly lessonUrl = computed(() => `/${this.courseSlug()}/${this.lessonSlug()}`);

  /** Preview widths, so layout examples (media queries) can be seen at phone and tablet sizes. */
  protected readonly sizes = [
    { label: 'Phone', px: 375 },
    { label: 'Tablet', px: 600 },
    { label: 'Full', px: null },
  ];
  protected readonly width = signal<number | null>(null);

  protected readonly code = signal('');
  private readonly ran = signal({ code: '', count: 0 });
  /** A changing comment forces a reload even when the code is unchanged. */
  protected readonly srcdoc = computed(() => {
    const { code, count } = this.ran();
    return this.sanitizer.bypassSecurityTrustHtml(`${code}\n${IN_PAGE_LINKS}\n<!-- run ${count} -->`);
  });

  constructor() {
    effect(() => {
      const slug = this.courseSlug();
      this.courses.load(slug).then(
        (c) => { this.course.set(c); this.loaded.set(true); },
        () => { this.course.set(undefined); this.loaded.set(true); },
      );
    }, { allowSignalWrites: true });

    // Load the example and run it once.
    effect(() => {
      const ex = this.example();
      if (!ex) return;
      this.code.set(ex.code);
      this.ran.set({ code: ex.code, count: 1 });
    }, { allowSignalWrites: true });

    effect(() => {
      const t = this.lessonTitle();
      this.title.setTitle(t ? `Try it: ${t} – LinguaLeap` : 'LinguaLeap');
    });
  }

  run(): void {
    this.ran.update((r) => ({ code: this.code(), count: r.count + 1 }));
  }

  reset(): void {
    const ex = this.example();
    if (!ex) return;
    this.code.set(ex.code);
    this.run();
  }

  /**
   * Back to the lesson. Coming from it, use browser history so the router restores the reader's scroll
   * position; otherwise navigate. (Not a routerLink: that would also navigate forward first.)
   */
  back(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return; // new tab/window: let the href work
    event.preventDefault();
    if ((history.state?.navigationId ?? 1) > 1) this.location.back();
    else void this.router.navigateByUrl(this.lessonUrl());
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && this.example()) {
      e.preventDefault();
      this.run();
    }
  }
}
