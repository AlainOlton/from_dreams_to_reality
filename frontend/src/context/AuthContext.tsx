import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/api/endpoints'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types'

export interface LoginResult {
  requiresOtp: boolean
  email:       string
  devOtp?:     string   // only present in dev when no email is configured
}

interface AuthContextType {
  user:        AuthUser | null
  token:       string | null
  isLoading:   boolean
  login:       (data: LoginPayload)             => Promise<LoginResult>
  verifyOtp:   (email: string, otp: string)     => Promise<void>
  resendOtp:   (email: string)                  => Promise<void>
  register:    (data: RegisterPayload)          => Promise<void>
  logout:      ()                               => void
  refreshUser: ()                               => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUser]      = useState<AuthUser | null>(null)
  const [token,     setToken]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      refreshUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const res = await authApi.me()
      setUser(res.data.data)
    } catch {
      logout()
    }
  }

  // Step 1 — validate credentials, get OTP sent
  const login = async (data: LoginPayload): Promise<LoginResult> => {
    const res = await authApi.login(data)
    return res.data.data as LoginResult
  }

  // Step 2 — submit OTP, receive JWT
  const verifyOtp = async (email: string, otp: string): Promise<void> => {
    const res = await authApi.verifyOtp(email, otp)
    const { token: t } = res.data.data
    localStorage.setItem('token', t)
    setToken(t)
    await refreshUser()
  }

  // Resend OTP — calls dedicated endpoint, no password needed
  const resendOtp = async (email: string): Promise<void> => {
    await authApi.resendOtp(email)
  }

  // Register — no auto-login, user must go through login + OTP flow
  const register = async (data: RegisterPayload): Promise<void> => {
    await authApi.register(data)
    // Do NOT store token or set user — redirect to /auth/login happens in the component
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    // Hard redirect — clears all in-memory state and sends user to landing page
    window.location.href = '/landing'
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, verifyOtp, resendOtp, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
