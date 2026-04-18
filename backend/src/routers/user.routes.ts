import { Router, Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { protect } from '@/middleware/auth.middleware'
import { authorize } from '@/middleware/rbac.middleware'
import { uploadProfilePhoto, uploadDocument, uploadLogo } from '@/middleware/upload.middleware'
import { prisma } from '@/config/db'
import { sendSuccess } from '@/utils/apiResponse'

const router = Router()

// ── Student profile ──────────────────────────────────────────
router.get('/student/me', protect, authorize(Role.STUDENT), async (req, res, next) => {
  try {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.id } })
    sendSuccess(res, profile)
  } catch (err) { next(err) }
})

router.put('/student/me', protect, authorize(Role.STUDENT), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await prisma.studentProfile.update({
      where: { userId: req.user!.id },
      data:  req.body,
    })
    sendSuccess(res, profile, 'Profile updated')
  } catch (err) { next(err) }
})

router.post('/student/me/photo', protect, authorize(Role.STUDENT),
  uploadProfilePhoto.single('photo'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photoUrl = (req.file as any)?.path
      const profile  = await prisma.studentProfile.update({
        where: { userId: req.user!.id },
        data:  { profilePhotoUrl: photoUrl },
      })
      sendSuccess(res, profile, 'Profile photo updated')
    } catch (err) { next(err) }
  }
)

router.post('/student/me/cv', protect, authorize(Role.STUDENT),
  uploadDocument.single('cv'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cvUrl   = (req.file as any)?.path
      const profile = await prisma.studentProfile.update({
        where: { userId: req.user!.id },
        data:  { cvUrl },
      })
      sendSuccess(res, profile, 'CV uploaded')
    } catch (err) { next(err) }
  }
)

// ── Supervisor profile ───────────────────────────────────────
router.get('/supervisor/me', protect, authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR), async (req, res, next) => {
  try {
    const profile = await prisma.supervisorProfile.findUnique({ where: { userId: req.user!.id } })
    sendSuccess(res, profile)
  } catch (err) { next(err) }
})

router.put('/supervisor/me', protect, authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.supervisorProfile.update({
        where: { userId: req.user!.id },
        data:  req.body,
      })
      sendSuccess(res, profile, 'Profile updated')
    } catch (err) { next(err) }
  }
)

// ── Company profile ──────────────────────────────────────────
router.get('/company/me', protect, authorize(Role.COMPANY), async (req, res, next) => {
  try {
    const profile = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    sendSuccess(res, profile)
  } catch (err) { next(err) }
})

router.put('/company/me', protect, authorize(Role.COMPANY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.companyProfile.update({
        where: { userId: req.user!.id },
        data:  req.body,
      })
      sendSuccess(res, profile, 'Company profile updated')
    } catch (err) { next(err) }
  }
)

router.post('/company/me/logo', protect, authorize(Role.COMPANY),
  uploadLogo.single('logo'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logoUrl = (req.file as any)?.path
      const profile = await prisma.companyProfile.update({
        where: { userId: req.user!.id },
        data:  { logoUrl },
      })
      sendSuccess(res, profile, 'Logo uploaded')
    } catch (err) { next(err) }
  }
)

// ── Admin — list all users ───────────────────────────────────
router.get('/', protect, authorize(Role.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, role: true,
        isActive: true, isEmailVerified: true, createdAt: true,
        studentProfile:    { select: { firstName: true, lastName: true } },
        supervisorProfile: { select: { firstName: true, lastName: true } },
        companyProfile:    { select: { companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    sendSuccess(res, users)
  } catch (err) { next(err) }
})

router.patch('/:id/toggle-active', protect, authorize(Role.ADMIN),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.params.id } })
      if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return }
      const updated = await prisma.user.update({
        where: { id: req.params.id },
        data:  { isActive: !user.isActive },
      })
      sendSuccess(res, { isActive: updated.isActive }, `User ${updated.isActive ? 'activated' : 'deactivated'}`)
    } catch (err) { next(err) }
  }
)

export default router
