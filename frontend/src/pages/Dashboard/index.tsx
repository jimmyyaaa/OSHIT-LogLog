import { MetricCard } from '../../components/MetricCard'
import { useLogStats } from '../../hooks/useLogStats'

const MILESTONE_DATA: Record<number, { label: string; emoji: string }> = {
  3:  { label: '三日通畅', emoji: '🌱' },
  7:  { label: '七日勇士', emoji: '⚡' },
  30: { label: '月度传说', emoji: '👑' },
}

function CircularProgress({ value }: { value: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#fff0c0" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="#FFD73B"
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-2xl text-[#272727]">{value}%</span>
        <span className="text-[10px] text-[#aaa] font-bold">香蕉君</span>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { weekSmoothnessIndex, trend, monthBananaBroRate, streak } = useLogStats()

  const trendColor = trend === '↑' ? '#2E7D32' : trend === '↓' ? '#C62828' : '#898989'
  const trendBg = trend === '↑' ? '#e8f5e9' : trend === '↓' ? '#ffebee' : '#f5f5f5'

  const nextMilestone = [3, 7, 30].find(m => m > streak)
  const progressToNext = nextMilestone
    ? Math.round((streak / nextMilestone) * 100)
    : 100

  return (
    <div className="px-5 pt-6 pb-12 flex flex-col gap-4">
      {/* Header */}
      <div className="mb-1">
        <h1 className="font-black text-[#272727] text-2xl">我的健康仪表盘</h1>
        <p className="text-xs text-[#aaa] font-medium mt-0.5">数据来自你的日常记录</p>
      </div>

      {/* Smoothness Index */}
      <MetricCard title="本周通畅指数" emoji="📈" accent>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-end gap-2">
              <span className="font-black text-5xl text-[#272727]">
                {weekSmoothnessIndex !== null ? weekSmoothnessIndex : '--'}
              </span>
              {weekSmoothnessIndex !== null && (
                <span className="font-black text-2xl text-[#7a5c00] mb-1">%</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-black"
                style={{ color: trendColor, background: trendBg }}
              >
                {trend} {trend === '↑' ? '好转' : trend === '↓' ? '下降' : '持平'}
              </span>
              <span className="text-[10px] text-[#7a5c00]">较上周</span>
            </div>
          </div>
          <div className="text-5xl animate-float">
            {weekSmoothnessIndex === null ? '💭'
              : weekSmoothnessIndex >= 60 ? '😎'
              : weekSmoothnessIndex >= 30 ? '😐'
              : '😅'}
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-[#FFD73B]/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#7a5c00]/40 transition-all duration-700"
            style={{ width: `${weekSmoothnessIndex ?? 0}%` }}
          />
        </div>
      </MetricCard>

      {/* Monthly Banana Bro */}
      <MetricCard title="本月香蕉君占比" emoji="🍌">
        <div className="flex items-center gap-5">
          <CircularProgress value={monthBananaBroRate} />
          <div className="flex-1">
            <p className="font-black text-[#272727] text-base leading-snug">
              {monthBananaBroRate >= 60
                ? '肠道运行稳定 🎉'
                : monthBananaBroRate >= 30
                ? '还有提升空间 💡'
                : monthBananaBroRate > 0
                ? '需要关注一下 💧'
                : '暂无数据'}
            </p>
            <p className="text-xs text-[#aaa] mt-1 leading-relaxed">
              {monthBananaBroRate >= 60
                ? '继续保持饮食规律和水分摄入'
                : '多喝水、多吃纤维，香蕉君会来的'}
            </p>
          </div>
        </div>
      </MetricCard>

      {/* Streak */}
      <MetricCard title="连续打卡" emoji="🔥">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-end gap-2">
            <span className="font-black text-5xl text-[#272727]">{streak}</span>
            <span className="font-bold text-[#aaa] text-base mb-1">天</span>
          </div>
          <div className="text-right">
            {Object.entries(MILESTONE_DATA)
              .filter(([days]) => streak >= Number(days))
              .map(([days, data]) => (
                <div key={days} className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-[#fffbee] border border-[#FFD73B]">
                  <span className="text-sm">{data.emoji}</span>
                  <span className="text-[10px] font-black text-[#F47900]">{data.label}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div>
            <div className="flex justify-between text-[10px] text-[#aaa] font-medium mb-1">
              <span>距离 {MILESTONE_DATA[nextMilestone]?.emoji} {MILESTONE_DATA[nextMilestone]?.label}</span>
              <span>还差 {nextMilestone - streak} 天</span>
            </div>
            <div className="h-2 bg-[#f0ede0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressToNext}%`,
                  background: 'linear-gradient(90deg, #FFD73B, #F47900)',
                }}
              />
            </div>
          </div>
        )}

        {streak >= 30 && (
          <p className="text-xs font-black text-[#F47900] mt-2 text-center animate-pulse">
            👑 传说级！你的肠道已成精
          </p>
        )}
      </MetricCard>
    </div>
  )
}
