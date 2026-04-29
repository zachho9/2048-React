# 2048-React

A 2048 clone built with React, TypeScript, and Vite.

## Getting started

```bash
npm install
npm run dev        # http://localhost:2048
```

## Controls

| Input | Action |
|-------|--------|
| Arrow keys / WASD | Move tiles |
| Swipe | Move tiles (mobile) |
| New game button | Restart |

## Scripts

```bash
npm run dev        # Dev server on port 2048
npm run build      # Production build
npm run test       # Unit tests (Jest + React Testing Library)
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

## Project structure

```
src/
  types/       # TypeScript types
  utils/       # Pure game logic, leaderboard, and score history helpers
  hooks/       # useGame — state, keyboard input, localStorage
  components/  # Tile, Board, ScoreBox, GameOverlay, LeaderboardModal, ScoreHistoryPanel
  __tests__/   # Unit and component tests
```

## Features

- Tile merging with correct 2048 rules
- Score tracking with best score persisted to localStorage
- Win (2048 tile) and game over detection
- Touch/swipe support
- Leaderboard — top 10 scores saved to localStorage, shown in a popup modal
- Score history — always-visible sidebar showing every game played, newest first
