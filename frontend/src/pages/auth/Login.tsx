import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { Briefcase, ArrowLeft, LogIn, UserPlus, Mail, MessageSquare } from 'lucide-react'
import type { Role } from '@/types'

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})
type Form = z.infer<typeof schema>

const dashboardByRole: Record<Role, string> = {
  STUDENT:             '/student',
  ACADEMIC_SUPERVISOR: '/supervisor',
  SITE_SUPERVISOR:     '/supervisor',
  COMPANY:             '/company',
  ADMIN:               '/admin',
  UNIVERSITY:          '/university',
}

export default function Login() {
  const { login, user, isLoading } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!isLoading && user) {
      navigate(dashboardByRole[user.role], { replace: true })
    }
  }, [user, isLoading, navigate])

  const onSubmit = async (data: Form) => {
    try {
      await login(data)
      toast.success('Welcome back!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed')
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
        maxWidth: 420,
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
            textDecoration: 'none', marginBottom: 22,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0dcaf0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5a8fa3')}
        >
          <ArrowLeft size={13} />
          Back to home
        </Link>

        {/* Card icon + title */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14, boxShadow: '0 4px 12px rgba(13,202,240,0.3)',
        }}>
          <LogIn size={20} color="#fff" />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0d1a26', marginBottom: 4, lineHeight: 1.2 }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#7a9eb0', marginBottom: 24 }}>
          Sign in to your account to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#2d4a5a', marginBottom: 6 }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '10px 12px 10px 36px',
                  borderRadius: 9, border: errors.email ? '1.5px solid #ef4444' : '1.5px solid #d0e8f0',
                  background: '#f4fbfd', fontSize: '0.875rem', color: '#0d1a26',
                  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#0dcaf0' }}
                onBlur={(e)  => { if (!errors.email) e.currentTarget.style.borderColor = '#d0e8f0' }}
              />
            </div>
            {errors.email && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d4a5a' }}>Password</label>
              <Link
                to="/auth/forgot"
                style={{ fontSize: '0.78rem', color: '#0dcaf0', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                Forgot password?
              </Link>
            </div>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 12px',
                borderRadius: 9, border: errors.password ? '1.5px solid #ef4444' : '1.5px solid #d0e8f0',
                background: '#f4fbfd', fontSize: '0.875rem', color: '#0d1a26',
                outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = '#0dcaf0' }}
              onBlur={(e)  => { if (!errors.password) e.currentTarget.style.borderColor = '#d0e8f0' }}
            />
            {errors.password && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%', padding: '11px',
              borderRadius: 9, border: 'none',
              background: isSubmitting ? '#7dddf5' : 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
              color: '#fff', fontSize: '0.95rem', fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginTop: 4,
              boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(13,202,240,0.35)',
              transition: 'opacity 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e0eff4' }} />
          <span style={{ fontSize: '0.78rem', color: '#9bbfcc' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#e0eff4' }} />
        </div>

        {/* Create account */}
        <Link
          to="/auth/register"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '10px',
            borderRadius: 9, border: '1.5px solid #d0e8f0',
            background: '#fff', color: '#2d4a5a',
            fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
            fontFamily: 'inherit', boxSizing: 'border-box',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0dcaf0'; e.currentTarget.style.background = '#f4fbfd' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d0e8f0'; e.currentTarget.style.background = '#fff' }}
        >
          <UserPlus size={15} />
          Create an account
        </Link>

        {/* Trouble */}
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9bbfcc', marginTop: 20 }}>
          Having trouble?{' '}
          <Link
            to="/contact"
            style={{ color: '#0dcaf0', textDecoration: 'none', fontWeight: 600 }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            <MessageSquare size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
