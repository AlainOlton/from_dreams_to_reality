import { Router } from 'express'
import * as auth     from '@/controllers/auth.controller'
import { protect }   from '@/middleware/auth.middleware'
import { validate }  from '@/middleware/validate.middleware'
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '@/utils/validators'

const router = Router()

router.post('/register',        validateRegister,       validate, auth.register)
router.post('/login',           validateLogin,          validate, auth.login)
router.get( '/verify-email',                                      auth.verifyEmail)
router.post('/forgot-password', validateForgotPassword, validate, auth.forgotPassword)
router.post('/reset-password',  validateResetPassword,  validate, auth.resetPassword)
router.get( '/me',              protect,                          auth.getMe)

export default router
