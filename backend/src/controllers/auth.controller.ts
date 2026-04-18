import { Request, Response, NextFunction } from 'express'
import * as authService from '@/services/auth.service'
import { sendSuccess, sendCreated, sendError } from '@/utils/apiResponse'
import { RegisterBody, LoginBody } from '@/types/auth.types'

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body)
    sendCreated(res, result, 'Registration successful. Please verify your email.')
  } catch (err) {
    next(err)
  }
}

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body)
    sendSuccess(res, result, 'Login successful')
  } catch (err) {
    next(err)
  }
}

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.verifyEmail(req.query.token as string)
    sendSuccess(res, null, 'Email verified successfully')
  } catch (err) {
    next(err)
  }
}

export const forgotPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.forgotPassword(req.body.email)
    sendSuccess(res, null, 'If that email exists, a reset link has been sent')
  } catch (err) {
    next(err)
  }
}

export const resetPassword = async (
  req: Request<{}, {}, { token: string; password: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.resetPassword(req.body.token, req.body.password)
    sendSuccess(res, null, 'Password reset successfully')
  } catch (err) {
    next(err)
  }
}

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!.id)
    sendSuccess(res, user)
  } catch (err) {
    next(err)
  }
}
