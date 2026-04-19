import { Router } from 'express'
import * as application  from '@/controllers/application.controller'
import { protect }       from '@/middleware/auth.middleware'
import { authorize }     from '@/middleware/rbac.middleware'
import { validate }      from '@/middleware/validate.middleware'
import { uploadDocument } from '@/middleware/upload.middleware'
import {
  validateApplicationStatus,
  validateScheduleInterview,
  validateUuidParam,
} from '@/utils/validators'
import { Role } from '@prisma/client'

const router = Router()

// Student
router.get('/me',
  protect, authorize(Role.STUDENT),
  application.getMyApplications)

router.post('/:internshipId/apply',
  uploadDocument.fields([
    { name: 'coverLetter',   maxCount: 1 },
    { name: 'cv',            maxCount: 1 },
    { name: 'additionalDoc', maxCount: 1 },
  ]),
  protect, authorize(Role.STUDENT),
  validateUuidParam('internshipId'), validate,
  application.apply)

router.patch('/:id/withdraw',
  protect, authorize(Role.STUDENT),
  validateUuidParam('id'), validate,
  application.withdraw)

// Company
router.get('/internship/:internshipId',
  protect, authorize(Role.COMPANY),
  validateUuidParam('internshipId'), validate,
  application.getApplicationsForInternship)

router.patch('/:id/status',
  protect, authorize(Role.COMPANY),
  validateUuidParam('id'), validateApplicationStatus, validate,
  application.updateStatus)

router.post('/:id/interview',
  protect, authorize(Role.COMPANY),
  validateUuidParam('id'), validateScheduleInterview, validate,
  application.scheduleInterview)

export default router
