import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'
import { useUIStore } from '@/store'

export default function AppLayout() {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar  />
      <main className={`
        pt-16 min-h-screen transition-all duration-200
        ${sidebarOpen ? 'ml-60' : 'ml-16'}
      `}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
