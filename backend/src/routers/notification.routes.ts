import { Router, Request, Response, NextFunction } from 'express'
import { protect } from '@/middleware/auth.middleware'
import { prisma } from '@/config/db'
import { sendSuccess } from '@/utils/apiResponse'

const router = Router()

router.get('/', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await prisma.notification.findMany({
      where:   { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take:    50,
    })
    sendSuccess(res, notifications)
  } catch (err) { next(err) }
})

router.patch('/:id/read', protect, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data:  { isRead: true, readAt: new Date() },
    })
    sendSuccess(res, null, 'Marked as read')
  } catch (err) { next(err) }
})

router.patch('/read-all', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data:  { isRead: true, readAt: new Date() },
    })
    sendSuccess(res, null, 'All notifications marked as read')
  } catch (err) { next(err) }
})

export default router
