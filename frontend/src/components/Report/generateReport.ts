import type { LogEntry, ShapeType } from '../../types'

const SHAPE_LABELS: Record<ShapeType, string> = {
  rabbit_pellets: '兔子弹',
  twisted_rope: '麻花绳',
  banana_bro: '香蕉君',
  soft_serve: '软冰淇淋',
  splash_zone: '水花区',
}

const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export interface ReportData {
  weekLabel: string
  totalLogs: number
  smoothnessIndex: number | null
  shapeBreakdown: { label: string; count: number }[]
  peakDay: string | null
  streak: number
}

export function computeReportData(entries: LogEntry[], monday: Date, sunday: Date): ReportData {
  const weekEntries = entries.filter((e) => {
    const d = new Date(e.timestamp)
    return d >= monday && d <= sunday
  })

  const monthDay = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  const weekLabel = `${monthDay(monday)} - ${monthDay(sunday)}`
  const totalLogs = weekEntries.length

  const bananaCount = weekEntries.filter((e) => e.shape === 'banana_bro').length
  const smoothnessIndex = totalLogs > 0 ? Math.round((bananaCount / totalLogs) * 100) : null

  const counts: Record<string, number> = {}
  for (const e of weekEntries) counts[e.shape] = (counts[e.shape] || 0) + 1
  const shapeBreakdown = Object.entries(counts)
    .map(([shape, count]) => ({ label: SHAPE_LABELS[shape as ShapeType] || shape, count }))
    .sort((a, b) => b.count - a.count)

  const dayCounts: Record<number, number> = {}
  for (const e of weekEntries) {
    const day = new Date(e.timestamp).getDay()
    dayCounts[day] = (dayCounts[day] || 0) + 1
  }
  let peakDay: string | null = null
  let peakCount = 0
  for (const dayStr of Object.keys(dayCounts)) {
    const day = Number(dayStr)
    if (dayCounts[day] > peakCount) {
      peakCount = dayCounts[day]
      peakDay = WEEKDAY_LABELS[day]
    }
  }

  let streak = 0
  const d = new Date(sunday)
  const entryDates = new Set(entries.map((e) => new Date(e.timestamp).toISOString().slice(0, 10)))
  while (entryDates.has(d.toISOString().slice(0, 10))) {
    streak++
    d.setDate(d.getDate() - 1)
  }

  return { weekLabel, totalLogs, smoothnessIndex, shapeBreakdown, peakDay, streak }
}

export function renderReportCanvas(data: ReportData): HTMLCanvasElement {
  const S = 2
  const W = 375 * S
  const PAD = 24 * S
  const F = '-apple-system, "Helvetica Neue", "PingFang SC", sans-serif'

  // Calculate height
  const shapeRows = Math.max(data.shapeBreakdown.length, 1)
  const H = (100 + 90 + 90 + 50 + shapeRows * 32 + 80 + 90 + 50) * S

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Top accent
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(0, 0, W, 8 * S, [12 * S, 12 * S, 0, 0])
  ctx.fillStyle = '#0071e3'
  ctx.fill()
  ctx.restore()

  let y = 0

  // --- Header ---
  y += 44 * S
  ctx.fillStyle = '#1d1d1f'
  ctx.font = `bold ${22 * S}px ${F}`
  ctx.fillText('LogLog 周报', PAD, y)

  y += 26 * S
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.font = `${13 * S}px ${F}`
  ctx.fillText(data.weekLabel, PAD, y)

  y += 20 * S

  // --- Helpers ---
  const divider = () => {
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(PAD, y, W - PAD * 2, 1 * S)
    y += 24 * S
  }

  const sectionLabel = (text: string) => {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.font = `600 ${11 * S}px ${F}`
    ctx.fillText(text, PAD, y)
    y += 36 * S  // big gap before the large value
  }

  const bigNumber = (value: string, unit: string) => {
    ctx.font = `bold ${34 * S}px ${F}`
    ctx.fillStyle = '#1d1d1f'
    const numW = ctx.measureText(value).width
    ctx.fillText(value, PAD, y)

    ctx.font = `${15 * S}px ${F}`
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillText(unit, PAD + numW + 4 * S, y)
    y += 20 * S  // gap after value
  }

  // --- Total Logs ---
  divider()
  sectionLabel('本周记录')
  bigNumber(`${data.totalLogs}`, '次')

  // --- Smoothness Index ---
  divider()
  sectionLabel('顺畅指数')
  const idxVal = data.smoothnessIndex !== null ? `${data.smoothnessIndex}` : '--'
  const idxUnit = data.smoothnessIndex !== null ? '%' : ''
  bigNumber(idxVal, idxUnit)

  // --- Shape Breakdown ---
  divider()
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.font = `600 ${11 * S}px ${F}`
  ctx.fillText('形状分布', PAD, y)
  y += 24 * S

  if (data.shapeBreakdown.length === 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.font = `${13 * S}px ${F}`
    ctx.fillText('暂无数据', PAD, y)
    y += 24 * S
  } else {
    for (const item of data.shapeBreakdown) {
      ctx.fillStyle = '#1d1d1f'
      ctx.font = `${14 * S}px ${F}`
      ctx.fillText(item.label, PAD, y)

      ctx.fillStyle = '#0071e3'
      ctx.font = `bold ${14 * S}px ${F}`
      const t = `x${item.count}`
      ctx.fillText(t, W - PAD - ctx.measureText(t).width, y)
      y += 26 * S
    }
  }

  // --- Peak Day ---
  divider()
  sectionLabel('高峰日')
  ctx.fillStyle = '#1d1d1f'
  ctx.font = `bold ${22 * S}px ${F}`
  ctx.fillText(data.peakDay || '--', PAD, y)
  y += 20 * S

  // --- Streak ---
  divider()
  sectionLabel('连续记录')
  bigNumber(`${data.streak}`, '天')

  // --- Footer ---
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.font = `${10 * S}px ${F}`
  ctx.fillText('LogLog — Give a SHIT to Myself', PAD, H - 16 * S)

  return canvas
}
