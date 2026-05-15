export default function StudentApplications() {
  return (
    <div>
      <div className="page-header"><h1>Applications</h1></div>
      <div className="card p-6 text-sm text-gray-500">Student Applications — implement here.</div>
    </div>
  )
}
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { getStatusBadgeClass, getStatusLabel } from '@/utils/roleHelpers'
import {
  FileText, Calendar, Video, MapPin,
  Briefcase, ChevronDown, ChevronUp, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Application } from '@/types'

export default function StudentApplications() {
  const qc = useQueryClient()
  const [expanded,       setExpanded]       = useState<string | null>(null)
  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn:  applicationApi.getMyApps,
  })

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => applicationApi.withdraw(id),
    onSuccess: () => {
      toast.success('Application withdrawn')
      setWithdrawTarget(null)
      qc.invalidateQueries({ queryKey: ['my-applications'] })
    },
    onError: () => toast.error('Could not withdraw application'),
  })

  const applications: Application[] = data?.data?.data ?? []

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Applications</h1>
          <p className="text-sm text-gray-500 mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={48} />}
          title="No applications yet"
          description="Browse internships and apply to get started."
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="card overflow-hidden">
              {/* Summary row */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              >
                <div className="flex items-center gap-4">
                  {app.internship?.company?.logoUrl
                    ? <img src={app.internship.company.logoUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    : <div className="h-10 w-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                        {app.internship?.company?.companyName?.charAt(0) ?? '?'}
                      </div>
                  }
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{app.internship?.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {app.internship?.company?.companyName} · Applied {fmt(app.appliedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={getStatusBadgeClass(app.status)}>{getStatusLabel(app.status)}</span>
                  {expanded === app.id
                    ? <ChevronUp  size={16} className="text-gray-400" />
                    : <ChevronDown size={16} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === app.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">

                  {/* Interview info */}
                  {app.interview && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">
                        Interview scheduled
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-purple-800">
                          <Calendar size={14} />
                          {fmt(app.interview.scheduledAt)} at {new Date(app.interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {app.interview.durationMinutes && ` · ${app.interview.durationMinutes} min`}
                        </div>
                        {app.interview.meetingLink && (
                          <div className="flex items-center gap-2 text-sm">
                            <Video size={14} className="text-purple-600" />
                            <a href={app.interview.meetingLink} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline truncate">
                              {app.interview.meetingLink}
                            </a>
                          </div>
                        )}
                        {app.interview.location && (
                          <div className="flex items-center gap-2 text-sm text-purple-800">
                            <MapPin size={14} />{app.interview.location}
                          </div>
                        )}
                        {app.interview.interviewerName && (
                          <p className="text-xs text-purple-600">Interviewer: {app.interview.interviewerName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejection reason */}
                  {app.status === 'REJECTED' && app.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Feedback</p>
                      <p className="text-sm text-red-700">{app.rejectionReason}</p>
                    </div>
                  )}

                  {/* Docs */}
                  <div className="flex flex-wrap gap-3">
                    {app.cvUrl && (
                      <a href={app.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                        <FileText size={13} /> View CV
                      </a>
                    )}
                    {app.coverLetterUrl && (
                      <a href={app.coverLetterUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                        <FileText size={13} /> View Cover Letter
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  {(app.status === 'APPLIED' || app.status === 'REVIEWED') && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setWithdrawTarget(app.id)}
                        className="btn-danger text-xs py-1.5"
                      >
                        <X size={13} /> Withdraw
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Withdraw confirmation */}
      <Modal open={!!withdrawTarget} onClose={() => setWithdrawTarget(null)} title="Withdraw application" size="sm">
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to withdraw this application? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setWithdrawTarget(null)}>Cancel</button>
          <button
            className="btn-danger"
            onClick={() => withdrawTarget && withdrawMutation.mutate(withdrawTarget)}
            disabled={withdrawMutation.isPending}
          >
            {withdrawMutation.isPending ? 'Withdrawing…' : 'Yes, withdraw'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
