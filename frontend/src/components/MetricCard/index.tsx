interface Props {
  title: string
  children: React.ReactNode
}

export function MetricCard({ title, children }: Props) {
  return (
    <div className="bg-white border border-[#fff6d5] rounded-xl p-4">
      <p className="text-xs text-[#898989] font-medium mb-3">{title}</p>
      {children}
    </div>
  )
}
