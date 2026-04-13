import type { FeelingType } from '../../types'

interface FeelingTagsProps {
  value: FeelingType | null
  onChange: (feeling: FeelingType | null) => void
}

const feelings: { type: FeelingType; label: string }[] = [
  { type: 'effortless', label: '毫不费力' },
  { type: 'could_have_been_more', label: '意犹未尽' },
  { type: 'hard_won', label: '来之不易' },
]

export default function FeelingTags({ value, onChange }: FeelingTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {feelings.map(({ type, label }) => (
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
