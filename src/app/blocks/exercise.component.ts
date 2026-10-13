import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Block, GAP } from '../shared/content';
import { acceptedValues, checkAnswer } from '../shared/answer.util';
import { RichTextComponent } from './rich-text.component';
import { LessonTracker } from './lesson-tracker';
import { shuffledOptions } from './shuffle';

type ExerciseBlock = Extract<Block, { kind: 'exercise' }>;
type Verdict = 'correct' | 'wrong' | null;


/** An auto-checked exercise: fill in the gaps in a code snippet, or pick one option. */
@Component({
  selector: 'll-exercise',
  standalone: true,
  imports: [RichTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css',
})
export class ExerciseComponent {
  readonly block = input.required<ExerciseBlock>();
  private readonly tracker = inject(LessonTracker, { optional: true });

  /** Multiple-choice options in display order. */
  protected readonly options = computed(() => {
    const ex = this.block().exercise;
    return ex.type === 'multiple_choice' ? shuffledOptions(ex.prompt + '\u0000' + ex.options.join('\u0000'), ex.options) : [];
  });

  /** Code split around the gaps (fill_code only). */
  protected readonly parts = computed(() => {
    const ex = this.block().exercise;
    return ex.type === 'fill_code' ? ex.code.split(GAP) : [];
  });
  private readonly accepted = computed(() => {
    const ex = this.block().exercise;
    return ex.type === 'fill_code' ? acceptedValues(ex.answers) : [];
  });
  /** Each input is as wide as its answer, plus a little room. */
  protected readonly widths = computed(() => this.accepted().map((a) => Math.max(3, a[0].length + 2)));
  protected readonly gaps = signal<string[]>([]);
  protected readonly choice = signal<string | null>(null);
  protected readonly verdict = signal<Verdict>(null);

  protected readonly ready = computed(() => {
    const ex = this.block().exercise;
    if (ex.type === 'multiple_choice') return this.choice() !== null;
    const g = this.gaps();
    return this.accepted().every((_, i) => (g[i] ?? '').trim() !== '');
  });

  setGap(i: number, value: string): void {
    this.gaps.update((g) => { const next = [...g]; next[i] = value; return next; });
    if (this.verdict() === 'wrong') this.verdict.set(null);
  }

  pick(option: string): void {
    this.choice.set(option);
    if (this.verdict() === 'wrong') this.verdict.set(null);
  }

  check(): void {
    if (!this.ready() || this.verdict() === 'correct') return;
    const ex = this.block().exercise;
    const response = ex.type === 'multiple_choice' ? this.choice() ?? '' : this.accepted().map((_, i) => this.gaps()[i] ?? '');
    const ok = checkAnswer(ex, response);
    this.verdict.set(ok ? 'correct' : 'wrong');
    this.tracker?.report(this.block(), ok);
  }

  /** Fills in the canonical answer; the learner still presses Check. */
  showAnswer(): void {
    const ex = this.block().exercise;
    if (ex.type === 'multiple_choice') this.choice.set(ex.answer);
    else this.gaps.set(this.accepted().map((a) => a[0]));
    this.verdict.set(null);
  }

  protected gapOk(i: number): boolean {
    return this.accepted()[i]?.includes((this.gaps()[i] ?? '').trim()) ?? false;
  }
}
