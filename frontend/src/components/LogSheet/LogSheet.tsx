import { useState, useEffect } from 'react'
import type { ShapeType, ColorType, FeelingType, LocationType, CauseType, CreateLogPayload } from '../../types'
import { SHAPES, COLORS, FEELINGS, CAUSES, PLACES } from '../../data/shitData'

interface LogSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: CreateLogPayload) => void | Promise<void>
}

const GOLD = '#ffd709'
const GOLD_DEEP = '#ffb000'
const INK = '#3d3905'
const ON_GOLD = '#5b4b00'
const CREAM = '#fffae1'

type StepKey = 'shape' | 'color' | 'feeling' | 'causes' | 'location'

interface StepDef {
  key: StepKey
  title: string
  subtitle: string
  required: boolean
  layout: 'grid2' | 'colorBlob' | 'scatter'
  options: Array<{ code: string; icon?: string; image?: string; name: string; hex?: string; desc?: string }>
  multi?: boolean
}

const STEPS: StepDef[] = [
  {
    key: 'shape',
    title: '今天什么形状？',
    subtitle: '选一个最像的',
    required: true,
    layout: 'grid2',
    options: SHAPES.map((s) => ({ code: s.code, icon: s.icon, image: s.image, name: s.name, desc: s.desc })),
  },
  {
    key: 'color',
    title: '颜色怎么样？',
    subtitle: '戳一下看看',
    required: true,
    layout: 'colorBlob',
    options: COLORS.map((c) => ({ code: c.code, hex: c.hex, icon: c.icon, name: c.name })),
  },
  {
    key: 'feeling',
    title: '感受如何？',
    subtitle: '选出你的心情',
    required: false,
    layout: 'scatter',
    options: FEELINGS.map((f) => ({ code: f.code, icon: f.icon, name: f.name })),
  },
  {
    key: 'causes',
    title: '什么原因导致的？',
    subtitle: '选一个最相关的',
    required: false,
    layout: 'scatter',
    options: CAUSES.map((c) => ({ code: c.code, icon: c.icon, name: c.name })),
  },
  {
    key: 'location',
    title: '在哪里完成的？',
    subtitle: '选择你的战场',
    required: false,
    layout: 'scatter',
    options: PLACES.map((p) => ({ code: p.code, icon: p.icon, name: p.name })),
  },
]

interface Selections {
  shape: ShapeType | null
  color: ColorType | null
  feeling: FeelingType | null
  causes: CauseType[]
  location: LocationType | null
}

const initialSelections: Selections = {
  shape: null, color: null, feeling: null, causes: [], location: null,
}

