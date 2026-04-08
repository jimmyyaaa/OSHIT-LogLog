import { logService } from '../../services/logService'
import { useLogStats } from '../../hooks/useLogStats'
import type { ShapeType } from '../../types'
import { tokenService } from '../../services/tokenService'

const SHAPE_LABEL: Record<ShapeType, string> = {
  banana_bro:     'Banana Bro',
  rabbit_pellets: 'Rabbit Pellets',
  twisted_rope:   'Twisted Rope',
  soft_serve:     'Soft Serve',
  splash_zone:    'Splash Zone',
}

function generateReport() {
  const now = Date.now()
  const weekStart = now - 7 * 24 * 60 * 60 * 1000
  const entries = logService.getEntriesInRange(weekStart, now)

  const shapeCounts: Partial<Record<ShapeType, number>> = {}
  for (const e of entries) {
    shapeCounts[e.shape] = (shapeCounts[e.shape] ?? 0) + 1
  }

  const total = entries.length
  const ideal = shapeCounts['banana_bro'] ?? 0
  const smoothness = total > 0 ? Math.round((ideal / total) * 100) : 0

  const dominantShape = Object.entries(shapeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as ShapeType | undefined

  let diagnosis = 'No data this week. The gut waits for no one.'
  let suggestion = 'Start logging to track your gut health.'

  if (total > 0) {
    if (smoothness >= 50) {
      diagnosis = `Banana Bro appeared ${ideal} time${ideal !== 1 ? 's' : ''}. Gut systems: stable.`
      suggestion = 'Keep up the water intake and regular meals.'
    } else if (dominantShape === 'rabbit_pellets' || dominantShape === 'twisted_rope') {
      diagnosis = 'Signs of low hydration. Things are moving slowly.'
      suggestion = 'Try drinking a glass of water first thing in the morning.'
    } else {
      diagnosis = 'Your gut had a rough week. Take it easy.'
      suggestion = 'Consider lighter meals and reduce stress if possible.'
    }
  }

  const shapeLines = Object.entries(shapeCounts)
    .map(([shape, count]) => `${SHAPE_LABEL[shape as ShapeType]} ×${count}`)
    .join('  |  ')

  return { total, smoothness, shapeLines, diagnosis, suggestion }
}

export function Profile() {
  const { streak } = useLogStats()
  const allEntries = logService.getEntries()
  const memberDays = allEntries.length > 0
    ? Math.ceil((Date.now() - allEntries[0].timestamp) / (24 * 60 * 60 * 1000))
    : 0

  function handleGenerateReport() {
    const report = generateReport()
    const text = [
      '📊 Weekly Gut Chronicles',
      '',
      `Total logs: ${report.total}`,
      report.shapeLines || '—',
      `Smoothness Index: ${report.smoothness}%`,
      '',
      `📋 ${report.diagnosis}`,
      '',
      `💡 ${report.suggestion}`,
    ].join('\n')

    // Share via Web Share API, fallback to clipboard
    if (navigator.share) {
      navigator.share({ text })
      tokenService.dispatchReward('placeholder', 'first_report_shared')
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Report copied to clipboard!'))
    }
  }

  function handleExport() {
    const data = JSON.stringify(logService.getEntries(), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'loglog-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-5 pt-8 pb-10">
      {/* Header */}
      <div className="mb-8">
        <p className="font-black text-[#272727] text-xl">💩 My Profile</p>
        <p className="text-xs text-[#898989] mt-1">
          {memberDays > 0 ? `Member for ${memberDays} day${memberDays !== 1 ? 's' : ''}` : 'Welcome!'}
          {streak > 0 && `  ·  🔥 ${streak} day streak`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleGenerateReport}
          className="w-full py-4 rounded-2xl font-black text-base bg-[#FFD73B] text-[#272727] active:scale-95 transition-all"
        >
          🚀 Generate Weekly Report
        </button>

        <button
          onClick={handleExport}
          className="w-full py-4 rounded-2xl font-bold text-sm bg-white border border-[#fff6d5] text-[#272727] active:scale-95 transition-all"
        >
          📤 Export My Data
        </button>

        <div className="mt-4 flex flex-col gap-0 rounded-xl border border-[#fff6d5] overflow-hidden">
          {[
            { icon: '🔒', label: 'Privacy Policy', sub: 'All data is stored locally on your device.' },
            { icon: '💡', label: 'Health Tips Library', sub: 'Coming soon' },
            { icon: '📮', label: 'Feedback', sub: 'Tell us what you think' },
            { icon: 'ℹ️', label: 'About LogLog', sub: 'Give a SHIT to myself' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#fff6d5] last:border-b-0">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-[#272727]">{item.label}</p>
                <p className="text-xs text-[#898989]">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-[#858585] mt-6">
          ©2025 All SHIT Reserved
        </p>
      </div>
    </div>
  )
}
