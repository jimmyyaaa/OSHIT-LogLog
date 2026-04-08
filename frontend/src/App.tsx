import { useState } from 'react'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'

type Tab = 'home' | 'dashboard' | 'profile'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="flex flex-col min-h-svh">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#fff6d5] flex">
        <button
          onClick={() => setTab('dashboard')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            tab === 'dashboard' ? 'text-[#272727] border-b-2 border-[#FFD73B]' : 'text-[#898989]'
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setTab('home')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            tab === 'home' ? 'text-[#272727] border-b-2 border-[#FFD73B]' : 'text-[#898989]'
          }`}
        >
          💩
        </button>
        <button
          onClick={() => setTab('profile')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            tab === 'profile' ? 'text-[#272727] border-b-2 border-[#FFD73B]' : 'text-[#898989]'
          }`}
        >
          👤 Profile
        </button>
      </nav>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {tab === 'home'      && <Home />}
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'profile'   && <Profile />}
      </main>
    </div>
  )
}
