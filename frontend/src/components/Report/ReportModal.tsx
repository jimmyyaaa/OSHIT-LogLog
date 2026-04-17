import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import type { LogEntry, ShapeType } from '../../types'

interface ReportModalProps {
  open: boolean
  onClose: () => void
  entries: LogEntry[]
}

const SHAPE_LABELS: Record<ShapeType, string> = {
  rabbit_pellets: '兔子弹',
  twisted_rope: '麻花绳',
  banana_bro: '香蕉君',
  soft_serve: '软冰淇淋',
  splash_zone: '水花区',
}

const WEEKDAY_SHORT = ['一', '二', '三', '四', '五', '六', '日']

const INSIGHTS = [
  '你的节奏正在稳定。适当增加膳食纤维会提升下周的评分。',
  '保持现在的频率，肠道会感谢你。',
  '水分摄入是关键，记得每天八杯水。',
  '规律作息是肠道健康的基石，继续保持。',
  '你的身体在说话，持续记录才能听清。',
]

function getPreviousWeek() {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = (day + 6) % 7
  const thisMonday = new Date(now)
  thisMonday.setDate(now.getDate() - diffToMonday)
  thisMonday.setHours(0, 0, 0, 0)
  const prevMonday = new Date(thisMonday)
  prevMonday.setDate(thisMonday.getDate() - 7)
  const prevSunday = new Date(thisMonday)
  prevSunday.setDate(thisMonday.getDate() - 1)
  prevSunday.setHours(23, 59, 59, 999)
  return { monday: prevMonday, sunday: prevSunday }
}

