import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { reportApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { fmt }    from '@/utils/formatDate'
import { FileText, Download, RefreshCw, BarChart2, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

interface Report {
  id:          string
  type:        string
  title:       string
  fileUrl:     string | null
  generatedAt: string
}

const typeLabel: Record<string, string> = {
  LOGBOOK_SUMMARY:    'Logbook summary',
  EVALUATION_REPORT:  'Evaluation report',
}

const typeBadge: Record<string, string> = {
  LOGBOOK_SUMMARY:    'badge-blue',
  EVALUATION_REPORT:  'badge-purple',
}

export default function SupervisorReports() {
  const [logbookStudentId,   setLogbookStudentId]   = useState('')
  const [evalEnrollmentId,   setEvalEnrollmentId]   = useState('')
  const [certEnrollmentId,   setCertEnrollmentId]   = useState('')
  const [generating,         setGenerating]         = useState<string | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-reports'],
    queryFn:  reportApi.myReports,
  })
  const reports: Report[] = data?.data?.data ?? []

  const logbookMutation = useMutation({
    mutationFn: () => reportApi.generateLogbookFor(logbookStudentId),
    onMutate:   () => setGenerating('logbook'),
    onSuccess:  () => { toast.success('Logbook PDF generated'); refetch() },
    onError:    () => toast.error('Failed to generate logbook PDF'),
    onSettled:  () => setGenerating(null),
  })

  const evalMutation = useMutation({
    mutationFn: () => reportApi.generateEvaluation(evalEnrollmentId),
    onMutate:   () => setGenerating('eval'),
    onSuccess:  () => { toast.success('Evaluation PDF generated'); refetch() },
    onError:    () => toast.error('Failed to generate evaluation PDF'),
    onSettled:  () => setGenerating(null),
  })

  const certMutation = useMutation({
    mutationFn: () => reportApi.generateCertificate(certEnrollmentId),
    onMutate:   () => setGenerating('cert'),
    onSuccess:  () => { toast.success('Certificate generated'); refetch() },
    onError:    () => toast.error('Failed to generate certificate'),
    onSettled:  () => setGenerating(null),
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate PDF reports for your assigned students</p>
        </div>
      </div>

      {/* Generate section */}
      <h2 className="section-title">Generate reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Logbook */}
        <div className="card p-5 border bg-blue-50 border-blue-200">
          <div className="p-2 rounded-lg bg-white shadow-sm w-fit mb-3">
            <BookOpen size={20} className="text-blue-500" />
          </div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Logbook summary PDF</h3>
          <p className="text-xs text-gray-500 mb-3">Generate a complete logbook PDF for a student.</p>
          <input
            value={logbookStudentId}
            onChange={(e) => setLogbookStudentId(e.target.value)}
            placeholder="Student profile ID…"
            className="input text-xs mb-3"
          />
          <button
            onClick={() => { if (!logbookStudentId) { toast.error('Enter student ID'); return }; logbookMutation.mutate() }}
            disabled={generating === 'logbook'}
            className="btn-primary w-full justify-center text-xs py-1.5"
          >
            {generating === 'logbook'
              ? <><RefreshCw size={13} className="animate-spin" /> Generating…</>
              : <><FileText size={13} /> Generate</>
            }
          </button>
        </div>

        {/* Evaluation */}
        <div className="card p-5 border bg-purple-50 border-purple-200">
          <div className="p-2 rounded-lg bg-white shadow-sm w-fit mb-3">
            <BarChart2 size={20} className="text-purple-500" />
          </div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Evaluation report PDF</h3>
          <p className="text-xs text-gray-500 mb-3">Generate a full evaluation report for an enrollment.</p>
          <input
            value={evalEnrollmentId}
            onChange={(e) => setEvalEnrollmentId(e.target.value)}
            placeholder="Enrollment ID…"
            className="input text-xs mb-3"
          />
          <button
            onClick={() => { if (!evalEnrollmentId) { toast.error('Enter enrollment ID'); return }; evalMutation.mutate() }}
            disabled={generating === 'eval'}
            className="btn-primary w-full justify-center text-xs py-1.5"
          >
            {generating === 'eval'
              ? <><RefreshCw size={13} className="animate-spin" /> Generating…</>
              : <><FileText size={13} /> Generate</>
            }
          </button>
        </div>

        {/* Certificate */}
        <div className="card p-5 border bg-green-50 border-green-200">
          <div className="p-2 rounded-lg bg-white shadow-sm w-fit mb-3">
            <FileText size={20} className="text-green-500" />
          </div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Completion certificate</h3>
          <p className="text-xs text-gray-500 mb-3">Issue a signed certificate for a completed internship.</p>
          <input
            value={certEnrollmentId}
            onChange={(e) => setCertEnrollmentId(e.target.value)}
            placeholder="Enrollment ID…"
            className="input text-xs mb-3"
          />
          <button
            onClick={() => { if (!certEnrollmentId) { toast.error('Enter enrollment ID'); return }; certMutation.mutate() }}
            disabled={generating === 'cert'}
            className="btn-primary w-full justify-center text-xs py-1.5"
          >
            {generating === 'cert'
              ? <><RefreshCw size={13} className="animate-spin" /> Generating…</>
              : <><FileText size={13} /> Generate</>
            }
          </button>
        </div>
      </div>

      {/* History */}
      <h2 className="section-title">Generated reports</h2>
      {reports.length === 0 ? (
        <EmptyState icon={<FileText size={48} />} title="No reports yet" description="Use the actions above to generate your first report." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Generated</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className={typeBadge[r.type] ?? 'badge-gray'}>{typeLabel[r.type] ?? r.type}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-700 max-w-xs truncate">{r.title}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fmt(r.generatedAt)}</td>
                  <td className="px-5 py-3 text-right">
                    {r.fileUrl
                      ? <a href={r.fileUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium">
                          <Download size={13} /> Download
                        </a>
                      : <span className="text-xs text-gray-300">Unavailable</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
