import { Router } from 'express'
import * as message       from '@/controllers/message.controller'
import { protect }        from '@/middleware/auth.middleware'
import { validate }       from '@/middleware/validate.middleware'
import { uploadAttachment } from '@/middleware/upload.middleware'
import {
  validateSendMessage,
  validateStartConversation,
  validateUuidParam,
} from '@/utils/validators'

const router = Router()

router.get('/',
  protect,
  message.getConversations)

router.post('/start',
  protect,
  validateStartConversation, validate,
  message.startConversation)

router.get('/:conversationId',
  protect,
  validateUuidParam('conversationId'), validate,
  message.getMessages)

router.post('/:conversationId',
  uploadAttachment.single('attachment'),
  protect,
  validateUuidParam('conversationId'), validateSendMessage, validate,
  message.sendMessage)

export default router
