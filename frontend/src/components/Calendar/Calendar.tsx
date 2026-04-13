import { useMemo } from 'react'
import type { LogEntry } from '../../types'

interface CalendarProps {
  entries: LogEntry[]
  year?: number
  month?: number
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export default function Calendar({ entries, year, month }: CalendarProps) {
  const now = new Date()
  const displayYear = year ?? now.getFullYear()
  const displayMonth = month ?? now.getMonth()

  const { startOffset, daysInMonth, loggedDays } = useMemo(() => {
    const firstDay = new Date(displayYear, displayMonth, 1).getDay()
    const offset = (firstDay + 6) % 7
    const total = new Date(displayYear, displayMonth + 1, 0).getDate()

    const logged = new Set(
      entries
        .filter((e) => {
          const d = new Date(e.timestamp)
          return d.getFullYear() === displayYear && d.getMonth() === displayMonth
        })
        .map((e) => new Date(e.timestamp).getDate())
    )

    return { startOffset: offset, daysInMonth: total, loggedDays: logged }
  }, [entries, displayYear, displayMonth])

  const monthLabel = `${displayYear}年${displayMonth + 1}月`

  return (
    <div className="rounded-large bg-white p-5">
      <h3 className="font-display text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
        {monthLabel}
      </h3>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-2 text-[12px] tracking-[-0.12px] text-text-tertiary">
            {d}
          </span>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isToday =
            day === now.getDate() &&
            displayMonth === now.getMonth() &&
            displayYear === now.getFullYear()
          const hasLog = loggedDays.has(day)

          return (
            <span
              key={day}
              className={`relative flex h-9 items-center justify-center rounded-full text-[14px] tracking-[-0.224px] ${
                isToday
                  ? 'bg-apple-blue font-semibold text-white'
                  : hasLog
                    ? 'font-semibold text-near-black'
                    : 'text-text-secondary'
              }`}
            >
              {day}
              {hasLog && !isToday && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-apple-blue" />
              )}
              {hasLog && isToday && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-white" />
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
