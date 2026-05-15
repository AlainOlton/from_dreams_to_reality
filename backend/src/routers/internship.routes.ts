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

// ── Static/named routes MUST come before /:id ────────────────

// Student — bookmarks
router.get(  '/bookmarks/me', protect, authorize(Role.STUDENT), internship.getBookmarks)

// Company — manage their own listings
router.get(  '/company/mine', protect, authorize(Role.COMPANY), internship.getMyInternships)
router.post( '/',             protect, authorize(Role.COMPANY),
  validateCreateInternship, validate, internship.createInternship)

// Public — anyone can browse listings (after named routes)
router.get('/',    validateInternshipFilters, validate, internship.listInternships)
router.get('/:id', validateUuidParam('id'),   validate, internship.getInternship)

// Student — bookmark toggle (after /:id so it doesn't shadow)
router.post('/:id/bookmark', protect, authorize(Role.STUDENT),
  validateUuidParam('id'), validate, internship.toggleBookmark)

// Company — update/delete
router.put(   '/:id', protect, authorize(Role.COMPANY),
  validateUuidParam('id'), validate, internship.updateInternship)
router.delete('/:id', protect, authorize(Role.COMPANY, Role.ADMIN),
  validateUuidParam('id'), validate, internship.deleteInternship)

export default router
