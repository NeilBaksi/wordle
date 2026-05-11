import type { LetterState } from '../types';

export function evaluateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent');
  const targetLetters = target.toLowerCase().split('');
  const guessLetters = guess.toLowerCase().split('');

  // Pass 1: exact matches (correct)
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = '#'; // consume from target
      guessLetters[i] = '*'; // consume from guess
    }
  }

  // Pass 2: present (exists in target but wrong position)
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === '*') continue;
    const ti = targetLetters.indexOf(guessLetters[i]);
    if (ti !== -1) {
      result[i] = 'present';
      targetLetters[ti] = '#'; // consume
    }
  }

  return result;
}
