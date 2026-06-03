import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Heart } from 'lucide-react'

const DashboardFooter: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid rgba(13,202,240,0.15)',
      background: '#fff',
      padding: '16px 24px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>

        {/* Left: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Briefcase size={12} color="#fff" />
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '0.9rem', fontWeight: 700, color: '#0d1a26',
          }}>
            Intern<span style={{ color: '#0dcaf0' }}>Hub</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: '#9bbfcc' }}>
            © {year} — Internship Connection and Tracking System
          </span>
        </div>

        {/* Center: quick links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }} className="hidden md:flex">
          {[
            { label: 'Home',    to: '/landing'  },
            { label: 'About',   to: '/about'    },
            { label: 'Contact', to: '/contact'  },
          ].map(({ label, to }) => (
            <Link
              key={to} to={to}
              style={{ fontSize: '0.78rem', color: '#5a8fa3', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0dcaf0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5a8fa3')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: built with */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: '#9bbfcc' }}>
          Made with <Heart size={12} style={{ color: '#0dcaf0', fill: '#0dcaf0' }} /> by InternHub
        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter
