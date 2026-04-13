import type { ColorType } from '../../types'

interface ColorSelectorProps {
  value: ColorType | null
  onChange: (color: ColorType | null) => void
}

const colors: { type: ColorType; label: string }[] = [
  { type: 'golden_standard', label: '金色标准' },
  { type: 'dark_roast', label: '深度烘焙' },
  { type: 'clay_warning', label: '陶土警告' },
]

export default function ColorSelector({ value, onChange }: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onChange(value === type ? null : type)}
          className={`rounded-pill px-4 py-1.5 text-[14px] tracking-[-0.224px] transition-colors ${
            value === type
              ? 'bg-apple-blue text-white'
              : 'bg-light-gray text-near-black active:bg-button-active'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
