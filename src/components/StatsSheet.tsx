import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../i18n/strings';
import { getStats } from '../utils/storage';
import type { GameStats } from '../types';

interface StatsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'default' | 'light' | 'sketchbook';
  onSetTheme: (t: 'default' | 'light' | 'sketchbook') => void;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

interface TileProps {
  letter: string;
  bg: string;
}

function MiniTile({ letter, bg }: TileProps) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderRadius: 4,
        fontFamily: 'var(--font-display)',
        fontSize: '1.125rem',
        fontWeight: 900,
        color: 'oklch(13% 0.008 148)',
        letterSpacing: '-0.02em',
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

function HowToPlayRow({
  word,
  highlightIndex,
  highlightColor,
  label,
}: {
  word: string;
  highlightIndex: number;
  highlightColor: string;
  label: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {word.split('').map((letter, i) => (
          <MiniTile
            key={i}
            letter={letter}
            bg={i === highlightIndex ? highlightColor : 'var(--color-surface-2)'}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.8125rem',
          color: 'var(--color-muted)',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function StatsSheet({ isOpen, onClose, theme, onSetTheme }: StatsSheetProps) {
  const { state, dispatch } = useGame();
  const { lang, setLang } = useLang();
  const s = STRINGS[lang];
  const [stats, setStats] = useState<GameStats>(() => getStats());

  // Refresh stats whenever the sheet opens so new wins/losses are reflected.
  useEffect(() => {
    if (isOpen) {
      setStats(getStats());
    }
  }, [isOpen]);

  const winPct = stats.played
    ? Math.round((stats.won / stats.played) * 100)
    : 0;

  const maxDist = Math.max(...stats.guessDistribution, 1);

  return (
    <>
      {/* Backdrop */}
      <div
        className="backdrop"
        data-open={isOpen ? 'true' : 'false'}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="sheet"
        data-open={isOpen ? 'true' : 'false'}
        role="dialog"
        aria-modal="true"
        aria-label="Statistics and settings"
      >
        <div style={{ padding: '24px 24px 40px' }}>
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

          {/* ---------------------------------------------------------------- */}
          {/* Section: Statistics                                               */}
          {/* ---------------------------------------------------------------- */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              textAlign: 'center',
              margin: '0 0 16px',
            }}
          >
            Statistics
          </h2>

          {/* Stats numbers row */}
          <div
            style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}
          >
            {[
              { label: 'Played', value: stats.played },
              { label: 'Win %', value: winPct },
              { label: 'Streak', value: stats.currentStreak },
              { label: 'Best', value: stats.maxStreak },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: 'var(--color-text)',
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    color: 'var(--color-muted)',
                    marginTop: 4,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Section: Guess Distribution                                       */}
          {/* ---------------------------------------------------------------- */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              textAlign: 'center',
              margin: '0 0 12px',
            }}
          >
            Guess Distribution
          </h2>

          <div style={{ marginBottom: 24 }}>
            {stats.guessDistribution.map((count, i) => {
              const pct = Math.round((count / maxDist) * 100);
              const isCurrentGame =
                state.gameStatus === 'won' && state.guesses.length === i + 1;
              return (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.875rem',
                      color: 'var(--color-muted)',
                      width: 12,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, height: 24, position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: isCurrentGame
                        ? 'var(--color-correct)'
                        : 'var(--color-border-dim)',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: 8,
                      justifyContent: 'flex-end',
                      transformOrigin: 'left',
                      transform: `scaleX(${Math.max(pct, 8) / 100})`,
                      transition: 'transform 300ms var(--ease-out-quart)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                      }}
                    >
                      {count}
                    </span>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Section: Settings — Hard Mode toggle                              */}
          {/* ---------------------------------------------------------------- */}
          <div
            style={{
              borderTop: '1px solid var(--color-border-dim)',
              paddingTop: 20,
              marginTop: 4,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 900,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                margin: '0 0 16px',
              }}
            >
              Settings
            </h2>

            {/* Language toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 20,
              marginBottom: 20,
              borderBottom: '1px solid var(--color-border-dim)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  {s.settingsLang}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: 2 }}>
                  {s.settingsLangDesc}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border-dim)' }}>
                {(['en', 'es'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      padding: '6px 14px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: lang === l ? 'var(--color-correct)' : 'transparent',
                      color: lang === l ? 'oklch(13% 0.008 148)' : 'var(--color-text)',
                      transition: 'background-color 150ms',
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    fontSize: '0.9375rem',
                  }}
                >
                  {s.settingsHardMode}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    color: 'var(--color-muted)',
                    marginTop: 2,
                  }}
                >
                  {s.settingsHardModeDesc}
                </div>
              </div>
              {/* Toggle */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_HARD_MODE' })}
                aria-pressed={state.hardMode}
                aria-label="Toggle hard mode"
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  border: 'none',
                  cursor: state.currentRow === 0 ? 'pointer' : 'not-allowed',
                  backgroundColor: state.hardMode
                    ? 'var(--color-correct)'
                    : 'var(--color-border-dim)',
                  position: 'relative',
                  transition: 'background-color 200ms',
                  flexShrink: 0,
                  opacity: state.currentRow === 0 ? 1 : 0.5,
                }}
                title={
                  state.currentRow !== 0
                    ? 'Hard mode can only be changed before your first guess'
                    : undefined
                }
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: 3,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-text)',
                    transform: state.hardMode ? 'translateX(20px)' : 'translateX(0)',
                    transition: 'transform 200ms var(--ease-out-quart)',
                  }}
                />
              </button>
            </div>

            {/* Theme picker — 3-way segmented control */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  marginBottom: 10,
                }}
              >
                Theme
              </div>
              <div
                role="group"
                aria-label="Theme selection"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 6,
                }}
              >
                {([
                  { value: 'default', label: 'Dark' },
                  { value: 'light',   label: 'Light' },
                  { value: 'sketchbook', label: 'Sketchbook' },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onSetTheme(value)}
                    aria-pressed={theme === value}
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '8px 4px',
                      borderRadius: 6,
                      border: theme === value
                        ? '2px solid var(--color-correct)'
                        : '2px solid var(--color-border-dim)',
                      backgroundColor: theme === value
                        ? 'var(--color-correct)'
                        : 'transparent',
                      color: theme === value
                        ? 'oklch(13% 0.008 148)'
                        : 'var(--color-muted)',
                      cursor: 'pointer',
                      transition: 'background-color 150ms, border-color 150ms, color 150ms',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Section: How to Play                                              */}
          {/* ---------------------------------------------------------------- */}
          <div
            style={{
              borderTop: '1px solid var(--color-border-dim)',
              paddingTop: 20,
              marginTop: 4,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 900,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                margin: '0 0 12px',
              }}
            >
              {s.howToPlayTitle}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.875rem',
                color: 'var(--color-muted)',
                lineHeight: 1.6,
                margin: '0 0 16px',
              }}
            >
              {s.howToPlayGuess}
            </p>

            <HowToPlayRow
              word={s.exampleCorrectWord}
              highlightIndex={0}
              highlightColor="var(--color-correct)"
              label={s.exampleCorrectDesc}
            />
            <HowToPlayRow
              word={s.examplePresentWord}
              highlightIndex={1}
              highlightColor="var(--color-present)"
              label={s.examplePresentDesc}
            />
            <HowToPlayRow
              word={s.exampleAbsentWord}
              highlightIndex={3}
              highlightColor="var(--color-absent)"
              label={s.exampleAbsentDesc}
            />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Close button                                                      */}
          {/* ---------------------------------------------------------------- */}
          <button
            onClick={onClose}
            style={{
              marginTop: 8,
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
            Close
          </button>
        </div>
      </div>
    </>
  );
}
