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
            key={`${entry.score}-${entry.date}`}
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
            <span data-testid={`date-${idx}`} style={{ color: '#eee4da', fontSize: '0.7rem' }}>
              {formatDate(entry.date)}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
)

export default ScoreHistoryPanel
