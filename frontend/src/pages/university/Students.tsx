import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { universityApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { fmt }    from '@/utils/formatDate'
import {
  GraduationCap, Search, ChevronDown, ChevronUp,
  CheckCircle, Clock, Building2, BookOpen,
} from 'lucide-react'

export default function UniversityStudents() {
  const [search,     setSearch]     = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [expanded,   setExpanded]   = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['university-students'],
    queryFn:  universityApi.getStudents,
  })

  const students: any[] = data?.data?.data ?? []

  // Unique departments for filter
  const departments = [...new Set(students.map((s) => s.department).filter(Boolean))]

  const filtered = students.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) ||
      (s.studentId ?? '').toLowerCase().includes(search.toLowerCase())
    const matchDept   = !deptFilter || s.department === deptFilter
    const isActive    = s.enrollments?.some((e: any) => e.isActive)
    const matchStatus =
      statusFilter === 'all'      ? true :
      statusFilter === 'active'   ? isActive :
                                    !isActive
    return matchSearch && matchDept && matchStatus
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p className="text-sm text-gray-500 mt-1">{students.length} student{students.length !== 1 ? 's' : ''} registered from your institution</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or student ID…"
            className="input pl-9"
          />
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input w-48">
          <option value="">All departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="input w-36">
          <option value="all">All status</option>
          <option value="active">Active intern</option>
          <option value="inactive">Not placed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={48} />}
          title="No students found"
          description="No students have set your institution name in their profile yet."
        />
      ) : (
        <div className="card overflow-hidden">
          {filtered.map((s, idx) => {
            const activeEnrollment = s.enrollments?.find((e: any) => e.isActive)
            const isActive = !!activeEnrollment
            return (
              <div key={s.id} className={idx < filtered.length - 1 ? 'border-b border-gray-50' : ''}>
                <div
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                >
                  <div className="flex items-center gap-3">
                    {s.profilePhotoUrl ? (
                      <img src={s.profilePhotoUrl} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {s.firstName?.charAt(0) ?? '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {s.studentId ?? 'No ID'} · {s.department ?? 'No dept'} · Year {s.yearOfStudy ?? '?'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isActive
                      ? <span className="badge-green flex items-center gap-1"><CheckCircle size={10} /> Active</span>
                      : <span className="badge-gray flex items-center gap-1"><Clock size={10} /> Not placed</span>
                    }
                    {expanded === s.id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                  </div>
                </div>

                {expanded === s.id && (
                  <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100 space-y-4 pt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Faculty</p>
                        <p className="text-sm text-gray-700 mt-0.5">{s.faculty ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Year</p>
                        <p className="text-sm text-gray-700 mt-0.5">{s.yearOfStudy ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {s.skills?.length > 0
                            ? s.skills.slice(0, 4).map((sk: string) => <span key={sk} className="badge-blue text-[10px]">{sk}</span>)
                            : <span className="text-sm text-gray-400">—</span>
                          }
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Enrollments</p>
                        <p className="text-sm text-gray-700 mt-0.5">{s.enrollments?.length ?? 0}</p>
                      </div>
                    </div>

                    {activeEnrollment && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <Building2 size={12} /> Current internship
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {activeEnrollment.internship?.title ?? 'Academic placement'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {activeEnrollment.internship?.company?.companyName ?? activeEnrollment.companyName ?? '—'}
                          {activeEnrollment.startDate ? ` · Started ${fmt(activeEnrollment.startDate)}` : ''}
                        </p>
                        {activeEnrollment.supervisorAssignment?.academicSupervisor && (
                          <p className="text-xs text-gray-500 mt-1">
                            Academic supervisor: {activeEnrollment.supervisorAssignment.academicSupervisor.firstName} {activeEnrollment.supervisorAssignment.academicSupervisor.lastName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
