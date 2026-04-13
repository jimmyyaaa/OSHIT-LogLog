import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  children: ReactNode
}

export default function MetricCard({ title, children }: MetricCardProps) {
  return (
    <div className="rounded-large bg-white p-6">
      <h3 className="text-[14px] font-semibold tracking-[-0.224px] text-text-secondary">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  )
}
