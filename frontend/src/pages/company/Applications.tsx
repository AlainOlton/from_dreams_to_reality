import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import { applicationApi, internshipApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { getStatusBadgeClass, getStatusLabel } from '@/utils/roleHelpers'
import { FileText, Calendar, ChevronDown, ChevronUp, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ApplicationStatus, Internship } from '@/types'

const interviewSchema = z.object({
  scheduledAt:     z.string().min(1, 'Date and time required'),
  durationMinutes: z.preprocess((v) => v === '' || v == null ? undefined : Number(v), z.number().min(15).optional()),
  meetingLink:     z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location:        z.string().optional(),
  notes:           z.string().optional(),
  interviewerName: z.string().optional(),
})
type InterviewForm = z.infer<typeof interviewSchema>

export default function CompanyApplications() {
  const qc = useQueryClient()
  const [selectedListing, setSelectedListing] = useState('')
  const [expanded,        setExpanded]        = useState<string | null>(null)
  const [interviewTarget, setInterviewTarget] = useState<string | null>(null)
  const [rejectTarget,    setRejectTarget]    = useState<string | null>(null)
  const [rejectReason,    setRejectReason]    = useState('')

  const { data: listingsData } = useQuery({
    queryKey: ['company-internships'],
    queryFn:  internshipApi.getMine,
  })
  const listings: Internship[] = listingsData?.data?.data ?? []

  const { data: appsData, isLoading } = useQuery({
    queryKey: ['company-applications', selectedListing],
    queryFn:  () => applicationApi.getForInternship(selectedListing),
    enabled:  !!selectedListing,
  })
  const applications: any[] = appsData?.data?.data ?? []

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InterviewForm>({
    resolver: zodResolver(interviewSchema) as Resolver<InterviewForm>,
    defaultValues: { durationMinutes: 30 },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: ApplicationStatus; reason?: string }) =>
      applicationApi.updateStatus(id, status, reason),
    onSuccess: (_data, vars) => {
      toast.success(`Application ${getStatusLabel(vars.status).toLowerCase()}`)
      setRejectTarget(null)
      setRejectReason('')
      qc.invalidateQueries({ queryKey: ['company-applications', selectedListing] })
    },
    onError: () => toast.error('Status update failed'),
  })

  const interviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewForm }) => {
      // datetime-local gives "2026-06-17T05:19" with no timezone.
      // Convert to full ISO-8601 with local offset so the server receives
      // the correct UTC equivalent and the "must be in future" check passes.
      const payload = {
        ...data,
        scheduledAt: data.scheduledAt
          ? new Date(data.scheduledAt).toISOString()
          : data.scheduledAt,
      }
      return applicationApi.scheduleInterview(id, payload)
    },
    onSuccess: () => {
      toast.success('Interview scheduled!')
      setInterviewTarget(null)
      reset()
      qc.invalidateQueries({ queryKey: ['company-applications', selectedListing] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Scheduling failed'),
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage applicants for your listings</p>
        </div>
      </div>

      {/* Listing selector */}
      <div className="card p-4 mb-5">
        <label className="label">Select internship listing</label>
        <select value={selectedListing} onChange={(e) => setSelectedListing(e.target.value)} className="input max-w-md">
          <option value="">Choose a listing…</option>
          {listings.map((l) => (
            <option key={l.id} value={l.id}>{l.title} ({l._count?.applications ?? 0} applicants)</option>
          ))}
        </select>
      </div>

      {!selectedListing ? (
        <EmptyState icon={<FileText size={48} />} title="Select a listing" description="Choose an internship above to view its applications." />
      ) : isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : applications.length === 0 ? (
        <EmptyState icon={<FileText size={48} />} title="No applications yet" description="No one has applied to this listing yet." />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 px-1">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>

          {applications.map((app: any) => (
            <div key={app.id} className="card overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              >
                <div className="flex items-center gap-3">
                  {app.student?.profilePhotoUrl
                    ? <img src={app.student.profilePhotoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    : <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                        {app.student?.firstName?.charAt(0) ?? '?'}
                      </div>
                  }
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {app.student?.firstName} {app.student?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {app.student?.institution ?? 'N/A'} · Applied {fmt(app.appliedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={getStatusBadgeClass(app.status)}>{getStatusLabel(app.status)}</span>
                  {expanded === app.id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                </div>
              </div>

              {expanded === app.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                  {/* Student info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    {[
                      { label: 'Department',  value: app.student?.department  },
                      { label: 'Institution', value: app.student?.institution },
                      { label: 'Skills',      value: app.student?.skills?.join(', ') },
                    ].filter(s => s.value).map((s) => (
                      <div key={s.label}>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
                        <p className="text-sm text-gray-700 mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Docs */}
                  <div className="flex flex-wrap gap-3">
                    {app.student?.cvUrl && (
                      <a href={app.student.cvUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-brand-600 hover:underline font-medium">
                        <FileText size={13} /> View CV
                      </a>
                    )}
                    {app.coverLetterUrl && (
                      <a href={app.coverLetterUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-brand-600 hover:underline font-medium">
                        <FileText size={13} /> Cover letter
                      </a>
                    )}
                  </div>

                  {/* Interview info */}
                  {app.interview && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-purple-700">Interview scheduled</p>
                      <div className="flex items-center gap-2 text-sm text-purple-800">
                        <Calendar size={13} /> {fmt(app.interview.scheduledAt)} at {new Date(app.interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {app.interview.meetingLink && (
                        <div className="flex items-center gap-2 text-sm">
                          <Video size={13} className="text-purple-500" />
                          <a href={app.interview.meetingLink} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline truncate">{app.interview.meetingLink}</a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {app.status === 'APPLIED' && (
                      <button onClick={() => statusMutation.mutate({ id: app.id, status: 'REVIEWED' })}
                        className="btn-secondary text-xs py-1.5" disabled={statusMutation.isPending}>
                        Mark reviewed
                      </button>
                    )}
                    {(app.status === 'APPLIED' || app.status === 'REVIEWED') && (
                      <button onClick={() => setInterviewTarget(app.id)}
                        className="btn-secondary text-xs py-1.5">
                        <Calendar size={13} /> Schedule interview
                      </button>
                    )}
                    {app.status !== 'ACCEPTED' && app.status !== 'REJECTED' && app.status !== 'WITHDRAWN' && (
                      <>
                        <button onClick={() => statusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                          className="btn-primary text-xs py-1.5" disabled={statusMutation.isPending}>
                          Accept
                        </button>
                        <button onClick={() => setRejectTarget(app.id)}
                          className="btn-danger text-xs py-1.5">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Schedule interview modal */}
      <Modal open={!!interviewTarget} onClose={() => { setInterviewTarget(null); reset() }} title="Schedule interview" size="md">
        <form onSubmit={handleSubmit((d) => interviewMutation.mutate({ id: interviewTarget!, data: d }))} className="space-y-4">
          <div>
            <label className="label">Date & time <span className="text-red-400">*</span></label>
            <input {...register('scheduledAt')} type="datetime-local" className="input" />
            {errors.scheduledAt && <p className="form-error">{errors.scheduledAt.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Duration (minutes)</label>
              <input {...register('durationMinutes')} type="number" min={15} className="input" />
            </div>
            <div>
              <label className="label">Interviewer name</label>
              <input {...register('interviewerName')} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Meeting link</label>
            <input {...register('meetingLink')} type="url" className="input" placeholder="https://meet.google.com/…" />
            {errors.meetingLink && <p className="form-error">{errors.meetingLink.message}</p>}
          </div>
          <div>
            <label className="label">Location (for in-person)</label>
            <input {...register('location')} className="input" />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea {...register('notes')} rows={2} className="input resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => { setInterviewTarget(null); reset() }}>Cancel</button>
            <button type="submit" disabled={interviewMutation.isPending} className="btn-primary">
              {interviewMutation.isPending ? 'Scheduling…' : 'Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reject modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject application" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Rejection reason</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              rows={3} className="input resize-none" placeholder="Brief explanation for the applicant…" />
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setRejectTarget(null)}>Cancel</button>
            <button className="btn-danger" disabled={statusMutation.isPending}
              onClick={() => statusMutation.mutate({ id: rejectTarget!, status: 'REJECTED', reason: rejectReason })}>
              {statusMutation.isPending ? 'Rejecting…' : 'Reject application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
