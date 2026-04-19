import { Router } from 'express'
import * as internship from '@/controllers/internship.controller'
import { protect }     from '@/middleware/auth.middleware'
import { authorize }   from '@/middleware/rbac.middleware'
import { validate }    from '@/middleware/validate.middleware'
import {
  validateCreateInternship,
  validateInternshipFilters,
  validateUuidParam,
} from '@/utils/validators'
import { Role } from '@prisma/client'

const router = Router()

// Public — anyone can browse listings
router.get('/',    validateInternshipFilters, validate, internship.listInternships)
router.get('/:id', validateUuidParam('id'),   validate, internship.getInternship)

// Student — bookmarks
router.get(  '/bookmarks/me', protect, authorize(Role.STUDENT), internship.getBookmarks)
router.post( '/:id/bookmark', protect, authorize(Role.STUDENT),
  validateUuidParam('id'), validate, internship.toggleBookmark)

// Company — manage their own listings
router.get(   '/company/mine', protect, authorize(Role.COMPANY), internship.getMyInternships)
router.post(  '/',             protect, authorize(Role.COMPANY),
  validateCreateInternship, validate, internship.createInternship)
router.put(   '/:id',          protect, authorize(Role.COMPANY),
  validateUuidParam('id'), validate, internship.updateInternship)
router.delete('/:id',          protect, authorize(Role.COMPANY, Role.ADMIN),
  validateUuidParam('id'), validate, internship.deleteInternship)

export default router
