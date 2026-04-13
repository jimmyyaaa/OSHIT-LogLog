import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '../../types'
import { computeReportData, renderReportCanvas } from './generateReport'

interface ReportModalProps {
  open: boolean
  onClose: () => void
  entries: LogEntry[]
}

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
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!open) {
      setImageUrl(null)
      return
    }

    const { monday, sunday } = getPreviousWeek()
    const data = computeReportData(entries, monday, sunday)
    const canvas = renderReportCanvas(data)
    canvasRef.current = canvas
    setImageUrl(canvas.toDataURL('image/png'))
  }, [open, entries])

  const handleDownload = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'LogLog-周报.png'
    a.click()
  }

  const handleShare = async () => {
    if (!canvasRef.current) return

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvasRef.current!.toBlob(resolve, 'image/png')
      )
      if (!blob) return

      if (navigator.share) {
        const file = new File([blob], 'LogLog-周报.png', { type: 'image/png' })
        await navigator.share({ files: [file], title: 'LogLog 周报' })
      } else {
        handleDownload()
      }
    } catch {
      handleDownload()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-h-[90vh] overflow-y-auto rounded-t-[16px] bg-white px-5 pb-8 pt-3 animate-slide-up">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-black/10" />
        <h2 className="font-display text-[21px] font-bold leading-[1.19] tracking-[0.231px]">
          周报预览
        </h2>

        {/* Report preview */}
        <div className="mt-4 flex justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="周报"
              className="w-full max-w-[375px] rounded-large shadow-[rgba(0,0,0,0.08)_0px_4px_20px_0px]"
            />
          ) : (
            <div className="flex h-40 items-center justify-center text-text-tertiary">
              生成中...
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 rounded-large bg-apple-blue py-3 text-[17px] tracking-[-0.374px] text-white active:bg-apple-blue/90"
          >
            分享
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 rounded-large bg-light-gray py-3 text-[17px] tracking-[-0.374px] text-near-black active:bg-button-active"
          >
            下载
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-[14px] tracking-[-0.224px] text-text-tertiary"
        >
          关闭
        </button>
      </div>
    </div>
  )
}
