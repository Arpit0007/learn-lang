import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../shared/content';
import { CourseService, lessonsOf } from '../../core/services/course.service';
import { ProgressService } from '../../core/services/progress.service';
import { NotFoundComponent } from '../not-found/not-found.component';

type State = { status: 'loading' } | { status: 'missing' } | { status: 'error' } | { status: 'ready'; course: Course };

/**
 * Course shell. The sidebar is drawn as a ladder: one rung per lesson on a
 * vertical rail that turns gold up to the furthest finished lesson.
 */
@Component({
  selector: 'll-course-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, NotFoundComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-layout.component.html',
  styleUrl: './course-layout.component.css',
})
export class CourseLayoutComponent {
  /** Route param. */
  readonly courseSlug = input.required<string>({ alias: 'course' });

  private readonly courses = inject(CourseService);
  protected readonly progress = inject(ProgressService);
  protected readonly state = signal<State>({ status: 'loading' });
  protected readonly drawerOpen = signal(false);

  private readonly order = computed(() => {
    const c = this.course();
    return c ? lessonsOf(c).map((l) => l.slug) : [];
  });
  protected readonly total = computed(() => this.order().length);
  protected readonly doneCount = computed(() => {
    const c = this.course();
    return c ? this.order().filter((s) => this.progress.isDone(c.slug, s)).length : 0;
  });
  /** Index of the furthest finished lesson (-1 if none): the rail is gold up to here. */
  protected readonly furthest = computed(() => {
    const c = this.course();
    if (!c) return -1;
    let max = -1;
    this.order().forEach((s, i) => { if (this.progress.isDone(c.slug, s)) max = i; });
    return max;
  });

  constructor() {
    effect(() => { void this.load(this.courseSlug()); }, { allowSignalWrites: true });
    // Close the drawer after any navigation (e.g. Previous/Next).
    inject(Router).events.subscribe((e) => { if (e instanceof NavigationEnd) this.drawerOpen.set(false); });
  }

  protected course(): Course | undefined {
    const s = this.state();
    return s.status === 'ready' ? s.course : undefined;
  }

  protected indexOf(slug: string): number {
    return this.order().indexOf(slug);
  }

  reload(): void {
    void this.load(this.courseSlug());
  }

  private async load(slug: string): Promise<void> {
    const ready = this.courses.peek(slug);
    if (ready) { this.state.set({ status: 'ready', course: ready }); return; }
    this.state.set({ status: 'loading' });
    try {
      const course = await this.courses.load(slug);
      this.state.set(course ? { status: 'ready', course } : { status: 'missing' });
    } catch {
      this.state.set({ status: 'error' });
    }
  }
}
