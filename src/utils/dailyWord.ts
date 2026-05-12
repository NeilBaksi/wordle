import type { Lang } from '../i18n/strings';
import { ANSWERS, ANSWERS_ES } from '../data/words';
import { pruneHistory, getHistory, setHistory } from './storage';

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateHash(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDailyWord(lang: Lang = 'en'): string {
  pruneHistory();
  const history = getHistory();
  const today = getTodayString();
  const answers = lang === 'es' ? ANSWERS_ES : ANSWERS;

  const todayEntry = history.find(h => h.date === today);
  if (todayEntry) return todayEntry.word;

  const recentWords = new Set(history.map(h => h.word));
  const pool = answers.filter(w => !recentWords.has(w));
  const idx = dateHash(today) % (pool.length || answers.length);
  return (pool.length > 0 ? pool : answers)[idx];
}

export function getNextWord(currentWord: string, lang: Lang = 'en'): string {
  const history = getHistory();
  const answers = lang === 'es' ? ANSWERS_ES : ANSWERS;
  const recentWords = new Set(history.map(h => h.word));
  const pool = answers.filter(w => !recentWords.has(w) && w !== currentWord);
  const arr = pool.length > 0 ? pool : answers.filter(w => w !== currentWord);
  return arr[Math.floor(Math.random() * arr.length)];
}

export function recordWordPlayed(word: string): void {
  const history = getHistory();
  const today = getTodayString();
  if (history.some(h => h.date === today)) return;
  history.push({ word, date: today });
  setHistory(history);
}
