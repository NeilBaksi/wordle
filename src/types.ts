export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'active';

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: [number, number, number, number, number, number];
}

export interface HistoryEntry {
  word: string;
  date: string; // ISO date string YYYY-MM-DD
}
