import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useLang } from '../context/LanguageContext';
import { WIN_MESSAGES } from '../i18n/strings';

interface GameOverSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameOverSheet({ isOpen, onClose }: GameOverSheetProps) {
  const { state, dispatch } = useGame();
  const { lang } = useLang();
  const [winMessage, setWinMessage] = useState(
    () => WIN_MESSAGES[lang][Math.floor(Math.random() * WIN_MESSAGES[lang].length)],
  );

  useEffect(() => {
    if (isOpen) {
      setWinMessage(WIN_MESSAGES[lang][Math.floor(Math.random() * WIN_MESSAGES[lang].length)]);
    }
  }, [isOpen, lang]);

  const handleNewGame = () => {
    (document.activeElement as HTMLElement)?.blur();
    dispatch({ type: 'NEW_GAME' });
    onClose();
  };

  const isWon = state.gameStatus === 'won';

  return (
    <>
      <div
        className="sheet"
        data-open={isOpen ? 'true' : 'false'}
        role="dialog"
        aria-modal="true"
        aria-label={isWon ? 'You won!' : 'Game over'}
      >
        <div style={{ padding: '24px 24px 32px' }}>
          {/* Handle bar */}
          <div
            style={{
              width: 40,
              height: 4,
              backgroundColor: 'var(--color-border-dim)',
              borderRadius: 2,
              margin: '0 auto 24px',
            }}
          />

          {isWon ? (
            <>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  textAlign: 'center',
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                {winMessage}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: 'var(--color-correct)',
                  textAlign: 'center',
                  marginBottom: 24,
                  letterSpacing: '-0.02em',
                }}
              >
                Solved in {state.guesses.length}/6
              </p>
            </>
          ) : (
            <>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-muted)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 12,
                }}
              >
                The word was
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
                aria-label={`The answer was ${state.targetWord}`}
              >
                {state.targetWord
                  .toUpperCase()
                  .split('')
                  .map((letter, i) => (
                    <div
                      key={i}
                      style={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--color-correct)',
                        borderRadius: 4,
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: 'oklch(13% 0.008 148)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {letter}
                    </div>
                  ))}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '1rem',
                  color: 'var(--color-muted)',
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                Better luck next time 🍀
              </p>
            </>
          )}

          <button
            onClick={handleNewGame}
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '1rem',
              backgroundColor: 'var(--color-correct)',
              color: 'oklch(13% 0.008 148)',
              border: 'none',
              borderRadius: 8,
              padding: '14px 24px',
              cursor: 'pointer',
              width: '100%',
              transition: 'opacity 100ms',
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </>
  );
}
