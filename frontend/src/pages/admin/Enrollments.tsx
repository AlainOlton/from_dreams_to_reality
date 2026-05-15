import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { Building2, Plus, Search, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/api/axios'
import type { InternshipType } from '@/types'

interface Enrollment {
  id:           string
  type:         InternshipType
  isActive:     boolean
  startDate?:   string
  endDate?:     string
  companyName?: string
  student: {
    id:          string
    firstName:   string
    lastName:    string
    studentId?:  string
    department?: string
  }
  internship?: {
    title:   string
    company: { companyName: string }
  }
  supervisorAssignment?: {
    academicSupervisor?: { firstName: string; lastName: string }
    siteSupervisor?:     { firstName: string; lastName: string }
  }
}

const enrollSchema = z.object({
  studentId:    z.string().min(1, 'Student profile ID required'),
  type:         z.enum(['ACADEMIC', 'PROFESSIONAL'] as const),
  internshipId: z.string().optional(),
  companyName:  z.string().optional(),
  startDate:    z.string().optional(),
  endDate:      z.string().optional(),
})
type EnrollForm = z.infer<typeof enrollSchema>

const assignSchema = z.object({
  enrollmentId:          z.string().min(1),
  academicSupervisorId:  z.string().optional(),
  siteSupervisorId:      z.string().optional(),
})
type AssignForm = z.infer<typeof assignSchema>

export default function AdminEnrollments() {
  const qc = useQueryClient()
  const [search,       setSearch]      = useState('')
  const [typeFilter,   setTypeFilter]  = useState<InternshipType | ''>('')
  const [enrollOpen,   setEnrollOpen]  = useState(false)
  const [assignOpen,   setAssignOpen]  = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-enrollments'],
    queryFn:  () => api.get('/internships/enrollments'),
  })
  const enrollments: Enrollment[] = data?.data?.data ?? []

  const { register: regEnroll, handleSubmit: subEnroll, reset: resetEnroll,
    formState: { errors: enrollErrors } } = useForm<EnrollForm>({
    resolver: zodResolver(enrollSchema),
    defaultValues: { type: 'ACADEMIC' },
  })

  const { register: regAssign, handleSubmit: subAssign, reset: resetAssign,
    setValue: setAssignVal } = useForm<AssignForm>({
    resolver: zodResolver(assignSchema),
  })

  const enrollMutation = useMutation({
    mutationFn: (d: EnrollForm) => api.post('/internships/enrollments', d),
    onSuccess: () => {
      toast.success('Student enrolled')
      setEnrollOpen(false)
      resetEnroll()
      qc.invalidateQueries({ queryKey: ['admin-enrollments'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Enrollment failed'),
  })

  const assignMutation = useMutation({
    mutationFn: (d: AssignForm) => api.post('/internships/enrollments/assign-supervisors', d),
    onSuccess: () => {
      toast.success('Supervisors assigned')
      setAssignOpen(false)
      resetAssign()
      qc.invalidateQueries({ queryKey: ['admin-enrollments'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Assignment failed'),
  })

  const openAssign = (enrollmentId: string) => {
    setAssignVal('enrollmentId', enrollmentId)
    setAssignOpen(true)
  }

  const filtered = enrollments.filter((e) => {
    const name = `${e.student.firstName} ${e.student.lastName}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || e.student.studentId?.toLowerCase().includes(search.toLowerCase())
    const matchType   = !typeFilter || e.type === typeFilter
    return matchSearch && matchType
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Enrollments</h1>
          <p className="text-sm text-gray-500 mt-1">{enrollments.length} total enrollments</p>
        </div>
        <button onClick={() => setEnrollOpen(true)} className="btn-primary">
          <Plus size={16} /> Enroll student
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by student name or ID…" className="input pl-9" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as InternshipType | '')} className="input w-44">
          <option value="">All types</option>
          <option value="ACADEMIC">Academic</option>
          <option value="PROFESSIONAL">Professional</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Building2 size={48} />} title="No enrollments found" description="Enroll a student to get started." action={<button onClick={() => setEnrollOpen(true)} className="btn-primary"><Plus size={15} /> Enroll student</button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <div key={e.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold flex-shrink-0">
                    {e.student.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{e.student.firstName} {e.student.lastName}</p>
                    <p className="text-xs text-gray-400">
                      {e.student.studentId ? `ID: ${e.student.studentId} · ` : ''}{e.student.department ?? 'No department'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge-purple">{e.type}</span>
                  <span className={e.isActive ? 'badge-green' : 'badge-gray'}>{e.isActive ? 'Active' : 'Completed'}</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Company / Internship</p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {e.internship?.company?.companyName ?? e.companyName ?? 'N/A'}
                  </p>
                  {e.internship && <p className="text-xs text-gray-400">{e.internship.title}</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Duration</p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {e.startDate ? fmt(e.startDate) : '—'} → {e.endDate ? fmt(e.endDate) : 'Ongoing'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Supervisors</p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {e.supervisorAssignment?.academicSupervisor
                      ? `Academic: ${e.supervisorAssignment.academicSupervisor.firstName} ${e.supervisorAssignment.academicSupervisor.lastName}`
                      : 'No academic supervisor'
                    }
                  </p>
                  <p className="text-xs text-gray-400">
                    {e.supervisorAssignment?.siteSupervisor
                      ? `Site: ${e.supervisorAssignment.siteSupervisor.firstName} ${e.supervisorAssignment.siteSupervisor.lastName}`
                      : 'No site supervisor'
                    }
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openAssign(e.id)}
                  className="btn-secondary text-xs py-1.5"
                >
                  <UserCheck size={13} /> Assign supervisors
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enroll modal */}
      <Modal open={enrollOpen} onClose={() => setEnrollOpen(false)} title="Enroll student" size="md">
        <form onSubmit={subEnroll((d) => enrollMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Student profile ID <span className="text-red-400">*</span></label>
            <input {...regEnroll('studentId')} className="input" placeholder="Student profile ID…" />
            {enrollErrors.studentId && <p className="form-error">{enrollErrors.studentId.message}</p>}
          </div>
          <div>
            <label className="label">Internship type <span className="text-red-400">*</span></label>
            <select {...regEnroll('type')} className="input">
              <option value="ACADEMIC">Academic</option>
              <option value="PROFESSIONAL">Professional</option>
            </select>
          </div>
          <div>
            <label className="label">Internship listing ID (optional for academic)</label>
            <input {...regEnroll('internshipId')} className="input" placeholder="From the listings page…" />
          </div>
          <div>
            <label className="label">Company name (if no listing)</label>
            <input {...regEnroll('companyName')} className="input" placeholder="e.g. Rwanda Development Board" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start date</label>
              <input {...regEnroll('startDate')} type="date" className="input" />
            </div>
            <div>
              <label className="label">End date</label>
              <input {...regEnroll('endDate')} type="date" className="input" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setEnrollOpen(false)}>Cancel</button>
            <button type="submit" disabled={enrollMutation.isPending} className="btn-primary">
              {enrollMutation.isPending ? 'Enrolling…' : 'Enroll student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign supervisors modal */}
      <Modal open={assignOpen} onClose={() => setAssignOpen(false)} title="Assign supervisors" size="md">
        <form onSubmit={subAssign((d) => assignMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Enrollment ID</label>
            <input {...regAssign('enrollmentId')} className="input bg-gray-50" readOnly />
          </div>
          <div>
            <label className="label">Academic supervisor profile ID</label>
            <input {...regAssign('academicSupervisorId')} className="input" placeholder="Supervisor profile ID…" />
          </div>
          <div>
            <label className="label">Site supervisor profile ID</label>
            <input {...regAssign('siteSupervisorId')} className="input" placeholder="Supervisor profile ID…" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setAssignOpen(false)}>Cancel</button>
            <button type="submit" disabled={assignMutation.isPending} className="btn-primary">
              {assignMutation.isPending ? 'Assigning…' : 'Assign supervisors'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
