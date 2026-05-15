import { useQuery } from '@tanstack/react-query'
import { useAuth }  from '@/context/AuthContext'
import { internshipApi } from '@/api/endpoints'
import StatCard   from '@/components/common/StatCard'
import Spinner    from '@/components/common/Spinner'
import { fmt }    from '@/utils/formatDate'
import { Briefcase, FileText, Users, TrendingUp } from 'lucide-react'

export default function CompanyDashboard() {
  const { user } = useAuth()
  const name = user?.companyProfile?.companyName ?? 'Company'

  const { data: listingsData, isLoading: l1 } = useQuery({
    queryKey: ['company-internships'],
    queryFn:  internshipApi.getMine,
  })

  const listings: any[] = listingsData?.data?.data ?? []
  const openCount       = listings.filter((l) => l.status === 'OPEN').length
  const totalApps       = listings.reduce((a: number, l: any) => a + (l._count?.applications ?? 0), 0)
  const totalInterns    = listings.reduce((a: number, l: any) => a + (l._count?.enrollments  ?? 0), 0)

  if (l1) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {name}</h1>
          <p className="text-sm text-gray-500 mt-1">Company dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total listings"    value={listings.length} icon={<Briefcase   size={18} />} color="blue"   />
        <StatCard label="Open listings"     value={openCount}       icon={<TrendingUp  size={18} />} color="green"  />
        <StatCard label="Total applications"value={totalApps}       icon={<FileText    size={18} />} color="purple" />
        <StatCard label="Active interns"    value={totalInterns}    icon={<Users       size={18} />} color="yellow" />
      </div>

      {/* Recent listings */}
      <div className="card p-5">
        <h2 className="section-title">Your internship listings</h2>
        {listings.length === 0 ? (
          <p className="text-sm text-gray-400">No listings yet. <a href="/company/internships" className="text-brand-600 hover:underline">Create your first one.</a></p>
        ) : (
          <div className="space-y-3">
            {listings.slice(0, 6).map((listing: any) => (
              <div key={listing.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {listing.field} · {listing._count?.applications ?? 0} applicants · Created {fmt(listing.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={
                    listing.status === 'OPEN'   ? 'badge-green'  :
                    listing.status === 'FILLED' ? 'badge-blue'   :
                    listing.status === 'CLOSED' ? 'badge-red'    : 'badge-gray'
                  }>{listing.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
