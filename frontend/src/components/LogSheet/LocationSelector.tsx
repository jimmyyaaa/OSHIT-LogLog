import type { LocationType } from '../../types'

interface LocationSelectorProps {
  value: LocationType | null
  onChange: (location: LocationType | null) => void
}

const locations: { type: LocationType; label: string }[] = [
  { type: 'home', label: '家' },
  { type: 'office', label: '办公室' },
  { type: 'school', label: '学校' },
  { type: 'outdoors', label: '户外' },
  { type: 'car', label: '车上' },
  { type: 'plane', label: '飞机' },
  { type: 'boat', label: '船上' },
]

export default function LocationSelector({ value, onChange }: LocationSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {locations.map(({ type, label }) => (
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
