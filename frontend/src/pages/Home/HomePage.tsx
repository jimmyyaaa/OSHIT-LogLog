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
    (payload: CreateLogPayload) => {
      const earned = computeRewards(payload)
      setLastPayload(payload)
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
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/30 text-2xl">
                    {SHAPE_MAP[entry.shape]?.icon || '💩'}
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

      <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tank shadow */}
        <ellipse cx="110" cy="248" rx="70" ry="8" fill="rgba(61,57,5,0.06)" />

        {/* Tank body */}
        <rect x="65" y="10" width="90" height="70" rx="16" fill="#fffae1" stroke="#efc900" strokeWidth="2.5" />
        {/* Tank lid */}
        <rect x="58" y="4" width="104" height="18" rx="9" fill="#ffd709" stroke="#efc900" strokeWidth="2" />

        {/* Pipe connecting tank to bowl */}
        <rect x="100" y="78" width="20" height="20" rx="4" fill="#fffae1" stroke="#efc900" strokeWidth="2" />

        {/* Bowl back (wider part) */}
        <path
          d="M 40 100 Q 40 96, 46 96 L 174 96 Q 180 96, 180 100 L 180 140 Q 180 180, 140 195 L 80 195 Q 40 180, 40 140 Z"
          fill="#fffae1"
          stroke="#efc900"
          strokeWidth="2.5"
        />

        {/* Bowl seat ring */}
        <ellipse cx="110" cy="148" rx="60" ry="42" fill="white" stroke="#efc900" strokeWidth="2.5" />

        {/* Water in bowl */}
        <ellipse
          cx="110"
          cy="150"
          rx="45"
          ry="30"
          fill="#e8f4fd"
          className={flushing ? 'animate-[flush-spin_0.8s_ease-in-out]' : ''}
        />

        {/* Water swirl when flushing */}
        {flushing && (
          <g className="animate-[flush-spin_0.8s_ease-in-out] origin-center" style={{ transformOrigin: '110px 150px' }}>
            <path
              d="M 95 140 Q 110 135, 120 145 Q 130 155, 115 160 Q 100 165, 95 155 Q 90 145, 95 140"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 105 138 Q 118 142, 122 152 Q 126 162, 112 163"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        )}

        {/* Bowl base */}
        <path
          d="M 75 192 Q 75 220, 90 230 L 130 230 Q 145 220, 145 192"
          fill="#fffae1"
          stroke="#efc900"
          strokeWidth="2.5"
        />
        {/* Base bottom */}
        <rect x="80" y="226" width="60" height="14" rx="7" fill="#fffae1" stroke="#efc900" strokeWidth="2" />

        {/* Flush button on tank */}
        <g
          onClick={handleFlush}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
        >
          {/* Button shadow */}
          <ellipse cx="110" cy="36" rx="18" ry="4" fill="rgba(91,75,0,0.1)" />
          {/* Button body */}
          <circle
            cx="110"
            cy="32"
            r="16"
            fill="url(#flush-gradient)"
            stroke="#efc900"
            strokeWidth="2"
            className={`transition-transform duration-150 ${flushing ? 'translate-y-[3px]' : 'hover:-translate-y-[1px]'}`}
          />
          {/* Button icon */}
          <text
            x="110"
            y="37"
            textAnchor="middle"
            fill="#5b4b00"
            fontSize="14"
            fontWeight="800"
            fontFamily="Nunito, sans-serif"
          >
            冲
          </text>
        </g>

        {/* Gradient defs */}
        <defs>
          <radialGradient id="flush-gradient" cx="0.4" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#ffd709" />
            <stop offset="100%" stopColor="#efc900" />
          </radialGradient>
        </defs>
      </svg>

      {/* Label */}
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
        {flushing ? '冲水中...' : '按下冲水按钮开始记录'}
      </p>
    </div>
  )
}
