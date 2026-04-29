import { Bell, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore, useNotificationStore } from '@/store'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { sidebarOpen }  = useUIStore()
  const { unreadCount }  = useNotificationStore()
  const { user }         = useAuth()
  const navigate         = useNavigate()
  const [search, setSearch] = useState('')

  const notifPath =
    user?.role === 'STUDENT'             ? '/student/notifications'    :
    user?.role === 'COMPANY'             ? '/company/notifications'    :
    user?.role === 'ADMIN'               ? '/admin/notifications'      :
    '/supervisor/notifications'

  return (
    <header className={`
      fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30
      flex items-center justify-between px-6 gap-4
      transition-all duration-200
      ${sidebarOpen ? 'left-60' : 'left-16'}
    `}>
      {/* Search */}
      <div className="relative max-w-sm w-full">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search internships, students…"
          className="input pl-9 py-1.5 text-sm"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          onClick={() => navigate(notifPath)}
          className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
