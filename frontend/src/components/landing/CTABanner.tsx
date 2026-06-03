import React from 'react'
import { Link } from 'react-router-dom'

const CTABanner: React.FC = () => {
  return (
    <section className="lnd-cta">
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        {/* Decorative ring */}
        <div
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(126,203,247,0.08)',
            border: '1px solid rgba(126,203,247,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
          }}
        >
          <div
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7ecbf7, #3a9fd6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#080d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        </div>

        <p className="lnd-section-label reveal" style={{ textAlign: 'center' }}>Join today</p>
        <h2
          className="lnd-section-title reveal reveal-delay-1"
          style={{ textAlign: 'center', marginBottom: 16 }}
        >
          Ready to start your journey?
        </h2>
        <p
          className="lnd-section-sub reveal reveal-delay-2"
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          Create your account in minutes and connect with opportunities that match your goals.
          Students, companies, and universities — all welcome.
        </p>

        <div className="reveal reveal-delay-3" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
          <Link to="/auth/register" className="lnd-btn-primary" style={{ padding: '13px 32px', fontSize: '1rem' }}>
            Create free account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/auth/login" className="lnd-btn-outline" style={{ padding: '13px 32px', fontSize: '1rem' }}>
            Sign in
          </Link>
        </div>

        {/* Trust badges */}
        <div
          className="reveal reveal-delay-4"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 48 }}
        >
          {['No credit card required', 'Free for students', 'Secure & private'].map((badge) => (
            <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'rgba(232,234,240,0.5)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ecbf7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CTABanner
