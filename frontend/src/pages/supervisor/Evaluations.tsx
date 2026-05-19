import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import { evaluationApi, enrollmentApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { ClipboardList, Plus, Star, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Evaluation } from '@/types'

// ── Zod schema ────────────────────────────────────────────────
const score = z.preprocess((v) => v === '' || v == null ? undefined : Number(v), z.number().min(1).max(5).optional())
const schema = z.object({
  enrollmentId:         z.string().min(1, 'Enrollment ID is required'),
  stage:                z.enum(['MIDTERM', 'FINAL'] as const),
  punctuality:          score,
  communication:        score,
  technicalSkills:      score,
  teamwork:             score,
  initiative:           score,
  professionalism:      score,
  strengths:            z.string().max(1000).optional(),
  areasForImprovement:  z.string().max(1000).optional(),
  generalComments:      z.string().max(2000).optional(),
  recommendForHire:     z.boolean().optional(),
})
type EvalForm = z.infer<typeof schema>

// ── Star rating input ─────────────────────────────────────────
function StarInput({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            size={20}
            className={n <= (hover || value || 0)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200 fill-gray-100'
            }
          />
        </button>
      ))}
      {value != null && <span className="text-xs text-gray-400 ml-1">{value}/5</span>}
    </div>
  )
}

