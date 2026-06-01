import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Menu, X, LogIn, UserPlus } from 'lucide-react'

// ── Shared Public Navbar (white, like the reference) ─────────
export function PublicNavbar({ active }: { active: 'home' | 'about' | 'contact' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Home',    to: '/landing' },
    { label: 'About',   to: '/about'   },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#fff',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : '0 1px 0 rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo — top left */}
        <Link to="/landing" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-info)' }}>
            <Briefcase size={14} style={{ color: 'var(--color-dark)' }} />
          </div>
          <span className="font-bold text-sm leading-tight" style={{ color: 'var(--color-primary)' }}>
            Internship<br />Monitoring System
          </span>
        </Link>

        {/* Desktop nav — top right */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  color: active === label.toLowerCase()
                    ? 'var(--color-primary)'
                    : 'var(--color-neutral-700)',
                  fontWeight: active === label.toLowerCase() ? 600 : 400,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link to="/auth/login"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-info)', color: 'var(--color-dark)' }}>
              <LogIn size={14} /> Login
            </Link>
            <Link to="/auth/register"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary-dark)' }}>
              <UserPlus size={14} /> Register
            </Link>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link to="/auth/login" onClick={() => setMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--color-info)', color: 'var(--color-dark)' }}>
              Login
            </Link>
            <Link to="/auth/register" onClick={() => setMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded text-sm font-semibold border"
              style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary-dark)' }}>
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Home Page ─────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* Background video (IT/tech from Pexels CDN — free) */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source
          src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay — same feel as the reference screenshot */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(30,34,40,0.62)', zIndex: 1 }}
      />

      {/* Navbar sits on top */}
      <PublicNavbar active="home" />

      {/* Centered hero content */}
      <div
        className="relative flex flex-col items-center justify-center h-full text-center px-6"
        style={{ zIndex: 2 }}
      >
        {/* Main headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Manage Internships{' '}
          <span style={{ color: 'var(--color-info)' }}>Smarter</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base text-white/75 mb-8 max-w-md leading-relaxed">
          The Internship Monitoring System connects students, organizations, supervisors,
          and universities on one platform to streamline the entire
          internship process.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-info)', color: 'var(--color-dark)' }}
          >
            <LogIn size={15} /> Login
          </Link>
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded font-semibold text-sm border transition-all hover:bg-white/10"
            style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
          >
            <UserPlus size={15} /> Register
          </Link>
        </div>
      </div>
    </div>
  )
}
