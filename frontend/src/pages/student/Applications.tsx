import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { applicationApi } from '@/api/endpoints'
import Spinner from '@/components/common/Spinner'
import Modal   from '@/components/common/Modal'
import { fmt } from '@/utils/formatDate'
import { getStatusLabel } from '@/utils/roleHelpers'
import {
  FileText, Calendar, Video, MapPin, Briefcase,
  ChevronDown, ChevronUp, X, Search,
  Clock, CheckCircle, XCircle, Eye,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Application, ApplicationStatus } from '@/types'

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  APPLIED:             { color: '#5a8fa3', bg: 'rgba(90,143,163,0.10)', border: 'rgba(90,143,163,0.25)',  icon: <Clock       size={12} /> },
  REVIEWED:            { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)',  icon: <Eye         size={12} /> },
  INTERVIEW_SCHEDULED: { color: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.25)',  icon: <Calendar    size={12} /> },
  ACCEPTED:            { color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.25)',   icon: <CheckCircle size={12} /> },
  REJECTED:            { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.25)',   icon: <XCircle     size={12} /> },
  WITHDRAWN:           { color: '#9bbfcc', bg: 'rgba(155,191,204,0.10)', border: 'rgba(155,191,204,0.25)', icon: <X           size={12} /> },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['APPLIED']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 20,
      fontSize: '0.72rem', fontWeight: 700,
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.border}`,
    }}>
      {cfg.icon}
      {getStatusLabel(status)}
    </span>
  )
}

// ── Summary stat pill ─────────────────────────────────────────
function StatPill({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '7px 14px', borderRadius: 10,
      background: '#fff', border: '1px solid rgba(13,202,240,0.15)',
      boxShadow: '0 1px 4px rgba(13,202,240,0.06)',
    }}>
      <span style={{ color, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d1a26' }}>{value}</span>
      <span style={{ fontSize: '0.78rem', color: '#5a8fa3' }}>{label}</span>
    </div>
  )
}

type FilterTab = 'ALL' | ApplicationStatus

export default function StudentApplications() {
  const qc = useQueryClient()
  const [expanded,       setExpanded]       = useState<string | null>(null)
  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null)
  const [filter,         setFilter]         = useState<FilterTab>('ALL')
  const [search,         setSearch]         = useState('')

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

  const filtered = applications.filter((app) => {
    const matchFilter = filter === 'ALL' || app.status === filter
    const matchSearch = search === '' ||
      app.internship?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.internship?.company?.companyName?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const pending  = applications.filter(a => a.status === 'APPLIED' || a.status === 'REVIEWED').length
  const accepted = applications.filter(a => a.status === 'ACCEPTED').length
  const rejected = applications.filter(a => a.status === 'REJECTED').length

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'ALL',                label: 'All'        },
    { key: 'APPLIED',            label: 'Pending'    },
    { key: 'REVIEWED',           label: 'Reviewed'   },
    { key: 'INTERVIEW_SCHEDULED',label: 'Interview'  },
    { key: 'ACCEPTED',           label: 'Accepted'   },
    { key: 'REJECTED',           label: 'Rejected'   },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0d1a26', marginBottom: 3 }}>My Applications</h1>
          <p style={{ fontSize: '0.85rem', color: '#5a8fa3' }}>Track the status of all your internship applications.</p>
        </div>
        <Link
          to="/student/internships"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 9,
            background: 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
            color: '#fff', fontSize: '0.875rem', fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 3px 12px rgba(13,202,240,0.3)',
          }}
        >
          <Search size={15} /> Browse More
        </Link>
      </div>

      {/* ── Stat pills ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        <StatPill label="Total"    value={applications.length} icon={<Briefcase   size={14} />} color="#0dcaf0" />
        <StatPill label="Pending"  value={pending}             icon={<Clock       size={14} />} color="#f59e0b" />
        <StatPill label="Accepted" value={accepted}            icon={<CheckCircle size={14} />} color="#22c55e" />
        <StatPill label="Rejected" value={rejected}            icon={<XCircle     size={14} />} color="#ef4444" />
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '6px 16px', borderRadius: 20,
              border: filter === key ? '1.5px solid #0dcaf0' : '1.5px solid rgba(13,202,240,0.2)',
              background: filter === key ? 'linear-gradient(135deg, #0dcaf0, #0aa8cc)' : '#fff',
              color: filter === key ? '#fff' : '#5a8fa3',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9bbfcc', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by position or company…"
          style={{
            width: '100%', padding: '9px 12px 9px 32px',
            borderRadius: 9, border: '1.5px solid rgba(13,202,240,0.2)',
            background: '#fff', fontSize: '0.85rem', color: '#0d1a26',
            outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')}
          onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.2)')}
        />
      </div>

      {/* ── Application cards ── */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          background: '#fff', borderRadius: 14,
          border: '1px solid rgba(13,202,240,0.12)',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(13,202,240,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#0dcaf0' }}>
            <Briefcase size={24} />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0d1a26', marginBottom: 6 }}>
            {applications.length === 0 ? 'No applications found' : 'No results for this filter'}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#9bbfcc', marginBottom: 20 }}>
            {applications.length === 0 ? "You haven't applied to any internships yet." : 'Try selecting a different filter or clearing your search.'}
          </p>
          {applications.length === 0 && (
            <Link
              to="/student/internships"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '10px 22px', borderRadius: 9,
                background: 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
                color: '#fff', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 3px 12px rgba(13,202,240,0.3)',
              }}
            >
              Browse Internships
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((app) => (
            <div
              key={app.id}
              style={{
                background: '#fff', borderRadius: 14,
                border: '1px solid rgba(13,202,240,0.12)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(13,202,240,0.05)',
              }}
            >
              {/* Summary row */}
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = 'rgba(13,202,240,0.03)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Company logo / avatar */}
                  {app.internship?.company?.logoUrl ? (
                    <img src={app.internship.company.logoUrl} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(13,202,240,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 700, color: '#0aa8cc',
                    }}>
                      {app.internship?.company?.companyName?.charAt(0) ?? '?'}
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0d1a26' }}>{app.internship?.title ?? '—'}</p>
                    <p style={{ fontSize: '0.78rem', color: '#5a8fa3', marginTop: 2 }}>
                      {app.internship?.company?.companyName}
                      {app.appliedAt ? ` · Applied ${fmt(app.appliedAt)}` : ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusBadge status={app.status} />
                  {expanded === app.id
                    ? <ChevronUp  size={16} style={{ color: '#9bbfcc' }} />
                    : <ChevronDown size={16} style={{ color: '#9bbfcc' }} />
                  }
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === app.id && (
                <div style={{ borderTop: '1px solid rgba(13,202,240,0.1)', padding: '16px 20px', background: 'rgba(232,247,251,0.5)', display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Interview */}
                  {app.interview && (
                    <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        Interview scheduled
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#6b21a8' }}>
                          <Calendar size={14} />
                          {fmt(app.interview.scheduledAt)} at {new Date(app.interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {app.interview.durationMinutes && ` · ${app.interview.durationMinutes} min`}
                        </div>
                        {app.interview.meetingLink && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                            <Video size={14} style={{ color: '#a855f7' }} />
                            <a href={app.interview.meetingLink} target="_blank" rel="noreferrer" style={{ color: '#a855f7', textDecoration: 'none' }}
                              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                              {app.interview.meetingLink}
                            </a>
                          </div>
                        )}
                        {app.interview.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#6b21a8' }}>
                            <MapPin size={14} />{app.interview.location}
                          </div>
                        )}
                        {app.interview.interviewerName && (
                          <p style={{ fontSize: '0.78rem', color: '#a855f7' }}>Interviewer: {app.interview.interviewerName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejection reason */}
                  {app.status === 'REJECTED' && app.rejectionReason && (
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Feedback</p>
                      <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>{app.rejectionReason}</p>
                    </div>
                  )}

                  {/* Docs + actions row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {app.cvUrl && (
                        <a href={app.cvUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#0aa8cc', textDecoration: 'none', fontWeight: 600 }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                          <FileText size={13} /> View CV
                        </a>
                      )}
                      {app.coverLetterUrl && (
                        <a href={app.coverLetterUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#0aa8cc', textDecoration: 'none', fontWeight: 600 }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                          <FileText size={13} /> Cover Letter
                        </a>
                      )}
                    </div>

                    {(app.status === 'APPLIED' || app.status === 'REVIEWED') && (
                      <button
                        onClick={() => setWithdrawTarget(app.id)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '6px 14px', borderRadius: 8,
                          border: '1.5px solid rgba(239,68,68,0.3)',
                          background: 'rgba(239,68,68,0.06)',
                          color: '#ef4444', fontSize: '0.8rem', fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)' }}
                      >
                        <X size={13} /> Withdraw
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Withdraw confirmation modal ── */}
      <Modal open={!!withdrawTarget} onClose={() => setWithdrawTarget(null)} title="Withdraw application" size="sm">
        <p style={{ fontSize: '0.875rem', color: '#5a8fa3', marginBottom: 20 }}>
          Are you sure you want to withdraw this application? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
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
