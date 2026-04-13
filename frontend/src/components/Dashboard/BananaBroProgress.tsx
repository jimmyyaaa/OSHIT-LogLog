interface BananaBroProgressProps {
  value: number | null
}

export default function BananaBroProgress({ value }: BananaBroProgressProps) {
  const percentage = value ?? 0
  const radius = 45
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center py-2">
      <div className="relative">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="#f5f5f7"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={value !== null ? '#0071e3' : '#f5f5f7'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={value !== null ? offset : circumference}
            transform="rotate(-90 55 55)"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[24px] font-semibold leading-[1.14] text-near-black">
            {value !== null ? `${value}%` : '--'}
          </span>
        </div>
      </div>
    </div>
  )
}
