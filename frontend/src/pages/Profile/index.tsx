import type { ShapeType } from '../../types'
import { logService } from '../../services/logService'
import { tokenService } from '../../services/tokenService'
import { useLogStats } from '../../hooks/useLogStats'

const SHAPE_LABEL: Record<ShapeType, string> = {
  banana_bro:     '🟠 香蕉君',
  rabbit_pellets: '🟤 羊粪蛋',
  twisted_rope:   '🟤 麻花型',
  soft_serve:     '🟢 软软怪',
  splash_zone:    '🟢 喷溅体',
}

function generateReport() {
  const now = Date.now()
  const weekStart = now - 7 * 24 * 60 * 60 * 1000
  const entries = logService.getEntriesInRange(weekStart, now)

  const shapeCounts: Partial<Record<ShapeType, number>> = {}
  for (const e of entries) shapeCounts[e.shape] = (shapeCounts[e.shape] ?? 0) + 1

  const total = entries.length
  const ideal = shapeCounts['banana_bro'] ?? 0
  const smoothness = total > 0 ? Math.round((ideal / total) * 100) : 0
  const dominant = (Object.entries(shapeCounts).sort((a, b) => b[1] - a[1])[0]?.[0]) as ShapeType | undefined

  let diagnosis = '本周暂无数据。肠道在等你。'
  let suggestion = '开始记录，掌握你的肠道规律。'

  if (total > 0) {
    if (smoothness >= 50) {
      diagnosis = `香蕉君本周出现 ${ideal} 次，肠道运行平稳。`
      suggestion = '保持规律饮食和充足水分。'
    } else if (dominant === 'rabbit_pellets' || dominant === 'twisted_rope') {
      diagnosis = '羊粪蛋/麻花型占主导，水分摄入可能不足。'
      suggestion = '每天早晨起床先喝一杯温水。'
    } else {
      diagnosis = '本周肠道状态有些波动，注意休息。'
      suggestion = '清淡饮食，减少压力，多休息。'
    }
  }

  const shapeLines = Object.entries(shapeCounts)
    .map(([s, c]) => `${SHAPE_LABEL[s as ShapeType]} ×${c}`)
    .join('  ')

  return { total, smoothness, shapeLines, diagnosis, suggestion }
}

const MENU_ITEMS = [
  { icon: '📤', label: '导出我的数据', sub: '将记录打包为本地文件', action: 'export' },
  { icon: '🔒', label: '隐私说明', sub: '所有数据仅存储在你的设备上', action: 'privacy' },
  { icon: '💡', label: '健康小贴士库', sub: '趣味肠道健康知识', action: 'tips' },
  { icon: '📮', label: '反馈与建议', sub: '告诉我们你的想法', action: 'feedback' },
  { icon: 'ℹ️', label: '关于 LogLog', sub: 'Give a SHIT to myself', action: 'about' },
]

export function Profile() {
  const { streak } = useLogStats()
  const allEntries = logService.getEntries()
  const memberDays = allEntries.length > 0
    ? Math.ceil((Date.now() - allEntries[0].timestamp) / (24 * 60 * 60 * 1000))
    : 0

  function handleReport() {
    const r = generateReport()
    const text = [
      '📊 如厕风云周报',
      '─────────────────',
      `📅 本周记录次数：${r.total} 次`,
      r.shapeLines || '（暂无数据）',
      `✅ 通畅指数：${r.smoothness}%`,
      '',
      `📋 诊断：${r.diagnosis}`,
      `💡 建议：${r.suggestion}`,
      '─────────────────',
      '🌿 LogLog · Give a SHIT to myself',
    ].join('\n')

    if (navigator.share) {
      navigator.share({ text })
      tokenService.dispatchReward('placeholder', 'first_report_shared')
    } else {
      navigator.clipboard.writeText(text).then(() => alert('周报已复制到剪贴板！'))
    }
  }

  function handleExport() {
    const data = JSON.stringify(logService.getEntries(), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `loglog-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleAction(action: string) {
    if (action === 'export') handleExport()
    else if (action === 'privacy') alert('✅ 你的所有数据都存储在本设备的浏览器中，我们无法访问你的任何记录。')
    else if (action === 'tips') alert('💡 健康小贴士库即将上线，敬请期待！')
    else if (action === 'feedback') alert('📮 请发邮件至 hello@loglog.app，感谢你的建议！')
    else if (action === 'about') alert('💩 LogLog\nGive a SHIT to myself\n\n让每一次如厕，都成为一次对自己的微小关怀。\n\n© 2025 All SHIT Reserved')
  }

  return (
    <div className="px-5 pt-6 pb-16">

      {/* Profile card */}
      <div
        className="rounded-3xl p-5 mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFD73B 0%, #F5C800 100%)',
          boxShadow: '0 6px 24px rgba(255,215,59,0.4)',
        }}
      >
        <div className="absolute right-4 top-4 text-6xl opacity-20 animate-spin-slow select-none">💩</div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center text-3xl">
            💩
          </div>
          <div>
            <p className="font-black text-[#272727] text-xl">忠实的记录者</p>
            <p className="text-xs font-bold text-[#7a5c00]">
              建档 {memberDays} 天 · 共 {allEntries.length} 次记录
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 bg-white/30 rounded-xl p-3 text-center">
            <p className="font-black text-[#272727] text-xl">{allEntries.length}</p>
            <p className="text-[10px] font-bold text-[#7a5c00]">总记录</p>
          </div>
          <div className="flex-1 bg-white/30 rounded-xl p-3 text-center">
            <p className="font-black text-[#272727] text-xl">{streak}</p>
            <p className="text-[10px] font-bold text-[#7a5c00]">连续天数</p>
          </div>
          <div className="flex-1 bg-white/30 rounded-xl p-3 text-center">
            <p className="font-black text-[#272727] text-xl">{memberDays}</p>
            <p className="text-[10px] font-bold text-[#7a5c00]">建档天数</p>
          </div>
        </div>
      </div>

      {/* Weekly Report CTA */}
      <button
        onClick={handleReport}
        className="w-full py-5 rounded-2xl font-black text-lg text-[#272727] mb-5 tap-scale relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #272727 0%, #3a3a3a 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: '#FFD73B',
        }}
      >
        <span className="relative z-10">🚀 生成「如厕风云周报」</span>
      </button>

      {/* Menu list */}
      <div className="rounded-2xl overflow-hidden border border-[#fff0c0] bg-white"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        {MENU_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => handleAction(item.action)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left tap-scale border-b border-[#fff0c0] last:border-b-0 active:bg-[#fffbee] transition-colors"
          >
            <span className="text-2xl w-8 text-center shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#272727]">{item.label}</p>
              <p className="text-xs text-[#aaa] mt-0.5">{item.sub}</p>
            </div>
            <span className="text-[#ddd] text-lg">›</span>
          </button>
        ))}
      </div>

      <p className="text-center text-[10px] text-[#ccc] mt-8 font-medium">
        💩 © 2025 All SHIT Reserved
      </p>
    </div>
  )
}