export default function ReportModal({ open, onClose, entries }: ReportModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const data = useMemo(() => {
    const { monday, sunday } = getPreviousWeek()
    const weekEntries = entries.filter((e) => {
      const d = new Date(e.timestamp)
      return d >= monday && d <= sunday
    })
    const totalLogs = weekEntries.length
    const bananaCount = weekEntries.filter((e) => e.shape === 'banana_bro').length
    const score = totalLogs > 0 ? Math.round((bananaCount / totalLogs) * 100) : 0

    const counts: Record<string, number> = {}
    for (const e of weekEntries) counts[e.shape] = (counts[e.shape] || 0) + 1
    const shapeBreakdown = Object.entries(counts)
      .map(([shape, count]) => ({ label: SHAPE_LABELS[shape as ShapeType] || shape, count, pct: totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    const dailyLogged: boolean[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = d.toISOString().slice(0, 10)
      dailyLogged.push(weekEntries.some((e) => new Date(e.timestamp).toISOString().slice(0, 10) === dateStr))
    }

    const monthDay = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
    const weekLabel = `${monthDay(monday)} - ${monthDay(sunday)}`
    const insight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)]
    const loggedCount = dailyLogged.filter(Boolean).length

    return { weekLabel, totalLogs, score, shapeBreakdown, dailyLogged, insight, loggedCount }
  }, [entries])

  useEffect(() => {
    if (!open) { setImageUrl(null); return }

    const S = 2
    const W = 390 * S
    const PAD = 24 * S
    const INNER = W - PAD * 2
    const F = 'Nunito, -apple-system, "Helvetica Neue", "PingFang SC", sans-serif'

    // Pre-calculate height
    const shapeRows = Math.max(data.shapeBreakdown.length, 1)
    const H = (56 + 200 + 16 + 120 + 16 + 100 + 16 + shapeRows * 24 + 60) * S

    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // Background with solar glow
    ctx.fillStyle = '#fffbff'
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, 20 * S)
    ctx.fill()
    const glow = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, W * 0.6)
    glow.addColorStop(0, 'rgba(255,215,9,0.15)')
    glow.addColorStop(1, 'rgba(255,251,255,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)

    let y = 36 * S

    // Title
    ctx.textAlign = 'center'
    ctx.fillStyle = '#3d3905'
    ctx.font = `700 ${18 * S}px ${F}`
    ctx.fillText('Weekly Health Insights', W / 2, y)
    y += 12 * S
    ctx.fillStyle = 'rgba(61,57,5,0.4)'
    ctx.font = `600 ${10 * S}px ${F}`
    ctx.fillText(data.weekLabel, W / 2, y)
    ctx.textAlign = 'start'

    // ---- Score Ring Card ----
    y += 16 * S
    const cardY = y
    const cardH = 180 * S
    // Card bg
    ctx.fillStyle = '#fffae1'
    ctx.beginPath()
    ctx.roundRect(PAD, cardY, INNER, cardH, 20 * S)
    ctx.fill()
    // Gradient overlay
    const cardGrad = ctx.createLinearGradient(PAD, cardY, PAD + INNER, cardY + cardH)
    cardGrad.addColorStop(0, 'rgba(255,215,9,0.15)')
    cardGrad.addColorStop(1, 'rgba(255,251,255,0)')
    ctx.fillStyle = cardGrad
    ctx.beginPath()
    ctx.roundRect(PAD, cardY, INNER, cardH, 20 * S)
    ctx.fill()

    // Ring
    const ringCx = W / 2
    const ringCy = cardY + 80 * S
    const ringR = 52 * S
    const ringW = 10 * S

    ctx.beginPath()
    ctx.arc(ringCx, ringCy, ringR, 0, Math.PI * 2)
    ctx.strokeStyle = '#f9f19b'
    ctx.lineWidth = ringW
    ctx.stroke()

    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (data.score / 100) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(ringCx, ringCy, ringR, startAngle, endAngle)
    ctx.strokeStyle = '#ffd709'
    ctx.lineWidth = ringW
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.lineCap = 'butt'

    ctx.textAlign = 'center'
    ctx.fillStyle = '#3d3905'
    ctx.font = `800 ${36 * S}px ${F}`
    ctx.fillText(`${data.score}`, ringCx, ringCy + 12 * S)
    ctx.fillStyle = 'rgba(61,57,5,0.4)'
    ctx.font = `700 ${8 * S}px ${F}`
    ctx.fillText('SCORE', ringCx, ringCy + 24 * S)

    // Badge
    const badgeY = cardY + cardH - 28 * S
    ctx.fillStyle = '#f3eb91'
    const badgeText = `+${data.loggedCount}/7 days this week`
    ctx.font = `700 ${8 * S}px ${F}`
    const badgeW = ctx.measureText(badgeText).width + 20 * S
    ctx.beginPath()
    ctx.roundRect(ringCx - badgeW / 2, badgeY - 8 * S, badgeW, 16 * S, 8 * S)
    ctx.fill()
    ctx.fillStyle = '#5b4b00'
    ctx.fillText(badgeText, ringCx, badgeY + 3 * S)
    ctx.textAlign = 'start'

    y = cardY + cardH + 12 * S

    // ---- Consistency + Shape grid ----
    const gridGap = 10 * S
    const leftW = INNER * 0.58
    const rightW = INNER - leftW - gridGap
    const gridH = 100 * S

    // Left: Consistency
    ctx.fillStyle = '#fffae1'
    ctx.beginPath()
    ctx.roundRect(PAD, y, leftW, gridH, 20 * S)
    ctx.fill()

    ctx.fillStyle = 'rgba(61,57,5,0.4)'
    ctx.font = `700 ${8 * S}px ${F}`
    ctx.fillText('CONSISTENCY', PAD + 16 * S, y + 20 * S)

    const dotBaseY = y + 60 * S
    const dotSpacing = (leftW - 32 * S) / 7
    for (let i = 0; i < 7; i++) {
      const cx = PAD + 16 * S + dotSpacing * i + dotSpacing / 2
      if (data.dailyLogged[i]) {
        ctx.fillStyle = '#776300'
        ctx.beginPath()
        ctx.arc(cx, dotBaseY, 5 * S, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.strokeStyle = 'rgba(239,201,0,0.35)'
        ctx.lineWidth = 1.5 * S
        ctx.beginPath()
        ctx.arc(cx, dotBaseY, 5 * S, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = 'rgba(61,57,5,0.3)'
      ctx.font = `700 ${6 * S}px ${F}`
      ctx.textAlign = 'center'
      ctx.fillText(WEEKDAY_SHORT[i], cx, dotBaseY + 14 * S)
    }
    ctx.textAlign = 'start'

    // Right: Shape breakdown (Color Profile style)
    const rightX = PAD + leftW + gridGap
    ctx.fillStyle = '#f9f19b'
    ctx.beginPath()
    ctx.roundRect(rightX, y, rightW, gridH, 20 * S)
    ctx.fill()

    ctx.fillStyle = 'rgba(61,57,5,0.4)'
    ctx.font = `700 ${8 * S}px ${F}`
    ctx.fillText('形状分布', rightX + 14 * S, y + 20 * S)

    const barX = rightX + 14 * S
    const barMaxW = rightW - 28 * S
    let barY = y + 36 * S

    if (data.shapeBreakdown.length === 0) {
      ctx.fillStyle = 'rgba(61,57,5,0.3)'
      ctx.font = `500 ${9 * S}px ${F}`
      ctx.fillText('暂无数据', barX, barY + 4 * S)
    } else {
      const colors = ['#5b4b00', '#878248', '#efc6b9']
      for (let i = 0; i < data.shapeBreakdown.length; i++) {
        const item = data.shapeBreakdown[i]
        const color = colors[i % colors.length]

        // Dot
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(barX + 3 * S, barY, 3 * S, 0, Math.PI * 2)
        ctx.fill()

        // Bar bg
        ctx.fillStyle = 'rgba(61,57,5,0.08)'
        ctx.beginPath()
        ctx.roundRect(barX + 12 * S, barY - 3 * S, barMaxW - 12 * S, 6 * S, 3 * S)
        ctx.fill()

        // Bar fill
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.roundRect(barX + 12 * S, barY - 3 * S, (barMaxW - 12 * S) * (item.pct / 100), 6 * S, 3 * S)
        ctx.fill()

        barY += 18 * S
      }
    }

    y += gridH + 12 * S

    // ---- Insight Card ----
    const insightH = 56 * S
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(PAD, y, INNER, insightH, 20 * S)
    ctx.fill()
    ctx.strokeStyle = 'rgba(194,187,123,0.15)'
    ctx.lineWidth = 1 * S
    ctx.beginPath()
    ctx.roundRect(PAD, y, INNER, insightH, 20 * S)
    ctx.stroke()

    // Icon box
    ctx.fillStyle = '#ffd709'
    ctx.beginPath()
    ctx.roundRect(PAD + 14 * S, y + 14 * S, 28 * S, 28 * S, 8 * S)
    ctx.fill()
    ctx.fillStyle = '#5b4b00'
    ctx.font = `400 ${16 * S}px ${F}`
    ctx.textAlign = 'center'
    ctx.fillText('✦', PAD + 28 * S, y + 33 * S)
    ctx.textAlign = 'start'

    // Label
    ctx.fillStyle = '#695700'
    ctx.font = `700 ${7 * S}px ${F}`
    ctx.fillText('VITALITY INSIGHT', PAD + 52 * S, y + 22 * S)

    // Insight text (word wrap by char)
    ctx.fillStyle = '#3d3905'
    ctx.font = `500 ${9 * S}px ${F}`
    const insightMaxW = INNER - 66 * S
    let line = ''
    let iy = y + 38 * S
    for (const char of data.insight) {
      if (ctx.measureText(line + char).width > insightMaxW) {
        ctx.fillText(line, PAD + 52 * S, iy)
        line = char
        iy += 12 * S
      } else {
        line += char
      }
    }
    ctx.fillText(line, PAD + 52 * S, iy)

    // ---- Footer ----
    ctx.fillStyle = 'rgba(61,57,5,0.2)'
    ctx.font = `600 ${8 * S}px ${F}`
    ctx.textAlign = 'center'
    ctx.fillText('LogLog · Give a SHIT to Myself', W / 2, H - 14 * S)

    canvasRef.current = canvas
    setImageUrl(canvas.toDataURL('image/png'))
  }, [open, data])

  const handleShare = useCallback(async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvasRef.current!.toBlob(resolve, 'image/png'))
      if (!blob) return
      if (navigator.share) {
        const file = new File([blob], 'LogLog-周报.png', { type: 'image/png' })
        await navigator.share({ files: [file], title: 'LogLog 周报' })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'LogLog-周报.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch { /* cancelled */ }
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/20 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <main className="relative mx-4 flex w-full max-w-md flex-col items-center gap-5 animate-bounce-in">
        {imageUrl && (
          <img src={imageUrl} alt="周报" className="w-full rounded-[24px] shadow-[0_24px_64px_rgba(61,57,5,0.2)]" />
        )}
        <div className="flex w-full flex-col gap-3 px-2">
          <button
            onClick={handleShare}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary-container text-on-primary-container shadow-[0_12px_32px_rgba(255,215,9,0.3)] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>ios_share</span>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Share Report</span>
          </button>
          <button onClick={onClose} className="w-full py-2 font-medium text-on-surface-variant transition-colors hover:text-on-surface">
            关闭
          </button>
        </div>
      </main>
    </div>
  )
}
