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
