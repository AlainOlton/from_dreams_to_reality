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
  Upload, FileText, AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { LogbookEntry, AttendanceSummary } from '@/types'

// ── Helpers ───────────────────────────────────────────────────

/** Return today's date as YYYY-MM-DD in local time */
const todayStr = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ── Zod schema — all fields required ─────────────────────────

const schema = z.object({
  frequency:      z.enum(['DAILY', 'WEEKLY'] as const),
  entryDate:      z.string()
    .min(1, 'Date is required')
    .refine((val) => {
      // Reject any date before today
      return val >= todayStr()
    }, 'You cannot submit a logbook entry for a past date. Entries must be submitted on the same day.'),
  weekNumber:     z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().min(1).max(52).optional()
  ),
  internshipSite: z.string().trim().min(1, 'Internship site / location is required').max(200),
  activitiesDone: z.string().trim().min(20, 'Please describe activities in at least 20 characters').max(3000),
  skillsGained:   z.string().trim().min(5, 'Skills gained is required (at least 5 characters)').max(1000),
  challenges:     z.string().trim().min(5, 'Challenges is required (at least 5 characters)').max(1000),
  nextWeekPlan:   z.string().trim().min(5, 'Next week plan is required (at least 5 characters)').max(1000),
  absenceReason:  z.string().trim().max(1000).optional(),
})
type EntryForm = z.infer<typeof schema>

// ── Component ─────────────────────────────────────────────────

