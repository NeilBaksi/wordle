# Graph Report - .  (2026-05-10)

## Corpus Check
- Corpus is ~15,930 words - fits in a single context window. You may not need a graph.

## Summary
- 111 nodes · 118 edges · 31 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Component Layer|UI Component Layer]]
- [[_COMMUNITY_CSS Animations & Themes|CSS Animations & Themes]]
- [[_COMMUNITY_Daily Word Engine|Daily Word Engine]]
- [[_COMMUNITY_Stats & Settings Sheet|Stats & Settings Sheet]]
- [[_COMMUNITY_Game State & Reducer|Game State & Reducer]]
- [[_COMMUNITY_App Root & Providers|App Root & Providers]]
- [[_COMMUNITY_Game Invariants|Game Invariants]]
- [[_COMMUNITY_Game Over Flow|Game Over Flow]]
- [[_COMMUNITY_Tile Component|Tile Component]]
- [[_COMMUNITY_GameContext Tests|GameContext Tests]]
- [[_COMMUNITY_Keyboard Tests|Keyboard Tests]]
- [[_COMMUNITY_Evaluation Tests|Evaluation Tests]]
- [[_COMMUNITY_Word Data|Word Data]]
- [[_COMMUNITY_Build Config|Build Config]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Vitest Config|Vitest Config]]
- [[_COMMUNITY_App Entry|App Entry]]
- [[_COMMUNITY_Test Setup|Test Setup]]
- [[_COMMUNITY_Type Definitions|Type Definitions]]
- [[_COMMUNITY_Vite Env|Vite Env]]
- [[_COMMUNITY_Board Component|Board Component]]
- [[_COMMUNITY_Header Component|Header Component]]
- [[_COMMUNITY_Toast Component|Toast Component]]
- [[_COMMUNITY_Evaluate Tests|Evaluate Tests]]
- [[_COMMUNITY_Daily Word Tests|Daily Word Tests]]
- [[_COMMUNITY_Storage Tests|Storage Tests]]
- [[_COMMUNITY_Tile Tests|Tile Tests]]
- [[_COMMUNITY_Answers Data|Answers Data]]
- [[_COMMUNITY_Valid Guesses Data|Valid Guesses Data]]
- [[_COMMUNITY_Tile Test Node|Tile Test Node]]
- [[_COMMUNITY_Package Config|Package Config]]

