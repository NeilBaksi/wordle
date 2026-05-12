import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

export function useKeyboard() {
  const { dispatch, state } = useGame();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (state.gameStatus !== 'playing') return;
      if (state.isRevealing) return;

      const key = e.key;

      if (key === 'Enter') {
        dispatch({ type: 'SUBMIT' });
      } else if (key === 'Backspace' || key === 'Delete') {
        dispatch({ type: 'DELETE' });
      } else if (/^[a-zA-ZñÑ]$/.test(key)) {
        dispatch({ type: 'TYPE', letter: key.toLowerCase() });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameStatus, state.isRevealing, dispatch]);
}
