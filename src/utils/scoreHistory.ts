import { LeaderboardEntry } from '../types/game'

const KEY = '2048-score-history'

export const loadScoreHistory = (): LeaderboardEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as LeaderboardEntry[]
  } catch {
    return []
  }
}

export const addScoreHistoryEntry = (score: number): LeaderboardEntry[] => {
  const entries = loadScoreHistory()
  const updated = [{ score, date: new Date().toISOString() }, ...entries]
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable
  }
  return updated
}
