import { Injectable, signal } from '@angular/core';

/**
 * Collects quiz results on the current lesson page. Provided by the lesson
 * page, so every page gets a fresh tracker.
 */
@Injectable()
export class LessonTracker {
  readonly correct = signal<ReadonlySet<object>>(new Set());

  report(item: object, isCorrect: boolean): void {
    this.correct.update((set) => {
      const next = new Set(set);
      if (isCorrect) next.add(item);
      else next.delete(item);
      return next;
    });
  }
}
