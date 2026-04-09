import { useState, useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { ShapeType } from '../../types'
import { logService } from '../../services/logService'
import { tokenService } from '../../services/tokenService'
import { useLogStats } from '../../hooks/useLogStats'

// ─── constants ───────────────────────────────────────────────────────────────

const SHAPE_LABEL: Record<ShapeType, string> = {
  banana_bro: '🟠 香蕉君', rabbit_pellets: '🟤 羊粪蛋',
  twisted_rope: '🟤 麻花型', soft_serve: '🟢 软软怪', splash_zone: '🟢 喷溅体',
}

const FIRST_SHARED_KEY = 'loglog_first_report_shared'

const MENU_ITEMS = [
  { icon: '📤', label: '导出我的数据', sub: '将记录打包为本地文件', action: 'export' as const },
  { icon: '🔒', label: '隐私说明', sub: '所有数据仅存储在你的设备上', action: 'privacy' as const },
  { icon: '💡', label: '健康小贴士库', sub: '趣味肠道健康知识', action: 'tips' as const },
  { icon: '📮', label: '反馈与建议', sub: '告诉我们你的想法', action: 'feedback' as const },
  { icon: 'ℹ️', label: '关于 LogLog', sub: 'Give a SHIT to myself', action: 'about' as const },
]

const TIPS = [
  { icon: '💧', text: '每天喝够 8 杯水（约 2L），让肠道保持水润' },
  { icon: '🥦', text: '膳食纤维是你的隐藏队友，多吃蔬菜水果全谷物' },
  { icon: '🏃', text: '运动促进肠胃蠕动，哪怕只是饭后散步 15 分钟' },
  { icon: '😴', text: '规律作息是肠道的最佳朋友，尽量固定起床时间' },
  { icon: '🧘', text: '压力大？肠道也知道。深呼吸、冥想有助于放松' },
  { icon: '☕', text: '早晨一杯温水可以唤醒沉睡的肠道' },
  { icon: '🍌', text: '香蕉、燕麦、酸奶是肠道三大好朋友' },
  { icon: '🚫', text: '少吃油炸、辛辣食物，你的肠道会感谢你' },
]

// ─── helpers ─────────────────────────────────────────────────────────────────

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

  const shapeEntries = Object.entries(shapeCounts) as [ShapeType, number][]
  return { total, smoothness, shapeEntries, diagnosis, suggestion }
}

function fmtDate(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// ─── Modal shell ─────────────────────────────────────────────────────────────

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-[340px] max-h-[85vh] flex flex-col rounded-3xl bg-white animate-bounce-in"
        style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ icon, title, onClose }: { icon: string; title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-black text-[#272727] text-base">{title}</span>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-full bg-[#f0f0f0] flex items-center justify-center text-xs font-bold text-[#999] tap-scale"
      >
        ✕
      </button>
    </div>
  )
}

// ─── type ────────────────────────────────────────────────────────────────────

type ModalType = 'report' | 'reward' | 'privacy' | 'tips' | 'feedback' | 'about' | null

// ─── main component ─────────────────────────────────────────────────────────

