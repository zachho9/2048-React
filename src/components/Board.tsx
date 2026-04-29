import { Board as BoardType } from '../types/game'
import Tile from './Tile'

interface BoardProps {
  board: BoardType
}

const Board = ({ board }: BoardProps) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
      backgroundColor: '#bbada0',
      borderRadius: '8px',
      padding: '12px',
      width: '100%',
      maxWidth: '480px',
      aspectRatio: '1 / 1',
      boxSizing: 'border-box',
    }}
  >
    {board.flat().map((value, idx) => (
      <Tile key={idx} value={value} />
    ))}
  </div>
)

export default Board
