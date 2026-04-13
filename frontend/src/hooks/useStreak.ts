import type { LogEntry } from '../types'

export function computeStreak(entries: LogEntry[]): number {
  if (entries.length === 0) return 0

  const loggedDates = new Set(
    entries.map((e) => new Date(e.timestamp).toISOString().slice(0, 10))
  )

  let streak = 0
  const date = new Date()

  while (true) {
    const key = date.toISOString().slice(0, 10)
    if (loggedDates.has(key)) {
      streak++
      date.setDate(date.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
