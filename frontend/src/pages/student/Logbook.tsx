import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { logbookApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import {
  BookOpen, Plus, CheckCircle, Clock,
  ChevronDown, ChevronUp, Paperclip, BarChart2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { LogbookEntry, AttendanceSummary } from '@/types'

const schema = z.object({
  frequency:      z.enum(['DAILY', 'WEEKLY'] as const),
  entryDate:      z.string().min(1, 'Date is required'),
  weekNumber:     z.preprocess((v) => v === '' || v == null ? undefined : Number(v), z.number().min(1).max(52).optional()),
  activitiesDone: z.string().min(20, 'Please describe activities in at least 20 characters'),
  skillsGained:   z.string().optional(),
  challenges:     z.string().optional(),
  nextWeekPlan:   z.string().optional(),
})
type EntryForm = z.infer<typeof schema>

export default function StudentLogbook() {
  const qc                  = useQueryClient()
  const [newOpen,    setNewOpen]    = useState(false)
  const [expanded,   setExpanded]   = useState<string | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [view,       setView]       = useState<'entries' | 'attendance'>('entries')

  const { data: logData,    isLoading: l1 } = useQuery({
    queryKey: ['my-logbook'],
    queryFn:  () => logbookApi.getMyEntries(),
  })

  const { data: attendData, isLoading: l2 } = useQuery({
    queryKey: ['my-attendance'],
    queryFn:  logbookApi.getAttendance,
  })

  const entries:   LogbookEntry[]    = logData?.data?.data?.data     ?? []
  const attendance: AttendanceSummary = attendData?.data?.data        ?? { total: 0, present: 0, absent: 0, late: 0, excused: 0, totalHoursLogged: 0, records: [] }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EntryForm>({
    resolver: zodResolver(schema),
    defaultValues: { frequency: 'WEEKLY' },
  })

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => logbookApi.createEntry(fd),
    onSuccess: () => {
      toast.success('Entry created!')
      setNewOpen(false)
      reset()
      setAttachment(null)
      qc.invalidateQueries({ queryKey: ['my-logbook'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create entry'),
  })

  const onSubmit = (data: EntryForm) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, String(v)) })
    if (attachment) fd.append('attachment', attachment)
    createMutation.mutate(fd)
  }

  const statusColor = (status: string): string => ({
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT:  'bg-red-100   text-red-700',
    LATE:    'bg-yellow-100 text-yellow-700',
    EXCUSED: 'bg-blue-100  text-blue-700',
  }[status] ?? 'bg-gray-100 text-gray-600')

  if (l1 || l2) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Logbook</h1>
          <p className="text-sm text-gray-500 mt-1">{entries.length} entries · {attendance.totalHoursLogged}h logged</p>
        </div>
        <button onClick={() => setNewOpen(true)} className="btn-primary">
          <Plus size={16} /> New entry
        </button>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setView('entries')} className={view === 'entries' ? 'btn-primary' : 'btn-secondary'}>
          <BookOpen size={15} /> Entries
        </button>
        <button onClick={() => setView('attendance')} className={view === 'attendance' ? 'btn-primary' : 'btn-secondary'}>
          <BarChart2 size={15} /> Attendance
        </button>
      </div>

      {/* ── Entries tab ── */}
      {view === 'entries' && (
        entries.length === 0
          ? <EmptyState icon={<BookOpen size={48} />} title="No logbook entries yet" description="Start documenting your internship experience." action={<button onClick={() => setNewOpen(true)} className="btn-primary">Add first entry</button>} />
          : <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="card overflow-hidden">
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${entry.isApproved ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {entry.isApproved ? <CheckCircle size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {fmt(entry.entryDate)}
                          {entry.weekNumber ? ` — Week ${entry.weekNumber}` : ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{entry.activitiesDone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={entry.isApproved ? 'badge-green' : 'badge-yellow'}>
                        {entry.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      <span className="badge-gray">{entry.frequency}</span>
                      {expanded === entry.id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                    </div>
                  </div>

                  {expanded === entry.id && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Activities done</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{entry.activitiesDone}</p>
                      </div>
                      {entry.skillsGained && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Skills gained</p>
                          <p className="text-sm text-gray-700">{entry.skillsGained}</p>
                        </div>
                      )}
                      {entry.challenges && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Challenges</p>
                          <p className="text-sm text-gray-700">{entry.challenges}</p>
                        </div>
                      )}
                      {entry.nextWeekPlan && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Next week plan</p>
                          <p className="text-sm text-gray-700">{entry.nextWeekPlan}</p>
                        </div>
                      )}
                      {entry.supervisorNote && (
                        <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-brand-600 mb-1">Supervisor note</p>
                          <p className="text-sm text-brand-800">{entry.supervisorNote}</p>
                        </div>
                      )}
                      {entry.attachmentUrl && (
                        <a href={entry.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                          <Paperclip size={13} /> View attachment
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
      )}

      {/* ── Attendance tab ── */}
      {view === 'attendance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total days', value: attendance.total,            color: 'text-gray-700' },
              { label: 'Present',    value: attendance.present,          color: 'text-green-600' },
              { label: 'Absent',     value: attendance.absent,           color: 'text-red-600' },
              { label: 'Late',       value: attendance.late,             color: 'text-yellow-600' },
              { label: 'Hours',      value: `${attendance.totalHoursLogged}h`, color: 'text-brand-600' },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h3 className="section-title">Attendance records</h3>
            {attendance.records.length === 0
              ? <p className="text-sm text-gray-400">No records yet.</p>
              : <div className="space-y-2">
                  {attendance.records.slice(0, 30).map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{fmt(r.date)}</p>
                        {r.hoursLogged && <p className="text-xs text-gray-400">{r.hoursLogged}h logged</p>}
                      </div>
                      <span className={`badge ${statusColor(r.status)}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}

      {/* New entry modal */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New logbook entry" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Frequency <span className="text-red-400">*</span></label>
              <select {...register('frequency')} className="input">
                <option value="WEEKLY">Weekly</option>
                <option value="DAILY">Daily</option>
              </select>
            </div>
            <div>
              <label className="label">Entry date <span className="text-red-400">*</span></label>
              <input {...register('entryDate')} type="date" className="input" />
              {errors.entryDate && <p className="form-error">{errors.entryDate.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Week number (optional)</label>
            <input {...register('weekNumber')} type="number" min={1} max={52} className="input" placeholder="e.g. 3" />
          </div>
          <div>
            <label className="label">Activities done <span className="text-red-400">*</span></label>
            <textarea {...register('activitiesDone')} rows={4} className="input resize-none" placeholder="Describe what you worked on…" />
            {errors.activitiesDone && <p className="form-error">{errors.activitiesDone.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Skills gained</label>
              <textarea {...register('skillsGained')} rows={3} className="input resize-none" placeholder="New skills or knowledge acquired…" />
            </div>
            <div>
              <label className="label">Challenges</label>
              <textarea {...register('challenges')} rows={3} className="input resize-none" placeholder="Any difficulties faced…" />
            </div>
          </div>
          <div>
            <label className="label">Next week plan</label>
            <textarea {...register('nextWeekPlan')} rows={2} className="input resize-none" placeholder="What you plan to do next…" />
          </div>
          <div>
            <label className="label">Attachment (optional)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
              className="input text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-50 file:text-brand-700"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setNewOpen(false)}>Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Saving…' : 'Save entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
