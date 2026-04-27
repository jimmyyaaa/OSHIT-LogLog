import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogContext } from '../../context/LogContext'
import { SHAPES, FEELINGS, PLACES, getPersona } from '../../data/shitData'
import type { ShapeType, FeelingType, LocationType } from '../../types'

const PF_GOLD = '#ffd709'
const PF_GOLD_DEEP = '#ffb000'
const PF_INK = '#3d3905'
const PF_ON_GOLD = '#5b4b00'
const PF_CREAM = '#fffae1'

const WEEKDAYS_CN = ['一', '二', '三', '四', '五', '六', '日']

export default function ProfilePage() {
  const navigate = useNavigate()
  const { entries } = useLogContext()

  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        memberDays: 0, totalPoints: 0, streak: 0, consistency: 0, totalLogs: 0,
        topShape: null as ShapeType | null,
        topFeeling: null as FeelingType | null,
        topPlace: null as LocationType | null,
        timeBuckets: [0, 0, 0, 0, 0],
      }
    }

    const sorted = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const firstEntry = new Date(sorted[0].timestamp)
    const now = new Date()
    const days = Math.floor((now.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24)) + 1

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
        while (loggedDates.has(d.toISOString().slice(0, 10))) { s++; d.setDate(d.getDate() - 1) }
        if (s === 3) points += 3
        if (s === 7) points += 7
        if (s === 30) points += 30
      }
      if (entry.shape === 'type_ideal' && !hasLoggedBanana) { hasLoggedBanana = true; points += 5 }
    }

    let streakCount = 0
    const d = new Date()
    while (loggedDates.has(d.toISOString().slice(0, 10))) { streakCount++; d.setDate(d.getDate() - 1) }

    const consistencyPct = days > 0 ? Math.round((loggedDates.size / days) * 100) : 0

    const shapeCounts: Record<string, number> = {}
    const feelingCounts: Record<string, number> = {}
    const placeCounts: Record<string, number> = {}
    const timeBuckets = [0, 0, 0, 0, 0]
    for (const e of entries) {
      shapeCounts[e.shape] = (shapeCounts[e.shape] || 0) + 1
      if (e.feeling) feelingCounts[e.feeling] = (feelingCounts[e.feeling] || 0) + 1
      if (e.location) placeCounts[e.location] = (placeCounts[e.location] || 0) + 1
      const hour = new Date(e.timestamp).getHours()
      if (hour >= 5 && hour < 9) timeBuckets[0]++
      else if (hour >= 9 && hour < 12) timeBuckets[1]++
      else if (hour >= 12 && hour < 18) timeBuckets[2]++
      else if (hour >= 18 && hour < 22) timeBuckets[3]++
      else timeBuckets[4]++
    }
    const topOf = <T extends string>(counts: Record<string, number>): T | null => {
      const pair = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
      return pair ? (pair[0] as T) : null
    }

    return {
      memberDays: days, totalPoints: points, streak: streakCount,
      consistency: consistencyPct, totalLogs: entries.length,
      topShape: topOf<ShapeType>(shapeCounts),
      topFeeling: topOf<FeelingType>(feelingCounts),
      topPlace: topOf<LocationType>(placeCounts),
      timeBuckets,
    }
  }, [entries])

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDate = now.getDate()
  const monthLabel = `${year}年${month + 1}月`

  const loggedDays = useMemo(() => {
    return new Set(
      entries
        .filter((e) => { const d = new Date(e.timestamp); return d.getFullYear() === year && d.getMonth() === month })
        .map((e) => new Date(e.timestamp).getDate())
    )
  }, [entries, year, month])

  const persona = stats.topShape ? getPersona(stats.topShape, stats.topFeeling) : null
  const personaEmoji = stats.topShape ? SHAPES.find((s) => s.code === stats.topShape)?.icon : '🍌'
  const topShapeIcon = stats.topShape ? SHAPES.find((s) => s.code === stats.topShape)?.icon : null
  const topFeelingIcon = stats.topFeeling ? FEELINGS.find((f) => f.code === stats.topFeeling)?.icon : null
  const topPlaceIcon = stats.topPlace ? PLACES.find((p) => p.code === stats.topPlace)?.icon : null

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, ${PF_GOLD}18 0%, transparent 45%),
          linear-gradient(180deg, #fffbff 0%, ${PF_CREAM} 100%)`,
        fontFamily: 'Nunito, sans-serif',
        color: PF_INK,
      }}
    >
      {/* Header - keep back button style consistent with previous versions */}
      <div className="shrink-0 flex items-center gap-3 px-6 pt-12 pb-2">
        <button
          onClick={() => navigate('/')}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <span className="material-symbols-outlined" style={{ color: PF_INK, fontSize: 22 }}>arrow_back</span>
        </button>
        <h1 className="text-[22px] font-black tracking-tight" style={{ color: PF_INK }}>我的档案</h1>
      </div>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto px-[18px] pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto w-full max-w-md pt-2">

          {/* Personality Card — hero */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: 26,
              padding: '20px 22px 18px',
              background: `linear-gradient(145deg, ${PF_GOLD} 0%, ${PF_GOLD_DEEP} 100%)`,
              boxShadow: `0 16px 40px ${PF_GOLD}55`,
              marginBottom: 12,
            }}
          >
            <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -15, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.25em', color: PF_ON_GOLD, opacity: 0.6 }}>综合屎格</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: PF_ON_GOLD, marginTop: 2, letterSpacing: '-0.02em' }}>
                    {persona?.nick || '待定屎神'}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: PF_ON_GOLD, opacity: 0.55, marginTop: 1 }}>
                    {persona?.en || 'UNCHARTED'}
                  </div>
                </div>
                <div style={{ fontSize: 50, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(91,75,0,0.2))' }}>
                  {personaEmoji}
                </div>
              </div>
              <div style={{
                marginTop: 10, padding: '8px 12px', borderRadius: 12,
                background: 'rgba(91,75,0,0.12)',
                fontSize: 11, fontWeight: 700, color: PF_ON_GOLD, lineHeight: 1.5,
              }}>
                "{persona?.tagline || '再记录几次，我来给你算屎格。'}"
              </div>
              {(topShapeIcon || topFeelingIcon || topPlaceIcon) ? (
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {topShapeIcon && <Pill>{topShapeIcon} 最常形状</Pill>}
                  {topFeelingIcon && <Pill>{topFeelingIcon} 最常感受</Pill>}
                  {topPlaceIcon && <Pill>{topPlaceIcon} 最常地点</Pill>}
                </div>
              ) : (
                <div style={{ marginTop: 10 }}>
                  <Pill>记录一次，我来给你计算</Pill>
                </div>
              )}
            </div>
          </div>

          {/* Stats row — 3 items */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <StatTile value={stats.streak} label="🔥 连续" />
            <StatTile value={stats.totalPoints} label="⭐ 积分" />
            <StatTile value={stats.consistency} label="📊 坚持" suffix="%" />
          </div>

          {/* Achievements */}
          <div style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: 22,
            padding: '14px 16px',
            boxShadow: '0 6px 20px rgba(61,57,5,0.05)',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 10 }}>成就徽章</div>
            <div className="flex justify-between">
              <Badge icon="🔥" name="三连击" unlocked={stats.streak >= 3} delay={100} />
              <Badge icon="🏅" name="周冠军" unlocked={stats.streak >= 7} delay={200} />
              <Badge icon="🍌" name="香蕉初体验" unlocked={entries.some((e) => e.shape === 'type_ideal')} delay={300} />
              <Badge icon="🌙" name="深夜战士" unlocked={stats.timeBuckets[4] >= 1} delay={400} />
              <Badge icon="🏆" name="月满贯" unlocked={loggedDays.size >= daysInMonth} delay={500} />
            </div>
          </div>

          {/* Swipeable card */}
          <SwipeCard
            timeBuckets={stats.timeBuckets}
            loggedDays={loggedDays}
            todayDate={todayDate}
            daysInMonth={daysInMonth}
            startOffset={startOffset}
            monthLabel={monthLabel}
          />
        </div>
      </main>
    </div>
  )
}

