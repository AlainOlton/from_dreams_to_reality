import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/api/endpoints'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types'

interface AuthContextType {
  user:     AuthUser | null
  token:    string | null
  isLoading:boolean
  login:    (data: LoginPayload)    => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout:   ()                      => void
  refreshUser: ()                   => Promise<void>
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

  const login = async (data: LoginPayload) => {
    const res    = await authApi.login(data)
    const { token: t } = res.data.data
    localStorage.setItem('token', t)
    setToken(t)
    await refreshUser()
  }

  const register = async (data: RegisterPayload) => {
    const res = await authApi.register(data)
    const { token: t } = res.data.data
    localStorage.setItem('token', t)
    setToken(t)
    await refreshUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
