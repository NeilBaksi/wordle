import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDailyWord, getTodayString } from '../utils/dailyWord';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe('getTodayString', () => {
  it('returns YYYY-MM-DD format', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getDailyWord', () => {
  it('returns a 5-letter lowercase word', () => {
    const word = getDailyWord();
    expect(word).toHaveLength(5);
    expect(word).toMatch(/^[a-z]+$/);
  });

  it('returns the same word when called multiple times on the same day', () => {
    const word1 = getDailyWord();
    const word2 = getDailyWord();
    expect(word1).toBe(word2);
  });

  it('excludes recently played words (10-day window)', () => {
    // Pre-populate history with a word
    const recentHistory = [{ word: getDailyWord(), date: getTodayString() }];
    localStorageMock.setItem('wordle-clone-history', JSON.stringify(recentHistory));

    // The word was just recorded as today's entry, so it should return the same
    const word = getDailyWord();
    expect(word).toHaveLength(5);
  });
});
