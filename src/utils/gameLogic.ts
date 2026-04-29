import { Board, Direction, TileValue } from '../types/game'

export const GRID_SIZE = 4

export const createEmptyBoard = (): Board =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0) as TileValue[])

const getEmptyCells = (board: Board): [number, number][] => {
  const cells: [number, number][] = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) cells.push([r, c])
    }
  }
  return cells
}

export const addRandomTile = (board: Board): Board => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) return board
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map((row) => [...row]) as Board
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

const slideRow = (row: TileValue[]): { row: TileValue[]; score: number } => {
  const nums = row.filter((v) => v !== 0) as TileValue[]
  let score = 0
  const merged: TileValue[] = []

  let i = 0
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const val = (nums[i] * 2) as TileValue
      merged.push(val)
      score += val
      i += 2
    } else {
      merged.push(nums[i])
      i++
    }
  }

  while (merged.length < GRID_SIZE) merged.push(0)
  return { row: merged, score }
}

const rotateBoard = (board: Board): Board => {
  const n = GRID_SIZE
  const rotated = createEmptyBoard()
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = board[r][c]
    }
  }
  return rotated
}

export const moveBoard = (
  board: Board,
  direction: Direction,
): { board: Board; score: number; moved: boolean } => {
  let rotations = 0
  if (direction === 'up') rotations = 3
  else if (direction === 'right') rotations = 2
  else if (direction === 'down') rotations = 1

  let working = board
  for (let i = 0; i < rotations; i++) working = rotateBoard(working)

  let totalScore = 0
  let moved = false
  const result = working.map((row) => {
    const { row: slid, score } = slideRow(row)
    totalScore += score
    if (slid.some((v, i) => v !== row[i])) moved = true
    return slid
  })

  let finalBoard = result as Board
  const backRotations = (4 - rotations) % 4
  for (let i = 0; i < backRotations; i++) finalBoard = rotateBoard(finalBoard)

  return { board: finalBoard, score: totalScore, moved }
}

export const checkWin = (board: Board): boolean =>
  board.some((row) => row.some((v) => v === 2048))

export const checkLoss = (board: Board): boolean => {
  if (getEmptyCells(board).length > 0) return false
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const v = board[r][c]
      if (c + 1 < GRID_SIZE && board[r][c + 1] === v) return false
      if (r + 1 < GRID_SIZE && board[r + 1][c] === v) return false
    }
  }
  return true
}

export const initBoard = (): Board => {
  let board = createEmptyBoard()
  board = addRandomTile(board)
  board = addRandomTile(board)
  return board
}
