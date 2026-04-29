# Score History — Design Spec

**Date:** 2026-04-29
**Branch:** dev/score_history

## Overview

Add a always-visible sidebar panel that shows a chronological log of every game played, newest first. Distinct from the existing leaderboard (top 10 by score); this is an unbounded record of all sessions in the order they were played.

## Data Model

Reuse the existing `LeaderboardEntry` type — it already has the required shape:

```ts
interface LeaderboardEntry {
  score: number
  date: string // ISO 8601
}
```

No new type needed. `ScoreHistoryEntry` is an alias for `LeaderboardEntry`.

## Storage

- **Key:** `2048-score-history` (separate from `2048-leaderboard`)
- **Order:** newest first (entries prepended, not sorted by score)
- **Limit:** unlimited — all games retained, scrollable in the UI
- **Format:** JSON array in localStorage

## New Files

### `src/utils/scoreHistory.ts`

Two exports:

```ts
loadScoreHistory(): LeaderboardEntry[]
addScoreHistoryEntry(score: number): LeaderboardEntry[]
```

`addScoreHistoryEntry` prepends the new entry to the front of the array (newest first), persists to localStorage, and returns the updated list.

### `src/components/ScoreHistoryPanel.tsx`

Props:

```ts
interface ScoreHistoryPanelProps {
  /** All game entries, newest first */
  entries: LeaderboardEntry[]
}
```

- Always visible, no open/close state
- Scrollable list when entries overflow
- Empty state: "No games yet. Play one!"
- Styled to match the existing 2048 palette (`#bbada0` background, `#f9f6f2` text)
- Width: ~140px, top-aligned beside the board

## Modified Files

### `src/App.tsx`

- Import `ScoreHistoryPanel` and `scoreHistory` utils
- Add `history` state: `useState<LeaderboardEntry[]>(() => loadScoreHistory())`
- `useEffect` watches `state.status` — on `won` or `lost` with `score > 0`, calls `addScoreHistoryEntry(score)`, updates `history` state. Same guard ref pattern used for leaderboard (`scoreSaved` ref).
- Layout: board and sidebar wrapped in a `display: flex` row, `align-items: flex-start`, `gap: 16px`, `max-width: 680px`. Flex-wraps on narrow screens.

### `src/components/index.ts`

Add `ScoreHistoryPanel` to barrel export.

## Layout

```
┌─────────────────────────────────────────────┐
│  2048                    [SCORE]   [BEST]   │
│  Join tiles to reach 2048!      [New game]  │
│  ┌──────────────────────┐  ┌─────────────┐  │
│  │                      │  │  History    │  │
│  │     4×4 Board        │  │  ─────────  │  │
│  │                      │  │  512  now   │  │
│  │                      │  │  348  today │  │
│  └──────────────────────┘  │  204  Apr28 │  │
│                             │  ...        │  │
│  Use arrow keys / WASD...   └─────────────┘  │
│              [Leaderboard]                   │
└─────────────────────────────────────────────┘
```

## Testing

### `src/__tests__/scoreHistory.test.ts`

- `loadScoreHistory` returns `[]` when nothing stored
- `loadScoreHistory` returns stored entries
- `loadScoreHistory` returns `[]` on invalid JSON
- `addScoreHistoryEntry` adds a new entry
- `addScoreHistoryEntry` orders entries newest first (not by score)
- `addScoreHistoryEntry` persists to localStorage

### `src/__tests__/ScoreHistoryPanel.test.tsx`

- Renders empty state message when `entries` is empty
- Renders score and date for each entry
- Renders entries in the order provided (no re-sorting)

## Out of Scope

- Clearing history (no delete/reset button)
- Filtering or searching history
- Showing game outcome (won/lost) per entry
- Any changes to the existing leaderboard feature