export default function LogSheet({ open, onClose, onSubmit }: LogSheetProps) {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Selections>(initialSelections)
  const [animKey, setAnimKey] = useState(0)
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setStep(0)
      setSelections(initialSelections)
      setAnimKey(0)
      setDirection(1)
      setSubmitting(false)
      setSubmitError(null)
    }
  }, [open])

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1

  const select = (code: string) => {
    if (currentStep.key === 'causes') {
      setSelections((prev) => {
        const has = prev.causes.includes(code as CauseType)
        return {
          ...prev,
          causes: has ? prev.causes.filter((c) => c !== code) : [...prev.causes, code as CauseType],
        }
      })
    } else {
      setSelections((prev) => {
        const currentVal = prev[currentStep.key] as string | null
        return { ...prev, [currentStep.key]: currentVal === code ? null : code }
      })
    }
  }

  const hasSelection = currentStep.key === 'causes'
    ? selections.causes.length > 0
    : !!selections[currentStep.key]
  const canContinue = currentStep.required ? hasSelection : true

  const goNext = async () => {
    if (submitting || !canContinue) return
    setSubmitError(null)
    if (isLast) {
      if (!selections.shape) return
      setSubmitting(true)
      try {
        await onSubmit({
          shape: selections.shape,
          color: selections.color ?? undefined,
          feeling: selections.feeling ?? undefined,
          contributingFactors: selections.causes.length ? selections.causes : undefined,
          location: selections.location ?? undefined,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : '请确认后端已启动后重试'
        setSubmitError(`记录失败：${message}`)
      } finally {
        setSubmitting(false)
      }
    } else {
      setDirection(1)
      setAnimKey((k) => k + 1)
      setStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (step > 0) {
      setDirection(-1)
      setAnimKey((k) => k + 1)
      setStep((s) => s - 1)
    } else {
      onClose()
    }
  }

  const skipStep = () => {
    if (!currentStep.required && !submitting) {
      setDirection(1)
      setAnimKey((k) => k + 1)
      if (!isLast) setStep((s) => s + 1)
      else goNext()
    }
  }

  const selectedForStep =
    currentStep.key === 'causes'
      ? selections.causes
      : (selections[currentStep.key] as string | null)

  return (
    <div
      className={`fixed inset-0 z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
    >
      <main
        className="relative flex h-full w-full flex-col overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, ${GOLD}18 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, ${GOLD}10 0%, transparent 50%),
            linear-gradient(180deg, #fffbff 0%, ${CREAM} 100%)`,
          fontFamily: 'Nunito, sans-serif',
          color: INK,
        }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute right-[-8%] top-[12%] h-[160px] w-[160px] rounded-full" style={{ background: `${GOLD}15`, filter: 'blur(40px)' }} />
        <div className="pointer-events-none absolute bottom-[20%] left-[-5%] h-[120px] w-[120px] rounded-full" style={{ background: `${GOLD_DEEP}12`, filter: 'blur(30px)' }} />

        {/* Top bar */}
        <div className="relative z-10 flex shrink-0 items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
            <button
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
              style={{ background: 'rgba(255,255,255,0.6)', color: INK, border: 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {step > 0 ? 'arrow_back' : 'close'}
              </span>
            </button>

            <StepDots total={STEPS.length} current={step} />

            <button
              onClick={skipStep}
              className="px-3 py-2 text-xs font-extrabold tracking-wide transition-colors"
              style={{
                color: !currentStep.required ? ON_GOLD : 'rgba(91,75,0,0.25)',
                visibility: currentStep.required ? 'hidden' : 'visible',
                cursor: !currentStep.required ? 'pointer' : 'default',
              }}
            >
              {isLast ? '完成 ✓' : '跳过 →'}
            </button>
          </div>

        {/* Question area */}
        <div
          key={animKey}
          className="flex flex-1 flex-col items-center px-6"
          style={{ animation: `slideIn${direction > 0 ? 'R' : 'L'} 0.4s cubic-bezier(0.16,1,0.3,1) forwards` }}
        >
          <div className="mb-2 mt-8 flex flex-col items-center">
            <h2 className="m-0 text-center text-[28px] font-black" style={{ letterSpacing: '-0.02em' }}>
              {currentStep.title}
            </h2>
            <p className="mt-2 text-center text-[13px] font-bold" style={{ color: ON_GOLD, opacity: 0.6 }}>
              {currentStep.subtitle}
            </p>
          </div>

          <div className="flex flex-1 items-center justify-center pb-2">
            {currentStep.layout === 'grid2' && (
              <ShapeGrid options={currentStep.options} selected={selectedForStep as string | null} onSelect={select} />
            )}
            {currentStep.layout === 'colorBlob' && (
              <ColorBlobPicker options={currentStep.options} selected={selectedForStep as string | null} onSelect={select} />
            )}
            {currentStep.layout === 'scatter' && (
              <ScatterPicker options={currentStep.options} selected={selectedForStep} onSelect={select} />
            )}
          </div>
        </div>

        {/* Bottom action */}
        <div className="relative z-10 shrink-0 px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)]">
          {submitError && (
            <p className="mb-3 text-center text-xs font-extrabold" style={{ color: '#b3261e' }}>
              {submitError}
            </p>
          )}
          <button
            onClick={canContinue ? goNext : undefined}
            disabled={!canContinue || submitting}
            className="h-14 w-full rounded-full text-base font-black tracking-wide backdrop-blur-sm transition-all"
            style={{
              background: canContinue
                ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DEEP} 100%)`
                : 'rgba(255,255,255,0.5)',
              color: canContinue ? ON_GOLD : 'rgba(91,75,0,0.35)',
              boxShadow: canContinue ? `0 12px 28px ${GOLD}55` : 'none',
              border: 'none',
              cursor: canContinue && !submitting ? 'pointer' : 'default',
            }}
          >
            {submitting ? '提交中...' : isLast ? '提交记录 🎉' : hasSelection ? '下一步 →' : currentStep.required ? '请选择' : '跳过 →'}
          </button>
        </div>

        <style>{`
          @keyframes slideInR {
            from { opacity: 0; transform: translateX(40px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInL {
            from { opacity: 0; transform: translateX(-40px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </main>
    </div>
  )
}

/* ---- Step Dots ---- */

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-2 rounded-full transition-all duration-350"
          style={{
            width: i === current ? 24 : 8,
            background: i === current ? GOLD : i < current ? GOLD_DEEP : 'rgba(91,75,0,0.12)',
          }}
        />
      ))}
    </div>
  )
}

/* ---- Shape Grid ---- */

function ShapeGrid({ options, selected, onSelect }: { options: StepDef['options']; selected: string | null; onSelect: (code: string) => void }) {
  const [appeared, setAppeared] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAppeared(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="grid w-full max-w-[380px] grid-cols-2 gap-4">
      {options.map((opt, i) => {
        const sel = selected === opt.code
        return (
          <button
            key={opt.code}
            onClick={() => onSelect(opt.code)}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[28px] p-4"
            style={{
              background: sel
                ? `linear-gradient(135deg, ${CREAM} 0%, ${GOLD}55 100%)`
                : 'rgba(255,255,255,0.65)',
              border: sel ? `2.5px solid ${GOLD}` : '2px solid rgba(255,255,255,0.4)',
              boxShadow: sel
                ? `0 10px 32px ${GOLD}44, inset 0 1px 0 rgba(255,255,255,0.8)`
                : '0 4px 16px rgba(61,57,5,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              transform: appeared ? (sel ? 'scale(1.05)' : 'scale(1)') : 'scale(0) rotate(20deg)',
              opacity: appeared ? 1 : 0,
              transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 80}ms`,
              cursor: 'pointer',
            }}
          >
            {opt.image ? (
              <img
                src={opt.image}
                alt={opt.name}
                className="h-20 w-20 object-contain transition-transform duration-300"
                style={{ filter: sel ? 'none' : 'saturate(0.9)', transform: sel ? 'scale(1.08)' : 'scale(1)' }}
              />
            ) : (
              <span className="text-[56px] leading-none" style={{ filter: sel ? 'none' : 'saturate(0.85)' }}>
                {opt.icon}
              </span>
            )}
            <span className="text-base font-extrabold" style={{ color: INK }}>{opt.name}</span>
            {opt.desc && (
              <span className="text-center text-[11px] leading-tight" style={{ color: ON_GOLD, opacity: 0.7 }}>
                {opt.desc}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ---- Color Blob Picker ---- */

function ColorBlobPicker({ options, selected, onSelect }: { options: StepDef['options']; selected: string | null; onSelect: (code: string) => void }) {
  const [appeared, setAppeared] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAppeared(true), 100)
    return () => clearTimeout(t)
  }, [])

  const baseSize = 58
  const selSize = 84
  const gapX = baseSize * 1.08
  const gapY = baseSize * 0.95
  const basePositions = [
    { row: 0, col: 0.5 },
    { row: 0, col: 1.5 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
  ]

  const centers = basePositions.map((hp) => ({
    x: hp.col * gapX + baseSize / 2,
    y: hp.row * gapY + baseSize / 2,
  }))

  const selIdx = options.findIndex((o) => o.code === selected)

  return (
    <div
      className="relative"
      style={{
        width: gapX * 3,
        height: gapY * 2 + baseSize,
      }}
    >
      {options.map((opt, i) => {
        const sel = selected === opt.code
        let cx = centers[i].x
        let cy = centers[i].y

        if (selIdx >= 0 && !sel) {
          const sc = centers[selIdx]
          const dx = cx - sc.x
          const dy = cy - sc.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const push = Math.max(0, 18 - dist * 0.06)
          cx += (dx / dist) * push
          cy += (dy / dist) * push
        }

        const sz = sel ? selSize : baseSize

        return (
          <button
            key={opt.code}
            onClick={() => onSelect(opt.code)}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: sz,
              height: sz,
              transform: appeared
                ? `translate(-50%, -50%) scale(${sel ? 1 : selIdx >= 0 ? 0.92 : 1})`
                : 'translate(-50%, -50%) scale(0)',
              borderRadius: '50%',
              background: `radial-gradient(circle at 36% 30%, ${opt.hex}dd, ${opt.hex})`,
              border: sel ? '4px solid #fff' : '3px solid rgba(255,255,255,0.4)',
              boxShadow: sel
                ? `0 0 0 3px ${GOLD}, 0 16px 40px ${opt.hex}77, inset 0 -6px 16px rgba(0,0,0,0.18)`
                : `0 4px 14px ${opt.hex}33, inset 0 -3px 8px rgba(0,0,0,0.1)`,
              opacity: sel ? 1 : selIdx >= 0 ? 0.75 : 1,
              cursor: 'pointer',
              transition:
                'left 0.6s cubic-bezier(0.25,1,0.5,1), top 0.6s cubic-bezier(0.25,1,0.5,1), width 0.5s cubic-bezier(0.25,1,0.5,1), height 0.5s cubic-bezier(0.25,1,0.5,1), transform 0.5s cubic-bezier(0.25,1,0.5,1), box-shadow 0.4s ease, opacity 0.4s ease, border 0.3s ease',
              zIndex: sel ? 10 : 1,
              padding: 0,
            }}
          />
        )
      })}
    </div>
  )
}

/* ---- Scatter Picker ---- */

function ScatterPicker({ options, selected, onSelect }: { options: StepDef['options']; selected: string | null | string[]; onSelect: (code: string) => void }) {
  const [appeared, setAppeared] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAppeared(true), 80)
    return () => clearTimeout(t)
  }, [])

  const selArr = Array.isArray(selected) ? selected : selected ? [selected] : []

  const allPos = [
    { x: 28, y: 18, rot: -5 },
    { x: 68, y: 14, rot: 4 },
    { x: 48, y: 40, rot: -2 },
    { x: 22, y: 62, rot: 5 },
    { x: 72, y: 58, rot: -4 },
    { x: 48, y: 80, rot: 3 },
  ]
  const positions = allPos.slice(0, options.length)
  const selIdx = options.findIndex((o) => selArr.includes(o.code))

  return (
    <div className="relative" style={{ width: 340, height: 300 }}>
      {options.map((opt, i) => {
        const sel = selArr.includes(opt.code)
        const pos = positions[i]
        let px = pos.x
        let py = pos.y

        if (selIdx >= 0 && !sel) {
          const sp = positions[selIdx]
          const dx = pos.x - sp.x
          const dy = pos.y - sp.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const push = Math.max(0, 12 - dist * 0.1)
          px += (dx / dist) * push
          py += (dy / dist) * push
        }

        return (
          <button
            key={opt.code}
            onClick={() => onSelect(opt.code)}
            style={{
              position: 'absolute',
              left: `${px}%`,
              top: `${py}%`,
              transform: appeared
                ? `translate(-50%, -50%) rotate(${sel ? 0 : pos.rot}deg) scale(${sel ? 1.15 : selIdx >= 0 ? 0.92 : 1})`
                : 'translate(-50%, -50%) scale(0)',
              padding: sel ? '14px 20px' : '12px 18px',
              borderRadius: 22,
              background: sel
                ? `linear-gradient(135deg, ${CREAM} 0%, ${GOLD}66 100%)`
                : 'rgba(255,255,255,0.75)',
              border: sel ? `2.5px solid ${GOLD}` : '2px solid rgba(255,255,255,0.5)',
              boxShadow: sel
                ? `0 0 0 3px ${GOLD}44, 0 12px 28px ${GOLD}44`
                : '0 4px 14px rgba(61,57,5,0.06)',
              opacity: sel ? 1 : selIdx >= 0 ? 0.7 : 1,
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition:
                'left 0.6s cubic-bezier(0.25,1,0.5,1), top 0.6s cubic-bezier(0.25,1,0.5,1), transform 0.5s cubic-bezier(0.25,1,0.5,1), padding 0.4s ease, box-shadow 0.4s ease, opacity 0.4s ease, background 0.3s ease, border 0.3s ease',
              zIndex: sel ? 10 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: sel ? 32 : 28, transition: 'font-size 0.35s ease' }}>{opt.icon}</span>
            <span style={{ fontSize: sel ? 16 : 14, fontWeight: 800, color: INK, transition: 'font-size 0.35s ease' }}>
              {opt.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
