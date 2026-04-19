import { Router } from 'express'
import * as logbook       from '@/controllers/logbook.controller'
import { protect }        from '@/middleware/auth.middleware'
import { authorize }      from '@/middleware/rbac.middleware'
import { validate }       from '@/middleware/validate.middleware'
import { uploadAttachment } from '@/middleware/upload.middleware'
import {
  validateLogbookEntry,
  validateAttendance,
  validateUuidParam,
} from '@/utils/validators'
import { Role } from '@prisma/client'

const router = Router()

// Student
router.get('/me',
  protect, authorize(Role.STUDENT),
  logbook.getMyEntries)

router.post('/',
  uploadAttachment.single('attachment'),
  protect, authorize(Role.STUDENT),
  validateLogbookEntry, validate,
  logbook.createEntry)

router.put('/:id',
  protect, authorize(Role.STUDENT),
  validateUuidParam('id'), validate,
  logbook.updateEntry)

router.get('/attendance/me',
  protect, authorize(Role.STUDENT),
  logbook.getAttendanceSummary)

// Supervisors / Admin
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

export default router
