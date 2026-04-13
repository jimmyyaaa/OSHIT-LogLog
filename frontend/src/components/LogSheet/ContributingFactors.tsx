interface ContributingFactorsProps {
  value: string[]
  onChange: (factors: string[]) => void
}

const factors = ['熬夜', '吃辣', '压力大', '喝酒', '吃药', '出差']

export default function ContributingFactors({ value, onChange }: ContributingFactorsProps) {
  const toggle = (factor: string) => {
    onChange(
      value.includes(factor) ? value.filter((f) => f !== factor) : [...value, factor]
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {factors.map((factor) => (
        <button
          key={factor}
          onClick={() => toggle(factor)}
          className={`rounded-pill px-4 py-1.5 text-[14px] tracking-[-0.224px] transition-colors ${
            value.includes(factor)
              ? 'bg-apple-blue text-white'
              : 'bg-light-gray text-near-black active:bg-button-active'
          }`}
        >
          {factor}
        </button>
      ))}
    </div>
  )
}
