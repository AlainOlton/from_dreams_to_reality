import React, { useEffect, useRef, useState } from 'react'

interface Stat {
  target:  number
  suffix:  string
  label:   string
  prefix?: string
}

const STATS: Stat[] = [
  { target: 2000, suffix: '+', label: 'Interns Placed'      },
  { target: 500,  suffix: '+', label: 'Partner Companies'   },
  { target: 98,   suffix: '%', label: 'Satisfaction Rate'   },
  { target: 50,   suffix: '+', label: 'Universities'        },
]

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])

  return count
}

const StatCard: React.FC<{ stat: Stat; active: boolean; delay: number }> = ({ stat, active, delay }) => {
  const count = useCountUp(stat.target, 1800, active)

  return (
    <div
      className="lnd-stat-card reveal"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="lnd-stat-num">
        {stat.prefix ?? ''}{active ? count.toLocaleString() : 0}{stat.suffix}
      </div>
      <div className="lnd-stat-label">{stat.label}</div>
    </div>
  )
}

const StatsSection: React.FC = () => {
  const ref    = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="stats" className="lnd-stats" ref={ref}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="lnd-section-label reveal">By the numbers</p>
          <h2 className="lnd-section-title reveal reveal-delay-1">Trusted by thousands</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} active={active} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
