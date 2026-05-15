import { useQuery } from '@tanstack/react-query'
import { internshipApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import StatCard   from '@/components/common/StatCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend,
} from 'recharts'
import { Briefcase, FileText, Users, TrendingUp } from 'lucide-react'
import type { Internship } from '@/types'

const COLORS = ['#1D9E75', '#534AB7', '#D85A30', '#BA7517', '#E24B4A', '#185FA5']

export default function CompanyAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['company-internships'],
    queryFn:  internshipApi.getMine,
  })
  const listings: Internship[] = data?.data?.data ?? []

  const totalListings  = listings.length
  const openListings   = listings.filter((l) => l.status === 'OPEN').length
  const totalApps      = listings.reduce((a, l) => a + (l._count?.applications ?? 0), 0)
  const totalSlots     = listings.reduce((a, l) => a + (l.slots ?? 0), 0)

  // Applications per listing chart data
  const appChartData = listings
    .filter((l) => (l._count?.applications ?? 0) > 0)
    .map((l) => ({ name: l.title.length > 20 ? l.title.slice(0, 20) + '…' : l.title, applications: l._count?.applications ?? 0 }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 8)

  // Status breakdown pie data
  const statusCounts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  // Type breakdown
  const typeCounts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.type] = (acc[l.type] ?? 0) + 1
    return acc
  }, {})
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your internship programme performance</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total listings"     value={totalListings} icon={<Briefcase  size={18} />} color="blue"   />
        <StatCard label="Open listings"      value={openListings}  icon={<TrendingUp size={18} />} color="green"  />
        <StatCard label="Total applications" value={totalApps}     icon={<FileText   size={18} />} color="purple" />
        <StatCard label="Total slots"        value={totalSlots}    icon={<Users      size={18} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Applications per listing bar chart */}
        <div className="card p-5">
          <h2 className="section-title">Applications per listing</h2>
          {appChartData.length === 0
            ? <p className="text-sm text-gray-400 py-8 text-center">No application data yet.</p>
            : <ResponsiveContainer width="100%" height={260}>
                <BarChart data={appChartData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#1D9E75" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Status breakdown pie */}
        <div className="card p-5">
          <h2 className="section-title">Listing status breakdown</h2>
          {pieData.length === 0
            ? <p className="text-sm text-gray-400 py-8 text-center">No listings yet.</p>
            : <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90}
                    dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      {/* Type breakdown */}
      <div className="card p-5">
        <h2 className="section-title">Internship type breakdown</h2>
        <div className="flex flex-wrap gap-4">
          {typeData.map((t, i) => (
            <div key={t.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-3">
              <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <div>
                <p className="text-xs text-gray-500">{t.name}</p>
                <p className="text-xl font-bold text-gray-900">{t.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
