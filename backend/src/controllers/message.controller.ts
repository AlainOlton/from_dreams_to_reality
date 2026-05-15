import { Request, Response, NextFunction } from 'express'
import * as messageService from '@/services/message.service'
import { sendSuccess, sendCreated } from '@/utils/apiResponse'
import { io } from '@/server'

export const startConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await messageService.getOrCreateConversation(req.user!.id, req.body.recipientId)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await messageService.getConversations(req.user!.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getMessages = async (req: Request<{ conversationId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await messageService.getMessages(req.user!.id, req.params.conversationId)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const sendMessage = async (req: Request<{ conversationId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const attachmentUrl = (req.file as any)?.path
    const content = (req.body.content ?? '').trim()

    // Must have content or attachment
    if (!content && !attachmentUrl) {
      res.status(400).json({ success: false, message: 'Message must have content or an attachment' })
      return
    }

    const message = await messageService.sendMessage(
      req.user!.id,
      req.params.conversationId,
      content || '📎',   // fallback label for attachment-only messages
      attachmentUrl
    )

    // Emit real-time event to all participants in this room
    io.to(`conversation:${req.params.conversationId}`).emit('new_message', message)

    sendCreated(res, message, 'Message sent')
  } catch (err) { next(err) }
}
