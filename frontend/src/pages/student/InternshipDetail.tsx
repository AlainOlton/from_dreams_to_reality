import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin, Clock, Briefcase, Globe, CheckCircle,
  Bookmark, BookmarkCheck, ArrowLeft, Building2,
  Calendar, DollarSign, Users, Upload, User,
  ChevronRight, ChevronLeft as ChevLeft,
} from 'lucide-react'
import { internshipApi, applicationApi } from '@/api/endpoints'
import Modal   from '@/components/common/Modal'
import Spinner from '@/components/common/Spinner'
import { fmt } from '@/utils/formatDate'
import toast   from 'react-hot-toast'
import type { Internship } from '@/types'

// ── Application form schema ───────────────────────────────────
const schema = z.object({
  // Step 1 — personal profile
  gender:          z.enum(['Male', 'Female'], { required_error: 'Please select your gender' }),
  nationality:     z.string().min(2, 'Nationality is required'),
  phoneNumber:     z.string().min(7, 'Phone number is required'),
  currentLevel:    z.enum(['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Graduate', 'Post-graduate'], { required_error: 'Required' }),
  availability:    z.enum(['Immediately', 'In 2 weeks', 'In 1 month', 'Flexible'], { required_error: 'Required' }),
  hasLaptop:       z.enum(['Yes', 'No'], { required_error: 'Required' }),
  hasInternet:     z.enum(['Yes', 'No'], { required_error: 'Required' }),
  // Step 2 — motivation (short, focused)
  whyInterested:   z.string().min(30, 'Please write at least 30 characters').max(500),
  relevantExp:     z.enum(['None', 'Less than 6 months', '6–12 months', 'More than 1 year'], { required_error: 'Required' }),
  canStartDate:    z.string().min(1, 'Required'),
  // Step 3 — documents (CV required)
  // handled as File state, validated separately
})
type ApplyForm = z.infer<typeof schema>

// ── Reusable styled components ────────────────────────────────
const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 9,
  border: '1.5px solid rgba(13,202,240,0.25)',
  background: '#f4fbfd', fontSize: '0.875rem', color: '#0d1a26',
  outline: 'none', fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: '#2d4a5a', marginBottom: 5,
}
const errStyle: React.CSSProperties = { fontSize: '0.73rem', color: '#ef4444', marginTop: 3 }

