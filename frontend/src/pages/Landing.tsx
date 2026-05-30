import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, GraduationCap, Building2, ShieldCheck,
  BookOpen, ClipboardList, MessageSquare, BarChart2,
  ChevronRight, Menu, X, CheckCircle, Users, Globe,
  ArrowRight,
} from 'lucide-react'

// ── Navbar ────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      style={{
        backgroundColor: scrolled ? '#6c757d' : 'transparent',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.15)' : 'none',
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: '#0dcaf0' }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
          >
            <Briefcase size={16} className="text-black" />
          </div>
          <span className="font-bold text-white text-sm leading-tight">
            Internship<br />System
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Home',    action: () => scrollTo('hero') },
            { label: 'About',   action: () => scrollTo('about') },
            { label: 'Contact', action: () => scrollTo('contact') },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/85 transition-colors"
              style={{ transition: 'background-color 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#0dcaf0'; (e.currentTarget as HTMLElement).style.color = '#000' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = '' }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth/login"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/30 transition-colors hover:border-white/60 hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            style={{ backgroundColor: '#0dcaf0', color: '#000' }}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Register
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#6c757d' }} className="md:hidden border-t border-white/10 px-6 py-4 space-y-1">
          {[
            { label: 'Home',    action: () => scrollTo('hero') },
            { label: 'About',   action: () => scrollTo('about') },
            { label: 'Contact', action: () => scrollTo('contact') },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white/85 hover:bg-white/10 transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link to="/auth/login" className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-colors">
              Login
            </Link>
            <Link to="/auth/register" style={{ backgroundColor: '#0dcaf0', color: '#000' }} className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold">
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      style={{
        background: 'linear-gradient(135deg, #6c757d 0%, #495057 50%, #343a40 100%)',
      }}
      className="min-h-screen flex items-center pt-16"
    >
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <div
            style={{ backgroundColor: 'rgba(13,202,240,0.15)', color: '#0dcaf0', border: '1px solid rgba(13,202,240,0.3)' }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Internship Monitoring & Connecting System
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Bridge the gap between{' '}
            <span style={{ color: '#0dcaf0' }}>students</span>{' '}
            and{' '}
            <span style={{ color: '#0dcaf0' }}>industry</span>
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-10">
            A unified platform for students, companies, supervisors, and administrators
            to manage the full internship lifecycle — from application to evaluation.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/auth/register"
              style={{ backgroundColor: '#0dcaf0', color: '#000' }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            >
              Get started <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Learn more <ChevronRight size={16} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/10">
            {[
              { value: '5',    label: 'User roles' },
              { value: '100%', label: 'Digital workflow' },
              { value: '24/7', label: 'Real-time updates' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ color: '#0dcaf0' }} className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <GraduationCap size={22} />, title: 'Students',    desc: 'Browse listings, apply, track progress and submit logbooks' },
            { icon: <Building2    size={22} />, title: 'Companies',   desc: 'Post internships, manage applications and evaluate interns' },
            { icon: <ShieldCheck  size={22} />, title: 'Supervisors', desc: 'Monitor students, approve logbooks and submit evaluations' },
            { icon: <BarChart2    size={22} />, title: 'Admins',      desc: 'Oversee the platform, manage users and generate reports' },
          ].map((card) => (
            <div
              key={card.title}
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              className="rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div style={{ backgroundColor: 'rgba(13,202,240,0.2)', color: '#0dcaf0' }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                {card.icon}
              </div>
              <p className="font-semibold text-white text-sm mb-1">{card.title}</p>
              <p className="text-xs text-white/60 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: <Briefcase    size={24} />, title: 'Internship Listings',      desc: 'Companies post professional and academic openings. Students browse, filter by field, location, pay, and apply in one click.' },
    { icon: <ClipboardList size={24} />, title: 'Application Tracking',    desc: 'Full pipeline from APPLIED → ACCEPTED with interview scheduling, status updates, and rejection feedback.' },
    { icon: <BookOpen     size={24} />, title: 'Logbook & Attendance',     desc: 'Students submit daily or weekly logbook entries. Supervisors review and approve them with notes.' },
    { icon: <ClipboardList size={24} />, title: 'Evaluations',             desc: 'Mid-term and final evaluations by supervisors. Students submit self-assessments. All combined into reports.' },
    { icon: <MessageSquare size={24} />, title: 'Real-time Messaging',     desc: 'Socket.IO powered conversations between all participants. Typing indicators, read receipts, and file attachments.' },
    { icon: <BarChart2    size={24} />, title: 'Reports & Analytics',      desc: 'Generate PDF and Excel reports — logbook summaries, evaluation reports, placement analytics, and completion certificates.' },
  ]

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p style={{ color: '#0dcaf0' }} className="text-sm font-semibold uppercase tracking-widest mb-3">Platform features</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Everything in one place</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            From the first application to the final certificate — the entire internship lifecycle managed digitally.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div
                style={{ backgroundColor: 'rgba(13,202,240,0.12)', color: '#0a9ab8' }}
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual */}
        <div className="relative">
          <div
            style={{ background: 'linear-gradient(135deg, #6c757d, #495057)' }}
            className="rounded-3xl p-8 text-white"
          >
            <p style={{ color: '#0dcaf0' }} className="text-xs font-semibold uppercase tracking-widest mb-4">Who uses this system</p>
            <div className="space-y-4">
              {[
                { icon: <GraduationCap size={18} />, role: 'Students',             desc: 'Apply, track, log, and get evaluated' },
                { icon: <Building2    size={18} />, role: 'Companies',            desc: 'Post listings and manage interns' },
                { icon: <ShieldCheck  size={18} />, role: 'Academic Supervisors', desc: 'Monitor and evaluate assigned students' },
                { icon: <Users        size={18} />, role: 'Site Supervisors',     desc: 'On-site supervision and attendance' },
                { icon: <Globe        size={18} />, role: 'Administrators',       desc: 'Full platform oversight and reporting' },
              ].map((r) => (
                <div key={r.role} className="flex items-center gap-4 p-3 rounded-xl bg-white/10">
                  <div style={{ backgroundColor: 'rgba(13,202,240,0.25)', color: '#0dcaf0' }} className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    {r.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.role}</p>
                    <p className="text-xs text-white/60">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <p style={{ color: '#0dcaf0' }} className="text-sm font-semibold uppercase tracking-widest mb-3">About the system</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Built to connect students with real-world opportunities
          </h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              The Internship Monitoring & Connecting System is a full-stack web platform designed to
              streamline every step of the internship process — from discovery and application through
              to supervision, evaluation, and certification.
            </p>
            <p>
              Academic institutions, companies, and students all operate within a single unified
              environment, eliminating paperwork and manual coordination. Supervisors get real-time
              visibility into student progress, companies manage their intern pipeline efficiently,
              and students have a clear record of their professional development.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              'Two internship tracks: Academic and Professional',
              'Real-time messaging with Socket.IO',
              'PDF & Excel report generation',
              'Role-based access for all five user types',
              'Cloudinary-powered file storage',
            ].map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle size={16} style={{ color: '#0dcaf0', flexShrink: 0 }} />
                {point}
              </div>
            ))}
          </div>

          <Link
            to="/auth/register"
            style={{ backgroundColor: '#6c757d' }}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity"
          >
            Join the platform <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── CTA banner ────────────────────────────────────────────────
function CTABanner() {
  return (
    <section
      style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa8cc 100%)' }}
      className="py-20"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold text-black mb-4">
          Ready to start your internship journey?
        </h2>
        <p className="text-black/70 mb-8 text-lg">
          Create your account in minutes and connect with opportunities that match your goals.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/auth/register"
            style={{ backgroundColor: '#343a40', color: '#fff' }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Create account <ArrowRight size={16} />
          </Link>
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-black border-2 border-black/20 hover:bg-black/10 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real deployment this would POST to a contact endpoint
    setSent(true)
  }

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Info */}
        <div>
          <p style={{ color: '#0dcaf0' }} className="text-sm font-semibold uppercase tracking-widest mb-3">Get in touch</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Contact us</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Have questions about the platform, need help getting started, or want to partner with us?
            Fill in the form and we'll get back to you shortly.
          </p>

          <div className="space-y-5">
            {[
              { icon: <GraduationCap size={18} />, title: 'Students & Supervisors', desc: 'Questions about logbooks, evaluations, or account setup' },
              { icon: <Building2    size={18} />, title: 'Companies',              desc: 'Posting internships, managing applications, or billing' },
              { icon: <ShieldCheck  size={18} />, title: 'Institutions',           desc: 'Academic partnerships and bulk enrollment' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div style={{ backgroundColor: 'rgba(13,202,240,0.12)', color: '#0a9ab8' }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {sent ? (
            <div className="text-center py-8">
              <div style={{ backgroundColor: 'rgba(13,202,240,0.12)', color: '#0a9ab8' }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Message sent!</h3>
              <p className="text-sm text-gray-500">We'll get back to you as soon as possible.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm font-medium" style={{ color: '#0a9ab8' }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="label">I am a…</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="input"
                >
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
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: '#6c757d' }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ backgroundColor: '#343a40' }} className="py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: '#0dcaf0' }} className="w-7 h-7 rounded-lg flex items-center justify-center">
            <Briefcase size={14} className="text-black" />
          </div>
          <span className="text-white font-bold text-sm">Internship System</span>
        </div>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()} Internship Monitoring & Connecting System. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/auth/login"    className="text-white/60 hover:text-white text-xs transition-colors">Login</Link>
          <Link to="/auth/register" className="text-white/60 hover:text-white text-xs transition-colors">Register</Link>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <CTABanner />
      <Contact />
      <Footer />
    </div>
  )
}
