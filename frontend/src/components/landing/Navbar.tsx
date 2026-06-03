import React, { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Briefcase, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',    to: '/landing' },
  { label: 'About',   to: '/about'   },
  { label: 'Contact', to: '/contact' },
]

const Navbar: React.FC = () => {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const location = useLocation()

  useEffect(() => {
    const el = document.querySelector('.lnd-page-content')
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 24)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [location.pathname]) // re-bind when page changes

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <>
      <header className={`lnd-nav${scrolled ? ' scrolled' : ''}`}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/landing" className="lnd-nav-logo">
            <div className="lnd-nav-logo-icon">
              <Briefcase size={18} color="#080d1a" />
            </div>
            <span className="lnd-nav-logo-text">Intern<span>Hub</span></span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `lnd-nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="hidden md:flex">
            <Link to="/auth/login" className="lnd-btn-outline">Log In</Link>
            <Link to="/auth/register" className="lnd-btn-primary">
              Get Started
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 8 }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lnd-mobile-menu md:hidden">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `lnd-nav-link${isActive ? ' active' : ''}`}
              style={{ display: 'block', padding: '12px 16px' }}
            >
              {label}
            </NavLink>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Link to="/auth/login"    className="lnd-btn-outline" style={{ justifyContent: 'center' }}>Log In</Link>
            <Link to="/auth/register" className="lnd-btn-primary"  style={{ justifyContent: 'center' }}>Get Started</Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
