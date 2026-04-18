import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '@/types/auth.types'
import { sendError } from '@/utils/apiResponse'

export const protect = (
  req:  Request,
  res:  Response,
  next: NextFunction
): void => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    sendError(res, 'Unauthorized — no token provided', 401)
    return
  }
  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.user = decoded
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      sendError(res, 'Token expired — please log in again', 401)
    } else {
      sendError(res, 'Invalid token', 401)
    }
  }
}

// ── tsoa authentication handler ───────────────────────────────────────────────
// Called by tsoa-generated routes for @Security('bearerAuth') endpoints.
import type { Request as ExpressRequest } from 'express'

export async function expressAuthentication(
  request: ExpressRequest,
  securityName: string,
  _scopes?: string[]
): Promise<JwtPayload> {
  if (securityName === 'bearerAuth') {
    const auth = request.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      throw Object.assign(new Error('Unauthorized — no token provided'), { statusCode: 401 })
    }
    const token = auth.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      return decoded
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw Object.assign(new Error('Token expired — please log in again'), { statusCode: 401 })
      }
      throw Object.assign(new Error('Invalid token'), { statusCode: 401 })
    }
  }
  throw Object.assign(new Error(`Unknown security scheme: ${securityName}`), { statusCode: 401 })
}
