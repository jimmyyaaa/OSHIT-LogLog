import { useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogContext } from '../../context/LogContext'
import type { CreateLogPayload } from '../../types'
import LogSheet from '../../components/LogSheet/LogSheet'
import RewardModal from '../../components/RewardModal/RewardModal'
import SuccessModal from '../../components/SuccessModal/SuccessModal'
import { SHAPES, FEELINGS } from '../../data/shitData'

const SHAPE_MAP = Object.fromEntries(SHAPES.map((s) => [s.code, s]))
const FEELING_MAP = Object.fromEntries(FEELINGS.map((f) => [f.code, f]))

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
      if (payload.shape === 'type_ideal' && !entries.some((e) => e.shape === 'type_ideal')) {
        earned.push('+5 SHIT Point')
      }
      return earned
    },
    [entries, today]
  )

  const [lastPayload, setLastPayload] = useState<CreateLogPayload | null>(null)

  const handleSubmit = useCallback(
    async (payload: CreateLogPayload) => {
      const earned = computeRewards(payload)
      await addEntry(payload)
      setLastPayload(payload)
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
    <div className="flex min-h-screen flex-col bg-gradient-to-t from-primary-container/40 via-surface-container-low to-surface font-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Background Radial Glow */}
      <div className="pointer-events-none fixed left-1/2 top-1/3 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed/20 blur-[120px]" />

      {/* Top bar: title + profile */}
      <div className="shrink-0 flex items-center justify-between px-7 pt-12 pb-2">
        <h1 className="font-display text-3xl font-black tracking-tight text-on-surface">屎了么</h1>
        <button
          onClick={() => navigate('/profile')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            person
          </span>
        </button>
      </div>

      {/* Intro text */}
      <div className="shrink-0 px-7 pb-6 pt-2">
        <p className="text-base leading-relaxed text-on-surface-variant">
          每日一拉，健康到家！
          <br />
          记录你的光辉时刻，分享到朋友圈，让我们一起<span className="font-bold text-primary">SHIT</span>出一个更美好的世界！
        </p>
      </div>

      {/* Main content area */}
      <main className="flex flex-1 flex-col items-center px-6">
        {/* Toilet + Flush Button */}
        <ToiletButton onClick={() => setSheetOpen(true)} />

        {/* Today's records */}
        <section className="w-full max-w-lg rounded-[2.5rem] bg-white/70 p-7 shadow-[0_16px_48px_rgba(61,57,5,0.1)] backdrop-blur-3xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-on-surface">今日记录</h2>
            <span className="rounded-full bg-primary-container/20 px-3 py-1 text-xs font-bold text-primary">Today</span>
          </div>

          {todayEntries.length === 0 ? (
            <div className="rounded-2xl bg-surface-container-low p-6 text-center">
              <p className="text-sm text-on-surface-variant">今天还没有记录</p>
            </div>
          ) : (
            <div className="max-h-[200px] space-y-3 overflow-y-auto">
              {todayEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center gap-4 rounded-2xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/30 p-1.5 text-2xl">
                    {SHAPE_MAP[entry.shape]?.image ? (
                      <img
                        src={SHAPE_MAP[entry.shape].image}
                        alt={SHAPE_MAP[entry.shape]?.name || entry.shape}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      SHAPE_MAP[entry.shape]?.icon || '💩'
                    )}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h4 className="font-bold text-on-surface">{SHAPE_MAP[entry.shape]?.name || entry.shape}</h4>
                    <p className="text-sm text-on-surface-variant">
                      {formatTime(entry.timestamp)}
                      {entry.feeling ? ` · ${FEELING_MAP[entry.feeling]?.name || ''}` : ''}
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
      </main>

      {/* Footer */}
      <footer className="shrink-0 py-6 text-center">
        <p className="text-[11px] font-medium tracking-wider text-on-surface-variant/40">
          &copy; 2026 All Shit Reserved.
        </p>
      </footer>

      <LogSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSubmit={handleSubmit} />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        payload={lastPayload}
      />
      <RewardModal rewards={rewards} currentIndex={rewardIndex} onDismiss={() => setRewardIndex((i) => i + 1)} />
    </div>
  )
}

/* ---- Toilet Flush Button ---- */

function ToiletButton({ onClick }: { onClick: () => void }) {
  const [flushing, setFlushing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleFlush = () => {
    if (flushing) return
    setFlushing(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setFlushing(false)
      onClick()
    }, 900)
  }

  return (
    <div className="relative mb-8 flex flex-col items-center">
      {/* Glow behind toilet */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/30 blur-[50px]" />

      <button
        onClick={handleFlush}
        disabled={flushing}
        className="group relative flex h-[260px] w-[220px] items-center justify-center transition-transform duration-200 active:scale-95 disabled:cursor-wait"
        aria-label="按下冲水按钮开始记录"
      >
        <img
          src="/马桶.png"
          alt=""
          className={`h-full w-full object-contain drop-shadow-[0_18px_18px_rgba(61,57,5,0.08)] transition-transform duration-300 ${
            flushing ? 'scale-95 rotate-1' : 'group-hover:-translate-y-1'
          }`}
        />
        {flushing && (
          <span className="pointer-events-none absolute left-1/2 top-[56%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-sky-200/80 border-t-sky-400/90 animate-spin" />
        )}
      </button>

      {/* Label */}
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
        {flushing ? '冲水中...' : '按下冲水按钮开始记录'}
      </p>
    </div>
  )
}
