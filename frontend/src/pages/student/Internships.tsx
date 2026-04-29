import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { internshipApi } from '@/api/endpoints'
import { Search, MapPin, Clock, Bookmark, BookmarkCheck } from 'lucide-react'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import toast from 'react-hot-toast'
import type { Internship } from '@/types'

export default function StudentInternships() {
  const [search, setSearch]   = useState('')
  const [field,  setField]    = useState('')
  const [remote, setRemote]   = useState('')
  const [paid,   setPaid]     = useState('')
  const navigate              = useNavigate()
  const qc                    = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['internships', search, field, remote, paid],
    queryFn:  () => internshipApi.list({ search, field, isRemote: remote, isPaid: paid }),
  })

  const bookmarkMutation = useMutation({
    mutationFn: (id: string) => internshipApi.bookmark(id),
    onSuccess: () => { toast.success('Bookmark updated'); qc.invalidateQueries({ queryKey: ['bookmarks'] }) },
  })

  const internships: Internship[] = data?.data?.data?.data ?? []

  return (
    <div>
      <div className="page-header">
        <h1>Browse Internships</h1>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="input pl-9" />
        </div>
        <input value={field} onChange={e => setField(e.target.value)} placeholder="Field (e.g. Engineering)" className="input w-48" />
        <select value={remote} onChange={e => setRemote(e.target.value)} className="input w-36">
          <option value="">Location</option>
          <option value="true">Remote</option>
          <option value="false">On-site</option>
        </select>
        <select value={paid} onChange={e => setPaid(e.target.value)} className="input w-32">
          <option value="">Pay</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
      </div>

      {isLoading
        ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        : internships.length === 0
          ? <EmptyState title="No internships found" description="Try adjusting your filters" />
          : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {internships.map((i) => (
                <div key={i.id} className="card p-5 hover:border-brand-300 transition-colors cursor-pointer"
                  onClick={() => navigate(`/student/internships/${i.id}`)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {i.company.logoUrl
                        ? <img src={i.company.logoUrl} alt={i.company.companyName} className="h-10 w-10 rounded-lg object-cover" />
                        : <div className="h-10 w-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                            {i.company.companyName.charAt(0)}
                          </div>
                      }
                      <div>
                        <p className="text-xs text-gray-400">{i.company.companyName}</p>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{i.title}</h3>
                      </div>
                    </div>
                    <button className="text-gray-300 hover:text-brand-500 transition-colors"
                      onClick={e => { e.stopPropagation(); bookmarkMutation.mutate(i.id) }}>
                      <Bookmark size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{i.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {i.city && <span className="flex items-center gap-1"><MapPin size={11} />{i.city}</span>}
                    {i.durationWeeks && <span className="flex items-center gap-1"><Clock size={11} />{i.durationWeeks}w</span>}
                    <span className={i.isPaid ? 'badge-green' : 'badge-gray'}>{i.isPaid ? 'Paid' : 'Unpaid'}</span>
                    {i.isRemote && <span className="badge-blue">Remote</span>}
                  </div>
                </div>
              ))}
            </div>
      }
    </div>
  )
}
