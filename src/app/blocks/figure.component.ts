import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Block } from '../shared/content';
import { RichTextComponent } from './rich-text.component';

type Figure = Extract<Block, { kind: 'figure' }>;

const prefersReducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

/** A Ladder diagram. Animated ones play unless the reader prefers reduced motion. */
@Component({
  selector: 'll-figure',
  standalone: true,
  imports: [RichTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './figure.component.html',
})
export class FigureComponent {
  readonly figure = input.required<Figure>();
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly playing = signal(!prefersReducedMotion());
  // First-party SVG from the course content; content.spec.ts rejects scripts and event handlers.
  protected readonly svg = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.figure().svg));
}
