import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import { ToastProvider } from '../context/ToastContext';
import { LanguageProvider } from '../context/LanguageContext';
import { Board } from '../components/Board';
import { Keyboard } from '../components/Keyboard';

// ---------------------------------------------------------------------------
// localStorage mock
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Test app component — exposes game state as testid elements
// ---------------------------------------------------------------------------

function GameApp() {
  const { state } = useGame();
  return (
    <div>
      <div data-testid="status">{state.gameStatus}</div>
      <div data-testid="current-input">{state.currentInput}</div>
      <div data-testid="guess-count">{state.guesses.length}</div>
      <div data-testid="target-word">{state.targetWord}</div>
      <Board />
      <Keyboard />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wrapper with all required providers
// ---------------------------------------------------------------------------

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <LanguageProvider>
        <GameProvider>{children}</GameProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorageMock.clear();
  vi.useFakeTimers();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Full game integration', () => {
  it('starts in playing state', () => {
    render(<GameApp />, { wrapper });
    expect(screen.getByTestId('status')).toHaveTextContent('playing');
  });

  it('typing letters updates currentInput', () => {
    render(<GameApp />, { wrapper });
    fireEvent.click(screen.getByText('C'));
    fireEvent.click(screen.getByText('R'));
    expect(screen.getByTestId('current-input')).toHaveTextContent('cr');
  });

  it('backspace removes last letter', () => {
    render(<GameApp />, { wrapper });
    fireEvent.click(screen.getByText('C'));
    fireEvent.click(screen.getByText('R'));
    fireEvent.click(screen.getByLabelText('Delete'));
    expect(screen.getByTestId('current-input')).toHaveTextContent('c');
  });

  it('submitting a valid guess increments guess count', () => {
    render(<GameApp />, { wrapper });
    // Type CRANE — a known valid word that is unlikely to be the daily target
    ['C', 'R', 'A', 'N', 'E'].forEach(l => fireEvent.click(screen.getByText(l)));
    fireEvent.click(screen.getByText('ENTER'));
    expect(screen.getByTestId('guess-count')).toHaveTextContent('1');
  });

  it('submitting less than 5 letters does not advance', () => {
    render(<GameApp />, { wrapper });
    fireEvent.click(screen.getByText('C'));
    fireEvent.click(screen.getByText('ENTER'));
    expect(screen.getByTestId('guess-count')).toHaveTextContent('0');
    expect(screen.getByTestId('status')).toHaveTextContent('playing');
  });

  it('winning sets gameStatus to won', () => {
    render(<GameApp />, { wrapper });
    const target = screen.getByTestId('target-word').textContent ?? 'crane';

    act(() => {
      target
        .toUpperCase()
        .split('')
        .forEach(l => {
          fireEvent.click(screen.getByText(l));
        });
      fireEvent.click(screen.getByText('ENTER'));
    });

    expect(screen.getByTestId('status')).toHaveTextContent('won');
  });

  it('currentInput is empty after a successful submit', () => {
    render(<GameApp />, { wrapper });
    ['C', 'R', 'A', 'N', 'E'].forEach(l => fireEvent.click(screen.getByText(l)));
    fireEvent.click(screen.getByText('ENTER'));
    expect(screen.getByTestId('current-input')).toHaveTextContent('');
  });

  it('cannot type more than 5 letters', () => {
    render(<GameApp />, { wrapper });
    ['C', 'R', 'A', 'N', 'E', 'S'].forEach(l => fireEvent.click(screen.getByText(l)));
    // Input should still be capped at 5 characters
    const input = screen.getByTestId('current-input').textContent ?? '';
    expect(input.length).toBeLessThanOrEqual(5);
  });

  it('submitting an invalid word does not advance row', () => {
    render(<GameApp />, { wrapper });
    // ZZZZZ is not a real word — use keyboard buttons by role to avoid tile/key ambiguity
    const zKey = screen.getAllByRole('button', { name: /^z$/i })[0];
    for (let i = 0; i < 5; i++) fireEvent.click(zKey);
    fireEvent.click(screen.getByText('ENTER'));
    expect(screen.getByTestId('guess-count')).toHaveTextContent('0');
    expect(screen.getByTestId('status')).toHaveTextContent('playing');
  });

  it('guess count increments with each valid submit', () => {
    render(<GameApp />, { wrapper });
    const target = screen.getByTestId('target-word').textContent ?? '';

    // Submit CRANE first (valid, not the target unless today's word is CRANE)
    const firstGuess = target.toUpperCase() === 'CRANE' ? 'SLATE' : 'CRANE';

    firstGuess.split('').forEach(l => fireEvent.click(screen.getByText(l)));
    fireEvent.click(screen.getByText('ENTER'));
    expect(screen.getByTestId('guess-count')).toHaveTextContent('1');
  });

  it('board renders 6 rows regardless of guess count', () => {
    render(<GameApp />, { wrapper });
    const rows = screen.getAllByRole('group', { name: /Row \d/ });
    expect(rows).toHaveLength(6);
  });
});
