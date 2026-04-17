import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogContext } from '../../context/LogContext'
import ReportModal from '../../components/Report/ReportModal'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export default function ProfilePage() {
  const navigate = useNavigate()
  const { entries } = useLogContext()
  const [reportOpen, setReportOpen] = useState(false)

  const { memberDays, totalPoints, streak, consistency } = useMemo(() => {
    if (entries.length === 0) return { memberDays: 0, totalPoints: 0, streak: 0, consistency: 0 }

    const sorted = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const firstEntry = new Date(sorted[0].timestamp)
    const now = new Date()
    const days = Math.floor((now.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Points
    let points = 0
    const loggedDates = new Set<string>()
    let hasLoggedBanana = false
    for (const entry of sorted) {
      const dateStr = new Date(entry.timestamp).toISOString().slice(0, 10)
      const isFirstOfDay = !loggedDates.has(dateStr)
      if (isFirstOfDay) {
        loggedDates.add(dateStr)
        points += 1
        let s = 0
        const d = new Date(dateStr)
        while (true) {
          if (loggedDates.has(d.toISOString().slice(0, 10))) { s++; d.setDate(d.getDate() - 1) } else break
        }
        if (s === 3) points += 3
        if (s === 7) points += 7
        if (s === 30) points += 30
      }
      if (entry.shape === 'banana_bro' && !hasLoggedBanana) { hasLoggedBanana = true; points += 5 }
    }

    // Streak
    let streakCount = 0
    const d = new Date()
    while (loggedDates.has(d.toISOString().slice(0, 10))) { streakCount++; d.setDate(d.getDate() - 1) }

    // Consistency
    const consistencyPct = days > 0 ? Math.round((loggedDates.size / days) * 100) : 0

    return { memberDays: days, totalPoints: points, streak: streakCount, consistency: consistencyPct }
  }, [entries])

  // Calendar data
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDate = now.getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const trailingDays = Array.from({ length: startOffset }, (_, i) => prevMonthDays - startOffset + 1 + i)

  const loggedDays = useMemo(() => {
    return new Set(
      entries
        .filter((e) => { const d = new Date(e.timestamp); return d.getFullYear() === year && d.getMonth() === month })
        .map((e) => new Date(e.timestamp).getDate())
    )
  }, [entries, year, month])

  const monthLabel = `${year}年${month + 1}月`

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface font-body text-on-surface">
      {/* Decorative blurs */}
      <div className="pointer-events-none fixed -bottom-24 -left-24 -z-10 h-64 w-64 rounded-full bg-primary-container/20 blur-[80px]" />
      <div className="pointer-events-none fixed -right-12 top-24 -z-10 h-48 w-48 rounded-full bg-tertiary-container/10 blur-[60px]" />

      {/* Top App Bar - same as HomePage: px-8 py-4 */}
      <header className="shrink-0 flex w-full items-center justify-between rounded-b-large bg-surface/70 px-8 py-4 shadow-[0_12px_32px_rgba(61,57,5,0.06)] backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-container-high transition-colors hover:bg-surface-container-highest active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <span className="text-2xl font-bold tracking-tight text-on-surface font-display">LogLog</span>
        </div>
      </header>

      {/* Main content - fixed, no scroll */}
      <main className="flex-1 overflow-hidden px-6 py-4">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">

          {/* Stats bento */}
          <section className="shrink-0 grid grid-cols-2 gap-3">
            {/* Weekly streak - large */}
            <div className="col-span-2 flex flex-col items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary-container to-primary-fixed-dim p-5 shadow-[0_20px_40px_rgba(255,215,9,0.2)]">
              <span className="mb-1 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-on-primary-container/60">
                Weekly Streak
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tighter text-on-primary-container">{streak}</span>
                <span className="text-lg font-bold text-on-primary-container">Days</span>
              </div>
            </div>

            {/* SHIT Points */}
            <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white/70 p-4 shadow-[0_12px_32px_rgba(61,57,5,0.08)] backdrop-blur-3xl">
              <span className="material-symbols-outlined mb-1 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="text-xl font-bold text-on-surface">{totalPoints}</span>
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant">SHIT Points</span>
            </div>

            {/* Consistency */}
            <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white/70 p-4 shadow-[0_12px_32px_rgba(61,57,5,0.08)] backdrop-blur-3xl">
              <span className="material-symbols-outlined mb-1 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <span className="text-xl font-bold text-on-surface">{consistency}%</span>
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant">Consistency</span>
            </div>
          </section>

          {/* Calendar - takes remaining space */}
          <section className="shrink-0 rounded-[2rem] bg-white/70 p-5 shadow-[0_16px_48px_rgba(61,57,5,0.1)] backdrop-blur-3xl">
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h2 className="font-display text-base font-bold text-on-surface">Monthly Rhythm</h2>
              <span className="text-sm font-bold text-on-surface">{monthLabel}</span>
            </div>

            <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
              {WEEKDAYS.map((d) => (
                <div key={d} className="mb-1 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{d}</div>
              ))}

              {trailingDays.map((d) => (
                <div key={`prev-${d}`} className="flex h-8 w-8 items-center justify-center text-xs text-on-surface-variant/40 mx-auto">{d}</div>
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const isToday = day === todayDate
                const hasLog = loggedDays.has(day)

                let cls = 'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium mx-auto '
                if (isToday && hasLog) cls += 'bg-primary-container text-on-primary-container font-bold ring-3 ring-primary-container/20'
                else if (isToday) cls += 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                else if (hasLog) cls += 'bg-primary-container/30'

                return <div key={day} className={cls}>{day}</div>
              })}
            </div>

            <div className="mt-2 flex shrink-0 items-center gap-5 border-t border-on-surface/5 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary-container" />
                <span className="text-[10px] font-bold text-on-surface-variant">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary-container/30" />
                <span className="text-[10px] font-bold text-on-surface-variant">Recorded</span>
              </div>
            </div>
          </section>

          {/* Generate Report CTA */}
          <button
            onClick={() => setReportOpen(true)}
            className="shrink-0 flex w-full items-center justify-center gap-3 rounded-xl bg-primary-container py-4 text-base font-extrabold text-on-primary-container shadow-[0_12px_24px_rgba(255,215,9,0.3)] transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">analytics</span>
            生成周报
          </button>

        </div>
      </main>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} entries={entries} />
    </div>
  )
}
