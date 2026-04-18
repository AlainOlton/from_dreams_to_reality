import { Response } from 'express'

export const sendSuccess = (
  res:     Response,
  data:    unknown,
  message = 'Success',
  status   = 200
): Response =>
  res.status(status).json({ success: true, message, data })

export const sendError = (
  res:     Response,
  message = 'Something went wrong',
  status   = 500
): Response =>
  res.status(status).json({ success: false, message })

export const sendCreated = (
  res:  Response,
  data: unknown,
  message = 'Created successfully'
): Response => sendSuccess(res, data, message, 201)
