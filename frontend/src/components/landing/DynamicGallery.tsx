import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Slide {
  id:      number
  title:   string
  caption: string
  alt:     string
  render:  () => React.ReactNode
}

const SLIDES: Slide[] = [
  {
    id:      1,
    title:   'Students & Interns',
    caption: 'Browse opportunities, track your progress, and build your professional foundation.',
    alt:     'Student dashboard showing internship applications, logbook entries, and progress tracking',
    render:  () => <StudentDashboardMockup />,
  },
  {
    id:      2,
    title:   'Companies & Organizations',
    caption: 'Post internships, review applicants, and onboard top talent seamlessly.',
    alt:     'Company dashboard displaying internship postings and applicant pipeline',
    render:  () => <CompanyDashboardMockup />,
  },
  {
    id:      3,
    title:   'Universities & Supervisors',
    caption: 'Monitor students in real-time, approve logbooks, and submit evaluations.',
    alt:     'Supervisor dashboard with student monitoring tools and evaluation forms',
    render:  () => <SupervisorDashboardMockup />,
  },
  {
    id:      4,
    title:   'The Connected Ecosystem',
    caption: 'Smart matching connects students with opportunities that align with their skills and goals.',
    alt:     'Visual representation of InternHub matching algorithm connecting students with companies',
    render:  () => <EcosystemVisualization />,
  },
]

// ── Mockup components ─────────────────────────────────────────

