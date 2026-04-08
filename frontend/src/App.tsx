import { useState } from 'react'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'

type Tab = 'home' | 'dashboard' | 'profile'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="flex flex-col min-h-svh bg-[#fafaf7]">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#fff0c0]">
        <div className="flex items-stretch h-12">
          <button
            onClick={() => setTab('dashboard')}
            className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold transition-all tap-scale ${
              tab === 'dashboard'
                ? 'text-[#272727] bg-[#fffbee]'
                : 'text-[#aaa]'
            }`}
          >
            <span>📊</span>
            <span>看板</span>
          </button>

          {/* Center home button */}
          <button
            onClick={() => setTab('home')}
            className="relative flex items-center justify-center w-16 tap-scale"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all shadow-md ${
              tab === 'home'
                ? 'bg-[#FFD73B] shadow-[0_4px_12px_rgba(255,215,59,0.5)] scale-110'
                : 'bg-[#fff3c0]'
            }`}>
              💩
            </div>
          </button>

          <button
            onClick={() => setTab('profile')}
            className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold transition-all tap-scale ${
              tab === 'profile'
                ? 'text-[#272727] bg-[#fffbee]'
                : 'text-[#aaa]'
            }`}
          >
            <span>👤</span>
            <span>我的</span>
          </button>
        </div>
        {/* Active indicator */}
        <div className="flex h-0.5">
          <div className={`flex-1 transition-all duration-300 ${tab === 'dashboard' ? 'bg-[#FFD73B]' : ''}`} />
          <div className="w-16" />
          <div className={`flex-1 transition-all duration-300 ${tab === 'profile' ? 'bg-[#FFD73B]' : ''}`} />
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {tab === 'home'      && <Home />}
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'profile'   && <Profile />}
      </main>
    </div>
  )
}
