import { useCallback, useEffect, useState } from 'react'
import { GameState, Direction } from '../types/game'
import { initBoard, moveBoard, addRandomTile, checkWin, checkLoss } from '../utils/gameLogic'

const BEST_SCORE_KEY = '2048-best-score'

const loadBestScore = (): number => {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10) || 0
  } catch {
    return 0
  }
}

const saveBestScore = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score))
  } catch {
    // localStorage unavailable
  }
}

const createInitialState = (): GameState => ({
  board: initBoard(),
  score: 0,
  bestScore: loadBestScore(),
  status: 'playing',
})

export const useGame = () => {
  const [state, setState] = useState<GameState>(createInitialState)

  const move = useCallback((direction: Direction) => {
    setState((prev) => {
      if (prev.status === 'lost' || prev.status === 'idle') return prev

      const { board, score: gained, moved } = moveBoard(prev.board, direction)
      if (!moved) return prev

      const newBoard = addRandomTile(board)
      const newScore = prev.score + gained
      const newBest = Math.max(prev.bestScore, newScore)

      if (newBest > prev.bestScore) saveBestScore(newBest)

      const won = prev.status !== 'won' && checkWin(newBoard)
      const lost = !won && checkLoss(newBoard)

      return {
        board: newBoard,
        score: newScore,
        bestScore: newBest,
        status: won ? 'won' : lost ? 'lost' : 'playing',
      }
    })
  }, [])

  const restart = useCallback(() => {
    setState((prev) => ({
      ...createInitialState(),
      bestScore: prev.bestScore,
    }))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      }
      const dir = map[e.key]
      if (dir) {
        e.preventDefault()
        move(dir)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  return { state, move, restart }
}
