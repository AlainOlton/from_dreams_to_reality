import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { internshipApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { Briefcase, Search, Trash2, Eye, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Internship, InternshipType, InternshipStatus } from '@/types'

export default function AdminInternships() {
  const qc = useQueryClient()
  const [search,        setSearch]       = useState('')
  const [typeFilter,    setTypeFilter]   = useState<InternshipType | ''>('')
  const [statusFilter,  setStatusFilter] = useState<InternshipStatus | ''>('')
  const [deleteTarget,  setDeleteTarget] = useState<string | null>(null)
  const [page,          setPage]         = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-internships', search, typeFilter, statusFilter, page],
    queryFn:  () => internshipApi.list({
      search,
      type:   typeFilter   || undefined,
      status: statusFilter || undefined,
      page:   String(page),
      limit:  '20',
    } as Record<string, string>),
  })

  const internships: Internship[] = data?.data?.data?.data   ?? []
  const total:       number       = data?.data?.data?.total  ?? 0
  const totalPages:  number       = data?.data?.data?.totalPages ?? 1

  const deleteMutation = useMutation({
    mutationFn: (id: string) => internshipApi.delete(id),
    onSuccess: () => {
      toast.success('Listing deleted')
      setDeleteTarget(null)
      qc.invalidateQueries({ queryKey: ['admin-internships'] })
    },
    onError: () => toast.error('Delete failed'),
  })

  const statusBadge = (s: InternshipStatus): string => ({
    OPEN:   'badge-green',
    DRAFT:  'badge-gray',
    CLOSED: 'badge-red',
    FILLED: 'badge-blue',
  }[s] ?? 'badge-gray')

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Internship Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{total} listings across all companies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search title, field…"
            className="input pl-9"
          />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as InternshipType | ''); setPage(1) }} className="input w-44">
          <option value="">All types</option>
          <option value="ACADEMIC">Academic</option>
          <option value="PROFESSIONAL">Professional</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as InternshipStatus | ''); setPage(1) }} className="input w-36">
          <option value="">All status</option>
          <option value="OPEN">Open</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
          <option value="FILLED">Filled</option>
        </select>
      </div>

      {internships.length === 0 ? (
        <EmptyState icon={<Briefcase size={48} />} title="No internships found" description="Try adjusting your filters." />
      ) : (
        <>
          <div className="card overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Title & company', 'Type', 'Status', 'Location', 'Applicants', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {internships.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {i.company.logoUrl
                          ? <img src={i.company.logoUrl} alt="" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
                          : <div className="h-8 w-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {i.company.companyName.charAt(0)}
                            </div>
                        }
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">{i.title}</p>
                          <p className="text-xs text-gray-400 truncate">{i.company.companyName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="badge-purple">{i.type}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={statusBadge(i.status)}>{i.status}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} />
                        {i.isRemote ? 'Remote' : i.city ?? '—'}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Users size={11} />
                        {i._count?.applications ?? 0}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{fmt(i.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={`/student/internships/${i.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded hover:bg-brand-50 text-gray-400 hover:text-brand-500 transition-colors"
                          title="Preview"
                        >
                          <Eye size={14} />
                        </a>
                        <button
                          onClick={() => setDeleteTarget(i.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
                <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete internship listing" size="sm">
        <p className="text-sm text-gray-600 mb-5">
          This will permanently delete this listing and all its applications. This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button
            className="btn-danger"
            disabled={deleteMutation.isPending}
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Yes, delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
