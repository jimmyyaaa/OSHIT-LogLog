import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
      <Outlet />
    </div>
  )
}
