import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { LetterState } from '../types';
import { evaluateGuess } from '../utils/evaluate';
import { getDailyWord, getNextWord, recordWordPlayed } from '../utils/dailyWord';
import { updateStats } from '../utils/storage';
import { VALID_GUESSES } from '../data/words';

// ---------------------------------------------------------------------------
// State & Action types
// ---------------------------------------------------------------------------

interface GameState {
  gameId: number;
  targetWord: string;
  guesses: string[];
  evaluations: LetterState[][];
  currentInput: string;
  currentRow: number;
  gameStatus: 'playing' | 'won' | 'lost';
  isRevealing: boolean;
  invalidRow: number | null;
  keyStates: Record<string, LetterState>;
  hardMode: boolean;
  pendingToast: string | null;
  hintLetter: string | null;
  hintUsed: boolean;
}

type Action =
  | { type: 'TYPE'; letter: string }
  | { type: 'DELETE' }
  | { type: 'SUBMIT' }
  | { type: 'SET_REVEALING'; value: boolean }
  | { type: 'CLEAR_INVALID' }
  | { type: 'NEW_GAME' }
  | { type: 'TOGGLE_HARD_MODE' }
  | { type: 'CLEAR_TOAST' }
  | { type: 'HINT' }
  | { type: 'SET_WORD'; word: string };

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LETTER_STATE_PRIORITY: Record<LetterState, number> = {
  correct: 3,
  present: 2,
  absent: 1,
  active: 0,
  empty: 0,
};

function mergeKeyState(
  current: LetterState | undefined,
  incoming: LetterState,
): LetterState {
  if (!current) return incoming;
  return LETTER_STATE_PRIORITY[incoming] > LETTER_STATE_PRIORITY[current]
    ? incoming
    : current;
}

function validateHardMode(
  currentInput: string,
  guesses: string[],
  evaluations: LetterState[][],
): string | null {
  for (let row = 0; row < guesses.length; row++) {
    const word = guesses[row];
    const eval_ = evaluations[row];

    // Correct positions must be reused first
    for (let col = 0; col < 5; col++) {
      if (eval_[col] === 'correct') {
        if (currentInput[col] !== word[col]) {
          const pos = ['1st', '2nd', '3rd', '4th', '5th'][col];
          return `${pos} letter must be ${word[col].toUpperCase()}`;
        }
      }
    }

    // Present letters must appear somewhere
    for (let col = 0; col < 5; col++) {
      if (eval_[col] === 'present') {
        if (!currentInput.includes(word[col])) {
          return `Guess must contain ${word[col].toUpperCase()}`;
        }
      }
    }
  }
  return null;
}

