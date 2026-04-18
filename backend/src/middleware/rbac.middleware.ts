import { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { sendError } from '@/utils/apiResponse'

export const authorize = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401)
      return
    }
    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden — insufficient permissions', 403)
      return
    }
    next()
  }
