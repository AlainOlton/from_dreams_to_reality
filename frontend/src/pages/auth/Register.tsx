import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import {
  Briefcase, ArrowLeft, GraduationCap, Building2,
  ShieldCheck, Users, University, Mail, Lock, User,
} from 'lucide-react'
import type { Role } from '@/types'

// ── Role picker cards ─────────────────────────────────────────
const ROLE_CARDS: { value: Role; label: string; icon: React.ReactNode }[] = [
  { value: 'STUDENT',             label: 'Student',             icon: <GraduationCap size={22} /> },
  { value: 'COMPANY',             label: 'Organization',        icon: <Building2      size={22} /> },
  { value: 'SITE_SUPERVISOR',     label: 'Site Supervisor',     icon: <ShieldCheck    size={22} /> },
  { value: 'ACADEMIC_SUPERVISOR', label: 'Academic Supervisor', icon: <Users          size={22} /> },
  { value: 'UNIVERSITY',          label: 'University',          icon: <University     size={22} /> },
]

// ── Validation schema ─────────────────────────────────────────
const schema = z.object({
  firstName:       z.string().min(1, 'Required'),
  lastName:        z.string().min(1, 'Required'),
  email:           z.string().email('Valid email required'),
  password:        z.string()
    .min(8,   'Min 8 characters')
    .regex(/[A-Z]/, 'Needs an uppercase letter')
    .regex(/[0-9]/, 'Needs a number'),
  confirmPassword: z.string().min(1, 'Required'),
  role:            z.enum(['STUDENT','ACADEMIC_SUPERVISOR','SITE_SUPERVISOR','COMPANY','ADMIN','UNIVERSITY'] as const),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})
type Form = z.infer<typeof schema>

// ── Shared input style ────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 12px 10px 36px',
  borderRadius: 9, border: '1.5px solid #d0e8f0',
  background: '#f4fbfd', fontSize: '0.875rem', color: '#0d1a26',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}
const inputNoIcon: React.CSSProperties = { ...inputBase, paddingLeft: 12 }

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  color: '#2d4a5a', marginBottom: 6,
}
const errStyle: React.CSSProperties = {
  fontSize: '0.74rem', color: '#ef4444', marginTop: 4,
}

export default function Register() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState<Role>('STUDENT')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' },
  })

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setValue('role', role)
  }

  const onSubmit = async (data: Form) => {
    try {
      await authRegister(data)
      toast.success('Account created! Please verify your email.')
      navigate('/')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Registration failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e8f7fb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>

      {/* ── Brand header ── */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(13,202,240,0.4)',
          }}>
            <Briefcase size={19} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 700, color: '#0d1a26', letterSpacing: '-0.01em' }}>
            Intern<span style={{ color: '#0dcaf0' }}>Hub</span>
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', color: '#5a8fa3', textTransform: 'uppercase' }}>
          Learn &bull; Explore &bull; Connect
        </p>
      </div>

      {/* ── Card ── */}
      <div style={{
        width: '100%',
        maxWidth: 520,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 8px 40px rgba(13,202,240,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        padding: '32px 32px 28px',
        marginTop: 16,
      }}>

        {/* Back to home */}
        <Link
          to="/landing"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.78rem', fontWeight: 600, color: '#5a8fa3',
            textDecoration: 'none', marginBottom: 20,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0dcaf0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5a8fa3')}
        >
          <ArrowLeft size={13} />
          Back to home
        </Link>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0d1a26', marginBottom: 4 }}>
          Create Account
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#7a9eb0', marginBottom: 22 }}>
          Choose your role and fill in your details
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Role picker ── */}
          <div>
            <input type="hidden" {...register('role')} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ROLE_CARDS.map(({ value, label, icon }) => {
                const active = selectedRole === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRoleSelect(value)}
                    style={{
                      flex: '1 1 80px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 6, padding: '12px 8px',
                      borderRadius: 10,
                      border: active ? '2px solid #0dcaf0' : '2px solid #d0e8f0',
                      background: active ? 'rgba(13,202,240,0.08)' : '#f4fbfd',
                      color: active ? '#0aa8cc' : '#5a8fa3',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: active ? '0 2px 12px rgba(13,202,240,0.18)' : 'none',
                    }}
                  >
                    {icon}
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.role && <p style={errStyle}>{errors.role.message}</p>}
          </div>

          {/* ── First + Last name ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
                <input
                  {...register('firstName')}
                  placeholder="John"
                  style={{ ...inputBase, borderColor: errors.firstName ? '#ef4444' : '#d0e8f0' }}
                  onFocus={(e) => { if (!errors.firstName) e.currentTarget.style.borderColor = '#0dcaf0' }}
                  onBlur={(e)  => { if (!errors.firstName) e.currentTarget.style.borderColor = '#d0e8f0' }}
                />
              </div>
              {errors.firstName && <p style={errStyle}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
                <input
                  {...register('lastName')}
                  placeholder="Doe"
                  style={{ ...inputBase, borderColor: errors.lastName ? '#ef4444' : '#d0e8f0' }}
                  onFocus={(e) => { if (!errors.lastName) e.currentTarget.style.borderColor = '#0dcaf0' }}
                  onBlur={(e)  => { if (!errors.lastName) e.currentTarget.style.borderColor = '#d0e8f0' }}
                />
              </div>
              {errors.lastName && <p style={errStyle}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* ── Email ── */}
          <div>
            <label style={labelStyle}>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                style={{ ...inputBase, borderColor: errors.email ? '#ef4444' : '#d0e8f0' }}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#0dcaf0' }}
                onBlur={(e)  => { if (!errors.email) e.currentTarget.style.borderColor = '#d0e8f0' }}
              />
            </div>
            {errors.email && <p style={errStyle}>{errors.email.message}</p>}
          </div>

          {/* ── Password ── */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                style={{ ...inputBase, borderColor: errors.password ? '#ef4444' : '#d0e8f0' }}
                onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = '#0dcaf0' }}
                onBlur={(e)  => { if (!errors.password) e.currentTarget.style.borderColor = '#d0e8f0' }}
              />
            </div>
            {errors.password && <p style={errStyle}>{errors.password.message}</p>}
          </div>

          {/* ── Confirm Password ── */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                style={{ ...inputNoIcon, paddingLeft: 36, borderColor: errors.confirmPassword ? '#ef4444' : '#d0e8f0' }}
                onFocus={(e) => { if (!errors.confirmPassword) e.currentTarget.style.borderColor = '#0dcaf0' }}
                onBlur={(e)  => { if (!errors.confirmPassword) e.currentTarget.style.borderColor = '#d0e8f0' }}
              />
            </div>
            {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword.message}</p>}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%', padding: '11px',
              borderRadius: 9, border: 'none',
              background: isSubmitting ? '#7dddf5' : 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
              color: '#fff', fontSize: '0.95rem', fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginTop: 2,
              boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(13,202,240,0.35)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Sign in link */}
        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#9bbfcc', marginTop: 20 }}>
          Already have an account?{' '}
          <Link
            to="/auth/login"
            style={{ color: '#0dcaf0', fontWeight: 700, textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
