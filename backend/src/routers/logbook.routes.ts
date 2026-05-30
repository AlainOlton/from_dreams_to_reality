import { Router } from 'express'
import * as logbook       from '@/controllers/logbook.controller'
import { protect }        from '@/middleware/auth.middleware'
import { authorize }      from '@/middleware/rbac.middleware'
import { validate }       from '@/middleware/validate.middleware'
import { uploadAttachment, uploadDocument } from '@/middleware/upload.middleware'
import {
  validateLogbookEntry,
  validateAttendance,
  validateUuidParam,
} from '@/utils/validators'
import { Role } from '@prisma/client'

const router = Router()

// ── Student routes ────────────────────────────────────────────

router.get('/me',
  protect, authorize(Role.STUDENT),
  logbook.getMyEntries)

router.post('/',
  protect, authorize(Role.STUDENT),
  uploadAttachment.single('attachment'),
  validateLogbookEntry, validate,
  logbook.createEntry)

router.put('/:id',
  protect, authorize(Role.STUDENT),
  validateUuidParam('id'), validate,
  logbook.updateEntry)

router.get('/attendance/me',
  protect, authorize(Role.STUDENT),
  logbook.getAttendanceSummary)

/**
 * POST /logbook/final-report
 * Student uploads end-of-internship PDF report (+ signed supervisor docs).
 * Accepts a single PDF file in the `finalReport` field.
 */
router.post('/final-report',
  protect, authorize(Role.STUDENT),
  uploadDocument.single('finalReport'),
  logbook.uploadFinalReport)

// ── Supervisor / Admin routes ─────────────────────────────────

router.get('/student/:studentId',
  protect, authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR, Role.ADMIN),
  validateUuidParam('studentId'), validate,
  logbook.getStudentEntries)

router.patch('/:id/approve',
  protect, authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR),
  validateUuidParam('id'), validate,
  logbook.approveEntry)

router.post('/attendance',
  protect, authorize(Role.SITE_SUPERVISOR, Role.ADMIN),
  validateAttendance, validate,
  logbook.logAttendance)

/**
 * POST /logbook/process-missed
 * Trigger the missed-logbook check manually (Admin only).
 * In production this would be called by a daily cron job.
 */
router.post('/process-missed',
  protect, authorize(Role.ADMIN),
  logbook.processMissedLogbooks)

export default router
