interface StreakBadgeProps {
  days: number
}

export default function StreakBadge({ days }: StreakBadgeProps) {
  const isMilestone = days === 3 || days === 7 || days === 30

  return (
    <div className="flex flex-col items-center py-3">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full ${
          days > 0 ? 'bg-apple-blue' : 'bg-light-gray'
        } ${isMilestone ? 'animate-bounce-in' : ''}`}
      >
        <span
          className={`font-display text-[34px] font-semibold leading-[1.07] ${
            days > 0 ? 'text-white' : 'text-text-tertiary'
          }`}
        >
          {days}
        </span>
      </div>
      <span className="mt-2 text-[14px] font-semibold tracking-[-0.224px] text-text-secondary">
        天
      </span>
    </div>
  )
}
