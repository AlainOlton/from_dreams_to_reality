import { Router } from 'express'
import * as evaluation from '@/controllers/evaluation.controller'
import { protect }     from '@/middleware/auth.middleware'
import { authorize }   from '@/middleware/rbac.middleware'
import { validate }    from '@/middleware/validate.middleware'
import {
  validateEvaluation,
  validateSelfAssessment,
  validateUuidParam,
} from '@/utils/validators'
import { Role } from '@prisma/client'

const router = Router()

// Supervisors submit evaluations
router.post('/',
  protect, authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR),
  validateEvaluation, validate,
  evaluation.submitEvaluation)

router.get('/enrollment/:enrollmentId',
  protect,
  validateUuidParam('enrollmentId'), validate,
  evaluation.getEvaluations)

router.patch('/:id/approve',
  protect, authorize(Role.ADMIN),
  validateUuidParam('id'), validate,
  evaluation.approveEvaluation)

// Student self-assessment
router.post('/self-assessment',
  protect, authorize(Role.STUDENT),
  validateSelfAssessment, validate,
  evaluation.submitSelfAssessment)

router.get('/self-assessment/me',
  protect, authorize(Role.STUDENT),
  evaluation.getMySelfAssessments)

export default router
