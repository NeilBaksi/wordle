import { describe, it, expect, beforeEach } from 'vitest';
import { getHistory, setHistory, pruneHistory, getStats, updateStats } from '../utils/storage';

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

describe('getHistory / setHistory', () => {
  it('returns empty array when nothing stored', () => {
    expect(getHistory()).toEqual([]);
  });

  it('roundtrips history correctly', () => {
    const entries = [
      { word: 'crane', date: '2026-01-01' },
      { word: 'party', date: '2026-01-02' },
    ];
    setHistory(entries);
    expect(getHistory()).toEqual(entries);
  });
});

describe('pruneHistory', () => {
  it('removes entries older than 10 days', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 15);
    const oldEntry = { word: 'crane', date: oldDate.toISOString().slice(0, 10) };
    const recentEntry = { word: 'party', date: new Date().toISOString().slice(0, 10) };
    setHistory([oldEntry, recentEntry]);
    pruneHistory();
    const remaining = getHistory();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].word).toBe('party');
  });

  it('keeps entries within 10 days', () => {
    const recent = new Date();
    recent.setDate(recent.getDate() - 5);
    const entry = { word: 'crane', date: recent.toISOString().slice(0, 10) };
    setHistory([entry]);
    pruneHistory();
    expect(getHistory()).toHaveLength(1);
  });
});

describe('getStats / updateStats', () => {
  it('returns default stats when nothing stored', () => {
    const stats = getStats();
    expect(stats.played).toBe(0);
    expect(stats.won).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.maxStreak).toBe(0);
    expect(stats.guessDistribution).toHaveLength(6);
  });

  it('increments played and won on win', () => {
    const stats = updateStats(true, 3);
    expect(stats.played).toBe(1);
    expect(stats.won).toBe(1);
    expect(stats.currentStreak).toBe(1);
    expect(stats.guessDistribution[2]).toBe(1); // index 2 = 3 guesses
  });

  it('resets streak on loss', () => {
    updateStats(true, 3);
    const stats = updateStats(false, 6);
    expect(stats.played).toBe(2);
    expect(stats.won).toBe(1);
    expect(stats.currentStreak).toBe(0);
    expect(stats.maxStreak).toBe(1);
  });

  it('tracks max streak', () => {
    updateStats(true, 1);
    updateStats(true, 2);
    updateStats(true, 3);
    const stats = updateStats(false, 6);
    expect(stats.maxStreak).toBe(3);
    expect(stats.currentStreak).toBe(0);
  });
});
