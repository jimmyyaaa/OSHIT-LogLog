import type { ShapeType } from '../../types'

interface ShapeSelectorProps {
  value: ShapeType | null
  onChange: (shape: ShapeType) => void
}

const shapes: { type: ShapeType; label: string; desc: string }[] = [
  { type: 'rabbit_pellets', label: '兔子弹', desc: '1型' },
  { type: 'twisted_rope', label: '麻花绳', desc: '2型' },
  { type: 'banana_bro', label: '香蕉君', desc: '3-4型' },
  { type: 'soft_serve', label: '软冰淇淋', desc: '5型' },
  { type: 'splash_zone', label: '水花区', desc: '6-7型' },
]

export default function ShapeSelector({ value, onChange }: ShapeSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {shapes.map(({ type, label, desc }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex shrink-0 flex-col items-center gap-0.5 rounded-large px-4 py-2.5 transition-colors ${
            value === type
              ? 'bg-apple-blue text-white'
              : 'bg-light-gray text-near-black active:bg-button-active'
          }`}
        >
          <span className="text-[14px] font-semibold tracking-[-0.224px]">{label}</span>
          <span
            className={`text-[11px] tracking-[-0.12px] ${
              value === type ? 'text-white/70' : 'text-text-tertiary'
            }`}
          >
            {desc}
          </span>
        </button>
      ))}
    </div>
  )
}
