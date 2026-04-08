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

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function Calendar() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()

  const { daysInMonth, firstDayOfWeek, dayMap } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    const monthStart = new Date(year, month, 1).getTime()
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59).getTime()
    const entries = logService.getEntriesInRange(monthStart, monthEnd)

    const dayMap: Record<number, ShapeType> = {}
    for (const e of entries) {
      const d = new Date(e.timestamp).getDate()
      if (!dayMap[d]) dayMap[d] = e.shape
    }
    return { daysInMonth, firstDayOfWeek, dayMap }
  }, [year, month])

  const monthLabel = `${year}年${month + 1}月`

  return (
    <div className="px-5 pb-8">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-black text-[#272727] text-base">{monthLabel}</p>
        <p className="text-xs text-[#aaa] font-medium">
          本月已记录 {Object.keys(dayMap).length} 天
        </p>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[#ccc] py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1
          const shape = dayMap[date]
          const isToday = date === todayDate
          const isPast = date < todayDate

          return (
            <div key={date} className="flex items-center justify-center h-9">
              {shape ? (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isToday ? 'ring-2 ring-[#FFD73B] ring-offset-1' : ''
                }`}>
                  <span className="text-lg leading-none">{SHAPE_EMOJI[shape]}</span>
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  isToday
                    ? 'bg-[#FFD73B] text-[#272727] shadow-[0_2px_8px_rgba(255,215,59,0.5)]'
                    : isPast
                    ? 'text-[#ddd]'
                    : 'text-[#bbb]'
                }`}>
                  {date}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
