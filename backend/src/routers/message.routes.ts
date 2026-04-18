import { Router } from 'express'
import * as message from '@/controllers/message.controller'
import { protect } from '@/middleware/auth.middleware'
import { uploadAttachment } from '@/middleware/upload.middleware'

const router = Router()

router.get( '/',                                                       protect, message.getConversations)
router.post('/start',                                                  protect, message.startConversation)
router.get( '/:conversationId',                                        protect, message.getMessages)
router.post('/:conversationId', uploadAttachment.single('attachment'), protect, message.sendMessage)

export default router
