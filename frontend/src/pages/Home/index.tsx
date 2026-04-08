import { useState, useEffect } from 'react'
import { LogSheet } from '../../components/LogSheet'
import { Calendar } from '../../components/Calendar'
import { useLogStats } from '../../hooks/useLogStats'

const DAILY_TIPS = [
  '💡 每天喝够 8 杯水，香蕉君才会准时赴约',
  '💡 规律作息是肠道的最佳朋友',
  '💡 膳食纤维是你的隐藏队友，多吃蔬菜水果',
  '💡 运动促进肠胃蠕动，哪怕只是饭后散步',
  '💡 压力大？肠道也知道。深呼吸一下',
  '💡 益生菌是肠道的小卫士，酸奶了解一下',
]

const CONFETTI = ['💩', '⭐', '✨', '🎉', '🌟', '💛']

export function Home() {
  const [showSheet, setShowSheet] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [logged, setLogged] = useState(false)
  const { todayLogged, streak } = useLogStats()
  const [tip] = useState(() => DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)])

  useEffect(() => {
    setLogged(todayLogged)
  }, [todayLogged])

  function handleSubmitted(fb: string) {
    setShowSheet(false)
    setLogged(true)
    setFeedback(fb)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
    setTimeout(() => setFeedback(null), 4000)
  }

  const newStreak = streak + (logged ? 0 : 0)

  return (
    <div className="flex flex-col min-h-[calc(100svh-49px)]">

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `confetti-fall ${0.8 + Math.random() * 0.8}s ease-in ${Math.random() * 0.4}s forwards`,
              }}
            >
              {CONFETTI[Math.floor(Math.random() * CONFETTI.length)]}
            </div>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div
        className="relative px-5 pt-8 pb-8 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #ffe78b 0%, #fff9e6 60%, #fafaf7 100%)' }}
      >
        {/* Decorative bg text */}
        <div
          className="absolute right-0 top-0 font-black text-[80px] leading-none select-none pointer-events-none"
          style={{ color: 'rgba(255,215,59,0.2)', transform: 'rotate(15deg) translate(10px,-10px)' }}
        >
          💩
        </div>

        {/* Streak badge */}
        {newStreak > 0 && (
          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 border border-[#FFD73B]">
            <span className="text-base">🔥</span>
            <span className="font-black text-sm text-[#F47900]">连续 {newStreak} 天</span>
          </div>
        )}

        <h1 className="font-black text-[#272727] text-2xl leading-tight mb-1">
          {logged ? '今日任务完成！' : '今天，出货了吗？'}
        </h1>
        <p className="text-sm text-[#898989] font-medium mb-6">
          {logged ? '肠道健康，继续保持 💪' : '诚实记录，你的肠道谢谢你'}
        </p>

        {/* Main CTA Button */}
        <button
          onClick={() => !logged && setShowSheet(true)}
          disabled={logged}
          className={`relative w-full py-5 rounded-3xl font-black text-xl transition-all ${
            logged
              ? 'cursor-default'
              : 'tap-scale animate-pulse-ring'
          }`}
          style={logged
            ? {
                background: 'linear-gradient(135deg, #fffbee, #fff3c0)',
                color: '#F47900',
                border: '2px solid #FFD73B',
              }
            : {
                background: 'linear-gradient(135deg, #FFD73B, #F5C800)',
                color: '#272727',
                boxShadow: '0 6px 24px rgba(255,215,59,0.5), 0 2px 8px rgba(0,0,0,0.1)',
              }
          }
        >
          {logged ? (
            <span className="animate-bounce-in inline-block">🎉 今日已畅通！</span>
          ) : (
            <span>📢 点击记录今日大事！</span>
          )}
        </button>

        {/* Feedback toast */}
        {feedback && (
          <div className="mt-4 px-4 py-3 bg-white rounded-2xl border border-[#FFD73B] animate-bounce-in"
            style={{ boxShadow: '0 4px 16px rgba(255,215,59,0.2)' }}
          >
            <p className="text-sm font-bold text-[#272727] text-center">{feedback}</p>
          </div>
        )}
      </div>

      {/* Daily tip */}
      <div className="mx-5 mt-4 px-4 py-3 rounded-2xl bg-white border border-[#fff0c0] flex items-start gap-2">
        <span className="text-base shrink-0 mt-0.5">🌿</span>
        <p className="text-xs font-medium text-[#616161] leading-relaxed">{tip}</p>
      </div>

      {/* Calendar */}
      <div className="mt-6 flex-1">
        <Calendar />
      </div>

      {/* Log Sheet */}
      {showSheet && (
        <LogSheet onClose={() => setShowSheet(false)} onSubmitted={handleSubmitted} />
      )}
    </div>
  )
}
