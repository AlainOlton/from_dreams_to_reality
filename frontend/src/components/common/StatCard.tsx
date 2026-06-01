import { type ReactNode } from 'react'

interface Props {
  label:    string
  value:    string | number
  icon:     ReactNode
  color?:   'primary' | 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'green' | 'blue' | 'purple' | 'yellow' | 'red'
  trend?:   string
  trendUp?: boolean
}

const iconColors: Record<string, string> = {
  primary:   'stat-icon-primary',
  info:      'stat-icon-info',
  success:   'stat-icon-success',
  warning:   'stat-icon-warning',
  danger:    'stat-icon-danger',
  secondary: 'stat-icon-secondary',
  // legacy aliases
  green:     'stat-icon-success',
  blue:      'stat-icon-primary',
  purple:    'stat-icon-purple',
  yellow:    'stat-icon-warning',
  red:       'stat-icon-danger',
}

export default function StatCard({ label, value, icon, color = 'primary', trend, trendUp }: Props) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={`p-2 rounded-lg ${iconColors[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>{value}</div>
      {trend && (
        <div className={`text-xs mt-1 font-medium ${trendUp ? 'text-green-600' : 'text-gray-400'}`}>
          {trend}
        </div>
      )}
    </div>
  )
}
