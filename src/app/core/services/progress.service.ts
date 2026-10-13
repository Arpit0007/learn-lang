import { Injectable, signal } from '@angular/core';

type Progress = Record<string, string[]>;

/** Finished lessons, per course, kept in this browser only. */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly KEY = 'll_progress_v1';
  private readonly state = signal<Progress>(this.read());

  isDone(course: string, lesson: string): boolean {
    return this.state()[course]?.includes(lesson) ?? false;
  }

  doneCount(course: string): number {
    return this.state()[course]?.length ?? 0;
  }

  markDone(course: string, lesson: string): void {
    if (this.isDone(course, lesson)) return;
    const next = { ...this.state(), [course]: [...(this.state()[course] ?? []), lesson] };
    this.state.set(next);
    try { localStorage.setItem(this.KEY, JSON.stringify(next)); } catch { /* storage blocked: progress lasts for this visit */ }
  }

  private read(): Progress {
    try {
      const parsed = JSON.parse(localStorage.getItem(this.KEY) ?? '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }
}
