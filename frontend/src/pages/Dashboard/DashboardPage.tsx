import { useMemo } from 'react'
import { useLogContext } from '../../context/LogContext'
import MetricCard from '../../components/MetricCard/MetricCard'
import SmoothnessGauge from '../../components/Dashboard/SmoothnessGauge'
import BananaBroProgress from '../../components/Dashboard/BananaBroProgress'
import StreakBadge from '../../components/Dashboard/StreakBadge'

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function DashboardPage() {
  const { entries } = useLogContext()

  const { smoothness, prevSmoothness, bananaRate, streak } = useMemo(() => {
    const now = new Date()

    const thisMonday = getMonday(now)
    const thisSunday = new Date(thisMonday)
    thisSunday.setDate(thisSunday.getDate() + 6)
    thisSunday.setHours(23, 59, 59, 999)

    const prevMonday = new Date(thisMonday)
    prevMonday.setDate(prevMonday.getDate() - 7)
    const prevSunday = new Date(thisMonday)
    prevSunday.setMilliseconds(-1)

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    const inRange = (ts: string, from: Date, to: Date) => {
      const d = new Date(ts)
      return d >= from && d <= to
    }

    const weekEntries = entries.filter((e) => inRange(e.timestamp, thisMonday, thisSunday))
    const prevWeekEntries = entries.filter((e) => inRange(e.timestamp, prevMonday, prevSunday))
    const monthEntries = entries.filter((e) => inRange(e.timestamp, monthStart, monthEnd))

    const calcSmoothness = (arr: typeof entries) => {
      if (arr.length === 0) return null
      return Math.round((arr.filter((e) => e.shape === 'banana_bro').length / arr.length) * 100)
    }

    let streakCount = 0
    const date = new Date(now)
    date.setHours(0, 0, 0, 0)
    while (true) {
      const dayStr = date.toISOString().slice(0, 10)
      const hasEntry = entries.some((e) => e.timestamp.slice(0, 10) === dayStr)
      if (hasEntry) {
        streakCount++
        date.setDate(date.getDate() - 1)
      } else {
        break
      }
    }

    return {
      smoothness: calcSmoothness(weekEntries),
      prevSmoothness: calcSmoothness(prevWeekEntries),
      bananaRate: monthEntries.length > 0
        ? Math.round((monthEntries.filter((e) => e.shape === 'banana_bro').length / monthEntries.length) * 100)
        : null,
      streak: streakCount,
    }
  }, [entries])

  const trend =
    smoothness === null || prevSmoothness === null
      ? undefined
      : smoothness > prevSmoothness
        ? ('up' as const)
        : smoothness < prevSmoothness
          ? ('down' as const)
          : ('flat' as const)

  return (
    <div className="px-5 pt-12">
      <h1 className="font-display text-[34px] font-bold leading-[1.07] tracking-[-0.28px]">
        健康面板
      </h1>
      <p className="mt-1 text-[14px] tracking-[-0.224px] text-text-tertiary">
        你的健康数据一目了然
      </p>

      <div className="mt-6 grid gap-3">
        <MetricCard title="本周顺畅指数">
          <SmoothnessGauge value={smoothness} trend={trend} />
        </MetricCard>
        <MetricCard title="本月香蕉君比例">
          <BananaBroProgress value={bananaRate} />
        </MetricCard>
        <MetricCard title="连续记录">
          <StreakBadge days={streak} />
        </MetricCard>
      </div>
    </div>
  )
}
