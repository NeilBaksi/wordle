import { ANSWERS } from '../data/answers';
import { pruneHistory, getHistory, setHistory } from './storage';

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function dateHash(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function getDailyWord(): string {
  pruneHistory(); // Remove entries older than 10 days
  const history = getHistory();
  const today = getTodayString();

  // Check if already played today — return same word
  const todayEntry = history.find(h => h.date === today);
  if (todayEntry) return todayEntry.word;

  // Filter out recently played words (10-day window)
  const recentWords = new Set(history.map(h => h.word));
  const pool = ANSWERS.filter(w => !recentWords.has(w));

  // Deterministic selection based on date
  const idx = dateHash(today) % (pool.length || ANSWERS.length);
  return (pool.length > 0 ? pool : ANSWERS)[idx];
}

export function getNextWord(currentWord: string): string {
  const history = getHistory();
  const recentWords = new Set(history.map(h => h.word));
  const pool = ANSWERS.filter(w => !recentWords.has(w) && w !== currentWord);
  const arr = pool.length > 0 ? pool : ANSWERS.filter(w => w !== currentWord);
  return arr[Math.floor(Math.random() * arr.length)];
}

export function recordWordPlayed(word: string): void {
  const history = getHistory();
  const today = getTodayString();
  // Don't duplicate
  if (history.some(h => h.date === today)) return;
  history.push({ word, date: today });
  setHistory(history);
}
