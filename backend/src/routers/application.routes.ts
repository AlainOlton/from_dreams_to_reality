import { Router } from 'express'
import * as application from '@/controllers/application.controller'
import { protect } from '@/middleware/auth.middleware'
import { authorize } from '@/middleware/rbac.middleware'
import { uploadDocument } from '@/middleware/upload.middleware'
import { Role } from '@prisma/client'

const router = Router()

// Student
router.get( '/me',                                        protect, authorize(Role.STUDENT), application.getMyApplications)
router.post('/:internshipId/apply', uploadDocument.fields([
  { name: 'coverLetter', maxCount: 1 },
  { name: 'cv',          maxCount: 1 },
  { name: 'additionalDoc', maxCount: 1 },
]),                                                       protect, authorize(Role.STUDENT), application.apply)
router.patch('/:id/withdraw',                             protect, authorize(Role.STUDENT), application.withdraw)

// Company
router.get(  '/internship/:internshipId',                 protect, authorize(Role.COMPANY), application.getApplicationsForInternship)
router.patch('/:id/status',                               protect, authorize(Role.COMPANY), application.updateStatus)
router.post( '/:id/interview',                            protect, authorize(Role.COMPANY), application.scheduleInterview)

export default router
