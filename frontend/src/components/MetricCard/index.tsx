interface Props {
  title: string
  emoji?: string
  children: React.ReactNode
  accent?: boolean
}

export function MetricCard({ title, emoji, children, accent }: Props) {
  return (
    <div className={`rounded-2xl p-5 border ${
      accent
        ? 'bg-[#FFD73B] border-[#F5C800]'
        : 'bg-white border-[#fff0c0]'
    }`}
    style={accent ? { boxShadow: '0 4px 20px rgba(255,215,59,0.3)' } : { boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        {emoji && <span className="text-lg">{emoji}</span>}
        <p className={`text-xs font-bold uppercase tracking-wider ${accent ? 'text-[#7a5c00]' : 'text-[#aaa]'}`}>
          {title}
        </p>
      </div>
      {children}
    </div>
  )
}
