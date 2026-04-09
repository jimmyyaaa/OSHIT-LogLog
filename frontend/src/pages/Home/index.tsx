import { useState, useEffect } from 'react'
import { LogSheet } from '../../components/LogSheet'
import { Calendar } from '../../components/Calendar'
import { useLogStats } from '../../hooks/useLogStats'

const CONFETTI = ['💩', '⭐', '✨', '🎉', '🌟', '💛']

const DAILY_TIPS = [
  '💡 每天喝够 8 杯水，香蕉君才会准时赴约',
  '💡 规律作息是肠道的最佳朋友',
  '💡 膳食纤维是你的隐藏队友，多吃蔬菜水果',
  '💡 运动促进肠胃蠕动，哪怕只是饭后散步',
  '💡 压力大？肠道也知道。深呼吸一下',
]

export function Home() {
  const [showSheet, setShowSheet] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [logged, setLogged] = useState(false)
  const { todayLogged, streak } = useLogStats()
  const [tip] = useState(() => DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)])

  useEffect(() => { setLogged(todayLogged) }, [todayLogged])

  function handleSubmitted(fb: string) {
    setShowSheet(false)
    setLogged(true)
    setFeedback(fb)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
    setTimeout(() => setFeedback(null), 4000)
  }

  return (
    <div className="flex flex-col min-h-[calc(100svh-49px)]" style={{ background: 'linear-gradient(180deg, #ffe78b 0%, #fafaf7 40%)' }}>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="absolute text-2xl" style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animation: `confetti-fall ${0.8 + Math.random() * 0.8}s ease-in ${Math.random() * 0.4}s forwards`,
            }}>
              {CONFETTI[Math.floor(Math.random() * CONFETTI.length)]}
            </div>
          ))}
        </div>
      )}

      {/* Top info strip */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <p className="font-black text-[#241c10] text-xl leading-tight">LogLog</p>
          <p className="text-xs font-medium text-[#7b7b7b]">今日大事，记录了吗？</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 border border-[#FFD73B]/50">
            <span className="text-sm">🔥</span>
            <span className="font-black text-sm text-[#F47900]">{streak} 天</span>
          </div>
        )}
      </div>

      {/* CENTER: Big Button */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">

        {/* Main CTA */}
        <button
          onClick={() => !logged && setShowSheet(true)}
          disabled={logged}
          className={`relative w-full rounded-3xl transition-all ${logged ? 'cursor-default' : 'tap-scale'}`}
          style={logged ? {
            background: 'linear-gradient(135deg, #fffbee, #fff3c0)',
            border: '2.5px solid #FFD73B',
            padding: '36px 24px',
          } : {
            background: 'linear-gradient(135deg, #FFD73B 0%, #F5C800 100%)',
            boxShadow: '0 8px 32px rgba(255,215,59,0.5), 0 2px 8px rgba(0,0,0,0.08)',
            padding: '36px 24px',
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className={`text-6xl ${logged ? '' : 'animate-float'}`}>💩</span>
            <p className={`font-black text-xl text-center leading-tight ${logged ? 'text-[#F47900]' : 'text-[#241c10]'}`}>
              {logged ? '🎉 今日已畅通！' : '点击记录今日大事！'}
            </p>
            {!logged && (
              <p className="text-sm font-medium text-[#7a5c00] opacity-70">
                你的肠道在等你
              </p>
            )}
          </div>
          {/* Pulse ring when not logged */}
          {!logged && (
            <div className="absolute inset-0 rounded-3xl animate-pulse-ring pointer-events-none" />
          )}
        </button>

        {/* Feedback / tip */}
        {feedback ? (
          <div className="w-full px-4 py-3 bg-white rounded-2xl border border-[#FFD73B] animate-bounce-in text-center"
            style={{ boxShadow: '0 4px 16px rgba(255,215,59,0.2)' }}>
            <p className="text-sm font-bold text-[#272727]">{feedback}</p>
          </div>
        ) : (
          <div className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 flex items-start gap-2">
            <span className="text-base shrink-0">🌿</span>
            <p className="text-xs font-medium text-[#616161] leading-relaxed">{tip}</p>
          </div>
        )}
      </div>

      {/* BOTTOM: Calendar card */}
      <div
        className="rounded-t-[30px] bg-white/90 shadow-[0px_-4px_6px_0px_rgba(0,0,0,0.05)] pt-5"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center justify-between px-6 mb-3">
          <p className="font-black text-[#241c10] text-base">本月记录</p>
          <p className="text-xs text-[#aaa] font-medium">💩 = 已打卡</p>
        </div>
        <Calendar />
      </div>

      {showSheet && (
        <LogSheet onClose={() => setShowSheet(false)} onSubmitted={handleSubmitted} />
      )}
    </div>
  )
}
