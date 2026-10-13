import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { parseRich, safeHref } from './rich-text';

/** Renders content text (**bold**, *italic*, `code`, [links](…)) without innerHTML. */
@Component({
  selector: 'll-rich',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich-text.component.html',
})
export class RichTextComponent {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => parseRich(this.text()));
  protected readonly href = safeHref;
}
