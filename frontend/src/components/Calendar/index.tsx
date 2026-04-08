import { useMemo } from 'react'
import type { ShapeType } from '../../types'
import { logService } from '../../services/logService'

const SHAPE_EMOJI: Record<ShapeType, string> = {
  banana_bro:     '🟠',
  rabbit_pellets: '🟤',
  twisted_rope:   '🟤',
  soft_serve:     '🟢',
  splash_zone:    '🟢',
}

export function Calendar() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const days = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    const monthStart = new Date(year, month, 1).getTime()
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59).getTime()
    const entries = logService.getEntriesInRange(monthStart, monthEnd)

    const dayMap: Record<number, ShapeType> = {}
    for (const entry of entries) {
      const d = new Date(entry.timestamp).getDate()
      if (!dayMap[d]) dayMap[d] = entry.shape
    }

    return { daysInMonth, firstDayOfWeek, dayMap }
  }, [year, month])

  const todayDate = today.getDate()

  return (
    <div className="px-5 pb-8">
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#898989] font-medium mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: days.firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: days.daysInMonth }).map((_, i) => {
          const date = i + 1
          const shape = days.dayMap[date]
          const isToday = date === todayDate
          return (
            <div
              key={date}
              className={`flex flex-col items-center justify-center h-8 rounded-lg text-xs font-medium ${
                isToday ? 'bg-[#fffbee] border border-[#FFD73B]' : ''
              }`}
            >
              {shape ? (
                <span className="text-base leading-none">{SHAPE_EMOJI[shape]}</span>
              ) : (
                <span className={isToday ? 'text-[#F47900] font-black' : 'text-[#898989]'}>
                  {date}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
