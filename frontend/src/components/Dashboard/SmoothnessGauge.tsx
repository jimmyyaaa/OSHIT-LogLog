interface SmoothnessGaugeProps {
  value: number | null
  trend?: 'up' | 'down' | 'flat'
}

export default function SmoothnessGauge({ value, trend }: SmoothnessGaugeProps) {
  const percentage = value ?? 0
  const radius = 60
  const strokeWidth = 10
  const circumference = Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const color =
    percentage >= 60 ? '#34c759' : percentage >= 30 ? '#ff9f0a' : '#ff3b30'

  const trendLabel =
    trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : trend === 'flat' ? '\u2192' : ''

  return (
    <div className="flex flex-col items-center py-2">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="#f5f5f7"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke={value !== null ? color : '#f5f5f7'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={value !== null ? offset : circumference}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-[34px] font-semibold leading-[1.07] tracking-[-0.28px] text-near-black">
          {value !== null ? `${value}%` : '--'}
        </span>
        {trendLabel && (
          <span className="text-[17px] text-text-tertiary">{trendLabel}</span>
        )}
      </div>
    </div>
  )
}
