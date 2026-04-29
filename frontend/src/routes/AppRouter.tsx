import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Spinner      from '@/components/common/Spinner'
import AppLayout    from '@/components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'

// ── Auth pages ────────────────────────────────────────────────
const Login          = lazy(() => import('@/pages/auth/Login'))
const Register       = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword  = lazy(() => import('@/pages/auth/ResetPassword'))
const VerifyEmail    = lazy(() => import('@/pages/auth/VerifyEmail'))

// ── Student pages ─────────────────────────────────────────────
const StudentDashboard    = lazy(() => import('@/pages/student/Dashboard'))
const StudentInternships  = lazy(() => import('@/pages/student/Internships'))
const InternshipDetail    = lazy(() => import('@/pages/student/InternshipDetail'))
const StudentApplications = lazy(() => import('@/pages/student/Applications'))
const StudentLogbook      = lazy(() => import('@/pages/student/Logbook'))
const StudentEvaluations  = lazy(() => import('@/pages/student/Evaluations'))
const StudentMessages     = lazy(() => import('@/pages/student/Messages'))
const StudentReports      = lazy(() => import('@/pages/student/Reports'))

// ── Supervisor pages ──────────────────────────────────────────
const SupervisorDashboard    = lazy(() => import('@/pages/supervisor/Dashboard'))
const SupervisorStudents     = lazy(() => import('@/pages/supervisor/Students'))
const SupervisorLogbooks     = lazy(() => import('@/pages/supervisor/Logbooks'))
const SupervisorEvaluations  = lazy(() => import('@/pages/supervisor/Evaluations'))
const SupervisorAttendance   = lazy(() => import('@/pages/supervisor/Attendance'))
const SupervisorMessages     = lazy(() => import('@/pages/supervisor/Messages'))
const SupervisorReports      = lazy(() => import('@/pages/supervisor/Reports'))

// ── Company pages ─────────────────────────────────────────────
const CompanyDashboard    = lazy(() => import('@/pages/company/Dashboard'))
const CompanyInternships  = lazy(() => import('@/pages/company/Internships'))
const CompanyApplications = lazy(() => import('@/pages/company/Applications'))
const CompanyInterns      = lazy(() => import('@/pages/company/Interns'))
const CompanyMessages     = lazy(() => import('@/pages/company/Messages'))
const CompanyAnalytics    = lazy(() => import('@/pages/company/Analytics'))

// ── Admin pages ───────────────────────────────────────────────
const AdminDashboard   = lazy(() => import('@/pages/admin/Dashboard'))
const AdminUsers       = lazy(() => import('@/pages/admin/Users'))
const AdminInternships = lazy(() => import('@/pages/admin/Internships'))
const AdminEnrollments = lazy(() => import('@/pages/admin/Enrollments'))
const AdminReports     = lazy(() => import('@/pages/admin/Reports'))
const AdminSettings    = lazy(() => import('@/pages/admin/Settings'))

const Loading = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
)

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login"     element={<Login />} />
          <Route path="/auth/register"  element={<Register />} />
          <Route path="/auth/forgot"    element={<ForgotPassword />} />
          <Route path="/auth/reset"     element={<ResetPassword />} />
          <Route path="/auth/verify"    element={<VerifyEmail />} />

          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<AppLayout />}>
              <Route path="/student"                  element={<StudentDashboard />} />
              <Route path="/student/internships"      element={<StudentInternships />} />
              <Route path="/student/internships/:id"  element={<InternshipDetail />} />
              <Route path="/student/applications"     element={<StudentApplications />} />
              <Route path="/student/logbook"          element={<StudentLogbook />} />
              <Route path="/student/evaluations"      element={<StudentEvaluations />} />
              <Route path="/student/messages"         element={<StudentMessages />} />
              <Route path="/student/reports"          element={<StudentReports />} />
            </Route>
          </Route>

          {/* Supervisor (Academic + Site share same layout) */}
          <Route element={<ProtectedRoute allowedRoles={['ACADEMIC_SUPERVISOR', 'SITE_SUPERVISOR']} />}>
            <Route element={<AppLayout />}>
              <Route path="/supervisor"                element={<SupervisorDashboard />} />
              <Route path="/supervisor/students"       element={<SupervisorStudents />} />
              <Route path="/supervisor/logbooks"       element={<SupervisorLogbooks />} />
              <Route path="/supervisor/evaluations"    element={<SupervisorEvaluations />} />
              <Route path="/supervisor/attendance"     element={<SupervisorAttendance />} />
              <Route path="/supervisor/messages"       element={<SupervisorMessages />} />
              <Route path="/supervisor/reports"        element={<SupervisorReports />} />
            </Route>
          </Route>

          {/* Company */}
          <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
            <Route element={<AppLayout />}>
              <Route path="/company"                   element={<CompanyDashboard />} />
              <Route path="/company/internships"       element={<CompanyInternships />} />
              <Route path="/company/applications"      element={<CompanyApplications />} />
              <Route path="/company/interns"           element={<CompanyInterns />} />
              <Route path="/company/messages"          element={<CompanyMessages />} />
              <Route path="/company/analytics"         element={<CompanyAnalytics />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin"                     element={<AdminDashboard />} />
              <Route path="/admin/users"               element={<AdminUsers />} />
              <Route path="/admin/internships"         element={<AdminInternships />} />
              <Route path="/admin/enrollments"         element={<AdminEnrollments />} />
              <Route path="/admin/reports"             element={<AdminReports />} />
              <Route path="/admin/settings"            element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
