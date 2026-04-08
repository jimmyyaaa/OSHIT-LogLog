import { useMemo } from 'react'
import { logService } from '../services/logService'

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function useLogStats() {
  return useMemo(() => {
    const now = Date.now()
    const todayStart = startOfDay(new Date())

    // Past 7 days
    const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000
    const weekEntries = logService.getEntriesInRange(weekStart, now)
    const weekIdeal = weekEntries.filter(e => e.shape === 'banana_bro').length
    const weekSmoothnessIndex = weekEntries.length > 0
      ? Math.round((weekIdeal / weekEntries.length) * 100)
      : null

    // Previous 7 days (for trend arrow)
    const prevWeekStart = weekStart - 7 * 24 * 60 * 60 * 1000
    const prevWeekEntries = logService.getEntriesInRange(prevWeekStart, weekStart - 1)
    const prevWeekIdeal = prevWeekEntries.filter(e => e.shape === 'banana_bro').length
    const prevSmoothnessIndex = prevWeekEntries.length > 0
      ? Math.round((prevWeekIdeal / prevWeekEntries.length) * 100)
      : null

    const trend: '↑' | '↓' | '→' =
      weekSmoothnessIndex === null || prevSmoothnessIndex === null ? '→'
      : weekSmoothnessIndex > prevSmoothnessIndex ? '↑'
      : weekSmoothnessIndex < prevSmoothnessIndex ? '↓'
      : '→'

    // Current month
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const monthEntries = logService.getEntriesInRange(monthStart.getTime(), now)
    const monthIdeal = monthEntries.filter(e => e.shape === 'banana_bro').length
    const monthBananaBroRate = monthEntries.length > 0
      ? Math.round((monthIdeal / monthEntries.length) * 100)
      : 0

    // Streak
    let streak = 0
    let cursor = todayStart
    while (true) {
      const dayEntries = logService.getEntriesInRange(cursor, cursor + 24 * 60 * 60 * 1000 - 1)
      if (dayEntries.length > 0) {
        streak++
        cursor -= 24 * 60 * 60 * 1000
      } else {
        break
      }
    }

    // Today logged
    const todayLogged = logService.getEntriesInRange(todayStart, now).length > 0

    return { weekSmoothnessIndex, trend, monthBananaBroRate, streak, todayLogged }
  }, [])
}
