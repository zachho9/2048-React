import { moveBoard, checkWin, checkLoss, addRandomTile, createEmptyBoard } from '../utils/gameLogic'
import { Board } from '../types/game'

const b = (rows: number[][]): Board => rows as Board

describe('moveBoard – left', () => {
  it('slides tiles to the left', () => {
    const { board, moved } = moveBoard(b([[0, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'left')
    expect(board[0][0]).toBe(2)
    expect(moved).toBe(true)
  })

  it('merges matching tiles', () => {
    const { board, score } = moveBoard(b([[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'left')
    expect(board[0][0]).toBe(4)
    expect(board[0][1]).toBe(0)
    expect(score).toBe(4)
  })

  it('does not merge a tile twice in one move', () => {
    const { board } = moveBoard(b([[2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'left')
    expect(board[0]).toEqual([4, 4, 0, 0])
  })

  it('reports not moved when no change', () => {
    const { moved } = moveBoard(b([[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'left')
    expect(moved).toBe(false)
  })
})

describe('moveBoard – right', () => {
  it('slides tiles to the right', () => {
    const { board } = moveBoard(b([[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'right')
    expect(board[0][3]).toBe(2)
  })

  it('merges matching tiles', () => {
    const { board, score } = moveBoard(b([[0, 0, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'right')
    expect(board[0][3]).toBe(4)
    expect(score).toBe(4)
  })
})

describe('moveBoard – up', () => {
  it('slides tiles upward', () => {
    const { board } = moveBoard(b([[0, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'up')
    expect(board[0][0]).toBe(2)
  })
})

describe('moveBoard – down', () => {
  it('slides tiles downward', () => {
    const { board } = moveBoard(b([[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'down')
    expect(board[3][0]).toBe(2)
  })
})

describe('checkWin', () => {
  it('returns true when 2048 tile is present', () => {
    const board = createEmptyBoard()
    board[0][0] = 2048
    expect(checkWin(board)).toBe(true)
  })

  it('returns false when no 2048 tile', () => {
    expect(checkWin(createEmptyBoard())).toBe(false)
  })
})

describe('checkLoss', () => {
  it('returns false when empty cells exist', () => {
    expect(checkLoss(createEmptyBoard())).toBe(false)
  })

  it('returns true when board is full with no merges available', () => {
    const board = b([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ])
    expect(checkLoss(board)).toBe(true)
  })

  it('returns false when a merge is still possible', () => {
    const board = b([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 4],
    ])
    expect(checkLoss(board)).toBe(false)
  })
})

describe('addRandomTile', () => {
  it('adds a 2 or 4 to an empty cell', () => {
    const board = createEmptyBoard()
    const next = addRandomTile(board)
    const filled = next.flat().filter((v) => v !== 0)
    expect(filled.length).toBe(1)
    expect([2, 4]).toContain(filled[0])
  })

  it('returns the same board when no empty cells', () => {
    const board = b([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ])
    expect(addRandomTile(board)).toBe(board)
  })
})
