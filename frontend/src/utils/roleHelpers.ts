import type { Role, ApplicationStatus } from '@/types'

export const getRoleLabel = (role: Role): string => ({
  STUDENT:             'Student',
  ACADEMIC_SUPERVISOR: 'Academic Supervisor',
  SITE_SUPERVISOR:     'Site Supervisor',
  COMPANY:             'Company',
  ADMIN:               'Admin',
}[role] ?? role)

export const getRoleBadgeClass = (role: Role): string => ({
  STUDENT:             'badge-blue',
  ACADEMIC_SUPERVISOR: 'badge-purple',
  SITE_SUPERVISOR:     'badge-yellow',
  COMPANY:             'badge-green',
  ADMIN:               'badge-red',
}[role] ?? 'badge-gray')

export const getStatusBadgeClass = (status: ApplicationStatus): string => ({
  APPLIED:             'badge-blue',
  REVIEWED:            'badge-yellow',
  INTERVIEW_SCHEDULED: 'badge-purple',
  ACCEPTED:            'badge-green',
  REJECTED:            'badge-red',
  WITHDRAWN:           'badge-gray',
}[status] ?? 'badge-gray')

export const getStatusLabel = (status: ApplicationStatus): string =>
  status.replace(/_/g, ' ')

export const getUserDisplayName = (user: {
  studentProfile?:    { firstName: string; lastName: string } | null
  supervisorProfile?: { firstName: string; lastName: string } | null
  companyProfile?:    { companyName: string } | null
  adminProfile?:      { firstName: string; lastName: string } | null
  email: string
}): string => {
  if (user.studentProfile)
    return `${user.studentProfile.firstName} ${user.studentProfile.lastName}`
  if (user.supervisorProfile)
    return `${user.supervisorProfile.firstName} ${user.supervisorProfile.lastName}`
  if (user.companyProfile)
    return user.companyProfile.companyName
  if (user.adminProfile)
    return `${user.adminProfile.firstName} ${user.adminProfile.lastName}`
  return user.email
}

export const getUserAvatar = (user: {
  studentProfile?:    { profilePhotoUrl?: string | null } | null
  supervisorProfile?: { profilePhotoUrl?: string | null } | null
  companyProfile?:    { logoUrl?: string | null } | null
}): string | null =>
  user.studentProfile?.profilePhotoUrl   ??
  user.supervisorProfile?.profilePhotoUrl ??
  user.companyProfile?.logoUrl            ??
  null
