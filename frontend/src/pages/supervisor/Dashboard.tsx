import { useQuery } from '@tanstack/react-query'
import { useAuth }  from '@/context/AuthContext'
import StatCard from '@/components/common/StatCard'
import Spinner  from '@/components/common/Spinner'
import { fmt }  from '@/utils/formatDate'
import {
  Users, ClipboardList, BookOpen,
  Clock, CheckCircle,
} from 'lucide-react'
import api from '@/api/axios'

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const name =
    user?.supervisorProfile
      ? `${user.supervisorProfile.firstName} ${user.supervisorProfile.lastName}`
      : 'Supervisor'

  // Fetch enrolled students assigned to this supervisor
  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ['supervisor-enrollments'],
    queryFn:  () => api.get('/internships/enrollments/mine'),
  })

  const enrollments: any[] = enrollmentsData?.data?.data ?? []

  const activeCount   = enrollments.filter((e) => e.isActive).length
  const pendingLogs   = enrollments.filter((e) => e._pendingLogs   > 0).length
  const pendingEvals  = enrollments.filter((e) => e._pendingEvals  > 0).length

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === 'ACADEMIC_SUPERVISOR' ? 'Academic Supervisor' : 'Site Supervisor'} dashboard
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active interns"    value={activeCount}  icon={<Users         size={18} />} color="green"  />
        <StatCard label="Total assigned"    value={enrollments.length} icon={<Users   size={18} />} color="blue"   />
        <StatCard label="Pending logbooks"  value={pendingLogs}  icon={<BookOpen      size={18} />} color="yellow" />
        <StatCard label="Pending evals"     value={pendingEvals} icon={<ClipboardList size={18} />} color="purple" />
      </div>

      {/* Quick-action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: 'Review logbooks',
            desc:  'Approve or comment on student weekly entries.',
            icon:  <BookOpen size={22} className="text-blue-500" />,
            bg:    'bg-blue-50 border-blue-200',
            href:  '/supervisor/logbooks',
          },
          {
            title: 'Submit evaluations',
            desc:  'Complete mid-term or final evaluation forms.',
            icon:  <ClipboardList size={22} className="text-purple-500" />,
            bg:    'bg-purple-50 border-purple-200',
            href:  '/supervisor/evaluations',
          },
          {
            title: 'Log attendance',
            desc:  'Record daily attendance for your assigned interns.',
            icon:  <Clock size={22} className="text-yellow-500" />,
            bg:    'bg-yellow-50 border-yellow-200',
            href:  '/supervisor/attendance',
          },
        ].map((c) => (
          <a key={c.title} href={c.href} className={`card p-5 border ${c.bg} hover:shadow-md transition-shadow`}>
            <div className="p-2 rounded-lg bg-white border border-white/50 shadow-sm w-fit mb-3">{c.icon}</div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">{c.title}</h3>
            <p className="text-xs text-gray-500">{c.desc}</p>
          </a>
        ))}
      </div>

      {/* Assigned students */}
      <div className="card p-5">
        <h2 className="section-title">Assigned students</h2>
        {enrollments.length === 0 ? (
          <p className="text-sm text-gray-400">No students assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {enrollments.slice(0, 8).map((e: any) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                    {e.student?.firstName?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {e.student?.firstName} {e.student?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {e.type} · {e.internship?.company?.companyName ?? e.companyName ?? 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {e.isActive
                    ? <span className="badge-green flex items-center gap-1"><CheckCircle size={10} /> Active</span>
                    : <span className="badge-gray">Completed</span>
                  }
                  {e.startDate && <span className="text-xs text-gray-400">{fmt(e.startDate)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