export function Profile() {
  const [modal, setModal] = useState<ModalType>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [rewardOk, setRewardOk] = useState<boolean | null>(null)
  const { streak } = useLogStats()
  const reportRef = useRef<HTMLDivElement>(null)

  const allEntries = logService.getEntries()
  const memberDays = allEntries.length > 0
    ? Math.ceil((Date.now() - allEntries[0].timestamp) / (24 * 60 * 60 * 1000))
    : 0

  const report = modal === 'report' ? generateReport() : null
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const dateRange = `${fmtDate(weekAgo)} – ${fmtDate(today)}`

  // ── share / download PDF ──
  async function handleShare() {
    if (!reportRef.current) return
    setPdfLoading(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, backgroundColor: '#FFFDF8', width: 292, windowWidth: 292,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()
      const margin = 10
      const maxW = pw - margin * 2
      const maxH = ph - margin * 2
      let w = maxW
      let h = (canvas.height * w) / canvas.width
      if (h > maxH) { h = maxH; w = (canvas.width * h) / canvas.height }
      pdf.addImage(imgData, 'PNG', (pw - w) / 2, margin, w, h)
      pdf.save(`loglog-周报-${fmtDate(today)}.pdf`)

      // First share → reward
      const isFirst = !localStorage.getItem(FIRST_SHARED_KEY)
      if (isFirst) {
        localStorage.setItem(FIRST_SHARED_KEY, '1')
        const result = await tokenService.dispatchReward('placeholder', 'first_report_shared')
        setRewardOk(result !== null)
        setModal('reward')
      } else {
        setModal(null)
      }
    } finally {
      setPdfLoading(false)
    }
  }

  // ── export ──
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
    else setModal(action as ModalType)
  }

  return (
    <div className="px-5 pt-6 pb-16">

      {/* ── Profile card ── */}
      <div
        className="rounded-3xl p-5 mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFD73B 0%, #F5C800 100%)',
          boxShadow: '0 6px 24px rgba(255,215,59,0.4)',
        }}
      >
        <div className="absolute right-4 top-4 text-6xl opacity-20 animate-spin-slow select-none">💩</div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center text-3xl">💩</div>
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

      {/* ── Weekly Report CTA ── */}
      <button
        onClick={() => setModal('report')}
        className="w-full py-5 rounded-2xl font-black text-lg mb-5 tap-scale relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #272727 0%, #3a3a3a 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: '#FFD73B',
        }}
      >
        <span className="relative z-10">🚀 生成「如厕风云周报」</span>
      </button>

      {/* ── Menu list ── */}
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

      {/* ════════════════════ MODALS ════════════════════ */}

      {/* ── 周报预览 ── */}
      {modal === 'report' && report && (
        <Modal onClose={() => setModal(null)}>
          <ModalHeader icon="📊" title="如厕风云周报" onClose={() => setModal(null)} />

          <div className="overflow-y-auto flex-1 px-4 pb-3">
            <div ref={reportRef} className="rounded-2xl overflow-hidden" style={{ background: '#FFFDF8' }}>
              <div className="p-5">
                {/* header */}
                <div className="text-center mb-5">
                  <div className="text-4xl mb-1">💩</div>
                  <p className="font-black text-lg text-[#272727]">如厕风云周报</p>
                  <p className="text-[11px] text-[#aaa] mt-1">{dateRange}</p>
                </div>

                {/* stats */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: '#FFF8D6', border: '1.5px solid #FFE066' }}>
                    <p className="font-black text-2xl text-[#272727]">{report.total}</p>
                    <p className="text-[10px] font-bold text-[#A07A00] mt-0.5">本周记录</p>
                  </div>
                  <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: '#FFF8D6', border: '1.5px solid #FFE066' }}>
                    <p className="font-black text-2xl text-[#272727]">{report.smoothness}%</p>
                    <p className="text-[10px] font-bold text-[#A07A00] mt-0.5">通畅指数</p>
                  </div>
                </div>

                {/* shape breakdown */}
                <div className="rounded-2xl p-4 mb-3" style={{ background: '#fff', border: '1.5px solid #EDE8D8' }}>
                  <p className="text-[10px] font-extrabold text-[#C4B9A8] uppercase tracking-wider mb-2">形态分布</p>
                  {report.shapeEntries.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {report.shapeEntries.map(([shape, count]) => (
                        <div key={shape} className="flex items-center justify-between">
                          <span className="text-sm text-[#272727]">{SHAPE_LABEL[shape]}</span>
                          <span className="font-black text-sm text-[#272727]">×{count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#ccc]">暂无数据</p>
                  )}
                </div>

                {/* diagnosis */}
                <div className="rounded-2xl p-4 mb-3" style={{ background: '#fff', border: '1.5px solid #EDE8D8' }}>
                  <p className="text-[10px] font-extrabold text-[#C4B9A8] uppercase tracking-wider mb-2">📋 本周诊断</p>
                  <p className="text-[13px] text-[#272727] leading-relaxed">{report.diagnosis}</p>
                </div>

                {/* suggestion */}
                <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg,#FFF8D6,#FFF3B0)', border: '1.5px solid #FFE066' }}>
                  <p className="text-[10px] font-extrabold text-[#A07A00] uppercase tracking-wider mb-2">💡 健康建议</p>
                  <p className="text-[13px] text-[#272727] leading-relaxed">{report.suggestion}</p>
                </div>

                {/* footer */}
                <div className="text-center pt-3" style={{ borderTop: '1.5px solid #EDE8D8' }}>
                  <p className="text-[10px] text-[#ccc] font-semibold">🌿 LogLog · Give a SHIT to myself</p>
                </div>
              </div>
            </div>
          </div>

          {/* share button */}
          <div className="px-4 pb-5 pt-2">
            <button
              onClick={handleShare}
              disabled={pdfLoading}
              className="w-full py-4 rounded-2xl font-black text-lg tap-scale"
              style={{
                background: pdfLoading ? '#e0e0e0' : 'linear-gradient(135deg, #FFD73B, #F5C800)',
                color: '#272727',
                boxShadow: pdfLoading ? 'none' : '0 4px 16px rgba(255,215,59,0.45)',
              }}
            >
              {pdfLoading ? '⏳ 生成中...' : '📤 下载 PDF 分享'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── 首次分享奖励 ── */}
      {modal === 'reward' && (
        <Modal onClose={() => setModal(null)}>
          <div className="px-5 py-8 flex flex-col items-center gap-5">
            <div className="text-5xl animate-bounce-in">{rewardOk ? '🎉' : '😔'}</div>
            <div className="text-center animate-bounce-in" style={{ animationDelay: '0.08s' }}>
              <p className="font-black text-[#272727] text-lg">
                {rewardOk ? '代币已到账！' : '领取失败'}
              </p>
              <p className="text-xs text-[#aaa] mt-1">
                {rewardOk ? '首次分享周报奖励' : '网络异常，代币将在恢复后补发'}
              </p>
            </div>

            <div
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl animate-bounce-in"
              style={{
                background: rewardOk ? 'linear-gradient(135deg, #FFF8D6, #FFF3B0)' : '#F9F9F9',
                border: rewardOk ? '1.5px solid #FFE066' : '1.5px solid #E8E8E8',
                animationDelay: '0.15s',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl" style={{ opacity: rewardOk ? 1 : 0.4 }}>📊</span>
                <span className="font-bold text-sm" style={{ color: rewardOk ? '#272727' : '#ADADAD' }}>
                  首次分享周报
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm" style={{ color: rewardOk ? '#D48800' : '#ADADAD' }}>
                  {rewardOk ? '+15 SHIT' : '失败'}
                </span>
                <span className="text-base">{rewardOk ? '✅' : '❌'}</span>
              </div>
            </div>

            {rewardOk && (
              <div
                className="w-full flex items-center justify-center py-3 rounded-2xl animate-bounce-in"
                style={{ background: '#272727', animationDelay: '0.25s' }}
              >
                <p className="font-black text-white text-base">合计 +15 SHIT 💩</p>
              </div>
            )}

            <button
              onClick={() => setModal(null)}
              className="w-full py-4 rounded-2xl font-black text-lg tap-scale animate-bounce-in"
              style={{
                background: rewardOk ? '#FFD73B' : '#F5F5F5',
                color: '#272727',
                boxShadow: rewardOk ? '0 4px 16px rgba(255,215,59,0.45)' : 'none',
                animationDelay: '0.3s',
              }}
            >
              {rewardOk ? '好的！' : '我知道了'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── 隐私说明 ── */}
      {modal === 'privacy' && (
        <Modal onClose={() => setModal(null)}>
          <ModalHeader icon="🔒" title="隐私说明" onClose={() => setModal(null)} />
          <div className="px-5 pb-6 flex flex-col gap-3">
            <div className="rounded-2xl p-4" style={{ background: '#F0FBF5', border: '1.5px solid rgba(45,155,94,0.2)' }}>
              <p className="text-sm text-[#272727] leading-relaxed">
                你的所有数据都存储在<strong>本设备的浏览器</strong>中，我们<strong>无法访问</strong>你的任何记录。
              </p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: '#FAF6EE', border: '1.5px solid #EDE8D8' }}>
              <p className="text-[13px] text-[#666] leading-relaxed">
                LogLog 不会上传、收集或分析你的个人健康数据。清除浏览器数据即可彻底删除所有记录。
              </p>
            </div>
            <button onClick={() => setModal(null)} className="w-full py-3.5 rounded-2xl font-bold text-sm tap-scale bg-[#FFD73B] text-[#272727]">
              我知道了
            </button>
          </div>
        </Modal>
      )}

      {/* ── 健康小贴士 ── */}
      {modal === 'tips' && (
        <Modal onClose={() => setModal(null)}>
          <ModalHeader icon="💡" title="健康小贴士库" onClose={() => setModal(null)} />
          <div className="overflow-y-auto flex-1 px-5 pb-5">
            <div className="flex flex-col gap-2.5">
              {TIPS.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 rounded-2xl animate-bounce-in"
                  style={{ background: '#FAF6EE', border: '1px solid #EDE8D8', animationDelay: `${i * 0.05}s` }}
                >
                  <span className="text-lg shrink-0 mt-0.5">{tip.icon}</span>
                  <p className="text-[13px] text-[#272727] leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* ── 反馈与建议 ── */}
      {modal === 'feedback' && (
        <Modal onClose={() => setModal(null)}>
          <ModalHeader icon="📮" title="反馈与建议" onClose={() => setModal(null)} />
          <div className="px-5 pb-6 flex flex-col gap-3">
            <div className="rounded-2xl p-4" style={{ background: '#FAF6EE', border: '1.5px solid #EDE8D8' }}>
              <p className="text-sm text-[#272727] leading-relaxed">
                欢迎告诉我们你的想法和建议！你的反馈是我们改进的动力。
              </p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: '#FFF8D6', border: '1.5px solid #FFE066' }}>
              <p className="text-[11px] font-bold text-[#A07A00] mb-1">联系邮箱</p>
              <p className="font-black text-sm text-[#272727]">hello@loglog.app</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText('hello@loglog.app'); setModal(null) }}
              className="w-full py-3.5 rounded-2xl font-bold text-sm tap-scale bg-[#FFD73B] text-[#272727]"
            >
              📋 复制邮箱地址
            </button>
          </div>
        </Modal>
      )}

      {/* ── 关于 LogLog ── */}
      {modal === 'about' && (
        <Modal onClose={() => setModal(null)}>
          <div className="px-5 py-8 flex flex-col items-center gap-4">
            <div className="text-5xl animate-bounce-in">💩</div>
            <div className="text-center">
              <p className="font-black text-xl text-[#272727]">LogLog</p>
              <p className="text-xs text-[#aaa] mt-1 italic">Give a SHIT to myself</p>
            </div>
            <div className="rounded-2xl p-4 w-full text-center" style={{ background: '#FAF6EE', border: '1.5px solid #EDE8D8' }}>
              <p className="text-[13px] text-[#666] leading-relaxed">
                让每一次如厕，都成为一次对自己的微小关怀。
              </p>
            </div>
            <p className="text-[10px] text-[#ccc]">© 2025 All SHIT Reserved</p>
            <button onClick={() => setModal(null)} className="w-full py-3.5 rounded-2xl font-bold text-sm tap-scale bg-[#FFD73B] text-[#272727]">
              好的
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
