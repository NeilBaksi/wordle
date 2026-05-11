import type { GameStats, HistoryEntry } from '../types';

const HISTORY_KEY = 'wordle-clone-history';
const STATS_KEY = 'wordle-clone-stats';

function daysDiff(dateStr: string, today: string): number {
  const a = new Date(dateStr);
  const b = new Date(today);
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function setHistory(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // storage full or unavailable
  }
}

export function pruneHistory(): void {
  const today = new Date().toISOString().slice(0, 10);
  const history = getHistory();
  const pruned = history.filter(h => daysDiff(h.date, today) <= 10);
  if (pruned.length !== history.length) {
    setHistory(pruned);
  }
}

const DEFAULT_STATS: GameStats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

export function getStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? (JSON.parse(raw) as GameStats) : { ...DEFAULT_STATS };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function updateStats(won: boolean, guessCount: number): GameStats {
  const stats = getStats();
  stats.played += 1;
  if (won) {
    stats.won += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    if (guessCount >= 1 && guessCount <= 6) {
      stats.guessDistribution[guessCount - 1] += 1;
    }
  } else {
    stats.currentStreak = 0;
  }
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // storage unavailable
  }
  return stats;
}
