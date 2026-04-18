import { Router } from 'express'
import * as auth from '@/controllers/auth.controller'
import { protect } from '@/middleware/auth.middleware'

const router = Router()

router.post('/register',        auth.register)
router.post('/login',           auth.login)
router.get( '/verify-email',    auth.verifyEmail)
router.post('/forgot-password', auth.forgotPassword)
router.post('/reset-password',  auth.resetPassword)
router.get( '/me',              protect, auth.getMe)

export default router
