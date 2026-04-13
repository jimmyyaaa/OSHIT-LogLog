import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-[16px] bg-white px-5 pb-8 pt-3 animate-slide-up">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-black/10" />
        <h2 className="font-display text-[21px] font-bold leading-[1.19] tracking-[0.231px]">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-large bg-light-gray py-3 text-[17px] tracking-[-0.374px] text-near-black active:bg-button-active"
        >
          关闭
        </button>
      </div>
    </div>
  )
}
