import { useState } from 'react'
import { PublicNavbar } from './Landing'
import { CheckCircle, GraduationCap, Building2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      <PublicNavbar active="contact" />

      {/* Hero banner */}
      <div className="pt-16">
        <div className="relative h-48 flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-neutral-900) 0%, var(--color-info-dark) 100%)' }}>
          <div className="text-center z-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-info)' }}>Get in touch</p>
            <h1 className="text-3xl font-extrabold text-white">Contact Us</h1>
          </div>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-info)' }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-primary)' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* Left — info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              We're here to help
            </p>
            <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--color-neutral-900)' }}>
              Have questions? Let's talk.
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--color-neutral-700)' }}>
              Whether you're a student looking for guidance, a company wanting to post internships,
              or an institution exploring a partnership — we'd love to hear from you.
            </p>

            {/* Contact details */}
            <div className="space-y-5 mb-10">
              {[
                { icon: <Mail size={18} />,    label: 'Email us',      value: 'support@internshipsystem.rw',  color: 'var(--color-primary)' },
                { icon: <Phone size={18} />,   label: 'Call us',       value: '+250 780 000 000',              color: 'var(--color-info)' },
                { icon: <MapPin size={18} />,  label: 'Find us',       value: 'KG 7 Ave, Kigali, Rwanda',     color: 'var(--color-primary)' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neutral-700)' }}>{item.label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-neutral-900)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Who to contact */}
            <div className="space-y-4">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>Who should reach out?</p>
              {[
                { icon: <GraduationCap size={18} />, title: 'Students & Supervisors', desc: 'Questions about logbooks, evaluations, or account setup', color: 'var(--color-info)' },
                { icon: <Building2    size={18} />, title: 'Companies',              desc: 'Posting internships, managing applications, or billing',  color: 'var(--color-primary)' },
                { icon: <ShieldCheck  size={18} />, title: 'Institutions',           desc: 'Academic partnerships and bulk enrollment',               color: 'var(--color-primary)' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-neutral-700)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-neutral-900)' }}>Message sent!</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-neutral-700)' }}>
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', role: '', message: '' }) }}
                  className="text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-neutral-900)' }}>Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full name</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="label">I am a…</label>
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input">
                      <option value="">Select your role</option>
                      <option value="student">Student</option>
                      <option value="company">Company / Employer</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="institution">Academic Institution</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input resize-none" placeholder="How can we help you?" />
                  </div>
                  <button type="submit"
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}>
                    Send message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 py-8 border-t border-gray-200">
        <p className="text-center text-xs" style={{ color: 'var(--color-neutral-700)' }}>
          © {new Date().getFullYear()} Internship Monitoring & Connecting System. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
