import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { reportApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { fmt }    from '@/utils/formatDate'
import { FileText, Download, RefreshCw, BarChart2, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Report {
  id:          string
  type:        string
  title:       string
  fileUrl:     string | null
  generatedAt: string
}

const typeBadge: Record<string, string> = {
  LOGBOOK_SUMMARY:       'badge-blue',
  EVALUATION_REPORT:     'badge-purple',
  COMPLETION_CERTIFICATE:'badge-green',
  INSTITUTIONAL_REPORT:  'badge-yellow',
  PLACEMENT_ANALYTICS:   'badge-red',
}

const typeLabel: Record<string, string> = {
  LOGBOOK_SUMMARY:        'Logbook summary',
  EVALUATION_REPORT:      'Evaluation report',
  COMPLETION_CERTIFICATE: 'Certificate',
  INSTITUTIONAL_REPORT:   'Institutional report',
  PLACEMENT_ANALYTICS:    'Placement analytics',
}

export default function AdminReports() {
  const [generating, setGenerating] = useState<string | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['all-reports'],
    queryFn:  reportApi.myReports,
  })
  const reports: Report[] = data?.data?.data ?? []

  const institutionalMutation = useMutation({
    mutationFn: reportApi.generateInstitutional,
    onMutate:   () => setGenerating('institutional'),
    onSuccess:  () => { toast.success('Institutional report generated'); refetch() },
    onError:    () => toast.error('Generation failed'),
    onSettled:  () => setGenerating(null),
  })

  const generateCards = [
    {
      key:         'institutional',
      title:       'Institutional Excel report',
      description: '3-sheet workbook covering placement summary, student list, and all enrollment records.',
      icon:        <Building2  size={20} className="text-yellow-500" />,
      bg:          'bg-yellow-50 border-yellow-200',
      onGenerate:  () => institutionalMutation.mutate(),
    },
    {
      key:         'analytics',
      title:       'Placement analytics',
      description: 'System-wide analytics dashboard showing application rates, evaluation scores, and field breakdowns.',
      icon:        <BarChart2  size={20} className="text-red-400" />,
      bg:          'bg-red-50 border-red-200',
      onGenerate:  () => toast('View analytics on the Dashboard page.'),
    },
  ]

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download system-wide reports</p>
        </div>
      </div>

      <h2 className="section-title">Generate reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {generateCards.map((c) => (
          <div key={c.key} className={`card p-5 border ${c.bg}`}>
            <div className="p-2 rounded-lg bg-white shadow-sm w-fit mb-3">{c.icon}</div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">{c.title}</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{c.description}</p>
            <button
              onClick={c.onGenerate}
              disabled={generating === c.key}
              className="btn-primary w-full justify-center text-xs py-1.5"
            >
              {generating === c.key
                ? <><RefreshCw size={13} className="animate-spin" /> Generating…</>
                : <><FileText size={13} /> Generate</>
              }
            </button>
          </div>
        ))}
      </div>

      <h2 className="section-title">All generated reports</h2>
      {reports.length === 0 ? (
        <EmptyState icon={<FileText size={48} />} title="No reports yet" description="Use the actions above to generate the first report." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Type', 'Title', 'Generated', 'Action'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className={typeBadge[r.type] ?? 'badge-gray'}>{typeLabel[r.type] ?? r.type}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-700 max-w-sm truncate">{r.title}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fmt(r.generatedAt)}</td>
                  <td className="px-5 py-3">
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
