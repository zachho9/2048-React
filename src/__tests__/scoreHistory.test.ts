import { loadScoreHistory, addScoreHistoryEntry } from '../utils/scoreHistory'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('loadScoreHistory', () => {
  beforeEach(() => localStorageMock.clear())

  it('returns empty array when nothing is stored', () => {
    expect(loadScoreHistory()).toEqual([])
  })

  it('returns stored entries', () => {
    const entries = [{ score: 100, date: '2026-01-01T00:00:00.000Z' }]
    localStorageMock.setItem('2048-score-history', JSON.stringify(entries))
    expect(loadScoreHistory()).toEqual(entries)
  })

  it('returns empty array on invalid JSON', () => {
    localStorageMock.setItem('2048-score-history', 'not-json')
    expect(loadScoreHistory()).toEqual([])
  })
})

describe('addScoreHistoryEntry', () => {
  beforeEach(() => localStorageMock.clear())

  it('adds a new entry and returns it', () => {
    const entries = addScoreHistoryEntry(500)
    expect(entries).toHaveLength(1)
    expect(entries[0].score).toBe(500)
    expect(entries[0].date).toBeDefined()
  })

  it('prepends new entries so newest is first', () => {
    addScoreHistoryEntry(100)
    addScoreHistoryEntry(200)
    const entries = addScoreHistoryEntry(50)
    expect(entries.map((e) => e.score)).toEqual([50, 200, 100])
  })

  it('does not sort by score — lower score added later appears first', () => {
    addScoreHistoryEntry(500)
    const entries = addScoreHistoryEntry(100)
    expect(entries[0].score).toBe(100)
    expect(entries[1].score).toBe(500)
  })

  it('persists entries to localStorage', () => {
    addScoreHistoryEntry(300)
    expect(loadScoreHistory()[0].score).toBe(300)
  })

  it('keeps all entries without trimming', () => {
    for (let i = 0; i < 15; i++) addScoreHistoryEntry(i * 10)
    expect(loadScoreHistory()).toHaveLength(15)
  })
})
