import { useQuery } from '@tanstack/react-query'
import { reportApi } from '@/api/endpoints'
import StatCard from '@/components/common/StatCard'
import Spinner  from '@/components/common/Spinner'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Users, Briefcase,
  Building2, ClipboardList,
} from 'lucide-react'

const COLORS = ['#1D9E75', '#534AB7', '#D85A30', '#BA7517']

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn:  reportApi.getAnalytics,
  })

  const analytics = data?.data?.data

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const stats = [
    { label: 'Total students',     value: analytics?.byType?.reduce((a: number, t: any) => a + t.count, 0) ?? 0, icon: <Users        size={18} />, color: 'blue'   as const },
    { label: 'Internship types',   value: analytics?.byType?.length ?? 0,                                          icon: <Briefcase    size={18} />, color: 'green'  as const },
    { label: 'Top field listings', value: analytics?.byField?.length ?? 0,                                         icon: <Building2    size={18} />, color: 'purple' as const },
    { label: 'Evaluated',          value: analytics?.applicationsByStatus?.find((s: any) => s.status === 'ACCEPTED')?.count ?? 0, icon: <ClipboardList size={18} />, color: 'yellow' as const },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">System-wide overview and analytics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly enrollments */}
        {analytics?.monthlyEnrollments?.length > 0 && (
          <div className="card p-5">
            <h2 className="section-title">Monthly enrollments (last 12 months)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={analytics.monthlyEnrollments} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Application status pie */}
        {analytics?.applicationsByStatus?.length > 0 && (
          <div className="card p-5">
            <h2 className="section-title">Application status breakdown</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={analytics.applicationsByStatus} cx="50%" cy="50%"
                  outerRadius={80} dataKey="count" nameKey="status"
                  label={({ status, percent }: any) => `${status} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {analytics.applicationsByStatus.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend formatter={(value) => value} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top fields bar chart */}
      {analytics?.byField?.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="section-title">Top internship fields</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.byField.slice(0, 8)} margin={{ top: 5, right: 10, left: -10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="field" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#534AB7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Average evaluation scores */}
      {analytics?.averageScores && (
        <div className="card p-5">
          <h2 className="section-title">Average evaluation scores (approved)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { key: 'punctuality',     label: 'Punctuality'    },
              { key: 'communication',   label: 'Communication'  },
              { key: 'technicalSkills', label: 'Technical'      },
              { key: 'teamwork',        label: 'Teamwork'       },
              { key: 'initiative',      label: 'Initiative'     },
              { key: 'professionalism', label: 'Professional'   },
            ].map(({ key, label }) => {
              const val = analytics.averageScores[key]
              return (
                <div key={key} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-brand-600">{val != null ? val.toFixed(1) : '—'}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                  <p className="text-[10px] text-gray-400">out of 5</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
