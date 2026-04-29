import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/common/Spinner'
import type { Role } from '@/types'

interface Props { allowedRoles?: Role[] }

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard instead of a generic 403
    const dashboard: Record<Role, string> = {
      STUDENT:             '/student',
      ACADEMIC_SUPERVISOR: '/supervisor',
      SITE_SUPERVISOR:     '/supervisor',
      COMPANY:             '/company',
      ADMIN:               '/admin',
    }
    return <Navigate to={dashboard[user.role]} replace />
  }

  return <Outlet />
}
