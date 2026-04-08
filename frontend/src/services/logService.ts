import type { LogEntry } from '../types'

const STORAGE_KEY = 'loglog_entries'

export const logService = {
  saveEntry(entry: LogEntry): void {
    const entries = this.getEntries()
    entries.push(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
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
