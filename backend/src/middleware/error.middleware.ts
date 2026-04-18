import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

interface AppError extends Error {
  statusCode?: number
}

export const errorHandler = (
  err:  AppError,
  _req: Request,
  res:  Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  console.error('[ERROR]', err)

  // Prisma known errors — translate to readable messages
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'A record with that value already exists',
      })
      return
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Record not found',
      })
      return
    }
  }

  // Multer errors (file type / size)
  if (err.message?.includes('Only images') || err.message?.includes('File too large')) {
    res.status(400).json({ success: false, message: err.message })
    return
  }

  const statusCode = err.statusCode ?? 500
  const message    = statusCode === 500 ? 'Internal server error' : err.message

  res.status(statusCode).json({ success: false, message })
}
