import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const WIN_MESSAGES = [
  'You absolute wordsmith! 🎉',
  'That big brain energy is unmatched 🧠',
  'Webster called — he wants tips 📖',
  'Linguistic royalty detected 👑',
  'Statistically improbable. Empirically impressive. 📊',
  'Your ancestors spelled this word so you could solve it today 🏺',
  'Certificate of Wordle Excellence — awarded herein ✨',
  'You played Wordle and society is better for it 🌍',
  'Was that effortless? Because it looked effortless. 🦋',
  'Your neurons are elite athletes 🏅',
  'The letters feared you and they were right 🔤',
  'Shakespeare would have lost to you today 📜',
  'Philosophers have debated your intelligence for centuries ⚗️',
  'You have unlocked the rare "Actually Good at Wordle" achievement 🏆',
  'Your vocabulary is a public service 🎓',
  'The word never stood a chance 💀',
  'Solving this in your sleep would still be impressive 💤',
  'Even the blank tiles are impressed 🫡',
  'You have given this grid meaning 🌟',
  'Dictionary.com wants to be you 📱',
  'You are the main character of language 🎬',
  'Your brain is not from this planet 🪐',
  'In a world of average guessers, you are the exception 🌠',
  'The Scrabble grandmasters bow to you 🎲',
  'Bards will sing of this guess for generations 🪕',
  'You have done the impossible — impressed an algorithm 🤖',
  'That guess was so clean it should have a theme song 🎵',
  'Your instincts are frighteningly good 🔮',
  'Languages are honoured by your participation 🌐',
  'A moment of silence for the letters you did not even need ⏸️',
  'Five letters. One legend. You. 🦅',
  'Are you sure you have not done this before? 👀',
  'This is what peak performance looks like. Frame it. 🖼️',
  'GOAT. That is all. 🐐',
  'The algorithm did not expect this. The algorithm is humbled. 🤯',
  'Vocabulary enlightenment: achieved 🧘',
  'The word saw you coming and tried to hide 🫣',
  'Historical. Legendary. Correct. ✅',
  'You just made Wordle look easy — it is not easy 😤',
  'Speed. Precision. Spelling. A dangerous combination. ⚡',
  'You smell of libraries and winning 📚',
  'A standing ovation from all 26 letters 👏',
  'Crossword puzzles are scared of you 🗂️',
  'You have earned exactly one smug smile today 😏',
  'If vocabulary were a sport, you would be doping 💊',
  'Truly alarming levels of competence 🚨',
  'The English language thanks you for your service 🇬🇧',
  'Your guesses age like fine wine 🍷',
  'Solved. Immaculate. No notes. 🎯',
  'You are built different. Lexically speaking. 🧬',
  'The squares went green and so did your rivals 🟩',
  'Vocabulary has never been so well-administered 📋',
  'Your prefrontal cortex deserves a bonus 💡',
  'The dictionary shed a single tear of joy 😢',
  'Wordle has been defeated. Tell your friends. 📣',
  'You are what happens when curiosity meets spelling 🔍',
  'If brains were words, yours would be the entire thesaurus 📘',
  'Zero hesitation. Maximum correctness. Iconic. 🫶',
];

interface GameOverSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameOverSheet({ isOpen, onClose }: GameOverSheetProps) {
  const { state, dispatch } = useGame();
  const [winMessage, setWinMessage] = useState(
    () => WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)],
  );

  useEffect(() => {
    if (isOpen) {
      setWinMessage(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
    }
  }, [isOpen]);

  const handleNewGame = () => {
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
