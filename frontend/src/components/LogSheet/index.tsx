import { useState } from 'react'
import type { ShapeType, FeelingType, LogEntry, RewardAction } from '../../types'
import { logService } from '../../services/logService'
import { tokenService } from '../../services/tokenService'
import { useLogStats } from '../../hooks/useLogStats'

const SHAPES: { type: ShapeType; emoji: string; label: string; sub: string }[] = [
  { type: 'rabbit_pellets', emoji: '🟤', label: '羊粪蛋', sub: 'Type 1–2' },
  { type: 'twisted_rope',   emoji: '🟤', label: '麻花型', sub: 'Type 2'   },
  { type: 'banana_bro',     emoji: '🟠', label: '香蕉君', sub: '理想型 ⭐' },
  { type: 'soft_serve',     emoji: '🟢', label: '软软怪', sub: 'Type 5'   },
  { type: 'splash_zone',    emoji: '🟢', label: '喷溅体', sub: 'Type 6–7' },
]

const FEELINGS: { type: FeelingType; emoji: string; label: string }[] = [
  { type: 'effortless',           emoji: '💧', label: '畅快淋漓' },
  { type: 'could_have_been_more', emoji: '😐', label: '意犹未尽' },
  { type: 'hard_won',             emoji: '💪', label: '艰苦卓绝' },
]

const FEEDBACK: Record<ShapeType, string[]> = {
  banana_bro:     ['香蕉君驾到！今日通关，肠道鼓掌 🎉', '标准香蕉君出货，今日任务完成！🏆'],
  rabbit_pellets: ['羊粪蛋预警 💧 多喝水，通往畅通之路', '侦测到羊粪蛋，水分补给请加速！'],
  twisted_rope:   ['麻花型记录在案，事情在动，只是慢慢的 🐢'],
  soft_serve:     ['软软怪登场，今天肠道有点波动 🌀'],
  splash_zone:    ['喷溅体出没！好好休息，指挥官 🌊'],
}

const REWARD_DISPLAY: Record<RewardAction, { emoji: string; label: string; amount: number }> = {
  daily_log:           { emoji: '🪙', label: '每日记录',    amount: 1  },
  streak_3:            { emoji: '🔥', label: '3天连击',     amount: 3  },
  streak_7:            { emoji: '⚡', label: '7天连击',     amount: 7  },
  streak_30:           { emoji: '👑', label: '30天连击',    amount: 30 },
  first_ideal_shape:   { emoji: '🍌', label: '首次香蕉君',  amount: 5  },
  week_complete:       { emoji: '📅', label: '本周全勤',    amount: 10 },
  first_report_shared: { emoji: '📊', label: '首次分享周报', amount: 15 },
}

type RewardResult = { action: RewardAction; ok: boolean }

interface Props {
  onClose: () => void
  onSubmitted: (feedback: string) => void
}

