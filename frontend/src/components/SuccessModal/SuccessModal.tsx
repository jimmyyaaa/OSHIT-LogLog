import { useRef, useEffect, useState } from 'react'
import type { CreateLogPayload, ShapeType } from '../../types'
import { SHAPES, COLORS, FEELINGS, PLACES, PALETTES, getPersona, getCode, getQuip } from '../../data/shitData'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  payload: CreateLogPayload | null
}

const SHAPE_MAP = Object.fromEntries(SHAPES.map((s) => [s.code, s]))
const COLOR_MAP = Object.fromEntries(COLORS.map((c) => [c.code, c]))
const FEELING_MAP = Object.fromEntries(FEELINGS.map((f) => [f.code, f]))
const PLACE_MAP = Object.fromEntries(PLACES.map((p) => [p.code, p]))

const SC_ON_GOLD = '#5b4b00'
const SC_INK = '#3d3905'

export default function SuccessModal({ open, onClose, payload }: SuccessModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !payload) { setImageUrl(null); return }

    const S = 2
    const CARD_W = 340 * S
    const CARD_H = 560 * S
    const canvas = document.createElement('canvas')
    canvas.width = CARD_W
    canvas.height = CARD_H
    const ctx = canvas.getContext('2d')!
    const F = 'Nunito, -apple-system, "Helvetica Neue", "PingFang SC", sans-serif'
    const MONO = 'ui-monospace, "SF Mono", "Menlo", monospace'
    const EF = '-apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'

    const shape: ShapeType = payload.shape
    const palette = PALETTES[shape] || PALETTES.type_ideal
    const persona = getPersona(shape, payload.feeling ?? null)
    const code = getCode(payload)
    const quip = getQuip(payload)
    const shapeData = SHAPE_MAP[shape]
    const colorData = payload.color ? COLOR_MAP[payload.color] : null
    const feelingData = payload.feeling ? FEELING_MAP[payload.feeling] : null
    const placeData = payload.location ? PLACE_MAP[payload.location] : null

    const labels = [
      { L: code[0], label: '形状', hint: shapeData?.name || '' },
      { L: code[1], label: '颜色', hint: colorData?.name || '未选' },
      { L: code[2], label: '感受', hint: feelingData?.name || '未选' },
      { L: code[3], label: '地点', hint: placeData?.name || '未选' },
    ]

    // ===== Background =====
    const cardGrad = ctx.createLinearGradient(0, 0, CARD_W * 0.7, CARD_H)
    for (const stop of palette.cardBgStops) cardGrad.addColorStop(stop.offset, stop.color)
    ctx.fillStyle = cardGrad
    ctx.beginPath()
    ctx.roundRect(0, 0, CARD_W, CARD_H, 28 * S)
    ctx.fill()

    // Decorative blobs
    ctx.fillStyle = palette.blobA
    ctx.beginPath()
    ctx.arc(CARD_W + 40 * S, -60 * S, 90 * S, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = palette.blobB
    ctx.beginPath()
    ctx.arc(-20 * S, CARD_H + 30 * S, 65 * S, 0, Math.PI * 2)
    ctx.fill()

    // Subtle dot pattern overlay
    ctx.fillStyle = SC_ON_GOLD
    ctx.globalAlpha = 0.06
    for (let y = 9 * S; y < CARD_H; y += 18 * S) {
      for (let x = 9 * S; x < CARD_W; x += 18 * S) {
        ctx.beginPath()
        ctx.arc(x, y, 1.5 * S, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1

    // ===== Padding area =====
    const PAD = 22 * S
    let y = PAD + 14 * S

    // ===== Header row: persona info (left) + code box (right) =====
    // Header label
    ctx.fillStyle = SC_ON_GOLD
    ctx.globalAlpha = 0.6
    ctx.font = `900 ${9 * S}px ${F}`
    ctx.textAlign = 'start'
    ctx.fillText(spaceLetters(palette.header, 0.3), PAD, y)
    ctx.globalAlpha = 1

    y += 12 * S
    // Nickname
    ctx.fillStyle = SC_INK
    ctx.font = `900 ${22 * S}px ${F}`
    ctx.fillText(persona.nick, PAD, y + 16 * S)
    y += 26 * S
    // EN name
    ctx.fillStyle = SC_ON_GOLD
    ctx.globalAlpha = 0.7
    ctx.font = `800 ${9 * S}px ${F}`
    ctx.fillText(spaceLetters(persona.en, 0.28), PAD, y + 6 * S)
    ctx.globalAlpha = 1

    // Code box (top right)
    const codeBoxW = 80 * S
    const codeBoxH = 32 * S
    const codeBoxX = CARD_W - PAD - codeBoxW
    const codeBoxY = PAD + 4 * S
    ctx.fillStyle = 'rgba(255,255,255,0.72)'
    ctx.beginPath()
    ctx.roundRect(codeBoxX, codeBoxY, codeBoxW, codeBoxH, 10 * S)
    ctx.fill()
    ctx.strokeStyle = palette.codeAccent
    ctx.lineWidth = 1.5 * S
    ctx.stroke()
    ctx.fillStyle = SC_INK
    ctx.font = `900 ${18 * S}px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(code, codeBoxX + codeBoxW / 2, codeBoxY + codeBoxH / 2 + 1 * S)
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'start'

    // ===== Portrait canvas =====
    const portraitY = y + 24 * S
    const portraitW = CARD_W - PAD * 2
    const portraitH = portraitW // aspect ratio 1

    // Portrait bg
    const pGrad = ctx.createRadialGradient(
      PAD + portraitW * 0.3,
      portraitY + portraitH * 0.25,
      0,
      PAD + portraitW * 0.3,
      portraitY + portraitH * 0.25,
      portraitW * 0.8
    )
    for (const stop of palette.portraitBgStops) pGrad.addColorStop(stop.offset, stop.color)
    ctx.fillStyle = pGrad
    ctx.beginPath()
    ctx.roundRect(PAD, portraitY, portraitW, portraitH, 18 * S)
    ctx.fill()
    // White border
    ctx.strokeStyle = 'rgba(255,255,255,0.95)'
    ctx.lineWidth = 2.5 * S
    ctx.stroke()

    // Clip to portrait area for decorations
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(PAD, portraitY, portraitW, portraitH, 18 * S)
    ctx.clip()

    // Decorations
    ctx.fillStyle = palette.decorColor
    ctx.globalAlpha = 0.55
    for (let i = 0; i < palette.decorations.length; i++) {
      const d = palette.decorations[i]
      const top = ((i * 29 + 5) % 82) / 100
      const left = ((i * 41 + 4) % 82) / 100
      const rot = ((i * 47) % 360) * Math.PI / 180
      const fsize = i % 2 ? 11 * S : 15 * S
      ctx.save()
      ctx.translate(PAD + left * portraitW + 8 * S, portraitY + top * portraitH + 15 * S)
      ctx.rotate(rot)
      ctx.font = `${fsize}px ${F}`
      ctx.fillText(d, 0, 0)
      ctx.restore()
    }
    ctx.globalAlpha = 1

    // Main emoji (centered)
    ctx.font = `120px ${EF}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(shapeData?.icon || '🍌', PAD + portraitW / 2, portraitY + portraitH / 2)
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'start'

    ctx.restore()

    // PERSONA ART label (bottom left inside portrait)
    ctx.fillStyle = SC_ON_GOLD
    ctx.globalAlpha = 0.55
    ctx.font = `900 ${7 * S}px ${F}`
    ctx.fillText(spaceLetters('PERSONA ART', 0.22), PAD + 9 * S, portraitY + portraitH - 9 * S)
    ctx.globalAlpha = 1

    // Tag pill (top right inside portrait)
    const tagPadX = 7 * S
    const tagPadY = 2 * S
    ctx.font = `900 ${8 * S}px ${F}`
    const tagText = spaceLetters(palette.tagline, 0.22)
    const tagW = ctx.measureText(tagText).width + tagPadX * 2
    const tagH = 14 * S
    const tagX = PAD + portraitW - 9 * S - tagW
    const tagYpos = portraitY + 9 * S
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.beginPath()
    ctx.roundRect(tagX, tagYpos, tagW, tagH, tagH / 2)
    ctx.fill()
    ctx.fillStyle = SC_ON_GOLD
    ctx.textBaseline = 'middle'
    ctx.fillText(tagText, tagX + tagPadX, tagYpos + tagH / 2 + 0.5 * S)
    ctx.textBaseline = 'alphabetic'
    void tagPadY

    // ===== Code row (4 boxes) =====
    const rowY = portraitY + portraitH + 14 * S
    const boxGap = 7 * S
    const boxW = (CARD_W - PAD * 2 - boxGap * 3) / 4
    const boxH = 54 * S

    for (let i = 0; i < 4; i++) {
      const bx = PAD + (boxW + boxGap) * i
      // Box bg
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.beginPath()
      ctx.roundRect(bx, rowY, boxW, boxH, 10 * S)
      ctx.fill()
      ctx.strokeStyle = palette.codeAccent
      ctx.lineWidth = 1.5 * S
      ctx.stroke()

      // Letter
      ctx.fillStyle = SC_INK
      ctx.font = `900 ${24 * S}px ${MONO}`
      ctx.textAlign = 'center'
      ctx.fillText(labels[i].L, bx + boxW / 2, rowY + 24 * S)

      // Label
      ctx.fillStyle = SC_ON_GOLD
      ctx.globalAlpha = 0.65
      ctx.font = `900 ${7 * S}px ${F}`
      ctx.fillText(spaceLetters(labels[i].label, 0.2), bx + boxW / 2, rowY + 37 * S)
      ctx.globalAlpha = 0.85
      // Hint
      ctx.font = `700 ${8 * S}px ${F}`
      const hint = truncate(ctx, labels[i].hint, boxW - 6 * S)
      ctx.fillText(hint, bx + boxW / 2, rowY + 47 * S)
      ctx.globalAlpha = 1
      ctx.textAlign = 'start'
    }

    // ===== Quip =====
    const quipY = rowY + boxH + 18 * S
    ctx.fillStyle = SC_ON_GOLD
    ctx.font = `700 ${12 * S}px ${F}`
    ctx.textAlign = 'center'
    drawWrappedText(ctx, `"${quip}"`, CARD_W / 2, quipY, CARD_W - PAD * 2, 18 * S)
    ctx.textAlign = 'start'

    // ===== Footer =====
    ctx.fillStyle = SC_ON_GOLD
    ctx.globalAlpha = 0.55
    ctx.font = `800 ${9 * S}px ${F}`
    ctx.textAlign = 'start'
    ctx.fillText(spaceLetters('屎了么 · LogLog', 0.2), PAD, CARD_H - PAD)

    const dateStr = formatDate(new Date())
    ctx.textAlign = 'end'
    ctx.fillText(spaceLetters(dateStr, 0.2), CARD_W - PAD, CARD_H - PAD)
    ctx.textAlign = 'start'
    ctx.globalAlpha = 1

    canvasRef.current = canvas
    setImageUrl(canvas.toDataURL('image/png'))
  }, [open, payload])

  if (!open) return null

  const handleDownload = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = '屎了么-人格卡.png'
    a.click()
  }

  const handleShare = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvasRef.current!.toBlob(resolve, 'image/png'))
      if (!blob) return
      if (navigator.share) {
        const file = new File([blob], '屎了么-人格卡.png', { type: 'image/png' })
        await navigator.share({ files: [file], title: '屎了么 · 今日人格' })
      } else {
        handleDownload()
      }
    } catch {
      handleDownload()
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/20 backdrop-blur-sm animate-fade-in">
      <main className="relative mx-4 flex w-full max-w-md flex-col items-center gap-6 animate-bounce-in">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="今日人格卡"
            className="w-full max-w-[340px] rounded-[28px] shadow-[0_24px_64px_rgba(91,75,0,0.28)]"
          />
        )}

        <div className="flex w-full max-w-[340px] flex-col gap-3">
          <button
            onClick={handleShare}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary-container text-lg font-bold text-on-primary-container shadow-[0_12px_32px_rgba(255,215,9,0.3)] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">share</span>
            分享到朋友圈
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            下次再说
          </button>
        </div>
      </main>
    </div>
  )
}

/* ---- utils ---- */

function spaceLetters(text: string, em: number): string {
  // Canvas 2d doesn't support letter-spacing reliably in older browsers.
  // Emulate by inserting thin spaces proportional to em. Works for short labels.
  const gap = em > 0.25 ? '  ' : ' '
  return text.split('').join(gap)
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text
  let s = text
  while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1)
  return s + '…'
}

function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxW: number, lineHeight: number) {
  const chars = [...text]
  let line = ''
  let curY = y
  for (const ch of chars) {
    const test = line + ch
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, cx, curY)
      line = ch
      curY += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, cx, curY)
}

function formatDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}.${m}.${day}`
}
