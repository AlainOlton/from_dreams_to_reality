import React, { useState } from 'react'
import { UserPlus, Search, Rocket, Building2, ClipboardCheck, GraduationCap } from 'lucide-react'

const STUDENT_STEPS = [
  {
    icon:  <UserPlus size={22} />,
    title: 'Create your profile',
    desc:  'Sign up, complete your student profile with your skills, department, and upload your CV.',
  },
  {
    icon:  <Search size={22} />,
    title: 'Browse & apply',
    desc:  'Explore internship listings, bookmark favourites, and submit applications with your cover letter.',
  },
  {
    icon:  <Rocket size={22} />,
    title: 'Start your internship',
    desc:  'Get accepted, get assigned a supervisor, and begin logging your daily progress in the logbook.',
  },
]

const ORG_STEPS = [
  {
    icon:  <Building2 size={22} />,
    title: 'Post an opportunity',
    desc:  'Create a detailed internship listing — field, duration, pay, requirements, and available slots.',
  },
  {
    icon:  <ClipboardCheck size={22} />,
    title: 'Review applicants',
    desc:  'Browse applications, schedule interviews, and accept the best candidates with one click.',
  },
  {
    icon:  <GraduationCap size={22} />,
    title: 'Onboard & evaluate',
    desc:  'Assign supervisors, track intern progress, and submit mid-term and final evaluations.',
  },
]

const HowItWorks: React.FC = () => {
  const [tab, setTab] = useState<'students' | 'orgs'>('students')
  const steps = tab === 'students' ? STUDENT_STEPS : ORG_STEPS

  return (
    <section id="how-it-works" className="lnd-how">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="lnd-section-label reveal">Simple process</p>
          <h2 className="lnd-section-title reveal reveal-delay-1">How it works</h2>
          <p className="lnd-section-sub reveal reveal-delay-2" style={{ marginTop: 16 }}>
            Whether you're a student or an organization, getting started takes minutes.
          </p>
        </div>

        {/* Toggle */}
        <div className="reveal reveal-delay-2" style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}>
          <div className="lnd-how-toggle">
            <button
              className={`lnd-how-toggle-btn${tab === 'students' ? ' active' : ''}`}
              onClick={() => setTab('students')}
            >
              For Students
            </button>
            <button
              className={`lnd-how-toggle-btn${tab === 'orgs' ? ' active' : ''}`}
              onClick={() => setTab('orgs')}
            >
              For Organizations
            </button>
          </div>
        </div>

        {/* Steps */}
        <div
          style={{ display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative' }}
          className="how-steps"
        >
          {steps.map((step, i) => (
            <div key={step.title} className="lnd-step reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
              {/* Connector line (not last) */}
              {i < steps.length - 1 && <div className="lnd-step-connector" />}

              {/* Number */}
              <div className="lnd-step-num">{i + 1}</div>

              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(126,203,247,0.1)',
                border: '1px solid rgba(126,203,247,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#7ecbf7',
              }}>
                {step.icon}
              </div>

              <div className="lnd-step-title">{step.title}</div>
              <div className="lnd-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .how-steps { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>
    </section>
  )
}

export default HowItWorks
