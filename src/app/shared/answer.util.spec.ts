import { Exercise } from './content';
import { checkAnswer, gapCount } from './answer.util';

describe('checkAnswer', () => {
  const choice: Exercise = {
    type: 'multiple_choice',
    prompt: 'Which keyword declares a constant?',
    options: ['let', 'const', 'var'],
    answer: 'const',
  };

  const fill: Exercise = {
    type: 'fill_code',
    prompt: 'Make a link.',
    code: '<[___] href="page.html">Go</[___]>',
    answers: ['a', 'a'],
  };

  it('accepts only the exact multiple-choice option', () => {
    expect(checkAnswer(choice, 'const')).toBe(true);
    expect(checkAnswer(choice, 'Const')).toBe(false);
    expect(checkAnswer(choice, 'let')).toBe(false);
  });

  it('ignores surrounding whitespace in gaps but not case', () => {
    expect(checkAnswer(fill, [' a ', 'a'])).toBe(true);
    expect(checkAnswer(fill, ['A', 'a'])).toBe(false);
  });

  it('accepts any listed alternative for a gap', () => {
    const quotes: Exercise = { type: 'fill_code', prompt: '', code: 'print([___]hi")', answers: [['"', "'"]] };
    expect(checkAnswer(quotes, ["'"])).toBe(true);
    expect(checkAnswer(quotes, ['`'])).toBe(false);
  });

  it('rejects the wrong number of gaps', () => {
    expect(checkAnswer(fill, ['a'])).toBe(false);
    expect(checkAnswer(fill, ['a', 'a', 'a'])).toBe(false);
  });

  it('counts gaps', () => {
    expect(gapCount(fill.code)).toBe(2);
    expect(gapCount('no gaps')).toBe(0);
  });
});