export default function StudentLogbook() {
  const qc = useQueryClient()

  const [newOpen,       setNewOpen]       = useState(false)
  const [expanded,      setExpanded]      = useState<string | null>(null)
  const [attachment,    setAttachment]    = useState<File | null>(null)
  const [finalReport,   setFinalReport]   = useState<File | null>(null)
  const [reportModal,   setReportModal]   = useState(false)
  const [view,          setView]          = useState<'entries' | 'attendance'>('entries')

  // ── Queries ──────────────────────────────────────────────────

  const { data: logData,    isLoading: l1 } = useQuery({
    queryKey: ['my-logbook'],
    queryFn:  () => logbookApi.getMyEntries(),
  })

  const { data: attendData, isLoading: l2 } = useQuery({
    queryKey: ['my-attendance'],
    queryFn:  logbookApi.getAttendance,
  })

  const entries:    LogbookEntry[]    = logData?.data?.data?.data ?? []
  const attendance: AttendanceSummary = attendData?.data?.data    ?? {
    total: 0, present: 0, absent: 0, late: 0, excused: 0, totalHoursLogged: 0, records: [],
  }

  // ── Form ─────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EntryForm>({
    resolver:      zodResolver(schema),
    defaultValues: { frequency: 'WEEKLY', entryDate: todayStr() },
  })

  const selectedDate = watch('entryDate')
  const isToday      = selectedDate === todayStr()

  // ── Mutations ─────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => logbookApi.createEntry(fd),
    onSuccess: () => {
      toast.success('Logbook entry saved!')
      setNewOpen(false)
      reset({ frequency: 'WEEKLY', entryDate: todayStr() })
      setAttachment(null)
      qc.invalidateQueries({ queryKey: ['my-logbook'] })
      qc.invalidateQueries({ queryKey: ['my-attendance'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create entry'),
  })

  const reportMutation = useMutation({
    mutationFn: (fd: FormData) => logbookApi.uploadFinalReport(fd),
    onSuccess: () => {
      toast.success('Final report uploaded!')
      setReportModal(false)
      setFinalReport(null)
      qc.invalidateQueries({ queryKey: ['my-logbook'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Upload failed'),
  })

  // ── Handlers ─────────────────────────────────────────────────

  const onSubmit = (data: EntryForm) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== '') fd.append(k, String(v))
    })
    if (attachment) fd.append('attachment', attachment)
    createMutation.mutate(fd)
  }

  const onUploadReport = () => {
    if (!finalReport) { toast.error('Please select a PDF file first.'); return }
    const fd = new FormData()
    fd.append('finalReport', finalReport)
    reportMutation.mutate(fd)
  }

  // ── Attendance badge ──────────────────────────────────────────

  const statusColor = (status: string): string => ({
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT:  'bg-red-100   text-red-700',
    LATE:    'bg-yellow-100 text-yellow-700',
    EXCUSED: 'bg-blue-100  text-blue-700',
  }[status] ?? 'bg-gray-100 text-gray-600')

  // ── Render ────────────────────────────────────────────────────

  if (l1 || l2) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const hasFinalReport = entries.some(e => e.finalReportUrl)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Logbook</h1>
          <p className="text-sm text-gray-500 mt-1">{entries.length} entries · {attendance.totalHoursLogged}h logged</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setReportModal(true)} className="btn-secondary">
            <Upload size={15} /> {hasFinalReport ? 'Update final report' : 'Upload final report'}
          </button>
          <button onClick={() => setNewOpen(true)} className="btn-primary">
            <Plus size={16} /> New entry
          </button>
        </div>
      </div>

      {/* Final report banner */}
      {!hasFinalReport && entries.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Final report not yet uploaded</p>
            <p className="text-xs text-amber-600 mt-0.5">
              At the end of your internship you must upload a PDF containing your full written report
              and any signed documents from your site supervisor.
            </p>
          </div>
          <button onClick={() => setReportModal(true)} className="ml-auto btn-secondary text-xs py-1.5 flex-shrink-0">
            Upload now
          </button>
        </div>
      )}

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
          ? <EmptyState
              icon={<BookOpen size={48} />}
              title="No logbook entries yet"
              description="Start documenting your internship experience. All fields are required."
              action={<button onClick={() => setNewOpen(true)} className="btn-primary">Add first entry</button>}
            />
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
                        <p className="text-xs text-gray-400 mt-0.5">{entry.internshipSite}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{entry.activitiesDone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {entry.finalReportUrl && (
                        <span className="badge-blue flex items-center gap-1"><FileText size={10} /> Report</span>
                      )}
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
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Internship site</p>
                        <p className="text-sm text-gray-700">{entry.internshipSite}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Activities done</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{entry.activitiesDone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Skills gained</p>
                        <p className="text-sm text-gray-700">{entry.skillsGained}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Challenges</p>
                        <p className="text-sm text-gray-700">{entry.challenges}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Next week plan</p>
                        <p className="text-sm text-gray-700">{entry.nextWeekPlan}</p>
                      </div>
                      {entry.absenceReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-red-600 mb-1">Absence reason</p>
                          <p className="text-sm text-red-800">{entry.absenceReason}</p>
                        </div>
                      )}
                      {entry.supervisorNote && (
                        <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-brand-600 mb-1">Supervisor note</p>
                          <p className="text-sm text-brand-800">{entry.supervisorNote}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {entry.attachmentUrl && (
                          <a href={entry.attachmentUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                            <Paperclip size={13} /> View attachment
                          </a>
                        )}
                        {entry.finalReportUrl && (
                          <a href={entry.finalReportUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 text-xs text-green-600 hover:underline">
                            <FileText size={13} /> View final report
                          </a>
                        )}
                      </div>
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
              { label: 'Total days', value: attendance.total,                 color: 'text-gray-700' },
              { label: 'Present',    value: attendance.present,               color: 'text-green-600' },
              { label: 'Absent',     value: attendance.absent,                color: 'text-red-600' },
              { label: 'Late',       value: attendance.late,                  color: 'text-yellow-600' },
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
                        {r.hoursLogged != null && <p className="text-xs text-gray-400">{r.hoursLogged}h logged</p>}
                        {r.note && <p className="text-xs text-gray-400 italic">{r.note}</p>}
                      </div>
                      <span className={`badge ${statusColor(r.status)}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}

      {/* ── New entry modal ── */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New logbook entry" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Date warning */}
          {!isToday && selectedDate && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                You can only submit a logbook entry for <strong>today</strong>.
                Entries for past dates are not allowed.
              </p>
            </div>
          )}

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
              <input {...register('entryDate')} type="date" className="input" max={todayStr()} />
              {errors.entryDate && <p className="form-error">{errors.entryDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Week number</label>
              <input {...register('weekNumber')} type="number" min={1} max={52} className="input" placeholder="e.g. 3" />
              {errors.weekNumber && <p className="form-error">{errors.weekNumber.message}</p>}
            </div>
            <div>
              <label className="label">Internship site / location <span className="text-red-400">*</span></label>
              <input {...register('internshipSite')} type="text" className="input" placeholder="e.g. Rwanda Tech Hub, Kigali" />
              {errors.internshipSite && <p className="form-error">{errors.internshipSite.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Activities done <span className="text-red-400">*</span></label>
            <textarea {...register('activitiesDone')} rows={4} className="input resize-none"
              placeholder="Describe what you worked on today (min. 20 characters)…" />
            {errors.activitiesDone && <p className="form-error">{errors.activitiesDone.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Skills gained <span className="text-red-400">*</span></label>
              <textarea {...register('skillsGained')} rows={3} className="input resize-none"
                placeholder="New skills or knowledge acquired…" />
              {errors.skillsGained && <p className="form-error">{errors.skillsGained.message}</p>}
            </div>
            <div>
              <label className="label">Challenges <span className="text-red-400">*</span></label>
              <textarea {...register('challenges')} rows={3} className="input resize-none"
                placeholder="Any difficulties faced…" />
              {errors.challenges && <p className="form-error">{errors.challenges.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Next week plan <span className="text-red-400">*</span></label>
            <textarea {...register('nextWeekPlan')} rows={2} className="input resize-none"
              placeholder="What you plan to do next…" />
            {errors.nextWeekPlan && <p className="form-error">{errors.nextWeekPlan.message}</p>}
          </div>

          <div>
            <label className="label">
              Absence reason
              <span className="ml-1 text-xs text-gray-400">(fill this if you were absent or could not complete tasks)</span>
            </label>
            <textarea {...register('absenceReason')} rows={2} className="input resize-none"
              placeholder="State reason if you were absent or unable to work today…" />
            {errors.absenceReason && <p className="form-error">{errors.absenceReason.message}</p>}
          </div>

          <div>
            <label className="label">Attachment <span className="text-xs text-gray-400">(optional — PDF, image)</span></label>
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

      {/* ── Final report upload modal ── */}
      <Modal open={reportModal} onClose={() => setReportModal(false)} title="Upload final internship report" size="md">
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">What to include in your final report PDF:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Full written report of your internship experience</li>
              <li>Summary of skills gained and projects completed</li>
              <li>Signed documents from your site supervisor (if any)</li>
              <li>Any certificates or proof of completion</li>
            </ul>
          </div>

          <div>
            <label className="label">Final report PDF <span className="text-red-400">*</span></label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFinalReport(e.target.files?.[0] ?? null)}
              className="input text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-50 file:text-brand-700"
            />
            {finalReport && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {finalReport.name} ({(finalReport.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setReportModal(false)}>Cancel</button>
            <button
              onClick={onUploadReport}
              disabled={!finalReport || reportMutation.isPending}
              className="btn-primary"
            >
              {reportMutation.isPending ? 'Uploading…' : 'Upload report'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
