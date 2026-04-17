import { useRef, useEffect, useState } from 'react'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  streak: number
  todayCount: number
  totalCount: number
}

const HEADLINES = [
  '今天我是屎王，\n你呢？',
  '一泻千里，\n畅快人生。',
  '拉完了，\n世界都亮了。',
  '论拉屎的\n自我修养。',
  '今日已交作业，\n满分通过。',
  '肠通则百通，\n通了！',
  '稳如泰山，\n滑如丝绸。',
  '认真拉屎的人，\n运气不会太差。',
  '使命已达成，\n后会有期。',
  '来过，留过，\n冲了。',
]

const SUBTITLES = [
  '记录每一次，关爱自己',
  '你的身体值得被认真对待',
  '健康从每日记录开始',
  '给自己一个交代',
  '坚持就是胜利',
]

export default function SuccessModal({ open, onClose, streak, todayCount, totalCount }: SuccessModalProps) {
  const [headline] = useState(() => HEADLINES[Math.floor(Math.random() * HEADLINES.length)])
  const [subtitle] = useState(() => SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open) { setImageUrl(null); return }

    const S = 2
    const W = 360 * S
    const H = 480 * S
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    const F = 'Nunito, -apple-system, "Helvetica Neue", "PingFang SC", sans-serif'

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#fffae1')
    grad.addColorStop(1, '#ffd709')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, 24 * S)
    ctx.fill()

    // Decorative circle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(W * 0.75, H * 0.25, 120 * S, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.beginPath()
    ctx.arc(W * 0.2, H * 0.7, 80 * S, 0, Math.PI * 2)
    ctx.fill()

    // Headline
    ctx.fillStyle = '#3d3905'
    ctx.font = `800 ${28 * S}px ${F}`
    const lines = headline.split('\n')
    let y = 80 * S
    for (const line of lines) {
      ctx.fillText(line, 32 * S, y)
      y += 36 * S
    }

    // Subtitle
    y += 8 * S
    ctx.fillStyle = '#6b662f'
    ctx.font = `500 ${13 * S}px ${F}`
    ctx.fillText(subtitle, 32 * S, y)

    // Stats area
    const statsY = H - 160 * S
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.roundRect(24 * S, statsY, W - 48 * S, 100 * S, 16 * S)
    ctx.fill()

    // Stats text
    const statsInnerY = statsY + 40 * S
    const col1 = 56 * S
    const col2 = W / 2 - 10 * S
    const col3 = W - 100 * S

    ctx.fillStyle = '#3d3905'
    ctx.font = `800 ${22 * S}px ${F}`
    ctx.textAlign = 'center'
    ctx.fillText(`${streak}`, col1, statsInnerY)
    ctx.fillText(`${todayCount}`, col2, statsInnerY)
    ctx.fillText(`${totalCount}`, col3, statsInnerY)

    ctx.fillStyle = '#6b662f'
    ctx.font = `700 ${9 * S}px ${F}`
    ctx.fillText('STREAK', col1, statsInnerY + 18 * S)
    ctx.fillText('TODAY', col2, statsInnerY + 18 * S)
    ctx.fillText('TOTAL', col3, statsInnerY + 18 * S)
    ctx.textAlign = 'start'

    // Footer
    ctx.fillStyle = 'rgba(61, 57, 5, 0.3)'
    ctx.font = `600 ${10 * S}px ${F}`
    ctx.textAlign = 'center'
    ctx.fillText('LogLog · Give a SHIT to Myself', W / 2, H - 24 * S)
    ctx.textAlign = 'start'

    canvasRef.current = canvas
    setImageUrl(canvas.toDataURL('image/png'))
  }, [open, headline, subtitle, streak, todayCount, totalCount])

  if (!open) return null

  const handleDownload = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'LogLog-记录成功.png'
    a.click()
  }

  const handleShare = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvasRef.current!.toBlob(resolve, 'image/png'))
      if (!blob) return
      if (navigator.share) {
        const file = new File([blob], 'LogLog-记录成功.png', { type: 'image/png' })
        await navigator.share({ files: [file], title: 'LogLog' })
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

        {/* Shareable card preview */}
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
