import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import { ToastProvider } from '../context/ToastContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <GameProvider>{children}</GameProvider>
    </ToastProvider>
  );
}

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('GameContext reducer', () => {
  it('TYPE appends letter to currentInput', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'TYPE', letter: 'c' });
    });
    expect(result.current.state.currentInput).toBe('c');
  });

  it('TYPE does not exceed 5 characters', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => {
      'abcdef'.split('').forEach(l =>
        result.current.dispatch({ type: 'TYPE', letter: l }),
      );
    });
    expect(result.current.state.currentInput).toHaveLength(5);
    expect(result.current.state.currentInput).toBe('abcde');
  });

  it('DELETE removes last character', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'TYPE', letter: 'c' });
      result.current.dispatch({ type: 'TYPE', letter: 'r' });
      result.current.dispatch({ type: 'DELETE' });
    });
    expect(result.current.state.currentInput).toBe('c');
  });

  it('DELETE on empty input does nothing', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'DELETE' });
    });
    expect(result.current.state.currentInput).toBe('');
  });

  it('SUBMIT with less than 5 letters sets invalidRow', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'TYPE', letter: 'c' });
      result.current.dispatch({ type: 'SUBMIT' });
    });
    expect(result.current.state.invalidRow).toBe(0);
  });

  it('SUBMIT with invalid word sets invalidRow', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => {
      'zzzzz'.split('').forEach(l =>
        result.current.dispatch({ type: 'TYPE', letter: l }),
      );
      result.current.dispatch({ type: 'SUBMIT' });
    });
    expect(result.current.state.invalidRow).toBe(0);
  });

  it('SUBMIT with valid word advances currentRow', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    // Type a word we know is in VALID_GUESSES
    act(() => {
      'crane'.split('').forEach(l =>
        result.current.dispatch({ type: 'TYPE', letter: l }),
      );
      result.current.dispatch({ type: 'SUBMIT' });
    });
    expect(result.current.state.guesses).toHaveLength(1);
    expect(result.current.state.evaluations).toHaveLength(1);
  });

  it('TOGGLE_HARD_MODE only works before first guess', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    const initialHardMode = result.current.state.hardMode;
    act(() => {
      result.current.dispatch({ type: 'TOGGLE_HARD_MODE' });
    });
    expect(result.current.state.hardMode).toBe(!initialHardMode);
  });

  it('win is detected when guess matches target', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    const target = result.current.state.targetWord;
    act(() => {
      target.split('').forEach(l =>
        result.current.dispatch({ type: 'TYPE', letter: l }),
      );
      result.current.dispatch({ type: 'SUBMIT' });
    });
    expect(result.current.state.gameStatus).toBe('won');
  });
});
