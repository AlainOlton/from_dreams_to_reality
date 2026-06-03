import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="lnd-footer">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #7ecbf7, #3a9fd6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Briefcase size={18} color="#080d1a" />
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                Intern<span style={{ color: '#7ecbf7' }}>Hub</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(232,234,240,0.45)', lineHeight: 1.7, maxWidth: 260 }}>
              Bridging the gap between students and industry. A smarter way to manage internships from start to finish.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {[
                { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'LinkedIn',  path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
                { label: 'GitHub',    path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
              ].map((s) => (
                <a key={s.label} href="#" className="lnd-social-btn" aria-label={s.label} onClick={(e) => e.preventDefault()}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,234,240,0.4)', marginBottom: 16 }}>Platform</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Home',    to: '/landing' },
                { label: 'About',   to: '/about'   },
                { label: 'Contact', to: '/contact'  },
              ].map(({ label, to }) => (
                <Link key={label} to={to}
                  style={{ fontSize: '0.875rem', color: 'rgba(232,234,240,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#7ecbf7')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,234,240,0.55)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,234,240,0.4)', marginBottom: 16 }}>Account</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Sign in',         to: '/auth/login'    },
                { label: 'Create account',  to: '/auth/register' },
                { label: 'Forgot password', to: '/auth/forgot'   },
              ].map(({ label, to }) => (
                <Link key={to} to={to}
                  style={{ fontSize: '0.875rem', color: 'rgba(232,234,240,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#7ecbf7')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,234,240,0.55)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,234,240,0.4)', marginBottom: 16 }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/contact"
                style={{ fontSize: '0.875rem', color: 'rgba(232,234,240,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#7ecbf7')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,234,240,0.55)')}
              >
                Get in touch
              </Link>
              <a href="mailto:hello@internhub.dev"
                style={{ fontSize: '0.875rem', color: 'rgba(232,234,240,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#7ecbf7')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,234,240,0.55)')}
              >
                hello@internhub.dev
              </a>
            </div>
          </div>
        </div>

        <div className="lnd-footer-divider" />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(232,234,240,0.3)' }}>
            © {year} InternHub — Internship Connection and Tracking System. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map((label) => (
              <a key={label} href="#"
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: '0.78rem', color: 'rgba(232,234,240,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#7ecbf7')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,234,240,0.3)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

export default Footer
