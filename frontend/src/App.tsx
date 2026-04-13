import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/Home/HomePage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ProfilePage from './pages/Profile/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
