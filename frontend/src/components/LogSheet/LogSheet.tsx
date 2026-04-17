import { useState } from 'react'
import type { ShapeType, ColorType, FeelingType, LocationType, CreateLogPayload } from '../../types'

interface LogSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: CreateLogPayload) => void
}

const SHAPES: { type: ShapeType; label: string; icon: string; desc: string }[] = [
  { type: 'rabbit_pellets', label: '兔子弹', icon: 'lens_blur', desc: '硬块状' },
  { type: 'twisted_rope', label: '麻花绳', icon: 'texture', desc: '块状香肠' },
  { type: 'banana_bro', label: '香蕉君', icon: 'water_drop', desc: '柔软光滑' },
  { type: 'soft_serve', label: '软冰淇淋', icon: 'cloud', desc: '松软团状' },
  { type: 'splash_zone', label: '水花区', icon: 'waves', desc: '稀水状' },
]

const COLORS: { type: ColorType; hex: string; label: string }[] = [
  { type: 'golden_standard', hex: '#8d6e63', label: '金色标准' },
  { type: 'dark_roast', hex: '#4e342e', label: '深度烘焙' },
  { type: 'clay_warning', hex: '#bcaaa4', label: '陶土警告' },
]

const FEELINGS: { type: FeelingType; label: string }[] = [
  { type: 'effortless', label: '毫不费力' },
  { type: 'could_have_been_more', label: '意犹未尽' },
  { type: 'hard_won', label: '来之不易' },
]

const FACTORS = ['熬夜', '吃辣', '压力大', '喝酒', '吃药', '出差']

const LOCATIONS: { type: LocationType; label: string }[] = [
  { type: 'home', label: '家' },
  { type: 'office', label: '办公室' },
  { type: 'school', label: '学校' },
  { type: 'outdoors', label: '户外' },
  { type: 'car', label: '车上' },
  { type: 'plane', label: '飞机' },
  { type: 'boat', label: '船上' },
]

