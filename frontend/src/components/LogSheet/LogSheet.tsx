import { useState } from 'react'
import type { ShapeType, ColorType, FeelingType, LocationType, CreateLogPayload } from '../../types'
import ShapeSelector from './ShapeSelector'
import ColorSelector from './ColorSelector'
import FeelingTags from './FeelingTags'
import ContributingFactors from './ContributingFactors'
import LocationSelector from './LocationSelector'

interface LogSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: CreateLogPayload) => void
}

export default function LogSheet({ open, onClose, onSubmit }: LogSheetProps) {
  const [shape, setShape] = useState<ShapeType | null>(null)
  const [color, setColor] = useState<ColorType | null>(null)
  const [feeling, setFeeling] = useState<FeelingType | null>(null)
  const [factors, setFactors] = useState<string[]>([])
  const [location, setLocation] = useState<LocationType | null>(null)

  const reset = () => {
    setShape(null)
    setColor(null)
    setFeeling(null)
    setFactors([])
    setLocation(null)
  }

  const handleSubmit = () => {
    if (!shape) return
    onSubmit({
      shape,
      color: color ?? undefined,
      feeling: feeling ?? undefined,
      contributingFactors: factors.length ? factors : undefined,
      location: location ?? undefined,
    })
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-200 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div
        className={`absolute bottom-0 w-full transform transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-h-[85vh] overflow-y-auto rounded-t-[16px] bg-white px-5 pb-8 pt-3">
          <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-black/10" />

          <h2 className="font-display text-[21px] font-bold leading-[1.19] tracking-[0.231px]">
            记录这段光辉旅程
          </h2>

          <div className="mt-5 space-y-5">
            <section>
              <label className="mb-2 block text-[14px] font-semibold tracking-[-0.224px] text-text-secondary">
                形状
              </label>
              <ShapeSelector value={shape} onChange={setShape} />
            </section>

            <section>
              <label className="mb-2 block text-[14px] font-semibold tracking-[-0.224px] text-text-secondary">
                颜色
              </label>
              <ColorSelector value={color} onChange={setColor} />
            </section>

            <section>
              <label className="mb-2 block text-[14px] font-semibold tracking-[-0.224px] text-text-secondary">
                感受
              </label>
              <FeelingTags value={feeling} onChange={setFeeling} />
            </section>

            <section>
              <label className="mb-2 block text-[14px] font-semibold tracking-[-0.224px] text-text-secondary">
                影响因素
              </label>
              <ContributingFactors value={factors} onChange={setFactors} />
            </section>

            <section>
              <label className="mb-2 block text-[14px] font-semibold tracking-[-0.224px] text-text-secondary">
                地点
              </label>
              <LocationSelector value={location} onChange={setLocation} />
            </section>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!shape}
            className={`mt-7 w-full rounded-large py-3.5 text-[17px] font-normal tracking-[-0.374px] text-white transition-colors ${
              shape
                ? 'bg-apple-blue active:bg-apple-blue/90'
                : 'cursor-not-allowed bg-text-tertiary/40'
            }`}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  )
}
