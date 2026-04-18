import { Router } from 'express'
import * as internship from '@/controllers/internship.controller'
import { protect } from '@/middleware/auth.middleware'
import { authorize } from '@/middleware/rbac.middleware'
import { Role } from '@prisma/client'

const router = Router()

// Public — anyone can browse listings
router.get('/', internship.listInternships)
router.get('/:id', internship.getInternship)

// Student — bookmarks
router.get(   '/bookmarks/me',  protect, authorize(Role.STUDENT), internship.getBookmarks)
router.post(  '/:id/bookmark',  protect, authorize(Role.STUDENT), internship.toggleBookmark)

// Company — manage their own listings
router.get(   '/company/mine',  protect, authorize(Role.COMPANY), internship.getMyInternships)
router.post(  '/',              protect, authorize(Role.COMPANY), internship.createInternship)
router.put(   '/:id',           protect, authorize(Role.COMPANY), internship.updateInternship)
router.delete('/:id',           protect, authorize(Role.COMPANY, Role.ADMIN), internship.deleteInternship)

export default router
