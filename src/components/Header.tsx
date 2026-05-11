import { useGame } from '../context/GameContext';

interface HeaderProps {
  onInfoOpen: () => void;
}

export function Header({ onInfoOpen }: HeaderProps) {
  const { state } = useGame();

  return (
    <header style={{
      height: 64,
      borderBottom: '1px solid var(--color-border-dim)',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--color-bg)',
      flexShrink: 0,
    }}>
      {/* Left: title */}
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2.25rem',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        color: 'var(--color-text)',
        lineHeight: 1,
      }}>
        WORDLE
      </span>

      {/* Center: hard mode badge */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {state.hardMode && (
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-border-dim)',
            padding: '2px 8px',
            borderRadius: 999,
          }}>
            HARD
          </span>
        )}
      </div>

      {/* Right: info button */}
      <button
        onClick={onInfoOpen}
        aria-label="Statistics and settings"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text)',
          fontSize: '1.25rem',
          cursor: 'pointer',
          width: 44,
          height: 44,
          borderRadius: 4,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          width="22"
          height="22"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM280 400C266.7 400 256 410.7 256 424C256 437.3 266.7 448 280 448L360 448C373.3 448 384 437.3 384 424C384 410.7 373.3 400 360 400L352 400L352 312C352 298.7 341.3 288 328 288L280 288C266.7 288 256 298.7 256 312C256 325.3 266.7 336 280 336L304 336L304 400L280 400zM320 256C337.7 256 352 241.7 352 224C352 206.3 337.7 192 320 192C302.3 192 288 206.3 288 224C288 241.7 302.3 256 320 256z"/>
        </svg>
      </button>
    </header>
  );
}
