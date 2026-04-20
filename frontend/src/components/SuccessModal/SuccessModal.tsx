import { useRef, useEffect, useState } from 'react'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  message: string
  emojis: string[]
}

export default function SuccessModal({ open, onClose, message, emojis }: SuccessModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !message) { setImageUrl(null); return }

    const S = 2
    const W = 360 * S
    const H = 480 * S
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    const F = 'Nunito, -apple-system, "Helvetica Neue", "PingFang SC", sans-serif'
    const EF = '-apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
    const PAD = 28 * S

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#fffae1')
    grad.addColorStop(1, '#ffd709')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, 24 * S)
    ctx.fill()

    // Decorative circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(W * 0.82, H * 0.2, 100 * S, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.beginPath()
    ctx.arc(W * 0.15, H * 0.75, 80 * S, 0, Math.PI * 2)
    ctx.fill()

    // Title badge
    ctx.fillStyle = 'rgba(91, 75, 0, 0.15)'
    ctx.font = `800 ${10 * S}px ${F}`
    ctx.fillText('LOGGED · 屎了么', PAD, 48 * S)

    // Main headline - message text (word wrap)
    ctx.fillStyle = '#3d3905'
    ctx.font = `900 ${22 * S}px ${F}`
    const lineHeight = 32 * S
    const maxLineW = W - PAD * 2
    let line = ''
    let y = 90 * S
    const chars = [...message]
    for (const char of chars) {
      const test = line + char
      if (ctx.measureText(test).width > maxLineW) {
        ctx.fillText(line, PAD, y)
        line = char
        y += lineHeight
      } else {
        line = test
      }
    }
    if (line) ctx.fillText(line, PAD, y)

    // Emoji strip at bottom
    if (emojis.length > 0) {
      const stripY = H - 120 * S
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
      ctx.beginPath()
      ctx.roundRect(24 * S, stripY, W - 48 * S, 60 * S, 30 * S)
      ctx.fill()

      const emojiText = emojis.join('  |  ')
      ctx.fillStyle = '#3d3905'
      ctx.font = `${28 * S}px ${EF}`
      ctx.textAlign = 'center'
      ctx.fillText(emojiText, W / 2, stripY + 40 * S)
      ctx.textAlign = 'start'
    }

    // Footer
    ctx.fillStyle = 'rgba(61, 57, 5, 0.4)'
    ctx.font = `700 ${10 * S}px ${F}`
    ctx.textAlign = 'center'
    ctx.fillText('屎了么 · Give a SHIT to Myself', W / 2, H - 24 * S)
    ctx.textAlign = 'start'

    canvasRef.current = canvas
    setImageUrl(canvas.toDataURL('image/png'))
  }, [open, message, emojis])

  if (!open) return null

  const handleDownload = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = '屎了么-记录成功.png'
    a.click()
  }

  const handleShare = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvasRef.current!.toBlob(resolve, 'image/png'))
      if (!blob) return
      if (navigator.share) {
        const file = new File([blob], '屎了么-记录成功.png', { type: 'image/png' })
        await navigator.share({ files: [file], title: '屎了么' })
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
        {/* Shareable card */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="记录成功"
            className="w-full rounded-[24px] shadow-[0_24px_64px_rgba(255,215,9,0.25)]"
          />
        )}

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 px-2">
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
