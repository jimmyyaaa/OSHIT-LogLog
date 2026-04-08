import { useState } from 'react'
import type { ShapeType, FeelingType, LogEntry } from '../../types'
import { logService } from '../../services/logService'
import { tokenService } from '../../services/tokenService'
import { useLogStats } from '../../hooks/useLogStats'

const SHAPES: { type: ShapeType; emoji: string; label: string; sub: string; color: string }[] = [
  { type: 'rabbit_pellets', emoji: '🟤', label: '羊粪蛋',  sub: 'Type 1–2', color: '#8B5E3C' },
  { type: 'twisted_rope',   emoji: '🟤', label: '麻花型',  sub: 'Type 2',   color: '#9B6B45' },
  { type: 'banana_bro',     emoji: '🟠', label: '香蕉君',  sub: '理想型 ⭐', color: '#F47900' },
  { type: 'soft_serve',     emoji: '🟢', label: '软软怪',  sub: 'Type 5',   color: '#4A8C3F' },
  { type: 'splash_zone',    emoji: '🟢', label: '喷溅体',  sub: 'Type 6–7', color: '#2E7D32' },
]

const FEELINGS: { type: FeelingType; emoji: string; label: string }[] = [
  { type: 'effortless',           emoji: '💧', label: '畅快淋漓' },
  { type: 'could_have_been_more', emoji: '😐', label: '意犹未尽' },
  { type: 'hard_won',             emoji: '💪', label: '艰苦卓绝' },
]

const FEEDBACK: Record<ShapeType, string[]> = {
  banana_bro:     ['香蕉君驾到！今日通关，肠道鼓掌 🎉', '标准香蕉君出货，今日任务完成！🏆', '完美！您的肠道今天在微笑 ✨'],
  rabbit_pellets: ['羊粪蛋预警 💧 多喝水，通往畅通之路', '侦测到羊粪蛋，水分补给请加速！'],
  twisted_rope:   ['麻花型记录在案，事情在动，只是慢慢的 🐢', '前进中，只是姿势有点复杂'],
  soft_serve:     ['软软怪登场，今天肠道有点波动 🌀', '注意饮食，关注一下哦'],
  splash_zone:    ['喷溅体出没！好好休息，指挥官 🌊', '风浪有点大，今天肠道辛苦了'],
}

interface Props {
  onClose: () => void
  onSubmitted: (feedback: string) => void
}

export function LogSheet({ onClose, onSubmitted }: Props) {
  const [shape, setShape] = useState<ShapeType | null>(null)
  const [feeling, setFeeling] = useState<FeelingType | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { streak } = useLogStats()

  async function handleSubmit() {
    if (!shape || submitting) return
    setSubmitting(true)

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      shape,
      feeling: feeling ?? undefined,
    }

    logService.saveEntry(entry)

    const userId = 'placeholder'
    tokenService.dispatchReward(userId, 'daily_log')
    if (streak + 1 === 3)  tokenService.dispatchReward(userId, 'streak_3')
    if (streak + 1 === 7)  tokenService.dispatchReward(userId, 'streak_7')
    if (streak + 1 === 30) tokenService.dispatchReward(userId, 'streak_30')
    if (shape === 'banana_bro') tokenService.dispatchReward(userId, 'first_ideal_shape')

    const lines = FEEDBACK[shape]
    onSubmitted(lines[Math.floor(Math.random() * lines.length)])
  }

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-slide-up"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#e5e5e5] rounded-full" />
        </div>

        <div className="px-5 pb-10 pt-2">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-1 animate-float">💩</div>
            <h2 className="font-black text-[#272727] text-xl">记录这次美妙的旅程</h2>
            <p className="text-xs text-[#aaa] mt-0.5">诚实作答，你的肠道感谢你</p>
          </div>

          {/* Shape selector */}
          <div className="mb-5">
            <p className="text-xs font-bold text-[#272727] mb-2 uppercase tracking-wider">
              形态 <span className="text-[#F47900]">必填</span>
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
              {SHAPES.map(s => (
                <button
                  key={s.type}
                  onClick={() => setShape(s.type)}
                  className={`flex-shrink-0 snap-start flex flex-col items-center gap-1 w-[68px] py-3 px-1 rounded-2xl border-2 transition-all tap-scale ${
                    shape === s.type
                      ? 'border-[#FFD73B] bg-[#fffbee] shadow-[0_2px_12px_rgba(255,215,59,0.3)]'
                      : 'border-[#f0ede0] bg-[#fafaf7]'
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-[11px] font-bold text-[#272727] text-center leading-tight">{s.label}</span>
                  <span className="text-[9px] text-[#aaa] text-center leading-tight">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feeling selector */}
          <div className="mb-7">
            <p className="text-xs font-bold text-[#272727] mb-2 uppercase tracking-wider">
              感受 <span className="text-[#aaa] font-medium">选填</span>
            </p>
            <div className="flex gap-2">
              {FEELINGS.map(f => (
                <button
                  key={f.type}
                  onClick={() => setFeeling(feeling === f.type ? null : f.type)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all tap-scale ${
                    feeling === f.type
                      ? 'border-[#FFD73B] bg-[#fffbee]'
                      : 'border-[#f0ede0] bg-[#fafaf7]'
                  }`}
                >
                  <span className="text-xl">{f.emoji}</span>
                  <span className="text-[10px] font-bold text-[#272727]">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!shape || submitting}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all tap-scale ${
              shape && !submitting
                ? 'bg-[#FFD73B] text-[#272727] shadow-[0_4px_16px_rgba(255,215,59,0.45)]'
                : 'bg-[#f0ede0] text-[#ccc]'
            }`}
          >
            {submitting ? '记录中...' : '✅ 确认提交'}
          </button>
        </div>
      </div>
    </div>
  )
}
