import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Block, Course } from '../shared/content';
import { RichTextComponent } from './rich-text.component';
import { CodeBlockComponent } from './code-block.component';
import { QuizComponent } from './quiz.component';
import { FigureComponent } from './figure.component';
import { ExerciseComponent } from './exercise.component';

/** Renders one content block; callouts and reveals render their children recursively. */
@Component({
  selector: 'll-block',
  standalone: true,
  imports: [RichTextComponent, CodeBlockComponent, QuizComponent, FigureComponent, ExerciseComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './block.component.html',
  styleUrl: './block.component.css',
})
export class BlockComponent {
  readonly block = input.required<Block>();
  readonly course = input.required<Course>();

  protected isInterview(tag: string): boolean {
    return /^(Interview )?Q\d+$/.test(tag);
  }
}