export default function LogSheet({ open, onClose, onSubmit }: LogSheetProps) {
  const [shape, setShape] = useState<ShapeType | null>(null)
  const [color, setColor] = useState<ColorType | null>(null)
  const [feeling, setFeeling] = useState<FeelingType | null>(null)
  const [factors, setFactors] = useState<string[]>([])
  const [location, setLocation] = useState<LocationType | null>(null)

  const reset = () => { setShape(null); setColor(null); setFeeling(null); setFactors([]); setLocation(null) }
  const handleSubmit = () => {
    if (!shape) return
    onSubmit({ shape, color: color ?? undefined, feeling: feeling ?? undefined, contributingFactors: factors.length ? factors : undefined, location: location ?? undefined })
    reset()
  }
  const handleClose = () => { reset(); onClose() }
  const toggleFactor = (f: string) => setFactors((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])

  const now = new Date()
  const timeLabel = `TODAY ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className={`fixed inset-0 z-[60] transition-opacity duration-200 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className="absolute inset-0 bg-on-surface/10 backdrop-blur-[2px]" onClick={handleClose} />

      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <main className="relative flex h-screen w-full max-w-md flex-col overflow-hidden bg-surface md:h-[844px] md:rounded-xl md:shadow-2xl">

          {/* Decorative blurs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-container/20 blur-[80px]" />
          <div className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-secondary-container/20 blur-[100px]" />

          {/* Header */}
          <header className="relative z-10 bg-surface-bright/70 px-8 pb-6 pt-12 backdrop-blur-3xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.2em] text-on-surface-variant">{timeLabel}</span>
              <button
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high transition-all hover:bg-surface-container-highest active:scale-95"
              >
                <span className="material-symbols-outlined text-on-surface">close</span>
              </button>
            </div>
            <h1 className="text-[2.5rem] font-bold leading-tight tracking-tighter text-on-surface">New Entry</h1>
          </header>

          {/* Scrollable content */}
          <div className="flex-1 space-y-9 overflow-y-auto px-8 pb-36 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            {/* Shape picker - horizontal scroll cards */}
            <section>
              <div className="mb-5 flex items-end justify-between">
                <h2 className="text-lg font-bold text-on-surface">形状</h2>
                <span className="text-[11px] font-extrabold tracking-widest text-primary">BRISTOL SCALE</span>
              </div>
              <div className="flex gap-3 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SHAPES.map(({ type, label, icon, desc }) => (
                  <button
                    key={type}
                    onClick={() => setShape(type)}
                    className={`flex h-40 w-28 shrink-0 snap-center flex-col items-center justify-between rounded-2xl p-4 transition-all active:scale-95 ${
                      shape === type
                        ? 'scale-105 border-2 border-primary-fixed bg-primary-container shadow-[0_12px_32px_rgba(61,57,5,0.06)]'
                        : 'bg-surface-container-low hover:bg-surface-container-high'
                    }`}
                  >
                    <span className={`text-[11px] font-black ${shape === type ? 'text-on-primary-fixed-variant' : 'text-on-surface-variant'}`}>
                      {label}
                    </span>
                    <span
                      className={`material-symbols-outlined text-5xl ${shape === type ? 'text-on-primary-container' : 'text-on-surface-variant'}`}
                      style={shape === type ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {icon}
                    </span>
                    <p className={`text-center text-[10px] font-medium leading-tight ${shape === type ? 'font-bold text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {desc}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Color palette */}
            <section>
              <h2 className="mb-5 text-lg font-bold text-on-surface">颜色</h2>
              <div className="flex items-center justify-between rounded-2xl bg-surface-container-low p-6">
                <div className="flex gap-4">
                  {COLORS.map(({ type, hex }) => (
                    <button
                      key={type}
                      onClick={() => setColor(color === type ? null : type)}
                      className={`h-10 w-10 rounded-full transition-all ${
                        color === type
                          ? 'ring-4 ring-primary ring-offset-4'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <div className="ml-4 flex-1 border-l border-outline-variant/30 pl-4">
                  <span className="block text-[10px] font-bold uppercase text-on-surface-variant/50">观察</span>
                  <span className="text-sm font-semibold text-on-surface">
                    {color ? COLORS.find((c) => c.type === color)?.label : '未选择'}
                  </span>
                </div>
              </div>
            </section>

            {/* Feeling tags */}
            <section>
              <h2 className="mb-5 text-lg font-bold text-on-surface">感受</h2>
              <div className="flex flex-wrap gap-3">
                {FEELINGS.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => setFeeling(feeling === type ? null : type)}
                    className={`rounded-full px-5 py-3 text-sm font-bold shadow-sm transition-all active:scale-95 ${
                      feeling === type
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,215,9,0.2)]'
                        : 'bg-surface-container-high text-on-surface hover:bg-primary-container'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* Contributing factors */}
            <section>
              <h2 className="mb-5 text-lg font-bold text-on-surface">影响因素</h2>
              <div className="flex flex-wrap gap-3">
                {FACTORS.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFactor(f)}
                    className={`rounded-full px-5 py-3 text-sm font-bold shadow-sm transition-all active:scale-95 ${
                      factors.includes(f)
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,215,9,0.2)]'
                        : 'bg-surface-container-high text-on-surface hover:bg-primary-container'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="pb-4">
              <h2 className="mb-5 text-lg font-bold text-on-surface">地点</h2>
              <div className="flex flex-wrap gap-3">
                {LOCATIONS.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => setLocation(location === type ? null : type)}
                    className={`rounded-full px-5 py-3 text-sm font-bold shadow-sm transition-all active:scale-95 ${
                      location === type
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,215,9,0.2)]'
                        : 'bg-surface-container-high text-on-surface hover:bg-primary-container'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky bottom action */}
          <footer className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface/90 to-transparent p-8 pt-12">
            <button
              onClick={handleSubmit}
              disabled={!shape}
              className={`flex h-16 w-full items-center justify-center gap-3 rounded-xl transition-all active:scale-[0.95] ${
                shape
                  ? 'bg-primary-container shadow-[0_12px_32px_rgba(61,57,5,0.15)] active:shadow-none'
                  : 'bg-surface-container-high cursor-not-allowed'
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl ${shape ? 'text-on-primary-container' : 'text-on-surface-variant/40'}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className={`text-lg font-bold tracking-tight ${shape ? 'text-on-primary-container' : 'text-on-surface-variant/40'}`}>
                提交记录
              </span>
            </button>
          </footer>

        </main>
      </div>
    </div>
  )
}
