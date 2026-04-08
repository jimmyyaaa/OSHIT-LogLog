import { useState } from 'react'
import type { ShapeType, FeelingType, LogEntry } from '../../types'
import { logService } from '../../services/logService'
import { tokenService } from '../../services/tokenService'
import { useLogStats } from '../../hooks/useLogStats'

const SHAPES: { type: ShapeType; emoji: string; label: string }[] = [
  { type: 'rabbit_pellets', emoji: '🟤', label: 'Rabbit Pellets' },
  { type: 'twisted_rope',   emoji: '🟤', label: 'Twisted Rope' },
  { type: 'banana_bro',     emoji: '🟠', label: 'Banana Bro' },
  { type: 'soft_serve',     emoji: '🟢', label: 'Soft Serve' },
  { type: 'splash_zone',    emoji: '🟢', label: 'Splash Zone' },
]

const FEELINGS: { type: FeelingType; emoji: string; label: string }[] = [
  { type: 'effortless',          emoji: '💧', label: 'Effortless' },
  { type: 'could_have_been_more', emoji: '😐', label: 'Could\'ve Been More' },
  { type: 'hard_won',            emoji: '💪', label: 'Hard Won' },
]

const FEEDBACK: Record<ShapeType, string[]> = {
  banana_bro:     ['A textbook Banana Bro. Today\'s mission: complete. 🎉', 'Peak performance. The gut is pleased. 🏆'],
  rabbit_pellets: ['Rabbit Pellets detected. Water is the path to the light. 💧', 'Drink more water, commander. 💧'],
  twisted_rope:   ['Twisted Rope logged. Things are moving, just slowly.', 'Hydration advisory issued. 🚰'],
  soft_serve:     ['Soft Serve today. Keep an eye on it.', 'The gut requests a lighter diet. 🥗'],
  splash_zone:    ['Splash Zone logged. Rest up, commander.', 'Rough waters ahead. Take it easy. 🌊'],
}

interface Props {
  onClose: () => void
  onSubmitted: (feedback: string) => void
}

export function LogSheet({ onClose, onSubmitted }: Props) {
  const [shape, setShape] = useState<ShapeType | null>(null)
  const [feeling, setFeeling] = useState<FeelingType | null>(null)
  const { streak } = useLogStats()

  function handleSubmit() {
    if (!shape) return

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      shape,
      feeling: feeling ?? undefined,
    }

    logService.saveEntry(entry)

    // Dispatch token rewards (non-blocking)
    const userId = 'placeholder' // injected by parent platform in production
    tokenService.dispatchReward(userId, 'daily_log')
    if (streak + 1 === 3)  tokenService.dispatchReward(userId, 'streak_3')
    if (streak + 1 === 7)  tokenService.dispatchReward(userId, 'streak_7')
    if (streak + 1 === 30) tokenService.dispatchReward(userId, 'streak_30')
    if (shape === 'banana_bro') tokenService.dispatchReward(userId, 'first_ideal_shape')

    const lines = FEEDBACK[shape]
    const feedback = lines[Math.floor(Math.random() * lines.length)]
    onSubmitted(feedback)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl px-6 pt-6 pb-10 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        <h2 className="font-black text-[#272727] text-lg mb-6 text-center">
          Record this glorious journey
        </h2>

        {/* Shape selector */}
        <p className="text-xs text-[#898989] mb-3 font-medium">Shape <span className="text-[#F47900]">*</span></p>
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
          {SHAPES.map(s => (
            <button
              key={s.type}
              onClick={() => setShape(s.type)}
              className={`flex flex-col items-center gap-1 min-w-[64px] p-2 rounded-xl border transition-all ${
                shape === s.type
                  ? 'border-[#FFD73B] bg-[#fffbee]'
                  : 'border-[#fff6d5] bg-white'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-[10px] text-[#616161] font-medium text-center leading-tight">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Feeling selector */}
        <p className="text-xs text-[#898989] mb-3 font-medium">Feeling</p>
        <div className="flex gap-3 mb-8">
          {FEELINGS.map(f => (
            <button
              key={f.type}
              onClick={() => setFeeling(feeling === f.type ? null : f.type)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                feeling === f.type
                  ? 'border-[#FFD73B] bg-[#fffbee] text-[#272727]'
                  : 'border-[#fff6d5] bg-white text-[#616161]'
              }`}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!shape}
          className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: shape ? '#FFD73B' : '#e5e5e5', color: '#272727' }}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