function StudentDashboardMockup() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(135deg, #0a1020 0%, #0d1530 100%)', borderRadius: 16, overflow: 'hidden', padding: '24px' }}>
      {/* Mock browser chrome */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
      </div>

      {/* Sidebar + content grid */}
      <div style={{ display: 'flex', gap: 16, height: 'calc(100% - 50px)' }}>
        {/* Sidebar */}
        <div style={{ width: '20%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Dashboard', 'Applications', 'Logbook', 'Reports'].map((item, i) => (
            <div key={item} style={{
              padding: '8px 12px', borderRadius: 8,
              background: i === 0 ? 'rgba(126,203,247,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === 0 ? 'rgba(126,203,247,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
              <div style={{ width: '80%', height: 8, borderRadius: 4, background: i === 0 ? '#7ecbf7' : 'rgba(255,255,255,0.2)' }} />
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Header */}
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '40%', height: 14, borderRadius: 4, background: 'rgba(126,203,247,0.4)', marginBottom: 8 }} />
            <div style={{ width: '60%', height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, flex: 1 }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                padding: 14, borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(126,203,247,0.15)',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ width: '70%', height: 8, borderRadius: 4, background: '#7ecbf7' }} />
                <div style={{ width: '50%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ width: '90%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompanyDashboardMockup() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(135deg, #0d1530 0%, #111d3a 100%)', borderRadius: 16, overflow: 'hidden', padding: '24px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: 'calc(100% - 50px)' }}>
        {/* Header with button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '35%', height: 14, borderRadius: 4, background: 'rgba(126,203,247,0.5)' }} />
          <div style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #7ecbf7, #3a9fd6)' }}>
            <div style={{ width: 60, height: 8, borderRadius: 4, background: '#080d1a' }} />
          </div>
        </div>

        {/* Table rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{
              padding: 14, borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7ecbf7, #3a9fd6)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ width: `${70 - n * 5}%`, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ width: `${50 - n * 3}%`, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <div style={{ padding: '6px 12px', borderRadius: 6, background: n % 2 === 0 ? 'rgba(126,203,247,0.2)' : 'rgba(255,193,7,0.2)', border: `1px solid ${n % 2 === 0 ? 'rgba(126,203,247,0.3)' : 'rgba(255,193,7,0.3)'}` }}>
                <div style={{ width: 40, height: 6, borderRadius: 3, background: n % 2 === 0 ? '#7ecbf7' : '#ffc107' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SupervisorDashboardMockup() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(135deg, #111d3a 0%, #0a1020 100%)', borderRadius: 16, overflow: 'hidden', padding: '24px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, height: 'calc(100% - 50px)' }}>
        {/* Left: Student cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{
              padding: 14, borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(126,203,247,0.12)',
              display: 'flex', gap: 12,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg, #7ecbf7, #5bb8e8)', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ width: `${80 - n * 10}%`, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.35)' }} />
                <div style={{ width: `${60 - n * 8}%`, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <div style={{ padding: '4px 8px', borderRadius: 5, background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <div style={{ width: 24, height: 5, borderRadius: 2, background: '#22c55e' }} />
                  </div>
                  <div style={{ padding: '4px 8px', borderRadius: 5, background: 'rgba(126,203,247,0.2)', border: '1px solid rgba(126,203,247,0.3)' }}>
                    <div style={{ width: 30, height: 5, borderRadius: 2, background: '#7ecbf7' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Stats panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['Pending', 'Approved', 'Total'].map((label, i) => (
            <div key={label} style={{
              padding: 14, borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}>
              <div style={{ width: '60%', height: 20, borderRadius: 6, background: ['#ffc107', '#22c55e', '#7ecbf7'][i], margin: '0 auto 8px', opacity: 0.9 }} />
              <div style={{ width: '70%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)', margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EcosystemVisualization() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'radial-gradient(ellipse at center, #0d1530 0%, #080d1a 100%)', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Central hub */}
      <div style={{
        position: 'absolute', width: 100, height: 100, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7ecbf7, #3a9fd6)',
        boxShadow: '0 0 60px rgba(126,203,247,0.5), inset 0 0 30px rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid rgba(255,255,255,0.3)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#080d1a', textAlign: 'center', lineHeight: 1.3 }}>
          Intern<br/>Hub
        </div>
      </div>

      {/* Orbiting nodes */}
      {[
        { angle: 0,   label: 'Students',     color: '#7ecbf7' },
        { angle: 90,  label: 'Companies',    color: '#5bb8e8' },
        { angle: 180, label: 'Universities', color: '#3a9fd6' },
        { angle: 270, label: 'Supervisors',  color: '#6ec5f3' },
      ].map(({ angle, label, color }, i) => {
        const rad = (angle * Math.PI) / 180
        const distance = 140
        const x = Math.cos(rad) * distance
        const y = Math.sin(rad) * distance
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              width: 70, height: 70, borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${color}, rgba(13,21,48,0.8))`,
              border: `2px solid ${color}`,
              boxShadow: `0 0 24px ${color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            }}
          >
            <div style={{ fontSize: 7, fontWeight: 600, color: '#fff', textAlign: 'center' }}>{label}</div>
          </div>
        )
      })}

      {/* Connection lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180
          const distance = 140
          const x = Math.cos(rad) * distance
          const y = Math.sin(rad) * distance
          return (
            <line
              key={angle}
              x1="50%" y1="50%"
              x2={`calc(50% + ${x}px)`}
              y2={`calc(50% + ${y}px)`}
              stroke="rgba(126,203,247,0.3)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )
        })}
      </svg>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(var(--x), var(--y)) translateY(0); }
          50%       { transform: translate(var(--x), var(--y)) translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

const DynamicGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused,     setIsPaused]     = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [isPaused])

  const currentSlide = SLIDES[currentIndex]

  return (
    <section
      id="dynamic-gallery"
      style={{ padding: '80px 0', background: '#0a0f1e', overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }} className="reveal">
          <p className="lnd-section-label">See it in action</p>
          <h2 className="lnd-section-title">Built for everyone in the journey</h2>
          <p className="lnd-section-sub" style={{ marginTop: 16 }}>
            From students to supervisors, every role gets a tailored experience.
          </p>
        </div>

        {/* Gallery container with fixed aspect ratio */}
        <div className="reveal reveal-delay-1" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', maxWidth: 1000, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              {/* Image/mockup */}
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(126,203,247,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                {currentSlide.render()}

                {/* Overlay caption */}
                <div
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(8,13,26,0.95) 0%, rgba(8,13,26,0.85) 60%, transparent 100%)',
                    padding: '32px 24px 24px',
                  }}
                >
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7ecbf7', marginBottom: 6 }}>
                    {currentSlide.title}
                  </p>
                  <p style={{ fontSize: '1rem', color: 'rgba(232,234,240,0.9)', lineHeight: 1.5, maxWidth: 600 }}>
                    {currentSlide.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 32 }}>
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to ${slide.title}`}
              style={{
                width: currentIndex === i ? 32 : 10,
                height: 10,
                borderRadius: 5,
                border: 'none',
                background: currentIndex === i ? '#7ecbf7' : 'rgba(126,203,247,0.25)',
                cursor: 'pointer',
                transition: 'width 0.3s ease, background 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.75rem', color: 'rgba(232,234,240,0.4)', fontStyle: 'italic' }}>
            Paused — move your cursor away to resume
          </p>
        )}
      </div>
    </section>
  )
}

export default DynamicGallery
