import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import {
  Briefcase, ArrowLeft, LogIn, UserPlus,
  Mail, MessageSquare, ShieldCheck, RefreshCw,
} from 'lucide-react'
import type { Role } from '@/types'

// ── Schemas ───────────────────────────────────────────────────
const credSchema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})
type CredForm = z.infer<typeof credSchema>

const dashboardByRole: Record<Role, string> = {
  STUDENT:             '/student',
  ACADEMIC_SUPERVISOR: '/supervisor',
  SITE_SUPERVISOR:     '/supervisor',
  COMPANY:             '/company',
  ADMIN:               '/admin',
  UNIVERSITY:          '/university',
}

// ── Shared input style ────────────────────────────────────────
const IS: React.CSSProperties = {
  width: '100%', padding: '10px 12px 10px 36px',
  borderRadius: 9, border: '1.5px solid #d0e8f0',
  background: '#f4fbfd', fontSize: '0.875rem', color: '#0d1a26',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function Login() {
  const { login, verifyOtp, resendOtp, user, isLoading } = useAuth()
  const navigate = useNavigate()

  // ── Step state ────────────────────────────────────────────
  const [step,      setStep]      = useState<'credentials' | 'otp'>('credentials')
  const [pendingEmail, setPendingEmail] = useState('')
  const [devOtp,    setDevOtp]    = useState<string | undefined>()
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  // ── Countdown timer for resend ────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return
    const t = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [countdown])

  // ── Redirect if already logged in ────────────────────────
  useEffect(() => {
    if (!isLoading && user) {
      navigate(dashboardByRole[user.role], { replace: true })
    }
  }, [user, isLoading, navigate])

  // ── Credentials form ──────────────────────────────────────
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CredForm>({
    resolver: zodResolver(credSchema),
  })

  const onSubmitCreds = async (data: CredForm) => {
    try {
      const result = await login(data)
      setPendingEmail(result.email)
      setDevOtp(result.devOtp)
      setStep('otp')
      setCountdown(60)
      toast.success('A 6-digit code has been sent to your email.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed')
    }
  }

  // ── OTP input handlers ────────────────────────────────────
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otpDigits]
    next[idx] = val.slice(-1)
    setOtpDigits(next)
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === 'Enter') submitOtp()
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const submitOtp = async () => {
    const code = otpDigits.join('')
    if (code.length < 6) { toast.error('Please enter all 6 digits'); return }
    setVerifying(true)
    try {
      await verifyOtp(pendingEmail, code)
      toast.success('Welcome back!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Invalid code')
      setOtpDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setVerifying(false)
    }
  }

  const resendCode = async () => {
    setResending(true)
    try {
      const result = await resendOtp(pendingEmail)
      setCountdown(60)
      setOtpDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      toast.success('New code sent — check your email.')
      // Update devOtp if returned (dev mode without email config)
      if ((result as any)?.devOtp) setDevOtp((result as any).devOtp)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not resend code. Try again.')
    } finally {
      setResending(false)
    }
  }

  // ── Shared wrapper ────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: '#e8f7fb',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>

      {/* Brand header */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#0dcaf0,#0aa8cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(13,202,240,0.4)' }}>
            <Briefcase size={19} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '1.5rem', fontWeight: 700, color: '#0d1a26' }}>
            Intern<span style={{ color: '#0dcaf0' }}>Hub</span>
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', color: '#5a8fa3', textTransform: 'uppercase' }}>
          Learn &bull; Explore &bull; Connect
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#fff', borderRadius: 18,
        boxShadow: '0 8px 40px rgba(13,202,240,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        padding: '32px 32px 28px', marginTop: 16,
      }}>

        {/* ── STEP 1: Credentials ── */}
        {step === 'credentials' && (
          <>
            <Link to="/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 600, color: '#5a8fa3', textDecoration: 'none', marginBottom: 22 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0dcaf0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5a8fa3')}>
              <ArrowLeft size={13} /> Back to home
            </Link>

            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#0dcaf0,#0aa8cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 4px 12px rgba(13,202,240,0.3)' }}>
              <LogIn size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0d1a26', marginBottom: 4 }}>Welcome Back</h1>
            <p style={{ fontSize: '0.85rem', color: '#7a9eb0', marginBottom: 24 }}>Sign in to your account to continue</p>

            <form onSubmit={handleSubmit(onSubmitCreds)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#2d4a5a', marginBottom: 6 }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
                  <input {...register('email')} type="email" placeholder="you@example.com"
                    style={{ ...IS, borderColor: errors.email ? '#ef4444' : '#d0e8f0' }}
                    onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#0dcaf0' }}
                    onBlur={(e)  => { if (!errors.email) e.currentTarget.style.borderColor = '#d0e8f0' }} />
                </div>
                {errors.email && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.email.message}</p>}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d4a5a' }}>Password</label>
                  <Link to="/auth/forgot" style={{ fontSize: '0.78rem', color: '#0dcaf0', textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                    Forgot password?
                  </Link>
                </div>
                <input {...register('password')} type="password" placeholder="••••••••"
                  style={{ ...IS, paddingLeft: 12, borderColor: errors.password ? '#ef4444' : '#d0e8f0' }}
                  onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = '#0dcaf0' }}
                  onBlur={(e)  => { if (!errors.password) e.currentTarget.style.borderColor = '#d0e8f0' }} />
                {errors.password && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting}
                style={{ width: '100%', padding: '11px', borderRadius: 9, border: 'none', background: isSubmitting ? '#7dddf5' : 'linear-gradient(135deg,#0dcaf0,#0aa8cc)', color: '#fff', fontSize: '0.95rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4, boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(13,202,240,0.35)' }}>
                {isSubmitting ? 'Checking credentials…' : 'Continue'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e0eff4' }} />
              <span style={{ fontSize: '0.78rem', color: '#9bbfcc' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e0eff4' }} />
            </div>

            <Link to="/auth/register"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px', borderRadius: 9, border: '1.5px solid #d0e8f0', background: '#fff', color: '#2d4a5a', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0dcaf0'; e.currentTarget.style.background = '#f4fbfd' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d0e8f0'; e.currentTarget.style.background = '#fff' }}>
              <UserPlus size={15} /> Create an account
            </Link>

            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9bbfcc', marginTop: 20 }}>
              Having trouble?{' '}
              <Link to="/contact" style={{ color: '#0dcaf0', textDecoration: 'none', fontWeight: 600 }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                <MessageSquare size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                Contact support
              </Link>
            </p>
          </>
        )}

        {/* ── STEP 2: OTP verification ── */}
        {step === 'otp' && (
          <>
            <button onClick={() => setStep('credentials')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 600, color: '#5a8fa3', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 22, fontFamily: 'inherit' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0dcaf0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5a8fa3')}>
              <ArrowLeft size={13} /> Back
            </button>

            {/* Shield icon */}
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#0dcaf0,#0aa8cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 4px 16px rgba(13,202,240,0.35)' }}>
              <ShieldCheck size={26} color="#fff" />
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0d1a26', marginBottom: 6 }}>
              Check your email
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#7a9eb0', marginBottom: 6 }}>
              We sent a 6-digit verification code to
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0aa8cc', marginBottom: 24 }}>
              {pendingEmail}
            </p>

            {/* Dev hint */}
            {devOtp && (
              <div style={{ padding: '10px 14px', borderRadius: 9, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 20 }}>
                <p style={{ fontSize: '0.75rem', color: '#b45309', margin: 0 }}>
                  <strong>Dev mode</strong> — no email configured. Your OTP is: <strong style={{ letterSpacing: '0.15em' }}>{devOtp}</strong>
                </p>
              </div>
            )}

            {/* 6-digit input boxes */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}
              onPaste={handleOtpPaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  style={{
                    width: 48, height: 56, borderRadius: 10,
                    border: `2px solid ${digit ? '#0dcaf0' : '#d0e8f0'}`,
                    background: digit ? 'rgba(13,202,240,0.06)' : '#f4fbfd',
                    fontSize: '1.4rem', fontWeight: 700, textAlign: 'center',
                    color: '#0d1a26', outline: 'none', fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')}
                  onBlur={(e)  => { if (!digit) e.currentTarget.style.borderColor = '#d0e8f0' }}
                />
              ))}
            </div>

            {/* Verify button */}
            <button
              onClick={submitOtp}
              disabled={verifying || otpDigits.join('').length < 6}
              style={{
                width: '100%', padding: '12px', borderRadius: 9, border: 'none',
                background: verifying || otpDigits.join('').length < 6 ? '#7dddf5' : 'linear-gradient(135deg,#0dcaf0,#0aa8cc)',
                color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                cursor: verifying || otpDigits.join('').length < 6 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(13,202,240,0.3)',
              }}>
              {verifying ? 'Verifying…' : 'Verify & Sign In'}
            </button>

            {/* Resend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
              <p style={{ fontSize: '0.8rem', color: '#9bbfcc', margin: 0 }}>Didn't receive the code?</p>
              {countdown > 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#0aa8cc', fontWeight: 600 }}>
                  Resend in {countdown}s
                </span>
              ) : (
                <button onClick={resendCode} disabled={resending}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#0dcaf0', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
                  <RefreshCw size={12} /> {resending ? 'Sending…' : 'Resend code'}
                </button>
              )}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#c0d8e0', marginTop: 16 }}>
              This code expires in 10 minutes.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
