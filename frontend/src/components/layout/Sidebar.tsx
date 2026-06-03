import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, FileText, BookOpen,
  ClipboardList, MessageSquare, Users,
  BarChart2, Settings, ChevronLeft, Building2,
  GraduationCap, LogOut, UserCircle,
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
    { label: 'My Profile',     to: '/student/profile',      icon: <UserCircle      size={18} /> },
  ],
  ACADEMIC_SUPERVISOR: [
    { label: 'Dashboard',   to: '/supervisor',             icon: <LayoutDashboard size={18} /> },
    { label: 'My Students', to: '/supervisor/students',    icon: <GraduationCap   size={18} /> },
    { label: 'Evaluations', to: '/supervisor/evaluations', icon: <ClipboardList   size={18} /> },
    { label: 'Logbooks',    to: '/supervisor/logbooks',    icon: <BookOpen        size={18} /> },
    { label: 'Messages',    to: '/supervisor/messages',    icon: <MessageSquare   size={18} /> },
    { label: 'Reports',     to: '/supervisor/reports',     icon: <BarChart2       size={18} /> },
    { label: 'My Profile',  to: '/supervisor/profile',     icon: <UserCircle      size={18} /> },
  ],
  SITE_SUPERVISOR: [
    { label: 'Dashboard',   to: '/supervisor',             icon: <LayoutDashboard size={18} /> },
    { label: 'My Students', to: '/supervisor/students',    icon: <GraduationCap   size={18} /> },
    { label: 'Evaluations', to: '/supervisor/evaluations', icon: <ClipboardList   size={18} /> },
    { label: 'Logbooks',    to: '/supervisor/logbooks',    icon: <BookOpen        size={18} /> },
    { label: 'Attendance',  to: '/supervisor/attendance',  icon: <FileText        size={18} /> },
    { label: 'Messages',    to: '/supervisor/messages',    icon: <MessageSquare   size={18} /> },
    { label: 'My Profile',  to: '/supervisor/profile',     icon: <UserCircle      size={18} /> },
  ],
  COMPANY: [
    { label: 'Dashboard',    to: '/company',              icon: <LayoutDashboard size={18} /> },
    { label: 'Listings',     to: '/company/internships',  icon: <Briefcase       size={18} /> },
    { label: 'Applications', to: '/company/applications', icon: <FileText        size={18} /> },
    { label: 'Interns',      to: '/company/interns',      icon: <Users           size={18} /> },
    { label: 'Messages',     to: '/company/messages',     icon: <MessageSquare   size={18} /> },
    { label: 'Analytics',    to: '/company/analytics',    icon: <BarChart2       size={18} /> },
    { label: 'My Profile',   to: '/company/profile',      icon: <UserCircle      size={18} /> },
  ],
  ADMIN: [
    { label: 'Dashboard',   to: '/admin',             icon: <LayoutDashboard size={18} /> },
    { label: 'Users',       to: '/admin/users',       icon: <Users           size={18} /> },
    { label: 'Internships', to: '/admin/internships', icon: <Briefcase       size={18} /> },
    { label: 'Enrollments', to: '/admin/enrollments', icon: <Building2       size={18} /> },
    { label: 'Reports',     to: '/admin/reports',     icon: <BarChart2       size={18} /> },
    { label: 'Settings',    to: '/admin/settings',    icon: <Settings        size={18} /> },
    { label: 'My Profile',  to: '/admin/profile',     icon: <UserCircle      size={18} /> },
  ],
  UNIVERSITY: [
    { label: 'Dashboard',   to: '/university',              icon: <LayoutDashboard size={18} /> },
    { label: 'Students',    to: '/university/students',     icon: <GraduationCap   size={18} /> },
    { label: 'Supervisors', to: '/university/supervisors',  icon: <Users           size={18} /> },
    { label: 'Evaluations', to: '/university/evaluations',  icon: <ClipboardList   size={18} /> },
    { label: 'Messages',    to: '/university/messages',     icon: <MessageSquare   size={18} /> },
    { label: 'Reports',     to: '/university/reports',      icon: <BarChart2       size={18} /> },
    { label: 'My Profile',  to: '/university/profile',      icon: <UserCircle      size={18} /> },
  ],
}

export default function Sidebar() {
  const { user, logout }               = useAuth()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  if (!user) return null

  const navItems = navByRole[user.role] ?? []

  const displayName =
    user.studentProfile    ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`      :
    user.supervisorProfile ? `${user.supervisorProfile.firstName} ${user.supervisorProfile.lastName}` :
    user.companyProfile    ? user.companyProfile.companyName                                          :
    user.adminProfile      ? `${user.adminProfile.firstName} ${user.adminProfile.lastName}`           :
    user.universityProfile ? user.universityProfile.universityName                                    :
    user.email

  const avatar =
    user.studentProfile?.profilePhotoUrl    ??
    user.supervisorProfile?.profilePhotoUrl ??
    user.companyProfile?.logoUrl            ??
    user.universityProfile?.logoUrl         ??
    null

  return (
    <aside
      className={`fixed left-0 z-40 flex flex-col transition-all duration-200 ${sidebarOpen ? 'w-60' : 'w-16'}`}
      style={{
        top: 68,                          // sits below the landing navbar (68px)
        bottom: 0,
        height: 'calc(100vh - 68px)',
        background: 'linear-gradient(180deg, #080d1a 0%, #0a1225 60%, #0d1530 100%)',
        borderRight: '1px solid rgba(126,203,247,0.10)',
      }}
    >
      {/* ── Logo / collapse ── */}
      <div
        className="flex items-center justify-between h-16 px-4"
        style={{ borderBottom: '1px solid rgba(126,203,247,0.10)' }}
      >
        {sidebarOpen && (
          <div className="flex items-center gap-2 min-w-0">
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(13,202,240,0.4)',
            }}>
              <Briefcase size={14} color="#fff" />
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.05rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}>
              Intern<span style={{ color: '#0dcaf0' }}>Hub</span>
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg ml-auto transition-colors"
          style={{ color: 'rgba(126,203,247,0.6)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(126,203,247,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#0dcaf0' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(126,203,247,0.6)' }}
        >
          <ChevronLeft size={16} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            title={!sidebarOpen ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            style={({ isActive }) => ({
              color:      isActive ? '#0dcaf0' : 'rgba(232,234,240,0.65)',
              background: isActive ? 'rgba(13,202,240,0.12)' : 'transparent',
              borderLeft: isActive ? '2px solid #0dcaf0' : '2px solid transparent',
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              if (!el.style.borderLeftColor?.includes('0dcaf0')) {
                el.style.background = 'rgba(13,202,240,0.07)'
                el.style.color = 'rgba(232,234,240,0.9)'
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              if (!el.style.borderLeftColor?.includes('0dcaf0')) {
                el.style.background = 'transparent'
                el.style.color = 'rgba(232,234,240,0.65)'
              }
            }}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div
        className="p-3"
        style={{ borderTop: '1px solid rgba(126,203,247,0.10)' }}
      >
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          {avatar ? (
            <img
              src={avatar} alt={displayName}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              style={{ ring: '2px', boxShadow: '0 0 0 2px rgba(13,202,240,0.4)' }}
            />
          ) : (
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'rgba(13,202,240,0.2)', color: '#0dcaf0', border: '1px solid rgba(13,202,240,0.3)' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#e8eaf0' }}>{displayName}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(232,234,240,0.45)' }}>{user.role.replace(/_/g, ' ')}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(232,234,240,0.4)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,202,240,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#0dcaf0' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.4)' }}
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
