# Score History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an always-visible sidebar panel that shows a chronological log of every game played (newest first), stored in localStorage independently of the leaderboard.

**Architecture:** New `scoreHistory.ts` utility handles storage (prepend-newest-first, no trimming, own localStorage key `2048-score-history`). New `ScoreHistoryPanel` component renders the list beside the board. `App.tsx` gains a `history` state + save effect, and its board section becomes a flex row to accommodate the panel.

**Tech Stack:** React 18, TypeScript (strict), Vite, Jest + React Testing Library (jsdom), localStorage, inline styles matching existing 2048 palette.

---

## File Map

| Action | File |
|--------|------|
| Create | `src/utils/scoreHistory.ts` |
| Create | `src/__tests__/scoreHistory.test.ts` |
| Create | `src/components/ScoreHistoryPanel.tsx` |
| Create | `src/__tests__/ScoreHistoryPanel.test.tsx` |
| Modify | `src/components/index.ts` |
| Modify | `src/App.tsx` |

---

## Task 1: scoreHistory Utility (TDD)

**Files:**
- Create: `src/utils/scoreHistory.ts`
- Create: `src/__tests__/scoreHistory.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/__tests__/scoreHistory.test.ts`:

```ts
import { loadScoreHistory, addScoreHistoryEntry } from '../utils/scoreHistory'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('loadScoreHistory', () => {
  beforeEach(() => localStorageMock.clear())

  it('returns empty array when nothing is stored', () => {
    expect(loadScoreHistory()).toEqual([])
  })

  it('returns stored entries', () => {
    const entries = [{ score: 100, date: '2026-01-01T00:00:00.000Z' }]
    localStorageMock.setItem('2048-score-history', JSON.stringify(entries))
    expect(loadScoreHistory()).toEqual(entries)
  })

  it('returns empty array on invalid JSON', () => {
    localStorageMock.setItem('2048-score-history', 'not-json')
    expect(loadScoreHistory()).toEqual([])
  })
})

describe('addScoreHistoryEntry', () => {
  beforeEach(() => localStorageMock.clear())

  it('adds a new entry and returns it', () => {
    const entries = addScoreHistoryEntry(500)
    expect(entries).toHaveLength(1)
    expect(entries[0].score).toBe(500)
    expect(entries[0].date).toBeDefined()
  })

  it('prepends new entries so newest is first', () => {
    addScoreHistoryEntry(100)
    addScoreHistoryEntry(200)
    const entries = addScoreHistoryEntry(50)
    expect(entries.map((e) => e.score)).toEqual([50, 200, 100])
  })

  it('does not sort by score — lower score added later appears first', () => {
    addScoreHistoryEntry(500)
    const entries = addScoreHistoryEntry(100)
    expect(entries[0].score).toBe(100)
    expect(entries[1].score).toBe(500)
  })

  it('persists entries to localStorage', () => {
    addScoreHistoryEntry(300)
    expect(loadScoreHistory()[0].score).toBe(300)
  })

  it('keeps all entries without trimming', () => {
    for (let i = 0; i < 15; i++) addScoreHistoryEntry(i * 10)
    expect(loadScoreHistory()).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm run test -- --testPathPattern=scoreHistory
```

Expected: `FAIL` — `Cannot find module '../utils/scoreHistory'`

- [ ] **Step 3: Implement the utility**

Create `src/utils/scoreHistory.ts`:

```ts
import { LeaderboardEntry } from '../types/game'

const KEY = '2048-score-history'

export const loadScoreHistory = (): LeaderboardEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as LeaderboardEntry[]
  } catch {
    return []
  }
}

export const addScoreHistoryEntry = (score: number): LeaderboardEntry[] => {
  const entries = loadScoreHistory()
  const updated = [{ score, date: new Date().toISOString() }, ...entries]
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable
  }
  return updated
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm run test -- --testPathPattern=scoreHistory
```

Expected: `PASS` — 8 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/utils/scoreHistory.ts src/__tests__/scoreHistory.test.ts
git commit -m "feat: add scoreHistory utility with chronological storage"
```

---

## Task 2: ScoreHistoryPanel Component (TDD)

**Files:**
- Create: `src/components/ScoreHistoryPanel.tsx`
- Create: `src/__tests__/ScoreHistoryPanel.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/__tests__/ScoreHistoryPanel.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ScoreHistoryPanel from '../components/ScoreHistoryPanel'
import { LeaderboardEntry } from '../types/game'

const entries: LeaderboardEntry[] = [
  { score: 512, date: '2026-04-29T10:00:00.000Z' },
  { score: 256, date: '2026-04-28T09:00:00.000Z' },
  { score: 1024, date: '2026-04-27T08:00:00.000Z' },
]

