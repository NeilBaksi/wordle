import type { LetterState } from '../types';

interface TileProps {
  letter: string;
  state: LetterState;
  frontState: LetterState;
  isRevealed: boolean;
  col: number;
  bounce: boolean;
}

export function Tile({ letter, state, frontState, isRevealed, col, bounce }: TileProps) {
  return (
    <div className="tile-container">
      <div
        className="tile"
        data-revealed={isRevealed || undefined}
        data-bounce={bounce || undefined}
        style={{ '--col': col } as React.CSSProperties}
      >
        <div
          className="tile-front"
          data-state={frontState}
          aria-label={letter ? `${letter}, ${isRevealed ? state : 'typed'}` : 'empty'}
        >
          {letter.toUpperCase()}
        </div>
        <div
          className="tile-back"
          data-state={state}
          aria-hidden="true"
        >
          {letter.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
