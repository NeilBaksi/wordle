import { useGame } from '../context/GameContext';
import type { LetterState } from '../types';

const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['Enter','z','x','c','v','b','n','m','Backspace'],
];

export function Keyboard() {
  const { state, dispatch } = useGame();

  function handleKey(key: string) {
    if (state.gameStatus !== 'playing' || state.isRevealing) return;
    if (key === 'Enter') {
      dispatch({ type: 'SUBMIT' });
    } else if (key === 'Backspace') {
      dispatch({ type: 'DELETE' });
    } else {
      dispatch({ type: 'TYPE', letter: key });
    }
  }

  return (
    <div
      role="group"
      aria-label="Virtual keyboard"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px 8px 16px',
        userSelect: 'none',
      }}
    >
      {state.gameStatus === 'playing' && !state.hintUsed && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <button
            onClick={() => dispatch({ type: 'HINT' })}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '6px 20px',
              borderRadius: 999,
              border: 'none',
              backgroundColor: 'color-mix(in oklch, var(--color-key-default) 60%, white)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              opacity: 0.9,
              transition: 'opacity 150ms, transform 100ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            aria-label="Get a hint"
          >
            Hint
          </button>
        </div>
      )}

      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: 'flex', gap: '5px', width: '100%' }}>
          {row.map(key => {
            const isSpecial = key === 'Enter' || key === 'Backspace';
            const keyState: LetterState | undefined = isSpecial ? undefined : state.keyStates[key];

            const isHint = !isSpecial && key === state.hintLetter;

            return (
              <button
                key={key}
                className={`key${isSpecial ? ' key-wide' : ''}${key === 'Enter' ? ' key-enter' : ''}`}
                data-state={isHint ? 'hint' : keyState}
                aria-label={key === 'Backspace' ? 'Delete' : key}
                onClick={() => handleKey(key)}
              >
                {key === 'Backspace' ? '⌫' : key === 'Enter' ? 'ENTER' : key.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
