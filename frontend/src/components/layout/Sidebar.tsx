import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, FileText, BookOpen,
  ClipboardList, MessageSquare, Bell, Users,
  BarChart2, Settings, ChevronLeft, Building2,
  GraduationCap, LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useUIStore } from '@/store'
import type { Role } from '@/types'

interface NavItem { label: string; to: string; icon: React.ReactNode }

const navByRole: Record<Role, NavItem[]> = {
  STUDENT: [
    { label: 'Dashboard',      to: '/student',              icon: <LayoutDashboard size={18} /> },
    { label: 'Internships',    to: '/student/internships',  icon: <Briefcase       size={18} /> },
    { label: 'My Applications',to: '/student/applications', icon: <FileText        size={18} /> },
    { label: 'Logbook',        to: '/student/logbook',      icon: <BookOpen        size={18} /> },
    { label: 'Evaluations',    to: '/student/evaluations',  icon: <ClipboardList   size={18} /> },
    { label: 'Messages',       to: '/student/messages',     icon: <MessageSquare   size={18} /> },
    { label: 'Reports',        to: '/student/reports',      icon: <BarChart2       size={18} /> },
  ],
  ACADEMIC_SUPERVISOR: [
    { label: 'Dashboard',   to: '/supervisor',                  icon: <LayoutDashboard size={18} /> },
    { label: 'My Students', to: '/supervisor/students',         icon: <GraduationCap   size={18} /> },
    { label: 'Evaluations', to: '/supervisor/evaluations',      icon: <ClipboardList   size={18} /> },
    { label: 'Logbooks',    to: '/supervisor/logbooks',         icon: <BookOpen        size={18} /> },
    { label: 'Messages',    to: '/supervisor/messages',         icon: <MessageSquare   size={18} /> },
    { label: 'Reports',     to: '/supervisor/reports',          icon: <BarChart2       size={18} /> },
  ],
  SITE_SUPERVISOR: [
    { label: 'Dashboard',   to: '/supervisor',             icon: <LayoutDashboard size={18} /> },
    { label: 'My Students', to: '/supervisor/students',    icon: <GraduationCap   size={18} /> },
    { label: 'Evaluations', to: '/supervisor/evaluations', icon: <ClipboardList   size={18} /> },
    { label: 'Logbooks',    to: '/supervisor/logbooks',    icon: <BookOpen        size={18} /> },
    { label: 'Attendance',  to: '/supervisor/attendance',  icon: <FileText        size={18} /> },
    { label: 'Messages',    to: '/supervisor/messages',    icon: <MessageSquare   size={18} /> },
  ],
  COMPANY: [
    { label: 'Dashboard',    to: '/company',              icon: <LayoutDashboard size={18} /> },
    { label: 'Listings',     to: '/company/internships',  icon: <Briefcase       size={18} /> },
    { label: 'Applications', to: '/company/applications', icon: <FileText        size={18} /> },
    { label: 'Interns',      to: '/company/interns',      icon: <Users           size={18} /> },
    { label: 'Messages',     to: '/company/messages',     icon: <MessageSquare   size={18} /> },
    { label: 'Analytics',    to: '/company/analytics',    icon: <BarChart2       size={18} /> },
  ],
  ADMIN: [
    { label: 'Dashboard',    to: '/admin',              icon: <LayoutDashboard size={18} /> },
    { label: 'Users',        to: '/admin/users',        icon: <Users           size={18} /> },
    { label: 'Internships',  to: '/admin/internships',  icon: <Briefcase       size={18} /> },
    { label: 'Enrollments',  to: '/admin/enrollments',  icon: <Building2       size={18} /> },
    { label: 'Reports',      to: '/admin/reports',      icon: <BarChart2       size={18} /> },
    { label: 'Settings',     to: '/admin/settings',     icon: <Settings        size={18} /> },
  ],
}

export default function Sidebar() {
  const { user, logout }          = useAuth()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  if (!user) return null

  const navItems = navByRole[user.role] ?? []

  const displayName =
    user.studentProfile    ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`     :
    user.supervisorProfile ? `${user.supervisorProfile.firstName} ${user.supervisorProfile.lastName}`:
    user.companyProfile    ? user.companyProfile.companyName                                         :
    user.adminProfile      ? `${user.adminProfile.firstName} ${user.adminProfile.lastName}`          :
    user.email

  const avatar =
    user.studentProfile?.profilePhotoUrl    ??
    user.supervisorProfile?.profilePhotoUrl ??
    user.companyProfile?.logoUrl            ??
    null

  return (
    <aside className={`
      fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40
      flex flex-col transition-all duration-200
      ${sidebarOpen ? 'w-60' : 'w-16'}
    `}>
      {/* Logo + collapse button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
        {sidebarOpen && (
          <span className="font-bold text-brand-600 text-sm leading-tight">
            Internship<br />System
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors ml-auto"
        >
          <ChevronLeft size={16} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors group
              ${isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
              ${sidebarOpen ? '' : 'justify-center'}
            `}
            title={!sidebarOpen ? item.label : undefined}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          {avatar ? (
            <img src={avatar} alt={displayName} className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user.role.replace('_', ' ')}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