export function LogSheet({ onClose, onSubmitted }: Props) {
  const [shape, setShape] = useState<ShapeType | null>(null)
  const [feeling, setFeeling] = useState<FeelingType | null>(null)
  const [phase, setPhase] = useState<'form' | 'loading' | 'result'>('form')
  const [pendingActions, setPendingActions] = useState<RewardAction[]>([])
  const [results, setResults] = useState<RewardResult[]>([])
  const { streak } = useLogStats()

  async function handleSubmit() {
    if (!shape || phase !== 'form') return

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      shape,
      feeling: feeling ?? undefined,
    }
    logService.saveEntry(entry)

    const newStreak = streak + 1
    const actions: RewardAction[] = ['daily_log']
    if (newStreak === 3)  actions.push('streak_3')
    if (newStreak === 7)  actions.push('streak_7')
    if (newStreak === 30) actions.push('streak_30')
    const bananaCount = logService.getEntries().filter(e => e.shape === 'banana_bro').length
    if (shape === 'banana_bro' && bananaCount === 1) actions.push('first_ideal_shape')

    setPendingActions(actions)
    setPhase('loading')

    const userId = 'placeholder'
    const apiResults: RewardResult[] = await Promise.all(
      actions.map(async a => ({
        action: a,
        ok: (await tokenService.dispatchReward(userId, a)) !== null,
      }))
    )

    setResults(apiResults)
    setPhase('result')
  }

  function handleConfirm() {
    if (!shape) return
    const lines = FEEDBACK[shape]
    onSubmitted(lines[Math.floor(Math.random() * lines.length)])
  }

  const successCount = results.filter(r => r.ok).reduce((sum, r) => sum + REWARD_DISPLAY[r.action].amount, 0)
  const allFailed = results.length > 0 && results.every(r => !r.ok)

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={phase === 'form' ? onClose : undefined}
      />

      {/* ── 填写表单（底部 sheet） ── */}
      {phase === 'form' && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-slide-up"
          style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-[#e5e5e5] rounded-full" />
          </div>
          <div className="px-5 pb-10 pt-2">
            <div className="text-center mb-6">
              <div className="text-3xl mb-1 animate-float">💩</div>
              <h2 className="font-black text-[#272727] text-xl">记录这次美妙的旅程</h2>
              <p className="text-xs text-[#aaa] mt-0.5">诚实作答，你的肠道感谢你</p>
            </div>

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

            <button
              onClick={handleSubmit}
              disabled={!shape}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all tap-scale ${
                shape
                  ? 'bg-[#FFD73B] text-[#272727] shadow-[0_4px_16px_rgba(255,215,59,0.45)]'
                  : 'bg-[#f0ede0] text-[#ccc]'
              }`}
            >
              ✅ 确认提交
            </button>
          </div>
        </div>
      )}

      {/* ── 领取中（居中 modal） ── */}
      {phase === 'loading' && (
        <div className="flex items-center justify-center h-full px-4">
          <div
            className="w-[340px] rounded-3xl bg-white animate-bounce-in"
            style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-8 flex flex-col items-center gap-5">
              <div className="text-5xl animate-spin-slow">💩</div>
              <div className="text-center">
                <p className="font-black text-[#272727] text-lg">正在领取代币</p>
                <p className="text-xs text-[#aaa] mt-1">等待后端确认中...</p>
              </div>
              <div className="w-full flex flex-col gap-2.5">
                {pendingActions.map(action => {
                  const d = REWARD_DISPLAY[action]
                  return (
                    <div
                      key={action}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl"
                      style={{ background: '#FAF6EE', border: '1px solid #EDE8D8' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{d.emoji}</span>
                        <span className="font-bold text-sm text-[#272727]">{d.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm" style={{ color: '#D48800' }}>+{d.amount} SHIT</span>
                        <div className="flex gap-0.5 items-center">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ background: '#FFD73B', animationDelay: `${i * 0.22}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 领取结果（居中 modal） ── */}
      {phase === 'result' && (
        <div className="flex items-center justify-center h-full px-4">
          <div
            className="w-[340px] rounded-3xl bg-white animate-bounce-in"
            style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-8 flex flex-col items-center gap-5">
              {allFailed ? (
                <>
                  <div className="text-5xl animate-bounce-in">😔</div>
                  <div className="text-center animate-bounce-in" style={{ animationDelay: '0.08s' }}>
                    <p className="font-black text-[#272727] text-lg">领取失败</p>
                    <p className="text-xs text-[#aaa] mt-1">网络异常，代币将在恢复后补发</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl animate-bounce-in">🎉</div>
                  <div className="text-center animate-bounce-in" style={{ animationDelay: '0.08s' }}>
                    <p className="font-black text-[#272727] text-lg">代币已到账！</p>
                    <p className="text-xs text-[#aaa] mt-1">感谢你的如实汇报</p>
                  </div>
                </>
              )}

              <div className="w-full flex flex-col gap-2.5">
                {results.map(({ action, ok }, i) => {
                  const d = REWARD_DISPLAY[action]
                  return (
                    <div
                      key={action}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl animate-bounce-in"
                      style={{
                        background: ok ? 'linear-gradient(135deg, #FFF8D6, #FFF3B0)' : '#F9F9F9',
                        border: ok ? '1.5px solid #FFE066' : '1.5px solid #E8E8E8',
                        animationDelay: `${i * 0.12}s`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl" style={{ opacity: ok ? 1 : 0.4 }}>{d.emoji}</span>
                        <span className="font-bold text-sm" style={{ color: ok ? '#272727' : '#ADADAD' }}>{d.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm" style={{ color: ok ? '#D48800' : '#ADADAD' }}>
                          {ok ? `+${d.amount} SHIT` : '失败'}
                        </span>
                        <span className="text-base">{ok ? '✅' : '❌'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {!allFailed && (
                <div
                  className="w-full flex items-center justify-center py-3.5 rounded-2xl animate-bounce-in"
                  style={{ background: '#272727', animationDelay: `${results.length * 0.12 + 0.1}s` }}
                >
                  <p className="font-black text-white text-base">合计 +{successCount} SHIT 💩</p>
                </div>
              )}

              <button
                onClick={handleConfirm}
                className="w-full py-4 rounded-2xl font-black text-lg tap-scale animate-bounce-in"
                style={{
                  background: allFailed ? '#F5F5F5' : '#FFD73B',
                  color: '#272727',
                  boxShadow: allFailed ? 'none' : '0 4px 16px rgba(255,215,59,0.45)',
                  animationDelay: `${results.length * 0.12 + 0.2}s`,
                }}
              >
                {allFailed ? '我知道了' : '好的！'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