// Radio group for quick-pick options
function RadioGroup({ name, options, value, onChange, error }: {
  name: string; options: string[]; value: string; onChange: (v: string) => void; error?: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => (
          <button
            key={opt} type="button"
            onClick={() => onChange(opt)}
            style={{
              padding: '7px 16px', borderRadius: 20,
              border: `1.5px solid ${value === opt ? '#0dcaf0' : 'rgba(13,202,240,0.2)'}`,
              background: value === opt ? 'linear-gradient(135deg,#0dcaf0,#0aa8cc)' : '#fff',
              color: value === opt ? '#fff' : '#5a8fa3',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p style={errStyle}>{error}</p>}
    </div>
  )
}

const STEPS = ['Profile', 'Motivation', 'Documents']

export default function InternshipDetail() {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const qc           = useQueryClient()
  const [applyOpen,  setApplyOpen]  = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [step,       setStep]       = useState(0)
  const [cvFile,     setCvFile]     = useState<File | null>(null)
  const [coverFile,  setCoverFile]  = useState<File | null>(null)
  const [cvError,    setCvError]    = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['internship', id],
    queryFn:  () => internshipApi.getById(id!),
    enabled:  !!id,
  })

  const internship: Internship | undefined = data?.data?.data

  const { register, handleSubmit, control, trigger, formState: { errors } } = useForm<ApplyForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: undefined, nationality: '', phoneNumber: '',
      currentLevel: undefined, availability: undefined,
      hasLaptop: undefined, hasInternet: undefined,
      whyInterested: '', relevantExp: undefined, canStartDate: '',
    },
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
      toast.success('Application submitted successfully!')
      setApplyOpen(false)
      setStep(0)
      setCvFile(null)
      setCoverFile(null)
      qc.invalidateQueries({ queryKey: ['my-applications'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Application failed'),
  })

  const step1Fields = ['gender','nationality','phoneNumber','currentLevel','availability','hasLaptop','hasInternet'] as const
  const step2Fields = ['whyInterested','relevantExp','canStartDate'] as const

  const handleNext = async () => {
    const fields = step === 0 ? step1Fields : step2Fields
    const valid  = await trigger(fields as any)
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = (data: ApplyForm) => {
    if (!cvFile) { setCvError('Please upload your CV (PDF)'); return }
    setCvError('')
    const fd = new FormData()
    // Profile questions packed into coverLetterText as structured JSON
    // (backend stores it as-is; companies see it formatted)
    const summary = `Gender: ${data.gender} | Nationality: ${data.nationality} | Phone: ${data.phoneNumber} | Level: ${data.currentLevel} | Availability: ${data.availability} | Has laptop: ${data.hasLaptop} | Has internet: ${data.hasInternet} | Relevant experience: ${data.relevantExp} | Can start: ${data.canStartDate}`
    fd.append('coverLetterText', summary)
    fd.append('additionalDocText', data.whyInterested)
    fd.append('cv', cvFile)
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
                <span className={internship.isPaid   ? 'badge-green' : 'badge-gray'}>{internship.isPaid   ? 'Paid'   : 'Unpaid'}</span>
                <span className={internship.isRemote ? 'badge-blue'  : 'badge-gray'}>{internship.isRemote ? 'Remote' : 'On-site'}</span>
                <span className="badge-purple">{internship.type}</span>
                {internship.company.isVerified && <span className="badge-green flex items-center gap-1"><CheckCircle size={10} /> Verified</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => bookmarkMutation.mutate()} className="p-2 rounded-lg border border-gray-200 hover:border-brand-300 text-gray-400 hover:text-brand-500 transition-colors">
              {bookmarked ? <BookmarkCheck size={18} className="text-brand-500" /> : <Bookmark size={18} />}
            </button>
            <button onClick={() => { setApplyOpen(true); setStep(0) }} className="btn-primary">Apply now</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
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

        {/* Right */}
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

      {/* ── Apply modal ── */}
      <Modal open={applyOpen} onClose={() => { setApplyOpen(false); setStep(0) }} title={`Apply — ${internship.title}`} size="lg">
        <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

          {/* Step progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i < step ? 'linear-gradient(135deg,#0dcaf0,#0aa8cc)' : i === step ? 'linear-gradient(135deg,#0dcaf0,#0aa8cc)' : '#e0eff4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i <= step ? '#fff' : '#9bbfcc', fontSize: '0.8rem', fontWeight: 700,
                    border: i === step ? '3px solid rgba(13,202,240,0.3)' : 'none',
                    boxSizing: 'border-box',
                  }}>
                    {i < step ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: i <= step ? '#0aa8cc' : '#9bbfcc', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? '#0dcaf0' : '#e0eff4', margin: '0 6px', marginBottom: 18 }} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* ── Step 0: Personal profile ── */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{ fontSize: '0.82rem', color: '#5a8fa3', marginBottom: 4 }}>
                  Quick profile questions — helps the company understand you better.
                </p>

                {/* Gender */}
                <div>
                  <label style={labelStyle}><User size={13} style={{ display: 'inline', marginRight: 4 }} />Gender <span style={{ color: '#ef4444' }}>*</span></label>
                  <Controller name="gender" control={control} render={({ field }) => (
                    <RadioGroup name="gender" options={['Male', 'Female']} value={field.value ?? ''} onChange={field.onChange} error={errors.gender?.message} />
                  )} />
                </div>

                {/* Nationality + Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Nationality <span style={{ color: '#ef4444' }}>*</span></label>
                    <input {...register('nationality')} placeholder="e.g. Rwandan" style={fieldStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} />
                    {errors.nationality && <p style={errStyle}>{errors.nationality.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone number <span style={{ color: '#ef4444' }}>*</span></label>
                    <input {...register('phoneNumber')} placeholder="+250 7XX XXX XXX" style={fieldStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} />
                    {errors.phoneNumber && <p style={errStyle}>{errors.phoneNumber.message}</p>}
                  </div>
                </div>

                {/* Current level */}
                <div>
                  <label style={labelStyle}>Current academic level <span style={{ color: '#ef4444' }}>*</span></label>
                  <Controller name="currentLevel" control={control} render={({ field }) => (
                    <RadioGroup name="currentLevel" options={['Year 1','Year 2','Year 3','Year 4','Year 5','Graduate','Post-graduate']} value={field.value ?? ''} onChange={field.onChange} error={errors.currentLevel?.message} />
                  )} />
                </div>

                {/* Availability */}
                <div>
                  <label style={labelStyle}>When can you start? <span style={{ color: '#ef4444' }}>*</span></label>
                  <Controller name="availability" control={control} render={({ field }) => (
                    <RadioGroup name="availability" options={['Immediately','In 2 weeks','In 1 month','Flexible']} value={field.value ?? ''} onChange={field.onChange} error={errors.availability?.message} />
                  )} />
                </div>

                {/* Has laptop + internet */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Do you have a laptop? <span style={{ color: '#ef4444' }}>*</span></label>
                    <Controller name="hasLaptop" control={control} render={({ field }) => (
                      <RadioGroup name="hasLaptop" options={['Yes','No']} value={field.value ?? ''} onChange={field.onChange} error={errors.hasLaptop?.message} />
                    )} />
                  </div>
                  <div>
                    <label style={labelStyle}>Reliable internet access? <span style={{ color: '#ef4444' }}>*</span></label>
                    <Controller name="hasInternet" control={control} render={({ field }) => (
                      <RadioGroup name="hasInternet" options={['Yes','No']} value={field.value ?? ''} onChange={field.onChange} error={errors.hasInternet?.message} />
                    )} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1: Motivation ── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{ fontSize: '0.82rem', color: '#5a8fa3', marginBottom: 4 }}>
                  A few short questions about your motivation and experience.
                </p>

                {/* Why interested */}
                <div>
                  <label style={labelStyle}>Why are you interested in this internship? <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea {...register('whyInterested')} rows={4} placeholder="In 30–500 characters, tell us why this role excites you…"
                    style={{ ...fieldStyle, resize: 'none' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} />
                  {errors.whyInterested && <p style={errStyle}>{errors.whyInterested.message}</p>}
                </div>

                {/* Relevant experience */}
                <div>
                  <label style={labelStyle}>Relevant work / internship experience <span style={{ color: '#ef4444' }}>*</span></label>
                  <Controller name="relevantExp" control={control} render={({ field }) => (
                    <RadioGroup name="relevantExp" options={['None','Less than 6 months','6–12 months','More than 1 year']} value={field.value ?? ''} onChange={field.onChange} error={errors.relevantExp?.message} />
                  )} />
                </div>

                {/* Earliest start date */}
                <div>
                  <label style={labelStyle}>Earliest possible start date <span style={{ color: '#ef4444' }}>*</span></label>
                  <input {...register('canStartDate')} type="date" style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} />
                  {errors.canStartDate && <p style={errStyle}>{errors.canStartDate.message}</p>}
                </div>
              </div>
            )}

            {/* ── Step 2: Documents ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{ fontSize: '0.82rem', color: '#5a8fa3', marginBottom: 4 }}>
                  Upload your documents. CV is required.
                </p>

                {/* CV upload */}
                <div>
                  <label style={labelStyle}>CV / Resume <span style={{ color: '#ef4444' }}>*</span> <span style={{ fontSize: '0.72rem', color: '#9bbfcc', fontWeight: 400 }}>(PDF, max 10MB)</span></label>
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '24px 16px', borderRadius: 10, cursor: 'pointer',
                    border: cvFile ? '2px solid #0dcaf0' : cvError ? '2px solid #ef4444' : '2px dashed rgba(13,202,240,0.3)',
                    background: cvFile ? 'rgba(13,202,240,0.04)' : '#f4fbfd',
                    transition: 'all 0.15s',
                  }}>
                    <Upload size={24} style={{ color: cvFile ? '#0dcaf0' : '#9bbfcc' }} />
                    <span style={{ fontSize: '0.85rem', color: cvFile ? '#0aa8cc' : '#5a8fa3', fontWeight: cvFile ? 600 : 400 }}>
                      {cvFile ? cvFile.name : 'Click to upload your CV'}
                    </span>
                    <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => { setCvFile(e.target.files?.[0] ?? null); setCvError('') }} />
                  </label>
                  {cvError && <p style={errStyle}>{cvError}</p>}
                </div>

                {/* Cover letter PDF */}
                <div>
                  <label style={labelStyle}>Cover letter PDF <span style={{ fontSize: '0.72rem', color: '#9bbfcc', fontWeight: 400 }}>(optional)</span></label>
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '20px 16px', borderRadius: 10, cursor: 'pointer',
                    border: coverFile ? '2px solid #0dcaf0' : '2px dashed rgba(13,202,240,0.2)',
                    background: coverFile ? 'rgba(13,202,240,0.04)' : '#f4fbfd',
                  }}>
                    <Upload size={20} style={{ color: coverFile ? '#0dcaf0' : '#9bbfcc' }} />
                    <span style={{ fontSize: '0.82rem', color: coverFile ? '#0aa8cc' : '#9bbfcc', fontWeight: coverFile ? 600 : 400 }}>
                      {coverFile ? coverFile.name : 'Upload cover letter (optional)'}
                    </span>
                    <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>

                {/* Summary of answers */}
                <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(13,202,240,0.05)', border: '1px solid rgba(13,202,240,0.15)', fontSize: '0.78rem', color: '#5a8fa3', lineHeight: 1.8 }}>
                  <p style={{ fontWeight: 700, color: '#0d1a26', marginBottom: 6 }}>Your application summary</p>
                  <p>CV: <strong style={{ color: cvFile ? '#0aa8cc' : '#ef4444' }}>{cvFile ? cvFile.name : 'Not uploaded'}</strong></p>
                  <p>Cover letter: <strong>{coverFile ? coverFile.name : 'Not provided'}</strong></p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(13,202,240,0.1)' }}>
              {step > 0 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9, border: '1.5px solid rgba(13,202,240,0.25)', background: '#fff', color: '#5a8fa3', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <ChevLeft size={15} /> Back
                </button>
              ) : (
                <button type="button" onClick={() => setApplyOpen(false)}
                  style={{ padding: '9px 18px', borderRadius: 9, border: '1.5px solid #d0e8f0', background: '#fff', color: '#5a8fa3', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              )}

              {step < 2 ? (
                <button type="button" onClick={handleNext}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 22px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#0dcaf0,#0aa8cc)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(13,202,240,0.3)' }}>
                  Next <ChevronRight size={15} />
                </button>
              ) : (
                <button type="submit" disabled={applyMutation.isPending}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 22px', borderRadius: 9, border: 'none', background: applyMutation.isPending ? '#7dddf5' : 'linear-gradient(135deg,#0dcaf0,#0aa8cc)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: applyMutation.isPending ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(13,202,240,0.3)' }}>
                  {applyMutation.isPending ? 'Submitting…' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

