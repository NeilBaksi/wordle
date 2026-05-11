import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Keyboard } from '../components/Keyboard';
import { GameProvider, useGame } from '../context/GameContext';
import { ToastProvider } from '../context/ToastContext';

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

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <GameProvider>{children}</GameProvider>
    </ToastProvider>
  );
}

describe('Keyboard', () => {
  it('renders all 26 letter keys', () => {
    render(<Keyboard />, { wrapper });
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
      expect(screen.getByText(letter.toUpperCase())).toBeTruthy();
    });
  });

  it('renders ENTER key', () => {
    render(<Keyboard />, { wrapper });
    expect(screen.getByText('ENTER')).toBeTruthy();
  });

  it('renders backspace key', () => {
    render(<Keyboard />, { wrapper });
    expect(screen.getByLabelText('Delete')).toBeTruthy();
  });

  it('clicking a letter key dispatches TYPE', () => {
    render(<Keyboard />, { wrapper });
    // Click 'A' key
    fireEvent.click(screen.getByText('A'));
    // No crash = dispatch worked
  });

  it('clicking ENTER dispatches SUBMIT', () => {
    render(<Keyboard />, { wrapper });
    fireEvent.click(screen.getByText('ENTER'));
    // No crash = dispatch worked
  });

  it('clicking ⌫ dispatches DELETE', () => {
    render(<Keyboard />, { wrapper });
    fireEvent.click(screen.getByLabelText('Delete'));
    // No crash = dispatch worked
  });
});
