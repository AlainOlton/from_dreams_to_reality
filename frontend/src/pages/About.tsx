import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PublicNavbar } from './Landing'
import { CheckCircle, ArrowRight, GraduationCap, Building2, ShieldCheck, Users, Globe } from 'lucide-react'

// IT-themed photos from Pexels (free, no attribution required for display)
const slides = [
  {
    url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1600',
    caption: 'Collaborative software development',
  },
  {
    url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1600',
    caption: 'Modern IT workspace',
  },
  {
    url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1600',
    caption: 'Code review and pair programming',
  },
  {
    url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1600',
    caption: 'Team collaboration in tech',
  },
  {
    url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600',
    caption: 'Students learning technology',
  },
  {
    url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600',
    caption: 'Data analysis and engineering',
  },
]

function Slideshow() {
  const [current, setCurrent] = useState(0)

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.url}
            alt={slide.caption}
            className="w-full h-full object-cover"
          />
          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
            style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)' }}>
            <p className="text-white text-sm font-medium">{slide.caption}</p>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === current ? 'var(--color-info)' : 'rgba(255,255,255,0.4)',
              transform: i === current ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        ›
      </button>
    </div>
  )
}

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      <PublicNavbar active="about" />

      {/* Hero banner */}
      <div className="pt-16">
        <div className="relative h-48 flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-neutral-900) 0%, var(--color-primary-dark) 100%)' }}>
          <div className="text-center z-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-info)' }}>About us</p>
            <h1 className="text-3xl font-extrabold text-white">About the System</h1>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-primary)' }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-info)' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main grid: slideshow + text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
          {/* Slideshow */}
          <div className="h-96 lg:h-[480px]">
            <Slideshow />
          </div>

          {/* Text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Our mission
            </p>
            <h2 className="text-3xl font-extrabold mb-5" style={{ color: 'var(--color-neutral-900)' }}>
              Built to connect students with real-world opportunities
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--color-neutral-700)' }}>
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

            <div className="mt-7 space-y-3">
              {[
                'Two internship tracks: Academic and Professional',
                'Real-time messaging with Socket.IO',
                'PDF & Excel report generation',
                'Role-based access for all five user types',
                'Cloudinary-powered file storage',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-neutral-700)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  {point}
                </div>
              ))}
            </div>

            <Link to="/auth/register"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              Join the platform <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Who uses it */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-info)' }}>Roles</p>
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-neutral-900)' }}>Who uses this system</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: <GraduationCap size={22} />, role: 'Students',             desc: 'Apply, track, log, and get evaluated', color: 'var(--color-info)' },
              { icon: <Building2    size={22} />, role: 'Companies',            desc: 'Post listings and manage interns',     color: 'var(--color-primary)' },
              { icon: <ShieldCheck  size={22} />, role: 'Academic Supervisors', desc: 'Monitor and evaluate students',        color: 'var(--color-primary)' },
              { icon: <Users        size={22} />, role: 'Site Supervisors',     desc: 'On-site supervision & attendance',    color: 'var(--color-accent)' },
              { icon: <Globe        size={22} />, role: 'Administrators',       desc: 'Full platform oversight & reporting', color: 'var(--color-neutral-700)' },
            ].map((r) => (
              <div key={r.role} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${r.color}18`, color: r.color }}>
                  {r.icon}
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-neutral-900)' }}>{r.role}</p>
                <p className="text-xs" style={{ color: 'var(--color-neutral-700)' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to get started?</h2>
          <p className="text-white/70 text-sm mb-6">Create your account and connect with opportunities that match your goals.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-info)', color: '#fff' }}>
              Create account <ArrowRight size={16} />
            </Link>
            <Link to="/auth/login"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
