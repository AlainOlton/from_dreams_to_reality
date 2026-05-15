export default function StudentInternshipDetail() {
  return (
    <div>
      <div className="page-header"><h1>InternshipDetail</h1></div>
      <div className="card p-6 text-sm text-gray-500">Student InternshipDetail — implement here.</div>
    </div>
  )
}
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin, Clock, Briefcase, Globe, CheckCircle,
  Bookmark, BookmarkCheck, ArrowLeft, Building2,
  Calendar, DollarSign, Users,
} from 'lucide-react'
import { internshipApi, applicationApi } from '@/api/endpoints'
import Modal   from '@/components/common/Modal'
import Spinner from '@/components/common/Spinner'
import { fmt } from '@/utils/formatDate'
import toast   from 'react-hot-toast'
import type { Internship } from '@/types'

const schema = z.object({
  coverLetterText: z.string().min(100, 'Cover letter must be at least 100 characters'),
})
type ApplyForm = z.infer<typeof schema>

export default function InternshipDetail() {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const qc           = useQueryClient()
  const [applyOpen,  setApplyOpen]  = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [cvFile,     setCvFile]     = useState<File | null>(null)
  const [coverFile,  setCoverFile]  = useState<File | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['internship', id],
    queryFn:  () => internshipApi.getById(id!),
    enabled:  !!id,
  })

  const internship: Internship | undefined = data?.data?.data

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ApplyForm>({
    resolver: zodResolver(schema),
  })

  const bookmarkMutation = useMutation({
    mutationFn: () => internshipApi.bookmark(id!),
    onSuccess: (res: any) => {
      const isNowBookmarked: boolean = res.data?.data?.bookmarked ?? false
      setBookmarked(isNowBookmarked)
      toast.success(isNowBookmarked ? 'Bookmarked!' : 'Bookmark removed')
      qc.invalidateQueries({ queryKey: ['bookmarks'] })
    },
  })

  const applyMutation = useMutation({
    mutationFn: (formData: FormData) => applicationApi.apply(id!, formData),
    onSuccess: () => {
      toast.success('Application submitted!')
      setApplyOpen(false)
      reset()
      setCvFile(null)
      setCoverFile(null)
      qc.invalidateQueries({ queryKey: ['my-applications'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Application failed')
    },
  })

  const onSubmit = (data: ApplyForm) => {
    const fd = new FormData()
    fd.append('coverLetterText', data.coverLetterText)
    if (cvFile)    fd.append('cv',          cvFile)
    if (coverFile) fd.append('coverLetter', coverFile)
    applyMutation.mutate(fd)
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  if (!internship) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Internship not found.</p>
      <button className="btn-secondary mt-4" onClick={() => navigate(-1)}>Go back</button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to listings
      </button>

      {/* Header */}
      <div className="card p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {internship.company.logoUrl
              ? <img src={internship.company.logoUrl} alt={internship.company.companyName} className="h-16 w-16 rounded-xl object-cover border border-gray-100" />
              : <div className="h-16 w-16 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold">{internship.company.companyName.charAt(0)}</div>
            }
            <div>
              <p className="text-sm text-gray-400 mb-0.5">{internship.company.companyName}</p>
              <h1 className="text-xl font-bold text-gray-900">{internship.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={internship.isPaid   ? 'badge-green'  : 'badge-gray'}>{internship.isPaid   ? 'Paid'   : 'Unpaid'}</span>
                <span className={internship.isRemote ? 'badge-blue'   : 'badge-gray'}>{internship.isRemote ? 'Remote' : 'On-site'}</span>
                <span className="badge-purple">{internship.type}</span>
                {internship.company.isVerified && <span className="badge-green flex items-center gap-1"><CheckCircle size={10} /> Verified</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => bookmarkMutation.mutate()} className="p-2 rounded-lg border border-gray-200 hover:border-brand-300 text-gray-400 hover:text-brand-500 transition-colors">
              {bookmarked ? <BookmarkCheck size={18} className="text-brand-500" /> : <Bookmark size={18} />}
            </button>
            <button onClick={() => setApplyOpen(true)} className="btn-primary">Apply now</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="text-base font-semibold mb-3">About this internship</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{internship.description}</p>
          </div>

          {internship.responsibilities.length > 0 && (
            <div className="card p-6">
              <h2 className="text-base font-semibold mb-3">Responsibilities</h2>
              <ul className="space-y-2">
                {internship.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {internship.requirements.length > 0 && (
            <div className="card p-6">
              <h2 className="text-base font-semibold mb-3">Requirements</h2>
              <ul className="space-y-2">
                {internship.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {internship.skills.length > 0 && (
            <div className="card p-6">
              <h2 className="text-base font-semibold mb-3">Skills wanted</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((s, i) => <span key={i} className="badge-blue">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Right — meta */}
        <div className="space-y-5">
          <div className="card p-5 space-y-3">
            <h2 className="text-base font-semibold">Details</h2>
            {internship.city && <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin size={15} className="text-gray-400" />{internship.city}{internship.country ? `, ${internship.country}` : ''}</div>}
            {internship.durationWeeks && <div className="flex items-center gap-3 text-sm text-gray-600"><Clock size={15} className="text-gray-400" />{internship.durationWeeks} weeks</div>}
            {internship.stipendAmount && <div className="flex items-center gap-3 text-sm text-gray-600"><DollarSign size={15} className="text-gray-400" />{internship.stipendAmount} {internship.currency ?? 'USD'} / month</div>}
            {internship.slots && <div className="flex items-center gap-3 text-sm text-gray-600"><Users size={15} className="text-gray-400" />{internship.slots} slot{internship.slots !== 1 ? 's' : ''} available</div>}
            {internship.startDate && <div className="flex items-center gap-3 text-sm text-gray-600"><Calendar size={15} className="text-gray-400" />Starts {fmt(internship.startDate)}</div>}
            {internship.applicationDeadline && <div className="flex items-center gap-3 text-sm text-red-500"><Calendar size={15} />Deadline: {fmt(internship.applicationDeadline)}</div>}
            {internship._count && <div className="flex items-center gap-3 text-sm text-gray-600"><Briefcase size={15} className="text-gray-400" />{internship._count.applications} applicants</div>}
          </div>

          <div className="card p-5 space-y-3">
            <h2 className="text-base font-semibold">About the company</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Building2 size={14} className="text-gray-400" />{internship.company.companyName}</div>
            {internship.company.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">{internship.company.description}</p>}
            {internship.company.website && (
              <a href={internship.company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-brand-600 hover:underline">
                <Globe size={12} /> Visit website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Apply modal */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for this internship" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Cover letter <span className="text-red-400">*</span></label>
            <textarea {...register('coverLetterText')} rows={8} placeholder="Introduce yourself and explain why you are a great fit…" className="input resize-none" />
            {errors.coverLetterText && <p className="form-error">{errors.coverLetterText.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">CV (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                className="input text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-50 file:text-brand-700" />
            </div>
            <div>
              <label className="label">Cover letter PDF (optional)</label>
              <input type="file" accept=".pdf" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="input text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-50 file:text-brand-700" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setApplyOpen(false)}>Cancel</button>
            <button type="submit" disabled={applyMutation.isPending} className="btn-primary">
              {applyMutation.isPending ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
