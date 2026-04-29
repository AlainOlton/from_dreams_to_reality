import { ReactNode } from 'react'

interface Props {
  label:   string
  value:   string | number
  icon:    ReactNode
  color?:  'green' | 'blue' | 'purple' | 'yellow' | 'red'
  trend?:  string
}

const colors = {
  green:  'bg-green-50  text-green-600',
  blue:   'bg-blue-50   text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red:    'bg-red-50    text-red-600',
}

export default function StatCard({ label, value, icon, color = 'green', trend }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && <div className="text-xs text-gray-400 mt-1">{trend}</div>}
    </div>
  )
}
