import { render, screen, fireEvent } from '@testing-library/react'
import LeaderboardModal from '../components/LeaderboardModal'
import { LeaderboardEntry } from '../types/game'

const entries: LeaderboardEntry[] = [
  { score: 1024, date: '2026-01-15T00:00:00.000Z' },
  { score: 512, date: '2026-01-16T00:00:00.000Z' },
]

describe('LeaderboardModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <LeaderboardModal isOpen={false} onClose={() => {}} entries={[]} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the modal when open', () => {
    render(<LeaderboardModal isOpen={true} onClose={() => {}} entries={[]} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
  })

  it('shows empty state when there are no entries', () => {
    render(<LeaderboardModal isOpen={true} onClose={() => {}} entries={[]} />)
    expect(screen.getByText(/No scores yet/)).toBeInTheDocument()
  })

  it('renders all entries with rank and score', () => {
    render(<LeaderboardModal isOpen={true} onClose={() => {}} entries={entries} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('1024')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('512')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn()
    render(<LeaderboardModal isOpen={true} onClose={onClose} entries={[]} />)
    fireEvent.click(screen.getByLabelText('Close leaderboard'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = jest.fn()
    render(<LeaderboardModal isOpen={true} onClose={onClose} entries={[]} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when the modal content is clicked', () => {
    const onClose = jest.fn()
    render(<LeaderboardModal isOpen={true} onClose={onClose} entries={[]} />)
    fireEvent.click(screen.getByText('Leaderboard'))
    expect(onClose).not.toHaveBeenCalled()
  })
})
