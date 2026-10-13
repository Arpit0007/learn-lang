import { TestBed } from '@angular/core/testing';
import { Block } from '../shared/content';
import { ExerciseComponent } from './exercise.component';
import { LessonTracker } from './lesson-tracker';

type ExerciseBlock = Extract<Block, { kind: 'exercise' }>;

const fill: ExerciseBlock = {
  kind: 'exercise',
  exercise: { type: 'fill_code', prompt: 'Make a link.', code: '<[___] href="page.html">Go</[___]>', answers: ['a', 'a'] },
};
const choice: ExerciseBlock = {
  kind: 'exercise',
  exercise: { type: 'multiple_choice', prompt: 'Which tag makes a link?', options: ['<link>', '<a>', '<href>'], answer: '<a>' },
};

function setup(block: ExerciseBlock) {
  TestBed.configureTestingModule({ providers: [LessonTracker] });
  const fixture = TestBed.createComponent(ExerciseComponent);
  fixture.componentRef.setInput('block', block);
  fixture.detectChanges();
  const el: HTMLElement = fixture.nativeElement;
  const inputs = () => Array.from(el.querySelectorAll<HTMLInputElement>('.snippet input'));
  const type = (i: number, v: string) => { inputs()[i].value = v; inputs()[i].dispatchEvent(new Event('input')); fixture.detectChanges(); };
  const button = (text: string) => Array.from(el.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.trim() === text);
  const click = (b?: HTMLElement) => { b?.click(); fixture.detectChanges(); };
  return { el, inputs, type, button, click, tracker: TestBed.inject(LessonTracker) };
}

describe('ExerciseComponent (fill in the code)', () => {
  it('renders one input per gap and keeps Check disabled until all are filled', () => {
    const t = setup(fill);
    expect(t.inputs()).toHaveLength(2);
    expect(t.el.querySelector('.snippet')?.textContent).toContain('href="page.html">Go</');
    t.type(0, 'a');
    expect(t.button('Check')?.disabled).toBe(true);
    t.type(1, 'a');
    expect(t.button('Check')?.disabled).toBe(false);
  });

  it('marks wrong gaps, then Show answer + Check counts as correct', () => {
    const t = setup(fill);
    t.type(0, 'A');
    t.type(1, 'a');
    t.click(t.button('Check'));
    expect(t.el.textContent).toContain('Not quite');
    expect(t.inputs()[0].classList).toContain('bad');
    expect(t.inputs()[1].classList).not.toContain('bad');
    expect(t.tracker.correct().has(fill)).toBe(false);

    t.click(t.button('Show answer'));
    expect(t.inputs().map((i) => i.value)).toEqual(['a', 'a']);
    t.click(t.button('Check'));
    expect(t.el.textContent).toContain('Correct');
    expect(t.inputs().every((i) => i.disabled)).toBe(true);
    expect(t.tracker.correct().has(fill)).toBe(true);
  });
});

describe('ExerciseComponent (multiple choice)', () => {
  it('checks the picked option', () => {
    const t = setup(choice);
    const option = (text: string) => Array.from(t.el.querySelectorAll<HTMLButtonElement>('.opts button')).find((b) => b.textContent?.trim() === text);
    expect(t.button('Check')?.disabled).toBe(true);
    t.click(option('<link>'));
    t.click(t.button('Check'));
    expect(t.el.textContent).toContain('Not quite');
    t.click(option('<a>'));
    t.click(t.button('Check'));
    expect(t.el.textContent).toContain('Correct');
    expect(t.tracker.correct().has(choice)).toBe(true);
  });
});
