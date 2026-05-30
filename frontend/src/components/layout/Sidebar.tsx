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
  UNIVERSITY: [
    { label: 'Dashboard',    to: '/university',                icon: <LayoutDashboard size={18} /> },
    { label: 'Students',     to: '/university/students',       icon: <GraduationCap   size={18} /> },
    { label: 'Supervisors',  to: '/university/supervisors',    icon: <Users           size={18} /> },
    { label: 'Evaluations',  to: '/university/evaluations',    icon: <ClipboardList   size={18} /> },
    { label: 'Messages',     to: '/university/messages',       icon: <MessageSquare   size={18} /> },
    { label: 'Reports',      to: '/university/reports',        icon: <BarChart2       size={18} /> },
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
    user.universityProfile ? user.universityProfile.universityName                                   :
    user.email

  const avatar =
    user.studentProfile?.profilePhotoUrl    ??
    user.supervisorProfile?.profilePhotoUrl ??
    user.companyProfile?.logoUrl            ??
    user.universityProfile?.logoUrl         ??
    null

  return (
    <aside
      style={{ backgroundColor: '#6c757d' }}
      className={`
        fixed top-0 left-0 h-screen z-40
        flex flex-col transition-all duration-200
        ${sidebarOpen ? 'w-60' : 'w-16'}
      `}
    >
      {/* Logo + collapse button */}
      <div
        style={{ borderBottomColor: 'rgba(0,0,0,0.15)' }}
        className="flex items-center justify-between h-16 px-4 border-b"
      >
        {sidebarOpen && (
          <span className="font-bold text-white text-sm leading-tight drop-shadow-sm">
            Internship<br />System
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg transition-colors ml-auto text-white/70 hover:text-white hover:bg-white/10"
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
              transition-colors group nav-item
              ${isActive ? 'nav-active' : 'nav-inactive'}
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
      <div
        style={{ borderTopColor: 'rgba(0,0,0,0.15)' }}
        className="p-3 border-t"
      >
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          {avatar ? (
            <img src={avatar} alt={displayName} className="h-8 w-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white/30" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-white/60 truncate">{user.role.replace('_', ' ')}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
