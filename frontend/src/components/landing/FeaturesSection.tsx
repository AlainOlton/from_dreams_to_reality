import React from 'react'
import {
  Zap, BarChart2, FileText, Bell, Users, PieChart,
} from 'lucide-react'

const FEATURES = [
  {
    icon:  <Zap size={22} />,
    title: 'Smart Matching',
    desc:  'Students are matched with internship opportunities based on their skills, department, and preferences. No more endless scrolling.',
  },
  {
    icon:  <BarChart2 size={22} />,
    title: 'Progress Tracking',
    desc:  'Real-time visibility into every intern\'s journey — logbooks, attendance, task completion, and evaluation scores in one dashboard.',
  },
  {
    icon:  <FileText size={22} />,
    title: 'Document Management',
    desc:  'CVs, cover letters, logbook attachments, and final reports — all stored securely in the cloud and accessible anytime.',
  },
  {
    icon:  <Bell size={22} />,
    title: 'Real-time Notifications',
    desc:  'Instant alerts for application updates, missed logbooks, evaluation deadlines, and new messages via Socket.IO.',
  },
  {
    icon:  <Users size={22} />,
    title: 'Mentor Connect',
    desc:  'Built-in messaging between students, academic supervisors, and site supervisors. Typing indicators, read receipts, file sharing.',
  },
  {
    icon:  <PieChart size={22} />,
    title: 'Analytics Dashboard',
    desc:  'Placement analytics, evaluation summaries, and institutional reports exported as PDF or Excel with one click.',
  },
]

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="lnd-features">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="lnd-section-label reveal">Platform features</p>
          <h2 className="lnd-section-title reveal reveal-delay-1">Everything in one place</h2>
          <p className="lnd-section-sub reveal reveal-delay-2" style={{ marginTop: 16 }}>
            From the first application to the final certificate — the entire internship lifecycle managed digitally.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`lnd-feature-card reveal reveal-delay-${(i % 3) + 1}`}
            >
              <div className="lnd-feature-icon">{f.icon}</div>
              <div className="lnd-feature-title">{f.title}</div>
              <div className="lnd-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