export default function SupervisorEvaluations() {
  const [searchParams] = useSearchParams()
  const qc = useQueryClient()
  const preEnrollment = searchParams.get('enrollmentId') ?? ''

  const [enrollmentId, setEnrollmentId] = useState(preEnrollment)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [expanded,     setExpanded]     = useState<string | null>(null)

  // Load supervisor's assigned enrollments for the dropdown
  const { data: enrollmentsData } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn:  enrollmentApi.getMine,
  })
  const enrollments: any[] = enrollmentsData?.data?.data ?? []

  const { data, isLoading } = useQuery({
    queryKey: ['evaluations', enrollmentId],
    queryFn:  () => evaluationApi.getForEnrollment(enrollmentId),
    enabled:  !!enrollmentId,
  })

  const evaluations: Evaluation[] = data?.data?.data ?? []

  const { register, handleSubmit, control, reset,
    formState: { errors } } = useForm<EvalForm>({
    resolver: zodResolver(schema) as Resolver<EvalForm>,
    defaultValues: {
      enrollmentId: preEnrollment,
      stage: 'MIDTERM',
    },
  })

  const submitMutation = useMutation({
    mutationFn: (d: EvalForm) => evaluationApi.submit(d),
    onSuccess: () => {
      toast.success('Evaluation submitted!')
      setModalOpen(false)
      reset()
      qc.invalidateQueries({ queryKey: ['evaluations', enrollmentId] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Submission failed'),
  })

  const scoreFields: { name: keyof EvalForm; label: string }[] = [
    { name: 'punctuality',    label: 'Punctuality & reliability' },
    { name: 'communication',  label: 'Communication skills' },
    { name: 'technicalSkills',label: 'Technical skills' },
    { name: 'teamwork',       label: 'Teamwork & collaboration' },
    { name: 'initiative',     label: 'Initiative & proactivity' },
    { name: 'professionalism',label: 'Professionalism' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Evaluations</h1>
          <p className="text-sm text-gray-500 mt-1">Submit and review intern evaluations</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New evaluation
        </button>
      </div>

      {/* Enrollment selector */}
      <div className="card p-4 mb-5 flex items-center gap-4">
        <div className="flex-1">
          <label className="label">Select student enrollment</label>
          {enrollments.length > 0 ? (
            <select
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              className="input"
            >
              <option value="">— choose a student —</option>
              {enrollments.map((en: any) => (
                <option key={en.id} value={en.id}>
                  {en.student.firstName} {en.student.lastName}
                  {en.internship ? ` · ${en.internship.title}` : ''}
                  {en.student.studentId ? ` (${en.student.studentId})` : ''}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              placeholder="Paste enrollment ID…"
              className="input"
            />
          )}
        </div>
      </div>

      {!enrollmentId ? (
        <EmptyState icon={<ClipboardList size={48} />} title="Select a student" description="Choose a student from the dropdown above to view or submit evaluations." />
      ) : isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : evaluations.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="No evaluations yet"
          description="Submit the first evaluation for this enrollment."
          action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={15} /> Submit evaluation</button>}
        />
      ) : (
        <div className="space-y-3">
          {evaluations.map((ev) => (
            <div key={ev.id} className="card overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ev.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {ev.status === 'APPROVED' ? <CheckCircle size={16} /> : <ClipboardList size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {ev.stage === 'MIDTERM' ? 'Mid-term' : 'Final'} evaluation
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      By {ev.evaluator.firstName} {ev.evaluator.lastName}
                      {ev.submittedAt ? ` · ${fmt(ev.submittedAt)}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={ev.stage === 'MIDTERM' ? 'badge-blue' : 'badge-purple'}>{ev.stage}</span>
                  {ev.overallScore != null && (
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">{ev.overallScore}/5</span>
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
                    {scoreFields.map(({ name, label }) => {
                      const val = ev[name as keyof Evaluation] as number | undefined
                      if (val == null) return null
                      return (
                        <div key={name} className="flex items-center justify-between py-1">
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
                    { label: 'Strengths',              value: ev.strengths },
                    { label: 'Areas for improvement',  value: ev.areasForImprovement },
                    { label: 'General comments',       value: ev.generalComments },
                  ].filter(s => s.value).map((s) => (
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

      {/* Submit evaluation modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Submit evaluation" size="xl">
        <form onSubmit={handleSubmit((d) => submitMutation.mutate(d))} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Student enrollment <span className="text-red-400">*</span></label>
              {enrollments.length > 0 ? (
                <select {...register('enrollmentId')} className="input">
                  <option value="">— choose a student —</option>
                  {enrollments.map((en: any) => (
                    <option key={en.id} value={en.id}>
                      {en.student.firstName} {en.student.lastName}
                      {en.internship ? ` · ${en.internship.title}` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...register('enrollmentId')} className="input" placeholder="Enrollment UUID…" />
              )}
              {errors.enrollmentId && <p className="form-error">{errors.enrollmentId.message}</p>}
            </div>
            <div>
              <label className="label">Stage <span className="text-red-400">*</span></label>
              <select {...register('stage')} className="input">
                <option value="MIDTERM">Mid-term</option>
                <option value="FINAL">Final</option>
              </select>
            </div>
          </div>

          {/* Score inputs */}
          <div className="card p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Scores (1 = poor · 5 = excellent)
            </p>
            {scoreFields.map(({ name, label }) => (
              <div key={name} className="flex items-center justify-between py-1">
                <label className="text-sm text-gray-700">{label}</label>
                <Controller
                  name={name as keyof EvalForm}
                  control={control}
                  render={({ field }) => (
                    <StarInput
                      value={field.value as number | undefined}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            ))}
          </div>

          {/* Narrative */}
          {[
            { name: 'strengths',            label: 'Strengths',              placeholder: 'What did this intern do well?' },
            { name: 'areasForImprovement',  label: 'Areas for improvement',  placeholder: 'What could be improved?' },
            { name: 'generalComments',      label: 'General comments',       placeholder: 'Any other feedback…' },
          ].map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <textarea {...register(f.name as keyof EvalForm)} rows={3} placeholder={f.placeholder} className="input resize-none" />
            </div>
          ))}

          <div className="flex items-center gap-3">
            <input {...register('recommendForHire')} type="checkbox" id="recommend" className="h-4 w-4 accent-brand-500" />
            <label htmlFor="recommend" className="text-sm text-gray-700">Recommend this intern for full-time hire</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitMutation.isPending} className="btn-primary">
              {submitMutation.isPending ? 'Submitting…' : 'Submit evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
