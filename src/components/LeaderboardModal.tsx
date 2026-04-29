import { LeaderboardEntry } from '../types/game'

interface LeaderboardModalProps {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Called when the user requests the modal to close */
  onClose: () => void
  /** Ranked list of leaderboard entries to display */
  entries: LeaderboardEntry[]
}

const LeaderboardModal = ({ isOpen, onClose, entries }: LeaderboardModalProps) => {
  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Leaderboard"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#faf8ef',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '360px',
          maxHeight: '80vh',
          overflowY: 'auto',
          fontFamily: '"Clear Sans", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0, color: '#776e65', fontSize: '1.5rem' }}>Leaderboard</h2>
          <button
            onClick={onClose}
            aria-label="Close leaderboard"
            style={{
              border: 'none',
              background: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#776e65',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>

        {entries.length === 0 ? (
          <p style={{ color: '#776e65', textAlign: 'center', margin: '24px 0' }}>
            No scores yet. Play a game!
          </p>
        ) : (
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {entries.map((entry, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: idx < entries.length - 1 ? '1px solid #d8d4c7' : 'none',
                }}
              >
                <span style={{ color: '#776e65', fontWeight: 'bold', minWidth: '32px' }}>
                  #{idx + 1}
                </span>
                <span style={{ color: '#f65e3b', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {entry.score}
                </span>
                <span style={{ color: '#bbada0', fontSize: '0.8rem' }}>
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default LeaderboardModal
