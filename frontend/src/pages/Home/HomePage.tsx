import { useState, useCallback, useMemo } from 'react'
import { useLogContext } from '../../context/LogContext'
import type { CreateLogPayload } from '../../types'
import Calendar from '../../components/Calendar/Calendar'
import LogSheet from '../../components/LogSheet/LogSheet'
import RewardModal from '../../components/RewardModal/RewardModal'

export default function HomePage() {
  const { entries, addEntry } = useLogContext()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [rewards, setRewards] = useState<string[]>([])
  const [rewardIndex, setRewardIndex] = useState(0)

  const hasLoggedToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return entries.some((e) => e.timestamp.slice(0, 10) === today)
  }, [entries])

  const computeRewards = useCallback(
    (payload: CreateLogPayload) => {
      const earned: string[] = []
      const today = new Date().toISOString().slice(0, 10)
      const isFirstToday = !entries.some((e) => e.timestamp.slice(0, 10) === today)

      if (isFirstToday) {
        earned.push('+1 SHIT Point')

        // Streak (including today)
        const loggedDates = new Set(entries.map((e) => e.timestamp.slice(0, 10)))
        loggedDates.add(today)
        let streak = 0
        const d = new Date()
        while (true) {
          if (loggedDates.has(d.toISOString().slice(0, 10))) {
            streak++
            d.setDate(d.getDate() - 1)
          } else break
        }
        if (streak === 3) earned.push('+3 SHIT Point')
        if (streak === 7) earned.push('+7 SHIT Point')
        if (streak === 30) earned.push('+30 SHIT Point')
      }

      if (
        payload.shape === 'banana_bro' &&
        !entries.some((e) => e.shape === 'banana_bro')
      ) {
        earned.push('+5 SHIT Point')
      }

      return earned
    },
    [entries]
  )

  const handleSubmit = useCallback(
    (payload: CreateLogPayload) => {
      const earned = computeRewards(payload)
      addEntry(payload)
      setSheetOpen(false)

      if (earned.length > 0) {
        setRewards(earned)
        setRewardIndex(0)
      }
    },
    [addEntry, computeRewards]
  )

  return (
    <div className="px-5 pt-12">
      {/* Large title */}
      <h1 className="font-display text-[34px] font-bold leading-[1.07] tracking-[-0.28px]">
        LogLog
      </h1>

      {/* Action button */}
      <div className="flex flex-col items-center py-14">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex h-40 w-40 items-center justify-center rounded-full bg-apple-blue text-center shadow-[rgba(0,0,0,0.08)_0px_4px_20px_0px] transition-transform active:scale-95 animate-pulse-ring"
        >
          <span className="px-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-white">
            {hasLoggedToday ? '再来一次！' : '记录一下！'}
          </span>
        </button>
        <p className="mt-5 text-[14px] tracking-[-0.224px] text-text-tertiary">
          {entries.length === 0
            ? '开始你的第一次记录'
            : `已累计记录 ${entries.length} 次`}
        </p>
      </div>

      {/* Calendar */}
      <Calendar entries={entries} />

      <LogSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleSubmit}
      />

      <RewardModal
        rewards={rewards}
        currentIndex={rewardIndex}
        onDismiss={() => setRewardIndex((i) => i + 1)}
      />
    </div>
  )
}
