import { useQuery } from '@tanstack/react-query'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { fmt }    from '@/utils/formatDate'
import { Users } from 'lucide-react'
import api from '@/api/axios'

interface Enrollment {
  id:       string
  type:     string
  isActive: boolean
  startDate?: string
  endDate?:   string
  student: {
    firstName:   string
    lastName:    string
    department?: string
    institution?: string
    profilePhotoUrl?: string
  }
  internship?: { title: string }
}

export default function CompanyInterns() {
  const { data, isLoading } = useQuery({
    queryKey: ['company-interns'],
    queryFn:  () => api.get('/internships/enrollments/company'),
  })
  const interns: Enrollment[] = data?.data?.data ?? []
  const active = interns.filter((i) => i.isActive)
  const past   = interns.filter((i) => !i.isActive)

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const InternCard = ({ e }: { e: Enrollment }) => (
    <div className="card p-4 flex items-center gap-4">
      {e.student.profilePhotoUrl
        ? <img src={e.student.profilePhotoUrl} alt="" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
        : <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold flex-shrink-0">
            {e.student.firstName.charAt(0)}
          </div>
      }
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900">{e.student.firstName} {e.student.lastName}</p>
        <p className="text-xs text-gray-400 truncate">
          {e.student.department ?? 'N/A'} · {e.student.institution ?? 'N/A'}
        </p>
        {e.internship && <p className="text-xs text-gray-400 truncate mt-0.5">{e.internship.title}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <span className={e.isActive ? 'badge-green' : 'badge-gray'}>{e.isActive ? 'Active' : 'Completed'}</span>
        {e.startDate && <p className="text-xs text-gray-400 mt-1">{fmt(e.startDate)}{e.endDate ? ` → ${fmt(e.endDate)}` : ''}</p>}
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Interns</h1>
          <p className="text-sm text-gray-500 mt-1">{active.length} active · {past.length} completed</p>
        </div>
      </div>

      {interns.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="No interns yet" description="Accept applications to see interns here." />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h2 className="section-title">Active interns ({active.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {active.map((e) => <InternCard key={e.id} e={e} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="section-title">Past interns ({past.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {past.map((e) => <InternCard key={e.id} e={e} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
