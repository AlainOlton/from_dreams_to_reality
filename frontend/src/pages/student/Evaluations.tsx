export default function StudentEvaluations() {
  return (
    <div>
      <div className="page-header"><h1>Evaluations</h1></div>
      <div className="card p-6 text-sm text-gray-500">Student Evaluations — implement here.</div>
    </div>
  )
}
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { evaluationApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import {
  ClipboardList, Plus, Star, ChevronDown,
  ChevronUp, CheckCircle, Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { SelfAssessment, EvaluationStage } from '@/types'

// ── Self-assessment form schema ───────────────────────────────
const scoreField = z.coerce.number().min(1).max(5).optional()

const schema = z.object({
  stage:              z.enum(['MIDTERM', 'FINAL'] as const),
  enrollmentId:       z.string().optional(),
  skillsDeveloped:    scoreField,
  goalsMet:           scoreField,
  supervisorSupport:  scoreField,
  workEnvironment:    scoreField,
  overallExperience:  scoreField,
  achievements:       z.string().max(1000).optional(),
  challenges:         z.string().max(1000).optional(),
  lessonsLearned:     z.string().max(1000).optional(),
  futureGoals:        z.string().max(1000).optional(),
})
type AssessForm = z.infer<typeof schema>

// ── Star rating component ─────────────────────────────────────
interface StarRatingProps {
  value:    number
  label:    string
  readonly?: boolean
}

function StarRating({ value, label, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={15}
            className={n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">{value}/5</span>
      </div>
    </div>
  )
}

// ── Score input ───────────────────────────────────────────────
interface ScoreInputProps {
  label:    string
  name:     string
  register: ReturnType<typeof useForm<AssessForm>>['register']
}

function ScoreInput({ label, name, register }: ScoreInputProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-sm text-gray-700">{label}</label>
      <select {...register(name as keyof AssessForm)} className="input w-24 py-1">
        <option value="">—</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n} / 5</option>
        ))}
      </select>
    </div>
  )
}

export default function StudentEvaluations() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [expanded,  setExpanded]  = useState<string | null>(null)

  const { data: selfData, isLoading } = useQuery({
    queryKey: ['self-assessments'],
    queryFn:  evaluationApi.getMySelfAssessments,
  })

  const assessments: SelfAssessment[] = selfData?.data?.data ?? []

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AssessForm>({
    resolver: zodResolver(schema),
    defaultValues: { stage: 'MIDTERM' },
  })

  const submitMutation = useMutation({
    mutationFn: (data: AssessForm) => evaluationApi.submitSelf(data),
    onSuccess: () => {
      toast.success('Self-assessment submitted!')
      setModalOpen(false)
      reset()
      qc.invalidateQueries({ queryKey: ['self-assessments'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Submission failed'),
  })

  const stageBadge = (stage: EvaluationStage) =>
    stage === 'MIDTERM' ? 'badge-blue' : 'badge-purple'

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Evaluations</h1>
          <p className="text-sm text-gray-500 mt-1">Your self-assessments and supervisor evaluations</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New self-assessment
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-brand-800">
          <strong>How evaluations work:</strong> Your site and academic supervisors submit their evaluations independently.
          You submit your own self-assessment here. All three are combined into your final internship report.
        </p>
      </div>

      {/* Self-assessments */}
      <h2 className="section-title">My self-assessments</h2>

      {assessments.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="No self-assessments yet"
          description="Submit your mid-term or final self-assessment to track your progress."
          action={
            <button onClick={() => setModalOpen(true)} className="btn-primary">
              <Plus size={15} /> Submit assessment
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {assessments.map((sa) => (
            <div key={sa.id} className="card overflow-hidden">
              {/* Header row */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === sa.id ? null : sa.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sa.submittedAt ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {sa.submittedAt ? <CheckCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {sa.stage === 'MIDTERM' ? 'Mid-term' : 'Final'} self-assessment
                    </p>
                    {sa.submittedAt && (
                      <p className="text-xs text-gray-400 mt-0.5">Submitted {fmt(sa.submittedAt)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={stageBadge(sa.stage)}>{sa.stage}</span>
                  {sa.overallExperience != null && (
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-gray-600">{sa.overallExperience}/5</span>
                    </div>
                  )}
                  {expanded === sa.id
                    ? <ChevronUp size={15} className="text-gray-400" />
                    : <ChevronDown size={15} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === sa.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-5">
                  {/* Score grid */}
                  <div className="card p-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Scores</p>
                    {sa.skillsDeveloped   != null && <StarRating label="Skills developed"    value={sa.skillsDeveloped}   readonly />}
                    {sa.goalsMet          != null && <StarRating label="Goals met"            value={sa.goalsMet}          readonly />}
                    {sa.supervisorSupport != null && <StarRating label="Supervisor support"   value={sa.supervisorSupport} readonly />}
                    {sa.workEnvironment   != null && <StarRating label="Work environment"     value={sa.workEnvironment}   readonly />}
                    {sa.overallExperience != null && <StarRating label="Overall experience"   value={sa.overallExperience} readonly />}
                  </div>

                  {/* Narrative sections */}
                  {[
                    { label: 'Achievements',     value: sa.achievements   },
                    { label: 'Challenges',       value: sa.challenges     },
                    { label: 'Lessons learned',  value: sa.lessonsLearned },
                    { label: 'Future goals',     value: sa.futureGoals    },
                  ].filter(s => s.value).map((s) => (
                    <div key={s.label}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New self-assessment modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Submit self-assessment" size="lg">
        <form onSubmit={handleSubmit((d) => submitMutation.mutate(d))} className="space-y-5">
          {/* Stage */}
          <div>
            <label className="label">Assessment stage <span className="text-red-400">*</span></label>
            <select {...register('stage')} className="input">
              <option value="MIDTERM">Mid-term</option>
              <option value="FINAL">Final</option>
            </select>
          </div>

          {/* Score sliders */}
          <div className="card p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Rate your experience (1 = poor · 5 = excellent)
            </p>
            <ScoreInput label="Skills developed"    name="skillsDeveloped"   register={register} />
            <ScoreInput label="Goals met"            name="goalsMet"          register={register} />
            <ScoreInput label="Supervisor support"   name="supervisorSupport" register={register} />
            <ScoreInput label="Work environment"     name="workEnvironment"   register={register} />
            <ScoreInput label="Overall experience"   name="overallExperience" register={register} />
          </div>

          {/* Narrative */}
          {[
            { name: 'achievements',   label: 'Achievements',    placeholder: 'What did you accomplish?' },
            { name: 'challenges',     label: 'Challenges',      placeholder: 'What difficulties did you face?' },
            { name: 'lessonsLearned', label: 'Lessons learned', placeholder: 'What did you learn from this experience?' },
            { name: 'futureGoals',    label: 'Future goals',    placeholder: 'What do you aim to do after this internship?' },
          ].map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <textarea
                {...register(f.name as keyof AssessForm)}
                rows={3}
                placeholder={f.placeholder}
                className="input resize-none"
              />
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitMutation.isPending} className="btn-primary">
              {submitMutation.isPending ? 'Submitting…' : 'Submit assessment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
