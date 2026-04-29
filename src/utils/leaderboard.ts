import { LeaderboardEntry } from '../types/game'

const KEY = '2048-leaderboard'
const MAX_ENTRIES = 10

export const loadLeaderboard = (): LeaderboardEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as LeaderboardEntry[]
  } catch {
    return []
  }
}

export const addLeaderboardEntry = (score: number): LeaderboardEntry[] => {
  const entries = loadLeaderboard()
  const updated = [...entries, { score, date: new Date().toISOString() }]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable
  }
  return updated
}
