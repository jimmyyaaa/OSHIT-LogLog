import type { LogEntry } from '../types'

const STORAGE_KEY = 'loglog_entries'
const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true'
const DAY_MS = 24 * 60 * 60 * 1000

export const logService = {
  saveEntry(entry: LogEntry): void {
    const entries = this.getEntries()
    if (TEST_MODE) {
      // Each click simulates a new consecutive day, building streak naturally.
      // Entry 0 = today noon, entry 1 = yesterday noon, entry 2 = 2 days ago noon, ...
      const todayNoon = new Date()
      todayNoon.setHours(12, 0, 0, 0)
      entry = { ...entry, timestamp: todayNoon.getTime() - entries.length * DAY_MS }
    }
    entries.push(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    if (TEST_MODE) {
      window.dispatchEvent(new CustomEvent('loglog-save'))
    }
  },

  getEntries(): LogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
      return JSON.parse(raw) as LogEntry[]
    } catch {
      return []
    }
  },

  getEntriesInRange(from: number, to: number): LogEntry[] {
    return this.getEntries().filter(e => e.timestamp >= from && e.timestamp <= to)
  },
}
