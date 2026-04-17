import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogContext } from '../../context/LogContext'
import type { CreateLogPayload, ShapeType } from '../../types'
import LogSheet from '../../components/LogSheet/LogSheet'
import RewardModal from '../../components/RewardModal/RewardModal'
import SuccessModal from '../../components/SuccessModal/SuccessModal'

const SHAPE_LABELS: Record<ShapeType, string> = {
  rabbit_pellets: '兔子弹',
  twisted_rope: '麻花绳',
  banana_bro: '香蕉君',
  soft_serve: '软冰淇淋',
  splash_zone: '水花区',
}

const SHAPE_ICONS: Record<ShapeType, string> = {
  rabbit_pellets: 'grain',
  twisted_rope: 'waves',
  banana_bro: 'spa',
  soft_serve: 'water_drop',
  splash_zone: 'thunderstorm',
}

const FEELING_LABELS: Record<string, string> = {
  effortless: '毫不费力',
  could_have_been_more: '意犹未尽',
  hard_won: '来之不易',
}

export default function HomePage() {
  const navigate = useNavigate()
  const { entries, addEntry } = useLogContext()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [rewards, setRewards] = useState<string[]>([])
  const [rewardIndex, setRewardIndex] = useState(0)

  const today = new Date().toISOString().slice(0, 10)

  const todayEntries = useMemo(() => {
    return entries
      .filter((e) => new Date(e.timestamp).toISOString().slice(0, 10) === today)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [entries, today])

  const computeRewards = useCallback(
    (payload: CreateLogPayload) => {
      const earned: string[] = []
      const isFirstToday = !entries.some((e) => new Date(e.timestamp).toISOString().slice(0, 10) === today)
      if (isFirstToday) {
        earned.push('+1 SHIT Point')
        const loggedDates = new Set(entries.map((e) => new Date(e.timestamp).toISOString().slice(0, 10)))
        loggedDates.add(today)
        let s = 0
        const d = new Date()
        while (loggedDates.has(d.toISOString().slice(0, 10))) { s++; d.setDate(d.getDate() - 1) }
        if (s === 3) earned.push('+3 SHIT Point')
        if (s === 7) earned.push('+7 SHIT Point')
        if (s === 30) earned.push('+30 SHIT Point')
      }
      if (payload.shape === 'banana_bro' && !entries.some((e) => e.shape === 'banana_bro')) {
        earned.push('+5 SHIT Point')
      }
      return earned
    },
    [entries, today]
  )

  const streak = useMemo(() => {
    let count = 0
    const d = new Date()
    const dates = new Set(entries.map((e) => new Date(e.timestamp).toISOString().slice(0, 10)))
    while (dates.has(d.toISOString().slice(0, 10))) { count++; d.setDate(d.getDate() - 1) }
    return count
  }, [entries])

  const handleSubmit = useCallback(
    (payload: CreateLogPayload) => {
      const earned = computeRewards(payload)
      addEntry(payload)
      setSheetOpen(false)
      setSuccessOpen(true)
      if (earned.length > 0) { setRewards(earned); setRewardIndex(0) }
    },
    [addEntry, computeRewards]
  )

  const formatTime = (ts: string) => {
    const d = new Date(ts)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-t from-primary-container/40 via-surface-container-low to-surface font-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar */}
      <header className="shrink-0 flex w-full items-center justify-between rounded-b-large bg-surface/70 px-8 py-4 shadow-[0_12px_32px_rgba(61,57,5,0.06)] backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-container-high active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              person
            </span>
          </button>
          <span className="text-2xl font-bold tracking-tight text-on-surface font-display">LogLog</span>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex flex-grow flex-col items-center justify-center px-6 pb-8 relative mx-auto w-full max-w-7xl">
        {/* Background Radial Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed/20 blur-[120px]" />

        {/* Tagline */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-black leading-tight tracking-tighter text-on-surface md:text-6xl">
            Give a <span className="text-primary">SHIT</span> to Myself
          </h1>
        </div>

        {/* Center Action: Record Button */}
        <div className="group relative mb-16 cursor-pointer">
          <div className="absolute inset-0 scale-110 rounded-full bg-primary-container/40 blur-[40px] transition-transform duration-500 group-hover:scale-125" />
          <button
            onClick={() => setSheetOpen(true)}
            className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-white/30 bg-primary-container shadow-[inset_0_4px_12px_rgba(0,0,0,0.05),0_20px_40px_rgba(255,215,9,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 md:h-56 md:w-56"
          >
            <span className="material-symbols-outlined mb-2 text-6xl font-light text-on-primary-container">add</span>
            <span className="font-display text-xl font-extrabold tracking-wider text-on-primary-container">RECORD</span>
          </button>
        </div>

        {/* Bottom Layout: Bento Style */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-12">
          {/* Recent Records */}
          <section className="rounded-[2.5rem] bg-white/70 p-8 shadow-[0_16px_48px_rgba(61,57,5,0.1)] backdrop-blur-3xl md:col-span-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-on-surface">Recent Flow</h2>
              <span className="rounded-full bg-primary-container/20 px-3 py-1 text-sm font-bold text-primary">Today</span>
            </div>

            {todayEntries.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-low p-6 text-center">
                <p className="text-sm text-on-surface-variant">今天还没有记录</p>
              </div>
            ) : (
              <div className="max-h-[180px] space-y-4 overflow-y-auto">
                {todayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex cursor-pointer items-center gap-4 rounded-2xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/30">
                      <span className="material-symbols-outlined text-primary">
                        {SHAPE_ICONS[entry.shape] || 'circle'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-bold text-on-surface">{SHAPE_LABELS[entry.shape]}</h4>
                      <p className="text-sm text-on-surface-variant">
                        {formatTime(entry.timestamp)}
                        {entry.feeling ? ` · ${FEELING_LABELS[entry.feeling]}` : ''}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant opacity-0 transition-opacity group-hover:opacity-100">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <LogSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSubmit={handleSubmit} />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        streak={streak}
        todayCount={todayEntries.length}
        totalCount={entries.length}
      />
      <RewardModal rewards={rewards} currentIndex={rewardIndex} onDismiss={() => setRewardIndex((i) => i + 1)} />
    </div>
  )
}

