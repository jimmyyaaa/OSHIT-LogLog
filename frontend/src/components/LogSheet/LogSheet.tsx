import { useState } from 'react'
import type { ShapeType, ColorType, FeelingType, LocationType, CauseType, CreateLogPayload } from '../../types'
import { SHAPES, COLORS, FEELINGS, CAUSES, PLACES } from '../../data/shitData'

interface LogSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: CreateLogPayload) => void
}

export default function LogSheet({ open, onClose, onSubmit }: LogSheetProps) {
  const [shape, setShape] = useState<ShapeType | null>(null)
  const [color, setColor] = useState<ColorType | null>(null)
  const [feeling, setFeeling] = useState<FeelingType | null>(null)
  const [causes, setCauses] = useState<CauseType[]>([])
  const [location, setLocation] = useState<LocationType | null>(null)

  const reset = () => { setShape(null); setColor(null); setFeeling(null); setCauses([]); setLocation(null) }
  const handleSubmit = () => {
    if (!shape) return
    onSubmit({
      shape,
      color: color ?? undefined,
      feeling: feeling ?? undefined,
      contributingFactors: causes.length ? causes : undefined,
      location: location ?? undefined,
    })
    reset()
  }
  const handleClose = () => { reset(); onClose() }
  const toggleCause = (c: CauseType) => setCauses((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])

  return (
    <div className={`fixed inset-0 z-[60] transition-opacity duration-200 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      {/* Blurred overlay */}
      <div className="absolute inset-0 overflow-hidden" onClick={handleClose}>
        <div className="absolute inset-0 bg-surface-container-low/60 backdrop-blur-3xl" />
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary-container/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-secondary-container/30 blur-[100px]" />
      </div>

      {/* Dialog - bottom sheet */}
      <div className={`absolute bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 transform transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <main className="relative z-10 flex max-h-[92vh] flex-col overflow-hidden rounded-t-[2rem] border border-outline-variant/15 border-b-0 bg-surface/80 shadow-[0_-12px_48px_rgba(61,57,5,0.12)] backdrop-blur-2xl">

          {/* Drag handle */}
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-outline-variant/30" />

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-7 pb-5 pt-4">
            <h1 className="text-[1.625rem] font-bold tracking-tight text-on-surface">记录今日时刻</h1>
            <button
              onClick={handleClose}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high active:scale-95"
            >
              <span className="material-symbols-outlined text-on-surface">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-8 overflow-y-auto px-7 pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            {/* Shape - staggered 2x2 grid */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                  形状特征 · Shape
                </label>
                <span className="text-[0.75rem] font-medium italic text-on-surface-variant/60">必填</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {SHAPES.map(({ code, icon, name, desc }) => (
                  <button
                    key={code}
                    onClick={() => setShape(code)}
                    className={`flex h-32 flex-col items-center justify-center rounded-2xl p-5 transition-all active:scale-95 ${
                      shape === code
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,215,9,0.35)]'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="mb-2 text-4xl">{icon}</span>
                    <span className="text-[0.95rem] font-bold">{name}</span>
                    <span className={`mt-0.5 text-center text-[11px] leading-tight ${shape === code ? 'opacity-70' : 'opacity-50'}`}>
                      {desc}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Color - color swatches */}
            <section>
              <label className="mb-4 block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                颜色深度 · Color
              </label>
              <div className="flex items-center justify-center gap-5">
                {COLORS.map(({ code, hex }) => (
                  <button
                    key={code}
                    onClick={() => setColor(color === code ? null : code)}
                    className={`rounded-full ring-offset-4 transition-all ${
                      color === code
                        ? 'h-14 w-14 scale-110 shadow-lg ring-[3px] ring-primary-container'
                        : 'h-12 w-12 ring-2 ring-transparent hover:ring-outline-variant'
                    }`}
                    style={{ backgroundColor: hex }}
                    aria-label={code}
                  />
                ))}
              </div>
            </section>

            {/* Feeling */}
            <section>
              <label className="mb-3 block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                感受 · Feeling
              </label>
              <div className="grid grid-cols-5 gap-2">
                {FEELINGS.map(({ code, icon, name }) => (
                  <button
                    key={code}
                    onClick={() => setFeeling(feeling === code ? null : code)}
                    className={`flex flex-col items-center justify-center rounded-2xl px-2 py-3 transition-all active:scale-95 ${
                      feeling === code
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,215,9,0.25)]'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="mb-1 text-3xl">{icon}</span>
                    <span className="text-[10px] font-bold leading-tight text-center">{name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Causes */}
            <section>
              <label className="mb-3 block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                影响因素 · Causes
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CAUSES.map(({ code, icon, name }) => (
                  <button
                    key={code}
                    onClick={() => toggleCause(code)}
                    className={`flex flex-col items-center justify-center rounded-2xl px-2 py-3 transition-all active:scale-95 ${
                      causes.includes(code)
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,215,9,0.25)]'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="mb-1 text-3xl">{icon}</span>
                    <span className="text-[11px] font-bold leading-tight text-center">{name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Place */}
            <section>
              <label className="mb-3 block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                地点 · Place
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PLACES.map(({ code, icon, name }) => (
                  <button
                    key={code}
                    onClick={() => setLocation(location === code ? null : code)}
                    className={`flex flex-col items-center justify-center rounded-2xl px-2 py-3 transition-all active:scale-95 ${
                      location === code
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,215,9,0.25)]'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="mb-1 text-3xl">{icon}</span>
                    <span className="text-[11px] font-bold leading-tight text-center">{name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!shape}
              className={`flex h-16 w-full items-center justify-center gap-2 rounded-xl text-[1.125rem] font-bold transition-all active:scale-95 ${
                shape
                  ? 'bg-primary-container text-on-primary-container shadow-[0_12px_24px_rgba(255,215,9,0.3)] hover:bg-primary-fixed-dim'
                  : 'cursor-not-allowed bg-surface-container-high text-on-surface-variant/40'
              }`}
            >
              <span>提交记录</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
