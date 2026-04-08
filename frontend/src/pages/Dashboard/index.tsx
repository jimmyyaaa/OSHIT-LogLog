import { MetricCard } from '../../components/MetricCard'
import { useLogStats } from '../../hooks/useLogStats'

export function Dashboard() {
  const { weekSmoothnessIndex, trend, monthBananaBroRate, streak } = useLogStats()

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-4">
      <h1 className="font-black text-[#272727] text-xl mb-2">My Gut Dashboard</h1>

      {/* Weekly Smoothness Index */}
      <MetricCard title="Weekly Smoothness Index">
        <div className="flex items-end gap-2">
          <span className="font-black text-4xl text-[#272727]">
            {weekSmoothnessIndex !== null ? `${weekSmoothnessIndex}%` : '--'}
          </span>
          <span className="text-2xl mb-1 text-[#F47900]">{trend}</span>
        </div>
        <p className="text-xs text-[#898989] mt-1">Ideal logs / total logs this week</p>
      </MetricCard>

      {/* Monthly Banana Bro Rate */}
      <MetricCard title="Monthly Banana Bro Rate">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff6d5" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#FFD73B"
                strokeWidth="3"
                strokeDasharray={`${monthBananaBroRate} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-black text-sm text-[#272727]">
              {monthBananaBroRate}%
            </span>
          </div>
          <p className="text-xs text-[#898989]">
            {monthBananaBroRate >= 50
              ? 'Gut systems stable. Keep it up! 🎉'
              : monthBananaBroRate > 0
              ? 'Room for improvement. Drink more water. 💧'
              : 'No data yet this month.'}
          </p>
        </div>
      </MetricCard>

      {/* Current Streak */}
      <MetricCard title="Current Streak">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔥</span>
          <div>
            <span className="font-black text-4xl text-[#272727]">{streak}</span>
            <span className="text-[#898989] text-sm font-medium ml-1">days</span>
          </div>
        </div>
        {streak >= 3 && (
          <p className="text-xs text-[#F47900] font-bold mt-2">
            {streak >= 30 ? '🏆 Legendary!' : streak >= 7 ? '⭐ On a roll!' : '💪 Nice streak!'}
          </p>
        )}
      </MetricCard>
    </div>
  )
}
