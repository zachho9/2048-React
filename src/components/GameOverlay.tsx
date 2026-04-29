import { GameStatus } from '../types/game'

interface GameOverlayProps {
  status: GameStatus
  onRestart: () => void
}

const GameOverlay = ({ status, onRestart }: GameOverlayProps) => {
  if (status === 'playing' || status === 'idle') return null

  const isWon = status === 'won'

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isWon ? 'rgba(237, 194, 46, 0.75)' : 'rgba(238, 228, 218, 0.75)',
        borderRadius: '8px',
        gap: '16px',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: isWon ? '#f9f6f2' : '#776e65',
        }}
      >
        {isWon ? 'You win!' : 'Game over!'}
      </div>
      <button
        onClick={onRestart}
        style={{
          padding: '12px 28px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#8f7a66',
          color: '#f9f6f2',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}

export default GameOverlay