/* ───── Pill ───── */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '5px 10px', borderRadius: 10,
      background: 'rgba(255,255,255,0.35)',
      fontSize: 10, fontWeight: 800, color: PF_ON_GOLD,
    }}>
      {children}
    </div>
  )
}

/* ───── Stat Tile ───── */

function StatTile({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(16px)',
      borderRadius: 20,
      padding: '14px 8px',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(61,57,5,0.05)',
    }}>
      <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1, color: PF_INK }}>
        <AnimNum value={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.15em', color: PF_ON_GOLD, opacity: 0.5, marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

/* ───── Animated Counter ───── */

function AnimNum({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = 0
    const end = value
    const duration = 800
    const startTime = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(start + (end - start) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{display}{suffix}</>
}

/* ───── Badge ───── */

function Badge({ icon, name, unlocked, delay = 0 }: { icon: string; name: string; unlocked: boolean; delay?: number }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(10px)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 16,
        background: unlocked
          ? `linear-gradient(135deg, ${PF_CREAM} 0%, ${PF_GOLD}66 100%)`
          : 'rgba(61,57,5,0.06)',
        border: unlocked ? `2px solid ${PF_GOLD}` : '2px solid rgba(61,57,5,0.08)',
        boxShadow: unlocked ? `0 6px 16px ${PF_GOLD}33` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
        filter: unlocked ? 'none' : 'grayscale(1) opacity(0.35)',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 8, fontWeight: 800, color: unlocked ? PF_ON_GOLD : 'rgba(61,57,5,0.25)',
        letterSpacing: '0.05em', textAlign: 'center', maxWidth: 56,
      }}>
        {name}
      </span>
    </div>
  )
}

