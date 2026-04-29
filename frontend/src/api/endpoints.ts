import api from './axios'
import type {
  LoginPayload, RegisterPayload, Internship,
  Application, LogbookEntry, Evaluation, SelfAssessment,
  PaginatedResult,
} from '@/types'

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register:       (data: RegisterPayload)                       => api.post('/auth/register', data),
  login:          (data: LoginPayload)                          => api.post('/auth/login', data),
  me:             ()                                            => api.get('/auth/me'),
  verifyEmail:    (token: string)                               => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string)                              => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token: string, password: string)            => api.post('/auth/reset-password', { token, password }),
}

// ── Internships ───────────────────────────────────────────────
export const internshipApi = {
  list:           (params?: Record<string, string>)             => api.get<{ data: PaginatedResult<Internship> }>('/internships', { params }),
  getById:        (id: string)                                  => api.get<{ data: Internship }>(`/internships/${id}`),
  create:         (data: Partial<Internship>)                   => api.post('/internships', data),
  update:         (id: string, data: Partial<Internship>)       => api.put(`/internships/${id}`, data),
  delete:         (id: string)                                  => api.delete(`/internships/${id}`),
  bookmark:       (id: string)                                  => api.post(`/internships/${id}/bookmark`),
  getBookmarks:   ()                                            => api.get('/internships/bookmarks/me'),
  getMine:        ()                                            => api.get('/internships/company/mine'),
}

// ── Applications ──────────────────────────────────────────────
export const applicationApi = {
  apply:          (internshipId: string, formData: FormData)    => api.post(`/applications/${internshipId}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMyApps:      ()                                            => api.get<{ data: Application[] }>('/applications/me'),
  getForInternship:(internshipId: string)                       => api.get(`/applications/internship/${internshipId}`),
  updateStatus:   (id: string, status: string, reason?: string) => api.patch(`/applications/${id}/status`, { status, rejectionReason: reason }),
  scheduleInterview:(id: string, data: object)                  => api.post(`/applications/${id}/interview`, data),
  withdraw:       (id: string)                                  => api.patch(`/applications/${id}/withdraw`),
}

// ── Logbook ───────────────────────────────────────────────────
export const logbookApi = {
  createEntry:    (formData: FormData)                          => api.post('/logbook', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMyEntries:   (params?: Record<string, string>)             => api.get<{ data: PaginatedResult<LogbookEntry> }>('/logbook/me', { params }),
  updateEntry:    (id: string, data: Partial<LogbookEntry>)     => api.put(`/logbook/${id}`, data),
  approveEntry:   (id: string, note?: string)                   => api.patch(`/logbook/${id}/approve`, { note }),
  getStudentEntries:(studentId: string, params?: Record<string,string>) => api.get(`/logbook/student/${studentId}`, { params }),
  getAttendance:  ()                                            => api.get('/logbook/attendance/me'),
  logAttendance:  (data: object)                                => api.post('/logbook/attendance', data),
}

// ── Evaluations ───────────────────────────────────────────────
export const evaluationApi = {
  submit:             (data: Partial<Evaluation>)               => api.post('/evaluations', data),
  getForEnrollment:   (enrollmentId: string)                    => api.get<{ data: Evaluation[] }>(`/evaluations/enrollment/${enrollmentId}`),
  approve:            (id: string)                              => api.patch(`/evaluations/${id}/approve`),
  submitSelf:         (data: Partial<SelfAssessment>)           => api.post('/evaluations/self-assessment', data),
  getMySelfAssessments:()                                       => api.get<{ data: SelfAssessment[] }>('/evaluations/self-assessment/me'),
}

// ── Users / Profiles ──────────────────────────────────────────
export const userApi = {
  getStudentProfile:   ()                                       => api.get('/users/student/me'),
  updateStudentProfile:(data: object)                           => api.put('/users/student/me', data),
  uploadPhoto:         (formData: FormData)                     => api.post('/users/student/me/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadCv:            (formData: FormData)                     => api.post('/users/student/me/cv', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSupervisorProfile:()                                       => api.get('/users/supervisor/me'),
  updateSupervisorProfile:(data: object)                        => api.put('/users/supervisor/me', data),
  getCompanyProfile:   ()                                       => api.get('/users/company/me'),
  updateCompanyProfile:(data: object)                           => api.put('/users/company/me', data),
  uploadLogo:          (formData: FormData)                     => api.post('/users/company/me/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAllUsers:          ()                                       => api.get('/users'),
  toggleUserActive:    (id: string)                             => api.patch(`/users/${id}/toggle-active`),
}

// ── Messages ──────────────────────────────────────────────────
export const messageApi = {
  getConversations:  ()                                         => api.get('/messages'),
  startConversation: (recipientId: string)                      => api.post('/messages/start', { recipientId }),
  getMessages:       (conversationId: string)                   => api.get(`/messages/${conversationId}`),
  sendMessage:       (conversationId: string, formData: FormData)=> api.post(`/messages/${conversationId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ── Notifications ─────────────────────────────────────────────
export const notificationApi = {
  getAll:    ()         => api.get('/notifications'),
  markRead:  (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead:()        => api.patch('/notifications/read-all'),
}

// ── Reports ───────────────────────────────────────────────────
export const reportApi = {
  myReports:          ()                                        => api.get('/reports/me'),
  generateLogbook:    ()                                        => api.post('/reports/logbook/me'),
  generateLogbookFor: (studentId: string)                       => api.post(`/reports/logbook/student/${studentId}`),
  generateEvaluation: (enrollmentId: string)                    => api.post(`/reports/evaluation/${enrollmentId}`),
  generateCertificate:(enrollmentId: string)                    => api.post(`/reports/certificate/${enrollmentId}`),
  getAnalytics:       ()                                        => api.get('/reports/analytics'),
  generateInstitutional:()                                      => api.post('/reports/institutional'),
}
