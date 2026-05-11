import { useGame } from '../context/GameContext';
import { Tile } from './Tile';
import type { LetterState } from '../types';

export function Board() {
  const { state } = useGame();
  const { guesses, evaluations, currentInput, currentRow, gameStatus, invalidRow, isRevealing } = state;

  const winRow = gameStatus === 'won' ? guesses.length - 1 : -1;

  const rows = Array.from({ length: 6 }, (_, rowIdx) => {
    const isSubmitted = rowIdx < guesses.length;
    const isActiveRow = rowIdx === currentRow && !isSubmitted;

    let letters: string[];
    let letterStates: LetterState[];
    let isRevealed: boolean;

    if (isSubmitted) {
      letters = guesses[rowIdx].split('');
      letterStates = evaluations[rowIdx];
      isRevealed = true;
    } else if (isActiveRow) {
      letters = currentInput.split('').concat(Array(5).fill('')).slice(0, 5);
      letterStates = Array(5).fill('empty') as LetterState[];
      isRevealed = false;
    } else {
      letters = Array(5).fill('');
      letterStates = Array(5).fill('empty') as LetterState[];
      isRevealed = false;
    }

    const shouldShake = invalidRow === rowIdx;
    const shouldBounce = rowIdx === winRow && !isRevealing;

    return (
      <div
        key={rowIdx}
        className={shouldShake ? 'row-shake' : ''}
        style={{
          display: 'flex',
          gap: '8px',
        }}
        role="group"
        aria-label={`Row ${rowIdx + 1}`}
      >
        {Array.from({ length: 5 }, (_, colIdx) => {
          const letter = letters[colIdx] ?? '';
          const evalState = letterStates[colIdx] ?? 'empty';
          const frontState: LetterState = isActiveRow && letter ? 'active' : 'empty';

          return (
            <Tile
              key={colIdx}
              letter={letter}
              state={evalState}
              frontState={frontState}
              isRevealed={isRevealed}
              col={colIdx}
              bounce={shouldBounce}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div
      role="grid"
      aria-label="Wordle board"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '0 24px',
        alignItems: 'center',
      }}
    >
      {rows}
    </div>
  );
}
