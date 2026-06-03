import { Bell, Search, UserCircle, ChevronDown, LogOut, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUIStore, useNotificationStore } from '@/store'
import { useAuth } from '@/context/AuthContext'

const ROLE_LABEL: Record<string, string> = {
  STUDENT:             'Student',
  ACADEMIC_SUPERVISOR: 'Academic Supervisor',
  SITE_SUPERVISOR:     'Site Supervisor',
  COMPANY:             'Organization',
  ADMIN:               'Administrator',
  UNIVERSITY:          'University',
}

const PROFILE_PATH: Record<string, string> = {
  STUDENT:             '/student/profile',
  ACADEMIC_SUPERVISOR: '/supervisor/profile',
  SITE_SUPERVISOR:     '/supervisor/profile',
  COMPANY:             '/company/profile',
  ADMIN:               '/admin/profile',
  UNIVERSITY:          '/university/profile',
}

export default function Navbar() {
  const { sidebarOpen }         = useUIStore()
  const { unreadCount }         = useNotificationStore()
  const { user, logout }        = useAuth()
  const navigate                = useNavigate()
  const [search,  setSearch]    = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef                 = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

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

  const initials = displayName.charAt(0).toUpperCase()
  const profilePath = PROFILE_PATH[user.role] ?? '/'

  const notifPath =
    user.role === 'STUDENT'   ? '/student/notifications'    :
    user.role === 'COMPANY'   ? '/company/notifications'    :
    user.role === 'ADMIN'     ? '/admin/notifications'      :
    '/supervisor/notifications'

  return (
    <header
      className={`fixed right-0 z-30 transition-all duration-200 ${sidebarOpen ? 'left-60' : 'left-16'}`}
      style={{
        top: 68,           // below landing navbar
        height: 64,
        background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa8cc 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 2px 16px rgba(13,202,240,0.25)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 16,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Welcome greeting ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>Welcome back,</p>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>
          {displayName}
        </p>
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', width: 260 }} className="hidden md:block">
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          style={{
            width: '100%', padding: '8px 12px 8px 32px',
            borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.18)',
            color: '#fff', fontSize: '0.82rem',
            outline: 'none', fontFamily: 'inherit',
            backdropFilter: 'blur(8px)',
          }}
          onFocus={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
          onBlur={(e)   => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
        />
      </div>

      {/* ── Right controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Notification bell */}
        <button
          onClick={() => navigate(notifPath)}
          style={{
            position: 'relative', width: 38, height: 38, borderRadius: 9,
            background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', flexShrink: 0,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.30)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          title="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 5, right: 5,
              width: 16, height: 16, borderRadius: '50%',
              background: '#ef4444', border: '2px solid #0aa8cc',
              fontSize: '9px', fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px 5px 5px', borderRadius: 10,
              background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer', color: '#fff', flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          >
            {/* Avatar */}
            {avatar ? (
              <img src={avatar} alt={displayName} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.5)' }} />
            ) : (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#0d1a26', flexShrink: 0 }}>
                {initials}
              </div>
            )}
            <div style={{ textAlign: 'left' }} className="hidden md:block">
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{displayName.split(' ')[0]}</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.2 }}>{ROLE_LABEL[user.role]}</p>
            </div>
            <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.8)', transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {/* Dropdown menu */}
          {dropOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              minWidth: 200, borderRadius: 12,
              background: '#fff', boxShadow: '0 8px 32px rgba(13,202,240,0.18)',
              border: '1px solid rgba(13,202,240,0.15)',
              overflow: 'hidden', zIndex: 50,
              animation: 'dropIn 0.15s ease',
            }}>
              {/* User info */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(13,202,240,0.1)', background: 'rgba(13,202,240,0.04)' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d1a26' }}>{displayName}</p>
                <p style={{ fontSize: '0.75rem', color: '#5a8fa3', marginTop: 2 }}>{user.email}</p>
                <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 10, background: 'rgba(13,202,240,0.12)', fontSize: '0.7rem', fontWeight: 700, color: '#0aa8cc' }}>
                  {ROLE_LABEL[user.role]}
                </span>
              </div>

              {/* Menu items */}
              <div style={{ padding: '6px' }}>
                <Link
                  to={profilePath}
                  onClick={() => setDropOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, textDecoration: 'none', color: '#0d1a26', fontSize: '0.85rem', fontWeight: 500, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,202,240,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <UserCircle size={16} style={{ color: '#0dcaf0' }} /> My Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/settings"
                    onClick={() => setDropOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, textDecoration: 'none', color: '#0d1a26', fontSize: '0.85rem', fontWeight: 500, transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,202,240,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings size={16} style={{ color: '#0dcaf0' }} /> Settings
                  </Link>
                )}
                <div style={{ height: 1, background: 'rgba(13,202,240,0.1)', margin: '4px 0' }} />
                <button
                  onClick={() => { setDropOpen(false); logout() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, width: '100%', border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', textAlign: 'left' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.55) !important; }
      `}</style>
    </header>
  )
}
