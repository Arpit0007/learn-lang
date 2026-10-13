import {
  ChangeDetectionStrategy, Component, OnDestroy, afterNextRender, effect, input, signal,
} from '@angular/core';

export interface TocEntry {
  id: string;
  label: string;
  /** Tag shown before the label, e.g. 'Exercise 6.1' or 'Quick check'. */
  tag?: string;
}

const reducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

/** "On this page": the lesson's sections, with the one being read highlighted. */
@Component({
  selector: 'll-lesson-toc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lesson-toc.component.html',
  styleUrl: './lesson-toc.component.css',
})
export class LessonTocComponent implements OnDestroy {
  readonly entries = input.required<TocEntry[]>();
  protected readonly active = signal<string | null>(null);
  private observer?: IntersectionObserver;
  private ready = false;

  constructor() {
    afterNextRender(() => { this.ready = true; this.observe(this.entries()); });
    effect(() => {
      const list = this.entries();
      if (this.ready) queueMicrotask(() => this.observe(list));
    });
  }

  go(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    this.active.set(id);
  }

  private observe(list: TocEntry[]): void {
    this.observer?.disconnect();
    this.active.set(list[0]?.id ?? null);
    if (!('IntersectionObserver' in window) || !list.length) return;
    const visible = new Set<string>();
    const order = list.map((e) => e.id);
    const observer = new IntersectionObserver((records) => {
      records.forEach((r) => (r.isIntersecting ? visible.add(r.target.id) : visible.delete(r.target.id)));
      const first = order.find((id) => visible.has(id));
      if (first) this.active.set(first);
    }, { rootMargin: '-8% 0px -70% 0px', threshold: 0 });
    order.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    this.observer = observer;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
