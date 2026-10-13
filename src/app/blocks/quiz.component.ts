import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Block } from '../shared/content';
import { RichTextComponent } from './rich-text.component';
import { LessonTracker } from './lesson-tracker';

type Quiz = Extract<Block, { kind: 'quiz' }>;

/**
 * The Ladder's "Quick check". The first pick locks the quiz and reveals the
 * answer and explanation; it counts as correct only if that pick was right.
 */
@Component({
  selector: 'll-quiz',
  standalone: true,
  imports: [RichTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent {
  readonly quiz = input.required<Quiz>();
  private readonly tracker = inject(LessonTracker, { optional: true });
  protected readonly picked = signal<number | null>(null);

  pick(index: number): void {
    if (this.picked() !== null) return;
    this.picked.set(index);
    this.tracker?.report(this.quiz(), index === this.quiz().answer);
  }

  tryAgain(): void {
    this.picked.set(null);
  }
}
