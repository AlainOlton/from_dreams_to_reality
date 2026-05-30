import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { universityApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { Users, Search, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react'

export default function UniversitySupervisors() {
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['university-supervisors'],
    queryFn:  universityApi.getSupervisors,
  })

  const supervisors: any[] = data?.data?.data ?? []

  const filtered = supervisors.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase()
    return !search || name.includes(search.toLowerCase()) ||
      (s.department ?? '').toLowerCase().includes(search.toLowerCase())
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Supervisors</h1>
          <p className="text-sm text-gray-500 mt-1">{supervisors.length} academic supervisor{supervisors.length !== 1 ? 's' : ''} from your institution</p>
        </div>
      </div>

      <div className="card p-4 mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or department…"
            className="input pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={48} />}
          title="No supervisors found"
          description="No academic supervisors have set your institution name in their profile yet."
        />
      ) : (
        <div className="card overflow-hidden">
          {filtered.map((sv, idx) => {
            const assignedCount = sv.academicAssignments?.length ?? 0
            return (
              <div key={sv.id} className={idx < filtered.length - 1 ? 'border-b border-gray-50' : ''}>
                <div
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === sv.id ? null : sv.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {sv.firstName?.charAt(0) ?? '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {sv.title ? `${sv.title} ` : ''}{sv.firstName} {sv.lastName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {sv.department ?? 'No department'} · {sv.specialization ?? 'No specialization'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge-purple">{assignedCount} student{assignedCount !== 1 ? 's' : ''}</span>
                    {expanded === sv.id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                  </div>
                </div>

                {expanded === sv.id && (
                  <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Assigned students</p>
                    {sv.academicAssignments?.length === 0 ? (
                      <p className="text-sm text-gray-400">No students assigned yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {sv.academicAssignments.map((a: any) => (
                          <div key={a.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {a.enrollment?.student?.firstName?.charAt(0) ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {a.enrollment?.student?.firstName} {a.enrollment?.student?.lastName}
                              </p>
                              <p className="text-xs text-gray-400">{a.enrollment?.student?.studentId ?? '—'}</p>
                            </div>
                          </div>
                        ))}
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
