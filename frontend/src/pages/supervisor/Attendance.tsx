import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import { logbookApi } from '@/api/endpoints'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { Plus, CheckCircle, XCircle, AlertCircle, MinusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AttendanceStatus } from '@/types'

const schema = z.object({
  studentId:   z.string().min(1, 'Student profile ID is required'),
  date:        z.string().min(1, 'Date is required'),
  status:      z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const),
  checkInTime: z.string().optional(),
  checkOutTime:z.string().optional(),
  hoursLogged: z.preprocess((v) => v === '' || v == null ? undefined : Number(v), z.number().min(0).max(24).optional()),
  note:        z.string().max(300).optional(),
})
type AttendForm = z.infer<typeof schema>

const statusMeta: Record<AttendanceStatus, { label: string; icon: React.ReactNode; badge: string; color: string }> = {
  PRESENT: { label: 'Present', icon: <CheckCircle size={14} />, badge: 'badge-green',  color: 'text-green-600' },
  ABSENT:  { label: 'Absent',  icon: <XCircle     size={14} />, badge: 'badge-red',    color: 'text-red-600'   },
  LATE:    { label: 'Late',    icon: <AlertCircle size={14} />, badge: 'badge-yellow', color: 'text-yellow-600'},
  EXCUSED: { label: 'Excused', icon: <MinusCircle size={14} />, badge: 'badge-blue',   color: 'text-blue-600'  },
}

export default function SupervisorAttendance() {
  const qc = useQueryClient()
  const [studentId, setStudentId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AttendForm>({
    resolver: zodResolver(schema) as Resolver<AttendForm>,
    defaultValues: { status: 'PRESENT' },
  })

  const logMutation = useMutation({
    mutationFn: (data: AttendForm) => logbookApi.logAttendance(data),
    onSuccess: () => {
      toast.success('Attendance recorded')
      setModalOpen(false)
      reset()
      qc.invalidateQueries({ queryKey: ['student-attendance'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to log attendance'),
  })

  // Quick-log shortcuts for today
  const today = new Date().toISOString().split('T')[0]

  const quickLog = (studentId: string, status: AttendanceStatus) => {
    if (!studentId) { toast.error('Enter a student ID first'); return }
    logMutation.mutate({ studentId, date: today, status })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Record daily attendance for your assigned interns</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Log attendance
        </button>
      </div>

      {/* Quick log panel */}
      <div className="card p-5 mb-6">
        <h2 className="section-title">Quick log for today — {fmt(new Date().toISOString())}</h2>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-48">
            <label className="label">Student profile ID</label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Paste student profile ID…"
              className="input"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map((status) => {
              const meta = statusMeta[status]
              return (
                <button
                  key={status}
                  onClick={() => quickLog(studentId, status)}
                  disabled={logMutation.isPending}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                    ${status === 'PRESENT' ? 'border-green-300  bg-green-50  text-green-700  hover:bg-green-100'  :
                      status === 'ABSENT'  ? 'border-red-300    bg-red-50    text-red-700    hover:bg-red-100'    :
                      status === 'LATE'    ? 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100' :
                                            'border-blue-300  bg-blue-50   text-blue-700   hover:bg-blue-100'
                    }`}
                >
                  {meta.icon} {meta.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Info about per-student records */}
      <div className="card p-5">
        <h2 className="section-title">About attendance tracking</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Present',   icon: <CheckCircle size={20} className="text-green-500" />, desc: 'Student was on time and attended the full day.' },
            { label: 'Absent',    icon: <XCircle     size={20} className="text-red-500"   />, desc: 'Student did not attend without excuse.' },
            { label: 'Late',      icon: <AlertCircle size={20} className="text-yellow-500"/>, desc: 'Student arrived late or left early.' },
            { label: 'Excused',   icon: <MinusCircle size={20} className="text-blue-500"  />, desc: 'Approved absence with valid reason.' },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              {s.icon}
              <div>
                <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          To view a student's full attendance history and hours logged, open their profile from
          <strong> My Students</strong> and navigate to the logbook attendance tab.
        </p>
      </div>

      {/* Full log modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log attendance" size="md">
        <form onSubmit={handleSubmit((d) => logMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Student profile ID <span className="text-red-400">*</span></label>
            <input {...register('studentId')} className="input" placeholder="Student profile ID…" />
            {errors.studentId && <p className="form-error">{errors.studentId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date <span className="text-red-400">*</span></label>
              <input {...register('date')} type="date" defaultValue={today} className="input" />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
            <div>
              <label className="label">Status <span className="text-red-400">*</span></label>
              <select {...register('status')} className="input">
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="EXCUSED">Excused</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Check-in time</label>
              <input {...register('checkInTime')} type="time" className="input" />
            </div>
            <div>
              <label className="label">Check-out time</label>
              <input {...register('checkOutTime')} type="time" className="input" />
            </div>
          </div>

          <div>
            <label className="label">Hours logged</label>
            <input {...register('hoursLogged')} type="number" step="0.5" min={0} max={24} className="input" placeholder="e.g. 8" />
          </div>

          <div>
            <label className="label">Note (optional)</label>
            <textarea {...register('note')} rows={2} className="input resize-none" placeholder="Any relevant notes…" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={logMutation.isPending} className="btn-primary">
              {logMutation.isPending ? 'Saving…' : 'Save record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
