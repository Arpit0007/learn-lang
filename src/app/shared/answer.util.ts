import { Exercise, GAP } from './content';

/** Number of `[___]` gaps in a fill-in-the-code snippet. */
export function gapCount(code: string): number {
  return code.split(GAP).length - 1;
}

/** Accepted values for each gap; the first value of each is the canonical answer. */
export function acceptedValues(answers: (string | string[])[]): string[][] {
  return answers.map((a) => (Array.isArray(a) ? a : [a]));
}

/**
 * Checks a learner's response. Code is case-sensitive, so only surrounding
 * whitespace is ignored.
 */
export function checkAnswer(exercise: Exercise, response: string | string[]): boolean {
  switch (exercise.type) {
    case 'multiple_choice':
      return response === exercise.answer;
    case 'fill_code': {
      const given = Array.isArray(response) ? response : [response];
      const accepted = acceptedValues(exercise.answers);
      return (
        given.length === accepted.length &&
        given.every((value, i) => accepted[i].includes(value.trim()))
      );
    }
  }
}