/* ───── Time Bar ───── */

function TimeBar({ label, value, max, color, delay = 0 }: { label: string; value: number; max: number; color: string; delay?: number }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(max > 0 ? (value / max) * 100 : 0), delay)
    return () => clearTimeout(t)
  }, [value, max, delay])
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: PF_ON_GOLD, opacity: 0.5, width: 28, textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: 14, borderRadius: 7, background: 'rgba(61,57,5,0.04)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 7,
          background: `linear-gradient(90deg, ${PF_GOLD} 0%, ${color} 100%)`,
          width: `${w}%`,
          transition: 'width 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
        }}/>
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, color: PF_INK, width: 20 }}>{value}</span>
    </div>
  )
}

/* ───── Swipe Card ───── */

function SwipeCard({
  timeBuckets,
  loggedDays,
  todayDate,
  daysInMonth,
  startOffset,
  monthLabel,
}: {
  timeBuckets: number[]
  loggedDays: Set<number>
  todayDate: number
  daysInMonth: number
  startOffset: number
  monthLabel: string
}) {
  const [page, setPage] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const pages = ['time', 'calendar']

  const maxBucket = Math.max(1, ...timeBuckets)

  const onStart = (x: number) => { startX.current = x; setDragging(true) }
  const onMove = (x: number) => { if (dragging) setDragX(x - startX.current) }
  const onEnd = () => {
    setDragging(false)
    if (dragX < -40 && page < pages.length - 1) setPage((p) => p + 1)
    else if (dragX > 40 && page > 0) setPage((p) => p - 1)
    setDragX(0)
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => { if (dragging) onMove(e.clientX) }}
        onMouseUp={onEnd}
        onMouseLeave={() => { if (dragging) onEnd() }}
        style={{
          overflow: 'hidden',
          borderRadius: 22,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 6px 20px rgba(61,57,5,0.05)',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{
          display: 'flex',
          transform: `translateX(calc(${-page * 100}% + ${dragging ? dragX : 0}px))`,
          transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        }}>
          {/* Page 1: Time Distribution */}
          <div style={{ minWidth: '100%', padding: '14px 16px', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 10 }}>时段分布</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <TimeBar label="早晨" value={timeBuckets[0]} max={maxBucket} color={PF_GOLD_DEEP} delay={200} />
              <TimeBar label="上午" value={timeBuckets[1]} max={maxBucket} color={PF_GOLD} delay={300} />
              <TimeBar label="下午" value={timeBuckets[2]} max={maxBucket} color={PF_GOLD_DEEP} delay={400} />
              <TimeBar label="晚间" value={timeBuckets[3]} max={maxBucket} color={PF_GOLD} delay={500} />
              <TimeBar label="深夜" value={timeBuckets[4]} max={maxBucket} color="#8a7a44" delay={600} />
            </div>
          </div>

          {/* Page 2: Calendar */}
          <div style={{ minWidth: '100%', padding: '14px 16px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 900 }}>月度节奏</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: PF_ON_GOLD, opacity: 0.5 }}>{monthLabel}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px 2px', textAlign: 'center' }}>
              {WEEKDAYS_CN.map((d) => (
                <div key={d} style={{ fontSize: 8, fontWeight: 900, color: PF_ON_GOLD, opacity: 0.35, padding: '2px 0 4px', letterSpacing: '0.1em' }}>
                  {d}
                </div>
              ))}
              {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1
                const isToday = d === todayDate
                const hasLog = loggedDays.has(d)
                return (
                  <div key={d} style={{
                    width: 30, height: 30, borderRadius: 10,
                    margin: '0 auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: isToday ? 900 : 600,
                    background: isToday ? PF_GOLD : hasLog ? `${PF_GOLD}30` : 'transparent',
                    color: isToday ? PF_ON_GOLD : hasLog ? PF_ON_GOLD : 'rgba(61,57,5,0.25)',
                    boxShadow: isToday ? `0 3px 10px ${PF_GOLD}44` : 'none',
                  }}>
                    {d}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
        {pages.map((_, i) => (
          <div key={i} onClick={() => setPage(i)} style={{
            width: page === i ? 18 : 6, height: 6, borderRadius: 3,
            background: page === i ? PF_GOLD : 'rgba(61,57,5,0.12)',
            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
          }} />
        ))}
      </div>
    </div>
  )
}