function buildInitialState(word?: string, gameId = 0): GameState {
  return {
    gameId,
    targetWord: word ?? getDailyWord(),
    guesses: [],
    evaluations: [],
    currentInput: '',
    currentRow: 0,
    gameStatus: 'playing',
    isRevealing: false,
    invalidRow: null,
    keyStates: {},
    hardMode: false,
    pendingToast: null,
    hintLetter: null,
    hintUsed: false,
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'TYPE': {
      if (state.gameStatus !== 'playing') return state;
      if (state.isRevealing) return state;
      if (state.currentInput.length >= 5) return state;
      return { ...state, currentInput: state.currentInput + action.letter };
    }

    case 'DELETE': {
      if (state.currentInput.length === 0) return state;
      return {
        ...state,
        currentInput: state.currentInput.slice(0, -1),
      };
    }

    case 'SUBMIT': {
      if (state.gameStatus !== 'playing') return state;
      if (state.isRevealing) return state;

      const input = state.currentInput;

      // Must be exactly 5 letters
      if (input.length !== 5) {
        return {
          ...state,
          invalidRow: state.currentRow,
          pendingToast: 'Not enough letters',
        };
      }

      // Must be a valid word
      if (!VALID_GUESSES.has(input)) {
        return {
          ...state,
          invalidRow: state.currentRow,
          pendingToast: 'Not in word list',
        };
      }

      // Hard mode validation
      if (state.hardMode) {
        const hardModeError = validateHardMode(
          input,
          state.guesses,
          state.evaluations,
        );
        if (hardModeError) {
          return {
            ...state,
            invalidRow: state.currentRow,
            pendingToast: hardModeError,
          };
        }
      }

      // Evaluate
      const evaluation = evaluateGuess(input, state.targetWord);

      // Update key states — correct > present > absent, never downgrade
      const newKeyStates = { ...state.keyStates };
      for (let i = 0; i < input.length; i++) {
        const letter = input[i];
        const incoming = evaluation[i];
        newKeyStates[letter] = mergeKeyState(newKeyStates[letter], incoming);
      }

      const newGuesses = [...state.guesses, input];
      const newEvaluations = [...state.evaluations, evaluation];
      const newRow = state.currentRow + 1;

      // Check win/loss
      const won = evaluation.every(s => s === 'correct');
      const lost = !won && newRow >= 6;
      const gameStatus: GameState['gameStatus'] = won
        ? 'won'
        : lost
          ? 'lost'
          : 'playing';

      let pendingToast: string | null = null;
      if (won) {
        const winMessages = [
          'Genius!',
          'Magnificent!',
          'Impressive!',
          'Splendid!',
          'Great!',
          'Phew!',
        ];
        pendingToast = winMessages[state.currentRow] ?? 'Nice!';
      } else if (lost) {
        pendingToast = state.targetWord.toUpperCase();
      }

      return {
        ...state,
        guesses: newGuesses,
        evaluations: newEvaluations,
        currentInput: '',
        currentRow: newRow,
        gameStatus,
        isRevealing: true,
        invalidRow: null,
        keyStates: newKeyStates,
        pendingToast,
      };
    }

    case 'SET_REVEALING': {
      return { ...state, isRevealing: action.value };
    }

    case 'CLEAR_INVALID': {
      return { ...state, invalidRow: null };
    }

    case 'CLEAR_TOAST': {
      return { ...state, pendingToast: null };
    }

    case 'NEW_GAME': {
      return buildInitialState(getNextWord(state.targetWord), state.gameId + 1);
    }

    case 'SET_WORD': {
      // Only override on initial load (gameId === 0) before any guesses
      if (state.gameId !== 0 || state.currentRow !== 0 || action.word === state.targetWord) return state;
      return buildInitialState(action.word, state.gameId);
    }

    case 'TOGGLE_HARD_MODE': {
      // Only toggle if no guesses have been submitted yet
      if (state.currentRow !== 0) return state;
      return { ...state, hardMode: !state.hardMode };
    }

    case 'HINT': {
      if (state.hintUsed || state.gameStatus !== 'playing') return state;
      const unguessed = state.targetWord
        .split('')
        .filter(l => !state.keyStates[l]);
      const pool = unguessed.length > 0
        ? unguessed
        : state.targetWord.split('').filter(l => state.keyStates[l] !== 'correct');
      if (pool.length === 0) return state;
      const letter = pool[Math.floor(Math.random() * pool.length)];
      return { ...state, hintLetter: letter, hintUsed: true };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
  showToast?: (message: string, duration?: number) => void;
}

export function GameProvider({ children, showToast }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, buildInitialState);

  // Auto-clear isRevealing after flip animation completes
  // 5 tiles × 300ms stagger + 500ms flip duration = 2000ms total
  useEffect(() => {
    if (!state.isRevealing) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_REVEALING', value: false });
    }, 2000);
    return () => clearTimeout(timer);
  }, [state.isRevealing]);

  // Auto-clear invalidRow after shake animation (700ms)
  useEffect(() => {
    if (state.invalidRow === null) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'CLEAR_INVALID' });
    }, 700);
    return () => clearTimeout(timer);
  }, [state.invalidRow]);

  // Fire toast when pendingToast is set
  useEffect(() => {
    if (!state.pendingToast) return;
    if (showToast) {
      // Win/loss toasts linger longer
      const isEndGame =
        state.gameStatus === 'won' || state.gameStatus === 'lost';
      showToast(state.pendingToast, isEndGame ? 3000 : 1500);
    }
    dispatch({ type: 'CLEAR_TOAST' });
  }, [state.pendingToast, state.gameStatus, showToast]);

  // Side effects on game end — record word played and update stats
  useEffect(() => {
    if (state.gameStatus === 'playing') return;
    recordWordPlayed(state.targetWord);
    const won = state.gameStatus === 'won';
    const guessCount = state.guesses.length;
    updateStats(won, guessCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
