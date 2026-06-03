import React, { useState, useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    initials: 'AM',
    name:     'Alice Mugisha',
    role:     'Computer Science Student, University of Rwanda',
    quote:    'InternHub made finding my first internship so much easier. The logbook system kept me organized and my supervisor could see my progress in real time. I felt supported the whole way through.',
  },
  {
    initials: 'JH',
    name:     'Dr. Jean Habimana',
    role:     'Academic Supervisor, University of Rwanda',
    quote:    'As a supervisor managing multiple students, the dashboard is a game changer. I get notified when a student misses a logbook entry and can approve or comment from anywhere. It saves hours every week.',
  },
  {
    initials: 'RT',
    name:     'Rwanda Tech Hub',
    role:     'Partner Company, Kigali',
    quote:    'We\'ve onboarded interns through InternHub for two cycles now. The application pipeline is clean, evaluations are structured, and the final reports give us real insight into each intern\'s growth.',
  },
]

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const goTo = (i: number) => {
    setActive(i)
    if (timerRef.current) clearInterval(timerRef.current)
    startTimer()
  }

  return (
    <section id="testimonials" className="lnd-testimonials">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="lnd-section-label reveal">What people say</p>
          <h2 className="lnd-section-title reveal reveal-delay-1">Real stories, real impact</h2>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`lnd-testimonial-card reveal reveal-delay-${i + 1}`}
              style={{
                borderColor: active === i ? 'rgba(126,203,247,0.4)' : undefined,
                boxShadow:   active === i ? '0 0 32px rgba(126,203,247,0.1)' : undefined,
                cursor: 'pointer',
              }}
              onClick={() => goTo(i)}
            >
              {/* Stars */}
              <div className="lnd-stars">
                {Array.from({ length: 5 }).map((_, si) => (
                  <span key={si} className="lnd-star">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="lnd-testimonial-quote">"{t.quote}"</p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="lnd-testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="lnd-testimonial-name">{t.name}</div>
                  <div className="lnd-testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: active === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: active === i ? '#7ecbf7' : 'rgba(126,203,247,0.25)',
                cursor: 'pointer',
                transition: 'width 0.3s ease, background 0.3s ease',
                padding: 0,
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
