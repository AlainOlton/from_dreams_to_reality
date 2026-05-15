import { useState } from 'react'
import { useQuery }  from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { fmt }    from '@/utils/formatDate'
import { Users, Search, BookOpen, ClipboardList } from 'lucide-react'
import api from '@/api/axios'

interface Enrollment {
  id:          string
  type:        string
  isActive:    boolean
  startDate?:  string
  endDate?:    string
  companyName?: string
  student: {
    id:         string
    firstName:  string
    lastName:   string
    studentId?: string
    department?: string
    institution?: string
    profilePhotoUrl?: string
  }
  internship?: {
    title:   string
    company: { companyName: string }
  }
  _pendingLogs?:  number
  _pendingEvals?: number
}

export default function SupervisorStudents() {
  const navigate     = useNavigate()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['supervisor-enrollments'],
    queryFn:  () => api.get('/internships/enrollments/mine'),
  })

  const enrollments: Enrollment[] = data?.data?.data ?? []

  const filtered = enrollments.filter((e) => {
    if (!search) return true
    const name = `${e.student.firstName} ${e.student.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase()) ||
           e.student.studentId?.toLowerCase().includes(search.toLowerCase()) ||
           e.student.department?.toLowerCase().includes(search.toLowerCase())
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Students</h1>
          <p className="text-sm text-gray-500 mt-1">{enrollments.length} student{enrollments.length !== 1 ? 's' : ''} assigned</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-5">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, student ID, department…"
            className="input pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={48} />}
          title="No students found"
          description={search ? 'Try a different search.' : 'You have no students assigned yet.'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <div key={e.id} className="card p-5 hover:border-brand-300 transition-colors">
              {/* Student header */}
              <div className="flex items-center gap-3 mb-4">
                {e.student.profilePhotoUrl ? (
                  <img src={e.student.profilePhotoUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    {e.student.firstName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {e.student.firstName} {e.student.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {e.student.studentId ? `ID: ${e.student.studentId} · ` : ''}{e.student.department ?? 'No department'}
                  </p>
                </div>
                <span className={e.isActive ? 'badge-green' : 'badge-gray'}>
                  {e.isActive ? 'Active' : 'Done'}
                </span>
              </div>

              {/* Internship info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1">
                <p className="text-xs font-medium text-gray-700">
                  {e.internship?.title ?? 'Internship'}
                </p>
                <p className="text-xs text-gray-400">
                  {e.internship?.company?.companyName ?? e.companyName ?? 'N/A'}
                </p>
                {e.startDate && (
                  <p className="text-xs text-gray-400">
                    {fmt(e.startDate)}{e.endDate ? ` → ${fmt(e.endDate)}` : ''}
                  </p>
                )}
                <span className="badge-blue">{e.type}</span>
              </div>

              {/* Action links */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/supervisor/logbooks?studentId=${e.student.id}`)}
                  className="btn-secondary flex-1 justify-center text-xs py-1.5"
                >
                  <BookOpen size={13} /> Logbook
                </button>
                <button
                  onClick={() => navigate(`/supervisor/evaluations?enrollmentId=${e.id}`)}
                  className="btn-secondary flex-1 justify-center text-xs py-1.5"
                >
                  <ClipboardList size={13} /> Evaluate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
