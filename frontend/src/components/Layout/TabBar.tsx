import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/',
    label: '首页',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    to: '/dashboard',
    label: '面板',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: '我的',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 10-16 0" />
      </svg>
    ),
  },
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="mx-auto flex h-16 max-w-[980px] items-center justify-around">
        {tabs.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 ${
                isActive ? 'text-apple-blue' : 'text-text-tertiary'
              }`
            }
          >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
