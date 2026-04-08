import { useState } from 'react'
import { LogSheet } from '../../components/LogSheet'
import { Calendar } from '../../components/Calendar'
import { useLogStats } from '../../hooks/useLogStats'

export function Home() {
  const [showSheet, setShowSheet] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const { todayLogged, streak } = useLogStats()
  const [logged, setLogged] = useState(todayLogged)

  function handleSubmitted(fb: string) {
    setShowSheet(false)
    setLogged(true)
    setFeedback(fb)
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="flex flex-col min-h-svh">
      {/* Hero gradient */}
      <div className="bg-gradient-to-b from-[#ffe78b] to-white pt-14 px-5 pb-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-3xl font-black text-[#272727]">💩 LogLog</span>
          {streak > 0 && (
            <span className="text-xs font-bold bg-[#fffbee] border border-[#FFD73B] rounded-full px-3 py-1 text-[#F47900]">
              🔥 {streak} day streak
            </span>
          )}
        </div>

        {/* Main button */}
        <button
          onClick={() => !logged && setShowSheet(true)}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-sm ${
            logged
              ? 'bg-[#fffbee] border-2 border-[#FFD73B] text-[#272727] cursor-default'
              : 'bg-[#FFD73B] text-[#272727] active:scale-95'
          }`}
        >
          {logged ? '🎉 Today: Cleared!' : '📢 Tap to log today\'s movement!'}
        </button>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="mx-5 mt-3 px-4 py-3 bg-[#fffbee] border border-[#FFD73B] rounded-xl text-sm text-[#272727] font-medium text-center animate-pulse">
          {feedback}
        </div>
      )}

      {/* Calendar */}
      <div className="flex-1 pt-6">
        <p className="px-5 text-xs text-[#898989] font-medium mb-4 uppercase tracking-wider">
          This Month
        </p>
        <Calendar />
      </div>

      {/* Log sheet */}
      {showSheet && (
        <LogSheet onClose={() => setShowSheet(false)} onSubmitted={handleSubmitted} />
      )}
    </div>
  )
}
