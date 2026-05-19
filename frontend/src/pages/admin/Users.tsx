import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/api/endpoints'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { fmt }    from '@/utils/formatDate'
import { getRoleLabel, getRoleBadgeClass } from '@/utils/roleHelpers'
import {
  Users, Search, Shield, ShieldOff,
  ChevronDown, ChevronUp, Mail,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Role } from '@/types'

interface AdminUser {
  id:              string
  email:           string
  role:            Role
  isActive:        boolean
  isEmailVerified: boolean
  createdAt:       string
  studentProfile?:    { firstName: string; lastName: string } | null
  supervisorProfile?: { firstName: string; lastName: string } | null
  companyProfile?:    { companyName: string }                 | null
  adminProfile?:      { firstName: string; lastName: string } | null
}

const displayName = (u: AdminUser): string => {
  if (u.adminProfile)      return `${u.adminProfile.firstName} ${u.adminProfile.lastName}`
  if (u.studentProfile)    return `${u.studentProfile.firstName} ${u.studentProfile.lastName}`
  if (u.supervisorProfile) return `${u.supervisorProfile.firstName} ${u.supervisorProfile.lastName}`
  if (u.companyProfile)    return u.companyProfile.companyName
  return u.email
}

export default function AdminUsers() {
  const qc = useQueryClient()
  const [search,        setSearch]        = useState('')
  const [roleFilter,    setRoleFilter]    = useState<Role | ''>('')
  const [statusFilter,  setStatusFilter]  = useState<'all' | 'active' | 'inactive'>('all')
  const [expanded,      setExpanded]      = useState<string | null>(null)
  const [toggleTarget,  setToggleTarget]  = useState<AdminUser | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn:  userApi.getAllUsers,
  })

  const users: AdminUser[] = data?.data?.data ?? []

  const toggleMutation = useMutation({
    mutationFn: (id: string) => userApi.toggleUserActive(id),
    onSuccess: (_data, id) => {
      const user = users.find((u) => u.id === id)
      toast.success(`User ${user?.isActive ? 'deactivated' : 'activated'}`)
      setToggleTarget(null)
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Failed to update user status'),
  })

  const filtered = users.filter((u) => {
    const name = displayName(u).toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = !roleFilter || u.role === roleFilter
    const matchStatus =
      statusFilter === 'all'      ? true :
      statusFilter === 'active'   ? u.isActive :
                                    !u.isActive
    return matchSearch && matchRole && matchStatus
  })

  // Role counts for badges
  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {})

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} total users</p>
        </div>
      </div>

      {/* Role summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.entries(roleCounts) as [Role, number][]).map(([role, count]) => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors
              ${roleFilter === role ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}
          >
            {getRoleLabel(role)}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold
              ${roleFilter === role ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input pl-9"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as Role | '')} className="input w-48">
          <option value="">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="ACADEMIC_SUPERVISOR">Academic Supervisor</option>
          <option value="SITE_SUPERVISOR">Site Supervisor</option>
          <option value="COMPANY">Company</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="input w-36">
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="No users found" description="Try adjusting your filters." />
      ) : (
        <div className="card overflow-hidden">
          {filtered.map((user, idx) => (
            <div key={user.id} className={idx < filtered.length - 1 ? 'border-b border-gray-50' : ''}>
              {/* Row */}
              <div
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setExpanded(expanded === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${user.isActive ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-400'}`}>
                    {displayName(user).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${user.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {displayName(user)}
                      </p>
                      {!user.isActive && <span className="badge-red">Inactive</span>}
                      {!user.isEmailVerified && <span className="badge-yellow">Unverified</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={getRoleBadgeClass(user.role)}>{getRoleLabel(user.role)}</span>
                  <span className="text-xs text-gray-400 hidden sm:block">{fmt(user.createdAt)}</span>
                  {expanded === user.id
                    ? <ChevronUp size={15} className="text-gray-400" />
                    : <ChevronDown size={15} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === user.id && (
                <div className="px-5 pb-4 bg-gray-50 space-y-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">User ID</p>
                      <p className="text-xs text-gray-600 mt-0.5 font-mono break-all">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email status</p>
                      <p className={`text-xs mt-0.5 font-medium ${user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {user.isEmailVerified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</p>
                      <p className="text-xs text-gray-600 mt-0.5">{fmt(user.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={`mailto:${user.email}`}
                      className="btn-secondary text-xs py-1.5"
                    >
                      <Mail size={13} /> Email user
                    </a>
                    <button
                      onClick={() => setToggleTarget(user)}
                      className={user.isActive ? 'btn-danger text-xs py-1.5' : 'btn-primary text-xs py-1.5'}
                    >
                      {user.isActive
                        ? <><ShieldOff size={13} /> Deactivate</>
                        : <><Shield    size={13} /> Activate</>
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm toggle modal */}
      <Modal
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        title={toggleTarget ? (toggleTarget.isActive ? 'Deactivate user' : 'Activate user') : ''}
        size="sm"
      >
        {toggleTarget && (
          <>
            <p className="text-sm text-gray-600 mb-5">
              {toggleTarget.isActive
                ? `Deactivating ${displayName(toggleTarget)} will prevent them from logging in. You can reactivate at any time.`
                : `Activating ${displayName(toggleTarget)} will restore their access.`
              }
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setToggleTarget(null)}>Cancel</button>
              <button
                className={toggleTarget.isActive ? 'btn-danger' : 'btn-primary'}
                disabled={toggleMutation.isPending}
                onClick={() => toggleMutation.mutate(toggleTarget.id)}
              >
                {toggleMutation.isPending
                  ? 'Updating…'
                  : toggleTarget.isActive ? 'Yes, deactivate' : 'Yes, activate'
                }
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
