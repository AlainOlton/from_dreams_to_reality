import { useQuery } from '@tanstack/react-query'
import { Briefcase, FileText, BookOpen, ClipboardList, Clock, CheckCircle } from 'lucide-react'
import { applicationApi, logbookApi, evaluationApi } from '@/api/endpoints'
import Spinner from '@/components/common/Spinner'
import { fmt }  from '@/utils/formatDate'
import { getStatusBadgeClass, getStatusLabel } from '@/utils/roleHelpers'
import { useAuth } from '@/context/AuthContext'

// ── Mini stat card ────────────────────────────────────────────
function DashCard({
  label, value, icon, accent,
}: { label: string; value: string | number; icon: React.ReactNode; accent: string }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: '20px 22px',
      border: '1px solid rgba(13,202,240,0.15)',
      boxShadow: '0 2px 12px rgba(13,202,240,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5a8fa3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: accent + '1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent,
        }}>
          {icon}
        </div>
      </div>
      <p style={{ fontSize: '1.9rem', fontWeight: 700, color: '#0d1a26', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}

// ── Section card wrapper ──────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: '20px 22px',
      border: '1px solid rgba(13,202,240,0.12)',
      boxShadow: '0 2px 12px rgba(13,202,240,0.05)',
    }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d1a26', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const name = user?.studentProfile?.firstName ?? 'Student'

  const { data: appsData,   isLoading: l1 } = useQuery({ queryKey: ['my-applications'],  queryFn: applicationApi.getMyApps })
  const { data: logData,    isLoading: l2 } = useQuery({ queryKey: ['my-logbook'],        queryFn: () => logbookApi.getMyEntries() })
  const { data: selfData,   isLoading: l3 } = useQuery({ queryKey: ['self-assessments'],  queryFn: evaluationApi.getMySelfAssessments })
  const { data: attendData, isLoading: l4 } = useQuery({ queryKey: ['my-attendance'],     queryFn: logbookApi.getAttendance })

  const apps        = appsData?.data?.data         ?? []
  const entries     = logData?.data?.data?.data     ?? []
  const hoursLogged = attendData?.data?.data?.totalHoursLogged ?? 0
  const assessments = selfData?.data?.data?.length  ?? 0

  if (l1 || l2 || l3 || l4) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#0d1a26', marginBottom: 4 }}>
          Welcome back, {name} 👋
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#5a8fa3' }}>Here is your internship overview</p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 24 }}>
        <DashCard label="Applications"    value={apps.length}      icon={<Briefcase    size={17} />} accent="#0dcaf0" />
        <DashCard label="Logbook Entries" value={entries.length}   icon={<BookOpen     size={17} />} accent="#22c55e" />
        <DashCard label="Hours Logged"    value={`${hoursLogged}h`} icon={<Clock       size={17} />} accent="#a855f7" />
        <DashCard label="Assessments"     value={assessments}       icon={<ClipboardList size={17}/>} accent="#f59e0b" />
      </div>

      {/* ── Recent applications ── */}
      <Section title="Recent applications">
        {apps.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#9bbfcc' }}>No applications yet.</p>
        ) : (
          <div>
            {apps.slice(0, 5).map((app: any, i: number) => (
              <div
                key={app.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < Math.min(apps.length, 5) - 1 ? '1px solid rgba(13,202,240,0.08)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(13,202,240,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={16} style={{ color: '#0dcaf0' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0d1a26' }}>{app.internship?.title ?? '—'}</p>
                    <p style={{ fontSize: '0.75rem', color: '#5a8fa3', marginTop: 1 }}>
                      {app.internship?.company?.companyName ?? ''}{app.appliedAt ? ` · ${fmt(app.appliedAt)}` : ''}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadgeClass(app.status)} style={{ flexShrink: 0 }}>
                  {getStatusLabel(app.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Recent logbook entries ── */}
      <div style={{ marginTop: 16 }}>
        <Section title="Recent logbook entries">
          {entries.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#9bbfcc' }}>No logbook entries yet.</p>
          ) : (
            <div>
              {entries.slice(0, 4).map((entry: any, i: number) => (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: i < Math.min(entries.length, 4) - 1 ? '1px solid rgba(13,202,240,0.08)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: entry.isApproved ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {entry.isApproved
                        ? <CheckCircle size={16} style={{ color: '#22c55e' }} />
                        : <FileText    size={16} style={{ color: '#f59e0b' }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0d1a26' }}>
                        {fmt(entry.entryDate)}{entry.weekNumber ? ` · Week ${entry.weekNumber}` : ''}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#5a8fa3', marginTop: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 320 }}>
                        {entry.activitiesDone}
                      </p>
                    </div>
                  </div>
                  <span className={entry.isApproved ? 'badge-green' : 'badge-yellow'} style={{ flexShrink: 0 }}>
                    {entry.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}
