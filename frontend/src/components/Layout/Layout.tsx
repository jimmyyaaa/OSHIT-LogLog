import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-light-gray font-body text-near-black">
      <main className="pb-20">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
