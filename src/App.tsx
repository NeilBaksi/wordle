import { useState, useEffect, useRef, type ReactNode } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { GameProvider, useGame } from './context/GameContext';
import { LanguageProvider, useLang } from './context/LanguageContext';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { ToastContainer } from './components/Toast';
import { GameOverSheet } from './components/GameOverSheet';
import { StatsSheet } from './components/StatsSheet';
import { useKeyboard } from './hooks/useKeyboard';
import { getTodayString } from './utils/dailyWord';

function GameRoot({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const { lang } = useLang();
  return <GameProvider showToast={showToast} lang={lang}>{children}</GameProvider>;
}

function GameApp() {
  const { state, dispatch } = useGame();
  const { lang } = useLang();
  const prevLangRef = useRef<string>(lang);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [theme, setTheme] = useState<'default' | 'light' | 'sketchbook'>(
    () => (localStorage.getItem('theme') as 'default' | 'light' | 'sketchbook') ?? 'sketchbook'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      dispatch({ type: 'SET_LANG', lang });
    }
  }, [lang, dispatch]);

  useKeyboard();

  // Fetch authoritative daily word from edge function; override local if pre-game
  useEffect(() => {
    fetch(`/api/daily-word?lang=${state.lang}`)
      .then(r => r.json())
      .then(({ word, date }: { word: string; date: string }) => {
        if (date === getTodayString()) {
          dispatch({ type: 'SET_WORD', word });
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Auto-open GameOver sheet after reveal animation completes
  useEffect(() => {
    if (state.gameStatus === 'playing') return;
    if (state.isRevealing) return;
    const timer = setTimeout(() => setIsGameOverOpen(true), 400);
    return () => clearTimeout(timer);
  }, [state.gameStatus, state.isRevealing]);

  // Close GameOver sheet when a new game starts
  useEffect(() => {
    if (state.gameStatus === 'playing') {
      setIsGameOverOpen(false);
    }
  }, [state.gameStatus]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      maxWidth: 500,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Header onInfoOpen={() => setIsStatsOpen(true)} />

      {/* Toast overlay — positioned relative to the header */}
      <div style={{ position: 'relative', flex: 0 }}>
        <ToastContainer />
      </div>

      {/* Board — fills remaining space */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Board key={state.gameId} />
      </div>

      {/* Keyboard — pinned to bottom */}
      <div style={{ flexShrink: 0 }}>
        <Keyboard />
      </div>

      {/* Bottom sheets */}
      <GameOverSheet
        isOpen={isGameOverOpen}
        onClose={() => setIsGameOverOpen(false)}
      />
      <StatsSheet
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        theme={theme}
        onSetTheme={setTheme}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <GameRoot>
          <GameApp />
        </GameRoot>
      </LanguageProvider>
    </ToastProvider>
  );
}
