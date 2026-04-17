interface RewardModalProps {
  rewards: string[]
  currentIndex: number
  onDismiss: () => void
}

export default function RewardModal({ rewards, currentIndex, onDismiss }: RewardModalProps) {
  if (currentIndex >= rewards.length) return null

  const reward = rewards[currentIndex]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative mx-6 w-full max-w-[300px] animate-bounce-in rounded-xl bg-surface p-6 pt-8 text-center shadow-[0_12px_32px_rgba(61,57,5,0.15)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container">
          <span className="material-symbols-outlined text-3xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            stars
          </span>
        </div>
        <p className="font-display text-2xl font-bold tracking-tight text-on-surface">
          {reward}
        </p>
        <p className="mt-1.5 text-sm text-on-surface-variant">
          SHIT Points 已到账
        </p>
        {rewards.length > 1 && (
          <p className="mt-1 text-[11px] text-on-surface-variant">
            {currentIndex + 1} / {rewards.length}
          </p>
        )}
        <button
          onClick={onDismiss}
          className="mt-5 w-full rounded-large bg-primary-container py-3 text-base font-bold text-on-primary-container active:opacity-90"
        >
          好！
        </button>
      </div>
    </div>
  )
}
