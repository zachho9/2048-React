import { useRef } from 'react'
import { useGame } from './hooks/useGame'
import Board from './components/Board'
import ScoreBox from './components/ScoreBox'
import GameOverlay from './components/GameOverlay'
import { Direction } from './types/game'

const App = () => {
  const { state, move, restart } = useGame()
  const touchStart = useRef<{ x: number; y: number } | null>(null)

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '480px',
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

      {/* Subtitle row */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '480px',
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

      {/* Board */}
      <div
        style={{ position: 'relative', width: '100%', maxWidth: '480px' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Board board={state.board} />
        <GameOverlay status={state.status} onRestart={restart} />
      </div>

      <p style={{ color: '#776e65', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
        Use arrow keys, WASD, or swipe to move tiles.
      </p>
    </div>
  )
}

export default App
