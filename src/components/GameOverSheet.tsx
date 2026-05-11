import { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import type { LetterState } from '../types';

const WIN_MESSAGES = [
  'You absolute wordsmith! 🎉',
  'That big brain energy is unmatched 🧠',
  'Webster called — he wants tips 📖',
  'Linguistic royalty detected 👑',
  'Statistically improbable. Empirically impressive. 📊',
  'Your ancestors spelled this word so you could solve it today 🏺',
  'Certificate of Wordle Excellence — awarded herein ✨',
  'You played Wordle and society is better for it 🌍',
];

interface GameOverSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

function buildShareText(
  guesses: string[],
  evaluations: LetterState[][],
  gameStatus: string,
): string {
  const emojiMap: Record<LetterState, string> = {
    correct: '🟩',
    present: '🟨',
    absent: '⬛',
    empty: '⬛',
    active: '⬛',
  };
  const guessCount = gameStatus === 'won' ? `${guesses.length}/6` : 'X/6';
  const grid = evaluations.map(row => row.map(s => emojiMap[s]).join('')).join('\n');
  return `WORDLE ${guessCount}\n\n${grid}`;
}

export function GameOverSheet({ isOpen, onClose }: GameOverSheetProps) {
  const { state, dispatch } = useGame();
  const { showToast } = useToast();
  const [winMessage] = useState(
    () => WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)],
  );

  const handleShare = useCallback(async () => {
    const text = buildShareText(state.guesses, state.evaluations, state.gameStatus);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 2000);
    } catch {
      showToast('Could not copy', 1500);
    }
  }, [state.guesses, state.evaluations, state.gameStatus, showToast]);

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
    onClose();
  };

  const isWon = state.gameStatus === 'won';

  return (
    <>
      <div
        className="backdrop"
        data-open={isOpen ? 'true' : 'false'}
        onClick={onClose}
        aria-hidden="true"
      />
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
              {/* Show the answer as tiles */}
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

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={handleShare}
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
              Share Results
            </button>
            <button
              onClick={handleNewGame}
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border-dim)',
                borderRadius: 8,
                padding: '14px 24px',
                cursor: 'pointer',
                width: '100%',
                transition: 'border-color 100ms',
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
