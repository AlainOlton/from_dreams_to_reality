import jwt from 'jsonwebtoken'
import { JwtPayload } from '@/types/auth.types'

export const generateToken = (payload: JwtPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
  })

export const generateShortToken = (): string =>
  Math.random().toString(36).substring(2) + Date.now().toString(36)
