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
