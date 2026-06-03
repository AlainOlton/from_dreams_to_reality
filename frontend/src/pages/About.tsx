import { Link } from 'react-router-dom'
import {
  GraduationCap, Building2, ShieldCheck, Users,
  Globe, CheckCircle, ArrowRight, Target, Heart, Zap,
} from 'lucide-react'
import PublicLayout from '@/components/landing/PublicLayout'
import CTABanner   from '@/components/landing/CTABanner'
import Footer      from '@/components/landing/Footer'
import '@/styles/landing.css'

export default function About() {
  return (
    <PublicLayout>
      {/* Page hero */}
      <div className="lnd-page-hero">
        <div className="lnd-hero-grid" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
          <span className="lnd-section-label reveal">Our story</span>
          <h1 className="lnd-section-title reveal reveal-delay-1" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', marginTop: 4 }}>
            Built to connect students with real-world opportunities
          </h1>
          <p className="lnd-section-sub reveal reveal-delay-2" style={{ marginTop: 16 }}>
            InternHub is a full-stack platform designed to streamline every step of the internship
            process — from discovery and application through to supervision, evaluation, and certification.
          </p>
        </div>
      </div>

      {/* Mission / Values / Approach */}
      <section style={{ padding: '80px 0', background: '#0a1020' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: <Target size={24} />, title: 'Our Mission',  desc: 'To eliminate friction from the internship process — for every student, every company, every supervisor — so the focus stays on learning and growth, not paperwork.' },
              { icon: <Heart  size={24} />, title: 'Our Values',   desc: 'Human-first design. Transparency at every step. Real accountability through data. And a genuine belief that internships should be transformative, not transactional.' },
              { icon: <Zap    size={24} />, title: 'Our Approach', desc: 'A unified platform for all roles. Role-based dashboards, real-time messaging, automated notifications, and PDF/Excel reporting — all in one connected system.' },
            ].map((v, i) => (
              <div key={v.title} className={`lnd-feature-card reveal reveal-delay-${i + 1}`}>
                <div className="lnd-feature-icon">{v.icon}</div>
                <div className="lnd-feature-title">{v.title}</div>
                <div className="lnd-feature-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who uses InternHub */}
      <section style={{ padding: '80px 0', background: '#080d1a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="about-two-col">
            {/* Role cards */}
            <div className="reveal">
              <div style={{ borderRadius: 20, background: 'linear-gradient(145deg, #0d1530, #111d3a)', border: '1px solid rgba(126,203,247,0.12)', padding: 32 }}>
                <span className="lnd-section-label" style={{ marginBottom: 20 }}>Who uses InternHub</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { icon: <GraduationCap size={17} />, role: 'Students',             desc: 'Apply, track progress, submit logbooks, get evaluated' },
                    { icon: <Building2    size={17} />, role: 'Companies',            desc: 'Post listings, review applicants, manage interns'      },
                    { icon: <ShieldCheck  size={17} />, role: 'Academic Supervisors', desc: 'Monitor students, approve logbooks, submit evaluations' },
                    { icon: <Users        size={17} />, role: 'Site Supervisors',     desc: 'On-site oversight, attendance, task assignment'        },
                    { icon: <Globe        size={17} />, role: 'Universities',         desc: 'Institutional dashboard, placement analytics, reports' },
                  ].map((r) => (
                    <div key={r.role} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'rgba(126,203,247,0.12)', border: '1px solid rgba(126,203,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ecbf7' }}>
                        {r.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{r.role}</p>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(232,234,240,0.45)' }}>{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="lnd-section-label reveal">The platform</span>
              <h2 className="lnd-section-title reveal reveal-delay-1" style={{ marginBottom: 20, marginTop: 4 }}>
                One system, every role, zero confusion
              </h2>
              <div className="reveal reveal-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: '0.95rem', color: 'rgba(232,234,240,0.6)', lineHeight: 1.75 }}>
                  Academic institutions, companies, and students operate within a single unified environment —
                  eliminating the paperwork and manual coordination that used to define internship management.
                </p>
                <p style={{ fontSize: '0.95rem', color: 'rgba(232,234,240,0.6)', lineHeight: 1.75 }}>
                  Supervisors get real-time visibility into student progress. Companies manage their intern
                  pipeline efficiently. Students have a clear, timestamped record of their professional development.
                </p>
              </div>
              <div className="reveal reveal-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
                {[
                  'Two internship tracks: Academic and Professional',
                  'Real-time messaging with Socket.IO',
                  'PDF & Excel report generation',
                  'Role-based access for all six user types',
                  'Cloudinary-powered secure file storage',
                  'Automated missed-logbook alerts to supervisors',
                ].map((point) => (
                  <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'rgba(232,234,240,0.75)' }}>
                    <CheckCircle size={15} style={{ color: '#7ecbf7', flexShrink: 0 }} />
                    {point}
                  </div>
                ))}
              </div>
              <div className="reveal reveal-delay-4" style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/auth/register" className="lnd-btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                  Join the platform <ArrowRight size={16} />
                </Link>
                <Link to="/features" className="lnd-btn-outline" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                  See all features
                </Link>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.about-two-col{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
      </section>

      {/* Tech stack */}
      <section style={{ padding: '60px 0', background: '#0a1020', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p className="reveal" style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,234,240,0.3)', marginBottom: 32 }}>
            Built with
          </p>
          <div className="reveal reveal-delay-1" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {['React 19', 'TypeScript', 'Node.js', 'Express 5', 'PostgreSQL', 'Prisma', 'Socket.IO', 'Tailwind CSS', 'Cloudinary'].map((tech) => (
              <span key={tech} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(126,203,247,0.06)', border: '1px solid rgba(126,203,247,0.15)', fontSize: '0.82rem', fontWeight: 500, color: 'rgba(232,234,240,0.6)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </PublicLayout>
  )
}