## God Nodes (most connected - your core abstractions)
1. `useGame()` - 10 edges
2. `GameProvider()` - 8 edges
3. `GameApp` - 7 edges
4. `gameReducer()` - 6 edges
5. `getHistory()` - 6 edges
6. `getDailyWord()` - 6 edges
7. `LetterState` - 6 edges
8. `StatsSheet` - 6 edges
9. `recordWordPlayed()` - 5 edges
10. `Keyboard` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Sketchbook theme toggle button in StatsSheet` --activates--> `Sketchbook theme CSS ([data-theme=sketchbook])`  [INFERRED]
  /Users/neilsupratikbaksi/Documents/Website/wordle/src/components/StatsSheet.tsx → /Users/neilsupratikbaksi/Documents/Website/wordle/src/index.css
- `StatsSheet` --contains_helper--> `MiniTile()`  [EXTRACTED]
  /Users/neilsupratikbaksi/Documents/Website/wordle/src/components/StatsSheet.tsx → src/components/StatsSheet.tsx
- `StatsSheet` --styled_by--> `Bottom sheet CSS (.sheet, .backdrop)`  [EXTRACTED]
  /Users/neilsupratikbaksi/Documents/Website/wordle/src/components/StatsSheet.tsx → /Users/neilsupratikbaksi/Documents/Website/wordle/src/index.css
- `Row shake animation keyframe (@keyframes shake)` --visual_feedback_for_invalid_submit--> `Invariant: currentInput is capped at 5 characters`  [INFERRED]
  /Users/neilsupratikbaksi/Documents/Website/wordle/src/index.css → /Users/neilsupratikbaksi/Documents/Website/wordle/src/__tests__/GameContext.test.tsx
- `Win bounce animation keyframe (@keyframes bounce-up)` --visual_feedback_on_win--> `Invariant: board always renders exactly 6 rows`  [INFERRED]
  /Users/neilsupratikbaksi/Documents/Website/wordle/src/index.css → /Users/neilsupratikbaksi/Documents/Website/wordle/src/__tests__/integration.test.tsx

## Hyperedges (group relationships)
- **GameContext dispatch pattern shared by Keyboard, useKeyboard, and GameOverSheet** — components_keyboard, hooks_usekeyboard, components_gameoversheet, gamecontext_action [INFERRED 0.90]
- **localStorage persistence layer: storage.ts manages stats + history used by GameProvider and dailyWord** — storage_gethistory, storage_sethistory, storage_updatestats, storage_getstats, storage_prunehistory, gamecontext_gameprovider, dailyword_getdailyword [INFERRED 0.85]
- **LetterState type drives UI color for Board tiles and Keyboard keys simultaneously** — types_letterstate, components_tile, components_keyboard, evaluate_evaluateguess, gamecontext_gamestate [INFERRED 0.88]
- **All test files share an identical in-memory localStorage mock pattern to isolate side effects** — test_storage, test_dailyword, test_gamecontext, test_keyboard, test_integration [EXTRACTED 1.00]
- **Sketchbook theme is defined in CSS, loaded by index.html fonts, toggled via StatsSheet, and activates Caveat Brush font** — css_sketchbook_theme, statssheet_sketchbook_toggle, font_caveat_brush, index_html [INFERRED 0.85]
- **data/answers.ts, data/validGuesses.ts, and evaluate.ts together form the word validation and scoring pipeline used throughout game logic** — data_answers, data_validguesses, invariant_duplicate_letter_scoring [INFERRED 0.80]

## Communities

### Community 0 - "UI Component Layer"
Cohesion: 0.18
Nodes (14): GameApp, Board, GameOverSheet, Header, Keyboard, Tile, Action, GameState (+6 more)

### Community 1 - "CSS Animations & Themes"
Cohesion: 0.13
Nodes (15): Row shake animation keyframe (@keyframes shake), Sketchbook theme CSS ([data-theme=sketchbook]), Tile 3D flip CSS animation (.tile[data-revealed]), Toast animation keyframes (@keyframes toast-in), Win bounce animation keyframe (@keyframes bounce-up), Font: Big Shoulders Display (display/title font), Font: Caveat Brush (sketchbook display font), Font: Figtree (default UI font) (+7 more)

### Community 2 - "Daily Word Engine"
Cohesion: 0.26
Nodes (11): dateHash(), getDailyWord(), getTodayString(), recordWordPlayed(), getHistory(), getStats(), pruneHistory(), setHistory() (+3 more)

### Community 3 - "Stats & Settings Sheet"
Cohesion: 0.22
Nodes (8): Bottom sheet CSS (.sheet, .backdrop), Invariant: hard mode can only be toggled before the first guess (currentRow === 0), StatsSheet, Guess Distribution bar chart in StatsSheet, Hard Mode toggle button in StatsSheet, HowToPlayRow (internal helper in StatsSheet), MiniTile(), Sketchbook theme toggle button in StatsSheet

### Community 4 - "Game State & Reducer"
Cohesion: 0.36
Nodes (7): evaluateGuess(), buildInitialState(), GameProvider(), gameReducer(), mergeKeyState(), validateHardMode(), showToast

### Community 5 - "App Root & Providers"
Cohesion: 0.29
Nodes (6): App, GameRoot(), ToastContainer, main, ToastProvider(), useToast()

### Community 6 - "Game Invariants"
Cohesion: 0.33
Nodes (6): Invariant: getDailyWord always returns 5-letter lowercase word, Invariant: getDailyWord returns same word within same day (idempotent), Invariant: pruneHistory removes entries older than 10 days, Invariant: getStats returns zero-initialized defaults when localStorage empty, dailyWord.test.ts — unit tests for getDailyWord and getTodayString, storage.test.ts — unit tests for storage utilities

### Community 7 - "Game Over Flow"
Cohesion: 0.67
Nodes (0): 

### Community 8 - "Tile Component"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "GameContext Tests"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Keyboard Tests"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Evaluation Tests"
Cohesion: 1.0
Nodes (2): Invariant: duplicate letters in guess do not over-mark (consume one per target occurrence), evaluate.test.ts — unit tests for evaluateGuess

### Community 12 - "Word Data"
Cohesion: 1.0
Nodes (2): answers.ts — ANSWERS word list (daily answer pool), validGuesses.ts — VALID_GUESSES combined word list

### Community 13 - "Build Config"
Cohesion: 1.0
Nodes (2): vite.config.ts — Vite build configuration, vitest.config.ts — Vitest test runner configuration

### Community 14 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Vitest Config"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "App Entry"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Test Setup"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Type Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Vite Env"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Board Component"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Header Component"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Toast Component"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Evaluate Tests"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Daily Word Tests"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Storage Tests"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Tile Tests"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Answers Data"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Valid Guesses Data"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Tile Test Node"
Cohesion: 1.0
Nodes (1): Tile.test.tsx — unit tests for Tile component

### Community 30 - "Package Config"
Cohesion: 1.0
Nodes (1): package.json — project dependencies and scripts

## Knowledge Gaps
- **25 isolated node(s):** `main`, `HistoryEntry`, `GameState`, `showToast`, `HowToPlayRow (internal helper in StatsSheet)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Tile Component`** (2 nodes): `Tile.tsx`, `Tile()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GameContext Tests`** (2 nodes): `wrapper()`, `GameContext.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Keyboard Tests`** (2 nodes): `wrapper()`, `Keyboard.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Evaluation Tests`** (2 nodes): `Invariant: duplicate letters in guess do not over-mark (consume one per target occurrence)`, `evaluate.test.ts — unit tests for evaluateGuess`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Word Data`** (2 nodes): `answers.ts — ANSWERS word list (daily answer pool)`, `validGuesses.ts — VALID_GUESSES combined word list`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Build Config`** (2 nodes): `vite.config.ts — Vite build configuration`, `vitest.config.ts — Vitest test runner configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vitest Config`** (1 nodes): `vitest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry`** (1 nodes): `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test Setup`** (1 nodes): `test-setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Type Definitions`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Env`** (1 nodes): `vite-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Board Component`** (1 nodes): `Board.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Header Component`** (1 nodes): `Header.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toast Component`** (1 nodes): `Toast.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Evaluate Tests`** (1 nodes): `evaluate.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Daily Word Tests`** (1 nodes): `dailyWord.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Storage Tests`** (1 nodes): `storage.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tile Tests`** (1 nodes): `Tile.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Answers Data`** (1 nodes): `answers.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Valid Guesses Data`** (1 nodes): `validGuesses.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tile Test Node`** (1 nodes): `Tile.test.tsx — unit tests for Tile component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Package Config`** (1 nodes): `package.json — project dependencies and scripts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useGame()` connect `UI Component Layer` to `Game State & Reducer`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `GameProvider()` connect `Game State & Reducer` to `Daily Word Engine`, `App Root & Providers`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Sketchbook theme CSS ([data-theme=sketchbook])` connect `CSS Animations & Themes` to `Stats & Settings Sheet`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useGame()` (e.g. with `Keyboard()` and `GameApp()`) actually correct?**
  _`useGame()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `main`, `HistoryEntry`, `GameState` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CSS Animations & Themes` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._