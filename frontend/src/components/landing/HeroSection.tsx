import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AvatarSpeaker from './AvatarSpeaker'

const WELCOME_SCRIPT: string[] = [
  "Welcome. I'm glad you're here.",
  "This platform was built with one goal in mind — to make internship management smarter, simpler, and more human.",
  "Whether you're a student stepping into your first professional experience, or an organization looking to shape the next generation of talent — you've come to the right place.",
  "Here, interns are matched with meaningful opportunities.",
  "Progress is tracked with clarity.",
  "And every step of the journey is supported.",
  "No more paperwork lost in emails.",
  "No more confusion about tasks or timelines.",
  "Just a clean, connected experience — from day one to graduation.",
  "We believe internships shouldn't just be something you survive.",
  "They should be something you remember — a real foundation for the career ahead.",
  "So go ahead. Explore. Log in, or create your account, and let's build something great together.",
  "Welcome aboard.",
]

/*
  BG_SLIDES:
  - Slides 0 & 1 → your local images saved to /public/
  - Slides 2 & 3 → Pexels photos (people at PCs / video call — kept as requested)
*/
const BG_SLIDES = [
  {
    // YOUR IMAGE 1: intern pointing at server rack, group learning
    url: '/intern-team-1.jpg',
    panFrom: 'scale(1.08) translate(-1%, 0%)',
    panTo:   'scale(1.15) translate(1%, -1%)',
    alt: 'Interns learning networking — group around server rack with laptop',
  },
  {
    // YOUR IMAGE 2: networking internship lab, interns with lanyards
    url: '/intern-team-2.jpg',
    panFrom: 'scale(1.1) translate(1%, 1%)',
    panTo:   'scale(1.18) translate(-1%, 0%)',
    alt: 'Networking internship lab — interns configuring servers',
  },
  {
    // People sitting at PCs having a video call / conversation — kept
    url: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80',
    panFrom: 'scale(1.08) translate(0%, -1%)',
    panTo:   'scale(1.14) translate(-1%, 1%)',
    alt: 'Team collaborating on video call at their computers',
  },
  {
    // Second people-at-PCs scene — office video conferencing
    url: 'https://images.pexels.com/photos/4226122/pexels-photo-4226122.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80',
    panFrom: 'scale(1.1) translate(-1%, 1%)',
    panTo:   'scale(1.16) translate(1%, -1%)',
    alt: 'Colleagues in a video conference at their desks',
  },
]

const SLIDE_DURATION = 6000 // ms each slide stays visible

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [prev,    setPrev]    = useState<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => {
        setPrev(c)
        return (c + 1) % BG_SLIDES.length
      })
    }, SLIDE_DURATION)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="hero" className="lnd-hero" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Ken Burns slideshow ─────────────────────────────────
          Each slide fades in over 1.2s while slowly panning/zooming.
          The outgoing slide fades out simultaneously.
      ── */}
      {BG_SLIDES.map((slide, i) => {
        const isActive = i === current
        const isLeaving = i === prev
        if (!isActive && !isLeaving) return null
        return (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position:   'absolute',
              inset:      0,
              zIndex:     isActive ? 1 : 0,
              opacity:    isActive ? 1 : 0,
              transition: 'opacity 1.4s ease-in-out',
              overflow:   'hidden',
            }}
          >
            <img
              src={slide.url}
              alt={slide.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              style={{
                width:      '100%',
                height:     '100%',
                objectFit:  'cover',
                transform:  isActive ? slide.panTo : slide.panFrom,
                transition: isActive
                  ? `transform ${SLIDE_DURATION + 1400}ms ease-in-out`
                  : 'none',
              }}
            />
          </div>
        )
      })}

      {/* ── Dark overlay — left heavy so text pops ─────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset:    0,
          zIndex:   2,
          background: [
            'linear-gradient(to right, rgba(8,13,26,0.93) 0%, rgba(8,13,26,0.78) 45%, rgba(8,13,26,0.55) 100%)',
            'linear-gradient(to bottom, rgba(8,13,26,0.40) 0%, rgba(8,13,26,0.15) 40%, rgba(8,13,26,0.75) 100%)',
          ].join(', '),
          pointerEvents: 'none',
        }}
      />

      {/* ── Cyan glow — maintains brand feel over photos ────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset:    0,
          zIndex:   2,
          background: 'radial-gradient(ellipse 65% 50% at 68% 45%, rgba(126,203,247,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Grid overlay ───────────────────────────────────────── */}
      <div className="lnd-hero-grid" style={{ zIndex: 2 }} />

      {/* ── Slide indicator dots ────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          gap: 8,
        }}
      >
        {BG_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrev(current); setCurrent(i) }}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width:  i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === current ? '#7ecbf7' : 'rgba(126,203,247,0.35)',
              cursor: 'pointer',
              transition: 'width 0.4s ease, background 0.4s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Hero content — z-index 3, nothing changed ───────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">

          {/* ── Left: Text ── */}
          <div>
            {/* Badge */}
            <div
              className="reveal"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(126,203,247,0.12)',
                border: '1px solid rgba(126,203,247,0.3)',
                marginBottom: 24,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7ecbf7', display: 'inline-block', animation: 'avatarPulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#7ecbf7', textTransform: 'uppercase' }}>
                Internship Connection and Tracking System
              </span>
            </div>

            {/* Headline */}
            <h1
              className="reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20, color: '#fff', textShadow: '0 2px 32px rgba(0,0,0,0.6)' }}
            >
              Where talent meets{' '}
              <span className="lnd-gradient-text">opportunity</span>
            </h1>

            {/* Sub */}
            <p
              className="reveal reveal-delay-2"
              style={{ fontSize: '1.05rem', color: 'rgba(232,234,240,0.80)', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}
            >
              A unified platform for students, companies, supervisors, and universities
              to manage the full internship lifecycle — from application to certification.
            </p>

            {/* CTAs */}
            <div className="reveal reveal-delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
              <Link to="/auth/register" className="lnd-btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/about" className="lnd-btn-outline" style={{ padding: '12px 28px', fontSize: '0.95rem', backdropFilter: 'blur(8px)' }}>
                Learn More
              </Link>
            </div>

            {/* Mini stats */}
            <div
              className="reveal reveal-delay-4"
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24, paddingTop: 32,
                borderTop: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {[
                { value: '2,000+', label: 'Interns placed'    },
                { value: '500+',   label: 'Partner companies' },
                { value: '50+',    label: 'Universities'      },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, color: '#7ecbf7', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(232,234,240,0.6)', marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Avatar ── */}
          <div className="reveal reveal-delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <AvatarSpeaker script={WELCOME_SCRIPT} autoPlay={true} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
