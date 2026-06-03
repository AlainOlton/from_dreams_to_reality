import { useState } from 'react'
import { GraduationCap, Building2, ShieldCheck, CheckCircle, Mail, MapPin, Clock } from 'lucide-react'
import PublicLayout from '@/components/landing/PublicLayout'
import Footer       from '@/components/landing/Footer'
import '@/styles/landing.css'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', role: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <PublicLayout>
      {/* Page hero */}
      <div className="lnd-page-hero">
        <div className="lnd-hero-grid" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <span className="lnd-section-label reveal">Get in touch</span>
          <h1 className="lnd-section-title reveal reveal-delay-1" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', marginTop: 4 }}>
            We'd love to hear from you
          </h1>
          <p className="lnd-section-sub reveal reveal-delay-2" style={{ marginTop: 16 }}>
            Have a question, a partnership idea, or need help getting started?
            Drop us a message and we'll get back to you promptly.
          </p>
        </div>
      </div>

      {/* Content */}
      <section style={{ padding: '72px 0 100px', background: '#080d1a' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64, alignItems: 'start' }} className="contact-two-col">

            {/* Info */}
            <div>
              <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                {[
                  { icon: <Mail   size={18} />, title: 'Email us',       desc: 'hello@internhub.dev',      sub: 'We reply within 24 hours'     },
                  { icon: <MapPin size={18} />, title: 'Location',        desc: 'Kigali, Rwanda',           sub: 'East Africa'                  },
                  { icon: <Clock  size={18} />, title: 'Working hours',   desc: 'Mon – Fri, 8 AM – 6 PM',  sub: 'East Africa Time (EAT)'       },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: 'rgba(126,203,247,0.1)', border: '1px solid rgba(126,203,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ecbf7' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(232,234,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{item.title}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{item.desc}</p>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(232,234,240,0.4)', marginTop: 1 }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="reveal reveal-delay-1">
                <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,234,240,0.4)', marginBottom: 16 }}>Who should reach out?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { icon: <GraduationCap size={16} />, title: 'Students & Supervisors', desc: 'Logbooks, evaluations, or account questions' },
                    { icon: <Building2    size={16} />, title: 'Companies',              desc: 'Posting internships, applicants, billing'  },
                    { icon: <ShieldCheck  size={16} />, title: 'Institutions',           desc: 'Partnerships and bulk enrollment'          },
                  ].map((item) => (
                    <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(126,203,247,0.08)', border: '1px solid rgba(126,203,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ecbf7', marginTop: 1 }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{item.title}</p>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(232,234,240,0.4)', marginTop: 2 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="reveal reveal-delay-1" style={{ borderRadius: 20, background: 'rgba(13,21,48,0.7)', border: '1px solid rgba(126,203,247,0.1)', padding: 36, backdropFilter: 'blur(12px)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(126,203,247,0.12)', border: '1px solid rgba(126,203,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#7ecbf7' }}>
                    <CheckCircle size={28} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#fff', marginBottom: 10 }}>Message sent!</h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(232,234,240,0.5)', marginBottom: 28 }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', role: '', subject: '', message: '' }) }}
                    className="lnd-btn-outline" style={{ margin: '0 auto' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#fff', marginBottom: 4 }}>Send us a message</h2>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(232,234,240,0.45)', marginBottom: 4 }}>
                    Fields marked <span style={{ color: '#7ecbf7' }}>*</span> are required.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-two-col">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(232,234,240,0.6)', marginBottom: 6 }}>Full name <span style={{ color: '#7ecbf7' }}>*</span></label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(232,234,240,0.6)', marginBottom: 6 }}>Email <span style={{ color: '#7ecbf7' }}>*</span></label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-two-col">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(232,234,240,0.6)', marginBottom: 6 }}>I am a…</label>
                      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ ...inputStyle, background: '#0d1530', color: form.role ? '#fff' : 'rgba(232,234,240,0.4)' }}>
                        <option value="">Select role</option>
                        <option value="student">Student</option>
                        <option value="company">Company / Employer</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="institution">Academic Institution</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(232,234,240,0.6)', marginBottom: 6 }}>Subject <span style={{ color: '#7ecbf7' }}>*</span></label>
                      <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(232,234,240,0.6)', marginBottom: 6 }}>Message <span style={{ color: '#7ecbf7' }}>*</span></label>
                    <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help…" style={{ ...inputStyle, resize: 'none' }} />
                  </div>

                  <button type="submit" className="lnd-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem' }}>
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <style>{`
          @media(max-width:768px){
            .contact-two-col{grid-template-columns:1fr!important;gap:40px!important}
            .form-two-col{grid-template-columns:1fr!important}
          }
        `}</style>
      </section>

      <Footer />
    </PublicLayout>
  )
}
