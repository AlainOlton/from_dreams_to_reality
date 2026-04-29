import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ── Request interceptor — attach JWT token ────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor — handle global errors ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message ?? 'Something went wrong'

    if (status === 401) {
      // Token expired or invalid — clear storage and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login'
      }
    } else if (status === 403) {
      toast.error('You do not have permission to do that')
    } else if (status === 422) {
      // Validation errors — let the form handle them
    } else if (status === 500) {
      toast.error('Server error — please try again later')
    }

    return Promise.reject(error)
  }
)

export default api
