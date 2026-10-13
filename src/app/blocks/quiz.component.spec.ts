import { TestBed } from '@angular/core/testing';
import { Block } from '../shared/content';
import { QuizComponent } from './quiz.component';
import { LessonTracker } from './lesson-tracker';

type Quiz = Extract<Block, { kind: 'quiz' }>;
const quiz: Quiz = { kind: 'quiz', question: 'What does `typeof null` return?', options: ['"null"', '"object"'], answer: 1, why: 'A historic bug.' };

describe('QuizComponent', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [LessonTracker] });
    const fixture = TestBed.createComponent(QuizComponent);
    fixture.componentRef.setInput('quiz', quiz);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const options = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.opts button'));
    const click = (b: HTMLButtonElement) => { b.click(); fixture.detectChanges(); };
    return { el, options, click, tracker: TestBed.inject(LessonTracker) };
  }

  it('a wrong first pick shows the right answer and explanation, and does not count', () => {
    const { el, options, click, tracker } = setup();
    click(options()[0]);
    expect(options()[0].classList).toContain('wrong');
    expect(options()[1].classList).toContain('right');
    expect(options().every((b) => b.disabled)).toBe(true);
    expect(el.querySelector('.why')?.textContent).toContain('A historic bug.');
    expect(tracker.correct().has(quiz)).toBe(false);
  });

  it('Try again resets it, and a right first pick counts', () => {
    const { el, options, click, tracker } = setup();
    click(options()[0]);
    click(el.querySelector<HTMLButtonElement>('.again')!);
    expect(options().some((b) => b.disabled)).toBe(false);
    expect(el.querySelector('.why')).toBeNull();
    click(options()[1]);
    expect(el.querySelector('.verdict')?.textContent).toContain('Correct');
    expect(tracker.correct().has(quiz)).toBe(true);
  });
});
