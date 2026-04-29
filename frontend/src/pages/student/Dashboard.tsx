import { useQuery } from '@tanstack/react-query'
import { Briefcase, FileText, BookOpen, ClipboardList } from 'lucide-react'
import { applicationApi, logbookApi, evaluationApi } from '@/api/endpoints'
import StatCard from '@/components/common/StatCard'
import Spinner  from '@/components/common/Spinner'
import { fmt }  from '@/utils/formatDate'
import { getStatusBadgeClass, getStatusLabel } from '@/utils/roleHelpers'
import { useAuth } from '@/context/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()
  const name = user?.studentProfile?.firstName ?? 'Student'

  const { data: appsData,  isLoading: l1 } = useQuery({ queryKey: ['my-applications'],  queryFn: applicationApi.getMyApps })
  const { data: logData,   isLoading: l2 } = useQuery({ queryKey: ['my-logbook'],        queryFn: () => logbookApi.getMyEntries() })
  const { data: selfData,  isLoading: l3 } = useQuery({ queryKey: ['self-assessments'],  queryFn: evaluationApi.getMySelfAssessments })
  const { data: attendData,isLoading: l4 } = useQuery({ queryKey: ['my-attendance'],     queryFn: logbookApi.getAttendance })

  const apps    = appsData?.data?.data   ?? []
  const entries = logData?.data?.data?.data  ?? []
  const hoursLogged = attendData?.data?.data?.totalHoursLogged ?? 0

  if (l1 || l2 || l3 || l4) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back, {name} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here is your internship overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Applications"   value={apps.length}           icon={<Briefcase    size={18} />} color="blue"   />
        <StatCard label="Logbook Entries" value={entries.length}        icon={<BookOpen     size={18} />} color="green"  />
        <StatCard label="Hours Logged"   value={`${hoursLogged}h`}     icon={<FileText     size={18} />} color="purple" />
        <StatCard label="Assessments"    value={selfData?.data?.data?.length ?? 0} icon={<ClipboardList size={18} />} color="yellow" />
      </div>

      {/* Recent applications */}
      <div className="card p-5 mb-6">
        <h3 className="section-title">Recent applications</h3>
        {apps.length === 0
          ? <p className="text-sm text-gray-400">No applications yet.</p>
          : <div className="space-y-3">
              {apps.slice(0, 5).map((app: any) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.internship?.title}</p>
                    <p className="text-xs text-gray-400">{app.internship?.company?.companyName} · {fmt(app.appliedAt)}</p>
                  </div>
                  <span className={getStatusBadgeClass(app.status)}>{getStatusLabel(app.status)}</span>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Recent logbook entries */}
      <div className="card p-5">
        <h3 className="section-title">Recent logbook entries</h3>
        {entries.length === 0
          ? <p className="text-sm text-gray-400">No logbook entries yet.</p>
          : <div className="space-y-3">
              {entries.slice(0, 4).map((entry: any) => (
                <div key={entry.id} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fmt(entry.entryDate)} {entry.weekNumber ? `· Week ${entry.weekNumber}` : ''}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{entry.activitiesDone}</p>
                  </div>
                  <span className={entry.isApproved ? 'badge-green' : 'badge-yellow'}>
                    {entry.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}
