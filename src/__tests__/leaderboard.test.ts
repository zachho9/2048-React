import { loadLeaderboard, addLeaderboardEntry } from '../utils/leaderboard'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('loadLeaderboard', () => {
  beforeEach(() => localStorageMock.clear())

  it('returns empty array when nothing is stored', () => {
    expect(loadLeaderboard()).toEqual([])
  })

  it('returns stored entries', () => {
    const entries = [{ score: 100, date: '2026-01-01T00:00:00.000Z' }]
    localStorageMock.setItem('2048-leaderboard', JSON.stringify(entries))
    expect(loadLeaderboard()).toEqual(entries)
  })

  it('returns empty array on invalid JSON', () => {
    localStorageMock.setItem('2048-leaderboard', 'not-json')
    expect(loadLeaderboard()).toEqual([])
  })
})

describe('addLeaderboardEntry', () => {
  beforeEach(() => localStorageMock.clear())

  it('adds a new entry and returns it', () => {
    const entries = addLeaderboardEntry(500)
    expect(entries).toHaveLength(1)
    expect(entries[0].score).toBe(500)
    expect(entries[0].date).toBeDefined()
  })

  it('sorts entries by score descending', () => {
    addLeaderboardEntry(200)
    addLeaderboardEntry(500)
    const entries = addLeaderboardEntry(100)
    expect(entries.map((e) => e.score)).toEqual([500, 200, 100])
  })

  it('persists the result to localStorage', () => {
    addLeaderboardEntry(300)
    expect(loadLeaderboard()[0].score).toBe(300)
  })

  it('keeps at most 10 entries', () => {
    for (let i = 0; i < 12; i++) addLeaderboardEntry(i * 10)
    expect(loadLeaderboard()).toHaveLength(10)
  })

  it('retains only the highest scoring entries when trimming', () => {
    for (let i = 1; i <= 12; i++) addLeaderboardEntry(i * 100)
    const entries = loadLeaderboard()
    expect(entries[0].score).toBe(1200)
    expect(entries[9].score).toBe(300)
  })
})
