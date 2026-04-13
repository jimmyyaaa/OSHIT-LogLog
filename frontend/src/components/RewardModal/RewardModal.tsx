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
      <div className="relative mx-6 w-full max-w-[300px] animate-bounce-in rounded-[20px] bg-white px-6 pb-5 pt-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-apple-blue/10">
          <span className="text-[28px]">+</span>
        </div>
        <p className="font-display text-[21px] font-bold leading-[1.19] tracking-[0.231px] text-near-black">
          {reward}
        </p>
        <p className="mt-1.5 text-[14px] tracking-[-0.224px] text-text-tertiary">
          SHIT Points 已到账
        </p>
        {rewards.length > 1 && (
          <p className="mt-1 text-[12px] tracking-[-0.12px] text-text-tertiary">
            {currentIndex + 1} / {rewards.length}
          </p>
        )}
        <button
          onClick={onDismiss}
          className="mt-5 w-full rounded-large bg-apple-blue py-3 text-[17px] font-normal tracking-[-0.374px] text-white active:bg-apple-blue/90"
        >
          好！
        </button>
      </div>
    </div>
  )
}
