import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { internshipApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { Briefcase, Plus, Pencil, Trash2, Users, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Internship, InternshipStatus } from '@/types'

const schema = z.object({
  title:               z.string().min(3,  'Title required'),
  description:         z.string().min(50, 'At least 50 characters'),
  type:                z.enum(['ACADEMIC', 'PROFESSIONAL'] as const),
  field:               z.string().min(1,  'Field required'),
  city:                z.string().optional(),
  country:             z.string().optional(),
  isRemote:            z.boolean().optional(),
  isPaid:              z.boolean().optional(),
  stipendAmount:       z.preprocess((v) => v === '' || v == null ? undefined : Number(v), z.number().optional()),
  durationWeeks:       z.preprocess((v) => v === '' || v == null ? undefined : Number(v), z.number().min(1).optional()),
  slots:               z.preprocess((v) => v === '' || v == null ? undefined : Number(v), z.number().min(1).optional()),
  startDate:           z.string().optional(),
  endDate:             z.string().optional(),
  applicationDeadline: z.string().optional(),
})
type ListingForm = z.infer<typeof schema>

export default function CompanyInternships() {
  const qc = useQueryClient()
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState<Internship | null>(null)
  const [deleteTarget,setDeleteTarget]= useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['company-internships'],
    queryFn:  internshipApi.getMine,
  })
  const listings: Internship[] = data?.data?.data ?? []

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ListingForm>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'PROFESSIONAL', isRemote: false, isPaid: false },
  })

  const openCreate = () => { setEditTarget(null); reset({ type: 'PROFESSIONAL', isRemote: false, isPaid: false }); setModalOpen(true) }
  const openEdit   = (listing: Internship) => {
    setEditTarget(listing)
    reset({
      title:               listing.title,
      description:         listing.description,
      type:                listing.type,
      field:               listing.field,
      city:                listing.city         ?? '',
      country:             listing.country      ?? '',
      isRemote:            listing.isRemote,
      isPaid:              listing.isPaid,
      stipendAmount:       listing.stipendAmount,
      durationWeeks:       listing.durationWeeks,
      slots:               listing.slots,
      startDate:           listing.startDate    ? listing.startDate.split('T')[0] : '',
      endDate:             listing.endDate      ? listing.endDate.split('T')[0]   : '',
      applicationDeadline: listing.applicationDeadline ? listing.applicationDeadline.split('T')[0] : '',
    })
    setModalOpen(true)
  }

  const saveMutation = useMutation({
    mutationFn: (data: ListingForm) =>
      editTarget
        ? internshipApi.update(editTarget.id, data)
        : internshipApi.create(data),
    onSuccess: () => {
      toast.success(editTarget ? 'Listing updated' : 'Listing created')
      setModalOpen(false)
      qc.invalidateQueries({ queryKey: ['company-internships'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Save failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => internshipApi.delete(id),
    onSuccess: () => {
      toast.success('Listing deleted')
      setDeleteTarget(null)
      qc.invalidateQueries({ queryKey: ['company-internships'] })
    },
    onError: () => toast.error('Delete failed'),
  })

  const statusBadge = (status: InternshipStatus) => ({
    OPEN:   'badge-green',
    DRAFT:  'badge-gray',
    CLOSED: 'badge-red',
    FILLED: 'badge-blue',
  }[status] ?? 'badge-gray')

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Internship Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New listing</button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={48} />}
          title="No listings yet"
          description="Create your first internship listing to start receiving applications."
          action={<button onClick={openCreate} className="btn-primary"><Plus size={15} /> Create listing</button>}
        />
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <span className={statusBadge(listing.status)}>{listing.status}</span>
                    <span className="badge-purple">{listing.type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {listing.field}
                    {listing.city ? ` · ${listing.city}` : ''}
                    {listing.isRemote ? ' · Remote' : ''}
                    {listing.isPaid ? ` · Paid${listing.stipendAmount ? ` (${listing.stipendAmount} ${listing.currency ?? 'USD'}/mo)` : ''}` : ' · Unpaid'}
                    {listing.durationWeeks ? ` · ${listing.durationWeeks}w` : ''}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users size={12} />{listing._count?.applications ?? 0} applicants</span>
                    {listing.applicationDeadline && <span>Deadline: {fmt(listing.applicationDeadline)}</span>}
                    <span>Created: {fmt(listing.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={`/student/internships/${listing.id}`} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-300 transition-colors" title="Preview">
                    <Eye size={15} />
                  </a>
                  <button onClick={() => openEdit(listing)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-300 transition-colors" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(listing.id)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit listing' : 'New listing'} size="xl">
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Title <span className="text-red-400">*</span></label>
              <input {...register('title')} className="input" />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>
            <div>
              <label className="label">Type <span className="text-red-400">*</span></label>
              <select {...register('type')} className="input">
                <option value="PROFESSIONAL">Professional</option>
                <option value="ACADEMIC">Academic</option>
              </select>
            </div>
            <div>
              <label className="label">Field <span className="text-red-400">*</span></label>
              <input {...register('field')} className="input" placeholder="e.g. Software Engineering" />
              {errors.field && <p className="form-error">{errors.field.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Description <span className="text-red-400">*</span></label>
            <textarea {...register('description')} rows={5} className="input resize-none" placeholder="Describe the internship…" />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input {...register('city')} className="input" />
            </div>
            <div>
              <label className="label">Country</label>
              <input {...register('country')} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="label">Duration (weeks)</label>
              <input {...register('durationWeeks')} type="number" min={1} className="input" />
            </div>
            <div>
              <label className="label">Slots</label>
              <input {...register('slots')} type="number" min={1} className="input" />
            </div>
            <div>
              <label className="label">Start date</label>
              <input {...register('startDate')} type="date" className="input" />
            </div>
            <div>
              <label className="label">Deadline</label>
              <input {...register('applicationDeadline')} type="date" className="input" />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input {...register('isRemote')} type="checkbox" className="h-4 w-4 accent-brand-500" />
              Remote position
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input {...register('isPaid')} type="checkbox" className="h-4 w-4 accent-brand-500" />
              Paid internship
            </label>
          </div>

          <div>
            <label className="label">Monthly stipend (optional)</label>
            <input {...register('stipendAmount')} type="number" min={0} className="input w-48" placeholder="0" />
          </div>

          <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white pb-1">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
              {saveMutation.isPending ? 'Saving…' : editTarget ? 'Update listing' : 'Create listing'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete listing" size="sm">
        <p className="text-sm text-gray-600 mb-5">This will permanently remove this listing and all its applications. This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="btn-danger" disabled={deleteMutation.isPending}
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>
            {deleteMutation.isPending ? 'Deleting…' : 'Yes, delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
