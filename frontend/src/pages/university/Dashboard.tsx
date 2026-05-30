import { useQuery } from '@tanstack/react-query'
import { useAuth }  from '@/context/AuthContext'
import { universityApi } from '@/api/endpoints'
import StatCard  from '@/components/common/StatCard'
import Spinner   from '@/components/common/Spinner'
import { fmt }   from '@/utils/formatDate'
import {
  Users, GraduationCap, BookOpen,
  ClipboardList, CheckCircle, Clock, Building2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function UniversityDashboard() {
  const { user } = useAuth()
  const uniName  = user?.universityProfile?.universityName ?? 'University'

  const { data, isLoading } = useQuery({
    queryKey: ['university-dashboard'],
    queryFn:  universityApi.getDashboard,
  })

  const d = data?.data?.data

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const recentStudents: any[] = (d?.students ?? []).slice(0, 6)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {uniName}</h1>
          <p className="text-sm text-gray-500 mt-1">University dashboard — internship monitoring overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total students"   value={d?.totalStudents   ?? 0} icon={<Users         size={18} />} color="blue"   />
        <StatCard label="Active interns"   value={d?.activeInterns   ?? 0} icon={<GraduationCap size={18} />} color="green"  />
        <StatCard label="Not yet placed"   value={d?.notYetPlaced    ?? 0} icon={<Clock         size={18} />} color="yellow" />
        <StatCard label="Pending logbooks" value={d?.pendingLogs     ?? 0} icon={<BookOpen      size={18} />} color="purple" />
        <StatCard label="Evaluations"      value={d?.evaluationsCount ?? 0} icon={<ClipboardList size={18} />} color="green"  />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'View all students',    desc: 'Browse and monitor all enrolled students.',          icon: <GraduationCap size={22} className="text-blue-500" />,   bg: 'bg-blue-50 border-blue-200',   href: '/university/students'    },
          { title: 'Supervisor overview',  desc: 'See academic supervisors and their assignments.',    icon: <Users         size={22} className="text-purple-500" />, bg: 'bg-purple-50 border-purple-200', href: '/university/supervisors' },
          { title: 'Evaluation reports',   desc: 'Review mid-term and final evaluation results.',      icon: <ClipboardList size={22} className="text-green-500" />,  bg: 'bg-green-50 border-green-200',  href: '/university/evaluations' },
        ].map((c) => (
          <Link key={c.title} to={c.href} className={`card p-5 border ${c.bg} hover:shadow-md transition-shadow`}>
            <div className="p-2 rounded-lg bg-white border border-white/50 shadow-sm w-fit mb-3">{c.icon}</div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">{c.title}</h3>
            <p className="text-xs text-gray-500">{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent students */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Recent students</h2>
          <Link to="/university/students" className="text-xs text-brand-600 hover:underline">View all</Link>
        </div>
        {recentStudents.length === 0 ? (
          <p className="text-sm text-gray-400">No students linked to {uniName} yet. Students must set their institution to match your university name.</p>
        ) : (
          <div className="space-y-3">
            {recentStudents.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {s.firstName?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-gray-400">{s.department ?? 'No department'} · {s.studentId ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.enrollments?.length > 0
                    ? <span className="badge-green flex items-center gap-1"><CheckCircle size={10} /> Active intern</span>
                    : <span className="badge-gray flex items-center gap-1"><Clock size={10} /> Not placed</span>
                  }
                  {s.enrollments?.[0]?.internship?.company?.companyName && (
                    <span className="text-xs text-gray-400 hidden sm:block flex items-center gap-1">
                      <Building2 size={11} className="inline" /> {s.enrollments[0].internship.company.companyName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
