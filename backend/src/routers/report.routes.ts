import { Router } from 'express'
import { Role } from '@prisma/client'
import { protect }   from '@/middleware/auth.middleware'
import { authorize } from '@/middleware/rbac.middleware'
import { validate }  from '@/middleware/validate.middleware'
import { validateUuidParam } from '@/utils/validators'
import * as report from '@/controllers/report.controller'

const router = Router()

// ── My reports ────────────────────────────────────────────────
router.get('/', protect, report.listMyReports)

// ── Admin — all reports ───────────────────────────────────────
router.get('/all', protect, authorize(Role.ADMIN), report.listAllReports)

// ── Analytics ─────────────────────────────────────────────────
// Full placement analytics (charts data)
router.get(
  '/analytics',
  protect,
  authorize(Role.ADMIN, Role.ACADEMIC_SUPERVISOR),
  report.getAnalytics
)

// ── PDF generation ────────────────────────────────────────────
// Student generates their own logbook PDF
router.post(
  '/logbook/me',
  protect,
  authorize(Role.STUDENT),
  report.generateLogbookPdf
)

// Supervisor / Admin generates logbook PDF for a specific student
router.post(
  '/logbook/:studentId',
  protect,
  authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR, Role.ADMIN),
  validateUuidParam('studentId'),
  validate,
  report.generateLogbookPdf
)

// Evaluation report for an enrollment
router.post(
  '/evaluation/:enrollmentId',
  protect,
  authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR, Role.ADMIN),
  validateUuidParam('enrollmentId'),
  validate,
  report.generateEvaluationPdf
)

// Completion certificate for an enrollment
router.post(
  '/certificate/:enrollmentId',
  protect,
  authorize(Role.ADMIN, Role.ACADEMIC_SUPERVISOR),
  validateUuidParam('enrollmentId'),
  validate,
  report.generateCertificate
)

// ── Excel report ──────────────────────────────────────────────
router.post(
  '/institutional',
  protect,
  authorize(Role.ADMIN),
  report.generateInstitutionalExcel
)

export default router
