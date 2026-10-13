import { shuffledOptions } from './shuffle';

describe('shuffledOptions', () => {
  const options = ['right', 'wrong 1', 'wrong 2', 'wrong 3'];

  it('keeps every option exactly once', () => {
    expect([...shuffledOptions('seed', options)].sort()).toEqual([...options].sort());
  });

  it('gives the same order for the same seed (stable across visits)', () => {
    expect(shuffledOptions('Which tag makes a link?', options)).toEqual(shuffledOptions('Which tag makes a link?', options));
  });

  it('does not leave the first option on top most of the time', () => {
    const firstStaysFirst = Array.from({ length: 200 }, (_, i) => shuffledOptions(`question ${i}`, options)[0] === 'right')
      .filter(Boolean).length;
    expect(firstStaysFirst).toBeLessThan(90); // ~50 expected for 4 options
  });
});