describe('ScoreHistoryPanel', () => {
  it('renders the History heading', () => {
    render(<ScoreHistoryPanel entries={[]} />)
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('renders empty state when no entries', () => {
    render(<ScoreHistoryPanel entries={[]} />)
    expect(screen.getByText('No games yet. Play one!')).toBeInTheDocument()
  })

  it('does not render empty state when entries exist', () => {
    render(<ScoreHistoryPanel entries={entries} />)
    expect(screen.queryByText('No games yet. Play one!')).not.toBeInTheDocument()
  })

  it('renders score for each entry', () => {
    render(<ScoreHistoryPanel entries={entries} />)
    expect(screen.getByTestId('score-0')).toHaveTextContent('512')
    expect(screen.getByTestId('score-1')).toHaveTextContent('256')
    expect(screen.getByTestId('score-2')).toHaveTextContent('1024')
  })

  it('renders entries in the order provided without re-sorting', () => {
    render(<ScoreHistoryPanel entries={entries} />)
    const scores = [0, 1, 2].map((i) =>
      Number(screen.getByTestId(`score-${i}`).textContent),
    )
    expect(scores).toEqual([512, 256, 1024])
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm run test -- --testPathPattern=ScoreHistoryPanel
```

Expected: `FAIL` — `Cannot find module '../components/ScoreHistoryPanel'`

- [ ] **Step 3: Implement the component**

Create `src/components/ScoreHistoryPanel.tsx`:

```tsx
import { LeaderboardEntry } from '../types/game'

interface ScoreHistoryPanelProps {
  /** All game entries, newest first */
  entries: LeaderboardEntry[]
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  if (d.toDateString() === new Date().toDateString()) return 'today'
  return d.toLocaleDateString()
}

const ScoreHistoryPanel = ({ entries }: ScoreHistoryPanelProps) => (
  <div
    style={{
      width: '140px',
      flexShrink: 0,
      backgroundColor: '#bbada0',
      borderRadius: '8px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}
  >
    <div
      style={{
        color: '#f9f6f2',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        paddingBottom: '6px',
      }}
    >
      History
    </div>

    {entries.length === 0 ? (
      <p style={{ color: '#eee4da', fontSize: '0.75rem', margin: 0, textAlign: 'center', padding: '8px 0' }}>
        No games yet. Play one!
      </p>
    ) : (
      <div style={{ overflowY: 'auto', maxHeight: '240px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {entries.map((entry, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: idx < entries.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <span
              data-testid={`score-${idx}`}
              style={{ color: '#f9f6f2', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              {entry.score}
            </span>
            <span style={{ color: '#eee4da', fontSize: '0.7rem' }}>
              {formatDate(entry.date)}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
)

export default ScoreHistoryPanel
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm run test -- --testPathPattern=ScoreHistoryPanel
```

Expected: `PASS` — 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/components/ScoreHistoryPanel.tsx src/__tests__/ScoreHistoryPanel.test.tsx
git commit -m "feat: add ScoreHistoryPanel component"
```

---

## Task 3: Wire Up in App.tsx + Barrel Export

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/index.ts`

- [ ] **Step 1: Add ScoreHistoryPanel to the barrel export**

Edit `src/components/index.ts` — add one line after the LeaderboardModal export:

```ts
export { default as Board } from './Board'
export { default as GameOverlay } from './GameOverlay'
export { default as LeaderboardModal } from './LeaderboardModal'
export { default as ScoreBox } from './ScoreBox'
export { default as ScoreHistoryPanel } from './ScoreHistoryPanel'
export { default as Tile } from './Tile'
```

- [ ] **Step 2: Update App.tsx**

Replace the entire contents of `src/App.tsx` with:

```tsx
import { useEffect, useRef, useState } from 'react'
import { useGame } from './hooks/useGame'
import { Board, ScoreBox, GameOverlay, LeaderboardModal, ScoreHistoryPanel } from './components'
import { Direction, LeaderboardEntry } from './types/game'
import { addLeaderboardEntry, loadLeaderboard } from './utils/leaderboard'
import { addScoreHistoryEntry, loadScoreHistory } from './utils/scoreHistory'

const App = () => {
  const { state, move, restart } = useGame()
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const scoreSaved = useRef(false)

  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard())
  const [history, setHistory] = useState<LeaderboardEntry[]>(() => loadScoreHistory())

  useEffect(() => {
    if ((state.status === 'won' || state.status === 'lost') && state.score > 0 && !scoreSaved.current) {
      scoreSaved.current = true
      setLeaderboard(addLeaderboardEntry(state.score))
      setHistory(addScoreHistoryEntry(state.score))
    }
    if (state.status === 'playing') {
      scoreSaved.current = false
    }
  }, [state.status, state.score])

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return

    let dir: Direction
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left'
    } else {
      dir = dy > 0 ? 'down' : 'up'
    }
    move(dir)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf8ef',
        fontFamily: '"Clear Sans", "Helvetica Neue", Arial, sans-serif',
        padding: '16px',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '680px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#776e65' }}>2048</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ScoreBox label="Score" value={state.score} />
          <ScoreBox label="Best" value={state.bestScore} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '680px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <p style={{ color: '#776e65', margin: 0, fontSize: '0.9rem' }}>
          Join tiles to reach <strong>2048!</strong>
        </p>
        <button
          onClick={restart}
          style={{
            padding: '8px 20px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#8f7a66',
            color: '#f9f6f2',
            cursor: 'pointer',
          }}
        >
          New game
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          width: '100%',
          maxWidth: '680px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Board board={state.board} />
          <GameOverlay status={state.status} onRestart={restart} />
        </div>
        <ScoreHistoryPanel entries={history} />
      </div>

      <p style={{ color: '#776e65', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
        Use arrow keys, WASD, or swipe to move tiles.
      </p>

      <button
        onClick={() => setLeaderboardOpen(true)}
        style={{
          padding: '10px 32px',
          fontWeight: 'bold',
          fontSize: '0.95rem',
          border: '2px solid #bbada0',
          borderRadius: '6px',
          backgroundColor: 'transparent',
          color: '#776e65',
          cursor: 'pointer',
        }}
      >
        Leaderboard
      </button>

      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        entries={leaderboard}
      />
    </div>
  )
}

export default App
```

- [ ] **Step 3: Run the full test suite**

```bash
npm run test
```

Expected: `PASS` — all 38 tests passing (30 existing + 8 new)

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: no output (clean)

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/index.ts
git commit -m "feat: wire up score history sidebar in App"
```

---

## Done

All three tasks complete. The feature is fully implemented, tested, and committed. Push with:

```bash
git push -u origin dev/score_history
```
