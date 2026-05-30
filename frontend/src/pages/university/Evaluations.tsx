import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { universityApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { fmt }    from '@/utils/formatDate'
import {
  ClipboardList, Star, ChevronDown, ChevronUp,
  CheckCircle, Clock, Search,
} from 'lucide-react'
import type { EvaluationStage } from '@/types'

export default function UniversityEvaluations() {
  const [search,      setSearch]      = useState('')
  const [stageFilter, setStageFilter] = useState<EvaluationStage | ''>('')
  const [expanded,    setExpanded]    = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['university-evaluations'],
    queryFn:  universityApi.getEvaluations,
  })

  const evaluations: any[] = data?.data?.data ?? []

  const filtered = evaluations.filter((ev) => {
    const evaluatorName = `${ev.evaluator?.firstName ?? ''} ${ev.evaluator?.lastName ?? ''}`.toLowerCase()
    const matchSearch = !search || evaluatorName.includes(search.toLowerCase())
    const matchStage  = !stageFilter || ev.stage === stageFilter
    return matchSearch && matchStage
  })

  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((sum, ev) => sum + (ev.overallScore ?? 0), 0) / evaluations.filter(e => e.overallScore != null).length).toFixed(2)
    : null

  const scoreFields = [
    { key: 'punctuality',    label: 'Punctuality'    },
    { key: 'communication',  label: 'Communication'  },
    { key: 'technicalSkills',label: 'Technical'      },
    { key: 'teamwork',       label: 'Teamwork'       },
    { key: 'initiative',     label: 'Initiative'     },
    { key: 'professionalism',label: 'Professionalism'},
  ]

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Evaluations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {evaluations.length} evaluation{evaluations.length !== 1 ? 's' : ''} submitted for your students
            {avgScore ? ` · avg score ${avgScore}/5` : ''}
          </p>
        </div>
      </div>

      {/* Summary score cards */}
      {evaluations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {scoreFields.map(({ key, label }) => {
            const vals = evaluations.map((e) => e[key]).filter((v) => v != null)
            const avg  = vals.length > 0 ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : '—'
            return (
              <div key={key} className="card p-4 text-center">
                <p className="text-2xl font-bold text-brand-600">{avg}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
                <p className="text-[10px] text-gray-400">avg / 5</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by evaluator name…"
            className="input pl-9"
          />
        </div>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as EvaluationStage | '')} className="input w-40">
          <option value="">All stages</option>
          <option value="MIDTERM">Mid-term</option>
          <option value="FINAL">Final</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="No evaluations yet"
          description="Evaluations submitted by supervisors for your students will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((ev) => (
            <div key={ev.id} className="card overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ev.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {ev.status === 'APPROVED' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {ev.stage === 'MIDTERM' ? 'Mid-term' : 'Final'} evaluation
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      By {ev.evaluator?.firstName} {ev.evaluator?.lastName}
                      {ev.evaluator?.title ? ` (${ev.evaluator.title})` : ''}
                      {ev.submittedAt ? ` · ${fmt(ev.submittedAt)}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={ev.stage === 'MIDTERM' ? 'badge-blue' : 'badge-purple'}>{ev.stage}</span>
                  {ev.overallScore != null && (
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-gray-600">{ev.overallScore}/5</span>
                    </div>
                  )}
                  {expanded === ev.id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                </div>
              </div>

              {expanded === ev.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                  {/* Scores */}
                  <div className="card p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Scores</p>
                    {scoreFields.map(({ key, label }) => {
                      const val = ev[key]
                      if (val == null) return null
                      return (
                        <div key={key} className="flex items-center justify-between py-1">
                          <span className="text-sm text-gray-600">{label}</span>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map((n) => (
                              <Star key={n} size={14}
                                className={n <= val ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'} />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">{val}/5</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Narrative */}
                  {[
                    { label: 'Strengths',             value: ev.strengths },
                    { label: 'Areas for improvement', value: ev.areasForImprovement },
                    { label: 'General comments',      value: ev.generalComments },
                  ].filter((s) => s.value).map((s) => (
                    <div key={s.label}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{s.value}</p>
                    </div>
                  ))}

                  {ev.recommendForHire != null && (
                    <p className="text-sm text-gray-700">
                      <strong>Recommend for hire:</strong>{' '}
                      <span className={ev.recommendForHire ? 'text-green-600' : 'text-red-500'}>
                        {ev.recommendForHire ? 'Yes' : 'No'}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
