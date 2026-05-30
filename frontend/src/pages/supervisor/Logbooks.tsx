import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { logbookApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import {
  BookOpen, ChevronDown, ChevronUp,
  CheckCircle, Clock, Paperclip, MessageSquare,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { LogbookEntry } from '@/types'

export default function SupervisorLogbooks() {
  const [params]   = useSearchParams()
  const qc         = useQueryClient()
  const preStudent = params.get('studentId') ?? ''

  const [studentId,  setStudentId]  = useState(preStudent)
  const [expanded,   setExpanded]   = useState<string | null>(null)
  const [noteModal,  setNoteModal]  = useState<{ open: boolean; entryId: string }>({ open: false, entryId: '' })

  const { register: noteReg, handleSubmit: noteSubmit, reset: noteReset } = useForm<{ note: string }>()

  // Fetch entries for selected student
  const { data, isLoading } = useQuery({
    queryKey: ['supervisor-logbook', studentId],
    queryFn:  () => logbookApi.getStudentEntries(studentId),
    enabled:  !!studentId,
  })

  const entries: LogbookEntry[] = data?.data?.data?.data ?? []

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => logbookApi.approveEntry(id, note),
    onSuccess: () => {
      toast.success('Entry approved')
      setNoteModal({ open: false, entryId: '' })
      noteReset()
      qc.invalidateQueries({ queryKey: ['supervisor-logbook', studentId] })
    },
    onError: () => toast.error('Approval failed'),
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Logbooks</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve student logbook entries</p>
        </div>
      </div>

      {/* Student ID input */}
      <div className="card p-4 mb-5 flex items-center gap-4">
        <div className="flex-1">
          <label className="label">Student profile ID</label>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Paste student profile ID here…"
            className="input"
          />
        </div>
        <div className="self-end">
          <p className="text-xs text-gray-400 mb-2">
            Navigate from <strong>My Students</strong> to auto-fill this.
          </p>
        </div>
      </div>

      {!studentId ? (
        <EmptyState
          icon={<BookOpen size={48} />}
          title="Select a student"
          description="Enter a student profile ID above, or navigate from the My Students page."
        />
      ) : isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={48} />}
          title="No logbook entries"
          description="This student has not submitted any logbook entries yet."
        />
      ) : (
        <div className="space-y-3">
          {/* Summary bar */}
          <div className="flex items-center gap-4 text-sm text-gray-500 px-1 mb-2">
            <span>{entries.length} total entries</span>
            <span className="text-green-600">{entries.filter(e => e.isApproved).length} approved</span>
            <span className="text-yellow-600">{entries.filter(e => !e.isApproved).length} pending</span>
          </div>

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
                      {fmt(entry.entryDate)}{entry.weekNumber ? ` — Week ${entry.weekNumber}` : ''}
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
                  {[
                    { label: 'Internship site',  value: entry.internshipSite  },
                    { label: 'Activities done',  value: entry.activitiesDone  },
                    { label: 'Skills gained',    value: entry.skillsGained    },
                    { label: 'Challenges',       value: entry.challenges      },
                    { label: 'Next week plan',   value: entry.nextWeekPlan    },
                  ].filter(s => s.value).map((s) => (
                    <div key={s.label}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{s.value}</p>
                    </div>
                  ))}

                  {entry.supervisorNote && (
                    <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-brand-600 mb-1">Your note</p>
                      <p className="text-sm text-brand-800">{entry.supervisorNote}</p>
                    </div>
                  )}

                  {(entry as any).absenceReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-600 mb-1">Absence reason</p>
                      <p className="text-sm text-red-800">{(entry as any).absenceReason}</p>
                    </div>
                  )}

                  {entry.attachmentUrl && (
                    <a href={entry.attachmentUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                      <Paperclip size={13} /> View attachment
                    </a>
                  )}

                  {(entry as any).finalReportUrl && (
                    <a href={(entry as any).finalReportUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-green-600 hover:underline font-medium">
                      <Paperclip size={13} /> View final internship report
                    </a>
                  )}

                  {/* Actions */}
                  {!entry.isApproved && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setNoteModal({ open: true, entryId: entry.id })}
                        className="btn-secondary text-xs py-1.5"
                      >
                        <MessageSquare size={13} /> Add note & approve
                      </button>
                      <button
                        onClick={() => approveMutation.mutate({ id: entry.id })}
                        disabled={approveMutation.isPending}
                        className="btn-primary text-xs py-1.5"
                      >
                        <CheckCircle size={13} />
                        {approveMutation.isPending ? 'Approving…' : 'Approve'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Note + approve modal */}
      <Modal open={noteModal.open} onClose={() => setNoteModal({ open: false, entryId: '' })} title="Add note and approve" size="sm">
        <form
          onSubmit={noteSubmit(({ note }) => approveMutation.mutate({ id: noteModal.entryId, note }))}
          className="space-y-4"
        >
          <div>
            <label className="label">Supervisor note (optional)</label>
            <textarea {...noteReg('note')} rows={4} placeholder="Feedback or comments for the student…" className="input resize-none" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setNoteModal({ open: false, entryId: '' })}>Cancel</button>
            <button type="submit" disabled={approveMutation.isPending} className="btn-primary">
              {approveMutation.isPending ? 'Approving…' : 'Approve entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
